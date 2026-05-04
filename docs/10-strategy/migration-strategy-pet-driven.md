# Heuresys Migration Strategy — PET-driven Phased Portfolio

**Status**: ATTIVO (Source of Truth strategico evo)
**Created**: 2026-05-02
**Owner**: Enzo Spenuso
**Supersedes**: `ROAD_TO_GLORY.md` Phase 6+ (cutover-event model abbandonato)
**Companion docs**:

- `docs/_meta/migration-doc-audit.md` (audit doc legacy → classificazione A/B/C/D)
- `docs/90-archive/migration-bootstrap/dbms-bootstrap-strategy.md` (strategia DBMS evo)

---

## 1. Vision corretta (filtro per ogni decisione)

Heuresys **non è un HRMS**. Heuresys è una **piattaforma di Capability Governance** che osserva l'organizzazione da 3 prospettive cross-cutting:

| Lente              | Significato                                                 | Domanda che risponde                         |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------- |
| **P** — Process    | Processi, sessioni, workflow, blueprint, governance         | Come l'organizzazione opera?                 |
| **E** — Enterprise | Org & Systems, struttura, ecosistema, marketplace, taxonomy | Come l'organizzazione è strutturata?         |
| **T** — Talent     | Risorse umane, competenze, performance, learning, retention | Chi compone l'organizzazione e cosa sa fare? |

HR è UNA delle 3 lenti, non IL prodotto. Riferimento DB: `rbp_area_perspectives` (47 mapping PRIMARY+SECONDARY tra le 33 aree funzionali e le 3 prospettive).

**Implicazione critica**: pagine/feature/dati che in un HRMS classico sarebbero "secondary admin" (recruiting, learning, compensation, engagement) in Heuresys sono **fonti dati delle lenti**, non zavorra. Niente categoria "drop totale". Solo ordine di priorità di migrazione.

---

## 2. Modello migrazione: NON cutover, ma phased portfolio

### 2.1 Cosa NON facciamo

❌ **Cutover-event** (legacy spento, evo acceso lo stesso giorno) — abbandonato perché:

- 1481 endpoint legacy vs 11 evo (gap 99.3%)
- 231 pagine legacy vs 3 evo (gap 98.7%)
- 1 founder + AI Cantieri non possono replicare un decennio di feature in 3-5 mesi
- Il piano "Q3 2026 cutover" del RTG era 200% ottimistico

❌ **Drop categoriale** (es. "tutto admin/learning/compensation è zavorra") — abbandonato perché contraddice la vision PET (queste aree alimentano lente Talent).

### 2.2 Cosa facciamo

✅ **Phased portfolio migration PET-driven**:

- Legacy resta fonte di verità per ogni area finché quell'area non è portata in evo
- Le aree migrano in ordine di priorità basato su 2 dimensioni: (a) quanto incarnano la vision PET cross-cutting, (b) maturità in legacy
- Non c'è un "giorno del cutover". C'è erosione progressiva: man mano che le aree migrano, gli utenti (futuri) usano evo per quelle, legacy per il resto
- Quando l'ultima area è portata, legacy viene spento. Potrebbe essere fra 12 mesi o 4 anni — non è una deadline, è un risultato

✅ **Porte aperte**: nessuna area è scartata a priori. Ogni pagina ha un giorno suo, anche se in coda.

✅ **Cross-cutting first**: prima si portano gli "abilitatori" che attivano le 3 lenti. Poi i data sources di ogni lente. Poi tooling/admin.

---

## 3. Tier di priorità

### Tier 1 — Cross-cutting & abilitatori vision (P0)

Aree che fanno girare la storia "Heuresys = 3 lenti su Capability Governance". Senza queste evo non racconta nulla.

| Area                            | Pagine indicative legacy                                                                                                                          | Effort port                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| AI Talent Advisor               | `ai/chat`, `ai/documents`, `ai/sessions`, `career/chat`                                                                                           | alto (LLM integration)                            |
| ESCO Knowledge Graph            | `talent/esco`, `talent/esco-explorer`, `talent/skill-profiles`, `talent/gap-analysis`, `talent/skills`                                            | medio (DB già popolato, serve UI)                 |
| Workforce Intelligence          | `workforce-intelligence/career-simulator`, `org-dashboard`, `skill-galaxy`, `what-if`                                                             | medio-alto                                        |
| PET Perspectives pages          | `company-pet/processes`, `people`, `hierarchy`, `governance/learning`, `governance/recruiting/pipeline`, `sessions`, `benchmarking`, `breakdowns` | medio                                             |
| Org structure base              | `employees/`, `employees/[id]`, `org-units/`, `org-chart`, `locations/`, `positions/`                                                             | basso (CRUD standard)                             |
| Dashboards core                 | `dashboards/`, role-based dashboard widgets                                                                                                       | basso (widget framework già pronto in Cantiere B) |
| Auth + RBP + RLS infrastructure | `login`, `users`, `settings/users` (auth), policy enforcement                                                                                     | medio (NestJS + Prisma + RLS)                     |

Stima Tier 1: ~30-40 pagine, ~80-120 endpoint, **6-12 mesi a ritmo founder + Cantieri**.

### Tier 2 — Data sources delle 3 lenti (P1)

Aree che alimentano una specifica lente con dati ricchi. NON sono zavorra: senza queste le 3 lenti analizzano un dataset povero.

| Lente          | Aree alimentate                                                                                                                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Talent**     | `performance/*` (review-cycles, calibration, OKRs, feedback, goals), `learning/*`, `courses/*`, `certifications/`, `recruiting/*`, `compensation/*`, `engagement/*`, `talent/mobility`, `talent/succession`, `talent/assessments`, `analytics/hr-intelligence`, `analytics/predictions` |
| **Enterprise** | `marketplace/*` (api-keys, webhooks, plugins), `cost-centers/*`, `settings/tenants/*`, `org-units/[id]/stats`                                                                                                                                                                           |
| **Process**    | `compliance/*` (audits, policy-violations, whistleblowing), `goals/cascading`, `hr-core/*` (process duplicates), `enrichment/*`                                                                                                                                                         |

Stima Tier 2: ~80-120 pagine, ~200-300 endpoint, **12-24 mesi**.

### Tier 3 — Tooling, admin granulare, meta (P2)

Cose utili ma non critiche per la storia. Migrano per ultime ma migrano.

- `settings/sap-migration`, `settings/sso`, `settings/notifications`
- `design/wireframes`, `landing`, `landing-test`, `panoramica`, `blueprint-standalone`, `design-editor`
- Sub-routes detail dei tier sopra (es. `[id]/edit`, `[id]/history`)
- Admin tooling fine-grained

Stima Tier 3: ~50-80 pagine, ~150-200 endpoint, **24+ mesi**.

---

## 4. Stato attuale verificato (2026-05-02)

### Codice

- **Pagine evo**: 3 (`/`, `/login`, `/dashboard`) — Tier 1 al ~7%
- **Endpoint evo**: 11 (employees, leaves, performance-reviews, audit-logs, esco, auth, health, admin-tenant-schema) — Tier 1 al ~10%
- **UI Components evo**: 103 (Cantiere B v2 produced ~150 in 16 tier — molti riusabili da Tier 1)
- **Test evo**: 29

### DBMS evo (bare-metal, porta 5432) — VERIFICATO

- **566 tabelle** (NON 6 — i 6 modelli Prisma sono facade NextAuth+core)
- **302 tabelle RLS-enabled**
- **326 policy** RLS
- Dataset già caricati:
  - ESCO: 14.011 skills, 3.040 occupations, 126.051 occupation-skill relations, 5.818 skill-skill relations
  - Industry classifications NACE/ATECO: 3.276 record, crosswalk ESCO 4.565 link
  - PET: 3 perspectives + 47 area_perspectives + 34 functional areas
  - RBP: 179 role permissions + 170 pages + 11 dashboards + 279 nav items + 27 widget + 8 workspace templates

### DBMS legacy (Docker container heuresys_evo_platform_db, porta 5433)

- Stesso schema (566 tabelle, baseline-squash 2026-04-27 sincronizzato)
- Dati operativi: 4 tenant + 272 user delta + 270 employee

### Implicazione

Lo "schema bootstrap" è **già fatto**. Il gap reale evo è:

1. **Data load Tier 1** (~2h una sessione): 4 tenants + 272 user + 270 employee da legacy
2. **Code build-out**: pagine + endpoint NestJS+Prisma su Tier 1 (mesi)

---

## 5. Roadmap operativa (Phase-mapping vs RTG)

| RTG Phase                                  | Status               | Sotto nuova strategia diventa                                                                                                                                                   |
| ------------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 0 (L3 automation infra)              | ✅ done              | mantenuto                                                                                                                                                                       |
| Phase 1 (UNBLOCK legacy)                   | ✅ done              | mantenuto                                                                                                                                                                       |
| Phase 2 (SECURITY GREEN legacy)            | ✅ done              | mantenuto                                                                                                                                                                       |
| Phase 3 (EVO acceleration)                 | ✅ 77%               | mantenuto, completare TOTP-deferred                                                                                                                                             |
| Phase 4 (Feature parity audit + closure)   | ✅ done              | mantenuto, audit usato come baseline                                                                                                                                            |
| Phase 5 (Cutover plan + parallel run)      | ✅ done              | **valore residuo**: parallel deploy Nginx+TLS è infrastruttura riusabile (https://evo.heuresys.com live). Script cutover (5.5-5.9) → riusati come "smoke test progressive port" |
| Phase 6 (Cutover execution + decommission) | ❌ obsoleto          | **CANCELLATO**. Rimpiazzato da Phase 6+ Tier 1 port                                                                                                                             |
| **Phase 6+ NEW** (Tier 1 PET-driven port)  | da partire           | progressive porting Tier 1, no deadline rigida                                                                                                                                  |
| **Phase 7+ NEW** (Tier 2 data sources)     | futuro               | dopo Tier 1 stabile                                                                                                                                                             |
| **Phase 8+ NEW** (Tier 3 tooling)          | futuro               | quando serve                                                                                                                                                                    |
| **Phase Final** (legacy decommission)      | risultato non evento | quando l'ultima area è portata                                                                                                                                                  |

---

## 6. Cosa fare nelle prossime 1-3 sessioni

### Sessione N+1 — DBMS bootstrap finale (Tier 1 data load)

- Import 4 tenants + canonical users + 270 employee da legacy → evo bare-metal
- Validazione RLS attiva, RBP cache funziona, login canonico evo
- Effort: **2h**
- Riferimento: `dbms-bootstrap-strategy.md` §7 path operativo

### Sessione N+2 — Doc evo new-from-scratch (i 19 doc cat. D)

- Top priority: `CLAUDE.md` evo, `ADR-NestJS-Module-Conventions`, `ADR-Prisma-Migration-Workflow`, `ADR-Monorepo-Workspace-Strategy`, `Getting-Started-evo`, `RLS-with-Prisma-pattern`
- Riferimento: `migration-doc-audit.md` cat. D
- Effort: **3-4h**

### Sessione N+3 — Tier 1 port: prima area completa

- Scelta: `employees/` (Tier 1 minimum vitale, CRUD standard, baseline)
- Migrazione: route NestJS + Prisma model + Next.js pages + RBP + RLS + test
- Effort: **6-10h** (single area completa)

---

## 7. Decisioni strategiche prese

1. ✅ **Cutover-event abbandonato** — sostituito da phased portfolio migration
2. ✅ **Niente zavorra categoriale** — tutte le 231 pagine hanno un giorno (alcune fra 6 mesi, altre fra 30 mesi)
3. ✅ **Q3 2026 narrative** — non più "cutover Q3", ma "Tier 1 stabile + 1-2 aree dimostrabili Q3" per DD investitori
4. ✅ **Legacy resta vivo** indefinitamente (almeno 24 mesi minimi) — fonte di verità per aree non portate
5. ✅ **DBMS evo già pronto** (schema cloned + ESCO+RBP+PET seed) — bootstrap = solo data Tier 1 + Prisma extension progressiva
6. ✅ **Documentation re-base** — evo ottiene SUA documentazione (cat. A porta-1:1 + cat. B adatta + cat. D new-from-scratch); legacy doc cat. C resta in legacy

---

## 8. Punti aperti (richiede approfondimento Enzo)

1. **PET mapping completo**: il file `rbp_area_perspectives` ha 47 mapping ma il razionale per ogni area-prospettiva non è documentato. Servirà workshop dedicato per scrivere doc PET-mapping-rationale per evo.
2. **Q3 2026 narrative per DD investitori**: cosa esattamente promettiamo? "Tier 1 done Q3" è ambizioso ma fattibile se Tier 1 = ~30 pagine.
3. **Cantieri AI orchestration model**: il fatto che 2 Cantieri AI hanno prodotto in parallelo 30 dev-day di output in una notte è un asset narrativo. Va consolidato come "operating model Heuresys".
4. **Investimento in evo vs legacy maintenance**: ogni ora spesa a sviluppare in legacy è ora persa. Politica: dal 2026-05-02 in poi, **niente nuova feature in legacy**, solo bug-fix critici.

---

## 9. Riferimenti

- `ROAD_TO_GLORY.md` (legacy repo) — Phase 0-5 SoT, Phase 6+ superseded da questo doc
- `docs/_meta/migration-doc-audit.md` — classificazione doc legacy A/B/C/D
- `docs/90-archive/migration-bootstrap/dbms-bootstrap-strategy.md` — strategia bootstrap DBMS evo
- `docs/20-architecture/ADR-WORKSPACE-AS-COWORK-CONTEXT.md` — modello workspace
- `rbp_area_perspectives` (DB table) — mapping 47 PET PRIMARY+SECONDARY

---

## 10. Changelog questo doc

- **2026-05-02 v1.0** — initial draft, supersedes RTG Phase 6+, integra audit doc + DBMS strategy + sanity-check numerico (231/1481/635 vs 3/11/566).
