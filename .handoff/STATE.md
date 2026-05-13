# heuresys-evo — Current State

> Updated: 2026-05-13T00:15Z · S54 closed · P6 audit 100% + 6 CF shipped · HEAD `f8e8304`

## Last session brief

S54 ha chiuso **6/7 priorità S54+** (P6 W#1→W#7 + 6 carry-forward). 16 commit shipped: pgBouncer compliance (L68 `a5a07ad`), WCAG AAA palette legacy 22→0 (L69 `ceea454`+`d8ab1eb`), P6 audit completo step-by-step manuale (L70-L74 W#1 header mockup-as-SoT + W#2 KPI cards SQL aggregator runtime + W#3+W#4 body panels prod-as-shipped + #88 succession spotlight live + W#5 sidebar + W#6 user card full name + level + W#7 footer brand metrics live), CF batch (L75 phase18w cleanup 86 orphan + footer metric live + /analytics/workforce scaffold + AAA palette alpha + bundle-analyzer wired), L75-bis AAA strict fix (`--accent-aaa #d8b4fe` + `.btn-primary #5e2898` + `footerMetrics` prop wire). VM HEAD sync `f8e8304`.

## Top priorities (S55+)

1. **Bundle perf optimization full** (~12-20h, multi-sessione) — `@next/bundle-analyzer` già wired in `next.config.ts` ma `ANALYZE=true npm run build` non emette `.next/analyze/` (debug ESM import). Identificare top contributors `_app.js`+`framework.js`, dynamic imports su `/login` (palette/theme switcher pre-auth), tree-shaking review, target Lighthouse Perf ≥ 90 (current 58, LCP 12.5s).
2. **WCAG AAA su altre 14 palette** (~1-2h × 14 = 14-28h) — paradigma `--*-aaa` shipped per `legacy` (L69) + `alpha` (L75 CF#6). Estendere a 14 palette restanti in `palette-framework.css` (mu-architect-synthesis, beta, mu-synthesis-light, terracotta, blueprint, ecc.). Pattern proven, ratios calibrati (`#d8b4fe` per accent, `#60a5fa` per primary, `#b0b5c0` per ink-muted, `#4ade80` per success).
3. **Visual smoke 8 ruoli × 9 viste full** (~2-3h) — sample 4 surface HR_DIRECTOR shipped (L75 CF#3). Acceptance criteria final v1.0 = 72 screenshot login → 8 canonical RTL Bank users × 9 surface (login + dashboard + me + admin/audit + employees + reviews + onboarding + showcase + brand-studio).

## Open questions

- `/analytics/workforce` scaffold mostra 0 in tutti 4 KPI per RTL Bank tenant. SQL aggregator gira ma DB ha 0 workforce_planning_scenarios + employees senza department_id non-NULL. Carry-forward S55: data binding refinement o seed enrichment.
- CF#1 bundle-analyzer wiring: `@next/bundle-analyzer` ESM default import potrebbe non triggerare correctly su build standalone Next.js 16. Debug minor.

## Stack snapshot (post-S54)

- 16 commit S54 shipped (L68 `a5a07ad` → L75-bis `f8e8304`)
- WCAG 2.2 AAA: ✅ palette legacy + alpha (0 violations) · paradigm shipped per altre 14 palette
- Lighthouse `/login`: invariato S53 baseline (Perf 58 — bundle perf carry-forward)
- DECISIONS-LOG L1→L75 (+ L75-bis), 0 orphans
- DDL pre-push hook attivo (richiede DECISIONS-LOG L<N> pairing per ogni `db/seeds/phase*.sql`)
- Nuovi files: `phase18u_hr_director_kpi_aggregators.sql` + `phase18v_hr_director_succession_spotlight.sql` + `phase18w_cleanup_succession_candidates_orphans.sql` + `services/app/src/app/(app)/analytics/workforce/page.tsx`
- BrandShellProps esteso: `roleLevel?: number | null` + `footerMetrics?: { cycle: string; reviewsPct: number | null }`
- DB cleanup: 86 succession_candidates orphan critical_role_id → NULL + FK `ON DELETE SET NULL` aggiunto

## Verification

```bash
LOCAL=$(git rev-parse HEAD); VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
# Visual: /dashboard HR_DIRECTOR → KPI live (156/38%/552/18) + RBAC matrix + Activity feed + Valentina Conti user-card + footer CYCLE Q2 2026 + REVIEWS 38%
# axe: 0 AAA + 0 AA su /dashboard, /me, /admin/audit, /analytics/workforce (palette legacy/dark)
# DB orphan check: SELECT COUNT(*) FROM succession_candidates sc WHERE sc.critical_role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM succession_plans WHERE id = sc.critical_role_id) → 0
```

Riferimenti: `.ux-design/DECISIONS-LOG.md` L68→L75-bis · `db/seeds/phase18{u,v,w}*.sql` · `services/app/src/app/(app)/{layout.tsx,_components/BrandShell.tsx,analytics/workforce/page.tsx}`.
