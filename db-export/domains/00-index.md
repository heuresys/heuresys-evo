# Indice domini lexicon

> Mapping sigla → tabelle. 16 sigle canonical + 1 sezione `uncategorized` per residue.

| #   | Sigla           | Full                                                                   | Tables | File                                           |
| --- | --------------- | ---------------------------------------------------------------------- | ------ | ---------------------------------------------- |
| 1   | **OPOURSKA**    | Organization-Process-OrgUnit-Role-Skill-KPI-Assessment                 | 41     | [`01-opourska.md`](./01-opourska.md)           |
| 2   | **PET**         | Process / Enterprise / Talent                                          | 2      | [`02-pet.md`](./02-pet.md)                     |
| 3   | **INDOOR**      | Industry-NACE-Domain-Org-OrgUnit-Roles                                 | 13     | [`03-indoor.md`](./03-indoor.md)               |
| 4   | **TALPIPE**     | Talent Pipeline (Career-Succession-9Box-TalentPool-Mobility-Promotion) | 28     | [`04-talpipe.md`](./04-talpipe.md)             |
| 5   | **H2R**         | Hire-to-Retire                                                         | 80     | [`05-h2r.md`](./05-h2r.md)                     |
| 6   | **SKILGRO**     | Skill-Knowledge-Inventory-Learning-GROwth                              | 45     | [`06-skilgro.md`](./06-skilgro.md)             |
| 7   | **GOKMER**      | Goal-Objective-KPI-Measurement-Evaluation-Review                       | 40     | [`07-gokmer.md`](./07-gokmer.md)               |
| 8   | **PROGOV**      | Process Governance (Workflow-Approval-Audit-Compliance)                | 16     | [`08-progov.md`](./08-progov.md)               |
| 9   | **ESKAP**       | ESCO + Knowledge graph Application Projection                          | 31     | [`09-eskap.md`](./09-eskap.md)                 |
| 10  | **ITLAB**       | Italian Labor (CCNL-INPS-Sindacati-Holidays IT)                        | 10     | [`10-itlab.md`](./10-itlab.md)                 |
| 11  | **RBP**         | Role-Based Permissions matrix                                          | 32     | [`11-rbp.md`](./11-rbp.md)                     |
| 12  | **DGOV**        | Data Governance (Multi-tenant + RLS + Audit + GDPR)                    | 188    | [`12-dgov.md`](./12-dgov.md)                   |
| 13  | **SMERTO**      | Salary-Merit-Equity-Reward-TOtal                                       | 16     | [`13-smerto.md`](./13-smerto.md)               |
| 14  | **PULSAR**      | PUlse-LinkedScore-Action-Retention                                     | 29     | [`14-pulsar.md`](./14-pulsar.md)               |
| 15  | **EPRA**        | Embedding-Prediction-Recommendation-Action                             | 19     | [`15-epra.md`](./15-epra.md)                   |
| 16  | **CASCADIA**    | Catena seeding realistic end-to-end                                    | 0      | [`16-cascadia.md`](./16-cascadia.md)           |
| —   | _Uncategorized_ | tabelle non mappate dal lexicon                                        | 0      | [`99-uncategorized.md`](./99-uncategorized.md) |

## Tabelle multi-domain (≥2 sigle)

| Tabella                   | Domains           |
| ------------------------- | ----------------- |
| `business_processes`      | OPOURSKA · PROGOV |
| `esco_skills`             | OPOURSKA · ESKAP  |
| `import_skill_links`      | SKILGRO · DGOV    |
| `industry_ccnl_mapping`   | INDOOR · ITLAB    |
| `performance_predictions` | GOKMER · EPRA     |
| `performance_reviews`     | OPOURSKA · GOKMER |
| `plugin_api_keys`         | RBP · DGOV        |
| `rbp_functional_areas`    | PET · RBP         |
| `rbp_perspectives`        | PET · RBP         |
| `rbp_roles`               | OPOURSKA · RBP    |
| `role_default_dashboards` | OPOURSKA · RBP    |
| `skill_adjacencies`       | SKILGRO · ESKAP   |
| `tenant_sap_mapping`      | OPOURSKA · DGOV   |
| `tenant_schema_version`   | OPOURSKA · DGOV   |
