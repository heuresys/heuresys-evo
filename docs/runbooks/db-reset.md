# Runbook: DB reset (test environment)

## Scenario

Il DB di test è in stato inconsistente (test data corrotta, migration parziali, fixture stale) e bisogna riportarlo a clean state.

## Prerequisiti

- `psql` client installato
- `DATABASE_URL_TEST` env var con credenziali del DB test (NON il production!)
- Role con permessi DDL sul database target

## Steps

```bash
cd /home/ubuntu/heuresys-evo

# Default DATABASE_URL_TEST se non settato
export DATABASE_URL_TEST="${DATABASE_URL_TEST:-postgresql://heuresys:heuresys@localhost:5433/heuresys_test}"

# Reset completo: DROP schema + replay migrations + seed minimal
npm run db:reset:test

# Oppure direttamente:
db/scripts/reset-test.sh
```

## Steps — solo re-seed (skip migrations)

Se le migrations sono già applicate e vuoi solo aggiornare i fixtures:

```bash
SKIP_MIGRATIONS=1 db/scripts/reset-test.sh
```

## Validation

```bash
# Conta tabelle nel public schema
psql "$DATABASE_URL_TEST" -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';"

# RLS coverage check
psql "$DATABASE_URL_TEST" -f db/scripts/rls-coverage.sql

# Vitest integration suite (richiede DATABASE_URL_TEST già settato)
DATABASE_URL_TEST="$DATABASE_URL_TEST" npm run test:integration
```

## Rollback

Il reset è destructive. Il rollback richiede un dump pre-reset:

```bash
# Pre-reset: salva backup
pg_dump "$DATABASE_URL_TEST" --format=custom > /tmp/heuresys_test_$(date +%Y%m%d_%H%M%S).dump

# Per ripristinare:
pg_restore --clean --if-exists --dbname="$DATABASE_URL_TEST" /tmp/heuresys_test_*.dump
```

## Common pitfalls

- **DATABASE_URL_TEST punta a production**: doppia verifica! Lo script droppa lo schema senza chiedere. Mai usare `DATABASE_URL` produzione qui.
- **Migration file ordine**: se aggiungi migration manualmente fuori da `db/migrations/`, non vengono applicate. Sempre usare `db/scripts/migrate.sh` o appendere a `db/migrations/`.
- **Concurrent connections**: lo schema drop fallisce se ci sono connection attive sul DB. Stoppa api-gateway e altri client prima.
- **Permessi BYPASSRLS**: il role del reset script deve avere `BYPASSRLS` (`heuresys_app_admin`), non l'app role.
