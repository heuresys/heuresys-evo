# ADR-0030: Lexicon canonical — 16 sigle vocabolario controllato catene relazionali

**Status**: Accepted
**Date**: 2026-05-11
**Authors**: Enzo Spenuso
**Commits**: `5f08439` (lexicon.md + CASCADIA seed-generator skel) · `1500369` (S35 handoff)
**SoT**: `docs/_meta/lexicon.md`

## Context

Pre-S35 le catene relazionali dell'universo dati Heuresys (568 modelli Prisma su 25 aree funzionali) erano riferite con vocabolario inconsistente:

- "7-layer ontology" / "OPOURSKA" / "Org-Process-Role-Skill-KPI-Assessment" — tre denominazioni della stessa catena
- "Industry cascade" / "INDOOR" / "Industry-driven seeding" — naming variabile
- "Italian labor context" / "ITLAB" / "Italian payroll tables" — overlap semantico
- "Knowledge Graph projection" / "ESKAP" / "ESCO+KG seed" — alias non standardizzati

Conseguenze concrete:

1. Directory naming script generator inconsistente (`scripts/seed-generator/banking/` vs `scripts/seed-generator/rtl/` vs `scripts/seed-generator/k64/`).
2. Commit scope ambigui (`feat(banking)` vs `feat(rtl)` vs `feat(industry)`).
3. ADR title verbosi (`ADR-0027: Industry-driven banking seeding with ESCO mapping`).
4. Audit grid cell criteria poco riusabili.
5. Handoff brief lunghi (riferire la stessa catena con 3 nomi diversi).
6. Cognitive load per Claude: ogni riferimento richiedeva contesto esplicito.

L'utente ha richiesto durante S35.2 un **vocabolario canonical formalizzato** delle 16 catene relazionali principali identificate, adottabile come SoT cross-machine e enforceabile via naming convention.

## Decision

Adottare **16 sigle canonical** come vocabolario controllato delle catene relazionali. SoT autoritativa: `docs/_meta/lexicon.md` (versioned in git, cross-machine).

### Le 16 sigle

| #   | Sigla        | Estesa                                                       | Stato S35                                              |
| --- | ------------ | ------------------------------------------------------------ | ------------------------------------------------------ |
| 1   | **OPOURSKA** | Organization-Process-OrgUnit-Role-Skill-KPI-Assessment       | base attiva (7-layer ontology canonical)               |
| 2   | **PET**      | Process / Enterprise / Talent                                | base attiva (3 access perspectives)                    |
| 3   | **INDOOR**   | Industry-NACE-Domain-Org-OrgUnit-Roles                       | pending S35.3 pilot shipped                            |
| 4   | **TALPIPE**  | Talent Pipeline (Career-Succession-9Box-TalentPool-Mobility) | pending S35.3 pilot shipped                            |
| 5   | **H2R**      | Hire-to-Retire                                               | pending S35.3                                          |
| 6   | **SKILGRO**  | Skill-Knowledge-Inventory-Learning-GROwth                    | pending S35.3                                          |
| 7   | **GOKMER**   | Goal-Objective-KPI-Measurement-Evaluation-Review             | pending S35.3                                          |
| 8   | **PROGOV**   | Process Governance (Workflow-Approval-Audit-Compliance)      | pending S35.3 — phase18e regulatory_frameworks shipped |
| 9   | **ESKAP**    | ESCO + Knowledge graph Application Projection                | shipped S35.5 (phase18f, 17k nodes + 139k edges)       |
| 10  | **ITLAB**    | Italian Labor (CCNL-INPS-Sindacati-Holidays IT)              | shipped S35.1 (phase18d, ADR-0029)                     |
| 11  | **RBP**      | Role-Based Permissions matrix                                | base attiva (179 row, target 326)                      |
| 12  | **DGOV**     | Data Governance (Multi-tenant + RLS + Audit + GDPR)          | base attiva (375 RLS policies)                         |
| 13  | **SMERTO**   | Salary-Merit-Equity-Reward-TOtal                             | pending S35.3                                          |
| 14  | **PULSAR**   | PUlse-LinkedScore-Action-Retention                           | pending S35.3                                          |
| 15  | **EPRA**     | Embedding-Prediction-Recommendation-Action                   | pending S35.3 (AI stack)                               |
| 16  | **CASCADIA** | Catena seeding realistic end-to-end                          | pipeline self-reference (ADR-0028)                     |

Legenda: ✅ = canonical pre-esistente · ⭐ = nuova formalizzazione S35

### Naming convention enforced

| Contesto           | Pattern                                                           | Esempio                                                       |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Directory pipeline | `scripts/seed-generator/<sigla-minuscola>/`                       | `scripts/seed-generator/eskap/`                               |
| Commit scope       | `<type>(<sigla>): <subject>`                                      | `feat(eskap): phase18f Knowledge Graph master`                |
| ADR title          | `ADR-NNNN: <SIGLA>[+<SIGLA>] <topic>`                             | `ADR-0029: ITLAB tables design`                               |
| Audit grid cell    | `<SIGLA> coverage` / `<SIGLA> coherence` / `<SIGLA> completeness` | "OPOURSKA coverage", "INDOOR coherence", "ESKAP completeness" |
| Handoff brief      | `S35.X M_ — <SIGLA>[+<SIGLA>] <event>`                            | "S35.3 M11 — OPOURSKA + TALPIPE + EPRA per RTL Bank shipped"  |
| Migration filename | `phaseNNx_<sigla_or_topic>.sql`                                   | `phase18f_eskap_knowledge_graph.sql`                          |

### Governance vincolante (#12 in CLAUDE.md root)

> Lexicon canonical è **obbligatorio** per ogni nuova catena relazionale identificata. Aggiunta sigla obbligatoria via ADR. Naming convention enforced.

## Rationale

- **Cognitive overhead riduzione**: 1 sigla a parità di info equivale a 5-10 caratteri vs 30-50 della denominazione estesa. In una sessione 8h con ~50 riferimenti, savings cumulato significativo (~250 token).
- **Cross-tool coherence**: commit history + ADR archive + `lexicon.md` + handoff STATE.md + audit logs convergono sullo stesso vocabolario.
- **Onboarding leverage**: nuovo collaboratore (umano o agentic) leggendo `docs/_meta/lexicon.md` ha la mappa concettuale completa dell'universo dati in <5 minuti vs ore di esplorazione codebase.
- **Audit grid riuso**: criteria "OPOURSKA coverage" / "INDOOR coherence" sono celle riutilizzabili in audit matrix automatici → output deterministico.
- **Catena vs tabella distinction**: le sigle non corrispondono a singole tabelle ma a **macro-domini relazionali** (catene di tabelle che si attivano insieme). Questo livello di astrazione è ciò che mancava.
- **Catena vs sigla scelta**: i nomi sono mnemonic + memorable + indicative (OPOURSKA suona "Operatori Procurati Risorse Skill Assessment", INDOOR evoca "dentro l'industria", TALPIPE è "talent pipeline"). Trade-off accettato: mnemonic vs neutrale → mnemonic vince per memorability.

## Consequences

### Positive

- Directory layout `scripts/seed-generator/` organizzato per sigla (vs flat numbering pre-S35.2)
- Commit log post-S35 grep-able per sigla: `git log --grep="(eskap)"` → tutti i commit ESKAP
- ADR archive consistent: ADR-0028+29+30 referenziano sigle nel titolo
- Handoff brevity: STATE.md sostituisce paragrafi descrittivi con sigle ("S35.3 M11 — TALPIPE per RTL Bank")
- CLAUDE.md root + docs/\_meta/lexicon.md cross-referencing
- Skill/agent invocation more precise: "Run TALPIPE audit per RTL" vs "Run audit succession+career+9box+mobility"
- Audit grid cells programmaticamente generabili per sigla

### Negative

- **Memorization tax**: 16 sigle nuove richiedono mental loading iniziale (sebbene 4 fossero già canonical: OPOURSKA, PET, RBP, H2R)
- **Risk di "sigla overflow"**: aggiunta sigla 17a/18a/etc. richiede ADR esplicito (governance #12 enforced)
- **Cross-language**: sigle sono lingua-agnostic ma alcuni mnemonic (es. SKILGRO) sono inglese-centric. Trade-off accettato per universalità tecnica.
- **Newcomer learning curve**: developer/agent senza accesso a `lexicon.md` vede sigle come jargon. Mitigation: ogni file documentale che usa sigle DEVE linkare `docs/_meta/lexicon.md` nel header.

### Carry-forward

- **S36+ aggiunte**: ogni nuova catena relazionale identificata via implementation → ADR proposing nuova sigla + update `lexicon.md`.
- **Audit grid template**: produrre template SQL/script con cells parametrizzati per sigla (futuro tooling).
- **Skill `lexicon` invocation**: skill Claude che decoda sigle in plain text per onboarding rapido (low-effort, deferred).

## Related ADRs

- **ADR-0028** — CASCADIA pipeline (uso operativo del lexicon)
- **ADR-0029** — ITLAB tables (esempio sigla pre-formalizzata che diventa ADR canonical)
