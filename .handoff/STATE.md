# heuresys-evo — Current State

> Updated: 2026-05-12T18:55Z · S52 closed · P7 chiuso retroattivamente (Phase 2 già shipped) · VM HEAD `7c4cd14`

## Last session brief

S52 dedicata a P7 Phase 2 employees vertical-split. Investigazione ha scoperto che la migration era **già live** nel DB (`employees` è VIEW 95-col su `employees_core` 18-col TABLE + 209 FK + 3 INSTEAD OF triggers + satellites popolate 270/270 sync), nonostante L60 lo dichiarasse "deferred". Apply attempt phase16o-redo.sql ha auto-rollbacked alla scoperta di `employees_core already exists` (transaction safety intacta). Nessuna DDL eseguita in S52 oltre alle verifiche. Vedi DECISIONS-LOG L63 per documentazione retroattiva. CLAUDE.md §Carry-forward S27+ aggiornato: § 1.2 marcata SHIPPED.

S51 brief precedente (carry-forward storico): 3 di 7 priorità S50 chiuse — P2 redirect v1→v2, P1 diagnosi sidebar nav, P3 i18n sweep 9 file. Le 3 priorità restanti (P4 WCAG AAA · P5 Lighthouse · P6 dashboard widget visual audit) sono carry-forward S52+ in attesa di verifica visiva.

## Top priorities (S52+)

1. **P4 WCAG 2.2 AAA full audit** (~3-5h) — `chrome-devtools-mcp:a11y-debugging` skill + axe-core CI integration su /login + /dashboard + /me + /admin/audit + NVDA manual pass. Sign-off final v1.0 gate.
2. **P5 Lighthouse ≥ 90 bench** (~1-2h) — `chrome-devtools-mcp:debug-optimize-lcp` su 4 surface (perf/a11y/best-practices/SEO). Carry-forward pre-S50.
3. **P6 Dashboard widget visual audit** (~2-3h) — `/brand:audit` skill cycle su `/dashboard` HR_DIRECTOR vs mockup canonical hr-director-overview.html side-by-side. Verifica D-6 era diagnosi corretta o c'è effettivo widget missing. Sub-task: distinguere BrandLayoutContainers count vs widget rendered count.
4. ~~Phase 2 employees vertical-split~~ ✅ **SHIPPED** (verified S52, L63). employees=VIEW + employees_core=TABLE + 3 satellites + INSTEAD OF triggers + 209 FK + 65 dep views + 6 mat views.
5. **/analytics/workforce page** (~1h) — route linkato in sidebar ma 404 (no page.tsx). Scope separato.
6. **Visual smoke 8 ruoli × 9 viste** (~2-3h, plan canonical) — 72 screenshot via claude-in-chrome + role-switcher per acceptance criteria final v1.0.

## Open questions

- pgBouncer transaction mode vs Prisma `$transaction` complesse → eventuale `pool_mode=session` su connection-string dedicata (carry-forward S48).

## Stack snapshot (post-S51)

- 7 commit S50+S51 shipped: `9d39461` `d89c0d4` `58ee0f0` `e73c5be` `2577a23` `0ab2512` `7c4cd14`
- VM HEAD = `7c4cd14`, build OK con `NODE_OPTIONS='--max-old-space-size=6144'`
- Project default palette `legacy` canonical (`#3b82f6 primary` + `#a855f7 accent`)
- `RoleForbidden` component shipped (4 pages role-locked + brand-studio)
- Sidebar nav fully italian (8 ruoli × 3-9 link/ruolo + 4 sezioni shared)
- Dashboard preset v1→v2 redirect logic active (preserva observer + lang query)
- 16 pagine italian-ized totali (S50 + S51 sweep)

## Verification

```bash
LOCAL=$(git rev-parse HEAD)
VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
[ "$LOCAL" = "$VM" ] && echo "GIT IDEMPOTENT" || echo "DRIFT"

ssh oracle-vm-default "systemctl is-active heuresys-app heuresys-api-gateway pgbouncer postgresql"

# P2 redirect verification (requires authenticated session):
# Browser: navigate /dashboard/capability_graph -> redirect a /dashboard/capability_graph_v2 (11 widgets)
# Console: curl -sI https://evo.heuresys.com/dashboard/capability_graph -> 307 (auth redirect first)
```

Riferimenti: `.ux-design/DECISIONS-LOG.md` L62 (S51 closure) · L61 (S50) · `.ux-design/08-promotion/v1.0-checklist.md` § 6 sign-off pending.
