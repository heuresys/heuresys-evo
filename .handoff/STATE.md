# heuresys-evo — Current State

> Updated: 2026-05-06 (Phase 13.0 CHIUSA · 8/8 pack closed · 28/46 endpoint ported)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 13.0 (Legacy backend mining) **CHIUSA DEFINITIVAMENTE** in single session continuativa: 8/8 pack closed (Pack 1+2 → Pack 3-8) · 28/46 endpoint ported (61%) · 18/46 Rejected con motivazione documentata (39%) · 337 test cumulativi (era 80 baseline) · suite api-gateway 430/430 verde · allowlist Prisma 9 → 47 model (+38). 12 commit Phase 13.0 totali pushati a `origin/main` (`5ba982f → <last>`). Razionale skip pattern coerente cross-pack: thin route wrapper su heavy service class (607-2000+ LOC) o dipendenze esterne (PostgreSQL custom functions, pgvector embeddings, OpenAI API, O*NET data files) richiedono session dedicata. Roadmap riapertura tracciata in registry + mining log.

## Top priorities (next session)

1. **Phase 13.A — Atomic dashboard components** (~5-7 FTE-day): UI layer build con Cantiere B + brand identity nuova. Plan ref `~/.claude/plans/credo-che-se-tu-jazzy-key.md` § Phase 13.A. Cantiere B in `packages/ui` ~180 component pronti.
2. **Pack riapertura focalizzata** (prerequisite Phase 13.A dashboard Tier 1):
   - `/skill-analytics` quando `skills-heatmap` dashboard FE serve dati
   - `/skill-taxonomy` quando `capability-graph` admin UI richiede classification CRUD
   - `/ontology` BLOCK 11+ con OpenAI integration (necessario per AI advisor)
3. **Pack 1-8 promotion** (~ad-hoc): smoke test live + acceptance Enzo per portare 28 entry da `Test Stage` → `PreOp Stage` → `Promoted`. Vedi [`legacy-import-registry.md`](legacy-import-registry.md) § Promotion checklist.

## Open questions

- Nessuna blocking. Phase 13.0 chiusa definitivamente. Phase 13.A è next architectural step.

## Environment dev (a fine sessione)

| Servizio | Porta LAN | Status |
|---|---|---|
| API Gateway | `192.168.1.8:8200` | ⚠️ DOWN (killed durante Pack 7 prisma refresh) — riavvia con `cd services/api-gateway && npm run dev` |
| Next.js | `192.168.1.8:3200` | running |
| Storybook | `192.168.1.8:6006` | running |
| Enrichment workers | n/a | running |
| Tunnel SSH | `5432` + `6380→VM:6379` | active (PID 19720) |

**Side-effects locali gitignored**: tunnel-vm.ps1 forward fix · `services/api-gateway/.env AUTH_TRUST_HOST=true` · `services/enrichment/.env REDIS_URL` con auth.

## Phase 13.0 scoreboard finale

| Pack | Domain | Endpoint ported | LOC legacy | Test | Skip motivation |
|---|---|---|---|---|---|
| 1 | HR core | 6/6 (roles, tenants, users, employees-extend, org-units, workforce-planning) | ~3500 | 112 | — |
| 2 | ESCO + Skill taxonomy | 4/8 (nace, skills, skill-assessments, esco-extend) | ~2000 (di 6000) | 75 | analytics+taxonomy+onet+ontology heavy service |
| 3 | Career intelligence | 2/5 (talent-intelligence, succession) | ~750 (di 4158) | 30 | career-paths+gap-analysis service · career-intelligence DB functions |
| 4 | Performance | 2/5 (reviews-360, merit-cycles) | ~750 (di 3611) | 24 | calibration+goals+okrs performanceManagementService 1474 LOC |
| 5 | Recruiting | 5/5 CRUD core (candidates, job-postings, requisitions, interviews, offers) | ~2300 | 45 | — (lifecycle business logic skip-deferred per scope) |
| 6 | Learning | 4/5 (courses, learning-paths, enrollments, certifications) | ~1820 (di 2250) | 23 | training-recommendations service |
| 7 | Onboarding/Time-off | 3/4 (attendance, time-off, tenant-onboarding) | ~1900 (di 3100) | 16 | leave deferred extension /leaves esistente |
| 8 | RBP/Audit/Org-systems | 2/4 (workspace, platform) | ~1900 (di 3250) | 12 | rbp interaction + audit-logs extension |
| **TOTALE** | **8 pack** | **28/46 (61%)** | **~14920** | **337** | **18 Rejected coerenti** |

## Verification

```bash
git status -sb                             # clean? in sync?
git log --oneline -15                      # ultimi commit Phase 13.0 closure
npm run typecheck --workspaces             # 5/5 verde
npm test --workspace=services/api-gateway  # 430/430 verde
cat .handoff/legacy-import-registry.csv | wc -l  # ~115 rows registry SoT
scripts/dev-local/tunnel-vm.ps1 -Status    # tunnel up?
cd services/api-gateway && npm run dev     # riavvia api-gateway down
```

## Riferimenti

- **Plan Phase 13**: `~/.claude/plans/credo-che-se-tu-jazzy-key.md`
- **Mining log Phase 13.0** (append-only audit trail): [`legacy-mining-log.md`](legacy-mining-log.md)
- **Import registry CSV (SoT)**: [`legacy-import-registry.csv`](legacy-import-registry.csv)
- **Import registry workflow**: [`legacy-import-registry.md`](legacy-import-registry.md)
- **Memoria globale regola import**: `~/.claude/projects/D--evo-heuresys-com/memory/feedback_legacy_import_registry.md`
- **CLAUDE.md root**: [`../CLAUDE.md`](../CLAUDE.md) § Legacy import workflow
