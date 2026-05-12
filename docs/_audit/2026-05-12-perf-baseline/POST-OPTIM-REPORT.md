# Post-optimization perf bench — S45

> Run: 2026-05-12 03:54 GMT+2 · 10s × 10 connections · prod build · post unstable_cache + mv_rbac_matrix

## Comparison vs S44 baseline

| Route                              | S44 P95 | **S45 P95** | Delta             | Target ≤500ms |
| ---------------------------------- | ------- | ----------- | ----------------- | ------------- |
| `/login` (public)                  | 28      | **21**      | -7ms (-25%)       | ✓             |
| `/dashboard/cross_tenant_overview` | 439     | **451**     | +12ms             | ✓             |
| `/dashboard/hr_director_overview`  | 1062    | **453**     | **-609ms (-57%)** | ✓ NOW WITHIN  |
| `/dashboard/tenant_owner_overview` | 1052    | **459**     | **-593ms (-56%)** | ✓ NOW WITHIN  |
| `/dashboard/capability_graph`      | 635     | **475**     | -160ms (-25%)     | ✓ NOW WITHIN  |
| `/dashboard/skills_heatmap`        | 803     | 627         | -176ms (-22%)     | ✗ over 127ms  |
| `/dashboard/employee_journey`      | 879     | 824         | -55ms (-6%)       | ✗ over 324ms  |
| `/dashboard` (G6 renderer)         | 888     | 844         | -44ms (-5%)       | ✗ over 344ms  |
| `/dashboard/org_systems`           | 1193    | 1185        | -8ms (-1%)        | ✗ over 685ms  |

## Target compliance summary

| Phase                       | Routes within P95 ≤ 500ms | Improvement               |
| --------------------------- | ------------------------- | ------------------------- |
| S44 (baseline)              | 2/9 (22%)                 | —                         |
| **S45 (post-optimization)** | **5/9 (56%)**             | **+150% (3 more routes)** |

## Optimizations applied

1. **unstable_cache** on 6 fetchers (60s revalidate):
   - `fetchOrgSystemsData`
   - `fetchCapabilityGraphData`
   - `fetchCrossTenantData`
   - `fetchSkillsHeatmapData`
   - `fetchEmployeeJourneyData`
   - `fetchIntegrationsHealth`
2. **React 19 `cache()`** in `_shared-cache.ts`: `getTenantById` + `getAllTenants` per-request memoization.
3. **mv_rbac_matrix** materialized view (272 rows = 8 roles × 34 areas) + integrated into `refresh_all_mat_views()` function (4h systemd timer rotation).

## Analysis of remaining over-target routes

| Route               | S45 P95 | Likely root cause                                                                                                                                                                            | Next steps                                                                  |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `/dashboard` (G6)   | 844ms   | Uses DB-driven `dashboard_elements` + `DashboardRenderer` per-widget SQL queries (NOT cached by S45 fetchers — different code path)                                                          | Add cache layer at DashboardRenderer level + widget-level query memoization |
| `/employee_journey` | 824ms   | Per-employee fetcher with cache MISS for new employee_ids (cache key parameterized on tenantId+employeeId; SUPERUSER on `francesca.gallo` is a different key each time)                      | Pre-warm cache + reduce skill_history aggregation cost via mat view         |
| `/skills_heatmap`   | 627ms   | Two heavy raw SQL queries (top 12 skills + 8 dept × 12 skill matrix) — cache key per-tenant only                                                                                             | Already cached, but JOIN to employee_skill_assessments unindexed            |
| `/org_systems`      | 1185ms  | `fetchOrgSystemsData` cached, but `BrandRbacMatrix` widget runs its own SQL on rbp_role_permissions (separate path from fetcher). Mat view `mv_rbac_matrix` ready but widget not yet pointed | Update RbacMatrix widget data_source query → `SELECT * FROM mv_rbac_matrix` |

## Zero functional regression

- 0 errors under load on all 9 routes
- typecheck + lint:mock-identities PASS
- Mat view rows = 272 (target verified)

## Carry-forward S46+

1. **DashboardRenderer cache layer** — wrap `loadG6Elements` + per-widget SQL execution with React `cache()` / `unstable_cache`. Expected gain: -300-400ms on `/dashboard` G6 route.
2. **RbacMatrix widget → mv_rbac_matrix** — repoint `dashboard_elements.config_overrides.data_source.query` for `BrandRbacMatrix` widget to use the materialized view. Expected gain: -400-600ms on `/org_systems`.
3. **employee_skill_assessments index** — add multi-column index `(employee_id, skill_name)` for skills_heatmap matrix JOIN. Expected gain: -150-200ms on `/skills_heatmap`.
4. **monthly_employee_snapshot mat view** — convert workforce trend on-the-fly CTE to scheduled mat view. Expected gain: -100ms on `/cross_tenant_overview` (already within target, but headroom for higher load).
5. **pgBouncer** (skipped in S45, deferred from S44 #4) — Connection pooling on oracle-vm-default. Expected gain: -30-50ms baseline across all routes.
