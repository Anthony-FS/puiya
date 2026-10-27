# 1. Record architecture decisions

- Status: accepted
- Date: 2026-10-27

## Context

Puiya is built by a product owner working with AI agents across many sessions. Agents start
without memory of earlier sessions, so decisions must be written down where they will be read.

## Decision

Record significant architectural decisions as short numbered Markdown files in `docs/adr/`,
using the format: Status, Date, Context, Decision, Consequences. Agents read the ADRs before
changing anything they cover. An ADR is changed only by a new ADR that supersedes it.

## Consequences

Decisions survive between sessions and contributors. Changing direction needs a written reason.
