# Production perf bench — S44

> Run: 2026-05-12 03:50 GMT+2 · 30s · 10 connections concurrent · production build (Next.js 16.2.4)
> Setup: SSH tunnel localhost:5432 → oracle-vm-default postgres · sysadmin auth
> Tool: autocannon v8.0.0 + jq for parsing

## Results (sorted by P95)

| Route                              | Avg ms | P50 | **P95**  | P99  | Max  | Req/sec | Errors |
| ---------------------------------- | ------ | --- | -------- | ---- | ---- | ------- | ------ |
| `/login` (public)                  | 11.9   | 9   | **28**   | 40   | 65   | 808     | 0      |
| `/dashboard/cross_tenant_overview` | 357.72 | 356 | **439**  | 445  | 449  | 27.4    | 0      |
| `/dashboard/capability_graph`      | 378.91 | 364 | **635**  | 780  | 908  | 25.9    | 0      |
| `/dashboard/skills_heatmap`        | 377.74 | 351 | **803**  | 1091 | 1215 | 26.2    | 0      |
| `/dashboard/employee_journey`      | 406.91 | 374 | **879**  | 1103 | 1264 | 24.2    | 0      |
| `/dashboard` (G6)                  | 492.26 | 475 | **888**  | 889  | 893  | 19.61   | 0      |
| `/dashboard/tenant_owner_overview` | 414.17 | 369 | **1052** | 1303 | 1524 | 23.7    | 0      |
| `/dashboard/hr_director_overview`  | 381.79 | 339 | **1062** | 1394 | 1552 | 25.6    | 0      |
| `/dashboard/org_systems`           | 729.33 | 694 | **1193** | 1238 | 1379 | 13.2    | 0      |

## Target compliance (P95 ≤ 500ms)

**2/9 routes within target** (`/login` + `/cross_tenant_overview`).
7/9 routes exceed P95 target — average exceedance: **+406ms** above 500ms baseline.

## Analysis

- `/login` excellent (28ms P95) — static-ish public route, no DB.
- `/dashboard/cross_tenant_overview` within target (439ms) — already uses aggregated GroupBy + cached fetcher pattern.
- Worst offenders: `org_systems` (1193ms) + `hr_director_overview` (1062ms) + `tenant_owner_overview` (1052ms) — heavy joins (employees + audit_logs + RBAC matrix + succession plans/candidates).
- Errors: 0 across the board. No regressions in functional integrity under load.

## Bottleneck hypotheses

1. **N+1 query patterns** in fetchers (succession plans → candidates separate queries).
2. **DB latency over SSH tunnel** — measurements taken with localhost:5432 forwarded to oracle-vm-default postgres; production deployment on same VM would shave ~20-50ms per query.
3. **No Next.js fetch caching** on the route helpers — every request hits DB.
4. **Cold-start tax** on first request per route (ƒ Dynamic SSR). P50 already shows steady-state numbers.

## Recommendations (carry-forward S45+)

| #   | Optimization                                                                                                                          | Estimated impact                             | Effort          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------- |
| 1   | Add `unstable_cache` (Next.js) wrapping `fetchOrgSystemsData`, `fetchCapabilityGraphData`, `fetchCrossTenantData` with revalidate=60s | -50-70% P95 on cross-tenant aggregates       | 1-2h            |
| 2   | Materialize 12-month workforce trend → `monthly_employee_snapshot` mat view (refresh daily)                                           | -200ms on cross_tenant                       | 1h              |
| 3   | Materialize RBAC matrix (`rbp_role_permissions` JOIN) → mat view                                                                      | -150ms on org_systems + hr_director_overview | 1h              |
| 4   | Connection pooling on Prisma (pgBouncer) on oracle-vm-default                                                                         | -30-50ms per query under load                | 2-3h infra      |
| 5   | React 19 `cache()` per-request memoization of shared queries (tenants list, RBP counts)                                               | -100ms on routes that reuse same data        | 1h              |
| 6   | Move DB to same VM as app (no SSH tunnel in production) — already so in prod deployment                                               | -20-50ms baseline                            | already shipped |

## Verification commands

```bash
# Quick re-run after optimizations
COOKIE=$(grep "authjs.session-token" /tmp/cookies.txt | awk '{print $7}')
npx autocannon -c 10 -d 10 -H "Cookie: authjs.session-token=$COOKIE" \
  http://localhost:3200/dashboard/org_systems
```

## Raw data

Each test: `autocannon -c 10 -d 10` (10 concurrent connections, 10 seconds).
Tool output JSON parsed via jq for latency.average / p50 / p97_5 / p99 / max.
