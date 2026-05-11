# heuresys-evo — Current State

> Updated: 2026-05-12T01:00Z · S37→S40 post-CASCADIA remediation · 12 commit pushed · 14 phase18 migrations applicate

## Last session brief (S37→S40 cumulative ~7.5h FTE)

**6-Wave roadmap status finale**:

| Wave | Status | Output finale |
|---|---|---|
| **W1** | ✅ DONE | Prisma reconciliation kg_nodes + kg_edges + sc.tenant_id (both schemas) |
| **W2** | ✅ DONE | 6 endpoint API: succession/candidates · nine-box · ccnl · holidays · kg/edges · industry |
| **W3** | ✅ DONE | data-fetcher type:'api' + {employeeId} template substitution + BridgeCard + KgMiniGraph (3 elements) bound |
| **W4** | 🟡 2/7 view | HrDirector + TenantOwner succession Prisma-bound; 5 view rimanenti carry-forward |
| **W5** | 🟡 PROGRAMMATIC | Data verified 4 tenant + 4 api-bound widgets; visual Chrome MCP deferred |
| **W6** | ✅ 5/5 logic | W6.1 /api/industry · W6.2 KG advisor enrichment · W6.3 CCNL compliance · W6.4 SLA badge UI · W6.5 Holidays widget UI |

**S40 carry-forward addressed**:
- ✅ Item 4: SLA + Holidays wired end-to-end (succession/candidates response shape + activityFeedAdapter passthrough)
- ✅ Item 3: W3 widget employee-context binding (FetchContext.employeeId + {employeeId} template + phase18n KgMiniGraph bound)
- 🟡 Item 1: W4-final 5 view → carry-forward S41+ (per-view aggregation helpers)

## Commits timeline (12 commit S37→S40)

S37: `6d07272` W1 · `2af1bbc` W2 · `f7932d7` W3 · `2196025` W4 · `98e53a4` W6.1 · `fa637f5` handoff
S38: `5458614` W4-cont · `d773c9b` W6.2+W6.3 · `2bfd5dc` handoff
S39: `25b1f80` W6.4+W6.5 · `528737d` handoff
S40: `8239d3b` Item3+Item4 · (this) handoff

## 4-tenant CASCADIA coverage (stable)

| Tenant | Workforce | Assess | Succession | 9-box | KG Nodes | KG Edges |
|---|---|---|---|---|---|---|
| **rtl-bank** | 158 | 1859 | 98 | 157 | 209 | 1766 |
| **smartfood** | 82 | 958 | 52 | 81 | 117 | 924 |
| **econova** | 26 | 296 | 32 | 25 | 103 | 289 |
| **heuresys** | 4 | 27 | 6 | 2 | 38 | 23 |

## Live API surface (post-S40)

- `/api/succession/candidates` — TALPIPE shape pre-built per BridgeCard (id, role, readinessLabel, readinessValue, readinessUnit, gaps[], targetDate, readinessLevel)
- `/api/nine-box` — TALPIPE grid view via $queryRaw
- `/api/ccnl` — ITLAB catalog + levels
- `/api/holidays` — ITLAB calendar IT 2025-2026
- `/api/explorer/kg/edges?employeeId=` — ESKAP employee 1-hop (consumed by KgMiniGraph)
- `/api/industry?tenant=` — INDOOR profile cache (4 tenants)
- `/api/ontology/advisor` — KG-enriched OpenAI advisor
- `/leaves` POST — CCNL compliance advisory block

## Widget binding state (4/4 target)

- ✅ BridgeCard → `/api/succession/candidates` (phase18m, items[] pre-shaped)
- ✅ KgMiniGraph → `/api/explorer/kg/edges?employeeId={employeeId}` (phase18n, 3 elements, template substitution)
- 🟡 CapabilityRadar → carry-forward S41+ (richiede /api/capability/aggregate endpoint)
- 🟡 ProfileHero → carry-forward S41+ (richiede /api/employees/{id}/profile endpoint)

## UI components enhanced

- `BrandBridgeCard`: SLA badge URGENT/SOON from targetDate+readinessLevel
- `BrandActivityFeed`: optional holidays[] preview row above activity-list
- `data-fetcher.fetchApi`: {employeeId} template substitution + post-substitution regex validation

## Migrations applied VM (cumulative S35-S40)

phase18d ITLAB · phase18e PROGOV regulatory · phase18f ESKAP KG · phase18g F-008 persona_label · phase18h SmartFood enrichment · phase18i EcoNova+Heuresys · phase18j EcoNova jt dedupe · phase18k Heuresys succession · phase18l mock identities · phase18m BridgeCard api · **phase18n KgMiniGraph employee-context api**

## Top priorities S41+ (carry-forward)

| # | Topic | Effort | Notes |
|---|---|---|---|
| 1 | **W4-final 5 view aggregation** | ~3-4h | EmployeeJourney (employees+history) · CapabilityGraph (ESCO aggregate) · SkillsHeatmap (cross-emp skill matrix) · OrgSystems (integration_status) · CrossTenant (already partial via fetchOrgSystemsData) |
| 2 | **W5 Chrome MCP visual** | ~1-2h | Dev server up + 88 cells screenshot. Sessione live coordinata |
| 3 | **ProfileHero + CapabilityRadar binding** | ~1.5h | Create /api/employees/{id}/profile + /api/capability/aggregate endpoints + DB binding |
| 4 | **/api/employees/{id}/profile endpoint** | ~30min | Employee detail + assessments + role + badges aggregato |
| 5 | **§ 1.2 employees vertical-split Phase 2** | ~15-25h | Separate scope, audit 65 view dipendenze |

## Stack snapshot (post-S40)

- Prisma schemas in sync con DBMS post-CASCADIA (both workspaces)
- 6 nuovi API endpoint + 2 enhanced (KG advisor, leaves CCNL)
- data-fetcher.ts supports type:'api' with template substitution
- 2/4 target widgets api-bound (BridgeCard + KgMiniGraph)
- 2/7 views Prisma-bound (HrDirector + TenantOwner)
- 2 brand UI components extended (SLA badge + Holidays preview)
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
curl -sH "Cookie: <session>" "http://localhost:3200/api/succession/candidates?tenant=<rtl-uuid>" | jq '.data.items[0]'
# Expected: { id, role, readinessLabel: "Readiness", readinessValue: 92, gaps: [...], targetDate: "2027-...", readinessLevel: "ready_now" }

# Widget binding state
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT widget_code, COUNT(*) FILTER (WHERE config_overrides->'data_source'->>'type'='api') AS api_bound,
       COUNT(*) AS total
FROM dashboard_elements
WHERE widget_code IN ('BridgeCard','KgMiniGraph','CapabilityRadar','ProfileHero')
GROUP BY widget_code ORDER BY widget_code\""
# Expected: BridgeCard 1/1 · KgMiniGraph 3/3 · CapabilityRadar 0/5 · ProfileHero 0/1
```

## Riferimenti

- Plan canonical S37+: `~/.claude/plans/m15-visual-walkthrough-programmiamo-recursive-graham.md`
- CASCADIA: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon: `docs/_meta/lexicon.md`
- ADR S35-S36: 0028 CASCADIA · 0029 ITLAB · 0030 Lexicon
- Industry profiles: `db/seeds/realistic/_research_cache/*.json`
- Latest migrations: `db/migrations/phase18m_widget_api_binding.sql` · `phase18n_widget_employee_context_binding.sql`
