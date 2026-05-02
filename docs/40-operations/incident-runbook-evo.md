# Incident Runbook — evo

VM target: `oracle-vm-default` (80.225.82.207). On-call: **Enzo Spenuso** (founder, primary). Backup contact: **TBD** (placeholder).

## Severity matrix

| Severity | Definizione                                                              | SLA risposta | Esempio                                                                   |
| -------- | ------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------- |
| **P1**   | Servizio down (HTTPS 5xx >50%, DB unreachable, login fallisce per tutti) | <15 min      | API gateway crashed, Postgres bare-metal stopped, SSL cert expired        |
| **P2**   | Degradazione (latency P95 >2s, errori sporadici, single feature broken)  | <2h          | Enrichment queue stuck, ESCO graph slow, Redis OOM                        |
| **P3**   | Issue single tenant (un solo tenant impattato, altri operativi)          | <24h         | RLS bug su rtl-bank, dato corrotto su smartfood, widget rotto per 1 ruolo |

## Diagnostic — comandi stack-specific

### Status containers (Docker mode)

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker compose -f /home/ubuntu/heuresys-evo/docker-compose.yml ps
docker stats --no-stream                              # CPU/MEM live
```

### Logs applicativi

```bash
docker logs heuresys_evo_api_gateway --tail 100 -f
docker logs heuresys_evo_frontend    --tail 100
docker logs heuresys_evo_enrichment  --tail 100       # BullMQ workers
docker logs heuresys_evo_redis       --tail 50
docker logs heuresys_evo_platform_db --tail 50        # legacy data container
```

Filtro JSON pino: `docker logs heuresys_evo_api_gateway --tail 500 | jq -r 'select(.level=="error") | "\(.time) \(.correlationId) \(.msg)"'`.

### Database (bare-metal Postgres)

```bash
# Ping veloce
psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c "SELECT 1"

# Sanity tenants + RLS
psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c "SELECT count(*) FROM tenants"   # atteso 4
psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c \
  "SELECT count(*) FROM pg_class WHERE relrowsecurity=true AND relkind='r'"                    # atteso ~302

# Active connections + locks
sudo -nu postgres psql -d heuresys_platform -c \
  "SELECT pid, usename, state, query_start, left(query,80) FROM pg_stat_activity WHERE state != 'idle' ORDER BY query_start"

# Inspect via Prisma Studio (read-only browse)
cd /home/ubuntu/heuresys-evo/services/api-gateway && npx prisma studio --browser none --port 5555
```

### Nginx + SSL

```bash
sudo systemctl status nginx --no-pager
sudo nginx -t                                          # valida config
sudo journalctl -u nginx -n 50 --no-pager
sudo certbot certificates                              # check expiry
sudo tail -50 /var/log/nginx/evo.heuresys.com.access.log
sudo tail -50 /var/log/nginx/evo.heuresys.com.error.log
```

### Redis + BullMQ

```bash
docker exec heuresys_evo_redis redis-cli INFO server | head -20
docker exec heuresys_evo_redis redis-cli DBSIZE
docker exec heuresys_evo_redis redis-cli LLEN bull:enrichment:wait    # job pending
docker exec heuresys_evo_redis redis-cli LLEN bull:enrichment:active  # job in-flight
docker exec heuresys_evo_redis redis-cli LLEN bull:enrichment:failed  # job failed
```

### Health endpoints

```bash
curl -fsS https://evo.heuresys.com/api/health         # 200 = liveness OK
curl -fsS https://evo.heuresys.com/api/health/ready   # 200 = DB+Redis+ESCO ready
curl -fsS http://127.0.0.1:8012/metrics | head -30    # Prometheus metrics (interno)
```

## Procedure base

### Container restart (P1 ridotto)

```bash
docker restart heuresys_evo_api_gateway               # safe, no rebuild
docker logs -f heuresys_evo_api_gateway --tail 20
curl -fsS https://evo.heuresys.com/api/health         # verify
```

### Container rebuild (P1 — codice rotto)

```bash
cd /home/ubuntu/heuresys-evo
git pull origin main                                   # pulla fix
docker compose build api_gateway                       # rebuild solo servizio
docker compose up -d --no-deps --force-recreate api_gateway
docker compose logs -f api_gateway --tail 50
```

### DB restore from bucket OCI (P1 critico — corruzione/data loss)

```bash
# 1. Stop scrittura (blocca ingress)
docker compose stop api_gateway enrichment

# 2. Lista snapshot recenti
oci os object list --bucket-name heuresys-evo-backups --prefix evo- \
  --query "data[*].{name:name,size:size,modified:\"time-modified\"}" --output table

# 3. Download snapshot target
oci os object get --bucket-name heuresys-evo-backups \
  --name "evo-20260501.dump" --file /tmp/restore.dump

# 4. Restore (vedi db-management-evo.md §Restore per flag completi)
sudo -nu postgres dropdb --if-exists heuresys_platform_restore
sudo -nu postgres createdb heuresys_platform_restore
sudo -nu postgres pg_restore -d heuresys_platform_restore \
  --no-owner --no-privileges /tmp/restore.dump

# 5. Validazione su DB di staging
psql -U postgres -d heuresys_platform_restore -c "SELECT count(*) FROM tenants"

# 6. Rename atomico (richiede maintenance window <30s)
sudo -nu postgres psql -c "ALTER DATABASE heuresys_platform RENAME TO heuresys_platform_old"
sudo -nu postgres psql -c "ALTER DATABASE heuresys_platform_restore RENAME TO heuresys_platform"

# 7. Riavvio
docker compose start api_gateway enrichment
```

### Nginx reload (config update)

```bash
sudo nginx -t && sudo systemctl reload nginx          # zero-downtime
# Se -t fallisce: rollback config (non applicare)
sudo cp /etc/nginx/sites-available/evo.heuresys.com.conf.bak /etc/nginx/sites-available/evo.heuresys.com.conf
sudo nginx -t && sudo systemctl reload nginx
```

### Cert renewal manuale (P1 — certbot.timer fallito)

```bash
sudo certbot renew --dry-run                          # test
sudo certbot renew                                     # esegui
sudo systemctl reload nginx                            # ricarica cert
sudo certbot certificates | grep -A2 evo.heuresys.com
```

## On-call escalation

1. **Primary**: Enzo (founder) — Slack DM + telefono
2. **Backup**: TBD (placeholder, da definire al primo hire infra)
3. **Vendor escalation**: OCI support se P1 infra-level (VM down, network OCI degradato, bucket inaccessibile)
4. Ogni P1 → log immediato in `docs/40-operations/incidents/<YYYY-MM-DD>-<slug>.md` con timestamp inizio + comandi eseguiti live

## Postmortem template (1 pagina, 5 sezioni)

File: `docs/40-operations/postmortems/<YYYY-MM-DD>-<slug>.md`. Pubblicato entro 72h dalla risoluzione.

```markdown
# Postmortem — <titolo incidente>

**Severity**: P1 | P2 | P3
**Inizio**: <YYYY-MM-DD HH:MM UTC> **Fine**: <YYYY-MM-DD HH:MM UTC> **Durata**: <Xh Ym>
**Owner**: <nome>

## 1. Impact

Chi è stato impattato (tenant/ruoli/feature), quanti utenti, quante request fallite, eventuali data loss.

## 2. Timeline

- HH:MM — primo alert/segnalazione
- HH:MM — escalation
- HH:MM — root cause identificata
- HH:MM — fix applicato
- HH:MM — verificata risoluzione

## 3. Root cause

Cosa è andato storto a livello tecnico. Una sola causa primaria + eventuali contributing factors.

## 4. Fix

Comando/PR/configurazione applicata. Link al commit/PR.

## 5. Action items

| #   | Azione                 | Owner | Due          | Stato |
| --- | ---------------------- | ----- | ------------ | ----- |
| 1   | <prevenzione>          | Enzo  | <YYYY-MM-DD> | open  |
| 2   | <detection migliorata> | Enzo  | <YYYY-MM-DD> | open  |
```

## Riferimenti

- `docs/40-operations/deploy-evo.md` — procedure deploy/rollback
- `docs/40-operations/db-management-evo.md` — backup/restore DBMS
- `docs/40-operations/observability-nestjs.md` — health endpoints, metrics, correlationId
- `infra/nginx/evo.heuresys.com.deployed.conf` — vhost canonical
