# heuresys-evo — Current State

> Updated: 2026-05-12T00:50Z · S37+S38+S39 post-CASCADIA remediation · 9 commit pushed

## Last session brief

**S37+S38+S39 cumulative autonomous (~7h FTE total, 9 commit)** — Post-CASCADIA 6-Wave roadmap:

| Wave | Status | Output |
|---|---|---|
| **W1** | ✅ DONE | Prisma reconciliation: kg_nodes + kg_edges + sc.tenant_id |
| **W2** | ✅ DONE | 5 endpoint quick-wins (succession/9box/ccnl/holidays/kg-edges) |
| **W3** | ✅ DONE base | fetchApi() + BridgeCard bound; widget employee-context extension carry-forward |
| **W4** | 🟡 2/7 view | HrDirector + TenantOwner Prisma-bound; 5 view rimanenti (CrossTenant partial via fetchOrgSystemsData, others need aggregation logic) carry-forward |
| **W5** | 🟡 PROGRAMMATIC | Data verified all 4 tenant; visual Chrome MCP screenshot 88 cells deferred (sessione live coordinata) |
| **W6** | 🟡 5/5 LOGIC, UI partial | W6.1 industry endpoint · W6.2 KG advisor enrichment · W6.3 CCNL compliance · W6.4 SLA badge UI · W6.5 Holidays widget UI |

## Commits timeline (S37→S39)

- `6d07272` S37-W1 Prisma reconciliation
- `2af1bbc` S37-W2 5 endpoint quick-wins
- `f7932d7` S37-W3 data-fetcher api + BridgeCard
- `2196025` S37-W4 HrDirector succession live
- `98e53a4` S37-W6.1 /api/industry endpoint
- `fa637f5` S37 handoff
- `5458614` S38-W4 TenantOwner top-succession live
- `d773c9b` S38-W6.2+W6.3 KG advisor + CCNL compliance
- `2bfd5dc` S38 handoff
- `25b1f80` S39-W6.4+W6.5 SLA badge + Holidays widget UI
- (this) S39 handoff

## 4-tenant CASCADIA coverage (stable)

| Tenant | Workforce | Assess | Succession | 9-box | KG Nodes | KG Edges |
|---|---|---|---|---|---|---|
| **rtl-bank** | 158 | 1859 | 98 | 157 | 209 | 1766 |
| **smartfood** | 82 | 958 | 52 | 81 | 117 | 924 |
| **econova** | 26 | 296 | 32 | 25 | 103 | 289 |
| **heuresys** | 4 | 27 | 6 | 2 | 38 | 23 |

## Live API surface (post-S39)

- `/api/succession/candidates?tenant=` — TALPIPE list
- `/api/nine-box?tenant=` — TALPIPE M11 grid view
- `/api/ccnl?sector=&include_levels=` — ITLAB catalog
- `/api/holidays?year=&country=&region=` — ITLAB calendar (consumed by BrandActivityFeed W6.5)
- `/api/explorer/kg/edges?employeeId=` — ESKAP employee 1-hop
- `/api/industry?tenant=` — INDOOR profile cache
- `/api/ontology/advisor` — KG-enriched prompt (REQUIRES_SKILL + ADJACENT_SKILL injection)
- `/leaves` POST (api-gateway) — CCNL-compliance advisory block in response

## UI components enhanced (S39)

- `BrandBridgeCard`: SLA badge URGENT/SOON derivato da `targetDate + readinessLevel`
- `BrandActivityFeed`: `holidays?` prop preview rendered above activity-list

## Migrations applied VM (cumulative)

phase18d-l (S35+S36) · **phase18m** widget api binding (S37)

## Top priorities S40+ (carry-forward)

| # | Topic | Effort | Notes |
|---|---|---|---|
| 1 | **W4-final 5 view** | ~2-3h | CrossTenant (extend fetchOrgSystemsData) · SkillsHeatmap (cross-employee skill matrix aggregation) · EmployeeJourney (employees+history) · CapabilityGraph (esco_skills aggregate) · OrgSystems |
| 2 | **W5 Chrome MCP visual** | ~1-2h | Dev server up + 88 cells screenshot. Sessione live coordinata |
| 3 | **W3 widget employee-context** | ~1-2h | Extend FetchContext.employeeId + bind KgMiniGraph/CapabilityRadar/ProfileHero to /api/explorer/kg/edges?employeeId= |
| 4 | **Wire SLA badge + Holidays in registry** | ~30min | Update dashboard_elements config_overrides per BridgeCard targetDate/readinessLevel + ActivityFeed holidays |
| 5 | **§ 1.2 employees vertical-split Phase 2** | ~15-25h | Separate scope, audit 65 view dipendenze |

## Stack snapshot (post-S39)

- Prisma schemas in sync con DBMS post-CASCADIA (both workspaces)
- 6 nuovi API endpoint + 2 enhanced
- data-fetcher.ts supports type:'api'
- 2/7 view Prisma-bound (HrDirector + TenantOwner)
- 1/4 widget api-bound (BridgeCard); SLA + Holidays UI ready, waiting elements config
- 4-tenant CASCADIA stable
- Tests: typecheck + lint:tenant-id + lint:mock-identities PASS
- ADR archive: 30 entries

## Verification

```bash
# Cross-workspace typecheck
npx tsc --noEmit -p services/app/tsconfig.json && npx tsc --noEmit -p services/api-gateway/tsconfig.json

# Lint guards
npm run lint:mock-identities && npm run lint:tenant-id

# Live API smoke (dev server + session)
for endpoint in succession/candidates nine-box ccnl holidays explorer/kg/edges industry; do
  curl -sH "Cookie: <session>" "http://localhost:3200/api/$endpoint?tenant=<rtl-uuid>" -o /dev/null -w "%{http_code} /api/$endpoint\n"
done

# CASCADIA coverage
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT t.code,
  (SELECT count(*) FROM employee_skill_assessments esa JOIN employees e ON e.id=esa.employee_id WHERE e.tenant_id=t.id) AS assess,
  (SELECT count(*) FROM succession_candidates WHERE tenant_id=t.id) AS succ
FROM tenants t ORDER BY t.code\""
```

## Riferimenti

- Plan canonical: `~/.claude/plans/m15-visual-walkthrough-programmiamo-recursive-graham.md`
- CASCADIA: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon: `docs/_meta/lexicon.md`
- ADR: 0028 CASCADIA · 0029 ITLAB · 0030 Lexicon
- Industry profiles: `db/seeds/realistic/_research_cache/*.json`
- Latest migrations: `db/migrations/phase18m_widget_api_binding.sql`
