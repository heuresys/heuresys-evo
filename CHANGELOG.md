# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
