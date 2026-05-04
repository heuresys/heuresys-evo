# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Branch protection on `main`** (2026-05-04, S10): 7 required status checks (`lint`, `typecheck`, `test`, `build-workspaces`, `gitleaks`, `semgrep`, `npm-audit`) + required linear history + force push blocked + deletion blocked. `enforce_admins=false` (override emergenza). All future changes pass via PR + auto-merge cascade. See `docs/decisions/0019-repo-visibility-flip-and-branch-protection.md`.
- **Storybook deploy preview on GitHub Pages** (2026-05-04, S10): workflow `.github/workflows/storybook.yml` builds `packages/ui` Storybook on PR + deploys on `main` push. Live URL: `https://heuresys.github.io/heuresys-evo/`. Deploy preview NOT in required checks (dev tool, not gating).
- **Auto-merge enabled on repo** (2026-05-04, S10): `gh pr merge --auto --squash --delete-branch` queues PR merges automatically once CI green + branch up-to-date. Combined with `allow_update_branch` for fluid cascade across multi-PR sequences.
- **Auto-handoff retention rotation** (2026-05-04, S10): `.claude/hooks/auto-handoff.sh` now keeps only the most recent 50 breadcrumbs in `.handoff/auto/` (override via `AUTO_HANDOFF_KEEP_LAST=N`). First rotation 194→50 executed; pre-rotation backup at `~/.handoff-archive/heuresys-evo/auto-S10-20260504T132402Z.tar.gz`.
- **Cross-context behavioral layer `.claude/CLAUDE.md`** (2026-05-04, S10): project-scoped (~150 lines) embedding 15 sanitized behavioral rules from Enzo's global. Loaded by Claude Code CLI alongside global, available via git pull in cloud contexts where global is missing (claude.ai web, Antigravity, Cantieri AI cloud). No personal/network info exposed (repo PUBLIC).
- **Wiki external foundation imported** (2026-05-04, S10): 6 selected files (~112KB) from external Heuresys wiki:
  - `docs/strategy/HEURESYS_VISION.md` — vision/positioning, 7 pillars, 5 dimensions, quantitative claims (Ulrich 4×, Deloitte 63%)
  - `docs/strategy/THEORETICAL_FOUNDATIONS.md` — synthesis cross-source 7 pillars
  - `docs/strategy/EXTERNAL_FRAMEWORKS_REFERENCE.md` — reading list 18 academic/consulting frameworks
  - `docs/strategy/COMPETITIVE_LANDSCAPE.md` — comparison vs adjacent frameworks
  - `docs/20-architecture/knowledge-graph-esco.md` — ESCO KG schema with cardinality (14k skills, 126k relations, 4.5k crosswalk NACE)
  - `docs/30-developer/rbp-data-model.md` — 18 RBP tables with cardinality
  - Wikilinks `[[X]]` preserved as-is (resolution deferred S11), source attribution footer on each file.
- **Storybook deploy operational runbook** (2026-05-04, S10): `docs/runbooks/storybook-deploy.md` with trigger procedures, verification commands, permissions, concurrency, troubleshooting, future extensions (PR preview, Chromatic, required check options).
- **ADR-0019 NEW** (2026-05-04, S10): "Repository visibility flip (private → public) + branch protection enforcement". ~6KB documenting S9 flip rationale (CI billing exhausted) + S10 branch protection setup + workflow PR-driven default. Supersedes ADR-0005 (mirror privato come backup).

### Changed

- **Repository visibility: PRIVATE → PUBLIC** (2026-05-04, S9, ratified S10 with ADR-0019): `https://github.com/heuresys/heuresys-evo` now public. Pre-flip security verified with gitleaks (75 commits history, 0 leaks). Consequences: GitHub Actions unlimited (no future billing risk), branch protection now configurable for free, license decision pending.
- **`@anthropic-ai/sdk` 0.30.1 → 0.92.0** (2026-05-04, S10 PR #7): major bump (62 minor versions of evolution). Affected: `services/enrichment/src/clients/anthropic.ts` — only factory + model resolver, zero API call yet, no breaking change for current code. Future Phase 6+ handlers will use modern API (AsyncIterator streaming, prompt caching beta, typed tool calls, error subclasses).
- **`tailwind-merge` 2.6.1 → 3.5.0** (2026-05-04, S10 PR #8): major bump for Tailwind v4 support. Affected: `packages/ui/src/lib/cn.ts` — standard `twMerge(clsx(inputs))` helper, no API changes. Required for proper `tailwind-merge` semantics with Tailwind 4 utilities.
- **`pino-http` 10.5.0 → 11.0.0** (2026-05-04, S10 PR #6): major bump. Affected: `services/api-gateway/src/middleware/log.ts` — standard `pinoHttp({...})` factory pattern, no breaking observed.
- **GitHub Actions versions bumped** (2026-05-04, S10): `actions/checkout@4→6`, `actions/setup-node@4→6`, `actions/upload-artifact@4→7` (PRs #1, #2, #3).
- **Storybook group dev-deps bumped** (2026-05-04, S10 PR #10): 4 storybook packages updated.
- **TypeScript types group bumped** (2026-05-04, S10 PR #13): 2 `@types/*` packages updated.
- **Project documentation drift corrected** (2026-05-04, S10 PR #16): 16 files aligned to actual S10 state. Notable corrections:
  - `CLAUDE.md` root: API Gateway "NestJS" → **Express 5** (verified `services/api-gateway/package.json` has `express ^5.2.1`, no `@nestjs/*` deps)
  - `CLAUDE.md` root: Prisma "6" → **5.22** (bump 6/7 deferred per ADR-0009)
  - `CLAUDE.md` root: tests "130+" → **250** (S8 fix workspace + enrichment workspace added)
  - `README.md` root: `services/app` port "3000" → **3200** (matches actual systemd unit + nginx vhost)
  - `docs/decisions/0017-tenant-ontology-versioning.md` **renamed → 0020-** (resolves duplicate-0017 collision with 0017-design-system-v2-extended)
  - `docs/decisions/0003-auth-nextauth-v5-prisma.md` + `0005-github-mirror-private.md` marked **SUPERSEDED** with prominent headers
  - `docs/decisions/README.md` index 4 entries → **20 entries** (full ADR catalog)
  - `docs/decisions/0009-stack-version-strategy.md` npm audit "6 advisories" → **0 advisories** (S8 supply chain hardening reflected)
  - `docs/decisions/0016-cicd-strategy.md` branch protection "deferred post-MVP" → **ENFORCED S10** with full configuration
  - `docs/architecture/overview.md` services/app "/login + /dashboard" → **5 pages** + endpoint count
- **`.claude/skills/handoff/references/auto-handoff-hook.md`** (2026-05-04, S10): updated with retention rotation block + maintenance section.

### Security

- **Branch protection enforcement** (2026-05-04, S10): main now blocks force push, deletion, and direct push outside PR workflow. 7 required status checks (CI/Build/Security combined) gate every merge. Linear history enforced (no merge commits, only squash/rebase). Mitigation against accidental destructive operations + audit trail via PR descriptions.

### Fixed

- **`docs/decisions/0017` numbering collision** (2026-05-04, S10 PR #16): two ADRs created independently by Cantiere A and Cantiere B both used number 0017. The Tenant Ontology Versioning ADR renamed to `0020-tenant-ontology-versioning.md`, references in `0018-governance-audit-trail.md` updated. Prevents future ambiguity.

---

## [Unreleased] (pre-S10 entries below)

### Added (pre-S10)

- **`NEXT_PUBLIC_SHOW_DEV_HINT` env flag** (2026-05-04): opt-in flag for the `/login` "Dev seed: evo.dev / admin123" hint. Set to `1` only in local dev / staging. Default off in production. Documented in `services/app/.env.local.example`.
- **Brand Studio dev tool** (`/brand-studio`, 2026-05-03): Server Component gated by `SUPERUSER` role that mounts the existing `ThemeBuilderWizard` from `@heuresys/ui` and lets the user generate design tokens, preview them site-wide via a 24h cookie, and apply them to the project by writing `services/app/src/styles/active-theme.css` (imported by the root layout). Defense in depth via `assertSuperuser()` in every Server Action. CSS payload validated (size cap 8KB, regex blacklist) on both server and client. Audit header (username + timestamp) written into the generated CSS file.
- **`packages/ui` `ThemeBuilderWizard` `onChange` prop** (2026-05-03): optional callback that emits `ThemeBuilderState` on every internal state change. Non-breaking; lets consumers react to live state without waiting for the final Export action.
- **HTTPS for `www.heuresys.com` and `heuresys.com`** (2026-05-03): nginx vhost `/etc/nginx/sites-available/www.heuresys.com.conf` proxies `/` → `127.0.0.1:3012` (legacy frontend) and `/api/` → `127.0.0.1:8012` (legacy api-gateway, with `/api/X → /X` rewrite). Let's Encrypt ECDSA cert with `www` + apex SAN, auto-redirect HTTP→HTTPS. Activation script `scripts/enable-www-vhost.sh` (idempotent, DNS preflight, certbot integration).
- **Bucket-as-DB-git workflow** (architecture revision 2026-04-29): the OCI bucket `heuresys-evo-backups` becomes the SoT-as-git for the `.evo` DBMS. Object `latest.dump` = HEAD; timestamped objects = history. PC = SoT primario per i prossimi mesi. Working dir VM `~/heuresys-evo` è read-only (riceve pull, non pubblica). Soft-lock con version stamp impedisce push accidentali fuori sequenza.
- **`db/scripts/oci-config.sh`** — sourceable: helpers OCI (`oci_upload`, `oci_download`, `oci_promote_latest`, `oci_object_modified`), autodetect DBMS locale (pc-docker | vm-docker | vm-baremetal), adapter `pg_dump_target`/`pg_restore_target`/`psql_target` con MSYS path-translation fix e pg_dump v16 pinning, read-only WD enforcement (rifiuta push da WD #4).
- **`db/scripts/db-push.sh`** — pg*dump locale + upload OCI come `dump*<source>\_<UTC-TS>.dump`+ promote`latest.dump`. Soft-lock confronta `time-modified`bucket con`db/.last-pull-stamp`; rifiuta push se bucket più recente (override `--force`). Local retention 7.
- **`db/scripts/db-pull.sh`** — download `latest.dump` (o `--object-name N`) + pre-restore safety dump (rotating, keep 3) + drop+create + pg_restore + reapply grants + smoke checks (mig=222, NextAuth, employees populate). Aggiorna `.last-pull-stamp`.
- **`db/scripts/db-status.sh`** — read-only: confronto local DBMS vs bucket `latest.dump` con suggerimento (pull se bucket più recente).
- **`db/scripts/db-history.sh`** — read-only: tabella oggetti bucket sorted by date.
- **`db/scripts/evo-db`** — wrapper `evo-db {pull|push|status|history}`.
- **OCI CLI on PC** installato via `pip install --user oci-cli` (3.81.0) in `C:\Users\enzospenuso\AppData\Roaming\Python\Python312\Scripts\oci.exe`.

### Changed

- **Root `vitest.workspace.ts` → `vitest.config.ts`** (2026-05-04): migrated from removed `defineWorkspace` (vitest 2/3 helper) to `defineConfig({ test: { projects: [...] } })` (vitest 4 idiom). Added missing `services/enrichment` project — root `npx vitest run` now picks up all 250 tests (was 243, regression pre-S6).
- **`tsconfig.base.json` `files: []`** (2026-05-04): canonical TS marker for "this is a base config, not meant to be built standalone". Eliminates 24 spurious JSX errors when invoked with `tsc -p tsconfig.base.json`. CI typecheck (per-workspace) was always correct.
- **`/login` page copy**: removed unconditional dev seed hint, now gated by `NEXT_PUBLIC_SHOW_DEV_HINT=1`.
- **`packages/ui` `xlsx` → `exceljs`** (2026-05-03): `parseExcel` / `exportExcel` riscritte sopra `exceljs@^4.4.0` (Apache 2.0). Public API preservata. **BREAKING:** `exportExcel` è ora `Promise<void>` invece di `void` — zero callers attuali nel repo, nessun consumer impattato.
- **`vitest` 2.1.9 → ^4.1.0** (2026-05-03) in tutti e 5 i workspace + root. Pulls in `vite@7` + `esbuild>0.24.2`. Nessuna API breakage osservata in 250 test, solo 1 test ha richiesto annotazione esplicita generic `vi.fn<TFn>()`.
- **`heuresys-app.service` systemd unit** (2026-05-03): drop-in `build-mem.conf` con `NODE_OPTIONS=--max-old-space-size=4096` e `TimeoutStartSec=600` per evitare OOM su `npm run build` (services/app standalone build con 566 modelli Prisma + 180 components UI + brand-studio).
- **`evo.heuresys.com` nginx vhost** (2026-05-03): aggiunta `location /api/auth/` → `127.0.0.1:3200` (Next.js NextAuth) PRIMA della `location /api/` → `127.0.0.1:8200` (gateway Express). Senza questo block specifico, NextAuth handler veniva intercettato dal gateway, login impossibile.
- **CI workflows** (2026-05-03): aggiunto `npm install -g npm@11` prima di `npm ci` in `ci.yml`, `build.yml`, `security.yml` per allineare runtime al lockfile v3 generato da npm 11 locale (default GitHub-hosted runner è npm 10).
- **CI typecheck job** (2026-05-03): `NODE_OPTIONS=--max-old-space-size=4096` per evitare OOM nel job di tsc workspace `services/app`.
- **`CLAUDE.md` greenfield**: porte stack corrette (3200 frontend / 8200 api-gateway / 5432 Postgres bare-metal), nuovo blocco "Domini & routing" che mappa `evo.heuresys.com` (greenfield) vs `www.heuresys.com`+apex (legacy).
- **Schema unification 2026-04-29**: tutti e 3 i DBMS live (PC Docker, VM Docker 5433, VM bare-metal) ora condividono lo schema `.evo` (203 mig, max_v=222 con NextAuth). VM Docker 5433 riallineato via drop+restore da `latest.dump`.
- **`backup-and-rotate.sh`** demoted a nightly safety snapshot: object naming `dump_vm_baremetal_cron_<TS>.dump`, NON aggiorna `latest.dump` (SoT è il PC).
- **`db/README.md`** — riscritta sezione "Accesso al DBMS" → "Workflow OCI bucket-as-DB-git" con mappa working dir, comandi quick-ref, naming objects, retention.

### Deprecated

- **`db/scripts/{sync-replicas-ephemeral,align-replicas,check-freshness,replicas.config,install-freshness-task}`** — banner DEPRECATED 2026-04-29 aggiunto. Scadenza rimozione 2026-05-31. Sostituiti da `db/scripts/db-{push,pull,status,history}.sh`.
- **`db/scripts/bootstrap-pc-docker-evo.sh`** — banner LEGACY 2026-04-29: resta come tool greenfield one-shot, ma per refresh container esistente preferire `evo-db pull`.

### Removed

- **`xlsx@0.18.5`** dal `packages/ui` (2026-05-03): HIGH severity (Prototype Pollution + ReDoS) senza fix npm. Sostituito da `exceljs@^4.4.0`.
- **`gitleaks/gitleaks-action@v2`** (2026-05-03): richiede paid licence per org GitHub. Sostituito con install diretto della CLI v8.21.2.
- **PC Docker container `heuresys_evo_platform_db` (5433)** + volume `heuresys_evo_platform_db_data` (ridondante dopo schema unification).
- **VM cron `heuresys-evo-freshness`** (Mon 08:00 UTC) — coperto dal workflow `evo-db status` on-demand.
- **PC Task Scheduler `Heuresys-Evo-Sync`** — sostituito da workflow `evo-db pull/push` manuale.

### Security

- **npm audit reaches 0 vulnerabilities** (2026-05-04): closed remaining 5 vulns from S7 (3 low cookie + 2 moderate uuid):
  - `"exceljs": { "uuid": "^14.0.0" }` nested override (closes GHSA-w5hq-g745-h8pq buffer bounds in v3/v5/v6, exceljs 4.4.0 still pins uuid<14 transitively)
  - `"next-auth": { "cookie": "^0.7.0" }` + `"@auth/core": { "cookie": "^0.7.0" }` nested overrides (closes GHSA-pxg6-pf52-xh8x cookie name/path/domain out of bounds)
  - **Anonymous `/login` no longer leaks dev credentials**: hint `evo.dev / admin123` now hidden by default in production, requires `NEXT_PUBLIC_SHOW_DEV_HINT=1` opt-in for dev/staging.
- **Brand Studio defense in depth** (2026-05-03): role check (`SUPERUSER`) replicato in ogni Server Action (`assertSuperuser()`), oltre alla page-level guard. CSS payload validato (size cap 8KB, regex blacklist `</style|<script>`) sia server-side (al cookie set + file write) sia client-side (al cookie read + `<style>` apply). File writes su path fisso `services/app/src/styles/active-theme.css` (no path traversal). `style.textContent` invece di React unsafe HTML injection per evitare XSS.
- **npm overrides** (2026-05-03): pinned `postcss: ^8.5.10` (closes GHSA-qx2v-qp2m-jg93 XSS via `</style>`) e `uuid: ^14.0.0` (closes GHSA-w5hq-g745-h8pq buffer bounds in v3/v5/v6).
- **`vitest` 4.x bump** (2026-05-03): pulls in `esbuild>0.24.2`, closes GHSA-67mh-4wv8-2f99 (dev server CORS leak).
- **Cross-service AUTH_SECRET / NEXTAUTH_SECRET allineati** tra `services/app` e `services/api-gateway` per validazione JWT consistent (Auth.js v4 ↔ v5 family).

### Fixed

- **`evo.heuresys.com` login broken** (2026-05-03): nginx `location /api/` catturava anche `/api/auth/*`, instradando le request NextAuth all'API gateway Express invece che al Next.js handler. Risolto aggiungendo `location /api/auth/` con proxy specifico a `:3200` PRIMA di `location /api/`.
- **`services/api-gateway/.env` cross-service JWT broken** (2026-05-03): `AUTH_SECRET` e `NEXTAUTH_SECRET` erano EMPTY, impedendo al gateway di validare JWT emessi dal Next.js. Allineati con stesso valore di `services/app/.env`.
- **`services/app/.env` SUPERUSER tenant fallback** (2026-05-03): `DEFAULT_SUPERUSER_TENANT_ID` mancante in prod faceva sì che utenti SUPERUSER senza `employee_id` (es. `sysadmin`, `evo.dev`) atterrassero in sessione con `tenantId=''`. Settato all'UUID del tenant `Heuresys System`.
- **CI typecheck OOM** (2026-05-03): job tsc su `services/app` esauriva il default 2GB heap dopo l'aggiunta del brand-studio. Fix: env `NODE_OPTIONS=--max-old-space-size=4096` nel workflow.
- **CI `npm ci` rejecta lockfile** (2026-05-03): npm 10 (runner) non leggeva correttamente le overrides nel lockfile v3 generato da npm 11 (locale). Fix: pin `npm@11` in tutti e 3 i workflow prima di `npm ci`.
- **`vitest 4` typing breakage in test mocks** (2026-05-03): `Mock<Procedure | Constructable>` non assignable a signature concrete. Fix: annotazione esplicita `vi.fn<(args) => ret>()` in `services/app/src/lib/__tests__/authorize.test.ts`.

- **OCI `os object copy` bug** (`KeyError: 'config'`) bypassato in `oci_promote_latest` via re-upload del file locale come `latest.dump` (più semplice e affidabile).

- **`db/scripts/bootstrap-pc-docker-evo.sh`** (one-shot) — creates the `.evo` replica as a Docker container `heuresys_evo_db` on the PC: pulls `pgvector/pgvector:pg16` image, creates named volume `heuresys_evo_data`, restores the latest dump from the VM bare-metal leader via SCP+`pg_restore`. Idempotent guard refuses to overwrite an existing container without `--recreate`. Applies grants on all schemas with `ALTER DEFAULT PRIVILEGES FOR ROLE heuresys` (future-migration safe).
- **`db/scripts/sync-replicas-ephemeral.sh`** (orchestrator) — platform-aware (Windows/Linux/macOS) lifecycle for the weekly multi-DBMS sync. On Windows: starts Docker Desktop if down → starts required containers → runs `align-replicas.sh --align-all --force` → runs `check-freshness.sh` → stops containers → quits Docker Desktop with `--quit` graceful + force-kill fallback (Stop-Process on `Docker Desktop`, `com.docker.backend`, `com.docker.build`, `docker-sandbox`) when `--quit` doesn't fully shut down. Resource-conscious for low-RAM hosts. On Linux: doesn't touch the system docker daemon, only manages containers.
- **PC Task Scheduler `Heuresys-Evo-Sync`** (Mon 09:00 local) replaces previous `Heuresys-Evo-Align` and standalone `Heuresys-Evo-Freshness` PC. One weekly trigger that runs the full ephemeral pipeline.
- **Replica `.evo` on PC**: `pc-docker-evo` registered in `replicas.config.sh` as `evo` tribe replica. Docker container `heuresys_evo_db` on `localhost:5432`. After install verified aligned with leader: 203 mig, max_v=222_nextauth_tables, 4 tenants, 270 employees, 14011 esco_skills, vector indices ok, RLS ok, NextAuth tables present.
- **`db/scripts/test-restore.sh`** — disaster recovery rehearsal: restore latest backup dump to scratch DB, run 9 smoke checks (schema_migrations, tenants, employees, users, esco_skills, pgvector ext, vector indices, RLS policies, NextAuth tables), drop scratch. Exits 0 only if all checks pass. Picks the highest-version pg_restore available locally (forward-compatible with any pg_dump format). Bumps `maintenance_work_mem` to 256MB on scratch DB so ivfflat index rebuilds succeed.
- **VM cron `heuresys-evo-dr-rehearsal`** (Mon 04:00 UTC) — automated weekly DR rehearsal log to `~/heuresys-evo-dr-rehearsal.log`.
- **PC Task Scheduler `Heuresys-Evo-Align`** (Mon 09:00 local) — automated weekly replica alignment, runs `align-replicas.sh --align-all --force`. Log to `backups/local/align.log`.
- **OCI native lifecycle policy `delete-after-30-days`** on `heuresys-evo-backups` bucket (enabled, target=objects, 30 days). Replaces the client-side rotation fallback. Backed by IAM policy `heuresys-evo-backups-lifecycle` (root compartment) granting `manage object-family` to `objectstorage-eu-milan-1` service principal scoped to the single bucket.
- **OCI client-side rotation fallback** in `backup-and-rotate.sh` — kept in code, disabled by default (`OCI_RETENTION_ENABLED=0`). Re-enable only if native lifecycle is ever revoked.
- **Bootstrap step 0** in CLAUDE.md to acknowledge claude-mem `SessionStart` auto-injection as complementary backdrop to `.handoff/` curated state (no duplication of recap)
- **`Memory & tooling` section in CLAUDE.md** documenting the two complementary memory systems (`.handoff/` curated vs claude-mem auto-compressed) with note that `~/.claude-mem/` lives outside the repo
- **services/app — Next.js 16 SaaS dashboard** with NextAuth v5 sign-in (`/login`), protected `/dashboard` server component fetching live employee data from api-gateway, public landing (`/`), Auth.js middleware with Edge-safe config split
- **services/api-gateway — Express 5 + Prisma 5 + Auth.js (Express adapter)** with RLS-aware `/employees` paginated endpoint, `/health` DB ping, `/auth/*` ExpressAuth handler, JWT cross-service interop with shared AUTH_SECRET
- **packages/ui — design system** Button (cva, 6 variants, asChild via Radix Slot), Card (composable), Input (forwardRef), Toast (Radix-backed) + Storybook 9 (Vite framework) + cn() helper + Tailwind 4 globals.css with @theme tokens
- **Database migration 222** — NextAuth/Auth.js Prisma adapter tables (`account`, `session`, `verification_token`) with FK to `users(id)` ON DELETE CASCADE, indexes, and idempotency guards
- **`withTenant(tenantId, fn)` Prisma helper** wrapping queries in a transaction with `SET LOCAL app.current_tenant_id` for RLS-aware multi-tenant access (api-gateway)
- **Edge-safe NextAuth v5 config split** (`auth.config.ts` for middleware + `auth.ts` for handlers) to avoid Prisma in Edge runtime (services/app)
- **Prisma client isolation per service** via `output = "./generated/client"` to prevent workspace-hoist overwrite collisions
- **Two-phase Prisma schema prune script** (`scripts/prune-prisma-schema.sh`) reducing `db pull` output from 566 models to per-service allowlists (9 for api-gateway, 6 for app), automatically stripping dangling relation fields
- Cross-service authenticated session pattern (shared `AUTH_SECRET` + default cookie name `authjs.session-token`)
- Initial monorepo scaffold (services/marketing, app, api-gateway, enrichment, playground + packages/ui, shared)
- ADR-0001 PostgreSQL bare-metal architectural decision
- ADR-0002 testcontainers-node strategy for CI test database
- ADR-0003 NextAuth v5 + Prisma adapter for .evo auth strategy (Accepted)
- Bare-metal PostgreSQL 16.13 + pgvector 0.8.2 deployment scripts (Mac/Linux + Ubuntu OCI VM ARM64)
- Hardened restore-baseline.sh with FORCE RLS bypass + multi-schema ALTER OWNER + vector indices memory tuning
- Daily backup automation with retention 7 (`backup-and-rotate.sh` + cron via `install-cron.sh`)
- Dedicated `heuresys_backup` role (BYPASSRLS, read-only) for backup operations
- Multi-DBMS freshness check + replica alignment scripts (`check-freshness.sh`, `align-replicas.sh`, `replicas.config.sh`)
- Project-scoped `handoff` skill with wiki-factory patterns + auto-handoff hook
- CI workflow `ci.yml` (lint + typecheck + test with `--if-present`)
- Baseline schema human-readable + binary dump from v1 LIVE container (2026-04-27 snapshot, 367MB)
- Concrete code in `packages/shared` — Role enum (9 values + ROLE_RANK), permission helpers, Zod schemas (User, Employee, Tenant, Auth discriminated union, JwtPayload, SessionUser)

### Changed

- `services/marketing/package.json` declares `@heuresys/ui` workspace dependency (preparation for cross-service UI usage)
- `services/api-gateway/src/auth.ts` session callback now surfaces `id`, `username`, `role`, `tenantId` from JWT token (for cross-service interop with services/app sign-ins)
- Project CLAUDE.md extended with autonomous-execution mandate, Workflow Orchestration framework, Task Management practice (`tasks/todo.md`, `tasks/lessons.md`), and Core Principles (Simplicity First / No Laziness / Minimal Impact)

### Deprecated

- `services/app/src/middleware.ts` filename — Next 16 deprecated this convention in favor of `proxy.ts`. Functionality unchanged; rename pending.

### Removed

- Persistent SSH tunnel PC→VM (`Heuresys-Evo-PgTunnel` Task Scheduler + watchdog) and all `db/scripts/pg-tunnel-*.ps1` + `smoke-test-tunnel.mjs` scripts. Replaced by direct connection to Postgres bare-metal locale on PC port 5432 (install via `db/scripts/setup-local.sh` pending). Decision 2026-04-28 (Enzo).

### Fixed

- **MSYS path translation in Docker calls on Git Bash (Windows)** — `docker cp` and `docker exec` were passing `/tmp/...` paths into Win32 binaries which Git Bash silently rewrote to `D:\tmp\...` (host) or `C:/Users/.../Temp/...` (in-container). Fix: convert host-side path with `cygpath -w` before `docker cp`, prefix `docker exec pg_restore` with `MSYS_NO_PATHCONV=1` to leave the in-container path alone. Bug was hit during first `bootstrap-pc-docker-evo.sh` run.

- **Backup outage 2026-04-28** — daily backup at 03:00 UTC produced 0-byte dumps because the `heuresys_backup` role lacked SELECT on the new NextAuth tables (`account`, `session`, `verification_token`) created by migration 222. Root cause: `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO heuresys_backup` in `setup-vm.sh` / `setup-local.sh` was missing the `FOR ROLE heuresys` clause — the directive only applied to objects created by the `postgres` superuser, never by the application role that runs migrations. Fix: extended grant to all non-system schemas (`public`, `learning`, `analytics`) with explicit `FOR ROLE $DB_USER`. All future migrations will auto-grant SELECT to backup role.
- **`backup-and-rotate.sh` pg_dump version mismatch** — Debian's `/usr/bin/pg_dump` is a `pg_wrapper` symlink that auto-picks the highest installed Postgres version. The VM has v16 (server) + v18 (client only), so the wrapper chose v18 and produced custom-format dumps v1.16 which `pg_restore` v16 refuses with `unsupported version (1.16) in file header`. Pinned `pg_dump` to `/usr/lib/postgresql/16/bin/pg_dump` for guaranteed v1.15 (server-matching) format. New dumps are forward-compatible with any pg_restore ≥ 16.

### Security

- Logging redact configured in `services/api-gateway` (pino-http) for `Authorization`, `Cookie`, `Set-Cookie` headers
- Helmet middleware enabled on api-gateway with default CSP / strict-transport-security / frame-options
- Auth secrets read exclusively from environment (no hardcoded `AUTH_SECRET` or `DATABASE_URL` in source)

[Unreleased]: #
