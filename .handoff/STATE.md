# heuresys-evo — Current State

> Updated: 2026-05-09T01:15Z · S19 closed (14 commit avanti S18)

## Last session brief (S19)

Brand dashboard catalog completato end-to-end: drift D1-D6 risolti (L41+L42), G1 catalogo formale (`docs/30-developer/brand-dashboard-catalog.md`), G4 DB schema hierarchy (`parent_element_id`+`variant`), G3+G3-bis 14 BrandWidget registrati + 4 layout containers, G5 DashboardRenderer flat+ricorsivo (199 test verde), **G6 full + adoption shipped**: 7 preset `*_v2` con 77 element seedati, `role_default_dashboards` switched, `dashboard/page.tsx` dual-path. 7 *View.tsx preserved come fallback.

## Top priorities (S20)

1. **🚨 Browser test G6 adoption** (~30min-1h) — login 8 ruoli su `/dashboard`, verifica DashboardRenderer rende vs view bespoke. Rollback SQL pronto in `db/seeds/phase15g6_full_preset_layouts.sql` (commenti finali).
2. **`prisma generate`** (~5min) — stop dev server (PID 1036+11716 lockano `query_engine-windows.dll.node`) → regen client G4 fields → refactor `dashboard/page.tsx` da `$queryRaw` a Prisma client native.
3. **G3-bis-completion** (~6-10h) — 5 widget mancanti per layout pixel-perfect: `BrandTenantCard`, `BrandMetricCard`, `BrandSectionHead`, `BrandIntRow`, `BrandAuditRow`.

## Open questions

- Browser test G6 adoption passed? Se KO → rollback SQL immediato.
- Delete 7 `_views/*View.tsx` ora (post-test ok) o batch con G3-bis-completion?
- Mockup HTML drift sync `.ux-design/06-mockups/dashboards/*.html` ora o post v1.0?

## Stack snapshot (changed in S19)

- BrandWidget catalog: 9 (1 unregistered) → **14** + 4 layout containers
- DB: 11 preset → **18** (+7 `*_v2` hierarchical) · 38 → **115** dashboard_elements · `role_default_dashboards` ora mappa a `*_v2`
- DECISIONS-LOG: L40 → **L45** (5 entries new in S19: L41-L45)
- Tests services/app: 186 → **199** (+13 dashboard-renderer + adapter)
- Schema.prisma: G4 fields formalized (regen pending S20 — dev server lock)

## Verification

```bash
git log --oneline -14   # S19 commits 3867c6a → c8548f4
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c \"SELECT role, preset_code FROM role_default_dashboards ORDER BY role;\""   # 8 ruoli → *_v2
npm run typecheck --workspace=services/app && npm test --workspace=services/app -- --run   # PASS · 199/199
```

Riferimenti chiave: `docs/30-developer/brand-dashboard-catalog.md` (G1) · `.ux-design/DECISIONS-LOG.md` § L41-L45 · `db/seeds/phase15g6_full_preset_layouts.sql` (G6 + rollback) · `services/app/src/components/DashboardRenderer.tsx` (G5+G5-phase-2)
