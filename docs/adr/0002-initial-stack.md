# 2. Initial technology stack

- Status: accepted; offline sync, API, database, auth, hosting and payments superseded by ADR 0003
- Date: 2026-10-27

## Context

Users are farm-input shop owners across rural Thailand: patchy mobile internet, low-cost
Android phones, often older and less tech-savvy, and almost universally on LINE. The business
depends on reliable sales records (offline included) and on selling aggregated data that must
be anonymised under Thailand's PDPA. The team is small, so one language across the stack helps.

## Decision

| Concern                    | Choice                                                                  |
| -------------------------- | ----------------------------------------------------------------------- |
| Language                   | TypeScript (strict) everywhere                                          |
| Monorepo                   | pnpm workspaces + Turborepo                                             |
| Mobile                     | React Native with Expo, Android-first                                   |
| Offline sync               | PowerSync over PostgreSQL (fallback: WatermelonDB)                      |
| Web                        | Next.js                                                                 |
| API                        | Node.js with Fastify                                                    |
| Database                   | PostgreSQL, migrations with Drizzle                                     |
| Validation                 | Zod schemas shared from `packages/shared`                               |
| Auth                       | LINE Login, phone OTP fallback                                          |
| Farmer touchpoint          | LINE Messaging API + LIFF (no farmer app install)                       |
| Payments                   | PromptPay QR via a Thai gateway (Opn, 2C2P or GB Prime Pay — to decide) |
| Hosting                    | AWS ap-southeast-7 (Bangkok), containers on ECS Fargate                 |
| Analytics / data product   | CDC → ClickHouse or BigQuery → dbt → Metabase, isolated from the app DB |
| Lint/format                | Biome                                                                   |
| Tests                      | Vitest (unit/API), Maestro (mobile E2E), Playwright (web E2E)           |
| Errors / product analytics | Sentry, PostHog (with PII scrubbing)                                    |

## Consequences

- One language lets a small team and agents move across mobile, web and API.
- Offline-first adds complexity (conflict resolution) but is required for rural shops.
- PowerSync is a paid dependency at scale; revisit cost before the pilot grows past ~500 shops.
- Payment gateway and analytics warehouse are deliberately left open until needed.
