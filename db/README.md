# db

Schema, migrations, seeds, baseline, e tooling operativo per PostgreSQL **bare-metal**.

## ⚠️ PostgreSQL è BARE-METAL — niente container

- Il DBMS gira su host (VM OCI bare-metal o locale dev), **mai in container Docker**
- Vedi [ADR-0001](../docs/50-reference/decisions/0001-postgresql-bare-metal.md) (decisione iniziale) + [ADR-0023](../docs/50-reference/decisions/0023-promote-baremetal-as-sot.md) (promote bare-metal a SoT canonical)
- Connessione via env `DATABASE_URL=postgresql://user:pass@host:port/db` (porta default `5432`)
- Niente `docker-compose.yml`, niente `Dockerfile` per servizi runtime

## Strategia migrations: baseline squash

Il progetto adotta un approccio **baseline-squash** invece di replay incrementale di migrations storiche:

- **`db/baseline/000_baseline_schema_v1_2026-04-27.sql`** — pg_dump SQL human-readable della v1 al 2026-04-27
- **`db/baseline/000_baseline_schema_v1_2026-04-27.manifest.txt`** — metadata della baseline (sha256, sizes, source, count migrations)
- **`backups/from-vm/platform_db.dump`** — pg_dump custom-format (~370MB, **gitignored**) — fonte per il restore
- **`db/migrations/0001_baseline.sql`** — placeholder marker che documenta la baseline + assertion runtime (pgvector + schema_migrations)
- **`db/migrations/0002_*`, `0003_*`, …** — migrations incrementali pulite, applicate in ordine sopra la baseline
- **`db/seeds/phase16*_*.sql`** — additive evo-specific seed (post-baseline forward delta)

> **Cutoff date (audit L53 § 4.3)**: la tabella `schema_migrations` contiene 215+ entries (1-220 storiche v1 + N16 nuove post-cutoff S22/S23/S23-bis/S23-tris come `phase16a/b/c/d/e/f/g/h`). I file `.sql` in `db/migrations/` (8 file) + `db/seeds/` (35+ file dopo S23-tris) sono il SoT replicabile post-cutoff `2026-04-27`. Tutte le migration applicate **prima** del 2026-04-27 sono materializzate nel baseline dump (single source). Tutte le migration applicate **dopo** sono file separati nel repo (forward-only delta). Il drift "215 entries vs 8 files" è atteso e documentato qui.

## SAP shadow tables (audit L53 § 1.3)

50 tabelle senza primary key sono tutti **mirror cluster SAP HCM** (pa0000…pa2013, pb0001…pb4005, hrp1000…hrp5002, t001p…t771q, pcl1, pcl2, ext_pa\*, ext_pb\*). Read-mostly via composite key SAP (PERNR + INFOTYP + ENDDA). **Intentional design** — non aggiungere synthetic PK perché il cluster SAP non ne ha. Operazioni write avvengono solo via SAP delta-import job, mai dall'applicazione runtime.

## Struttura

```
db/
├── README.md                         (this file)
├── baseline/
│   ├── 000_baseline_schema_v1_2026-04-27.sql        # pg_dump SQL (human-readable)
│   └── 000_baseline_schema_v1_2026-04-27.manifest.txt # list of v1 migrations
├── migrations/
│   └── 0001_baseline.sql             # placeholder marker (no-op assertions)
├── seeds/
│   ├── 000_governance_data.sql
│   ├── canonical_users_leave_fixtures.sql
│   ├── ci_test_seed.sql
│   ├── prototype_*.sql               # sector-specific demo data
│   ├── seed_process_layer_*.sql
│   ├── smart_seed_rtl_bank*.sql
│   └── phase16*_*.sql                # additive evo-specific delta
├── scripts/
│   ├── setup-local.sh                # install Postgres + pgvector + role + DB (Mac/Linux)
│   ├── setup-vm.sh                   # same for Ubuntu 24.04 ARM64 (OCI VM)
│   ├── restore-baseline.sh           # pg_restore wrapper for the dump
│   ├── mark-baseline-applied.sh      # mark 0001_baseline as applied in schema_migrations
│   ├── backup.sh                     # pg_dump current state (timestamped)
│   ├── backup-and-rotate.sh          # daily cron: dump + retention rotate (7 daily)
│   ├── reset-test.sh                 # full reset Postgres test DB
│   ├── test-restore.sh               # weekly DR rehearsal (restore + 9 smoke check)
│   ├── rls-coverage.sql              # RLS audit query (used by lint:tenant-id)
│   └── sql/
│       ├── apply_canonical_users.sql
│       └── reassign_rtl_bank_ccnl.sql
└── __tests__/
    └── migration-integrity.test.sh
```

## Prerequisites

- **PostgreSQL 16+** installed on host (no container)
- **pgvector** extension (`postgresql-16-pgvector` on Debian/Ubuntu, `pgvector` formula on Homebrew)
- Available locally: `psql`, `pg_restore`, `pg_dump`
- Connection params via env (defaults match dev): `DB_HOST=localhost`, `DB_PORT=5432`, `DB_USER=heuresys`, `DB_NAME=heuresys_platform`, `PGPASSWORD=heuresys`

## Quick start (zero-to-running, 4 commands)

```bash
# 1) Install Postgres + pgvector + create role + create DB + enable extension
bash db/scripts/setup-local.sh        # macOS / Linux
# OR (on the OCI VM)
ssh ubuntu@oracle-vm-default 'bash -s' < db/scripts/setup-vm.sh

# 2) Restore the v1 baseline dump (full schema + production data)
bash db/scripts/restore-baseline.sh

# 3) Mark the baseline as applied in schema_migrations
bash db/scripts/mark-baseline-applied.sh

# 4) Apply any future migrations (0002_*, ...) on top of the baseline
npm run db:migrate
```

## Why `restore-baseline.sh` runs as `postgres` superuser

Il dump contiene tabelle con **FORCE ROW LEVEL SECURITY** (multi-tenant isolation).
Restore come application role (`heuresys`) viene bloccato da FORCE RLS durante FK validation e INSERT — `pg_restore` finisce con centinaia di errori e dati parzialmente caricati.

Solution: lo script esegue `pg_restore` come `postgres` superuser via Unix socket (bypass automatico di tutta RLS, including FORCE), poi fa `ALTER OWNER` loop per trasferire ownership di ogni tabella/sequence/view/matview/function a `heuresys`. Restore pulito + ownership corretto in un colpo.

## Troubleshooting

- **`ERROR: must be owner of extension vector`** — innocuo; estensione già installata da `setup-*.sh` (postgres superuser), il dump prova a re-create. Restore continua.
- **`ERROR: unrecognized configuration parameter "transaction_timeout"`** — innocuo; parametro Postgres 17, dump preso con client più nuovo. Restore continua.
- **`ERROR: memory required is 66 MB, maintenance_work_mem is 64 MB`** durante CREATE INDEX su `esco_skills.embedding_*` — happens with ivfflat vector indices. Lo script bumpa `maintenance_work_mem` a 256MB per restore session (override via `MAINTENANCE_WORK_MEM` env).
- **`could not execute query: ERROR: query would be affected by row-level security policy`** — restore stato eseguito con application role + FORCE RLS attivo. Usare `restore-baseline.sh` (gira come postgres super), non invocare `pg_restore` direttamente.
- **Dump file non readable da postgres user** (es. in `/home/<user>/`) — script auto-detecta e copia dump a `/tmp` con ownership corretto prima del restore (cleanup dopo).

## Obtaining the dump

Il dump (~370MB) è gitignored. Get via uno di:

```bash
# Option A — fresh dump from production VM
ssh ubuntu@oracle-vm-default \
  'pg_dump --format=custom --compress=9 --no-owner --no-privileges \
    -U heuresys -d heuresys_platform' \
  > backups/from-vm/platform_db.dump

# Option B — scp se già presente sulla VM
scp ubuntu@oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump \
  backups/from-vm/platform_db.dump
```

## Adding new migrations (post-baseline)

Convention: numbered 4-digit progressive starting from `0002_*`. Examples:

```
db/migrations/0002_add_subscription_tier.sql
db/migrations/0003_index_employee_skills_lookup.sql
db/migrations/0004_drop_legacy_audit_trail.sql
```

Rules (industry standard, never compromised):

- Migrations sequenzialmente numerate, **never modified after application**
- Each migration è single SQL file, idempotent dove possibile
- Per schema changes con data backfill: split in due migrations (DDL first, DML second)
- Per migration rischiose (large table rewrites, locking): documentare risk + estimated time in comment block all'inizio
- RLS policies always added nella migration che crea la tabella (mai come afterthought)
- Mai includere dati cliente reali nei seeds; usare `db/seeds/canonical_*` o `prototype_*` con dati fittizi

## Backup

### Manual one-shot

```bash
bash db/scripts/backup.sh
# → backups/local/heuresys_platform_<timestamp>.dump (custom format, gzip-9 compressed)
```

### Automatic daily (cron)

```bash
sudo crontab -e   # add: 0 3 * * * /home/ubuntu/heuresys-evo/db/scripts/backup-and-rotate.sh
# → daily at 03:00 UTC, runs db/scripts/backup-and-rotate.sh
# → keeps 7 daily + 8 weekly + 12 monthly (configurable via env)
# → log file: ~/heuresys-evo-backup.log
```

### Why backup uses the `heuresys_backup` role

Application role `heuresys` è RLS-enforced (FORCE ROW LEVEL SECURITY su tabelle multi-tenant). `pg_dump` con quel role non può leggere dati tenant senza tenant context — dump fallisce con centinaia di `permission denied`.

`setup-local.sh` e `setup-vm.sh` creano dedicato `heuresys_backup` role con **BYPASSRLS** + **read-only** privileges. Backup script default a questo role (override via `DB_USER` env). Può leggere tutto per backup ma non può scrivere niente (defense in depth).

### Off-site upload (OCI Object Storage) — DEFERRED

> **Carry-forward C4 audit ACQ-AUDIT-2026-05**: backup chain attualmente co-locato sulla stessa VM del DB (`/var/backups/heuresys-evo/`). DR off-site su bucket OCI **non yet provisioned**. Provisioning + script upload sono pianificati come prossimo lavoro infra (capex stimato €200/anno).

Backups in `backups/local/` e `backups/from-vm/` sono gitignored.

## Operational SQL

`db/scripts/sql/` contiene one-off operational SQL:

- `apply_canonical_users.sql` — apply canonical users seed against existing DB (idempotent)
- `reassign_rtl_bank_ccnl.sql` — RTL bank CCNL reassignment (one-shot fix)

Non sono migrations. Run manualmente quando serve:

```bash
psql -h localhost -U heuresys -d heuresys_platform -f db/scripts/sql/apply_canonical_users.sql
```

## DR rehearsal (test-restore weekly)

`db/scripts/test-restore.sh` esegue weekly DR rehearsal:

- Carica ultimo dump locale (`/var/backups/heuresys-evo/`)
- Restore su DB scratch
- 9 smoke check (mig, tenants, employees, esco_skills, pgvector, vector indices, RLS, NextAuth, audit_logs)
- Drop scratch
- Log a `~/heuresys-evo-dr-rehearsal.log`

Crontab attuale: `0 4 * * 1 /home/ubuntu/heuresys-evo/db/scripts/test-restore.sh` (Monday 04:00 UTC).

## Tests

`db/__tests__/migration-integrity.test.sh` valida che tutte le migrations parsino e che lo schema sia consistente. Run prima di committare nuove migrations:

```bash
bash db/__tests__/migration-integrity.test.sh
```

## Riferimenti

- ADR-0001 PostgreSQL bare-metal (decisione iniziale)
- ADR-0023 Promote bare-metal as SoT (consolidamento 2026-05-07, docker decommissioned definitivamente 2026-05-10)
- `docs/40-operations/dbms-backup-restore.md` — backup chain governance + restore procedure complete
- `docs/40-operations/dbms-mat-views-refresh.md` — mat views auto-refresh runbook
- `docs/40-operations/deploy-evo.md` — deploy bare-metal procedure
- `docs/40-operations/incident-runbook-evo.md` — incident response
