# heuresys-evo — Current State

> Updated: 2026-05-11T02:50Z · S32 closed · phase16o APPLIED on PROD ✅

## Last session brief

**S30+S31+S32 (00:14Z May 10 → 02:50Z May 11)** — Sprint chiuso end-to-end senza deferral:

- **S30**: P2 H11 (+26 audit assertion tests, 16 test files) · P3 H13 (+24 RLS scenarios, total 30) · P1 phase16o pre-flight (DAG 65 view + topo + dry-run su DB temp)
- **S31**: phase16o pipeline-v3 build (canonical plan body + DROP/RECREATE 65 views + INSTEAD OF triggers + REFRESH mat views) + dry-run completo + functional INSTEAD OF triggers test
- **S32**: APPLIED su PROD heuresys_platform 2026-05-11T00:44:19Z, single transaction COMMIT successful, all 7 stages PASS

**Stack post-phase16o**:
- `employees` è ora una VIEW (95-col shape preservata) joining `employees_core` (18 cols) + `employees_pii` (38) + `employees_hr` (28) + `employees_payroll` (11)
- 3 INSTEAD OF triggers (`insert/update/delete`) routano writes ai 4 base tables
- 65 view dipendenti recreate in topological order
- 4 mat views refresh OK · 209 FK target employees_core
- 488/488 api-gateway tests PASS (DB-mocked, schema-independent)
- Backup baseline aggiornato: `post-phase16o-20260511T004606Z.dump` sha256 `30f04af7…`

Commits: `6b660a4` (S30 P2+P3) · `6a0b7bb` (S30 P1 v2) · `b035d8a` (S31 v3 ready) · S32 final commit (apply closure + STATE.md).

## Top priorities S33+ (low priority)

1. **`[OPS-LOW]` Prisma schema sync verify** (~30min). After phase16o, `prisma db pull` reflects employees as VIEW. Likely zero refactor needed (INSTEAD OF preserves canonical insert pattern). Audit `RETURNING *` on INSERT routes for confirmation.

2. **`[PERF-LOW]` Query plan bench post-phase16o** (~30min). VIEW JOIN may shift query plans. Sample 5 hot queries via `EXPLAIN ANALYZE`. Add satellite indexes only if measurable regression.

3. **`[OBS-LOW]` 9 secondary orphan views CASCADE-dropped** by pipeline-v3 (`v_*_cluster` + `v_nine_box_summary` + `v_candidate_summary`). 0 codebase references. Recreate only if business need emerges.

## Other tech pending (non-priority, unchanged)

- **`[TEST]` H11 audit assertions extension** (~6-10h optional): expand from 1 test/route to 3 tests/route. Diminishing returns.
- **`[TEST]` H13 RLS DATABASE_URL_TEST setup** (~1-2h): make 30 RLS scenarios live (currently skip).
- **M3** Prisma client consolidation (~2-3h refactor cross-workspace)
- **M10** TOTP UI wizard + login signIn step-up integration (~4-6h)
- **M1** Storybook 3 component data-heavy (~1-2h)
- **LOW** Load test perf bench autocannon 8 viste (~30 min)
- **lint:tenant-id violation**: `services/app/src/app/api/auth/totp/verify/route.ts:72` — pre-existing S28-bis Wave 10
- **H6** NextAuth v5 migration — force-wait Q3-Q4 2026 stable

## Stack snapshot

- **Code S30-S32**: 16 api-gateway test files (audit assertions) · 1 RLS spec extended · `db/migrations/phase16o/` (artifacts v2+v3 + Python builder + README) · `db/seeds/phase16o_employees_to_view.APPLIED-2026-05-11.sql` (renamed from DRAFT-DEFERRED, header updated)
- **DBMS**: phase16o vertical-split applied, `employees` is now VIEW · `employees_core` table 18 cols · 3 satellites · 3 INSTEAD OF triggers · 65 dependent views recreated · 4 mat views refreshed · 209 FK
- **Tests**: 488/488 api-gateway PASS · 38 skipped (30 RLS H13 + 8 pre-existing) · typecheck PASS
- **Backups**: pre-phase16o `dba5a08b…` + post-phase16o `30f04af7…` (both 397M on VM)
- **Apply log**: `oracle-vm-default:/var/log/phase16o-apply-20260511T004419Z.log` (6537 bytes)

## Verification

```bash
git log --oneline -5
# expected: S32 final + b035d8a + 6a0b7bb + 6b660a4 + 97dd939

ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "
SELECT obj, count(*) FROM (
  SELECT '\''employees(VIEW)'\'' obj, * FROM employees) t1
GROUP BY obj
UNION ALL
SELECT '\''employees_core'\'', count(*) FROM employees_core
UNION ALL
SELECT '\''instead_of_triggers'\'', count(*)::bigint FROM pg_trigger
WHERE tgrelid='\''public.employees'\''::regclass AND NOT tgisinternal;
"'
# expected: employees(VIEW)=270, employees_core=270, instead_of_triggers=3

ssh oracle-vm-default 'sudo sha256sum /var/backups/heuresys-evo/heuresys_platform-post-phase16o-20260511T004606Z.dump'
# expected: 30f04af752c7084050291851219f53d8cfce3a27b14b585cb59402025d4c5690
```

Riferimenti: `db/migrations/phase16o/artifacts-v3/README.md` (apply summary completo S32) · `db/seeds/phase16o_employees_to_view.APPLIED-2026-05-11.sql` (canonical plan body wrapped da pipeline-v3, ora APPLIED).
