# Layout Pattern — cycle 2 canonical

> Codifica formale delle 10 leggi del cockpit (plan §1.1 forma) + 5 primitives convergenti dai 7 reference site. Pattern vincolante per ogni preset `_v2` cycle 2.

## 10 leggi del cockpit (forma)

| #   | Legge                                 | Applicazione operativa                                                                                                                                                           |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Una pagina = una domanda              | Header `<h1>` espone in 1 frase quale domanda risolve. Es: "Chi è pronto a sostituire ruoli critici nei prossimi 12 mesi?" non "Vista HR Director"                               |
| F2  | Pareto del dato                       | 20% del cockpit (zona top: hero strip 4 KpiRing) risponde all'80% della domanda                                                                                                  |
| F3  | Gerarchia 3-livelli                   | Hero (cosa decido ora) → Body (dettaglio operativo) → Drill (singolo record / drilldown slide-over)                                                                              |
| F4  | Generale→particolare                  | Ogni widget supporta espansione: KPI → trend → record list → record detail. Mai dead-end visuale                                                                                 |
| F5  | Header/footer come superfici metadata | Header: breadcrumb + audience + scope chip + locale + tema + palette + account. Footer: live status (cycle progress, sync health). Non sprecare spazio statico                   |
| F6  | Viste dinamiche                       | Tab/switch per cambiare lente: timeframe (90d/Q/YTD) · scope (tenant/dept/team) · modalità (lista/grafo/kanban)                                                                  |
| F7  | Strutture ramificate                  | Per dati gerarchici (OKR cascade, org chart, ESCO taxonomy) usare tree + breadcrumb depth. Mai flat list per gerarchie                                                           |
| F8  | Attention design misurato             | Movimento minimo: solo dove c'è cambio di stato live. Glow/pulse riservato a "azione richiesta ora"                                                                              |
| F9  | Space economy                         | Zero placeholder. Empty state SOLO se P11 legittimo via `<DataNotAvailable />`. Niente "Scaffold base / coming soon / Sprint 2"                                                  |
| F10 | Coerenza assoluta                     | Stesso layout pattern, stesso header anatomy, stesso footer anatomy, stesso skeleton, stesso empty state, stessa palette, stessa typography, stesso motion language tra 17 route |

## 5 primitives convergenti (dai 7 reference site)

| Primitive                              | Source convergente                 | Applicazione heuresys                                                         |
| -------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| **Sidebar persistent + Cmd+K palette** | Linear · Vercel · PostHog · Notion | Sidebar 240-260px collapsible · Cmd+K palette `command-palette` (futuro F11+) |
| **40-30-20-10 space rule**             | Linear · Stripe · ClickHouse       | Hero strip + body principal + secondary tab + breathing                       |
| **KPI hero + sparkline + narrative**   | Stripe · Vercel · Visier           | 4 `KpiRing` con value + sparkline + threshold + AI insight card sotto         |
| **Slide-over drilldown**               | Linear · Stripe · Notion           | Drill via side-panel 40-60% width, mai full-page navigation                   |
| **Monospace tabular numerals**         | Stripe · ClickHouse                | JetBrains Mono per KPI value · DataTable num cols · histogram axis            |

## Anatomia preset `_v2` canonical

Struttura DOM standard per ogni preset cycle 2:

```
┌─────────────────────────────────────────────────────────────┐
│ nav-bar (topbar globale)                                     │
│   wordmark · label-pill · LocaleSwitcher · PaletteSwitcher  │
│   ThemeToggle · UserMenu                                     │
├──────────┬──────────────────────────────────────────────────┤
│          │ ws-header                                         │
│ sidebar  │   breadcrumb · h1 (one question) · scope-pill    │
│          │   actions (Export · CTA primary)                  │
│ sections ├──────────────────────────────────────────────────┤
│ nav      │ HERO STRIP (40%)                                  │
│          │   4 KpiRing (full width grid 4-col)              │
│ user-card│   AI insight card sotto                           │
│          ├──────────────────────────────────────────────────┤
│          │ BODY PRINCIPAL (30%)                              │
│          │   1 widget fat (Kanban / Histogram / Tree)        │
│          │   tab secondary inline se applicable              │
│          ├──────────────────────────────────────────────────┤
│          │ BODY SECONDARY (20%)                              │
│          │   DataTable o card grid (record list)             │
│          │   2-3 widget supporto                             │
│          ├──────────────────────────────────────────────────┤
│          │ ACTIVITY RAIL (10% breathing + right-rail)        │
│          │   ActivityFeed live · status pulse                │
├──────────┴──────────────────────────────────────────────────┤
│ app-footer                                                   │
│   ft-static (copyright + socials)                            │
│   ft-dynamic (CYCLE · REVIEWS · [dev chips gated])           │
└─────────────────────────────────────────────────────────────┘
```

## Grid system

12-col responsive con breakpoints:

| BP    | min-width | Grid behavior                                           |
| ----- | --------- | ------------------------------------------------------- |
| `xs`  | 0         | 1-col stacked, sidebar drawer                           |
| `sm`  | 640       | 2-col stacked, sidebar drawer                           |
| `md`  | 768       | 4-col hero, sidebar collapsed icon-only                 |
| `lg`  | 1024      | 8-col, sidebar visible 240px                            |
| `xl`  | 1280      | 12-col, sidebar 260px, full hero strip 4×KpiRing        |
| `2xl` | 1536      | 12-col, optional right-rail ActivityFeed visible always |

Grid hint via `dashboard_elements.grid_col_start` + `grid_col_span` (Prisma fields presenti).

## Drilldown pattern (slide-over)

Trigger: click su KPI / row / card. Animation:

```
slide-over panel
  enter: translateX(100%) → 0  · --ease-out --dur-base (200ms)
  exit:  0 → translateX(100%)  · --ease-in  --dur-fast (120ms)
  backdrop: opacity 0 → 0.4    · --ease-out --dur-base
```

Componente target: `<SlideOver title="..." onClose>...</SlideOver>` (da scaffold-are in Phase 3 widget brand expansion se non già presente in `packages/ui`).

## Dynamic views (F6) — tab switching pattern

Pattern tabs role-driven:

- HR_DIRECTOR `/employees`: `Grid | Table | Org | Skills heatmap` (4 viste)
- HR_DIRECTOR `/reviews`: `Kanban | Timeline | Calibration` (3 viste)
- HR_DIRECTOR `/goals`: `Cascade tree | Table | Timeline` (3 viste)
- HR_DIRECTOR `/dashboard`: `Strategic | Tactical | Operational` (3 livelli aggregazione)

Tab state persisted in URL query param (`?view=grid`) per shareability.

## Anti-pattern layout banditi

Vedi `anti-patterns.md` per la lista completa. Quick reference:

- ❌ 5+ KpiRing in hero (cognitive overload)
- ❌ Mix KpiRing + StatsCard in hero (gerarchia inconsistente)
- ❌ Full-page navigation per drilldown (perde contesto)
- ❌ Flat list per dati gerarchici (use tree)
- ❌ Empty state generico "no data" (use `<DataNotAvailable />` P11)
- ❌ Decorative animation senza cambio di stato (F8 violation)
- ❌ Sidebar collapsed senza visual indicator dell'item attivo
- ❌ DataTable senza pagination su >100 record
- ❌ Tab >3 livelli senza secondary nav strategy

## Riferimenti

- Plan §1.1 (10 leggi forma) + §1.2 (10 framework contenuto)
- `inspirations-extracted.md` — 5 primitives convergenti
- `trend-research-2026.md` — Pattern 6 (KPI hero) + Pattern 7 (40-30-20-10) + Pattern 13 (slide-over)
- `moodboard.md` — direzione visuale
- `widget-vocabulary.md` — mapping tipologia → widget
- `header-footer-anatomy.md` — DOM canonical
