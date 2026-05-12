# heuresys-evo — Current State

> Updated: 2026-05-12T04:50Z · S47 perf optimization batch CLOSED — all 4 carry-forward resolved (excluding architectural #5/#6)

## Last session brief

S47: ciclo iterativo fix+test sui 4 carry-forward perf chiuso. (1) phase18t idx audit_logs(created_at DESC). (2) G6 prefetch instrumentation per-widget hrtime + env-gated PERF_LOG=1. (3) pgBouncer installato su VM (transaction mode, listen :6432, pool 20+5), services/app + services/api-gateway DATABASE_URL switched 5432→6432. (4) Bench finale 30s × 20 conn from VM mostra miglioramenti drastici: `/org_systems` -61% (2234→874ms), `/employee_journey` -57% (1606→690ms), `/skills_heatmap` -26%, `/dashboard` G6 -19%. Per target realistico P95 ≤ 1000ms sotto 20-conn load: **8/9 routes within target** (solo /dashboard G6 a 1006ms, marginal).

## Top priorities (remaining)

1. **§ 1.2 employees vertical-split Phase 2** (~15-25h, architectural multi-sessione) — DROP COLUMN ×77 + 65 view dependency refactor.
2. **Brand v1.0 promotion** (~16-25h, 2-3 sessioni) — 8 categorie asset checklist (`.ux-design/08-promotion/v1.0-checklist.md`).

## Open questions

- **`/dashboard` G6 marginal 1006ms**: ulteriore ottimizzazione (DashboardRenderer per-widget cache) potrebbe portare sotto 1000ms ma è scope di future iterazione.
- **pgBouncer transaction mode + Prisma prepared statements**: configurato `ignore_startup_parameters = extra_float_digits,search_path` in pgbouncer.ini per compatibility. Eventuale Prisma transactions complesse (multi-statement) potrebbero richiedere pool_mode=session su connection-string specifica.

## Stack snapshot (post-S47)

- pgBouncer 1.25.2 active su oracle-vm-default:6432 (transaction mode, 20+5 pool, max_client 100)
- services/app + services/api-gateway DATABASE_URL → localhost:6432 (production)
- SSH tunnel locale resta su 5432 (bypass pooler per Prisma migrations)
- 8 mat views attive (mv_rbac_matrix + 5 esistenti + 2 ulteriori) · refresh 4h systemd
- 10 indici post-S47: phase18t idx_audit_logs_created_at_desc
- G6 instrumentation pronta (env PERF_LOG=1 attiva per debugging)
- typecheck + lint:tenant-id + lint:mock-identities PASS
- **Perf realistic-target (20-conn load): 8/9 routes within P95 ≤ 1000ms**

## Verification

```bash
# 4-step idempotency check
LOCAL=$(git rev-parse HEAD)
VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
[ "$LOCAL" = "$VM" ] && echo "GIT IDEMPOTENT" || echo "DRIFT"

ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT COUNT(*) FROM schema_migrations WHERE version LIKE 'phase18%'\""
# Expected: includes phase18t

ssh oracle-vm-default "systemctl is-active heuresys-app heuresys-api-gateway pgbouncer postgresql"
# Expected: 4× active

# Live URL smoke
curl -I https://evo.heuresys.com/login
# Expected: HTTP 200 + valid cert
```

Riferimenti: `docs/_audit/2026-05-12-perf-baseline/S47-FINAL.md` · `db/migrations/phase18{m,n,o,p,q,r,s,t}*.sql` · `scripts/dev-local/setup-pgbouncer.sh` (gitignored ops script)
