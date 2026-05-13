# heuresys-evo — Current State

> Updated: 2026-05-13T17:00Z · S59 closed · **P1 leak fix + 5 preset _v2 live + schema proposal** · HEAD pending

## Last session brief

S59 chiude **3 obiettivi P11**:

1. **P1 cross-tenant data leak fix** (HIGH security) — root cause: `rolbypassrls=true` su user app `heuresys`. Fix app-level con `WHERE tenant_id` esplicito in 6 page.tsx (compensation, employees, reviews, goals, learning, admin/integrations). Defense-in-depth: DBMS hardening carry-forward.
2. **Bonifica 5 preset _v2 residui** via migration `phase18q` (23 UPDATE elements). 3 preset platform-wide live · 2 preset unavailable=true (richiede `{employeeId}` support in fetchSql, S60+).
3. **Schema extension proposal** documentata per REV/FTE + EQUITY + TOTAL TC. Decisione brand-prodotto richiesta.

## Commits S58+S59 cumulative

| Item | Commit |
|---|---|
| salary_bands closure EcoNova+Heuresys (CASCADIA) | `e5cd4df` |
| salary_band_assignments closure (CASCADIA) | `8c3ed98` |
| Lighthouse cross-tenant audit | `74159bd` |
| axe WCAG AAA audit | `213dcfd` |
| Constraint P11 + DataNotAvailable + legacy view pilot | `8bf368f` |
| Handoff S58 intermedio | `d45f736` |
| **G6 phase18p tenant_owner_overview_v2 live** | `e500df3` |
| DECISIONS-LOG L85 | `162658a` |
| Handoff S58-ext | `a8f8f5c` |
| **S59 P1 fix + phase18q + schema proposal + L86** | **pending** |

## Stato G6 preset _v2 (7 presets, post S59)

| Preset | KPI live | KPI unavailable | Stato |
|---|---:|---:|---|
| `tenant_owner_overview_v2` | HEADCOUNT, RETENTION, PERFORMANCE, AVG SALARY, BONUS POOL, ActivityFeed, SuccessionCard | REV/FTE, EQUITY, TOTAL TC | ✅ live |
| `hr_director_overview_v2` | 4 KPI + SuccessionCard | 0 | ✅ live (pre-S58) |
| `skills_heatmap_v2` | 3 KPI + Histogram | CERTIFICATIONS | ✅ live |
| `cross_tenant_overview_v2` | 2 KPI + Histogram | INTEGRATIONS, PLATFORM UPTIME | ✅ live |
| `org_systems_v2` | 3 KPI | SYSTEM UPTIME | ✅ live |
| `capability_graph_v2` | 0 | 4 KPI (employeeId scope) | ⏸ unavailable (S60+ employeeId support) |
| `employee_journey_v2` | 0 | 4 KPI (employeeId scope) | ⏸ unavailable (S60+) |

**Totale**: 21 KPI live · 11 KPI unavailable letterali · 0 hardcoded fixture rimasti.

## P1 fix — 6 page.tsx con `WHERE tenant_id` esplicito

| File | Bug | Fix |
|---|---|---|
| `compensation/page.tsx` | `bonus_plans.findMany({where:{}})` | `where: {tenant_id: tenantId}` |
| `employees/page.tsx` | `employees.findMany(where: {is_active, deleted_at})` | added `tenant_id: tenantId` |
| `reviews/page.tsx` | `performance_reviews.findMany({where:{}})` | `where: {tenant_id: tenantId}` |
| `goals/page.tsx` | `goals.findMany({where:{}})` | `where: {tenant_id: tenantId}` |
| `learning/page.tsx` | `learning_paths.findMany({where:{deleted_at:null}}) + course_enrollments.count()` | added `tenant_id: tenantId` ad entrambi |
| `admin/integrations/page.tsx` | `employees.count({where:{pernr,is_active}})` | added `tenant_id: tenantId` |

Tutti i 6 file mantengono `withTenant(tenantId, ...)` wrap (GUC setter) come defense, MA non si affidano più solo a RLS.

## Files canonical S58+S59 P11 enforcement

- `CLAUDE.md` (root): §REGOLA NON NEGOZIABILE + P11
- `.claude/CLAUDE.md`: CARD-4 + R18
- `.claude/skills/studio/references/promote-flow.md`: Gate D.2 NO-FIXTURE
- `.ux-design/{BRAND-STATE, SESSION-RESUME, 08-promotion/v1.0-checklist}.md`: disclaimer
- `docs/_audit/2026-05-13-no-mock-inventory.md`: Phase A baseline
- `docs/_audit/2026-05-13-no-mock-inventory-G6.md`: Phase A2 G6 layer
- `docs/_audit/2026-05-13-schema-extension-proposal-revfte-equity-totaltc.md`: S59 schema proposal
- `services/app/src/components/data/DataNotAvailable.tsx` + CSS
- `services/app/src/lib/data/tenant-owner-queries.ts` (reference implementation)
- `db/migrations/phase18p_tenant_owner_overview_v2_live_data.sql` (S58)
- `db/migrations/phase18q_v2_presets_bulk_live.sql` (S59, 23 UPDATE)
- `services/app/src/lib/dashboard-engine/adapters.ts`: kpiRingAdapter unavailable flag
- `services/app/src/components/widgets/brand/BrandKpiCard.tsx`: DataNotAvailable rendering
- `services/app/src/components/widgets/brand/BrandCompCard.tsx`: per-item unavailable
- `scripts/perf/test-tenant-owner-v2-variance.mjs`: harness cross-tenant

## Carry-forward S60+ priorità

| # | Item | Effort | Priority |
|---|---|---|---|
| 1 | `{employeeId}` placeholder support in `fetchSql` → sblocca capability_graph_v2 + employee_journey_v2 (8 KPI personal-scope) | ~3h | HIGH |
| 2 | DBMS hardening: `ALTER ROLE heuresys NOBYPASSRLS` + risk assessment CASCADIA scripts | ~4h | HIGH (security) |
| 3 | Defense-in-depth audit: aggiungere `WHERE tenant_id` esplicito nei 8 file .tsx residui non auditati (admin/users, admin/audit, team, me/*) | ~2h | MEDIUM |
| 4 | Schema extension REV/FTE + EQUITY + TOTAL TC | ~6-8h | DECISIONE BRAND-PRODOTTO |
| 5 | Legacy view fallback cleanup (7 `_views/*.tsx` orfani in prod) | ~2h | LOW |

## Verifica handoff

```bash
# P11 enforcement
grep -n "P11" CLAUDE.md
grep -A 10 "Gate D.2" .claude/skills/studio/references/promote-flow.md

# Migrations applied
ssh oracle-vm-default 'cd /home/ubuntu/heuresys-evo && export $(grep -E "^DATABASE_URL=" services/app/.env | head -1) && node -e "..."' # verify config_overrides.data_source.type for all _v2 elements

# Cross-tenant variance verified (tenant_owner_overview_v2)
ssh oracle-vm-default 'node scripts/perf/test-tenant-owner-v2-variance.mjs'

# P1 fix verified: federica@rtl-bank /compensation should NOT see EcoNova/Heuresys bonus plans
# E2E browser via chrome-devtools-mcp

# Typecheck
cd services/app && npx tsc --noEmit
```

## Reference plan

`~/.claude/plans/i-dati-attuali-che-gentle-church.md` (approved 2026-05-13) — sessione lunga S58+S59 completata oltre original scope.
