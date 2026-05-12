# heuresys-evo — Current State

> Updated: 2026-05-12T17:00Z · S49 closed · Brand v1.0 asset gate 14/14 ✅ · sign-off final pending audit

## Last session brief

S49 v1.0 asset gate closure: `/settings` 5-tab surface shipped (`(app)/settings/page.tsx` server-rendered + `_signout-button.tsx` client · URL search params `?tab=`) — tabs Profilo (session display + initials avatar) · Tema (ThemeToggle + link Brand Studio) · Lingua (LocaleSwitcher) · Notifiche (5-pref form UI stub con role=switch a11y · persistence v1.1) · Sessioni (current JWT card + signOut). Pattern coerente con S48 onboarding (var(--surface-1) · Exo 2 titles · motion utility classes). Brand v1.0 promotion checklist § 1 asset categorie ora 14/14 ✅. Sign-off final § 6 richiede ancora audit downstream (vedi top priorities). Typecheck PASS.

## Top priorities (remaining)

1. **v1.0 sign-off final** (~6-10h, scope misto già esistente in roadmap) — checklist § 6 richiede: visual smoke 8 ruoli × N viste · Lighthouse ≥ 90 (perf/a11y/best-practices/SEO) su `/login` + `/dashboard` + 2 surface random · WCAG 2.2 AAA audit (axe-core CI + manual NVDA pass) · DECISIONS-LOG entry L60+ "Brand v1.0 promoted" · BRAND-STATE.md update "v1.0 status: ✅ Done". Allineato con CLAUDE.md §Roadmap successiva #4 (WCAG audit) e #5 (perf bench).

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
