# heuresys-evo — Current State

> Updated: 2026-05-12T19:45Z · S53 closed · P4 AA + P5 partial signed-off · HEAD `678c1a7`

## Last session brief

S53 ha chiuso 2 priorità Top S51+: **P4 WCAG 2.2 AA sign-off** (L66, commit `6675f90`) e **P5 Lighthouse partial sign-off** (L67, commit `6a30deb`). P4: 4 real violations fixate (sidebar `<h4><button>` + `main tabIndex={-1}` + `.pill-info`/`.filter-pill.active` contrast var(--ink)+bold). 4 surface ✅ AA PASS. P5: `/login` Lighthouse 3/4 categories ≥ 90 (a11y/BP/SEO 100). Perf 58 (LCP 12.5s, 8.3s unused JS) carry-forward. Auth-protected surfaces backup ref S48 G6 P95 705ms. **6/7 priorità S51+ chiuse**. VM HEAD `6675f90` (rebuilt + restart con WCAG fixes).

## Top priorities (S54+)

1. **P6 Dashboard widget visual audit** (~2-3h) — `/brand:audit` cycle su `/dashboard` HR_DIRECTOR vs mockup canonical hr-director-overview.html side-by-side. Visual dependent.
2. **WCAG 2.2 AAA enhanced contrast** (~2-3h) — 4 nodi residui (`.t-avatar` text + sidebar h4 span). Palette token rebalance (es. accent variant più light su dark surfaces o ribilanciare accent-soft).
3. **Bundle perf optimization** (~12-20h) — `@next/bundle-analyzer` audit, identify top contributors `_app.js`+`framework.js`, dynamic imports su `/login` (palette/theme switcher pre-auth?), tree-shaking review, verify Lighthouse perf ≥ 90 post-fix.
4. **/analytics/workforce page** (~1h) — route linkato in sidebar ma 404 (no page.tsx).
5. **Visual smoke 8 ruoli × 9 viste** (~2-3h) — 72 screenshot acceptance criteria final v1.0.

## Open questions

- pgBouncer transaction mode vs Prisma `$transaction` complesse → eventuale `pool_mode=session` su connection-string dedicata.

## Stack snapshot (post-S53)

- 17 commit S50→S53 shipped, HEAD `678c1a7`
- WCAG 2.2 AA: ✅ signed off (`6675f90` BrandShell + dashboard-brand.css)
- Lighthouse `/login`: A11y/BP/SEO 100, Perf 58 (LCP 12.5s — bundle optimization needed)
- DECISIONS-LOG L1→L67, 0 orphans
- `.husky/pre-push` DDL→L\<N\> gate attivo
- Project default palette `legacy` canonical (`#3b82f6` primary + `#a855f7` accent)
- Phase 2 employees vertical-split LIVE (employees=VIEW, employees_core=TABLE, 209 FK, 3 INSTEAD OF triggers)

## Verification

```bash
LOCAL=$(git rev-parse HEAD); VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
# WCAG verify (browser): /dashboard with palette legacy → 0 real violations
# Lighthouse re-run: npx lighthouse https://evo.heuresys.com/login --quiet
```

Riferimenti: `.ux-design/DECISIONS-LOG.md` L66 (P4 WCAG AA) · L67 (P5 Lighthouse) · `scripts/perf/results/lh-login-S53.md` (bench report).
