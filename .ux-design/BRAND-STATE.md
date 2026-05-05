# `.ux-design/` — Brand State

> **Single Source of Truth** per stato corrente del workstream brand identity. Aggiorna questo file ogni volta che cambia phase, viene presa una decisione, o si producono asset significativi. Per la cronologia completa cronologica, vedi `DECISIONS-LOG.md`.
>
> **Last update**: 2026-05-05 (post Set 1 dual-theme rewrite + Set 4 μ persona variants + L17)

## Current phase

| Phase                             | Status                                                                                                                                                  | Note                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Setup                         | ✅ Completed                                                                                                                                            | `.ux-design/` struttura + README                                                                                                |
| 2 — Brand foundations             | ✅ Completed                                                                                                                                            | foundations + voice + 4 personas + audience-positioning + dashboard architecture                                                |
| 3 — Aesthetic capture sito legacy | ✅ Completed                                                                                                                                            | 8 screenshot www.heuresys.com + moodboard + heuresys-com-current-style                                                          |
| 4 — Aesthetic direction           | 🟡 **In progress (re-opened)**                                                                                                                          | 8 direzioni esplorate (α/β/γ/δ Set 1, ε/ζ/η/θ Set 2 award-inspired). **Decisione finale pending.**                              |
| 5 — Color palette                 | ✅ Initial palette-final.md scritto. Sarà rivisto dopo scelta direction                                                                                 |
| 6 — Typography pairing            | 🟡 **In progress**                                                                                                                                      | Heading: TBD da scelta direction. B1 Geist convinced + 4 alternative B1-B4 mostrate. Set 2 reset typography per ogni direction. |
| 7 — Logo derivati                 | ✅ 5 derivati prodotti (canonical + monochrome dark/light + mark + favicon + og-image). **Logo concept stesso under reconsideration** dopo 8 direzioni. |
| 8 — Motion language               | ⏳ Pending (dopo scelta direction)                                                                                                                      |
| 9 ⭐⭐ — Dashboard mockup         | ⏳ Pending **FOCUS MASSIMO**                                                                                                                            |
| 10 — Altre surface                | ⏳ Pending                                                                                                                                              |
| 11 — Theme variants JSON          | ⏳ Pending                                                                                                                                              |
| 12 — Brand book v0                | ⏳ Pending                                                                                                                                              |
| 13 — Promotion checklist          | ⏳ Pending                                                                                                                                              |

## Decisioni stabilite

| Decisione                                                                                                                       | Quando     | Riferimento                             |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| Scope `.ux-design/` = B (docs + asset + JSON, no React sperimentale)                                                            | 2026-05-04 | DECISIONS-LOG L1                        |
| Direzione: greenfield, guida progressiva, scelte a vista via Chrome                                                             | 2026-05-04 | DECISIONS-LOG L2                        |
| Riferimenti compass: Linear, Vercel, Stripe, Apple keynote, Awwwards                                                            | 2026-05-04 | DECISIONS-LOG L3                        |
| Focus speciale: dashboard (Phase 9 = FOCUS MASSIMO)                                                                             | 2026-05-04 | DECISIONS-LOG L4                        |
| Voce: italiano + autorità/precisione/anti-buzzword                                                                              | 2026-05-04 | `01-strategy/voice-and-tone.md`         |
| Personas: 4 illustrative (Maria CHRO / Davide IT / Stefania LM / Andrea EM)                                                     | 2026-05-04 | `01-strategy/personas/`                 |
| Audience: β Enterprise raccomandato, decisione finale pending                                                                   | 2026-05-04 | `01-strategy/audience-positioning.md`   |
| Dashboard architecture: 4-elementi data-driven (header/footer/sidebar/content) + theme inheritance + nested senza header/footer | 2026-05-04 | `01-strategy/dashboard-architecture.md` |
| `.ux-design/` versionato cross-machine via git (Option A)                                                                       | 2026-05-04 | DECISIONS-LOG L5                        |
| Scope vincolante: nessun import da `.ux-design/` in production code                                                             | 2026-05-04 | `README.md`                             |
| Light+dark dual mode in pari dignità per Set 2 direzioni                                                                        | 2026-05-05 | DECISIONS-LOG L8                        |
| `99-samples/` library integrata + adozione pattern DESIGN.md a 9 sezioni canoniche                                              | 2026-05-05 | DECISIONS-LOG L14                       |
| Logo y-accent standard cross-direction (y in `var(--accent)`, weight gap moderato, italic, letter-spacing naturale)             | 2026-05-05 | `02-aesthetic/logo-standard.md` · L16   |

## Decisioni pending (blocking)

| #      | Domanda                                                                         | Opzioni esposte                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Influenza                                            |
| ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **D1** | Aesthetic direction finale                                                      | **12 direzioni totali**. Set 1: α Editorial Cinematic / β Brutalist Paper / γ Industrial Blueprint / δ Quantitative FT. Set 2: ε Sculptural Variable / ζ Architectural Warm / η Swiss Computational / θ Algorithmic Generative. **Set 3 (post family-picker, data-dense pro family raccomandata)**: ι Industrial Blueprint Tempered (55T/45C) / κ Quantitative FT Tempered (65T/35C) / λ γ×η Remix Industrial-Swiss (60T/40C) / μ Data-Dense Temperata clean slate (60T/40C exact). Ogni Set 3 ha `.critique.md` con 3-designer-debate. Family-picker output: Q1 mix scan-heavy prevalente · Q2 prosumer · Q3 trustworthy 60%/courage 40% | Phase 5/6/7/8/9/10/11/12 — bloccante per quasi tutto |
| **D2** | Audience positioning α PMI / β Enterprise / γ Dual-track                        | Esposte in `audience-positioning.md`, β raccomandata                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Voice tweaks, dashboard density, marketing surface   |
| **D3** | Logo strategy: preservare wordmark Exo 2 sito legacy o esplorare nuovo concept? | Sciolto vincolo "definitivo", esplorazione aperta                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Phase 7 logo derivati va ripreso dopo scelta D1      |
| **D4** | Body+Mono pairing definitivo                                                    | Dipende da scelta D1 (ogni direzione ha proprio pairing)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Phase 6                                              |

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

### `04-motion-language/`, `05-theme-variants/`, `06-mockups/`, `07-brand-book/`, `08-promotion/`

Vuoti — popolazione dopo scelta D1.

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
