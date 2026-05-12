# heuresys-evo — Current State

> Updated: 2026-05-12T18:35Z · S51 closed · 3 di 7 priorità S50 carry-forward chiuse · VM synced HEAD `7c4cd14`

## Last session brief

S51 continuazione S50 brand audit. Utente Enzo ha rinviato verifica visiva finale e chiesto di procedere con Top 7 priorità S51+ (vedi DECISIONS-LOG L62). Chiuse 3/7: **P2** redirect logic v1→v2 in `dashboard/[code]/page.tsx` (sblocca rendering brand-fedele su tutti i preset legacy redirect automatico a `_v2` con 10-12 elements vs 3-4 v1), **P1** filter sidebar nav RBP risolto come diagnosi (SIDEBAR_MAP già filtra correttamente, RoleForbidden S50 copre deep-link), **P3** i18n sweep secondary di 9 file (role-nav-map.ts 61 labels + /explorer/{esco,kg,sap} + /me/{skills,goals,reviews,learning}). Le 3 priorità restanti (**P4 WCAG AAA** · **P5 Lighthouse** · **P6 dashboard widget visual audit**) sono carry-forward S52+ in attesa di verifica visiva. Commit `7c4cd14` pushed, VM rebuilt + restarted, services active.

## Top priorities (S52+)

1. **P4 WCAG 2.2 AAA full audit** (~3-5h) — `chrome-devtools-mcp:a11y-debugging` skill + axe-core CI integration su /login + /dashboard + /me + /admin/audit + NVDA manual pass. Sign-off final v1.0 gate.
2. **P5 Lighthouse ≥ 90 bench** (~1-2h) — `chrome-devtools-mcp:debug-optimize-lcp` su 4 surface (perf/a11y/best-practices/SEO). Carry-forward pre-S50.
3. **P6 Dashboard widget visual audit** (~2-3h) — `/brand:audit` skill cycle su `/dashboard` HR_DIRECTOR vs mockup canonical hr-director-overview.html side-by-side. Verifica D-6 era diagnosi corretta o c'è effettivo widget missing. Sub-task: distinguere BrandLayoutContainers count vs widget rendered count.
4. **Phase 2 employees vertical-split** (15-25h FTE, L60 carry-forward) — DROP COLUMN x77 + VIEW + INSTEAD OF triggers. Richiede preliminary audit 65 dependent views.
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
