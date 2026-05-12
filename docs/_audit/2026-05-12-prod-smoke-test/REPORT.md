# Production smoke test — https://evo.heuresys.com — S47 closure

> Run: 2026-05-12 04:55 GMT+2 · Chrome MCP via plugin chrome-devtools-mcp · post S47 deployment

## Pre-flight

| Check                                    | Result                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| `curl -I https://evo.heuresys.com/login` | HTTP 200                                                 |
| SSL cert verify                          | OK (ssl_verify_result=0)                                 |
| Total response                           | 0.122s                                                   |
| Server header                            | nginx/1.24.0 (Ubuntu)                                    |
| Backend                                  | Next.js 16.2.4 standalone (PROD env confirmed in footer) |

## Smoke test coverage (5 view across 2 personas)

| #   | Route                                   | Persona                                      | Snapshot                                                                                                             | Console errors                     | Verdict |
| --- | --------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------- |
| 1   | `/login`                                | unauthenticated                              | uid=11_0 form rendered (heuresys logo · Accedi CTA)                                                                  | 0                                  | ✓ PASS  |
| 2   | `/dashboard` (G6)                       | HR_DIRECTOR (`valentina.conti@rtl-bank.org`) | uid=12_0 Direzione HR(G6) · HEADCOUNT 270 · RBAC matrix 4 roles                                                      | 1× 404 font preload (non-blocking) | ✓ PASS  |
| 3   | `/dashboard/employee_journey`           | HR_DIRECTOR                                  | uid=13_0 PercorsoDipendente · career arc 5 stages live data (Risk analyst 2005, Investment advisor 2006, ...)        | 1× 404 font preload                | ✓ PASS  |
| 4   | `/dashboard/cross_tenant_overview` (G6) | SUPERUSER (`sysadmin`)                       | uid=16_0 Cross-tenant Overview(G6) · 4 tenants · 270 employees · 7 integrations all healthy                          | 0                                  | ✓ PASS  |
| 5   | `/dashboard/org_systems` (legacy)       | SUPERUSER                                    | uid=17_0 Organizzazione e Sistemi · **RBAC matrix 8 ROLES × 8 AREAS** (post phase18r mat view) · audit 27 events 24h | 0                                  | ✓ PASS  |

## Key prod-only confirmations

- **ENV=PROD** in footer su tutte le 4 dashboard view
- **HTTPS** via nginx 1.24.0 reverse proxy (port 443 → 3200 Next.js)
- **pgBouncer pipeline active** (heuresys-app:3200 → pgbouncer:6432 → postgres:5432)
- **Data live** (non fixture): tenant headcount 270 = DB count effective, audit_events 24h = 27 (rivela attività smoke test stesso)
- **Mat view mv_rbac_matrix in uso**: 8 roles × 8 areas renderizzato in `/org_systems` (era 4×3 nelle bench locale precedente — qui visualizza l'intera matrice perché data_source SQL post-phase18r aggrega da mat view senza LIMIT 4)
- **Cross-tenant aggregation OK**: 4 tenants attivi · 270 employees totali · integrations 7 (su 20 totali, top 7 healthy)

## Artifacts

- `01-login-prod.png` — login form rendered (1 screenshot taken successfully)
- Screenshot per view #2-5 omessi per timeout `Page.captureScreenshot` su pagine heavy (dashboard render >10s con full-page). Snapshot a11y tree salvato come reference equivalente.

## Console error summary (cross-page)

Solo `[error] Failed to load resource: 404` su 2 view (HR_DIRECTOR view #2 + #3). Confirmed non-blocking:

- Manifest font/CSS preload reference che il browser tenta ma server risponde 404 (preload optimization Turbopack)
- Non impatta rendering né funzionalità
- Carry-forward S48+ (cosmetic): clean preload manifest

## Functional verification (manual visual)

1. **Login auth flow**: form → POST `/api/auth/callback/credentials` → redirect `/dashboard` → session cookie `authjs.session-token` set → ✓ working
2. **Role-based routing**: HR_DIRECTOR vede 19 sidebar links + dashboard `hr_director_overview_v2`. SUPERUSER vede 15 sidebar links + `cross_tenant_overview_v2`. ✓ RBAC enforcement active
3. **Data live rendering**: KPI numbers, RBAC matrix, career arc all populated with Prisma-bound data (no fixture fallback visible)
4. **Layout brand-fedele**: dark theme, μ-architect typography, brand-blue/purple accent, breadcrumbs all consistent

## Verdict

**✅ PROD SMOKE TEST PASS** — 5/5 view rendering correctly with live data + zero blocking errors. Platform operating normally post S47 perf optimization batch + pgBouncer.

## Carry-forward (carry-over architectural ONLY)

- (5) § 1.2 employees vertical-split Phase 2 — ~15-25h, separate session
- (6) Brand v1.0 promotion — ~16-25h, 2-3 sessions
