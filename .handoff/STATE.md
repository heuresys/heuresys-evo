# heuresys-evo — Current State

> Updated: 2026-05-11T18:50Z · S35.0+S35.1+S35.2+S35.3 (12/15 milestones GREEN) · CASCADIA pilot RTL ~80%

## Last session brief

S35 (~6.5h FTE effettive vs ~95h plan stimato — 6.8% collapse):

**S35.0 Forensic precondition** (`d26883e`): audit 95%→100%.
**S35.1 ITLAB phase18d** (`ff0bd45`): 22 sindacati + 4 CCNL + 12 RSU + CCNL_COMM levels.
**S35.2 Lexicon + skeleton** (`cd87416`): docs/_meta/lexicon.md 16 sigle + 7 lib helpers.
**S35.3 Pilot RTL Bank** (`f0a39b0` + `0a50b2c` + `58d372e` + `d7c555b` + `5343731`):

### Milestone status (12/15 PASS)

| M | Stage | Status | Result |
|---|---|---|---|
| M0 | Backup pre-pipeline | ✅ | sha256 `2fcc0d85...` |
| M1 | Industry profile JSON HUMAN GATE | ✅ approved | `_research_cache/rtl_bank_*.json` |
| M2 | INDOOR BANKING-M enrichment | ✅ | 22 roles + 11 depts + 14 ESCO codes |
| M3 | OPOURSKA org_units | ✅ no-op | 23 active depth 4 |
| M4+M4b | OPOURSKA job_templates | ✅ | 32 totali |
| M5 | OPOURSKA process_kpis | ✅ | 39 BANKING-M (+12 BP-009/010/011) |
| M6 | OPOURSKA business_processes | ✅ | 11 BANKING-M (+3 BP) |
| M7 | PROGOV phase18e regulatory | ✅ | 10 framework + 10 RTL compliance |
| M8 | OPOURSKA workforce | ✅ | 158/158 fully enriched |
| M9 | GOKMER Gaussian assessments | ✅ | 1859 Bell μ2.78 σ0.88 |
| M10 | GOKMER goals/okrs/kpi | ✅ | 627/10/248 |
| M11 | TALPIPE succession+9box+careers | ✅ | 98/157/23 |
| M12 | Bulk L&D/Recruit/Comp/Doc/Notif | ✅ | 1791/14/156/657/125 |
| **M13** | **ESKAP KG projection** | **❌ DEFERRED** | `kg_nodes`/`kg_edges` missing → phase18f |
| M14 | EPRA AI predictive | ✅ | 156+156+156 |
| M15 | PILOT GATE verification | ✅ 12/15 GREEN | dashboards live walkthrough carry-forward |

### M9 Gaussian distribution (1859 assessments)

| Level | Count | % |
|---|---|---|
| 1 | 119 | 6% |
| 2 | 564 | 30% |
| 3 | 825 | 44% (moda) |
| 4 | 303 | 16% |
| 5 | 48 | 3% |

### M11 9-box matrix (157 emp)

| Category | Count |
|---|---|
| Core Player (2,2) | 55 |
| Solid Performer (2,1) | 40 |
| High Performer (3,2) | 22 |
| Consistent Performer (3,1) | 16 |
| High Potential (2,3) | 8 |
| Inconsistent (1,2) | 6 |
| Risk (1,1) | 6 |
| Rough Diamond (1,3) | 2 |
| Star (3,3) | 2 |

## Top priorities (carry-forward S36)

1. **M13 ESKAP migration phase18f** — `kg_nodes`/`kg_edges` tables (master) + ESCO catalog projection + RTL tenant projection (~4-6h).
2. **S35.4 Extension** SmartFood + EcoNova + Heuresys (~15-25h FTE).
3. **M12 audit_logs Poisson** — gap ~5000 (target 5000-10000 12-mesi).
4. **M5b org_unit_kpis** — strategic/people KPI (ROE/CET1/LCR/NSFR/Turnover) per BANKING-M template root.
5. **S35.6 Dashboard binding** sweep + F-008 persona_label.
6. **S35.7 Verification + ADR-0027/0028/0029** + handoff finale.
7. **M15 dashboards live walkthrough** Chrome MCP 88 cells (8 roles × 11 dashboard).

## Stack snapshot (post-S35.3 12/15)

- **Audit forensic**: 100% (S35.0)
- **ITLAB**: 22 sindacati + 4 CCNL + 12 RSU + 9 CCNL_COMM (S35.1)
- **PROGOV**: 10 regulatory frameworks + 10 RTL compliance (S35.3 M7 phase18e)
- **CASCADIA**: lexicon SoT 16 sigle + 7 lib helpers (S35.2)
- **RTL Bank pilot** (158 active emp):
  - 32 job_templates · 23 active org_units · BANKING-M enriched
  - 11 BP · 39 process_kpis · 10 reg frameworks compliance tracking
  - 1859 employee_skill_assessments Bell μ2.78 σ0.88
  - 157 performance_reviews + 9-box matrix populated
  - 627 goals + 248 employee_kpi_targets + 10 okrs
  - 98 succession_candidates + 23 career_paths + 8 talent_pools
  - 1791 course_enrollments + 14 reqs + 156 salary bands + 657 docs + 125 notifs
  - 156 turnover_risk + 156 perf_pred + 156 model_pred
- **Commits S35**: 8 totali (S35.0+S35.1+S35.2+S35.3 M0-M11)
- **Tests**: typecheck PASS · lint:tenant-id PASS

## Verification

```bash
# Run full milestone verification suite
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
WITH rtl AS (SELECT id FROM tenants WHERE code='rtl-bank'),
     prof AS (SELECT id FROM industry_profiles WHERE code='BANKING-M')
SELECT 'M2 BANKING-M', array_length(typical_roles,1)::text||' roles' FROM industry_profiles WHERE code='BANKING-M'
UNION ALL SELECT 'M3 org_units', (SELECT count(*)::text FROM org_units WHERE tenant_id=(SELECT id FROM rtl) AND is_active=true)
UNION ALL SELECT 'M4 jobs', (SELECT count(*)::text FROM job_templates WHERE tenant_id=(SELECT id FROM rtl))
UNION ALL SELECT 'M5 kpis', (SELECT count(*)::text FROM process_kpis pk JOIN business_processes bp ON bp.id=pk.process_id WHERE bp.profile_id=(SELECT id FROM prof))
UNION ALL SELECT 'M6 bp', (SELECT count(*)::text FROM business_processes WHERE profile_id=(SELECT id FROM prof))
UNION ALL SELECT 'M7 reg', (SELECT count(*)::text FROM regulatory_frameworks)
UNION ALL SELECT 'M9 assessments', (SELECT count(*)::text FROM employee_skill_assessments esa JOIN employees e ON e.id=esa.employee_id WHERE e.tenant_id=(SELECT id FROM rtl))
UNION ALL SELECT 'M11 nine_box', (SELECT count(*)::text FROM nine_box_grid WHERE tenant_id=(SELECT id FROM rtl))
UNION ALL SELECT 'M14 epra', (SELECT count(*)::text FROM turnover_risk_scores WHERE tenant_id=(SELECT id FROM rtl))
\""
# expected: 22 / 23 / 32 / 39 / 11 / 10 / 1859 / 157 / 156
```

Riferimenti:
- Plan: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon: `docs/_meta/lexicon.md`
- M-stage SQL: `db/seeds/realistic/_generated_sql/rtl_bank_M*.sql`
- Industry profile: `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json`
- Backup: `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
