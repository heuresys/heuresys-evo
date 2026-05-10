# Systemd unit files — heuresys-evo

> Phase 16.L · S24 · L58 — installed on `oracle-vm-default` for cron-style scheduling without `pg_cron` extension.

## heuresys-mat-views-refresh

Refreshes all 5 materialized views via the `public.refresh_all_mat_views()` PL/pgSQL helper (deployed S23-quater Phase 16.K).

### Schedule

Every 4 hours: `00, 04, 08, 12, 16, 20` UTC.

`RandomizedDelaySec=60` jitter to avoid thundering herd if multiple timers align.

### Install (one-time, on oracle-vm-default)

```bash
scp infra/systemd/heuresys-mat-views-refresh.* oracle-vm-default:/tmp/
ssh oracle-vm-default << 'EOF'
sudo cp /tmp/heuresys-mat-views-refresh.service /etc/systemd/system/
sudo cp /tmp/heuresys-mat-views-refresh.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable heuresys-mat-views-refresh.timer
sudo systemctl start heuresys-mat-views-refresh.timer
EOF
```

### Verify

```bash
ssh oracle-vm-default "sudo systemctl list-timers heuresys-mat-views-refresh*"
ssh oracle-vm-default "sudo systemctl status heuresys-mat-views-refresh.timer"
ssh oracle-vm-default "sudo journalctl -u heuresys-mat-views-refresh.service --since '24 hours ago' --no-pager"
```

### Manual trigger

```bash
ssh oracle-vm-default "sudo systemctl start heuresys-mat-views-refresh.service"
ssh oracle-vm-default "sudo journalctl -u heuresys-mat-views-refresh.service -n 20 --no-pager"
```

### Disable / uninstall

```bash
ssh oracle-vm-default << 'EOF'
sudo systemctl stop heuresys-mat-views-refresh.timer
sudo systemctl disable heuresys-mat-views-refresh.timer
sudo rm /etc/systemd/system/heuresys-mat-views-refresh.{service,timer}
sudo systemctl daemon-reload
EOF
```

## Why systemd vs pg_cron

Decision (D3, S24 plan): chosen systemd timer over `pg_cron` extension because:

- `pg_cron` requires `apt-get install postgresql-16-cron` + sudo + `shared_preload_libraries` config + DB restart
- systemd timer needs only file deploy + enable; no DB restart, no postgres config drift
- Helper `refresh_all_mat_views()` already exists (S23-quater Phase 16.K) — invocation via `psql -c` is trivial

If pg_cron is installed in the future, this unit can be removed and a `cron.schedule()` row added.
