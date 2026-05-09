# heuresys-evo — Current State

> Updated: 2026-05-09T23:40Z · S23-tris closed — L54+L55+L56 forensic audit closure (9 issues + advisory chiuse · 2 partial · 6 not started)

## Last session brief (S23 + S23-bis + S23-tris)

**S23** (commit `929aa1e`): phase16a/b/c migrations + auditedTransaction helper. **S23-bis** (commit `05e603b`): chiuse 3 deferred (#5 widget_catalog_id, #7 rbac_role, #6 P3 miscount confirmed) + 1 quick win index. **S23-tris** (this commit): batch 24 tables tenant_id+RLS via phase16f/g (~9000 rows backfilled, 30 totali post-pilot) + drop 2 trigger broken via phase16h + `$queryRawUnsafe` → `set_config()` parametrize in `withTenant()` (pool.ts + db.ts) + SAP/migrations doc advisory in db/README.md. Total session ~14h focus. **9 audit issues + 4 advisory chiuse**, 2 partial, 6 not started — bilancio onesto residuo ~3-6 FTE-day.

## Top priorities (S24 — driven by L56 carry-forward)

1. **`[CRITICAL]`** #1 residue 6 tabelle orphan/no-FK: cleanup orphan rows (interviews 8, feedback_responses 4) + apply tenant_id + prediction_*/report_* (require app-context analysis). ~1-2 FTE-day.
2. **`[HIGH]`** #3 P4 sweep extended: applicare `auditedTransaction()` ai write paths Prisma rimanenti + mirror helper in `services/api-gateway/src/lib/audit/`. ~1-2 FTE-day.
3. **`[MEDIUM]`** #9+#10+§2.5+§1.5+§1.8+§8.5 cleanup combinato. ~3-5 FTE-day.

## Open questions

- Orphan rows interviews/feedback_responses: HARD DELETE (perdita dati storici) o ALTER COLUMN nullable + backfill manuale post-investigation?
- prediction_actions/factors + report_executions/schedules: hanno tenant context implicito tramite `executed_by_employee_id` (employees) o `report_id` (reports senza tenant_id)? Decision tree pending.
- P4 sweep: applicare `auditedTransaction()` come hard-fail o fallback soft con logging on missing actor (per legacy paths)?

## Stack snapshot (changed in S23+S23-bis+S23-tris)

- DBMS: 350+ RLS policies (was 330 pre-S23) · 0 GUC typo · FK fk_users_role + fk_users_role_NEW · 8 canonical rbac_role enum · widget_catalog_id FK dropped · 2 broken P4 triggers dropped · audit_permission_changes() function dropped · idx_tenant_schema_version_applied_by added
- 30 tabelle pilot+batch tenant_id+RLS protette: whistleblowing 3, mentorship_sessions, survey 2 (S23) + 18 EMP/recruiting/talent (phase16f) + 6 learning (phase16g) — ~9000 rows totali backfilled
- `withTenant()` (pool.ts + db.ts) usa `set_config()` parametrized via `$queryRaw` binding (audit § 7.1 closed)
- SQL migrations applied bare-metal: phase16a-h (8 file totali in db/seeds/)
- Code: services/app/src/lib/audit/auditedTransaction.ts (helper P4) + 2 brand-studio actions instrumented
- Prisma schema sync: rbac_role 8 canonical + widget_catalog @relation removed (services/{app,api-gateway}/prisma/)
- Tests: 853/853 vitest verdi · login canonical 8/8 PASS
- Docs: CLAUDE.md S23 close · DECISIONS-LOG L54+L55+L56 · audit md S23-tris closures · db/README.md advisory sections

## Verification

```bash
git log --oneline -5
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"
  SELECT 'pilot+batch=' || count(*) FROM information_schema.columns WHERE column_name='tenant_id' AND is_nullable='NO' AND table_name IN ('whistleblowing_messages','whistleblowing_attachments','whistleblowing_audit_log','mentorship_sessions','survey_questions','survey_responses','employee_certifications','employee_skill_assessments','employee_pay_stubs','merit_recommendations','bonus_allocations','salary_band_assignments','employee_kpi_targets','employee_career_paths','employee_occupations','employee_job_assignments','employee_benefit_enrollments','employee_requests','internal_applications','signature_recipients','calibration_discussions','succession_candidates','applications','employee_skill_history','course_modules','learning_bookmarks','learning_ratings','learning_recommendations','learning_path_courses','module_completions');  -- expected 30
  SELECT 'broken_triggers=' || count(*) FROM pg_trigger WHERE NOT tgisinternal AND tgname IN ('trg_audit_role_permissions','trg_audit_employee_permission_overrides');  -- expected 0
  SELECT 'audit_func=' || count(*) FROM pg_proc WHERE proname='audit_permission_changes';  -- expected 0
\""
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# Expected: "verification: 8/8 pass"
cd services/app && npx tsc --noEmit && npm test --silent
cd D:/evo.heuresys.com && npm test --workspace=services/api-gateway --silent
```

Riferimenti chiave: `docs/_audit/2026-05-09-forensic-db-audit.md` § "S23-tris additional closures" · `.ux-design/DECISIONS-LOG.md` § L54+L55+L56 · `~/.claude/plans/superpowers-per-eseguire-tutto-eventual-sunset.md`
