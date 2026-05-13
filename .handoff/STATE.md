# heuresys-evo — Current State

> Updated: 2026-05-13T16:30Z · S58-ext closed · **P11 + tenant_owner_overview_v2 LIVE verified cross-tenant** · HEAD `162658a`

## Last session brief

S58 sessione lunga (5+h) chiude **3 obiettivi concatenati**:

1. **Constraint P11 codificato** — NO MOCK/HARDCODED/RANDOM in UI/mockup/test/brand-studio (CASCADIA seeding ESCLUSO). Sopraordinato a P1-P10. Inviolabile.
2. **Pattern shipped riutilizzabile** — `<DataNotAvailable />` component + adapter extension (`unavailable` flag) + `BrandKpiCard`/`BrandCompCard` rendering conditional.
3. **Pilot `tenant_owner_overview_v2` LIVE verificato cross-tenant** — RTL Bank vs Heuresys System mostrano numeri DIVERSI per la prima volta (vedi tabella sotto).

## Commits S58 cumulative (10)

| Item | Commit |
|---|---|
| salary_bands closure EcoNova + Heuresys (CASCADIA seeding) | `e5cd4df` |
| salary_band_assignments closure EcoNova + Heuresys (CASCADIA seeding) | `8c3ed98` |
| toggle-tenant-owners-tmp.mjs (LH cross-tenant tooling) | `c7fc627` |
| Lighthouse cross-tenant audit report (4 tenant × TENANT_OWNER) | `74159bd` |
| axe WCAG AAA audit report (12 surface RTL Bank) | `213dcfd` |
| **Constraint P11 + DataNotAvailable + legacy view pilot** | **`8bf368f`** |
| Handoff intermedio | `d45f736` |
| **G6 phase18p migration + adapter/widget extension** | **`e500df3`** |
| DECISIONS-LOG L85 | `162658a` |

## ✅ Cross-tenant variance LIVE (verificato via chrome-devtools-mcp)

`/dashboard` (preset `tenant_owner_overview_v2`) come TENANT_OWNER:

| KPI | RTL Bank (federica.marchetti) | Heuresys System (admin) | Status |
|---|---:|---:|---|
| HEADCOUNT | **156** | **1** | ✅ live (employees count) |
| REV/FTE | Dati Non Disponibili | Dati Non Disponibili | ✅ honest (no source) |
| RETENTION | 100% | 100% | ✅ live (12m rolling) — invariant perché 0 terminations |
| PERFORMANCE | **69%** | **91%** | ✅ live (avg overall_rating/5*100) |
| AVG SALARY | **48 k€** | **201 k€** | ✅ live (salary_band_assignments) |
| BONUS POOL | **1600 k€** | **60 k€** | ✅ live (bonus_plans.total_budget) |
| EQUITY | Dati Non Disponibili | Dati Non Disponibili | ✅ honest |
| TOTAL TC | Dati Non Disponibili | Dati Non Disponibili | ✅ honest |
| ActivityFeed | 5 audit_logs reali RTL | 2 audit_logs reali Heuresys | ✅ live |

## Files canonical P11 enforcement

- `CLAUDE.md` (root): §REGOLA NON NEGOZIABILE + P11 tabella P1-P11
- `.claude/CLAUDE.md`: CARD-4 + R18
- `.claude/skills/studio/references/promote-flow.md`: Gate D.2 NO-FIXTURE (`PROMOTE_E309_FIXTURE`)
- `.ux-design/{BRAND-STATE,SESSION-RESUME,08-promotion/v1.0-checklist}.md`: disclaimer top-of-file
- `docs/_audit/2026-05-13-no-mock-inventory.md`: Phase A baseline (incompleto su G6)
- `docs/_audit/2026-05-13-no-mock-inventory-G6.md`: Phase A2 G6 layer thorough
- `services/app/src/components/data/DataNotAvailable.tsx` + CSS AA-compliant
- `services/app/src/lib/data/tenant-owner-queries.ts`: 4 queries Prisma (legacy view, orphan path)
- `db/migrations/phase18p_tenant_owner_overview_v2_live_data.sql`: production migration UPDATE 7 elements
- `services/app/src/lib/dashboard-engine/adapters.ts`: `kpiRingAdapter` esteso con `unavailable`
- `services/app/src/components/widgets/brand/BrandKpiCard.tsx`: render `<DataNotAvailable/>` se unavailable
- `services/app/src/components/widgets/brand/BrandCompCard.tsx`: per-item `unavailable` support
- `scripts/perf/test-tenant-owner-v2-variance.mjs`: verification harness cross-tenant

## Carry-forward S59+ (priorità)

### S59 — Bonifica 6 preset _v2 residui (P0)

Stesso pattern migration `phase18p` per:

| Preset | Effort |
|---|---|
| `hr_director_overview_v2` | ~2h |
| `skills_heatmap_v2` | ~2h |
| `capability_graph_v2` | ~2h |
| `employee_journey_v2` | ~2h |
| `cross_tenant_overview_v2` | ~1.5h |
| `org_systems_v2` | ~1.5h |

Pattern obbligatorio: ogni query `WHERE tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid` esplicito perché `employees` è VIEW senza RLS (post S52 vertical-split).

### S60 — Investigare P1 violation (HIGH)

Side-finding S58 #3: **cross-tenant data leak** su `/compensation` + `/employees` per TENANT_OWNER. RTL Bank vede dati EcoNova/SmartFood mescolati. Possibile bypass RLS o query Prisma senza `WHERE tenant_id`. **Priority HIGH** (RGPD risk).

### S61+ — Schema extension per source unavailable

- REV/FTE: serve tabella `revenue` o `financial_kpis`
- EQUITY: serve tabella `equity_grants` o `total_compensation`
- TOTAL TC: derivato (base + variable + equity)

Decisione brand-prodotto richiesta prima dello sviluppo.

### S62+ — CapabilityRadar `/api/capability/aggregate` validation

Già `type:'api'` ma endpoint da verificare se ritorna dato live o stub.

### S63+ — Legacy view cleanup (LOW)

7 `_views/*.tsx` (TenantOwnerOverviewView, HrDirectorOverviewView, ecc.) sono **path orfano** in produzione (G6 `_v2` ha precedenza in `dashboard/page.tsx:112+`). Refactor pilot del view legacy (commit `8bf368f`) resta come **reference implementation** del pattern P11 (queries in `lib/data/tenant-owner-queries.ts` riutilizzabili). Decisione: rimuovere fallback o mantenere come reference?

## Verification handoff

```bash
# P11 enforcement codificato
grep -n "P11" CLAUDE.md
grep -n "CARD-4" .claude/CLAUDE.md
grep -A 10 "Gate D.2" .claude/skills/studio/references/promote-flow.md

# Migration applicata
ssh oracle-vm-default 'cd /home/ubuntu/heuresys-evo && export $(grep -E "^DATABASE_URL=" services/app/.env | head -1) && node -e "..." # verifica config_overrides.data_source.type = sql per IDs 101-104,109,110,111'

# Cross-tenant variance verified
ssh oracle-vm-default 'cd /home/ubuntu/heuresys-evo && export $(grep -E "^DATABASE_URL=" services/app/.env | head -1) && node scripts/perf/test-tenant-owner-v2-variance.mjs'
# Expected: numbers differ across RTL/SmartFood/EcoNova/Heuresys

# Live deploy attivo
ssh oracle-vm-default "curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:3200"

# Browser smoke: login federica@rtl-bank → /dashboard → HEADCOUNT 156 (non più 86)
```

## Reference plan

`~/.claude/plans/i-dati-attuali-che-gentle-church.md` (approved 2026-05-13) — completato Phase A + B + Pilot + Phase A2 G6 + G6 refactor live.

## Note operative

- Commit S58 CASCADIA seeding (`e5cd4df`, `8c3ed98`) restano legittimi (popolano DBMS quando vuoto).
- `toggle-tenant-owners-tmp.mjs --off` eseguito post-smoke (3 legacy TENANT_OWNERS riattivati e ri-disattivati).
- Sessione complessiva ~6h reali. Apprendimenti chiave salient in DECISIONS-LOG L85.
