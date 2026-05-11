# heuresys-evo — Current State

> Updated: 2026-05-11T02:20Z · S31 closed (opzione B+) · phase16o pipeline-v3 apply-ready

## Last session brief

**S31 (00:30Z → 02:20Z)** — Opzione B+ shipped: phase16o pipeline-v3 apply-ready. Composition: canonical plan body (DRAFT-DEFERRED.sql, 611 righe) + DROP CASCADE 65 views (reverse topo) + RECREATE 65 views (forward topo) + REFRESH 4 mat views, all single-transaction. Validated end-to-end on `heuresys_phase16o_test` (restored from 397M backup): all 7 stages PASS + functional INSTEAD OF triggers test (INSERT 4-table split + UPDATE per-table + DELETE+CASCADE). Production untouched.

Commits: previous `6b660a4` (P2+P3) + `6a0b7bb` (P1 v2 artifacts) + final S31 commit (v3 artifacts + STATE.md).

## Top priorities S32+ (apply session)

1. **`[ARCH-S32]` phase16o APPLY ON PROD** (~2-4h dedicated session). All artifacts ready in `db/migrations/phase16o/artifacts-v3/` (sha256 `4de3ab0e…`). Apply checklist in `db/migrations/phase16o/artifacts-v3/README.md`:
   - Maintenance window (mat view refresh timer 4h UTC)
   - Backup verify sha256 `dba5a08b…`
   - Re-run dry-run on temp DB (regenerate from backup)
   - Apply prod: `psql -d heuresys_platform -1 -v ON_ERROR_STOP=on -f phase16o-pipeline-v3.sql`
   - Post-apply: 488 api-gateway tests + 224 app tests + new backup baseline

2. **`[ARCH-S32]` Prisma schema sync post-apply** (~1-2h). After employees becomes a VIEW, `prisma db pull` will reflect it as VIEW. Verify zero refactor needed (INSTEAD OF preserves canonical INSERT pattern). Audit `RETURNING *` behavior in api-gateway/app routes that write to employees. Likely smooth but needs validation.

3. **`[OBS-S32]` Performance bench post-apply** (~30min). Query plans on VIEW JOIN vs old TABLE may shift. Sample 8 hot views via autocannon. Add satellite indexes if regression observed.

## Other tech pending (non-priority, unchanged from S29-S30)

- **`[TEST]` H11 audit assertions extension** (~6-10h optional): expand from 1 test/route to 3 tests/route (CREATE+UPDATE+DELETE). Diminishing returns.
- **`[TEST]` H13 RLS DATABASE_URL_TEST setup** (~1-2h): make 30 RLS scenarios live (currently skip).
- **M3** Prisma client consolidation (~2-3h refactor cross-workspace)
- **M10** TOTP UI wizard + login signIn step-up integration (~4-6h)
- **M1** Storybook 3 component data-heavy (~1-2h)
- **LOW** Load test perf bench autocannon 8 viste (~30 min)
- **lint:tenant-id violation**: `services/app/src/app/api/auth/totp/verify/route.ts:72` — pre-existing S28-bis Wave 10
- **H6** NextAuth v5 migration — force-wait Q3-Q4 2026 stable

## Stack snapshot

- Code S31: `db/migrations/phase16o/artifacts-v3/` · `scripts/build-pipeline-v3.py` · 0 production code changes
- Tests: 488 api-gateway PASS unchanged (mocked = DB-independent) · 38 skipped (RLS H13 no DATABASE_URL_TEST)
- DBMS: invariato (pre-flight v3 only on temp DB, cleaned up)
- Pre-flight artifacts: `db/migrations/phase16o/artifacts-v3/phase16o-pipeline-v3.sql` (3212 lines, sha256 `4de3ab0e…`) + `defs.sql` + `README.md` apply checklist

## Verification

```bash
git log --oneline -4                                              # S31 final + 6a0b7bb + 6b660a4 + 97dd939
sha256sum db/migrations/phase16o/artifacts-v3/phase16o-pipeline-v3.sql
# expected: 4de3ab0e2b2e2f3791588a1ebb8a3f94981d171649888260964353194fc29514

ssh oracle-vm-default 'sudo sha256sum /var/backups/heuresys-evo/heuresys_platform-pre-phase16o-20260510T044105Z.dump'
# expected: dba5a08b0fba34b61fa2ed5b6152d31ea0d1ab58ad27519487956e356a1157b1
```

Riferimenti: `db/migrations/phase16o/artifacts-v3/README.md` (apply checklist S32) · `db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql` (canonical plan, body wrapped by pipeline-v3).
