# `phase16o-pre-state/` — Archive for P7 verification (S52)

## Context

Phase 2 employees vertical-split was **already shipped** prior to S52, despite
L60 documenting it as "deferred a S27+". S52 investigation discovered the live
state already matches the planned outcome:

- `employees_core` is a TABLE with 18 cols (slim core, 209 FK incoming)
- `employees` is a VIEW with 95 cols (backward-compat shape)
- 3 INSTEAD OF triggers (`fn_employees_view_{insert,update,delete}`)
- 4 satellite tables (`employees_pii` 38c · `employees_hr` 28c · `employees_payroll` 11c) populated (270/270 sync)
- 65 dependent views + 6 mat views still functional sopra la VIEW

See DECISIONS-LOG L63 for full retroactive documentation.

## Files

- `views-saved-defs-S52.txt` — snapshot of `pg_get_viewdef()` output for the 65
  views + 6 mat views dependent on `employees` (taken 2026-05-12 prior to
  S52 attempt). Preserved as **safety archive** in case future migration
  requires rebuild of these views from a known-good baseline.
- VM-side: `/tmp/views_recreate.sql` (executable CREATE statements derived
  from the same snapshot) — recreatable via DB query if needed.

## Backups (VM side)

- `/var/backups/heuresys-evo/heuresys_platform-pre-S52-phase16o-redo-20260512T163646Z.dump` — fresh pre-S52 snapshot
- `/var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump` — original L60 pre-attempt (380MB, sha256 `dba5a08b…`)

## Do NOT re-run phase16o

The migration is already applied. Re-running would fail on `employees_core
already exists` (as confirmed in S52 attempt 2026-05-12T16:39Z which triggered
auto-rollback due to ON_ERROR_STOP=1 within the transaction wrapper).
