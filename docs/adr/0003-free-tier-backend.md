# 3. Forever-free AWS backend

- Status: accepted
- Date: 2026-10-27
- Supersedes: the offline sync, API, database, auth, hosting and payments rows of ADR 0002

## Context

Puiya is a hobby project, so it must cost nothing to run at hobby scale, indefinitely. ADR 0002
assumed PostgreSQL with a Fastify API on ECS Fargate and PowerSync, which cost money from day
one or once credits run out.

Since 15 July 2025, new AWS accounts no longer get a free year of RDS. They get $100–200 of
credits that expire after 6 months (Free plan) or 12 months (Paid plan). Only some services
stay free indefinitely. Checked on 27 Oct 2026:

| Service                   | Always-free allowance per month                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Lambda                    | 1 million requests, 400,000 GB-seconds                                                     |
| DynamoDB                  | 25 GB storage, 25 read and 25 write capacity units (provisioned), 2.5 million stream reads |
| Cognito (Lite/Essentials) | 10,000 monthly active users signing in directly; only 50 via SAML/OIDC federation          |
| SQS                       | 1 million requests                                                                         |
| EventBridge Scheduler     | 14 million invocations                                                                     |
| CloudWatch                | 5 GB logs, 10 custom metrics, 10 alarms, 3 dashboards                                      |
| Not always free           | RDS, API Gateway (12 months only), S3 and ECS (credits only)                               |

## Decision

| Concern        | Choice                                                                                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Region         | `ap-southeast-1` (Singapore). Bangkok (`ap-southeast-7`) was the first choice, but Lambda function URLs aren't available there (CloudFormation has no `AWS::Lambda::Url` in that region). Singapore has every service we use, needs no opt-in, and adds about 30 ms.                                                           |
| Database       | DynamoDB, provisioned capacity kept within 25 read / 25 write units                                                                                                                                                                                                                                                            |
| API            | Lambda functions (Node.js 22, TypeScript) behind Lambda function URLs; no API Gateway. The handler checks the Cognito token itself.                                                                                                                                                                                            |
| Offline sync   | Built in-house: the phone writes to SQLite (`expo-sqlite`) and an outbox; a sync Lambda accepts pushes and returns changes since the last sync. Sales, stock movements and credit entries are append-only records with phone-generated IDs, so they never conflict; product and price edits are last-writer-wins by timestamp. |
| Auth           | Cognito user pool with a custom sign-in flow: a Lambda trigger verifies the LINE ID token with LINE. Users count as direct sign-ins (10,000 free), not OIDC federation (50 free). Phone OTP dropped: SMS costs money.                                                                                                          |
| Personal data  | Farmer names and phone numbers in their own DynamoDB table, reachable only through the API and always scoped to the signed-in user's shop                                                                                                                                                                                      |
| Scheduled jobs | EventBridge Scheduler + Lambda (DOA catalogue refresh, credit reminders)                                                                                                                                                                                                                                                       |
| Infrastructure | AWS CDK in TypeScript (`infra/`), one stack per stage: `staging` and `prod`                                                                                                                                                                                                                                                    |
| Cost guardrail | AWS Budgets alert at US$1 per month, emailed to the owner                                                                                                                                                                                                                                                                      |
| Mobile builds  | Expo EAS free plan; pilot builds installed directly as APKs (internal distribution). Google Play waits until the sign-up fee is worth it.                                                                                                                                                                                      |
| Web dashboard  | Hosting decided in P5                                                                                                                                                                                                                                                                                                          |
| Payments       | Deferred until shop subscriptions (P7)                                                                                                                                                                                                                                                                                         |
| Errors         | Sentry free plan, added when the app first runs on real devices                                                                                                                                                                                                                                                                |

Unchanged from ADR 0002: TypeScript, pnpm + Turborepo, Expo, Next.js, Zod schemas in
`packages/shared`, Biome, Vitest/Maestro/Playwright.

## Consequences

- Running cost stays at zero within the allowances above. The account must move to the AWS Paid
  plan (a card on file) before the 6-month Free plan ends, or AWS closes it; always-free
  allowances continue on the Paid plan and the budget alert catches anything beyond them.
- No PostgreSQL means no SQL joins or row-level security. Access rules live in the Lambda code
  and need tests, and reports are built from DynamoDB queries or a later export (P6).
- Building our own sync adds about 2–3 weeks to P2. That fits inside P2's window because the
  phase now starts on 1 Nov 2026.
- 25 read/write units handle a small pilot comfortably but not heavy bulk imports; the DOA
  catalogue import runs slowly overnight.
- The sync index is a local secondary index. It needs no capacity of its own, but each write
  that touches it also uses the table's write units (roughly halving write throughput), it caps
  each shop's data at 10 GB, and it can't be removed without recreating the table.
- The server, not the phone, sets `updatedAt` when it accepts a write. A phone with a wrong
  clock could otherwise write behind another device's sync cursor, and that change would never
  be pulled.
- Backups beyond what DynamoDB keeps by default cost money; decide before real shop data
  arrives (P4-02).
- The Cognito custom-flow approach to LINE sign-in must be proven in P2-05. If those users are
  billed as federated, switch to verifying LINE tokens in the API Lambda and issuing our own
  tokens.
