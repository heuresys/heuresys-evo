# DBMS backup & restore — governance policy

> **Status**: scaffold iniziale post-promozione SoT 2026-05-07.
> **Owner**: fresh session backup-track (parallel a FASE 1-5 di Phase 14.SH).
> **Companion**: `docs/40-operations/db-management-evo.md` (operational generale).
> **Stato attuale**: primo backup baseline creato, governance ancora da automatizzare.

## Asset corrente

| Asset                        | Path                                                                                                 | SHA256                                                             | Size   | Created           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ | ----------------- |
| Baseline SoT post-promozione | `oracle-vm-default:/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` | `1d1150ced1016638f8ac31c2b85e056752592c9ced0870cfca84fe6328eda46a` | 397 MB | 2026-05-07T14:30Z |

Verificato restorable: `pg_restore -l <dump>` → 7880 TOC entries, archive listing consistent.

## Policy proposta (da implementare in fresh session backup-track)

### Cadenza

| Tipo                     | Cadence               | Path                                                                           | Retention                    |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| **Daily incremental**    | 03:00 UTC ogni giorno | `/var/backups/heuresys-evo/daily/heuresys_platform-YYYYMMDD.dump`              | 30 giorni rolling            |
| **Weekly full + sha256** | 02:00 UTC domenica    | `/var/backups/heuresys-evo/weekly/heuresys_platform-YYYY-Www.dump` + `.sha256` | 90 giorni rolling            |
| **Monthly archive**      | 02:00 UTC 1° del mese | `/var/backups/heuresys-evo/monthly/heuresys_platform-YYYY-MM.dump` + `.sha256` | 365 giorni rolling           |
| **Pre-migration manual** | on-demand             | `/var/backups/heuresys-evo/manual/<context>-<timestamp>.dump`                  | indefinito (cleanup manuale) |

### Off-site sync

- **Target**: Oracle Cloud Object Storage bucket `heuresys-evo-backups` (region eu-milan-1)
- **Frequency**: copy weekly + monthly post-creation (tipo S3 mirror via `oci os object put`)
- **Encryption**: server-side encryption (Oracle managed keys per bucket policy)
- **Optional secondary**: copy weekly mirror su drive Windows R: (SSHFS mount Mac → bucket non sempre disponibile)

### Restore drill

- **Cadence**: 1× al mese su DB temporaneo (`heuresys_platform_restore_test`)
- **Procedure**:
  1. Pick weekly dump più recente
  2. `dropdb --if-exists heuresys_platform_restore_test && createdb -O heuresys heuresys_platform_restore_test`
  3. Pre-install extensions (vector, ltree, pg_trgm, pgcrypto, uuid-ossp) come postgres superuser
  4. `pg_restore -d heuresys_platform_restore_test --no-owner --no-acl <dump>`
  5. Forensic count check: `SELECT count(*) FROM employees` deve match dump epoch
  6. Drop test DB post-verify
- **Output**: log entry in `/var/log/heuresys-evo/restore-drill.log`
- **Alert**: email/Slack se restore fail o count mismatch

### Crontab (postgres user, su VM)

```cron
# Heuresys evo DBMS backup chain (after 2026-05-07 SoT promotion)
# Daily incremental 03:00 UTC
0 3 * * * pg_dump -F c -d heuresys_platform -f /var/backups/heuresys-evo/daily/heuresys_platform-$(date -u +\%Y\%m\%d).dump 2>>/var/log/heuresys-evo/backup-daily.log
# Daily cleanup older than 30 days
30 3 * * * find /var/backups/heuresys-evo/daily -mtime +30 -name '*.dump' -delete

# Weekly full + sha256, domenica 02:00 UTC
0 2 * * 0 /usr/local/bin/heuresys-evo-weekly-backup.sh

# Monthly archive, day 1 02:00 UTC
0 2 1 * * /usr/local/bin/heuresys-evo-monthly-backup.sh

# Restore drill, day 15 04:00 UTC
0 4 15 * * /usr/local/bin/heuresys-evo-restore-drill.sh
```

## Manual operations

### Manual pre-migration backup

```bash
ssh oracle-vm-default 'sudo -u postgres pg_dump -F c -d heuresys_platform \
  -f /var/backups/heuresys-evo/manual/pre-<context>-$(date -u +%Y%m%dT%H%M%SZ).dump'
```

### Manual restore (DR scenario)

```bash
# 1. Stop services
sudo systemctl stop heuresys-evo-app heuresys-evo-api
# 2. Drop+recreate DB
sudo -u postgres psql -c "DROP DATABASE heuresys_platform; CREATE DATABASE heuresys_platform OWNER heuresys"
# 3. Pre-install extensions (as postgres superuser)
sudo -u postgres psql -d heuresys_platform -c "CREATE EXTENSION vector; CREATE EXTENSION ltree; CREATE EXTENSION pg_trgm; CREATE EXTENSION pgcrypto; CREATE EXTENSION \"uuid-ossp\""
# 4. Restore
sudo -u postgres pg_restore -d heuresys_platform --no-owner --no-acl <dump>
# 5. Grant heuresys ownership
sudo -u postgres psql -d heuresys_platform -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO heuresys; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO heuresys"
# 6. Re-apply canonical users
cd /path/to/repo && node scripts/db/apply-canonical-users.mjs
# 7. Restart services
sudo systemctl start heuresys-evo-app heuresys-evo-api
# 8. Verify
curl -sS http://localhost:8200/health
```

### Forensic verification post-restore

```bash
# Compare count + schema vs known-good baseline
ssh oracle-vm-default 'bash /tmp/forensic-verify.sh'
```

## Open work (fresh session backup-track)

- [ ] Scrivere `/usr/local/bin/heuresys-evo-weekly-backup.sh` (full + sha256 + off-site copy)
- [ ] Scrivere `/usr/local/bin/heuresys-evo-monthly-backup.sh` (archive + retention)
- [ ] Scrivere `/usr/local/bin/heuresys-evo-restore-drill.sh` (test restore + count check)
- [ ] Configurare Oracle bucket + IAM policy
- [ ] Test E2E end-to-end con orchestrazione cronjob attiva
- [ ] Document recovery RPO/RTO targets (proposed: RPO 24h daily / RTO 30min via dump → restore on hot standby)

## Riferimenti

- DBMS SoT promotion: ADR-0023 `docs/50-reference/decisions/0023-promote-baremetal-as-sot.md`
- DB management generale: `docs/40-operations/db-management-evo.md`
- Migration historic: `db/migrations/phase14c_dashboard_composite_sql_binding.sql` + `phase14d_dashboard_full_binding_coverage.sql`
- Apply canonical users helper: `scripts/db/apply-canonical-users.mjs`
- Plan canonical: `~/.claude/plans/questo-quello-che-glittery-charm.md` (parallel track)
