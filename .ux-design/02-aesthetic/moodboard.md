# Moodboard — Heuresys evo.heuresys.com

> Riferimenti compass per Phase 8 (motion language) + Phase 9 (dashboard mockup) + Phase 10 (altre surface). Ancora primaria: il sito legacy `www.heuresys.com` (vedi `02-aesthetic/heuresys-com-current-style.md`). Compass secondari: brand industry-leading allineati alla direzione cinematic-dark + dashboard-grade.

## Ancora primaria

**`www.heuresys.com`** — sito legacy live. Già adopta cinematic dark + blue/purple + bento + Knowledge Graph viz. È il punto di partenza, non da superare ma da estendere con motion + dashboard.

## Compass per marketing surface (Phase 10 landing)

### Linear (linear.app)

- **Cosa prendere**: dark sobrio, ritmo verticale, microscale animation, ITERATIONS feel
- **Cosa NON prendere**: density troppo bassa, eccessivo whitespace
- **Allineamento Heuresys**: density media + tone diretto

### Vercel (vercel.com)

- **Cosa prendere**: cards bento + scroll-triggered reveal + grid layout + cinematic motion sui product visual
- **Cosa NON prendere**: pricing-first heavy, gradient ovunque
- **Allineamento Heuresys**: heading bold + cards + motion subtle

### Stripe (stripe.com)

- **Cosa prendere**: gradient art (sezione hero), illustrazione dinamica isometric, type system coerente, claim-driven copy
- **Cosa NON prendere**: feel fintech-soft (Heuresys è Enterprise più severo)
- **Allineamento Heuresys**: claim quantitativi prominenti

### Apple Keynote / Apple events

- **Cosa prendere**: cinematic transitions tra sezioni, video loop sottili in background hero, depth/parallax suggerito da scroll, type display gigante
- **Cosa NON prendere**: pricing/buyer journey consumer
- **Allineamento Heuresys**: il "wow" cinematico richiesto da Enzo

### Awwwards-tier brands (es. lusion.co, basement.studio)

- **Cosa prendere**: WebGL hero, particle systems, scroll-triggered video sequence, motion as content
- **Cosa NON prendere**: orpello senza significato (motion gratuito)
- **Allineamento Heuresys**: motion DEVE servire la comprensione (es. graph che si forma sotto scroll, non gira a vuoto)

## Compass per app surface — dashboard (Phase 9 ⭐)

### Linear (analytics view)

- **Cosa prendere**: density alta in tabular view, command palette Cmd-K, sidebar collapsible, keyboard-first power user
- **Allineamento Heuresys**: persona Stefania (Line Manager quant) e Andrea (Employee quant)

### Stripe Sigma / Stripe Dashboard

- **Cosa prendere**: SQL query interface, custom report builder, data table density, multi-tab navigation
- **Allineamento Heuresys**: trasparenza calcolo (Stefania richiede formula visibile)

### Pitch (pitch.com)

- **Cosa prendere**: cinematic deck mode, transition tra view, presentazioni embed
- **Allineamento Heuresys**: dashboard "presentation mode" per board readout HR Director (Maria)

### Notion AI dashboards

- **Cosa prendere**: bento cards drag-rearrange, embedded data viz mixed with text, fluid spacing
- **Allineamento Heuresys**: dashboard data-driven via DBMS (composizione fluida)

### Vercel Analytics

- **Cosa prendere**: sparkline overview top, drill-down dettaglio, time series interattivo, dimensioni filtrabili
- **Allineamento Heuresys**: capability radar + drill-down su BU

### Tableau / Power BI (riferimento density)

- **Cosa prendere SOLO**: density information & data viz toolbox
- **Cosa NON prendere**: estetica anni 2000, colori lacustri, generic enterprise feel
- **Allineamento Heuresys**: capacità di mostrare 100+ metriche su 1 schermo se serve

### Bloomberg Terminal (riferimento war-room)

- **Cosa prendere SOLO**: density estrema + dark mode + monospace number heavy
- **Cosa NON prendere**: brutalismo grafico anni 80
- **Allineamento Heuresys**: persona Davide (IT Admin) e Stefania apprezzano war-room mode

## Compass per data viz Knowledge Graph

### D3.js force-directed examples

- Force layout con drag, zoom, hover detail card
- Cluster coloring (per dimensione capability: process / structure / role / competence / performance)
- Edge weight visualization (relazioni più forti = archi più spessi)

### Observable Plot / VisX

- Quick chart composition, time-series, scatter, heatmap
- Allineamento Heuresys: dashboard variant per HR Director include capability heatmap BU × dimension

### Nivo / Recharts

- React components ready, theming via CSS-vars
- Allineamento packages/ui esistente (Radix + Tailwind 4)

### Tremor (tremor.so)

- React dashboard components (KPI cards, sparkline, donut, bar) Tailwind-native
- Allineamento Heuresys: copre 80% delle dashboard standard

### Excalidraw / tldraw (per UX feel)

- Hand-drawn-feel viz per moodboard sketch (NON per produzione, solo brainstorming)

## Compass per motion language (Phase 8 ⭐)

### Framer Motion 11 (già nel stack)

- React-first, declarative, supporta layout animations, scroll-linked, gesture
- Allineamento Heuresys: già installato in `packages/ui` per motion microinteractions

### Lottie (lottiefiles.com)

- After Effects → JSON, leggero, embed in web
- Allineamento Heuresys: cinematic icone feature, sequence di apertura, hero animations

### Rive (rive.app)

- Vector animation runtime, state machines interattive, più potente di Lottie
- Allineamento Heuresys: animazioni interattive (hover, scroll-bind), Knowledge Graph viz alternativo

### GSAP + ScrollTrigger

- Industry standard scroll-triggered, parallax, pin sections, motion sequences
- Allineamento Heuresys: scroll-bind effetti hero (graph che si forma con scroll)

### React Three Fiber (R3F) + Drei

- WebGL via React, particles, 3D scene, post-processing
- Allineamento Heuresys: hero "wow" element (3D graph?), background loop sottile

### CSS @starting-style + view-transitions API

- Native browser support 2026, animazioni CSS-pure light-weight
- Allineamento Heuresys: page transitions, theme switch animation

## Anti-pattern (cosa NON copiare anche se di tendenza)

| Anti-pattern                                   | Dove lo si vede                               | Perché evitare                                                |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| Glassmorphism eccessivo                        | macOS Big Sur era, ancora in alcuni dashboard | Heuresys è severo, non vetro                                  |
| Neumorphism                                    | 2020 trend morto                              | Diminuisce contrasto, accessibility issue                     |
| Gradient ovunque                               | Stripe-clones                                 | Heuresys usa gradient solo nei CTA, non come tema             |
| AI shimmer rainbow ovunque                     | LLM SaaS 2024-2025                            | Heuresys non è "AI-powered marketing", è strumento ontologico |
| Microinteraction confetti / particles overdose | Notion, Stripe Atlas                          | Heuresys è anti-celebration, è strumento serio                |
| Illustrations cartoon-style                    | Mailchimp era                                 | Heuresys non è friendly-naive, è autoritativo                 |
| Skeuomorphism                                  | iOS 6 era                                     | Mai Heuresys                                                  |
| Brutalism estremo                              | basement.studio takedown imitations           | Heuresys è "raffinato + wow", non aggressivo                  |
| Curve smile / squiggly underlines              | Slack/Notion-clones                           | Heuresys è geometrico-preciso                                 |
| Emojis nel UI label                            | Notion power users                            | Heuresys è no-emoji nei prodotti (vedi voice-and-tone.md)     |
| Generic stock photo                            | LinkedIn aesthetic                            | Heuresys usa solo data viz / abstract grid                    |

## Mood verbale

Heuresys deve sentirsi:

| ✅ Sì                 | ❌ No        |
| --------------------- | ------------ |
| Rigoroso              | Rigido       |
| Cinematico            | Hollywood    |
| Densissimo dove serve | Sovraccarico |
| Wow                   | Show-off     |
| Strumento             | Spettacolo   |
| Authority             | Arroganza    |
| Tech                  | Geek         |
| Modern                | Trendy       |
| Serious               | Boring       |
| Decisive              | Aggressive   |

## Cross-reference

- Capture sito legacy: `02-aesthetic/heuresys-com-current-style.md`
- Direzione finale: `02-aesthetic/direction-final.md`
- Brand foundation: `01-strategy/brand-foundations.md`
- Voice & tone: `01-strategy/voice-and-tone.md`
- Dashboard architecture: `01-strategy/dashboard-architecture.md`
