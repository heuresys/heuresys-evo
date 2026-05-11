# heuresys-evo — Current State

> Updated: 2026-05-11T14:38Z · S34 closed · brand chrome switcher + dashboard audit Phase 0+1 shipped

## Last session brief

S34 (~9h FTE): (1) feature **per-user palette switcher** in BrandShell topbar (chrome standard, sibling of ThemeToggle/LocaleSwitcher, scope effect `/dashboard/*` via DashboardPaletteApplier) — commit `150518c`. (2) **Forensic audit dashboard Phase 0 baseline + Phase 1 critical fixes** — commit `cab78bd`: F-009 unify renderers (DashboardGrid→DashboardRenderer in `[code]/page.tsx`), F-002 layout-doubleSplit/mainSplit resolved, F-003 perpetual LOADING resolved, F-001 strip duplicate `<h2>` da 5 brand widget, F-010 root title localizzato da `dashboard_presets.name_it/name_en`. Side: `is_published=true` su 7 `_v2` preset. Plan canonical: `~/.claude/plans/cheeky-puzzling-clarke.md`.

## Top priorities

1. **Audit Phase 2 — data binding mock → live** (~12-18h FTE) — sweep 19 widget in `services/app/src/lib/dashboard-engine/registry.tsx` per sostituire demo fallback con `useWidgetData()` + API live. Strip hardcoded names (`Maria Rossi`, `Luca Bianchi`, `Stefania Bianchi`, `Gabriele Amato`). Convert seed `phase15g6_full_preset_layouts.sql` da `data_source.type='static'` → `'api'`. Acceptance: zero demo strings + skeleton fallback su API error.
2. **Audit Phase 3 — canonical brand alignment via Studio** (~10-14h FTE) — `/studio:clone` per ognuna delle 11 dashboard, diff vs `.ux-design/06-mockups/dashboards/*.html`, allineare a 134+ classi `dashboard-brand.css`, promote one-by-one via 5-gate flow. Target: `brand:audit` score ≥ 85.
3. **Audit Phase 4 — legacy retirement** (~4-6h FTE) — delete 7 `_views/*.tsx` (2242 LOC) + simplify `dashboard/page.tsx` switch + E2E Playwright spec 88 cells.

## Open questions

Nessuna bloccante. Decisioni pre-Phase 2:
- F-005 hardcoded data: tutte 19 widget demo → live, oppure mantenere alcune come "seed esplicito" per dashboard demo stakeholder?
- F-008 persona_label: rinominare "IT Admin · G6 smoke" → "Audience: IT_ADMIN" oppure lasciare metadata letterale?

## Stack snapshot (post-S34)

- **Brand chrome**: `BrandShell.tsx` topbar ora include `<PaletteSwitcher>` (universal control) accanto a `LocaleSwitcher` + `ThemeToggle` + `UserMenu`. Effetto palette scope `/dashboard/*` via `DashboardPaletteApplier` (apply `<html data-palette={X} data-theme={Y}>` on mount, cleanup on unmount).
- **Schema**: `users.palette_preference_id VARCHAR(32)` + `users.theme_preference VARCHAR(8)` nullable + 2 CHECK constraints (17 palette + 2 theme whitelist DB-level). Migration `db/migrations/phase17a_user_palette_preference.sql` applicata su VM.
- **Dashboard renderer**: **unified** — `DashboardRenderer` (lib/dashboard-engine/registry) usato da entrambe `/dashboard` root + `/dashboard/[code]`. `DashboardGrid` (grid.tsx) ora orphan, candidate Phase 4 deletion.
- **Preset publish**: tutti 7 `_v2` preset + 4 process preset = `is_published=true` (impersonation cross-role abilitata).
- **Tests**: typecheck PASS · `npm run lint:tenant-id` exit 0.

## Verification

```bash
git log --oneline -5
# expected: cab78bd + 150518c + 1a61d62 + 382a94f + 9ee6ae6

npx tsc --noEmit -p services/app/tsconfig.json
# expected: exit 0 (no errors)

ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT count(*) FROM dashboard_presets WHERE is_published=true AND code ~ ('\''_v2$|^process_'\'')"'
# expected: 11 (7 _v2 + 4 process)

# Live dashboard (any logged-in user):
# https://evo.heuresys.com/dashboard → header "Direzione HR (G6)" (localized), no duplicate widget titles, palette switcher in topbar
```

Riferimenti: `~/.claude/plans/cheeky-puzzling-clarke.md` (audit plan canonical 5 fasi) · `.ux-design/audit/AUDIT-GRID.md` (Phase 0 grid 16 cells) · `.ux-design/audit/BASELINE-REPORT.md` (10 findings F-001..F-010 with root cause + fix scope per phase).
