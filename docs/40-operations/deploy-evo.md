# Deploy evo — VM OCI ARM64

**Target hosting**: `oracle-vm-default` (80.225.82.207), Ubuntu 24.04 ARM64, repo `/home/ubuntu/heuresys-evo/`.
**URL pubblico**: `https://evo.heuresys.com` (Let's Encrypt auto-renew via `certbot.timer`).

## Modalità di deploy

| Modalità                       | Quando                     | Stack                      | Porte                                             | Stato       |
| ------------------------------ | -------------------------- | -------------------------- | ------------------------------------------------- | ----------- |
| (a) Docker Compose             | DEV attuale (default oggi) | container `heuresys_evo_*` | 3012 (FE) / 8012 (API) / 8020 (enrichment)        | **ATTIVA**  |
| (b) Bare-metal systemd + Nginx | PROD futura                | unit systemd, Node 20 LTS  | 3200 (FE) / 8200 (API) interne, 443 reverse-proxy | Pianificata |

`https://evo.heuresys.com` oggi è **(a)** Docker proxied via Nginx vhost `infra/nginx/evo.heuresys.com.deployed.conf` (upstream `127.0.0.1:3012` per FE, `127.0.0.1:8012` per API path `/api/`).

## Modalità (a) — Docker Compose

### Servizi compose

```yaml
# docker-compose.yml (estratto)
services:
  api_gateway: { container_name: heuresys_evo_api_gateway, ports: ['8012:3000'] }
  frontend: { container_name: heuresys_evo_frontend, ports: ['3012:3000'] }
  enrichment: { container_name: heuresys_evo_enrichment, ports: ['8020:3000'] }
  redis: { container_name: heuresys_evo_redis, ports: ['6379:6379'] }
  platform_db: { container_name: heuresys_evo_platform_db, ports: ['5433:5432'] } # legacy data
```

DB applicativo evo greenfield = bare-metal `127.0.0.1:5432` (non in compose), popolato via baseline-squash da `heuresys_evo_platform_db:5433`.

### Rolling deploy single-service

```bash
# Pull immagine + restart un solo servizio (zero-downtime sugli altri)
cd /home/ubuntu/heuresys-evo
git pull origin main
docker compose pull api_gateway
docker compose up -d --no-deps --force-recreate api_gateway
docker logs -f heuresys_evo_api_gateway --tail 50    # verify health
```

### One-liner deploy completo (tutti i servizi)

```bash
cd /home/ubuntu/heuresys-evo && git pull origin main && \
  npm ci --workspaces --include-workspace-root && \
  npx prisma migrate deploy --schema services/api-gateway/prisma/schema.prisma && \
  docker compose pull && docker compose up -d && \
  docker compose ps && curl -fsS https://evo.heuresys.com/api/health
```

## Modalità (b) — Bare-metal systemd + Nginx (futura PROD)

### Unit systemd (template)

```ini
# /etc/systemd/system/heuresys-evo-api.service
[Unit]
Description=Heuresys EVO API Gateway
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/heuresys-evo/services/api-gateway
EnvironmentFile=/etc/heuresys-evo/api.env
ExecStart=/usr/bin/node dist/main.js
Restart=on-failure
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

Speculare per `heuresys-evo-frontend.service` (porta 3200) e `heuresys-evo-enrichment.service` (porta 8220). Reload via `sudo systemctl daemon-reload && sudo systemctl restart heuresys-evo-api`.

### Nginx vhost (vedi `infra/nginx/evo.heuresys.com.deployed.conf`)

In modalità (b) gli `upstream` puntano a `127.0.0.1:3200` (FE) e `127.0.0.1:8200` (API). Diff minima rispetto al file `.deployed.conf` attuale.

## CI/CD — GitHub Actions

File `.github/workflows/deploy.yml` (target produrre dopo che modalità (b) sarà attiva — oggi vedi `deploy-app-api.yml.example`):

```yaml
name: deploy-evo
on: { push: { branches: [main] } }
jobs:
  build-and-deploy:
    runs-on: ubuntu-24.04-arm
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci --workspaces --include-workspace-root
      - run: npx prisma migrate deploy --schema services/api-gateway/prisma/schema.prisma
        env: { DATABASE_URL: ${{ secrets.DATABASE_URL_PROD }} }
      - run: npm run build --workspaces
      - name: SSH deploy
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: 80.225.82.207
          username: ubuntu
          key: ${{ secrets.OCI_DEPLOY_KEY }}
          script: |
            cd /home/ubuntu/heuresys-evo
            git pull origin main
            docker compose pull
            docker compose up -d
            docker compose ps
```

## Env management

- **DEV oggi**: `.env` files locali nel repo (gitignored), `.env.example` versionato come template
- **PROD target**: `.env.production` iniettato da OCI Vault tramite `oci secrets secret-bundle get` in `ExecStartPre=` del systemd unit, oppure da GitHub Secrets (workflow `deploy.yml` step `env:` → scrive `/etc/heuresys-evo/api.env` via SSH)
- **Mai** committare segreti: pre-commit hook + `.gitignore` su `.env*` (eccetto `.env.example`)
- Rotazione: `oci vault secret update` + `systemctl restart heuresys-evo-*` (tutti i servizi rileggono env da systemd `EnvironmentFile`)

## Rollback

```bash
# Identifica commit precedente stabile
git log --oneline -10
git checkout <SHA-precedente>
docker compose up -d --force-recreate                # rebuild da SHA precedente
# Oppure rollback DB se migrazione recente ha rotto qualcosa:
psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;"
# pg_restore da snapshot pre-deploy (vedi db-management-evo.md §Restore)
```

## Verifica post-deploy (smoke)

```bash
curl -fsS https://evo.heuresys.com/api/health           # 200 + JSON status
curl -fsS https://evo.heuresys.com/api/health/ready     # 200 (DB+Redis ready)
curl -fsS -I https://evo.heuresys.com/                  # 200, frontend SSR
docker compose ps --format json | jq '.[] | {Service,State,Health}'
sudo systemctl status nginx --no-pager
sudo certbot certificates | grep -E "Domains|Expiry"
```

## Riferimenti

- `infra/nginx/evo.heuresys.com.deployed.conf` — vhost Nginx canonical
- `infra/systemd/` — unit templates per modalità (b)
- `.github/workflows/deploy-app-api.yml.example` — workflow template
- `docs/40-operations/incident-runbook-evo.md` — procedure incident
- `docs/40-operations/db-management-evo.md` — gestione DBMS bare-metal
