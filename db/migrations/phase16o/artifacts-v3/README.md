# Phase16o pipeline-v3 — APPLIED on PROD 2026-05-11T00:44:19Z (S32)

> ✅ **STATUS: APPLIED**. employees vertical-split Phase 2 closed.
> Production state: `employees` is now a VIEW joining `employees_core` (18 cols) + 3 satellites (`employees_pii` 38 + `employees_hr` 28 + `employees_payroll` 11). 3 INSTEAD OF triggers route writes. 65 dependent views recreated. 4 mat views refreshed.

## Apply summary

| Field | Value |
|---|---|
| Pipeline file | `phase16o-pipeline-v3.sql` (3212 lines, 145KB) |
| Pipeline sha256 | `4de3ab0e2b2e2f3791588a1ebb8a3f94981d171649888260964353194fc29514` |
| Backup pre-apply | `oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump` (397M, sha256 `dba5a08b…`) |
| Backup post-apply | `oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-post-phase16o-20260511T004606Z.dump` (397M, sha256 `30f04af7…`) |
| Apply log | `oracle-vm-default:/var/log/phase16o-apply-20260511T004419Z.log` (6537 bytes) |
| Apply duration | ~30 seconds |
| Outcome | COMMIT successful, all asserts PASS |

## Composition

`phase16o-pipeline-v3.sql` (3212 lines, 145KB) wrapped:

1. **DROP CASCADE 65 dependent views** in reverse topological order — INSERTED before stage 4
2. **Canonical plan body** from `db/seeds/phase16o_employees_to_view.APPLIED-2026-05-11.sql`:
   - Pre-flight asserts (270 rows, satellite drift, FK integrity)
   - DROP `trg_sync_employees_to_satellites` + sync function
   - DROP `employees_full` view
   - `ALTER TABLE employees RENAME TO employees_core`
   - `ALTER TABLE employees_core DROP COLUMN x77` (curated list: 38 PII + 28 HR + 11 payroll cols)
   - `CREATE VIEW employees AS` LEFT JOIN core+pii+hr+payroll (95-col shape preserved)
   - 3 INSTEAD OF triggers (`trg_employees_view_insert`, `_update`, `_delete`)
   - Stage 7 final asserts (270/270, 200+ FK, 3 triggers)
3. **RECREATE 65 dependent views** in forward topological order — INSERTED after stage 6
4. **REFRESH 4 mat views** + final view-count assert (65/65 recreated) — INSERTED at end

All wrapped in single `BEGIN; ... COMMIT;` transaction.

## Post-apply state

```
employees (VIEW)                  : 270 rows
employees_core                    : 270 rows
employees_pii                     : 270 rows
employees_hr                      : 270 rows
employees_payroll                 : 269 rows (1 employee with NULL salary, expected)
mv_talent_signals                 : 270 rows
mv_employee_performance_context   : 264 rows (active filter)
mv_cross_tenant_rollup            : 1 row
mv_tenant_owner_rollup            : N rows
analytics.v_executive_dashboard   : 4 rows (per tenant)
INSTEAD OF triggers on employees  : 3 (insert / update / delete)
FK targeting employees_core       : 209
```

## Functional smoke verified

- VIEW JOIN: `SELECT count(*) FROM employees WHERE first_name IS NOT NULL` → 270 (PII JOIN ✓)
- VIEW JOIN: `SELECT count(*) FROM employees WHERE job_title IS NOT NULL` → 270 (HR JOIN ✓)
- VIEW JOIN: `SELECT count(*) FROM employees WHERE salary IS NOT NULL` → 269 (Payroll JOIN ✓)
- Integrity: 0 orphan satellites, 0 employees_core without PII/HR/Payroll
- INSTEAD OF triggers (verified pre-apply on temp DB): INSERT routes to all 4 tables, UPDATE per-table propagation, DELETE+CASCADE removes from all 4

## Test suite post-apply

- `npm test --workspace=services/api-gateway`: **488/488 PASS** (38 skipped: 30 RLS H13 needing DATABASE_URL_TEST + 8 pre-existing)
- `npx tsc --noEmit -p services/app/tsconfig.json`: clean

API-gateway tests are mocked (`vi.mock('../../db/pool.js', …)`) → schema-independent, immediate validation. App-side integration tests against live prod DB are out of standard CI run scope.

## Side effects (CASCADE secondary drops)

Pipeline-v3 `DROP VIEW … CASCADE` on the 65 explicit views also dropped 9 secondary orphan views (0 codebase references):

```
v_performance_snapshot_cluster
v_workforce_planning_dashboard_cluster
v_nine_box_summary
v_total_rewards_statement_cluster
v_recruiting_pipeline_cluster
v_employee_lifecycle_cluster
v_employee_experience_score_cluster
v_compliance_dashboard_cluster
v_executive_dashboard_cluster
v_candidate_summary  (public.v_candidate_summary, distinct from analytics.v_candidate_summary)
```

These were pre-existing analytics dashboard prototypes unused by application code (`grep -rln "view_name" services/` returned 0 references for each). They are not recreated by pipeline-v3. If a future need surfaces, recreate from the dump or analytics design.

## Rollback path (only if catastrophic regression discovered)

```bash
# Restore from post-phase16o backup if catastrophic regression discovered:
ssh oracle-vm-default '
  sudo -u postgres dropdb heuresys_platform
  sudo -u postgres createdb heuresys_platform --owner=heuresys
  sudo -u postgres pg_restore --dbname=heuresys_platform --no-owner --no-privileges --jobs=4 \
    /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump
'
```

## Follow-ups (low priority, optional)

- **Prisma schema sync**: `prisma db pull` will reflect employees as a VIEW. Audit that no `RETURNING *` on INSERT routes break (low risk: INSTEAD OF preserves canonical shape). Likely zero refactor needed.
- **Performance bench**: query plans on VIEW JOIN may shift. Sample hot queries via `EXPLAIN ANALYZE`. Add satellite indexes if regression observed.
- **9 secondary orphan views**: if any business need emerges, recreate via canonical analytics design.

## Files

| File | Size | sha256 (on VM) |
|---|---|---|
| `phase16o-pipeline-v3.sql` | 145KB · 3212 lines | `4de3ab0e2b2e2f3791588a1ebb8a3f94981d171649888260964353194fc29514` |
| `defs.sql` | 112KB · 263 lines | (intermediate, regeneratable) |
