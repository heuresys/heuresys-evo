# heuresys-evo — Current State

> Updated: 2026-05-09T05:15Z · S20 closed (7 commit avanti S19)

## Last session brief (S20)

S20 brand dashboard governance shift: catalog DB della webapp `09-asset-showcase` (Express+Prisma+SQLite locale, gitignored) diventa SoT operativa stable. **L46** (commit `15e9458`): chrome universal cross-role 18 asset + body org-systems IT_ADMIN + concetti `chromeStandard`/`dashboardCode`/`mockupSource`/`behaviorsJson`. **L47** (commit `08b2097`): body-only import 10 mockup rimanenti, **11 dashboardCode `*_v2` mappati**, ~50 nuove classi canonical CSS, 8 conflict resolutions. Inoltre S20 priorità storiche shipped pre-L46: G6 browser test 8 ruoli verde, prisma generate + refactor `dashboard/page.tsx` native, G3-bis-completion (5 widget). Webapp showcase live `localhost:5174` (346 assets · 138 promoted · 374 variants).

## Top priorities (S21)

1. **Production `/dashboard` refactor DB-driven** (~6-10h) — modificare `services/app/src/app/(app)/dashboard/page.tsx` + `services/app/src/app/(app)/_components/BrandShell.tsx` per consumare `chromeStandard` (universal chrome) e `dashboardCode='*_v2'` (body role-specific) dal catalog DB invece di hardcoded views. Out-of-scope L46/L47, primo step naturale.
2. **Mapping role → 4 process dashboards** (~2-3h) — decisione: `process_recruiting_funnel_v2`/`process_onboarding_flow_v2`/`process_performance_cycle_v2`/`process_learning_paths_v2` come sub-views HR_MANAGER OR autonomous role con entries proprie in `role_default_dashboards`?
3. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass. Carry-forward S19 backlog.

## Open questions

- Process dashboards: HR_MANAGER multi-view (drilldown) vs autonomous role mapping (impatta `role_default_dashboards` + RBP)?
- Webapp showcase port 5174: confirm zero conflitti con altri tool locali?
- Production refactor: full sweep DB-driven OR opt-in per dashboardCode (gradual migration)?

## Stack snapshot (changed in S20)

- Catalog DB webapp: NEW `.ux-design/09-asset-showcase/` (gitignored eccetto `_legacy/`) · 346 assets · 138 promoted · 374 variants · 11 dashboardCode mappati
- `dashboard-brand.css`: ~2370 → **~2670 righe** (+300 L47 block: chart-wrap · gauge-wrap · table.dept · succession-row · kg-canvas · ontology · profile-hero · arc · bridge-grid · process viz · pill-cap-* · kpi-card.compact · gauge-card.large · wordmark-original)
- Mockup HTML allineati canonical: `.status-pill`/`.theme-toggle`/`.bar-fill alias`/`.kpi-row alias` rimossi da 10 mockup
- DECISIONS-LOG: L45 → **L47** (2 entries new: L46 chrome universal · L47 body 10 mockup)
- BrandWidget services/app: 14 + 4 layout containers → **19 + 4** (+5 G3-bis: BrandTenantCard · BrandMetricCard · BrandSectionHead · BrandIntRow · BrandAuditRow)
- Tests services/app: 199 → **214** (+15 G3-bis unit) · prisma client regenerated (G4 fields native)

## Verification

```bash
git log --oneline -7    # S20 commits c94fde5 → b4da3d6
cd .ux-design/09-asset-showcase && npm run dev    # webapp catalog → http://localhost:5174
curl -s http://localhost:5174/api/stats           # 346 total · 138 promoted · 374 variants
```

Riferimenti chiave: `.ux-design/DECISIONS-LOG.md` § L46+L47 · `~/.claude/plans/flickering-painting-globe.md` · `09-asset-showcase/README.md` · CLAUDE.md § L46+L47 governance shift · BRAND-STATE.md § Phase 15.B
