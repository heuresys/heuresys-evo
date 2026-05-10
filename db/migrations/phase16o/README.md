# Phase16o — employees vertical-split Phase 2 (S30 pre-flight, opzione B)

> Status: **PRE-FLIGHT COMPLETE · APPLY DEFERRED** to dedicated session.
> All artifacts validated via dry-run on `heuresys_phase16o_test` (restored from backup); production DBMS untouched.

## Context

Continuation of `§ 1.2 employees vertical-split` (L59). Phase 1 shipped 3 satellite tables (`employees_pii`/`employees_hr`/`employees_payroll`) + sync trigger + view `employees_full`. Phase 2 must rename `employees` → `employees_core`, drop the columns now living in satellites (~77), and replace `employees` with a VIEW so application queries continue working.

S29 pre-flight surfaced 3 blockers that this S30 work resolves:

1. View defs without schema qualifier → solved (this builder generates schema-qualified DDL via `pg_get_viewdef('schema.view'::regclass, true)`).
2. Apostrophes stripped in shell heredoc → solved (Python writes SQL directly to file, no shell interpolation).
3. Backup target 0 byte → solved (correct target verified: `pre-phase16o-20260510T044105Z.dump`, sha256 `dba5a08b…`).

Plus +2 newly discovered view dependencies (was 65, evidence shows 65 active in `pg_views`+`pg_matviews` query — actual count is 65, S29 also said 65).

## Artifacts (all validated 2026-05-10 23:50Z on VM, dry-run COMMIT successful)

| File | Purpose | sha256 |
|---|---|---|
| `artifacts/views-list.txt` | 65 view full names + kind (61 v + 4 m) | `1a0484e2…` |
| `artifacts/edges.txt` | view→view dependency edges (5 inter-view edges) | `2219da02…` |
| `artifacts/topo-order.txt` | forward CREATE order (deps first) | `dcd6936e…` |
| `artifacts/phase16o-pipeline-v2.sql` | full apply SQL (DROP CASCADE + RENAME + CREATE VIEW + recreate 65 views in topo order + REFRESH + verify counts) | `bc8a74a1…` |
| `scripts/phase16o-preflight-builder.py` | regeneration script (idempotent, run on VM) | n/a |

`defs.sql` (raw extracted DDL, 112KB, intermediate artifact) is excluded from repo — regenerate via the builder if needed.

## Dry-run validation (heuresys_phase16o_test)

```
[restore] dump 397M → 691 tables · 4 ignored errors (ivfflat embeddings, maintenance_work_mem 64MB; not relevant for phase16o)
[apply]   65 DROP CASCADE → ALTER TABLE RENAME → CREATE VIEW → 65 CREATE in topo order → 4 REFRESH MATERIALIZED VIEW → COMMIT (15.5ms)
[verify]  employees=270 employees_core=270 mv_talent_signals=270 employees_full=270
          v_workforce_overview=4 v_org_hierarchy=53 mv_employee_performance_context=264
```

All sample views return expected row counts post-apply. The full pipeline is committable on prod.

## What is NOT yet in pipeline-v2 (out-of-scope of S30 opzione B)

The current `phase16o-pipeline-v2.sql` uses a **placeholder** in step 3:

```sql
CREATE VIEW public.employees AS SELECT * FROM public.employees_core;
```

The production version of step 3 must instead **JOIN `employees_core` with the 3 satellites** (`employees_pii`/`employees_hr`/`employees_payroll`) so the VIEW preserves the full original column set. Plus:

- **Step 2.5** missing: ALTER TABLE employees_core DROP COLUMN x77 (the columns now in satellites). Currently the dry-run skips this for safety — a follow-up commit must add the explicit DROP COLUMN list once `employees_pii`/`hr`/`payroll` column inventory is cross-checked vs. `employees_core` original.
- **INSTEAD OF triggers**: pipeline-v2 does NOT install INSTEAD OF INSERT/UPDATE/DELETE triggers on the new `employees` VIEW. Required so legacy `INSERT INTO employees (…)` statements continue working (currently many api-gateway/app routes write to `employees` directly via Prisma).
- **RLS policy migration**: 65 dropped views had their own RLS policies. CASCADE drops them too. Need an audit of which RLS policies need recreation on the recreated views.

These three items are the critical scope for the **apply session** (S31+) and must be added to the script before any prod execution.

## Apply session checklist (S31+)

1. ✅ Pre-flight artifacts present (this directory)
2. ⚠️ Add INSTEAD OF triggers to pipeline-v2 step 3 (replace placeholder VIEW)
3. ⚠️ Add explicit `ALTER TABLE employees_core DROP COLUMN…` after the RENAME
4. ⚠️ Audit and replay RLS policies on 65 recreated views
5. ⚠️ Re-run dry-run on `heuresys_phase16o_test` with the additions
6. ⚠️ Verify api-gateway test suite passes against the dry-run DB (point `DATABASE_URL_TEST` at temp DB)
7. ⚠️ Confirm backup target sha256 matches `dba5a08b…` immediately before apply
8. ⚠️ Schedule maintenance window (mat view auto-refresh systemd timer fires every 4h UTC; coordinate to avoid mid-apply refresh)
9. ⚠️ Apply on prod within transaction; ROLLBACK on any error
10. ⚠️ Post-apply: refresh mat views explicitly; run application smoke tests; sample queries against the 8 critical views

## Regeneration

If schema drifts (e.g. new view added that touches `employees`), regenerate artifacts:

```bash
scp db/migrations/phase16o/scripts/phase16o-preflight-builder.py oracle-vm-default:/tmp/
ssh oracle-vm-default 'python3 /tmp/phase16o-preflight-builder.py'
scp 'oracle-vm-default:/tmp/phase16o-preflight/artifacts/{views-list,edges,topo-order,phase16o-pipeline-v2}*' \
    db/migrations/phase16o/artifacts/
```

The builder is idempotent and read-only against the source DB.
