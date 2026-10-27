import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps, Tags } from 'aws-cdk-lib'
import { AttributeType, BillingMode, Table, TableEncryption } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import type { Construct } from 'constructs'
import { capacity, type Stage } from './free-tier.ts'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')
const apiSrc = path.join(repoRoot, 'apps/api/src')

// Must match apps/api/src/data/keys.ts.
const SYNC_INDEX = 'bySyncKey'

export type StageStackProps = StackProps & { stage: Stage }

/** Everything one stage (staging or prod) needs, sized to stay inside the AWS always-free tier. */
export class StageStack extends Stack {
  readonly mainTable: Table
  readonly peopleTable: Table

  constructor(scope: Construct, id: string, props: StageStackProps) {
    super(scope, id, props)
    const { stage } = props
    const isProd = stage === 'prod'
    // Staging holds synthetic data only and can be rebuilt; prod data must survive mistakes.
    const removalPolicy = isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY

    Tags.of(this).add('project', 'puiya')
    Tags.of(this).add('stage', stage)

    const makeTable = (name: 'main' | 'people') => {
      const table = new Table(this, name === 'main' ? 'MainTable' : 'PeopleTable', {
        tableName: `puiya-${stage}-${name}`,
        partitionKey: { name: 'pk', type: AttributeType.STRING },
        sortKey: { name: 'sk', type: AttributeType.STRING },
        billingMode: BillingMode.PROVISIONED,
        readCapacity: capacity[stage][name].read,
        writeCapacity: capacity[stage][name].write,
        // AWS-owned keys are free; customer-managed KMS keys are not.
        encryption: TableEncryption.DEFAULT,
        // Point-in-time recovery is billed per GB; the backup decision is P4-02.
        pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: false },
        deletionProtection: isProd,
        removalPolicy,
      })
      table.addLocalSecondaryIndex({
        indexName: SYNC_INDEX,
        sortKey: { name: 'syncKey', type: AttributeType.STRING },
      })
      return table
    }

    this.mainTable = makeTable('main')
    // Farmer names and phone numbers (PDPA) live apart from shop data.
    this.peopleTable = makeTable('people')

    const health = new NodejsFunction(this, 'HealthFunction', {
      functionName: `puiya-${stage}-health`,
      entry: path.join(apiSrc, 'handlers/health.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X,
      // Graviton is cheaper per GB-second, so the free 400,000 GB-seconds go further.
      architecture: Architecture.ARM_64,
      memorySize: 256,
      timeout: Duration.seconds(5),
      environment: { STAGE: stage },
      projectRoot: repoRoot,
      depsLockFilePath: path.join(repoRoot, 'pnpm-lock.yaml'),
      bundling: { format: OutputFormat.ESM, minify: true, sourceMap: false, target: 'node22' },
      logGroup: new LogGroup(this, 'HealthLogs', {
        logGroupName: `/aws/lambda/puiya-${stage}-health`,
        // CloudWatch Logs gives 5 GB free; short retention keeps us well under it.
        retention: RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY,
      }),
    })
    // Function URLs are part of Lambda's free tier; API Gateway is only free for 12 months.
    const healthUrl = health.addFunctionUrl({ authType: FunctionUrlAuthType.NONE })

    new CfnOutput(this, 'HealthUrl', { value: healthUrl.url })
    new CfnOutput(this, 'MainTableName', { value: this.mainTable.tableName })
    new CfnOutput(this, 'PeopleTableName', { value: this.peopleTable.tableName })
  }
}
