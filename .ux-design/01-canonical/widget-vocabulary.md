# Widget Vocabulary — cycle 2 canonical

> Quando KpiRing vs StatsCard vs Gauge, quando Kanban vs DataTable vs Tree, ecc. Vocabolario controllato per la dashboard engine `_v2`.
> Riferimento plan §1.1 (10 leggi forma) + §2.2 (mini-spec form+content).

## Principio di selezione (C5 framework)

Per ogni dato, scegliere la rappresentazione visiva sulla base di:

1. **Tipologia** (numerico singolo, trend, gerarchia, comparazione, flow, relazioni)
2. **Densità** (1 valore vs 5-20 valori vs N>50 record)
3. **Domanda risolta** (status istantaneo vs evoluzione temporale vs distribuzione vs dipendenza)

## Mapping tipologia → widget

### Numerico singolo (status / KPI istantaneo)

| Caso                                      | Widget                            | Note                                   |
| ----------------------------------------- | --------------------------------- | -------------------------------------- |
| KPI con tone + sparkline 12pt + threshold | `KpiRing`                         | hero card primaria, max 4 per riga top |
| Numero secondario / supporto              | `StatsCard`                       | densità maggiore, no ring              |
| Valore con soglia ok/warn/crit            | `KpiRing` con `thresholds`        | warning/critical tone semantico        |
| KPI con drill diretto                     | `KpiRing` + `href`                | click → trend / detail page            |
| P11 unavailable                           | `KpiRing` con `unavailable: true` | render `<DataNotAvailable />`          |

### Trend temporale

| Caso                            | Widget                                   |
| ------------------------------- | ---------------------------------------- |
| Trend 12-24m generico           | `WorkforceTrendLine` (ECharts)           |
| Trend compatto 12pt             | `Sparkline` (inline KpiRing)             |
| Multi-serie comparison          | `EChartsCard` (line chart con legend)    |
| Distribuzione su asse temporale | `Histogram` o `EChartsCard` bars stacked |

### Gerarchia / albero

| Caso                                | Widget                                     |
| ----------------------------------- | ------------------------------------------ |
| OKR cascade (tenant→dept→team→ind.) | `OkrCascadeTree`                           |
| Org chart (manager→reports)         | `OrgChart` (tree)                          |
| Capability map / skill taxonomy     | `CapabilityRadar` o `Tree` con depth chips |
| ESCO taxonomy navigable             | `EscoTree` (lazy expand)                   |
| KG topology graph                   | `KgGraph` (Cytoscape canvas)               |

### Comparazione / matrice

| Caso                              | Widget                       |
| --------------------------------- | ---------------------------- |
| Permission matrix (ruoli × aree)  | `RbacMatrix`                 |
| Skill heatmap (dept × competence) | `SkillCoverageHeatmap`       |
| Attrition heatmap (dept × month)  | `DepartmentHeatmap`          |
| Pay-gap (gender × dept × ratio)   | `Heatmap` con tone semantico |

### Flow / pipeline

| Caso                     | Widget                                                                    |
| ------------------------ | ------------------------------------------------------------------------- |
| Review status cycle      | `ReviewKanbanBoard` (4 col: Pending / In progress / Submitted / Approved) |
| Recruiting funnel        | `Funnel` (applied → screened → interviewed → offered → hired)             |
| Onboarding sequence      | `Kanban` o `Timeline`                                                     |
| Performance cycle phases | `Timeline` orizzontale                                                    |

### Relazioni / network

| Caso                     | Widget                     |
| ------------------------ | -------------------------- |
| Skill-occupation graph   | `KgGraph` 1-hop expand     |
| Knowledge graph explorer | `KgGraph` con filter pills |
| Mobility paths           | `NetworkGraph`             |

### Distribuzione

| Caso                                  | Widget                  |
| ------------------------------------- | ----------------------- |
| Salary buckets + P25/50/75/90 overlay | `CompensationHistogram` |
| Rating distribution review            | `Histogram`             |
| Skill proficiency distribution        | `Histogram` o `BoxPlot` |

### Lista / record

| Caso                                | Widget                                       |
| ----------------------------------- | -------------------------------------------- |
| Tabella filterable + sortable       | `DataTable` (TanStack Table 8)               |
| Card grid (employee, learning path) | `EmployeeDirectoryGrid` / `LearningPathGrid` |
| Activity feed live                  | `ActivityFeed`                               |
| Succession candidates top-N         | `SuccessionCard` con readiness gauge         |

### Detail / drill panel

| Caso                                         | Widget                    |
| -------------------------------------------- | ------------------------- |
| Profile employee full                        | `EmployeeProfileCard`     |
| Goal detail (KR + history + comments)        | `GoalDetailPanel`         |
| Review detail (rating + 360 + dev plan)      | `ReviewDetailPanel`       |
| Compensation detail (band + bonus + history) | `CompensationDetailPanel` |

## Regole di composizione

### Hero strip (top zone)

- **4 KpiRing** sempre allineati grid 4-col (responsive: 2×2 ≤768px)
- Mai 5+ KpiRing in hero (sovraccarico cognitivo)
- Mai mix KpiRing + StatsCard in hero (gerarchia inconsistente)

### Body principal

- **1 widget primary "fat"** (Kanban / Histogram / Tree / Heatmap large) sotto hero
- Eventuale **secondary tab** per cambio lente (lista / grid / org / graph)
- Mai >3 secondary tab (cognitive overload)

### Body secondari

- DataTable o card grid per record list
- Filterable inline + sortable column
- Bulk action visible se applicable

### Drill panel

- Side panel destra o modal centered (decisione per route)
- Solo se utente esprime intent di drill (click)
- Close gesture chiara (ESC + x + outside click)

## Anti-pattern

- ❌ KpiRing con `value: 0` quando data non disponibile → usa `unavailable: true`
- ❌ DataTable senza pagination su >100 record
- ❌ Tree senza breadcrumb depth indicator
- ❌ Kanban senza count per colonna
- ❌ Histogram senza percentile overlay quando comparazione benchmark è la storia
- ❌ ActivityFeed senza timestamp + actor + action atomico
- ❌ Map / Sankey / chord / scatter "perché belli" senza domanda risolta concreta
- ❌ Decorazione gratuita (sparkle, animation loops, hover effects fancy senza significato)

## Riferimenti

- Plan §2.2.A (HR_DIRECTOR cellule investor-critical)
- Legacy adapter pattern: `services/app/src/lib/dashboard-engine/adapters.ts`
- New adapter framework: `services/app/src/lib/dashboard-engine/adapters/_base-adapter.ts`
- Widget registry: `services/app/src/lib/dashboard-engine/registry.tsx`
- P11 enforcement: `services/app/src/components/data/DataNotAvailable.tsx`
