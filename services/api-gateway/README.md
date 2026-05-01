# services/api-gateway

REST API service Heuresys — backend principale, gestione auth, business logic, accesso DB.

## Scope
- API REST consumate da `services/app` e `services/marketing`
- Auth: JWT + 2FA (otplib), session in cookie httpOnly
- Multi-tenant: RLS PostgreSQL + RBP framework (8 livelli ruolo)
- Rate limiting, validazione input (Zod), error handling centralizzato
- Swagger UI servito su `/api/docs`

## Stack target
- Express 5 + TypeScript
- PostgreSQL bare-metal via `pg` (connessione via `DATABASE_URL`)
- Redis (`ioredis`) per cache + `rate-limit-redis`
- Pino logging, Sentry, Prometheus metrics
- Helmet, CORS, compression, cookie-parser

## Deploy target
- VM OCI dietro Nginx reverse proxy
- Porta interna documentata in `infra/`

## Convenzioni
- Schema input validato con Zod prima di ogni handler
- Migrations gestite in `db/migrations/`, mai inline
- Secret SOLO da env, mai hardcoded
- Test: unit (`tests/unit/`) + integration (`tests/integration/`) con DB reale
