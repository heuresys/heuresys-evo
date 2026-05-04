# Documentation Architecture — heuresys-evo

> **Status**: Canonical SoT for documentation organization
> **Date**: 2026-05-04 (S11 doc consolidation Phase A)
> **Successor of**: ad-hoc multi-schema layout (S0-S10) where `docs/architecture/` (flat) coexisted with `docs/20-architecture/` (numbered) plus `docs/strategy/` (SCREAMING_SNAKE) plus `docs/runbooks/` + `docs/40-operations/` (overlapping operational), causing placement ambiguity.

## Schema: Diátaxis numbered + meta

heuresys-evo adotta una variante numbered del framework [Diátaxis](https://diataxis.fr/), che separa la documentazione in 4 quadranti basati su user intent (learning, working, understanding, looking-up). Numbering zero-padded a 2 cifre garantisce un ordering visuale stabile + path predicibile.

```
docs/
│
├── README.md                       # entry point + decision tree compatto
├── CONTRIBUTING.md                 # contribuzione: workflow, ADR process
│
├── _meta/                          # governance & doc-self-reference (pre-numerati)
│   ├── governance-evo.md           # decisioni progetto, ownership, review process
│   ├── doc-architecture.md         # questo file (canonical SoT)
│   ├── glossary.md                 # terminologia di dominio
│   └── doc-audit-log/              # snapshot storici degli audit doc
│
├── 10-strategy/                    # WHY — vision, business, migration approach
│   ├── heuresys-vision.md
│   ├── migration-strategy-pet-driven.md
│   ├── theoretical-foundations.md
│   ├── competitive-landscape.md
│   └── external-frameworks-reference.md
│
├── 20-architecture/                # HOW IT WORKS — patterns, topology, schema
│   ├── overview.md                 # high-level system overview
│   ├── api-versioning-strategy.md
│   ├── auth-pattern.md             # ex: auth-nestjs-pattern (rename in S11)
│   ├── monorepo-workspace-strategy.md
│   ├── module-conventions.md       # ex: nestjs-module-conventions (rename)
│   ├── prisma-data-access-pattern.md
│   ├── rls-with-prisma-pattern.md
│   ├── knowledge-graph-esco.md
│   └── cutover-strategy-evo.md
│
├── 30-developer/                   # TASKS — how-to per sviluppatori
│   ├── onboarding.md               # dev setup, primo build, first PR
│   ├── prisma-migration-workflow.md
│   ├── nextjs-app-router-conventions.md
│   ├── typescript-strict-evo.md
│   ├── dto-validation-with-zod-or-class-validator.md
│   ├── feature-parity-tracking.md
│   ├── rbp-data-model.md
│   └── security-baseline.md        # consolidazione di security.md/.claude rules
│
├── 40-operations/                  # PLAYBOOKS — ops, runbooks, incident response
│   ├── deploy-evo.md
│   ├── db-management-evo.md
│   ├── observability-evo.md        # ex: observability-nestjs (rename)
│   ├── incident-runbook-evo.md
│   └── runbooks/                   # scenario-specific scripts
│       ├── db-reset.md
│       ├── rollback.md
│       └── storybook-deploy.md
│
├── 50-reference/                   # LOOKUP — API, ADR, data dict
│   ├── api/                        # OpenAPI, GraphQL schema, ecc.
│   └── decisions/                  # ADR archive
│       ├── README.md               # template + index
│       └── NNNN-*.md
│
├── 70-planning/                    # FORWARD-LOOKING — roadmap, parity
│   └── pet-migration-roadmap.md
│
└── 90-archive/                     # READ-ONLY — snapshot, closures, paradigms abandoned
    ├── README.md                   # what's in here, why
    ├── hardening/
    ├── audits/
    ├── test-coverage-baselines/
    ├── cutover-event-paradigm/     # paradigm abbandonato post-PET-driven
    └── migration-bootstrap/
```

## Decision tree (esteso) — dove va una nuova doc

### Q1 — La doc descrive una **decisione** architetturale?

> "Abbiamo scelto X invece di Y/Z perché..."

**Path**: `50-reference/decisions/NNNN-slug.md`
**Format**: ADR template (Status, Context, Decision, Alternatives, Consequences, References)
**Example**: `0021-branch-protection-rebalanced.md`

### Q2 — La doc descrive **come funziona** un componente / pattern?

> "Il sistema usa pattern X. Ecco la topology, lo schema, le interazioni."

**Path**: `20-architecture/<topic>.md`
**Naming**: kebab-case, descriptive (es. `auth-pattern.md`, `prisma-data-access-pattern.md`)
**Example**: `monorepo-workspace-strategy.md`

### Q3 — La doc è un **how-to** per chi sviluppa?

> "Per fare X, segui questi step..."

**Path**: `30-developer/<task>.md`
**Naming**: kebab-case, action-oriented
**Example**: `prisma-migration-workflow.md`, `dto-validation-with-zod-or-class-validator.md`

### Q4 — La doc è un **operational playbook**?

> "Quando succede X in prod, fai Y. Sequenza esatta."

**Path**: `40-operations/<area>.md` per playbook generali, `40-operations/runbooks/<scenario>.md` per scenari specifici
**Naming**: scenario-oriented
**Example**: `incident-runbook-evo.md`, `runbooks/db-reset.md`

### Q5 — La doc è **strategia / vision / business**?

> "L'obiettivo a 12-24 mesi è X. La motivazione è Y."

**Path**: `10-strategy/<topic>.md`
**Naming**: kebab-case
**Example**: `migration-strategy-pet-driven.md`, `heuresys-vision.md`

### Q6 — La doc è una **roadmap forward-looking**?

> "Q1 faremo X, Q2 Y, gating su Z."

**Path**: `70-planning/<plan>.md`
**Example**: `pet-migration-roadmap.md`

### Q7 — La doc è **glossary / API spec / data dictionary**?

> "Term X = definition Y. Endpoint Z = schema W."

**Path**: `50-reference/<type>/`

- Glossary: `_meta/glossary.md` (eccezione: glossary è meta, non reference)
- API spec: `50-reference/api/openapi.yaml`
- Data dict: `50-reference/data-dictionary/<schema>.md`

### Q8 — La doc è **storica** (snapshot, audit closure)?

> "Snapshot dello stato a YYYY-MM-DD. Read-only."

**Path**: `90-archive/<topic>/<file>.md`
**Naming**: include date nel filename quando rilevante (es. `parity-audit-2026-05-01.md`)
**Note**: ogni file in 90-archive ha header `> **Status**: Historical snapshot YYYY-MM-DD`

### Q9 — La doc è **meta-doc** (governance, architecture-of-docs, glossary)?

> "Come funziona il progetto/la docs stessa."

**Path**: `_meta/`
**Example**: `governance-evo.md`, `doc-architecture.md` (questo file), `glossary.md`

## Naming convention

- **Sempre** `kebab-case.md`
- **Mai** SCREAMING_SNAKE_CASE, PascalCase, snake_case
- ADR: `NNNN-kebab-slug.md` (zero-padded 4 cifre)
- Date nei filename: ISO 8601 (`YYYY-MM-DD`)
- README per ogni subdir top-level (`docs/<dir>/README.md`) per orientation

## Cross-linking convention

- Link relativi sempre (`[testo](../20-architecture/auth-pattern.md)`)
- Da CLAUDE.md root: link relativi (`docs/30-developer/...`)
- Da ADR: link relativi all'interno di `50-reference/decisions/` o assoluti dal repo root quando attraversa subdir multiple
- **MAI** link assoluti tipo `/home/...` o `D:\...`

## Migration table (S11 doc consolidation)

| Da (legacy)                                             | A (canonical)                                             | Rationale                       |
| ------------------------------------------------------- | --------------------------------------------------------- | ------------------------------- |
| `docs/architecture/overview.md`                         | `docs/20-architecture/overview.md`                        | Eliminare doppia SoT (P1)       |
| `docs/strategy/HEURESYS_VISION.md`                      | `docs/10-strategy/heuresys-vision.md`                     | Numbered + kebab-case           |
| `docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md`        | `docs/10-strategy/migration-strategy-pet-driven.md`       | idem                            |
| `docs/strategy/*.md` (5 file SCREAMING)                 | `docs/10-strategy/*.md` (kebab)                           | idem                            |
| `docs/runbooks/`                                        | `docs/40-operations/runbooks/`                            | Consolidate ops (P3)            |
| `docs/guides/onboarding.md`                             | `docs/30-developer/onboarding.md`                         | Dev how-to (P3)                 |
| `docs/guides/prisma-workflow.md`                        | merge in `docs/30-developer/prisma-migration-workflow.md` | Consolidate (P3)                |
| `docs/guides/security.md` + `.claude/rules/security.md` | merge in `docs/30-developer/security-baseline.md`         | Single SoT (P3)                 |
| `docs/glossary.md`                                      | `docs/_meta/glossary.md`                                  | Glossary è meta (P5)            |
| `docs/glossary/` (empty dir)                            | DELETE                                                    | Empty dir (P5)                  |
| `docs/api/` (empty dir)                                 | DELETE o popolare `50-reference/api/`                     | Empty dir (P5)                  |
| `docs/cutover/*`                                        | `docs/90-archive/cutover-event-paradigm/`                 | Paradigm abbandonato (P4)       |
| `docs/hardening/*`                                      | `docs/90-archive/hardening/`                              | Closure docs (storico)          |
| `docs/audits/*`                                         | `docs/90-archive/audits/`                                 | Storico                         |
| `docs/test-coverage/*`                                  | `docs/90-archive/test-coverage-baselines/`                | Storico                         |
| `docs/migration/*`                                      | `docs/90-archive/migration-bootstrap/`                    | Bootstrap one-shot, ora storico |
| `docs/decisions/`                                       | `docs/50-reference/decisions/`                            | Reference material              |

## Process — quando aggiungere una nuova doc

1. **Identifica la categoria** usando il decision tree (Q1-Q9 sopra)
2. **Scegli il path** secondo lo schema canonical
3. **Verifica** che il filename sia kebab-case + descriptive
4. **Aggiungi cross-link** dal subdir README.md della categoria
5. **Se è una decisione architetturale**: incrementa il prossimo NNNN libero in `50-reference/decisions/`
6. **PR title**: `docs(repo): add <doc> in <category>` o specifico per area

## Process — quando deprecare / archiviare una doc

1. **Header esplicito** in cima al file: `> **Status**: Deprecated YYYY-MM-DD. Superseded by: <link>` o `> **Status**: Historical snapshot YYYY-MM-DD`
2. **Move** in `docs/90-archive/<topic>/` se è snapshot/audit chiusi
3. **Lascia in place + header** se è solo deprecation (link breaking è peggio del solo header)
4. **Update** `_meta/doc-audit-log/` con la decisione

## ADR vs questa doc

Una decisione che cambia la doc structure (es. nuovo numbered subdir) richiede:

- Nuovo ADR in `50-reference/decisions/NNNN-doc-structure-change.md`
- Update di questo file (`_meta/doc-architecture.md`)
- Update `docs/README.md`
- Migration table updated

## Riferimenti

- Plan S11 doc consolidation: `.handoff/S11-doc-consolidation-plan.md`
- ADR index: `50-reference/decisions/README.md`
- Audit pre-consolidation: `_meta/doc-audit-log/2026-05-04-pre-consolidation.md`
- Diátaxis framework: https://diataxis.fr/
