# Moodboard — cycle 2 canonical

> Sintesi visiva cycle 2 derivata da `trend-research-2026.md` (20 pattern) + `inspirations-extracted.md` (7 reference site). Definisce la direzione estetica vincolante per le 17 voci sidebar rebuild investor-ready.

## Direzione canonica

**Calm Cockpit Decisionale** — _Linear-meets-Stripe-meets-Visier_.

Equilibrio tra:

- **Calm minimalism strategico** (Linear keyboard-first · Notion tree hierarchy · density misurata)
- **Data fidelity industrial banking-grade** (Stripe percentile overlay · ClickHouse monospace numerals · audit trail right-rail)
- **Workforce intelligence focus** (Visier-style decision-focused dashboard, no Bloomberg-terminal aggression, no marketing-airy waste)

Tone: RTL Bank K.64.19 (banking servizi monetari intermediazione finanziaria) — sobrio, dato-centrico, decisionale, professionale.

## Palette canonical

**Preservata da cycle 1 L19**: `μ-architect-legacy` (baseline live in `services/app/src/styles/tokens.css`).

| Token                 | Valore                 | Uso                                                  |
| --------------------- | ---------------------- | ---------------------------------------------------- |
| `--brand-blue`        | navy primary           | wordmark body, KPI ring stroke positive, primary CTA |
| `--accent`            | purple accent          | wordmark "y", emphasis hero, accent chip             |
| `--ink`               | grayscale primary text | h1, h2, body strong                                  |
| `--ink-soft`          | grayscale secondary    | body, meta, descriptions                             |
| `--ink-muted`         | grayscale tertiary     | placeholder, disabled, footer ctx                    |
| `--surface-0`         | dark base              | page background                                      |
| `--surface-1`         | dark elevation 1       | card background                                      |
| `--surface-2`         | dark elevation 2       | hover, secondary card                                |
| `--semantic-success`  | green                  | status ok, trend up positive                         |
| `--semantic-warning`  | amber                  | status warn, trend caution                           |
| `--semantic-critical` | red                    | status crit, trend down negative                     |
| `--semantic-info`     | blue                   | status info, neutral                                 |

**Gradient**: `--gradient-aurora` (blue → purple). Reserved per hero CTA, KPI primary stroke, accent emphasis. Non per backgrounds estesi.

**Dark mode default**. Light mode via `ThemeToggle` ma direzione primary = dark (banking decisional context). Runtime palette switching infrastructure preserved (PaletteSwitcher · DashboardPaletteApplier) ma cycle 2 ships 1 palette canonical = μ-architect-legacy.

## Typography stack

**Preservata da cycle 1**:

| Font               | Weight          | Uso                                                     |
| ------------------ | --------------- | ------------------------------------------------------- |
| **Inter**          | 400 / 500 / 600 | body, h2-h6, paragraphs, labels                         |
| **Exo 2**          | 700             | wordmark "heuresys", h1 display, breadcrumb caps        |
| **JetBrains Mono** | 400 / 500       | numerali tabular, code, audit log entries, monospace ID |

Tabular numerals (`font-variant-numeric: tabular-nums`) **obbligatori** per:

- KPI value
- DataTable colonne numeriche
- Histogram axis labels
- Compensation figures
- Cycle progress percentages

## Layout grid

**40-30-20-10 space rule**:

- 40% hero zone (4 KpiRing + brief narrative)
- 30% body principal (Kanban / Histogram / Tree / Heatmap fat widget)
- 20% secondary tab / detail dock
- 10% breathing room (margins, padding, dividers)

**Sidebar**: 240-260px persistent (collapse a 64px icon-only). Section collapse per id.

**Workspace**: 12-col responsive grid. Breakpoints: ≥1280 (full), ≥1024 (sidebar collapsed), ≥768 (mobile stacked), ≤767 (single col).

**Density**: medium-high. Sufficient white space tra widget per gerarchia visiva, MA dato-centrico nel widget interno (no padding eccessivo dentro la card).

## Motion language

**Preservato da cycle 1 L24** (`services/app/src/styles/motion.css`):

| Curve           | Uso                      |
| --------------- | ------------------------ |
| `--ease-out`    | enter (mount, expand)    |
| `--ease-in`     | exit (dismiss, collapse) |
| `--ease-in-out` | toggle, transition state |
| `--ease-spring` | drag, drop, kanban move  |

| Duration                   | Uso                     |
| -------------------------- | ----------------------- |
| `--dur-instant` (60ms)     | hover feedback          |
| `--dur-fast` (120ms)       | toggle, focus, dropdown |
| `--dur-base` (200ms)       | enter/exit standard     |
| `--dur-slow` (320ms)       | route transition, modal |
| `--dur-deliberate` (480ms) | celebrate, hero reveal  |
| `--dur-cinematic` (800ms)  | onboarding sequence     |

**Regola F8** (motion misurato): movimento solo dove c'è cambio di stato live. Glow/pulse riservato a "azione richiesta ora". No decorazione gratuita.

## Iconografia

- **Lucide** as primary set (consistenza monocromatica, stroke 1.5)
- **SVG bespoke** per wordmark, social icons, custom widget glyphs
- No emoji nei prodotti UI (eccezione: status legend documentazione interna)
- Stroke uniformity: 1.5px sulla scala 16/20/24 px

## Status pills semantic

6 token canonical, riusati cross-widget:
| Token | Tone | Uso |
|---|---|---|
| `success` | green | active, on-track, ready, completed, sync ok |
| `warning` | amber | at-risk, late, requires-attention, sync warn |
| `critical` | red | overdue, blocked, error, sync error |
| `info` | blue | in-progress, scheduled, neutral active |
| `muted` | gray | pending, draft, archived, idle |
| `accent` | purple | hero highlight, AI-suggested, flagged for review |

## Slide-over drilldown pattern

Drilldown sempre via **slide-over panel destra** (40-60% viewport width), MAI full-page navigation. Preserva contesto cockpit cui l'HR Director sta lavorando.

Caratteristiche:

- ESC + outside click + close button per dismiss
- Breadcrumb top con record name
- Sticky action bar bottom (close · share · drill ulteriore)
- Animation `--ease-out --dur-base` enter, `--ease-in --dur-fast` exit

## AI insight card

Pattern emergente (Pattern 12 trend-research): card narrative AI-generated che traduce KPI/dati in 1 frase decisionale in italiano. Esempi:

> "Il review cycle Q1 è al 38%, in ritardo di 5pp rispetto al medio storico. 3 dept (Compliance · IT · Operations) hanno 12 outlier da calibrare entro 14 giorni."

> "Headcount stabile +2 last 90d. Attrition IT al 14% supera target <10%. 4 ruoli critici aperti senza succession ready_now."

Visualizzato in: dashboard hero, route analytics workforce, route compensation (insight equity/gap). Non sostituisce i numeri — accompagna come narrative layer.

P11 vincolo: AI insight basata SOLO su dati live DB. Mai "demo storytelling". Source attribuita via tooltip (es. "Basato su 154 review · 12 outlier rilevati · cycle deadline 28-Feb").

## Skeleton loading shimmer

Pattern 10 trend-research. Skeleton **structure-aware**: matchano la forma reale del widget (rectangle for KPI · row stripes for table · grid for cards · ring outline for KpiRing).

Component: `<Skeleton variant="card | row | grid | ring | tree" count={N} />` da `packages/ui` (da estendere in Phase 3 con varianti mancanti).

Duration: animation 1.2s loop, ease-in-out. Color shift `--surface-1` → `--surface-2` → `--surface-1`.

## Empty state P11 ("Dati Non Disponibili")

Component: `<DataNotAvailable variant="inline | block | tile" />` esistente (`services/app/src/components/data/DataNotAvailable.tsx`).

Quando: query Prisma ritorna `null` / `0` / `[]` per un metric source-less. Mai sostituire con fittizio. Mai render "0%" o "—" senza esplicitazione.

## Investor demo target

Coherence cross-route: stessa palette, stessa typography, stessa motion, stessa header anatomy, stessa footer anatomy, stesso skeleton, stesso empty state, stessi status pills, stesso drilldown pattern.

Brand:audit average ≥ 8/10 cross-route (target plan §10).

## Riferimenti

- `trend-research-2026.md` — 20 pattern dettagliati
- `inspirations-extracted.md` — 7 reference site (Linear/Vercel/PostHog/Stripe/ClickHouse/Notion/Airtable)
- `services/app/src/styles/tokens.css` — palette materializzata
- `services/app/src/styles/motion.css` — motion tokens
- `packages/ui/src/components/wordmark.tsx` — logo component
- Plan §0.3-0.4
