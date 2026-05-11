# heuresys-evo — Current State

> Updated: 2026-05-12T00:30Z · S37+S38 post-CASCADIA remediation · 8 commit pushed · ciclo W1-W6 completo (PARTIAL su W4 e W6)

## Last session brief

**S37+S38 autonomous (~6h FTE total, 8 commit)** — Post-CASCADIA 6-Wave roadmap:

| Wave | Status | Output |
|---|---|---|
| **W1** | ✅ DONE | Prisma reconciliation: kg_nodes + kg_edges + sc.tenant_id (both schemas). validate+regen+typecheck PASS |
| **W2** | ✅ DONE | 5 endpoint quick-wins: /api/succession/candidates · /nine-box · /ccnl · /holidays · /explorer/kg/edges |
| **W3** | ✅ DONE | data-fetcher type:'api' implemented (fetchApi + cookie forwarding + AbortController). BridgeCard bound via phase18m |
| **W4** | 🟡 PARTIAL 2/7 | HrDirectorOverviewView + TenantOwnerOverviewView succession sections → live Prisma. 5 view rimanenti carry-forward S39+ |
| **W5** | 🟡 PROGRAMMATIC | Data verified all 4 tenant (RTL 98 succession_candidates, SF 52, EN 32, HS 6). Visual Chrome MCP screenshot 88 cells deferred |
| **W6** | 🟡 PARTIAL 3/5 | W6.1 /api/industry endpoint · W6.2 KG enrichment in advisor · W6.3 ITLAB CCNL compliance check in /leaves POST. W6.4 (SLA badge UI) + W6.5 (Holidays widget extension UI) carry-forward |

## Commits timeline S37+S38

S37:
- `6d07272` W1 Prisma reconciliation
- `2af1bbc` W2 5 endpoint quick-wins
- `f7932d7` W3 data-fetcher api + BridgeCard
- `2196025` W4 HrDirector succession → live Prisma
- `98e53a4` W6.1 /api/industry endpoint
- `fa637f5` S37 handoff

S38:
- `5458614` W4-cont TenantOwner top-succession → live Prisma
- (this commit) W6.2 KG advisor enrichment + W6.3 CCNL compliance check
- (final) S38 handoff

## Cumulative 4-tenant CASCADIA coverage (unchanged)

| Tenant | Workforce | Assess | Succession | 9-box | KG Nodes | KG Edges |
|---|---|---|---|---|---|---|
| **rtl-bank** | 158 | 1859 | 98 | 157 | 209 | 1766 |
| **smartfood** | 82 | 958 | 52 | 81 | 117 | 924 |
| **econova** | 26 (jt deduped) | 296 | 32 | 25 | 103 | 289 |
| **heuresys** | 4 | 27 | 6 (3 plans scaffold) | 2 | 38 | 23 |

## Live API surface post-S37+S38

- `/api/succession/candidates?tenant=` — TALPIPE list (DASHBOARD area)
- `/api/nine-box?tenant=` — TALPIPE M11 grid view (DASHBOARD)
- `/api/ccnl?sector=&include_levels=` — ITLAB catalog (EMPLOYEES)
- `/api/holidays?year=&country=&region=` — ITLAB calendar (EXPLORER)
- `/api/explorer/kg/edges?employeeId=` — ESKAP employee 1-hop (EXPLORER)
- `/api/industry?tenant=` — INDOOR profile cache (EXPLORER)
- `/api/ontology/advisor` — now KG-enriched prompt (REQUIRES_SKILL + ADJACENT_SKILL)
- `/leaves` POST (api-gateway) — now CCNL-compliance advisory in response

## Migrations applied VM (cumulative)

phase18d-l (S35+S36) · **phase18m** widget api binding (S37)

## Top priorities S39+ (carry-forward)

| # | Topic | Effort | Notes |
|---|---|---|---|
| 1 | **W4 completion** | ~2-3h | 5 view rimanenti (CrossTenant, Capability, EmployeeJourney, OrgSystems, SkillsHeatmap) Prisma binding. Pattern blueprint in commit 2196025 + 5458614 |
| 2 | **W5 Chrome MCP visual** | ~1-2h | Dev server up + 88 cells screenshot. Sessione live coordinata |
| 3 | **W3 extension** | ~1-2h | KgMiniGraph/CapabilityRadar/ProfileHero employee-context endpoint |
| 4 | **W6 UI features** | ~1-2h | Succession SLA badge (packages/ui BrandBridgeCard) · Holidays widget extension (BrandActivityFeed) |
| 5 | **§ 1.2 employees vertical-split Phase 2** | ~15-25h | Separate scope, audit 65 view dipendenze |

## Stack snapshot (post-S38)

- Prisma schemas in sync con DBMS post-CASCADIA (kg_*, sc.tenant_id) — both workspaces
- 6 nuovi API endpoint live + 2 existing enhanced (advisor KG, leaves CCNL)
- data-fetcher.ts supports type:'api' (Sprint 2 unblock)
- Dashboard widget binding: 1/4 target widget api-bound (BridgeCard)
- View server components: 2/7 Prisma-bound (HrDirector + TenantOwner succession sections)
- 4-tenant CASCADIA coverage stabile da S36
- Tests: typecheck + lint:tenant-id + lint:mock-identities PASS
- ADR archive: 30 entries

## Verification (post-S38 final)

```bash
# Cross-workspace typecheck
npx tsc --noEmit -p services/app/tsconfig.json && npx tsc --noEmit -p services/api-gateway/tsconfig.json

# Lint CI guards
npm run lint:mock-identities && npm run lint:tenant-id

# Live API smoke (richiede dev server up + session)
for endpoint in succession/candidates nine-box ccnl holidays explorer/kg/edges industry; do
  curl -sH "Cookie: <session>" "http://localhost:3200/api/$endpoint?tenant=<rtl-uuid>" -o /dev/null -w "%{http_code} /api/$endpoint\n"
done
# Expected: 6x 200 (o 401 senza session valida)

# Advisor KG enrichment
curl -sH "Cookie: <session>" -X POST http://localhost:3200/api/ontology/advisor \
  -H "Content-Type: application/json" \
  -d '{"occupationId":"<uuid>","question":"What skills are critical?"}' | jq '.answer'
# Expected: answer cites ESCO-grounded skills (REQUIRES_SKILL block injected)

# Leaves CCNL compliance
curl -sH "Cookie: <session>" -X POST http://localhost:8200/leaves \
  -H "Content-Type: application/json" \
  -d '{"leave_type":"vacation","start_date":"2026-06-01","end_date":"2026-06-15","days_requested":15}' \
  | jq '.ccnl_compliance'
# Expected: { ccnl_code, notice_days_provided, notice_days_required, compliant }
```

## Riferimenti

- Plan canonical S37+: `~/.claude/plans/m15-visual-walkthrough-programmiamo-recursive-graham.md`
- CASCADIA original: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon SoT: `docs/_meta/lexicon.md`
- ADR S35-S36: 0028 CASCADIA · 0029 ITLAB · 0030 Lexicon
- Industry profiles: `db/seeds/realistic/_research_cache/*.json`
- Migrations S37: `db/migrations/phase18m_widget_api_binding.sql`
