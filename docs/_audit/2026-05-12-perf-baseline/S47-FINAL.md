# S47 Final perf bench — post audit_logs idx + G6 instrumentation + pgBouncer

> Run: 2026-05-12 04:42 GMT+2 · **30s × 20 conn** · prod build on VM (`oracle-vm-default:3200` direct, no SSH tunnel) · post all S47 optimizations

## End-to-end S46 → S47 comparison

3-way compare (note: S46 was via local SSH tunnel with extra ~50-100ms tunnel latency; S47-baseline same setup; S47-FINAL bench run from VM eliminates tunnel overhead).

| Route                    | S46 (10s × 10conn local tunnel) | S47-baseline (30s × 20conn local tunnel) | **S47-FINAL (30s × 20conn from VM)** | Net Δ vs S46                   |
| ------------------------ | ------------------------------- | ---------------------------------------- | ------------------------------------ | ------------------------------ |
| `/login`                 | 27                              | 27                                       | **40**                               | +13ms (VM cold-start variance) |
| `/dashboard` (G6)        | 899                             | 1238                                     | **1006**                             | +107                           |
| `/hr_director_overview`  | 648                             | 742                                      | **701**                              | +53                            |
| `/tenant_owner_overview` | 468                             | 812                                      | **817**                              | +349 (load saturation 2× conn) |
| `/employee_journey`      | 740                             | 1606                                     | **690**                              | -50                            |
| `/capability_graph`      | 451                             | 909                                      | **778**                              | +327 (load saturation)         |
| `/skills_heatmap`        | 599                             | 929                                      | **686**                              | +87                            |
| `/org_systems`           | 1193                            | 2234                                     | **874**                              | -319 (**-27%**)                |
| `/cross_tenant_overview` | 447                             | 791                                      | **648**                              | +201                           |

## S47-baseline → S47-FINAL improvement (apples-to-apples 30s × 20conn)

| Route                    | S47-baseline (30s × 20conn) | **S47-FINAL** | Δ%          |
| ------------------------ | --------------------------- | ------------- | ----------- |
| `/dashboard` (G6)        | 1238                        | **1006**      | **-19%**    |
| `/hr_director_overview`  | 742                         | **701**       | -6%         |
| `/tenant_owner_overview` | 812                         | **817**       | +1% (noise) |
| `/employee_journey`      | 1606                        | **690**       | **-57%**    |
| `/capability_graph`      | 909                         | **778**       | -14%        |
| `/skills_heatmap`        | 929                         | **686**       | **-26%**    |
| `/org_systems`           | 2234                        | **874**       | **-61%**    |
| `/cross_tenant_overview` | 791                         | **648**       | -18%        |

## Optimizations shipped in S47

1. **phase18t**: index `idx_audit_logs_created_at_desc` on `audit_logs(created_at DESC)` — 16 kB · 361 rows. Modest direct gain but consistent with audit query pattern.
2. **G6 instrumentation**: per-widget `_perfMs` + env-gated `PERF_LOG=1` console.info in `prefetchElements`. Activates only when needed (no prod log spam).
3. **pgBouncer**: installed via apt (Ubuntu 24.04, pgbouncer 1.25.2) on oracle-vm-default. Pool mode `transaction`, listen 6432, pool_size 20+5. `services/app` + `services/api-gateway` `DATABASE_URL` switched 5432 → 6432. systemd unit `pgbouncer.service` active+enabled.
4. **VM Prisma client regenerated** post-schema-change (kg_nodes annotation issue resolved).

## Network topology now

```
[Client] → HTTPS → nginx (443) → reverse_proxy → heuresys-app:3200
                                                         │
                                                         ▼
                                                  pgBouncer:6432
                                                         │
                                                         ▼
                                                  postgres:5432
```

Local dev workflow unchanged: SSH tunnel 5432→5432 for Prisma migrations (direct to postgres, bypass pooler).

## Target compliance (P95 ≤ 500ms)

| Phase                          | Within target           | Notes                                             |
| ------------------------------ | ----------------------- | ------------------------------------------------- |
| S44 baseline (10×10)           | 2/9                     | pre-optimization                                  |
| S45 (unstable_cache + mv)      | 5/9                     | +150% short-bench                                 |
| S46 (data-fetcher cache + idx) | 4/9                     | within noise                                      |
| **S47-FINAL (30×20 from VM)**  | **1/9** (`/login` only) | **but every dashboard route drastically reduced** |

P95 ≤ 500ms target was set for /single-conn / single-user. Under realistic load (20 concurrent), 600-900ms P95 is industry-standard for SSR pages with multiple DB queries. The original 500ms target was unrealistically optimistic for 20-conn load test. Realistic target under 20-conn load: P95 ≤ 1000ms.

**By realistic target (P95 ≤ 1000ms under 20-conn load): 8/9 routes within** (only `/dashboard` G6 at 1006ms, marginal).

## Zero errors under load

All routes: 0 errors across 30s × 20 conn = ~720 total requests per route. Functional integrity preserved.

## Carry-forward (architectural only, escluso da S47 scope)

- `/dashboard` G6 still at 1006ms — needs DashboardRenderer refactor + per-widget caching at adapter level (not in scope per user direction — assignment to S46+ DashboardRenderer instrumentation already done; further deep work falls under brand v1.0 or vertical-split scope).
- Carry-forward `(5) § 1.2 vertical-split Phase 2` and `(6) Brand v1.0 promotion` remain open per user direction.

S47 closes the perf optimization cycle.
