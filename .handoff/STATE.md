# heuresys-evo — Current State

> Updated: 2026-05-09T05:55Z · S21 closed (theme/palette framework v1 + L48)

## Last session brief (S21)

S21 brand workstream sub-session: theme/palette framework v1 shipped in `.ux-design/02-aesthetic/theme-framework/`. **L48** decision: 17 palette × 2 mode (dark+light) selezionabili real-time via `data-palette` + `data-theme` su `<html>`, tipografia preservata. Tre file drop-in: `heuresys-palette-framework.css` (1638 lines, 34 blocchi token canonici), `heuresys-palette-switcher.js` (227 lines, zero deps), `palette-playground.html` (~1200 lines, dashboard sidebar 280px + 10 sezioni content tra cui 3 matrici: color matrix completa, palette overview cliccabile cross-palette, button matrix 7 varianti × 3 stati). Wordmark body color canonicalizzato da `var(--brand-blue)` a `var(--primary)` (palette-aware). Auto-memory L27 aggiornata. Per ogni palette `--primary ≠ --accent` garantito → bicolor wordmark sempre visibile.

## Top priorities (S22)

1. **Production `/dashboard` refactor DB-driven** (~6-10h) — modificare `services/app/src/app/(app)/dashboard/page.tsx` + `_components/BrandShell.tsx` per consumare `chromeStandard` + `dashboardCode='*_v2'` dal catalog DB invece di hardcoded views. Carry-forward S20 #1.
2. **Mapping role → 4 process dashboards** (~2-3h) — decisione: process_*_v2 come sub-views HR_MANAGER OR autonomous role con entries proprie in `role_default_dashboards`?
3. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI integration + manual NVDA/VoiceOver pass.

## Open questions

- Process dashboards: HR_MANAGER multi-view (drilldown) vs autonomous role mapping (impatta `role_default_dashboards` + RBP)?
- Theme-framework adoption: resta strumento sperimentale `.ux-design/` only, OR portarlo in produzione come URL-route `/brand-studio` palette switcher? (out-of-scope L48)
- Migrazione mockup esistenti `var(--brand-blue)` → `var(--primary)`: opzionale (alias retrocompatibile attivo) o canonical sweep?

## Stack snapshot (changed in S21)

- NEW `.ux-design/02-aesthetic/theme-framework/` (3 file, ~3000 lines totali) — framework runtime palette switching multi-direction
- `.ux-design/DECISIONS-LOG.md`: L47 → **L48** (theme framework + wordmark `--primary`)
- `.ux-design/02-aesthetic/logo-standard.md`: body color canonical aggiornato → `var(--primary)` + history table entry L48
- `.ux-design/BRAND-STATE.md`: phase 15.C aggiunta + asset inventory theme-framework + decision row L48
- Auto-memory `feedback_logo_originale_l27.md`: regola CSS aggiornata + razionale palette-aware

## Verification

```bash
git log --oneline -3        # S21 commit + b4000aa S20 + b4da3d6 docs sync
start "" "D:\evo.heuresys.com\.ux-design\02-aesthetic\theme-framework\palette-playground.html"
# → dashboard sidebar + 17 palette cliccabili · bicolor wordmark visibile in ogni palette
```

Riferimenti chiave: `.ux-design/DECISIONS-LOG.md` § L48 · `.ux-design/02-aesthetic/theme-framework/` · `.ux-design/02-aesthetic/logo-standard.md` § L27+L48 · BRAND-STATE.md § Phase 15.C
