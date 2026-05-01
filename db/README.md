# db

Schema, migrations, seeds, baseline, e tooling operativo per PostgreSQL **bare-metal**.

## ⚠️ PostgreSQL è BARE-METAL

- Il DBMS gira su host (VM OCI o locale), **NON in container Docker**
- Vedi [ADR-0001](../docs/decisions/0001-postgresql-bare-metal.md) per la motivazione
- Connessione via env `DATABASE_URL=postgresql://user:pass@host:port/db` (porta default `5432`)
- `infra/docker-compose*.yml` **NON** contiene servizio Postgres — solo Redis, Nginx, monitoring

## Strategia migrations: baseline squash

Il progetto adotta un approccio **baseline-squash** invece di replay incrementale di migrations storiche:

- **`db/baseline/000_baseline_schema_v1_2026-04-27.sql`** — pg_dump SQL human-readable della v1 al 2026-04-27 (1.9MB, ricavato dal container Docker del v1 LIVE — 201 migrations applicate, max version 220, dati al 21/04)
- **`db/baseline/000_baseline_schema_v1_2026-04-27.manifest.txt`** — metadata della baseline (sha256, sizes, source, count migrations)
- **`backups/from-vm/platform_db.dump`** — pg_dump custom-format (367MB, **gitignored**) — fonte per il restore. Le versioni precedenti archivare in `backups/from-vm/archive/`
- **`db/migrations/0001_baseline.sql`** — placeholder marker che documenta la baseline (2026-04-27) e fa assertion runtime (pgvector + schema_migrations)
- **`db/migrations/0002_*`, `0003_*`, …** — future migrations incrementali pulite, applicate in ordine sopra la baseline

Le 201 migrations storiche del v1 (versioni 1-220) NON vengono replayed: sono già materializzate nel dump. Restano consultabili nel repo v1 (`D:\enzospenuso\Documents\GitHub\heuresys.com.evo\`) per audit/storia.

## Struttura

```
db/
├── README.md                         (this file)
├── baseline/
│   ├── 000_baseline_schema_v1_2026-04-27.sql        # pg_dump SQL (human-readable)
│   └── 000_baseline_schema_v1_2026-04-27.manifest.txt # list of 213 v1 migrations
├── migrations/
│   └── 0001_baseline.sql             # placeholder marker (no-op assertions)
├── seeds/
│   ├── 000_governance_data.sql
│   ├── canonical_users_leave_fixtures.sql
│   ├── ci_test_seed.sql
│   ├── prototype_*.sql               # sector-specific demo data
│   ├── seed_process_layer_*.sql
│   └── smart_seed_rtl_bank*.sql
├── scripts/
│   ├── setup-local.sh                # install Postgres + pgvector + role + DB (Mac/Linux)
│   ├── setup-vm.sh                   # same for Ubuntu 24.04 ARM64 (OCI VM)
│   ├── restore-baseline.sh           # pg_restore wrapper for the dump
│   ├── mark-baseline-applied.sh      # mark 0001_baseline as applied in schema_migrations
│   ├── backup.sh                     # pg_dump current state (timestamped)
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

The dump contains tables with **FORCE ROW LEVEL SECURITY** (multi-tenant isolation).
Restoring as the application role (`heuresys`) gets blocked by FORCE RLS during FK
validation and INSERTs — `pg_restore` ends with hundreds of errors and partial data
loaded.

Solution: the script runs `pg_restore` as the `postgres` superuser via Unix socket
(automatic bypass of all RLS, including FORCE), then runs an `ALTER OWNER` loop to
transfer ownership of every table/sequence/view/matview/function to `heuresys`. This
gives a clean restore + correct ownership in one shot.

The `restore-baseline.sh` script handles this automatically — you just run it.

## Troubleshooting

Lessons learned from the first VM restore:

- **`ERROR: must be owner of extension vector`** — innocuous; the `vector` extension
  was already installed by `setup-*.sh` (as postgres superuser), the dump just tries
  to re-create it. Restore continues normally.
- **`ERROR: unrecognized configuration parameter "transaction_timeout"`** — innocuous;
  this parameter exists in Postgres 17 but not 16. The dump was taken with a newer
  client. Restore continues normally.
- **`ERROR: memory required is 66 MB, maintenance_work_mem is 64 MB`** during
  CREATE INDEX on `esco_skills.embedding_*` — happens with ivfflat vector indices.
  The script bumps `maintenance_work_mem` to 256MB for the restore session
  (override via `MAINTENANCE_WORK_MEM` env).
- **`could not execute query: ERROR: query would be affected by row-level security
  policy`** — the dump is being restored as a non-superuser role with FORCE RLS
  active. Use `restore-baseline.sh` (which runs as postgres super), don't invoke
  `pg_restore` directly with the application role.
- **Dump file not readable by postgres user** (e.g., it's in `/home/<user>/`) — the
  script auto-detects this and copies the dump to `/tmp` with proper ownership before
  restore (cleaned up after).

## Obtaining the dump

The 379MB dump is gitignored. Get it via one of:

```bash
# Option A — copy from the v1 repo on this same machine
cp "D:/enzospenuso/Documents/GitHub/heuresys.com.evo/backups/from-vm/platform_db.dump" \
   backups/from-vm/platform_db.dump

# Option B — fresh dump from the production VM
ssh ubuntu@oracle-vm-default \
  'pg_dump --format=custom --compress=9 --no-owner --no-privileges \
    -U heuresys -d heuresys_platform' \
  > backups/from-vm/platform_db.dump

# Option C — scp from VM if dump is already there
scp ubuntu@oracle-vm-default:/path/to/platform_db.dump backups/from-vm/
```

## Adding new migrations (post-baseline)

Convention: numerated 4-digit progressive starting from `0002_*`. Examples:

```
db/migrations/0002_add_subscription_tier.sql
db/migrations/0003_index_employee_skills_lookup.sql
db/migrations/0004_drop_legacy_audit_trail.sql
```

Rules (industry standard, never compromised):
- Migrations sequentially numbered, **never modified after application**
- Each migration is a single SQL file, idempotent where possible
- For schema changes that need data backfill: split into two migrations (DDL first, DML second)
- For risky migrations (large table rewrites, locking): document risk + estimated time in a comment block at the top
- RLS policies always added in the migration that creates the table (never as afterthought)
- Mai includere dati cliente reali nei seeds; usare `db/seeds/canonical_*` o `prototype_*` con dati fittizi

## Backup

### Manual one-shot

```bash
bash db/scripts/backup.sh
# → backups/local/heuresys_platform_<timestamp>.dump (custom format, gzip-9 compressed)
```

### Automatic daily (cron)

```bash
bash db/scripts/install-cron.sh    # adds an entry to current user's crontab
# → daily at 03:00 UTC, runs db/scripts/backup-and-rotate.sh
# → keeps the most recent 7 backups (configurable via RETENTION_COUNT)
# → log file: ~/heuresys-evo-backup.log
```

### Why backup uses the `heuresys_backup` role

The application role `heuresys` is RLS-enforced (FORCE ROW LEVEL SECURITY on
multi-tenant tables). `pg_dump` running as that role can't read tenant data
without being in a tenant context — the dump fails with hundreds of
`permission denied` errors.

`setup-local.sh` and `setup-vm.sh` create a dedicated `heuresys_backup` role
with **BYPASSRLS** and **read-only** privileges. The backup scripts default to
this role (override via `DB_USER` env). It can read everything for backup
purposes but cannot write anything (defense in depth).

### Off-site upload (OCI Object Storage)

Currently `backup-and-rotate.sh` keeps backups locally only. The OCI Object
Storage upload section is commented in the script as a TODO — uncomment and
fill in `OCI_BUCKET` + `OCI_NAMESPACE` once a dedicated bucket exists.

Backups in `backups/local/` and `backups/from-vm/` are gitignored.

## Operational SQL

`db/scripts/sql/` contains one-off operational SQL imported from v1:
- `apply_canonical_users.sql` — apply canonical users seed against an existing DB (idempotent)
- `reassign_rtl_bank_ccnl.sql` — RTL bank CCNL reassignment (one-shot fix)

These are NOT migrations. Run them manually when needed:
```bash
psql -h localhost -U heuresys -d heuresys_platform -f db/scripts/sql/apply_canonical_users.sql
```

## Tests

`db/__tests__/migration-integrity.test.sh` validates that all migrations parse correctly and the schema is consistent. Run before committing new migrations:

```bash
bash db/__tests__/migration-integrity.test.sh
```

## Workflow OCI bucket-as-DB-git

Decisione architetturale 2026-04-29 (Enzo): il **PC Windows è il SoT primario** del DBMS `.evo` per i prossimi mesi (settimane / mesi prima del cutover production sulla VM). I 3 DBMS in vita usano lo **schema unificato `.evo`** (203 mig, max_v=222 con NextAuth — superset del legacy v1) e si sincronizzano tramite l'**OCI bucket `heuresys-evo-backups`** che funge da "git del database":

- **Inizio sessione**: `evo-db pull` → download `latest.dump` dal bucket → restore nel DBMS locale
- **Fine sessione**: `evo-db push` → pg_dump del DBMS locale → upload + promotion a `latest.dump`
- **Soft-lock**: `db-push.sh` confronta `time-modified` del bucket con il `.last-pull-stamp` locale; rifiuta push se bucket più recente (override con `--force`)
- **Last-write-wins**: limite consapevole, accettato perché Enzo lavora sequenziale single-dev

### Mappa working dir → DBMS → permessi bucket

| # | Working dir | DBMS | Bucket |
|---|---|---|---|
| 1 | `D:\enzospenuso\Documents\GitHub\heuresys.com.evo` (PC) | `pc-docker-evo` (Docker, 5432, condiviso con #2) | read+write |
| 2 | `D:\heuresys.com.evo` (PC) | stesso DBMS di #1 | read+write |
| 3 | `/home/ubuntu/heuresys.com.evo` (VM) | `vm-docker-v1` (Docker, 5433) | read+write |
| 4 | `/home/ubuntu/heuresys-evo` (VM) | `vm-baremetal-evo` (bare-metal, 5432) | **read-only** |

Working dir #4 è read-only by design: `db-push.sh` rifiuta esecuzione da quel path. Le scritture sulla VM bare-metal sono throwaway (verranno sovrascritte al prossimo `evo-db pull`).

### Comandi quick-reference

```bash
# Inizio sessione (qualunque working dir)
evo-db pull                # restore local DBMS dal bucket
evo-db status              # confronto local vs bucket

# Fine sessione (solo da WD con permesso write)
evo-db push                # dump + upload + promote latest.dump
evo-db push --no-promote   # upload timestamped storico, no promotion

# Storico
evo-db history             # lista tutti i dump nel bucket
```

### Naming objects nel bucket

| Object name | Significato | Da chi |
|---|---|---|
| `latest.dump` | mutabile, "HEAD" — dump più recente promosso | `evo-db push` (interactive) |
| `dump_<source>_<UTC-TS>.dump` | timestamped storico | `evo-db push` (interactive) |
| `dump_vm_baremetal_cron_<UTC-TS>.dump` | safety snapshot notturno (NON tocca latest.dump) | cron VM 03:00 UTC |

### Retention

- **Bucket**: lifecycle 30gg (native OCI, IAM policy `heuresys-evo-backups-lifecycle` attiva)
- **Locale**: 7 dump più recenti in `backups/local/` (rotation auto in `db-push.sh`)
- **Safety dumps** pre-restore (`safety_*.dump`): 3 più recenti

### Ruolo dei script `db/scripts/db-*.sh`

| Script | Cosa fa |
|---|---|
| `db-push.sh` | pg_dump locale + upload + promote `latest.dump` (con soft-lock) |
| `db-pull.sh` | download `latest.dump` + safety dump + drop/create + restore |
| `db-status.sh` | read-only: stato locale vs bucket + suggerimento |
| `db-history.sh` | read-only: lista oggetti bucket sorted by date |
| `oci-config.sh` | sourceable: helpers OCI + autodetect DBMS + adapter pg_dump/pg_restore |
| `evo-db` | wrapper user-friendly: `evo-db {pull\|push\|status\|history}` |

### Convenzione porte (post-2026-04-29)

| Endpoint | Cosa | Schema | Bucket |
|---|---|---|---|
| PC `localhost:5432` | container Docker `heuresys_evo_db` (SoT primario) | `.evo` unificato | rw |
| VM `localhost:5432` | bare-metal Postgres | `.evo` unificato | r |
| VM `localhost:5433` | container Docker `heuresys_evo_platform_db` | `.evo` unificato (era legacy v1, riallineato 2026-04-29) | rw |

PC port 5433 (vecchio container v1 PC) è stato **eliminato** il 2026-04-29 (ridondante post-unificazione).

### DR rehearsal

Il cron VM `Mon 04:00 UTC` esegue `db/scripts/test-restore.sh` che:
- Scarica l'ultimo dump dal bucket (incluso safety snapshot notturno)
- Lo restaura su un DB scratch
- Esegue 9 smoke check (mig, tenants, employees, esco_skills, pgvector, vector indices, RLS, NextAuth)
- Drop scratch
- Log a `~/heuresys-evo-dr-rehearsal.log`

Indipendente dal workflow `evo-db`. Garantisce che il bucket contenga sempre dump effettivamente restorable.

### Backup safety-net VM notturno

Cron VM `0 3 * * *` esegue `db/scripts/backup-and-rotate.sh` che:
- Fa pg_dump del bare-metal VM (versione "fotografata" del SoT, allineata via `evo-db pull` dell'utente)
- Local retention 7 in `~/heuresys-evo/backups/local/`
- Upload OCI come `dump_vm_baremetal_cron_<UTC-TS>.dump` (NON aggiorna `latest.dump`)

Funzione: backup ridondato off-site, indipendente da quando l'utente fa push esplicito.
