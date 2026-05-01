# Project state — heuresys.com.evo

> Snapshot: 2026-04-28 (S4 + S4-bis tooling close) · Engine version: 0.4.1 (4 priorities S3-S4 chiuse + claude-mem/claude-hud integration) · See `HANDOFF.md` for next steps

## Overview

`heuresys.com.evo` è il rebuild greenfield della piattaforma SaaS B2B Heuresys (Organizational Intelligence & Workforce Orchestration). Stato: **infrastruttura DBMS completa** + **3 servizi applicativi materializzati** (`services/marketing` skeleton, `services/api-gateway` runnable Express 5 + Prisma con RLS, `services/app` runnable Next.js 16 + NextAuth v5 con dashboard live), **1 design system funzionante** (`packages/ui` con 4 componenti + Storybook 9 build green), **1 package shared concrete** (`packages/shared` types/Zod/Role). **Cross-service authenticated session funzionante end-to-end**: services/app login → cookie shared con api-gateway → /employees con RLS isolation per tenant.

Headline: 28 commit, ~205 file in repo (escludendo node_modules), 222 schema_migrations su VM bare-metal `.evo`, 4 ADR (3 Accepted, 1 Proposed). Repo solo locale + sync VM via rsync (no GitHub remote — frozen). Memory tooling attivo: claude-mem v12.4.7 worker su :37777 + claude-hud integrato nello statusline.

Phase corrente: **Phase 1 — App bootstrap COMPLETO** (services/marketing ✅, services/api-gateway ✅, services/app ✅, packages/ui ✅, packages/shared ✅, ADR-0003 ✅). **Phase 2 — Auth completion + AI enrichment** (TOTP step, services/enrichment, test coverage).

## Architecture

```
┌─ PC Windows (D:\heuresys.com.evo\) ──────────────────────────────────────────┐
│                                                                                │
│  Repo .evo (~205 file, 26 commits)                                            │
│  ├── services/                                                                 │
│  │     marketing/    🟢 Next.js 16 SKELETON (build/dev verified S2)           │
│  │     api-gateway/  🟢 Express 5 + Prisma + Auth.js (S4) — port 8200         │
│  │     app/          🟢 Next.js 16 + NextAuth v5 + dashboard (S4) — port 3200 │
│  │     enrichment/   ⏳ STUB (S5+ target)                                     │
│  │     playground/   ⏳ STUB (sandbox dev-only, low priority)                 │
│  │                                                                             │
│  ├── packages/                                                                 │
│  │     shared/       🟢 Role enum + Zod schemas + permission helpers (S3)     │
│  │     ui/           🟢 Button/Card/Input/Toast + Storybook 9 (S4)            │
│  │                                                                             │
│  ├── db/                                                                       │
│  │     migrations/   0001_baseline + 222_nextauth_tables (S4)                 │
│  │     baseline/     v1 dump 2026-04-27 (367MB)                               │
│  │     scripts/      setup, restore, backup, freshness (9 scripts)            │
│  │                                                                             │
│  ├── docs/decisions/  0001+0003 Accepted, 0002 Proposed                       │
│  ├── scripts/migrate.sh                                                        │
│  └── .handoff/        HANDOFF/STATE/LOG/CHANGELOG + snapshots                 │
│                                                                                │
│  Task Scheduler:                                                               │
│       (no Heuresys-Evo task; workflow via manual `evo-db pull/push`)           │
│       HeuresysForensicAudit       (weekly, fuori scope, audit v1 legacy)       │
│                                                                                │
│  Docker Desktop:                                                               │
│       heuresys_evo_db (port 5432, .evo SoT primary, schema unificato)          │
│       heuresys_audit_db (port 5434, started weekly by HeuresysForensicAudit)   │
│       (heuresys_evo_platform_db PC eliminato 2026-04-29)                       │
│       (heuresys_evo_api_gateway, heuresys_evo_enrichment stopped — orphan)     │
│                                                                                │
│  Dev runs (when up):                                                           │
│       :3100 services/marketing                                                 │
│       :3200 services/app                                                       │
│       :6006 packages/ui Storybook                                              │
│       :8200 services/api-gateway                                               │
└────────────────────────────────────────┬───────────────────────────────────────┘
                                         │ SSH (oci_recovery_ed25519)
                                         ▼
┌─ VM OCI oracle-vm-default (80.225.82.207, Ubuntu 24.04 ARM64) ────────────────┐
│                                                                                │
│  ~/heuresys.com.evo/   ← v1 LIVE (clone GitHub, 8 containers UP)              │
│  ~/heuresys-evo/       ← .evo rebuild (rsynced from PC)                       │
│       ├── db/scripts/, db/migrations/                                          │
│       └── backups/local/ ← daily cron (current: 384MB)                        │
│                                                                                │
│  Postgres bare-metal :5432  ← .evo DBMS                                       │
│       DB heuresys_platform — 222 mig, 566 base tables in public,             │
│         270 employees (RTL Bank=158, EcoNova=26, SmartFood=82, Heuresys=4),  │
│         273 users (incl. new SUPERUSER `evo.dev` seed S4),                   │
│         account/session/verification_token NextAuth tables (mig 222)         │
│       RLS active on employees/users/tenants via app.current_tenant_id GUC    │
│                                                                                │
│  Cron: 5 entries (claudedoc hourly, v1 backup 02:00, MV refresh 03:00,       │
│        .evo backup-and-rotate 03:00 UTC = nightly safety snapshot,           │
│        .evo DR rehearsal Mon 04:00 UTC; check-freshness rimosso 2026-04-29)  │
└────────────────────────────────────────────────────────────────────────────────┘

Cross-service authenticated session (S4 wired):

  Browser → services/app:3200/login → Credentials (DB bcrypt) → JWT minted
                                                              ↓
                              authjs.session-token cookie (HttpOnly)
                                                              ↓
  Browser → services/app:3200/dashboard (SSR) → fetch :8200/employees with cookie
                                                              ↓
                       services/api-gateway @auth/express decode JWT
                       (shared AUTH_SECRET, same cookie name)
                                                              ↓
                       resolveTenant middleware reads token.tenantId
                                                              ↓
                       withTenant() Prisma transaction
                       SET LOCAL app.current_tenant_id = '<uuid>'
                                                              ↓
                       Postgres RLS policy filters employees by tenant_id
                                                              ↓
                       JSON {data, total, nextCursor} → dashboard renders

External:
  github.com/heuresys/heuresys.com.evo  (v1 repo, sourced for VM clone)
  github.com/heuresys/heuresys-evo — 🧊 FROZEN (no GitHub repo per .evo)
  OCI Object Storage:
       namespace=axlkznzapaek, region=eu-milan-1
       bucket=heuresys-evo-backups (Standard, NoPublicAccess)
       SoT bucket-as-DB-git: latest.dump = HEAD, dump_<source>_<TS>.dump = storico
       30gg lifecycle native attiva (commit 13a26cc), IAM policy heuresys-evo-backups-lifecycle
```

## Components

| Component | Status | Notes |
|---|---|---|
| Repo scaffold (services/, packages/, docs/, db/, infra/, prompts/) | ✅ | All directories + READMEs in place |
| `npm workspaces` config root | ✅ | package.json + package-lock.json |
| ADR-0001 (PostgreSQL bare-metal) | ✅ Accepted | docs/decisions/0001-* |
| ADR-0002 (DB testing strategy testcontainers-node) | 🚧 Proposed | Promote to Accepted when first integration test ships |
| ADR-0003 (NextAuth v5 + Prisma adapter) | ✅ Accepted | docs/decisions/0003-auth-nextauth-v5-prisma.md |
| CI workflow `ci.yml` | ✅ active | lint + typecheck + test with `--if-present` |
| CI workflow deploy-* stubs | 🧊 | `.example` files; blocked by GitHub remote frozen |
| `db/scripts/setup-vm.sh`, `setup-local.sh`, `restore-baseline.sh` | ✅ | Hardened, idempotent |
| `db/scripts/backup-and-rotate.sh`, `install-cron.sh` | ✅ | Cron installed on VM, OCI upload integrated |
| `db/scripts/check-freshness.sh`, `align-replicas.sh`, `replicas.config.sh`, `sync-replicas-ephemeral.sh`, `install-freshness-task.ps1` | 🧊 DEPRECATED 2026-04-29 | Banner aggiunto; rimozione fisica prevista 2026-05-31. Sostituiti da `db/scripts/db-{push,pull,status,history}.sh` |
| `db/scripts/bootstrap-pc-docker-evo.sh` | 🧊 LEGACY 2026-04-29 | Resta usabile per greenfield install (PC nuovo, container non esiste); per refresh esistente preferire `evo-db pull` |
| `db/scripts/test-restore.sh` (DR rehearsal) | ✅ S5 | Auto-restore latest dump to scratch DB + 9 smoke checks. Cron VM Mon 04:00 UTC |
| **`db/scripts/oci-config.sh`** | ✅ NEW S6 | Sourceable: helpers OCI + autodetect DBMS + adapter pg_dump/pg_restore + read-only WD enforcement |
| **`db/scripts/db-push.sh`** | ✅ NEW S6 | Push: pg_dump local + upload + promote `latest.dump`. Soft-lock con `.last-pull-stamp` |
| **`db/scripts/db-pull.sh`** | ✅ NEW S6 | Pull: download `latest.dump` + safety dump + drop/create + restore + smoke check |
| **`db/scripts/db-status.sh`** | ✅ NEW S6 | Read-only: stato locale vs bucket + suggerimento |
| **`db/scripts/db-history.sh`** | ✅ NEW S6 | Read-only: lista oggetti bucket sorted by date |
| **`db/scripts/evo-db`** | ✅ NEW S6 | Wrapper: `evo-db {pull\|push\|status\|history}` |
| **Schema unification 2026-04-29** | ✅ DONE | Tutti e 3 i DBMS live (`pc-docker-evo` PC, `vm-docker-v1` VM 5433, `vm-baremetal-evo` VM 5432) ora a 203 mig, max_v=222, schema unificato `.evo` |
| **PC SoT primario** | ✅ S6 | Workflow bucket-as-DB-git: `evo-db pull` inizio, `evo-db push` fine. Soft-lock + last-write-wins |
| **PC Docker `heuresys_evo_platform_db` (5433)** | 🗑️ REMOVED 2026-04-29 | Container + volume eliminati (ridondante post-unificazione schema) |
| `db/scripts/backup-and-rotate.sh` | ✅ S6 | Demoted a nightly safety snapshot: object naming esplicito `dump_vm_baremetal_cron_<TS>.dump`, NON aggiorna `latest.dump`. pg_dump v16 pinned (lesson commit 190fe9d) |
| `db/scripts/setup-{vm,local}.sh` grants | ✅ FIXED S5 | `ALTER DEFAULT PRIVILEGES FOR ROLE heuresys` on all schemas (was missing FOR ROLE → mig 222 broke backup) |
| `db/scripts/install-freshness-task.ps1` | ✅ | Heuresys-Evo-Freshness Mon 08:00 local |
| Cron `# heuresys-evo-freshness` on VM (0 8 * * 1) | ✅ | First run lunedì 2026-05-04 08:00 UTC |
| OCI bucket `heuresys-evo-backups` | ✅ | Created, NoPublicAccess, eu-milan-1 |
| OCI lifecycle policy 30-day delete | 🧊 | Blocked by IAM grant (manual via OCI Console) |
| `scripts/migrate.sh` | ✅ | 2-naming-convention runner, single-transaction |
| **VM bare-metal Postgres `.evo`** | ✅ | 16.13 + pgvector 0.8.2, **222 mig**, 566 tables, 273 users (incl evo.dev), 270 employees, 4 tenants |
| **Migration 222 NextAuth tables** | ✅ NEW S4 | `db/migrations/222_nextauth_tables.sql` — account/session/verification_token with FK CASCADE |
| Migration 221 (TOTP plain drop) | 🧊 | Pending TOTP backfill (1 user); aligned with TOTP impl in S5 |
| VM container v1 LIVE | ✅ | 8 containers UP (separate from .evo, untouched) |
| PC Docker v1 (replica) | ✅ | mig 220 |
| Baseline schema | ✅ | `db/baseline/000_baseline_schema_v1_2026-04-27.sql` (1.9MB) |
| Binary dump | ✅ | `backups/from-vm/platform_db.dump` 367MB (gitignored) |
| Skill `handoff` (project-scoped) | ✅ | .evo edition with snapshots/ |
| Auto-handoff hook | ✅ | Stop-event breadcrumb to `.handoff/auto/` |
| Memory project files | ✅ | 6 files in `~/.claude/projects/D--heuresys-com-evo/memory/` (added `feedback_autonomous_execution`) |
| **App `services/marketing/`** | 🟢 | Next.js 16.2.4 skeleton. 3 SSG pages. Wired with `@heuresys/ui` workspace dep (S4). |
| **App `services/app/`** | 🟢 NEW S4 | Next.js 16 + NextAuth v5 (5.0.0-beta.31) + Credentials (DB bcrypt) + RLS-aware dashboard fetching api-gateway :8200/employees. Edge-safe auth.config.ts split. Build 7.7s. Dev :3200. |
| **App `services/api-gateway/`** | 🟢 NEW S4 | Express 5 + @auth/express + Prisma 5 + Pino + Zod. `/health`, `/employees` paginated RLS-aware, `/auth/*` Express handler. `withTenant()` helper. Build 4s. Dev :8200. |
| App `services/enrichment/` | ⏳ | Stub package.json only — S5+ target (BullMQ + Anthropic) |
| App `services/playground/` | ⏳ | Stub package.json only — low priority sandbox |
| **Package `packages/shared/`** | 🟢 | Role enum + Zod schemas + permission helpers (S3) |
| **Package `packages/ui/`** | 🟢 NEW S4 | Button/Card/Input/Toast + Storybook 9 (Vite). 4 stories + autodocs. cva variants + Tailwind 4 @theme tokens. Build green. |
| Root `tsconfig.base.json` | ✅ | strict + noUncheckedIndexedAccess + ES2022 + Bundler resolution |
| **Prisma 5.22.0 LTS** | ✅ NEW S4 | Pinned in api-gateway + app. Each service generates client to `./prisma/generated/client` (isolation from workspace hoist) |
| **Cross-service session interop** | ✅ NEW S4 | Shared AUTH_SECRET + default cookie `authjs.session-token` + complementary callbacks. Verified end-to-end. |
| **CLAUDE.md autonomous-execution mandate** | ✅ NEW S4 | Codified mid-session: pipeline autonomy + verify-fix gate cycles + no scope cuts. Mirrored in `feedback_autonomous_execution.md` memory. |
| GitHub remote | 🧊 | Frozen — no GitHub repo (2026-04-27 user decision) |
| **claude-mem v12.4.7 plugin** | ✅ NEW S4-bis | enabled in `~/.claude/settings.json`, worker PID running on `http://localhost:37777`, SQLite + Chroma vector DB at `~/.claude-mem/`, 6 lifecycle hooks plugin-internal, `/mem-search` slash command available |
| **Bun runtime 1.3.13** | ✅ NEW S4-bis | required by claude-mem worker, installed in `~/.bun/bin/` (User PATH updated by installer) |
| **claude-hud activity lines integrated** | ✅ NEW S4-bis | appended to existing `statusline-command.sh` as 1-3 conditional lines (tools/agents/todos), backup `statusline-command.sh.bak-2026-04-28-pre-hud`, toggle `HUD_OFF=1` |
| **CLAUDE.md Bootstrap step 0** | ✅ NEW S4-bis | acknowledge claude-mem auto-injection at SessionStart as complementary to `.handoff/` curated state |

> Status taxonomy: ✅ done · 🚧 in progress · ⏳ planned · 🧊 frozen · ⚠️ broken · 🟢 functional

## Key files and paths

- `CLAUDE.md` (root) — project instructions + autonomous-execution mandate + Workflow Orchestration
- `.handoff/HANDOFF.md` — next session plan
- `.handoff/PROJECT-LOG.md` — full session journal (append-only)
- `.handoff/CHANGELOG.md` — Keep-a-Changelog user-facing
- `db/migrations/222_nextauth_tables.sql` — S4
- `services/api-gateway/src/auth.ts` — @auth/express config + cross-service session callback
- `services/api-gateway/src/db/pool.ts` — Prisma + `withTenant(tenantId, fn)` helper (uses GUC `app.current_tenant_id`)
- `services/api-gateway/scripts/prune-prisma-schema.sh` — 2-phase reusable prune (kept duplicated in services/app/scripts/)
- `services/app/src/lib/auth.ts` — full NextAuth v5 config with Credentials DB-bcrypt
- `services/app/src/lib/auth.config.ts` — Edge-safe NextAuth config (no Prisma) for middleware
- `services/app/src/middleware.ts` — Auth.js v5 middleware (rename to proxy.ts pending Next 16 deprecation)
- `services/app/src/app/dashboard/page.tsx` — server component fetching api-gateway employees with cookie forward
- `packages/ui/.storybook/main.ts` — `@storybook/react-vite` framework
- `packages/ui/src/components/{Button,Card,Input,Toast}.tsx` — design system primitives
- `docs/decisions/0001-postgresql-bare-metal.md`, `0002-database-testing-strategy-ci.md`, `0003-auth-nextauth-v5-prisma.md`
- `~/.claude/plans/noble-dazzling-gizmo.md` — plan multi-session S3-S5 (A1-A6 tutti chiusi)
- `~/.claude/projects/D--heuresys-com-evo/memory/feedback_autonomous_execution.md` — autonomy mandate persisted

## Metrics

| Metric | Value | Δ vs S3 |
|---|---|---|
| Total commits on `main` | 28 | +8 |
| Files in repo (excluding .git, node_modules, dump) | ~205 | +80 |
| node_modules size | ~1.1GB / ~950 packages | +540 packages |
| Bash scripts in `db/scripts/` | 9 | +0 |
| ADRs Accepted | 3 | +1 (ADR-0003) |
| ADRs Proposed | 1 | +0 |
| Active DBMS instances managed | 3 | +0 |
| DBMS migrations applied (VM bare-metal `.evo`) | 222 | +1 |
| Application services with concrete code | 3 (marketing, api-gateway, app) | +2 |
| Application services stubs | 2 (enrichment, playground) | -2 |
| Workspace packages with concrete code | 2 (shared, ui) | +1 |
| Open priorities in HANDOFF | 3 (TOTP, tests, enrichment) | -1 |
| Backup files current (PC, from-vm) | 1 (367MB) | +0 |
| Backup files on VM | 1 (384MB) | +0 |
| OCI bucket objects | 1 (384MB) | +0 |
| Cron entries on VM | 5 | +0 |
| PC scheduled tasks | 2 | +0 |
| Memory files in this project | 6 | +1 (feedback_autonomous_execution) |
| Container v1 UP on VM | 8 | +0 |

## Backlog (overflow from HANDOFF priorities)

### Auth completion (S5 follow-ups from A5)

- [ ] **TOTP step in Credentials.authorize** (M, ~2-3h) — decrypt totp_secret_encrypted + otplib verify; blocked by AES key source
- [ ] **Migration 221** (TOTP plain drop) (S, ~30 min) — requires backfill 1 user; align with TOTP impl
- [ ] **OAuth providers** (Google, Microsoft) (M, ~2h) — Account/Session/VerificationToken già in place
- [ ] **Migration 223** (users add email/emailVerified/name/image) (S) — pre-requisito OAuth signup; non bloccante per Credentials only

### Quality & hardening

- [ ] **Test coverage base** (L, ~4-6h) — Vitest scaffold pronto, 0 test scritti. Priorità: shared (Zod), api-gateway (employees + RLS), app (auth flow)
- [ ] **Test integration testcontainers-node** (M, ~2-3h) — sblocca ADR-0002 → Accepted
- [ ] **Runbook `docs/runbooks/auth-rls.md`** (S, ~1h) — pattern `withTenant()` + AUTH_SECRET sharing + debug RLS denial
- [ ] **2 vuln transitive postcss** (S) — non-fixable senza downgrade Next 16, monitoring only
- [ ] **Promote ADR-0002 Proposed → Accepted** (S) — quando il primo integration test ships

### Application development (Phase 2)

- [ ] **services/enrichment** (XL, multi-session) — BullMQ worker + Anthropic SDK + MCP client + enrichment_jobs/matches/merges
- [ ] **services/marketing pages reali** (M, ~3-4h) — hero, pricing, contact form, next-intl IT/EN
- [ ] **services/playground** (S, ~1h) — sandbox dev-only

### DX / cleanup

- [ ] **Rename `services/app/src/middleware.ts` → `proxy.ts`** (S, ~10 min) — Next 16 deprecation
- [ ] **Design tokens reali in `packages/ui`** (M, ~2-3h) — palette/typography/spacing definitivi (richiede brand definition)
- [ ] **Update plan file** (`~/.claude/plans/noble-dazzling-gizmo.md`) marcando A1-A6 chiusi

### Database / Operational

- [ ] **OCI lifecycle policy 30-day delete** — 🧊 blocked by IAM grant (manual via OCI Console)
- [ ] **Document backup restore procedure** (disaster recovery runbook)
- [ ] Verifica primo run cron backup VM (passive reminder, surface only on touch)

### Infrastructure / DevOps

- [ ] CI matrix strategy for multi-service tests
- 🧊 ~~Push `.evo` repo on GitHub~~ — frozen 2026-04-27
- 🧊 ~~Activate `deploy-*.yml.example`~~ — blocked by GitHub remote frozen

### Tooling / Skills

- [ ] Aggiornare skill `scaffold-fullstack-project` con pattern emersi (Edge-safe auth split, Prisma client isolation, 2-phase prune)
- [ ] Considerare skill `db-restore-from-baseline` riutilizzabile

## Open questions (mirror from HANDOFF)

- **Sorgente chiave AES per TOTP decrypt** (bloccante TOTP step in S5)
- **Brand definition per design tokens reali** in `packages/ui` (placeholder oklch attualmente)
- **Next.js 16 middleware → proxy rename** in services/app (cosmetic, deprecation warning)
- **NextAuth v5 ancora beta-31** (non GA): monitorare release stable, repin in S5

## Frozen decisions

- 🧊 **GitHub repo creation** (2026-04-27): no GitHub repo per .evo. Reminder solo on request.
