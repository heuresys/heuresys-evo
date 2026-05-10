# heuresys-evo — Current State

> Updated: 2026-05-10T02:10Z · S23-quater closed · audit forensic L53 closure 77% (17/22)

## Last session brief (S23 + S23-bis + S23-tris + S23-quater)

4 commit consecutivi forensic audit L53 (`929aa1e` → `05e603b` → `8129451` → `8a98486` + doc sync `6319aec`). 11 SQL migrations bare-metal phase16a-k. 312 tabelle tenant_id NOT NULL · 367 RLS policies · 0 trigger broken · `auditedTransaction()` helper + bcrypt rotation + enrichment consent + lint rule shipped. 860 test verdi · login canonical 8/8 PASS.

## Top priorities (S24 — residuo ~3-5 FTE-day reali)

1. **`[HIGH]` P4 sweep extended** (~1-2 FTE-day) — applicare `auditedTransaction()` ai write Prisma rimanenti (users.ts CRUD, employees, candidates, performance-reviews) + creare mirror helper in `services/api-gateway/src/lib/audit/`. Template: `services/app/src/lib/audit/auditedTransaction.ts`. Ref `docs/_audit/2026-05-09-forensic-db-audit.md` § 8.4.
2. **`[MEDIUM]` § 2.5 GUC drift workspaces** (~1-2 FTE-day) — refactor RLS multi-clausola `user_workspaces`/`workspace_widgets`. Decision tree: estendere `withTenant()` multi-GUC vs semplificare policy. Pre-flight QA Playwright RBP matrix.
3. **`[MEDIUM]` § 1.5 310 FK ON DELETE explicit** (~1 FTE-day) — review puntuale per dominio (HR/payroll/dashboards/audit/SAP). Audit § 1.5.

## Open questions

- P4 sweep: `auditedTransaction()` hard-fail (throw) o soft-fail (`auditEvent()` warn) sui legacy paths con session.user incomplete?
- § 2.5 GUC drift: refactor policy single-GUC `app.current_tenant_id` o estendere `withTenant()` con `app.user_id`+`app.role`?
- § 1.8 pg_cron: install extension via `apt-get install postgresql-16-cron` (require sudo + restart) o systemd timer fallback chiamando `psql -c "SELECT public.refresh_all_mat_views()"` (helper pronto)?

## Stack snapshot (changed this session)

- DBMS: 312 tenant_id NOT NULL (era 291) · 367 RLS policies (era 330) · 11 SQL migrations phase16a-k · `refresh_all_mat_views()` function
- Code: NEW `services/app/src/lib/audit/auditedTransaction.ts` + tests · MODIFIED `authorize.ts` (bcrypt rotation) · MODIFIED `services/enrichment/src/{types/job.ts,handlers/esco-match.ts}` (consent) · MODIFIED `services/{api-gateway,app}/src/(db/pool|lib/db).ts` (set_config parametrized) · NEW `scripts/hardening/lint-tenant-id.sh` + npm aliases
- Prisma schema sync: rbac_role 8 canonical · widget_catalog @relation removed
- Tests: 860 verdi (219 app + 457 api-gateway + 7 enrichment + 95 ui + 82 shared)

## Verification

```bash
git log --oneline -6
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"SELECT count(*) FROM information_schema.columns WHERE column_name='tenant_id' AND is_nullable='NO';\""  # expected 312
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# expected: "verification: 8/8 pass"
cd D:/evo.heuresys.com && npm run lint:tenant-id  # expected exit 0
```

Riferimenti: `docs/_audit/2026-05-09-forensic-db-audit.md` § "S23-tris additional closures" · `.ux-design/DECISIONS-LOG.md` § L54+L55+L56+L57 · `.ux-design/BRAND-STATE.md` Phase 15.F · `~/.claude/plans/superpowers-per-eseguire-tutto-eventual-sunset.md`
