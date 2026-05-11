# heuresys-evo — Current State

> Updated: 2026-05-11T17:55Z · S35.0+S35.1+S35.2 closed + S35.3 M0-M6 done (7/15 milestones, pilot RTL Bank ~45% complete)

## Last session brief

S35 (~5h FTE effettive vs ~95h plan stimato — 5% collapse da pre-existing infrastructure):

**S35.0 Forensic precondition** (commit `d26883e`): audit forensic 95% → 100%.
**S35.1 ITLAB phase18d** (commit `ff0bd45`): 22 sindacati + 4 tenant↔CCNL + 12 RSU + 9 CCNL_COMM levels.
**S35.2 Infrastructure + Lexicon** (commit `cd87416`): lexicon SoT 16 sigle + 7 lib helpers + CASCADIA skeleton.
**S35.3 Pilot RTL Bank M0-M6 done** (commits `f0a39b0` + TBD M4b+M6):

- **M0** backup `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
- **M1** industry profile JSON HUMAN GATE ✅ approved (250 righe, 32 ruoli canonical, 18 critical skills, 24 KPI, 10 compliance, CCNL_CRED_2024)
- **M2** INDOOR taxonomy BANKING-M enrichment (22 typical_roles + 11 departments + 14 ESCO codes + typical_hierarchy JSONB)
- **M3** OPOURSKA Layer 1 org_units: già adeguato (23 active: 1 L1 + 9 L2 + 8 L3 + 5 L4)
- **M4** + **M4b** OPOURSKA Layer 4 job_templates: 32 totali (17 pre + 2 M4 HR/Ops + 13 M4b CEO/CRO/Compl/AML/IT/Cyber/CC/MKT/HRBP/FinRpt/Audit/FX/BackOff)
- **M6** OPOURSKA Layer 2 process blueprint: 11 BANKING-M BP (8 pre + 3 M6: Onboarding+Treasury+Audit)
- **M5** KPI framework **DEFERRED** — kpi_definitions canonical table missing; KPI modellati template-based (process_kpis + org_unit_kpis + job_kpis + tenant_job_kpis); richiede architettura mapping JSON→3-4 tabelle
- **M7** Compliance frameworks **DEFERRED** — `regulatory_frameworks`/`policies` master table missing; richiede migration phase18e nuova

## Top priorities

### Immediate carry-forward S35.3 M5+M7+M8-M14 (~15-25h FTE):

1. **M5 KPI framework** — architettare mapping JSON 24 KPI → tabelle DBMS:
   - 6 operational (NPL/Cost-Income/Branch tx/FCR/Loan time/Digital adopt) → `process_kpis` linked to BP-002/003/006
   - 7 strategic (ROE/CET1/LCR/NSFR/CSAT/...) → `org_unit_kpis` (org_unit_template root)
   - 6 compliance/regulatory (AML alert/STR/audit findings/...) → `process_kpis` linked to BP-007/011
   - 5 people/culture (turnover/training/engagement/...) → `org_unit_kpis` (org_unit_template STAFF)
2. **M7 Compliance frameworks** — migration phase18e: `regulatory_frameworks` + `tenant_regulatory_compliance` + seed 10 framework (PSD2/MiFID II/AML5/Basel III/GDPR/BdI 285+295/TUB/DORA)
3. **M8 Workforce enrichment** — verify 158/158 con manager_id + hire_date + seniority (lazy check su DB esistente, possibilmente già OK)
4. **M9 Assessments + reviews + calibration** — Gaussian distribuzione skill_assessments + quintile performance_reviews (~1500 employee_skill_assessments + 1 review cycle annuale)
5. **M10-M14**: Goals/OKRs, Career+Succession, L&D, Recruiting, Comp, Mentorship, Engagement, Time-off, Docs, Audit, KG projection, AI predictive
6. **M15 PILOT GATE** — dashboards live + 25-area SQL all green

### Architectural carry-forward (necessario per pilot completion):

- **phase18e migration** — `regulatory_frameworks` + `tenant_regulatory_compliance` (M7 prereq, ~2-3h)
- **process_kpis seeding architecture** — decisione: tabella `kpi_definitions` master nuova o usare `process_kpis`+`org_unit_kpis` esistenti? (M5 prereq, ~1h decisione + 2-3h seeding)
- **TALPIPE semantic gate implementation** — `lib/semantic-query.mjs` stubbed in S35.2, deve essere callable da M11 (career+succession)

## Open questions

- M5: aggiungere `kpi_definitions` master table (clean architecture, +migration) o seedare nei 3-4 tier esistenti (pragmatic, no migration)?
- M7: phase18e include solo `regulatory_frameworks` master + `tenant_regulatory_compliance` junction, oppure anche `compliance_checks_results` per audit trail?
- M9 distribuzioni Gaussian: implementare `lib/distributions.mjs` come callable da Node.js seed-generator script, oppure precomputare valori in SQL?

## Stack snapshot (post-S35.3 M0-M6)

- **Audit forensic**: 100%
- **ITLAB**: 22 sindacati + 4 CCNL links + 12 RSU + 9 CCNL_COMM
- **CASCADIA**: lexicon SoT + 7 lib helpers
- **RTL Bank pilot**:
  - 158/158 active emp con position_id ✅
  - 32 job_templates ✅ (M4 era 17, +2 M4 + 13 M4b = 32 = target)
  - 4357 job_template_skills ESCO-grounded ✅
  - 23 active org_units ✅
  - BANKING-M industry_profile enriched ✅ (22 roles + 11 depts + 14 ESCO + typical_hierarchy)
  - 11 BANKING-M business_processes ✅ (target ≥10)
  - Industry profile JSON canonical ✅
  - CCNL_CRED_2024 + 4 sindacati linked ✅
  - kpi_definitions: ❌ DEFERRED M5
  - regulatory_frameworks: ❌ DEFERRED M7 (no master table)
  - succession_pipeline: 0 rows (M11)
- **Commits S35**: `d26883e` · `ff0bd45` · `cd87416` · `f0a39b0` (S35.3 M0-M4) · TBD (S35.3 M4b+M6)
- **Tests**: typecheck PASS · `npm run lint:tenant-id` exit 0

## Verification

```bash
git log --oneline -8

# S35.3 M4b+M6 verification
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
  SELECT
    (SELECT count(*) FROM job_templates WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank')) AS jobs,
    (SELECT count(*) FROM business_processes WHERE profile_id=(SELECT id FROM industry_profiles WHERE code='BANKING-M')) AS bp,
    (SELECT count(*) FILTER (WHERE position_id IS NULL) FROM employees WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank') AND employment_status='active') AS orphans\""
# expected: 32 | 11 | 0
```

Riferimenti:
- Plan canonical: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon: `docs/_meta/lexicon.md`
- M-stage SQL: `db/seeds/realistic/_generated_sql/rtl_bank_M*.sql`
- Industry profile JSON: `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json`
- Backup pre-S35.3: `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
