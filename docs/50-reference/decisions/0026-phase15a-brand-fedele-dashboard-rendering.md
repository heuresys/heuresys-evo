# ADR-0026 · Phase 15.A — Brand-fedele dashboard rendering

- **Status**: accepted
- **Date**: 2026-05-08
- **Commit**: `d59ae3e feat(app+db): brand-fedele dashboard rendering — 7 views + role-driven + live data`
- **Branch**: `feature/dashboard-shell-canonical` (mergiato fast-forward su `main`, cancellato)

## Context

Pre-Phase 15.A la rotta `/dashboard` rendeva una pagina placeholder generica (`employees.findMany()` top-10, layout AppShell Tailwind utility). I mockup brand `.ux-design/06-mockups/dashboards/*.html` (Phase 9, μ-architect-legacy direction) erano stati prodotti come "vera brand identity delle dashboard" ma mai tradotti in production.

L'utente ha chiesto:

1. Fedeltà visiva al mockup canonical `org-systems.html` (riferimento brand)
2. Role-driven branching: ogni RBP role vede la dashboard mappata in `role_default_dashboards`
3. Data binding live dove possibile (no schemo a blocchi)
4. Generalizzazione a tutti 7 preset attivi

## Decision

Architettura 4-layer in unico commit:

### Layer A — Brand chrome via CSS canonical scoped

`services/app/src/styles/dashboard-brand.css` (~2370 righe scoped) estratto dai mockup `org-systems.html` + `cross-tenant-overview.html` + `hr-director-overview.html` + altri 4. Include:

- **Shell**: `.dashboard-shell` (flex column 100vh) · `.nav-bar` (topbar fissa con accent stripe) · `.app` (grid 240px+1fr · 64px+1fr quando collapsed) · `.sidebar` (sidebar-top + sezioni h4 mono collapsibili + sidebar-link active border-left brand-blue + user-card bordered-inverse) · `.workspace` (scroll independente) · `.app-footer` (socials + ctx-items con dot status)
- **Widget chrome**: `.kpi-card` (kpi-num 32px tabular + delta colored + foot border-top accent) · `.scope-pill` (dot accent) · `.tenant-grid` + `.tenant-card` (platform border accent + customer + health dot warn/ok) · `.double-split` 1.4fr+1fr · `.panel` + `.panel-head` · `table.rbac` heat-graded (`.lvl-100/95/80/60/40/25/15/5` sfumature accent → warning) · `.int-row` + `.status-pill` ok/warn/down · `.audit-list` + `.audit-row` (grid 80/1fr/120) · `.metrics-grid` + `.metric-card` + `.sparkline` SVG · `.gauge-grid` + `.gauge-card` · `.comp-grid` + `.comp-card` · `.bar-track` + `.bar-fill` · `.filter-bar` + `.filter-pill active` · `.heatmap-grid` con `.heat-0..heat-6` buckets · `.histogram` + `.histo-bar` · `.crit-row` · `.kg-split` · `.ontology-list` + `.ont-row` · `.profile-hero` + `.profile-avatar` + `.pbadge` · `.career-arc` 5-stage timeline · `.capability-radar` SVG · `.bridge-grid` + `.bridge-card` con readiness ring SVG
- **Tokens**: 6 nuovi in `active-theme.css` (`--cap-process` blue · `--cap-structure` indigo · `--cap-role` purple · `--cap-competence` green · `--cap-performance` amber · `--glow` drop-shadow) in dark + light variants

NON Tailwind utility per il chrome brand (perderebbe fedeltà al mockup). Tailwind resta disponibile per micro-utility dove non collide.

### Layer B — Layout brand-fedele

`services/app/src/app/(app)/_components/BrandShell.tsx` (client) sostituisce il generico `AppShell` di `@heuresys/ui` (Tailwind utility, non match al mockup):

- `<nav class="nav-bar">` topbar con wordmark glow + label-pill DASHBOARD accent + LocaleSwitcher + ThemeToggle + UserMenu
- `<aside class="sidebar">` sidebar-top (toggle + tenant-mini bordered) + sezioni `.sidebar-section h4` collapsibili (workspace · ontology · system) + sidebar-link items role-aware (`SIDEBAR_MAP` esistente in `lib/navigation/role-nav-map.ts`) + user-card bordered-inverse bottom
- `<main class="workspace">` slot per page content
- `<footer class="app-footer">` static (copyright wordmark-foot + socials LinkedIn/GitHub/X SVG inline) + dynamic (env + tenant + role + build dots)

Sidebar collapse + sezioni collapse persistiti in localStorage. `(app)/layout.tsx` (server) fa tenant lookup Prisma + passa user/tenant/env a BrandShell.

### Layer C — Resolver + page branching

- `lib/dashboard-engine/role-preset-resolver.ts` — `$queryRaw` (P6 compliant) tagged template, legge `role_default_dashboards` con resolution order: tenant override > platform default > null. 6 vitest PASS.
- `lib/dashboard-engine/loader.ts` — rimosso `unstable_cache` wrapper (latente bug BigInt JSON.stringify, anche `/dashboard/[code]` pre-esistente). Direct DB read ~30-100ms hot path.
- `(app)/dashboard/page.tsx` canonical — auth → resolver → switch su preset_code → render brand-fedele view dedicata. Fallback amichevole se preset non mappato.
- `(app)/dashboard/[code]/page.tsx` override — generic engine renderer per esplicito accesso a preset (admin · super-user simulation).

### Layer D — 7 view brand-fedeli + 9 brand widget + data fetcher

7 view in `services/app/src/app/(app)/dashboard/_views/`:

| View                                                  | preset_code             | Sezioni rendering                                                                                                                                                                            |
| ----------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OrgSystemsView` (LIVE: tenants + audit + RBP)        | `org_systems`           | KPI ring · tenant fleet (4 cards reali) · double-split (RBAC heat + Integration health 7 int-row) · System metrics 4 sparkline · Audit log live stream                                       |
| `CrossTenantOverviewView` (LIVE: tenants + emp count) | `cross_tenant_overview` | KPI ring · tenant fleet · workforce trend chart 12-mesi 4-line · double-split (gauge-grid + integration health)                                                                              |
| `TenantOwnerOverviewView`                             | `tenant_owner_overview` | KPI ring · 8-dept table.dense con bar-fill skill cov · double-split (comp-grid 4 cards + gauge succession ring) · 5 succession candidates                                                    |
| `HrDirectorOverviewView`                              | `hr_director_overview`  | KPI ring delta colored · main-split (skill gap analysis con bar-fill critical/warn/ok + activity feed live) · 4 succession cards                                                             |
| `SkillsHeatmapView`                                   | `skills_heatmap`        | KPI ring · filter-bar 3 group · heatmap matrix 8x12 (heat-0..heat-6) · bottom-split (histogram + crit-row P0)                                                                                |
| `CapabilityGraphView`                                 | `capability_graph`      | KPI ring · KG SVG topology pseudo-force-directed 25 nodes 5 cluster · ontology breakdown · top-entities table · 3 ESCO sync stats                                                            |
| `EmployeeJourneyView`                                 | `employee_journey`      | profile-hero (avatar+badges+stats) · career-arc 5-stage timeline · main-split (skill-trend SVG + capability-radar SVG) · review history table.dense · bridge-grid 3 cards readiness ring SVG |

9 brand widget in `services/app/src/components/widgets/brand/`:

- `BrandKpiCard` · `BrandIntegrationHealth` · `BrandSuccessionCard` · `BrandRbacMatrix` · `BrandSkillHeatmap` · `BrandActivityFeed` · `BrandKgGraph` (SVG diretto, no Cytoscape force layout dependency) · `BrandCareerArc` · `BrandCapabilityRadar`. Registrati in `lib/dashboard-engine/registry.tsx` per la route override `/dashboard/[code]`. Phase 13.A widget originali in `@heuresys/ui` preservati per riutilizzo non-dashboard.

`lib/dashboard-views/org-systems-data.ts` — server-side fetchers Prisma: `fetchOrgSystemsData()` ritorna `{ tenants live, audit_logs reali (6 recent), rbac counts (8 roles · 34 areas · 179 joins · 605 RLS policies via pg_policies), totalEmployees count }`.

### DB

`db/seeds/phase15a_role_default_dashboards.sql` — `CREATE TABLE role_default_dashboards (id UUID, role TEXT, preset_code TEXT FK, tenant_id UUID NULL FK, priority INT, timestamps)` + partial unique indexes (NULL-aware) + RLS policy (P5: `tenant_id IS NULL OR tenant_id::text = current_setting('app.current_tenant_id', true)`) + seed 8 platform default (1 row per RBP role). Applicato bare-metal SoT.

## Consequences

### Positive

- **Dashboard role-driven brand-fedele**: ogni utente vede dashboard mappata in `role_default_dashboards` con visual fidelity al mockup canonical
- **Architettura data-driven (P9)**: cambio mapping = SQL UPDATE, no rebuild; cambio chrome CSS = file singolo
- **Multi-tenant ready (P10)**: tabella `role_default_dashboards` supporta tenant override via `tenant_id NULL/UUID`
- **Modulare**: 7 view files separati, CSS canonical scoped riusabile, brand widget atomic shareable

### Negative / Out-of-scope

- 6 view non-`org_systems` hanno dati hardcoded mockup-fedeli (visual fidelity prima passata). Data binding live full per skill_assessments · review_cycles · succession_pipeline · compensation_plan · esco_metrics entrerà in iterazione successiva.
- 4 preset minori (`process_recruiting_funnel` · `process_onboarding_flow` · `process_performance_cycle` · `process_learning_paths`) ancora da implementare come view brand-fedeli dedicate.
- WCAG 2.2 AAA audit non ri-eseguito post-cambio CSS canonical (verifica spot only).

## References

- Branch `feature/dashboard-shell-canonical` (mergiato fast-forward su `main`, cancellato)
- Commit unico finale `d59ae3e`
- Mockup canonical: `.ux-design/06-mockups/dashboards/org-systems.html` (Phase 9 reference, riferimento brand identity)
- ADR-0024 Phase 14.SH brand-driven shell (predecessore: AppShell + login-aurora)
- ADR-0025 Brand identity sealed v1.0
- Plan canonical: `~/.claude/plans/humble-soaring-lake.md`
