# heuresys-evo — Current State

> Updated: 2026-05-12T05:33Z · S47 closed + idempotency PASS + live smoke test PROD PASS

## Last session brief

S47: ciclo iterativo perf carry-forward chiuso (phase18t audit_logs idx + G6 prefetch instrumentation + pgBouncer 1.25.2 transaction mode :6432). Bench 30s × 20 conn from VM: `/org_systems` -61% (2234→874ms), `/employee_journey` -57% (1606→690ms), `/skills_heatmap` -26%, `/dashboard` G6 -19%. **8/9 routes within realistic P95 ≤ 1000ms target**. Idempotency check VM↔locale: 4/4 PASS (git HEAD + 35 migrations + 4 file hashes + 4 services active). Live smoke test `https://evo.heuresys.com` via Chrome MCP: **5/5 view PASS** (login + 4 dashboard, 2 personas, zero blocking errors).

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

Riferimenti: `docs/_audit/2026-05-12-perf-baseline/S47-FINAL.md` · `docs/_audit/2026-05-12-prod-smoke-test/REPORT.md` · `db/migrations/phase18{m,n,o,p,q,r,s,t}*.sql` · `scripts/dev-local/setup-pgbouncer.sh` (gitignored ops script)
