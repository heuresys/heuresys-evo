# DBMS materialized views refresh runbook

> **Owner**: ops · **Last updated**: 2026-05-10 (S24 · Phase 16.L)
> **Stack**: systemd timer on `oracle-vm-default` invoking `public.refresh_all_mat_views()`

## Overview

5 materialized views in `heuresys_platform` (introdotte progressively across phases 14-15) require periodic refresh to keep aggregations current. Helper function `public.refresh_all_mat_views()` (deployed in Phase 16.K, S23-quater) refreshes them all in a single PL/pgSQL call.

This runbook describes the **systemd-based scheduling** (decision D3 of S24 plan) — chosen over `pg_cron` extension to avoid DB restart requirements.

## Schedule

- **Frequency**: every 4 hours (UTC: 00, 04, 08, 12, 16, 20)
- **Timer unit**: `heuresys-mat-views-refresh.timer`
- **Service unit**: `heuresys-mat-views-refresh.service`
- **Source**: `infra/systemd/heuresys-mat-views-refresh.{service,timer}` (committed)
- **Random jitter**: ±60s to avoid thundering herd

## Operational commands

### Status check

```bash
ssh oracle-vm-default "sudo systemctl list-timers heuresys-mat-views-refresh*"
ssh oracle-vm-default "sudo systemctl status heuresys-mat-views-refresh.timer"
```

### Inspect last N runs

```bash
ssh oracle-vm-default "sudo journalctl -u heuresys-mat-views-refresh.service --since '24 hours ago' --no-pager"
```

### Manual trigger (out-of-band refresh)

```bash
ssh oracle-vm-default "sudo systemctl start heuresys-mat-views-refresh.service"
ssh oracle-vm-default "sudo journalctl -u heuresys-mat-views-refresh.service -n 20 --no-pager"
```

### Direct SQL invocation (debug)

```bash
ssh oracle-vm-default "sudo -n -u postgres psql -d heuresys_platform -c 'SELECT public.refresh_all_mat_views();'"
```

## Materialized views refreshed

The helper iterates all `pg_matviews` in `public` schema and calls `REFRESH MATERIALIZED VIEW CONCURRENTLY <name>` on each. Current set (at 2026-05-10):

| Name                                                                                               | Description |
| -------------------------------------------------------------------------------------------------- | ----------- |
| (5 mat views; query `SELECT matviewname FROM pg_matviews WHERE schemaname='public'` for live list) |             |

## Troubleshooting

### Refresh fails (REFRESH timeout)

- Check service log: `sudo journalctl -u heuresys-mat-views-refresh.service -n 50 --no-pager`
- Common cause: long-running locks on parent tables. `pg_stat_activity` to find blockers.
- Mitigation: timer has `TimeoutStartSec=300` (5 min). If view consistently exceeds, switch to `REFRESH MATERIALIZED VIEW` non-concurrent (advanced — requires editing helper).

### Timer not firing

- `sudo systemctl is-enabled heuresys-mat-views-refresh.timer` → must be `enabled`
- `sudo systemctl is-active heuresys-mat-views-refresh.timer` → must be `active`
- `sudo systemctl daemon-reload` if unit files changed but daemon stale

### Migration to pg_cron (future)

If `pg_cron` is later installed (`apt-get install postgresql-16-cron` + `shared_preload_libraries` + restart):

1. `cron.schedule('mat-views-refresh-4h', '0 */4 * * *', 'SELECT public.refresh_all_mat_views();')`
2. `sudo systemctl disable --now heuresys-mat-views-refresh.timer`
3. Remove unit files; keep this doc updated.

## References

- `infra/systemd/heuresys-mat-views-refresh.{service,timer}` — unit files
- `infra/systemd/README.md` — install/uninstall instructions
- `db/seeds/phase16k_*.sql` — `refresh_all_mat_views()` definition (S23-quater)
- `docs/_audit/2026-05-09-forensic-db-audit.md` § 1.8 — driver issue
