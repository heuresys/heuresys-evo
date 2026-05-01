# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Phase 5 BLOCK 14 — cutover prep complete (RTG tasks 5.5-5.11, 2026-05-01)** — UX OK confermato Enzo, sblocco STOP-AUTONOMO-4. **5.5** `scripts/cutover/cross-system-transactions.sh` (10 transaction-set parallel evo vs legacy, login multi-tenant + employees/leaves/perf-reviews/audit-logs/ESCO + logout, HTML+JSON report). **5.6** `scripts/cutover/perf-benchmark.sh` (ab Apache Bench su 7 endpoint paired, p95 ratio evo/legacy con pass criterion ≤1.2, trigger STOP-AUTONOMO-5 oltre soglia). **5.7** `scripts/cutover/dry-run-cutover.sh` (6-step: pre-smoke + stop legacy + DNS sim via /etc/hosts + 100% evo smoke + rollback + RTO measure). **5.8** `docs/cutover/rto-rollback-procedure.md` (RTO target 5min, rollback window 48h, runbook validato con risk register). **5.9** `scripts/cutover/dr-drill-evo.sh` (DR drill VM bare-metal: snapshot + restore OCI + schema integrity + service restart + smoke, target ≤30min). **5.10** `docs/cutover/pre-cutover-checklist.md` (30-item A-E + sign-off + quick verification one-liner). **5.11** `docs/cutover/user-comms-template.md` (6 templates italiano: T-24h banner+email, T-15min, T0 maintenance HTML 503, T+5min complete, T+48h close-rollback, rollback comm). Tag `rtg/evo/phase5/ready-for-go-no-go` ready. **STOP-AUTONOMO-FINAL** al task 5.12 go/no-go decision Enzo. Doc-commit log on `.com.evo`: `[RTG-E][PH5-T5-T11]`.

### Added

- **Phase 5 deploy infra (RTG tasks 5.1+5.2+5.3 + 5.4 prep, 2026-05-01)** — BLOCK 13. **5.1**: `infra/nginx/evo.heuresys.com.conf` Nginx vhost template (port 443/TLS via certbot, proxy / → :3200 services/app, /api/\* → :8200 api-gateway con prefix rewrite, /metrics deny, security headers HSTS+X-Frame+X-Content-Type, body limit 50M, deploy doc inline). **5.2**: 3 systemd units in `infra/systemd/` (heuresys-api-gateway/app/enrichment) + `install-services.sh` installer (DECISIONE: bare-metal systemd invece di Docker per coerenza ADR-0001 PostgreSQL bare-metal — evo non ha Dockerfile, allineato a stack scelta). Hardening: NoNewPrivileges + PrivateTmp + ProtectSystem strict + ReadWritePaths limitati a `/home/ubuntu/heuresys-evo`. **5.3**: `db/scripts/install-pull-cron.sh` cron daily 04:30 UTC che pulla `latest.dump` dal bucket OCI (offset rispetto backup-and-rotate 03:00 + push window PC, VM = read-only mirror). **5.4 prep**: `scripts/parallel-run-validate.sh` (~280 righe bash) — produce `/tmp/parallel-run-report-<TS>.html` + JSON con: reachability legacy/evo (api+fe), endpoint probes anonymous su 4 routes (employees/leaves/perf-reviews/audit-logs), 10-item manual UX checklist Enzo (login multi-tenant, leave submit/approve flow, ESCO search, audit log view, mobile responsive, RLS isolation), performance baseline guidance. Dry-run testato: legacy 200, evo 000 (atteso pre-deploy). Doc-commit log on `.com.evo`: `[RTG-E][PH5-T1-T2-T3]`.

### Added

- **Phase 4 retro — FULL CLOSE 100% (RTG task 4.14, 2026-05-01)** — `.handoff/PHASE4-RETRO.md`. Phase 4 closes **14/14 = 100%** (prima phase a chiusura completa). Effort: 10-15gg estimate vs **~3.5h actual** single autonomous-max session BLOCK 9→12. **+68 test** (22 RBP middleware + 6 RLS pool + 25 endpoint port + 8 ESCO + 7 admin schema), api-gateway 12→93 test (5x growth). 5 nuove route, 2 ADR (0017+0018), 1 migration (223). Lessons capturate: schema discovery flipped scope (baseline source-of-truth), pattern-reuse ×5 routes, honor-the-ADR ×2, $queryRawUnsafe scaled, vector-cosine deferred (low risk). Tag `rtg/evo/phase4/done` da emettere. Phase 5 unblocked (DNS+OCI chiuse). Doc-commit log on `.com.evo`: `[RTG-E][PH4-T14]` + `[RTG-E][PH4-DONE]`.

### Added

- **ESCO KG verify + tenant schema versioning + governance audit (RTG Phase 4 tasks 4.11+4.12+4.13, 2026-05-01)** — 4.11 nuovo route `/esco/occupations/search?q&lang&limit` (ILIKE keyword su `preferred_label_<lang>` + `alt_labels_<lang>`, vector cosine deferred a embedding wiring) con 8 test contract, fallback ESCO_KG.view → EMPLOYEES.view per accesso. 4.12 ADR-0017 Tenant Ontology Versioning + migration `223_tenant_schema_version_p0.sql` (table append-only con tenant_id + version + applied_by, RLS attivo, backfill v=1 per tenant esistenti) + route `/admin/tenant-schema-version` (GET history + POST /bump con RBP TENANT_ADMIN view/edit) con 7 test contract. 4.13 ADR-0018 Governance Audit Trail (decisione: riutilizzo `audit_logs` + trigger esistenti del baseline `audit_permission_changes()` + `trg_audit_employee_permission_overrides` + `trg_audit_role_permissions`, no nuova tabella, pattern app-emit documentato per future mutation handlers). Renumber ADR 0010→0017 / 0011→0018 (Cantiere B aveva usato 0010/0011 per RLS coverage + test coverage strategy). **15 nuovi test totali**, 93 totali api-gateway. Doc-commit log on `.com.evo`: `[RTG-E][PH4-T11-T12-T13]`.

### Added

- **Endpoint port P0 (RTG Phase 4 task 4.10, 2026-05-01, scope H Hybrid)** — 3 nuove routes su `services/api-gateway`: `routes/leaves.ts` (GET list scope-aware + POST submit + POST /:id/approve, RBP area LEAVES, $queryRawUnsafe su `employee_time_off_requests`), `routes/performance-reviews.ts` (GET list scope-aware su `performance_reviews`, RBP area PERFORMANCE_REVIEWS), `routes/audit-logs.ts` (GET list filtered by category+action, RBP area AUDIT). Tutte usano `requireAuth` + `resolveTenant` + `cache.isAllowed()` + `getScopeCondition()` + `withTenant()` (RLS DB-side). RBP cache singleton inizializzato in `index.ts` boot. **25 nuovi contract test** (13 leaves + 5 perf-reviews + 7 audit-logs), **78 test totali api-gateway**, typecheck silent. Doc-commit log on `.com.evo`: `[RTG-E][PH4-T10]`.

### Added

- **RLS scope helpers + coverage script (RTG Phase 4 task 4.9, 2026-05-01)** — `services/api-gateway/src/db/pool.ts`: nuovo `mergeScopedWhere(scopeCond, baseWhere)` helper che fonde scope condition (da `getScopeCondition()`) con baseWhere Prisma; preserva deny-all sentinel `{ id: '__deny_all__' }`; scope keys override baseWhere su collisioni (RBP wins, defense-in-depth contro tenant-id-spoofing). Aggiornato `withTenant()` doc comment a riflettere RLS attiva post-baseline (605 ENABLE + 326 policies). `services/api-gateway/scripts/check-rls-coverage.sh` shell wrapper su `db/scripts/rls-coverage.sql` (esistente da Cantiere B RTGB B2.3): exit non-zero se tabelle tenant-aware FAIL su rls_enabled+force_rls+policy_count>=1+has_tenant_setting. 6 nuovi test (`src/db/__tests__/pool.test.ts`). Doc-commit log on `.com.evo`: `[RTG-E][PH4-T9]`.

### Added

- **RBP framework middleware port (RTG Phase 4 task 4.8, 2026-05-01)** — `services/api-gateway`: nuovi `src/services/rbp-cache.ts` (RBPCacheService singleton, TTL 5min, query rbp*roles+rbp_role_permissions) + `src/middleware/rbac.ts` (`buildRequirePermission(cache)` factory + `requirePermission(area, action)` middleware + `getScopeCondition(scope, ctx)` pure function per Prisma where fragment, 6 scope types PLATFORM/TENANT/DEPARTMENT/HIERARCHY/TEAM/SELF). 22 nuovi test (10 RBP cache + 12 rbac middleware). Schema RBP già completo nel baseline evo (18 rbp*\* tables, 326 policies — gap precedente sottostimato → vero gap era middleware api-gateway, non schema). Doc-commit log on `.com.evo`: `[RTG-E][PH4-T8]`.

### Added

- **Frontend strategy brief — STOP AUTONOMO 1-BIS (2026-05-01)** — `docs/audits/frontend-strategy-brief.md`. Inventario completo legacy: 231 page.tsx (148 admin, 37 company-pet, 16 portal, 14 platform), 11 dashboard, 27 widget (11 impl + 16 placeholder), 186 nav items, 135 backend routes. 3 opzioni P/R/H con effort breakdown: P (Preserve 117gg, fuori scope Q3) / R (Rewrite 26gg, feature-loss risk) / H (Hybrid 41gg, raccomandato). Backend coverage mapping route→pagina per ogni opzione. **Raccomandazione: H** (allinea P0-only scope cut già applicato in BLOCK 9, Q3 cutover viable, sfrutta Cantiere B hardening). Path comune pre-decisione (BLOCK 10): 4.8 RBP + 4.9 RLS + 4.11 ESCO+NACE + 4.12 ADR-010 + 4.13 ADR-011. Decision needed Enzo before BLOCK 11 endpoint port (4.10).

### Added

- **Phase 4 parity audit + STOP-AUTONOMO-1 scope cut (RTG tasks 4.1-4.7, 2026-05-01)** — `docs/audits/parity-audit-2026-05-01.md`. Read-only enumeration legacy vs evo: routes 135 vs 3 (gap 132), RLS 207 stmt vs 0, RBP 33 areas + 159+ permessi vs 0, dashboards 11 vs 0, ESCO+NACE schema present in baseline (data verify deferred 4.11). Gap totale P0+P1 = 237 > 50 → **STOP AUTONOMO 1 trigger**: scope cut a P0-only applicato. Phase 4 ridotta da 14 task a 5 task essential per cutover MVP: 4.8 (RBP 5 aree) + 4.9 (RLS 50 critical tabelle) + 4.10 (5-10 endpoint critical) + 4.11 (ESCO+NACE 2 query) + 4.14 retro. Effort residuo 8.75gg P0 vs 14gg full scope. Doc-commit log on `.com.evo`: `[RTG-E][PH4-T1-T7]`.

### Added

- **Phase 3 retro PARTIAL-DONE (RTG task 3.13, 2026-05-01)** — `.handoff/PHASE3-RETRO.md` full retrospective. Phase 3 chiude **10/13 = 77%** (3.4-3.11 DONE, 3.12 N/A, 3.1-3.3 owner-deferred). Total: 123 tests + enrichment worker scaffold + middleware→proxy rename. Effort: 8-12gg estimate vs ~3h actual (single autonomous CLI session). Lessons captured: refactor-for-testability + honor-the-ADR + pin coverage versions + RTL 16 manual cleanup. Phase 4 unblocked (TOTP indep). Doc-commit log on `.com.evo`: `[RTG-E][PH3-T13]` + `[RTG-E][PH3-PARTIAL]`.

### Changed

- **DX: middleware.ts → proxy.ts (RTG Phase 3 task 3.11, 2026-05-01)** — Next.js 16 file convention rename per `middleware-to-proxy` codemod path. Default export `auth(...)` invariato. Aggiornati comment in `src/lib/auth.ts` + `src/lib/auth.config.ts` per riflettere il nuovo nome. Typecheck silent, 12 test app passing post-rename. Doc-commit log on `.com.evo`: `[RTG-E][PH3-T11]`.

### Notes

- **RTG Phase 3 task 3.12 — `~/.claude/plans/noble-dazzling-gizmo.md` not found**: 20 plan files in `~/.claude/plans/` ma nessuno con questo basename. Plan probabilmente archiviato/rinominato in sessione precedente. Task marcato N/A. Decisione documentata in `[RTG-E][PH3-T12]` doc-commit log on `.com.evo`.

### Added

- **services/enrichment scaffold + esco-match smoke handler (RTG Phase 3 tasks 3.9 + 3.10, 2026-05-01)** — `services/enrichment` da stub README-only a worker scaffold completo: package.json wired (BullMQ 5.13, ioredis 5.4, Anthropic SDK 0.30, Pino 10, Zod), `src/{queues,handlers,clients,types}/` structure, tsconfig.json estensione di tsconfig.base. Componenti: `types/job.ts` (Zod schemas EscoMatchJobInput/Output), `clients/redis.ts` (lazyConnect false-positive avoidance per unit tests), `clients/anthropic.ts` (factory + DEFAULT_MODEL='claude-opus-4-7'), `queues/enrichment.ts` (Queue + Worker builders, JOB_TYPES router), `handlers/esco-match.ts` (smoke implementation: hardcoded ESCO map → Phase 4 task 4.11 sostituirà con pgvector cosine + embedding), `index.ts` (worker bootstrap + SIGINT/SIGTERM shutdown). 7 unit tests in `src/handlers/__tests__/esco-match.test.ts` — all passing. Typecheck silent. Doc-commit log on `.com.evo`: `[RTG-E][PH3-T9-T10]`.

### Added

- **Coverage baseline report + ADR-0002 promote DEFERRED (RTG Phase 3 task 3.8, 2026-05-01)** — `@vitest/coverage-v8 2.1.9` installato in 4 workspace + `@testing-library/dom` esplicito in ui (richiesto da coverage path). Coverage cumulativa: shared 86.6%, api-gateway 42.85%, app 46.53%, ui 94.7% (Stmts). Report aggregato in `docs/test-coverage/baseline-2026-05-01.md`. **ADR-0002 NON promosso** ad Accepted: l'ADR è specifico per testcontainers DB integration, mentre i 123 test delivered sono tutti unit con mock — promozione richiederebbe primo `*.integration.test.ts` che istanzia container Postgres+pgvector. Promote rinviato al Phase 4 task 4.10 (primo endpoint port che richiede DB reale). Doc-commit log on `.com.evo`: `[RTG-E][PH3-T8]`.

### Added

- **packages/ui component tests jsdom + RTL (RTG Phase 3 task 3.7, 2026-05-01)** — `packages/ui`: vitest 2.1.9 + @testing-library/react 16.3 + @testing-library/jest-dom 6.9 + jsdom 29 + @vitejs/plugin-react come devDep workspace, `vitest.config.ts` con `environment: "jsdom"` + setupFile per `cleanup()` afterEach + jest-dom matchers. 29 component test in `src/components/__tests__/`: 12 Button (variants × 5, size, asChild Slot, aria-label, disabled, className merge), 5 Card family (composition Header/Title/Description/Content/Footer + h3 semantic + custom class), 7 Input (type, variants default/error, sizes, placeholder, disabled, onChange dispatch), 5 Toast Radix wrapper (Provider+Viewport+Title+Description+Close + destructive variant + viewport positioning). Doc-commit log on `.com.evo`: `[RTG-E][PH3-T7]`.
- **services/app authorize unit tests + refactor (RTG Phase 3 task 3.6, 2026-05-01)** — `services/app`: vitest 2.1.9 in devDep, `vitest.config.ts` con alias `@→src` + node env. Refactor minore: `src/lib/auth.ts` `authorize` callback inline → `src/lib/authorize.ts` exported `authorizeCredentials(prisma, env, credentials, bcryptCompare?)` pure-function (DB + bcrypt iniettati). 12 unit test in `src/lib/__tests__/authorize.test.ts`: null-handling (no creds, non-string username/password), user-not-found, password_hash null (post-mig 216 sentinel), bcrypt mismatch, tenantId resolve from employee, DEFAULT_SUPERUSER_TENANT_ID fallback, orphan employee_id, empty tenantId no-fallback, default role EMPLOYEE, soft-delete filter. Carry-forward: middleware.ts redirect logic (jsdom + NextAuth mock) deferred — contributo coverage marginale + complessità mock NextAuth alta.

### Changed

- `services/app/src/lib/auth.ts` `authorize` callback now delegates to `authorizeCredentials()` from `lib/authorize.ts` — behavior identical, semantics testable. No production behavior change. Doc-commit log on `.com.evo`: `[RTG-E][PH3-T6]`.

### Added

- **Contract test `/employees` RLS isolation (RTG Phase 3 task 3.5, 2026-05-01)** — `services/api-gateway`: vitest 2.1.9 + supertest 7.x come devDep workspace, `vitest.config.ts` con coverage v8 (excludes `index.ts`, `auth.ts`, `types.ts`), 12 contract test in `src/routes/__tests__/employees.test.ts`. Mock `withTenant()` (db/pool) ritorna fixture per-tenant (EcoNova 2 emp, RTL Bank 4 emp) — RLS isolation verificato: session.tenantId filtra dataset, X-Tenant-Id fallback solo se session privo, session ha precedenza header (defense-in-depth). Validation: 401 anonim, 400 tenant_required, 400 limit>100 + cursor non-uuid via Zod errorHandler, pagination nextCursor on/null. Doc-commit log on `.com.evo`: `[RTG-E][PH3-T5]`.
- **Vitest scaffold + Zod schema test coverage (RTG Phase 3 task 3.4, 2026-05-01)** — `packages/shared`: vitest 2.1.9 installato come devDep workspace, `vitest.config.ts` con coverage v8 provider, scripts `test`/`test:watch`/`test:coverage`, 4 test file in `src/{schemas,auth}/__tests__/` totale **70 test passing** (parse valid/invalid, defaults, enums, picked/omitted subsets, discriminated unions, role hierarchy helpers). Coverage on Zod schemas (auth/employee/tenant/user) + auth role helpers (hasRole/isPlatformAdmin/isTenantAdmin/isHrLead). Doc-commit log on `.com.evo` repo: `[RTG-E][PH3-T4]`. ADR-0002 (test stack) avanza verso `Accepted` quando tutti i workspace avranno almeno il loro test floor (3.4-3.7).
- **Bucket-as-DB-git workflow + schema unification (S6, 2026-04-29)** — vedi ADR-0004. Sintesi: PC Docker `heuresys_evo_db` (5432) diventa SoT primario per la fase pre-cutover; OCI bucket `heuresys-evo-backups` funge da "git del database" (`latest.dump` = HEAD, `dump_<source>_<TS>.dump` = storico). Workflow `evo-db {pull|push|status|history}` con soft-lock version stamp per evitare push in collision. WD `~/heuresys-evo` su VM è read-only sul bucket. Schema unificato `.evo` (203 mig, max_v=222) per i 3 DBMS live (PC Docker, VM Docker 5433 riallineato, VM bare-metal). Container PC v1 (5433) eliminato. Cron VM `check-freshness` rimosso, Task Scheduler PC `Heuresys-Evo-Sync` rimosso. `backup-and-rotate.sh` demoted a nightly safety snapshot (no `latest.dump` promotion). Commit `24d11e7`. 6 nuovi script (`db-push`, `db-pull`, `db-status`, `db-history`, `evo-db`, `oci-config`), 6 deprecati con banner (rimozione 2026-05-31). ADR-0004 documenta scelta + alternative considerate.
- Initial scaffold:
  - Root: `CLAUDE.md`, `README.md`, `.env.example`, `.gitignore`, `.mcp.json`, `CHANGELOG.md`
  - `.claude/`: `settings.json`, `.gitignore`, `rules/security.md`, `workflows/README.md`, dirs vuote per skills/commands/agents/hooks/agent-memory
  - `docs/`: `README.md`, `decisions/README.md`, dirs vuote per architecture/runbooks/api/guides/glossary
  - `services/`: `marketing/`, `app/`, `api-gateway/`, `enrichment/`, `playground/` (solo README scope)
  - `packages/`: `ui/`, `shared/` (solo README scope)
  - `db/README.md` (PostgreSQL bare-metal documentato)
  - `infra/README.md` (Docker Compose senza Postgres)
  - `prompts/README.md` (prompt library per servizi LLM)
  - `scripts/README.md`, `cowork_code_exchange/README.md`, `tests/README.md`
  - `.github/workflows/` con stub commentati: `ci.yml.example`, `deploy-marketing.yml.example`, `deploy-app-api.yml.example`

### Changed

### Deprecated

### Removed

### Fixed

### Security
