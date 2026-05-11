# heuresys-evo — Current State

> Updated: 2026-05-11T17:30Z · S35.0+S35.1+S35.2 closed + S35.3 M0-M4 done (5/15 milestones, pilot RTL Bank ~30% complete)

## Last session brief

S35 (~4h FTE effettive vs ~75h plan stimato — collapso drastico da pre-existing infrastructure):

**S35.0 Forensic precondition (commit `d26883e`)**: audit forensic 95% → **100%**. `role_default_dashboards` Prisma model + ESLint `lint:tenant-id` + bcrypt rotation già closed L57.

**S35.1 ITLAB phase18d (commit `ff0bd45`)**: 22 sindacati + 4 tenant↔CCNL + 12 RSU/RSA + 9 CCNL_COMM levels + 3 Prisma model. Migration applied su VM con backup pre-migration sha256.

**S35.2 Pipeline skeleton + Lexicon (commit `cd87416`)**: `docs/_meta/lexicon.md` SoT 16 sigle + 7 lib helpers + 2 README + CLAUDE.md update + .gitignore.

**S35.3 Pilot RTL Bank in progress (M0-M4 done)**:
- **M0 backup** `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
- **M1 industry profile** `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json` — HUMAN GATE M1 ✅ approved (250 righe JSON, NACE K.64.19, workforce 158 emp, 7 divisioni, 10 BP, 32 ruoli canonical, 18 critical skills, 24 KPI, 10 compliance framework, CCNL_CRED_2024)
- **M2 INDOOR taxonomy** (SQL `_generated_sql/rtl_bank_M2_industry_taxonomy.sql` applied): BANKING-M industry_profile enrichment — typical_hierarchy + 22 typical_roles + 11 typical_departments + 14 ESCO occupation codes
- **M3 OPOURSKA Layer 1 org_units**: già adeguato pre-S35.3 (1 L1 + 9 L2 + 8 L3 + 5 L4, zero orphan, no change applicata)
- **M4 OPOURSKA Layer 4 job_templates** (SQL `_generated_sql/rtl_bank_M4_position_fix.sql` applied): 2 nuovi job_templates (RTL-HR-MGR, RTL-OPS-MGR) + fix 2 employees orfani → **0 orphans, 19 job_templates RTL Bank, 158/158 active emp con position_id**

**Carry-forward M4b**: extensione 32 ruoli canonical del profile JSON (CEO, Director, AML Specialist, Cybersec, ecc.) — patch minimo solo per orfani, espansione completa M5+.

Plan canonical: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`. Effort residuo S35.3 M5-M15: ~15-25 FTE-h.

## Top priorities S35.3 continuation

1. **M5 KPI framework** — `kpi_definitions` ≥30 industry-specific banking (NPL, Cost/Income, ROE, CET1, LCR, AML alert, customer satisfaction, training hours, turnover) seedare da `kpi_framework` del JSON
2. **M6 Process blueprint** — `business_processes` ≥10 RTL-specific (Onboarding/Erogazione Credito/Payment Processing/Wealth Mgmt/Treasury/Risk/Compliance/Audit/HR/IT) — esistono già 8 BP RTL, verificare e estendere
3. **M7 Compliance frameworks** — `policies` + `regulatory_frameworks` banking: PSD2/AML5/Basel III/GDPR/BdI Circ 285+295/TUB/DORA
4. **M8 Workforce enrichment** — 100% RTL emp con manager_id + hire_date + seniority (già 158/158 active, verifica)
5. **M9-M14**: Assessments/Reviews/Career/Succession/L&D/Recruiting/Comp/Mentorship/Engagement/Time-off/Docs/Audit/KG/AI
6. **M15 PILOT GATE** — dashboards live + 25-area SQL all green

## Open questions

- M5 KPI seed: usare `kpi_definitions` o `tenant_kpis`? (DB ha entrambe in alcune aree, verificare convenzione)
- M4b job_templates extension: rivedere prima dell'M5 (HR+Operations sono solo 2 di 32) oppure procedere e tornare a M4b in batch?
- M11 succession_pipeline semantic gate: implementare prima la query semantic in `lib/semantic-query.mjs` o derivare manualmente dal DB esistente?

## Stack snapshot (post-S35.3 M0-M4)

- **Audit forensic**: 100% (era 95%)
- **ITLAB**: 22 sindacati + 4 CCNL links + 12 RSU + 9 CCNL_COMM + holidays IT 2025-2027
- **CASCADIA skeleton**: lexicon SoT + 7 lib helpers + 2 README
- **RTL Bank pilot stato**:
  - 158/158 active employees con position_id ✅
  - 19 job_templates ✅ (target ≥25, +6 carry M4b)
  - 4357 job_template_skills ESCO-grounded ✅
  - 23 active org_units (1 L1 + 9 L2 + 8 L3 + 5 L4) ✅
  - BANKING-M industry_profile enriched ✅
  - Industry profile JSON canonical ✅
  - CCNL_CRED_2024 link ✅ + 4 sindacati linked ✅
  - succession_pipeline: 0 rows (M11)
  - kpi_definitions: 0-5 (M5 target ≥30)
- **Commits S35**: `d26883e` (S35.0) · `ff0bd45` (S35.1) · `cd87416` (S35.2) · TBD (S35.3 M0-M4)
- **Tests**: typecheck PASS · `npm run lint:tenant-id` exit 0

## Verification

```bash
git log --oneline -8

# S35.3 M4 verification
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -At -c \"
  SELECT 
    (SELECT count(*) FILTER (WHERE position_id IS NULL) FROM employees 
     WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank') AND employment_status='active') AS orphans,
    (SELECT count(*) FROM job_templates WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank')) AS jobs,
    (SELECT count(*) FROM org_units WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank') AND is_active=true) AS units\""
# expected: 0 | 19 | 23

# S35.3 M2 BANKING-M enrichment
ssh oracle-vm-default "sudo -u postgres psql -d heuresys_platform -c \"
  SELECT code, array_length(typical_roles,1), array_length(esco_occupation_codes,1), 
    typical_hierarchy IS NOT NULL FROM industry_profiles WHERE code='BANKING-M'\""
# expected: BANKING-M | 22 | 14 | t

# Industry profile artifact
test -f db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json && \
  wc -l db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json
# expected: file exists, ~330 lines
```

Riferimenti:
- Plan canonical: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon SoT: `docs/_meta/lexicon.md`
- Pipeline scripts: `scripts/seed-generator/README.md`
- M-stage SQL: `db/seeds/realistic/_generated_sql/rtl_bank_M*.sql`
- Industry profile JSON: `db/seeds/realistic/_research_cache/rtl_bank_industry_profile.json`
- Backup pre-S35.3: `/var/backups/heuresys-evo/heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` sha256 `2fcc0d85...`
