import { CfnOutput, Duration, Stack, type StackProps } from 'aws-cdk-lib'
import { CfnBudget } from 'aws-cdk-lib/aws-budgets'
import {
  CfnOIDCProvider,
  Effect,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam'
import type { Construct } from 'constructs'

export type AccountStackProps = StackProps & {
  /** `owner/repo` on GitHub. */
  githubRepo: string
  /** Branches allowed to deploy. */
  deployBranches: readonly string[]
  /** Region the stage stacks deploy to (where `cdk bootstrap` created its roles). */
  appRegion: string
  /** Where the budget alert emails go. Passed at deploy time, never committed. */
  alertEmail: string
}

const GITHUB_OIDC = 'token.actions.githubusercontent.com'

/**
 * One-off, account-wide setup, deployed once by the owner with their own AWS login:
 * - lets GitHub Actions deploy without stored AWS keys (short-lived OIDC credentials);
 * - emails the owner as soon as the account is charged anything.
 */
export class AccountStack extends Stack {
  constructor(scope: Construct, id: string, props: AccountStackProps) {
    super(scope, id, props)
    const { githubRepo, deployBranches, appRegion, alertEmail } = props

    if (!/^[\w.-]+\/[\w.-]+$/.test(githubRepo)) {
      throw new Error(`githubRepo must be owner/repo, got "${githubRepo}"`)
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) {
      throw new Error('alertEmail must be an email address')
    }
    if (deployBranches.length === 0) {
      throw new Error('deployBranches must name at least one branch')
    }

    const provider = new CfnOIDCProvider(this, 'GithubOidc', {
      url: `https://${GITHUB_OIDC}`,
      clientIdList: ['sts.amazonaws.com'],
    })

    const role = new Role(this, 'GithubDeployRole', {
      roleName: 'puiya-github-deploy',
      description: `Assumed by GitHub Actions in ${githubRepo} to run cdk deploy`,
      maxSessionDuration: Duration.hours(1),
      assumedBy: new WebIdentityPrincipal(provider.attrArn, {
        StringEquals: { [`${GITHUB_OIDC}:aud`]: 'sts.amazonaws.com' },
        StringLike: {
          [`${GITHUB_OIDC}:sub`]: deployBranches.map(
            (b) => `repo:${githubRepo}:ref:refs/heads/${b}`,
          ),
        },
      }),
    })

    // Only the roles `cdk bootstrap` created; those roles hold the actual deploy permissions.
    role.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: [
          `arn:${this.partition}:iam::${this.account}:role/cdk-hnb659fds-*-role-${this.account}-${appRegion}`,
        ],
      }),
    )

    new CfnBudget(this, 'MonthlyBudget', {
      budget: {
        budgetName: 'puiya-monthly',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: 1, unit: 'USD' },
        // Count spend before credits: on the Free plan, credits would otherwise hide charges
        // outside the always-free allowances until the credits ran out.
        costTypes: { includeCredit: false, includeRefund: false },
      },
      notificationsWithSubscribers: [
        // Any real charge at all (1% of $1 = one cent): something left the free tier.
        {
          notification: {
            notificationType: 'ACTUAL',
            comparisonOperator: 'GREATER_THAN',
            threshold: 1,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [{ subscriptionType: 'EMAIL', address: alertEmail }],
        },
        {
          notification: {
            notificationType: 'FORECASTED',
            comparisonOperator: 'GREATER_THAN',
            threshold: 100,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [{ subscriptionType: 'EMAIL', address: alertEmail }],
        },
      ],
    })

    new CfnOutput(this, 'DeployRoleArn', {
      value: role.roleArn,
      description: 'Set as the GitHub repository variable AWS_DEPLOY_ROLE_ARN',
    })
  }
}
