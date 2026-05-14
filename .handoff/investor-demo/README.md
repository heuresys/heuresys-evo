# Investor Demo — heuresys-evo cycle 2

> S63 autonomous run · Phases 0-6 shipped · 19 preset `_v2` live + 6 widget brand nuovi.

## Quick start

**Production URL**: https://evo.heuresys.com/login

**Canonical credentials** (8 user matrix RTL Bank, password unica `Heuresys2026!`):

| Role | Username (work email) | Landing |
|---|---|---|
| SUPERUSER | `sysadmin` | `/dashboard` → `cross_tenant_overview_v2` |
| TENANT_OWNER | `lorenzo.colombo@rtl-bank.org` | `/dashboard` → `tenant_owner_overview_v2` |
| IT_ADMIN | `francesca.romano@rtl-bank.org` | `/dashboard` → `org_systems_v2` |
| HR_DIRECTOR | `valentina.conti@rtl-bank.org` | `/dashboard` → `hr_director_overview_v2` |
| HR_MANAGER | `martina.greco@rtl-bank.org` | `/dashboard` → `skills_heatmap_v2` |
| DEPT_HEAD | `paolo.ferrari@rtl-bank.org` | `/dashboard` → `capability_graph_v2` |
| LINE_MANAGER | `alessandro.bruno@rtl-bank.org` | `/dashboard` → `employee_journey_v2` |
| EMPLOYEE | `giulia.marini@rtl-bank.org` | `/dashboard` → `employee_journey_v2` |

Username pattern canonical: `<first>.<last>@<tenant.domain>` (post L50 archive). Vedi `tests/.test-env`.

## Suggested investor walkthrough

### 1. HR_DIRECTOR cockpit (5 min)

Login come Valentina Conti → `/dashboard` (= `hr_director_overview_v2`).

Mostra:
- Hero strip 4 KpiRing live (Headcount · Review completion · Goals · Succession ready)
- RbacMatrix cross-cutting role × area
- ActivityFeed live audit_logs
- SuccessionCard top-3 ready_now

Drill in catena cockpit → operational:
- Click su KPI Review completion → naviga a `/dashboard/process_performance_cycle_v2` (cockpit cycle dettaglio)
- Click su sidebar "Valutazioni" → `/reviews` (operational deep-dive SH-2)

### 2. Cycle 2 preset _v2 panorama (10 min)

Naviga manualmente i preset cycle 2 cockpit:

| Preset | URL |
|---|---|
| Talent registry | `/dashboard/employees_directory_v2` |
| Review cycle | `/dashboard/reviews_cycle_v2` |
| OKR cascade | `/dashboard/goals_cascade_v2` |
| Learning overview | `/dashboard/learning_paths_overview_v2` |
| Compensation | `/dashboard/compensation_overview_v2` |
| Workforce analytics | `/dashboard/workforce_analytics_v2` |
| Audit trail | `/dashboard/admin_audit_v2` |
| RBAC matrix | `/dashboard/admin_rbac_v2` |

Pattern uniforme cross-route:
- Hero KpiRing 4-strip live SQL (current_tenant_id() null-safe)
- Body Histogram con stage breakdown
- Activity rail live audit_logs
- P11 compliance: dato mancante → `<DataNotAvailable />` esplicito, mai placeholder

### 3. Process cycle (5 min)

I 4 process_*_v2 sub-cycle (H2R, SKILGRO, GOKMER):

| Sub-cycle | URL |
|---|---|
| Recruiting funnel | `/dashboard/process_recruiting_funnel_v2` |
| Onboarding flow | `/dashboard/process_onboarding_flow_v2` |
| Performance cycle | `/dashboard/process_performance_cycle_v2` |
| Learning paths | `/dashboard/process_learning_paths_v2` |

### 4. Operational legacy (5 min)

Operational deep-dive routes SH-2 shipped (Bulk action + filter avanzati):
- `/employees` — talent registry (HR_MANAGER+)
- `/reviews` — review cycle workflow
- `/goals` — OKR detail
- `/learning` — enrollment + cert
- `/compensation` — pay band detail
- `/analytics/workforce` — workforce KPI live

### 5. Brand identity wordmark (1 min)

Wordmark "heuresys" Exo 2 700 con:
- body `var(--brand-blue)` (navy primary, μ-architect-legacy palette)
- "y" colore accent `var(--accent)` (purple)
- "h" minuscola, 8 lettere identiche

Visibile nel topbar `nav-bar` + footer `app-footer`.

## Cycle 2 canonical references

| File | Scopo |
|---|---|
| `.ux-design/01-canonical/moodboard.md` | Direzione "Calm Cockpit Decisionale" (Linear-meets-Stripe-meets-Visier) |
| `.ux-design/01-canonical/layout-pattern.md` | 10 leggi cockpit + 5 primitives + DOM anatomy |
| `.ux-design/01-canonical/role-data-matrix.md` | 23 route × 8 ruoli scope semantics |
| `.ux-design/01-canonical/widget-vocabulary.md` | Mapping tipologia → widget |
| `.ux-design/01-canonical/anti-patterns.md` | 10 categorie banditi cross-route |

## Stato S63 closure

5 Phase shipped piene (0-4) + 2 Phase partial (5 decision-record, 6 i18n widget Phase 3). Phase 7 verification residua come follow-up (Chrome MCP 56 screenshot + Lighthouse 5 preset + brand:audit cross-route).

| Phase | Commit | Effort reale |
|---|---|---|
| 0 | `0ebf49e` | foundations + 9 canonical + role-shaper 42 test + base-adapter |
| 1 | `114d228` | 4 process_*_v2 reseed (3→11 elements, 44 total) |
| 2 | `1d323db` | 8 query modules role-aware P11 |
| 3 | `440769f` | 6 widget brand nuovi |
| 4 | `3707997` | 8 nuovi preset _v2 + 40 elements |
| closure-v1 | `ff6872b` | STATE.md + L13 |
| Phase 5+6 | `babd922` | i18n widget refactor + route migration decision |

Plan canonical: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`.

## Verification snapshot pre-demo

```bash
# Smoke prod (atteso HTTP 200)
curl -sI https://evo.heuresys.com/login | head -1

# Smoke dev (atteso HTTP 200)
curl -sI http://localhost:3200/login | head -1

# Count preset _v2 published (atteso 19)
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"SELECT COUNT(*) FROM dashboard_presets WHERE code LIKE '%_v2' AND is_published = true;\""

# Typecheck (services/app, atteso exit 0)
cd services/app && npx tsc --noEmit && echo OK

# Role-shaper unit tests (atteso 42/42 PASS)
cd services/app && npx vitest run src/lib/data/__tests__/_role-shaper.test.ts

# Tenant-id lint (atteso exit 0)
npm run lint:tenant-id

# Anti-pattern grep cross JSX (atteso 0 match user-facing)
grep -rEn "Scaffold base|Lorem ipsum|carry-forward|DECISIONS-LOG L\d|Sprint \d" services/app/src/app services/app/src/components | grep -v "__tests__\|\.test\.\|\.spec\."
```
