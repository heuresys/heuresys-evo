# 90-archive — historical snapshots, closures, abandoned paradigms

READ-ONLY documentation. Files in questa directory rappresentano stato congelato a una data specifica o approcci esplicitamente abbandonati. Mantenuti per:

1. **Memoria istituzionale**: capire come si è arrivati allo stato corrente
2. **Audit trail**: snapshot per compliance e re-validation
3. **Reference cross-session**: paradigm cancellati che rimangono spiegati per non re-introdurli per errore

## Subdirectories

| Dir                                                    | Date                  | Contenuto                                                                                                                                                                                                                                              |
| ------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`cutover-event-paradigm/`](cutover-event-paradigm/)   | 2026-05-01            | Pre-cutover checklist, RTO rollback procedure, user comms template — **paradigm abbandonato** post-S5 in favore della migration PET-driven (vedi [`../10-strategy/migration-strategy-pet-driven.md`](../10-strategy/migration-strategy-pet-driven.md)) |
| [`hardening/`](hardening/)                             | 2026-05-01            | RTGB Cantiere B closure report, session-2026-05-01-closure, README — **fase chiusa** S6                                                                                                                                                                |
| [`audits/`](audits/)                                   | 2026-05-01            | Frontend-strategy-brief, parity-audit-2026-05-01 — snapshot audit puntuali                                                                                                                                                                             |
| [`test-coverage-baselines/`](test-coverage-baselines/) | 2026-05-01            | Baseline test coverage — snapshot RTGB B3                                                                                                                                                                                                              |
| [`migration-bootstrap/`](migration-bootstrap/)         | 2026-05-01–2026-05-02 | DBMS bootstrap strategy + cookbook (post db pull baseline) — **bootstrap concluso**, workflow operativo corrente in [`../30-developer/prisma-migration-workflow.md`](../30-developer/prisma-migration-workflow.md)                                     |

## Convention per file in 90-archive

Ogni file qui dentro DEVE avere uno dei seguenti header:

- `> **Status**: Historical snapshot YYYY-MM-DD.` per snapshot puntuali
- `> **Status**: Superseded by: <link>` per paradigm abbandonati con replacement
- `> **Status**: Closure report — phase X complete YYYY-MM-DD` per closure report

Se manca, va aggiunto post-move.

## Rules

1. **READ-ONLY by default**: non modificare file qui dentro a meno che sia per aggiungere supersession header o fix typo storici
2. **No new content here**: nuova doc va nelle dir attive (10-strategy, 20-architecture, 30-developer, 40-operations, 50-reference, 70-planning, \_meta)
3. **Linking**: file qui possono essere referenziati come storia/audit, ma non come "current SoT"

## Quando spostare qui

Use the decision tree in [`../_meta/doc-architecture.md`](../_meta/doc-architecture.md) Q8: "La doc è storica (snapshot, audit closure)?".

Workflow tipico:

1. Doc diventa stale o paradigm sostituito
2. Aggiungere supersession header al file in place
3. Move in `90-archive/<topic>/` (preserve git history via git mv)
4. Update link nei file che la referenziavano (PR #C bulk fix)
5. Eventuale nota in PROJECT-LOG entry della session che ha effettuato il move
