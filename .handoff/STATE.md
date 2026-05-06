# heuresys-evo — Current State

> Updated: 2026-05-07 · Phase 14 Sprint 1 (A+H) shipped · live data pipeline + route handler + SWR hook + i18n IT/EN runtime

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 14 Bundle F (Full · 60-89 FTE-day) selezionato. 4 plan files generati (`~/.claude/plans/phase14-*.md`). **Sprint 1 sub-phase A (live data binding) + H (i18n) shippate end-to-end in autonomous**:

- **14.A.0 PoC** (commit `1cd433f`): data-fetcher (sql/static + cache TTL + RLS via withTenant), adapters (KpiRing PoC), prefetch (parallel server-side), wiring page/grid/registry, seed phase14a applicato in DB live.
- **14.A.4 expansion** (commit `6c90a66`): full 8-widget ADAPTER_REGISTRY (KpiRing + IntegrationHealthPill + SuccessionCard + CareerArc + KgMiniGraph + SkillHeatmap + CapabilityRadar + RbacMatrix); Live wrapper unificato; seed esteso (8 KpiRing SQL + 4 IntegrationHealthPill static).
- **14.A.5+6** (this session): Next.js route handler `/api/dashboard/data/[elementId]` con auth + RBP + tenant gates · `useWidgetData()` SWR hook custom (zero deps · cache + revalidate + mutate).
- **14.H**: LocaleProvider client + `useLocale()`/`useTranslate()` hooks + `pickBilingual()` server-safe pure + `LocaleSwitcher` UI · split client/server modules per Next.js 16 boundary · ?lang= query + localStorage persistence · default 'it'.

**Smoke test live verified**: 
- KpiRing pos 1 hr_director_overview → `[{value:270, label:"Active employees", sublabel:"tenant-scoped · live"}]` (RLS scope RTL Bank)
- IntegrationHealthPill pos 4 → live static `tone:ok, label:HR API`
- ?lang=it → "Vista Direzione HR" · ?lang=en → "HR Director Overview"

**Test status**: 120/120 vitest verde su services/app (43 baseline + 16 fetcher + 28 adapters + 6 prefetch + 10 route + 9 hook + 17 i18n - 9 dedup). Typecheck 5/5 verde.

## Top priorities (next session — Sprint 1 follow-up + Sprint 2)

1. **14.A.7 perf test** (~1 FTE-day): load test 100 req/s su `/dashboard/<code>`, target P95 ≤ 500ms. Tools: autocannon o k6.
2. **14.D Playwright E2E** (5-8 FTE-day): setup + 9 dashboard × 8 ruoli = 72 fixture + pixel diff <5% + axe-core ≥95 + CI workflow.
3. **14.A composite SQL queries** (~2-3 FTE-day): SQL queries reali per CareerArc/KgMiniGraph/SkillHeatmap/CapabilityRadar/RbacMatrix usando jsonb_agg (richiede schema knowledge talents/skills).
4. **Sprint 2 · E audit log mutations** (3-5 FTE-day): wrap dashboard_presets/elements mutations con `auditedTransaction()`.
5. **Sprint 2 · F /ontology + OpenAI advisor** (8-12 FTE-day): USP AI integration.
6. **Sprint 3 · C drag-resize editor** (12-18 FTE-day) e **G Tier 2 explorer** (18-25 FTE-day).

## Open questions

- D14.B: usare client-side SWR refresh (via `useWidgetData` hook ora disponibile) per dashboard live updates? Default: no per Phase 14, sì per Phase 15 quando dashboard editor sarà attivo.

## Stack snapshot

| Layer       | Tech                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| API Gateway | Express 5 · 8200 · 30 endpoint Pack 1-8 mounted                            |
| Frontend    | Next.js 16 · 3200 · `/dashboard/[code]` engine + prefetch + i18n + route handler |
| UI Library  | `packages/ui` Cantiere B · TIER 17 atomic dashboard (8 component)          |
| DB          | Postgres 16 bare-metal · seed phase14a applied (8+4 widget live)           |
| Test        | Vitest · 120/120 verde su services/app (Phase 14 delta: +85 nuovi)         |
| i18n        | LocaleProvider client + pickBilingual server-safe · IT/EN runtime          |

## Background processes attivi

- Tunnel SSH PID 12524 (`scripts/dev-local/tunnel-vm.ps1 -Stop` per stop) · port 5432+6380 listening
- Next.js:3200 + api-gateway:8200 (logs in /tmp/app.log + /tmp/api-gw.log)
- Storybook:6006 + Enrichment workers (status TBD)

## Verification

```bash
git status -sb && git log --oneline -5
npm run typecheck --workspaces --if-present     # 5/5 verde
npm test --workspace=services/app               # 120/120 verde

# Smoke live (richiede dev up + login)
CSRF=$(curl -s http://localhost:3200/api/auth/csrf | grep -oP '"csrfToken":"\K[^"]+')
CSRF_COOKIE=$(curl -s -D - http://localhost:3200/api/auth/csrf | grep -i "set-cookie: next-auth.csrf-token=" | sed 's/^[Ss]et-[Cc]ookie: //; s/;.*$//')
SESSION=$(curl -s -D - -X POST http://localhost:3200/api/auth/callback/credentials \
  -H "Cookie: $CSRF_COOKIE" -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=rtl-bank.valentina.conti&password=Heuresys2026!&csrfToken=$CSRF&json=true" \
  -o /dev/null | grep -i "set-cookie: authjs.session-token=" | sed 's/^[Ss]et-[Cc]ookie: //; s/;.*$//')
curl -s -H "Cookie: $SESSION" "http://localhost:3200/dashboard/hr_director_overview?lang=en" | grep -oE 'HR Director Overview|Active employees'
```

## Riferimenti

- Plan Phase 14 Bundle F: `~/.claude/plans/phase14-index.md` + 3 sprint files
- Phase 14 scope draft: [`docs/70-planning/phase14-scope.md`](../docs/70-planning/phase14-scope.md)
- Engine pattern: [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md)
- DECISIONS-LOG: L29-L31 (Phase 13) · L32 prevista (Phase 14 Sprint 1 A+H closure)
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv) (30 Promoted · 57 Test Stage · 36 Rejected)

## Phase 14 files shipped (Sprint 1 A+H)

| Layer | File                                                                | Purpose                                      |
| ----- | ------------------------------------------------------------------- | -------------------------------------------- |
| Engine | `services/app/src/lib/dashboard-engine/data-fetcher.ts`             | Dispatch sql/static + cache TTL + RLS       |
| Engine | `services/app/src/lib/dashboard-engine/adapters.ts`                 | Widget data → props (8 adapter)              |
| Engine | `services/app/src/lib/dashboard-engine/prefetch.ts`                 | Parallel server-side fetch per element       |
| Engine | `services/app/src/lib/dashboard-engine/use-widget-data.ts`          | Client-side SWR-style hook (zero deps)       |
| API    | `services/app/src/app/api/dashboard/data/[elementId]/route.ts`      | Route handler + auth + RBP + tenant gates    |
| Engine | `services/app/src/lib/dashboard-engine/registry.tsx`                | KpiRing/IntegrationHealthPill/... Live wrappers |
| i18n   | `services/app/src/lib/i18n/locale-utils.ts`                         | Pure server-safe (isLocale, pickBilingual)   |
| i18n   | `services/app/src/lib/i18n/locale.tsx`                              | LocaleProvider + useLocale + useTranslate    |
| i18n   | `services/app/src/lib/i18n/locale-switcher.tsx`                     | UI dropdown                                  |
| Page   | `services/app/src/app/dashboard/[code]/page.tsx`                    | Server prefetch + i18n bilingue header       |
| Page   | `services/app/src/app/layout.tsx`                                   | LocaleProvider wrapping                      |
| DB     | `db/seeds/phase14a_dashboard_data_sources.sql`                      | 8 KpiRing live + 4 IntegrationHealthPill     |
| Tests  | `dashboard-data-fetcher.test.ts`                                    | 16 test                                      |
| Tests  | `dashboard-adapters.test.ts`                                        | 28 test                                      |
| Tests  | `dashboard-prefetch.test.ts`                                        | 6 test                                       |
| Tests  | `dashboard-data-route.test.ts`                                      | 10 test                                      |
| Tests  | `use-widget-data.test.ts`                                           | 9 test                                       |
| Tests  | `i18n-locale.test.tsx`                                              | 17 test                                      |
