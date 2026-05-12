# heuresys-evo — Current State

> Updated: 2026-05-12T01:05Z · S37→S40 post-CASCADIA remediation closed (13 commit, ~7.5h)

## Last session brief

S40: Item3 (FetchContext.employeeId + `{employeeId}` template in fetchApi + phase18n KgMiniGraph bound 3 elements) + Item4 (`/api/succession/candidates` response shaped per BridgeCard end-to-end + activityFeedAdapter holidays passthrough). 6-Wave remediation roadmap closed: W1+W2+W3+W6 DONE, W4 2/7 view, W5 programmatic PASS.

## Top priorities

1. **W4-final 5 view aggregation** (~3-4h) — EmployeeJourney/CapabilityGraph/SkillsHeatmap/OrgSystems/CrossTenant. Pattern blueprint in HrDirectorOverviewView (`2196025`) + TenantOwnerOverviewView (`5458614`).
2. **W5 Chrome MCP visual walkthrough** (~1-2h) — dev server up + 88 cells screenshot baseline. Sessione live coordinata.
3. **ProfileHero + CapabilityRadar binding** (~1.5h) — creare `/api/employees/{id}/profile` + `/api/capability/aggregate` + phase18o binding.

## Open questions

- W4 priorità delle 5 view rimanenti — quale per prima? (CrossTenant ha già `fetchOrgSystemsData` parziale, EmployeeJourney più diretto con `employees+history`).
- § 1.2 employees vertical-split Phase 2 (~15-25h, separate scope) — quando programmare?

## Stack snapshot (post-S40)

- Prisma schemas in sync DBMS (kg_nodes/kg_edges/sc.tenant_id aggiunti)
- 6 nuovi API endpoint + 2 enhanced (advisor KG, leaves CCNL)
- data-fetcher.ts: type:'api' + `{employeeId}` template substitution
- 2/4 target widgets api-bound (BridgeCard via phase18m · KgMiniGraph via phase18n)
- 2/7 views Prisma-bound (HrDirector + TenantOwner succession)
- 2 brand UI components estesi (BridgeCard SLA badge · ActivityFeed Holidays preview)
- 4-tenant CASCADIA coverage stabile
- typecheck + lint:tenant-id + lint:mock-identities PASS

## Verification

```bash
npx tsc --noEmit -p services/app/tsconfig.json && npx tsc --noEmit -p services/api-gateway/tsconfig.json
npm run lint:mock-identities && npm run lint:tenant-id

ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT widget_code, COUNT(*) FILTER (WHERE config_overrides->'data_source'->>'type'='api') AS api_bound, COUNT(*) AS total
FROM dashboard_elements WHERE widget_code IN ('BridgeCard','KgMiniGraph','CapabilityRadar','ProfileHero')
GROUP BY widget_code ORDER BY widget_code\""
# Expected: BridgeCard 1/1 · KgMiniGraph 3/3 · CapabilityRadar 0/5 · ProfileHero 0/1
```

Riferimenti: `~/.claude/plans/m15-visual-walkthrough-programmiamo-recursive-graham.md` · `docs/_meta/lexicon.md` · ADR-0028/29/30 · `db/migrations/phase18m_widget_api_binding.sql` · `phase18n_widget_employee_context_binding.sql`
