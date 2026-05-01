# Prisma workflow (RTGB B2)

> Greenfield evo uses **introspection** (`prisma db pull`) as source of truth, not Prisma Migrate. The DB schema is owned by the SQL migrations in `db/migrations/`; Prisma is a typed query client mirroring that schema.

## Flow

```
db/migrations/*.sql   ←  authoritative DDL (psql)
        │
        ▼
   psql apply        →  Postgres state
        │
        ▼
   prisma db pull    →  prisma/schema.prisma (services/<svc>/)
        │
        ▼
   prisma generate   →  @prisma/client typings
```

## Daily commands (per service)

From the repo root, when iterating on a service that owns a Prisma schema:

```bash
# 1. Apply SQL migrations (canonical via db/scripts/migrate.sh)
DATABASE_URL=... db/scripts/migrate.sh

# 2. Pull DB schema into Prisma
cd services/api-gateway   # or services/app
npx prisma db pull --schema=prisma/schema.prisma

# 3. Optional: prune (remove tables not used by this service from schema)
./scripts/prune-prisma-schema.sh   # see services/api-gateway/scripts/

# 4. Regenerate client
npx prisma generate
```

## Verify in sync (RTGB B2.1)

`scripts/hardening/prisma-verify.sh <workspace>` performs a temp `db pull` and diffs against the committed `schema.prisma`. Exits non-zero on drift.

```bash
DATABASE_URL=... ./scripts/hardening/prisma-verify.sh services/api-gateway
```

Wired as a husky pre-commit gate (B2.2) only when `schema.prisma` is staged — it's expensive otherwise.

## RLS coverage (RTGB B2.3)

`db/scripts/rls-coverage.sql` enumerates tenant-aware tables and validates the RLS pattern (see ADR-0008/0010):

```bash
psql "$DATABASE_URL" -f db/scripts/rls-coverage.sql
```

Pass criteria: every tenant-aware table has `rls_enabled = true`, `force_rls = true`, ≥ 1 policy, and a policy referencing `current_setting('app.current_tenant_id')`.

## Why introspection, not Migrate

- The legacy `.com.evo` already standardised on raw SQL migrations + introspection. The greenfield retains this convention to ease future model porting from legacy.
- `prisma migrate` would require letting Prisma own the migration history, which conflicts with hand-written DDL that includes RLS policies, triggers, and `pgvector` indexes that Prisma cannot fully introspect / generate.
- Pull-based generation keeps `schema.prisma` slim (filtered via prune script per service).

## Pitfalls

- **Forgetting to set `DATABASE_URL`** before running `db pull` → silent failure or wrong target. Always export it explicitly.
- **Different schemas per service** (api-gateway vs app) → run prune so each service's `schema.prisma` only declares the models it actually uses.
- **RLS during `db pull`**: the introspection runs as the connecting role. Use the BYPASSRLS role (`heuresys_app_admin`, see ADR-0008) for full schema visibility.

## References

- ADR-0008 multi-tenant RLS
- ADR-0010 RLS coverage strategy
- ADR-0004 bucket-as-db git workflow
- `db/scripts/migrate.sh` — canonical migration runner
- `services/api-gateway/scripts/prune-prisma-schema.sh`
