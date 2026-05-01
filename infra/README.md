# infra

Infrastructure as Code, Docker Compose, configurazioni deployment.

## ⚠️ Cosa NON va qui
- **PostgreSQL**: gira bare-metal sulla VM, mai in container. Vedi `db/README.md`.

## Cosa va qui
- `docker-compose.dev.yml` — Redis, Nginx (e altri servizi non-DB) per sviluppo locale
- `docker-compose.prod.yml` — stesso per produzione
- `nginx/` — config reverse proxy (route ad `app`, `marketing`, `api-gateway`)
- `monitoring/` — Prometheus, Grafana se aggiunti
- Eventuali Terraform / OCI CLI script

## Convenzioni
- Secret mai in compose files; usare env file o secret store
- Ogni servizio in compose ha health check
- Volumi persistenti documentati esplicitamente
- Script di deploy sempre idempotenti
