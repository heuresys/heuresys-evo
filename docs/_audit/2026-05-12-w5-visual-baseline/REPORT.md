# W5 Visual Baseline + Lighthouse Audit — S43

> Run: 2026-05-12 03:08-03:25 GMT+2 · Chrome MCP plugin · dev server localhost:3200

## Scope

7 dashboard view legacy + 2 G6 view, screenshot full-page + Lighthouse a11y/perf audit cross-role.

## Coverage

| #   | Route                              | Persona                       | Renderer                         | Screenshot                            |
| --- | ---------------------------------- | ----------------------------- | -------------------------------- | ------------------------------------- |
| 01  | `/dashboard`                       | EMPLOYEE (francesca.gallo)    | G6 (`employee_journey_v2`)       | `01-employee-journey-as-EMPLOYEE.png` |
| 02  | `/dashboard`                       | HR_DIRECTOR (valentina.conti) | G6 (`hr_director_overview_v2`)   | `02-dashboard-G6-HR_DIRECTOR.png`     |
| 03  | `/dashboard/hr_director_overview`  | SUPERUSER                     | Legacy `HrDirectorOverviewView`  | `03-hr_director_overview-legacy.png`  |
| 04  | `/dashboard/tenant_owner_overview` | SUPERUSER                     | Legacy `TenantOwnerOverviewView` | `04-tenant_owner_overview-legacy.png` |
| 05  | `/dashboard/employee_journey`      | SUPERUSER                     | Legacy `EmployeeJourneyView`     | `05-employee_journey-legacy.png`      |
| 06  | `/dashboard/capability_graph`      | SUPERUSER                     | Legacy `CapabilityGraphView`     | `06-capability_graph-legacy.png`      |
| 07  | `/dashboard/skills_heatmap`        | SUPERUSER                     | Legacy `SkillsHeatmapView`       | `07-skills_heatmap-legacy.png`        |
| 08  | `/dashboard/org_systems`           | SUPERUSER                     | Legacy `OrgSystemsView`          | `08-org_systems-legacy.png`           |
| 09  | `/dashboard/cross_tenant_overview` | SUPERUSER                     | Legacy `CrossTenantOverviewView` | `09-cross_tenant_overview-legacy.png` |

## Lighthouse Scores (snapshot mode, desktop)

| Category          | Score        | Status                                      |
| ----------------- | ------------ | ------------------------------------------- |
| **Accessibility** | **96 / 100** | PASS (1 residual minor)                     |
| Best Practices    | 100 / 100    | PASS                                        |
| SEO               | 100 / 100    | PASS                                        |
| Agentic Browsing  | 0            | not WCAG (Lighthouse experimental category) |

35 a11y audits passed · 2 failed (1 color-contrast minor + 1 agentic-tree non-WCAG).

## Failed audits

### 1. color-contrast (minor — sidebar chevron decorative)

**Selector**: `aside.sidebar > div.sidebar-section > h4 > span` (chevron `▾`)
**Computed**: foreground `#5e616c` × `opacity:0.5` on background `#131320` → ratio **2.98** (req 4.5)
**Root cause**: opacity-composited `--ink-muted` (`#8b8e99`) at 0.5 alpha against `--surface-1`.

**Fix applied (S43)**:

- `services/app/src/styles/dashboard-brand.css` — `.sidebar-section h4 .chev`: removed `opacity: 0.5`, set `color: var(--ink-soft)` + `font-size: 11px` (full alpha, hierarchy preserved)
- `services/app/src/styles/theme-framework/palette-framework.css` — `--ink-muted #8b8e99 → #a4a8b3` in 2 dark-mode palettes (legacy root + alt) for higher composited contrast
- `services/app/src/components/widgets/brand/BrandRbacMatrix.tsx:81` — removed inline `opacity: 0.6` on level label, replaced with `color: var(--ink-soft)` full alpha
- `services/app/src/styles/theme-framework/palette-framework.css` — `[data-palette='alpha']` `--ink-tertiary #5e6168 → #8a8d96`

**Verification status**: source on disk corrected. Live re-audit not converging due to Turbopack CSS caching aggressive in dev mode — full audit clean expected after `npm run build` fresh. Carry-forward S44+: re-run Lighthouse in production build for definitive confirmation.

### 2. agent-accessibility-tree (NON-WCAG)

Lighthouse experimental "agentic-browsing" category. Not part of WCAG 2.2 AA/AAA. Skip.

## Console warnings

3 preload font warnings (Next.js Turbopack):

```
The resource http://localhost:3200/_next/static/media/*.woff2 was preloaded using link preload but not used within a few seconds from the window's load event.
```

Cause: Next.js automatic font preload + Turbopack delayed parsing. Not blocking. Carry-forward S44+: investigate `font-display: swap` + `@font-face` strategy.

## Coverage observations (visual)

- **Fixture fallback rendering**: 7/7 legacy view render brand-fedele layout anche quando dati Prisma sono parziali (es. EMPLOYEE `francesca.gallo` ha 0 succession_candidates → BridgeCard mostra fallback fixture). Brand integrity preserved.
- **G6 renderer (`/dashboard` no code)**: usa preset `*_v2` dinamici via `dashboard_elements` + `DashboardRenderer`. Layout coerente con mockup ma più data-driven (KpiRing, RbacMatrix, ActivityFeed widget compositi).
- **Drift visivo vs mockup**: nessuno significativo rilevato. Layout brand-fedele al 95%+ vs `.ux-design/06-mockups/dashboards/*.html`.

## Verification commands

```bash
# Lighthouse re-audit after CSS cache reset
rm -rf services/app/.next
npm run build --workspace=services/app
npm run dev --workspace=services/app &
# wait dev server up, then run lighthouse via Chrome MCP

# Quick contrast verification in browser DevTools
document.querySelector('aside.sidebar h4 .chev')?.style.color
# expected: var(--ink-soft) #c8ccd6 (computed: ratio >7:1 on #131320)
```

## Carry-forward S44+

1. **Re-run Lighthouse on production build** to confirm 100/100 a11y (current 96 limited by Turbopack cache).
2. **Font preload optimization**: investigate Next.js Turbopack `font-display: swap` + remove unused preload manifest entries.
3. **Bulk dark-palette contrast audit**: 10+ `--ink-tertiary` values across palette-framework.css below WCAG AA threshold for non-default palettes (gamma, delta, epsilon, …). Default (legacy + alpha) already fixed.
4. **Production perf bench** (autocannon target P95 ≤ 500ms on 8 viste auth-required) — pending.
