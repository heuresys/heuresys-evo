# heuresys-evo — Current State

> Updated: 2026-05-11T18:30Z · S35.0+S35.1+S35.2 closed + S35.3 M0-M8 done (9/15 milestones, pilot RTL Bank ~60% complete)

## Last session brief

S35 (~6h FTE effettive vs ~95h plan stimato — drastic 6% collapse da pre-existing infrastructure):

**S35.0 Forensic precondition** (commit `d26883e`): audit forensic 95% → 100%.
**S35.1 ITLAB phase18d** (commit `ff0bd45`): 22 sindacati + 4 tenant↔CCNL + 12 RSU + 9 CCNL_COMM levels.
**S35.2 Infrastructure + Lexicon** (commit `cd87416`): lexicon SoT 16 sigle + 7 lib helpers + CASCADIA skeleton.
**S35.3 Pilot RTL Bank M0-M8 done** (commits `f0a39b0` · `0a50b2c` · `58d372e`):

| Milestone | Status | Note |
|---|---|---|
| M0 backup | ✅ | sha256 `2fcc0d85...` |
| M1 industry profile JSON HUMAN GATE | ✅ approved | 250 righe, 32 ruoli, 24 KPI, 10 compliance |
| M2 INDOOR taxonomy BANKING-M | ✅ | 22 roles + 11 depts + 14 ESCO + typical_hierarchy |
| M3 OPOURSKA Layer 1 org_units | ✅ no-op | 23 active (1+9+8+5), depth 4, zero orphan |
| M4 OPOURSKA Layer 4 positions | ✅ | 2 nuovi job_templates + fix 2 orfani |
| M4b job_templates extension | ✅ | +13 = 32 totali (CEO/CRO/Compl/AML/IT/Cyber/CC/MKT/HRBP/FinRpt/Audit/FX/BackOff) |
| M5 OPOURSKA Layer 6 process_kpis | ✅ | +12 = 39 totali (BP-009/010/011 KPI banking-specific) |
| M6 OPOURSKA Layer 2-3 process blueprint | ✅ | +3 = 11 BP (BP-009 Onboarding + BP-010 Treasury + BP-011 Audit) |
| M7 PROGOV phase18e regulatory frameworks | ✅ | Migration nuova: 10 framework + 10 RTL compliance entries |
| M8 OPOURSKA workforce enrichment | ✅ | 158/158 hire_date + org_unit_id; 157/158 manager_id (CEO senza manager OK) |
| M9 GOKMER assessments | 🔄 partial | 299 esistenti (target ≥1500). Richiede Gaussian seed script ~1-2h |
| M10 Goals/OKRs/KPI targets | pending | |
| M11 TALPIPE Career/Succession semantic-driven | pending | richiede `lib/semantic-query.mjs` activation |
| M12 SKILGRO/H2R/SMERTO/PULSAR/ITLAB time-off/DGOV docs | pending | bulk milestone |
| M13 ESKAP RTL Bank tenant projection (KG) | pending | post-S35.5 catalog projection |
| M14 EPRA AI predictive (turnover risk) | pending | |
| M15 PILOT GATE | pending | dashboards live + 25-area SQL verification |

## Top priorities S36+

### Immediate carry-forward S35.3 M9-M15 (~10-18h FTE):

1. **M9 Gaussian skill assessments** — script Node.js usa `lib/distributions.mjs` per generare ~1200 nuove `employee_skill_assessments` Bell-shape distribuzione per `rbp_roles.level`. Total target: 1500 (oggi 299).
2. **M5b org_unit_kpis** — strategic/people KPI (ROE/CET1/LCR/NSFR/Turnover/Training/Engagement) seedare in `org_unit_kpis` con `org_unit_template_id` BANKING-M root.
3. **M10 Goals + OKRs + employee_kpi_targets** — 3 target/emp aligned alla review cycle 2025.
4. **M11 TALPIPE succession_pipeline** — query semantic-driven via `lib/semantic-query.mjs` → 40-80 succession candidates con coverage ≥70% verified.
5. **M12 satellite milestones**: L&D (SKILGRO), Recruiting (H2R), Comp (SMERTO), Mentorship, Engagement (PULSAR), Time-off (ITLAB), Documents, Audit logs Poisson, Notifications.
6. **M13 ESKAP RTL projection** — kg_nodes/kg_edges per RTL employees+roles+processes (post S35.5 catalog projection o standalone subset).
7. **M14 EPRA**: turnover_risk_scores + performance_predictions seedate da `employee_skill_assessments` + `performance_reviews` esistenti.
8. **M15 PILOT GATE** — dashboards live `/dashboard/*` per RTL Bank semantic walkthrough + 25-area SQL all green.

### Architectural carry-forward (verde tasche):

- **org_unit_kpis** seed M5b — richiede mapping `org_unit_templates` BANKING-M (potrebbe esistere già)
- **TALPIPE `lib/semantic-query.mjs`** validation pre-M11 — test su DB esistente per skill coverage query
- **EPRA `ai_skills_embeddings`** — verify pgvector embedding presence per skill matching M11

## Open questions

- M9 Gaussian: script standalone Node.js (richiede pg + libraries) OR SQL CTE con `random()` based PG-native? PG-native più rapido ma meno controllabile rispetto a seedable RNG.
- M5b org_unit_kpis: tabella ha `org_unit_template_id` (template), serve verificare se BANKING-M ha templates compatibili o crearli ad-hoc.
- M11 TALPIPE: target ≥40 succession candidates richiede `role_skill_requirements` populated (per ogni job_template 5-15 skills). Verifica pre-M11 mandatory.

## Stack snapshot (post-S35.3 M0-M8)

- **Audit forensic**: 100%
- **ITLAB**: 22 sindacati + 4 CCNL + 12 RSU + 9 CCNL_COMM (S35.1)
- **PROGOV phase18e**: 10 regulatory frameworks + 10 RTL compliance (S35.3 M7)
- **CASCADIA**: lexicon SoT + 7 lib helpers
- **RTL Bank pilot**:
  - 158/158 active emp con position_id + org_unit_id + hire_date ✅
  - 157/158 manager_id (CEO Federica Marchetti senza manager OK)
  - 32 job_templates ✅
  - 11 business_processes BANKING-M ✅
  - 39 process_kpis BANKING-M ✅
  - 23 active org_units ✅
  - BANKING-M industry_profile enriched ✅
  - 10 regulatory_frameworks compliance tracking ✅
  - 299 employee_skill_assessments (M9 target 1500, gap ~1200)
  - 157 performance_reviews (target 158)
  - 17 review_cycles
  - succession_pipeline: 0 rows (M11)
- **Commits S35**: `d26883e` (S35.0) · `ff0bd45` (S35.1) · `cd87416` (S35.2) · `f0a39b0` (M0-M4) · `0a50b2c` (M4b+M6) · `58d372e` (M5+M7+phase18e)
- **Tests**: typecheck PASS · `npm run lint:tenant-id` exit 0

## Verification

```bash
git log --oneline -8

# Full RTL Bank pilot state check (S35.3 M0-M8)
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
  SELECT
    (SELECT count(*) FROM job_templates WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank')) AS jobs,
    (SELECT count(*) FROM business_processes WHERE profile_id=(SELECT id FROM industry_profiles WHERE code='BANKING-M')) AS bp,
    (SELECT count(*) FROM process_kpis pk JOIN business_processes bp ON bp.id=pk.process_id WHERE bp.profile_id=(SELECT id FROM industry_profiles WHERE code='BANKING-M')) AS kpis,
    (SELECT count(*) FROM regulatory_frameworks) AS reg_frameworks,
    (SELECT count(*) FROM tenant_regulatory_compliance WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank')) AS rtl_compliance\""
# expected: 32 | 11 | 39 | 10 | 10
```

Riferimenti:
- Plan canonical: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon: `docs/_meta/lexicon.md`
- Migrations: phase18c (S35.0) · phase18d ITLAB · phase18e regulatory_frameworks
- M-stage SQL: `db/seeds/realistic/_generated_sql/rtl_bank_M*.sql`
- Industry profile JSON: `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json`
- Backup pre-S35.3: `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
