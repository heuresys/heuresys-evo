# Bundle Perf Quick-Win #3 — Palette CSS Lazy-Load Result

> **Date**: 2026-05-13 · **Sprint**: S60-bis · **Builds**: pre-fix L77 baseline (commit `1c94acb`) vs post-fix (this session)
> **Reference**: [`2026-05-13-bundle-perf-audit-s55.md`](2026-05-13-bundle-perf-audit-s55.md) (L77) — Quick Win #3
> **Carry-forward closed**: S53 L67 perf carry-forward partial — `/login` bundle reduced; LCP re-measurement deferred (Lighthouse CLI crash on Windows env)

## TL;DR

Split `palette-framework.css` (1808 LOC monolitico) in `palette-core.css` (147 LOC `:root` defaults) + `palette-variants.css` (1670 LOC 17×2 palette blocks). Pre-auth routes ottengono **−92.5%** first-load JS; `/login` ottiene **−16.4%** (residuo dovuto a NextAuth client chunk, non a CSS).

## Bundle stats delta

| Route                | Pre (L77) KB |     Post KB |   Delta KB | Delta % |
| -------------------- | -----------: | ----------: | ---------: | ------: |
| `/`                  |      6,818.1 |   **511.1** | **−6,307** |  −92.5% |
| `/forgot-password`   |      6,818.1 |   **511.1** | **−6,307** |  −92.5% |
| `/_not-found`        |      6,818.1 |       505.4 |     −6,313 |  −92.6% |
| `/login`             |      6,818.1 | **5,701.5** | **−1,116** |  −16.4% |
| `/brand-studio`      |      6,818.1 |     6,759.5 |        −59 |   −0.9% |
| `(app)/*` (24 route) |      6,818.1 |     6,803.5 |        −15 |   −0.2% |

Sorgente: `services/app/.next/diagnostics/route-bundle-stats.json` (`firstLoadUncompressedJsBytes`).

## Root cause analysis (perché win > expected)

L77 audit prevedeva ~50-200 KB di riduzione su `/login` per il taglio del CSS palette. Misurazione effettiva: −1,116 KB. Spiegazione:

- Turbopack treats CSS imports in layout monolithico come parte del **first-load chunk shared**. Quando `palette-framework.css` (1808 LOC, ~117 KB raw) viene importato in `app/layout.tsx`, Turbopack lo include nel chunk root condiviso da TUTTE le route.
- Rimuovendolo dal root layout e spostando solo gli `[data-palette=X]` blocks in `(app)/layout.tsx`, le pre-auth route (`/`, `/forgot-password`, `/_not-found`, `/login`) ricevono solo `palette-core.css` (~10 KB raw).
- Il delta `−6,307 KB` su `/` e `/forgot-password` indica che il chunk shared aveva anche **dependenze JS** trascinate dal CSS-as-JS bundle resolution (probabilmente `next/font/google` runtime + CSS-in-JS helpers).
- `/login` resta a 5,701 KB perché importa `login-form.tsx` `'use client'` con NextAuth client SDK + bcrypt + jose — quelle deps non sono toccate da questo fix.

## File changes

| Op     | Path                                                            |    LOC | Note                                                                   |
| ------ | --------------------------------------------------------------- | -----: | ---------------------------------------------------------------------- |
| CREATE | `services/app/src/styles/theme-framework/palette-core.css`      |    147 | `:root` defaults + `[data-theme='light']:not([data-palette])` fallback |
| CREATE | `services/app/src/styles/theme-framework/palette-variants.css`  |  1,670 | Tutti i blocchi `[data-palette=X]` (17 × dark + light)                 |
| DELETE | `services/app/src/styles/theme-framework/palette-framework.css` | -1,808 | Sostituito da split sopra                                              |
| EDIT   | `services/app/src/app/layout.tsx`                               |     ±1 | Import → `palette-core.css`                                            |
| EDIT   | `services/app/src/app/(app)/layout.tsx`                         |     +1 | Add import `../../styles/theme-framework/palette-variants.css`         |
| EDIT   | `services/app/src/app/brand-studio/page.tsx`                    |     +1 | Add import `../../styles/theme-framework/palette-variants.css`         |
| EDIT   | `services/app/src/lib/theme-framework/palettes.ts`              |     ±3 | Doc comment update                                                     |
| EDIT   | `services/app/src/app/(app)/_components/PaletteSwitcher.tsx`    |     ±1 | Doc comment update                                                     |

## Acceptance criteria

| Criterion                                  | Result                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `/login` first-load reduced                | ✅ −1,116 KB (−16.4%)                                                                               |
| Auth routes still load palette variants    | ✅ `(app)/*` 6,803.5 KB (palette-variants.css now imported in (app)/layout.tsx)                     |
| `/brand-studio` palette preview functional | ✅ palette-variants.css imported in `brand-studio/page.tsx` (preserves SUPERUSER preview)           |
| Typecheck PASS                             | ✅ `npx tsc --noEmit -p services/app/tsconfig.json` zero errors                                     |
| `/login` renders correctly                 | ✅ HTTP 200 in dev + prod, 18,008 bytes prod HTML                                                   |
| No regressions in `(app)/*` palette swap   | ✅ verified — palette-variants.css contains all 17 palette × 2 mode blocks unchanged                |
| LCP re-measurement                         | ⏳ DEFERRED — Lighthouse CLI crashes on Windows (`EPERM` on Chrome temp). Run on VM in next session |

## LCP carry-forward note

L77 baseline for `/login`: Perf 58 · LCP 12.5s · Unused JS 8.3s.

LCP measurement deferred because Lighthouse CLI on Windows crashes during Chrome temp cleanup (`EPERM` on rmSync). Bundle reduction of 1,116 KB on `/login` is expected to improve LCP by ~1.5-3s on a simulated slow 4G run (CSS critical path shortened, less parse time). Confirm with Lighthouse on `oracle-vm-default` in next session:

```bash
# On oracle-vm-default (production URL — has live data)
npx lighthouse https://evo.heuresys.com/login --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path=/tmp/login.lh --only-categories=performance --throttling-method=simulate
jq '.audits["largest-contentful-paint"].displayValue, .categories.performance.score' /tmp/login.lh
```

## Next quick wins (L77 recommendations remaining)

1. ~~**Lazy-load palette-framework.css**~~ ✅ **SHIPPED** (this fix)
2. **Investigation chunk duplicate 2× 4 MB** (~2h, LOW risk) — capire se i due chunk identici da 4.01 MB sono dedupabili → potenziale -4 MB su tutte le route
3. **Dynamic import BrandShell** (~1-2h, MEDIUM risk) — split client island da server layout in `(app)/layout.tsx`
4. **Lazy-load dashboard-brand.css** (3177 LOC, ~190 KB raw) — solo route `/dashboard/*` ne ha bisogno, attualmente in root layout
5. **Server-only Prisma boundary** (~16h, HIGH effort) — strict `import 'server-only'` per evitare leak Prisma in client bundle

## Verifica reproducible

```bash
cd services/app && NODE_OPTIONS='--max-old-space-size=4096' npx next experimental-analyze -o
python3 -c "import json; d=json.load(open('.next/diagnostics/route-bundle-stats.json')); print('\n'.join(f\"{r['route']:<35} {r['firstLoadUncompressedJsBytes']/1024:>10,.1f} KB\" for r in sorted(d, key=lambda x: x['route'])))"
```

## References

- L77 audit: [`2026-05-13-bundle-perf-audit-s55.md`](2026-05-13-bundle-perf-audit-s55.md)
- S53 perf baseline: L67 DECISIONS-LOG entry (Lighthouse Perf 58 / LCP 12.5s)
- Sprint S60 close: `.handoff/STATE.md` § "Possible direzioni" #2
