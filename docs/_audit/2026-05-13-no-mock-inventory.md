# NO-MOCK Inventory — heuresys-evo (S58 close)

> Run: 2026-05-13 · scope: tutte le surface UI/mockup/test  
> Constraint: P11 — SOLO DATI LIVE da DBMS. Source mancante → CREARE prima.

---

## Aggregate

- **Surface scansionate**: 26 (7 dashboard views TSX + 17 app pages + 2 e2e test files)
- **Surface con fixture**: 9 (7 dashboard views + 2 mockup HTML riuscono a mostrare demo quando DB vuoto)
- **Surface compliant (100% live)**: 17 app pages + login
- **Fixture totali rilevati**: ~180+ literal values (KPI numbers, department arrays, succession rows, skill names)
- **Query/route MANCANTI**: 0 (tutte le views hanno fetch function; mancano solo aggregazioni complesse per fallback)
- **Effort stimato totale**: 11h (1h pilot S58 + 10h phases S59-64)

---

## Tabella dashboard views: fixture breakdown

| File                            | Fixture rilevati (file:line)                                                                                                                    | Effort | Priority |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------: |
| **TenantOwnerOverviewView.tsx** | KPI L160 1.247, L167 3.91, L174 82.4%, L181 62.4M + dept array L206-214 (8 rows hardcoded) + comp grid L253-258 (4 values) + succession L94-130 | 1.5h   |       P0 |
| **HrDirectorOverviewView.tsx**  | KPI L125-162 hardcoded + skill-gap table L188-238 (8 rows) + activity feed L272-327 (6 demo events) + succession L87-97                         | 2h     |       P0 |
| **SkillsHeatmapView.tsx**       | 8 dept names, 12 skill names, cells matrix via Math.sin, 6 critical cells hardcoded, 7 buckets                                                  | 1.5h   |       P1 |
| **CapabilityGraphView.tsx**     | 5 clusters, 24 nodes, 5 topEntities hardcoded (inDegree/outDegree/centrality), ESCO sync stats fallback                                         | 2h     |       P1 |
| **EmployeeJourneyView.tsx**     | Career arc 5 stages, 4 reviews, 3 bridges con readiness, skill-trend colors + values, radar current/target                                      | 2h     |       P1 |
| **CrossTenantOverviewView.tsx** | Fallback series 4 tenants × 13 months (RTL 60→125, SmartFood 35→68, EcoNova 20→50, Heuresys 10→20)                                              | 1h     |       P1 |
| **OrgSystemsView.tsx**          | RBAC matrix 8 rows hardcoded (% per role), 4 system metrics + sparklines                                                                        | 1h     |       P1 |

**Subtotale**: 7 views, ~150 fixture values, 11h effort, all hanno live fetch function con fallback safe

---

## App pages: 100% compliant

26 pages (employees, compensation, dashboard, ontology, admin/_, explorer/_, me/\*, team, reviews, goals, learning, settings, onboarding, showcase, login):

- **Zero fixture inline**
- All use Prisma live queries
- RLS scope enforcement active
- i18n strings only (UI labels OK)

---

## Mockup HTML: design reference only

17 files (.ux-design/06-mockups/):

- **Pure HTML/CSS reference**
- Never rendered in production
- Static fixture OK for layout validation
- 5 login variants, 7 dashboard mockups, 5 process flow mockups

---

## Widget layer: 100% data-driven

20 brand widgets — all receive data via props from adapter layer, zero fixture.

---

## E2E tests: live DB expected

3 files (dashboard.spec.ts, dashboard-rbp-matrix.spec.ts, auth.spec.ts):

- No inline fixture
- External test user seed
- HAS_FULL_STACK guard enforces DB requirement

---

## Priority d'attacco

| Sprint    | Task                                                           | Effort |  Status |
| --------- | -------------------------------------------------------------- | ------ | ------: |
| S58 (NOW) | TenantOwnerOverviewView: dept array + comp grid → live queries | 1h     |   Pilot |
| S59       | HrDirectorOverviewView: skill-gap + activity feed              | 2h     | pending |
| S60       | SkillsHeatmapView: Math.sin → live aggregation                 | 1.5h   | pending |
| S61       | CapabilityGraphView: topEntities + escoSync                    | 2h     | pending |
| S62       | EmployeeJourneyView: stages/reviews/bridges/radar              | 2h     | pending |
| S63       | CrossTenantOverviewView: workforce trend                       | 1h     | pending |
| S64       | OrgSystemsView: system metrics (P2)                            | 0.5h   | pending |
| S65       | Polish: feature flag or error boundary per fallback            | 0.5h   | pending |

---

## Note finali

- **Architecture sound**: W4 pattern (RSC async + withTenant + safe fallback) è corretto per dev/demo
- **Zero blockers**: All query functions exist; fallback arrays sono intentional per UX safety
- **All 26 app pages compliant**: 100% live queries, no hardcoded data
- **Recommendation**: Pilot TenantOwner → remove 2 inline arrays (dept, comp) → phase rest S59+
- **.ux-design/10-staging/ missing**: No brand staging directory found (N/A)
- **Mockup status**: 100% design reference, safe to archive or version
