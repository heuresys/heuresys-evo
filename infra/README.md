# infra

Infrastructure as code per heuresys-evo. Stack **bare-metal su VM OCI ARM64** — no container, no compose.

## Cosa va qui

- `nginx/` — config reverse proxy (`evo.heuresys.com.deployed.conf` canonical)
- `systemd/` — unit templates per i 3 servizi runtime (`heuresys-evo-api/app/enrich`)
- `monitoring/` — Prometheus, Grafana scaffolding (se aggiunti)
- Eventuali Terraform / OCI CLI script (provisioning bucket/secrets)

## Cosa NON va qui

- **Docker / Docker Compose**: non utilizzato. Tutti i servizi (api-gateway, app, enrichment) girano via `systemd` + Node 20 LTS bare-metal sulla VM
- **PostgreSQL**: gira bare-metal sulla VM, mai in container. Vedi `db/README.md` + ADR-0001 + ADR-0023
- **Redis**: gira bare-metal sulla VM via `systemd redis-server` (porta 6380), mai in container

## Convenzioni

- Secret mai in vhost / unit files; usare `EnvironmentFile=/etc/heuresys-evo/<svc>.env` letti da systemd
- Ogni unit systemd ha `Restart=on-failure` + `LimitNOFILE=65536`
- Health check via curl HTTPS endpoint, non liveness/readiness probe container-style
- Script di deploy sempre idempotenti (checkout + npm ci + build + systemctl restart)

## Riferimenti

- [`docs/40-operations/deploy-evo.md`](../docs/40-operations/deploy-evo.md) — procedure deploy bare-metal
- [`docs/40-operations/incident-runbook-evo.md`](../docs/40-operations/incident-runbook-evo.md) — runbook incident
- ADR-0001 PostgreSQL bare-metal · ADR-0023 DBMS bare-metal SoT
