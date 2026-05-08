# Brand Identity — Dashboard Catalog (canonical)

> **Status**: Canonical SoT post-L40/L41/L42 · **Generated**: 2026-05-08 (S19) · **Scope**: dominio dashboard
>
> Catalogo formale degli asset Brand Identity utilizzabili dalle dashboard dinamiche. Equivale alla **libreria asset Brand Identity** per il dominio dashboard (decisione fondante L40).
>
> **Single SoT per visivo**. Nessuna dashboard dinamica può introdurre DOM o classi CSS fuori da questo catalogo. Eccezioni = "dashboard ad-hoc" definite caso per caso, non dinamiche.

## Riferimenti

- **CSS canonical**: [`services/app/src/styles/dashboard-brand.css`](../../services/app/src/styles/dashboard-brand.css)
- **Tokens runtime**: [`services/app/src/styles/active-theme.css`](../../services/app/src/styles/active-theme.css)
- **BrandWidget React**: [`services/app/src/components/widgets/brand/`](../../services/app/src/components/widgets/brand/)
- **Atomic dashboard component (Phase 13.A)**: [`packages/ui/src/components/dashboard/`](../../packages/ui/src/components/dashboard/) — D7 keep/deprecate pending
- **Audit current-state (S18 snapshot)**: [`.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md`](../../.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md)
- **Mockup reference**: [`.ux-design/06-mockups/dashboards/`](../../.ux-design/06-mockups/dashboards/) — 7 file Phase 9 + Phase 14.SH carry-forward
- **Decisions log**: [`.ux-design/DECISIONS-LOG.md`](../../.ux-design/DECISIONS-LOG.md) § L40 · L41 · L42

## 1. Modello a 3 livelli

```
LIVELLO 1 — CATALOGO (= Brand Identity, questo doc)
  Set finito di asset grafici canonici dichiarati con spec + classi CSS + React component

LIVELLO 2 — VARIANTI
  Modificatori CSS dichiarati (es. .pill.pill-warn, .tenant-card.platform)
  Stesso DOM root, variante semantica/cromatica esplicita

LIVELLO 3 — COMPOSIZIONE PER RUOLO (data-driven, fuori da questo doc)
  Preset DB con slot variabili: { type: <asset_canonico>, variant?: <modificatore>, query: <Q> }
  Renderer unico: <DashboardRenderer preset={...}/> (G5 in roadmap)
```

## 2. Status legend

| Tag | Significato                                                                 |
| --- | --------------------------------------------------------------------------- |
| ✅  | In catalogo · production-ready · BrandWidget React mappato                  |
| 🆕  | In catalogo · CSS pronto · BrandWidget React **PROMOTE-NEW** in G3 (~8-12h) |
| 🔧  | Variante (livello 2) · modifier su asset esistente                          |
| 🚫  | Deprecato post-L41/L42 · non usabile                                        |

---

## 3. Layout primitives

### 3.1 dashboard-shell

| Field    | Value                                                                                         |
| -------- | --------------------------------------------------------------------------------------------- |
| Selector | `.dashboard-shell`                                                                            |
| Status   | ✅                                                                                            |
| CSS line | `dashboard-brand.css:19`                                                                      |
| Semantic | Wrapper viewport-fill di tutta la pagina dashboard. Container per `app` grid.                 |
| Dataset  | `data-sidebar="expanded\|collapsed"` per stato sidebar                                        |
| Variants | —                                                                                             |
| React    | Embed in `BrandShell` (`services/app/src/app/(app)/_components/BrandShell.tsx`)               |
| When     | **Sempre** la prima `<div>` figlia del layout `(app)/`. Una sola istanza per route dashboard. |

### 3.2 app

| Field    | Value                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| Selector | `.app`                                                                         |
| Status   | ✅                                                                             |
| CSS line | ~142                                                                           |
| Semantic | Grid 240px sidebar + 1fr workspace. Responsive: collassa a 1 col sotto 1100px. |
| Variants | —                                                                              |
| React    | `BrandShell` interno                                                           |
| When     | Figlia immediata di `.dashboard-shell`                                         |

### 3.3 workspace

| Field    | Value                                                                   |
| -------- | ----------------------------------------------------------------------- |
| Selector | `.workspace`                                                            |
| Status   | ✅                                                                      |
| CSS line | ~437                                                                    |
| Semantic | Content area (1fr). Container per ws-header + view content + ws-footer. |
| Variants | —                                                                       |
| When     | Figlia destra di `.app`                                                 |

### 3.4 main-split

| Field    | Value                                                                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selector | `.main-split`                                                                                                                                             |
| Status   | ✅                                                                                                                                                        |
| CSS line | ~676                                                                                                                                                      |
| Semantic | Layout 2-col asimmetrico per sezioni Dashboard "main" (skill-gap + activity feed). Coverage: HrDirector + EmployeeJourney + CapabilityGraph (3/7 mockup). |
| Variants | —                                                                                                                                                         |
| When     | Per sezioni che richiedono main-content + side-panel                                                                                                      |

### 3.5 double-split (canonical post-L42)

| Field    | Value                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selector | `.double-split`                                                                                                                                               |
| Status   | ✅ (post-L42 unified)                                                                                                                                         |
| CSS line | ~1516                                                                                                                                                         |
| Semantic | Grid 2-col asimmetrico (1.4fr 1fr). Responsive: 1 col sotto 1100px.                                                                                           |
| Coverage | OrgSystems · TenantOwner · CrossTenant · CapabilityGraph · SkillsHeatmap (5/7 mockup)                                                                         |
| Variants | — (drift `.kg-split` 2:1 e `.bottom-split` 1.2:1 rimossi in L42; reintroducibili come `.double-split--wide`/`.double-split--narrow` se feedback brand emerge) |
| When     | Default per layout 2-col asimmetrico in dashboard                                                                                                             |

---

## 4. Navigation & chrome

### 4.1 nav-bar

| Field    | Value                                                                                      |
| -------- | ------------------------------------------------------------------------------------------ |
| Selector | `.nav-bar` · `.nav-bar .nav-left` · `.nav-bar .nav-right`                                  |
| Status   | ✅                                                                                         |
| CSS line | 29 · 50 · 56                                                                               |
| Semantic | Topbar fissa in alto. Border-bottom accent. Logo + label sx · theme-toggle + user-menu dx. |
| Variants | —                                                                                          |
| React    | `BrandShell`                                                                               |
| Coverage | 7/7 mockup                                                                                 |

### 4.2 sidebar

| Field    | Value                                                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Selector | `.sidebar` · `.sidebar-top` · `.sidebar-toggle` · `.sidebar-section` · `.sidebar-link` · `.sidebar-link.active` · `.tenant-mini` · `.user-card` |
| Status   | ✅                                                                                                                                              |
| CSS line | 157 · 166 · 174 · 264 · 302 · 320 · 205 · 359                                                                                                   |
| Semantic | Panel sx 240px collapsible a 64px. Sezioni h4 + nav links + active state + tenant-mini badge top + user-card bottom.                            |
| Variants | `.sidebar-link.active` (livello 2 — currently route)                                                                                            |
| React    | `BrandShell` con role-driven nav via `getNavForUser()`                                                                                          |
| Coverage | 7/7 mockup                                                                                                                                      |

### 4.3 footer

| Field    | Value                                                       |
| -------- | ----------------------------------------------------------- |
| Selector | `.app-footer`                                               |
| Status   | ✅                                                          |
| CSS line | ~1283                                                       |
| Semantic | Bottom static footer. Wordmark `wordmark-foot` + meta info. |
| Coverage | 7/7 mockup                                                  |

### 4.4 ws-header / ws-footer

| Field     | Value                                                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Selectors | `.ws-header` · `.ws-footer` · `.section-head`                                                                                                                                                          |
| Status    | ✅                                                                                                                                                                                                     |
| CSS line  | ~442 · ~508 · ~524                                                                                                                                                                                     |
| Semantic  | ws-header: workspace title + breadcrumb + actions row (top di ogni view). ws-footer: SOURCE + view identifier (bottom di ogni view). section-head: h2 + meta separator (intestazione sezione interna). |
| Variants  | —                                                                                                                                                                                                      |
| Coverage  | 7/7 mockup                                                                                                                                                                                             |

### 4.5 widget-head (post-L42 shared)

| Field     | Value                                                                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.widget-head` · `.widget-head h2` · `.widget-head h2 em` · `.widget-head .filters`                                                                                                     |
| Status    | ✅ (post-L42 — rinominato da `.skill-gap-head`)                                                                                                                                         |
| CSS line  | ~697-723                                                                                                                                                                                |
| Semantic  | Header pattern per qualsiasi widget complesso. Title + filter chips. Riusato da BrandRbacMatrix · BrandSkillHeatmap · BrandCapabilityRadar · BrandKgGraph + HrDirectorSkillGap section. |
| Variants  | Inline style override (border-bottom 0, padding 0, marginBottom) per usi compact (radar, kg-graph)                                                                                      |
| React     | Embedded in 4+ BrandWidget                                                                                                                                                              |

---

## 5. Card patterns

### 5.1 kpi-card (atomo universale)

| Field     | Value                                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.kpi-card` · `.kpi-ring` (container 4-col grid) · `.kpi-head` · `.kpi-label` · `.kpi-icon` · `.kpi-num` · `.kpi-sub` · `.kpi-foot` · `.delta` |
| Status    | ✅                                                                                                                                             |
| CSS line  | ~600 (card) · ~589 (ring)                                                                                                                      |
| Semantic  | KPI atom: numerical metric + label + sublabel + icon + trend delta + footer. Universal per qualsiasi metrica numerica.                         |
| Variants  | — (cromatica via tone CSS variables)                                                                                                           |
| React     | `BrandKpiCard` (`services/app/src/components/widgets/brand/BrandKpiCard.tsx`) — registry slug `KpiRing`                                        |
| Coverage  | 7/7 mockup                                                                                                                                     |

### 5.2 panel (universal card wrapper)

| Field     | Value                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| Selectors | `.panel` · `.panel-head` · `.panel-head h2` · `.panel-head .meta`                                              |
| Status    | ✅                                                                                                             |
| CSS line  | ~1527-1565                                                                                                     |
| Semantic  | Card wrapper + border + radius. Container per qualsiasi sezione panel-headed. Body = surface-1, border = rule. |
| Variants  | —                                                                                                              |
| Coverage  | 7/7 mockup                                                                                                     |

### 5.3 matrix-wrap (post-L42 NEW)

| Field     | Value                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.matrix-wrap`                                                                                                                |
| Status    | ✅ (post-L42)                                                                                                                 |
| CSS line  | ~691 (consolidato con `.skill-gap` via comma selector)                                                                        |
| Semantic  | Wrapper canonical per **matrix display** (RBAC matrix, skill matrix). Stesso chrome di `.panel` ma semantica matrix-specific. |
| Variants  | —                                                                                                                             |
| React     | `BrandRbacMatrix` consume `.matrix-wrap > .widget-head + table.dense`                                                         |

### 5.4 skill-gap (HrDirector specific)

| Field     | Value                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.skill-gap`                                                                                                        |
| Status    | ✅ (preservato in L42 dopo errore-fix)                                                                              |
| CSS line  | ~691 (consolidato con `.matrix-wrap`)                                                                               |
| Semantic  | Wrapper specifico per "skill gap analysis" section (HrDirector). Same chrome di matrix-wrap, semantica HR-specific. |
| Variants  | —                                                                                                                   |

### 5.5 tenant-card

| Field     | Value                                                                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.tenant-card` · `.tenant-card.platform` · `.tenant-grid` · `.tag-platform` · `.tag-tenant`                                              |
| Status    | ✅                                                                                                                                       |
| CSS line  | ~1428 · 1435 · 1417 · 1450                                                                                                               |
| Semantic  | Card per tenant info (cross-tenant + org-systems): name + scope-pill + status + meta. Variant `platform` per Heuresys System (landlord). |
| Variants  | 🔧 `.tenant-card.platform` (livello 2 — landlord variant) · `.tag-platform` / `.tag-tenant`                                              |
| Coverage  | 2/7 mockup (org-systems + cross-tenant)                                                                                                  |

### 5.6 metric-card

| Field     | Value                                                                                |
| --------- | ------------------------------------------------------------------------------------ |
| Selectors | `.metric-card` · `.metrics-grid` · `.sparkline` (SVG inline)                         |
| Status    | ✅                                                                                   |
| CSS line  | ~1780-1800                                                                           |
| Semantic  | Card per metric system (DB size · CPU · memory · queue) + sparkline SVG. Grid 4-col. |
| Coverage  | 1/7 mockup (org-systems)                                                             |

### 5.7 succession-card

| Field     | Value                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| Selectors | `.succession-card` · `.succession-grid` · `.succession-card .role` · `.candidates` · `.candidate` · `.more` |
| Status    | ✅                                                                                                          |
| CSS line  | ~949                                                                                                        |
| Semantic  | Succession pipeline card: target role + candidate list + risk pill + readiness.                             |
| Variants  | Risk pill via `.pill.pill-{ok,warn,critical}`                                                               |
| React     | `BrandSuccessionCard`                                                                                       |
| Coverage  | 2/7 mockup (HrDirector + TenantOwner)                                                                       |

### 5.8 gauge-card 🆕

| Field     | Value                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.gauge-card` · `.gauge-grid` · `.gauge-card .lbl` · `.gauge-card .gauge-val` · `.gauge-card .gauge-bar` · `.gauge-card .bar-fill` (post-L42)                              |
| Status    | 🆕 — CSS ready, BrandGaugeCard PROMOTE-NEW in G3                                                                                                                           |
| CSS line  | ~1826-1844                                                                                                                                                                 |
| Semantic  | Capability gauge: label + numeric value + bar progress. Tones via `.bar-fill.fill-{info,ok,warn,critical}` (post-L42). Text color via `.gauge-{accent,success,warn}` solo. |
| Variants  | tone (info/ok/warn/critical)                                                                                                                                               |
| Coverage  | 1/7 mockup (cross-tenant overview)                                                                                                                                         |

### 5.9 comp-card 🆕

| Field     | Value                                                         |
| --------- | ------------------------------------------------------------- |
| Selectors | `.comp-card` · `.comp-grid` · subelements                     |
| Status    | 🆕 — PROMOTE-NEW in G3                                        |
| CSS line  | ~1895                                                         |
| Semantic  | Compensation breakdown card: salary + bonus + equity + total. |
| Coverage  | 1/7 mockup (tenant-owner)                                     |

### 5.10 bridge-card 🆕

| Field     | Value                                                                              |
| --------- | ---------------------------------------------------------------------------------- |
| Selectors | `.bridge-card` · `.bridge-grid`                                                    |
| Status    | 🆕 — PROMOTE-NEW in G3                                                             |
| CSS line  | ~2299                                                                              |
| Semantic  | Career-bridge card (employee-journey): role transition + skill bridge + readiness. |
| Coverage  | 1/7 mockup (employee-journey)                                                      |

### 5.11 profile-hero 🆕

| Field     | Value                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------- |
| Selectors | `.profile-hero` · `.profile-meta` · `.profile-name` · `.profile-sub` · `.profile-stats` · `.profile-stat` |
| Status    | 🆕 — PROMOTE-NEW in G3                                                                                    |
| CSS line  | ~2179-2257                                                                                                |
| Semantic  | Hero block per profile employee (employee-journey): avatar + name + role + tenure + stats grid.           |
| Coverage  | 1/7 mockup (employee-journey)                                                                             |

---

## 6. Tables & data

### 6.1 table.dense

| Field    | Value                                                                                        |
| -------- | -------------------------------------------------------------------------------------------- |
| Selector | `table.dense`                                                                                |
| Status   | ✅                                                                                           |
| Semantic | Tabella compatta universale. Padding cell 8px, fontSize 12px, borderTop rule, sticky header. |
| Coverage | 5/7 mockup                                                                                   |

### 6.2 table.rbac (heat-graded)

| Field    | Value                                                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Selector | `table.rbac` con `.lvl-{100,80,60,40,20,5}`                                                                                            |
| Status   | 🆕 — CSS ready, BrandRbacMatrix lo consuma già                                                                                         |
| CSS line | ~1576+                                                                                                                                 |
| Semantic | Matrice RBAC: ruolo × area, cell con permission level (none/read/write/admin/owner). Heat-graded: lvl-100 più scuro, lvl-5 più chiaro. |
| Variants | `.lvl-{100,80,60,40,20,5}` (heat scale)                                                                                                |
| React    | `BrandRbacMatrix`                                                                                                                      |

### 6.3 heatmap-cell (post-L41 unified)

| Field     | Value                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.heatmap-wrap` · `.heatmap-grid` · `.heatmap-cell` · `.heatmap-cell.heat-{0..6}` · `.heatmap-row-label` · `.heatmap-col-header` |
| Status    | ✅ (post-L41 unified — `.hl-*` rimossi)                                                                                          |
| CSS line  | ~1220-1280 + ~1976-2000                                                                                                          |
| Semantic  | Heatmap matrix: rows × cols con bucket colorato heat-0 (low) → heat-6 (high). 7 bucket per granularità ricca.                    |
| Variants  | 🔧 `.heat-{0..6}` (livello 2 — bucket scale)                                                                                     |
| React     | `BrandSkillHeatmap` (post-L41 helper a 7 soglie)                                                                                 |
| Coverage  | 1/7 mockup (skills-heatmap)                                                                                                      |

### 6.4 audit-list / audit-row (post-L42 distinct)

| Field     | Value                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| Selectors | `.audit-list` · `.audit-row` · `.audit-row .ts` · `.audit-row .what` · `.audit-row .actor` · `.audit-row .accent` |
| Status    | ✅ (post-L42 — preservato distinto da activity)                                                                   |
| CSS line  | ~1685+ (post-L42 shift)                                                                                           |
| Semantic  | Audit trail row: timestamp + action + actor + accent highlight. 4 slot orizzontali per audit log live stream.     |
| Coverage  | 1/7 mockup (org-systems)                                                                                          |

### 6.5 activity-list / activity-item (post-L42 distinct)

| Field     | Value                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.activity` · `.activity-head` · `.activity-list` · `.activity-item` · `.activity-item .when` · `.activity-item .what` · `.activity-item .who` · `.live` |
| Status    | ✅ (post-L42 — preservato distinto da audit)                                                                                                             |
| CSS line  | ~857-928                                                                                                                                                 |
| Semantic  | Activity feed live: 3 slot verticali (when/what/who). Pattern per live event stream con dot pulsing.                                                     |
| React     | `BrandActivityFeed` ⚠️ **gap registry** — non ancora in `WIDGET_REGISTRY` (D8, fix in G3)                                                                |
| Coverage  | 1/7 mockup (HrDirector)                                                                                                                                  |

### 6.6 int-row

| Field     | Value                                                                                      |
| --------- | ------------------------------------------------------------------------------------------ |
| Selectors | `.int-row` · `.int-row .icon` · `.int-row .info` · `.int-row .name` · `.int-row .meta`     |
| Status    | ✅                                                                                         |
| CSS line  | ~1656-1696                                                                                 |
| Semantic  | Integration health row: status icon (success/warn/danger SVG) + name + meta + status pill. |
| Variants  | Pill stato via `.pill.pill-{ok,warn,critical}` (post-L41)                                  |
| React     | `BrandIntegrationHealth` ma usato standalone come pill, non come row composta              |
| Coverage  | 3/7 mockup (org-systems · cross-tenant · tenant-owner)                                     |

### 6.7 crit-row 🆕

| Field     | Value                                                                      |
| --------- | -------------------------------------------------------------------------- |
| Selectors | `.crit-row`                                                                |
| Status    | 🆕 — PROMOTE-NEW in G3                                                     |
| CSS line  | ~2070                                                                      |
| Semantic  | Critical cell row (skills heatmap drilldown): row + skill name + gap pill. |

---

## 7. Charts & graphs

### 7.1 kg-graph (SVG topology)

| Field     | Value                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.kg-graph` · `.kg-legend` · `.legend-dot` · subelements SVG                                                         |
| Status    | ✅                                                                                                                   |
| CSS line  | ~1172                                                                                                                |
| Semantic  | SVG mini graph topology: nodes + edges + legend. Niente Cytoscape (rendering nativo SVG, deterministic positioning). |
| React     | `BrandKgGraph`                                                                                                       |
| Coverage  | 1/7 mockup (capability-graph)                                                                                        |

### 7.2 capability-radar (SVG 5-axis)

| Field     | Value                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.capability-radar` · `.radar-svg` · `.radar-grid` · `.radar-axis` · `.radar-current` · `.radar-target`                            |
| Status    | ✅                                                                                                                                 |
| CSS line  | ~1113                                                                                                                              |
| Semantic  | Radar chart SVG 5-axis (process/structure/role/competence/performance). 2 series sovrapposte: current (filled) + target (outline). |
| React     | `BrandCapabilityRadar`                                                                                                             |
| Coverage  | 1/7 mockup (employee-journey)                                                                                                      |

### 7.3 career-arc (5-stage timeline)

| Field     | Value                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.career-arc` · `.career-stage` · `.career-stage.past` · `.career-stage.current` · `.career-stage.future` · `.dot` · `.label` · `.year` |
| Status    | ✅                                                                                                                                      |
| CSS line  | ~1030-1080                                                                                                                              |
| Semantic  | Timeline orizzontale 5-stage: past (filled accent) · current (highlighted glow) · future (outline).                                     |
| Variants  | 🔧 `.past` · `.current` · `.future`                                                                                                     |
| React     | `BrandCareerArc`                                                                                                                        |
| Coverage  | 1/7 mockup (employee-journey)                                                                                                           |

### 7.4 histogram 🆕

| Field     | Value                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Selectors | `.histogram` · `.histo-bar` · `.histo-track` · `.histo-fill` · `.histo-fill.fill-{critical,warn,ok,info}` (post-L42 unified) |
| Status    | 🆕 — CSS ready (post-L42), BrandHistogram PROMOTE-NEW in G3                                                                  |
| CSS line  | ~2019-2057                                                                                                                   |
| Semantic  | Bar chart orizzontale: rows + bar fill width-driven + tone variant. Per coverage distribution (skills-heatmap).              |
| Variants  | 🔧 tone (critical/warn/ok/info)                                                                                              |
| Coverage  | 1/7 mockup (skills-heatmap)                                                                                                  |

---

## 8. Pills, badges & status

### 8.1 pill (canonical post-L41)

| Field            | Value                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Selectors        | `.pill` · `.pill.pill-ok` · `.pill.pill-warn` · `.pill.pill-critical` · `.pill.pill-info`                               |
| Status           | ✅ (post-L41 unified — `.status-pill` rimosso)                                                                          |
| CSS line         | ~794-816                                                                                                                |
| Semantic         | Status pill atomo: 4 modifier semantici (success / warning / danger / informational). Universale per labelizzare stati. |
| Variants         | 🔧 ok · warn · critical · info                                                                                          |
| Special variants | 🔧 `.pill-meets` · `.pill-exceeds` · `.pill-grow` (review-specific, employee-journey)                                   |
| Coverage         | 7/7 mockup                                                                                                              |

### 8.2 scope-pill

| Field    | Value                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------- |
| Selector | `.scope-pill`                                                                                             |
| Status   | ✅                                                                                                        |
| CSS line | ~1394                                                                                                     |
| Semantic | Pill dedicata per scope/tenant indication (cross-tenant header, org-systems): non usa modifier `.pill-*`. |
| Coverage | 7/7 mockup                                                                                                |

### 8.3 label-pill

| Field    | Value                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------- |
| Selector | `.label-pill`                                                                                  |
| Status   | ✅                                                                                             |
| CSS line | ~62                                                                                            |
| Semantic | Mono-style label pill (uppercase + JetBrains Mono). Per metadata in nav-bar e altre superfici. |
| Coverage | 7/7 mockup                                                                                     |

### 8.4 pbadge 🆕

| Field     | Value                                                               |
| --------- | ------------------------------------------------------------------- |
| Selectors | `.pbadge` · `.pbadge-role` · `.pbadge-dept` · `.pbadge-tenure`      |
| Status    | 🆕 — CSS ready (in profile-hero), promo BrandWidget in G3           |
| CSS line  | ~2228-2247                                                          |
| Semantic  | Profile badge atom: role/dept/tenure indicator inside profile-hero. |
| Variants  | 🔧 role · dept · tenure                                             |

---

## 9. Bars & gauges

### 9.1 bar-fill (canonical post-L42)

| Field     | Value                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| Selectors | `.bar-fill` · `.bar-fill.fill-critical` · `.bar-fill.fill-warn` · `.bar-fill.fill-ok` · `.bar-fill.fill-info` |
| Status    | ✅ (post-L42 unified — `.gauge-bar-fill.gauge-*` rimosso)                                                     |
| CSS line  | ~837-852 (`.gap-bar .bar-fill` + `.bar-fill.fill-*`) · ~1822 (`.gauge-card .bar-fill`)                        |
| Semantic  | Universal bar fill: width-driven progress, 4 modifier color tone.                                             |
| Variants  | 🔧 critical · warn · ok · info                                                                                |
| Used by   | `.gap-bar` (skill gap analysis) · `.gauge-card .bar-fill` (gauge progress) · futuri Bar widgets               |

### 9.2 gap-bar

| Field     | Value                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------- |
| Selectors | `.gap-bar` · `.gap-bar .bar` · `.gap-bar .bar-fill`                                               |
| Status    | ✅                                                                                                |
| CSS line  | ~822-838                                                                                          |
| Semantic  | Inline-flex bar wrapper: track 48px + fill width + numeric label. Per skill gap analysis pattern. |
| Variants  | tone via `.bar-fill.fill-*`                                                                       |

---

## 10. Buttons & filters

### 10.1 btn / btn-primary / btn-ghost

| Field     | Value                                                                              |
| --------- | ---------------------------------------------------------------------------------- |
| Selectors | `.btn` · `.btn-primary` · `.btn-ghost`                                             |
| Status    | ✅                                                                                 |
| CSS line  | ~553-585                                                                           |
| Semantic  | Button atom: primary (accent fill) + ghost (border + transparent). Padding 6-12px. |
| Variants  | 🔧 primary · ghost                                                                 |
| Coverage  | 7/7 mockup                                                                         |

### 10.2 theme-toggle-btn

| Field    | Value                                         |
| -------- | --------------------------------------------- |
| Selector | `.theme-toggle-btn`                           |
| Status   | ✅                                            |
| CSS line | ~119                                          |
| Semantic | Theme switcher in nav-bar (light/dark cycle). |
| React    | `<ThemeToggle/>` in BrandShell topbar         |
| Coverage | 7/7 mockup                                    |

### 10.3 filter-pill

| Field     | Value                                                                           |
| --------- | ------------------------------------------------------------------------------- |
| Selectors | `.filter-pill` · `.filter-pill.active`                                          |
| Status    | ✅                                                                              |
| CSS line  | ~724-740                                                                        |
| Semantic  | Filter chip: round border + label + optional count. Click toggles active state. |
| Variants  | 🔧 `.active` (current selection)                                                |
| Coverage  | 5/7 mockup                                                                      |

### 10.4 filter-bar

| Field     | Value                                             |
| --------- | ------------------------------------------------- |
| Selectors | `.filter-bar` · `.filter-group` · `.filter-label` |
| Status    | ✅                                                |
| CSS line  | ~1946-1965                                        |
| Semantic  | Filter container con groups e labels.             |
| Coverage  | 1/7 mockup (skills-heatmap)                       |

---

## 11. Typography & identity

### 11.1 wordmark variants

| Field      | Value                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Selectors  | `.wordmark` (hero 22px) · `.wordmark-sm` (nav-bar 18px) · `.wordmark-foot` (footer) · `.wordmark-sm.legacy` (variant body brand-blue)  |
| Status     | ✅                                                                                                                                     |
| CSS line   | ~78-110                                                                                                                                |
| Semantic   | Logo Heuresys "heuresys" Exo 2 weight 700, 8 lettere identical, 'y' purple accent. Embed obbligatorio in tutte le ricorrenze del nome. |
| Variants   | 🔧 `.legacy` (logo body brand-blue per tema legacy)                                                                                    |
| References | L27 (logo originale) · L28 (logo relativo `.wordmark-relative`)                                                                        |

---

## 12. Ontology / KG specifics

### 12.1 ont-row 🆕

| Field     | Value                                                                              |
| --------- | ---------------------------------------------------------------------------------- |
| Selectors | `.ont-row`                                                                         |
| Status    | 🆕 — PROMOTE-NEW in G3                                                             |
| CSS line  | ~2135                                                                              |
| Semantic  | Ontology breakdown row (capability-graph): cluster + count + percentage breakdown. |
| Coverage  | 1/7 mockup (capability-graph)                                                      |

---

## Appendix A — Roadmap promotion

| Step                             | Scope                                                   | Status                  |
| -------------------------------- | ------------------------------------------------------- | ----------------------- |
| **G1** (this doc)                | Formalizzazione catalogo dichiarata                     | ✅ S19                  |
| **G2** (D2 D4 D5 D6 remediation) | Drift unified                                           | ✅ S19 (commit 8574d9e) |
| **G3**                           | 5 nuovi BrandWidget + ActivityFeed registry + D7 atomic | Pending                 |
| **G4**                           | Schema preset DB extension `dashboard_preset_layout`    | Pending                 |
| **G5**                           | Single `<DashboardRenderer/>` consumer registry         | Pending                 |
| **G6**                           | Seed 8 platform preset DB-driven                        | Pending                 |

## Appendix B — Audit doc cross-link (S18 snapshot)

L'audit doc S18 [`brand-dashboard-catalog-CURRENT-STATE.md`](../../.ux-design/08-promotion/brand-dashboard-catalog-CURRENT-STATE.md) resta il riferimento storico per la classificazione 5-tag (a/b/c/d/e) di tutti i 138 selettori CSS prima di L41+L42. Line numbers in audit sono pre-L41/L42 (post-L41 shift `−15` per CSS oltre 1260; post-L42 shift `−40` cumulativo per CSS oltre 1700).

## Appendix C — Drift remediation log

| ID  | Drift                                               | Risolto       | Strategia                                                                      |
| --- | --------------------------------------------------- | ------------- | ------------------------------------------------------------------------------ |
| D1  | Pill 2-system                                       | L41 (3867c6a) | `.pill` canonical · `.status-pill` rimosso                                     |
| D2  | Split 3-system                                      | L42 (8574d9e) | `.double-split` canonical · `.kg-split` + `.bottom-split` rimossi              |
| D3  | Heatmap bucket 2-system                             | L41 (3867c6a) | `.heat-{0..6}` canonical · `.hl-{10..90}` rimosso                              |
| D4  | Bar fill 2-system                                   | L42 (8574d9e) | `.bar-fill.fill-*` canonical · `.gauge-bar-fill.gauge-*` rimosso               |
| D5  | Activity vs Audit                                   | L42 (8574d9e) | Mantenuti separati (DOM shape distinta · LOW severity)                         |
| D6  | RBAC matrix wrapper                                 | L42 (8574d9e) | `.matrix-wrap` introdotto · `.skill-gap-head` rinominato `.widget-head` shared |
| D7  | 17 implementazioni parallel (BrandWidget vs atomic) | Pending       | G3 decisione keep/deprecate atomic                                             |
| D8  | BrandActivityFeed non in registry                   | Pending       | G3 entry aggiunta                                                              |
| D9  | 7 view bespoke non consumano registry               | Pending       | G5 single DashboardRenderer                                                    |
| D10 | Atomic packages/ui senza test                       | Pending       | G3 (se atomic mantenuti)                                                       |

---

**Document end** · canonical SoT post-L42 · subject to amendment via DECISIONS-LOG entries L43+.
