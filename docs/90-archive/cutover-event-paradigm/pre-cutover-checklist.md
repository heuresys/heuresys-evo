# Pre-cutover checklist (RTG Phase 5 task 5.10)

**Target cutover date**: TBD (Q3 2026, owner-decision pending — see RTG §0)
**Owner sign-off required**: Enzo (CEO + tech lead)
**Last review**: 2026-05-01 (BLOCK 14 prep)

> **Use**: Walk this checklist T-24h before cutover. Every item must be ✅ or
> have explicit waiver from Enzo. Sign off at bottom.

## A. Infrastructure readiness

- [ ] **A1** DNS A record `evo.heuresys.com` → 80.225.82.207 verified  
       `dig evo.heuresys.com +short` → `80.225.82.207` ✅ closed 2026-05-01

- [ ] **A2** DNS TTL lowered to 60s on evo.heuresys.com  
       Status: scheduled OA-6.1 (T-24h before cutover, owner action)

- [ ] **A3** OCI bucket `heuresys-evo-backups` operational  
       Status: ✅ closed 2026-05-01, 8 dumps present, daily cron 03:00 UTC

- [ ] **A4** Nginx vhost `evo.heuresys.com.conf` deployed on VM  
       `sudo nginx -t` → OK + `systemctl status nginx` active

- [ ] **A5** TLS certificate issued for evo.heuresys.com  
       `certbot certificates` → cert valid + auto-renew enabled

- [ ] **A6** Systemd units installed + enabled + running  
       `systemctl status heuresys-api-gateway heuresys-app heuresys-enrichment` → all active

- [ ] **A7** evo-db pull cron scheduled  
       `crontab -l | grep heuresys-evo-pull` → daily 04:30 UTC

- [ ] **A8** PostgreSQL 16 + pgvector running on VM  
       `psql -c "SELECT version()" -U heuresys` → success

- [ ] **A9** Redis 7 running on VM (BullMQ for enrichment)  
       `redis-cli ping` → PONG

## B. Application readiness

- [ ] **B1** All services build green  
       `npm run build --workspaces` (4 workspaces) → 0 errors

- [ ] **B2** Typecheck clean  
       `npm run typecheck --workspaces` → silent

- [ ] **B3** Tests passing  
       api-gateway: 93 tests · packages/shared: 70 · services/app: 12 · packages/ui: 29

- [ ] **B4** RLS coverage ≥ 95% on tenant-aware tables  
       `bash services/api-gateway/scripts/check-rls-coverage.sh` → 0 FAIL

- [ ] **B5** Tenant schema version backfilled (mig 223)  
       `psql -c "SELECT count(*) FROM tenant_schema_version" -U heuresys` ≥ 4 (one per active tenant)

- [ ] **B6** RBP cache warm-up successful  
       curl http://127.0.0.1:8200/employees (with auth) → 401 (unauth) or 200 (auth) — NOT 503 (cache failed)

- [ ] **B7** ESCO data populated  
       `psql -c "SELECT count(*) FROM esco_occupations"` ≥ 3000

- [ ] **B8** Industry classifications populated  
       `psql -c "SELECT count(*) FROM industry_classifications"` ≥ 3000

- [ ] **B9** Audit log triggers active  
       `psql -c "SELECT tgname FROM pg_trigger WHERE tgname LIKE 'trg_audit%'"` ≥ 2

## C. Data readiness

- [ ] **C1** Last fresh pull from PC SoT done T-12h prior  
       Manual: `bash db/scripts/db-pull.sh` invoked + verified version stamp

- [ ] **C2** Tenant data integrity check (4 active tenants present)  
       `psql -c "SELECT code, status FROM tenants"` → Heuresys System, RTL Bank, SmartFood, EcoNova

- [ ] **C3** User accounts ready for first login on evo  
       `psql -c "SELECT username FROM users WHERE is_active=true LIMIT 5"` → 5+ rows incl econova-admin

- [ ] **C4** TOTP-enabled users decision documented  
       Either OA-3.1 closed (recovery v1 / re-encrypt) OR explicit accept-skip
      (TOTP path NOT enforced for cutover MVP)

## D. Operational readiness

- [ ] **D1** Stakeholder communication sent (T-24h banner + email)  
       Status: scheduled OA-6.2 (owner action)

- [ ] **D2** Cutover runbook printed/accessible  
       Path: `docs/cutover/rto-rollback-procedure.md`

- [ ] **D3** Rollback runbook tested via dry-run  
       `bash scripts/cutover/dry-run-cutover.sh` → exit 0 + RTO ≤ 300s

- [ ] **D4** Cross-system smoke validation on dev/staging  
       `bash scripts/cutover/cross-system-transactions.sh` → 0 5xx

- [ ] **D5** Performance benchmark within 1.2× legacy p95  
       `bash scripts/cutover/perf-benchmark.sh` → 0 FAIL rows

- [ ] **D6** Monitoring/alerting configured  
       Prometheus `/metrics` deny block in vhost confirmed (security)
      Internal scraping verified (`curl http://127.0.0.1:8200/metrics` from VM only)

- [ ] **D7** Logrotate configured for /var/log/heuresys-evo/  
       `/etc/logrotate.d/heuresys-evo` exists with rotation policy

- [ ] **D8** On-call coverage during cutover window  
       Enzo + 1 backup contact reachable during cutover + first 4h post

## E. Compliance / documentation

- [ ] **E1** All ADRs accepted  
       docs/decisions/0001-0018 reviewed; status=Accepted on critical ADRs

- [ ] **E2** PHASE4-RETRO.md filed + acknowledged  
       `.handoff/PHASE4-RETRO.md` exists

- [ ] **E3** ROAD_TO_GLORY.md status reflects current state  
       Phase 4 marked ✅ done; Phase 5 in progress

- [ ] **E4** Audit trail proven  
       `audit_logs` table populated with at least 1 entry from each category
      (CONFIG_CHANGE post mig 223, AUTH on first login, etc.)

## F. Go/no-go decision (RTG task 5.12 — STOP-AUTONOMO-FINAL)

This checklist feeds the go/no-go decision (`docs/cutover/go-no-go-report.md`,
generated at T-12h or later). Recommendation gates:

- **GO**: all A-E items ✅, no FAIL on D3-D5, owner approval explicit
- **CONDITIONAL-GO**: 1-3 minor items pending (A2, D7) with explicit waiver
- **NO-GO**: any P0 fail (B-1-3, B-6, D-3, D-5) → reschedule cutover

## Sign-off

- **Cutover engineer**: **\*\*\*\***\_\_\_**\*\*\*\*** (date: \_\_\_\_)
- **Enzo (owner)**: **\*\*\*\***\_\_\_**\*\*\*\*** (date: \_\_\_\_)
- **Backup contact**: **\*\*\*\***\_\_\_**\*\*\*\*** (date: \_\_\_\_)

---

## Appendix — quick verification commands

```bash
# Single-shot pre-flight
sudo nginx -t && \
sudo systemctl is-active heuresys-api-gateway heuresys-app heuresys-enrichment && \
crontab -l | grep -q heuresys-evo-pull && \
psql -h 127.0.0.1 -U heuresys -d heuresys_platform -c "SELECT version()" >/dev/null && \
redis-cli ping | grep -q PONG && \
echo "PRE-FLIGHT: GREEN" || echo "PRE-FLIGHT: FAIL — investigate"

# Health smoke (from VM)
curl -fsS http://127.0.0.1:8200/health
curl -fsS http://127.0.0.1:3200/
curl -fsS https://evo.heuresys.com/      # post-DNS-cutover only

# RLS coverage
bash services/api-gateway/scripts/check-rls-coverage.sh

# Test counts
cd services/api-gateway && npx vitest run --reporter=basic 2>&1 | tail -3
```
