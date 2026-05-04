# \_meta — governance & doc self-reference

META-level documentation: come funziona il progetto e la documentazione stessa.

## File index

| Doc                                                | Scope                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`doc-architecture.md`](doc-architecture.md)       | Canonical SoT per la struttura `docs/` (decision tree, naming, migration table) |
| [`doc-placement-rules.md`](doc-placement-rules.md) | Machine-readable companion per agent assistant (pattern → target path)          |
| [`governance-evo.md`](governance-evo.md)           | Decisioni progetto, ownership, review process, compliance status                |
| [`glossary.md`](glossary.md)                       | Terminologia di dominio (ADR, RBP, RLS, PET, Cantiere, ecc.)                    |
| [`migration-doc-audit.md`](migration-doc-audit.md) | Snapshot audit doc structure pre-S11 (storico)                                  |

## When to add here

Use the decision tree in [`doc-architecture.md`](doc-architecture.md) Q9: "La doc è meta-doc (governance, doc-architecture, glossary)?".

**NON** mettere qui: ADR (vanno in `../50-reference/decisions/`), strategia (`../10-strategy/`), how-to dev (`../30-developer/`).

## See also

- [`../README.md`](../README.md) — entry point + decision tree compatto
- [`../50-reference/decisions/README.md`](../50-reference/decisions/README.md) — ADR template + index
- [`../../CLAUDE.md`](../../CLAUDE.md) — project root: mission, stack, P1-P10
