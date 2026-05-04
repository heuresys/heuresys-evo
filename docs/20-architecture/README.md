# 20-architecture — patterns, topology, schemi

HOW-IT-WORKS documentation: come funzionano i componenti del sistema, le interazioni, i pattern.

## File index

| Doc                                                                | Scope                                                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [`overview.md`](overview.md)                                       | Service topology + component graph + data flow + cross-cutting concerns                       |
| [`api-versioning-strategy.md`](api-versioning-strategy.md)         | Strategia versioning per API Gateway (Express 5)                                              |
| [`auth-nestjs-pattern.md`](auth-nestjs-pattern.md)                 | Auth pattern condiviso (NB: nome legacy "nestjs", stack reale **Express 5**; rename pendente) |
| [`cutover-strategy-evo.md`](cutover-strategy-evo.md)               | Strategia cutover legacy → evo                                                                |
| [`knowledge-graph-esco.md`](knowledge-graph-esco.md)               | KG ESCO: cardinality, ingest pipeline, query patterns                                         |
| [`monorepo-workspace-strategy.md`](monorepo-workspace-strategy.md) | npm workspaces strategy (no Turborepo)                                                        |
| [`nestjs-module-conventions.md`](nestjs-module-conventions.md)     | Module conventions (NB: nome legacy, stack reale **Express 5**; rename pendente)              |
| [`prisma-data-access-pattern.md`](prisma-data-access-pattern.md)   | Prisma client usage pattern, $queryRaw, transactions                                          |
| [`rls-with-prisma-pattern.md`](rls-with-prisma-pattern.md)         | RLS pattern: SET app.current_tenant_id + Prisma transaction                                   |

## When to add here

Use the decision tree in [`../_meta/doc-architecture.md`](../_meta/doc-architecture.md) Q2: "La doc descrive come funziona un componente / pattern?".

Per **decisioni** architetturali: vedi [`../decisions/`](../decisions/) (post-S11: `../50-reference/decisions/`).
Per **how-to** sviluppatori: vedi [`../30-developer/`](../30-developer/).

## See also

- [`../decisions/0001-postgresql-bare-metal.md`](../decisions/0001-postgresql-bare-metal.md) — DB choice
- [`../decisions/0006-monorepo-boundary.md`](../decisions/0006-monorepo-boundary.md) — Monorepo boundary
- [`../decisions/0008-multi-tenant-rls-evo.md`](../decisions/0008-multi-tenant-rls-evo.md) — Multi-tenant RLS
