# Project state — heuresys.com.evo (greenfield `heuresys-evo`)

> Snapshot: 2026-05-03 (S7 close — Brand Studio + Auth unblock + Domain HTTPS + Dependency hardening) · Engine version: 0.5.2 · See `HANDOFF.md` for next steps · See `PROJECT-LOG.md` for history

## Overview

Greenfield rewrite della piattaforma SaaS B2B Heuresys (Organizational Intelligence & Workforce Orchestration), repo `heuresys-evo`, deployato su VM OCI bare-metal con systemd. **Stato applicativo**: 5 pagine Next.js (`/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio`) servite live su `https://evo.heuresys.com`, NextAuth v4 + cross-service JWT verso API gateway Express, RBP attivo (`SUPERUSER` gating su brand studio), 605 RLS policies + 326 RBP join-table active. **Stato infrastrutturale**: 3 systemd unit (`heuresys-app`, `heuresys-api-gateway`, `heuresys-enrichment`), nginx reverse proxy con cert Let's Encrypt, 2 vhost separati (`evo.*` greenfield + `www.*`/apex legacy), 250 test unit verdi (vitest 4), 5 vulns npm residue (3 low + 2 moderate, 0 high).

Headline metric — sessione S7: brand studio shipped + login sbloccato + domini consolidati + 12→5 vulns + 11 commit pushati.

Phase corrente: **Phase 5 cutover-prep complete** (operational state, deploy infra production-ready) + **add-on dev tools** (brand-studio gated by SUPERUSER).

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
| `services/app` (Next.js 16)            | ✅      | `/`, `/login`, `/dashboard`, `/showcase`, `/brand-studio` live su evo.heuresys.com |
| `services/api-gateway` (NestJS+Auth.js)| ✅      | RLS aware, RBP enforced, 93 test contract                                          |
| `services/enrichment` (BullMQ)         | 🚧     | Worker scaffold, smoke handler `esco-match`, 7 test                                |
| `services/marketing`                   | ⏳     | Skeleton scaffold (port 3100 dev), no prod deploy                                   |
| `services/playground`                  | 🧊     | Stub, sandbox dev-only                                                               |
| `packages/ui`                          | ✅      | 180+ component, Storybook 9 (84 stories), 64 test, vitest 4                         |
| `packages/shared`                      | ✅      | Role enum, Zod schemas, 70 test                                                     |
| `packages/ui` ThemeBuilderWizard       | ✅      | 10 step wizard, OKLCH engine, +`onChange` prop                                     |
| `services/app/brand-studio` page       | ✅ NEW  | SUPERUSER-only, localStorage draft + cookie preview + file Apply                   |
| nginx vhost `evo.heuresys.com`         | ✅      | HTTPS LE, `/api/auth/` + `/api/` + `/` proxied                                     |
| nginx vhost `www.heuresys.com` + apex  | ✅ NEW  | HTTPS LE (ECDSA, www+apex SAN), proxy a Docker legacy                              |
| systemd `heuresys-app.service`         | ✅      | drop-in NODE_OPTIONS=4096 + TimeoutStartSec=600                                    |
| systemd `heuresys-api-gateway.service` | ✅      | AUTH_SECRET allineato per cross-service JWT                                         |
| Cross-service JWT auth                 | ✅      | shared `AUTH_SECRET`+`NEXTAUTH_SECRET`, cookie `authjs.session-token`               |
| RBP framework                          | ✅      | 33 functional areas, 326 join-permissions, cache TTL 5min                           |
| RLS                                    | ✅      | 605 policies attive su tabelle tenant-scoped                                        |
| CI workflow `CI`                       | ✅      | npm@11 pinned, NODE_OPTIONS=4096 typecheck, lint+test green                         |
| CI workflow `Build`                    | ✅      | next build standalone green                                                         |
| CI workflow `Security`                 | ✅      | gitleaks CLI self-host + npm audit + semgrep                                        |
| Storybook                              | ✅      | 84 stories pubblicabili, vite 7.3.2                                                 |

## Key files and paths

- `/home/ubuntu/heuresys-evo` — greenfield repo (questo)
- `/home/ubuntu/heuresys.com.evo` — legacy repo (Docker, separato)
- `/etc/nginx/sites-available/{evo,www}.heuresys.com.conf` — vhost
- `/etc/letsencrypt/live/{evo,www}.heuresys.com/` — cert
- `/etc/systemd/system/heuresys-{app,api-gateway,enrichment}.service` — units
- `/etc/systemd/system/heuresys-app.service.d/build-mem.conf` — drop-in OOM-fix
- `/var/log/heuresys-evo/app.log` + `app.err` — log app
- `services/app/src/app/brand-studio/{page,BrandStudioClient,actions}.ts(x)` — dev tool
- `services/app/src/app/_components/ThemePreviewInjector.tsx` — preview cookie reader
- `services/app/src/styles/active-theme.css` — generated by Apply, imported da layout
- `services/app/.env` — runtime env (AUTH_SECRET, DATABASE_URL, DEFAULT_SUPERUSER_TENANT_ID)
- `services/api-gateway/.env` — runtime env (AUTH_SECRET cross-service)
- `scripts/enable-www-vhost.sh` — idempotent vhost activation
- `package.json` overrides: `postcss: ^8.5.10`, `uuid: ^14.0.0`
- `.github/workflows/{ci,build,security}.yml` — npm@11 pin + heap fix
- `.handoff/snapshots/` — HANDOFF history (`HANDOFF-{date}.md`)

## Metrics

| Metric                            | Current   | Δ vs S6 (2026-04-29) |
| --------------------------------- | --------- | -------------------- |
| Pages Next.js evo                 | 5         | +2 (showcase + brand-studio) |
| Endpoint NestJS evo (4xx-aware)   | 8+        | (steady)             |
| RLS policies live                 | 605       | (steady)             |
| RBP role-area-permission joins    | 326       | (steady)             |
| Test totali (5 workspace)         | 250       | +5                   |
| `packages/ui` component count     | ~180      | (steady) +84 stories |
| Vulnerabilità npm audit           | **5**     | -7 (12 → 5, no high) |
| Workflow CI/Build/Security        | 3 ✅       | Security riparato (era ❌) |
| Domini HTTPS attivi               | **3**     | +2 (www + apex)      |
| systemd unit production           | 3         | (steady)             |
| Commit dalla S6                   | ~30       | +11 sessione corrente|

## Backlog (overflow from HANDOFF priorities)

### Security / supply chain

- **Migrazione next-auth v4 → v5** (closes 3 low cookie vulns + adotta Auth.js v5 family come gateway già usa) — ~M, 2-3h
- **Bump exceljs / uuid nested** per chiudere 2 moderate residue (uuid in `exceljs/node_modules/uuid` non catturato da override root) — S, 30min
- **Rimuovere hint dev `evo.dev / admin123`** dalla pagina `/login` — XS, 5min
- **Bump Prisma 5.22 → 7** (notice nei log; major migration, richiede docs read) — M, 2-3h

### Brand Studio evolution

- **Asset library**: upload logo + favicon generator + OG image generator (skill `favicon-generator` + `og-image-creator` riusabili) — M-L
- **Multi-brand DB persistence** (proposta MVP enterprise rifiutata da utente in S7, ma pronta da rispolverare): schema Prisma `BrandKit` + RLS + RBP area `BRAND_MANAGEMENT` — L, 1-2 settimane
- **Live theme apply su /dashboard reali** (oltre il preview cookie): server-side injection per evitare FOUC

### Operational

- **Pulizia `.env.bak`** e `nginx*.conf.bak-*` files se non più necessari come rollback
- **systemd drop-in revert?** se Prisma 7 ottimizza il build heap, possiamo abbassare NODE_OPTIONS a default
- **TXT `_acme-challenge.heuresys.com`** Porkbun: 2 record residui da vecchio DNS-01 challenge, innocui ma puliti
- **Dependabot PRs**: 4-5 PR aperti su Storybook/Anthropic SDK/pino-http — review e merge
- **CodeQL / supply-chain audit periodico**: scheduled `Security` cron già attivo (cron 17:03 UTC daily)

### Phase 5 carry-forward

- **STOP-AUTONOMO-FINAL pre-5.12 go/no-go decision** (BLOCK 14 cutover-prep): tag `rtg/evo/phase5/ready-for-go-no-go` da emettere; richiede deployment effettivo + esecuzione 4 script + decisione Enzo GO/NO-GO/CONDITIONAL.

## Open questions (mirror from HANDOFF)

- **next-auth v5 migration timing**: la sessione apertura è significativa (cookie format, JWT shape, callback signatures). Valutare se farla all'interno di una sessione dedicata o in concomitanza con bump Prisma 7.
- **Brand Studio DB-backed evolution**: il path è chiaro (schema + RBP area + RLS + audit), ma utente ha esplicitamente preferito tenerlo dev-tool. Riaprire la discussione SOLO se richiesto.
- **`.env.bak` files retention policy**: conservarli per N giorni post-fix, oppure rimuoverli subito che il fix è verificato in prod?
- **Auto-handoff hook**: `.handoff/auto/` ha 10+ breadcrumbs in 24h (normale uso intensivo). Vale la pena abilitare retention rotation (es. mantenere ultimi 50)?
- **Hint dev `evo.dev / admin123`**: utente non ha autorizzato la rimozione in S7 (fuori scope). Va prioritizzata in S8 prima di esporre il sito ad audience non interna.
