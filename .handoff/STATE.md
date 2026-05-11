# heuresys-evo — Current State

> Updated: 2026-05-11T22:15Z · S36 autonomous COMPLETE · CASCADIA ciclo chiuso 4/4 tenants + S35.6 cleanup + M15 programmatic PASS

## Last session brief

**S36 autonomous (~3h FTE, 4 commit pushed)**:

| STEP | Output | Result |
|---|---|---|
| 1 | S35.7 verification baseline (25-area SQL + typecheck + lint) | 22/24 PASS · 1 RBP carry · 1 F-008 risolto STEP 2 |
| 2 | F-008 phase18g persona_label `Audience: <ROLE>` | 11/11 preset shipped |
| 3 | ADR-0028 (CASCADIA) + ADR-0029 (ITLAB) + ADR-0030 (Lexicon) + README backfill 0022-0030 | 30 ADR archive |
| 4 | EcoNova `job_templates` 454→62 dedupe (phase18j) | 392 dup rows removed |
| 5 | Heuresys succession scaffold (phase18k) — 3 plans + 6 candidates | TALPIPE micro complete |
| 6 | RBP drift NO-OP — forensic audit closes issue (179 = canonical) | doc rot, no action needed |
| 7 | S35.6 mock identities sweep (registry + views + phase18l) + lint:mock-identities CI | 0 blocked names residue |
| 8 | M15 programmatic verification (16/16 role-preset mappings) | PASS, visual Chrome MCP deferred |
| **S35.4** | SmartFood + EcoNova + Heuresys enrichment shipped | 4/4 tenants CASCADIA |

## 4-tenant CASCADIA coverage (final post-S36)

| Tenant | Workforce | Assess | Succ_cand | 9-box | KG Nodes | KG Edges |
|---|---|---|---|---|---|---|
| **rtl-bank** (S35.3 pilot) | 158 emp | 1859 | 98 | 157 | 209 | 1766 |
| **smartfood** (S35.4) | 82 emp | 958 | 52 | 81 | 117 | 924 |
| **econova** (S35.4) | 26 emp | 296 | 32 | 25 | 103 | 289 |
| **heuresys** (S35.4 + STEP 5) | 4 emp | 27 | 6 (post-STEP 5) | 2 | 38 | 23 |

## Migrations applied VM (S35-S36)

phase18d ITLAB · phase18e PROGOV regulatory · phase18f ESKAP KG · phase18g F-008 persona_label · phase18h SmartFood enrichment · phase18i EcoNova+Heuresys enrichment · phase18j EcoNova jt dedupe · phase18k Heuresys succession · phase18l mock identities cleanup

## Commits timeline S36

- `53c917b` — F-008 + ADR-0028/29/30 + verification baseline
- `5f522a9` — S35.4 SmartFood (phase18h)
- `b827300` — S35.4 EcoNova+Heuresys (phase18i) + STATE update
- `1ce02d6` — EcoNova dedupe + Heuresys succession + mock identities sweep (phase18j+k+l + lint script)

## Backups checkpoint

- pre-S35.4 SmartFood: `heuresys_platform-pre-S35.4-smartfood-20260511T193550Z.dump` sha `a58872d9…`
- pre-S35.4 EcoNova+Heuresys: `heuresys_platform-pre-S35.4-econova-heuresys-20260511T194204Z.dump` sha `e4c50f2a…`
- pre-S36 EcoNova jt cleanup: `heuresys_platform-pre-S36-cleanup-econova-jt-20260511T195758Z.dump` sha `87a99222…`

## Carry-forward S37+ (architettonico, non blocking)

| Topic | Notes |
|---|---|
| **Chrome MCP visual walkthrough M15** | Visual screenshot review 88 cells (8 roles × 11 dashboards) per validation visiva semantic — richiede sessione live coordinata |
| **Data-driven binding sweep 19 widget full** | `useWidgetData()` adoption per ognuno → adapter SQL per ogni widget. Scope ~3-5h decisione architetturale per-widget (numeric metric → KPI query, etc.) |
| **widget_catalog v1↔v2 reconciliation** | dashboard_elements.widget_code PascalCase (brand v2) vs widget_catalog.code snake_case (v1). Decidere unify naming o split catalogs |
| **OpenAI live wrapper implementation** | Current STUB. ~30-45min (npm install openai + .env + implement callOpenAI). Solo se servono cost-cap reali |
| **§ 1.2 employees vertical-split Phase 2** | Già documentato carry-forward (audit 65 view + 4 mat view dipendenti, ~15-25h FTE) |

## Open questions

- Chrome MCP walkthrough quando? Servono dev server up + auth canonical sequence + screenshot review interpretation.
- widget_catalog v1↔v2: unificare o mantenere split? Trade-off cleanliness vs migration cost.

## Verification (post-S36 final)

```bash
# Cross-tenant CASCADIA coverage
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT t.code,
  (SELECT COUNT(*) FROM employees WHERE tenant_id=t.id AND employment_status='active') AS emp,
  (SELECT COUNT(*) FROM employee_skill_assessments esa
    JOIN employees e ON e.id=esa.employee_id WHERE e.tenant_id=t.id) AS assess,
  (SELECT COUNT(*) FROM succession_candidates WHERE tenant_id=t.id) AS succ,
  (SELECT COUNT(*) FROM kg_nodes WHERE tenant_id=t.id) AS nodes,
  (SELECT COUNT(*) FROM kg_edges WHERE tenant_id=t.id) AS edges
FROM tenants t ORDER BY t.code\""
# Expected: rtl 158/1859/98/209/1766 · smartfood 82/958/52/117/924 · econova 26/296/32/103/289 · heuresys 4/27/6/38/23

# F-008 persona_label
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT COUNT(*) FROM dashboard_presets WHERE persona_label LIKE 'Audience:%'\""
# Expected: 11

# Mock identities CI guard
npm run lint:mock-identities
# Expected: PASS
```

## Stack snapshot (post-S36 final)

- ESCO catalog platform: 17.260 kg_nodes + 139.451 kg_edges
- Tenant-scoped KG projection: 467 nodes + 3002 edges across 4 tenant
- Dashboard_presets: 11/11 `Audience: <ROLE>` (F-008)
- Audit forensic: 100% (RBP 179 confirmed canonical)
- Tests: typecheck + lint:tenant-id + lint:mock-identities PASS
- ADR archive: 30 entries (3 superseded)

## Riferimenti

- `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md` (plan canonical CASCADIA)
- `docs/_meta/lexicon.md` (16 sigle SoT)
- `docs/50-reference/decisions/0028-cascadia-universe-seeding.md` · `0029-itlab-italian-labor-tables.md` · `0030-lexicon-canonical-16-sigle.md`
- `db/seeds/realistic/_research_cache/{rtl_bank,smartfood,econova,heuresys}_industry_profile.json` (4 tenant industry profiles)
- `scripts/hardening/lint-mock-identities.sh` (CI guard)
