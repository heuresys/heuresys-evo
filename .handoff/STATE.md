# heuresys-evo — Current State

> Updated: 2026-05-11T19:00Z · S35.0+S35.1+S35.2+S35.5 closed + S35.3 (14/15 milestones GREEN) · CASCADIA pilot RTL ~93%

## Last session brief

S35 (~7h FTE effettive vs ~95h plan stimato — 7.4% collapse):

**S35.0 Forensic precondition** (`d26883e`): audit 95%→100%.
**S35.1 ITLAB phase18d** (`ff0bd45`): 22 sindacati + 4 CCNL + 12 RSU + CCNL_COMM levels.
**S35.2 Lexicon + skeleton** (`cd87416`): docs/_meta/lexicon.md 16 sigle + 7 lib helpers.
**S35.3 Pilot RTL Bank** + **S35.5 ESKAP** (`f0a39b0` + `0a50b2c` + `58d372e` + `d7c555b` + `5343731` + `e81f100` + TBD):

### Milestone status (14/15 PASS)

| M | Stage | Status | Result |
|---|---|---|---|
| M0 | Backup pre-pipeline | ✅ | sha256 `2fcc0d85...` |
| M1 | Industry profile JSON HUMAN GATE | ✅ approved | _research_cache/rtl_bank_industry_profile.json |
| M2 | INDOOR BANKING-M enrichment | ✅ | 22 roles + 11 depts + 14 ESCO codes |
| M3 | OPOURSKA org_units | ✅ no-op | 23 active depth 4 |
| M4+M4b | OPOURSKA job_templates | ✅ | 32 totali |
| M5 | OPOURSKA process_kpis | ✅ | 39 BANKING-M |
| M6 | OPOURSKA business_processes | ✅ | 11 BANKING-M |
| M7 | PROGOV phase18e regulatory | ✅ | 10 framework + 10 RTL compliance |
| M8 | OPOURSKA workforce | ✅ | 158/158 fully enriched |
| M9 | GOKMER Gaussian assessments | ✅ | 1859 Bell μ2.78 σ0.88 |
| M10 | GOKMER goals/okrs/kpi | ✅ | 627/10/248 |
| M11 | TALPIPE succession+9box+careers | ✅ | 98/157/23 |
| M12 | Bulk L&D/Recruit/Comp/Doc/Notif | ✅ | 1791/14/156/657/125 |
| **M13** | **ESKAP RTL tenant projection** | ✅ done **(NEW)** | 209 tenant nodes + 1766 tenant edges |
| M14 | EPRA AI predictive | ✅ | 156+156+156 |
| M15 | PILOT GATE verification | 🔄 14/15 GREEN | dashboards live walkthrough carry-forward |

### S35.5 ESKAP Knowledge Graph (S35.3 M13 simultaneous closure)

Migration `phase18f_eskap_knowledge_graph.sql` applied su VM (CREATE TABLE kg_nodes + kg_edges + RLS + indexes + ESCO catalog seed + RTL projection):

**kg_nodes** (17.260 totali):
| Type | Platform (NULL tenant) | RTL Bank tenant |
|---|---|---|
| SKILL | 14.011 | 0 |
| OCCUPATION | 3.040 | 0 |
| EMPLOYEE | 0 | 158 |
| JOB_TEMPLATE | 0 | 32 |
| PROCESS | 0 | 11 |
| ROLE | 0 | 8 |

**kg_edges** (139.451 totali):
| Type | Count |
|---|---|
| REQUIRES_SKILL (essential) | 67.600 |
| SKILL_OF_OCCUPATION (optional) | 58.451 |
| ADJACENT_SKILL | 11.634 |
| OWNS_SKILL (emp→skill RTL) | 1.610 |
| HAS_OCCUPATION (emp→occ RTL) | 156 |

ESCO catalog completo proiettato + RTL tenant projection (employees + roles + processes + active skill ownership da employee_skill_assessments via skill_name match con esco_skills.preferred_label).

## Top priorities (carry-forward S36)

1. **S35.4 Extension** SmartFood + EcoNova + Heuresys (~15-25h FTE) — replica pilot pattern per 3 tenant restanti (industry profile JSON HUMAN GATE per ognuno, taxonomy seed industry-specific HACCP/ISO 50001/SaaS, processi e KPI specifici).
2. **S35.4 ESKAP per altri 3 tenant** — replica RTL projection per SmartFood/EcoNova/Heuresys (~30min ciascuno post-pilot pattern).
3. **M15 dashboards live walkthrough** Chrome MCP 88 cells (8 roles × 11 dashboard) — visual validation.
4. **M12 audit_logs Poisson** — gap ~5000 (target 5000-10000 12-mesi).
5. **M5b org_unit_kpis** — strategic/people KPI per BANKING-M template root.
6. **S35.6 Dashboard binding** sweep + F-008 persona_label.
7. **S35.7 Verification + ADR-0027/0028/0029** + handoff finale.

## Stack snapshot (post-S35.3 14/15)

- **Audit forensic**: 100% (S35.0)
- **ITLAB**: 22 sindacati + 4 CCNL + 12 RSU + 9 CCNL_COMM (S35.1)
- **PROGOV**: 10 regulatory frameworks + 10 RTL compliance (S35.3 M7 phase18e)
- **ESKAP**: ESCO catalog completo 17k nodes + 137k edges + RTL projection 209 nodes + 1.766 edges (S35.5 phase18f)
- **CASCADIA**: lexicon SoT 16 sigle + 7 lib helpers (S35.2)
- **RTL Bank pilot** (158 active emp):
  - 32 job_templates · 23 active org_units · BANKING-M enriched
  - 11 BP · 39 process_kpis · 10 reg frameworks compliance
  - 1859 employee_skill_assessments Bell μ2.78 σ0.88
  - 157 performance_reviews + 9-box matrix populated
  - 627 goals + 248 employee_kpi_targets + 10 okrs
  - 98 succession_candidates + 23 career_paths + 8 talent_pools
  - 1791 course_enrollments + 14 reqs + 156 salary bands + 657 docs + 125 notifs
  - 156 turnover_risk + 156 perf_pred + 156 model_pred
  - 209 KG nodes RTL projection + 1.766 KG edges RTL tenant
- **Migrations applicate VM**: phase18c (skip — già closed L57) · phase18d (ITLAB) · phase18e (PROGOV) · phase18f (ESKAP)
- **Commits S35**: 9 totali (S35.0+S35.1+S35.2+S35.3 M0-M11+M13+S35.5)
- **Tests**: typecheck PASS · lint:tenant-id PASS

## Verification

```bash
# Full milestone verification suite (M2-M14 + ESKAP)
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
WITH rtl AS (SELECT id FROM tenants WHERE code='rtl-bank'),
     prof AS (SELECT id FROM industry_profiles WHERE code='BANKING-M')
SELECT 'M2 BANKING-M', array_length(typical_roles,1)::text FROM industry_profiles WHERE code='BANKING-M'
UNION ALL SELECT 'M3 org_units', (SELECT count(*)::text FROM org_units WHERE tenant_id=(SELECT id FROM rtl) AND is_active=true)
UNION ALL SELECT 'M4 jobs', (SELECT count(*)::text FROM job_templates WHERE tenant_id=(SELECT id FROM rtl))
UNION ALL SELECT 'M5 kpis', (SELECT count(*)::text FROM process_kpis pk JOIN business_processes bp ON bp.id=pk.process_id WHERE bp.profile_id=(SELECT id FROM prof))
UNION ALL SELECT 'M6 bp', (SELECT count(*)::text FROM business_processes WHERE profile_id=(SELECT id FROM prof))
UNION ALL SELECT 'M7 reg', (SELECT count(*)::text FROM regulatory_frameworks)
UNION ALL SELECT 'M9 assessments', (SELECT count(*)::text FROM employee_skill_assessments esa JOIN employees e ON e.id=esa.employee_id WHERE e.tenant_id=(SELECT id FROM rtl))
UNION ALL SELECT 'M11 nine_box', (SELECT count(*)::text FROM nine_box_grid WHERE tenant_id=(SELECT id FROM rtl))
UNION ALL SELECT 'M13 KG nodes RTL', (SELECT count(*)::text FROM kg_nodes WHERE tenant_id=(SELECT id FROM rtl))
UNION ALL SELECT 'M13 KG nodes platform', (SELECT count(*)::text FROM kg_nodes WHERE tenant_id IS NULL)
UNION ALL SELECT 'M13 KG edges total', (SELECT count(*)::text FROM kg_edges)
UNION ALL SELECT 'M14 epra', (SELECT count(*)::text FROM turnover_risk_scores WHERE tenant_id=(SELECT id FROM rtl))
\""
# expected: 22 / 23 / 32 / 39 / 11 / 10 / 1859 / 157 / 209 / 17051 / 139451 / 156
```

Riferimenti:
- Plan: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon: `docs/_meta/lexicon.md`
- M-stage SQL: `db/seeds/realistic/_generated_sql/rtl_bank_M*.sql`
- Industry profile: `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json`
- Migrations: `db/migrations/phase18d_*.sql` (ITLAB) · `phase18e_*.sql` (PROGOV) · `phase18f_*.sql` (ESKAP)
- Backup: `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
