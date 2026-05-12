# heuresys-evo — Current State

> Updated: 2026-05-12T14:25Z · S48 closed · 9 commits · prod synced · G6 PASS · Brand v1.0 ~93%

## Last session brief

S48 carry-forward exhaustion: Phase 2 vertical-split verified already closed S32 (DB evidence 7/7); Brand v1.0 Stages C/D/E shipped (motion library `services/app/src/styles/motion.css` + `lib/motion/variants.ts` · `app/not-found.tsx` + `app/error.tsx` + `(app)/onboarding/page.tsx` 4-step stepper · Stage E closed via Storybook audit `Brand/*` 28 stories + new `Brand/Motion/Library (S48)`); G6 dashboard cache layer (`unstable_cache` 300s on `resolvePresetCodeForRole` + new `dashboard-meta-cache.ts` + `Promise.all` parallelization) verified in production via VM autocannon 30s × 20 conn: HR_DIRECTOR P95 705ms, SUPERUSER 660ms, TENANT_OWNER 640ms — all under 1000ms target, -30/-34/-36% vs S47 baseline. 230/230 test PASS; typecheck PASS; VM redeploy + HTTPS smoke OK.

## Top priorities (remaining)

1. **Brand v1.0 Stage D residue — `/settings` tabs** (~1-2h) — Profile/Theme/Locale/Notifications/Sessions tabs · chiude Stage D 5/5 (unico item v1.0 promotion gate non chiuso, coverage attuale 13/14 ✅ + 1 🟡).

## Open questions

- **pgBouncer transaction mode + Prisma multi-statement transactions**: `ignore_startup_parameters = extra_float_digits,search_path` attivo. Eventuale Prisma `$transaction` complesse potrebbero richiedere `pool_mode=session` su connection-string dedicata.

## Stack snapshot (post-S48)

- pgBouncer 1.25.2 active su oracle-vm-default:6432 (transaction mode, 20+5 pool)
- services/app + services/api-gateway DATABASE_URL → localhost:6432 (prod)
- 8 mat views attive · refresh 4h systemd
- 10 indici post-S47 (phase18t idx_audit_logs_created_at_desc)
- **G6 cache layer S48**: `resolvePresetCodeForRole` + `getCachedTenantName` + `getCachedPresetMeta` (unstable_cache TTL 300s, tag `dashboard-meta`)
- **Motion library S48**: 4 ease + 6 dur tokens + `services/app/src/styles/motion.css` (4 keyframes + 7 utility classes) + `services/app/src/lib/motion/variants.ts` (Framer Motion variants)
- **G6 prod bench**: 3 personas /dashboard P95 640–705ms · PASS ≤ 1000ms

## Verification

```bash
# Idempotency check
LOCAL=$(git rev-parse HEAD)
VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
[ "$LOCAL" = "$VM" ] && echo "GIT IDEMPOTENT" || echo "DRIFT"

# Services up
ssh oracle-vm-default "systemctl is-active heuresys-app heuresys-api-gateway pgbouncer postgresql"

# Live HTTPS smoke
curl -sI https://evo.heuresys.com/login | head -3
curl -sI https://evo.heuresys.com/nonexistent | head -3  # → 404 via app/not-found.tsx
```

Riferimenti: `scripts/perf/results/s48-g6-*.md` · `.ux-design/08-promotion/v1.0-checklist.md` · `packages/ui/src/stories/brand/28-motion-library-production.stories.tsx`
