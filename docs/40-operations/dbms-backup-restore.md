# DBMS backup & restore — governance policy

> **Status**: ACTIVE since 2026-05-07T17:50Z (Phase 14.SH SH-1 backup track).
> **Source of truth**: bare-metal `heuresys_platform` (postgres 16.13 on
> `oracle-vm-default`). Reference: ADR-0023 (SoT promotion).
> **Companion**: `docs/40-operations/db-management-evo.md` (operational generale).

## Asset corrente (2026-05-07)

| Asset                        | Path on `oracle-vm-default`                                                        | Size   | Notes                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| Baseline SoT post-promozione | `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` | 397 MB | sha256 `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a` |
| First daily backup           | `/var/backups/heuresys-evo/heuresys_platform-daily-20260507T154816Z.dump`          | 367 MB | first run of the cron chain                                               |

## Implementation

### Scripts (installed on VM `oracle-vm-default`)

| Script                                     | Owner           | Mode | Purpose                                                             |
| ------------------------------------------ | --------------- | ---- | ------------------------------------------------------------------- |
| `/usr/local/bin/heuresys-backup.sh`        | `root:postgres` | 750  | Single backup with retention. Arg: `daily` \| `weekly` \| `monthly` |
| `/usr/local/bin/heuresys-restore-drill.sh` | `root:postgres` | 750  | Restore latest daily into a temp DB, count-check, drop temp DB      |

Logs: `/var/log/heuresys-backup.log`, `/var/log/heuresys-restore-drill.log` (mode 660, owner `postgres:postgres`).

### Cadence (cron, postgres user, UTC)

| Tipo              | Schedule      | Retention | Output path pattern                             |
| ----------------- | ------------- | --------- | ----------------------------------------------- |
| **Daily**         | 02:15 UTC     | 7 last    | `…-daily-YYYYMMDDTHHMMSSZ.dump` + `.sha256`     |
| **Weekly**        | Mon 02:30 UTC | 8 last    | `…-weekly-YYYYMMDDTHHMMSSZ.dump` + `.sha256`    |
| **Monthly**       | 1st 02:45 UTC | 12 last   | `…-monthly-YYYYMMDDTHHMMSSZ.dump` + `.sha256`   |
| **Restore drill** | 1st 03:30 UTC | n/a       | log entry only (PASS/FAIL based on count match) |

```cron
# Heuresys evo DBMS SoT backup chain (UTC)
15 2 * * *   /usr/local/bin/heuresys-backup.sh daily
30 2 * * 1   /usr/local/bin/heuresys-backup.sh weekly
45 2 1 * *   /usr/local/bin/heuresys-backup.sh monthly
30 3 1 * *   /usr/local/bin/heuresys-restore-drill.sh
```

Verify cron chain: `ssh oracle-vm-default 'sudo crontab -u postgres -l'`

### Backup format

`pg_dump --format=custom --compress=9 --no-owner --no-privileges`

- `custom` (binary archive) → flexible restore (`pg_restore -l` lists TOC, can selectively restore objects).
- `--compress=9` (zstd-equivalent zlib max) → ≈ 5× compression vs raw SQL.
- `--no-owner --no-privileges` → portable, restorable into any role (post-restore `GRANT` on `heuresys`).

### Integrity hash

Every dump has a sibling `.sha256` produced by `sha256sum` (single-line `<hash>  <basename>` format). The drill verifies with `sha256sum --check --status` before attempting restore.

## Restore drill — verified procedure

The drill replays the latest daily dump into a transient database `heuresys_platform_drill_<TS>`, then runs forensic count checks against the live `heuresys_platform`.

```text
expected employees           = drill employees
expected dashboard_elements  = drill dashboard_elements
sha256(dump) == sha256.file
```

PASS criteria: all three checks pass. Logged as `DRILL PASS` / `DRILL FAIL`.

Test run on 2026-05-07T15:54:33Z: PASS (employees=270/270, dashboard*elements=30/30, sha256 OK). Note: pgvector ivfflat indexes on `esco_skills.embedding*\*`cannot be rebuilt with the default`maintenance_work_mem=64MB`(drill log shows 4 ignored errors). Production restore must temporarily bump`maintenance_work_mem`to ≥128MB before`pg_restore` to recreate the vector indexes.

## Manual operations

### Pre-migration manual backup

```bash
ssh oracle-vm-default 'sudo -u postgres pg_dump --format=custom --compress=9 \
  --no-owner --no-privileges -d heuresys_platform \
  -f /var/backups/heuresys-evo/manual/pre-<context>-$(date -u +%Y%m%dT%H%M%SZ).dump'
```

### Disaster recovery (production restore)

```bash
# 1. Stop services
ssh oracle-vm-default 'sudo systemctl stop heuresys-evo-app heuresys-evo-api'

# 2. Bump maintenance_work_mem session-scoped for vector index rebuild
ssh oracle-vm-default 'sudo -u postgres psql -c "ALTER SYSTEM SET maintenance_work_mem = ''256MB''; SELECT pg_reload_conf()"'

# 3. Drop + recreate DB
ssh oracle-vm-default 'sudo -u postgres psql -c "DROP DATABASE heuresys_platform"'
ssh oracle-vm-default 'sudo -u postgres psql -c "CREATE DATABASE heuresys_platform OWNER heuresys"'

# 4. Pre-install extensions (postgres superuser, before restore)
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform <<EOF
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOF'

# 5. Restore
ssh oracle-vm-default 'sudo -u postgres pg_restore --dbname=heuresys_platform \
  --no-owner --no-privileges /var/backups/heuresys-evo/<dump>'

# 6. Grant ownership
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform <<EOF
GRANT ALL ON ALL TABLES IN SCHEMA public TO heuresys;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO heuresys;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO heuresys;
EOF'

# 7. Reset maintenance_work_mem
ssh oracle-vm-default 'sudo -u postgres psql -c "ALTER SYSTEM RESET maintenance_work_mem; SELECT pg_reload_conf()"'

# 8. Re-apply canonical users (Heuresys2026!)
node scripts/db/apply-canonical-users.mjs

# 9. Restart services
ssh oracle-vm-default 'sudo systemctl start heuresys-evo-app heuresys-evo-api'

# 10. Smoke
curl -sS http://localhost:3200/login -o /dev/null -w '%{http_code}\n'
curl -sS http://localhost:8200/health -o /dev/null -w '%{http_code}\n'
```

### Selective restore (single table)

```bash
# 1. List objects in dump
ssh oracle-vm-default 'pg_restore -l /var/backups/heuresys-evo/<dump>' | grep -i employees

# 2. Build a partial-restore manifest then run
ssh oracle-vm-default 'pg_restore -l /var/backups/heuresys-evo/<dump>' > /tmp/manifest.txt
# edit /tmp/manifest.txt to keep only the objects you need
ssh oracle-vm-default 'sudo -u postgres pg_restore --dbname=heuresys_platform \
  --use-list=/tmp/manifest.txt /var/backups/heuresys-evo/<dump>'
```

## RPO / RTO targets

| Metric                          | Target  | Current capability                                                                           |
| ------------------------------- | ------- | -------------------------------------------------------------------------------------------- |
| RPO (max data loss in incident) | 24h     | 24h via daily cron (acceptable for MVP, tighten later via WAL archiving)                     |
| RTO (max recovery time)         | 30 min  | ~10 min restore + 5 min smoke = 15 min observed; 30 min worst-case with vector index rebuild |
| Backup chain horizon            | 1 year  | 7 daily + 8 weekly + 12 monthly = ~12 months coverage                                        |
| Drill cadence                   | monthly | 1st of month at 03:30 UTC                                                                    |

## Off-site (planned, not yet active)

- **Target**: Oracle Cloud Object Storage bucket `heuresys-evo-backups` (region eu-milan-1)
- **Frequency**: copy weekly + monthly post-creation via `oci os object put`
- **Encryption**: server-side encryption (Oracle managed keys, bucket policy enforced)
- **Status**: not yet provisioned. Tracking under SH-2/SH-3 follow-up; until then, all backups are local-only on the VM (40 GB free, sufficient for current chain horizon).

## Open follow-ups

- [ ] Provision Oracle bucket + IAM + add upload step to `heuresys-backup.sh weekly|monthly`
- [ ] Bump `maintenance_work_mem` permanently to 256 MB on the VM (so drill restores recreate vector indexes cleanly)
- [ ] Add WAL archiving for sub-hour RPO (PoC after Phase 14.SH closure)
- [ ] Backup notification (email or matrix) on drill FAIL
- [ ] Encrypt at-rest (LUKS volume or pgBackRest with `--cipher-pass`) — currently dumps are plain (only volume FS perms protect)

## Riferimenti

- ADR-0023 (SoT promotion): `docs/50-reference/decisions/0023-promote-baremetal-as-sot.md`
- DB management generale: `docs/40-operations/db-management-evo.md`
- Phase 14.SH plan: `~/.claude/plans/questo-quello-che-glittery-charm.md`
- Apply canonical users: `scripts/db/apply-canonical-users.mjs`
