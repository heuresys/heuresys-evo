# `heuresys_platform` — Data Dictionary export

> **Source**: heuresys_platform@oracle-vm-default:5432 · PostgreSQL 16.13
> **Generated**: 2026-05-15T15:56:43.968Z
> **Scope**: solo tabelle business · esclusioni in [`exclusions.md`](./exclusions.md)

## Cos'è questo bundle

Documento granulare ed esaustivo dello schema DBMS `heuresys_platform` (piattaforma SaaS B2B Organizational Intelligence & Workforce Orchestration · stack Next.js + Prisma + PostgreSQL multi-tenant). Destinato a un agente esterno che ha generato un proprio DBMS PostgreSQL e deve capire **cosa importare** e **come è strutturato** il nostro DB.

## Stats

- **Tabelle catalogate**: 576 (su 582 totali, 7 escluse)
- **Tenant-scoped**: 335 tabelle con colonna `tenant_id`
- **Foreign keys**: 950
- **RLS policies attive**: 376
- **Views**: 110 · **Materialized views**: 6
- **Domini lexicon**: 16 sigle canonical + uncategorized

## Struttura del bundle

```
db-export/
├── README.md            ← questo file
├── catalog.json         ← catalogo machine-readable (tables/views/matviews + meta)
├── schema.sql           ← DDL filtered (pg_dump --schema-only · esclusioni applicate)
├── schema-raw.sql       ← DDL completo (reference, include escluse)
├── exclusions.md        ← tabelle escluse + motivazione
├── views.md             ← definizioni SQL di tutte le view + matview
└── domains/             ← markdown per dominio (16 sigle + index + uncategorized)
    ├── 00-index.md
    ├── 01-opourska.md
    ├── 02-pet.md
    ├── ...
    ├── 16-cascadia.md
    └── 99-uncategorized.md
```

## Domini lexicon (16 sigle canonical)

Vocabolario controllato di acronimi per le catene relazionali della piattaforma. Ogni tabella business è mappata a 1+ sigle.

| #   | Sigla        | Full                                                                   | Tables | Doc                                                  |
| --- | ------------ | ---------------------------------------------------------------------- | ------ | ---------------------------------------------------- |
| 1   | **OPOURSKA** | Organization-Process-OrgUnit-Role-Skill-KPI-Assessment                 | 41     | [`domains/01-opourska.md`](./domains/01-opourska.md) |
| 2   | **PET**      | Process / Enterprise / Talent                                          | 2      | [`domains/02-pet.md`](./domains/02-pet.md)           |
| 3   | **INDOOR**   | Industry-NACE-Domain-Org-OrgUnit-Roles                                 | 13     | [`domains/03-indoor.md`](./domains/03-indoor.md)     |
| 4   | **TALPIPE**  | Talent Pipeline (Career-Succession-9Box-TalentPool-Mobility-Promotion) | 28     | [`domains/04-talpipe.md`](./domains/04-talpipe.md)   |
| 5   | **H2R**      | Hire-to-Retire                                                         | 80     | [`domains/05-h2r.md`](./domains/05-h2r.md)           |
| 6   | **SKILGRO**  | Skill-Knowledge-Inventory-Learning-GROwth                              | 45     | [`domains/06-skilgro.md`](./domains/06-skilgro.md)   |
| 7   | **GOKMER**   | Goal-Objective-KPI-Measurement-Evaluation-Review                       | 40     | [`domains/07-gokmer.md`](./domains/07-gokmer.md)     |
| 8   | **PROGOV**   | Process Governance (Workflow-Approval-Audit-Compliance)                | 16     | [`domains/08-progov.md`](./domains/08-progov.md)     |
| 9   | **ESKAP**    | ESCO + Knowledge graph Application Projection                          | 31     | [`domains/09-eskap.md`](./domains/09-eskap.md)       |
| 10  | **ITLAB**    | Italian Labor (CCNL-INPS-Sindacati-Holidays IT)                        | 10     | [`domains/10-itlab.md`](./domains/10-itlab.md)       |
| 11  | **RBP**      | Role-Based Permissions matrix                                          | 32     | [`domains/11-rbp.md`](./domains/11-rbp.md)           |
| 12  | **DGOV**     | Data Governance (Multi-tenant + RLS + Audit + GDPR)                    | 188    | [`domains/12-dgov.md`](./domains/12-dgov.md)         |
| 13  | **SMERTO**   | Salary-Merit-Equity-Reward-TOtal                                       | 16     | [`domains/13-smerto.md`](./domains/13-smerto.md)     |
| 14  | **PULSAR**   | PUlse-LinkedScore-Action-Retention                                     | 29     | [`domains/14-pulsar.md`](./domains/14-pulsar.md)     |
| 15  | **EPRA**     | Embedding-Prediction-Recommendation-Action                             | 19     | [`domains/15-epra.md`](./domains/15-epra.md)         |
| 16  | **CASCADIA** | Catena seeding realistic end-to-end                                    | 0      | [`domains/16-cascadia.md`](./domains/16-cascadia.md) |

## Architettura multi-tenant + RLS

La piattaforma è **multi-tenant** con 4 tenant: Heuresys System (platform) · RTL Bank · SmartFood · EcoNova. Pattern enforced:

- Ogni tabella tenant-scoped ha colonna `tenant_id uuid NOT NULL REFERENCES tenants(id)`
- **Row-Level Security (RLS) attiva DB-level** su tabelle tenant-scoped via policy:
  ```sql
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid)
  ```
- Pattern app-side: `withTenant()` wrapper esegue `SET LOCAL app.current_tenant_id = ...` prima di ogni query Prisma
- Bypass solo per ruolo SUPERUSER via `BYPASSRLS` o `set_config` esplicito

Se il DBMS target **non implementa RLS**, applicare il filtering a livello applicativo: ogni SELECT/INSERT/UPDATE/DELETE deve includere `tenant_id = ?` nella WHERE.

## RBP — Role-Based Permissions

- **8 ruoli canonical**: SUPERUSER · TENANT_OWNER · IT_ADMIN · HR_DIRECTOR · HR_MANAGER · DEPT_HEAD · LINE_MANAGER · EMPLOYEE
- **34 functional areas** × **3 perspectives** (PET: Process / Enterprise / Talent)
- Permessi data-driven via `rbp_role_permissions` (179 canonical join)

Vedi [`domains/11-rbp.md`](./domains/11-rbp.md) per dettaglio.

## How-to-use per agente target

### Discovery programmatica

Parsa `catalog.json` per ottenere struttura completa machine-readable:

```js
const catalog = JSON.parse(fs.readFileSync('db-export/catalog.json'));
// catalog.tables['employees'].columns → array di {name, type, nullable, default, ...}
// catalog.tables['employees'].foreign_keys → array di {columns, ref_table, on_delete, ...}
// catalog.tables['employees'].rls_policies → array di policy DBMS-level
// catalog.tables['employees'].domains → ['OPOURSKA', 'H2R']
```

### DDL replay (sub-set)

`schema.sql` contiene `pg_dump --schema-only` con esclusioni applicate. È SQL valido PostgreSQL 16 (compatibilità ≥14 testata su feature core). Per replay:

```bash
psql -d <target_db> < schema.sql
```

Dipendenze: estensioni `uuid-ossp`, `pgcrypto`, `vector` (pgvector). Pre-create con `CREATE EXTENSION IF NOT EXISTS ...`.

### Workflow consigliato

1. Leggi `README.md` per overview + glossario domini
2. Consulta `domains/00-index.md` per mapping sigla → tabelle
3. Per ogni dominio rilevante, leggi `domains/<NN>-<sigla>.md` (semantica + relazioni)
4. Genera mapping cross-DB partendo da `catalog.json` (programmaticamente)
5. Eventuale replay DDL: `schema.sql`, poi importa dati via COPY/INSERT da export riga-per-riga (NON incluso in questo bundle)
6. Le `views.md` sono **derivate**: non importare, ricreare dopo che le tabelle sorgente sono popolate

### Tabelle escluse

7 tabelle escluse: vedi [`exclusions.md`](./exclusions.md). Le FK che referenziavano tabelle escluse sono mantenute in `catalog.json` con flag `ref_excluded: true`. Tipico: `users → account` (NextAuth) — l'agente target può ridichiararle nel proprio modello auth.

## PostgreSQL types cheat sheet

Tipi più frequenti incontrati:

| PostgreSQL (udt_name)          | Note                                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `uuid`                         | Surrogate key default. Default `uuid_generate_v4()` (estensione `uuid-ossp`).                                                             |
| `varchar` / `text`             | Stringhe. `varchar(N)` con limite, `text` illimitato.                                                                                     |
| `int4` / `int8`                | Integer 32/64-bit.                                                                                                                        |
| `numeric(P,S)`                 | Decimale arbitrary precision (es. salari `numeric(15,2)`).                                                                                |
| `bool`                         | Boolean.                                                                                                                                  |
| `timestamp` / `timestamptz`    | Timestamp senza/con timezone. Default `now()`.                                                                                            |
| `date`                         | Solo data.                                                                                                                                |
| `jsonb`                        | JSON binary indicizzabile (preferito su `json`).                                                                                          |
| `_text` / `_varchar` / `_uuid` | Array (prefix `_`).                                                                                                                       |
| `vector`                       | pgvector embedding (es. `vector(1536)` per OpenAI ada-002).                                                                               |
| ENUM types                     | `career_skill_importance`, `company_size`, `crud_operation`, `permission_scope`, `rbac_role`, ... definiti in `schema.sql` `CREATE TYPE`. |

## Generation provenance

- Generato via `db-export/generate.mjs` (Node 20 ESM, 772 righe)
- Source SQL dump: `pg_dump --schema-only --no-owner --no-privileges --schema=public heuresys_platform` via SSH `oracle-vm-default`
- Metadata: 9 query JSON su `information_schema` + `pg_catalog` + `pg_views` + `pg_matviews` + `pg_policies`
- Enrichment: Prisma schema (`services/app/prisma/schema.prisma`, 576 model mappati) + lexicon canonical (`docs/_meta/lexicon.md`, 16 sigle)
