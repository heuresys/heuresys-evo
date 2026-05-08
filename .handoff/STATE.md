# heuresys-evo — Current State

> Updated: 2026-05-08T01:54Z · S16 closed — 11 commit shipped (`9f7a283` → `4355641`)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

S16 omnibus: API gateway JWT v4↔v5 fix (decoder + E2E verified) · brand v1.0 quick wins · WCAG 2.2 AAA full audit DARK+LIGHT (16/16 pass) · perf bench production con 4 round optimizations (cross_tenant 2385→794ms -67%, hr_director 692→194 -72%, MV cross_tenant + MV tenant_owner) · vulns express-rate-limit fix (0 residual) · /me/skills Prisma bug fix scoperto via tour browser. Direttiva utente: ogni round chiuso con commit/push direct.

## Top priorities (next session)

1. **MV auto-refresh** (~2-3h) — verifica pg_cron extension + schedule REFRESH ogni 5min su `mv_cross_tenant_rollup` + `mv_tenant_owner_rollup`. Manual REFRESH richiesta tra deploy. Ref: `db/seeds/phase14i_*.sql` + `phase14j_*.sql`.
2. **Perf round-5 React.cache + SWR** (~2-4h) — `cache()` su `prefetchElements` per render dedup + HTTP `Cache-Control: stale-while-revalidate=120` su dashboard pages. Target: P95 ≤500ms su tutte le 8 viste (oggi 5/8 dentro target).
3. **/me family parity check** (~1-2h) — `/me/skills` fixed; verifica `/me/goals` · `/me/reviews` · `/me/learning` per stessi pattern Prisma deleted_at o column-name drift.

## Open questions

- `pg_cron` extension installata su Postgres bare-metal? Se no, alternativa systemd timer + psql script.
- Cross_tenant_overview P95 residual 794ms (just at 800ms edge, variance): accept come baseline o serve perf round-5 hard?

## Stack snapshot

| Layer       | Tech                                                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| Frontend    | Next.js 16 · 3200 · 17+ routes · theme toggle DARK/LIGHT WCAG-AAA                     |
| API Gateway | Express 5 · 8200 · JWT v4↔v5 decoder shipped · 457/457 vitest                          |
| UI Library  | `@heuresys/ui` Cantiere B + AppShell cablato · 95/95 vitest                            |
| Shared      | `@heuresys/shared/rbp` · 82/82 vitest                                                  |
| **DB**      | Postgres 16.13 bare-metal SoT · 4 tenants · 270 employees · 11 presets · 2 MV         |
| Brand       | `.ux-design/` 12 phase ✅ · v1.0 quick wins promoted (tokens JSON + logos + icons)    |
| a11y        | WCAG 2.2 AAA 16/16 (8 viste × 2 themes) · axe-core CI workflow attivo                  |
| Perf        | P95 794ms (was 2385) · MV cross_tenant + tenant_owner · TTL 600s omnibus              |
| Vulns       | 0 (post `express-rate-limit` 8.5.1)                                                    |
| Tests       | 457 gw · 180 app · 82 shared · 95 ui · WCAG e2e 16                                     |
| ADR         | 25 (ADR-0025 brand cycle sealed + v1.0 plan)                                           |

## Background processes

- Tunnel SSH (`scripts/dev-local/tunnel-vm.ps1 -Status`) · 5432 + 6380 listening
- Next.js dev :3200 attivo nel terminale Enzo (HMR live)
- Prod server :3201 spento (riavviare per perf bench)

## Verification

```bash
git status -sb                                                     # clean post 4355641
npm run typecheck --workspaces --if-present                        # 5/5 verde
npm test --workspaces --if-present                                  # 814 totali (457+180+82+95)
bash scripts/integration/jwt-cross-service.sh                      # E2E PASS
cd services/app && PLAYWRIGHT_NO_WEBSERVER=1 npx playwright test tests/e2e/a11y/wcag-aaa.spec.ts  # 16/16
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT * FROM mv_cross_tenant_rollup"'
```

## Riferimenti

- Perf reports: `scripts/perf/results/views-prod-2026-05-08T01-42-03.{json,md}` (final P95 794ms)
- WCAG manual checklist: `docs/40-operations/a11y-manual-checklist.md`
- E2E JWT script: `scripts/integration/jwt-cross-service.sh`
- MV seeds: `db/seeds/phase14{g,h,i,j}_*.sql`
- Brand v1.0 checklist: `.ux-design/08-promotion/v1.0-checklist.md`
