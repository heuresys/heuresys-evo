# Bundle Performance Audit — S55 L77

> **Date**: 2026-05-13 · **Sprint**: S55 · **Build ID**: post-1c94acb (L76 deploy)
> **Source**: `next experimental-analyze -o` Turbopack-native (CF#1 closure + Open Q2)
> **Lighthouse baseline**: `/login` Perf 58 · LCP 12.5s · Unused JS 8.3s

## TL;DR

**ALL 25 routes carry ~6.82 MB first-load uncompressed JS** — sintomo di un singolo shared layout chunk gigante che eager-loada deps non utilizzate. Top contributor: 2 chunk di 4.0 MB ciascuno (forse duplicati). Quick win realistico = 40-60% reduction (~3 MB).

## Top routes by first-load JS

| Route                    | First-load JS (KB) | Note                             |
| ------------------------ | ------------------ | -------------------------------- |
| `/dashboard`             | 6,835.1            | +11 KB route-specific            |
| `/dashboard/[code]`      | 6,835.1            | same shared bundle               |
| `/dashboard/[code]/edit` | 6,824.2            | drag-resize editor (Sprint 3.C)  |
| `/ontology`              | 6,820.8            | OpenAI advisor                   |
| `/explorer/esco`         | 6,819.5            | KG explorer                      |
| `/settings`              | 6,818.7            | preferences + theme              |
| Tutti gli altri (19)     | 6,818.1            | identical baseline shared bundle |

## Top chunks by size

| Chunk              | Size (MB) | Note                                               |
| ------------------ | --------- | -------------------------------------------------- |
| `0~2_l4levxehq.js` | 4.01      | duplicate-size — probabile React DOM o Prisma core |
| `0elkoda2_n2m9.js` | 4.01      | duplicate-size — sospetto duplicato per RSC/SSR    |
| `0100pdu063_k5.js` | 1.11      | probabile vendor framework (React)                 |
| `0z48c8.1p8kgc.js` | 0.46      | mid-tier vendor                                    |
| `0y99xmlf_e2si.js` | 0.43      | mid-tier vendor                                    |
| 25 chunk in più    | <500 KB   | total                                              |

## Root cause analysis

1. **Shared layout monolithico** — `services/app/src/app/(app)/layout.tsx` (173 LOC) importa `prisma`, `BrandShell`, `getNavForUser`, `resolveUserPalette`. Mentre `prisma` è server-only, BrandShell è client (con LocaleSwitcher, ThemeToggle, UserMenu) e il chunk include tutti i palette/theme assets. Eager-loadati per tutte le route.

2. **Bundle duplicato 2× 4 MB** — entrambi i chunk hanno size identica (`4,009,244` byte). Possibile RSC + browser bundle dello stesso vendor. Investigation richiesta per confermare e dedupe.

3. **Turbopack chunk-naming illeggibile** — i chunk hanno hash random invece di nomi semantici (`react.js`, `prisma.js`). Ostacola debug. Soluzione: usare `next experimental-analyze` interattivo (no `-o`) per UI esplorativa.

4. **No dynamic imports su `/login`** — pre-auth route eredita lo shared bundle. Palette/theme switcher pre-auth (8 direzioni estetiche α-θ + 17 palette) pesa molto.

## Recommendations (carry-forward S56+)

### Quick wins (1-2h ciascuno)

1. **Dynamic import `BrandShell`** in `(app)/layout.tsx` con `loading` placeholder → split client-side chunk dalla server layout
2. **Verify Prisma client not in client bundle** — check next.config webpack/turbopack externals
3. **Lazy load palette-framework.css** — 1673 LOC × 17 palette su `/login` pre-auth è waste
4. **Lazy load brand-dashboard.css** — solo dashboard route ne ha bisogno

### Medium effort (4-8h)

5. **Split BrandShell client islands** — LocaleSwitcher, ThemeToggle, UserMenu come `'use client'` separati con dynamic import per route che li usano
6. **Code-split per route group** — `(app)/`, `(public)/`, `/admin/*` con shared chunk minimo
7. **Audit `packages/ui`** — verificare tree-shaking funzionante (180 component, molti unused per route)

### Long term (16+ h)

8. **Server-only Prisma boundary** — strict separation con `import 'server-only'` directive
9. **Edge runtime per route static** — login, public, forgot-password
10. **Bundle budget enforcement** — CI step blocca PR con first-load >2 MB

## Verification (S56 acceptance criteria)

```bash
# Re-analyze post-fix
cd services/app && npm run analyze
# Check route bundle stats
python3 -c "import json; d=json.load(open('.next/diagnostics/route-bundle-stats.json')); [print(f\"{r['route']:<35} {r['firstLoadUncompressedJsBytes']/1024:>10,.1f} KB\") for r in sorted(d, key=lambda x: -x['firstLoadUncompressedJsBytes'])[:10]]"

# Target: <3000 KB shared bundle (-55% reduction)
# Lighthouse: Perf ≥ 90 · LCP < 4s
```

## References

- S55 L76: WCAG AAA 15-palette batch (commit `1c94acb`)
- S55 L77 (this audit)
- S53 L67: Lighthouse baseline (Perf 58, LCP 12.5s)
- Next.js 16 Turbopack: https://nextjs.org/docs/app/guides/package-bundling
- `services/app/next.config.ts` — wrapper bundle-analyzer rimosso (incompat Turbopack)
- `services/app/package.json` — script `analyze` aggiunto (`next experimental-analyze -o`)
