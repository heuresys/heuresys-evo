# heuresys-evo — Current State

> Updated: 2026-05-09T22:35Z · S23-bis closed — L54+L55 forensic audit closure (8 issue chiuse · 2 partial · 2 not started)

## Last session brief (S23 + S23-bis)

**S23** (commit `929aa1e`): phase16a/b/c migrations + auditedTransaction helper. **S23-bis** (this commit): chiuse 3 deferred (#5 widget_catalog_id, #7 rbac_role, #6 P3 miscount confirmed) + 1 quick win index. Total ~12h focus. **8 di 10 top-10 issue audit chiuse**, 2 partial, 0 deferred residue. Audit forensic L53 in fase di chiusura attiva (~6-10 FTE-day residuo per S24+ reali).

## Top priorities (S24 — driven by L55 carry-forward)

1. **`[CRITICAL]`** Tenant_id batch 24 tabelle restanti split in 4 batch SQL (employee_core 13 · learning 6 · recruiting 3 · talent 6). ~4-6 FTE-day · ref `docs/_audit/2026-05-09-forensic-db-audit.md` § 2.3 (con corrections S23/S23-bis applicate)
2. **`[HIGH]`** P4 sweep: applicare `auditedTransaction()` ai write paths Prisma + drop trigger broken `audit_permission_changes()` (scoperto S23-bis: scrive audit_logs invalidi) + mirror helper in `services/api-gateway/src/lib/audit/`. ~1-2 FTE-day
3. **`[MEDIUM]`** Lint rule app-level tenant_id (audit issue #9) + bcrypt one-shot rehash (issue #10). ~4-7 FTE-hour combined.

## Open questions

- Tenant_id batch 24 tabelle: ordine ottimale = small-first (recruiting 3 → learning 6 → talent 6 → employee_core 13)? O big-first per offload critical paths?
- Trigger `audit_permission_changes()`: drop puro o sostituire con call a `auditedTransaction()` (richiede passare actor context al trigger via `current_setting('app.current_user_id')` GUC esteso)?
- `user_workspaces`/`workspace_widgets` GUC drift (§ 2.5): refactor allineamento `app.current_tenant_id` standard o accettare convenzione local user-scoped?

## Stack snapshot (changed in S23 + S23-bis)

- DBMS: 336 RLS policies · 0 GUC typo · FK fk_users_role + fk_users_role_NEW · 8 canonical rbac_role enum · widget_catalog_id FK dropped · 6 pilot tables tenant_id+RLS (4911 rows backfilled) · idx_tenant_schema_version_applied_by added
- NEW SQL migrations applied bare-metal: `phase16a` (GUC fix) · `phase16b` (pilot tenant_id) · `phase16c` (users.role FK) · `phase16d` (rbac_role cleanup) · `phase16e` (widget_catalog FK drop)
- NEW `services/app/src/lib/audit/auditedTransaction.ts` + test 5/5 verdi
- Prisma schema sync: services/{app,api-gateway}/prisma/schema.prisma — 8 canonical rbac_role enum + widget_catalog @relation removed
- 853/853 vitest verdi · login canonical 8/8 PASS
- UPDATED globale: CLAUDE.md (S23 close + S24 priorities reduced) · DECISIONS-LOG.md (L54 + L55) · audit md (S23 closure annotations)

## Verification

```bash
git log --oneline -5
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"
  SELECT 'enum=' || string_agg(enumlabel, ',' ORDER BY enumsortorder) FROM pg_enum WHERE enumtypid='rbac_role'::regtype;  -- expected 8 canonical
  SELECT 'fk_widget=' || count(*) FROM pg_constraint WHERE conname='dashboard_elements_widget_catalog_id_fkey';  -- expected 0
  SELECT 'fk_users_role=' || count(*) FROM pg_constraint WHERE conname='fk_users_role';  -- expected 1
  SELECT 'pilot=' || count(*) FROM information_schema.columns WHERE table_name IN ('whistleblowing_messages','whistleblowing_attachments','whistleblowing_audit_log','mentorship_sessions','survey_questions','survey_responses') AND column_name='tenant_id' AND is_nullable='NO';  -- expected 6
\""
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# Expected: "verification: 8/8 pass"
cd services/app && npx tsc --noEmit && npm test --silent
cd D:/evo.heuresys.com && npm test --workspace=services/api-gateway --silent
```

Riferimenti chiave: `docs/_audit/2026-05-09-forensic-db-audit.md` § "S23 partial closure annotations" · `.ux-design/DECISIONS-LOG.md` § L54+L55 · `~/.claude/plans/superpowers-per-eseguire-tutto-eventual-sunset.md`
