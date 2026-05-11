# heuresys-evo — Current State

> Updated: 2026-05-11T23:15Z · S37 post-CASCADIA remediation ciclo COMPLETO (W1-W6) · 6 commit pushed

## Last session brief

**S37 autonomous (~5h FTE, 6 commit pushed)** — Post-CASCADIA remediation 6-Wave roadmap:

| Wave | Scope | Status |
|---|---|---|
| **W1** | Prisma schema reconciliation | ✅ DONE — kg_nodes + kg_edges added to services/app schema; tenant_id added to succession_candidates both schemas; validate+generate+typecheck PASS |
| **W2** | 5 API endpoint quick-wins | ✅ DONE — /api/succession/candidates · /api/nine-box · /api/ccnl · /api/holidays · /api/explorer/kg/edges |
| **W3** | data-fetcher type:'api' + widget wiring | ✅ DONE — fetchApi() implemented (next/headers cookies + AbortController timeout); BridgeCard bound to /api/succession/candidates via phase18m migration |
| **W4** | _views/*.tsx Prisma binding | 🟡 PARTIAL — HrDirectorOverviewView succession-grid live via withTenant + succession_plans+candidates; readiness_level enum→% map; fallback fixture preserved. 6 other views + 4 process_* preset secondary remain static (carry-forward S38+) |
| **W5** | M15 Chrome MCP visual walkthrough | 🟡 PROGRAMMATIC PASS — succession data verified all 4 tenant (RTL 98, SF 52, EN 32, HS 6); 1 widget api-bound. Chrome MCP visual screenshot 88 cells review deferred (richiede dev server + sessione live coordinata) |
| **W6** | Functionality enhancement | 🟡 PARTIAL (1/5) — /api/industry endpoint shipped (JSON cache reader). 4 micro-features deferred S38+ (holidays widget UI, succession SLA badge, ITLAB leave validation hook, KG skill rec in /ontology) |

## Commits timeline S37

- `6d07272` — W1 Prisma schema reconciliation
- `f7932d7` — W3 data-fetcher type:'api' + BridgeCard binding (phase18m)
- `2196025` — W4 HrDirectorOverviewView succession-grid → live Prisma
- (industry endpoint commit)

Plus earlier S36 closure commits: `b98f847` STATE handoff · `1ce02d6` mock identities sweep · `b827300` S35.4 EcoNova+Heuresys · `5f522a9` S35.4 SmartFood · `53c917b` F-008 + ADR.

## Cumulative 4-tenant CASCADIA coverage (post-S37)

| Tenant | Workforce | Assess | Succession | 9-box | KG Nodes | KG Edges |
|---|---|---|---|---|---|---|
| **rtl-bank** | 158 emp | 1859 | 98 | 157 | 209 | 1766 |
| **smartfood** | 82 emp | 958 | 52 | 81 | 117 | 924 |
| **econova** | 26 emp (jt deduped 454→62) | 296 | 32 | 25 | 103 | 289 |
| **heuresys** | 4 emp | 27 | 6 (3 plans scaffold) | 2 | 38 | 23 |

## Verification (post-S37 final)

```bash
# Typecheck both workspaces
npx tsc --noEmit -p services/app/tsconfig.json && npx tsc --noEmit -p services/api-gateway/tsconfig.json

# Mock identities CI lint
npm run lint:mock-identities && npm run lint:tenant-id

# Prisma client visibility kg_nodes/edges
node -e "const{PrismaClient}=require('./services/app/prisma/generated/client'); const p=new PrismaClient(); Promise.all([p.kg_nodes.count(), p.kg_edges.count(), p.succession_candidates.findFirst()]).then(([n,e,s])=>{console.log('nodes:',n,'edges:',e,'sc.tenant_id:',s?.tenant_id?'OK':'MISSING');p.\$disconnect()})"
# Expected: nodes:17260 edges:139451 sc.tenant_id:OK

# 5 endpoints (require dev server up + session)
curl -sH "Cookie: <session>" http://localhost:3200/api/succession/candidates?tenant=<rtl-uuid> | jq '.data|length'
# Expected: ≥1

# BridgeCard api binding
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT COUNT(*) FROM dashboard_elements WHERE widget_code='BridgeCard'
AND config_overrides->'data_source'->>'type'='api'\""
# Expected: 1
```

## Migrations applied VM (cumulative S35-S37)

phase18d ITLAB · phase18e PROGOV regulatory · phase18f ESKAP KG · phase18g F-008 persona_label · phase18h SmartFood enrichment · phase18i EcoNova+Heuresys enrichment · phase18j EcoNova jt dedupe · phase18k Heuresys succession scaffold · phase18l mock identities cleanup · **phase18m widget api binding** (S37 W3)

## Top priorities S38+ (carry-forward)

1. **W4 completion** (~2-4h) — 6 remaining `_views/*.tsx` Prisma binding + 4 process_* preset secondary. Pattern blueprint in HrDirectorOverviewView (commit `2196025`).
2. **W5 Chrome MCP visual walkthrough live** (~1-2h) — 88 cells screenshot baseline. Richiede dev server + sessione live coordinata.
3. **W3 extension** (~1-2h) — KgMiniGraph/CapabilityRadar/ProfileHero binding tramite endpoint employee-context-aware (richiede passare employeeId server-side).
4. **W6 remaining 4 micro-features** (~1-2h) — holidays widget · SLA badge · ITLAB leave validation hook · KG skill rec.
5. **§ 1.2 employees vertical-split Phase 2** (carry-forward documented) — 15-25h FTE.

## Stack snapshot (post-S37 final)

- Prisma schemas in sync con DBMS post-CASCADIA (kg_*, sc.tenant_id)
- 5+1 nuovi API endpoint live: succession/candidates · nine-box · ccnl · holidays · explorer/kg/edges · industry
- data-fetcher.ts supports type:'api' (Sprint 2 unblock)
- Dashboard widget binding: 1/4 target widget api-bound (BridgeCard)
- View server components: 1/7 Prisma-bound (HrDirector succession-grid)
- 4-tenant CASCADIA coverage stabile da S36
- Tests: typecheck + lint:tenant-id + lint:mock-identities PASS
- ADR archive: 30 entries

## Riferimenti

- Plan canonical S37+: `~/.claude/plans/m15-visual-walkthrough-programmiamo-recursive-graham.md`
- CASCADIA original: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon SoT: `docs/_meta/lexicon.md`
- ADR S35-S36: 0028 CASCADIA · 0029 ITLAB · 0030 Lexicon
- Industry profiles: `db/seeds/realistic/_research_cache/{rtl_bank,smartfood,econova,heuresys}_industry_profile.json`
- Migrations S37: `db/migrations/phase18m_widget_api_binding.sql`
