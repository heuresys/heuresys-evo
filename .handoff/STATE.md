# heuresys-evo — Current State

> Updated: 2026-05-12T06:05Z · S48 closed · Phase 2 verified · Brand v1.0 A+B+C ✅ · G6 cache layer shipped

## Last session brief

S48: carry-forward cleanup + Brand v1.0 promotion gate audit + G6 dashboard cache layer.

1. **§ 1.2 employees vertical-split Phase 2** verified ALREADY CLOSED on prod DB (S32 commit `bf18e57`, 2026-05-11T00:44:19Z). Evidence: `employees` relkind=`v` · `employees_core` relkind=`r` · 3 satellite tables 270/270/270 · 3 INSTEAD OF triggers · VIEW count 270.

2. **Brand v1.0** (`.ux-design/08-promotion/v1.0-checklist.md`):
   - Stage A (5 cat asset statici) verified shipped commit `56626a1`
   - Stage B (next/font integration) verified shipped (3/3 fonts wired in layout.tsx)
   - Stage C (motion library) extracted from SoT motion-final.md → 4 ease + 6 dur tokens + `motion.css` (4 keyframes + 7 utility classes) + `lib/motion/variants.ts` (Framer Motion variants). Commit `f70d8a4`.

3. **G6 dashboard cache layer** (commit `aa7288f`): hot path analysis pre-prefetch revealed 4 sequential DB queries (~120-260ms/request cold). Implementation: `role-preset-resolver` wrapped `unstable_cache` 300s · new `dashboard-meta-cache.ts` (cached tenant name + preset meta, 300s TTL) · `dashboard/page.tsx` parallelizes 2 pairs via `Promise.all`. Expected -150-250ms on warm path. 230/230 test PASS (fixed 1 pre-existing failure on dashboard-data-fetcher).

## Top priorities (remaining)

1. **Brand v1.0 Stage D — 4 surface utility** (~4-6h, sessione dedicata) — 4 mockup HTML (404 · empty · onboarding · settings) + `/studio:bootstrap` route promotion.
2. **Brand v1.0 Stage E — brand book v1 visivo** (~8-12h, opzionale) — typesetting + cover + asset embed alta risoluzione.
3. **G6 production bench verification** (~30min) — autocannon vs `evo.heuresys.com/dashboard` post-deploy, target P95 ≤ 1000ms achieved via warm-cache hit.

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
