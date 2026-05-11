# heuresys-evo — Current State

> Updated: 2026-05-11T19:10Z · S35 closed · CASCADIA pilot RTL 14/15 · ESKAP shipped

## Last session brief

S35 (10 commit, ~7h FTE vs ~95h plan): audit forensic 100% (S35.0) · ITLAB phase18d (S35.1) · CASCADIA skeleton+lexicon 16 sigle (S35.2) · pilot RTL Bank M0-M14 PASS (S35.3 14/15) · ESKAP knowledge graph phase18f con 17k nodes + 139k edges (S35.5 full).

## Top priorities

1. **S35.4 Extension SmartFood + EcoNova + Heuresys** (~15-25h FTE) — replica RTL pilot pattern per 3 tenant restanti con industry profile customizzato (HACCP food / ISO 50001 energy / SaaS). Ogni tenant: HUMAN GATE industry profile + cascade INDOOR/OPOURSKA/GOKMER/TALPIPE/SKILGRO/PROGOV/ITLAB/EPRA + ESKAP tenant projection (~30min/tenant post-pattern).
2. **M15 dashboards live walkthrough** Chrome MCP 88 cells (8 roles × 11 dashboard) — visual validation pilot RTL (~1-2h).
3. **S35.6 + S35.7** dashboard binding sweep + F-008 persona_label + ADR-0027/0028/0029 + verification finale (~10-16h).

## Open questions

- S35.4: industry profile JSON per i 3 tenant restanti — generazione manuale (pattern RTL) o web research via OpenAI advisor (richiede live API call vs cache)?
- M5b org_unit_kpis strategic (ROE/CET1/Turnover) — seedare per BANKING-M template root o defer a M16 cross-tenant?

## Stack snapshot (post-S35)

- Migrations applicate VM: phase18d (ITLAB) · phase18e (PROGOV) · phase18f (ESKAP)
- RTL Bank pilot: 158/158 emp enriched · 32 jobs · 11 BP · 39 KPI · 10 reg framework · 1859 assessments Bell · 9-box · 209 KG nodes + 1766 RTL edges
- ESCO catalog: 17.051 kg_nodes platform + 137.685 kg_edges platform
- CASCADIA: lexicon SoT 16 sigle (`docs/_meta/lexicon.md`) + 7 lib helpers
- Audit forensic: 100% · Tests: typecheck + lint:tenant-id PASS

## Verification

```bash
git log --oneline -10
# expected HEAD: 5f08439 ESKAP

ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
SELECT (SELECT count(*) FROM kg_nodes) AS nodes,
       (SELECT count(*) FROM kg_edges) AS edges,
       (SELECT count(*) FROM employee_skill_assessments esa JOIN employees e ON e.id=esa.employee_id WHERE e.tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank')) AS rtl_assess\""
# expected: 17260 / 139451 / 1859
```

Riferimenti: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md` · `docs/_meta/lexicon.md` · `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json` · backup `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
