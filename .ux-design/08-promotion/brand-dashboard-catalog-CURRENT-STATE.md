# Brand Dashboard Catalog — Current State Audit

> **Scopo**: mappa esaustiva e classificata del catalogo asset Brand Identity per il dominio dashboard, generata come pre-flight per la promotion v1.0 (vedi [`v1.0-checklist.md`](v1.0-checklist.md)).
>
> **Generato**: 2026-05-08 · **Scope**: Phase 13.A (8 atomic) + Phase 13.B/C (engine + registry) + Phase 15.A (9 BrandWidget + CSS canonical 2372 righe + 7 view brand-fedeli)
>
> **Read-only audit**: nessun cambio al codice produzione, nessuna esecuzione gap remediation. Roadmap mappata in §8 ma non eseguita.

## 1. Tassonomia condivisa (decisioni 2026-05-08)

### Definizione operativa

| Tipo                   | Compone DOM da                                                                                      | Layout                                               | Quando                                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| **Dashboard dinamica** | **Solo asset del catalogo Brand Identity** (livello 1+2), composti via preset DB-driven (livello 3) | Variabile · slot count + tipo determinati dal preset | Default per **tutte** le dashboard di gestione del progetto |
| **Dashboard ad-hoc**   | Può introdurre DOM/CSS fuori catalogo                                                               | Custom                                               | Eccezione · definita di volta in volta                      |

### Equazione fondante

> **Catalogo del modello dashboard ≡ Libreria asset Brand Identity Heuresys**

Non sono due cose distinte. Promuovere un widget al catalogo = farlo entrare nella Brand Identity ufficiale. Conseguenze:

- **Single Source of Truth visiva**: ogni asset usato in qualunque dashboard dinamica deve essere dichiarato nella Brand Identity
- **Promotion = decisione di brand**, non solo tecnica → segue [`v1.0-checklist.md`](v1.0-checklist.md)
- **`dashboard-brand.css` ≡ stylesheet della Brand Identity per il dominio dashboard**

### Modello a 3 livelli

```
LIVELLO 1 · CATALOGO (= Brand Identity)
  Set finito di asset grafici canonici dichiarati
  con spec + classi CSS + React component

LIVELLO 2 · VARIANTI
  Modificatori CSS dichiarati (es. .tenant-card.platform,
  .pill.pill-warn) — stesso DOM root, semantic invariato

LIVELLO 3 · COMPOSIZIONE PER RUOLO (data-driven)
  Preset DB: lista variabile di slot, ognuna con
  { type: <asset_canonico>, variant?: <modificatore>, query: <Q> }
  Renderer unico: <DashboardRenderer preset={...}/>
```

### Audience

8 ruoli che ricevono dashboard dinamica:

| Ruolo        | Tenant origine      | Scope dati                       | preset_code attuale     |
| ------------ | ------------------- | -------------------------------- | ----------------------- |
| SUPERUSER    | Heuresys (landlord) | cross-tenant · tutto             | `cross_tenant_overview` |
| TENANT_OWNER | RTL Bank            | own tenant · tutto               | `tenant_owner_overview` |
| IT_ADMIN     | RTL Bank            | own tenant · system              | `org_systems`           |
| HR_DIRECTOR  | RTL Bank            | own tenant · talent + capability | `hr_director_overview`  |
| HR_MANAGER   | RTL Bank            | own tenant · talent (own dept)   | `skills_heatmap`        |
| DEPT_HEAD    | RTL Bank            | own tenant · team capability     | `capability_graph`      |
| LINE_MANAGER | RTL Bank            | own tenant · team review         | `employee_journey`      |
| EMPLOYEE     | RTL Bank            | own profile                      | `employee_journey`      |

8 ruoli → 7 preset_code distinti (LINE_MANAGER + EMPLOYEE condividono `employee_journey`). Verified-by: `db/seeds/phase15a_role_default_dashboards.sql:57-65`.

## 2. Inventario sorgenti

| #   | Sorgente                   | Path                                                            | Cardinalità                                                         | Ruolo                                     |
| --- | -------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| S1  | CSS canonical              | `services/app/src/styles/dashboard-brand.css`                   | 2372 righe · 138 selettori class principali · 28 sezioni semantiche | Catalogo CSS                              |
| S2  | Design tokens runtime      | `services/app/src/styles/active-theme.css`                      | 198 righe · ~50 CSS variables                                       | Palette + spacing + radii + motion        |
| S3  | BrandWidget React          | `services/app/src/components/widgets/brand/*.tsx`               | 9 component                                                         | Catalogo React per widget registry        |
| S4  | Atomic dashboard component | `packages/ui/src/components/dashboard/*.tsx`                    | 8 component (Phase 13.A)                                            | Storybook only — **zero usage in app**    |
| S5  | Widget registry            | `services/app/src/lib/dashboard-engine/registry.tsx`            | 8 entries (BrandActivityFeed mancante)                              | `widget_code` → BrandWidget mapping       |
| S6  | Role-preset resolver       | `services/app/src/lib/dashboard-engine/role-preset-resolver.ts` | 51 righe                                                            | Risoluzione preset DB-driven              |
| S7  | View brand-fedeli          | `services/app/src/app/(app)/dashboard/_views/*.tsx`             | 7 file · 244-374 righe ciascuno                                     | **JSX bespoke per ruolo, NON consuma S5** |
| S8  | BrandShell layout          | `services/app/src/app/(app)/_components/BrandShell.tsx`         | 282 righe                                                           | nav-bar + sidebar + workspace + footer    |
| S9  | Mockup canonical           | `.ux-design/06-mockups/dashboards/*.html`                       | 7 file (5 Phase 9 + 2 Phase 14.SH carry-forward)                    | Riferimento brand-fedele                  |
| S10 | DB seed                    | `db/seeds/phase15a_role_default_dashboards.sql`                 | 67 righe · 8 mapping role→preset                                    | Data-driven branching (L3)                |
| S11 | Dashboard engine doc       | `docs/30-developer/dashboard-engine-pattern.md`                 | (Phase 13.E)                                                        | Riferimento architetturale                |

## 3. Catalogo CSS classificato (138 selettori principali)

> **Classification scheme**: **(a)** IN-CATALOG · **(b)** PROMOTE-VARIANT · **(c)** PROMOTE-NEW · **(d)** UNIFY · **(e)** REMOVE.
> Tutte le verified-by da `services/app/src/styles/dashboard-brand.css` salvo dove indicato.

### 3.1 Layout primitives (shell + grid)

| Classe             | Linea | # mockup | Class. | Note                                                           |
| ------------------ | ----- | -------- | ------ | -------------------------------------------------------------- |
| `.dashboard-shell` | 19    | 7/7      | (a)    | Wrapper viewport-fill, dataset `data-sidebar`                  |
| `.app`             | 142   | 7/7      | (a)    | Grid 240px sidebar + 1fr workspace                             |
| `.workspace`       | 437   | 7/7      | (a)    | Content area 1fr                                               |
| `.main-split`      | 676   | 3/7      | (a)    | Layout 2-col asimmetrico (HR + Employee + Capability)          |
| `.double-split`    | 1532  | 4/7      | (d→a)  | **Da unificare con `.kg-split`**                               |
| `.bottom-split`    | 2008  | 1/7      | (d→a)  | **Stesso scopo di `.double-split`** — da unificare             |
| `.kg-split`        | 2103  | 1/7      | (d→a)  | **Duplicato semantico di `.double-split`** — naming incoerente |

**Drift identificato**: 3 nomi diversi (`double-split` · `bottom-split` · `kg-split`) per lo stesso pattern semantico "2-col split". Decisione promotion: scegliere 1 nome canonical (raccomandato `.split-2`) + varianti opzionali per ratio (`.split-2--asymmetric`, `.split-2--symmetric`).

### 3.2 Navigation & chrome (nav-bar + sidebar + footer)

| Classe                 | Linea | # mockup | Class. | Note                                   |
| ---------------------- | ----- | -------- | ------ | -------------------------------------- |
| `.nav-bar`             | 29    | 7/7      | (a)    | Topbar con accent border-bottom        |
| `.nav-bar .nav-left`   | 50    | 7/7      | (a)    | Logo + label area                      |
| `.nav-bar .nav-right`  | 56    | 7/7      | (a)    | Theme toggle + user menu area          |
| `.sidebar`             | 157   | 7/7      | (a)    | 240px panel collapsible 64px           |
| `.sidebar-top`         | 166   | 7/7      | (a)    | Toggle button + tenant-mini            |
| `.sidebar-toggle`      | 174   | 7/7      | (a)    | Collapse arrow                         |
| `.sidebar-section`     | 264   | 7/7      | (a)    | Group h4 + links                       |
| `.sidebar-link`        | 302   | 7/7      | (a)    | Nav item with icon + label             |
| `.sidebar-link.active` | 320   | 7/7      | (a)    | Active state                           |
| `.tenant-mini`         | 205   | 7/7      | (a)    | Compact tenant card in sidebar         |
| `.user-card`           | 359   | 7/7      | (a)    | Avatar + name + role bottom sidebar    |
| `.app-footer`          | 1283  | 7/7      | (a)    | Bottom static footer                   |
| `.ws-header`           | 442   | 7/7      | (a)    | Workspace title + breadcrumb + actions |
| `.ws-footer`           | 508   | 7/7      | (a)    | Workspace SOURCE + view identifier     |
| `.section-head`        | 524   | 7/7      | (a)    | h2 + meta separator                    |

**Coverage chrome universale**: 15/15 classi presenti in **tutti e 7** i mockup. **Zero drift** in questo blocco. Costituisce il "Brand Shell Pattern" stabilizzato.

### 3.3 Cards & panels

| Classe                  | Linea | # mockup | Class. | Note                                                    |
| ----------------------- | ----- | -------- | ------ | ------------------------------------------------------- |
| `.kpi-card`             | 600   | 7/7      | (a)    | Atomo KPI universale                                    |
| `.kpi-ring`             | 589   | 6/7      | (a)    | Container 4-col grid di kpi-card                        |
| `.panel`                | 1543  | 7/7      | (a)    | Card wrapper + border + radius                          |
| `.panel-head`           | 1549  | 7/7      | (a)    | Panel title row                                         |
| `.tenant-card`          | 1428  | 2/7      | (a)    | Card per tenant (org-systems + cross-tenant)            |
| `.tenant-card.platform` | 1435  | 2/7      | (a)    | Variante per Heuresys System                            |
| `.tenant-grid`          | 1417  | 2/7      | (a)    | Grid container 4-col tenant-card                        |
| `.metric-card`          | 1780  | 3/7      | (a)    | Card per metric system + sparkline                      |
| `.metrics-grid`         | 1769  | 3/7      | (a)    | Grid 4-col metric-card                                  |
| `.gauge-card`           | 1826  | 1/7      | (c)    | **PROMOTE-NEW** — capability gauge con bar progress     |
| `.gauge-grid`           | 1820  | 1/7      | (c)    | Container per gauge-card                                |
| `.comp-card`            | 1895  | 1/7      | (c)    | **PROMOTE-NEW** — compensation breakdown card           |
| `.comp-grid`            | 1889  | 1/7      | (c)    | Container per comp-card                                 |
| `.succession-card`      | 949   | 2/7      | (c)    | **PROMOTE-NEW** — succession candidate card             |
| `.succession-grid`      | 938   | 2/7      | (c)    | Container per succession-card                           |
| `.bridge-card`          | 2299  | 1/7      | (c)    | **PROMOTE-NEW** — career bridge card (employee-journey) |
| `.bridge-grid`          | 2288  | 1/7      | (c)    | Container per bridge-card                               |
| `.profile-hero`         | 2179  | 1/7      | (c)    | **PROMOTE-NEW** — employee profile hero                 |

**Pattern centrale**: `.kpi-card` + `.panel` sono atomi universali. `.tenant-card` · `.metric-card` · `.gauge-card` · `.comp-card` · `.succession-card` · `.bridge-card` sono **6 varianti del pattern "labeled-data-card"** che oggi vivono come classi separate. Decisione promotion: o promuovere ognuno come asset distinto del catalogo, o astrarre `.data-card` come base + 6 modificatori `.data-card--{tenant,metric,gauge,comp,succession,bridge}`.

### 3.4 Tables & data display

| Classe                            | Linea       | # mockup | Class. | Note                                                       |
| --------------------------------- | ----------- | -------- | ------ | ---------------------------------------------------------- |
| `table.dense`                     | (implicito) | 5/7      | (a)    | Tabella compatta universale                                |
| `table.rbac`                      | 1575 sect.  | 1/7      | (c)    | **PROMOTE-NEW** — RBAC matrix heat-graded (lvl-100..lvl-5) |
| `.skill-gap`                      | 691         | 1/7      | (c)    | **PROMOTE-NEW** — wrapper skill-gap analysis               |
| `.skill-gap-head`                 | 697         | 1/7      | (c)    | Header skill-gap                                           |
| `.heatmap-wrap`                   | 1220        | 2/7      | (c)    | **PROMOTE-NEW** — heatmap matrix container                 |
| `.heatmap-grid`                   | 1226        | 2/7      | (c)    | CSS Grid backbone heatmap                                  |
| `.heatmap-cell`                   | 1232        | 2/7      | (c)    | Cell con bucket heat-0..6 + hl-10..90                      |
| `.heatmap-cell.hl-10/30/50/70/90` | 1243-1256   | 2/7      | (b)    | **PROMOTE-VARIANT** — bucket scale                         |
| `.heatmap-cell.heat-0..heat-6`    | 1976-2000   | 2/7      | (b)    | **PROMOTE-VARIANT** — bucket alternativa (drift naming)    |
| `.heatmap-row-label`              | 1259        | 2/7      | (b)    | Label colonna sinistra                                     |
| `.heatmap-col-header`             | 1270        | 2/7      | (b)    | Header riga superiore                                      |
| `.int-row`                        | 1656        | 3/7      | (a)    | Integration health row                                     |
| `.audit-list`                     | 1725        | 1/7      | (c)    | **PROMOTE-NEW** — audit log container                      |
| `.audit-row`                      | 1729        | 1/7      | (c)    | Audit event row                                            |
| `.crit-row`                       | 2070        | 1/7      | (c)    | **PROMOTE-NEW** — critical cell row (skills heatmap)       |

**Drift critico (heatmap bucket naming)**: stesso componente `.heatmap-cell` ha **2 sistemi di varianti** dichiarati nello stesso CSS — `.hl-10/30/50/70/90` (linee 1243-1256) e `.heat-0..heat-6` (linee 1976-2000). Verified-by `services/app/src/components/widgets/brand/BrandSkillHeatmap.tsx:34` usa `.hl-*`; `SkillsHeatmapView.tsx:42-49` usa `.heat-*`. **Da unificare** in 1 sola scala canonical.

### 3.5 Charts & graphs

| Classe                                     | Linea     | # mockup | Class. | Note                                                  |
| ------------------------------------------ | --------- | -------- | ------ | ----------------------------------------------------- |
| `.capability-radar`                        | 1113      | 1/7      | (c)    | **PROMOTE-NEW** — SVG radar 5-axis (employee-journey) |
| `.kg-graph`                                | 1172      | 1/7      | (c)    | **PROMOTE-NEW** — SVG topology mini graph             |
| `.career-arc`                              | 1030      | 1/7      | (c)    | **PROMOTE-NEW** — 5-stage timeline horizontal         |
| `.career-stage`                            | 1039      | 1/7      | (b)    | Variant past/current/future                           |
| `.histogram`                               | 2019      | 1/7      | (c)    | **PROMOTE-NEW** — bar chart orizzontale               |
| `.histo-bar`                               | 2025      | 1/7      | (b)    | Variant per row                                       |
| `.histo-track` / `.histo-fill`             | 2037-2044 | 1/7      | (b)    | Sub-pattern bar progress                              |
| `.histo-fill.fill-{critical/warn/ok/info}` | 2048-2057 | 1/7      | (b)    | Tone variants                                         |

**Tutti specializzati (1/7)**, ma **legittimi** secondo nuova decisione utente: vanno **promossi a catalogo** (livello 1) per essere usabili cross-preset. Già parzialmente formalizzati come BrandWidget React (`BrandCapabilityRadar`, `BrandKgGraph`, `BrandCareerArc`).

### 3.6 Pills, badges & status

| Classe                                             | Linea     | # mockup | Class. | Note                                                      |
| -------------------------------------------------- | --------- | -------- | ------ | --------------------------------------------------------- |
| `.pill`                                            | 794       | 6/7      | (a)    | Atomo pill universale                                     |
| `.pill-critical`                                   | 804       | 3/7      | (d→a)  | **Da unificare**: stessa funzione di `.status-down`       |
| `.pill-warn`                                       | 808       | 3/7      | (d→a)  | **Da unificare**: stessa funzione di `.status-warn`       |
| `.pill-ok`                                         | 812       | 3/7      | (d→a)  | **Da unificare**: stessa funzione di `.status-ok`         |
| `.pill-info`                                       | 816       | 2/7      | (a)    | OK                                                        |
| `.pill-meets`                                      | 2345      | 1/7      | (b)    | Variante semantica review (employee-journey)              |
| `.pill-exceeds`                                    | 2349      | 1/7      | (b)    | Variante semantica review                                 |
| `.pill-grow`                                       | 2353      | 1/7      | (b)    | Variante semantica review                                 |
| `.status-pill`                                     | 1697      | 1/7      | (d→a)  | **Da unificare con `.pill`** — stesso DOM, naming diverso |
| `.status-ok`                                       | 1706      | 1/7      | (d)    | **Duplicato di `.pill-ok`**                               |
| `.status-warn`                                     | 1711      | 1/7      | (d)    | **Duplicato di `.pill-warn`**                             |
| `.status-down`                                     | 1716      | 1/7      | (d)    | **Duplicato di `.pill-critical`**                         |
| `.scope-pill`                                      | 1394      | 7/7      | (a)    | Atomo dedicato per scope/tenant pill (universale)         |
| `.label-pill`                                      | 62        | 7/7      | (a)    | Mono-style label pill (universale)                        |
| `.pbadge`                                          | 2228      | 1/7      | (c)    | **PROMOTE-NEW** — profile badge atomo                     |
| `.pbadge-role` / `.pbadge-dept` / `.pbadge-tenure` | 2237-2247 | 1/7      | (b)    | Variants di pbadge                                        |

**Drift critico (pill duplication)**: `.pill-{critical,warn,ok}` (HrDirector + Skills) e `.status-{down,warn,ok}` (org-systems) sono **stesso pattern semantico** con naming + classi diverse. Verified-by: `OrgSystemsView.tsx:174-176` usa `.status-pill`/`.status-{ok,warn,down}`; `HrDirectorOverviewView.tsx:165-167` usa `.pill`/`.pill-{critical,warn,ok}`. **Da unificare**: scegliere 1 sistema (raccomandato `.pill` + `.pill--{ok,warn,critical,info}` BEM) e migrare l'altro.

### 3.7 Bars, gauges & progress

| Classe                                     | Linea     | # mockup | Class. | Note                                                  |
| ------------------------------------------ | --------- | -------- | ------ | ----------------------------------------------------- |
| `.bar-track`                               | 1929      | 4/7      | (a)    | Atomo progress bar background                         |
| `.bar-fill`                                | 1938      | 4/7      | (a)    | Fill width-driven                                     |
| `.bar-fill.fill-critical/warn/ok/info`     | 841-850   | 4/7      | (a)    | Tone variants                                         |
| `.gap-bar`                                 | 822       | 1/7      | (b)    | **PROMOTE-VARIANT** — wrapper combinato bar + pill    |
| `.gauge-bar-fill.gauge-accent`             | 1870      | 1/7      | (d)    | **Duplicato di `.bar-fill`** — naming gauge specifico |
| `.gauge-accent/.gauge-success/.gauge-warn` | 1867-1882 | 1/7      | (d)    | Da unificare con `.bar-fill.fill-*`                   |

### 3.8 Buttons & controls

| Classe                | Linea | # mockup | Class. | Note                                    |
| --------------------- | ----- | -------- | ------ | --------------------------------------- |
| `.btn`                | 553   | 7/7      | (a)    | Button atomo                            |
| `.btn-primary`        | 569   | 7/7      | (a)    | Primary CTA (accent fill)               |
| `.btn-ghost`          | 576   | 7/7      | (a)    | Secondary action (border + transparent) |
| `.theme-toggle-btn`   | 119   | 7/7      | (a)    | Theme switcher                          |
| `.filter-pill`        | 724   | 5/7      | (a)    | Filter chip                             |
| `.filter-pill.active` | 737   | 5/7      | (a)    | Active state filter                     |
| `.filter-bar`         | 1946  | 1/7      | (a)    | Container filtri (skills heatmap)       |
| `.filter-group`       | 1957  | 1/7      | (a)    | Group filtri per dimensione             |
| `.filter-label`       | 1963  | 1/7      | (a)    | Label gruppo                            |

### 3.9 Typography & identity

| Classe                | Linea | # mockup   | Class. | Note                                |
| --------------------- | ----- | ---------- | ------ | ----------------------------------- |
| `.wordmark`           | 78    | (1/7 hero) | (a)    | Logo originale 22px (hero)          |
| `.wordmark-sm`        | 92    | 7/7        | (a)    | Logo nav-bar 18px                   |
| `.wordmark-sm.legacy` | 105   | (variante) | (b)    | Logo body brand-blue (legacy theme) |
| `.wordmark-foot`      | 108   | 7/7        | (a)    | Logo footer (logo originale L27)    |

### 3.10 Activity feed

| Classe           | Linea | # mockup | Class. | Note                                                                   |
| ---------------- | ----- | -------- | ------ | ---------------------------------------------------------------------- |
| `.activity`      | 857   | 1/7      | (c)    | **PROMOTE-NEW** — wrapper activity feed                                |
| `.activity-head` | 865   | 1/7      | (b)    | Header activity                                                        |
| `.activity-list` | 897   | 1/7      | (d→a)  | **Da considerare unify con `.audit-list`** (stesso pattern row stream) |
| `.activity-item` | 902   | 1/7      | (d→a)  | **Stesso pattern di `.audit-row`**                                     |

**Drift potenziale**: `.activity-list`/`.activity-item` (HrDirector) e `.audit-list`/`.audit-row` (OrgSystems) sono entrambi pattern "live event stream con timestamp + actor". Da valutare promozione a `.event-stream` + 2 varianti.

### 3.11 Ontology / KG specifics

| Classe                                                                      | Linea     | # mockup | Class. | Note                                     |
| --------------------------------------------------------------------------- | --------- | -------- | ------ | ---------------------------------------- |
| `.kg-legend`                                                                | 2114      | 1/7      | (b)    | Variant del componente KG graph          |
| `.ont-row`                                                                  | 2135      | 1/7      | (c)    | **PROMOTE-NEW** — ontology breakdown row |
| `.profile-meta`/`profile-name`/`profile-sub`/`profile-stats`/`profile-stat` | 2205-2257 | 1/7      | (b)    | Sub-pattern di `.profile-hero`           |
| `.tag-platform` / `.tag-tenant`                                             | 1450-1454 | 2/7      | (b)    | Variants per tenant-card type            |

**Cardinalità totale**: 138 selettori principali estratti. Distribuzione classification: **(a) IN-CATALOG = ~52** · **(b) PROMOTE-VARIANT = ~28** · **(c) PROMOTE-NEW = ~38** · **(d) UNIFY = ~18** · **(e) REMOVE = 0** (nessun asset orfano identificato — tutto è usato in almeno 1 mockup).

## 4. Catalogo React component classificato (17 totali)

### 4.A — 9 BrandWidget (`services/app/src/components/widgets/brand/`)

| #   | Widget                 | Path:line                       | Props                                                                                                        | CSS classes consumate                                                                         | In registry?                    | Class.                                                                                  |
| --- | ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| 1   | BrandKpiCard           | `BrandKpiCard.tsx:27`           | `value, label, sublabel, unit, trend, footLeft, footRight, icon`                                             | `.kpi-card` `.kpi-head` `.kpi-label` `.kpi-icon` `.kpi-num` `.kpi-sub` `.delta` `.kpi-foot`   | ✅ slug `KpiRing`               | (a)                                                                                     |
| 2   | BrandIntegrationHealth | `BrandIntegrationHealth.tsx:30` | `tone, label?, pulse?, showDot?`                                                                             | `.kpi-card` `.kpi-head` `.pill` `.pill-{ok\|warn\|critical\|info}`                            | ✅ slug `IntegrationHealthPill` | (a)                                                                                     |
| 3   | BrandSuccessionCard    | `BrandSuccessionCard.tsx:45`    | `candidateName, currentRole, targetRole, readinessPercent, readiness?, risk?, readyBy?, candidateAvatarUrl?` | `.succession-card` `.role` `.candidates` `.candidate` `.more` `.pill` `.meta-row`             | ✅ slug `SuccessionCard`        | (a)                                                                                     |
| 4   | BrandRbacMatrix        | `BrandRbacMatrix.tsx:49`        | `roles, areas, assignments, readonly?`                                                                       | `.skill-gap` `.skill-gap-head` `.filters` `.filter-pill` `table.dense` `.pill` `.mono`        | ✅ slug `RbacMatrix`            | (a) ma **drift di naming**: usa `.skill-gap` per RBAC matrix (semanticamente improprio) |
| 5   | BrandSkillHeatmap      | `BrandSkillHeatmap.tsx:34`      | `rows, cols, cells, caption?, showValue?`                                                                    | `.heatmap-wrap` `.heatmap-grid` `.heatmap-cell` `.hl-{10,30,50,70,90}`                        | ✅ slug `SkillHeatmap`          | (a) ma **drift bucket naming** vs SkillsHeatmapView (`.heat-0..6`)                      |
| 6   | BrandActivityFeed      | `BrandActivityFeed.tsx:20`      | `items, title?, live?`                                                                                       | `.activity` `.activity-head` `.live` `.activity-list` `.activity-item`                        | ❌ **NON registrato**           | (a) ma **gap registry**                                                                 |
| 7   | BrandKgGraph           | `BrandKgGraph.tsx:40`           | `nodes, edges, legend?, ariaLabel?, height?`                                                                 | `.kg-graph` `.legend` `.legend-dot` SVG inline                                                | ✅ slug `KgMiniGraph`           | (a)                                                                                     |
| 8   | BrandCareerArc         | `BrandCareerArc.tsx:20`         | `stages, currentIndex?`                                                                                      | `.career-arc` `.career-stage{.past\|.current\|.future}` `.dot` `.label` `.year`               | ✅ slug `CareerArc`             | (a)                                                                                     |
| 9   | BrandCapabilityRadar   | `BrandCapabilityRadar.tsx:28`   | `axes, series, max?, rings?, showLegend?, size?`                                                             | `.capability-radar` `.radar-svg` `.radar-grid` `.radar-axis` `.radar-current` `.radar-target` | ✅ slug `CapabilityRadar`       | (a)                                                                                     |

**Verified-by registry**: `services/app/src/lib/dashboard-engine/registry.tsx:251-260` — 8 entries, BrandActivityFeed orfano.

### 4.B — 8 atomic dashboard component (`packages/ui/src/components/dashboard/`)

| #   | Component             | Path:line                        | Storybook | Test | Use Client             | Class.                                    |
| --- | --------------------- | -------------------------------- | --------- | ---- | ---------------------- | ----------------------------------------- |
| 1   | KpiRing               | `kpi-ring.tsx:43`                | ✅        | ❌   | No                     | (e?) — overlap con BrandKpiCard           |
| 2   | IntegrationHealthPill | `integration-health-pill.tsx:54` | ✅        | ❌   | No                     | (e?) — overlap con BrandIntegrationHealth |
| 3   | SuccessionCard        | `succession-card.tsx:64`         | ✅        | ❌   | No                     | (e?) — overlap con BrandSuccessionCard    |
| 4   | CareerArc             | `career-arc.tsx:44`              | ✅        | ❌   | No                     | (e?) — overlap con BrandCareerArc         |
| 5   | KgMiniGraph           | `kg-mini-graph.tsx:25`           | ✅        | ❌   | **Yes** ('use client') | (e?) — overlap con BrandKgGraph           |
| 6   | SkillHeatmap          | `skill-heatmap.tsx:45`           | ✅        | ❌   | No                     | (e?) — overlap con BrandSkillHeatmap      |
| 7   | CapabilityRadar       | `capability-radar.tsx:40`        | ✅        | ❌   | No                     | (e?) — overlap con BrandCapabilityRadar   |
| 8   | RbacMatrix            | `rbac-matrix.tsx:57`             | ✅        | ❌   | No                     | (e?) — overlap con BrandRbacMatrix        |

**Critical finding**: i 9 BrandWidget e gli 8 atomic component sono **17 implementazioni parallele di 8 visualizzazioni canoniche**. Verificato che:

- BrandWidget consumano **solo** classi CSS canonical da `dashboard-brand.css` — mockup-faithful rendering
- Atomic component usano **Tailwind + cva + lucide-react + Radix Avatar/Badge** — design-system generic
- **Zero composizione cross**: nessun BrandWidget importa atomic; nessun atomic è usato dal widget registry o dalle 7 view

**Decisione promotion attesa**: o (i) deprecare gli 8 atomic come "design-system generic non-brand" e mantenere solo BrandWidget come catalogo dashboard, **oppure** (ii) refactor BrandWidget come compositori degli atomic (es. `BrandKpiCard = KpiRing + brand chrome wrapper`). Decisione brand pending.

## 5. Drift map — duplicati semantici e naming incoerenze

| ID  | Drift                                 | Asset coinvolti                                             | File evidence                                                                                          | Severity     | Intervento                                                                         |
| --- | ------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------- |
| D1  | Pill 2-system                         | `.pill-{critical,warn,ok}` vs `.status-{down,warn,ok}`      | `dashboard-brand.css:794-816, 1697-1716` · `OrgSystemsView.tsx:174` · `HrDirectorOverviewView.tsx:166` | **HIGH**     | Unify a 1 sistema (raccomandato `.pill` BEM)                                       |
| D2  | Split 3-system                        | `.double-split` vs `.kg-split` vs `.bottom-split`           | `dashboard-brand.css:1532, 2008, 2103`                                                                 | **MED**      | Unify a `.split-2` con varianti ratio                                              |
| D3  | Heatmap bucket 2-system               | `.hl-{10..90}` vs `.heat-{0..6}`                            | `dashboard-brand.css:1243-1256, 1976-2000`                                                             | **HIGH**     | Unify a 1 scala (raccomandato `.heat-{0..6}` per bucket esplicito)                 |
| D4  | Bar fill 2-system                     | `.bar-fill.fill-*` vs `.gauge-bar-fill.gauge-*`             | `dashboard-brand.css:841-850, 1867-1882`                                                               | **MED**      | Unify a `.bar-fill.fill-*`                                                         |
| D5  | Activity vs Audit row                 | `.activity-list/.activity-item` vs `.audit-list/.audit-row` | `dashboard-brand.css:857-902, 1725-1729`                                                               | **LOW**      | Promuovere a `.event-stream` + 2 varianti opzionale                                |
| D6  | RBAC matrix usa `.skill-gap` wrapper  | `BrandRbacMatrix`                                           | `BrandRbacMatrix.tsx:49+`                                                                              | **MED**      | Promuovere `.matrix-wrap` come wrapper canonico, dedicato (semanticamente proprio) |
| D7  | 17 implementazioni parallel di 8 viz  | 9 BrandWidget + 8 atomic                                    | `services/app/src/components/widgets/brand/*` + `packages/ui/src/components/dashboard/*`               | **HIGH**     | Decisione brand: deprecare uno dei due, o refactor con composizione                |
| D8  | BrandActivityFeed non in registry     | gap registry                                                | `registry.tsx:251-260`                                                                                 | **LOW**      | Aggiungere entry `ActivityFeed`                                                    |
| D9  | 7 view bespoke non consumano registry | `services/app/src/app/(app)/dashboard/_views/*View.tsx`     | Tutte e 7 le view                                                                                      | **CRITICAL** | Convergenza a `<DashboardRenderer/>` (gap G5)                                      |
| D10 | Atomic packages/ui senza test         | 8 atomic                                                    | `packages/ui/src/components/dashboard/*.tsx` (zero `.test.tsx`)                                        | **MED**      | Aggiungere unit test (se decisione = mantenere atomic)                             |

## 6. Coverage matrix — asset per mockup

| Asset                                         | org-systems | hr-director | skills-heatmap | capability-graph | employee-journey | cross-tenant | tenant-owner | Total |
| --------------------------------------------- | ----------- | ----------- | -------------- | ---------------- | ---------------- | ------------ | ------------ | ----- |
| Chrome universale (15 classi §3.2)            | ✅          | ✅          | ✅             | ✅               | ✅               | ✅           | ✅           | 7/7   |
| `.kpi-card` `.panel` `.btn-*` `.section-head` | ✅          | ✅          | ✅             | ✅               | ✅               | ✅           | ✅           | 7/7   |
| `.tenant-grid` `.tenant-card`                 | ✅          | –           | –              | –                | –                | ✅           | –            | 2/7   |
| `table.rbac` (heat-graded)                    | ✅          | –           | –              | –                | –                | –            | –            | 1/7   |
| `.int-row` `.status-pill`                     | ✅          | –           | –              | –                | –                | ✅           | ✅           | 3/7   |
| `.audit-list` `.audit-row`                    | ✅          | –           | –              | –                | –                | –            | –            | 1/7   |
| `.metrics-grid` `.metric-card` `.sparkline`   | ✅          | –           | –              | –                | –                | –            | –            | 1/7   |
| `.skill-gap` `.gap-bar`                       | –           | ✅          | –              | –                | –                | –            | –            | 1/7   |
| `.activity` `.activity-list`                  | –           | ✅          | –              | –                | –                | –            | –            | 1/7   |
| `.succession-grid` `.succession-card`         | –           | ✅          | –              | –                | –                | –            | ✅           | 2/7   |
| `.heatmap-wrap` `.heatmap-grid` `.heat-*`     | –           | –           | ✅             | –                | –                | –            | –            | 1/7   |
| `.histogram` `.histo-*` `.crit-row`           | –           | –           | ✅             | –                | –                | –            | –            | 1/7   |
| `.kg-graph` `.kg-split` `.kg-legend`          | –           | –           | –              | ✅               | –                | –            | –            | 1/7   |
| `.ont-row`                                    | –           | –           | –              | ✅               | –                | –            | –            | 1/7   |
| `.profile-hero` `.pbadge-*` `.profile-stats`  | –           | –           | –              | –                | ✅               | –            | –            | 1/7   |
| `.career-arc` `.career-stage`                 | –           | –           | –              | –                | ✅               | –            | –            | 1/7   |
| `.capability-radar` SVG                       | –           | –           | –              | –                | ✅               | –            | –            | 1/7   |
| `.bridge-grid` `.bridge-card`                 | –           | –           | –              | –                | ✅               | –            | –            | 1/7   |
| `.gauge-grid` `.gauge-card`                   | –           | –           | –              | –                | –                | ✅           | –            | 1/7   |
| `.comp-grid` `.comp-card`                     | –           | –           | –              | –                | –                | –            | ✅           | 1/7   |

**Reading**: la chrome universale è solida (15 classi in 7/7). Tutti gli altri asset specializzati sono **1-3/7**: nessuna sovrapposizione ampia oltre il chrome. Conferma che ogni mockup Phase 9 era pensato come "surface ad-hoc indipendente", e Phase 15.A ha replicato fedelmente questa specializzazione invece di astrarla.

## 7. Gap formale verso modello unificato

| ID  | Gap                          | Stato attuale                                                      | Target post-promotion                                                                                  |
| --- | ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| GA1 | Catalogo CSS formalizzato    | 138 classi implicite in `dashboard-brand.css`                      | Doc `brand-dashboard-catalog.md` con spec asset + varianti dichiarate per ognuno                       |
| GA2 | Catalogo React formalizzato  | 9 BrandWidget + 8 atomic parallel                                  | 1 catalogo Brand Identity unificato (decisione brand pending)                                          |
| GA3 | Schema preset DB             | `role_default_dashboards` mappa role→preset_code (7 preset)        | Estendere con `dashboard_preset_layout` (slot variabili: `[{slot_index, type, variant?, query, ...}]`) |
| GA4 | Renderer unico DB-driven     | 7 file `*View.tsx` bespoke + switch in `dashboard/page.tsx:79-111` | 1 `<DashboardRenderer preset={...}/>` consumer del widget registry                                     |
| GA5 | Drift remediation            | 10 drift identificati (§5)                                         | 0 drift: 1 sistema pill, 1 sistema split, 1 sistema heatmap bucket, 1 sistema bar fill                 |
| GA6 | Test coverage atomic         | 0/8 atomic packages/ui hanno `.test.tsx`                           | Vitest unit tests + Playwright visual regression (se atomic mantenuti)                                 |
| GA7 | BrandActivityFeed registrato | Gap: export esiste ma non in `WIDGET_REGISTRY`                     | Entry aggiunta + adapter                                                                               |
| GA8 | Cross-link doc → catalogo    | Audit corrente isolato in `08-promotion/`                          | Promozione finale a `docs/30-developer/brand-dashboard-catalog.md` (post-decisioni)                    |

## 8. Roadmap sintesi (riferimento, NON eseguita in questa sessione)

6 step sequenziali stimati ~26-37h totali per arrivare al modello unificato:

| Step   | Descrizione                                                                                                                                                                                                                             | Effort | Dipende da |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------- |
| **G1** | Formalizzare catalogo Brand Identity dashboard: doc canonical con spec + varianti per ogni asset                                                                                                                                        | 4-6h   | –          |
| **G2** | Risolvere D1-D6 drift remediation (unify pill, split, heatmap bucket, bar fill, activity/audit, matrix wrapper)                                                                                                                         | 3-4h   | G1         |
| **G3** | Promuovere asset mancanti: implementare BrandWidget per `.gauge-card`, `.comp-card`, `.bridge-card`, `.profile-hero`, `.histogram` (5 nuovi); aggiungere BrandActivityFeed in registry (D8); decidere D7 (refactor vs deprecate atomic) | 8-12h  | G1 + G2    |
| **G4** | Estendere schema DB: nuova tabella `dashboard_preset_layout` con slot variabili gerarchici (es. `double-split.left/right`); migration + RLS + seed                                                                                      | 3-4h   | G1         |
| **G5** | Riscrivere `<DashboardRenderer>` consumer del widget registry; eliminare i 7 `*View.tsx`; switch `dashboard/page.tsx` collassa a unica chiamata renderer                                                                                | 6-8h   | G3 + G4    |
| **G6** | Seedare 8 preset DB-driven (uno per ruolo, slot composte da catalogo) — sostituisce hardcoded JSX                                                                                                                                       | 3-4h   | G4 + G5    |

## Appendice A — Verified-by stamps cardine

| Asserzione                                          | Evidence file:line                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 138 selettori CSS class principali                  | Grep `^\.[a-zA-Z][...]` su `dashboard-brand.css` (output 138 entries)                            |
| 28 sezioni semantiche CSS                           | Grep `^/\* ===` su `dashboard-brand.css`                                                         |
| 9 BrandWidget exports                               | `services/app/src/components/widgets/brand/index.ts`                                             |
| 8 widget registry entries (ActivityFeed mancante)   | `registry.tsx:251-260`                                                                           |
| 7 `*View.tsx` bespoke + switch su preset_code       | `dashboard/page.tsx:79-111`                                                                      |
| Resolver `tenant override > platform default`       | `role-preset-resolver.ts:27-50`                                                                  |
| 8 platform default seed                             | `phase15a_role_default_dashboards.sql:57-65`                                                     |
| 7 mockup HTML canonical (5 Phase 9 + 2 Phase 14.SH) | `.ux-design/06-mockups/dashboards/*.html`                                                        |
| BrandKpiCard non riusa atomic KpiRing               | Cross-check imports — `BrandKpiCard.tsx` zero import da `@heuresys/ui`                           |
| 17 parallel implementations                         | 9 in `services/app/src/components/widgets/brand/` + 8 in `packages/ui/src/components/dashboard/` |

---

**Document end** · 2026-05-08 · Audit read-only · zero codice produzione modificato · output classificato pronto per acceptance utente prima di passare alla roadmap remediation G1-G6.
