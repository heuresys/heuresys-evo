# heuresys-evo — Current State

> Updated: 2026-05-09T22:15Z · S23 closed — L54 forensic audit partial closure

## Last session brief (S23)

Sprint Realistic sul forensic DB audit L53 (~10h focus). 4 commit pushed: `phase16a` (13 RLS GUC fix) · `phase16b` (6 pilot tables tenant_id+RLS, 4911 rows backfilled) · `phase16c` (FK `users.role`→`rbp_roles`) · helper `auditedTransaction()`+`auditEvent()` con 5/5 vitest verdi, applicato a 2 brand-studio actions. **3 audit miscount rilevate**: scope #1 = 24 tabelle (non 30), #5 backfill impossibile (0/17 widget_code match), #6 22/30 routes hanno P3 inline (audit § 6.1 ha contato solo middleware). DBMS state: 330 RLS policies invariate, 0 GUC typo, FK users.role attiva, 265 active users intatti, login canonical 8/8 PASS.

## Top priorities (S24 — driven by L54 carry-forward)

1. **`[CRITICAL]`** Tenant_id batch 24 tabelle restanti split in 4 batch SQL (employee_core 13 · learning 6 · recruiting 3 · talent 6). ~4-6 FTE-day · ref `docs/_audit/2026-05-09-forensic-db-audit.md` § 2.3 (con corrections S23 applicate)
2. **`[HIGH]`** P4 sweep: applicare `auditedTransaction()` ai restanti write paths Prisma + mirror helper in `services/api-gateway/src/lib/audit/`. ~1-2 FTE-day
3. **`[HIGH]`** P3 micro-sweep: ~4 routes truly unprotected (`audit-logs`, `platform`, ecc.). Plus refactor inline→middleware uniforming. ~1 FTE-day

## Open questions

- Tenant_id batch 24 tabelle: ordine ottimale = whistleblowing→sensitive (DONE pilot) → employee_core (largest, more risky) → learning (reference data, lower risk) → recruiting → talent? O batch parallel su feature flag staging?
- P4 sweep: applicare `auditedTransaction()` come hard-fail (throw on missing actor) o soft-fail (log+continue) sui legacy paths con session.user incomplete?
- `rbac_role` enum drift cleanup (S24): `UPDATE role_permissions SET role = 'SUPERUSER' WHERE role = 'SYSADMIN'` (semantic remap) o drop le 4 rows orfane?

## Stack snapshot (changed in S23)

- DBMS: 330 RLS policies (invariato) · +6 nuove pilot tenant_isolation policies · 0 GUC typo · FK `fk_users_role` attiva
- 6 pilot tables con tenant_id+RLS: `whistleblowing_{messages,attachments,audit_log}` · `mentorship_sessions` · `survey_{questions,responses}` (4911 rows backfilled)
- NEW `services/app/src/lib/audit/auditedTransaction.ts` (generalized P4 helper)
- NEW `services/app/src/lib/audit/__tests__/auditedTransaction.test.ts` (5/5 verdi)
- NEW `db/seeds/phase16{a,b,c}_*.sql` (3 migration applied bare-metal SoT)
- UPDATED globale: CLAUDE.md (S23 close + S24 priorities) · DECISIONS-LOG.md (L54) · audit md (S23 partial closure annotations)

## Verification

```bash
git log --oneline -5
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"
  SELECT count(*) FROM pg_policies WHERE qual ~ '''app\.current_tenant''[^_]' AND qual NOT LIKE '%app.current_tenant_id%';  -- expected 0
  SELECT count(*) FROM pg_constraint WHERE conname = 'fk_users_role';  -- expected 1
\""
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# Expected: "verification: 8/8 pass"
cd services/app && npx tsc --noEmit && npx vitest run src/lib/audit/__tests__/auditedTransaction.test.ts
```

Riferimenti chiave: `docs/_audit/2026-05-09-forensic-db-audit.md` § "S23 partial closure annotations" · `.ux-design/DECISIONS-LOG.md` § L54 · `~/.claude/plans/superpowers-per-eseguire-tutto-eventual-sunset.md`
