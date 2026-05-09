# heuresys-evo — Current State

> Updated: 2026-05-09T17:25Z · S22 closed (L49 process autonomous + theme-framework prod + canonical sweep)

## Last session brief (S22)

3 follow-up shipped come single commit, risolvendo le 3 open question lasciate da L48.

1. **Process autonomous role** (Q1): i 4 `process_*` (Phase 15.A) assegnati come dashboard secondary a HR_DIRECTOR + HR_MANAGER via `role_default_dashboards` (priority 10..40). Schema reshape: unique index ora su `(role, preset_code)` per consentire N preset per ruolo. Resolver helper `resolveAllPresetsForRole()` aggiunto. SIDEBAR_MAP estesa con `processSection` (4 nav links Process — Recruiting/Onboarding/Performance/Learning).
2. **Theme-framework portato in `/brand-studio`** (Q2): 3 file framework copiati in `services/app/src/{styles,lib}/theme-framework/`. Root layout async ora legge `active-palette.json` + cookie preview e applica `data-palette` + `data-theme` su `<html>` SSR. `BrandStudioClient` refactored con tab navigation: `Palette Presets` (grid 17×2 mini-cards 4 family) + `Token Editor` (esistente). Server actions nuove `applyPaletteToProject` / `setPreviewPalette` / `clearPreviewPalette`. Default `mu-architect/dark`. SUPERUSER-only invariato.
3. **Canonical sweep mockup** (Q3): rename completo `--brand-blue` → `--primary` su 17 file `.ux-design/06-mockups/` (12 dashboard + 5 auth, 98→0 occorrenze legacy). Production CSS sweep deferred (alias retrocompatibile `--primary: var(--brand-blue)` in `active-theme.css` copre il caso).

## Top priorities (S23)

1. **Production `/dashboard` refactor DB-driven** (~6-10h) — modificare `services/app/src/app/(app)/dashboard/page.tsx` + `_components/BrandShell.tsx` per consumare `chromeStandard` + `dashboardCode='*_v2'` dal catalog DB invece di hardcoded views. Carry-forward S20+S21+S22.
2. **Smoke verifica visiva 17 palette × 2 mode** (~1-2h) — `/brand-studio` SUPERUSER, click ogni palette+mode, verifica wordmark bicolor visibile + nessun broken contrast in dashboard production.
3. **Production CSS sweep `--brand-blue` → `--primary`** (~2-3h) — opzionale, ora alias attivo. Quando si decide canonical, rimuovere alias e migrare tutti gli `var(--brand-blue)` in `services/app/src/{styles,components,app}/`.
4. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI + manual NVDA/VoiceOver. Ora più importante perché il framework introduce 16 nuove combinazioni palette/theme.

## Open questions

- `process_*_v2` versioni in `dashboard_presets`: ora si usano i `process_*` Phase 15.A. Promotion in `*_v2` quando? (richiede mockup → dashboard_elements seed completo per i 4 process)
- Default palette: `mu-architect` / `dark` è OK come SSR default, oppure preferiamo `legacy` (Set 5) per preservare look storico?
- Token Editor (`/brand-studio`) e Palette Presets coesistono — qual è la SoT operativa? Editor scrive `active-theme.css`, Presets scrive `active-palette.json`. Non interferiscono ma definiscono due livelli diversi (tokens primitivi vs palette preset).

## Stack snapshot (changed in S22)

- NEW `services/app/src/styles/theme-framework/{palette-framework.css,active-palette.json}` (1646 lines CSS + JSON state)
- NEW `services/app/src/lib/theme-framework/{palettes.ts,active-palette-store.ts}` (TS catalog + file persistence)
- NEW `services/app/src/app/brand-studio/PalettePresetsTab.tsx` (client tab grid 17×2)
- NEW `db/seeds/phase15h_process_role_assignments.sql` (applied bare-metal SoT, 16 rows in `role_default_dashboards`)
- UPDATED `services/app/src/app/layout.tsx` (async + `data-palette`/`data-theme` SSR)
- UPDATED `services/app/src/app/brand-studio/{actions.ts,BrandStudioClient.tsx,page.tsx}` (palette server actions + tab nav)
- UPDATED `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` (`resolveAllPresetsForRole` helper)
- UPDATED `services/app/src/lib/navigation/role-nav-map.ts` (`processSection` for HR_DIRECTOR + HR_MANAGER)
- UPDATED `services/app/src/styles/active-theme.css` (`--primary` + `--primary-deep` alias retrocompatibile)
- UPDATED 17 mockup `.ux-design/06-mockups/` (rename `--brand-blue` → `--primary`)
- UPDATED `.ux-design/{DECISIONS-LOG.md,BRAND-STATE.md}` (L49 entry + Phase 15.D row + decision row)

## Verification

```bash
git log --oneline -3
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c 'SELECT role, preset_code, priority FROM role_default_dashboards ORDER BY role, priority'"
# Expected: 16 rows (8 primary @ priority=0 + 8 process @ priority=10..40 for HR_DIRECTOR + HR_MANAGER)
cd services/app && npx tsc --noEmit && npm test --silent
# Expected: typecheck PASS · 214/214 vitest PASS
```

Smoke browser:

- `/brand-studio` SUPERUSER → 2 tab visibili, palette grid 17×2 cliccabile, click cambia `<html data-palette>` live, "Apply" persiste in `active-palette.json`
- Login HR_DIRECTOR → sidebar mostra gruppo `Process` con 4 link (Recruiting/Onboarding/Performance/Learning) sotto Workspace
- `/dashboard/process_recruiting_funnel` carica view brand-fedele (presset Phase 15.A)

Riferimenti chiave: `.ux-design/DECISIONS-LOG.md` § L49 · `services/app/src/lib/theme-framework/` · `db/seeds/phase15h_process_role_assignments.sql`
