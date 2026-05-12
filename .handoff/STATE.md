# heuresys-evo — Current State

> Updated: 2026-05-12T06:45Z · S48 closed · 6 commit shipped · prod synced · G6 PASS · Brand v1.0 ~85% promoted

## Last session brief

S48: carry-forward exhaustion run — Phase 2 verified + Brand v1.0 A/B/C + G6 cache layer + G6 prod bench verification + VM deploy + Brand v1.0 Stage D 4/5.

1. **§ 1.2 employees vertical-split Phase 2** verified ALREADY CLOSED S32 (commit `bf18e57`). DB evidence: `employees` relkind=`v` · `employees_core` relkind=`r` · 3 satellites 270/270/270 · 3 INSTEAD OF triggers.

2. **Brand v1.0 promotion** (`.ux-design/08-promotion/v1.0-checklist.md`):
   - Stage A (5 quick wins asset statici) verified shipped commit `56626a1`
   - Stage B (next/font 3/3 fonts) verified shipped layout.tsx
   - Stage C (motion library) shipped `f70d8a4`: 4 ease + 6 dur tokens · `motion.css` (4 keyframes + 7 utility classes) · `lib/motion/variants.ts`
   - Stage D 4/5 surface shipped: `app/not-found.tsx` + `app/error.tsx` (`0bbfe2c`) · `(app)/onboarding/page.tsx` 4-step stepper (`d578d62`) · EmptyState già in @heuresys/ui

3. **G6 dashboard cache layer** (`aa7288f`): `unstable_cache` 300s su `resolvePresetCodeForRole` + new `dashboard-meta-cache.ts` (getCachedTenantName + getCachedPresetMeta) + `Promise.all` parallelizzazione 2 query pairs.

4. **G6 prod bench verified** (`4de3b19`): VM autocannon 30s × 20 conn vs `evo.heuresys.com/dashboard`, 3 personas:
   - HR_DIRECTOR P95 **705ms** (-30% vs S47 1006ms)
   - SUPERUSER P95 **660ms** (-34%)
   - TENANT_OWNER P95 **640ms** (-36%)
   - **Verdict PASS** — all 3 within target ≤ 1000ms

5. **VM deploy S48** synced to commit `d578d62` (post-onboarding) · `heuresys-app` active · HTTPS 200.

## Top priorities (remaining)

1. **Brand v1.0 Stage D residue — /settings tabs** (~1-2h) — Profile/Theme/Locale/Notifications/Sessions tabs, completa Stage D 5/5.
2. **Brand v1.0 Stage E — brand book v1 visivo** (~8-12h, opzionale) — typesetting + cover + asset embed, richiede Figma o tool equivalente (eternal carry-forward in CLI puro).

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
