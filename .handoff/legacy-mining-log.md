# Legacy backend mining log — Phase 13.0

> **Append-only audit trail** del forensic import dal repo legacy `D:\enzospenuso\Documents\GitHub\heuresys.com.evo` verso `D:\evo.heuresys.com`.
>
> **Scope**: 8 pack di endpoint backend (route + query + business rules + zod schema). NIENTE UI legacy (rifatta in Phase 13.A→13.D).
>
> **Plan ref**: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` § Phase 13.0
>
> **Started**: 2026-05-06 04:59 GMT+2
>
> **⚠️ Companion registry strutturato** (REGOLA cross-progetto): [`legacy-import-registry.csv`](legacy-import-registry.csv) + [`legacy-import-registry.md`](legacy-import-registry.md) — SoT cataloghi degli oggetti importati con stage workflow `Test Stage → PreOp Stage → Promoted/Rejected`. Vincolo "estirpazione clean" per ogni entry. Vedi memoria globale `~/.claude/projects/D--evo-heuresys-com/memory/feedback_legacy_import_registry.md` per la regola completa.

## Setup verificato pre-bootstrap

| Item | Stato | Note |
|---|---|---|
| Tunnel SSH `oracle-vm-default` 5432 (Postgres) | ✅ active | PID 19720 · forward `5432:localhost:5432` |
| Tunnel SSH `oracle-vm-default` 6380 (Redis) | ✅ active | forward `6380:localhost:6379` (fix mismatch script) |
| API Gateway `:8200` | ✅ running | bind `::` dual-stack · `/health` 200 OK |
| Next.js app `:3200` | ✅ running | bind `0.0.0.0` · LAN visible su `192.168.1.8:3200` |
| Storybook `:6006` | ✅ running | bind `0.0.0.0` · LAN visible · 9.1.20 |
| Enrichment workers | ✅ running | Redis VM connected · `redis://:***@localhost:6380` |
| `npm run typecheck --workspaces` | ✅ verde | 5 workspace clean (gate pre-bootstrap) |

## Pack progress

| Pack | Domain | Endpoint legacy | Status | Commit | Note |
|---|---|---|---|---|---|
| 1a | HR core (light) | /roles · /tenants · /users + cross-cutting helpers | ✅ done (3/3 · /roles ✓ · /tenants ✓ · /users ✓) | TBD | split da Pack 1 |
| 1b | HR core (heavy) | /employees (extend) · /org-units · /workforce + WorkforcePlanningService | ⏳ pending | — | split da Pack 1 (effort revisited 3.5 FTE-day) |
| 2 | ESCO + Skill taxonomy | /esco · /skill-taxonomy · /ontology · /onet · /nace · /skills · /skill-analytics · /skill-assessments | ⏳ pending | — | capability-graph · skills-heatmap |
| 3 | Career intelligence | /career-paths · /career-intelligence · /gap-analysis · /talent-intelligence · /succession | ⏳ pending | — | hr-director-overview · employee-journey |
| 4 | Performance | /performance-reviews · /360-reviews · /calibration-sessions · /merit-cycles · /okrs · /goals | ⏳ pending | — | process-performance-cycle |
| 5 | Recruiting | /candidates · /job-postings · /requisitions · /interviews · /offers | ⏳ pending | — | process-recruiting-funnel |
| 6 | Learning | /courses · /learning-paths · /enrollments · /certifications · /training-recommendations | ⏳ pending | — | process-learning-paths |
| 7 | Onboarding / Time-off | /onboarding · /leave · /time-off · /attendance | ⏳ pending | — | process-onboarding-flow |
| 8 | RBP / Audit / Org-systems | /rbp · /audit-logs · /workspace · /platform | ⏳ pending | — | org-systems |

## Audit Pack 1 — sintesi (2026-05-06 05:05 GMT+2)

**Forensic audit completo via Agent backend-architect** sui 6 endpoint legacy:

| Endpoint | LOC | Handler | Strategy | Effort | Risk | Schema gap |
|---|---|---|---|---|---|---|
| /roles | 60 | 1 | clone-as-is (constant export) | 0.5h | LOW | none |
| /tenants | 725 | 10 | clone-as-new (+ admin pool helper) | 6h | MED | none |
| /users | 969 | 9 | clone-as-new (+ NextAuth bridge) | 8h | HIGH | verify column parity |
| /org-units | 620 | 12 | clone-as-new (+ auth-required default P2) | 6h | MED | none |
| /employees (evo scaffold 49 LOC, 1/18) | 1301 | 18 | extend additivo (mantieni cursor pagination) | 10h | HIGH | none |
| /workforce-planning | 880 | 17 | clone-as-new (+ port WorkforcePlanningService) | 8h | HIGH | none |

**Schema parity**: 100% — 0 migration `import_<model>_from_legacy` richieste.

**Helpers cross-cutting da portare** (~11.5h cumulativo):
- `escapeILIKE`, `safeParseInt`, `buildMeta` · 1h
- `applyFieldPolicy`, `loadPolicyForRole` · 2h
- `cachedForTenant`, `invalidateCachePattern`, `CACHE_TTL` · 2h
- `validatePassword`, `generateSecurePassword` · 1h
- `validateUUID` middleware · 0.5h
- Admin pool cross-tenant helper · 1h
- `auditedTransaction()` (NEW greenfield, P4 enforcement) · 2h
- `rbpMiddleware.applyScopeFilter` · 2h

**Effort revisited**: ~50h ≈ **6.3 FTE-day** vs plan budget 2 FTE-day → **+215% overshoot**. Plan § Risks 0d hard cap = 20 FTE-day per Phase 13.0. Decisione autonoma (plan § Decision matrix · Autonomous execution mode):

- **Split Pack 1 → Pack 1a (roles+tenants+users + helpers, ~2.5 FTE-day) + Pack 1b (employees+org-units+workforce, ~3.5 FTE-day)**
- Ordine porting (cascade deps): roles → tenants → users → org-units → employees → workforce
- P4 audit logging via `auditedTransaction()`: greenfield (legacy NON scrive audit_logs nei route)
- Raw SQL → Prisma conversion: usare `$queryRaw` tagged template per CTE ricorsive (P6)

**Note architetturali**:
- Legacy stack: Express + raw `pg` Pool, JWT custom, `requirePermission(area,action)` data-driven
- Evo stack: Express + `@auth/express` (NextAuth shared cookie), Prisma 5.22 + `withTenant()` RLS, `requirePermission` factory in `src/middleware/rbac.ts:44`
- Field policy (role-based PII redaction) presente in legacy, assente in evo — decidere se portare in Pack 1b

## Pack 1a · /roles · ported (2026-05-06 05:18 GMT+2)

**Strategy**: clone-as-is (constant export · 60 LOC legacy · 1 GET handler).

**Files added in evo**:
- `src/middleware/roles.ts` — `ROLES` constant + `Role` type + `LEGACY_ALIAS_MAP` + `buildRoleHierarchy()` helper
- `src/middleware/require-permission.ts` — lazy wrapper su `buildRequirePermission(getRBPCache())` (helper cross-cutting per Pack 1a · usato per primo da /roles)
- `src/routes/roles.ts` — router con GET `/` + `requireAuth` + `requirePermission('SECURITY','view')`
- `src/routes/__tests__/roles.test.ts` — 7 test contract (auth/role/permission/hierarchy shape)

**Files modified in evo**:
- `src/index.ts` — import + mount `app.use('/roles', rolesRouter)`

**Adapt notes**:
- Action enum: legacy `'VIEW'` (uppercase) → evo `'view'` (lowercase, Action type evo) · documented in test fixture
- Area `'SECURITY'`: not in current evo P0 scope (`EMPLOYEES, LEAVES, PERFORMANCE_REVIEWS, AUDIT, TENANT_ADMIN`) → richiede DB seed entry `rbp_functional_areas.code='SECURITY'` per runtime allow. **PARTIAL IMPORT** flag: l'endpoint funziona shape-correct in test mock, runtime `requirePermission` rifiuterà finchè SECURITY area non sia seedata. TODO Pack 1b: aggiungere seed SECURITY area + relative `rbp_role_permissions` rows.

**Helper dependencies introdotte in evo (1/8 di lista cross-cutting)**:
- ✅ `requirePermission` lazy wrapper
- ⏳ `escapeILIKE`, `safeParseInt`, `buildMeta` (per /tenants, /users)
- ⏳ `applyFieldPolicy`, `loadPolicyForRole` (per /employees in 1b)
- ⏳ `cachedForTenant`, `invalidateCachePattern`, `CACHE_TTL` (per /org-units in 1b)
- ⏳ `validatePassword`, `generateSecurePassword` (per /users)
- ⏳ `validateUUID` middleware
- ⏳ Admin pool cross-tenant helper (per /tenants)
- ⏳ `auditedTransaction()` greenfield P4

**Verifica**:
- `npm run typecheck --workspaces --if-present` ✅ verde
- `npm test --workspace=services/api-gateway -- routes/__tests__/roles` ✅ 7/7 passing
- `curl http://127.0.0.1:8200/roles` ✅ HTTP 401 senza session (atteso)
- API gateway tsx watch auto-restart ✅

**Side fix non-Pack 1a (env-only, gitignored)**: aggiunto `AUTH_TRUST_HOST=true` in `services/api-gateway/.env` per risolvere `UntrustedHost` da `@auth/express` (problema pre-esistente bloccava qualsiasi `requireAuth`-protected route in dev). Documentato qui per cross-machine consistency.

## Pack 1a · /tenants · ported (2026-05-06 05:38 GMT+2)

**Strategy**: clone-as-new (Prisma evo replace raw SQL legacy · 725 LOC → ~520 LOC · 9/10 handler).

**Files added in evo**:
- `src/utils/sql-safety.ts` — `escapeILIKE` helper cross-cutting
- `src/utils/pagination.ts` — `safeParseInt` · `isUUID`/`UUID_REGEX` · `buildMeta` (pagination meta builder)
- `src/routes/tenants.ts` — 9 handler: GET / · GET /meta/statuses · GET /meta/plans · GET /current · GET /:identifier · POST / · PATCH /:identifier · DELETE /:identifier (soft+permanent) · POST /:identifier/activate
- `src/routes/__tests__/tenants.test.ts` — 26 test contract (auth gates · permission · list+filter · create+409 dup · PATCH ownership · DELETE soft/permanent/system-protect · activate)

**Files modified in evo**:
- `src/index.ts` — mount `app.use('/tenants', tenantsRouter)`

**Adapt notes**:
- Legacy raw SQL `pool` → Prisma `prisma` direct (cross-tenant by design · no `withTenant` perché /tenants è admin cross-tenant per natura)
- Legacy `req.dbClient` skipped — admin-pool pattern (pool diretto) tradotto a `prisma` client diretto (RLS bypass via no `SET LOCAL app.current_tenant_id`)
- Action enum legacy `'CREATE'/'EDIT'/'DELETE'` → evo `'create'/'edit'/'delete'` lowercase
- Area `'PLATFORM'` richiede seed in `rbp_functional_areas` (TODO Pack 1b: aggiungere `'PLATFORM'` + `'SECURITY'` come migration seed)
- `nace_code` field omesso — assente in evo `tenants` Prisma model (presente in legacy DB). Schema delta documented per future migration `add_nace_code_to_tenants`.
- `BigInt` per `annual_revenue_eur` — serialize a Number nel JSON output via `serializeTenant()` helper
- Endpoint **`/:identifier/stats` deferred**: dipende da `prisma.locations`/`goals`/`performance_reviews` che NON sono nell'allowlist Prisma del workspace api-gateway (`prisma/allowlist.txt` esclude tutto fuori dai 9 model core). Espansione allowlist pianificata per Pack 1b quando /workforce richiede gli stessi modelli — singolo `prisma:refresh` può abilitarli tutti insieme.

**Helper dependencies introdotte in evo (3/8 di lista cross-cutting Pack 1a)**:
- ✅ `requirePermission` lazy wrapper (commit `e10cb43`)
- ✅ `escapeILIKE` (questo commit)
- ✅ `safeParseInt`, `isUUID`/`UUID_REGEX`, `buildMeta` (questo commit)
- ⏳ `validatePassword`, `generateSecurePassword` (per /users)
- ⏳ `validateUUID` middleware (alternativa a isUUID inline · valutare)
- ⏳ Admin pool cross-tenant (non più necessario · `prisma` direct copre)
- ⏳ `applyFieldPolicy`, `loadPolicyForRole` (per /employees in 1b)
- ⏳ `cachedForTenant`, `invalidateCachePattern`, `CACHE_TTL` (per /org-units in 1b · valutare se ROI ne vale)
- ⏳ `auditedTransaction()` greenfield P4 (NEW · architectural addition)

**Verifica**:
- `npm run typecheck --workspaces --if-present` ✅ verde
- `npm test --workspace=services/api-gateway -- routes/__tests__/tenants` ✅ 26/26 passing
- `curl http://127.0.0.1:8200/tenants` ✅ HTTP 401 (requireAuth)
- `curl http://127.0.0.1:8200/tenants/meta/statuses` ✅ HTTP 200 (public, payload corretto)

## Pack 1a · /users · ported (2026-05-06 05:43 GMT+2)

**Strategy**: clone-as-new (raw SQL legacy → Prisma + bcryptjs + @auth/express bridge).

**Files added in evo**:
- `src/utils/password-policy.ts` — `validatePassword` (12+ char · upper/lower/digit/special) · `generateSecurePassword(length)` (cryptographic shuffle)
- `src/routes/users.ts` — 9 handler: GET /meta/roles · GET /permissions/available · GET / (list, tenant-scoped) · GET /:id · POST / · PATCH /:id · DELETE /:id (soft+hard) · POST /:id/reset-password · POST /bulk
- `src/routes/__tests__/users.test.ts` — 24 test contract (auth · RBP · tenant scope · UUID validation · password policy · privilege escalation prevention · self-delete prevention · bulk skip-on-existing)

**Files modified in evo**:
- `src/middleware/roles.ts` — esteso con `ROLE_DESCRIPTIONS` constant per /meta/roles
- `src/index.ts` — mount `app.use('/users', usersRouter)`
- `services/api-gateway/package.json` — added deps `bcryptjs ^3.0.3` + `@types/bcryptjs ^3.0.0`

**Adapt notes**:
- Legacy raw SQL `dbClient/pool` → Prisma `prisma.users.findMany/findUnique/create/update/delete` con `include: { employees: { include: { tenants } } }` per arricchimento
- Legacy custom JWT `req.user` → evo `req.session.user` con stesso shape (id, role, tenantId)
- Legacy `escapeILIKE($search)` raw → evo Prisma `contains` mode insensitive (sufficiente per OR su username/first_name/last_name)
- Legacy `safeParseInt(req.query.page, {fallback})` → evo zod `z.coerce.number().int().min(1)` (più robusto)
- Legacy `validatePassword`/`generateSecurePassword` da `utils/password-policy.ts` → evo identico (port verbatim del crypto-secure shuffle)
- Action enum legacy `'VIEW'/'CREATE'/'EDIT'/'DELETE'` → evo `'view'/'create'/'edit'/'delete'` lowercase
- Privilege escalation rules ported (cannot create/modify users with higher privileges · only SUPERUSER can create/modify SUPERUSER)
- Welcome email **stub** preservato (logger only · NO password logging · TODO production: SendGrid/AWS SES)
- Bulk endpoint preservato con concurrent username uniqueness check via while loop · max 100 employees · per-employee try/catch isolation

**Helper dependencies introdotte in evo (4/8 di lista cross-cutting Pack 1a)**:
- ✅ `requirePermission` lazy wrapper (commit `e10cb43`)
- ✅ `escapeILIKE` (commit `f54bf7d`)
- ✅ `safeParseInt`, `isUUID`, `buildMeta` (commit `f54bf7d`)
- ✅ `validatePassword`, `generateSecurePassword` (questo commit)
- ⏳ `validateUUID` middleware — non più necessario, sostituito da `isUUID()` inline
- ⏳ Admin pool cross-tenant — non più necessario, sostituito da `prisma` direct
- ⏳ `applyFieldPolicy`, `loadPolicyForRole` (per /employees in Pack 1b)
- ⏳ `cachedForTenant`, `invalidateCachePattern`, `CACHE_TTL` (per /org-units · ROI da valutare)
- ⏳ `auditedTransaction()` greenfield P4 (architectural addition Pack 1b)

**Verifica**:
- `npm run typecheck --workspaces --if-present` ✅ verde
- `npm test --workspace=services/api-gateway -- routes/__tests__/users` ✅ 24/24 passing
- `curl http://127.0.0.1:8200/users` ✅ HTTP 401 (requireAuth global)

## Pack 1a · CHIUSO (2026-05-06)

**Totale**: 3 endpoint ported · 4 helper cross-cutting · 57 test (7 + 26 + 24) · ~1.5 FTE-day reali (vs stima audit 2.5 FTE-day · effort sotto stima per riuso pattern + Prisma productivity).

**Cumulativo Pack 1a**:
- Files added: 11 (3 router + 3 test + 2 utils + 2 middleware helpers + 1 password-policy)
- Files modified: 2 (`src/index.ts` mount × 3 + `src/middleware/roles.ts` extend)
- Tests verde: **57/57**
- Commits Pack 1a: `e10cb43` (/roles) + `f54bf7d` (/tenants) + (this) (/users)

**Restano per Pack 1**: 1b heavy → /employees extend · /org-units · /workforce-planning (~3.5 FTE-day stima audit).

## Pack 1b · /employees · extended (2026-05-06 05:48 GMT+2)

**Strategy**: extend file evo esistente (49 LOC + 1 handler) con 7 nuovi handler core. Mantenuto GET / cursor-pagination contract invariato per backward-compat.

**Files modified in evo**:
- `src/routes/employees.ts` — esteso da 49 a ~330 LOC con handler:
  - GET / (preservato cursor-based) · GET /meta/employment-statuses · GET /meta/termination-reasons
  - GET /me · GET /me/skills (self-service via session.user.employeeId)
  - GET /:id · GET /:id/skills · POST / · PATCH /:id · DELETE /:id (soft+hard)

**Files added in evo**:
- `src/routes/__tests__/employees-extended.test.ts` — 19 test contract nuovi handler

**Adapt notes**:
- Cursor pagination GET / preservato (impossible to break esistenti 12 test contract)
- `withTenant(tenantId, fn)` per tutte le route tenant-scoped (RLS via SET LOCAL)
- `Prisma.employeesUncheckedUpdateInput`/`UncheckedCreateInput` per FK direct (`manager_id`, `org_unit_id`, `cost_center_id`) invece di relation connect/disconnect (Prisma multi-relation naming verboso `org_units_employees_org_unit_idToorg_units`)
- `EMPLOYEES` RBP area è già seed nel P0 evo (no skip)
- Self-service routes `/me*` non richiedono permission, solo auth + employeeId in session
- DELETE behavior: SUPERUSER+`?hard=true` → permanent delete · default → soft archive (`is_active=false`)

**Skip per Pack 1c (futuro)**:
- `/analytics-stats`, `/stats`, `/dashboard-stats`: heavy aggregation con CTE su `cost_centers`, `performance_reviews` (fuori allowlist Prisma corrente)
- `/distribution/department`: aggregation pesante
- `/:id/manager-chain`, `/:id/direct-reports`: recursive CTE → richiede `$queryRaw` tagged template
- `/:id/career-history`: model `career_history` non in allowlist
- `applyFieldPolicy`: PII redaction role-based — non portato (decisione: P3 RBP enforcement evo già copre access; field-level redaction da Pack 1c se richiesto)

**Verifica**:
- `npm run typecheck --workspaces --if-present` ✅ verde
- `npm test --workspace=services/api-gateway -- routes/__tests__/employees` ✅ 31/31 passing (12 + 19)

## Pack 1b · /org-units · ported (2026-05-06 05:52 GMT+2)

**Strategy**: clone-as-new (Prisma + tree assemblato in JS post-query · skip recursive CTE).

**Files added in evo**:
- `src/routes/org-units.ts` — 9 handler: GET / · GET /tree · GET /hierarchy (alias) · GET /types · GET /:id · GET /:id/employees · GET /:id/children · POST / · PATCH /:id · DELETE /:id
- `src/routes/__tests__/org-units.test.ts` — 21 test contract (auth · tenant · list+filter · tree build · types distinct · CRUD · archive-on-employees · delete-with-children block)

**Files modified in evo**:
- `src/index.ts` — mount `app.use('/org-units', orgUnitsRouter)`

**Adapt notes**:
- Read public legacy → evo `requireAuth` global default (P2 enforcement)
- `cachedForTenant` skipped — cache layer non portato (ROI scarso per Tier 1, fetch sempre)
- Tree builder portato verbatim (Map-based assembly post-query)
- POST /: org_level computed da parent.org_level + 1
- PATCH /: org_level recomputed se parent_id cambia (subtree level update **NON** propagato — limitazione documentata, rifare via dedicated `/move` endpoint Pack 1c)
- DELETE / smart: 400 se children · archive (`is_active=false`) se employees · hard delete altrimenti

**Skip per Pack 1c (futuro)**:
- `/:id/path` — recursive CTE per parent chain · richiede `$queryRaw` tagged template
- `/:id/move` — recursive CTE per ricalcolo org_level subtree · richiede `$queryRaw`
- `cachedForTenant` cache layer · valutare ROI con load testing reale

**Verifica**:
- `npm run typecheck --workspaces --if-present` ✅ verde
- `npm test --workspace=services/api-gateway -- routes/__tests__/org-units` ✅ 21/21 passing

## Pack 1b · /workforce-planning · ported (2026-05-06 05:58 GMT+2)

**Strategy**: clone-as-new MVP CRUD su 3 nuovi modelli Prisma allowlist-expanded.

**Allowlist Prisma expanded (7 nuovi model)**:
- `services/api-gateway/prisma/allowlist.txt` — added: `workforce_plans`, `workforce_plan_actions`, `workforce_plan_scenarios`, `locations`, `goals`, `performance_reviews`, `cost_centers`
- `npm run prisma:refresh` ✅ (db pull + prune + generate · 16 model totali nel client)

**Files added in evo**:
- `src/routes/workforce-planning.ts` — 9 handler MVP CRUD: GET /plans · POST /plans · GET /plans/:id · PATCH /plans/:id · GET /plans/:id/actions · POST /plans/:id/actions · GET /scenarios (filter by plan_id) · POST /scenarios · GET /scenarios/:id
- `src/routes/__tests__/workforce-planning.test.ts` — 15 test contract (CRUD plans + scenarios + actions · plan-not-found gate · zod validation)

**Files modified in evo**:
- `src/index.ts` — mount `app.use('/workforce-planning', workforcePlanningRouter)`

**Adapt notes**:
- 9/17 handler legacy ported (CRUD MVP)
- 8/17 handler **DEFERRED Pack 1c**: GET /inventory · GET+POST /gap-risk · GET+POST /hiring-recommendations · GET+POST /training-investments · GET /projections · POST /scenarios/:id/simulate
- `WorkforcePlanningService` legacy (class esterna ~500 LOC con simulation/aggregation logic) **NON PORTATO** — endpoint heavy logic deferred a Pack 1c con investment dedicato
- `BigInt`/`Decimal` annual_revenue_eur/estimated_cost: `new Prisma.Decimal()` per write, serialize a Number per read
- Scenarios + Actions tied to plan via FK `workforce_plan_id` (verified existing)
- Action types enum: `hire/reskill/transfer/separate/promote` · priority `low/medium/high/critical` · status default `pending`

**Verifica**:
- `npm run typecheck --workspaces --if-present` ✅ verde
- `npm test --workspace=services/api-gateway -- routes/__tests__/workforce-planning` ✅ 15/15 passing
- `npm test --workspace=services/api-gateway` (full suite) ✅ **205/205 passing** (18 test files)

## Pack 1b · CHIUSO (2026-05-06)

**Totale**: 3 endpoint ported · ~50 test nuovi (19 employees-extended + 21 org-units + 15 workforce-planning) · Prisma allowlist expanded da 9 a 16 model.

**Cumulativo Pack 1b**:
- Files added: 5 (1 employees-extended test + 2 org-units + 2 workforce-planning)
- Files modified: 2 (`src/index.ts` mount × 3 + `prisma/allowlist.txt`)
- Tests verde: **55/55** (Pack 1b solo) → tutto api-gateway suite **205/205**
- Commits Pack 1b: `c0099d1` (/employees) + `5ef872a` (/org-units) + (this) (/workforce-planning)

## Pack 1 (1a + 1b) · CHIUSO COMPLESSIVO

**Endpoint ported**: 6 (roles, tenants, users, employees-extended, org-units, workforce-planning)
**Test verde**: ~112 nuovi (Pack 1) · totale api-gateway 205/205
**Helper cross-cutting**: 4 nuovi (escapeILIKE, safeParseInt+isUUID+buildMeta, validatePassword+generateSecurePassword, requirePermission lazy)
**Prisma allowlist**: expanded da 9 a 16 model

**Skip Pack 1c (per future)**: stats/analytics endpoint heavy (CTE recursive · field-policy PII redaction · WorkforcePlanningService class) · audited-transaction P4 · org-units /:id/path + /:id/move

**Restano per Phase 13.0**: Pack 2-8 (ESCO/Career/Performance/Recruiting/Learning/Onboarding/RBP).

## Skip register (decisioni di esclusione)

> Append-only. Format: `endpoint · model mancante · motivo skip · workaround/follow-up`.

| Item | Pack | Motivo | Follow-up |
|---|---|---|---|
| `/tenants/:id/stats` | 1a | Prisma allowlist api-gateway esclude `locations`, `goals`, `performance_reviews` | Pack 1b expanding allowlist + `prisma:refresh` |
| `tenants.nace_code` field | 1a | Field omesso da `services/app/prisma/schema.prisma` model `tenants` | Future schema-import migration `add_nace_code_to_tenants` (low priority) |
| RBP area seed `PLATFORM`, `SECURITY` | 1a | Endpoint funzionano shape-correct in test mock; runtime `requirePermission` rifiuta finchè area non seed | Pack 1b: migration seed `rbp_functional_areas` + `rbp_role_permissions` per le 2 nuove area |

## Schema migrations applied (gap resolved)

> Append-only. Format: `migration_name · model · pack origine · timestamp`.

(vuoto · da popolare durante mining)

## Cascade dependencies (skip che forzano altri skip)

> Append-only. Format: `endpoint A skip → endpoint B impacted (motivo)`.

(vuoto · da popolare durante mining)

## Test coverage delta

| Snapshot | Workspace | Test count | Note |
|---|---|---|---|
| Pre-Phase 13.0 baseline | services/api-gateway | TBD | rilevare prima del Pack 1 |

## Risks tracker

| Rischio (plan ref) | Probabilità | Mitigazione attiva |
|---|---|---|
| 0a Schema gap massivo (>50% endpoint pack) | media | audit pre-flight 1h per pack prima di adapt |
| 0b Stack break Prisma legacy | bassa-media | Prisma evo è 5.22 · verificare features preview |
| 0c Skip cascading | bassa | mining log obbligatorio · cascade tracker append-only |
| 0d Effort overshoot (>20 FTE-day) | media | hard cap 20 FTE-day · fallback partial import |

## Riferimenti

- Plan completo: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md`
- Project state: [`STATE.md`](STATE.md)
- BRAND-STATE: [`../.ux-design/BRAND-STATE.md`](../.ux-design/BRAND-STATE.md)
- DECISIONS-LOG: [`../.ux-design/DECISIONS-LOG.md`](../.ux-design/DECISIONS-LOG.md)
- Promotion candidates: [`../.ux-design/08-promotion/promotion-candidates.md`](../.ux-design/08-promotion/promotion-candidates.md)
- Repo legacy source: `D:\enzospenuso\Documents\GitHub\heuresys.com.evo`
- Schema target evo: `D:\evo.heuresys.com\services\app\prisma\schema.prisma` (994 KB · 566 model)
