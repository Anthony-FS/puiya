# Puiya project plan

Live status (the single record of progress): **Puiya Project Plan tracker** —
https://claude.ai/artifact/GY5kch2BLnf5H7XfZUghSP

This file holds the plan itself: phases, exit criteria and deliverables. Statuses live only in
the tracker so they never disagree. Change the plan here by pull request, then update the
tracker to match.

Puiya is a hobby project, so there is no separate discovery phase: building starts straight
after Foundation, and the pilot is where real shops first try it.

## How agents use this plan

- Before starting work, find the deliverable it belongs to (e.g. `P2-07`) and name it in the
  branch, plan and PR: `feat/p2-07-checkout`, PR title `feat(mobile): offline checkout (P2-07)`.
- When work starts, set the deliverable to _In progress_ in the tracker; when its PR merges
  into `dev`, set it to _Done_. Set _Blocked_ with the reason in the PR or chat.
- Work that fits no deliverable needs the owner's OK and a new row here first.

## Phases

| Phase                                       | Window                    | Done when                                                                                                                                    |
| ------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0 Foundation**                           | 27 Oct 2026 – 15 Nov 2026 | Repo on GitHub with protected main and dev, CI green, Claude can open PRs, developer accounts ready.                                         |
| **P2 MVP build**                            | 1 Nov 2026 – 28 Feb 2027  | A shop can sell offline, track stock and credit, print or LINE a receipt, and sync without losses, tested on a low-end Android phone.        |
| **P3 Compliance features**                  | 1 Mar 2027 – 31 Mar 2027  | Every fertiliser, pesticide and seed sale is checked against Department of Agriculture registrations, with an inspection-ready sales record. |
| **P4 Pilot**                                | 1 Apr 2027 – 30 Jun 2027  | 20+ shops weekly active for 8 weeks, at least 70% of their sales recorded in the app, no lost-sale bugs open.                                |
| **P5 Web dashboard and distributor portal** | 1 Jul 2027 – 31 Aug 2027  | Owners use web reports, and at least 1 distributor takes reorders through Puiya.                                                             |
| **P6 Data product**                         | 1 Sep 2027 – 30 Nov 2027  | First paid sell-out data contract signed, with anonymisation and legal review complete.                                                      |
| **P7 Scale**                                | 1 Dec 2027 – 31 Mar 2028  | 3+ provinces live and a repeatable onboarding and sales process.                                                                             |
| **BL Business, legal and funding**          | 1 Nov 2026 – 30 Sep 2027  | Company registered, privacy terms reviewed by a lawyer, budget and funding route in place before the pilot.                                  |

## P0 — Foundation

_27 Oct 2026 – 15 Nov 2026._ Repository, working rules, tooling and accounts in place so building can start safely.

**Done when:** Repo on GitHub with protected main and dev, CI green, Claude can open PRs, developer accounts ready.

| ID    | Deliverable                                                                                                                                                                                                           | Owner   | Due         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- |
| P0-01 | **Working rules and agent agreement** — CLAUDE.md, CONTRIBUTING.md, ADRs 0001-0002, dev/main branch model.                                                                                                            | Claude  | 27 Oct 2026 |
| P0-02 | **Monorepo tooling** — pnpm workspaces, Turborepo, Biome, TypeScript strict, lefthook, commitlint, CI, Dependabot.                                                                                                    | Claude  | 27 Oct 2026 |
| P0-03 | **Shared package** — Satang money, Buddhist-era dates, Thai mobile numbers, product and sale schemas, 44 tests.                                                                                                       | Claude  | 27 Oct 2026 |
| P0-04 | **Project plan and progress tracker** — This page, plus docs/PROJECT_PLAN.md in the repo.                                                                                                                             | Claude  | 27 Oct 2026 |
| P0-05 | **Push first commit; create main and dev branches** — Extract the .github/.vscode zip, commit, push main, then create and push dev.                                                                                   | Anthony | 31 Oct 2026 |
| P0-06 | **Link GitHub to Claude** — claude.ai Settings → Connectors → GitHub, with access to Anthony-FS/puiya.                                                                                                                | Anthony | 31 Oct 2026 |
| P0-07 | **Protect main and dev; make dev the default branch** — Require a pull request and passing CI on both branches.                                                                                                       | Anthony | 31 Oct 2026 |
| P0-08 | **Developer accounts** — Expo and LINE Developers done. Still to do: AWS account with a US$1 budget alert (move to the Paid plan before the 6-month Free plan ends). Sentry later. Google Play on hold (sign-up fee). | Anthony | 15 Nov 2026 |

## P2 — MVP build

_1 Nov 2026 – 28 Feb 2027._ Offline point of sale with stock and farmer credit, synced to the server.

**Done when:** A shop can sell offline, track stock and credit, print or LINE a receipt, and sync without losses, tested on a low-end Android phone.

| ID    | Deliverable                                                                                                                                                             | Owner   | Due         |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- |
| P2-01 | **Design tokens and Thai type system** — packages/ui: colours, spacing, 18px+ body text, 48dp targets, Thai fonts.                                                      | Claude  | 10 Dec 2026 |
| P2-02 | **Mobile app scaffold** — Expo, Thai-first i18n, navigation, Android-first build.                                                                                       | Claude  | 10 Dec 2026 |
| P2-03 | **API and data model** — Lambda handlers and DynamoDB tables: shops, products, sales, stock movements, credit; farmer personal data in its own table (ADR 0003).        | Claude  | 20 Dec 2026 |
| P2-04 | **Offline storage and sync** — expo-sqlite and an outbox on the phone, a sync Lambda for push and pull, append-only records, always-visible sync status, offline tests. | Claude  | 31 Jan 2027 |
| P2-05 | **Sign-in** — LINE Login through a Cognito custom sign-in flow; prove LINE users count as direct sign-ins (free up to 10,000).                                          | Claude  | 10 Jan 2027 |
| P2-06 | **Product catalogue and barcode scanning** — Camera and Bluetooth scanners; photo-and-search for items without barcodes.                                                | Claude  | 25 Jan 2027 |
| P2-07 | **Checkout** — Offline sale with cash, PromptPay and credit payment.                                                                                                    | Claude  | 5 Feb 2027  |
| P2-08 | **Stock in and out** — Receiving, adjustments, low-stock alerts.                                                                                                        | Claude  | 10 Feb 2027 |
| P2-09 | **Farmer credit ledger** — Balances, repayments, harvest-time reminders.                                                                                                | Claude  | 15 Feb 2027 |
| P2-10 | **Receipts** — Bluetooth thermal printing and receipts sent over LINE.                                                                                                  | Claude  | 20 Feb 2027 |
| P2-11 | **Staging environment** — AWS CDK staging stack in ap-southeast-7, deployed from dev by CI; synthetic data only.                                                        | Claude  | 31 Jan 2027 |
| P2-12 | **Thai copy review and approval** — All app wording reviewed by Anthony.                                                                                                | Anthony | 25 Feb 2027 |
| P2-13 | **Low-end Android and offline test pass** — Maestro end-to-end tests; manual test on a 2–3 GB RAM phone.                                                                | Both    | 28 Feb 2027 |

## P3 — Compliance features

_1 Mar 2027 – 31 Mar 2027._ The legality check that gives shops a reason to switch.

**Done when:** Every fertiliser, pesticide and seed sale is checked against Department of Agriculture registrations, with an inspection-ready sales record.

| ID    | Deliverable                                                                                                                                                            | Owner   | Due         |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- |
| P3-06 | **Get access to Department of Agriculture registration data** — Ask DOA for the product registry or a data partnership; Claude drafts the letter. Needed before P3-01. | Both    | 15 Feb 2027 |
| P3-01 | **Registration catalogue import** — Load DOA product registrations and keep them updated.                                                                              | Claude  | 10 Mar 2027 |
| P3-02 | **Legality check at the till** — Warn or block unregistered, expired or banned products.                                                                               | Claude  | 20 Mar 2027 |
| P3-03 | **Hazardous-substance sales record** — Inspection-ready report of regulated product sales.                                                                             | Claude  | 25 Mar 2027 |
| P3-04 | **Expiry tracking and alerts** — Batch expiry dates and reminders before stock goes out of date.                                                                       | Claude  | 25 Mar 2027 |
| P3-05 | **Expert review of compliance rules** — Check the rules with an agronomist or DOA contact.                                                                             | Anthony | 31 Mar 2027 |

## P4 — Pilot

_1 Apr 2027 – 30 Jun 2027._ Run Puiya in 20 to 50 real shops in one province.

**Done when:** 20+ shops weekly active for 8 weeks, at least 70% of their sales recorded in the app, no lost-sale bugs open.

| ID    | Deliverable                                                                                                                                              | Owner   | Due         |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- |
| P4-09 | **Choose the pilot province** — Based on shop density, travel access and contacts.                                                                       | Anthony | 15 Mar 2027 |
| P4-01 | **Privacy notice and consent flow (PDPA)** — Thai notice, recorded consent, data-subject requests process.                                               | Both    | 5 Apr 2027  |
| P4-02 | **Production environment** — Production CDK stack, backup decision, CloudWatch alarms, Sentry with personal data scrubbed; AWS account on the Paid plan. | Claude  | 5 Apr 2027  |
| P4-03 | **Pilot install via APK** — Expo EAS internal-distribution APKs installed directly on shop phones; Google Play waits. Release v0.1.0 from dev to main.   | Both    | 10 Apr 2027 |
| P4-04 | **Onboarding kit** — Thai quick guide, short video, LINE Official Account for support.                                                                   | Both    | 10 Apr 2027 |
| P4-05 | **Onboard 20–50 pilot shops** — In the chosen province, with in-person setup.                                                                            | Anthony | 15 May 2027 |
| P4-06 | **Pilot metrics** — Weekly active shops, share of sales scanned, sync errors.                                                                            | Claude  | 20 Apr 2027 |
| P4-07 | **Weekly feedback and fixes** — Collect feedback, ship fixes, release v0.x updates.                                                                      | Both    | 30 Jun 2027 |
| P4-08 | **Pilot review and v1.0 scope** — Results against the exit criteria; decide what goes into v1.0.                                                         | Anthony | 30 Jun 2027 |

## P5 — Web dashboard and distributor portal

_1 Jul 2027 – 31 Aug 2027._ Reports for shop owners and reordering for distributors.

**Done when:** Owners use web reports, and at least 1 distributor takes reorders through Puiya.

| ID    | Deliverable                                                                      | Owner   | Due         |
| ----- | -------------------------------------------------------------------------------- | ------- | ----------- |
| P5-01 | **Web app scaffold and sign-in** — Next.js dashboard sharing schemas and tokens. | Claude  | 15 Jul 2027 |
| P5-02 | **Owner reports** — Sales, stock and credit reports for shop owners.             | Claude  | 5 Aug 2027  |
| P5-03 | **Distributor reorder portal** — Shops reorder from distributors in a few taps.  | Claude  | 25 Aug 2027 |
| P5-04 | **Onboard 1–2 distributors** — Distributors serving the pilot shops.             | Anthony | 31 Aug 2027 |

## P6 — Data product

_1 Sep 2027 – 30 Nov 2027._ Turn anonymised sell-out data into revenue.

**Done when:** First paid sell-out data contract signed, with anonymisation and legal review complete.

| ID    | Deliverable                                                                                                                                 | Owner   | Due         |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- |
| P6-01 | **Analytics pipeline** — DynamoDB Streams into a separate analytics store, never the live tables; stay within free allowances or ask first. | Claude  | 20 Sep 2027 |
| P6-02 | **Anonymisation and minimum group size** — No figure built from fewer than 5 shops; no farmer identities.                                   | Claude  | 30 Sep 2027 |
| P6-03 | **Data protection impact assessment and legal review** — Lawyer review of data sales and buyer contract terms.                              | Anthony | 15 Oct 2027 |
| P6-04 | **Sell-out report v1** — Product × district × week, for input companies.                                                                    | Claude  | 31 Oct 2027 |
| P6-05 | **Pest-outbreak signal prototype** — Spikes in specific products by area as an early warning.                                               | Claude  | 15 Nov 2027 |
| P6-06 | **First paying data customer** — Signed contract with an input company.                                                                     | Anthony | 30 Nov 2027 |

## P7 — Scale

_1 Dec 2027 – 31 Mar 2028._ More provinces, shop subscriptions and lending partnerships.

**Done when:** 3+ provinces live and a repeatable onboarding and sales process.

| ID    | Deliverable                                                                      | Owner   | Due         |
| ----- | -------------------------------------------------------------------------------- | ------- | ----------- |
| P7-01 | **Expand to 3+ provinces** — Repeatable onboarding with local partners.          | Anthony | 28 Feb 2028 |
| P7-02 | **Shop subscription plans** — Paid tier via PromptPay; free core stays free.     | Both    | 31 Jan 2028 |
| P7-03 | **Lending partnership** — Consent-based credit histories with BAAC or a fintech. | Anthony | 31 Mar 2028 |

## BL — Business, legal and funding

_1 Nov 2026 – 30 Sep 2027._ The company, legal and money work that runs alongside the build.

**Done when:** Company registered, privacy terms reviewed by a lawyer, budget and funding route in place before the pilot.

| ID    | Deliverable                                                                                                                           | Owner   | Due         |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------- |
| BL-01 | **Register the company** — Thai company limited, or the structure an accountant recommends.                                           | Anthony | 31 Jan 2027 |
| BL-02 | **Trademark check and filing for Puiya** — Search the DIP register and file in Thailand.                                              | Anthony | 31 Jan 2027 |
| BL-03 | **Privacy policy and terms of service** — Thai and English, reviewed by a lawyer before the pilot.                                    | Anthony | 15 Mar 2027 |
| BL-04 | **Budget and runway plan** — AWS should stay free; budget the Google Play fee, test phones, travel and legal costs through the pilot. | Both    | 15 Dec 2026 |
| BL-05 | **Grants and funding research** — depa, NIA and other Thai startup programmes; shortlist with deadlines.                              | Claude  | 15 Dec 2026 |
| BL-06 | **Fundraising or grant application** — Apply once pilot data exists.                                                                  | Anthony | 30 Sep 2027 |
