# heuresys-evo — Current State

> Updated: 2026-05-12T02:45Z · S41 W4-final + ProfileHero/CapabilityRadar API binding (1 feature commit, ~2.5h)

## Last session brief

S41: 5/5 W4 dashboard view bound a Prisma via helper `lib/dashboard-views/*` (EmployeeJourney + CapabilityGraph + SkillsHeatmap + OrgSystems + CrossTenant). ProfileHero + CapabilityRadar widget binding via 2 nuovi endpoint `/api/employees/{id}/profile` + `/api/capability/aggregate` + migration phase18o. **4/4 target widget classes 100% api-bound** (BridgeCard 1/1 · KgMiniGraph 3/3 · CapabilityRadar 5/5 · ProfileHero 1/1).

## Top priorities

1. **W5 Chrome MCP visual walkthrough** (~1-2h) — dev server + 88-cell screenshot baseline. Sessione live coordinata. Pre-requisito: dev server up su `http://localhost:3200`.
2. **§ 1.2 employees vertical-split Phase 2** (~15-25h, separate scope) — DROP COLUMN x77 + view + 65 view dependency refactoring. Backup pre-attempt esistente.
3. **WCAG 2.2 AAA audit + production perf bench** (~6-7h combinato) — axe-core CI + autocannon 8 viste P95 ≤ 500ms.

## Open questions

- **Skill-trend polyline + Capability-radar SVG fixtures** in EmployeeJourneyView restano hardcoded (richiedono `employee_skill_history` aggregation by quarter + ESCO target enrichment) — quando promuovere a live?
- **ESCO sync stats fixture** in CapabilityGraphView (last sync, drift, next sync) — collegare a `integration_sync_logs` quando ESCO integration sarà attiva?
- **Workforce 12-month trend SVG** in CrossTenant view resta layout-fixture (richiede `monthly_employee_snapshot` materialized view).

## Stack snapshot (post-S41)

- 4/4 widget kinds api-bound (post-phase18o): ProfileHero 1, KgMiniGraph 3, CapabilityRadar 5, BridgeCard 1
- 7/7 dashboard view data-bound: HrDirector + TenantOwner (S38) + EmployeeJourney + CapabilityGraph + SkillsHeatmap + OrgSystems + CrossTenant (S41)
- 5 nuovi data fetcher helper: `lib/dashboard-views/{employee-journey,capability-graph,skills-heatmap,integrations,cross-tenant}-data.ts`
- 2 nuovi API endpoint: `/api/employees/{id}/profile` + `/api/capability/aggregate?employeeId={id}`
- Brand UI components estesi: BridgeCard SLA badge, ActivityFeed Holidays preview (S39)
- Migrations: phase18m (BridgeCard) + phase18n (KgMiniGraph) + phase18o (ProfileHero+CapabilityRadar)
- typecheck (services/app + api-gateway) + lint:tenant-id + lint:mock-identities PASS

## Verification

```bash
npx tsc --noEmit -p services/app/tsconfig.json && npx tsc --noEmit -p services/api-gateway/tsconfig.json
npm run lint:mock-identities && npm run lint:tenant-id

ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT widget_code, COUNT(*) FILTER (WHERE config_overrides->'data_source'->>'type'='api') AS api_bound, COUNT(*) AS total
FROM dashboard_elements WHERE widget_code IN ('BridgeCard','KgMiniGraph','CapabilityRadar','ProfileHero')
GROUP BY widget_code ORDER BY widget_code\""
# Expected: BridgeCard 1/1 · CapabilityRadar 5/5 · KgMiniGraph 3/3 · ProfileHero 1/1
```

Riferimenti: ADR-0028/29/30 · `db/migrations/phase18m_widget_api_binding.sql` · `phase18n_widget_employee_context_binding.sql` · `phase18o_widget_profile_capability_binding.sql` · `docs/_meta/lexicon.md` (OPOURSKA · ESKAP · TALPIPE)
