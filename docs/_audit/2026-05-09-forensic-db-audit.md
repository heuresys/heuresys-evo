# Forensic DB Audit — `heuresys_platform`

> **Generated**: 2026-05-09 · subagent `database-admin` (Claude Code) · post-S22 (L50/L51/L52) consistency alignment
>
> Read-only audit. Zero modifiche al DB o al codice. Output destinato a roadmap S23+.

**Database**: PostgreSQL 16.13 on Ubuntu aarch64 · `oracle-vm-default:5432` · bare-metal · `heuresys_platform`

---

## Executive summary

DB maturo multi-tenant: **570 base tables · 905 FK · 2297 indici · 330 RLS policies · 396 funzioni · 354 trigger**. Invarianti P1/P5/P9/P10 largamente rispettati: 100% RLS coverage sulle 291 tabelle tenant-scoped, RBP layer data-driven completo (8 ruoli × 34 functional areas = 179 perm rows), 18 dashboard presets / 115 elements / 16 role mappings.

**5 critical / 7 high-severity issues** identificati. Il più grave: una classe sistematica di tabelle che contengono dati sensibili employee-scoped **senza colonna `tenant_id` né RLS** (employee*certifications, employee_skill_assessments, employee_pay_stubs, mentorship_sessions, merit_recommendations, interviews, applications, whistleblowing*\*). Cross-tenant leak prevented oggi solo dal join app-level via `employee_id → employees.tenant_id` — fragile, viola defense-in-depth promessa di P5.

Altri findings notevoli: 13 RLS policies referenziano un GUC sbagliato (`app.current_tenant` vs corretto `app.current_tenant_id`); `widget_catalog_id` è NULL su 100% dei `dashboard_elements`; 310 FK senza clausola ON DELETE esplicita; api-gateway usa `$queryRawUnsafe` ma con argomenti parametrizzati (P6 OK in spot-check).

---

## Section 1 — Schema inventory

### 1.1 Object counts

| Object             | Count |
| ------------------ | ----- |
| Base tables        | 570   |
| Regular views      | 117   |
| Materialized views | 5     |
| Enums              | 8     |
| Functions          | 396   |
| Aggregates         | 4     |
| Procedures         | 0     |
| Triggers           | 354   |
| Foreign keys       | 905   |
| Indexes            | 2297  |
| Domains            | 0     |
| RLS policies       | 330   |

### 1.2 Tabelle con > 50 colonne (potenziale bloat)

| Table                 | Cols | Severity                                                                |
| --------------------- | ---- | ----------------------------------------------------------------------- |
| `employees`           | 95   | `[MEDIUM]` central entity, valuta vertical-split (PII vs HR vs payroll) |
| `employees_staging`   | 68   | `[LOW]` staging SAP, expected width                                     |
| `performance_reviews` | 52   | `[LOW]` review framework                                                |
| `payroll_export_jobs` | 51   | `[LOW]` export metadata                                                 |

### 1.3 Tabelle senza primary key

50 tabelle, **tutte SAP HCM shadow / staging** (`pa0000…pa2013`, `pb0001…pb4005`, `hrp1000…hrp5002`, `t001p…t771q`, `pcl1`, `pcl2`, `ext_pa*`, `ext_pb*`).

`[INFO]` Accettabile — mirror cluster SAP (pcl1/pcl2) e infotypes HR senza synthetic key all'origine. Read-mostly via composite key SAP (PERNR + INFOTYP + ENDDA).

### 1.4 Tabelle con > 10 indici

`employees` (19), `performance_reviews` (13), `employees_staging` (12), `employee_skill_profiles` (12), `job_templates` (12), `employee_documents` (11), `goals` (11).

`[MEDIUM]` `employees` con 19 indici su 270 righe — review redundancy a > 100k righe.

### 1.5 FK delete rules

| Rule        | Count |
| ----------- | ----- |
| `CASCADE`   | 460   |
| `NO ACTION` | 310   |
| `SET NULL`  | 125   |
| `RESTRICT`  | 10    |

`[MEDIUM]` 310 FK senza ON DELETE esplicito. È default Postgres ma rende deletion implicite. Tag esplicito (RESTRICT/CASCADE/SET NULL) per chiarezza.

### 1.6 FK senza indice sulla colonna referente

| Table                   | Column              |
| ----------------------- | ------------------- |
| `dashboard_elements`    | `widget_catalog_id` |
| `tenant_schema_version` | `applied_by`        |
| `account` (NextAuth)    | `userId`            |
| `session` (NextAuth)    | `userId`            |

`[LOW]` Aggiungi indici quando le tabelle crescono.

### 1.7 Enums (8) — drift detected

`[HIGH]` **`rbac_role` enum drift**: contiene `SYSADMIN` e `TENANT_ADMIN` che NON esistono in `rbp_roles` (canonical: SUPERUSER / TENANT_OWNER / IT_ADMIN / HR_DIRECTOR / HR_MANAGER / DEPT_HEAD / LINE_MANAGER / EMPLOYEE). L'enum non è usato da `users.role` (varchar). Drop o allinea.

### 1.8 Materialized views (5)

`mv_cross_tenant_rollup`, `mv_tenant_owner_rollup`, `mv_occupation_similarity` (69182 rows), `mv_talent_signals`, `mv_employee_performance_context`.

`[INFO]` Nessun refresh automatico osservato in DB. Verifica pg_cron / app-side.

### 1.9 Triggers (354)

UPDATE 328 · INSERT 21 · DELETE 5. 6 trigger esplicitamente `*audit*` (P4). I 328 UPDATE suggeriscono `updated_at` auto-bump pattern.

---

## Section 2 — Multi-tenant integrity

### 2.1 `tenant_id` coverage

| Metric                                                  | Count          |
| ------------------------------------------------------- | -------------- |
| Base tables con `tenant_id`                             | **291**        |
| Base tables con `tenant_id` + FK a `tenants(id)`        | **291 (100%)** |
| Base tables con `tenant_id` NULLABLE (Platform-default) | 12             |
| Base tables con `tenant_id` + RLS enabled               | **291 (100%)** |

Eccellente: 100% FK + RLS su tutte le tabelle tenant_id-aware.

### 2.2 Tabelle Platform-default (P10 OK)

12 tabelle con `tenant_id` NULLABLE: `admin_component_registry`, `ai_prompt_templates`, `dashboard_elements`, `enrichment_*` (4), `rbp_field_classifications`, `rbp_section_translations`, `rbp_sections`, `role_default_dashboards`, `workspace_templates`. Tutte usano correttamente l'idiom `tenant_id IS NULL OR tenant_id = current_setting(...)`. ✓

### 2.3 `[CRITICAL]` Tabelle senza `tenant_id` né RLS — defense-in-depth gap

**Classe di tabelle con dati sensibili employee-scoped**, accesso tenant solo via join `employee_id → employees.tenant_id`:

| Table                                                                                                                                                                              | Verified rows       | Severity                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------------------------------- |
| `employee_certifications`                                                                                                                                                          | 729 × 258 employees | `[CRITICAL]`                              |
| `employee_skill_assessments`                                                                                                                                                       | 480 × 191 employees | `[CRITICAL]`                              |
| `employee_pay_stubs`                                                                                                                                                               | —                   | `[CRITICAL]` (payroll PII)                |
| `merit_recommendations`                                                                                                                                                            | —                   | `[CRITICAL]` (compensation)               |
| `bonus_allocations`                                                                                                                                                                | —                   | `[CRITICAL]`                              |
| `salary_band_assignments`                                                                                                                                                          | —                   | `[CRITICAL]`                              |
| `employee_kpi_targets`, `employee_career_paths`, `employee_occupations`, `employee_job_assignments`, `employee_benefit_enrollments`, `employee_skill_history`, `employee_requests` | —                   | `[CRITICAL]`                              |
| `whistleblowing_attachments`, `whistleblowing_audit_log`, `whistleblowing_messages`                                                                                                | —                   | `[CRITICAL]` (highest sensitivity)        |
| `mentorship_sessions`, `interview_feedback`, `feedback_responses`                                                                                                                  | —                   | `[HIGH]`                                  |
| `interviews`, `applications`, `internal_applications`, `internal_job_*`                                                                                                            | —                   | `[HIGH]`                                  |
| `course_modules`, `learning_path_courses`, `learning_bookmarks`, `learning_ratings`, `learning_recommendations`, `module_completions`                                              | —                   | `[HIGH]`                                  |
| `survey_questions`, `survey_responses`                                                                                                                                             | —                   | `[HIGH]`                                  |
| `succession_candidates`, `calibration_discussions`, `nine_box_grid`                                                                                                                | —                   | `[HIGH]`                                  |
| `prediction_actions`, `prediction_factors`                                                                                                                                         | —                   | `[HIGH]` (ML su workforce)                |
| `signature_recipients`, `recruiting_*`, `report_executions`, `report_schedules`                                                                                                    | —                   | `[HIGH]`                                  |
| `tenant_job_kpis`, `tenant_job_skills`, `tenant_job_tasks`, `tenant_org_units`, `tenant_sap_mapping`, `tenant_skill_dimensions`                                                    | —                   | `[HIGH]` (nome tenant ma colonna assente) |
| `user_pernr_mapping`, `social_*`, `club_*`, `onboarding_*`, `preboarding_*`, `attendance_records`                                                                                  | —                   | `[HIGH]/[MEDIUM]`                         |

**Recommendation**: Phase 14.X migration → `ALTER TABLE … ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id)` + backfill da employees/candidates + RLS standard. Estimate **4-6 FTE-day**, ~30+ tabelle.

### 2.4 RLS policy quality — `[CRITICAL]` GUC typo bug

| Metric                                           | Count  |
| ------------------------------------------------ | ------ |
| Policies su GUC corretto `app.current_tenant_id` | 290    |
| Policies su GUC sbagliato `app.current_tenant`   | **13** |

**13 policies usano il GUC SBAGLIATO** (`app.current_tenant` invece di `app.current_tenant_id`):
`analytics_aggregations`, `analytics_events`, `dashboard_widgets`, `dashboards`, `export_configurations`, `export_jobs`, `model_predictions`, `performance_predictions`, `predictive_models`, `report_delivery_log`, `report_subscriptions`, `turnover_risk_scores`, `widget_templates`.

L'app chiama `SET LOCAL app.current_tenant_id = ...` (vedi `services/{api-gateway,app}/src/lib/db.ts withTenant()`). Queste 13 policies leggono `current_setting('app.current_tenant', true)` → NULL → comparison `tenant_id = NULL::uuid` → NULL → row filter return ZERO ROWS. **Tutte le query contro queste 13 tabelle ritornano 0 righe sotto RLS context** (fail-closed by accident, ma maschera feature downstream).

Fix: 13-line ALTER POLICY migration. Estimate **1 FTE-hour**.

### 2.5 RLS GUC convention drift

`user_workspaces` e `workspace_widgets` usano convenzione GUC diversa (`app.user_id`, `app.role`, `app.tenant_id`) vs standard (`app.current_tenant_id`). `[MEDIUM]` Verifica che app set BOTH oppure normalizza.

---

## Section 3 — RBP data-driven check

### 3.1 Counts vs docs

| Object                      | Counted | Docs say        | Verdict                                 |
| --------------------------- | ------- | --------------- | --------------------------------------- |
| `rbp_functional_areas`      | **34**  | ~33             | OK (drift +1: ENRICHMENT)               |
| `rbp_role_permissions` rows | **179** | "326 RBP joins" | `[HIGH]` mismatch — actual 179, doc 326 |
| `rbp_roles`                 | 8       | 8               | OK                                      |

### 3.2 Functional areas (34)

PERSPECTIVES, PLATFORM_NAVIGATOR, WORKSPACE, PLATFORM, SECURITY, CORE_HR, TALENT, PERFORMANCE, COMPENSATION, TIME_ATTENDANCE, LEARNING, RECRUITMENT, CAREER, ANALYTICS, COMPANY_ANALYTICS, WORKFORCE_INTELLIGENCE, ORGANIZATION, TEAMS, ENGAGEMENT, COMPLIANCE, AI_SERVICES, MARKETPLACE, SELF_SERVICE, PROCESS_MANAGEMENT, KNOWLEDGE_GRAPH, SEMANTIC_SEARCH, DATA_INTEGRATION, NOTIFICATIONS, SYSTEM_OPS, PUBLIC_API, BENCHMARKING, AI_QUALITY, DESIGN_TOOLS, ENRICHMENT.

### 3.3 8 canonical roles — coverage

| Role         | level | perm rows | distinct areas |
| ------------ | ----- | --------- | -------------- |
| SUPERUSER    | -1    | 18        | 18             |
| TENANT_OWNER | 0     | 32        | 32             |
| IT_ADMIN     | 1     | 23        | 23             |
| HR_DIRECTOR  | 2     | 29        | 29             |
| HR_MANAGER   | 3     | 24        | 24             |
| DEPT_HEAD    | 4     | 20        | 20             |
| LINE_MANAGER | 5     | 16        | 16             |
| EMPLOYEE     | 6     | 17        | 17             |

Totale 179. Tutti gli 8 ruoli popolati. ✓

### 3.4 `users.role` constraint

`[HIGH]` `users.role` è `varchar` non constrained — no FK a `rbp_roles.code`, no CHECK. Permette ruoli arbitrari. Fix: aggiungi FK constraint dopo verifica dati esistenti (1 FTE-hour).

---

## Section 4 — Migration history

### 4.1 Tabella migrations

DB usa `schema_migrations` custom (NON Prisma `_prisma_migrations`). 215 entries. Latest 4: `223_fk_indexes_tdr009` (2026-04-29), `222_nextauth_tables` (2026-04-27), `221`, `220`.

### 4.2 Filesystem

`db/migrations/` 8 file · `db/seeds/` 25 file · `db/baseline/` 2 dump.

### 4.3 `[MEDIUM]` Drift verdict

215 `schema_migrations` entries vs 8 `.sql` files in repo = ~207 migration applicate ma non replicabili. Coerente con SoT promotion ADR-0023 (baseline reset 2026-05-07 + forward-only deltas) ma da documentare in `db/migrations/README.md`.

`prisma migrate status` non eseguibile (no `_prisma_migrations`). Prisma in `db pull/push` mode contro schema manualmente gestito.

---

## Section 5 — Data-driven populated objects (P9)

### 5.1 Tenants (4 ✓)

| code      | name             | status |
| --------- | ---------------- | ------ |
| econova   | EcoNova          | active |
| heuresys  | Heuresys System  | active |
| rtl-bank  | RTL Bank         | active |
| smartfood | SmartFood S.r.l. | active |

### 5.2 Dashboard presets (18, 11 v1 + 7 v2)

11 v1 + 7 v2 = 18 totali. 4 process\_\* mancano del v2 (out-of-scope L46/L47).

### 5.3 Dashboard elements (115)

| Metric                        | Value             |
| ----------------------------- | ----------------- |
| Total                         | 115               |
| Top-level (parent NULL)       | 59                |
| Children (composite)          | 56                |
| `widget_code` populated       | 115/115 (100%)    |
| `widget_catalog_id` populated | **0/115 (0%)** ⚠️ |

`[HIGH]` `widget_catalog_id` NULL su tutti i 115 elementi. Decommissiona FK o backfill da `widget_code → widget_catalog.code`.

CLAUDE.md dice "30 dashboard_elements" — stale, post-L46/L47 sono 115.

### 5.4 Role default dashboards (16 ✓)

8 primary @ priority=0 + 8 process secondary (HR_DIRECTOR + HR_MANAGER × 4 process). Matches L49 ADR.

### 5.5 Canonical demo users (8 ✓)

Matches CLAUDE.md L50 alignment. 1 SUPERUSER + 7 RTL Bank email-format.

### 5.6 Other volumes

| Table                      | Rows                                                        |
| -------------------------- | ----------------------------------------------------------- |
| `employees`                | 270 (econova 26 · heuresys 4 · rtl-bank 158 · smartfood 82) |
| `users`                    | 274 (265 active + 9 inactive)                               |
| `audit_logs`               | 334                                                         |
| `esco_skills`              | 14011                                                       |
| `mv_occupation_similarity` | 69182                                                       |
| `job_template_skills`      | 28983                                                       |
| `skill_adjacencies`        | 11634                                                       |

---

## Section 6 — Routes & endpoints

### 6.1 Express api-gateway

| Metric                              | Value                        |
| ----------------------------------- | ---------------------------- |
| Route files                         | 35 + auth.ts                 |
| HTTP route declarations             | ~250 source · ~310 incl test |
| Files con `requirePermission` (P3)  | **6 / 36** ⚠️                |
| Files con `$queryRaw`/`$executeRaw` | 35+                          |
| `$queryRawUnsafe` direct            | 4 file (parametrizzati)      |

`[HIGH]` Solo 6 di 36 route files usano `requirePermission`. Audit su altri 30: P3 gap o middleware alternativo? Estimate 1 FTE-day audit.

`[MEDIUM]` 276 occurrences `$queryRaw*` su 58 file. `$queryRaw` template literal è parametrizzato (safe). `withTenant()` wrapper usa `$executeRawUnsafe` con `tenantId.replace(/'/g, "''")` — accettabile per UUID, defense-in-depth: usa parametro `$1`.

### 6.2 Next.js app router

| Metric                          | Value                                   |
| ------------------------------- | --------------------------------------- |
| `page.tsx` files                | 27 (24 protected + 3 public)            |
| `route.ts` API handlers         | 7                                       |
| Server actions (`'use server'`) | 1 file (brand-studio)                   |
| Pages auth-gated                | 24/24 via `(app)/layout.tsx` ✓          |
| API handlers chiamano `auth()`  | 6/7 (eccetto NextAuth handler stesso) ✓ |

---

## Section 7 — Query patterns & risks

### 7.1 Raw SQL

| Pattern              | Occ                      | Sev          |
| -------------------- | ------------------------ | ------------ |
| `$queryRaw` (tagged) | bulk                     | safe         |
| `$queryRawUnsafe`    | 4 file                   | parametrized |
| `$executeRawUnsafe`  | 2 file (`SET LOCAL` GUC) | acceptable   |

### 7.2 P1 violations spot-check

`prisma.X.findMany` calls senza filtro `tenant_id` esplicito: numerosi (rely su RLS via `withTenant()`). Esempi:

| Location                                                      | tenant_id filter?                       |
| ------------------------------------------------------------- | --------------------------------------- |
| `services/api-gateway/src/routes/users.ts:345,683`            | NO (RLS-protected)                      |
| `services/app/src/lib/dashboard-views/org-systems-data.ts:86` | NO (intentional SUPERUSER cross-tenant) |
| `services/app/src/app/(app)/employees/page.tsx:15`            | NO (relies on `withTenant()` wrapper)   |

`[HIGH]` Verifica che ogni `prisma.X.findMany` non platform-scope sia dentro `withTenant()` block. Se GUC NULL → RLS fail-closed (zero rows) ma maschera bug. Lint rule + pre-commit grep raccomandato.

### 7.3 N+1

`.map(async ...)` outside Promise.all: solo 1 file (`services/app/src/lib/dashboard-engine/prefetch.ts`). Verifica usi `Promise.all`. Single occurrence low risk.

---

## Section 8 — Security baseline

### 8.1 Password hashes

| Metric                     | Value      |
| -------------------------- | ---------- |
| Total users                | 274        |
| Active                     | 265        |
| password_hash NULL/empty   | **0** ✓    |
| bcrypt cost 12 (`$2b$12$`) | **9**      |
| Any bcrypt format          | 265 (100%) |

`[MEDIUM]` Solo 9 user con cost 12 (canonical 8 + sysadmin). 256 con cost <12 (probabilmente cost 10 default bcryptjs). Schedule rotation ciclo o one-shot rehash al next login.

### 8.2 Admin-equivalent active

Solo 2 active users con SUPERUSER/TENANT_OWNER:

- `sysadmin` (SUPERUSER)
- `federica.marchetti@rtl-bank.org` (TENANT_OWNER)

Entrambi canonical. ✓ No rogue admin.

### 8.3 Active by role

| role         | count |
| ------------ | ----- |
| SUPERUSER    | 1     |
| TENANT_OWNER | 1     |
| IT_ADMIN     | 1     |
| HR_DIRECTOR  | 1     |
| HR_MANAGER   | 1     |
| DEPT_HEAD    | 4     |
| LINE_MANAGER | 1     |
| EMPLOYEE     | 255   |

`[INFO]` 4 DEPT_HEAD vs 1 expected da canonical — likely org-chart-derived seeds.

### 8.4 Audit logs

| Metric     | Value    |
| ---------- | -------- |
| Total      | 334      |
| Last 30d   | **6** ⚠️ |
| Successful | 317      |
| Failed     | 17       |

`[HIGH]` Solo 6 audit_logs ultimi 30 giorni. Per sistema con 265 active users + Phase 14.SH/15.A active dev: troppo basso. P4 enforcement gap probabile (auditedTransaction missing su writes). 4 di 5 latest hanno user_id NULL → P4 violation (actor must be captured).

Audit categorie 30d: AUTH 1 · CONFIG 4 · USER 1. Mancano: DASHBOARD, ROLE, TENANT, EMPLOYEE.

### 8.5 Enrichment consent

| tenant    | total | consent=true | =false | NULL |
| --------- | ----- | ------------ | ------ | ---- |
| econova   | 26    | 0            | 26     | 0    |
| heuresys  | 4     | 0            | 4      | 0    |
| rtl-bank  | 158   | 0            | 158    | 0    |
| smartfood | 82    | 0            | 82     | 0    |

`[MEDIUM]` 0 employees con consent=true (270/270 false). GDPR-compliant default OK, ma verifica enrichment workers skip non-consenting.

---

## Top 10 issues — priority-ordered

| #   | Sev          | Issue                                                                                                                                                       | Estimate                          |
| --- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1   | `[CRITICAL]` | ~30+ tabelle employee/whistleblowing/payroll senza `tenant_id` né RLS. Fix: ADD COLUMN tenant_id NOT NULL FK + backfill + RLS policy                        | **4-6 FTE-day**                   |
| 2   | `[CRITICAL]` | 13 RLS policies usano GUC sbagliato `app.current_tenant` vs corretto `app.current_tenant_id`. Fail-closed (zero rows) ma rompe analytics/reporting features | **1 FTE-hour**                    |
| 3   | `[HIGH]`     | Audit logs sparse (6 entries / 30d, 4/5 con NULL actor). P4 gap: writes bypassano `auditedTransaction()`                                                    | **1-2 FTE-day**                   |
| 4   | `[HIGH]`     | `users.role` varchar unconstrained. Fix: FK a `rbp_roles(code)`                                                                                             | **1 FTE-hour**                    |
| 5   | `[HIGH]`     | `widget_catalog_id` NULL su 100% dei dashboard_elements. Decommissiona FK o backfill                                                                        | **1-2 FTE-hour**                  |
| 6   | `[HIGH]`     | 6/36 api-gateway route files usano `requirePermission`. P3 gap audit                                                                                        | **1 FTE-day**                     |
| 7   | `[HIGH]`     | `rbac_role` enum drift (SYSADMIN/TENANT_ADMIN inesistenti in rbp_roles). Drop o allinea                                                                     | **1-2 FTE-hour**                  |
| 8   | `[HIGH]`     | `rbp_role_permissions` mismatch docs (179 vs 326 dichiarate). Update CLAUDE.md                                                                              | **30 min**                        |
| 9   | `[MEDIUM]`   | App-level `tenant_id` inconsistent (rely solo su RLS). Add lint rule                                                                                        | **2-4 FTE-hour**                  |
| 10  | `[MEDIUM]`   | 256/265 active password con bcrypt cost <12. Rotation ciclo                                                                                                 | **2-3 FTE-day o one-shot rehash** |

---

## Advisory items (non in top 10)

- `[MEDIUM]` 310 FK senza `ON DELETE` esplicito — review e tagging (1 FTE-day)
- `[MEDIUM]` Materialized views senza refresh schedule documentato
- `[MEDIUM]` `user_workspaces`/`workspace_widgets` GUC convention drift
- `[MEDIUM]` 0 employees con `enrichment_consent=true` — verifica pipeline
- `[LOW]` 50 SAP shadow tables senza PK — tag intent in `db/README.md`
- `[LOW]` `employees` 19 indici — review redundancy a > 100k righe
- `[LOW]` 215 schema_migrations entries vs 8 `.sql` repo — README cutoff date

---

## S23 partial closure annotations (2026-05-09 — added post-execution)

> **L54 closure**: 4 issue chiuse · 1 partial (#1 pilot 6/24) · 2 deferred S24 · 3 audit miscount rilevate.
> **L55 closure (S23-bis)**: 6 issue chiuse · 1 partial · 1 audit miscount confermato · 2 not started.

| #   | Pre-S23                                    | Post-S23+S23-bis                                                                                                                                    |
| --- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ~30+ tabelle senza tenant_id               | 🟡 **PARTIAL** Scope reale = 24 (audit § 2.3 false positives 6 `tenant_job_*`). Pilot 6/24 closed. → S24 batch 18 restanti                          |
| 2   | 13 RLS GUC typo (fail-closed silente)      | ✅ **CLOSED** via `db/seeds/phase16a_audit_quick_wins.sql`. 0 typo policies remaining.                                                              |
| 3   | P4 audit gap (6 entries / 30d, NULL actor) | 🟡 **PARTIAL** Helper `auditedTransaction()`+`auditEvent()` + 2 brand-studio writes. Trigger `audit_permission_changes()` flagged broken → S24      |
| 4   | `users.role` varchar unconstrained         | ✅ **CLOSED** FK `fk_users_role` REFERENCES `rbp_roles(code)` ON UPDATE CASCADE. 0 orphan, 265 active intatti.                                      |
| 5   | `widget_catalog_id` NULL 100%              | ✅ **CLOSED L55** FK `dashboard_elements_widget_catalog_id_fkey` dropped. Colonna `Int?` retained per backward compat. Prisma schema cleaned.       |
| 6   | "30/36 routes senza requirePermission"     | ⚖️ **AUDIT MISCOUNT CONFIRMED L55**: 28 routes hanno middleware/inline + 2 intentionally public (`health.ts`/`auth.ts`). True P3 = 34/34 non-public |
| 7   | `rbac_role` enum drift                     | ✅ **CLOSED L55** ALTER TYPE multi-step: SYSADMIN→SUPERUSER remap + 8 canonical enum + Prisma sync (services/app + services/api-gateway).           |
| 8   | RBP perm count 179 vs docs 326             | ✅ **CLOSED** Fixed in CLAUDE.md (count canonical = 179).                                                                                           |
| 9   | App-level tenant_id lint rule              | ❌ **NOT STARTED** → S24 (~2-4 FTE-hour script + pre-commit hook).                                                                                  |
| 10  | Bcrypt cost <12 (256/265 users)            | ❌ **NOT STARTED** → S24 (one-shot rehash al next login, ~2-3 FTE-hour).                                                                            |

**Audit corrections**:

- § 2.3 Tabelle senza tenant_id: rimuovere `tenant_job_kpis · tenant_job_skills · tenant_job_tasks · tenant_org_units · tenant_sap_mapping · tenant_skill_dimensions` dalla lista (6 false positives).
- § 6.1 P3 gap: la metrica "Files con `requirePermission` (P3) 6/36" misura solo middleware esplicito. Counting completo (middleware + inline `cache.isAllowed`) = ~28/34 routes (escludendo public-metadata `esco/nace/skill-taxonomy/platform/health`). True P3 gap molto più piccolo.

**Files added/modified S23 + S23-bis**:

- `db/seeds/phase16a_audit_quick_wins.sql` (13 ALTER POLICY GUC fix)
- `db/seeds/phase16b_tenant_id_pilot.sql` (6 ALTER ADD tenant_id + RLS, 4911 rows backfilled)
- `db/seeds/phase16c_users_role_fk.sql` (FK + DROP CHECK)
- `db/seeds/phase16d_rbac_role_cleanup.sql` (ALTER TYPE multi-step, S23-bis)
- `db/seeds/phase16e_widget_catalog_id_decommission.sql` (DROP FK, S23-bis)
- `services/app/src/lib/audit/auditedTransaction.ts` (NEW helper)
- `services/app/src/lib/audit/__tests__/auditedTransaction.test.ts` (NEW 5/5 verdi)
- `services/app/src/app/brand-studio/actions.ts` (instrumented 2 actions)
- `services/{app,api-gateway}/prisma/schema.prisma` (rbac_role 8 canonical + widget_catalog @relation cleanup)
- `idx_tenant_schema_version_applied_by` index added (audit § 1.6 quick win)

**S23-tris additional closures (2026-05-09 23:35Z)**:

- ✅ **#1 batch 24 tables done**: phase16f (18 EMP/recruiting/talent) + phase16g (6 learning/indirect). 30 totali post-pilot. ~9000 rows backfilled.
- ✅ **#3 trigger drop**: phase16h `audit_permission_changes()` + 2 trigger associati droppati (writes invalid audit_logs)
- ✅ **§ 7.1**: `$queryRawUnsafe` → `set_config()` parametrized via `$queryRaw` (pool.ts + db.ts)
- ✅ **§ 1.3 + § 4.3**: SAP shadow tables intent + schema_migrations cutoff doc'd in `db/README.md`

**S24 carry-forward residual (~3-6 FTE-day reali post-S23-tris)**:

| Issue                                                 | Severity     | Estimate     | Note                                                                                                                                        |
| ----------------------------------------------------- | ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| #1 residue: 6 tables orphan/no-FK                     | CRITICAL     | 1-2 FTE-day  | interviews+interview_feedback (8 orphan) · feedback_responses (4 orphan) · prediction_actions/factors · report_executions/schedules (no FK) |
| #3 P4 sweep extended Prisma writes                    | HIGH         | 1-2 FTE-day  | Mirror helper in api-gateway/src/lib/audit/                                                                                                 |
| #9 lint rule app-level tenant_id                      | MEDIUM       | 2-4 FTE-hour | ESLint custom rule + pre-commit                                                                                                             |
| #10 bcrypt rotation                                   | MEDIUM       | 2-3 FTE-hour | One-shot rehash al next login (NextAuth credentials)                                                                                        |
| § 2.5 GUC drift `user_workspaces`/`workspace_widgets` | MEDIUM       | 1-2 FTE-day  | Multi-clausola policy refactor                                                                                                              |
| § 1.5 310 FK senza ON DELETE explicit                 | MEDIUM       | 1 FTE-day    | Review e tagging                                                                                                                            |
| § 1.8 Materialized views refresh schedule             | MEDIUM       | 4-8 FTE-hour | pg_cron setup                                                                                                                               |
| § 8.5 `enrichment_consent` workers enforcement        | MEDIUM       | 2-4 FTE-hour | Edit enrichment workers skip non-consenting                                                                                                 |
| § 1.2 `employees` 95 col / 19 idx vertical-split      | LOW (ad-hoc) | TBD          | A > 100k rows                                                                                                                               |

---

## Files referenced

- `services/api-gateway/src/db/pool.ts` (RLS `withTenant` helper)
- `services/app/src/lib/db.ts` (mirror)
- `services/api-gateway/src/services/rbp-cache.ts` ($queryRawUnsafe parametrized)
- `services/app/src/app/(app)/layout.tsx` (auth gate)
- `services/api-gateway/src/routes/` (35 route files)
- `db/migrations/` (8 files) · `db/seeds/` (25 files) · `db/baseline/`
- `services/app/prisma/schema.prisma`
