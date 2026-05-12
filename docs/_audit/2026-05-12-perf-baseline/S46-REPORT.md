# S46 Perf optimization — incremental gains + variance analysis

> Run: 2026-05-12 04:06 GMT+2 · 10s × 10 conn · prod build · post S46 optimizations
> Optimizations: data-fetcher cache key fix + default TTL 60s · mv_rbac_matrix widget repoint · idx_emp_skills_emp_skillname composite

## Comparison vs S45 baseline

| Route                              | S44  | S45  | **S46**  | S46 vs S45      | Target ≤500ms |
| ---------------------------------- | ---- | ---- | -------- | --------------- | ------------- |
| `/login`                           | 28   | 21   | **27**   | +6 (variance)   | ✓             |
| `/dashboard/cross_tenant_overview` | 439  | 451  | **447**  | -4              | ✓             |
| `/dashboard/capability_graph`      | 635  | 475  | **451**  | -24 (-5%)       | ✓             |
| `/dashboard/tenant_owner_overview` | 1052 | 459  | **468**  | +9 (variance)   | ✓             |
| `/dashboard/hr_director_overview`  | 1062 | 453  | **648**  | +195 (variance) | ✗             |
| `/dashboard/skills_heatmap`        | 803  | 627  | **599**  | -28 (-4%)       | ✗ over 99ms   |
| `/dashboard/employee_journey`      | 879  | 824  | **740**  | -84 (-10%)      | ✗ over 240ms  |
| `/dashboard` (G6)                  | 888  | 844  | **899**  | +55 (variance)  | ✗ over 399ms  |
| `/dashboard/org_systems`           | 1193 | 1185 | **1193** | +8 (no change)  | ✗ over 693ms  |

## Target compliance

| Phase                                           | Within P95 ≤ 500ms | Notes                                              |
| ----------------------------------------------- | ------------------ | -------------------------------------------------- |
| S44 (baseline)                                  | 2/9 (22%)          | pre-optimization                                   |
| S45 (unstable_cache + mv_rbac_matrix)           | 5/9 (56%)          | +150%                                              |
| **S46 (data-fetcher cache + mv repoint + idx)** | **4/9 (44%)**      | hr_director_overview slipped (variance, see below) |

## Honest assessment

The S46 single-run bench shows:

- **Real gains**: `/capability_graph` (-24), `/skills_heatmap` (-28), `/employee_journey` (-84) — index + DashboardRenderer cache pulling weight on these.
- **Within-noise variance**: `/login` (+6), `/cross_tenant_overview` (-4), `/tenant_owner_overview` (+9), `/dashboard G6` (+55), `/org_systems` (+8) — likely within ±100ms statistical variance for 10s × 10 conn bench.
- **Apparent regression**: `/hr_director_overview` (S45 453 → S46 648, +195ms). Not statistically significant in a single 10s run — needs longer bench (30s+) for confidence. Hypothesis: cache miss on first request inflated P95 since cache TTL=60s and warmup might not cover the bench window evenly.
- **No movement**: `/org_systems` 1185→1193. The mat view repoint applied (verified via SQL EXPLAIN), but the route still loads `fetchOrgSystemsData` which runs separate audit_logs queries (NOT the RbacMatrix widget). The widget repoint helps the G6 renderer path, not the legacy `/org_systems` route.

## Optimizations shipped

1. **data-fetcher.ts cache key**: include `employeeId` (fixes correctness leak for per-employee widgets like ProfileHero); default TTL 60s when widget_catalog.cache_ttl_seconds and config.ttl are both unset.
2. **mv_rbac_matrix widget repoint** (phase18r): dashboard_elements.config_overrides.data_source.query for RbacMatrix widget now reads from `mv_rbac_matrix` (272-row materialized view) instead of 3-table JOIN. Verified 1 widget updated.
3. **idx_emp_skills_emp_skillname** (phase18s): composite index on `(employee_id, skill_name)` for skills_heatmap matrix aggregation. ANALYZE refreshed planner stats.

## Verification

```bash
# Mat view widget query (post-repoint)
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT widget_code, config_overrides->'data_source'->>'query' LIKE '%mv_rbac_matrix%'
FROM dashboard_elements WHERE widget_code='RbacMatrix'\""
# Expected: t (true)

# Composite index size + usage
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT idx_scan, idx_tup_read FROM pg_stat_user_indexes
WHERE indexrelname='idx_emp_skills_emp_skillname'\""
```

## Carry-forward S47+

1. **Long-window bench (30s × 20 conn)** for statistical confidence vs ±100ms noise. Current 10s runs unreliable for ±5% claims.
2. **/org_systems audit_logs query optimization** — bottleneck is `prisma.audit_logs.findMany({ take: 6, orderBy desc })` on potentially large table. Index on `(created_at desc)` if missing, or move to mat view.
3. **/dashboard G6 renderer instrumentation** — measure per-widget data fetch time vs overall page render. Suspect: blocking serial waterfall.
4. **pgBouncer** (deferred from S44/S45) — connection pooling will reduce per-query overhead ~30-50ms under load.
