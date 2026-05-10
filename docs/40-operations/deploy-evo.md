# Deploy evo — VM OCI ARM64 (bare-metal SoT)

**Target hosting**: `oracle-vm-default` (80.225.82.207), Ubuntu 24.04 ARM64, repo `/home/ubuntu/heuresys-evo/`.
**URL pubblico**: `https://evo.heuresys.com` (Let's Encrypt auto-renew via `certbot.timer`).

> **SoT runtime** (post-2026-05-10 Docker eradication): tutti i servizi girano bare-metal via `systemd` + Nginx reverse-proxy. **Niente Docker, niente container.** Vedi [ADR-0001](../50-reference/decisions/0001-postgresql-bare-metal.md) (Postgres) + [ADR-0023](../50-reference/decisions/0023-promote-baremetal-as-sot.md) (DBMS bare-metal SoT).

## Topologia runtime

| Componente              | Host              | Porta interna | Porta esposta            | Manager                 |
| ----------------------- | ----------------- | ------------- | ------------------------ | ----------------------- |
| `heuresys-evo-app`      | oracle-vm-default | 3200          | 443 (via Nginx upstream) | systemd                 |
| `heuresys-evo-api`      | oracle-vm-default | 8200          | 443 `/api/*` (via Nginx) | systemd                 |
| `heuresys-evo-enrich`   | oracle-vm-default | 8220          | interna only (no expose) | systemd                 |
| PostgreSQL 16.13        | oracle-vm-default | 5432          | localhost only           | systemd `postgresql`    |
| Redis 7                 | oracle-vm-default | 6380          | localhost only           | systemd `redis-server`  |
| Nginx                   | oracle-vm-default | 80/443        | public                   | systemd `nginx`         |
| certbot (Let's Encrypt) | oracle-vm-default | —             | —                        | systemd `certbot.timer` |

## Unit systemd canonical

```ini
# /etc/systemd/system/heuresys-evo-api.service
[Unit]
Description=Heuresys EVO API Gateway
After=network.target postgresql.service redis-server.service

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

Speculare per `heuresys-evo-app.service` (porta 3200, WorkingDirectory `services/app`) e `heuresys-evo-enrich.service` (porta 8220, WorkingDirectory `services/enrichment`).

Reload + restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart heuresys-evo-api
sudo systemctl status heuresys-evo-api --no-pager
```

## Nginx vhost

`infra/nginx/evo.heuresys.com.deployed.conf` — upstream `127.0.0.1:3200` (FE) e `127.0.0.1:8200` (API path `/api/*`). Reverse-proxy HTTPS via cert Let's Encrypt.

## Deploy procedure (sequential, per servizio)

```bash
# 1. Sync repo
cd /home/ubuntu/heuresys-evo
git pull origin main

# 2. Install dep + build (atomico per workspace target)
npm ci --workspaces --include-workspace-root
npm run build --workspace=services/api-gateway

# 3. Apply DB migrations (bare-metal Postgres su localhost:5432)
npx prisma migrate deploy --schema services/app/prisma/schema.prisma

# 4. Restart servizio target (zero impatto sugli altri)
sudo systemctl restart heuresys-evo-api
sudo journalctl -u heuresys-evo-api -n 50 --no-pager   # verify health

# 5. Smoke check
curl -fsS https://evo.heuresys.com/api/health
```

Ripetere step 2+4 per `app` e `enrichment` se servono.

## CI/CD — GitHub Actions (target)

File `.github/workflows/deploy.yml` (work-in-progress, dipendente da decisione SSH key vs OCI Resource Principal):

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
      - run: npx prisma migrate deploy --schema services/app/prisma/schema.prisma
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
            npm ci --workspaces --include-workspace-root
            npm run build --workspaces
            sudo systemctl restart heuresys-evo-api heuresys-evo-app heuresys-evo-enrich
            sleep 3
            sudo systemctl status heuresys-evo-api --no-pager | head -10
```

## Env management

- **DEV**: `.env` files locali nel repo (gitignored), `.env.example` versionato come template
- **PROD**: `/etc/heuresys-evo/<service>.env` letti da systemd `EnvironmentFile=`. Provisioning iniziale via `oci secrets secret-bundle get` (workflow target) o GitHub Secrets via SSH script
- **Mai** committare segreti: pre-commit hook (gitleaks-lite inline) + `.gitignore` su `.env*` (eccetto `.env.example`)
- Rotazione: aggiornare `/etc/heuresys-evo/*.env` + `sudo systemctl restart heuresys-evo-*` (tutti i servizi rileggono env da systemd `EnvironmentFile`)

## Rollback

```bash
# Identifica commit precedente stabile
cd /home/ubuntu/heuresys-evo
git log --oneline -10
git checkout <SHA-precedente>
npm ci --workspaces --include-workspace-root
npm run build --workspaces
sudo systemctl restart heuresys-evo-api heuresys-evo-app heuresys-evo-enrich

# Oppure rollback DB se migrazione recente ha rotto qualcosa:
psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform \
  -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;"
# pg_restore da snapshot pre-deploy (vedi dbms-backup-restore.md §Restore)
```

## Verifica post-deploy (smoke)

```bash
curl -fsS https://evo.heuresys.com/api/health           # 200 + JSON status
curl -fsS https://evo.heuresys.com/api/health/ready     # 200 (DB+Redis ready)
curl -fsS -I https://evo.heuresys.com/                  # 200, frontend SSR
sudo systemctl status heuresys-evo-api heuresys-evo-app heuresys-evo-enrich --no-pager | head -30
sudo systemctl status nginx --no-pager | head -10
sudo certbot certificates | grep -E "Domains|Expiry"
```

## Riferimenti

- `infra/nginx/evo.heuresys.com.deployed.conf` — vhost Nginx canonical
- `infra/systemd/` — unit templates (api/app/enrichment)
- `docs/40-operations/incident-runbook-evo.md` — procedure incident
- `docs/40-operations/dbms-backup-restore.md` — gestione DBMS bare-metal backup/restore
- ADR-0001 (PostgreSQL bare-metal) · ADR-0023 (DBMS bare-metal SoT)
