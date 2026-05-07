# heuresys-evo — Current State

> Updated: 2026-05-07T20:10Z · **Phase 14.SH FULLY CLOSED** (SH-1 + SH-2 + SH-3 done, 8 commits, all pushed main)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Phase 14.SH chiusa. SH-3 ha shippato: composite real aggregations (`phase14e` migration, 4 widget × 13 elements), 9 routes carry-forward (`/reviews`, `/goals`, `/learning`, `/compensation`, `/me/{goals,reviews,learning}`, `/admin/{rbac,integrations}`), theme toggle dark/light + localStorage, perf baseline autocannon (P50=1s dev). Brand-driven role-based shell live e2e operativo per 8 ruoli canonical.

## Top priorities (next session)

1. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass. Ref: `docs/_meta/operating-baseline.md` §a11y, plan FASE 4.
2. **Production build perf bench** (~1-2h) — `next build && next start` + autocannon su 8 viste auth-required. Target P95 ≤ 500ms. Ref: `scripts/perf/results/`.
3. **API gateway cross-service JWT** (~2-3h) — fix NextAuth v4 ↔ Auth.js v5 JWE decode via `jose` library, riabilitare api-gateway calls. Ref: `services/api-gateway/src/auth.ts`, bypassed con Prisma direct in SH-2.

## Open questions

- Carry-forward route presets `/dashboard/cross_tenant_overview` + `tenant_owner_overview`: aggiungere ai dashboard_presets seed (rimasti placeholder href in SIDEBAR_MAP)?
- i18n locale switcher: estendere a 9 viste SH-3? (riusa `pickBilingual()`)

## Stack snapshot

| Layer       | Tech                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| Frontend    | Next.js 16 · 3200 · 17+ routes (app)/ live data · theme toggle               |
| API Gateway | Express 5 · 8200 · 30 endpoint (bypassed in (app)/ via Prisma direct)        |
| UI Library  | `@heuresys/ui` Cantiere B + `<HeuresysWordmark>` + `<AppShell>` cablato      |
| Shared      | `@heuresys/shared/rbp` (hasMinRole, requireMinRole, isRbpPlatformAdmin) — 12 vitest |
| **DB**      | **Postgres 16.13 bare-metal SoT certified** — 4 tenants, 270+ employees      |
| Test        | Vitest 180/180 services/app · 82/82 packages/shared · 95/95 packages/ui      |
| Backup      | Cron daily/weekly/monthly + drill mensile (`heuresys-backup.sh` su VM)       |

## Background processes attivi

- Tunnel SSH PID variabile (`scripts/dev-local/tunnel-vm.ps1 -Status`) · porte 5432+6380 listening
- Next.js dev :3200 + api-gateway :8200 (entrambi 0.0.0.0)

## Verification

```bash
cd D:/evo.heuresys.com
git status -sb                              # clean post 56ea24b
npm run typecheck --workspaces --if-present  # 5/5 verde
npm test --workspace=services/app -- --run    # 180/180
npm test --workspace=packages/shared -- --run  # 82/82
```

```bash
# DBMS SoT integrity
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -tAc "SELECT count(*) FROM employees"'  # 270
ssh oracle-vm-default 'sudo ls /var/backups/heuresys-evo/ | head'  # backup chain
```

## Riferimenti

- Plan canonical (eseguito): `~/.claude/plans/questo-quello-che-glittery-charm.md`
- Role × Views matrix: `docs/20-architecture/role-views-matrix.md`
- Backup policy: `docs/40-operations/dbms-backup-restore.md`
- ADR-0023 SoT promotion · ADR-0024 Phase 14.SH plan
- Brand state: `.ux-design/BRAND-STATE.md`
- Composite migration: `db/migrations/phase14e_composite_real_aggregations.sql`
