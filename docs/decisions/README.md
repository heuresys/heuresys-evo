# Architecture Decision Records

## What is an ADR?

A short document capturing a single architectural decision. Each ADR records:
- **Context** — what problem we're addressing
- **Decision** — what we chose
- **Alternatives** — what we considered and rejected
- **Consequences** — what this implies, both good and bad

## When to write one

Write an ADR when you make a decision that:
- Is hard to reverse, or has long-term implications
- Future contributors will reasonably ask "why did we do it this way?"
- Trades off between options where the loser might come back later
- Establishes a pattern that will be applied repeatedly

Skip ADRs for trivial choices, taste-level preferences, or things easily changed.

## Template

Copy this template into a new file `NNNN-short-title.md` (zero-padded number, kebab-case title):

```markdown
# ADR-NNNN: <Title>

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
**Date**: YYYY-MM-DD
**Authors**: <names>

## Context
<What's the situation? What forces are at play?>

## Decision
<What did we decide?>

## Alternatives considered
- **<Option A>** — <summary>; rejected because <reason>
- **<Option B>** — <summary>; rejected because <reason>

## Consequences
- Positive: <expected good outcomes>
- Negative: <known trade-offs>
- Follow-ups: <work this implies>
```

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-postgresql-bare-metal.md) | PostgreSQL bare-metal (no container) per il database principale | Accepted | 2026-04-27 |
| [0002](0002-database-testing-strategy-ci.md) | Strategia di testing database in CI — testcontainers-node | Proposed | 2026-04-27 |
| [0003](0003-auth-nextauth-v5-prisma.md) | Strategia auth/2FA — NextAuth v5 (Auth.js) + Prisma Adapter | Accepted | 2026-04-27 |
| [0004](0004-bucket-as-db-git-workflow.md) | Bucket-as-DB-git workflow + schema unification (PC SoT primario, OCI bucket come "git del database") | Accepted | 2026-04-29 |
