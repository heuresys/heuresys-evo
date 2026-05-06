# Legacy backend mining log — Phase 13.0

> **Append-only audit trail** del forensic import dal repo legacy `D:\enzospenuso\Documents\GitHub\heuresys.com.evo` verso `D:\evo.heuresys.com`.
>
> **Scope**: 8 pack di endpoint backend (route + query + business rules + zod schema). NIENTE UI legacy (rifatta in Phase 13.A→13.D).
>
> **Plan ref**: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` § Phase 13.0
>
> **Started**: 2026-05-06 04:59 GMT+2

## Setup verificato pre-bootstrap

| Item | Stato | Note |
|---|---|---|
| Tunnel SSH `oracle-vm-default` 5432 (Postgres) | ✅ active | PID 19720 · forward `5432:localhost:5432` |
| Tunnel SSH `oracle-vm-default` 6380 (Redis) | ✅ active | forward `6380:localhost:6379` (fix mismatch script) |
| API Gateway `:8200` | ✅ running | bind `::` dual-stack · `/health` 200 OK |
| Next.js app `:3200` | ✅ running | bind `0.0.0.0` · LAN visible su `192.168.1.8:3200` |
| Storybook `:6006` | ✅ running | bind `0.0.0.0` · LAN visible · 9.1.20 |
| Enrichment workers | ✅ running | Redis VM connected · `redis://:***@localhost:6380` |
| `npm run typecheck --workspaces` | ✅ verde | 5 workspace clean (gate pre-bootstrap) |

## Pack progress

| Pack | Domain | Endpoint legacy | Status | Commit | Note |
|---|---|---|---|---|---|
| 1 | HR core | /employees · /tenants · /users · /roles · /org-units · /workforce | ⏳ pending | — | dashboard target: hr-director-overview · employee-journey |
| 2 | ESCO + Skill taxonomy | /esco · /skill-taxonomy · /ontology · /onet · /nace · /skills · /skill-analytics · /skill-assessments | ⏳ pending | — | capability-graph · skills-heatmap |
| 3 | Career intelligence | /career-paths · /career-intelligence · /gap-analysis · /talent-intelligence · /succession | ⏳ pending | — | hr-director-overview · employee-journey |
| 4 | Performance | /performance-reviews · /360-reviews · /calibration-sessions · /merit-cycles · /okrs · /goals | ⏳ pending | — | process-performance-cycle |
| 5 | Recruiting | /candidates · /job-postings · /requisitions · /interviews · /offers | ⏳ pending | — | process-recruiting-funnel |
| 6 | Learning | /courses · /learning-paths · /enrollments · /certifications · /training-recommendations | ⏳ pending | — | process-learning-paths |
| 7 | Onboarding / Time-off | /onboarding · /leave · /time-off · /attendance | ⏳ pending | — | process-onboarding-flow |
| 8 | RBP / Audit / Org-systems | /rbp · /audit-logs · /workspace · /platform | ⏳ pending | — | org-systems |

## Skip register (decisioni di esclusione)

> Append-only. Format: `endpoint · model mancante · motivo skip · workaround/follow-up`.

(vuoto · da popolare durante mining)

## Schema migrations applied (gap resolved)

> Append-only. Format: `migration_name · model · pack origine · timestamp`.

(vuoto · da popolare durante mining)

## Cascade dependencies (skip che forzano altri skip)

> Append-only. Format: `endpoint A skip → endpoint B impacted (motivo)`.

(vuoto · da popolare durante mining)

## Test coverage delta

| Snapshot | Workspace | Test count | Note |
|---|---|---|---|
| Pre-Phase 13.0 baseline | services/api-gateway | TBD | rilevare prima del Pack 1 |

## Risks tracker

| Rischio (plan ref) | Probabilità | Mitigazione attiva |
|---|---|---|
| 0a Schema gap massivo (>50% endpoint pack) | media | audit pre-flight 1h per pack prima di adapt |
| 0b Stack break Prisma legacy | bassa-media | Prisma evo è 5.22 · verificare features preview |
| 0c Skip cascading | bassa | mining log obbligatorio · cascade tracker append-only |
| 0d Effort overshoot (>20 FTE-day) | media | hard cap 20 FTE-day · fallback partial import |

## Riferimenti

- Plan completo: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md`
- Project state: [`STATE.md`](STATE.md)
- BRAND-STATE: [`../.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md)
- DECISIONS-LOG: [`../.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md)
- Promotion candidates: [`../.ux-design/08-promotion/promotion-candidates.md`](../.ux-design/08-promotion/promotion-candidates.md)
- Repo legacy source: `D:\enzospenuso\Documents\GitHub\heuresys.com.evo`
- Schema target evo: `D:\evo.heuresys.com\services\app\prisma\schema.prisma` (994 KB · 566 model)
