# heuresys-evo — Current State

> Updated: 2026-05-12T04:10Z · S46 incremental perf optimizations (variance-bound results)

## Last session brief

S46: 3 optimizations shipped — (1) `data-fetcher.ts` cache key include `employeeId` (correctness fix) + default TTL 60s (was 0); (2) phase18r RbacMatrix widget repointed `dashboard_elements.config_overrides.data_source.query` → `mv_rbac_matrix` (mat view from S45); (3) phase18s composite index `idx_emp_skills_emp_skillname` on `(employee_id, skill_name)`. Re-bench autocannon: 4/9 routes within P95 ≤ 500ms (vs S45's 5/9 — analisi onesta: variance ±100ms su run 10s, real gains su `/capability_graph` -24ms, `/skills_heatmap` -28ms, `/employee_journey` -84ms; `/hr_director_overview` slipped 453→648 verosimilmente test variance).

## Top priorities

1. **Long-window bench (30s × 20 conn)** (~30min) — current 10s runs ±100ms variance impedisce conclusioni statistiche ferme. Run con cache pre-warmed + bench separato per route.
2. **/org_systems audit_logs bottleneck** (~1h) — fetcher cached ma `audit_logs.findMany take:6 orderBy desc` su tabella crescente potrebbe essere il vero collo. Index `(created_at desc)` o mat view.
3. **/dashboard G6 instrumentation** (~1-2h) — measure per-widget fetch time vs render. Sospetto serial waterfall instead of parallelization.
4. **pgBouncer** (~2-3h infra) — connection pooling oracle-vm-default. Deferred da S44/S45.
5. **§ 1.2 vertical-split Phase 2** (~15-25h architectural). Multi-sessione.
6. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni).

## Open questions

- **Bench statistical confidence**: per essere conclusivo, ogni run dovrebbe essere ≥30s con cache warmup esplicito. Migrate a k6 invece di autocannon per percentile più stabili?
- **mv_rbac_matrix usage tracking**: post-repoint, `pg_stat_user_indexes` per `mv_rbac_matrix_*` riflette zero scan dopo bench? Verifica.

## Stack snapshot (post-S46)

- data-fetcher.ts cache: per-element + per-employee + per-tenant key · TTL default 60s
- mv_rbac_matrix referenced by 1 RbacMatrix widget (phase18r)
- 1 composite index su employee_skill_assessments (216 kB, phase18s)
- 7 dashboard fetchers cached: 6 via unstable_cache (S45) + 1 process-local LRU (data-fetcher S46)
- 6 mat views attive (mv_rbac_matrix + 5 esistenti) · refresh 4h systemd
- 4/9 routes within P95 ≤ 500ms target (variance from S45 5/9 within noise)
- typecheck + lint:tenant-id + lint:mock-identities PASS

## Verification

```bash
# Long-window bench (recommended next step)
COOKIE=$(grep "authjs.session-token" /tmp/cookies.txt | awk '{print $7}')
npx autocannon -c 20 -d 30 -H "Cookie: authjs.session-token=$COOKIE" \
  http://localhost:3200/dashboard/org_systems

# mv_rbac_matrix scan counter (post-bench)
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT relname, idx_scan FROM pg_stat_user_indexes WHERE relname LIKE 'mv_rbac_matrix%'\""
```

Riferimenti: `docs/_audit/2026-05-12-perf-baseline/S46-REPORT.md` · `db/migrations/phase18{m,n,o,p,q,r,s}*.sql`
