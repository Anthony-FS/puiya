import { App } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { describe, expect, it } from 'vitest'
import { AccountStack } from '../lib/account-stack.ts'
import { DYNAMODB_FREE_UNITS, totalUnits } from '../lib/free-tier.ts'
import { StageStack } from '../lib/stage-stack.ts'

const env = { account: '111111111111', region: 'ap-southeast-1' }

function stageTemplate(stage: 'staging' | 'prod') {
  const app = new App()
  return Template.fromStack(new StageStack(app, `Test-${stage}`, { stage, env }))
}

describe('free tier', () => {
  it('keeps all provisioned DynamoDB capacity, both stages together, within 25/25', () => {
    expect(totalUnits('read')).toBeLessThanOrEqual(DYNAMODB_FREE_UNITS)
    expect(totalUnits('write')).toBeLessThanOrEqual(DYNAMODB_FREE_UNITS)
  })

  it.each(['staging', 'prod'] as const)(
    '%s: tables are provisioned with no paid extras',
    (stage) => {
      const t = stageTemplate(stage)
      const tables = t.findResources('AWS::DynamoDB::Table')
      expect(Object.keys(tables)).toHaveLength(2)
      for (const { Properties: p } of Object.values(tables)) {
        expect(p.BillingMode).toBeUndefined() // provisioned is the CloudFormation default
        expect(p.PointInTimeRecoverySpecification).toEqual({ PointInTimeRecoveryEnabled: false })
        // AWS-owned key, no KMS key or charges.
        expect(p.SSESpecification?.KMSMasterKeyId).toBeUndefined()
        expect(p.SSESpecification?.SSEEnabled ?? false).toBe(false)
        expect(p.GlobalSecondaryIndexes).toBeUndefined() // a GSI would need its own capacity
      }
      t.resourceCountIs('AWS::ApplicationAutoScaling::ScalableTarget', 0)
    },
  )

  it('creates no API Gateway, NAT gateway or other paid networking', () => {
    const t = stageTemplate('staging')
    for (const type of [
      'AWS::ApiGateway::RestApi',
      'AWS::ApiGatewayV2::Api',
      'AWS::EC2::NatGateway',
      'AWS::EC2::VPC',
      'AWS::RDS::DBInstance',
    ]) {
      t.resourceCountIs(type, 0)
    }
  })

  it('keeps Lambda logs for one week only', () => {
    stageTemplate('staging').hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: '/aws/lambda/puiya-staging-health',
      RetentionInDays: 7,
    })
  })
})

describe('tables', () => {
  it('has a sync index on both tables', () => {
    const t = stageTemplate('staging')
    for (const name of ['puiya-staging-main', 'puiya-staging-people']) {
      t.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: name,
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },
          { AttributeName: 'sk', KeyType: 'RANGE' },
        ],
        LocalSecondaryIndexes: [
          Match.objectLike({
            IndexName: 'bySyncKey',
            KeySchema: [
              { AttributeName: 'pk', KeyType: 'HASH' },
              { AttributeName: 'syncKey', KeyType: 'RANGE' },
            ],
          }),
        ],
      })
    }
  })

  it('protects prod tables from deletion', () => {
    const t = stageTemplate('prod')
    const tables = t.findResources('AWS::DynamoDB::Table')
    for (const table of Object.values(tables)) {
      expect(table.DeletionPolicy).toBe('Retain')
      expect(table.Properties.DeletionProtectionEnabled).toBe(true)
    }
  })

  it('lets staging tables be removed with the stack', () => {
    const tables = stageTemplate('staging').findResources('AWS::DynamoDB::Table')
    for (const table of Object.values(tables)) {
      expect(table.DeletionPolicy).toBe('Delete')
    }
  })
})

describe('health function', () => {
  it('runs on Node 22 arm64 behind a function URL, with no access to the tables', () => {
    const t = stageTemplate('staging')
    t.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: 'puiya-staging-health',
      Runtime: 'nodejs22.x',
      Architectures: ['arm64'],
      Environment: { Variables: { STAGE: 'staging' } },
    })
    t.resourceCountIs('AWS::Lambda::Url', 1)
    const policies = JSON.stringify(t.findResources('AWS::IAM::Policy'))
    expect(policies).not.toContain('dynamodb:')
  })
})

describe('account stack', () => {
  const make = (overrides: Partial<ConstructorParameters<typeof AccountStack>[2]> = {}) => {
    const app = new App()
    return new AccountStack(app, 'TestAccount', {
      env: { account: '111111111111', region: 'us-east-1' },
      githubRepo: 'Anthony-FS/puiya',
      deployBranches: ['dev', 'main'],
      appRegion: 'ap-southeast-1',
      alertEmail: 'owner@example.com',
      ...overrides,
    })
  }

  it('lets only the dev and main branches of the repo assume the deploy role', () => {
    const t = Template.fromStack(make())
    t.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'puiya-github-deploy',
      MaxSessionDuration: 3600,
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Action: 'sts:AssumeRoleWithWebIdentity',
            Condition: {
              StringEquals: { 'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com' },
              StringLike: {
                'token.actions.githubusercontent.com:sub': [
                  'repo:Anthony-FS/puiya:ref:refs/heads/dev',
                  'repo:Anthony-FS/puiya:ref:refs/heads/main',
                ],
              },
            },
          }),
        ],
      },
    })
  })

  it('only allows assuming the CDK bootstrap roles in the app region', () => {
    const t = Template.fromStack(make())
    const policies = Object.values(t.findResources('AWS::IAM::Policy'))
    expect(policies).toHaveLength(1)
    const statements = policies[0]?.Properties.PolicyDocument.Statement
    expect(statements).toHaveLength(1)
    expect(statements[0].Action).toBe('sts:AssumeRole')
    expect(JSON.stringify(statements[0].Resource)).toContain(
      ':role/cdk-*-111111111111-ap-southeast-1',
    )
  })

  it('emails the owner on the first cent of spend and on a forecast over $1', () => {
    const t = Template.fromStack(make())
    t.hasResourceProperties('AWS::Budgets::Budget', {
      Budget: { BudgetLimit: { Amount: 1, Unit: 'USD' }, TimeUnit: 'MONTHLY', BudgetType: 'COST' },
      NotificationsWithSubscribers: [
        Match.objectLike({
          Notification: Match.objectLike({ NotificationType: 'ACTUAL', Threshold: 1 }),
          Subscribers: [{ SubscriptionType: 'EMAIL', Address: 'owner@example.com' }],
        }),
        Match.objectLike({
          Notification: Match.objectLike({ NotificationType: 'FORECASTED', Threshold: 100 }),
        }),
      ],
    })
  })

  it.each([
    [{ githubRepo: 'not a repo' }],
    [{ alertEmail: 'nope' }],
    [{ deployBranches: [] as string[] }],
  ])('rejects bad settings %j', (overrides) => {
    expect(() => make(overrides)).toThrow()
  })
})
