# heuresys-evo — Current State

> Updated: 2026-05-07 · Phase 14 Sprint 1.A.0 PoC shipped · live data binding pipeline + KpiRing live in hr_director_overview

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 14 Bundle F (Full · 60-89 FTE-day) selezionato. 4 plan files generati (`~/.claude/plans/phase14-*.md`). Sprint 1.A.0 PoC live data binding shippato in autonomous: `data-fetcher.ts` (dispatch sql/static + cache TTL + RLS via `withTenant`) + `adapters.ts` (KpiRing PoC) + `prefetch.ts` (parallel server fetch) + wiring `page.tsx`/`grid.tsx`/`registry.tsx` (KpiRing wrapper Live + 7 Demo backward compat) + seed `phase14a_dashboard_data_sources.sql` applicato in DB live (KpiRing in hr_director_overview · count active employees tenant-scoped). 65/65 vitest verde su services/app (43 nuovi: 16 fetcher + 8 adapters + 6 prefetch + 13 engine baseline + 22 altri).

## Top priorities (next session — Sprint 1 follow-up)

1. **Sprint 1.A.4 expansion** (~2-4 FTE-day): replicare data_source per gli altri 8 widget code (SuccessionCard, CareerArc, KgMiniGraph, SkillHeatmap, CapabilityRadar, RbacMatrix, IntegrationHealthPill) + adapter per ognuno + seed update sui 9 preset.
2. **Sprint 1.A.5 endpoint /dashboard/data/:elementId** (~1-2 FTE-day): API gateway POST endpoint per fetch lato client (richiesto per Sprint 1.A.6 SWR).
3. **Sprint 1.A.6 SWR client-side hook** (~1 FTE-day): `useWidgetData(elementId)` con stale-while-revalidate.
4. **Sprint 1.A.7 perf test** (~1 FTE-day): load test 100 req/s, target P95 ≤ 500ms.
5. **Sprint 1.D E2E Playwright** (5-8 FTE-day): 9×8=72 fixture + golden image + axe-core.
6. **Sprint 1.H i18n IT/EN** (2-3 FTE-day): LocaleProvider + switch runtime.
7. **Live smoke test PoC** (~30min): login HR_DIRECTOR su `/dashboard/hr_director_overview` e verificare KpiRing position 1 mostra count employees attivi del tenant invece di 72 hardcoded.

## Open questions

- D14.A: smoke test live PoC pre-Sprint 1.A.4 expansion? Suggerito sì (sblocca conferma pipeline funzionante prima di replicare su 7 widget).

## Stack snapshot

| Layer       | Tech                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| API Gateway | Express 5 · 8200 · 30 endpoint Pack 1-8 mounted                            |
| Frontend    | Next.js 16 · 3200 · `/dashboard/[code]` engine + prefetch pipeline (14.A) |
| UI Library  | `packages/ui` Cantiere B · TIER 17 atomic dashboard (8 component)          |
| DB          | Postgres 16 bare-metal · seed phase14a applied · KpiRing live in hr_d_o    |
| Test        | Vitest · 65/65 verde su services/app (43 nuovi Phase 14.A)                 |

## Background processes attivi

- Tunnel SSH PID 12524 (`scripts/dev-local/tunnel-vm.ps1 -Stop` per stop) · port 5432+6380 listening
- api-gateway:8200 + Next.js:3200 · status TBD (verificare prima di smoke test live)

## Verification

```bash
git status -sb && git log --oneline -5
npm run typecheck --workspaces --if-present     # 5/5 verde
npm test --workspace=services/app               # 65/65 verde (43 nuovi 14.A)
# Smoke live (richiede dev up + login)
curl -sI http://localhost:3200/dashboard/hr_director_overview  # post-login session
# DB verify
node -e "import('./services/app/prisma/generated/client/index.js').then(async m => { const p = new m.PrismaClient(); const r = await p.\$queryRawUnsafe(\"SELECT config_overrides->'data_source'->>'type' FROM dashboard_elements WHERE widget_code='KpiRing' AND position=1 LIMIT 1\"); console.log(r); await p.\$disconnect(); })"
```

## Riferimenti

- Plan Phase 14 Bundle F: `~/.claude/plans/phase14-index.md` + 3 sprint files
- Plan Phase 13 (executed): `~/.claude/plans/credo-che-se-tu-jazzy-key.md`
- Phase 14 scope draft: [`docs/70-planning/phase14-scope.md`](../docs/70-planning/phase14-scope.md)
- Engine pattern: [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md)
- DECISIONS-LOG: L29-L31 (Phase 13) · L32 prevista (Phase 14 bundle decision + Sprint 1.A.0 PoC)
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv) (30 Promoted · 57 Test Stage · 36 Rejected)

## Phase 14.A files shipped

| File                                                                | Purpose                                      |
| ------------------------------------------------------------------- | -------------------------------------------- |
| `services/app/src/lib/dashboard-engine/data-fetcher.ts`             | Dispatch sql/static + cache TTL + RLS       |
| `services/app/src/lib/dashboard-engine/adapters.ts`                 | Widget-specific data → props (KpiRing PoC)  |
| `services/app/src/lib/dashboard-engine/prefetch.ts`                 | Parallel server-side fetch per element       |
| `services/app/src/lib/db.ts` (extended)                             | `withTenant()` helper (RLS context)          |
| `services/app/src/lib/dashboard-engine/index.ts` (extended)         | Export Phase 14.A surface                    |
| `services/app/src/lib/dashboard-engine/grid.tsx` (extended)         | `data` prop pipeline                         |
| `services/app/src/lib/dashboard-engine/registry.tsx` (extended)     | KpiRing wrapper Live + Demo fallback         |
| `services/app/src/app/dashboard/[code]/page.tsx` (extended)         | Server prefetch + element data enrichment    |
| `db/seeds/phase14a_dashboard_data_sources.sql`                      | Seed PoC: KpiRing live in hr_director_overview |
| `services/app/src/__tests__/dashboard-data-fetcher.test.ts`         | 16 test                                      |
| `services/app/src/__tests__/dashboard-adapters.test.ts`             | 8 test                                       |
| `services/app/src/__tests__/dashboard-prefetch.test.ts`             | 6 test                                       |
