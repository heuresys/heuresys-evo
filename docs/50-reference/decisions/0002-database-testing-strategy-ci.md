# ADR-0002: Strategia di testing database in CI — testcontainers-node

**Status**: Superseded by ADR-0027 (2026-05-10) — bare-metal test Postgres strategy adottata in luogo di testcontainers Docker, coerente con direttiva "no Docker in progetto". Helper `packages/shared/src/test-utils/postgres-bare-metal.ts` shipped S28 Wave 5.
**Date**: 2026-04-27
**Authors**: Enzo Spenuso

## Context

Il workflow CI (`.github/workflows/ci.yml`, attivato in commit `5ef7c96`) include un job `test` che invoca `npm run test:integration` passando `DATABASE_URL` via secret `DATABASE_URL_TEST`. Al momento è uno stub: il secret non è configurato e i test integration non esistono ancora.

Quando il primo test integration verrà scritto (probabilmente in `services/api-gateway/` per validare un endpoint con accesso DB), serve una strategia chiara per fornire un PostgreSQL al CI.

Vincoli e forze:

- **Coerenza con ADR-0001** (PostgreSQL bare-metal in prod/dev) — la decisione "no container" si applica ai DBMS di produzione e sviluppo, NON ai DB effimeri usati per i test in CI. Il punto è: il DBMS che ospita dati operativi non è in container; il DBMS che esiste solo per la durata di un test sì può esserlo.
- **pgvector richiesto** — lo schema usa l'estensione vector (embeddings 1536-dim), quindi qualsiasi soluzione deve supportarla.
- **Determinismo** — i test devono essere riproducibili e isolati tra loro.
- **Parallelizzazione** — ideale poter eseguire test suite in parallelo senza interferenze.
- **Costo + complessità infra** — soluzioni che richiedono DB persistenti gestiti hanno overhead operativo significativo per il valore CI.
- **Velocità feedback** — il CI deve completare in tempi accettabili (≤ 5 min per pipeline tipica).

## Decision

Adottare **testcontainers-node** con l'immagine `pgvector/pgvector:pg16` come strategia primaria per i test integration in CI e in locale.

Implementazione concreta:

- `@testcontainers/postgresql` come devDependency in ogni service che ha test integration
- Helper condiviso in `packages/shared/test-utils/postgres-container.ts` per orchestrare lifecycle (start/stop, schema bootstrap, cleanup)
- Il container effimero è creato all'inizio di ogni suite (o per ogni test, configurabile), distrutto al termine
- Schema bootstrap: ogni container parte vuoto, il setup carica `db/baseline/000_baseline_schema_v1_2026-04-18.sql` + applica eventuali migrations `0002_*` successive
- `DATABASE_URL` viene impostato dal test setup, non da secret CI

Questa decisione **non viola** ADR-0001: i container effimeri di test sono concettualmente diversi dal DBMS di produzione/sviluppo. ADR-0001 governa "dove vivono i dati operativi", ADR-0002 governa "come isoliamo i test".

## Alternatives considered

- **Service container Postgres permanente nel workflow GitHub Actions** (`services: postgres: ...`) — un singolo container per tutta la durata del job, condiviso tra suite di test.
  - Pro: setup minimale (poche righe nel YAML), zero cost startup per suite
  - Contro: condivisione DB tra test richiede cleanup esplicito, no isolamento, no parallelizzazione di test suite, race condition se test scrivono dati concorrenti
  - **Rejected** per perdita isolamento.

- **DATABASE_URL_TEST verso un Postgres reale di test** (managed o su VM OCI dedicata).
  - Pro: ambiente più realistico (RLS reale, performance reale)
  - Contro: gestione operativa (provisioning, backup, cleanup), condivisione tra commit/branch parallelì = race condition, costo (managed) o ops overhead (VM dedicata), flakiness se DB di test diventa "sporco"
  - **Rejected** per costo operativo non giustificato dal valore CI; **rimane opzione** per test di staging pre-deploy se servirà un ambiente realistico.

- **Mock totale del DB** (in-memory layer, mock di pg client).
  - Pro: zero infra, test velocissimi
  - Contro: non sono più integration test, perdita totale del valore di validare query reali, RLS, vincoli FK; il bug più frequente in produzione è "lo schema diverge dal mock"
  - **Rejected** per perdita di valore — il mock va bene per unit test, NON per integration.

- **In-memory Postgres alternatives** (es. `pg-mem`, embedded Postgres).
  - Pro: velocità
  - Contro: nessuna implementazione supporta pgvector + RLS al livello di compatibilità richiesto dal nostro schema
  - **Rejected** per limiti tecnici.

## Consequences

### Positive

- Isolamento completo tra test suite (ogni suite ha il proprio Postgres effimero)
- Parallelizzazione senza coordinamento (Vitest/Jest possono lanciare suite in parallelo)
- pgvector supportato out-of-the-box dall'immagine `pgvector/pgvector:pg16`
- Coerente con ADR-0001 (i DBMS di prod/dev restano bare-metal; i container sono solo per CI/test)
- Pattern industry-standard, ampia adozione e documentazione

### Negative

- Overhead start container (~5-10s per suite) — mitigabile con suite più grandi
- Richiede Docker disponibile nell'ambiente CI (default su GitHub Actions Ubuntu) e in locale per dev
- Volume Docker ephemeral consuma I/O su CI runners — non significativo per dataset di test
- Bootstrap schema + migrations da eseguire per ogni container — richiede helper riutilizzabile

### Follow-ups

- Aggiungere `@testcontainers/postgresql` come devDependency in `services/api-gateway/` quando il primo test integration sarà scritto
- Implementare helper `packages/shared/test-utils/postgres-container.ts` con API: `startTestPostgres()`, `applyBaseline(client)`, `applyMigrations(client, fromIndex)`, `cleanup()`
- Aggiornare `.github/workflows/ci.yml` se necessario (l'attuale è già compatibile: `DATABASE_URL` viene settata dal test setup, non più da secret)
- Documentare convenzione test integration in `tests/README.md` quando il pattern è consolidato
- Decision review tra 6 mesi: se test integration diventano lenti (>2 min totali) valutare ottimizzazioni (container reuse cross-suite, snapshot prebuilt, Postgres template)
- Valutare opzione "Postgres reale di staging" SEPARATAMENTE per test pre-deploy (E2E, performance) — fuori scope di questo ADR
