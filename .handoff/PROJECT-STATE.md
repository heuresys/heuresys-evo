# Project state — heuresys.com.evo (greenfield `heuresys-evo`)

> Snapshot: 2026-05-04 (S9 close — claude-mem tooling maintenance only, project state invariato da S8) · Engine version: 0.5.3 · See `HANDOFF.md` for next steps · See `PROJECT-LOG.md` for history

## Overview

Greenfield rewrite della piattaforma SaaS B2B Heuresys (Organizational Intelligence & Workforce Orchestration), repo `heuresys-evo`, deployato su VM OCI bare-metal con systemd. **Stato applicativo**: 5 pagine Next.js (`/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio`) servite live su `https://evo.heuresys.com`, NextAuth v4 + cross-service JWT verso API gateway Express, RBP attivo (`SUPERUSER` gating su brand studio), 605 RLS policies + 326 RBP join-table active. **Stato infrastrutturale**: 3 systemd unit (`heuresys-app`, `heuresys-api-gateway`, `heuresys-enrichment`), nginx reverse proxy con cert Let's Encrypt, 2 vhost separati (`evo.*` greenfield + `www.*`/apex legacy), 250 test unit verdi (vitest 4), **0 vulns npm audit**.

Headline metric — sessione S8: 5 → **0 vulns** chiuse end-to-end (uuid via exceljs + cookie via next-auth/@auth/core), 2 fix tooling drift pre-esistenti (vitest workspace S7 regression + tsconfig.base), Prisma 7 esplorato + deferito su valutazione tecnica (refactor architetturale 6-8h).

Phase corrente: **Phase 5 cutover-prep complete** + **add-on dev tools** + **supply chain hardening complete (0 vulns)**.

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
│  │     /api/       → 127.0.0.1:8200  (rewrite /api/X → /X, gateway Express)   │
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
```

## Components

| Component                              | Status | Note                                                                                |
| -------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| `services/app` (Next.js 16)            | ✅      | `/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio` live su evo.heuresys.com  |
| `services/api-gateway` (NestJS+Auth.js)| ✅      | RLS aware, RBP enforced, 93 test contract                                          |
| `services/enrichment` (BullMQ)         | 🚧     | Worker scaffold, smoke handler `esco-match`, 7 test                                |
| `services/marketing`                   | ⏳     | Skeleton scaffold (port 3100 dev), no prod deploy                                   |
| `services/playground`                  | 🧊     | Stub, sandbox dev-only                                                               |
| `packages/ui`                          | ✅      | 180+ component, Storybook 9 (84 stories), 64 test, vitest 4                         |
| `packages/shared`                      | ✅      | Role enum, Zod schemas, 70 test                                                     |
| `services/app/brand-studio` page       | ✅      | SUPERUSER-only, localStorage draft + cookie preview + file Apply                   |
| `services/app/login` dev hint gating   | ✅ NEW S8 | `NEXT_PUBLIC_SHOW_DEV_HINT=1` opt-in. Anonymous prod load no longer leaks creds   |
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
| Storybook                              | ✅      | 84 stories pubblicabili, vite 7.3.2                                                 |
| Root `vitest.config.ts` (was workspace) | ✅ NEW S8 | vitest 4 `defineConfig({test:{projects}})` idiom, picks up tutti 5 progetti (250 test) |
| `tsconfig.base.json`                   | ✅ NEW S8 | `files: []` canonical base marker, no spurious JSX errors when invoked standalone |
| Supply chain (npm audit)               | ✅ NEW S8 | **0 vulnerabilities** (era 5 in S7 close)                                         |

## Key files and paths

- `/home/ubuntu/heuresys-evo` — greenfield repo (questo)
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
- `package.json` overrides (S8 final state):
  - `postcss: ^8.5.10`, `uuid: ^14.0.0`
  - `exceljs: { uuid: ^14.0.0 }` (nested, S8)
  - `next-auth: { cookie: ^0.7.0 }` (nested, S8)
  - `@auth/core: { cookie: ^0.7.0 }` (nested, S8)
- `vitest.config.ts` (S8: was vitest.workspace.ts, migrated to vitest 4 idiom)
- `tsconfig.base.json` (S8: + `files: []`)
- `.github/workflows/{ci,build,security}.yml` — npm@11 pin + heap fix
- `.handoff/snapshots/` — HANDOFF history (`HANDOFF-{date}.md`)

## Metrics

| Metric                            | Current   | Δ vs S7 (2026-05-03) |
| --------------------------------- | --------- | -------------------- |
| Pages Next.js evo                 | 5         | (steady)             |
| Endpoint NestJS evo (4xx-aware)   | 8+        | (steady)             |
| RLS policies live                 | 605       | (steady)             |
| RBP role-area-permission joins    | 326       | (steady)             |
| Test totali (5 workspace)         | 250       | (steady)             |
| Test pickup via root vitest run   | **250**   | +7 (was 243, fix S8) |
| `packages/ui` component count     | ~180      | (steady)             |
| **Vulnerabilità npm audit**       | **0**     | **-5** (5 → 0)       |
| Workflow CI/Build/Security        | 3 ✅       | (steady)             |
| Domini HTTPS attivi               | 3         | (steady)             |
| systemd unit production           | 3         | (steady)             |
| Commit dalla S6                   | ~36       | +6 sessione corrente |
| Lock cleanup (lines removed S8)   | 79        | side-effect prune    |

## Backlog (overflow from HANDOFF priorities)

### Auth / supply chain

- **Migrazione next-auth v4 → v5 stable**: in attesa che next-auth pubblichi un release stable v5 (oggi: solo `5.0.0-beta.31` dopo anni). Quando esce stable: cambio cookie format (`authjs.session-token` → `__Secure-authjs.session-token`), JWT shape, callback signatures, refactor `proxy.ts`, sblocca OAuth providers Google/Microsoft. Carry-forward S7→S8.
- **Bump Prisma 5.22 → 7 (architectural refactor)**: dopo S8 esplorazione, l'effort è **6-8h** non 3h. Richiede: rimuovere `url` da `datasource db {}` in entrambi gli schema, creare `prisma.config.ts` per app + api-gateway, installare `@prisma/adapter-pg`, refactor `services/app/src/lib/db.ts` e `services/api-gateway/src/db/pool.ts` con `new PrismaClient({ adapter })`, regenerate client (output shape diverso da `prisma-client-js`), risolvere TS errors. Da fare su staging branch dedicato con E2E pesante. **NON** in fine sessione su prod live. Carry-forward S7→S8 (deferred S8).
- **Bump intermediate Prisma 5.22 → 6.19.2**: alternativa low-risk se non si vuole entrare in v7 paradigm. Mantiene `url` nello schema, mantiene `prisma-client-js`, drop Node 16 (abbiamo Node 20+). 1-2h effort. **DECIDERE** insieme se vale la pena di un intermedio prima di 7.

### Brand Studio evolution

- **Asset library**: upload logo + favicon generator + OG image generator (skill `favicon-generator` + `og-image-creator` riusabili) — M-L
- **Multi-brand DB persistence** (proposta MVP enterprise rifiutata da utente in S7, ma pronta da rispolverare): schema Prisma `BrandKit` + RLS + RBP area `BRAND_MANAGEMENT` — L, 1-2 settimane
- **Live theme apply su /dashboard reali** (oltre il preview cookie): server-side injection per evitare FOUC

### Operational

- **Auto-handoff breadcrumbs accumulati** in `.handoff/auto/`: 10+ in 24h durante S7, +5 durante S8. Valutare retention rotation (es. mantenere ultimi 50).
- **TXT `_acme-challenge.heuresys.com`** Porkbun: 2 record residui da vecchio DNS-01 challenge, innocui ma puliti
- **Dependabot PRs**: 4-5 PR aperti su Storybook/Anthropic SDK/pino-http — review e merge
- **CodeQL / supply-chain audit periodico**: scheduled `Security` cron già attivo (cron 17:03 UTC daily)

### Dev tools / TOTP / OAuth

- **TOTP step in NextAuth** (Phase 3 task 3.1-3.3 deferred owner-side): users con `totp_enabled=true` → secondo fattore via `users.totp_secret_encrypted` decrypt + otplib verify. Lavoro non urgente finché non si abilita TOTP per tenant clienti.
- **OAuth providers (Google / Microsoft)**: deferred a NextAuth v4. Si sblocca con la migrazione next-auth v5 stable.
- **services/enrichment AI handler reali** (S5+ target): smoke handler `esco-match` ha hardcoded map; la versione vera userà pgvector + Anthropic SDK. Phase 6 work.
- **Storybook publish CI** (deploy preview): 84 stories pronte ma non c'è ancora un job che pubblica chromatic / storybook-static su preview URL.

### Phase 5 carry-forward

- **STOP-AUTONOMO-FINAL pre-5.12 go/no-go decision** (BLOCK 14 cutover-prep): tag `rtg/evo/phase5/ready-for-go-no-go` da emettere; richiede deployment effettivo + esecuzione 4 script + decisione Enzo GO/NO-GO/CONDITIONAL.

## Open questions (mirror from HANDOFF)

- **Prisma 7 vs Prisma 6 intermediate**: vale la pena fare un bump intermediate a 6.19.2 prima di 7 (lower risk, 1-2h)? Oppure restare su 5.22 finché non c'è una sessione dedicata per il refactor 7?
- **next-auth v5 timing**: aspettare release stable (probabilmente Q3-Q4 2026)? Oppure pinnare un beta release specifico in branch staging come early adopter?
- **Auto-handoff retention**: enable rotation (max 50 file)? Aggiungere `--keep-last 50` allo script `auto-handoff.sh`?
- **Phase 5 cutover go/no-go**: rimasto pendente da S6. Tag `rtg/evo/phase5/ready-for-go-no-go` da emettere quando utente decide.
