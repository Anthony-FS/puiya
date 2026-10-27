import { App, LegacyStackSynthesizer } from 'aws-cdk-lib'
import { AccountStack } from '../lib/account-stack.ts'
import { StageStack } from '../lib/stage-stack.ts'

const app = new App()

// ADR 0003 names Bangkok first, but Lambda function URLs aren't available there
// (CloudFormation has no AWS::Lambda::Url in ap-southeast-7), so we use the ADR's fallback.
const APP_REGION = app.node.tryGetContext('region') ?? 'ap-southeast-1'
const account = process.env.CDK_DEFAULT_ACCOUNT

new StageStack(app, 'PuiyaStaging', { stage: 'staging', env: { account, region: APP_REGION } })
new StageStack(app, 'PuiyaProd', { stage: 'prod', env: { account, region: APP_REGION } })

// Account setup is only synthesised when the owner deploys it with an alert email:
// `pnpm --filter @puiya/infra cdk deploy PuiyaAccount -c alertEmail=you@example.com`
const alertEmail: string | undefined = app.node.tryGetContext('alertEmail')
if (alertEmail) {
  new AccountStack(app, 'PuiyaAccount', {
    // Budgets and IAM are global; us-east-1 supports every resource here. The legacy
    // synthesizer sends the template straight to CloudFormation with the owner's own login,
    // so this stack needs no `cdk bootstrap` (and no CDK bucket) in us-east-1.
    env: { account, region: 'us-east-1' },
    synthesizer: new LegacyStackSynthesizer(),
    githubRepo: app.node.tryGetContext('githubRepo') ?? 'Anthony-FS/puiya',
    deployBranches: ['dev', 'main'],
    appRegion: APP_REGION,
    alertEmail,
  })
}
