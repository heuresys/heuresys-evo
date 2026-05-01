# heuresys-evo

Piattaforma SaaS B2B di **Organizational Intelligence & Workforce Orchestration**: layer ontologico tra ERP, HR e BI. Greenfield rewrite del legacy `heuresys.com.evo`, hardened via Cantiere B (RTGB).

## Stato

| Component              | Stato         | Versione    | Note                                            |
| ---------------------- | ------------- | ----------- | ----------------------------------------------- |
| `services/api-gateway` | Active        | Express 5.2 | REST API, JWT via `@auth/express`               |
| `services/app`         | Active        | Next.js 16  | App Router, NextAuth v4.24                      |
| `services/enrichment`  | Scaffold      | —           | LLM worker, deferred (vedi RTG legacy 3.9-3.10) |
| `packages/shared`      | Active        | —           | DTO + Zod schemas                               |
| `packages/ui`          | In espansione | —           | Design system (RTGB B7)                         |
| `services/marketing`   | Archived      | 2026-05-01  | `archive/services-marketing-2026-05-01/`        |
| `services/playground`  | Archived      | 2026-05-01  | `archive/services-playground-2026-05-01/`       |

## Quick start

Prerequisiti:

- Node 20+ (`>=20.0.0`), npm 10+ (`>=10.0.0`)
- PostgreSQL 16 bare-metal (vedi [ADR-0001](docs/decisions/0001-postgresql-bare-metal.md))
- Redis 7+ (per BullMQ enrichment futuro)

Setup:

```bash
# Clone e install
git clone https://github.com/heuresys/heuresys-evo.git
cd heuresys-evo
npm install

# Copia env template (poi compila)
cp .env.example .env
cp services/app/.env.local.example services/app/.env.local

# Migrazioni DB (richiede DATABASE_URL settato)
db/scripts/migrate.sh

# Dev (parallel)
npm run dev
```

Servizi default:

- `services/api-gateway` → http://localhost:8200
- `services/app` → http://localhost:3000

## Architettura

Monorepo a 2 tier ([ADR-0006](docs/decisions/0006-monorepo-boundary.md)):

- `services/*` — applicazioni eseguibili (HTTP-only cross-service)
- `packages/*` — librerie pure (riusate dai services)

Authentication:

- Issuer cookie: `services/app` (NextAuth v4) → cookie `authjs.session-token` con AUTH_SECRET condiviso
- Reader cookie: `services/api-gateway` (`@auth/express` v0.12)
- Strategy: JWT only, no DB sessions
- Vedi [ADR-0007](docs/decisions/0007-auth-dual-system.md) e [ADR-0009](docs/decisions/0009-stack-version-strategy.md)

Multi-tenancy:

- Postgres RLS con `SET app.current_tenant_id = '<uuid>'` per transazione
- App principal `heuresys_app_user` (no BYPASSRLS), system `heuresys_app_admin` (BYPASSRLS) per migration/seed
- Vedi [ADR-0008](docs/decisions/0008-multi-tenant-rls-evo.md) e [ADR-0010](docs/decisions/0010-rls-coverage-strategy.md)

## Testing

```bash
npm run test                  # tutti i workspace, vitest
npm run test:integration      # richiede DATABASE_URL_TEST
npm run typecheck             # tsc --noEmit cross-workspace
npm run lint                  # eslint cross-workspace (best-effort)
npm run db:reset:test         # reset DB test, applicare migrations + seed minimal
```

## Hardening (Cantiere B)

Roadmap: [`/home/ubuntu/heuresys.com.evo/ROAD_TO_GLORY_EVO_HARDENING.md`](../heuresys.com.evo/ROAD_TO_GLORY_EVO_HARDENING.md)

Comandi giornalieri:

```bash
./scripts/hardening/next.sh     # cosa devo fare adesso?
./scripts/hardening/check.sh    # gate tier corrente
./scripts/hardening/done.sh     # commit + tag task
./scripts/hardening/status.sh   # dashboard HTML hardening progress
./scripts/hardening/rollback.sh # revert ultimo RTGB commit
```

State: `.rtg-state-evo/state.json` (gitignored). Dashboard: `.rtg-state-evo/dashboard.html`.

## Tag namespace

- `rtgb/init` — baseline iniziale
- `rtgb/phase<N>/done` — phase RTGB chiusa
- `rtgb/v1.0-evo-hardened` — milestone Cantiere B

## Documenti chiave

- [`docs/hardening/README.md`](docs/hardening/README.md) — entry point Cantiere B
- [`docs/decisions/`](docs/decisions/) — 15 ADR attivi (architettura + tradeoff)
- [`docs/guides/prisma-workflow.md`](docs/guides/prisma-workflow.md) — workflow DB
- [`docs/guides/onboarding.md`](docs/guides/onboarding.md) — developer setup step-by-step
- [`docs/guides/security.md`](docs/guides/security.md) — security baseline (B4)
- [`docs/runbooks/`](docs/runbooks/) — common operations

## License

UNLICENSED (proprietary). Repository privato.

## AI assistant context

This project uses Claude Code. See [CLAUDE.md](CLAUDE.md) for the assistant's persistent context.
