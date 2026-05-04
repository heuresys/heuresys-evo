# Documentation — heuresys-evo

Entry point per la documentazione del progetto. Lo schema canonical è
**Diátaxis numbered + meta** (vedi `_meta/doc-architecture.md` per il decision
tree completo).

## Schema canonical

```
docs/
├── README.md              # questo file
├── CONTRIBUTING.md        # workflow contribuzione + ADR process
├── _meta/                 # governance, doc-architecture, glossary
├── 10-strategy/           # vision, business strategy, migration approach
├── 20-architecture/       # patterns, topology, schemi (HOW IT WORKS)
├── 30-developer/          # how-to per chi sviluppa (TASKS)
├── 40-operations/         # ops + runbooks (PLAYBOOKS)
├── 50-reference/          # API spec, ADR, data dict (REFERENCE)
├── 70-planning/           # roadmap forward-looking
└── 90-archive/            # snapshot/audit/closure (READ-ONLY)
```

> **Nota S11**: alcune dir legacy (`architecture/`, `strategy/`, `runbooks/`,
> `guides/`, `cutover/`, `hardening/`, `audits/`, `migration/`,
> `test-coverage/`) saranno consolidate in S11 doc consolidation. Vedi
> `_meta/doc-architecture.md` per la migration table.

## Decision tree (compatto)

| Domanda                                                 | Path                                                  |
| ------------------------------------------------------- | ----------------------------------------------------- |
| Decisione architetturale (alternatives + consequences)? | `50-reference/decisions/NNNN-slug.md`                 |
| Come funziona (pattern, topology, schema)?              | `20-architecture/<topic>.md`                          |
| How-to per sviluppatori?                                | `30-developer/<task>.md`                              |
| Operational playbook?                                   | `40-operations/<area>.md` o `40-operations/runbooks/` |
| Strategia / vision / business?                          | `10-strategy/<topic>.md`                              |
| Roadmap forward-looking?                                | `70-planning/<plan>.md`                               |
| Glossary / API spec / data dict?                        | `50-reference/<type>/`                                |
| Snapshot storico / audit closure?                       | `90-archive/<dir>/`                                   |
| Meta-doc (governance, architecture-of-docs)?            | `_meta/`                                              |

Vedi `_meta/doc-architecture.md` per la versione estesa con esempi.

## Naming convention

- Sempre `kebab-case.md` — no SCREAMING_SNAKE_CASE, no PascalCase, no snake_case
- ADR: `NNNN-kebab-slug.md` (numerazione zero-padded a 4 cifre)
- README per ogni subdir top-level (`docs/<dir>/README.md`)

## Riferimenti chiave

| Doc                          | Path                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| Doc architecture (canonical) | [`_meta/doc-architecture.md`](_meta/doc-architecture.md)                           |
| Governance del progetto      | [`_meta/governance-evo.md`](_meta/governance-evo.md)                               |
| ADR index                    | [`decisions/README.md`](decisions/README.md) (post-S11: `50-reference/decisions/`) |
| Contributing workflow        | [`CONTRIBUTING.md`](CONTRIBUTING.md)                                               |
| Glossary                     | [`glossary.md`](glossary.md) (post-S11: `_meta/glossary.md`)                       |

## Per chi onboarda

1. Leggi [`CLAUDE.md`](../CLAUDE.md) (root) per mission + stack
2. Leggi [`_meta/governance-evo.md`](_meta/governance-evo.md)
3. Leggi [`_meta/doc-architecture.md`](_meta/doc-architecture.md) per orientarti nella docs/
4. Vai a [`30-developer/onboarding.md`](30-developer/) (post-S11) per il dev setup
