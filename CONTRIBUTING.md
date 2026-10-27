# Contributing to Puiya

This repo is built by a product owner working with AI agents. The full rules live in
[CLAUDE.md](./CLAUDE.md); this file is the short version for humans.

## Setup

Requirements: Node.js 22+, Git, and Corepack (ships with Node).

```bash
corepack enable
pnpm install
pnpm check
```

`pnpm install` also installs the git hooks (lefthook): Biome runs on staged files before each
commit, and commit messages are checked against Conventional Commits.

> **Windows + OneDrive note:** OneDrive syncing `node_modules` is slow and can lock files.
> Either pause OneDrive while installing, mark `node_modules` "Always keep on this device", or keep
> the working copy outside OneDrive (for example `C:\dev\puiya`). Git on GitHub is the backup.

## Workflow

`main` holds releases only and stays clean. All work goes into `dev` first.

1. Start from an up-to-date `dev`:
   `git switch dev && git pull && git switch -c feat/credit-ledger`
2. Commit with Conventional Commits: `feat(mobile): add credit ledger screen`.
3. Run `pnpm check`.
4. Push and open a pull request **into `dev`**; fill in the template.
5. CI must pass. The owner reviews and squash-merges.

**Releasing:** when `dev` is ready, the owner opens a PR from `dev` to `main` titled
`chore(repo): release vX.Y.Z`, merges it with a merge commit, and tags `vX.Y.Z` on `main`.

**Urgent fix in production:** branch `hotfix/…` from `main`, PR into `main`, then merge `main`
back into `dev` immediately.

## Commit types

| Type       | Use for                              |
| ---------- | ------------------------------------ |
| `feat`     | A new user-facing feature            |
| `fix`      | A bug fix                            |
| `refactor` | Code change with no behaviour change |
| `test`     | Adding or fixing tests               |
| `docs`     | Documentation only                   |
| `chore`    | Tooling, config, housekeeping        |
| `ci`       | CI pipeline changes                  |
| `perf`     | Performance improvements             |

## Architecture decisions

Significant choices are recorded in [`docs/adr/`](./docs/adr). To propose one, copy the latest
ADR, number it next, and open a PR.
