# ADR-0027: Bare-metal test Postgres strategy

**Status**: Accepted
**Date**: 2026-05-10
**Authors**: Enzo Spenuso
**Supersedes**: ADR-0002 (testcontainers-node)

## Context

ADR-0002 (2026-04-27) proponeva `testcontainers-node` con immagine `pgvector/pgvector:pg16` per provisioning Postgres ephemeral nei test integration in CI. Tuttavia:

1. **Direttiva esplicita 2026-05-10 (S28)**: "no Docker in questo progetto" — runtime evo è bare-metal puro su `oracle-vm-default` (vedi ADR-0001 + ADR-0023). Niente Dockerfile, niente docker-compose.yml, niente container per servizi runtime. La direttiva si estende coerentemente al test strategy: test infra deve essere allineata al production stack.
2. **Implementazione testcontainers mai shipped**: in 13 giorni dallo status `Proposed` (2026-04-27 → 2026-05-10), il helper `packages/shared/test-utils/postgres-container.ts` non è stato implementato. Zero `@testcontainers/postgresql` in package.json. Zero test integration shipped. Decisione architetturale rimasta inerte.
3. **Coerenza dev/test/prod**: con bare-metal in dev (setup-local.sh) + bare-metal in prod (oracle-vm-default), introdurre Docker solo per test crea una eccezione operativa (richiede Docker daemon disponibile localmente + in CI runners) che nessun altro componente del sistema necessita.
4. **CI runners attuali** (GitHub Actions `ubuntu-24.04-arm`): supportano installazione bare-metal Postgres + pgvector via `apt`/script senza overhead container.

## Decision

Adottare **bare-metal Postgres** anche per test integration, sia in dev locale che in CI:

### In dev locale

- Postgres bare-metal installato via `db/scripts/setup-local.sh` (Mac/Linux) o `setup-vm.sh` (Ubuntu CI)
- DB di test separato da DB di sviluppo via convention `heuresys_test` (vs `heuresys_platform`)
- Helper `npm run db:reset:test` (già presente in package.json root) per reset rapido pre-suite
- `DATABASE_URL_TEST` env var punta a `postgresql://heuresys:heuresys@localhost:5432/heuresys_test`

### In CI (GitHub Actions)

```yaml
# .github/workflows/quality.yml — test:integration job
jobs:
  test-integration:
    runs-on: ubuntu-24.04-arm
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - name: Install Postgres 16 + pgvector
        run: |
          sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
          wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
          sudo apt-get update
          sudo apt-get install -y postgresql-16 postgresql-16-pgvector
          sudo systemctl start postgresql
          sudo -u postgres psql -c "CREATE USER heuresys WITH PASSWORD 'heuresys'; CREATE DATABASE heuresys_test OWNER heuresys; GRANT ALL ON DATABASE heuresys_test TO heuresys;"
      - name: Apply schema
        run: bash db/scripts/restore-baseline.sh
        env: { DATABASE_URL: 'postgresql://heuresys:heuresys@localhost:5432/heuresys_test' }
      - name: Run integration tests
        run: npm run test:integration
        env: { DATABASE_URL_TEST: 'postgresql://heuresys:heuresys@localhost:5432/heuresys_test' }
```

### Helper test scaffold

`packages/shared/test-utils/postgres-bare-metal.ts` (sostituisce `postgres-container.ts` di ADR-0002):

- Wrapper sopra `pg` client che usa `DATABASE_URL_TEST` o fallback `postgresql://heuresys:heuresys@localhost:5432/heuresys_test`
- Helper `getTestDB()`, `resetSchema()`, `loadFixtures()`
- Skip suite con `describe.runIf(process.env.DATABASE_URL_TEST)` se DB non disponibile (graceful local skip)

### Isolamento tra suite

- Pattern transaction-per-test: `BEGIN` start, `ROLLBACK` end di ogni test
- Per test che non possono usare transaction (es. trigger + COMMIT): namespace tenant_id distinto per suite (test-suite-A → tenant_id `aaa00000-...`, test-suite-B → `bbb00000-...`)
- Cleanup non necessario tra run (DB intero ricreato fra commit di CI con `bash db/scripts/restore-baseline.sh`)

## Alternatives considered

- **Restare su ADR-0002 testcontainers Docker** — rejected: viola direttiva "no Docker", richiede Docker daemon, introduce coupling a runtime container in flusso che non lo usa altrove
- **Service container Postgres in GitHub Actions YAML (`services: postgres: ...`)** — rejected: comunque container, comunque docker; viola direttiva
- **Mock totale del DB** — rejected: già scartato in ADR-0002, perdita totale di valore integration test
- **Postgres reale di staging persistent (managed o VM dedicata)** — rejected: costo + ops overhead per CI di basso volume; rimane opzione futura per test E2E pre-deploy

## Consequences

### Positive

- **Coerenza dev/test/prod**: bare-metal everywhere
- **Zero Docker dependency**: né nel repo, né in dev locale, né in CI runners
- **Performance**: install Postgres 16 + pgvector in CI ~30s (vs container start 5-10s ma container build/pull aggiuntivo)
- **Restore baseline standard**: stesso script `restore-baseline.sh` usato per dev e CI
- **Transaction isolation**: pattern industry-standard, no overhead container start

### Negative

- **CI step di install Postgres** ad ogni job (~30s) vs container reuse cross-suite (mitigabile via runner cache se serve)
- **Helper test ancora da implementare**: `packages/shared/test-utils/postgres-bare-metal.ts` è scaffold pending
- **No parallelizzazione cross-suite con DB separati**: stesso DB shared, isolation via transaction o tenant namespace (sufficiente per la scala attuale)

### Follow-ups

- Implementare helper `packages/shared/test-utils/postgres-bare-metal.ts`
- Aggiungere job `test-integration` in `.github/workflows/quality.yml` con step Postgres install
- Documentare convenzione transaction-per-test in `tests/README.md` quando il pattern è consolidato
- Decision review tra 6 mesi: se test integration diventano lenti (>5 min totali) valutare ottimizzazioni (template DB clone, Postgres logical replication snapshot)

## References

- ADR-0001 PostgreSQL bare-metal (decisione iniziale, stesso vincolo "no container")
- ADR-0002 testcontainers-node (Superseded — questo ADR sostituisce)
- ADR-0023 Promote bare-metal as SoT (2026-05-07, consolidamento bare-metal)
- `docs/_audit/2026-05-10-acquisition-audit/08-tech-debt-registry-consolidated.md` H11 (integration test gap)
