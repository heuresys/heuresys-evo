# Aesthetic Direction — FINAL

> **Decisione**: 2026-05-05. Direzione confermata, non esplorata da zero. Il sito legacy `www.heuresys.com` ha già stabilito un'identità visiva coerente. Phase 4 originale ("4 esplorazioni A/B/C/D") collassata a "validazione + raffinamento".

## Direzione scelta

**Cinematic dark-first** (corrispondente a Variant C in `03-visual-identity/color/palette-explorations.md`).

### Definizione operativa

| Asse                   | Posizione                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Modalità default**   | Dark mode (background near-black/dark navy)                                                                         |
| **Light mode**         | Disponibile come switch, tutte le surface devono funzionare in entrambe                                             |
| **Density**            | Media-alta (bento cards + KPI prominent + grid feature 4×2) — bilanciamento tra Linear-density e Apple-breathing    |
| **Brand colors**       | Blue `#3b82f6` primary + Purple `#a855f7` accent (inviolabili, dal logo)                                            |
| **Heading typography** | Exo 2 per wordmark + heading display; sans geometrica bold (TBD: Inter / Geist / Space Grotesk) per heading sezioni |
| **Body typography**    | Sans-serif neutral (TBD: stesso del heading sezioni o Inter)                                                        |
| **Mono**               | TBD: JetBrains Mono / Geist Mono / Fira Code (per code samples, KPI tabular)                                        |
| **Layout**             | Container max ~1280px centrato, padding ampio, ritmo verticale 80-120px tra sezioni                                 |
| **Cards**              | Bento style, border-radius 16-20px, border subtle, padding 24-32px                                                  |
| **Iconography**        | Monoline blue, line-weight 1.5-2px, peso uniforme                                                                   |
| **Surface signature**  | Knowledge Graph viz force-directed (dark, nodi blue/purple) come elemento distintivo                                |
| **CTA pattern**        | Gradient linear blue→purple sui button primary                                                                      |
| **Glow / atmosfera**   | Glow viola soft sotto elementi hero (cinematic touch)                                                               |

### Razionale brand-driven

1. **Coerenza con sito legacy esistente**: il sito heuresys.com è live, indicizzato, conosciuto da prospect/contatti. Cambiare radicalmente direzione = sbatter via brand equity esistente.
2. **Allineamento target Enterprise (β)**: dark + blue+purple + density media veicola "data-driven, war-room, strumento serio" — risuona con CHRO/CIO che già hanno SAP/Workday in dark.
3. **Allineamento doctrine**: "grafo semantico" è esprimibile visivamente solo in dark (forza nodi-archi). Light mode appiattisce il graph viz.
4. **Allineamento richiesta Enzo**: "minimal moderno + wow + motion + filmati che girano" è additivo sopra il cinematic dark, non alternativo.
5. **Coerenza con palette esistente del design system** (`packages/ui/src/styles/tokens.css`): tokens OKLCH già includono dark mode ben strutturato.

## Cosa esplora ANCORA Phase 4 (raffinamento, non rivoluzione)

Phase 4 originale prevedeva 4 direzioni alternative (A minimal-tech / B editorial / C cinematic / D modern-fintech). Riducendola a raffinamento, restano **3 opzioni di calibrazione** all'interno della direzione cinematic-dark:

### Calibrazione α — Sito legacy preservato (status quo)

Mantieni esattamente l'estetica del sito heuresys.com. Refresh solo nei dettagli motion + dashboard.

**Pros**: zero discontinuity, brand consistency totale.
**Cons**: nessun "wow" netto da mostrare.

### Calibrazione β — Sito legacy + cinematic motion layer

Mantieni base estetica + aggiungi: video bg loop sottili in hero, scroll-triggered reveal sezioni, Knowledge Graph viz interattivo (drag/zoom), parallax depth tra sezioni, Lottie sequence per icone feature, glow sequencing nei numeri KPI.

**Pros**: rispetta richiesta Enzo "filmati che girano", aggiunge wow senza rivoluzione.
**Cons**: richiede asset motion (Lottie/video) da produrre.

### Calibrazione γ — Sito legacy + densificazione dashboard-grade

Estendi il cinematic dark **dentro** l'app (non solo landing): dashboard con bento density alta tipo Bloomberg Terminal/Linear analytics, force-directed graph come centro UX, micro-charts integrati, sparkline e heatmap, command palette Cmd-K.

**Pros**: differenziazione massima vs SaaS HR generici (che hanno dashboard "leggere"), allinea a target power user (Stefania Greco persona).
**Cons**: richiede engineering serio sul lato data viz (D3 / Recharts / VisX / Tremor / Nivo).

### Raccomandazione: β + γ combinati

Il sito legacy va lasciato come `www.heuresys.com`. La nuova area `evo.heuresys.com` (servita da `services/app`, è il prodotto SaaS) eredita l'estetica ma:

- **Marketing surface** (landing pubblica `evo.heuresys.com/`): adotta β (cinematic motion layer)
- **App surface** (dashboard, login, settings — `evo.heuresys.com/dashboard`, etc.): adotta γ (densificazione dashboard-grade)

Coerenza brand cross-surface. Richiesta "wow" di Enzo soddisfatta dove conta (hero marketing + dashboard centrali). Niente discontinuity con sito legacy.

## Vincoli in tutte le calibrazioni

1. **Logo immutabile** — wordmark Exo 2 blue+purple
2. **Colori brand inviolabili** — no shift hue, no terzi brand colors
3. **Dashboard architecture 4-elementi** — header / footer / sidebar / content (vedi `01-strategy/dashboard-architecture.md`)
4. **Theme inheritance** — dashboard theme ereditato dalla pagina caricata
5. **Light mode in pari dignità** — anche se dark è primary
6. **WCAG 2.1 AA** — contrast ratio rispettato in entrambi mode
7. **Voice italiano** + registro autorità+precisione+anti-buzzword (vedi `01-strategy/voice-and-tone.md`)

## Decisione operativa per le fasi successive

| Fase                                     | Output ridotto/aggiornato                                                                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~Phase 3 — Trend research 4 direzioni~~ | **Trend research mirata**: cinematic dark refresh + dashboard density 2026 + motion patterns                                                  |
| ~~Phase 4 — 4 esplorazioni A/B/C/D~~     | **Phase 4 collassata**: raffinamento β/γ delle 3 calibrazioni + scelta singola visiva                                                         |
| Phase 5 — Color palette OKLCH            | **Confermata Variant C cinematic dark** + light mode derivato                                                                                 |
| Phase 6 — Typography                     | **Heading scelto Exo 2 + Sans bold TBD** + body TBD + mono TBD (3 pairing alternativi su body+mono)                                           |
| Phase 7 — Logo derivati                  | Confermato (favicon, monochrome, og-image, mark `y` isolato)                                                                                  |
| Phase 8 — Motion language ⭐             | **FOCUS NUOVO**: cinematic motion (video bg, Lottie, scroll-trigger, parallax, glow sequencing). Soddisfa richiesta Enzo "filmati che girano" |
| Phase 9 — Dashboard mockup ⭐⭐          | **FOCUS MASSIMO**: dashboard-grade density, Knowledge Graph viz interattivo, 4-elementi architettura                                          |
| Phase 10 — Altre surface                 | Landing `evo.heuresys.com` β-style + login + nav-shell γ-style                                                                                |

## Differenze chiave evo.heuresys.com vs www.heuresys.com (sito legacy)

| Aspetto             | www.heuresys.com (legacy)          | evo.heuresys.com (target)                             |
| ------------------- | ---------------------------------- | ----------------------------------------------------- |
| Ruolo               | Marketing landing pubblica         | Prodotto SaaS B2B (login + dashboard)                 |
| Dominio attuale     | live                               | live (HTTPS via certbot)                              |
| Dark/Light          | Toggle, default dark               | Toggle, default dark, theme inheritance per dashboard |
| Motion              | Statico-leggero (glow, scroll cue) | Cinematic ricco (Phase 8 + Phase 9)                   |
| Knowledge Graph viz | Statico (presumibilmente)          | Interattivo (drag, zoom, hover, drill-down)           |
| Density             | Marketing-airy                     | Dashboard-grade (bento + sparkline + radar)           |
| Audience            | Visitatori prospect                | Utenti loggati per ruolo (4 personas)                 |

Il **sito legacy resta come è** (è il funnel marketing). Le nuove surface in `evo.heuresys.com` ne ereditano l'identità estetica + aggiungono il layer dashboard-grade + motion-rich.

## Cross-reference

- Sito legacy capture: `02-aesthetic/heuresys-com-current-style.md`
- Palette: `03-visual-identity/color/palette-explorations.md` (variant C cinematic dark)
- Logo: `03-visual-identity/logo/final/`
- Dashboard architecture: `01-strategy/dashboard-architecture.md`
- Brand foundation: `01-strategy/brand-foundations.md`
