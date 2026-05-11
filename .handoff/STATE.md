# heuresys-evo — Current State

> Updated: 2026-05-11T21:50Z · S36 autonomous · S35.4 CASCADIA Extension SHIPPED — 4/4 tenants enriched

## Last session brief

**S36 autonomous (~2h FTE)**:

1. S35.7 verification baseline (22/24 SQL PASS, typecheck + lint:tenant-id PASS).
2. F-008 phase18g persona_label rename (11 dashboard_presets → `Audience: <ROLE>`).
3. ADR-0028 (CASCADIA) + ADR-0029 (ITLAB) + ADR-0030 (Lexicon) drafted + README backfill 0022-0030.
4. **S35.4 Extension SHIPPED** — pattern S35.3 RTL pilot replicato su 3 tenant restanti:
   - `smartfood_industry_profile.json` + phase18h SF enrichment: M9 Gaussian (820 new assess, total 958, avg 2.78 stddev 0.87 Bell) + M11a (81 perf_box) + M11b (50 new succ_cand) + M13 ESKAP (117 nodes + 924 edges)
   - `econova_industry_profile.json` + phase18i EN block: M9 (260 new, total 296) + M11a (50 perf_box) + M11b (32 succ_cand) + M13 (103 nodes + 289 edges)
   - `heuresys_industry_profile.json` + phase18i HS block: M9 (20 new, total 27 micro) + M11a (4 perf_box) + M13 (38 nodes + 23 edges) — M11b SKIP (no succession_plans, carry-forward S36+)
5. Backup pre-S35.4 SmartFood `20260511T193550Z.dump` sha `a58872d9…` · pre-S35.4 EcoNova+Heuresys `20260511T194204Z.dump` sha `e4c50f2a…`.

## 4-tenant CASCADIA coverage (post-S35.4)

| Tenant | Workforce | Assessments | Succession | 9-box | KG Nodes | KG Edges |
|---|---|---|---|---|---|---|
| **rtl-bank** | 158 emp | 1859 | 98 | 157 | 209 | 1766 |
| **smartfood** | 82 emp | 958 | 52 | 81 | 117 | 924 |
| **econova** | 26 emp | 296 | 32 | 25 | 103 | 289 |
| **heuresys** | 4 emp | 27 | 0 (no plans) | 2 | 38 | 23 |

## Top priorities (next session)

1. **M15 Chrome MCP walkthrough** (~1-2h) — visual validation 88 cells (8 roles × 11 dashboard) per i 4 tenant. Visual check zero widget vuoti, dati semantic-driven, no console error. **Pending coordinamento umano**.
2. **S35.6 binding sweep** (~3-5h, 19 widget singolarmente) — `services/app/src/lib/dashboard-engine/registry.tsx`: per ciascun widget rimuovere demo fallback + adoption `useWidgetData()`. Convertire seed `phase15g6_full_preset_layouts.sql` `data_source.type='static'` → `type='sql'`. Lint rule CI grep mock identities.
3. **S36 session dedicata RBP drift** (~2-3h) — fix gap 179→326 `rbp_role_permissions` (audit baseline forensic L57).
4. **Heuresys succession_plans** scaffolding (~30min) — creare 2-3 plans skeleton (FOUNDER_CEO, CTO) + popolare candidates.

## Open questions

- **EcoNova job_templates 454 anomaly**: troppi job_templates rispetto a 26 emp (vs RTL 32, SF 20). Verificare se è dato corrotto / migration legacy / dataset duplicato. Schedule investigazione S36+.
- **org_unit_kpis strategic** (ROE/CET1/Turnover BANKING-M root): deferred M16 cross-tenant come da scelta utente.
- **OpenAI live wrapper**: l'utente ha richiesto "via OpenAI advisor" ma il wrapper era STUB. Generazione fatta via Claude Opus 4.7 reasoning (gen_method esplicito nei JSON). Se serve OpenAI live, implementare callOpenAI reale (~30-45min + npm openai + .env setup).

## Verification (post-S35.4)

```bash
# 4-tenant coverage one-shot
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT t.code, COUNT(esa.id) AS assess, COUNT(DISTINCT sc.id) AS succ
FROM tenants t
LEFT JOIN employees e ON e.tenant_id=t.id AND e.employment_status='active'
LEFT JOIN employee_skill_assessments esa ON esa.employee_id=e.id
LEFT JOIN succession_candidates sc ON sc.tenant_id=t.id
GROUP BY t.code ORDER BY t.code\""

# KG cross-tenant
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT tenant_id, node_type, COUNT(*) FROM kg_nodes GROUP BY 1,2 ORDER BY 1,2\""
```

## Stack snapshot

- Migrations applicate VM (post-S36): phase18d (ITLAB) · phase18e (PROGOV regulatory) · phase18f (ESKAP KG) · phase18g (F-008 persona_label) · phase18h (SmartFood enrichment) · phase18i (EcoNova+Heuresys enrichment)
- ESCO catalog platform: 17.260 kg_nodes + 139.451 kg_edges (UNCHANGED)
- Tenant-scoped KG projection: RTL 209+1766 · SF 117+924 · EN 103+289 · HS 38+23
- Dashboard_presets persona_label: 11/11 `Audience: <ROLE>` pattern
- Audit forensic: 100% (RBP drift 179/326 known carry-forward)
- Tests: typecheck + lint:tenant-id PASS
- ADR archive: 30 entries (3 superseded), latest ADR-0028/29/30 CASCADIA+ITLAB+Lexicon

## Riferimenti

- `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md` · `docs/_meta/lexicon.md`
- `db/seeds/realistic/_research_cache/{rtl_bank,smartfood,econova,heuresys}_industry_profile.json`
- `db/migrations/phase18h_smartfood_enrichment.sql` · `phase18i_econova_heuresys_enrichment.sql`
- Backup baseline: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump`
- Backup pre-S35.4: `heuresys_platform-pre-S35.4-smartfood-20260511T193550Z.dump` (sha `a58872d9…`) · `heuresys_platform-pre-S35.4-econova-heuresys-20260511T194204Z.dump` (sha `e4c50f2a…`)
