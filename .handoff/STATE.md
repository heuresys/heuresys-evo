# heuresys-evo — Current State

> Updated: 2026-05-07 · Phase 14 Sprint 1 (A+D+H) closed + Sprint 2 (E audit helper) shipped · 10 commit consecutivi

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 14 Bundle F (Full · 60-89 FTE-day) selezionato. **10 commit consecutivi su main** in autonomous mode (Phase 13-style):

| Commit    | Phase / Scope                                                                  |
| --------- | ------------------------------------------------------------------------------ |
| `1cd433f` | 14.A.0 PoC live data binding · KpiRing live in hr_director_overview            |
| `6c90a66` | 14.A.4 expansion · 7 adapters + Live wrappers + seed phase14a (8 SQL + 4 static) |
| `bda9e16` | 14.A.5+6 route handler + SWR hook + 14.H i18n IT/EN runtime                    |
| `ae6b6f7` | 14.A.7 perf script (autocannon) + 14.D PoC Playwright (3 spec verde)           |
| `19d3172` | 14.A composite static seed (9 widget instances)                                |
| `dff5e80` | docs(architecture): engine-pattern Phase 14.A status                           |
| `c09e323` | docs(decisions): L32 Phase 14 Sprint 1 closure                                 |
| `0f1db5e` | docs(brand-state): Phase 14 row · Sprint 1 A+H shipped                         |
| `532d13a` | 14.D RBP matrix · 5 ruoli RTL Bank × hr_director_overview (5/5 verde)          |
| `d1fba14` | 14 Sprint 2.E `auditedDashboardMutation()` helper · 12 vitest verde            |

**Smoke verified live**:
- KpiRing pos 1 hr_director_overview → `value:270, label:"Active employees"` (RLS scope RTL Bank)
- IntegrationHealthPill pos 4 → live static `tone:ok, label:HR API`
- SuccessionCard pos 2 → `Stefania Bianchi` (composite static)
- ?lang=it → "Vista Direzione HR" · ?lang=en → "HR Director Overview"
- 5/7 ruoli RTL Bank login OK con Heuresys2026! (DEPT_HEAD + EMPLOYEE legacy bcrypt $2a$ → Sprint 1 follow-up)

**Test status**: 132/132 vitest verde su services/app · 5/5 typecheck verde · 8/8 E2E Playwright verde (5 RBP matrix + 3 base).

## Top priorities (next session)

1. **Sprint 1 follow-up: re-seed canonical demo users** (~1 FTE-day): unify password Heuresys2026! across 8 ruoli per tenant (RTL Bank + SmartFood + EcoNova) per sbloccare full 72-fixture matrix Playwright.
2. **Sprint 1 follow-up: composite SQL queries** (~2-3 FTE-day): jsonb_agg over talents/skills/org joins per CareerArc/KgMiniGraph/SkillHeatmap/CapabilityRadar/RbacMatrix (sostituisce static seed phase14b).
3. **Sprint 1 follow-up: production-mode perf binding** (~30min): `next build && next start`, run `node scripts/perf-dashboard.mjs /dashboard/hr_director_overview 30 100`, valida P95 ≤ 500ms.
4. **Sprint 2 · F: /ontology + OpenAI advisor** (~8-12 FTE-day): blocker requires `OPENAI_API_KEY` + cost monitoring config.
5. **Sprint 3 · C: drag-resize editor** (~12-18 FTE-day): consumer naturale per `auditedDashboardMutation()` (Sprint 2.E).
6. **Sprint 3 · G: Tier 2 explorer** (~18-25 FTE-day): ESCO/SAP/KG admin UI (depends Sprint 2.F).

## Open questions

- D14.B: re-seed canonical users now (sblocca 72-matrix) o defer fino a Sprint 3 · C? Suggerito: re-seed ora, è bassa priorità ma quick win + sblocca CI E2E.
- D14.C: Sprint 2 · F OpenAI advisor — Enzo conferma disponibilità API key + cost cap?

## Stack snapshot

| Layer       | Tech                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| API Gateway | Express 5 · 8200 · 30 endpoint Pack 1-8 mounted                                 |
| Frontend    | Next.js 16 · 3200 · `/dashboard/[code]` engine + prefetch + i18n + route handler |
| UI Library  | `packages/ui` Cantiere B · TIER 17 atomic dashboard (8 component)               |
| DB          | Postgres 16 bare-metal · seed phase14a + phase14b applied                       |
| Test        | Vitest 132/132 · Playwright 8/8 · perf script ready (autocannon)                 |
| i18n        | LocaleProvider client + pickBilingual server-safe · IT/EN runtime               |
| Audit       | `auditedDashboardMutation()` helper ready (consumer arrives Sprint 3 · C)       |

## Background processes attivi

- Tunnel SSH PID 12524 (`scripts/dev-local/tunnel-vm.ps1 -Stop` per stop) · port 5432+6380 listening
- Next.js:3200 + api-gateway:8200 (logs in /tmp/app.log + /tmp/api-gw.log)
- Storybook:6006 + Enrichment workers (status TBD)

## Verification

```bash
git status -sb && git log --oneline -10
npm run typecheck --workspaces --if-present     # 5/5 verde
npm test --workspace=services/app               # 132/132 verde
DATABASE_URL=$(grep DATABASE_URL services/app/.env.local | cut -d= -f2-) \
  AUTH_SECRET=$(grep AUTH_SECRET services/app/.env | cut -d= -f2-) \
  NEXT_PUBLIC_API_URL=http://localhost:8200 \
  PLAYWRIGHT_NO_WEBSERVER=1 \
  npx playwright test --project=chromium --workers=1  # 8/8 verde
```

## Riferimenti

- Plan Phase 14 Bundle F: `~/.claude/plans/phase14-{index,sprint1-foundation,sprint2-ai-compliance,sprint3-ux-tier2}.md`
- Phase 14 scope: [`docs/70-planning/phase14-scope.md`](../docs/70-planning/phase14-scope.md)
- Engine pattern (Phase 13 + 14.A): [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md)
- DECISIONS-LOG: L29-L31 (Phase 13) · L32 (Phase 14 Sprint 1 A+H)
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv) (30 Promoted · 57 Test Stage · 36 Rejected)

## Phase 14 files shipped (cumulative)

### Engine + data layer (Sprint 1.A)

- `services/app/src/lib/dashboard-engine/data-fetcher.ts`
- `services/app/src/lib/dashboard-engine/adapters.ts` (8 adapters)
- `services/app/src/lib/dashboard-engine/prefetch.ts`
- `services/app/src/lib/dashboard-engine/use-widget-data.ts` (SWR-style, zero deps)
- `services/app/src/lib/dashboard-engine/registry.tsx` (refactored Live wrapper unified)
- `services/app/src/lib/dashboard-engine/grid.tsx` (data prop pipeline)
- `services/app/src/lib/dashboard-engine/index.ts` (Phase 14.A surface)
- `services/app/src/app/api/dashboard/data/[elementId]/route.ts`
- `services/app/src/app/dashboard/[code]/page.tsx` (server prefetch + i18n header)
- `services/app/src/lib/db.ts` (`withTenant()` extended)

### i18n (Sprint 1.H)

- `services/app/src/lib/i18n/locale-utils.ts` (pure server-safe)
- `services/app/src/lib/i18n/locale.tsx` (LocaleProvider + hooks)
- `services/app/src/lib/i18n/locale-switcher.tsx` (UI)
- `services/app/src/lib/i18n/index.ts` (barrel)
- `services/app/src/app/layout.tsx` (LocaleProvider wrapping)

### Audit (Sprint 2.E)

- `services/app/src/lib/audit/dashboard-audit.ts` (`auditedDashboardMutation()`)

### Seed

- `db/seeds/phase14a_dashboard_data_sources.sql` (8 KpiRing SQL + 4 IntegrationHealthPill static)
- `db/seeds/phase14b_dashboard_composite_static.sql` (9 composite static)

### Tooling

- `services/app/scripts/perf-dashboard.mjs` (autocannon perf script)

### Tests (132 vitest + 8 E2E)

- `services/app/src/__tests__/dashboard-data-fetcher.test.ts` (16)
- `services/app/src/__tests__/dashboard-adapters.test.ts` (28)
- `services/app/src/__tests__/dashboard-prefetch.test.ts` (6)
- `services/app/src/__tests__/dashboard-data-route.test.ts` (10)
- `services/app/src/__tests__/use-widget-data.test.ts` (9)
- `services/app/src/__tests__/i18n-locale.test.tsx` (17)
- `services/app/src/__tests__/dashboard-audit.test.ts` (12)
- `services/app/tests/e2e/helpers/auth.ts` (5 ruoli RTL Bank)
- `services/app/tests/e2e/dashboard.spec.ts` (3 spec)
- `services/app/tests/e2e/dashboard-rbp-matrix.spec.ts` (5 spec)
