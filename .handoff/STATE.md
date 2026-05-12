# heuresys-evo — Current State

> Updated: 2026-05-12T04:05Z · S45 perf optimization batch — 5/9 routes within P95 ≤ 500ms target

## Last session brief

S45: 3 ottimizzazioni shipped — (1) unstable_cache (Next.js, revalidate=60s) wrapping 6 dashboard fetchers; (2) React 19 cache() in `_shared-cache.ts` per `getTenantById` + `getAllTenants` per-request memoization; (3) mat view `mv_rbac_matrix` (272 rows = 8 roles × 34 areas, phase18q) + refresh_all_mat_views() extended. Re-bench autocannon: **5/9 routes within P95 ≤ 500ms** (up from 2/9 in S44, +150%). Best gains: `hr_director_overview` -57% · `tenant_owner_overview` -56% · `capability_graph` -25%.

## Top priorities

1. **DashboardRenderer cache layer** (~1-2h) — `/dashboard` G6 route (P95 844ms) usa `dashboard_elements` SQL queries non cached. Cache layer al renderer + widget-level memoization.
2. **RbacMatrix widget → mv_rbac_matrix** (~30min) — repoint `dashboard_elements.config_overrides.data_source.query` per BrandRbacMatrix → `SELECT * FROM mv_rbac_matrix`. Atteso -400-600ms su `/org_systems`.
3. **employee_skill_assessments index** (~30min) — `(employee_id, skill_name)` multi-column index per `/skills_heatmap` matrix JOIN. Atteso -150-200ms.
4. **§ 1.2 employees vertical-split Phase 2** (~15-25h architectural) — separate scope.
5. **Brand v1.0 promotion** (~16-25h multi-sessione).

## Open questions

- **employee_journey cache invalidation**: chiave per-employeeId — quale TTL ottimale? 60s su career data è veloce ma cache miss su new employee_ids è dispendioso.
- **G6 renderer cache strategy**: per-widget vs per-page? Widget JSON data_source.query potrebbe essere cached individuale + composed.

## Stack snapshot (post-S45)

- 6 dashboard fetcher cached via unstable_cache (60s revalidate · tag-based invalidation ready)
- 2 shared queries cached via React 19 cache() (per-request memo)
- 6 mat views attive (mv_rbac_matrix nuovo + 5 esistenti) · refresh 4h via systemd timer
- Lighthouse 100/100 a11y (S44) · 0 errors load test
- **Perf baseline**: 5/9 routes within target (vs 2/9 baseline) · `/login` 21ms · `/hr_director_overview` 453ms · `/tenant_owner_overview` 459ms · `/capability_graph` 475ms · `/cross_tenant_overview` 451ms
- Routes still over target: `/dashboard` G6 (844ms) · `/employee_journey` (824ms) · `/skills_heatmap` (627ms) · `/org_systems` (1185ms)
- typecheck + lint:tenant-id + lint:mock-identities PASS

## Verification

```bash
# Re-bench after carry-forward optimizations
rm -rf services/app/.next && npm run build --workspace=services/app
npm run start --workspace=services/app &
# Re-auth + warmup + autocannon (see docs/_audit/2026-05-12-perf-baseline/POST-OPTIM-results.md)

# Mat view freshness check
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c 'SELECT * FROM refresh_all_mat_views()'"
# Expected: 6 views, all success
```

Riferimenti: `docs/_audit/2026-05-12-perf-baseline/POST-OPTIM-REPORT.md` · `db/migrations/phase18{m,n,o,p,q}*.sql`
