# Lighthouse /login — S53 baseline (2026-05-12T19:31Z)

URL: `https://evo.heuresys.com/login`
Lighthouse: 13.3.0
Mode: headless desktop, throttling default

## Scores

| Category       | Score   | Target | Status  |
| -------------- | ------- | ------ | ------- |
| Performance    | **58**  | ≥ 90   | ⚠️ FAIL |
| Accessibility  | **100** | ≥ 90   | ✅ PASS |
| Best Practices | **100** | ≥ 90   | ✅ PASS |
| SEO            | **100** | ≥ 90   | ✅ PASS |

## Core Web Vitals

| Metric      | Value     | Good    | Status       |
| ----------- | --------- | ------- | ------------ |
| FCP         | 1.2s      | < 1.8s  | ✅           |
| **LCP**     | **12.5s** | < 2.5s  | ❌ poor      |
| TBT         | 650ms     | < 200ms | ⚠️           |
| CLS         | 0         | < 0.1   | ✅           |
| Speed Index | 2.8s      | < 3.4s  | ✅           |
| TTFB        | 54ms      | < 600ms | ✅ excellent |

## Root cause analysis

**Server response excellent** (TTFB 54ms). LCP issue NOT server-side.

**Dominant cost**: `unused-javascript` audit reports **8.3s of unused JavaScript** in the bundle. JS bundle parsing/execution time blocks rendering of largest content element until 12.5s.

Probable causes:

1. **Next.js bundle bloat** — `services/app` may include un-tree-shaken dependencies (e.g., framer-motion, axe-core injection during dev, prisma client bleeding)
2. **No code splitting on `/login`** — route loads all dashboard/admin deps even though anonymous
3. **next/font + Aurora CSS gradients** — render-blocking parsing

## Carry-forward (S54+, larger scope)

- Bundle analyzer audit: `npm run build -- --analyze` o `@next/bundle-analyzer`
- Identify top contributors to `_app.js`, `framework.js` chunks
- Dynamic imports for non-critical components on `/login` (palette switcher, theme toggle if not needed pre-auth)
- Tree-shake review: `import { x } from 'lib'` patterns
- Font preload + `display: swap` (probabilmente già configurato)

## Effort estimate

12-20h: bundle analyzer + identifying top 5 contributors + code splitting + verify Lighthouse perf ≥ 90.

## Authentication-protected surfaces

`/dashboard`, `/me`, `/admin/audit` require active session. Lighthouse CLI standalone doesn't natively support cookie injection. Alternative bench: **S48 G6 dashboard perf bench** (P95 705ms HR_DIRECTOR, see `s48-g6-2026-05-12T04-39-06-779Z.md`) confirms backend response times within budget. Full Lighthouse perf audit for these surfaces requires puppeteer-driven approach (carry-forward).
