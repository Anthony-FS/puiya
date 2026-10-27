# AWS setup (one time, about 20 minutes)

After this, every merge into `dev` deploys the staging backend automatically. Nobody stores AWS
keys: GitHub gets a short-lived login from AWS for each deploy, and only from the `dev` and
`main` branches of this repo.

Everything here stays inside the AWS always-free allowances (ADR 0003), except CDK's small S3
bucket for Lambda code, which costs well under US$0.01 a month. A budget alert emails you at the
first cent of spend.

## 1. Create the AWS account

1. Sign up at <https://aws.amazon.com/free>. Choose the **Free plan** for now.
2. Turn on multi-factor authentication for the root user (IAM → Security credentials).
3. Before the Free plan's 6 months end, switch to the **Paid plan** (Billing → Plans). AWS
   closes Free-plan accounts at 6 months; the always-free allowances continue on the Paid plan.

## 2. Give yourself a day-to-day login

Don't use the root user for this. In the AWS console:

1. Open **IAM Identity Center** and enable it (choose the Singapore region, `ap-southeast-1`).
2. Create a user for yourself and a permission set with `AdministratorAccess`.
3. Assign that permission set to your user for this account.
4. Note the **AWS access portal URL** it shows (looks like `https://d-xxxxxxxxxx.awsapps.com/start`).

## 3. Install the tools on your computer

- AWS CLI v2: <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>
- Node.js 22 and pnpm are already set up from the repo's CONTRIBUTING.md.

Then sign in (a browser window opens; approve it):

```bash
aws configure sso --profile puiya
#   SSO start URL: the access portal URL from step 2
#   SSO region:    ap-southeast-1
#   Default region for the profile: ap-southeast-1
aws sso login --profile puiya
aws sts get-caller-identity --profile puiya   # shows your account number
```

## 4. Prepare the account for CDK, and create the deploy role and budget

From the repo root, on an up-to-date `dev`:

```bash
pnpm install
cd infra

# Once per account and region: creates the roles and the small bucket CDK deploys through.
pnpm exec cdk bootstrap --profile puiya aws://<ACCOUNT_NUMBER>/ap-southeast-1

# The GitHub deploy role and the US$1 budget alert. Use the email you want alerts at.
pnpm exec cdk deploy PuiyaAccount --profile puiya -c alertEmail=you@example.com
```

The last command prints `PuiyaAccount.DeployRoleArn = arn:aws:iam::...:role/puiya-github-deploy`.
AWS also emails you to confirm the budget alert address; click the link.

## 5. Tell GitHub about the role

On GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**

- Name: `AWS_DEPLOY_ROLE_ARN`
- Value: the `DeployRoleArn` from step 4

Then **Settings → Environments → New environment** named `staging` (no rules needed yet).

## 6. Run the first deploy

On GitHub: **Actions → Deploy → Run workflow** on `dev`. When it finishes, its last step prints
the staging health URL and a response like:

```json
{ "status": "ok", "service": "puiya-api", "stage": "staging", "time": "2026-10-27T09:30:00.000Z" }
```

From then on, every merge into `dev` redeploys staging.

## If something goes wrong

- `cdk bootstrap` says the region is not enabled: check the region is `ap-southeast-1`.
- The deploy workflow is skipped: the `AWS_DEPLOY_ROLE_ARN` variable is missing or misspelled.
- `Not authorized to perform sts:AssumeRoleWithWebIdentity`: the workflow ran from a branch other
  than `dev` or `main`, or the repo name differs from `Anthony-FS/puiya`.
- You get a budget email: open Billing → Bills to see which service charged, and tell Claude.
