# Role × Views Matrix (Phase 14.SH FASE 3.1)

> **Status**: schema scaffolded, da popolare in fresh session FASE 3.1.
>
> **Owner**: fresh session task #22 (inventory completa).
> **D-SCOPE**: coverage completa (~50-70 viste totali) per 8 ruoli.
> **Source priority**: import-first da `/home/ubuntu/heuresys.com.evo`, build from scratch solo per gap.

## Scopo

Catalogare ogni voce sidebar mostrata per ogni ruolo, mapparla alla view target (route Next.js) e identificare:

1. **Asset legacy**: route + API + Prisma query già presenti in `heuresys.com.evo` legacy → import path
2. **Asset evo**: già esistenti in `services/app` o `services/api-gateway`
3. **Build from scratch**: gap identificati

## Tabella inventory (da popolare)

| #   | Ruolo        | Sidebar voce                                          | Route target                                                       | Asset legacy import                                                         | Asset evo riusabile | Build from scratch            | Data source DB                          | RBP gate         | Status                             |
| --- | ------------ | ----------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------- | ----------------------------- | --------------------------------------- | ---------------- | ---------------------------------- |
| 1   | SUPERUSER    | Platform overview                                     | `/(app)/platform`                                                  | `services/frontend/src/app/platform/page.tsx`                               | —                   | metrics aggregate             | tenants + audit_logs                    | platform-only    | ⏳ pending                         |
| 2   | SUPERUSER    | All tenants                                           | `/(app)/platform/tenants`                                          | `services/api-gateway/src/routes/tenants.ts`                                | —                   | —                             | tenants                                 | platform-only    | ⏳ pending                         |
| 3   | SUPERUSER    | Cross-tenant audit                                    | `/(app)/platform/audit`                                            | `services/api-gateway/src/routes/audit-logs.ts`                             | —                   | —                             | audit_logs                              | platform-only    | ⏳ pending                         |
| 4   | TENANT_OWNER | Tenant overview                                       | `/(app)/dashboard/hr_director_overview`                            | —                                                                           | exists              | refactor (root view)          | dashboard_presets                       | TENANT\_\*\_VIEW | 🟢 partial (engine OK, layout TBD) |
| 5   | TENANT_OWNER | Org & systems                                         | `/(app)/dashboard/org_systems`                                     | —                                                                           | exists              | refactor                      | rbp\_\* + tenants                       | TENANT\_\*\_VIEW | 🟢 partial                         |
| 6   | TENANT_OWNER | Settings · users                                      | `/(app)/settings/users`                                            | `services/frontend/src/app/admin/users/page.tsx`                            | —                   | —                             | users + roles                           | USERS_EDIT       | ⏳ pending                         |
| 7   | TENANT_OWNER | Settings · billing                                    | `/(app)/settings/billing`                                          | (verify legacy)                                                             | —                   | (likely build)                | tenants + payments                      | BILLING_VIEW     | ⏳ pending                         |
| 8   | IT_ADMIN     | Knowledge graph                                       | `/(app)/dashboard/capability_graph`                                | —                                                                           | exists (engine)     | composite SQL real (FASE 3.6) | esco\_\*                                | ESCO_KG_VIEW     | 🟢 partial                         |
| 9   | IT_ADMIN     | RBAC matrix                                           | `/(app)/dashboard/org_systems`                                     | —                                                                           | exists              | —                             | rbp_role_permissions                    | RBP_ADMIN        | 🟢 partial                         |
| 10  | IT_ADMIN     | Audit log                                             | `/(app)/audit`                                                     | `services/frontend/src/app/admin/audit/page.tsx`                            | —                   | —                             | audit_logs                              | AUDIT_VIEW       | ⏳ pending                         |
| 11  | IT_ADMIN     | Integrations                                          | `/(app)/integrations`                                              | (verify)                                                                    | —                   | (likely build)                | sap\_\* + integrations                  | INTEGRATION_VIEW | ⏳ pending                         |
| 12  | HR_DIRECTOR  | HR overview                                           | `/(app)/dashboard/hr_director_overview`                            | —                                                                           | exists              | live data complete            | various                                 | HR_DIR_VIEW      | 🟢 ready                           |
| 13  | HR_DIRECTOR  | Talent registry                                       | `/(app)/talent`                                                    | `services/frontend/src/app/dashboards/talent/page.tsx`                      | —                   | —                             | employees + skills                      | TALENT_VIEW      | ⏳ pending                         |
| 14  | HR_DIRECTOR  | Skill gap analysis                                    | `/(app)/dashboard/skills_heatmap` + `/(app)/skills/gaps`           | partial legacy                                                              | partial             | composite SQL real            | employees.skills × department           | SKILL_VIEW       | 🟢 partial                         |
| 15  | HR_DIRECTOR  | Career bridging                                       | `/(app)/dashboard/employee_journey` + `/(app)/career-paths`        | `services/api-gateway/src/routes/career-paths.ts`                           | partial             | —                             | career_paths + esco_occupations         | CAREER_VIEW      | 🟢 partial                         |
| 16  | HR_DIRECTOR  | Review cycle Q1                                       | `/(app)/dashboard/process_performance_cycle` + `/(app)/reviews`    | partial                                                                     | partial             | —                             | review_cycles + performance_reviews     | REVIEW_VIEW      | 🟢 partial                         |
| 17  | HR_DIRECTOR  | Compensation analytics                                | `/(app)/compensation`                                              | `services/api-gateway/src/routes/compensation-analytics.ts`                 | —                   | —                             | bonus_plans + bonus_allocations         | COMP_VIEW        | ⏳ pending                         |
| 18  | HR_DIRECTOR  | Marketplace candidates                                | `/(app)/marketplace`                                               | `services/api-gateway/src/routes/marketplace-*.ts` (7+ files)               | —                   | —                             | candidates + applications               | MARKETPLACE_VIEW | ⏳ pending                         |
| 19  | HR_DIRECTOR  | Onboarding flow                                       | `/(app)/dashboard/process_onboarding_flow`                         | partial                                                                     | partial             | —                             | employees (last 90d)                    | ONBOARDING_VIEW  | 🟢 partial                         |
| 20  | HR_DIRECTOR  | Learning paths                                        | `/(app)/dashboard/process_learning_paths` + `/(app)/learning`      | `services/api-gateway/src/routes/courses.ts`                                | partial             | —                             | learning_paths + course_enrollments     | LEARNING_VIEW    | 🟢 partial                         |
| 21  | HR_MANAGER   | Team overview                                         | `/(app)/team`                                                      | (verify)                                                                    | —                   | (likely build)                | employees WHERE manager_id              | TEAM_VIEW        | ⏳ pending                         |
| 22  | HR_MANAGER   | Team performance                                      | `/(app)/team/performance`                                          | partial legacy                                                              | —                   | —                             | performance_reviews                     | PERF_VIEW        | ⏳ pending                         |
| 23  | HR_MANAGER   | Recruiting funnel                                     | `/(app)/dashboard/process_recruiting_funnel` + `/(app)/recruiting` | `services/api-gateway/src/routes/{candidates,job-postings,requisitions}.ts` | partial             | —                             | candidates + applications               | RECRUIT_VIEW     | 🟢 partial                         |
| 24  | DEPT_HEAD    | Department overview                                   | `/(app)/department`                                                | (verify)                                                                    | —                   | build                         | employees WHERE department              | DEPT_VIEW        | ⏳ pending                         |
| 25  | DEPT_HEAD    | Dept skill heatmap                                    | `/(app)/department/skills`                                         | partial                                                                     | partial             | —                             | employees.skills filtered               | DEPT_SKILL_VIEW  | ⏳ pending                         |
| 26  | LINE_MANAGER | Direct reports                                        | `/(app)/manager/reports`                                           | (verify)                                                                    | —                   | build                         | employees WHERE manager_id = self       | MANAGER_VIEW     | ⏳ pending                         |
| 27  | LINE_MANAGER | 1:1 reviews                                           | `/(app)/manager/reviews`                                           | partial                                                                     | —                   | —                             | performance_reviews + check_ins         | REVIEW_VIEW      | ⏳ pending                         |
| 28  | EMPLOYEE     | My profile                                            | `/(app)/me`                                                        | `services/frontend/src/app/dashboards/employee-self/page.tsx`               | —                   | —                             | employees WHERE id = self               | SELF_VIEW        | ⏳ pending                         |
| 29  | EMPLOYEE     | My career arc                                         | `/(app)/me/career`                                                 | partial                                                                     | —                   | —                             | employees + career_paths                | SELF_VIEW        | ⏳ pending                         |
| 30  | EMPLOYEE     | My skills                                             | `/(app)/me/skills`                                                 | partial                                                                     | —                   | —                             | employee_skills + skill_assessments     | SELF_VIEW        | ⏳ pending                         |
| 31  | EMPLOYEE     | My goals                                              | `/(app)/me/goals`                                                  | partial                                                                     | —                   | —                             | goals WHERE owner_id = self             | SELF_VIEW        | ⏳ pending                         |
| 32  | EMPLOYEE     | My learning                                           | `/(app)/me/learning`                                               | partial                                                                     | —                   | —                             | course_enrollments WHERE user_id = self | SELF_VIEW        | ⏳ pending                         |
| 33+ | (extension)  | Audit log + integrations + governance views per ruolo | —                                                                  | governance/\*                                                               | —                   | —                             | various                                 | various          | ⏳ pending                         |

> **Note**: questa è una matrix indicative iniziale (~32 entry). Fresh session FASE 3.1 deve completarla a coverage **~50-70 viste** secondo D-SCOPE confermato. Aggiungere righe per: settings nested, notification center, search globale, profile pages, ecc.

## Status legend

- 🟢 ready / partial = view già presente nel codebase evo (engine pattern OK), refactor richiesto per FASE 14.SH
- ⏳ pending = view da creare (import legacy o build)
- ❌ blocked = mancano dati DB o asset essenziali

## Workflow per ogni view

1. **Check legacy import**: cercare in `/home/ubuntu/heuresys.com.evo` (tipicamente `services/frontend/src/app/<area>/page.tsx` + `services/api-gateway/src/routes/<area>.ts`). Se trovato → import + adapt.
2. **Check evo riuso**: pattern `dashboard-engine` riusabile? component da `packages/ui/`?
3. **Build from scratch (last resort)**: page Next.js + Prisma query + RBP gate + i18n + a11y AAA.
4. **Verify**: Chrome MCP screenshot + test → status → 🟢

## Acceptance per ogni view (tutte devono passare)

- [ ] Page Next.js sotto `(app)/` group (eredita AppShell + brand)
- [ ] RBP gate via `requirePermission(area, action)` (helper estratto in `packages/shared/src/rbp/`)
- [ ] Server-side Prisma query con `withTenant(tenantId, tx => ...)` (RLS preservato)
- [ ] i18n via `pickBilingual()` + locale switcher
- [ ] Empty/loading/error states (NO demo fallback hardcoded)
- [ ] WCAG 2.2 AAA (contrast 7:1, target size ≥ 24×24, focus visible, aria-live, focus order)
- [ ] Smoke Chrome MCP via login del ruolo → page render OK
- [ ] Commit dedicato (o batch logic-grouped)

## Riferimenti incrociati

- Plan canonical: `~/.claude/plans/questo-quello-che-glittery-charm.md` FASE 3
- ADR-0024 Phase 14.SH plan: `docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md`
- Engine pattern: `docs/20-architecture/dashboard-engine-pattern.md`
- Brand state: `.ux-design/BRAND-STATE.md` Phase 10
