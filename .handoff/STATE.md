# heuresys-evo — Current State

> Updated: 2026-05-08T01:10Z · **Brand identity cycle SEALED (Phase 1→12 done, L37+L38)** + Phase 14.SH carry-forward shipped (commits `0958625`/`5ebdc45`/`34f9ac8`/`5ee6636`)

## ⚠️ DIRETTIVA ATTIVA

**SEMPLICITÀ + ROBUSTEZZA**. Vedi [`docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md).

## Last session brief

Sessione carry-forward Phase 14.SH + closure brand identity cycle. Shipped: 2 mockup overview (`cross-tenant-overview` + `tenant-owner-overview`) + seed `phase14f_overview_presets.sql` applicato bare-metal SoT + LocaleSwitcher cablato in topbar AppShell + 9 viste SH-3 i18n IT/EN. Poi chiusura ciclo brand identity Phase 11/12 (theme variants W3C DTCG + brand book v0). Audit pre-promotion ha rilevato 5 gap reali, tutti chiusi (D1-D4 risolte + 4 personas mancanti + v1.0-checklist + promotion-candidates update + brand book § 3 expanded). ADR-0025 + sync CLAUDE.md + role-views-matrix.

## Top priorities (next session)

1. **Brand v1.0 promotion — Quick wins (~1-2h)** — design tokens JSON copy in `packages/ui/design-tokens/` + logo SVG copy in `services/app/public/brand/` + favicon multi-size + apple-touch-icon + og-image. Ref: `.ux-design/08-promotion/v1.0-checklist.md` § 2.1-2.5.
2. **WCAG 2.2 AAA full audit (~3-5h)** — axe-core CI integration + manual NVDA/VoiceOver pass su 8 viste rappresentative. Ref: `docs/_meta/operating-baseline.md` §a11y.
3. **Production build perf bench (~1-2h)** — `next build && next start` + autocannon su 8 viste auth-required. Target P95 ≤ 500ms. Ref: `scripts/perf/results/`.

## Open questions

- Sequence promotion v1.0: incremental (1 categoria asset alla volta) o bulk (tutto in 1 sessione lunga)? `v1.0-checklist.md` raccomanda incremental.
- API gateway JWT fix (~2-3h, `jose` library): priorità prima o dopo le 3 sopra?

## Stack snapshot

| Layer       | Tech                                                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| Frontend    | Next.js 16 · 3200 · 17+ routes (app)/ live data · theme toggle · LocaleSwitcher topbar |
| API Gateway | Express 5 · 8200 · 30 endpoint (bypassed in (app)/ via Prisma direct, JWT fix pending) |
| UI Library  | `@heuresys/ui` Cantiere B + `<HeuresysWordmark>` + `<AppShell>` cablato                |
| Shared      | `@heuresys/shared/rbp` — 82/82 vitest                                                  |
| **DB**      | **Postgres 16.13 bare-metal SoT certified** — 4 tenants, 270+ employees · 11 dashboard presets (incl. cross_tenant + tenant_owner) |
| i18n        | `LocaleProvider` + `getServerLocale()` cookie-based + `STRINGS` per-page const         |
| Brand SoT   | `.ux-design/` — 12 phase ✅ · 8 personas (1:1 RBP) · v1.0-checklist · BRAND-BOOK-v0    |
| Test        | Vitest 180/180 services/app · 82/82 packages/shared · 95/95 packages/ui                |
| ADR         | 25 (ADR-0025 brand cycle sealed + v1.0 plan)                                           |

## Background processes

- Tunnel SSH PID variabile (`scripts/dev-local/tunnel-vm.ps1 -Status`) · porte 5432+6380 listening
- Next.js dev :3200 + api-gateway :8200 (entrambi 0.0.0.0)

## Verification

```bash
git status -sb                                   # clean post 5ee6636
npm run typecheck --workspaces --if-present       # 5/5 verde
npm test --workspace=services/app -- --run         # 180/180
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -tAc "SELECT count(*) FROM dashboard_presets"'  # 11
```

## Riferimenti

- Brand v1.0 checklist: `.ux-design/08-promotion/v1.0-checklist.md`
- Brand book v0: `.ux-design/07-brand-book/BRAND-BOOK-v0.md`
- Brand state: `.ux-design/BRAND-STATE.md` · DECISIONS-LOG L1→L38
- Role × Views matrix: `docs/20-architecture/role-views-matrix.md`
- ADR-0023 SoT · ADR-0024 Phase 14.SH · ADR-0025 brand cycle sealed
