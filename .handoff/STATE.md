# heuresys-evo — Current State

> Updated: 2026-05-12T18:15Z · S50 closed · brand audit ciclico shipped · 5 commit · VM synced · 14 drift chiusi

## Last session brief

S50 brand design audit visivo + correzione ciclica (vedi DECISIONS-LOG L61). Utente Enzo ha segnalato "imprecisioni, errori, omissioni" su tutte le surface. Audit sistemico con `claude-in-chrome` su 9 superfici prod live (`/login` /dashboard /me /onboarding /settings /admin/* /brand-studio /404 /explorer/*) ha catalogato **21 drift evidence-based**, 14 fixati in 5 cluster (A quick wins · B foundation brand · C dashboard guards · D branded forbidden · E italian sweep), 4 chiusi come diagnosi, 3 spostati carry-forward S51. 5 commit pushed a `origin/main` (HEAD `2577a23`). VM `oracle-vm-default` rebuilded `NODE_OPTIONS='--max-old-space-size=6144'` + restart services. HTTPS smoke verified: `/me` italiano + locations.name lookup · `/onboarding` firstName "Valentina" via DB lookup · `/admin/users` "Permessi insufficienti" branded RoleForbidden · `/dashboard` "Direzione HR" (no "(G6)" sigle leak) · footer "heuresys.com" clean. Nuovo componente shipped: `RoleForbidden.tsx` riusabile per 4 pages role-locked. Project default palette resettata a `legacy` canonical (era `mu-architect`).

## Top priorities (remaining S51+)

1. **Sidebar nav RBP filter** (~1-2h) — link admin attualmente visibili anche per role insufficient; cliccando ora si vede RoleForbidden branded ma il link non dovrebbe nemmeno apparire. File: `services/app/src/app/(app)/_components/nav-builder.tsx` + `getNavForUser` filtra per role.
2. **Dashboard preset v1→v2 redirect** (~30min) — `/dashboard/{code}` (v1 con 3-4 elements) → redirect a `/dashboard/{code}_v2` (10-12 elements) quando v2 exists. File: `services/app/src/app/(app)/dashboard/[code]/page.tsx`. Sblocca rendering completo capability_graph (D-18 deferred).
3. **i18n sweep completa** (~2-3h) — pages secondarie ancora EN: `/explorer/{esco,sap,kg}`, `/me/{skills,goals,reviews,learning}` sub-pages, `/analytics/workforce`, dettagli `/admin/integrations` table body.
4. **WCAG 2.2 AAA full audit** (~3-5h) — axe-core CI + NVDA pass · resta carry-forward pre-S50 (sign-off final v1.0).
5. **Lighthouse ≥ 90 visual smoke** (~1-2h) — bench 4 surface (login/dashboard/me/admin/audit) post-S50 fix.
6. **Dashboard widget count audit visual** (~2-3h) — `/brand:audit` skill cycle su `/dashboard` HR_DIRECTOR vs mockup canonical hr-director-overview.html. Verifica D-6 era diagnosi corretta (cardCount metric non affidabile).
7. **Phase 2 employees vertical-split** (15-25h FTE, carry-forward L60) — DROP COLUMN x77 + VIEW + INSTEAD OF triggers. Richiede preliminary audit 65 dependent views.

## Open questions

- pgBouncer transaction mode vs Prisma `$transaction` complesse → eventuale `pool_mode=session` su connection-string dedicata (carry-forward S48).

## Stack snapshot (post-S50)

- 5 commit shipped: `9d39461` (cluster A) · `d89c0d4` (B) · `58ee0f0` (D) · `e73c5be` (C partial) · `2577a23` (E)
- VM build con `NODE_OPTIONS='--max-old-space-size=6144'` (default 2GB OOM on ARM64 free-tier)
- Project default palette `legacy` (era `mu-architect`) · canonical L48 `#3b82f6 primary` + `#a855f7 accent`
- `RoleForbidden` component shared (services/app/src/app/(app)/_components/) usato in brand-studio + 3 admin pages
- DB cleanups: 11 preset name strip "(G6)" · 4 preset persona_label NULL · 1 row goals DELETE
- 8 pagine italian-ized (h1 + body + error messages + table headers)

## Verification

```bash
# Idempotency check
LOCAL=$(git rev-parse HEAD)
VM=$(ssh oracle-vm-default "cd /home/ubuntu/heuresys-evo && git rev-parse HEAD")
[ "$LOCAL" = "$VM" ] && echo "GIT IDEMPOTENT" || echo "DRIFT"

# Services up
ssh oracle-vm-default "systemctl is-active heuresys-app heuresys-api-gateway pgbouncer postgresql"

# Live HTTPS smoke (auth + role + branded)
curl -sI https://evo.heuresys.com/login        # 200
curl -sI https://evo.heuresys.com/dashboard    # 307 -> /login (no auth)
curl -sI https://evo.heuresys.com/nonexistent  # 200 (branded 404 via not-found.tsx)

# Brand audit visual (richiede browser):
# - /me: h1 = "Il mio profilo" + labels italiane
# - /admin/users (HR_DIRECTOR): "Permessi insufficienti" branded
# - /onboarding?step=1: heading "Benvenuto su Heuresys, <FirstName>" (no email)
# - /dashboard: h1 = "Direzione HR" (no "(G6)" suffix)
```

Riferimenti: `.ux-design/DECISIONS-LOG.md` L61 · `.ux-design/08-promotion/v1.0-checklist.md` § 6 sign-off · `~/.claude/plans/purtroppo-il-risultato-visibile-quizzical-giraffe.md` (audit plan canonical).
