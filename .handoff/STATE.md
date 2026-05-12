# heuresys-evo — Current State

> Updated: 2026-05-12T03:28Z · S43 W5 visual baseline + Lighthouse 96 + a11y quick fixes

## Last session brief

S43: W5 Chrome MCP walkthrough complete. 9 screenshot full-page (7 legacy view + 2 G6 view) cross-role (EMPLOYEE + HR_DIRECTOR + SUPERUSER), Lighthouse audit consolidato (a11y 96 · best-practices 100 · SEO 100 · 35/37 audits passed). 4 a11y quick fixes applicati ai token CSS: removed opacity:0.5/0.6 su sidebar chev + BrandRbacMatrix level label, bumped `--ink-muted` 2 dark palettes, bumped `--ink-tertiary` alpha palette. Source clean; 1 residual rendering blocked da Turbopack cache (production build expected clean).

## Top priorities

1. **Re-run Lighthouse on production build** (~30min) — `rm -rf services/app/.next && npm run build && lighthouse` per conferma 100/100 a11y senza cache HMR.
2. **§ 1.2 employees vertical-split Phase 2** (~15-25h, architectural) — DROP COLUMN ×77 + 65 view dependency refactoring. Backup pre-attempt esistente.
3. **Bulk dark-palette WCAG audit** (~2h) — 10+ `--ink-tertiary` valori sotto threshold nelle palette beta/gamma/delta/epsilon. Solo `legacy + alpha` fixate in S43.
4. **Production perf bench** (~1-2h) — autocannon P95 ≤ 500ms su 8 viste auth-required.
5. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — 8 categorie asset checklist.

## Open questions

- **Font preload warnings**: 3 preload .woff2 warnings (Next.js Turbopack delayed parsing). Investigare `font-display: swap` + manifest pruning.
- **monthly_employee_snapshot mat view** (carry-forward S42): workforce-trend SQL on-the-fly. Promozione a mat view quando?

## Stack snapshot (post-S43)

- 7/7 legacy view + 2/2 G6 view visual baseline acquired (9 PNG, 2 lighthouse reports in docs/_audit/2026-05-12-w5-visual-baseline/)
- Lighthouse 96/100 a11y · 100/100 best-practices · 100/100 SEO (snapshot mode, desktop)
- 4 a11y source fix shipped: BrandRbacMatrix opacity removed · sidebar chev color upgraded · `--ink-muted` 2× bumped · `--ink-tertiary` alpha bumped
- 4/4 widget kinds api-bound (post-phase18o)
- 4 process_*_v2 preset (post-phase18p)
- 7/7 view Prisma-bound (no fixture residue), 5 data fetcher helper completi
- typecheck (services/app + api-gateway) + lint:mock-identities PASS

## Verification

```bash
# Quick re-run after CSS cache clear (production build)
rm -rf services/app/.next
npm run build --workspace=services/app
npm run dev --workspace=services/app &
# then Lighthouse via Chrome MCP

# Source-level contrast check
grep -E "opacity:\s*0\.[3-6]" services/app/src/styles/dashboard-brand.css
# expected: only decorative non-text elements (background dot, fill-opacity)
```

Riferimenti: `docs/_audit/2026-05-12-w5-visual-baseline/REPORT.md` · ADR-0028/29/30 · `db/migrations/phase18{m,n,o,p}*.sql`
