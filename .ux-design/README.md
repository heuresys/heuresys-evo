# `.ux-design/` — Sandbox brand identity Heuresys

> **Status**: sperimentale, segregato dal codice di produzione.
> **Owner**: Enzo Spenuso (sole coder).
> **Iniziato**: 2026-05-04, sessione post-S11 / Operating Baseline.
> **Riferimento piano**: `C:\Users\enzospenuso\.claude\plans\usa-superpowers-e-tutti-delegated-orbit.md`

## Cosa è questa cartella

Sandbox isolato dove Claude e Enzo costruiscono **collaborativamente** la brand identity di Heuresys (logo, colori, font, motion, mockup dashboard, brand book) **senza toccare il codice di produzione**.

Ogni artefatto resta qui finché Enzo non decide esplicitamente di **promuoverlo a v1.0** integrandolo nelle path produzione (`packages/ui/`, `services/app/`, `services/app/public/`, `docs/`).

## Policy di segregazione (vincolante)

| Regola                                                                        | Stato         |
| ----------------------------------------------------------------------------- | ------------- |
| Nessun import da `.ux-design/` in `packages/`, `services/`, `apps/`           | ✅ Vincolante |
| Nessun export da `.ux-design/` verso il package graph (no `package.json` qui) | ✅ Vincolante |
| Nessuna build pipeline tocca `.ux-design/` (escluso da typecheck/test/build)  | ✅ Vincolante |
| File qui dentro = **draft / experimental / proposta**, mai canonical          | ✅ Vincolante |
| Promozione a v1.0 = decisione esplicita di Enzo, mai automatica               | ✅ Vincolante |
| Modifiche fuori `.ux-design/` durante Phase 1 = solo se Enzo conferma         | ✅ Vincolante |

## Struttura

```
.ux-design/
├── README.md                          ← questo file
├── 01-strategy/                       ← Brand foundation: mission, voice, personas, positioning
├── 02-aesthetic/                      ← Trend research, moodboard, direzioni estetiche esplorate
├── 03-visual-identity/                ← Logo, colori, typography, iconography
│   ├── logo/{explorations,shortlist,final}
│   ├── color/                         ← Palette OKLCH (light + dark)
│   ├── typography/                    ← Pairing + scale fluid clamp()
│   └── iconography/                   ← Stile + icon set base
├── 04-motion-language/                ← Filosofia motion + microinteraction + scroll + cinematic
├── 05-theme-variants/                 ← JSON ThemeBuilderWizard importabili
├── 06-mockups/                        ← PNG/SVG di superfici chiave (dashboard ⭐, landing, login, nav, settings)
├── 07-brand-book/                     ← Documento riassuntivo navigabile (consolidato a fine Phase 1)
└── 08-promotion/                      ← Checklist + log promozione v1.0
```

## Convenzioni

- **Lingua**: italiano nei doc (`.md`), terminologia tecnica e file naming in inglese (kebab-case)
- **Asset**: `.svg` per logo/icons, `.png` per mockup esportati, `.json` per theme variants
- **Commit**: `feat(ux-design): <fase>: <output>` — direct push main (per direttiva no-PR-default)
- **Iterazione**: Claude propone → Enzo sceglie a vista → commit → fase successiva

## Workflow di promozione a v1.0

Quando un artefatto è approvato definitivamente:

1. Enzo annota la decisione in `08-promotion/promotion-log.md` (data, artefatto, target path)
2. File **copiato** (non spostato) in path produzione (logo SVG → `services/app/public/brand/`, palette → integrata in `packages/ui/src/styles/tokens.css`, etc.)
3. Brand book v0 → `docs/30-developer/brand-guidelines.md` (Diátaxis canonical)
4. `.ux-design/` resta come **archivio** della genesi (reference, audit trail, esplorazioni alternative scartate)

**Criteri minimi** per promozione (da finalizzare in `08-promotion/v1.0-checklist.md`):

- Acceptance esplicita di Enzo per ogni artefatto
- Logo: SVG ottimizzato (svgo), favicon multi-size, og-image template
- Colori: integrati in `tokens.css` con dark mode validato
- Font: caricati via `next/font` con fallback sistemati
- Motion: token finalizzati in `tokens.css`, principi validati su 3+ component reali
- Brand book: review completa, link funzionanti

## Dashboard focus ⭐

Il prodotto Heuresys è un **layer ontologico** sopra ERP/HR/BI. Le dashboard saranno densità informativa elevata + leggibilità + wow estetico (vedi `09-dashboard-mockup` e `06-mockups/dashboards/`).

Riferimenti compass: Linear analytics, Vercel dashboard, Stripe Sigma, Pitch app, Notion AI dashboards.

## Tool & skill in uso (cross-Phase)

- `superpowers:brainstorming` — guida domande
- `frontend-design:frontend-design` — design framework Anthropic
- `frontend-design-pro:design` — wizard interattivo
- `frontend-design-pro:trend-researcher` / `moodboard-creator` / `color-curator` / `typography-selector` / `inspiration-analyzer` / `review`
- `mcp__claude-in-chrome__*` — A/B visivi live (Chrome companion)
- `WebSearch` / `WebFetch` — riferimenti, competitor, trend
- `Agent` (Explore / general-purpose / Plan) — task complessi

## Direttiva operativa attiva

> **SEMPLICITÀ + ROBUSTEZZA**. Officina, non università. Vedi `docs/_meta/operating-baseline.md`.
> Se Claude over-engineered: "stai over-engineering" → stop, semplificare, continuare.
