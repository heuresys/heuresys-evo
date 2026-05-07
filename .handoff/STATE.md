# heuresys-evo — Current State

> Updated: 2026-05-07 · Phase 14 Sprint 1 (A+D+H) closed + Sprint 2.E shipped · 13 commit autonomous su main

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 14 Bundle F (Full · 60-89 FTE-day) selezionato + 13 commit consecutivi (`1cd433f..2ed1078`) shippati in autonomous mode (Phase 13-style): live data binding pipeline (data-fetcher + 8 adapters + prefetch + route handler + SWR hook + perf script) · seed phase14a/b (8 KpiRing SQL + 4 IntegrationHealthPill + 9 composite static) · i18n IT/EN runtime · Playwright PoC + RBP matrix 5 ruoli RTL Bank · `auditedDashboardMutation()` helper standalone · doc engine-pattern + L32+L33 + BRAND-STATE + CLAUDE.md "Stato attuale" updated. Smoke verified live: KpiRing pos 1 → `Active employees · 270` (RLS scope RTL Bank).

## Top priorities (next session)

1. **Re-seed canonical demo users** (~1 FTE-day): unify password Heuresys2026! across 8 ruoli per tenant (DEPT_HEAD + EMPLOYEE legacy bcrypt $2a$ blocker) → sblocca full 72-fixture matrix Playwright.
2. **Composite SQL queries** (~2-3 FTE-day): jsonb_agg per CareerArc/KgMiniGraph/SkillHeatmap/CapabilityRadar/RbacMatrix sostituiscono static seed phase14b.
3. **Sprint 2.F /ontology + OpenAI advisor** (~8-12 FTE-day): blocker `OPENAI_API_KEY` + cost cap config.

## Open questions

- D14.B: re-seed canonical users now o defer fino Sprint 3.C? Suggerito: ora (sblocca CI E2E).
- D14.C: Sprint 2.F OpenAI — Enzo conferma disponibilità API key + cost cap?

## Stack snapshot

| Layer       | Tech                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| API Gateway | Express 5 · 8200 · 30 endpoint Pack 1-8 mounted                                 |
| Frontend    | Next.js 16 · 3200 · `/dashboard/[code]` engine + prefetch + i18n + route handler |
| UI Library  | `packages/ui` Cantiere B · TIER 17 atomic dashboard (8 component) · Live wrapper |
| DB          | Postgres 16 bare-metal · seed phase14a + phase14b applied                       |
| Test        | Vitest 132/132 · Playwright 8/8 · perf script ready (autocannon)                 |
| i18n        | LocaleProvider client + pickBilingual server-safe · IT/EN runtime               |
| Audit       | `auditedDashboardMutation()` helper ready (consumer arrives Sprint 3.C)         |

## Background processes attivi

- Tunnel SSH PID 12524 (`scripts/dev-local/tunnel-vm.ps1 -Stop` per stop) · port 5432+6380 listening
- Next.js:3200 + api-gateway:8200 (logs in /tmp/app.log + /tmp/api-gw.log)

## Verification

```bash
git status -sb && git log --oneline -13
npm run typecheck --workspaces --if-present     # 5/5 verde
npm test --workspace=services/app               # 132/132 verde
DATABASE_URL=$(grep DATABASE_URL services/app/.env.local | cut -d= -f2-) \
  AUTH_SECRET=$(grep AUTH_SECRET services/app/.env | cut -d= -f2-) \
  NEXT_PUBLIC_API_URL=http://localhost:8200 \
  PLAYWRIGHT_NO_WEBSERVER=1 \
  npx playwright test --project=chromium --workers=1  # 8/8 verde
```

## Riferimenti

- Plan Bundle F: `~/.claude/plans/phase14-{index,sprint1-foundation,sprint2-ai-compliance,sprint3-ux-tier2}.md`
- Engine pattern: [`docs/20-architecture/dashboard-engine-pattern.md`](../docs/20-architecture/dashboard-engine-pattern.md) § Phase 14.A
- DECISIONS-LOG: L32 (Sprint 1 A+H) · L33 (Sprint 1.D RBP matrix + Sprint 2.E audit helper)
- Registry CSV: [`legacy-import-registry.csv`](legacy-import-registry.csv)
