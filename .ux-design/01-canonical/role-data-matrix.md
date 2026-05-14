# Role-Data Matrix — cycle 2 canonical

> Codificazione formale di plan §2 (canonical S63+). 17 voci sidebar × 8 ruoli.
> SoT per le decisioni di scope/visibility/aggregation per ciascuna cellula `<ruolo, voce>`.
> Riferimento plan: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md` §2.

## Ruoli canonical (8)

| Sigla        | Level | Profilo                                                    |
| ------------ | :---: | ---------------------------------------------------------- |
| SUPERUSER    |  -1   | platform admin cross-tenant                                |
| TENANT_OWNER |   0   | proprietario di tenant; vista snapshot completo del tenant |
| IT_ADMIN     |   1   | admin tecnico tenant (RBAC, integrations, audit, users)    |
| HR_DIRECTOR  |   2   | strategic capability orchestrator + risk owner talent      |
| HR_MANAGER   |   3   | tactical HR ops dept perimeter                             |
| DEPT_HEAD    |   4   | manager di dipartimento                                    |
| LINE_MANAGER |   5   | gestore di direct reports                                  |
| EMPLOYEE     |   6   | self-only                                                  |

## Matrice visibility — 23 route × 8 ruoli

| Route                                     |    SU     |  TO   |  ITA  |  HRD  |   HRM    |   DH   |    LM     |  EMP   |
| ----------------------------------------- | :-------: | :---: | :---: | :---: | :------: | :----: | :-------: | :----: |
| `/dashboard` (role default)               |     ✓     |   ✓   |   ✓   |   ✓   |    ✓     |   ✓    |     ✓     |   ✓    |
| `/dashboard/hr_director_overview_v2`      |     ✓     |   ✓   |   —   |   ✓   |    —     |   —    |     —     |   —    |
| `/dashboard/capability_graph_v2`          |     ✓     |   ✓   |   ✓   |   ✓   |    ✓     |   ✓    |     —     |   —    |
| `/dashboard/skills_heatmap_v2`            |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   ✓    |     —     |   —    |
| `/dashboard/process_recruiting_funnel_v2` |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   —    |     —     |   —    |
| `/dashboard/process_onboarding_flow_v2`   |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   —    |     —     |   —    |
| `/dashboard/process_performance_cycle_v2` |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   ✓    |     —     |   —    |
| `/dashboard/process_learning_paths_v2`    |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   ✓    |     ✓     |   —    |
| `/employees` (directory)                  |   ✓ all   | ✓ tnt |   —   | ✓ tnt |  ✓ team  | ✓ dept | ✓ reports | ✓ self |
| `/reviews`                                |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   ✓    |     ✓     | ✓ self |
| `/goals`                                  |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   ✓    |     ✓     | ✓ self |
| `/learning`                               |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   ✓    |     ✓     | ✓ self |
| `/compensation`                           |     ✓     |   ✓   |   —   |   ✓   | ✓ scoped |   —    |     —     | ✓ self |
| `/analytics/workforce`                    |     ✓     |   ✓   |   —   |   ✓   |    ✓     |   —    |     —     |   —    |
| `/ontology`                               |     ✓     |   ✓   |   ✓   |   ✓   |    ✓     |   ✓    |     ✓     |   ✓    |
| `/explorer/esco`                          |     ✓     |   ✓   |   ✓   |   ✓   |    ✓     |   ✓    |     ✓     |   ✓    |
| `/explorer/kg`                            |     ✓     |   ✓   |   ✓   |   ✓   |    ✓     |   ✓    |     ✓     |   ✓    |
| `/explorer/sap`                           |     ✓     |   ✓   |   ✓   |   —   |    —     |   —    |     —     |   —    |
| `/admin/audit`                            | ✓ all-tnt | ✓ tnt | ✓ tnt | ✓ tnt |    —     |   —    |     —     |   —    |
| `/admin/rbac`                             |     ✓     |   ✓   |   ✓   |   ✓   |    —     |   —    |     —     |   —    |
| `/admin/users`                            |     ✓     |   ✓   |   ✓   |   —   |    —     |   —    |     —     |   —    |
| `/admin/integrations`                     |     ✓     |   ✓   |   ✓   |   —   |    —     |   —    |     —     |   —    |
| `/admin/tenants` (SU only)                |     ✓     |   —   |   —   |   —   |    —     |   —    |     —     |   —    |

## Scope semantics per ruolo (Prisma + RLS)

Risolto via `services/app/src/lib/data/_role-shaper.ts` `resolveScope({ role, tenantId, employeeId, orgUnitId }, entity)`.

| Ruolo        | Scope level                                       | Predicate principale                          |
| ------------ | ------------------------------------------------- | --------------------------------------------- |
| SUPERUSER    | `platform` (no tenant) / `tenant` (impersonating) | `{}` / `{ tenant_id }`                        |
| TENANT_OWNER | `tenant`                                          | `{ tenant_id }`                               |
| IT_ADMIN     | `tenant`                                          | `{ tenant_id }`                               |
| HR_DIRECTOR  | `tenant`                                          | `{ tenant_id }`                               |
| HR_MANAGER   | `team` (con orgUnit) / `tenant` (fallback)        | `{ tenant_id, org_unit_id }`                  |
| DEPT_HEAD    | `dept` (con orgUnit) / `tenant` (fallback)        | `{ tenant_id, org_unit_id }`                  |
| LINE_MANAGER | `reports` (con employeeId) / `self` (fallback)    | `{ tenant_id, manager_id: employeeId }`       |
| EMPLOYEE     | `self`                                            | `{ tenant_id, id / employee_id: employeeId }` |

RLS (P5) resta DB-level via `current_tenant_id()` null-safe (phase18u). Il role-shaper aggiunge predicate Prisma in-query per scope diversi da tenant.

## Cellule investor-critical (HR_DIRECTOR perspective)

Dettaglio mini-spec §2.2.A plan. Ogni cellula risponde 10 domande C1-C10 (mestiere, decisioni, dati, aggregazione, viz, drill, viste, header/footer, azioni, storia).

| Cellula                       | Mestiere (C1)                     | Decisioni (C2)                                           | Visualizzazione hero (C5)                                                      |
| ----------------------------- | --------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `/dashboard` HR_DIR           | strategic capability orchestrator | "lacune critiche? rallenta cycle? succession ready?"     | 4 KpiRing (Headcount · Review completion · Goals on-track% · Succession ready) |
| `/employees` HR_DIR           | registry talenti cross-dept       | "chi promuovo? flight risk? skill gap?"                  | Grid EmployeeCard + 4 viste (grid · table · org · skill heatmap)               |
| `/reviews` HR_DIR             | garante qualità cycle             | "manager indietro? outlier? cycle in tempo?"             | 4 KpiRing (cycle 38% · avg 3.7 · variance · calibration) + Kanban              |
| `/goals` HR_DIR               | strategic alignment OKR           | "obiettivi a rischio? cascade? overcommit?"              | 4 KpiRing + OkrCascadeTree                                                     |
| `/learning` HR_DIR            | upskilling vs gap                 | "skill gap copertura? mandatory completion? ROI €/cert?" | 4 KpiRing + LearningPath grid                                                  |
| `/compensation` HR_DIR        | equity audit + market positioning | "competitivi vs benchmark? pay gap? merit budget?"       | 4 KpiRing + CompensationHistogram + BonusPlan grid                             |
| `/analytics/workforce` HR_DIR | forecasting headcount + attrition | "headcount Q4? attrition concerning? hiring velocity?"   | 4 KpiRing + WorkforceTrendLine + DepartmentHeatmap                             |

## Altri ruoli — pattern scaled-down

**HR_MANAGER**: stesso layout `_v2` ma filtri pre-applicati a dept perimeter. Decisioni tactical (calibration team, learning enrollment, comp band recommendation).

**LINE_MANAGER**: route ridefinite come "il mio team":

- `/employees` → kanban performance direct reports + skill chips + 1:1 schedule + flight-risk
- `/reviews` → "le mie review (lista persone da valutare)"
- `/goals` → "goal del mio team" cascade 2-3 livelli
- `/learning` → "sviluppo del mio team" enrollment

**EMPLOYEE**: route self-scoped:

- `/employees` → redirect `/me`
- `/reviews` → "le mie review" (history + in-progress + 360 ricevuto/dato)
- `/goals` → "i miei obiettivi" + parent cascade context
- `/learning` → "il mio sviluppo" (enrollment attivo, raccomandati, cert expiring)

**SUPERUSER cross-tenant**: fleet view 4 tenants (RTL Bank · EcoNova · Heuresys System · SmartFood) → headcount aggregate + health pill + integration matrix.

**TENANT_OWNER**: tenant snapshot (org units · headcount · revenue/FTE · comp run · succession critical · equity vesting).

**IT_ADMIN**: infra fleet + RBAC matrix + integration health + audit log live.

**DEPT_HEAD**: capability mapping dept + KG topology + gap analysis (4 KpiRing dept-level).

## Out-of-scope rebuild monolitico

- `/ontology`, `/explorer/esco`, `/explorer/kg` (foundation 70%, conversione G6 differita)
- `/me*` self routes (stato OK)
- `/onboarding`, `/showcase`, `/forgot-password`, `/settings`, `/team` (utility)
- `/brand-studio` (workstream brand separato)
- `/dashboard/[code]/edit` (admin only)

## Riferimenti

- Plan: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
- Role-shaper: `services/app/src/lib/data/_role-shaper.ts`
- RBP DB: `rbp_role_area_permissions` (179 join post-L54)
- RLS policies: 370+ attive (post-phase18u null-safe)
