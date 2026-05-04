# Architecture overview

> Snapshot architettura post-RTGB Cantiere B. SoT decisioni: `docs/50-reference/decisions/`.

## Service topology

```
                       +---------------------+
                       |   Browser (client)  |
                       +----------+----------+
                                  |
                              HTTPS + cookie
                                  |
         +------------------------v-------------------------+
         |        services/app  (Next.js 16 App Router)     |
         |   - / (landing)                                  |
         |   - /login (client island login-form.tsx)        |
         |   - /dashboard (server component)                |
         |   - /showcase (UI components catalog)            |
         |   - /brand-studio (SUPERUSER theme designer)     |
         |   - proxy.ts (Edge middleware, getToken JWT)     |
         |   - lib/auth.ts (NextAuth v4 + Credentials)      |
         |   port :3200                                     |
         +------------------------+-------------------------+
                                  |
                  fetch w/ Cookie + X-CSRF-Token
                                  |
         +------------------------v-------------------------+
         |    services/api-gateway  (Express 5 + TS)        |
         |   - hardenedHelmet (CSP/HSTS/...)                |
         |   - rateLimit (general + /auth strict)           |
         |   - csrfHmac (HMAC-bound CSRF)                   |
         |   - cookieParser, cors, pino w/ request_id       |
         |   - metrics middleware -> /metrics               |
         |   - /auth/*  Auth.js Express                     |
         |   - /employees, /tenants, /perspectives,         |
         |     /audit-logs, /rbp-areas + others (8+)        |
         |   - /health, /health/ready, /metrics             |
         |   port :8200                                     |
         +-------+----------+-------------------------------+
                 |          |
   prisma client |          | structured logs (stdout)
                 v          v
         +-------------+   +----------------+
         | PostgreSQL  |   | journald/loki  |
         | bare-metal  |   +----------------+
         | (RLS, FORCE)|
         +-------------+
                 ^
                 |
         +-------+-----------+
         | services/enrichment (deferred, vedi RTG legacy 3.9-3.10) |
         +---------------------------------------------------------+
```

## Component graph (build-time deps)

```
            packages/shared (Zod schemas, role helpers)
              ^                       ^
              |                       |
   services/api-gateway       services/app
              |                       |
              v                       v
            PostgreSQL          @heuresys/ui (design system)
                                       ^
                                       |
                                  packages/ui (build-time only)
```

## Data flow: login + dashboard fetch

1. **GET /login** → server-rendered shell. Client island `LoginForm` mounts.
2. **POST credentials** (via NextAuth v4 client `signIn`) → `/api/auth/callback/credentials` route handler in services/app.
3. NextAuth invokes `authorizeCredentials(prisma, env, credentials)` → bcrypt compare against `users.password_hash`.
4. On success, mints JWT signed with `AUTH_SECRET`, sets `authjs.session-token` cookie (HttpOnly, SameSite=lax).
5. Browser navigates to `/dashboard`.
6. **Edge proxy.ts** runs `getToken({ req, secret, cookieName: 'authjs.session-token' })`. If valid, allow.
7. **Dashboard server component** runs `auth()` (`getServerSession(authOptions)`) to read JWT claims.
8. Dashboard fetches `/employees` from api-gateway, **forwarding the inbound Cookie**.
9. **api-gateway** request flow:
   - `pino-http` assigns/echoes `x-request-id`
   - `metricsMiddleware` records latency on res.close
   - `hardenedHelmet` sets security headers
   - `rateLimitGeneral` checks IP throttle
   - `csrfHmac`: GET/HEAD passes through
   - `requireAuth` middleware: `getSession(req, authConfig)` decodes the same `authjs.session-token` (shared `AUTH_SECRET`).
   - `validateQuery` Zod schema parses `?limit=&cursor=`.
   - `withTenant(jwt.tenantId, fn)` runs Prisma transaction with `SET app.current_tenant_id`.
   - PostgreSQL applies RLS automatically; only rows scoped to that tenant are returned.
10. Response serialized + 200 to browser.

## Cross-cutting concerns

| Concern              | Implementation                                          | ADR                |
| -------------------- | ------------------------------------------------------- | ------------------ |
| Auth (cross-service) | Shared AUTH_SECRET + cookie name `authjs.session-token` | ADR-0007, ADR-0009 |
| Multi-tenancy        | Postgres RLS + SET app.current_tenant_id                | ADR-0008, ADR-0010 |
| Security headers     | helmet hardened, CSP report-only                        | ADR-0012           |
| CSRF                 | HMAC-bound via /csrf endpoint                           | ADR-0012           |
| Rate limiting        | express-rate-limit (in-memory)                          | ADR-0012           |
| Observability        | Pino structured + Prometheus + health/ready             | ADR-0013           |
| Test coverage        | Vitest workspace + Playwright + jest-axe                | ADR-0011           |
| Design system        | Radix + CVA + Tailwind 4 OKLCH tokens                   | ADR-0014           |
| Services lifecycle   | Active/Scaffold/Archived per ADR-0015                   | ADR-0015           |

## External services

- **PostgreSQL 16 bare-metal**: ADR-0001, vector + RLS extensions
- **GitHub mirror**: `heuresys/heuresys-evo` PUBLIC (ADR-0019, S9-S10 — supersedes ADR-0005), CI workflows in `.github/workflows/`, branch protection attiva (7 required checks + linear history + no force push). Storybook deploy preview: `https://heuresys.github.io/heuresys-evo/`
- **Prometheus** (target deploy): scraperà `/metrics` su port :8200
- **Redis** (futuro): per BullMQ queue di `services/enrichment`

## Deployment target

VM OCI ARM64 Ubuntu 24.04 `oracle-vm-default` (80.225.82.207).

- bare-metal Postgres
- systemd o pm2 per process supervision
- nginx in front per TLS + reverse proxy

Multi-istanza horizontal scaling: deferred (richiede swap rate-limit a Redis-backed).

## Files & directories

| Path                                   | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| `services/api-gateway/src/middleware/` | helmet, csrf, rate-limit, log, metrics      |
| `services/api-gateway/src/routes/`     | health, auth, employees                     |
| `services/app/src/lib/`                | auth.ts (NextAuth), authorize.ts            |
| `services/app/src/app/login/`          | login page + client island                  |
| `services/app/src/app/dashboard/`      | dashboard + sign-out client island          |
| `services/app/src/proxy.ts`            | Edge middleware (Next.js 16)                |
| `packages/shared/src/schemas/`         | Zod schemas riusati                         |
| `packages/shared/src/auth/`            | role hierarchy helpers                      |
| `packages/ui/src/components/`          | 30+ design system components                |
| `packages/ui/src/styles/tokens.css`    | OKLCH design tokens                         |
| `db/migrations/`                       | append-only SQL migrations                  |
| `db/scripts/`                          | migrate.sh, reset-test.sh, rls-coverage.sql |
| `scripts/hardening/`                   | RTGB automation L3                          |
| `tests/fixtures/`                      | tenant + employee shared fixtures           |

## References

- [50-reference/decisions/](../50-reference/decisions/) — 21 ADR (3 superseded: 0003, 0005, 0019)
- [30-developer/](../30-developer/) — developer how-to (S11 ha consolidato `docs/guides/` qui)
- [40-operations/runbooks/](../40-operations/runbooks/) — operational playbooks
- [90-archive/hardening/](../90-archive/hardening/) — RTGB Cantiere B closure
