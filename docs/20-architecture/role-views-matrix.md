# Role × Views Matrix (Phase 14.SH FASE 3)

> **Status**: ACTIVE 2026-05-07T19:07Z (SH-2 in corso) · sincronizzato con `services/app/src/lib/navigation/role-nav-map.ts` (SIDEBAR_MAP).
> **D-SCOPE**: coverage completa (~50-70 viste totali) per 8 ruoli — split SH-2 (core ~10-15) + SH-3 follow-up (rest).

## Scopo

Catalogare ogni route mostrata nella sidebar di ogni ruolo, mapparla alla view target Next.js e tracciare l'implementation status.

## Implementation phases

| Phase         | Scope                                                           | Status      |
| ------------- | --------------------------------------------------------------- | ----------- |
| **SH-2 core** | Routes che cover tutti gli 8 ruoli con almeno 1 vista per ruolo | 🟡 in corso |
| **SH-3 fill** | Routes secondarie (compensation, analytics, integrations, ecc.) | ⏳ deferred |

## Routes inventory (deduplicated da SIDEBAR_MAP)

Sigle role:

- **SU**=SUPERUSER · **TO**=TENANT_OWNER · **IT**=IT_ADMIN · **HD**=HR_DIRECTOR · **HM**=HR_MANAGER · **DH**=DEPT_HEAD · **LM**=LINE_MANAGER · **EM**=EMPLOYEE

Status legend:

- ✅ implemented in SH-2 + visual smoke OK
- 🟡 stub (page renders, real data partial)
- 🟢 already exists pre-SH-2 (engine dashboard)
- ⏳ deferred SH-3
- ❌ deferred / out-of-scope

| #   | Route                              | Roles using it       | Page status  | Data source                                                | Notes                                               |
| --- | ---------------------------------- | -------------------- | ------------ | ---------------------------------------------------------- | --------------------------------------------------- |
| 1   | `/dashboard`                       | all 8                | 🟢 SH-1      | employees top-perf via Prisma direct                       | Already up post-SH-1 fix. RLS via withTenant.       |
| 2   | `/dashboard/[code]`                | all 8 (preset 9)     | 🟢           | dashboard_elements + adapter registry                      | Phase 14 Bundle F. 30/30 widgets bound.             |
| 3   | `/dashboard/cross_tenant_overview` | SU                   | ✅ carry-fwd | dashboard preset (phase14f seed) + 4 widgets SQL/composite | Shipped 2026-05-07 commit `0958625`. Visibility -1. |
| 4   | `/dashboard/tenant_owner_overview` | TO                   | ✅ carry-fwd | dashboard preset (phase14f seed) + 4 widgets SQL/composite | Shipped 2026-05-07 commit `0958625`. Visibility 0.  |
| 5   | `/dashboard/hr_director_overview`  | HD                   | 🟢           | dashboard preset (existing)                                | Live since Phase 14 Bundle F.                       |
| 6   | `/dashboard/capability_graph`      | HD, DH (?scope=team) | 🟢           | esco_skills + relations                                    | Existing preset. Composite real → SH-3 FASE 3.6.    |
| 7   | `/employees`                       | SU, TO, HD, HM       | ✅ SH-2      | employees (paginated, RLS-scoped)                          | Talent registry. Implemented this session.          |
| 8   | `/compensation`                    | TO, HD               | ⏳ SH-3      | bonus_plans + bonus_allocations                            | HR-only. Build with charts.                         |
| 9   | `/analytics/workforce`             | TO, HD               | ⏳ SH-3      | aggregates                                                 | Multiple charts. Build with `recharts` or echarts.  |
| 10  | `/reviews`                         | HD, HM (?scope=dept) | ⏳ SH-3      | performance_reviews                                        | Cycle-based listing.                                |
| 11  | `/goals`                           | HD, HM (?scope=dept) | ⏳ SH-3      | goals                                                      | Cascading view.                                     |
| 12  | `/learning`                        | HD, HM               | ⏳ SH-3      | learning_paths + course_enrollments                        | Per-employee progress.                              |
| 13  | `/ontology`                        | SU, TO, IT, HD, HM   | 🟢           | OpenAI advisor + esco                                      | Phase 14 Bundle F.                                  |
| 14  | `/explorer/esco`                   | all 8                | 🟢           | esco_occupations + skills                                  | Phase 14 Sprint 3.G.                                |
| 15  | `/explorer/sap`                    | SU, TO, IT           | 🟢           | sap\_\*                                                    | Sprint 3.G.                                         |
| 16  | `/explorer/kg`                     | SU, TO, IT, HD, HM   | 🟢           | KG canvas (esco relations)                                 | Sprint 3.G.                                         |
| 17  | `/admin/tenants`                   | SU                   | ✅ SH-2      | tenants                                                    | Platform list. Implemented this session.            |
| 18  | `/admin/users`                     | SU, TO, IT           | ✅ SH-2      | users                                                      | Implemented this session.                           |
| 19  | `/admin/rbac`                      | SU, TO, IT, HD       | ⏳ SH-3      | rbp_role_area_permissions matrix                           | Reuse `<RbacMatrix>` component.                     |
| 20  | `/admin/integrations`              | SU, TO, IT           | ⏳ SH-3      | sap_status + integrations                                  | Build from scratch.                                 |
| 21  | `/admin/audit`                     | SU, TO, IT, HD       | ✅ SH-2      | audit_logs                                                 | Implemented this session.                           |
| 22  | `/showcase`                        | SU                   | 🟢           | static                                                     | UI components showcase, pre-existing.               |
| 23  | `/me`                              | DH, LM, EM           | ✅ SH-2      | employees WHERE user_id = self                             | Implemented this session.                           |
| 24  | `/me/skills`                       | DH, LM, EM           | ✅ SH-2      | employee_skills                                            | Implemented this session.                           |
| 25  | `/me/goals`                        | DH, LM, EM           | ⏳ SH-3      | goals WHERE owner_id = self                                | Carry-forward.                                      |
| 26  | `/me/reviews`                      | DH, LM, EM           | ⏳ SH-3      | performance_reviews WHERE reviewee = self                  | Carry-forward.                                      |
| 27  | `/me/learning`                     | DH, LM, EM           | ⏳ SH-3      | course_enrollments WHERE user_id = self                    | Carry-forward.                                      |
| 28  | `/team`                            | DH, LM               | ✅ SH-2      | employees WHERE manager_id = self                          | Implemented this session.                           |
| 29  | `/team/reviews`                    | LM                   | ⏳ SH-3      | performance_reviews WHERE reviewer = self                  | Carry-forward.                                      |
| 30  | `/team/goals`                      | LM                   | ⏳ SH-3      | goals filtered by team                                     | Carry-forward.                                      |

**Totale: 30 routes uniche** (con varianti ?scope=… aggiungono ~5 viste filtrate). SH-2 ne implementa **8 nuove + 1 refactor** (#1 dashboard) = **9 routes attive**. Le altre 12 ⏳ SH-3 + 9 🟢 già esistenti.

## SH-2 implementation summary

| Route            | Implementation strategy           | RBP gate          | Visual smoke (Chrome MCP)                    |
| ---------------- | --------------------------------- | ----------------- | -------------------------------------------- |
| `/dashboard`     | Refactor: Prisma direct (was api) | role: any auth    | TENANT_OWNER + SUPERUSER + HR_MANAGER (SH-1) |
| `/employees`     | New: Prisma + DataTable           | role: HR/TO/SU    | TBD                                          |
| `/admin/tenants` | New: Prisma platform-wide         | role: SUPERUSER   | TBD                                          |
| `/admin/users`   | New: Prisma + tenant scope        | role: TO/IT/SU    | TBD                                          |
| `/admin/audit`   | New: Prisma audit_logs paginated  | role: HD/IT/TO/SU | TBD                                          |
| `/me`            | New: Prisma + session.user.id     | role: any auth    | TBD                                          |
| `/me/skills`     | New: Prisma employee_skills       | role: any auth    | TBD                                          |
| `/team`          | New: Prisma WHERE manager_id      | role: DH/LM       | TBD                                          |

## Workflow per ogni view (acceptance)

- [ ] Page Next.js sotto `(app)/` group (eredita AppShell + brand)
- [ ] RBP gate via `requirePermission(area, action)` server-side (helper in `packages/shared/src/rbp/`)
- [ ] Server-side Prisma query con `withTenant(tenantId, tx => ...)` (RLS preservato)
- [ ] i18n via `pickBilingual()` (deferred SH-3 per le nuove viste)
- [ ] Empty/loading/error states (NO demo fallback hardcoded)
- [ ] Smoke Chrome MCP via login del ruolo → page render OK + dati real
- [ ] Commit dedicato (o batch logic-grouped)

## Riferimenti incrociati

- SIDEBAR_MAP source: `services/app/src/lib/navigation/role-nav-map.ts`
- Plan canonical: `~/.claude/plans/questo-quello-che-glittery-charm.md` FASE 3
- ADR-0024 Phase 14.SH plan: `docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md`
- Engine pattern: `docs/20-architecture/dashboard-engine-pattern.md`
