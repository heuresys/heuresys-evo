# `.ux-design/` — Brand State

> **Single Source of Truth** per stato corrente del workstream brand identity. Aggiorna questo file ogni volta che cambia phase, viene presa una decisione, o si producono asset significativi. Per la cronologia completa cronologica, vedi `DECISIONS-LOG.md`.
>
> **Last update**: 2026-05-08 (**L40 Tassonomia dashboard dinamica vs ad-hoc · catalogo dashboard ≡ Brand Identity · audit current-state generato in `08-promotion/brand-dashboard-catalog-CURRENT-STATE.md`** · classificazione 5-tag su 138 selettori CSS + 17 React component · 10 drift identificati · roadmap remediation G1-G6 mappata ma NON eseguita.)
>
> **Previous update**: 2026-05-08 (L39 Phase 15.A brand-fedele dashboard rendering shipped · 7 view brand-fedeli per preset_code · CSS canonical 2370 righe + BrandShell layout + 9 brand widget · role-driven branching via `role_default_dashboards` · `org_systems` view live data binding · ADR-0026. Commit `d59ae3e` su main.)

## Current phase

| Phase                              | Status                               | Note                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 — Setup                          | ✅ Completed                         | `.ux-design/` struttura + README                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2 — Brand foundations              | ✅ Completed                         | foundations + voice + 4 personas + audience-positioning + dashboard architecture                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 3 — Aesthetic capture sito legacy  | ✅ Completed                         | 8 screenshot www.heuresys.com + moodboard + heuresys-com-current-style                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 4 — Aesthetic direction            | ✅ **CHIUSA — D1 risolto**           | 32 direzioni esplorate (Set 1+2+3+4+5). **D1 = μ-architect-legacy** (Set 5 Systems POV con palette legacy www.heuresys.com)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 5 — Color palette                  | ✅ **Done** (L21)                    | `palette-final.md` v2 OKLCH + `heuresys.DESIGN.md` 10-sezioni canoniche                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 6 — Typography pairing             | ✅ **Done** (L21)                    | Stack: **Exo 2** wordmark + **Inter** body + **JetBrains Mono** data · `typography-final.md` scritto                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 7 — Logo derivati                  | ✅ **Done** (L21)                    | 5 SVG canonical aggiornati con spec L16/L18: wordmark · monochrome dark/light · mark · favicon · og-image                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 8 — Motion language                | ✅ **Done** (L24)                    | 5 prototipi: wordmark-glow · gradient-transitions · kg-topology-hover · sparkline-animate · scroll-reveals + `motion-final.md` SoT + index hub                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 9 ⭐⭐ — Dashboard mockup          | 🟢 **5 / 5 complete** (L22)          | HR Director Overview · Capability Graph · Skills Heatmap · Employee Journey · Org & Systems · index hub. Layout v2: solid buttons, sidebar collapsible, tenant-mini, h4 collassabili.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 10 — Altre surface                 | ✅ **Done** (L35)                    | Eseguita via Phase 14.SH (8 commit) + carry-forward sessione 2026-05-07. Login aurora + AppShell role-based 8 ruoli + 17+ viste live data e2e + 2 mockup overview (cross-tenant + tenant-owner) + LocaleSwitcher AppShell + 9 viste SH-3 i18n IT/EN. ADR-0024 documenta scope.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 11 — Theme variants JSON           | ✅ **Done** (L36)                    | 4 file in `05-theme-variants/`: `tokens-dark.json` SoT · `tokens-light.json` override · `tokens-motion.json` 5 pattern presets · `README.md` uso. Format **W3C DTCG**. Mirror sincronizzato con `services/app/src/styles/active-theme.css`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 12 — Brand book v0                 | ✅ **Done** (L37)                    | `07-brand-book/BRAND-BOOK-v0.md` 15 sezioni canoniche (cover · mission · voice · personas · audience · aesthetic · color · typography · logo · motion · dashboard · components · a11y · dos-donts · governance). Single entry point unificato. v0 textual; v1 visiva futura.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 13 — Dashboard data-driven         | ✅ **DONE · all 6 sub-phases**       | 6 sotto-phase 13.0→13.E completate end-to-end · 41-51 FTE-day plan eseguiti in modalità autonomous. **13.0** 8/8 pack mining + Pack 2.3+2.6 reopen. **13.A** 8 atomic component TIER 17 · 21 test · L29. **13.B** schema migration 0002 + 9 preset + 30 element seeded + RLS · L30. **13.C** engine renderer in `services/app/src/lib/dashboard-engine/` + route `/dashboard/[code]` · 18 vitest · L31. **13.D** 4 mockup HTML PROCESS + flip is_published=true · L31. **13.E** doc `dashboard-engine-pattern.md` + STATE final · L31.                                                                                                                                                                                                                                                                                                                             |
| 14 — V2 operativo + AI + Tier 2    | 🟢 **Sprint 1 + 2.E shipped**        | Bundle F (Full · 60-89 FTE-day) selezionato. **Sprint 1.A** live data binding: data-fetcher (sql/static + cache TTL + RLS) · 8-widget adapter registry · prefetch parallel · route handler `/api/dashboard/data/[elementId]` + RBP/tenant gates · `useWidgetData()` SWR-style hook zero-deps · seed 8 KpiRing SQL + 4 IntegrationHealthPill static + 9 composite static. **Sprint 1.H** i18n IT/EN: LocaleProvider + `pickBilingual()` + LocaleSwitcher · ?lang= + localStorage. **Sprint 1.D** Playwright PoC + RBP matrix 5 ruoli RTL Bank · 8 spec verde. **Sprint 1.A.7** perf script (autocannon) · dev mode ballpark. **Sprint 2.E** `auditedDashboardMutation()` helper · 12 vitest verde · consumer arrives Sprint 3.C. **11 commit** consecutivi (1cd433f → b4b303e) · 132/132 vitest · 8/8 E2E · live smoke verified `Active employees · 270` · L32+L33. |
| 15.A — Brand-fedele dashboard      | ✅ **Done** (L39 · 2026-05-08)       | `/dashboard` role-driven brand-fedele al mockup canonical `org-systems.html`. Architettura 4-layer: CSS canonical scoped `dashboard-brand.css` (~2370 righe) + `BrandShell.tsx` layout + role resolver via `role_default_dashboards` + 7 view dedicate per preset_code (`OrgSystems`, `CrossTenantOverview`, `TenantOwnerOverview`, `HrDirectorOverview`, `SkillsHeatmap`, `CapabilityGraph`, `EmployeeJourney`) + 9 brand widget. `org_systems` view con data binding live (tenants reali · audit_logs reali · RBP counts). Commit `d59ae3e`. ADR-0026.                                                                                                                                                                                                                                                                                                           |
| 15.B — Catalog DB governance shift | ✅ **Done** (L46 + L47 · 2026-05-09) | Catalog DB della webapp `09-asset-showcase` (Express+Prisma+SQLite locale, gitignored) diventa SoT operativa stable. Concetto `chromeStandard` (universal chrome cross-role 18 asset · header/footer/sidebar) + `dashboardCode='*_v2'` (body role-specific su 11 dashboardCode mappati post-L47). Tutti i 10 mockup body importati con metadata graphical (mockupSource, behaviorsJson, colorTokensJson, subElementsJson) + ~50 nuove classi canonical CSS. 8 conflict resolutions documentate. 346 total assets · 138 promoted · 374 variants. Commit `15e9458` (L46) + `08b2097` (L47).                                                                                                                                                                                                                                                                          |

## Decisioni stabilite

| Decisione                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Quando     | Riferimento                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------- |
| Scope `.ux-design/` = B (docs + asset + JSON, no React sperimentale)                                                                                                                                                                                                                                                                                                                                                                                      | 2026-05-04 | DECISIONS-LOG L1                                                     |
| Direzione: greenfield, guida progressiva, scelte a vista via Chrome                                                                                                                                                                                                                                                                                                                                                                                       | 2026-05-04 | DECISIONS-LOG L2                                                     |
| Riferimenti compass: Linear, Vercel, Stripe, Apple keynote, Awwwards                                                                                                                                                                                                                                                                                                                                                                                      | 2026-05-04 | DECISIONS-LOG L3                                                     |
| Focus speciale: dashboard (Phase 9 = FOCUS MASSIMO)                                                                                                                                                                                                                                                                                                                                                                                                       | 2026-05-04 | DECISIONS-LOG L4                                                     |
| Voce: italiano + autorità/precisione/anti-buzzword                                                                                                                                                                                                                                                                                                                                                                                                        | 2026-05-04 | `01-strategy/voice-and-tone.md`                                      |
| Personas: 4 illustrative (Maria CHRO / Davide IT / Stefania LM / Andrea EM)                                                                                                                                                                                                                                                                                                                                                                               | 2026-05-04 | `01-strategy/personas/`                                              |
| Audience: β Enterprise raccomandato, decisione finale pending                                                                                                                                                                                                                                                                                                                                                                                             | 2026-05-04 | `01-strategy/audience-positioning.md`                                |
| Dashboard architecture: 4-elementi data-driven (header/footer/sidebar/content) + theme inheritance + nested senza header/footer                                                                                                                                                                                                                                                                                                                           | 2026-05-04 | `01-strategy/dashboard-architecture.md`                              |
| `.ux-design/` versionato cross-machine via git (Option A)                                                                                                                                                                                                                                                                                                                                                                                                 | 2026-05-04 | DECISIONS-LOG L5                                                     |
| Scope vincolante: nessun import da `.ux-design/` in production code                                                                                                                                                                                                                                                                                                                                                                                       | 2026-05-04 | `README.md`                                                          |
| Light+dark dual mode in pari dignità per Set 2 direzioni                                                                                                                                                                                                                                                                                                                                                                                                  | 2026-05-05 | DECISIONS-LOG L8                                                     |
| `99-samples/` library integrata + adozione pattern DESIGN.md a 9 sezioni canoniche                                                                                                                                                                                                                                                                                                                                                                        | 2026-05-05 | DECISIONS-LOG L14                                                    |
| Logo y-accent standard cross-direction (y in `var(--accent)`, weight gap moderato, italic, letter-spacing naturale)                                                                                                                                                                                                                                                                                                                                       | 2026-05-05 | `02-aesthetic/logo-standard.md` · L16                                |
| **Logo wordmark PERMANENT (L25)**: `h` lowercase · tutte lettere identiche peso/size/style · solo `y` color diverso · embed ovunque                                                                                                                                                                                                                                                                                                                       | 2026-05-05 | `02-aesthetic/logo-standard.md` · L25                                |
| **"Logo originale" canonical (L27)**: nome canonico · 2 colori fissi (body `var(--brand-blue)` + y `var(--accent)`) · ECCEZIONE plain text per indirizzi/link/domini                                                                                                                                                                                                                                                                                      | 2026-05-06 | `02-aesthetic/logo-standard.md` · L27                                |
| **"Logo relativo" convenzione (L28)**: classe `.wordmark-relative` · stessa struttura del logo originale ma body `var(--logo-body, var(--ink))` + y `var(--accent)` derivati dal tema CSS attivo · per surface tematizzate                                                                                                                                                                                                                                | 2026-05-06 | `02-aesthetic/logo-standard.md` · L28                                |
| **Phase 10 (Altre surface) chiusa via Phase 14.SH (L35)**: AppShell role-based + 17+ viste live data + 2 mockup carry-forward overview. Phase 10 non più "in-progress", ✅ Done                                                                                                                                                                                                                                                                           | 2026-05-07 | DECISIONS-LOG L35                                                    |
| **Phase 11 — Theme variants JSON shipped (L36)**: format W3C DTCG · 4 file in `05-theme-variants/` · SoT portabile cross-tool sync con `active-theme.css`                                                                                                                                                                                                                                                                                                 | 2026-05-07 | DECISIONS-LOG L36 · `05-theme-variants/README.md`                    |
| **Phase 12 — Brand book v0 shipped (L37)**: `07-brand-book/BRAND-BOOK-v0.md` 15 sezioni canoniche · single entry point unificato · cycle brand identity Phase 1→12 ufficialmente chiuso                                                                                                                                                                                                                                                                   | 2026-05-07 | DECISIONS-LOG L37 · `07-brand-book/BRAND-BOOK-v0.md`                 |
| **Catalog DB governance shift (L46)**: catalog DB della webapp `09-asset-showcase` (locale Express+Prisma+SQLite, gitignored) è SoT operativa stable. `chromeStandard=true` per universal chrome cross-role (18 asset header/footer/sidebar) · `dashboardCode='*_v2'` per body role-specific · `mockupSource`/`behaviorsJson`/`colorTokensJson`/`subElementsJson` metadata persistite. `brand-dashboard-catalog.md` resta narrative ma non autoritativo   | 2026-05-09 | DECISIONS-LOG L46 · `09-asset-showcase/README.md` · commit `15e9458` |
| **Body-only import 10 mockup (L47)**: 11 dashboardCode `*_v2` mappati (org_systems / cross_tenant_overview / tenant_owner_overview / hr_director_overview / skills_heatmap / capability_graph / employee_journey + 4 process). 8 conflict resolutions documentate (`.status-pill` recurrent canonical wins · `.succession-row`+`.succession-card` entrambi · `.gauge-wrap`+`.gauge-grid` entrambi · process full-import). 346 total assets · 138 promoted | 2026-05-09 | DECISIONS-LOG L47 · commit `08b2097`                                 |

## Decisioni risolte (storico — D1/D2/D3/D4 chiuse)

| #      | Domanda                                                                         | Risoluzione                                                                                                                                                | Quando         | Riferimento                                                             |
| ------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| **D1** | Aesthetic direction finale                                                      | ✅ **μ-architect-legacy** scelta dopo 32 direzioni esplorate (Set 1+2+3+4+5)                                                                               | 2026-05-05     | DECISIONS-LOG L19 + L21                                                 |
| **D2** | Audience positioning α PMI / β Enterprise / γ Dual-track                        | ✅ **β Enterprise** adottata de facto: tutto lo stack è β-first (multi-tenant default, RTL Bank target, P1-P10 enforcement, 605 RLS policies, RBP 8 ruoli) | 2026-05-07     | `01-strategy/audience-positioning.md` · stack production                |
| **D3** | Logo strategy: preservare wordmark Exo 2 sito legacy o esplorare nuovo concept? | ✅ **Wordmark legacy preservato + cristallizzato** in 3 regole permanent (L25 struttura, L27 logo originale 2 colori fissi, L28 logo relativo tematizzato) | 2026-05-05 +06 | DECISIONS-LOG L25/L27/L28 · `02-aesthetic/logo-standard.md`             |
| **D4** | Body+Mono pairing definitivo                                                    | ✅ **Exo 2 wordmark + Inter body + JetBrains Mono data** (stack canonico post-D1)                                                                          | 2026-05-05     | DECISIONS-LOG L21 · `03-visual-identity/typography/typography-final.md` |

**Status**: tutte le 4 decisioni storiche bloccanti del brand identity workstream sono risolte. Nessuna decisione pending bloccante per la chiusura del ciclo brand identity. Roadmap successiva (post-chiusura) lavora su promotion v1.0 + WCAG 2.2 AAA audit + perf bench + JWT fix — non sono brand identity decisions, sono operational tasks.

## Asset inventory (verificato 2026-05-05)

### `01-strategy/`

- `brand-foundations.md` — slogan + 5 dimensioni + claim quantitativi + categoria
- `voice-and-tone.md` — italiano + 3 tratti (autorità/precisione/anti-buzzword) + do/don't
- `audience-positioning.md` — α PMI / β Enterprise / γ Dual-track
- `dashboard-architecture.md` — regola 4-elementi data-driven + nested + theme inheritance
- `personas/01-hr-director.md` (Maria 47 RTL Bank CHRO)
- `personas/02-it-admin.md` (Davide 38 IT Architect)
- `personas/03-line-manager.md` (Stefania 41 Head Credit Risk Modelling)
- `personas/04-employee.md` (Andrea 29 Quant Analyst Junior)

### `02-aesthetic/`

- `heuresys-com-current-style.md` — analisi 12 sezioni sito legacy (8 screenshot)
- `direction-final.md` — direzione iniziale "Editorial Cinematic Ontologico" (sciolta dopo apertura libera)
- `moodboard.md` — compass references + anti-pattern bandita
- `direction-explorations/index.html` — navigation hub 8 direzioni
- `direction-explorations/alpha-editorial-cinematic.html` — Set 1 dark
- `direction-explorations/beta-brutalist-paper.html` — Set 1 light cream
- `direction-explorations/gamma-industrial-blueprint.html` — Set 1 light architectural
- `direction-explorations/delta-quantitative-ft.html` — Set 1 light salmon FT
- `direction-explorations/epsilon-sculptural-variable.html` — Set 2 light+dark variable type
- `direction-explorations/zeta-architectural-warm.html` — Set 2 light+dark warm earth + 5 glyphs
- `direction-explorations/eta-swiss-computational.html` — Set 2 light+dark swiss pure
- `direction-explorations/theta-algorithmic-generative.html` — Set 2 light+dark generative
- `direction-explorations/iota-industrial-blueprint-tempered.html` — Set 3 light+dark · ClickHouse × Linear · 55T/45C
- `direction-explorations/iota-industrial-blueprint-tempered.critique.md` — 3-designer-debate critique
- `direction-explorations/kappa-quantitative-ft-tempered.html` — Set 3 light+dark · PostHog × FT · 65T/35C
- `direction-explorations/kappa-quantitative-ft-tempered.critique.md` — 3-designer-debate critique
- `direction-explorations/lambda-gamma-eta-remix.html` — Set 3 light+dark · γ × η token arbitration · 60T/40C
- `direction-explorations/lambda-gamma-eta-remix.critique.md` — 3-designer-debate critique
- `direction-explorations/mu-data-dense-temperata.html` — Set 3 light+dark · PostHog × Linear · 60T/40C exact · dashboard-first
- `direction-explorations/mu-data-dense-temperata.critique.md` — 3-designer-debate critique
- `direction-explorations/mu-architect.html` — Set 4 light+dark · Systems POV · token surfaces + RBAC matrix
- `direction-explorations/mu-art-director.html` — Set 4 light+dark · Pentagram POV · 5 capability glyphs + KG hero
- `direction-explorations/mu-pragmatic.html` — Set 4 light+dark · Conversion POV · CTA + activity feed + trial banner
- `direction-explorations/mu-synthesis.html` — Set 4 light+dark · Best compromise · 40/30/30 mix
- `direction-explorations/mu-architect-legacy.html` — esperimento L19 · μ-architect con palette legacy www.heuresys.com (Exo 2 + dark navy + brand blue + purple accent + gradient blue→purple). NON in index.
- `02-aesthetic/logo-standard.md` — L16 spec canonico cross-direction

### `03-visual-identity/`

- `logo/final/heuresys-wordmark.svg` — canonical wordmark Exo 2 (under reconsideration)
- `logo/final/heuresys-wordmark-monochrome-dark.svg`
- `logo/final/heuresys-wordmark-monochrome-light.svg`
- `logo/final/heuresys-mark.svg` — solo "y" isolata
- `logo/final/favicon.svg` — "y" su quadrato dark
- `logo/final/og-image-template.svg` — 1200×630 social preview
- `logo/final/README.md` — specifiche + vincoli (under reconsideration)
- `color/palette-explorations.md` — 3 variant (Cool minimal / Warm editorial / Cinematic dark)
- `color/palette-final.md` — Variant C cinematic dark formalizzata (under reconsideration)
- `typography/pairing-explorations.html` — Set originale 3 pairing (Inter Tight / Geist / Space Grotesk)
- `typography/pairing-b-alternatives.html` — 4 alternative B-style (Geist / Manrope / DM Sans / Plus Jakarta)

### `04-motion-language/` (Phase 8 · L24 · 5 prototipi complete)

- `motion-final.md` — SoT spec: token (--ease-_, --dur-_), 5 pattern canonici, anti-pattern bandita, accessibility (prefers-reduced-motion)
- `index.html` — navigation hub 5 prototypes con tokens summary
- `01-wordmark-glow.html` — Hero glow breathing 4s loop ease-in-out
- `02-gradient-transitions.html` — Theme switch dark↔light 200ms ease-out · auto-cycle demo
- `03-kg-topology-hover.html` — KG node hover scale + edges focus/blur + tooltip 150ms
- `04-sparkline-animate.html` — KPI sparkline draw stroke-dashoffset + count-up 200ms
- `05-scroll-reveals.html` — Scroll-triggered opacity+translateY stagger 60ms · one-shot

### `05-theme-variants/` (Phase 11 · L36 · 4 file W3C DTCG)

- `tokens-dark.json` — SoT default theme (color · typography · spacing · radius · shadow · gradient · glass)
- `tokens-light.json` — color/shadow/glass override per `[data-theme="light"]`
- `tokens-motion.json` — easing + duration + 5 pattern canonici (wordmarkGlow, themeTransition, kgTopologyHover, sparklineDraw, scrollReveal) + auxiliary + anti-pattern + accessibility
- `README.md` — uso lato consumer (Tokens Studio Figma · Style Dictionary v4 · Tailwind preset · CSS) + mapping con production `active-theme.css`

### `07-brand-book/` (Phase 12 · L37 · v0 first edition)

- `BRAND-BOOK-v0.md` — 15 sezioni canoniche · single entry point unificato cross-reference. v0 textual; v1 visiva futura.

### `08-promotion/` (Phase 11+ promotion gate)

- `v1.0-checklist.md` — gate operativo promotion da `.ux-design/` a `services/`/`packages/`. 14 categorie asset · acceptance criteria + workflow per ogni categoria · roadmap effort.
- `promotion-candidates.md` — registry ranking visivo per ogni surface (login · 7 dashboard · motion · ecc.) con stato candidate.
- `brand-dashboard-catalog-CURRENT-STATE.md` (L40 · 2026-05-08) — **audit current-state pre-flight dashboard promotion**: classificazione 5-tag (a/b/c/d/e) su 138 selettori CSS canonical + 17 React component (9 BrandWidget + 8 atomic packages/ui), 10 drift identificati D1-D10, 8 gap formali GA1-GA8, roadmap 6-step G1-G6 (~26-37h) verso modello unificato `<DashboardRenderer/>` DB-driven.

### `06-mockups/dashboards/` (Phase 9 · L22 layout v2 · 5 surface complete)

- `index.html` — navigation hub 5 dashboard con persona + tenant + scope badges
- `hr-director-overview.html` — Maria CHRO · RTL Bank · KPI ring + skill gap matrix + activity feed live + succession ready
- `capability-graph.html` — Davide IT · RTL Bank · KG topology SVG + ontology breakdown + top entities by edge density + ESCO sync
- `skills-heatmap.html` — Maria CHRO · RTL Bank · matrice 8 dept × 12 skill heatmap + filters + distribution histogram + critical list
- `employee-journey.html` — Andrea EMP · RTL Bank · profile hero + career arc 5 stage + skill evolution 4q + capability radar + 3 bridging suggestions
- `org-systems.html` — Davide IT · Heuresys System · 4 tenant fleet + RBAC matrix + integration health + audit log live + system metrics
- `cross-tenant-overview.html` — SUPERUSER · Heuresys System · cross-tenant analytics flotta + workforce trend chart 12 mesi · 4 tenant comparison + capability gauges (Phase 14.SH carry-forward · L35)
- `tenant-owner-overview.html` — Marco Rossi · TENANT_OWNER · RTL Bank · org snapshot + 8-dept breakdown + compensation plan FY26 + succession 9-box top-2 (Phase 14.SH carry-forward · L35)

**Shared layout v2 (L22)**: nav-bar (back + wordmark Heuresys + label phase + theme toggle) · sidebar 240px collapsible 64px (toggle button + tenant-mini card + h4 sezioni collassabili + user-card bottom) · workspace (ws-header + KPI ring + content panels + ws-footer). Buttons solid color (no gradient). Persistence dark/light + sidebar state in localStorage.

### `99-samples/` (read-only reference library, integrata 2026-05-05 — L14)

- `README.md` — indice + mapping 8 direzioni Heuresys ↔ famiglie 99-samples
- `voltagent-design-md/` — 12 spec YAML (Linear, Stripe, Vercel, ClickHouse, PostHog, HashiCorp, Notion, Sentry, Supabase, Apple, Claude, WIRED)
- `rohitg00-frameworks/` — 8 framework prosa (editorial, data-dense ⭐, warm, glass, cinematic, terminal)
- `rohitg00-prompts/` — 6 workflow templates (`family-picker` ⭐, `brand-to-design-md`, `audit-live-site`, `3-designer-debate`, `remix-two-brands`, `break-default-aesthetic` ⭐)
- `rohitg00-recipes/token-budget-claude-design.md` — recipe quota Pro per Claude Design cloud

**Skill/agent candidati derivabili** (top 3): `brand-family-picker`, `brand-3-designer-debate`, `brand-anti-slop`. Altri 5: `brand-design-md-generator`, `brand-audit-live`, `brand-remix`, `brand-token-budget`, agent `brand-strategist`.

## Setup tecnico per resume

### Server HTTP locale (per mockup live)

```bash
cd D:/evo.heuresys.com/.ux-design && python -m http.server 8765 --bind 127.0.0.1
```

Background mode. Verifica HTTP 200 su `http://127.0.0.1:8765/02-aesthetic/direction-explorations/index.html`.

### URL chiave per Chrome companion

| Surface                   | URL                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Index 8 direzioni         | `http://127.0.0.1:8765/02-aesthetic/direction-explorations/index.html`                     |
| Set 1 α                   | `http://127.0.0.1:8765/02-aesthetic/direction-explorations/alpha-editorial-cinematic.html` |
| Set 1 β                   | `.../beta-brutalist-paper.html`                                                            |
| Set 1 γ                   | `.../gamma-industrial-blueprint.html`                                                      |
| Set 1 δ                   | `.../delta-quantitative-ft.html`                                                           |
| Set 2 ε (light+dark)      | `.../epsilon-sculptural-variable.html`                                                     |
| Set 2 ζ (light+dark)      | `.../zeta-architectural-warm.html`                                                         |
| Set 2 η (light+dark)      | `.../eta-swiss-computational.html`                                                         |
| Set 2 θ (light+dark)      | `.../theta-algorithmic-generative.html`                                                    |
| Typography Set originale  | `.../03-visual-identity/typography/pairing-explorations.html`                              |
| Typography B alternatives | `.../03-visual-identity/typography/pairing-b-alternatives.html`                            |

### Skill da invocare

```
Skill superpowers:brainstorming
Skill frontend-design:frontend-design
Skill frontend-design-pro:design (opzionale, wizard più ricco)
```

### Tools deferred da loadare alla bisogna

```
ToolSearch select:TaskCreate,TaskUpdate,TaskList,AskUserQuestion,WebSearch,WebFetch
ToolSearch select:mcp__claude-in-chrome__tabs_context_mcp,tabs_create_mcp,navigate,computer,browser_batch,read_page,get_page_text
```

## Next actions proposte (al resume)

1. **Se D1 ancora pending**: chiedere a Enzo "delle 8 direzioni quale ti tira / vuoi ibridazione / vuoi 9° direzione?" (vedi `DECISIONS-LOG.md` per cosa è già stato eliminato)
2. **Se D1 risolta**: aggiornare `BRAND-STATE.md` § Decisioni stabilite + `DECISIONS-LOG.md` + `direction-final.md` con la scelta. Riprendere Phase 5 (palette finale) + Phase 6 (typography body/mono) + Phase 7 (logo derivati nuovo concept) in parallelo.
3. **Phase 8 motion language**: blocco grosso, ~5-8 prototipi animati (Framer Motion + Lottie + GSAP scroll-trigger). Inizia dopo D1 risolta.
4. **Phase 9 dashboard mockup**: FOCUS MASSIMO ⭐⭐. 4-5 dashboard variations in HTML+motion. Inizia dopo D1 + Phase 8.
5. **Phase 11+ verso brand book v0**: consolidamento finale.

## Riferimenti

- **Cronologia decisioni**: [`DECISIONS-LOG.md`](DECISIONS-LOG.md)
- **Resume protocol**: [`SESSION-RESUME.md`](SESSION-RESUME.md)
- **Piano originale**: `C:\Users\enzospenuso\.claude\plans\usa-superpowers-e-tutti-delegated-orbit.md`
- **Project CLAUDE.md**: [`../CLAUDE.md`](../CLAUDE.md) § Brand workstream
- **Handoff session state**: [`../.handoff/STATE.md`](../.handoff/STATE.md)
- **Operating baseline**: [`../docs/_meta/operating-baseline.md`](../docs/_meta/operating-baseline.md)
