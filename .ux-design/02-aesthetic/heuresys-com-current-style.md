# Capture estetico — www.heuresys.com (sito legacy live)

> **Status**: analisi dettagliata della landing page legacy `www.heuresys.com`, catturata 2026-05-04 con Chrome companion (8 screenshot, viewport 1440×900). Diventa **ancora primaria** della direzione estetica Heuresys: l'identità visiva esiste già ed è coerente.

## Stack tecnico osservato (header HTTP)

| Aspetto        | Valore                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------- |
| Server         | nginx/1.24.0 (Ubuntu)                                                                    |
| Framework      | Next.js (SSR + RSC streaming)                                                            |
| Locale default | `it` (Italian)                                                                           |
| Font preload   | 3× woff2 (`next/font` Google fonts)                                                      |
| Theme toggle   | Presente in header (sun icon → light, suggerisce dark/light disponibili, dark è default) |

## Struttura della landing (sezioni in ordine)

| #   | Sezione                  | Contenuto                                                                                                                                                                                                                                                                                                     |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Header sticky**        | Wordmark logo (small) + nav (Architettura · Governance · Knowledge Graph) + theme toggle + Accedi + CTA "Inizia Ora"                                                                                                                                                                                          |
| 2   | **Hero**                 | Wordmark gigante con glow viola + tagline "Organizational Intelligence & Workforce Orchestration" + headline "Il Layer Mancante / Tra ERP, HR e BI" (ultima riga gradient blue→purple) + bullet text + Knowledge Graph viz 7-layer architecture (force-directed, nodi ORG/PROC/UNIT/SKILL/ROLE/KPI/EVAL/ESCO) |
| 3   | **Quote slogan**         | "SAP manages how the company runs. Heuresys manages the company's ability to run." (citazione board-level)                                                                                                                                                                                                    |
| 4   | **Scroll cue**           | "Scopri di più" + chevron animato                                                                                                                                                                                                                                                                             |
| 5   | **Stats KPI bento**      | 4 cards: 531+ Tabelle Database · 178 Pagine Frontend · 150+ Endpoint API · 17.000+ Entità Knowledge Graph                                                                                                                                                                                                     |
| 6   | **Category Creation**    | Badge + heading "Un Nuovo Strato di Intelligenza Organizzativa"                                                                                                                                                                                                                                               |
| 7   | **Feature grid 4×2**     | 8 cards (Blueprint Generator, Process Governance, Org Design, Workforce Intelligence, Skill Graph & ESCO, Career Intelligence, Performance & KPI, Enterprise Security) con icone monoline blue                                                                                                                |
| 8   | **Three Perspectives**   | 3 cards Process Owner · HR Director · Org & Systems (con sub-titles e bullet list per ciascuno) — pattern già nelle foundations                                                                                                                                                                               |
| 9   | **Knowledge Graph deep** | Heading "L'Intelligenza Semantica al Centro" + body + KPI box 17K entità con sub-stats (14.011 skills · 3.040 occupazioni · 126K relazioni · 3.276 codici NACE/ATECO)                                                                                                                                         |
| 10  | **7 Layer Architecture** | Icon row orizzontale: Organization → Process → OrgUnit → Role → Skill → KPI → Assessment (frecce tra ciascuno)                                                                                                                                                                                                |
| 11  | **CTA finale**           | Heading "Governa la Capability della Tua Organizzazione" + body + button "Inizia Oggi"                                                                                                                                                                                                                        |
| 12  | **Footer**               | 4 colonne: Logo+tagline · Architettura links · Risorse links · Contatti (info@heuresys.com · Milano, Italia · heuresys.com) + © 2026 + Privacy/Termini/Cookie                                                                                                                                                 |

## Identità visiva osservata

### Palette

| Token                    | Osservato                                       | Note                                    |
| ------------------------ | ----------------------------------------------- | --------------------------------------- |
| Background primary       | Black/very dark navy (~`oklch(0.10 0.005 260)`) | Coerente con palette variant C          |
| Surface elevated (cards) | Slightly lighter navy con border subtle         | Bento style                             |
| Text primary             | Quasi-white (~`oklch(0.96 0.005 260)`)          | Alto contrasto                          |
| Text muted               | Gray light (~`oklch(0.60 0.02 260)`)            | Sub-titles, body lungo                  |
| **Brand primary**        | Blue `#3b82f6` / `oklch(0.62 0.19 260)`         | Logo, link, focus, CTA gradient start   |
| **Brand accent**         | Purple `#a855f7` / `oklch(0.63 0.26 297)`       | Logo "y", glow effect, CTA gradient end |
| CTA gradient             | Linear blue → purple                            | "Inizia Ora" / "Inizia Oggi" buttons    |
| Glow effect              | Purple soft shadow sotto wordmark hero          | Cinematic touch                         |

### Tipografia

| Uso                                                         | Font (osservato)                                           | Weight  | Note                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------- | ------- | ------------------------------------------------------------------------- |
| **Wordmark logo**                                           | **Exo 2**                                                  | 700     | Cattura specifica già documentata (vedi `03-visual-identity/logo/final/`) |
| Heading hero (gigante)                                      | Exo 2                                                      | 700-800 | Wordmark hero usa stessa typo del logo, scalato                           |
| Heading sezioni ("Il Layer Mancante", "Un Nuovo Strato...") | Sans-serif geometrico bold (Inter o Geist o Space Grotesk) | 700-800 | NON Exo 2 — font separato per UI                                          |
| Body                                                        | Sans-serif neutral                                         | 400-500 | Probabile Inter                                                           |
| KPI numbers ("531+", "17K")                                 | Sans bold                                                  | 700     | Display-grade size                                                        |
| Caption / tag                                               | Sans                                                       | 400-500 | "CATENA ONTOLOGICA — 7 LAYER ARCHITECTURE" uppercase tracking             |

### Layout

- Container: max-width ~1280px, centrato, padding generoso
- Spacing: ritmo verticale ampio (sezioni con padding 80-120px)
- Cards: bento pattern, padding 24-32px, border radius ~16-20px, border subtle
- Grid: principalmente 4 cols feature, 3 cols perspective, 2-col split (text + viz) hero
- Text alignment: left-aligned in body, centered nei CTA finali

### Motion (osservato)

- Glow effetto sotto wordmark hero (statico ma cinematic)
- Knowledge Graph viz: presumibilmente force-directed con animazione (non confermato, single screenshot statico)
- Scroll cue chevron (presumibilmente bouncing)
- Dot indicator nelle three-perspectives → carosello?

## Cosa funziona (PRESERVARE)

| Pattern                                    | Razionale brand                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| Dark mode primary, light secondary         | Allineato a "data-driven, cinematic, war-room" persona target enterprise |
| Wordmark gigante in hero con glow          | Identitario, riconoscibile, brand-first                                  |
| Knowledge Graph viz come signature element | Esprime visualmente "grafo semantico" (uno dei 7 pilastri)               |
| Bento cards density media                  | Bilanciato tra Linear-density e marketing-airy                           |
| 3 perspectives card pattern                | Coerente con pillar "three access perspectives" della doctrine           |
| Quote slogan in evidenza                   | "SAP manages..." board-level resta efficace                              |
| Feature grid 4×2 con icone monoline blue   | Modernità tech, ordinato                                                 |
| KPI numbers grandi (531+, 17K)             | Concretezza claim quantitativi (richiamo Mercer 62%, Ulrich 4×)          |
| CTA gradient blue→purple                   | Allinea ai colori del logo, microcelebrazione visiva                     |
| Footer minimal 4-col                       | Niente clutter, focus contenuto                                          |

## Cosa manca o si può raffinare (ESPLORARE in Phase 8/9)

| Gap                                                                                               | Phase di intervento                               | Priorità    |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------- |
| Motion cinematico avanzato (filmati che girano, scroll-triggered reveal, parallax, video bg loop) | Phase 8 — Motion language                         | Alta        |
| Knowledge Graph viz interattivo (drag, zoom, hover detail)                                        | Phase 9 — Dashboard mockup (è core viz)           | Alta        |
| Dashboard reali (landing è marketing, non c'è esempio dashboard live)                             | Phase 9 — Dashboard mockup                        | Critica     |
| Light mode UI (theme toggle è presente ma non visto in azione)                                    | Phase 5 — Color (light variant) + Phase 10 mockup | Media       |
| Login surface (nessun mockup catturato)                                                           | Phase 10 — Altre surface                          | Media       |
| Status indicator footer (uptime, sync ESCO, audit pipeline) — trust signal enterprise             | Phase 10 — Footer pattern                         | Bassa       |
| Case study / customer logo wall (assente) — trust signal enterprise                               | Phase 10 — Marketing surface                      | Bassa-Media |
| Cinematic elements distintivi (Lottie, video loop, WebGL) — il "wow" che richiede Enzo            | Phase 8 — cinematic-elements.md                   | Alta        |

## Conclusione operativa

1. **La direzione estetica è già decisa**: Cinematic dark-first (variant C). Non serve esplorare 4 direzioni alternative in Phase 4. Il sito legacy serve da **ancora primaria**.
2. **L'identità è coerente e funzionante**: dark + blue/purple + Exo 2 wordmark + Knowledge Graph viz + bento cards. Da preservare.
3. **Il refresh richiesto da Enzo** ("minimal moderno + wow + motion + filmati che girano") **non è un cambio di direzione**, è un **layer di motion + dashboard density** sopra l'estetica esistente.
4. **Phase 4 si collassa a "validazione + raffinamento", non esplorazione**.
5. **Phase 8 (motion) e Phase 9 (dashboard) restano i veri punti di lavoro** dove Enzo vedrà cose nuove.

## Cross-reference

- Logo definitivo: `03-visual-identity/logo/final/heuresys-wordmark.svg`
- Palette ancorata: `03-visual-identity/color/palette-explorations.md` § Variant C Cinematic dark
- Direzione finale (next): `02-aesthetic/direction-final.md`
- Moodboard riferimenti compass: `02-aesthetic/moodboard.md`
- Dashboard architecture (4-elementi): `01-strategy/dashboard-architecture.md`
