# D4 — Frontend & Design System Assessment

> **Auditor**: Senior Frontend Engineer & Design System Specialist
> **Data**: 2026-05-10
> **Scope**: Next.js 16 App Router (services/app) · packages/ui v2.0-extended · Storybook 9 governance · brand workstream `.ux-design/`
> **Method**: ADR review (0014, 0017) · package manifest inspection · component glob (~180 file) · pages topology · grep `'use client'`/`next/image`/`dynamic`/`<Suspense`/`'use server'`
> **Vincolo**: read-only audit, nessuna modifica

---

## TL;DR (≤80 parole)

Design system **maturo nello scope** (~180 component, 95 story, Radix+CVA+Tailwind 4) ma **in fase "Expand" non ancora "Use/Scale"**: bundle budget non enforced, RSC default rispettato (17 file `'use client'` in basso nell'albero), boundary loading/error **assenti** e `next/image` **zero adoption** sono red flag. Brand workstream **chiuso** (Phase 1→12 done, contrariamente al brief), asset acquisibile maturo. Severity: **0 critical, 2 high, 4 medium, 2 low**. **Preliminary verdict D4: NEGOTIATE.**

---

## Severity overview

| Severity | Count | Findings                                                                                                                         |
| -------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| Critical | 0     | —                                                                                                                                |
| High     | 2     | F4.1 boundary RSC mancanti · F4.2 next/image zero adoption                                                                       |
| Medium   | 4     | F4.3 dep sprawl 80+ pkg · F4.4 lint disabled · F4.5 Storybook coverage 95/180 · F4.6 next-themes assente vs ThemeProvider custom |
| Low      | 2     | F4.7 brief mismatch su Phase 4 · F4.8 build script bash-only                                                                     |
| None     | 1     | Strengths section                                                                                                                |

---

## Findings

### F4.1 — Loading/Error boundaries RSC assenti (HIGH)

**Evidence**: `Glob services/app/src/app/**/loading.{tsx,ts,jsx,js}` → **0 file**. `Glob …/**/error.{tsx,ts,jsx,js}` → **0 file**. `Grep '<Suspense'` su `services/app/src` → **0 occorrenze**. Convention doc ADR `nextjs-app-router-conventions.md` raccomanda esplicitamente Suspense + loading.tsx + error.tsx negli esempi (linee 22-25, 50-58).

**Detail**: Le 24 pagine in `(app)/` route group sono RSC async che fanno query Prisma direttamente nel layout (`auth()` + `prisma.tenants.findUnique` in `(app)/layout.tsx:18-46`) e nei page. Senza `loading.tsx` o `<Suspense>`, ogni navigazione è bloccante full-page — l'utente vede schermo bianco fino a query DB completata. Senza `error.tsx`, un throw in RSC propaga all'`error.tsx` root che non esiste → 500 grezzo invece di UX gestita.

**Risk**: UX degradata su latency variabile (es. tenant lookup + nav resolution + DB query iniziale). Acquirer post-merger che spinge traffico moltiplicato vedrà spike P95 e zero graceful degradation. Mitigation effort: ~6-10h (1 loading.tsx + 1 error.tsx per route group + Suspense wrap delle data-heavy components).

### F4.2 — `next/image` zero adoption (HIGH)

**Evidence**: `Grep "from 'next/image'"` su `services/app/src` → **0 occorrenze**. Stack ha React 19 + Next.js 16 dove `next/image` fornisce ottimizzazione automatica (AVIF/WebP, lazy, responsive srcset, blur placeholder).

**Detail**: 84+ Storybook story `brand/` in `packages/ui/src/stories/brand/` includono asset visivi pesanti (mockup screenshots, palette demos, motion prototypes). La webapp `09-asset-showcase` cataloga 346 asset di cui 138 promoted. Ogni `<img>` raw bypassa Next.js image pipeline → bandwidth waste + CLS rischio + LCP penalty.

**Risk**: Web Vitals impact diretto (LCP, CLS). Per SaaS B2B con dashboard data-heavy l'effetto cumulativo su pagine list/detail employees + asset showcase è significativo. Mitigation: refactor sistematico `<img>` → `<Image>` (~4-6h) + config remotePatterns `next.config.ts`.

### F4.3 — Dependency sprawl `packages/ui` (MEDIUM)

**Evidence**: `packages/ui/package.json` dichiara **80+ runtime deps** post-ADR-0017 (echarts + recharts entrambi presenti, three.js + @react-three/fiber + @react-three/drei, reactflow + cytoscape, mermaid, katex, signature_pad + react-signature-canvas, AI SDK Vercel `ai^6`, lottie, confetti). 25 Radix primitives, 4 chart libs paralleli.

**Detail**: ADR-0017 dichiara "tree-shakeable named exports, consumer pays only for what's imported" ma:

- **No bundle analyzer wired** (`webpack` analyzer non in scripts services/app)
- **No size-limit/bundlesize CI gate** (ADR-0014 §"Bundle size services/app monitorato via budget B12.5 < 500KB initial JS" non implementato)
- **Duplicazioni**: `recharts` + `echarts` + `d3` (3 charting toolkit con overlap funzionale ~70%)
- **`use-gesture` v1 + `@use-gesture/react` v10** entrambi presenti (legacy + new API coesistono)

**Risk**: bundle initial dell'app potrebbe essere multi-MB. Audit bundle (~2h) chiarirebbe ma è fondato il sospetto. Acquirer mobile/3G perception deteriorata. Tech debt per consolidare (rimuovere recharts in favor di echarts solo, rimuovere `use-gesture` legacy): 4-6h.

### F4.4 — Lint disabilitato a livello workspace (MEDIUM)

**Evidence**:

- `packages/ui/package.json:18` → `"lint": "echo '@heuresys/ui: lint via tsc only' && exit 0"`
- `services/app/package.json:11` → `"lint": "echo '@heuresys/app: lint via tsc only (next lint deprecato in Next.js 16, ESLint flat config TBD)' && exit 0"`

**Detail**: ESLint 10 + `eslint-config-next 16.2.4` sono installati come devDeps (services/app:53-54) ma **non eseguiti**. Il commento dichiara `next lint` deprecato in Next.js 16 con flat config TBD — task aperto da quando il workspace è stato migrato a Next 16. `tsc --noEmit` cattura type errors ma non a11y rules, react-hooks/exhaustive-deps, no-array-index-key, ecc.

**Risk**: regressioni tipiche React (stale closure, hook deps) e a11y bypass non bloccate in CI. Effort flat config wire: 2-3h (config + integrate husky `lint-staged`).

### F4.5 — Storybook coverage 95/180 component (MEDIUM)

**Evidence**: `Glob packages/ui/src/components/**/*.tsx` → ~180 component files (truncated). `Glob packages/ui/src/**/*.stories.tsx` → **95 stories** (di cui 17 in `stories/brand/` documentazione, 78 component story).

**Detail**: ADR-0017 §"Future work explicit" dichiara apertamente: _"Storybook stories for batches 2-4 components (each Tier ≥ 1 representative story) — biggest gap"_. Component senza story: tutto `xr/three-scene` ha story ma molti collab/markdown/files no, vari pattern data-table varianti mancano. Visual regression baseline (ADR-0017 future work #2) **non implementata** — nessun Playwright snapshot setup in `services/app/playwright.config.ts` (referenced in scripts:21).

**Risk**: design system "shipped" senza copertura visiva = drift silente. Componenti non visti per mesi possono breakare silently su Tailwind 4 / React 19 minor bumps. Effort baseline: ~12-16h per coprire 85 component restanti con 1 story default + a11y addon attivo.

### F4.6 — ThemeProvider custom vs next-themes (MEDIUM)

**Evidence**: `packages/ui/src/components/theme-provider.tsx` esiste ma **`next-themes` non in deps** (né in `services/app` né in `packages/ui`). ADR-0014 dichiara "dark mode + brand variants via tokens.css, runtime switch via ThemeProvider".

**Detail**: 17 palette × 2 mode (Phase 15.C) gestite via `data-palette` + `data-theme` attributes su `<html>` con server action `applyPaletteToProject`/`setPreviewPalette`. Approach custom funziona ma non gestisce flicker (FOUC) standard di next-themes (`<script>` blocking pre-hydration). Root layout async legge `active-palette.json` + cookie preview (Phase 15.D L49) — soluzione corretta server-side ma fragile per user toggle real-time.

**Risk**: bassa per produzione (default applied SSR), ma rebuilding il theme switcher è stata già richiesta più volte nei sprint (palette playground, brand-studio refactor). Riscrittura con next-themes + data-attribute custom adapter: 3-4h, riduce future maintenance.

### F4.7 — Brief mismatch: Phase 4 NON è in re-exploration (LOW)

**Evidence**: il prompt task dichiara _"Brand workstream state (Phase 4 in re-exploration con 8 direzioni α-θ pending)"_. La realtà in `.ux-design/BRAND-STATE.md:16` è opposta: **Phase 4 ✅ CHIUSA — D1 risolto** (μ-architect-legacy scelta dopo 32 direzioni esplorate Set 1+2+3+4+5). Phase 1→12 tutte ✅ Done, Phase 13 ✅ DONE, Phase 14 🟢 Sprint 1+2.E shipped, Phase 15.A-F tutte ✅ Done.

**Detail**: il documento BRAND-STATE.md §"Decisioni risolte" linee 64-72 conferma D1/D2/D3/D4 tutte chiuse. Nessuna decisione bloccante pending. Brand identity cycle "ufficialmente chiuso" (ADR-0025) con Brand Book v0 shipped (Phase 12).

**Risk**: se l'acquirer si basa sul brief originale del task (non su BRAND-STATE.md), sovrastima il rischio brand. Riallineamento informativo durante DD interview chiarisce.

### F4.8 — Build script bash-only su Windows monorepo (LOW)

**Evidence**: `services/app/package.json:9` → `"build": "next build && cp -r public .next/standalone/services/app/ 2>/dev/null; …"`. Usa `cp`/`mkdir -p` POSIX. Repo è dichiaratamente cross-platform (Windows primary editor, VM Linux runtime).

**Detail**: `cp -r` su PowerShell 5.1 Windows fallisce (non è alias — è Copy-Item). Su Git Bash funziona. CI gira presumibilmente Linux quindi non è bloccante per deploy, ma developer Windows che lancia `npm run build` localmente fallisce.

**Risk**: minore, manifesto solo in scenari edge. Mitigation: usare `cpx` o script Node 1-liner cross-platform (~30min).

---

## Design system maturity assessment

| Stage      | Required signal                                          | heuresys-evo state             | Verdict    |
| ---------- | -------------------------------------------------------- | ------------------------------ | ---------- |
| Foundation | Tokens · primitives · types                              | OKLCH tokens, 25 Radix, CVA    | ✅ Done    |
| Expand     | Pattern coverage breadth · domain primitives             | ~180 component, 16 tier        | ✅ Done    |
| **Use**    | Adoption tracked · stories ≥1 per component · a11y rules | **95/180 stories, no a11y CI** | 🟡 Partial |
| Scale      | Bundle budget enforced · visual regression · semver      | Nessuno dei tre                | ❌ No      |

**Stage corrente: Expand → Use transition incompleta.** Ottimo asset bruto (catalog ricco coerente con direttiva Enzo "ventaglio estremamente esteso"), governance acquirer-grade ancora **non in place**.

## App Router pattern adherence

| Pattern                | Adherence | Evidence                                                                |
| ---------------------- | --------- | ----------------------------------------------------------------------- |
| RSC default            | ✅ Strong | 17 file `'use client'` su 24 page + ~50 component = ratio sano          |
| Client island in basso | ✅        | `'use client'` solo in `_components/AppShellClient`, `login-form`, ecc. |
| Server Actions         | 🟡        | Solo 1 file (`brand-studio/actions.ts`) — sotto-utilizzato vs ADR       |
| Suspense streaming     | ❌        | 0 `<Suspense>` in app code (vedi F4.1)                                  |
| loading.tsx/error.tsx  | ❌        | 0 file (vedi F4.1)                                                      |
| Parallel/intercepting  | ❓        | ADR documenta pattern ma nessun uso in (app)/ scopo                     |
| `dynamic()` lazy load  | 🟡        | 2 occorrenze (DashboardEditor) — sotto-utilizzato per chart heavy       |
| `next/image`           | ❌        | 0 (vedi F4.2)                                                           |
| Metadata API           | ❓ NV     | Non auditato in questa run                                              |

## Brand workstream — asset o liability?

**Asset.** Contrariamente al brief task, il workstream `.ux-design/` è **chiuso e maturo**:

- 12 phase complete (foundations → brand book v0)
- 4 decisioni storiche bloccanti (D1-D4) tutte risolte
- Brand book consolidato come single entry point unificato
- 17 palette × 2 mode framework runtime production-wired (Phase 15.C-D)
- Catalog DB SQLite locale (346 asset · 138 promoted) come SoT operativa

**Segregazione corretta**: `.ux-design/` esclusa da build pipeline, zero import in production code (vincolo enforced via README policy). Webapp `09-asset-showcase` è dev-only localhost. **Zero contaminazione** del bundle production. **Acquisibile in toto** come IP brand.

L'unica residua "liability" minore: la coesistenza tra `brand-dashboard-catalog.md` (narrative) e Catalog DB (SoT) richiede acquirer onboarding per non confondere le fonti.

## Strengths

- **React 19 + Next.js 16 + Tailwind 4** stack moderno coerente, no legacy Pages Router
- **OKLCH semantic tokens** future-proof (HDR-ready), CVA variants type-safe
- **A11y baked-in** via Radix primitives, jest-axe + @storybook/addon-a11y wired
- **Multi-tenant aware UI**: `BrandShell` consuma session + nav resolver in layout
- **Wordmark canonical** cristallizzato in 3 regole permanent (L25/L27/L28) — no bikeshedding futuro
- **Storybook 9 + GH Pages** + 17 brand documentation stories = onboarding designer immediato
- **i18n IT/EN production-ready** (LocaleSwitcher AppShell + Phase 14 Sprint 1.H)

## Open questions

1. **Bundle initial JS reale** services/app post `next build` (non misurato in audit)
2. **Web Vitals production** (LCP, CLS, INP) su VM `oracle-vm-default` con 3G throttling
3. **Storybook visual regression baseline** ETA: roadmap menziona ma nessun ADR di scope
4. **Migration plan ESLint flat config** post Next.js 16 lint deprecation
5. **Adoption della webapp `09-asset-showcase` post-acquisizione**: tool dev-only locale o promote a internal admin?

## Acquirer perspective

**Cosa compri**:

1. `packages/ui` ~180 component coerente ricchissimo (asset di valore reale, ~6-9 mesi FTE da rebuildare)
2. Brand identity completa documentata e cristallizzata (low rebrand risk)
3. App Router architecture corretta a livello di pattern (RSC default, client island disciplina)
4. Stack moderno aggiornato (React 19, Next 16, Tailwind 4, Storybook 10) — no debito legacy

**Cosa devi sistemare nei primi 90gg post-merger**:

1. F4.1 Suspense + loading/error boundaries (~10h) — UX critica
2. F4.2 `next/image` adoption (~6h) — Web Vitals
3. F4.4 ESLint flat config wire (~3h) — quality gate
4. F4.3 bundle analyzer + duplicate dep cleanup (~6h) — perf budget
5. F4.5 Storybook story coverage gap (~16h) — visual regression
6. **Total fix effort: ~40-60h FTE** = 1 sprint senior FE focused

**Verdict D4**: **NEGOTIATE**. Asset core forte e acquisibile. Gap operativi reali ma misurabili (~1 sprint), nessun deal-breaker. Discount o earn-out su milestone "F4.1 + F4.2 + F4.4 closed at handover" è ragionevole.

---

**Auditor sign-off**: Frontend Engineer & Design System Specialist · audit eseguito read-only conforme vincoli prompt.
