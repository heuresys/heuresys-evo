# heuresys-evo — Current State

> Updated: 2026-05-13T00:55Z · S55 closed · Open Q1+Q2 fixed · Priority #2 shipped (15 palette AAA) · Priority #1 audit baseline · Priority #3 partial · HEAD `dd0ede9`

## Last session brief

S55 ha chiuso **2 Open Questions + Priority #2 full + Priority #1 baseline audit + Priority #3 partial (HR_DIRECTOR 9/9)**. 4 commit shipped:

- `4964dba` deps lock canonical (`@next/bundle-analyzer` aggiunto a `services/app/devDep`)
- `7cf611f` Open Q1+Q2 fix (workforce SQL `org_unit_id` + `workforce_plan_scenarios` correzione tabella · Turbopack-native `next experimental-analyze -o` script + heap 4GB)
- `1c94acb` L76 WCAG AAA 15-palette batch sweep (beta, gamma, delta, epsilon, zeta, eta, theta, iota, kappa, lambda, mu-architect, mu-art-director, mu-pragmatic, mu-synthesis, mu-data-dense)
- `dd0ede9` L77 bundle perf audit doc + recommendations (`docs/_audit/2026-05-13-bundle-perf-audit-s55.md`)

**Workforce KPI live**: HEADCOUNT 156 · DEPARTMENTS 22 · PLANNING 9 · NEW HIRES 2 (RTL Bank, browser-verified valentina.conti).
**AAA palette**: 17/17 dark-base palette ora hanno tokens `--*-aaa` resolved (DOM verified 100%).
**Bundle baseline**: 6.82 MB shared first-load JS identificato come root cause Lighthouse Perf 58 / LCP 12.5s.

## Top priorities (S56+)

1. **Bundle perf implementation** (~12-20h, multi-sessione) — applicare audit recommendations: BrandShell dynamic import + palette-framework.css lazy load (pre-auth) + Prisma externals verify + brand-dashboard.css lazy. Target shared bundle <3 MB (-55%), Lighthouse Perf ≥ 90, LCP < 4s. Tool `npm run analyze` Turbopack-native già funziona end-to-end.
2. **Visual smoke matrix completion** (~2-3h) — estendere `tests/e2e/dashboard-rbp-matrix.spec.ts` per coprire le 9 navigation SURFACE (non solo i 9 dashboard codes già passing 100/100). 7 ruoli mancanti × 9 surface = 63 cases.
3. **Workforce seed enrichment AI-driven** (~3-5h) — popolare `workforce_plan_scenarios` per EcoNova (0) + SmartFood (0) + Heuresys (0). Vincolo permanente: seed via OpenAI con full DBMS context (vedi memoria `feedback_seed_via_openai.md`).
4. **AAA light-theme variants** (~2-3h) — 15 palette shippate solo dark-base. Light theme `--*-aaa` con valori dark-text-on-light (es. `#7e3fc8`, `#2452c8`, `#6a6a78`, `#16a34a`).

## Open questions

- CF#1 chunk duplicate-size 4 MB × 2: confermare hypothesis RSC+browser dup via interactive Turbopack analyzer (no `-o`, UI esplorativa).
- AAA palette light variants: paradigma esistente legacy + alpha non ha light AAA. Decision: estendere o solo dark?

## Stack snapshot (post-S55)

- 4 commit S55 shipped (`4964dba` → `dd0ede9`)
- WCAG 2.2 AAA: ✅ 17/17 palette dark-base con `--*-aaa` tokens
- Lighthouse `/login`: invariato S53 baseline (Perf 58, LCP 12.5s — bundle perf carry-forward S56+)
- Bundle baseline misurato: 6.82 MB first-load shared chunk + 2× 4 MB duplicate-size vendor chunks
- DECISIONS-LOG L1→L77, 0 orphans
- Nuovi files: `docs/_audit/2026-05-13-bundle-perf-audit-s55.md`
- `services/app/next.config.ts` ripulito (no withBundleAnalyzer wrap, Turbopack-native)
- `services/app/package.json` `analyze` script + NODE_OPTIONS heap 4GB su build
- Visual smoke HR_DIRECTOR 9/9 verified · altri 7 ruoli carry-forward (Playwright extension)

## Memory updates

- `feedback_seed_via_openai.md` (nuova): vincolo permanente seed enrichment AI-driven con DBMS context. Cross-link CASCADIA pipeline S35.2-7.

## Verification

```bash
LOCAL=$(git rev-parse HEAD); VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
# Workforce: HEADCOUNT 156 · DEPARTMENTS 22 · PLANNING 9 · NEW HIRES 2 (HR_DIRECTOR valentina.conti)
# AAA: getComputedStyle html con data-palette=mu-architect → --accent-aaa #d8b4fe
# Bundle: cd services/app && npm run analyze → cat .next/diagnostics/route-bundle-stats.json
```

Riferimenti: `.ux-design/DECISIONS-LOG.md` L76+L77 · `docs/_audit/2026-05-13-bundle-perf-audit-s55.md` · `services/app/{next.config.ts, package.json}` · `services/app/src/styles/theme-framework/palette-framework.css` · `services/app/src/app/(app)/analytics/workforce/page.tsx`.
