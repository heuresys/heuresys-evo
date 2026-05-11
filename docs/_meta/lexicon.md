# Lexicon canonical — catene relazionali heuresys-evo

> **SoT cross-machine via git** · Adottato S35.0 + ADR-0029 (TBD) · 16 sigle (4 ✅ canonical pre-esistenti + 12 ⭐ formalizzate S35)

Vocabolario controllato di acronimi per le aggregazioni semanticamente significative dell'universo dati (568 modelli Prisma, 291 tabelle tenant-scoped, 25 aree funzionali). Riusato come: directory naming pipeline · ADR title · commit scope · audit grid cells · handoff brevity · skill/agent invocation.

## Le 16 sigle

| #   | Sigla           | Estesa                                                                 | Significato                                                                                                                                              | Tabelle DBMS chiave                                                                                                                 |
| --- | --------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **OPOURSKA** ✅ | Organization-Process-OrgUnit-Role-Skill-KPI-Assessment                 | 7-layer ontology canonical                                                                                                                               | `tenants`, `org_units`, `business_processes`, `rbp_roles`, `job_templates`, `esco_skills`, `kpi_definitions`, `performance_reviews` |
| 2   | **PET** ✅      | Process / Enterprise / Talent                                          | 3 access perspectives (Porta 1 COO / Porta 2 CFO-Chief Org / Porta 3 CHRO)                                                                               | `rbp_perspectives` (47), `rbp_functional_areas` (34)                                                                                |
| 3   | **INDOOR** ⭐   | Industry-NACE-Domain-Org-OrgUnit-Roles                                 | Industry-driven cascade (industry → workforce baseline → org → roles)                                                                                    | `industry_classifications`, `industry_profiles`, `tenant_industry_classifications`                                                  |
| 4   | **TALPIPE** ⭐  | Talent Pipeline (Career-Succession-9Box-TalentPool-Mobility-Promotion) | Talent flow + succession derivation                                                                                                                      | `career_paths`, `succession_pipeline`, `talent_pools`, `internal_mobility_*`, `nine_box_grid`                                       |
| 5   | **H2R** ✅      | Hire-to-Retire                                                         | Industry-standard HR lifecycle                                                                                                                           | `recruiting_*`, `onboarding_*`, `employees`, `employee_employment_history`, `termination_*`                                         |
| 6   | **SKILGRO** ⭐  | Skill-Knowledge-Inventory-Learning-GROwth                              | Learning Loop (gap → recommendation → enrollment → certification → reassessment)                                                                         | `skill_gap_analyses`, `learning_recommendations`, `course_enrollments`, `certifications`, `employee_skill_assessments`              |
| 7   | **GOKMER** ⭐   | Goal-Objective-KPI-Measurement-Evaluation-Review                       | Performance Cycle                                                                                                                                        | `goals`, `okrs`, `kpi_definitions`, `performance_reviews`, `calibration_*`, `feedback_360`                                          |
| 8   | **PROGOV** ⭐   | Process Governance (Workflow-Approval-Audit-Compliance)                | Process-driven governance + audit trail                                                                                                                  | `business_processes`, `workflow_*`, `approval_chains`, `audit_logs`, `compliance_checks`, `regulatory_frameworks`                   |
| 9   | **ESKAP** ⭐    | ESCO + Knowledge graph Application Projection                          | KG full + tenant projection                                                                                                                              | `esco_skills` (14k), `esco_occupations` (3k), `esco_occupation_skills` (126k), `skill_adjacencies` (5.8k), `kg_nodes`, `kg_edges`   |
| 10  | **ITLAB** ⭐    | Italian Labor (CCNL-INPS-Sindacati-Holidays IT)                        | Italian labor context governance                                                                                                                         | `ccnl_contracts` (7), `ccnl_levels`, `holidays` (144 IT 2025-2027), `sindacati` (22), `tenant_ccnl_links`, `sindacato_tenant_links` |
| 11  | **RBP** ✅      | Role-Based Permissions matrix                                          | 8 roles × 34 areas governance                                                                                                                            | `rbp_roles` (8), `rbp_functional_areas` (34), `rbp_role_permissions` (179 canonical)                                                |
| 12  | **DGOV** ⭐     | Data Governance (Multi-tenant + RLS + Audit + GDPR)                    | Trasversale 25 aree, enforce P1+P4+P5+P7                                                                                                                 | 367 RLS policies, `audit_logs`, `data_retention_policies`, `data_subject_requests`, `documents`                                     |
| 13  | **SMERTO** ⭐   | Salary-Merit-Equity-Reward-TOtal                                       | Compensation Cycle                                                                                                                                       | `salary_bands`, `salary_band_assignments`, `salary_history`, `merit_cycles`, `bonuses`, `bonus_allocations`                         |
| 14  | **PULSAR** ⭐   | PUlse-LinkedScore-Action-Retention                                     | Engagement Loop                                                                                                                                          | `engagement_surveys`, `pulse_checks`, `survey_responses`, `engagement_pulse_configs`                                                |
| 15  | **EPRA** ⭐     | Embedding-Prediction-Recommendation-Action                             | AI/Predictive stack                                                                                                                                      | `ai_*`, `model_predictions`, `turnover_risk_scores`, `performance_predictions`, `ai_skills_embeddings` (pgvector 1536-dim)          |
| 16  | **CASCADIA** ⭐ | Catena seeding realistic end-to-end                                    | Self-reference: pipeline stessa (INDOOR + OPOURSKA + TALPIPE + SKILGRO + GOKMER + PROGOV + ESKAP + ITLAB + SMERTO + PULSAR + EPRA) applicata ai 4 tenant | scripts/seed-generator/cascadia/run-pilot.mjs                                                                                       |

Legenda: ✅ = canonical pre-esistente · ⭐ = nuova formalizzazione S35

## Naming convention operativa

### Directory naming (scripts/seed-generator/)

Directory per sigla **minuscola**:

```
scripts/seed-generator/
├── cascadia/          # CASCADIA — orchestrator
├── indoor/            # INDOOR — industry profile generation
├── opourska/          # OPOURSKA — 7-layer ontology seeding
├── progov/            # PROGOV — workflow + compliance
├── gokmer/            # GOKMER — assessments + KPI targets
├── talpipe/           # TALPIPE — career + succession + mentorship
├── skilgro/           # SKILGRO — learning loop
├── h2r/               # H2R — recruiting + onboarding
├── smerto/            # SMERTO — compensation
├── pulsar/            # PULSAR — engagement
├── itlab/             # ITLAB — IT labor context (CCNL/holidays)
├── dgov/              # DGOV — documents + audit + notifications
├── eskap/             # ESKAP — knowledge graph
├── epra/              # EPRA — AI/predictive
└── lib/               # shared helpers
```

### ADR title pattern

```
ADR-NNNN: <SIGLA> [+ <SIGLA>] <topic>
```

Esempi:

- `ADR-0027: CASCADIA + OPOURSKA + INDOOR seeding pipeline 4-tenant`
- `ADR-0028: ITLAB tables design (CCNL/payroll/sindacati/holiday)`
- `ADR-0029: Lexicon canonical adoption (16 sigle SoT)`

### Commit scope pattern

```
<type>(<sigla>): <subject ≤70 char>
```

Esempi:

- `migration(itlab): phase18d sindacati + linkages`
- `feat(eskap): proiettare ESCO catalog in kg_nodes/edges`
- `fix(rbp): user.role FK constraint`
- `schema(opourska): job_templates relations cleanup`

Tipi consentiti (commitlint): `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `deps`, `config`, `security`, `adr`, `schema`, `ui`, `story`, `tokens`, `obs`, `migration`, `a11y`.

### Audit grid cell criteria

8 ruoli × 11 dashboard × 12 criteri = 1056 cells. Criteri canonical incrociano le sigle:

- "OPOURSKA coverage" — i 7 layer popolati per il tenant?
- "INDOOR coherence" — workforce baseline coerente con NACE?
- "ESKAP completeness" — KG ESCO + tenant projection presente?
- "DGOV enforcement" — RLS + audit attivi su tutti i widget?
- "ITLAB consistency" — CCNL coerente con tenant industry?
- "TALPIPE semantic" — succession candidates passano coverage ≥70%?
- "SMERTO active" — salary bands assegnati al 100% emp?
- "PULSAR feedback" — almeno 1 survey published per tenant?

### Handoff brevity pattern

```
SXX.Y MNN — <SIGLA>[+<SIGLA>] for <tenant> shipped
```

Esempi:

- "S35.0 closed — OPOURSKA Prisma model + L57 lint:tenant-id verified"
- "S35.1 closed — ITLAB phase18d shipped (22 sindacati, 12 RSU, 4 tenant↔CCNL)"
- "S35.3 M11 — TALPIPE for RTL Bank shipped (44 succession candidates, coverage ≥70%)"

### Skill/agent invocation pattern

```
opourska-seed                 # skill for OPOURSKA-area seed task
indoor-validator              # agent for INDOOR profile review
cascadia-orchestrator         # umbrella skill
```

## Governance

1. **Nuova sigla**: per aggiungere una catena relazionale al lexicon → ADR esplicito + update questo file + update CLAUDE.md root.
2. **Sigla retired**: con ADR esplicito + deprecation marker. Mai cancellare row, marcare `~~SIGLA~~` strikethrough con `Retired SXX.Y, see ADR-NNNN`.
3. **Sigla rename**: alias period (entrambi accettati) per 1 sprint → singolo flip + ADR.
4. **Conflict resolution**: in caso di sovrapposizione semantica fra sigle (es. nuovo PROCYC vs esistente GOKMER), preferire la sigla esistente. Differenza chiara di scope = nuova sigla; sovrapposizione = riuso.

## Riferimenti

- ADR-0027: CASCADIA pipeline architecture (TBD S35.7)
- ADR-0028: ITLAB tables design (TBD S35.7)
- ADR-0029: Lexicon canonical adoption (TBD S35.7)
- Plan canonical: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Pipeline directory: `scripts/seed-generator/<sigla>/`
- Migration phase18c (DGOV): `db/migrations/phase18c_*.sql` (S35.0 — non necessaria, audit forensic già al 100%)
- Migration phase18d (ITLAB): `db/migrations/phase18d_italian_labor_context.sql` (S35.1)

## Stato corrente sigle (S35.0 + S35.1 closed)

| Sigla     | Stato                                                                          | Pipeline directory |
| --------- | ------------------------------------------------------------------------------ | ------------------ |
| OPOURSKA  | base attiva, Prisma model `role_default_dashboards` aggiunto S35.0             | pending S35.2      |
| PET       | base attiva (47 perspectives + 34 areas)                                       | pending S35.2      |
| INDOOR    | scheletrico, 7 CCNL come anchor industry                                       | pending S35.2-3    |
| TALPIPE   | succession_pipeline vuoto (0 rows), career_paths sparse                        | pending S35.3      |
| H2R       | recruiting\_\* esistente sparse                                                | pending S35.3      |
| SKILGRO   | course_enrollments sparse, esco_skills 14k catalog                             | pending S35.3      |
| GOKMER    | performance_reviews ~270, KPI defs 0-5                                         | pending S35.3      |
| PROGOV    | business_processes ~40 (banking+food), audit_logs sparse                       | pending S35.3      |
| ESKAP     | catalog completo, kg_nodes/edges 0 (vuoto)                                     | pending S35.5      |
| **ITLAB** | **completo S35.1** (22 sindacati + 4 CCNL links + 12 RSU + 9 CCNL_COMM levels) | active             |
| RBP       | 8 ruoli × 34 aree × 179 perm canonical                                         | active             |
| DGOV      | 367 RLS policies attive, lint:tenant-id + audited tx                           | active             |
| SMERTO    | salary_bands sparse                                                            | pending S35.3      |
| PULSAR    | engagement_surveys vuoto                                                       | pending S35.3      |
| EPRA      | turnover_risk_scores vuoto                                                     | pending S35.3      |
| CASCADIA  | orchestrator skeleton                                                          | pending S35.2      |
