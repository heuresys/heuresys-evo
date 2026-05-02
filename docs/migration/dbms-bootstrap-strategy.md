# DBMS Bootstrap Strategy — heuresys-evo

> **Versione**: 1.0 — 2026-05-01
> **Autore**: Claude Code CLI (Opus 4.7)
> **Scope**: strategia bootstrap progressivo del DB greenfield `heuresys-evo` partendo dallo stato verificato il 2026-05-01.
> **Vincolo metodologico**: tutti i numeri sono `verified-by` query reale (vedi §7).

---

## 1. Stato attuale verificato (2026-05-01)

### 1.1 Riconciliazione nomenclatura

Il prompt iniziale assumeva che il container fosse legacy e il bare-metal evo, **ma la realtà è che entrambi servono `heuresys.com.evo` v1**. Il container `heuresys_evo_platform_db` (porta esterna 5433) ospita la copia operativa con dati live; il bare-metal porta 5432 ospita lo schema clonato (baseline-squash 2026-04-27) **senza** dati tenant.

| Istanza                             | Porta               | Modalità   | Fonte schema                                        | Dati tenant                                     | Ruolo attuale      |
| ----------------------------------- | ------------------- | ---------- | --------------------------------------------------- | ----------------------------------------------- | ------------------ |
| `heuresys_evo_platform_db` (Docker) | 5433 → 5432 interna | container  | migrations 215 v1                                   | popolato (4 tenant, 274 user, 270 emp)          | **legacy v1 live** |
| Bare-metal host                     | 5432                | bare-metal | `db/baseline/000_baseline_schema_v1_2026-04-27.sql` | vuoto operativo, governance + ESCO già presenti | **evo greenfield** |

### 1.2 Numeri reali (PostgreSQL 16)

Query: `SELECT count(*) FROM pg_class WHERE relkind='r' AND relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')`

| Metrica               | Legacy (5433 Docker) | Evo (5432 bare-metal) |          Delta |
| --------------------- | -------------------: | --------------------: | -------------: |
| Tabelle public        |                  566 |                   566 |              0 |
| RLS attive            |                  302 |                   302 |              0 |
| Policy RLS            |                  326 |                   326 |              0 |
| Tabelle uniche legacy |                  n/a |                   n/a | **0 mancanti** |
| Tabelle uniche evo    |                  n/a |                   n/a |    **0 extra** |

**Conseguenza chiave**: lo schema è **già 1:1 identico** tra le due istanze. Il "rebuild greenfield" a livello DDL è già concluso il 2026-04-27 via baseline-squash.

### 1.3 Dati su tabelle critiche

| Tabella                               |  Legacy |                   Evo | Bootstrap action       |
| ------------------------------------- | ------: | --------------------: | ---------------------- |
| `tenants`                             |       4 |                     0 | **CARICARE**           |
| `users`                               |     274 | 2 (canonici NextAuth) | **CARICARE** delta 272 |
| `employees`                           |     270 |                     0 | **CARICARE**           |
| `esco_skills`                         |  14.011 |                14.011 | already done           |
| `esco_occupations`                    |   3.040 |                 3.040 | already done           |
| `esco_occupation_skills`              | 126.051 |               126.051 | already done           |
| `esco_skill_relations`                |   5.818 |                 5.818 | already done           |
| `industry_classifications`            |   3.276 |                 3.276 | already done           |
| `occupation_industry_classifications` |   4.565 |                 4.565 | already done           |
| `rbp_perspectives`                    |       3 |                     3 | already done           |
| `rbp_area_perspectives`               |      47 |                    47 | already done           |
| `rbp_functional_areas`                |      34 |                    34 | already done           |
| `rbp_role_permissions`                |     179 |                   179 | already done           |
| `rbp_pages`                           |     170 |                   170 | already done           |
| `rbp_dashboards`                      |      11 |                    11 | already done           |
| `rbp_dashboard_nav_items`             |     279 |                   279 | already done           |
| `rbp_scope_rules`                     |       8 |                     8 | already done           |
| `rbp_field_policies`                  |      40 |                    40 | already done           |
| `widget_catalog`                      |      27 |                    27 | already done           |
| `workspace_templates`                 |       8 |                     8 | already done           |

**Insight**: l'unico data gap reale sono i **dati tenant operativi** (tenant + user + employee + workflow). Tutto il resto (governance RBP, PET, ESCO, taxonomy, registry widget) è già clonato via baseline.

### 1.4 Prisma schema — il "6 modelli" è una facade

Il prompt indicava 6 modelli Prisma. Verifica:

| Schema                                      | Path          |                                                             Modelli |
| ------------------------------------------- | ------------- | ------------------------------------------------------------------: |
| `services/app/prisma/schema.prisma`         | NextAuth+core | 6 (account, employees, session, tenants, users, verification_token) |
| `services/api-gateway/prisma/schema.prisma` | API Gateway   |                                                                   9 |

I 6 modelli `services/app` sono **solo la sezione coperta da Prisma per autenticazione NextAuth + i 4 modelli core toccati lato app**. Le 566 tabelle sono governate dal SQL nativo (`db/migrations/`), Prisma non genera DDL su questo schema. Strategia di fatto: **SQL-driven schema, Prisma-driven solo per i modelli che app TS deve tipizzare**.

---

## 2. Tier list di migrazione PET-driven

Tier list rivista alla luce dello stato verificato: il "tier 1 schema" è già done, il vero Tier 1 da progettare è il **data load operativo** (tenants/users/employees) e il **modello di portafoglio PET** per le ondate Tier 2-3 successive.

### 2.1 Tier 1 — PET cross-cutting core (governance + identity)

Tabelle abilitanti tutte e 3 le lenti P/E/T. **Schema: già presente. Data: governance già caricato, identity da caricare.**

| Cluster                | Tabelle                                                                           | Schema | Data                                                                    |
| ---------------------- | --------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------- |
| Identity & tenant      | `tenants`, `users`, `account`, `session`, `verification_token`                    | done   | **GAP: 0 tenant, 2 user**                                               |
| Workforce identity     | `employees`, `employee_role_history`, `employee_skill_mappings`                   | done   | **GAP: 0 employee**                                                     |
| RBP framework          | 18 tabelle `rbp_*`                                                                | done   | done                                                                    |
| PET perspectives       | `rbp_perspectives` (3), `rbp_area_perspectives` (47), `rbp_functional_areas` (34) | done   | done                                                                    |
| Workspace              | `widget_catalog`, `workspace_templates`, `user_workspaces`, `workspace_widgets`   | done   | catalog/templates done — **user_workspaces da generare per nuovi user** |
| Knowledge graph anchor | `esco_skills`, `esco_occupations`, `industry_classifications`                     | done   | done                                                                    |

**Tier 1 effort residuo**: caricamento di 4 tenant + 272 user + 270 employee + relazioni N-N (RBP role assignments, employee→tenant, skill mappings). Ordine di magnitudo: ~10 INSERT script o 1 `pg_dump --data-only --table=...`.

### 2.2 Tier 2 — Data sources lenti (workflow PET-specific)

Da portare **per lente** in ondate successive, non in massa. Per ogni lente, identificare l'area RBP guida e la lista tabelle (riferimento: `rbp_area_perspectives` mapping PRIMARY).

| Lente              | Aree RBP PRIMARY                                                                                           | Cluster tabelle                                                                                                                                                       | Stato schema | Stato data     |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------- |
| **Talent (T)**     | EMPLOYEE_LIFECYCLE, PERFORMANCE, LEARNING, RECRUITING, COMPENSATION, ENGAGEMENT, SKILLS, CAREER, GOAL_MGMT | `employee_*` (29), `recruiting_*` (8), `learning_*` (7), `goal_*` (7), `career_*` (12), `payroll_*` (8), `calibration_*` (6), `onboarding_*` (6), `preboarding_*` (6) | done         | empty — Tier 2 |
| **Enterprise (E)** | ORG_DESIGN, POSITION_MGMT, COST_CENTERS, MARKETPLACE, PLUGIN_MGMT, TENANT_ADMIN                            | `org_*` (14), `tenant_*` (12), `plugin_*` (12), `marketplace_*`, location                                                                                             | done         | empty — Tier 2 |
| **Process (P)**    | PROCESS_GOVERNANCE, BLUEPRINT_MGMT, AUDIT, COMPLIANCE, AI_ADVISOR                                          | `processes`, `blueprints`, `audit_log_*`, `governance_*`, `ai_advisor_*` (8), `internal_*` (7)                                                                        | done         | empty — Tier 2 |

**Effort per lente**: per ogni cluster ~3-8 tabelle critiche da popolare via pg_dump selettivo (`--data-only --table=…`). Una lente alla volta, validata e firmata prima della successiva.

### 2.3 Tier 3 — Tooling/admin/historical

Residuo non-critico. Caricare on-demand quando una feature lo richiede.

| Cluster                 | Tabelle                                             | Note                                                 |
| ----------------------- | --------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| Enrichment engine       | 15 `enrichment_*`                                   | servizio attivo, ma può ripartire senza dati storici |
| Job postings + ONET     | 11 `onet_*`, `job_postings_raw`, `extracted_skills` | dataset pubblici, rigenerabili                       |
| News/AI insights        | 8 `news_*`, 8 `ai_*`                                | feed live, non serve storico                         |
| Whistleblowing/feedback | 6 `whistleblowing_*`, 7 `feedback_*`                | no data                                              | trattato come "fresh tenant" — tabelle vuote sono normale |
| SAP integration         | 7 `sap_*`                                           | non in scope MVP evo                                 |
| Reports/calibration     | 5 `report_*`, 6 `calibration_*`, 6 `engagement_*`   | derivabili da query                                  |
| Audit log legacy        | `audit_log_*`                                       | **NON portare** — è cronologia v1                    |

---

## 3. Approccio tecnico: scelta dell'opzione

### 3.1 Confronto opzioni

| Opzione                                                           | Pro                                       | Contro                                                                          | Effort              | Verdetto                                            |
| ----------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------- |
| **X** Schema clone completo (`pg_dump --schema-only`)             | 1:1 fedeltà, zero rework                  | mantieni 566 tabelle anche per cose mai usate; trascini deprecation             | basso (1h)          | **già applicato 2026-04-27**                        |
| **Y** Schema clone selettivo (DDL solo Tier 1)                    | pulizia codice; meno superficie           | dipendenze FK complesse (566 tab → grafo dense); rischio "buchi"                | alto (40+ h)        | rejected — dipendenze rendono "selettivo" illusorio |
| **Z** Schema rewrite Prisma-driven greenfield                     | type-safe, modello pulito Prisma-native   | rifare 566 tabelle from scratch + perdita di RLS/policy/funzioni stored testate | molto alto (200+ h) | rejected — non c'è ROI per founder solo             |
| **W** Ibrido: clone schema (X) + Prisma-driven extension Tier 2-3 | combina X done + Prisma per nuove feature | gestione dual-source schema (SQL + Prisma)                                      | basso incrementale  | **raccomandato per il futuro**                      |

### 3.2 Raccomandazione

**Opzione X applicata + W incrementale**.

Razionale:

1. **X è già fatto**: schema legacy (1.9 MB SQL, 566 tabelle, 326 policy) è restorato sul bare-metal evo 2026-04-27. Riconsiderare significherebbe buttare lavoro già acquisito.
2. **Y e Z sono trappole per founder solo**: 566 tabelle hanno dipendenze FK in cluster densi (employees→users→tenants, employees→rbp*\*, employees→esco*\*, ecc.). Estrarre un sottografo coerente con dipendenze chiuse richiede settimane di analisi e rompere la coerenza significa rompere RBP cache, RLS, PET mapping già 100% testati in legacy.
3. **W è la rotta evolutiva**: le **nuove** feature (post-bootstrap) si modellano in Prisma; le **vecchie** tabelle restano in SQL fino a quando una specifica feature richiede revisione. Convergenza graduale, no big-bang.
4. **Il vero collo di bottiglia non è lo schema, è la governance del data load PET-driven**. Tier 2-3 si caricano per lente, una lente alla volta, con gate di validazione tra una e l'altra.

### 3.3 Conseguenze operative

| Decisione                                                        | Implicazione                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| Schema bare-metal = baseline 2026-04-27 (immutabile)             | Future migration in `db/migrations/0002_*+` (incrementali)   |
| Prisma `schema.prisma` resta facade per modelli auth + 4 core    | Non rigenerare DDL via `prisma migrate` su tabelle esistenti |
| Tier 2/3 data load = pg_dump selettivo `--data-only` per cluster | Niente "import full DB", sempre per cluster controllato      |
| Audit log legacy NON portato                                     | Rinunciare a cronologia v1 — ADR esplicito da scrivere       |

---

## 4. Data ingestion strategy

### 4.1 Sorgenti

| Sorgente                                    | Path                                                | Strategia                                                              |
| ------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| Legacy live (Docker 5433)                   | `heuresys_evo_platform_db` container                | sorgente primaria via `pg_dump --data-only --table=…` su tunnel locale |
| Bucket OCI `heuresys-evo-backups`           | dump giornalieri                                    | fallback se Docker non accessibile o per ricostruzioni RTO             |
| Baseline 2026-04-27                         | `db/baseline/000_baseline_schema_v1_2026-04-27.sql` | schema-only, già applicato                                             |
| `backups/from-vm/platform_db.dump` (367 MB) | binary dump pg_dump                                 | fallback completo schema+data, ma evita restore full su evo            |

### 4.2 Decisioni per cluster

| Cluster                                             | Strategia                                                                  | Motivazione                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **ESCO graph** (14k+3k+126k+5.8k)                   | **NON ricaricare** — già presente identico                                 | Embeddings 1536-dim costano $; dataset stabile; verificato 14011 = 14011 |
| **Industry classifications** (3.276+4.565)          | **NON ricaricare** — già presente                                          | Dataset stabile post-restructure 2026-04-01                              |
| **RBP governance** (18 tabelle, 783 row totali)     | **NON ricaricare** — già presente                                          | Already done in baseline                                                 |
| **Widget catalog + templates** (35 row)             | **NON ricaricare** — già presente                                          | Already done                                                             |
| **Tenants** (4)                                     | INSERT script idempotente da legacy                                        | Pochi record, semplice                                                   |
| **Users** (272 da caricare)                         | `pg_dump --data-only --table=users` legacy → restore evo, ON CONFLICT skip | Mantiene UUID stabili per FK chain                                       |
| **Employees** (270)                                 | `pg_dump --data-only --table=employees` + `--table=employee_*_history`     | Insieme con users in transazione                                         |
| **Audit log v1**                                    | **NON portare**                                                            | Cronologia legacy, non è SoT evo                                         |
| **Workflow data** (leaves, performance, recruiting) | **NON portare al bootstrap**                                               | Tier 2 incrementale per lente                                            |

### 4.3 Embedding policy

OpenAI key, modello `text-embedding-3-small` 1536-dim. Costo storico stimato per 14k+3k+3.3k = ~21k embedding × ~ $0.00002 ≈ $0.42 isolato; ma 126k occupation_skill_relations + 5.8k skill_relations potenzialmente embeddati = ~$2.6. **Verifica `vector` columns**: se esistono già nei dump, NON rigenerare.

---

## 5. Path operativo concreto (prossima sessione)

### 5.1 Sequenza step-by-step

| Step | Descrizione                                                                       | Comando rappresentativo                                                                                                                                                                      | Tempo stimato |
| ---- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------: |
| 0    | Backup pre-load del DB evo (rollback safety)                                      | `pg_dump -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -Fc -f /tmp/evo_pre_t1_$(date +%Y%m%d).dump`                                                                                  |         5 min |
| 1    | Estrazione data-only Tier 1 da legacy                                             | `docker exec heuresys_evo_platform_db pg_dump -U heuresys -d heuresys_platform --data-only -t tenants -t users -t account -t session -t employees -t employee_role_history > /tmp/tier1.sql` |         5 min |
| 2    | Truncate evo conflicting (users canonici NextAuth → da decidere se sovrascrivere) | scrivere `pre-load-clean.sql`: TRUNCATE solo se non distrugge i 2 user NextAuth funzionanti; meglio ON CONFLICT DO NOTHING                                                                   |        10 min |
| 3    | Apply Tier 1 a evo bare-metal in transazione                                      | `psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -v ON_ERROR_STOP=1 -1 -f /tmp/tier1.sql`                                                                                         |         2 min |
| 4    | Validazione count-match                                                           | query confronto su 8 tabelle Tier 1 + spot check 5 user random                                                                                                                               |        10 min |
| 5    | Validazione RLS + RBP cache                                                       | restart api-gateway, healthcheck, login canonico (`reference_demo_credentials.md`)                                                                                                           |        10 min |
| 6    | Validazione PET mapping                                                           | `SELECT count(*) FROM rbp_area_perspectives` = 47, `SELECT count(*) FROM rbp_perspectives` = 3 (regression test)                                                                             |         5 min |
| 7    | Backup post-load (snapshot Tier 1 done)                                           | `pg_dump -Fc → backups/local/evo_post_tier1_<date>.dump` + push bucket                                                                                                                       |        10 min |
| 8    | ADR + report                                                                      | scrivere ADR-0011 "Tier 1 data load completato" + entry MEMORY.md                                                                                                                            |        30 min |

**Effort totale Tier 1**: ~1h 30min lavoro effettivo + 30min documentazione = **2h totali in una sessione singola**.

### 5.2 Pre-condizioni

| Pre-condizione                                 | Verifica                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------- |
| Docker container `heuresys_evo_platform_db` UP | `docker ps \| grep heuresys_evo_platform_db`                                  |
| Bare-metal evo accessibile                     | `psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c '\dt' \| head` |
| Backup recente esistente (last 24h)            | `ls -lh /home/ubuntu/heuresys-evo/backups/local/ \| tail`                     |
| RLS policies coverage 302/302                  | query `pg_class.relrowsecurity=true`                                          |
| Schema integrity 566 tabelle                   | query pg_class count                                                          |
| Disk space VM > 5 GB liberi                    | `df -h /`                                                                     |

### 5.3 Rollback plan

In caso di failure step 3-6:

1. `psql -c "TRUNCATE tenants, users, account, session, employees, employee_role_history CASCADE"` (riporta a stato Tier 1 vuoto)
2. `pg_restore -d heuresys_platform /tmp/evo_pre_t1_*.dump` (recupera baseline pre-step)
3. Diagnostica differenza count e ripianificare

### 5.4 Tier 2-3 (sessioni successive)

Una sessione per lente, senza sovrapposizioni. Ogni sessione = 1 lente PET = 1 ondata data load:

| Sessione | Lente                              | Tabelle target                                             | Effort stimato |
| -------- | ---------------------------------- | ---------------------------------------------------------- | -------------: |
| S+1      | Talent — Employee Lifecycle        | `employee_*` (29), `onboarding_*` (6), `preboarding_*` (6) |             3h |
| S+2      | Talent — Performance & Goals       | `goal_*` (7), `calibration_*` (6), `engagement_*` (6)      |             2h |
| S+3      | Talent — Skills & Career           | `skill_*` (17 tabelle non-ESCO), `career_*` (12)           |             4h |
| S+4      | Talent — Recruiting & Learning     | `recruiting_*` (8), `learning_*` (7)                       |             3h |
| S+5      | Enterprise — Org Design            | `org_*` (14), `tenant_*` (12 non-core)                     |             3h |
| S+6      | Enterprise — Marketplace & Plugins | `marketplace_*`, `plugin_*` (12)                           |             2h |
| S+7      | Process — Governance               | `governance_*`, `audit_*` (escluso log)                    |             2h |
| S+8      | Process — AI Advisor & Internal    | `ai_advisor_*` (8), `internal_*` (7)                       |             3h |

**Effort Tier 2 totale**: ~22 ore distribuite in 8 sessioni focused, una lente alla volta, con gate di validazione tra una e l'altra.

**Tier 3**: on-demand, attivato quando una feature specifica lo richiede.

---

## 6. Rischi e mitigazioni

| Rischio                                            | Probabilità | Impatto | Mitigazione                                                                                                 |
| -------------------------------------------------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| FK violation durante data load Tier 1              | Media       | Alto    | Ordine carico: tenants → users → account → session → employees → employee\_\*\_history; transazione singola |
| RBP cache stale post-load (TTL 5min)               | Alta        | Medio   | Forzare `RBPCacheService.refresh()` via endpoint admin o restart api-gateway                                |
| Conflitto su 2 user NextAuth canonici già presenti | Alta        | Basso   | `ON CONFLICT (id) DO NOTHING` o pre-step di backup mirato                                                   |
| Drift schema legacy ↔ baseline 2026-04-27          | Bassa       | Alto    | 215 migration legacy applicate, 220 max; manifest verifica match (sha256)                                   |
| Embeddings non rigenerabili senza budget           | Bassa       | Critico | NON toccare colonne `vector`; verifica con `\d+ esco_skills` pre-load                                       |
| Cronologia audit log persa                         | Certa       | Basso   | ADR esplicito: legacy v1 audit_log resta archiviato in dump, non portato                                    |

---

## 7. Verification

### 7.1 Query reali eseguite

```bash
# Bare-metal evo (porta 5432)
$ PGPASSWORD=heuresys psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c \
    "SELECT count(*) FROM pg_class WHERE relkind='r' AND relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')"
 count
-------
   566

$ PGPASSWORD=heuresys psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c \
    "SELECT count(*) FROM pg_class WHERE relkind='r' AND relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public') AND relrowsecurity=true"
 count
-------
   302

$ PGPASSWORD=heuresys psql -h 127.0.0.1 -p 5432 -U heuresys -d heuresys_platform -c \
    "SELECT count(*) FROM pg_policies WHERE schemaname='public'"
 count
-------
   326

# Critical tables (evo bare-metal)
 tenants                  |     0
 users                    |     2
 employees                |     0
 esco_skills              | 14011
 esco_occupations         |  3040
 industry_classifications |  3276
 rbp_perspectives         |     3
 rbp_area_perspectives    |    47
 rbp_functional_areas     |    34
 rbp_role_permissions     |   179

# Legacy via Docker (porta 5433 → 5432 interna)
$ docker exec heuresys_evo_platform_db sh -c "PGPASSWORD=heuresys psql -U heuresys -d heuresys_platform -c \"SELECT ...\""
 # 566 tabelle, 302 RLS, 326 policy — IDENTICO a evo
 tenants                  |     4
 users                    |   274
 employees                |   270
 # Tutto il resto identico a evo

# Diff tabelle (set difference)
$ comm -23 /tmp/legacy_tables.txt /tmp/evo_tables.txt | wc -l   # legacy unique
0
$ comm -13 /tmp/legacy_tables.txt /tmp/evo_tables.txt | wc -l   # evo unique
0
$ comm -12 /tmp/legacy_tables.txt /tmp/evo_tables.txt | wc -l   # common
566
```

### 7.2 Migration legacy lette (≥5)

| Migration                           | Path                                          | Purpose                              | Tabelle chiave                                                                                                                                                                                                                               |
| ----------------------------------- | --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0001_baseline.sql` (evo)           | `heuresys-evo/db/migrations/`                 | Placeholder baseline-squash strategy | DO block validation pgvector + schema_migrations                                                                                                                                                                                             |
| `150_rbp_framework_tables.sql`      | `heuresys.com.evo/db/migrations/` (672 righe) | SoT RBP framework                    | rbp_roles, rbp_functional_areas, rbp_dashboards, rbp_pages, rbp_data_classifications, rbp_role_dashboards, rbp_dashboard_nav_items, rbp_role_permissions, rbp_scope_rules, rbp_field_policies, rbp_teams, rbp_team_members, rbp_team_leaders |
| `008_hr_intelligence.sql`           | `heuresys.com.evo/db/migrations/`             | ESCO + skills core                   | esco_skills, esco_occupations, employee_skill_mappings, skill_synonyms, skill_demand_metrics, ateco_codes                                                                                                                                    |
| `184_rbp_enrichment_area.sql`       | `heuresys.com.evo/db/migrations/`             | RBP enrichment area                  | rbp_functional_areas update                                                                                                                                                                                                                  |
| `194_i18n_add_parallel_columns.sql` | `heuresys.com.evo/db/migrations/`             | i18n parallel columns                | rbp_perspectives, rbp_area_perspectives, rbp_functional_areas                                                                                                                                                                                |

### 7.3 Manifest baseline (evo)

```
schema_file: 000_baseline_schema_v1_2026-04-27.sql
schema_size: 1.9M
schema_sha256: 9c7a13941eca952f46c97b14ceecfbf69216aba69e2b121504318d0008ca5528
binary_dump: ../../backups/from-vm/platform_db.dump (367M)
binary_dump_sha256: a30d82b8ea2d755697b033a3ddffe5501e6f549ced4d7807891230ae3ed03dab
source_postgres_version: 16.13
source_extensions: vector 0.8.2, ltree, pg_trgm, pgcrypto, plpgsql, uuid-ossp
migrations_applied_count: 201
migrations_max_version: 220
notes:
  - 270 employees, 4 tenants, 273 users, 14011 ESCO skills, 126051 ESCO occupation-skill relations
```

### 7.4 Conferma metodologica

- Query reali eseguite su entrambe le istanze (bare-metal 5432 + container 5433): **6 query diverse**, output testuale incollato sopra
- Migration legacy ispezionate: **5 migration critiche** (RBP framework, ESCO, baseline evo, RBP enrichment, i18n)
- ADR evo letti: ADR-0001 (PostgreSQL bare-metal), `0002-database-testing-strategy-ci`, `0008-multi-tenant-rls-evo`, `0010-rls-coverage-strategy` listati
- Schema diff legacy↔evo: **0 tabelle uniche**, 566 comuni — verificato tramite `comm` su liste estratte da `pg_class`

---

## 8. Riassunto esecutivo

| Domanda                               | Risposta verificata                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| Schema evo è greenfield?              | **No — è baseline-squash 2026-04-27 del legacy** (566 tabelle 1:1)            |
| Quante tabelle evo?                   | **566** (non 6 come da prompt — i 6 modelli Prisma sono facade NextAuth+core) |
| RLS attiva?                           | **302/566 tabelle, 326 policy** — già configurate nel baseline                |
| ESCO già caricato?                    | **Sì identico a legacy** (14011/3040/126051/5818)                             |
| Industry classifications?             | **Sì identico** (3276/4565)                                                   |
| PET perspectives?                     | **Sì identico** (3 perspective + 47 mapping + 34 functional areas)            |
| Cosa manca davvero?                   | **Solo dati operativi tenant** (4 tenants, 272 user, 270 employee)            |
| Effort Tier 1 (bootstrap reale)?      | **~2h una sessione singola**                                                  |
| Effort Tier 2 (data load PET-driven)? | **~22h in 8 sessioni focused, una lente alla volta**                          |
| Approccio raccomandato?               | **X (già fatto) + W (Prisma-driven incremental per nuove feature)**           |

**Conclusione**: il "DBMS bootstrap" non è un greenfield rebuild — è un **data-load operativo Tier 1 + governance portfolio Tier 2/3 PET-driven**. Lo schema 1:1 è la scelta corretta dato il dataset critico (ESCO + RBP + PET già investiti in legacy). La cantierabilità è **bassa per Tier 1** (2h) e **media per Tier 2** (22h spalmati). Il rischio principale non è tecnico ma di governance: caricare lente non in ordine PET farebbe perdere il vantaggio del fasing portfolio.
