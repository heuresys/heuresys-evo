# heuresys-evo — Current State

> Updated: 2026-05-11T03:30Z · S33 closed · zero actionable tech pending

## Last session brief

S30→S33 (~6h FTE compresso): P2/P3 H11+H13 audit/RLS · phase16o vertical-split **applied on PROD** · tier A+B+C closures (lint, query bench, RLS live setup, H11 ext, M3 deferred). Tutti gli 11 tech pending originali chiusi (7 DONE, 2 DOCUMENTED, 2 DEFERRED-UI, 1 DECLASSED).

## Top priorities

Solo strategic / non-tech-debt. Nessuna pending tech.

1. **Brand workstream** (active in `.ux-design/`) — Phase 4 aesthetic direction in re-exploration. Pickup via skill `brand-resume`.
2. **Studio workstream** (active in `.claude/skills/studio/`) — clone/promote Next.js routes. Pickup via skill `studio`.
3. **M10/M1 UI residual** (manual pickup quando lavori UI in browser): TOTP wizard step-up + Storybook 3 data-heavy components.

## Open questions

Nessuna. Tutte risolte in S30→S33.

## Stack snapshot (post-S33)

- **DBMS**: phase16o vertical-split applied · `employees` è VIEW joining `employees_core` (18 cols) + 3 satellites (PII 38 + HR 28 + Payroll 11) · 3 INSTEAD OF triggers · 209 FK target employees_core · 65 dependent views recreated · 4 mat views refresh OK
- **Tests**: 494/494 api-gateway PASS · 30/30 RLS H13 PASS live (su `heuresys_test` VM) · `npm run lint:tenant-id` clean · typecheck PASS
- **Backups**: pre-phase16o `dba5a08b…` · post-phase16o `30f04af7…` (entrambi 397M su VM)

## Verification

```bash
git log --oneline -5
# expected: c5c3e5a + d2a59ea + bf18e57 + b035d8a + 6a0b7bb

npm test --workspace=services/api-gateway --silent
# expected: 494 PASS, 38 skipped

npm run lint:tenant-id
# expected: exit 0

ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "SELECT count(*) FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid WHERE c.relname='\''employees'\'' AND NOT t.tgisinternal;"'
# expected: 3 (INSTEAD OF triggers)
```

Riferimenti: `db/migrations/phase16o/artifacts-v3/README.md` (phase16o apply) · `docs/30-developer/audit-coverage-decision.md` (H11 closure rationale) · `db/seeds/phase16o_employees_to_view.APPLIED-2026-05-11.sql` (canonical body).
