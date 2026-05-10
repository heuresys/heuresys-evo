# heuresys-evo — Current State (S24 handoff)

> Updated: 2026-05-10T02:05Z · S23-quater closed · audit forensic L53 closure rate **77%** (17/22 issues)
>
> 4 commit pushed sequenziali su forensic audit L53:
> `929aa1e` (S23 · L54) → `05e603b` (S23-bis · L55) → `8129451` (S23-tris · L56) → `8a98486` (S23-quater · L57)

## Last session brief (S23 + S23-bis + S23-tris + S23-quater)

Total ~17h focus su forensic DB audit L53 cleanup. Bilancio: **17 issues CLOSED · 1 PARTIAL · 3 DELIBERATE OUT-OF-SCOPE · 1 audit miscount confirmed**. 11 SQL migrations applied bare-metal (phase16a-k). 312 tabelle tenant_id NOT NULL (era 291). 367 RLS policies (era 330). 0 GUC typo. 0 trigger broken. FK `fk_users_role` attiva. 8 canonical `rbac_role` enum. Helper `auditedTransaction()`+`auditEvent()` shipped + 2 brand-studio actions instrumented. bcrypt rotation auto-rehash al login. enrichment_consent GDPR enforcement. `npm run lint:tenant-id` disponibile. 683 vitest verdi (219 app + 457 api-gateway + 7 enrichment) + 95 ui + 82 shared = 860 totali. Login canonical 8/8 PASS.

## Top priorities S24 (residuo ~3-5 FTE-day reali)

### Priority 1 — `[HIGH]` P4 sweep extended Prisma writes

**Goal**: applicare `auditedTransaction()` ai write paths Prisma rimanenti + creare mirror helper in api-gateway.

**Files da toccare**:
- NEW `services/api-gateway/src/lib/audit/auditedTransaction.ts` (mirror del helper services/app, stesso pattern di `withTenant()` duplicato)
- NEW `services/api-gateway/src/lib/audit/__tests__/auditedTransaction.test.ts` (mirror dei 5 test)
- `services/api-gateway/src/routes/users.ts:286,500,585,591` (POST/PATCH/DELETE/soft-delete) — aggiungere `await auditedTransaction(...)` wrapping
- `services/api-gateway/src/routes/employees.ts` — write paths (POST/PATCH/DELETE)
- `services/api-gateway/src/routes/candidates.ts` — write paths
- `services/api-gateway/src/routes/performance-reviews.ts` — write paths
- `services/app/src/app/(app)/admin/rbac/` — eventuali server actions

**Pattern**:
```typescript
const session = readSession(req);
const actor = {
  tenantId: session.user?.tenantId ?? '',
  userId: session.user?.id ?? '',
  userEmail: session.user?.email ?? null,
  userRole: session.user?.role ?? null,
};
const { result, auditId } = await auditedTransaction(actor, {
  action: 'CREATE',
  category: 'USER',
  resourceType: 'users',
  resourceId: created.id,
  resourceName: created.username,
  description: `User ${body.username} created`,
  newValue: { username: created.username, role: created.role },
  metadata: { route: '/users POST' },
}, async (tx) => tx.users.create({ data: ... }));
```

**Stima**: ~1-2 FTE-day. Verifica: `npm run lint:tenant-id` + 853 test verdi + check `audit_logs` ultimi 30d count cresce.

**Riferimenti**: `services/app/src/lib/audit/auditedTransaction.ts` (template) · `docs/_audit/2026-05-09-forensic-db-audit.md` § 8.4

---

### Priority 2 — `[MEDIUM]` § 2.5 GUC drift `user_workspaces`/`workspace_widgets`

**Goal**: refactor RLS multi-clausola che usa convenzione GUC custom (`app.user_id`, `app.role`, `app.tenant_id`) → allineare a `app.current_tenant_id` standard.

**Tabelle**:
- `user_workspaces` (RLS policy `user_workspaces_isolation`)
- `workspace_widgets` (RLS policy `workspace_widgets_isolation` con subquery user_workspaces)

**Logica corrente** (audit § 2.5):
```sql
USING (
  user_id = current_setting('app.user_id')::uuid
  OR current_setting('app.role') = 'SUPERUSER'
  OR (tenant_id = current_setting('app.tenant_id')::uuid
      AND current_setting('app.role') IN ('TENANT_OWNER', 'IT_ADMIN'))
)
```

**Strategia migration**:
1. Estendere `withTenant()` per impostare anche `app.user_id` e `app.role` quando disponibili (services/api-gateway/src/db/pool.ts + services/app/src/lib/db.ts)
2. Test scenario user/role/tenant matrix via Playwright (RBP matrix esistente come baseline)
3. Decisione: refactor policy multi-clausola single-GUC vs estendere withTenant() multi-GUC

**Stima**: 1-2 FTE-day. Risk: rompe `/me/workspace` feature. Pre-flight QA Playwright.

**Riferimenti**: `services/api-gateway/src/db/pool.ts:53-62` · `services/app/src/lib/db.ts:41-50`

---

### Priority 3 — `[MEDIUM]` § 1.5 310 FK senza ON DELETE explicit

**Goal**: review puntuale ognuna delle 310 FK con `delete_rule = NO ACTION`, decidere semantica esplicita (CASCADE / RESTRICT / SET NULL) per ognuna.

**Setup**:
```sql
SELECT conname, conrelid::regclass, confrelid::regclass, confdeltype
FROM pg_constraint
WHERE contype = 'f' AND confdeltype = 'a'  -- a = NO ACTION default
ORDER BY conrelid::regclass::text;
```

**Strategia**: split per dominio (HR / payroll / dashboards / audit / SAP shadow). Per ogni dominio decidere policy default. Esempio:
- `audit_logs.*` FK → RESTRICT (mai cancellare audit trail)
- `dashboard_elements.dashboard_preset_id` → CASCADE (già è)
- `employees.tenant_id` → CASCADE
- SAP shadow tables → SET NULL (data integrity loose)

**Stima**: 1 FTE-day (~30 FK/h analisi semantica). NO migration mass — explicit per FK.

**Riferimenti**: `docs/_audit/2026-05-09-forensic-db-audit.md` § 1.5

---

### Priority 4 — `[INFRA]` § 1.8 pg_cron extension setup + schedule

**Goal**: setup pg_cron extension su VM oracle-vm-default + cron.schedule entries per `refresh_all_mat_views()`.

**Helper già pronto**: `public.refresh_all_mat_views()` SQL function (phase16k applied bare-metal). Manca solo lo scheduler.

**Setup steps su VM** (require root sudo):
```bash
ssh oracle-vm-default
sudo apt-get install -y postgresql-16-cron
# Edit /etc/postgresql/16/main/postgresql.conf:
#   shared_preload_libraries = 'pg_cron'
#   cron.database_name = 'heuresys_platform'
sudo systemctl restart postgresql
sudo -u postgres psql -d heuresys_platform -c "CREATE EXTENSION pg_cron;"
sudo -u postgres psql -d heuresys_platform -c "
  SELECT cron.schedule('refresh-mat-views-hourly', '0 */4 * * *',
    'SELECT public.refresh_all_mat_views()');"
```

**Fallback senza pg_cron** (se l'install fallisce o policy aziendale): systemd timer chiama `psql -c "SELECT public.refresh_all_mat_views()"`.

**Stima**: 2-4 FTE-hour (devops + test refresh durations).

**Riferimenti**: `db/seeds/phase16k_mat_views_refresh_helper.sql`

---

## Open questions (da decidere prima di iniziare)

- **P4 sweep #3**: `auditedTransaction()` come hard-fail (throw if missing actor) o soft-fail (`auditEvent()` con warn log)? Helper supporta entrambi. Decision: hard-fail per write critici (users, employees, audit_logs), soft-fail per write batch/cron-driven legacy.
- **§ 2.5 GUC drift**: refactor RLS o estendere `withTenant()`? Quest'ultima è meno invasiva ma duplica state setting (più costoso). Decision tree: testare entrambi su replica staging prima di prod.
- **§ 1.5 ON DELETE batch**: applicare in 1 mega-migration phase17 o split per dominio (phase17a HR / phase17b payroll / etc.)? Split per dominio safer.

## Stack snapshot post-S23-quater

- **DBMS**: 312 tabelle tenant_id NOT NULL · 104 Platform-default · 367 RLS policies · FK `fk_users_role` · 8 canonical `rbac_role` enum · widget_catalog FK dropped · `refresh_all_mat_views()` function · 0 trigger broken · 0 GUC typo
- **35 tabelle** precedentemente unprotected ora hanno tenant_id+RLS (combo S23 pilot 6 + S23-tris batch 24 + S23-quater residue 3 + Platform-default 4 = 37 totali)
- **11 SQL migrations bare-metal**: `db/seeds/phase16{a,b,c,d,e,f,g,h,i,j,k}_*.sql`
- **Code**:
  - NEW `services/app/src/lib/audit/auditedTransaction.ts` + tests (5/5)
  - MODIFIED `services/app/src/lib/authorize.ts` (bcrypt rotation, 12/12 test)
  - MODIFIED `services/enrichment/src/{types/job.ts,handlers/esco-match.ts}` (consent, 7/7)
  - MODIFIED `services/{api-gateway,app}/src/(db/pool|lib/db).ts` (set_config parametrize)
  - MODIFIED `services/{app,api-gateway}/prisma/schema.prisma` (rbac_role 8 canonical + widget_catalog @relation removed)
  - NEW `scripts/hardening/lint-tenant-id.sh` + npm aliases
  - 11 `// SAFE:` annotations applicate ai false positives lint
- **Tests**: 860 totali verdi (219 app + 457 api-gateway + 7 enrichment + 95 ui + 82 shared)
- **Login canonical**: 8/8 bcrypt PASS post-S23-quater
- **Docs**: CLAUDE.md S23-quater · DECISIONS-LOG L54+L55+L56+L57 · BRAND-STATE.md Phase 15.F · audit md S23-tris closures · db/README.md SAP+migrations advisory

## Verifica baseline (eseguire prima di iniziare S24)

```bash
# 1. git in sync
git log --oneline -5
git status -sb  # expected: clean, in sync con origin/main

# 2. DB invariants
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -tAc \"
  SELECT 'tenant_protected=' || count(*) FROM information_schema.columns WHERE column_name='tenant_id' AND is_nullable='NO';  -- expected 312
  SELECT 'rls_policies=' || count(*) FROM pg_policies WHERE schemaname='public';  -- expected 367
  SELECT 'broken_triggers=' || count(*) FROM pg_trigger WHERE NOT tgisinternal AND tgname IN ('trg_audit_role_permissions','trg_audit_employee_permission_overrides');  -- expected 0
  SELECT 'mat_views_helper=' || count(*) FROM pg_proc WHERE proname='refresh_all_mat_views';  -- expected 1
  SELECT 'fk_users_role=' || count(*) FROM pg_constraint WHERE conname='fk_users_role';  -- expected 1
  SELECT 'enum_values=' || string_agg(enumlabel, ',' ORDER BY enumsortorder) FROM pg_enum WHERE enumtypid='rbac_role'::regtype;
  -- expected SUPERUSER,TENANT_OWNER,IT_ADMIN,HR_DIRECTOR,HR_MANAGER,DEPT_HEAD,LINE_MANAGER,EMPLOYEE
\""

# 3. Login canonical regression
ssh oracle-vm-default "cd ~/heuresys-evo/services/app && DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' node ../../scripts/db/apply-canonical-users.mjs"
# Expected: "verification: 8/8 pass"

# 4. Code health
cd D:/evo.heuresys.com && npm run lint:tenant-id  # Expected: exit 0
cd services/app && npx tsc --noEmit && npm test --silent  # Expected: 219/219 verdi
cd D:/evo.heuresys.com && npm test --workspace=services/api-gateway --silent  # Expected: 457/457
cd D:/evo.heuresys.com && npm test --workspace=services/enrichment --silent  # Expected: 7/7
cd D:/evo.heuresys.com && npm test --workspace=packages/ui --silent  # Expected: 95/95
cd D:/evo.heuresys.com && npm test --workspace=packages/shared --silent  # Expected: 82/82
```

## Carry-forward S25+ (architectural debt, S26+ trigger condition)

- **§ 1.2** `employees` 95 col / 19 idx vertical-split (PII vs HR vs payroll) — trigger threshold a >100k rows (attualmente 270)
- **production `/dashboard` refactor DB-driven** (~6-10h) — carry-forward S20+S21+S22
- **WCAG 2.2 AAA full audit** (~3-5h) — carry-forward
- **API gateway cross-service JWT fix** (~2-3h) — `services/api-gateway/src/auth.ts` `jose` library NextAuth v4 ↔ Auth.js v5 JWE decode
- **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — pre-flight checks per 8 categorie asset, ref `.ux-design/08-promotion/v1.0-checklist.md`

## Riferimenti chiave

- **Audit baseline**: `docs/_audit/2026-05-09-forensic-db-audit.md` (con annotation S23-tris+S23-quater)
- **Decisions log**: `.ux-design/DECISIONS-LOG.md` § L54+L55+L56+L57 (full closure narrative)
- **Plan canonical**: `~/.claude/plans/superpowers-per-eseguire-tutto-eventual-sunset.md`
- **Brand state**: `.ux-design/BRAND-STATE.md` Phase 15.F entry
- **CLAUDE.md**: stato attuale + S24 priorities top-3
- **SQL migrations applicate**: `db/seeds/phase16{a,b,c,d,e,f,g,h,i,j,k}_*.sql`
- **Helper P4**: `services/app/src/lib/audit/auditedTransaction.ts` + `__tests__/`
- **Lint rule**: `scripts/hardening/lint-tenant-id.sh` + `npm run lint:tenant-id`

## Quick start S24 (priority 1: P4 sweep)

```bash
# 1. Baseline check (above)
# 2. Create mirror in api-gateway
cp services/app/src/lib/audit/auditedTransaction.ts services/api-gateway/src/lib/audit/auditedTransaction.ts
# Edit imports: '@/lib/db' -> '../../db/pool.js'
# Adapt prisma type to api-gateway prisma client
# Mirror tests in services/api-gateway/src/lib/audit/__tests__/
# 3. Apply helper to users.ts POST/PATCH/DELETE
# 4. Run npm test --workspace=services/api-gateway
# 5. Run npm run lint:tenant-id
# 6. Commit & push direct main
```
