# Phase16o pipeline-v3 (S31 — opzione B+, apply-ready)

> Status: **APPLY-READY · sign-off pending S32**.
> Dry-run validated 2026-05-11 02:14Z on `heuresys_phase16o_test` (restored from `pre-phase16o-20260510T044105Z.dump`); production DBMS untouched.

## Composition

`phase16o-pipeline-v3.sql` (3212 lines, 145KB) wraps:

1. **DROP CASCADE 65 dependent views** in reverse topological order — INSERTED before stage 4
2. **Canonical plan body** from `db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql`:
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

All wrapped in single `BEGIN; ... COMMIT;` transaction. ROLLBACK on any error.

## Dry-run validation

```
[restore] dump 397M → 691 tables (4 ignored: ivfflat embeddings, maintenance_work_mem 64MB)
[apply pipeline-v3]
  · 0/7 pre-flight asserts: 270 rows, zero drift                        ✓
  · 1/7 DROP sync trigger + function                                    ✓
  · 2/7 DROP employees_full                                             ✓
  · INSERT DROP CASCADE 65 views (reverse topo)                         ✓
  · 3/7 RENAME employees → employees_core                               ✓
  · 4/7 DROP COLUMN x77 → employees_core has 18 cols                    ✓
  · 5/7 CREATE VIEW employees → 270 rows                                ✓
  · 6/7 INSTEAD OF triggers (3 of them)                                 ✓
  · INSERT RECREATE 65 views (forward topo)                             ✓
  · INSERT REFRESH 4 mat views                                          ✓
  · 7/7 final assert: view=270 core=270 FK=209 triggers=3               ✓
  · COMMIT                                                              ✓

[functional INSTEAD OF triggers test]
  INSERT employees → core=1 pii=1 hr=1 payroll=1 view=1                 ✓
  UPDATE employees SET first_name → propagated to PII                   ✓
  DELETE employees → core=0 pii=0 hr=0 view=0 (FK CASCADE)              ✓
```

Total dry-run runtime: ~5 seconds (post-restore).

## Files

| File | Size | sha256 (on VM) |
|---|---|---|
| `phase16o-pipeline-v3.sql` | 145KB · 3212 lines | `4de3ab0e2b2e2f3791588a1ebb8a3f94981d171649888260964353194fc29514` |
| `defs.sql` | 112KB · 263 lines | (intermediate from S30, regeneratable) |

`defs.sql` is the per-view DDL extracted via `pg_get_viewdef('schema.view'::regclass, true)` — used as input by `build-pipeline-v3.py` to assemble the recreate block.

## Apply session checklist (S32)

1. **Maintenance window** coordinated with systemd mat view refresh timer (4h UTC fires)
2. **Backup verify** sha256 still matches `dba5a08b…`:
   ```bash
   ssh oracle-vm-default 'sudo sha256sum /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump'
   ```
3. **Pipeline integrity** sha256 matches generation:
   ```bash
   sha256sum db/migrations/phase16o/artifacts-v3/phase16o-pipeline-v3.sql
   # expected: 4de3ab0e…
   ```
4. **Run dry-run again** on `heuresys_phase16o_test` (regenerate from backup) — ensure pipeline-v3 still applies cleanly:
   ```bash
   ssh oracle-vm-default '
     sudo -u postgres dropdb --if-exists heuresys_phase16o_test
     sudo -u postgres createdb heuresys_phase16o_test --owner=heuresys
     sudo -u postgres pg_restore --dbname=heuresys_phase16o_test --no-owner --no-privileges --jobs=4 /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump
     sudo -u postgres psql -d heuresys_phase16o_test -v ON_ERROR_STOP=on -f /tmp/phase16o-preflight/artifacts-v3/phase16o-pipeline-v3.sql
   '
   ```
5. **Apply on prod** (single transaction, ROLLBACK on error):
   ```bash
   ssh oracle-vm-default '
     sudo -u postgres psql -d heuresys_platform -1 -v ON_ERROR_STOP=on -f /tmp/phase16o-preflight/artifacts-v3/phase16o-pipeline-v3.sql 2>&1 | tee /tmp/phase16o-apply-$(date +%Y%m%dT%H%M%SZ).log
   '
   ```
6. **Post-apply smoke**:
   ```bash
   npm test --workspace=services/api-gateway   # expect: 488 PASS
   npm test --workspace=services/app           # expect: 224 PASS
   ```
7. **Backup baseline refresh**:
   ```bash
   ssh oracle-vm-default 'sudo -u postgres pg_dump -Fc heuresys_platform > /var/backups/heuresys-evo/heuresys_platform-post-phase16o-$(date +%Y%m%dT%H%M%SZ).dump'
   ```

## Known follow-ups (S32+)

- **Prisma schema sync**: `services/app/prisma/schema.prisma` and `services/api-gateway/prisma/schema.prisma` reflect employees as a 95-col model. After apply, `prisma db pull` will refl employees as a VIEW. Auditing impact on Prisma client behavior (RETURNING * on INSERT through VIEW + INSTEAD OF: returns full VIEW shape, not table cols) — likely zero refactor needed since INSTEAD OF triggers preserve canonical insert pattern, but verify by running app+api-gateway tests post-apply.
- **Performance bench**: query plans on VIEW JOIN vs old TABLE may shift. Index satellites if needed (likely already done in Phase 1, verify).
- **Documentation**: ADR-0027 post-mortem (originally documented attempt failure, update with successful S32 closure).

## Regeneration

If schema drifts (e.g. new view added that references employees), regenerate everything:

```bash
ssh oracle-vm-default 'python3 /tmp/phase16o-preflight-builder.py'
scp 'oracle-vm-default:/tmp/phase16o-preflight/artifacts/{views-list,edges,topo-order,phase16o-pipeline-v2}*' \
    db/migrations/phase16o/artifacts/
scp oracle-vm-default:/tmp/phase16o-preflight/artifacts/defs.sql \
    db/migrations/phase16o/artifacts-v3/
python3 db/migrations/phase16o/scripts/build-pipeline-v3.py
```
