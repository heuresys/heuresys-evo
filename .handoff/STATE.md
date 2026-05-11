# heuresys-evo — Current State

> Updated: 2026-05-11T21:00Z · S36 partial autonomous · F-008 shipped · ADR-0028/29/30 drafted

## Last session brief

**S36 partial (autonomous, ~50min FTE)**: verification baseline S35.7 (22/24 SQL PASS, 1 known RBP drift, 1 pending F-008) · F-008 persona_label rename via `phase18g_audience_persona_label.sql` applicata su VM (11 dashboard_presets → `Audience: <ROLE>`) · ADR-0028 (CASCADIA pipeline) + ADR-0029 (ITLAB tables) + ADR-0030 (Lexicon canonical 16 sigle) drafted · README ADR backfill 0022-0030.

## Top priorities (S36 continuation)

1. **S35.4 Extension SmartFood + EcoNova + Heuresys** (~15-25h FTE) — replica RTL pilot pattern per 3 tenant. **Open question pending**: industry profile JSON manuale (pattern RTL) vs web research via OpenAI advisor (live API).
2. **M15 dashboards live walkthrough** Chrome MCP 88 cells (8 roles × 11 dashboard) — visual validation pilot RTL (~1-2h, richiede coordinamento human).
3. **S35.6 binding sweep** (~3-5h) — `services/app/src/lib/dashboard-engine/registry.tsx` 19 widget: remove demo fallback + adoption `useWidgetData()`. **Decision pending**: per-widget data source strategy.

## Open questions

- S35.4: industry profile JSON per i 3 tenant restanti — generazione manuale (pattern RTL) o web research via OpenAI advisor (richiede live API call vs cache)?
- M5b org_unit_kpis strategic (ROE/CET1/Turnover) — seedare BANKING-M template root o defer a M16 cross-tenant?
- RBP drift 179/326: forensic fix in S35.0 deferred. Schedule S36+ dedicated session?

## Verification (post-S36 autonomous)

```bash
git log --oneline -10
# expected HEAD: <S36 commit hash>

# Audience: pattern shipped on 11 presets
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT COUNT(*) FROM dashboard_presets WHERE persona_label LIKE 'Audience:%'\""
# expected: 11

# RTL Bank pilot coverage unchanged
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT (SELECT count(*) FROM kg_nodes) AS nodes,
       (SELECT count(*) FROM kg_edges) AS edges,
       (SELECT count(*) FROM employee_skill_assessments esa
        JOIN employees e ON e.id=esa.employee_id
        WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank')) AS rtl_assess\""
# expected: 17260 / 139451 / 1859
```

## Stack snapshot (post-S36 autonomous)

- Migrations applicate VM: phase18d (ITLAB) · phase18e (PROGOV regulatory) · phase18f (ESKAP KG) · phase18g (F-008 persona_label)
- RTL Bank pilot: 158/158 emp enriched · 32 jobs · 11 BP · 39 KPI · 10 reg framework · 1859 assessments Bell · 9-box (157 row) · 209 KG nodes + 1766 RTL edges
- ESCO catalog: 17.260 kg_nodes platform + 139.451 kg_edges platform
- Dashboard_presets persona_label: 11/11 `Audience: <ROLE>` pattern (F-008 shipped)
- Audit forensic: 100% (RBP drift 179/326 known carry-forward) · Tests: typecheck + lint:tenant-id PASS
- ADR archive: 30 entries (3 superseded), ADR-0028+29+30 drafted retrospective post-S35

Riferimenti: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md` · `docs/_meta/lexicon.md` · `docs/50-reference/decisions/0028-cascadia-universe-seeding.md` · `db/migrations/phase18g_audience_persona_label.sql` · `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json` · backup `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
