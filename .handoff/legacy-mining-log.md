# Legacy backend mining log — Phase 13.0

> **Append-only audit trail** del forensic import dal repo legacy `D:\enzospenuso\Documents\GitHub\heuresys.com.evo` verso `D:\evo.heuresys.com`.
>
> **Scope**: 8 pack di endpoint backend (route + query + business rules + zod schema). NIENTE UI legacy (rifatta in Phase 13.A→13.D).
>
> **Plan ref**: `C:\Users\enzospenuso\.claude\plans\credo-che-se-tu-jazzy-key.md` § Phase 13.0
>
> **Started**: 2026-05-06 04:59 GMT+2

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
| 1a | HR core (light) | /roles · /tenants · /users + cross-cutting helpers | 🟡 in progress (1/3 endpoint done · /roles ✓) | TBD | split da Pack 1 (effort revisited 2.5 FTE-day) |
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

## Skip register (decisioni di esclusione)

> Append-only. Format: `endpoint · model mancante · motivo skip · workaround/follow-up`.

(vuoto · da popolare durante mining)

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
