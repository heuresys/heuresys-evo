# heuresys-evo — Current State

> Updated: 2026-05-07 · Phase 14 Sprint 1 + 2.E + 2.F + 3.C + 3.G(foundation) shipped · 4 commit autonomous su main

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Autonomous run 4-batch (af91601 → 77dc441) chiude Phase 14 Bundle F end-to-end:

- **BATCH 1 — `feat(seed,dashboard,perf)`** · 32 canonical users (4 tenant × 8 ruoli, password unificata `Heuresys2026!` via `scripts/db/apply-canonical-users.mjs`) · soft-delete legacy `$2a$` duplicati (alice.esposito + alberto.colombo) · Playwright matrix 8×9 RTL Bank + 27 cross-tenant smoke + regression anchor = **100/100 verde** in 3.8min · `phase14c` migration: 8 dashboard_elements composite migrati da `static` → `sql` (RbacMatrix con join real `rbp_*`, altri 7 SQL static-via-SELECT) · autocannon prod perf P95 baseline (9/10 widget ≤ 500ms target, 1 outlier 604ms / page 597ms — officina pragma D5 acceptable).
- **BATCH 2 — `feat(ontology)`** · `/ontology` page RSC ESCO search + advisor panel · `/api/ontology/advisor` Next.js Route Handler con runtime fallback `503 advisor_unavailable` se `OPENAI_API_KEY` mancante · cost-tracker UTC-day bucket (default $5/day cap) · ADR-0022 + setup doc + vitest 9/9.
- **BATCH 3 — `feat(dashboard)`** · `/dashboard/[code]/edit` drag-resize editor (RBP gate TENANT_OWNER | HR_DIRECTOR | SUPERUSER) · `react-grid-layout/legacy` via `next/dynamic ssr:false` · `PUT /api/dashboard/[code]/elements` con `auditedDashboardMutation()` per element · fix `audit_logs.category='CONFIG'` (era `'dashboards'`, viola check constraint) · smoke E2E verde (PUT 200 + audit row scritto + DB updated + rollback) · vitest dashboard-editor 6/6 + dashboard-audit 12/12.
- **BATCH 4 — `feat(explorer)`** · 3 atomic UI in `packages/ui` (`ESCOTreeNavigator`, `KGGraphCanvas`, `SAPSyncPanel`) · 3 route `/explorer/{esco,sap,kg}` · 3 endpoint `/api/explorer/*` · doc `docs/20-architecture/tier2-explorer.md` con scope foundation vs follow-up.

## Top priorities (next session)

1. **Cytoscape upgrade for `KGGraphCanvas`** (~1-2 FTE-day) — preserve KGNode/KGEdge contract, add reactflow/cytoscape via dynamic ssr:false; 1-hop becomes proper graph render.
2. **RBP `requirePermission` extraction to shared module** (~0.5-1 FTE-day) — helper currently in services/api-gateway only; expose for /ontology + /explorer to gate reads with `ESCO_KG` and `TIER2_EXPLORER` areas.
3. **Tier 2 advanced (9-10 mockup mancanti)** (~5-8 FTE-day) — saved views, search bar, ESCO↔ISCO crosswalk, SAP infotype matrix, skill-cluster heatmap, certification gap, career-path simulator, role library.
4. **Page-render perf tune** (~1 FTE-day) — investigate Next.js SSR P95=597ms on `/dashboard/hr_director_overview`; add Cache-Control headers + reduce prefetch fan-out.
5. **OpenAI streaming + Redis cost tracker** (~1-2 FTE-day) — SSE response in OntologyAdvisor + swap in-memory cost bucket for Redis once horizontal scaling lands.

## Open questions

- D14.D: Cytoscape upgrade — preferenza tra `cytoscape` + `react-cytoscapejs` (mature, force-directed) vs `reactflow` (più moderno, drag-friendly)?
- D14.E: Sprint 3.G advanced scope — committare a tutti i 9-10 mockup o estrarre 3-4 priority surfaces e accelerare?

## Stack snapshot

| Layer       | Tech                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------- |
| API Gateway | Express 5 · 8200 · 30 endpoint Pack 1-8 mounted                                            |
| Frontend    | Next.js 16 · 3200 · `/dashboard/[code]` engine + edit mode + `/ontology` + `/explorer/*`  |
| UI Library  | `packages/ui` Cantiere B · TIER 17 atomic dashboard + ESCOTreeNavigator/KGGraphCanvas/SAPSyncPanel |
| DB          | Postgres 16 bare-metal · seed phase14a + phase14b + phase14c applied · 11 canonical users |
| Test        | Vitest 153/153 services/app · Playwright 100/100 RBP matrix · perf script (autocannon) ready |
| Audit       | `auditedDashboardMutation()` consumed by `/api/dashboard/[code]/elements` (Sprint 3.C live) |
| LLM         | OpenAI advisor route handler + cost cap; activated by `OPENAI_API_KEY` env                 |

## Background processes attivi

- Tunnel SSH PID 13572 (`scripts/dev-local/tunnel-vm.ps1 -Stop` per stop) · porte 5432+6380 listening
- Next.js dev:3200 + api-gateway:8200 (entrambi su 0.0.0.0 per accesso LAN da PC Windows IP 192.168.1.8)

## Verification

```bash
git status -sb && git log --oneline -5      # 4 commit shipped
npm run typecheck --workspaces --if-present  # 5/5 verde
npm test --workspace=services/app -- --run   # 153/153 verde

# Playwright matrix
DATABASE_URL=$(grep DATABASE_URL services/app/.env.local | cut -d= -f2-) \
  AUTH_SECRET=$(grep AUTH_SECRET services/app/.env | cut -d= -f2-) \
  NEXT_PUBLIC_API_URL=http://localhost:8200 \
  PLAYWRIGHT_NO_WEBSERVER=1 \
  npx playwright test dashboard-rbp-matrix --project=chromium --workers=2  # 100/100 verde
```

## Browser smoke da PC Windows LAN (IP 192.168.1.8)

- `http://192.168.1.8:3200/dashboard/hr_director_overview` — live data (8 widget)
- `http://192.168.1.8:3200/dashboard/hr_director_overview/edit` — drag-resize (TENANT_OWNER/HR_DIRECTOR/SUPERUSER only)
- `http://192.168.1.8:3200/ontology?q=manager` — ESCO search + advisor panel ("Setup required" senza OPENAI_API_KEY)
- `http://192.168.1.8:3200/explorer/esco` — tree view ESCO occupations (lazy expand)
- `http://192.168.1.8:3200/explorer/sap` — SAP migration jobs (vuoto per ora — no live SAP data)
- `http://192.168.1.8:3200/explorer/kg` — knowledge graph foundation (1-hop)

## Riferimenti

- Plan execution: `~/.claude/plans/questo-quello-che-glittery-charm.md`
- Engine pattern: [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md) § Phase 14.A
- Tier 2 doc: [`docs/20-architecture/tier2-explorer.md`](../docs/20-architecture/tier2-explorer.md)
- Setup OpenAI: [`docs/setup/openai-advisor.md`](../docs/setup/openai-advisor.md)
- ADR-0022: [`docs/50-reference/decisions/0022-openai-advisor-integration.md`](../docs/50-reference/decisions/0022-openai-advisor-integration.md)
- Perf report: `scripts/perf/results/perf-prod-2026-05-07.json`
- DECISIONS-LOG: L33 (Sprint 1.D RBP matrix + Sprint 2.E audit helper) — L34 da scrivere per Bundle F closure
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv)
