# Project state — heuresys.com.evo (greenfield `heuresys-evo`)

> Snapshot: 2026-05-04 (S10 close — branch protection + cascade Dependabot + doc audit/alignment + wiki ingest + cross-context CLAUDE.md + S11 plan) · Engine version: 0.5.4 · See `HANDOFF.md` for next steps · See `PROJECT-LOG.md` for history

## Overview

Greenfield rewrite della piattaforma SaaS B2B Heuresys (Organizational Intelligence & Workforce Orchestration), repo `heuresys-evo`, deployato su VM OCI bare-metal con systemd. **Stato applicativo**: 5 pagine Next.js (`/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio`) servite live su `https://evo.heuresys.com`, NextAuth v4 + cross-service JWT verso API gateway Express 5, RBP attivo (`SUPERUSER` gating su brand studio), 605 RLS policies + 326 RBP join-table active. **Stato infrastrutturale**: 3 systemd unit (`heuresys-app`, `heuresys-api-gateway`, `heuresys-enrichment`), nginx reverse proxy con cert Let's Encrypt, 2 vhost separati (`evo.*` greenfield + `www.*`/apex legacy), 250 test unit verdi (vitest 4), **0 vulns npm audit** (confermato anche post-S10 Lotto B major bumps).

Headline metric — sessione S10: **13 PR mergeati** in cascade auto-merge cleanly (zero intervento manuale post-trigger), **branch protection** attivata su `main` (7 required checks + linear history + no force push), **doc audit comprehensive** (89 file `.md` analizzati) + alignment fix (16 file con drift corretti), **wiki ingest selettivo** (6 file foundation), **cross-context behavioral layer** `.claude/CLAUDE.md` per coerenza in 5+ contesti (PC/Mac/VM/web/cloud).

Phase corrente: **Phase 5 cutover-prep complete** + **add-on dev tools** + **supply chain hardening complete (0 vulns)** + **S10 governance hardening (branch protection + cross-context behavior layer)**.

## Architecture

```
┌─ DNS ─────────────────────────────────────────────────────────────────────────┐
│   evo.heuresys.com   A → 80.225.82.207                                        │
│   www.heuresys.com   A → 80.225.82.207                                        │
│   heuresys.com (apex) A → 80.225.82.207                                       │
│   *.heuresys.com     CNAME → uixie.porkbun.com  (fallback parking, innocuo)   │
└─────────────────────────────────────┬─────────────────────────────────────────┘
                                      │ HTTPS :443 (Let's Encrypt)
                                      ▼
┌─ VM OCI oracle-vm-default (80.225.82.207, Ubuntu 24.04 ARM64) ────────────────┐
│                                                                                │
│  nginx 1.24.0                                                                  │
│  ├── evo.heuresys.com.conf (cert evo.heuresys.com)                            │
│  │     /api/auth/  → 127.0.0.1:3200  (NextAuth v4 in services/app)            │
│  │     /api/       → 127.0.0.1:8200  (rewrite /api/X → /X, gateway Express 5) │
│  │     /metrics    → deny + 404                                                │
│  │     /           → 127.0.0.1:3200  (Next.js SSR/SSG)                        │
│  └── www.heuresys.com.conf (cert www+apex SAN)                                │
│        /api/  → 127.0.0.1:8012  (rewrite, legacy Docker api-gateway)          │
│        /      → 127.0.0.1:3012  (legacy Docker frontend Next.js)              │
│                                                                                │
│  Greenfield (systemd, repo /home/ubuntu/heuresys-evo)                          │
│  ├── heuresys-app.service          :3200  Next.js 16 standalone               │
│  │     drop-in build-mem.conf: NODE_OPTIONS=4096, TimeoutStartSec=600         │
│  ├── heuresys-api-gateway.service  :8200  Express 5 + Prisma + Auth.js        │
│  │     env: AUTH_SECRET, NEXTAUTH_SECRET (cross-service JWT shared)           │
│  ├── heuresys-enrichment.service   (BullMQ worker, no public port)            │
│  └── PostgreSQL 16 bare-metal      :5432  (NON containerizzato, ADR-0001)    │
│                                                                                │
│  Legacy (Docker, repo /home/ubuntu/heuresys.com.evo)                           │
│  ├── heuresys_evo_frontend         :3012                                       │
│  ├── heuresys_evo_api_gateway      :8012                                       │
│  ├── heuresys_evo_platform_db      :5433  (pg container)                       │
│  ├── heuresys_evo_redis            :6379  (loopback only)                      │
│  └── heuresys_evo_enrichment       :8020  (loopback only)                      │
│                                                                                │
│  Monitoring                                                                     │
│  ├── heuresys-grafana              :3000                                       │
│  ├── heuresys-prometheus           :9090                                       │
│  ├── heuresys-postgres-exporter    :9187                                       │
│  └── heuresys-node-exporter        :9100                                       │
└────────────────────────────────────────────────────────────────────────────────┘

┌─ GitHub (heuresys/heuresys-evo PUBLIC dal S9) ────────────────────────────────┐
│                                                                                │
│  main (PROTECTED dal S10):                                                     │
│    7 required checks: lint, typecheck, test, build-workspaces,                │
│                        gitleaks, semgrep, npm-audit                           │
│    + linear history, no force push, no deletion                               │
│    + enforce_admins=false, allow_auto_merge=true, allow_update_branch=true    │
│                                                                                │
│  GitHub Pages (S10 NEW):                                                       │
│    https://heuresys.github.io/heuresys-evo/  — Storybook deploy preview       │
│    workflow: .github/workflows/storybook.yml (build su PR + deploy su main)   │
└────────────────────────────────────────────────────────────────────────────────┘
```

## Components

| Component                              | Status | Note                                                                                |
| -------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| `services/app` (Next.js 16)            | ✅      | `/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio` live su evo.heuresys.com  |
| `services/api-gateway` (Express 5+TS)  | ✅      | RLS aware, RBP enforced, 93 test contract. **Express 5, NON NestJS** (S10 fix CLAUDE.md drift) |
| `services/enrichment` (BullMQ)         | 🚧     | Worker scaffold, smoke handler `esco-match`, 7 test                                |
| `services/marketing`                   | ⏳     | Skeleton scaffold (port 3100 dev), no prod deploy                                   |
| `services/playground`                  | 🧊     | Stub, sandbox dev-only                                                               |
| `packages/ui`                          | ✅      | 180+ component, Storybook 9 (84 stories, S10 deploy preview live), 64 test, vitest 4 |
| `packages/shared`                      | ✅      | Role enum, Zod schemas, 70 test                                                     |
| `services/app/brand-studio` page       | ✅      | SUPERUSER-only, localStorage draft + cookie preview + file Apply                   |
| `services/app/login` dev hint gating   | ✅      | `NEXT_PUBLIC_SHOW_DEV_HINT=1` opt-in (S8). Anonymous prod load no longer leaks creds |
| nginx vhost `evo.heuresys.com`         | ✅      | HTTPS LE, `/api/auth/` + `/api/` + `/` proxied                                     |
| nginx vhost `www.heuresys.com` + apex  | ✅      | HTTPS LE (ECDSA, www+apex SAN), proxy a Docker legacy                              |
| systemd `heuresys-app.service`         | ✅      | drop-in NODE_OPTIONS=4096 + TimeoutStartSec=600                                    |
| systemd `heuresys-api-gateway.service` | ✅      | AUTH_SECRET allineato per cross-service JWT                                         |
| Cross-service JWT auth                 | ✅      | shared `AUTH_SECRET`+`NEXTAUTH_SECRET`, cookie `authjs.session-token`               |
| RBP framework                          | ✅      | 33 functional areas, 326 join-permissions, cache TTL 5min                           |
| RLS                                    | ✅      | 605 policies attive su tabelle tenant-scoped                                        |
| CI workflow `CI`                       | ✅      | npm@11 pinned, NODE_OPTIONS=4096 typecheck, lint+test green                         |
| CI workflow `Build`                    | ✅      | next build standalone green                                                         |
| CI workflow `Security`                 | ✅      | gitleaks CLI self-host + npm audit + semgrep                                        |
| CI workflow `Storybook Deploy`         | ✅ NEW S10 | Build su PR + deploy su main → GitHub Pages. URL `https://heuresys.github.io/heuresys-evo/` |
| **Branch protection on `main`**        | ✅ NEW S10 | 7 required checks + linear history + no force push + no deletion. enforce_admins=false. ADR-0019 |
| **Auto-handoff retention rotation**    | ✅ NEW S10 | `--keep-last 50` in `.claude/hooks/auto-handoff.sh` + first rotation 194→50 |
| **Cross-context CLAUDE.md**            | ✅ NEW S10 | `.claude/CLAUDE.md` con 15 regole sanitized + frontmatter sync date. Per coerenza behavior in PC/Mac/VM/claude.ai web/Antigravity/cloud |
| **Wiki external imported (selective)** | ✅ NEW S10 | 6 file foundation in `docs/strategy/` + `docs/20-architecture/` + `docs/30-developer/`. Wikilinks preserved, resolution deferred S11 |
| **S11 doc consolidation plan**         | ✅ NEW S10 | `.handoff/S11-doc-consolidation-plan.md` (236 righe executable, 13 atomi, 3 fasi, schema target Diátaxis) |
| Storybook                              | ✅      | 84 stories pubblicate live, vite 7.3.2                                              |
| Root `vitest.config.ts` (was workspace) | ✅ S8 | vitest 4 `defineConfig({test:{projects}})` idiom, picks up tutti 5 progetti (250 test) |
| `tsconfig.base.json`                   | ✅ S8 | `files: []` canonical base marker                                                   |
| Supply chain (npm audit)               | ✅      | **0 vulnerabilities** (S8 + S10 Lotto B major bumps non hanno regredito)         |

## Key files and paths

- `/home/ubuntu/heuresys-evo` — greenfield repo (questo). VM behind di 17 commit dopo S10.
- `/home/ubuntu/heuresys.com.evo` — legacy repo (Docker, separato)
- `/etc/nginx/sites-available/{evo,www}.heuresys.com.conf` — vhost
- `/etc/letsencrypt/live/{evo,www}.heuresys.com/` — cert
- `/etc/systemd/system/heuresys-{app,api-gateway,enrichment}.service` — units
- `/etc/systemd/system/heuresys-app.service.d/build-mem.conf` — drop-in OOM-fix
- `/var/log/heuresys-evo/app.log` + `app.err` — log app
- `services/app/src/app/login/page.tsx` — login page (S8 dev-hint gated)
- `services/app/src/app/brand-studio/{page,BrandStudioClient,actions}.ts(x)` — dev tool
- `services/app/src/app/_components/ThemePreviewInjector.tsx` — preview cookie reader
- `services/app/src/styles/active-theme.css` — generated by Apply, imported da layout
- `services/app/.env` — runtime env (AUTH_SECRET, DATABASE_URL, DEFAULT_SUPERUSER_TENANT_ID)
- `services/app/.env.local.example` — dev env template (S8: + NEXT_PUBLIC_SHOW_DEV_HINT)
- `services/api-gateway/.env` — runtime env (AUTH_SECRET cross-service)
- `scripts/enable-www-vhost.sh` — idempotent vhost activation
- `package.json` overrides (S8 + S10):
  - `postcss: ^8.5.10`, `uuid: ^14.0.0`
  - `exceljs: { uuid: ^14.0.0 }` (nested, S8)
  - `next-auth: { cookie: ^0.7.0 }` (nested, S8)
  - `@auth/core: { cookie: ^0.7.0 }` (nested, S8)
- `vitest.config.ts` (S8: was vitest.workspace.ts, migrated to vitest 4 idiom)
- `tsconfig.base.json` (S8: + `files: []`)
- `.github/workflows/{ci,build,security,storybook}.yml` — npm@11 pin + heap fix + Storybook deploy NEW S10
- `.claude/CLAUDE.md` — **NEW S10** cross-context behavioral layer (15 regole sanitized del global, ~150 righe)
- `.claude/hooks/auto-handoff.sh` — **S10 update** retention `--keep-last 50`
- `.handoff/S11-doc-consolidation-plan.md` — **NEW S10** S11 priority #1 executable plan
- `.handoff/snapshots/` — HANDOFF history (`HANDOFF-{date}.md`)
- `docs/decisions/0019-repo-visibility-flip-and-branch-protection.md` — **NEW S10** ADR
- `docs/decisions/0020-tenant-ontology-versioning.md` — **renamed S10** (was 0017, collision con 0017-design-system)
- `docs/runbooks/storybook-deploy.md` — **NEW S10** ops runbook
- Wiki imported S10:
  - `docs/strategy/HEURESYS_VISION.md`, `THEORETICAL_FOUNDATIONS.md`, `EXTERNAL_FRAMEWORKS_REFERENCE.md`, `COMPETITIVE_LANDSCAPE.md`
  - `docs/20-architecture/knowledge-graph-esco.md`
  - `docs/30-developer/rbp-data-model.md`

## Metrics

| Metric                            | Current   | Δ vs S9 (2026-05-04 04:00) |
| --------------------------------- | --------- | -------------------------- |
| Pages Next.js evo                 | 5         | (steady)                   |
| Endpoint Express evo (4xx-aware)  | 8+        | (steady)                   |
| RLS policies live                 | 605       | (steady)                   |
| RBP role-area-permission joins    | 326       | (steady)                   |
| Test totali (5 workspace)         | 250       | (steady)                   |
| `packages/ui` component count     | ~180      | (steady)                   |
| **Vulnerabilità npm audit**       | **0**     | (steady, anche post Lotto B major) |
| Workflow CI/Build/Security        | 3 ✅       | (steady)                   |
| **Workflow CI nuovi**             | **+1** Storybook Deploy | NEW S10 |
| Domini HTTPS attivi               | 3         | (steady)                   |
| systemd unit production           | 3         | (steady)                   |
| **PR mergeati S10**               | **13**    | +13 (Dependabot 8 + my 5)  |
| **ADR attivi**                    | **19+1**  | +1 (0019) + 1 renamed (0017→0020) |
| **Doc files `.md` totali**        | **~95**   | +6 wiki imported, +3 ADR/runbook NEW |
| **Branch protection**             | **ACTIVE** | NEW S10 (era assente)     |
| **GitHub Pages**                  | **ACTIVE** | NEW S10 (workflow source) |
| **Auto-merge enabled**            | **YES**   | NEW S10                    |
| Commit dalla S6                   | ~50       | +14 sessione corrente      |

## Backlog (overflow from HANDOFF priorities)

### Doc consolidation (NEW S11 priority #1)

- **Plan executable in `.handoff/S11-doc-consolidation-plan.md`** (236 righe, 13 atomi, 3 fasi, ~14h totali). Schema target: Diátaxis numbered + meta. Contiene decision tree per nuove doc, naming canonical, verification commands "Done when".

### Auth / supply chain

- **Migrazione next-auth v4 → v5 stable**: in attesa che next-auth pubblichi un release stable v5. Carry-forward S7→S10.
- **Bump Prisma 5.22 → 7 (architectural refactor)**: 6-8h paradigm shift. Carry-forward S7→S10.
- **Bump intermediate Prisma 5.22 → 6.19.2**: alternativa low-risk 1-2h. Decisione esplicita pendente da S8 (declassato a Reminder in S10).

### Brand Studio evolution

- **Asset library**: upload logo + favicon generator + OG image generator — M-L
- **Multi-brand DB persistence** (rifiutato S7 ma pronta da rispolverare): schema Prisma `BrandKit` + RLS + RBP area `BRAND_MANAGEMENT` — L, 1-2 settimane
- **Live theme apply su /dashboard reali**: server-side injection per evitare FOUC

### Operational

- ✅ **Auto-handoff breadcrumbs accumulati**: rotation `--keep-last 50` attivata in S10
- ✅ **TXT `_acme-challenge.heuresys.com`** Porkbun: rimossi in S10
- **Dependabot PRs**: tutti 8 PR aperti pre-S10 mergeati in S10. Backlog Dependabot a 0.
- **CodeQL / supply-chain audit periodico**: scheduled `Security` cron già attivo

### Dev tools / TOTP / OAuth

- **TOTP step in NextAuth** (Phase 3 deferred): non urgente
- **OAuth providers (Google / Microsoft)**: deferred a NextAuth v5 stable
- **services/enrichment AI handler reali** (S5+ target): pgvector + Anthropic SDK 0.92. Phase 6+ NEW Tier 1+ work.
- ✅ **Storybook publish CI**: implementato in S10 (PR #15) → live su GitHub Pages

### Wiki ingest follow-up (S11)

- **Wikilink resolution massa**: 367 link `[[X]]` → markdown links relativi. Richiede mapping completo wiki paths → evo repo paths
- **Frontmatter Obsidian cleanup**: rimuovere campi non usati (aliases, derived_from, sources)
- **4 file ontologici** (`raw/jsonld/*.jsonld`, `raw/yaml/*.ttl/.rdf`): ispezione + eventual ingest
- **Cherry-pick concepts mancanti**: `kg-graph-layer.md`, `taxonomy-ontology-semantics.md`, `seven-layer-architecture.md`, ecc.

### Phase 5 carry-forward

- **STOP-AUTONOMO-FINAL pre-5.12 go/no-go decision** (BLOCK 14 cutover-prep): tag `rtg/evo/phase5/ready-for-go-no-go` da emettere

### Documentation governance

- **P1-P10 canonical formulation** (open issue S10): discrepanza CLAUDE.md root vs governance-evo.md. Da consolidare in S11 doc consolidation
- **License decision repo public** (carry-forward S9): proprietary vs source-available vs OSS

## Open questions (mirror from HANDOFF)

- **License decision repo public**: opzioni (a) lasciare proprietary, (b) Source-Available, (c) OSS
- **ADR renumbering** (gap 0019/0020): lasciare gap o renumber sequenziale 0001-0019? Da decidere in S11 doc consolidation
- **next-auth v5 timing**: aspettare stable Q3-Q4 2026 o pinnare beta in staging?
- **claude-mem backup pulizia** + auto-handoff backup: cancellazione default 2026-05-11
- **Phase 5 cutover go/no-go decision** (carry-forward S6)
