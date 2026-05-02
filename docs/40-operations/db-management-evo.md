# DB Management — evo PostgreSQL 16 bare-metal

DBMS applicativo evo: **bare-metal PostgreSQL 16** su VM `oracle-vm-default`, listening su `127.0.0.1:5432`.
Database: `heuresys_platform` (greenfield, popolato 1:1 da legacy via baseline-squash).
Container `heuresys_evo_platform_db:5433` = **legacy data only**, non scrittura applicativa.

## Connessione

```bash
# Admin (peer auth, no password — solo da VM)
sudo -nu postgres psql -d heuresys_platform

# Applicativo (password auth, da VM o tunnel)
psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform     # password in ~/.pgpass

# Tunnel SSH da workstation
ssh -L 15432:127.0.0.1:5432 oracle-vm-default
psql -h 127.0.0.1 -p 15432 -U heuresys -d heuresys_platform
```

`~/.pgpass` (chmod 600): `127.0.0.1:5432:heuresys_platform:heuresys:<password>`. Mai loggare la password in script o in `psql -W`.

## Backup manuale

### Dump compresso single-file

```bash
DUMP=/tmp/evo-$(date +%Y%m%dT%H%M).dump
pg_dump -h 127.0.0.1 -p 5432 -U heuresys -Fc -Z 6 -f "$DUMP" heuresys_platform
ls -lh "$DUMP"

# Verifica integrità (lista contenuto senza restore)
pg_restore -l "$DUMP" | head -20
```

Flag chiave:

- `-Fc` = custom format (compresso, supporta restore selettivo `-t`/`-n`)
- `-Z 6` = zstd-equivalent compression level 6 (bilanciato)
- Mai `-Fp` (plain SQL) per backup — solo per debug/migration manuale

### Dump globals (ruoli, tablespaces) separato

```bash
sudo -nu postgres pg_dumpall --globals-only > /tmp/evo-globals-$(date +%Y%m%d).sql
```

Importante: `pg_dump -Fc` **non** include ruoli e tablespaces. In disaster recovery completo serve sia `pg_restore` del DB sia `psql -f globals.sql`.

## Restore

```bash
# Restore in DB nuovo (raccomandato — non sovrascrive)
sudo -nu postgres createdb heuresys_platform_restore
pg_restore -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform_restore \
  --no-owner --no-privileges -j 4 /tmp/restore.dump

# Restore in-place (DISTRUTTIVO — solo dopo conferma + snapshot pre-restore)
pg_restore -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform \
  --clean --if-exists --no-owner --no-privileges -j 4 /tmp/restore.dump
```

Flag chiave:

- `--clean --if-exists` = drop+recreate oggetti prima di restore (idempotente)
- `--no-owner --no-privileges` = ignora ownership/grants del dump source (assegnati post-restore via migration)
- `-j 4` = parallelism (4 worker per ARM64 4 vCPU)

Dopo restore in-place: rieseguire `prisma migrate deploy` per allineare `_prisma_migrations` allo stato corrente del codice.

## Bucket OCI sync

Bucket: `heuresys-evo-backups` (region eu-milan-1). Cron `03:00 UTC daily` + `04:00 Mon weekly DR`.

### Upload manuale

```bash
DUMP=/tmp/evo-$(date +%Y%m%d).dump
oci os object put --bucket-name heuresys-evo-backups \
  --file "$DUMP" --name "evo-$(date +%Y%m%d).dump" \
  --metadata '{"source":"manual","sha256":"'$(sha256sum "$DUMP" | cut -d' ' -f1)'"}'
```

### Lista snapshot

```bash
oci os object list --bucket-name heuresys-evo-backups --prefix evo- \
  --query 'data[*].{name:name,size:size,modified:"time-modified"}' --output table
```

### Download

```bash
oci os object get --bucket-name heuresys-evo-backups \
  --name "evo-20260501.dump" --file /tmp/restore.dump
```

### Cron daily backup script

```bash
# /etc/cron.d/heuresys-evo-backup
0 3 * * * ubuntu /home/ubuntu/heuresys-evo/infra/scripts/backup-daily.sh >> /var/log/heuresys-backup.log 2>&1
0 4 * * 1 ubuntu /home/ubuntu/heuresys-evo/infra/scripts/backup-weekly-dr.sh >> /var/log/heuresys-backup.log 2>&1
```

Lo script weekly DR esegue: dump → upload bucket → restore di prova su `heuresys_platform_dr_test` → query sanity → drop DB di test. Fallimento → alert via Prometheus alert rule (TODO infra).

## RLS verification

```sql
-- Conta tabelle con RLS abilitata (atteso: 302 al baseline 2026-04-29)
SELECT count(*) FROM pg_class
WHERE relrowsecurity = true AND relkind = 'r';

-- Lista tabelle SENZA RLS (drift detection)
SELECT n.nspname || '.' || c.relname AS table_name
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind='r' AND n.nspname='public' AND c.relrowsecurity=false
ORDER BY 1;

-- Verifica FORCE RLS (anche superuser deve passare per policy)
SELECT count(*) FROM pg_class WHERE relforcerowsecurity=true AND relkind='r';
```

In CI: `infra/scripts/check-rls-coverage.sh` fallisce se delta tra count attuale e atteso > 0. P5 (RLS DB-level always) è gate bloccante per ogni migration.

## Maintenance

### VACUUM ANALYZE settimanale

```bash
# /etc/cron.d/heuresys-evo-maintenance
0 2 * * 0 postgres /usr/bin/vacuumdb --all --analyze --jobs=4 --quiet
```

### REINDEX semestrale

```bash
sudo -nu postgres reindexdb --concurrently --jobs=2 heuresys_platform
```

`--concurrently` evita lock esclusivo (PG12+). Pianificare durante low-traffic window.

### Bloat check (run mensile, manual)

```sql
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
       n_live_tup, n_dead_tup,
       round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_pct DESC NULLS LAST
LIMIT 20;
```

`dead_pct > 20%` → considerare `VACUUM FULL` (lock esclusivo, fuori window).

## Monitoring queries

### Longest running queries

```sql
SELECT pid, usename, state, age(clock_timestamp(), query_start) AS duration,
       left(query, 100) AS query_preview
FROM pg_stat_activity
WHERE state != 'idle' AND query NOT ILIKE '%pg_stat_activity%'
ORDER BY query_start ASC
LIMIT 10;
```

### Locks (deadlock detection)

```sql
SELECT bl.pid AS blocked_pid, bl.usename AS blocked_user,
       kl.pid AS blocking_pid, kl.usename AS blocking_user,
       bl.query AS blocked_query, kl.query AS blocking_query
FROM pg_stat_activity bl
JOIN pg_locks lock1 ON lock1.pid = bl.pid AND NOT lock1.granted
JOIN pg_locks lock2 ON lock2.pid <> bl.pid AND lock2.granted
                   AND lock2.relation = lock1.relation
JOIN pg_stat_activity kl ON kl.pid = lock2.pid;
```

### Replication lag

**N/A in questo stack** (single-node). Predisposto per evolutione: in caso di standby aggiungere `pg_stat_replication` query (`SELECT client_addr, state, replay_lag FROM pg_stat_replication`).

## PgBouncer (Tier 3, non subito)

Pool connessioni applicative per ridurre overhead `pg_stat_activity` quando workspace utenti scala >100 concurrent. Config attesa: `transaction` pooling, `default_pool_size=20`, `max_client_conn=200`. Decision deferred a post-GA — single-node bare-metal con `max_connections=200` Postgres-side è sufficiente per Tier 1/2.

## Riferimenti

- `infra/scripts/backup-daily.sh`, `backup-weekly-dr.sh` — automazione backup
- `infra/scripts/check-rls-coverage.sh` — gate CI P5
- `docs/40-operations/incident-runbook-evo.md` §DB restore — procedura emergency
- `docs/migration/dbms-cookbook.md` — pattern migration baseline-squash
