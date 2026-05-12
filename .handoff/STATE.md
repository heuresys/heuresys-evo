# heuresys-evo — Current State

> Updated: 2026-05-12T19:10Z · S52 closed · P7 retro + DDL audit + pre-push hook · HEAD `2bd6768`

## Last session brief

S52 dedicata a P7 Phase 2 employees vertical-split. Investigation rivela migration già live in PROD (commit `bf18e57` S32) ma orphan in DECISIONS-LOG → propagato fantasma per 4 handoff (L60→L61→L62). Doc retroattiva shipped (L63 + L64 + L65): 11 commit DDL storici tutti citati con short hash. `.husky/pre-push` hook shipped (`f380be9`) — rifiuta push DDL senza pairing L\<N\>. Audit programmatico: **0 orphans residui**. VM HEAD resta `7c4cd14` (3 commit doc/hook-only, no rebuild).

## Top priorities (S53+)

1. **P4 WCAG 2.2 AAA full audit** (~3-5h) — `chrome-devtools-mcp:a11y-debugging` + axe-core CI + NVDA manual pass su /login + /dashboard + /me + /admin/audit. Sign-off v1.0 gate. Visual dependent.
2. **P5 Lighthouse ≥ 90 bench** (~1-2h) — perf/a11y/best-practices/SEO su 4 surface. Visual dependent.
3. **P6 Dashboard widget visual audit** (~2-3h) — `/brand:audit` cycle vs mockup canonical hr-director-overview.html. Visual dependent.
4. **`/analytics/workforce` page** (~1h) — route linkato in sidebar ma 404 (no page.tsx). Scope separato.
5. **Visual smoke 8 ruoli × 9 viste** (~2-3h) — 72 screenshot acceptance criteria final v1.0.

## Open questions

- pgBouncer transaction mode vs Prisma `$transaction` complesse → eventuale `pool_mode=session` su connection-string dedicata.

## Stack snapshot (post-S52)

- 12 commit S50+S51+S52 shipped: `9d39461` `d89c0d4` `58ee0f0` `e73c5be` `2577a23` `0ab2512` `7c4cd14` `c309904` `f1e34ea` `f380be9` `2bd6768`
- Phase 2 employees vertical-split LIVE: `employees` VIEW 95-col + `employees_core` TABLE 18-col + 209 FK + 3 INSTEAD OF triggers + 4 satellites sync
- `.husky/pre-push` DDL→L\<N\> gate attivo (L65)
- DECISIONS-LOG L1→L65, 0 orphans

## Verification

```bash
LOCAL=$(git rev-parse HEAD); VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
ssh oracle-vm-default "systemctl is-active heuresys-app heuresys-api-gateway pgbouncer postgresql"
# Audit orphans (expect "✓ 0 orphans"):
git log --all --format="%H|%s" | grep -iE "feat\(db\)|migration\(|phase1[5-9]" | while IFS="|" read sha s; do
  grep -qF "${sha:0:7}" .ux-design/DECISIONS-LOG.md || echo "ORPHAN: ${sha:0:7} :: $s"
done
```

Riferimenti: `.ux-design/DECISIONS-LOG.md` L63 (S52 P7 retro) · L64 (audit DDL orphans) · L65 (pre-push hook).
