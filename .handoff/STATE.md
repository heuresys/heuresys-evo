# heuresys-evo — Current State

> Updated: 2026-05-08T17:24Z · S17 closed — 2 commit shipped (`d59ae3e` Phase 15.A · `597d471` docs sync)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

S17 omnibus Phase 15.A: brand-fedele dashboard rendering shipped. `/dashboard` ora role-driven via `role_default_dashboards` con 7 view brand-fedeli al mockup canonical `org-systems.html`. Architettura 4-layer: CSS canonical scoped 2370 righe + BrandShell layout sostituisce AppShell generico + role-preset resolver + 9 brand widget. `org_systems` view con data binding live (tenants reali · audit_logs · RBP counts · pg_policies). ADR-0026 + global doc sync.

## Top priorities (next session)

1. **Data binding live full** (~3-5h) — sostituisci dati hardcoded mockup-fedeli nelle 6 view non-`org_systems` con query Prisma reali (employees per tenant + skill_assessments + review_cycles + succession_pipeline + compensation_plan + esco_metrics). Pattern: estendere `lib/dashboard-views/` con un fetcher per view.
2. **Estensione preset minori** (~2-3h) — view brand-fedeli per `process_recruiting_funnel` · `process_onboarding_flow` · `process_performance_cycle` · `process_learning_paths` (4 preset PROCESS attualmente fallback al renderer override `/dashboard/[code]`).
3. **MV auto-refresh** (~2-3h) — pg_cron schedule REFRESH 5min su `mv_cross_tenant_rollup` + `mv_tenant_owner_rollup`. Manual REFRESH richiesta tra deploy. Ref: `db/seeds/phase14{i,j}_*.sql`.

## Open questions

- Re-skin brand widget Phase 13.A in `@heuresys/ui` (BrandKpiCard etc) per future sostituzione completa, o mantenere doppia track (atomic Phase 13.A + Brand Phase 15.A)?
- `pg_cron` extension installata su Postgres bare-metal? Se no, alternativa systemd timer + psql script.

## Stack snapshot

| Layer       | Tech                                                                                 |
| ----------- | ------------------------------------------------------------------------------------ |
| Frontend    | Next.js 16 · 3200 · 17+ routes · `/dashboard` role-driven brand-fedele 7 view        |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder · 457/457 vitest                                 |
| UI Library  | `@heuresys/ui` Cantiere B + 9 brand widget in `services/app/components/widgets/brand`|
| **DB**      | Postgres 16.13 bare-metal SoT · 4 tenants · 270 emp · 11 presets · 2 MV · `role_default_dashboards` 8 row |
| Brand       | `.ux-design/` 13 phase ✅ (Phase 15.A added) · CSS canonical 2370 righe              |
| a11y        | WCAG 2.2 AAA 16/16 (verifica spot only post Phase 15.A — full audit pending)         |
| Perf        | P95 794ms baseline · MV active · TTL 600s omnibus                                     |
| Vulns       | 0                                                                                     |
| Tests       | 457 gw · 186 app · 82 shared · 95 ui (820 totali)                                     |
| ADR         | 26 (ADR-0026 Phase 15.A brand-fedele dashboard)                                       |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 attivo (HMR live in this session, may need restart)

## Verification

```bash
git status -sb                                                     # clean post 597d471
npm run typecheck --workspaces --if-present                        # 5/5 verde
npm test --workspaces --if-present                                  # 820 totali (457+186+82+95)
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT role, preset_code FROM role_default_dashboards ORDER BY role"'
# Browser smoke /dashboard come SUPERUSER + HR_DIRECTOR confermato Phase 15.A
```

## Riferimenti

- ADR-0026: `docs/50-reference/decisions/0026-phase15a-brand-fedele-dashboard-rendering.md`
- Plan canonical: `~/.claude/plans/humble-soaring-lake.md`
- Mockup brand canonical: `.ux-design/06-mockups/dashboards/org-systems.html`
- 7 view brand-fedeli: `services/app/src/app/(app)/dashboard/_views/`
- 9 brand widget: `services/app/src/components/widgets/brand/`
- CSS canonical: `services/app/src/styles/dashboard-brand.css`
- BrandShell layout: `services/app/src/app/(app)/_components/BrandShell.tsx`
- Data fetcher live: `services/app/src/lib/dashboard-views/org-systems-data.ts`
