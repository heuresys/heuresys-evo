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

| ADR                                                        | Title                                                                         | Status                | Date                                                      |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------- | --------------------------------------------------------- |
| [0001](0001-postgresql-bare-metal.md)                      | PostgreSQL bare-metal (no container) per il database principale               | Accepted              | 2026-04-27                                                |
| [0002](0002-database-testing-strategy-ci.md)               | Strategia di testing database in CI — testcontainers-node                     | Proposed              | 2026-04-27                                                |
| [0003](0003-auth-nextauth-v5-prisma.md)                    | Strategia auth/2FA — NextAuth v5 (Auth.js) + Prisma Adapter                   | ⚠️ Superseded by 0009 | 2026-04-27                                                |
| [0004](0004-bucket-as-db-git-workflow.md)                  | Bucket-as-DB-git workflow + schema unification                                | Accepted              | 2026-04-29                                                |
| [0005](0005-github-mirror-private.md)                      | GitHub mirror privato come backup, non workflow                               | ⚠️ Superseded by 0019 | 2026-05-01                                                |
| [0006](0006-monorepo-boundary.md)                          | Monorepo boundary — services + packages                                       | Accepted              | 2026-05-01                                                |
| [0007](0007-auth-dual-system.md)                           | Auth dual-system (NextAuth v4 in app + @auth/express in api-gateway)          | Accepted              | 2026-05-01                                                |
| [0008](0008-multi-tenant-rls-evo.md)                       | Multi-tenant RLS pattern (Prisma + Postgres SET app.current_tenant_id)        | Accepted              | 2026-05-01                                                |
| [0009](0009-stack-version-strategy.md)                     | Stack version strategy (B1 hardening)                                         | Accepted              | 2026-05-01                                                |
| [0010](0010-rls-coverage-strategy.md)                      | RLS coverage strategy + targets                                               | Accepted              | 2026-05-01                                                |
| [0011](0011-test-coverage-strategy.md)                     | Test coverage strategy + targets                                              | Accepted              | 2026-05-01                                                |
| [0012](0012-security-baseline.md)                          | Security baseline (B4)                                                        | Accepted              | 2026-05-01                                                |
| [0013](0013-observability-strategy.md)                     | Observability strategy (B5)                                                   | Accepted              | 2026-05-01                                                |
| [0014](0014-design-system-architecture.md)                 | Design system architecture (Radix + CVA + Tailwind 4 tokens)                  | Accepted              | 2026-05-01                                                |
| [0015](0015-services-lifecycle-policy.md)                  | Services lifecycle policy                                                     | Accepted              | 2026-05-01                                                |
| [0016](0016-cicd-strategy.md)                              | CI/CD strategy (B10)                                                          | Accepted              | 2026-05-01                                                |
| [0017](0017-design-system-v2-extended.md)                  | Design system v2.0-extended (Cantiere B Extension Plan)                       | Accepted              | 2026-05-01                                                |
| [0018](0018-governance-audit-trail.md)                     | Governance Audit Trail Strategy                                               | Accepted              | 2026-05-01                                                |
| [0019](0019-repo-visibility-flip-and-branch-protection.md) | Repository visibility flip (private → public) + branch protection enforcement | Accepted              | 2026-05-04 (S9-S10)                                       |
| [0020](0020-tenant-ontology-versioning.md)                 | Tenant Ontology Versioning                                                    | Accepted              | 2026-05-01 (renumbered S10 from 0017 to resolve conflict) |
