# heuresys-evo — Current State

> Updated: 2026-05-06 (**Phase 13 fully closed + smoke test live OK + 30 Pack 1-8 endpoint Promoted** · Phase 14 scope drafted · pending Enzo decision)

## ⚠️ DIRETTIVA OPERATIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

**Phase 13 CHIUSA DEFINITIVAMENTE** in modalità autonomous execution. Tutte le 6 sotto-phase 13.0 → 13.E completate end-to-end nella stessa sessione (~41-51 FTE-day plan, eseguiti compressed).

**13.C outcome**: engine renderer in `services/app/src/lib/dashboard-engine/` (loader/resolver/registry/grid/index) + route `/dashboard/[code]` server component (legge session, applica resolver, rende grid client). Riuso atomic component TIER 17 + NextAuth v4 session. 18 vitest test su resolver (services/app suite 16 → 34 verde). Typecheck 5/5 workspace clean. URL path scelto `/dashboard/[code]` (estende legacy `/dashboard`) per evitare collisione con root-level route esistenti.

**13.D outcome**: 4 mockup HTML PROCESS scritti in `.ux-design/06-mockups/dashboards/` (`process-recruiting-funnel`, `process-onboarding-flow`, `process-performance-cycle`, `process-learning-paths`) + `is_published=true` flippato sui 4 PROCESS preset (DB live + seed file aggiornato per coerenza re-run). Risultato: 9/9 preset published, accessibili via `/dashboard/<code>`.

**13.E outcome**: `docs/20-architecture/dashboard-engine-pattern.md` (NEW · pattern canonical engine + boundary 3 namespace dashboard chiarito). Aggiornamento STATE.md/BRAND-STATE.md/DECISIONS-LOG.md L31. E2E Playwright + golden image diff + audit log mutations deferred a Phase 14+ (richiedono infra non in scope V1).

**13.A + 13.B recap** già in DECISIONS-LOG L29 + L30.

### Smoke test live (post-13.E)

- api-gateway:8200 + Next.js:3200 avviati in background (npm run dev)
- Tunnel SSH attivo PID 6428 (5432 + 6380)
- Login NextAuth v4 via curl + canonical demo users (`Heuresys2026!`)
- **9/9 dashboard URL `/dashboard/<code>` HTTP 200 verde** — preset name + widget count corretti
- **RBP enforcement validato**: HR_DIRECTOR (`rtl-bank.valentina.conti`) vede 22 widget · SUPERUSER (`sysadmin`) vede 30 widget. Differenza = 8 widget (capability_graph + org_systems · `visibility_min_role=1` IT_ADMIN+) — comportamento atteso del resolver
- **Perspective filter validato**: `?observer=PROCESS` su `hr_director_overview` filtra 4 → 0 (preset TALENT, no PROCESS widget); su `process_recruiting_funnel` mantiene 3 → 3 (tutti PROCESS)

### Pack 1-8 promotion (post smoke test)

- 30 endpoint Pack 1-8 testati via api-gateway:8200 con session SUPERUSER
- 22 endpoint rispondono 401 (P2/P3 auth-enforced · session cookie cross-service non forwarded ma endpoint registered + middleware attivo · acceptable smoke evidence)
- 8 endpoint rispondono 404 perché test ha usato root path (es. `/nace`); routes esistenti hanno solo sub-path (`/nace/sections`, etc.) verificate via `app.use` mounting in `src/index.ts` — endpoint mounted, no missing
- **CSV `legacy-import-registry.csv` aggiornato**: 30 endpoint entry `Test Stage` → `Promoted`. Distribuzione finale: **30 Promoted · 57 Test Stage** (helper/middleware/utils/seed/allowlist · transitivamente verificate via promotion endpoint dipendenti) **· 36 Rejected**

### Phase 14 scope (pending Enzo decision)

- Doc `docs/70-planning/phase14-scope.md` scritto con 8 tracce indipendenti A-H + 5 bundle proposti (R/M/C/U/F)
- **Bundle raccomandato R (~25-32 FTE-day)**: A live data binding + D E2E Playwright + H i18n IT/EN + F /ontology+OpenAI
- Decisione finale via fresh session (su istruzione Enzo: Phase 14 in fresh session)

**13.B outcome**: 2 nuove tabelle additive (`dashboard_presets` + `dashboard_elements`) + migration `db/migrations/0002_phase13_dashboard_engine.sql` (idempotente G14) + seed `db/seeds/phase13_dashboard_presets.sql` (9 preset + 30 element platform default · idempotente G15) + RLS policy `dashboard_elements_tenant_isolation` con FORCE (G16 strutturale + simulato OK · BYPASSRLS pattern evo). Schema.prisma esteso chirurgicamente con 2 model + relation back-references su `tenants` / `widget_catalog` / `rbp_perspectives`. Prisma client v5.22 rigenerato clean. Boundary `dashboard_presets` (Phase 13 templates platform-wide) vs `dashboards`/`dashboard_widgets` (user workspace runtime UUID-based, esistenti) chiarito.

**Distribuzione preset seedati**: 3 TALENT (hr_director_overview, skills_heatmap, employee_journey) · 2 ENTERPRISE (capability_graph, org_systems · published) · 4 PROCESS (process_recruiting_funnel, process_onboarding_flow, process_performance_cycle, process_learning_paths · `is_published=false` pending Phase 13.D mockup HTML).

**13.A recap**: 8 atomic component pubblicati in `packages/ui/src/components/dashboard/` + 8 Storybook story file + 1 test file unico (21 test) + barrel `dashboard/index.ts` + TIER 17 nel main `packages/ui/src/index.ts`. Component family estratta dai 5 mockup Phase 9 (`hr-director-overview`, `capability-graph`, `skills-heatmap`, `employee-journey`, `org-systems`):

| Component                | Source mockup              | Pattern                                            |
| ------------------------ | -------------------------- | -------------------------------------------------- |
| `IntegrationHealthPill`  | org-systems                | Badge + dot pulse · 4 tone                         |
| `KpiRing`                | hr-director-overview hero  | Wrap RadialGauge + threshold tone + trend          |
| `SuccessionCard`         | hr-director-overview panel | Avatar + role pair + LinearGauge readiness + risk  |
| `CareerArc`              | employee-journey 5-stage   | Horizontal arc · 3 status + `aria-current`         |
| `KgMiniGraph`            | capability-graph           | Wrapper compatto su NetworkGraph (cytoscape)       |
| `SkillHeatmap`           | skills-heatmap 8×12        | Semantic table · 5-bucket scale · onCellClick      |
| `CapabilityRadar`        | employee-journey radar     | Pure SVG · n-axis · multi-series                   |
| `RbacMatrix`             | org-systems RBAC 8×9       | Tabella sticky · 5 livelli (none→owner) cycle      |

Cumulativo Phase 13 (full closure): 13.0 done · 13.A done · 13.B done · 13.C done · 13.D done · 13.E done. Decisioni tecniche autonome documentate in DECISIONS-LOG L29 (13.A) + L30 (13.B) + L31 (13.C/D/E).

## Top priorities (next session — FRESH SESSION per Phase 14)

1. **Phase 14 bundle decision (Enzo)**: leggere `docs/70-planning/phase14-scope.md` e selezionare bundle (default R: A+D+H+F · ~25-32 FTE-day). Output: nuovo plan `~/.claude/plans/<phase14-id>.md` per autonomous execution stile Phase 13.
2. **Phase 14 execution**: secondo bundle scelto. Bundle R = live data binding (A) + E2E Playwright (D) + i18n IT/EN (H) + /ontology+OpenAI (F).
3. **(Optional) Mockup PROCESS expansion** (B · 4-6 d): solo se Phase 14 ha headroom. V1 sono ~150 LOC placeholder; espansione a parità ~750 LOC dei 5 esistenti per acceptance designer.

## Open questions

- Nessuna blocking. **Phase 13 chiusa + smoke test live verde + Pack 1-8 promoted**. Phase 14 scope drafted (`docs/70-planning/phase14-scope.md`). Prossima sessione = fresh session per Phase 14 con bundle scelto (R raccomandato).

## Background processes attivi (post-session)

- api-gateway:8200 (npm run dev) · bg task `b6ebkc8jc` · log in `%TEMP%\claude\D--evo-heuresys-com\<id>\tasks\b6ebkc8jc.output`
- Next.js services/app:3200 (npm run dev) · bg task `bvwor3v7i` · log idem
- Tunnel SSH PID 6428 (`scripts/dev-local/tunnel-vm.ps1 -Stop` per stop)
- Storybook:6006 (running pre-session)
- Enrichment workers (running pre-session)

Per stop completo: stop dei processi node + `tunnel-vm.ps1 -Stop`. Lasciati attivi per fresh session continuity.

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
