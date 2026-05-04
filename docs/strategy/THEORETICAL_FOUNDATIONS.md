---
type: synthesis
title: Heuresys Theoretical Foundations — Synthesis
aliases:
  - heuresys foundations
  - fondamenti teorici heuresys
created: 2026-04-24
updated: 2026-04-25
derived_from:
  - '[[source-repo-definizioni]]'
  - '[[source-repo-strategic-positioning]]'
  - '[[source-repo-white-paper-board]]'
  - '[[source-repo-analysis-v1]]'
  - '[[source-repo-sap-ontology-mapping]]'
  - '[[source-repo-qa-investor-simulation]]'
  - '[[scheda-tecnica-v1-1]]'
  - '[[heuresys-hrms-cowork-context-v2-1]]'
query: Quali sono i pilastri teorici di Heuresys emersi dai documenti fondativi interni
  (repositioning + scheda tecnica + descrittore workspace)?
sources:
  - raw/
  - raw/md/scheda-tecnica-v1.1-2026-04-22.md
tags:
  - synthesis
  - theory
  - foundations
  - heuresys-core
status: stable
facet: analysis
authority: supportive
scope: platform-wide
temporal-status: current
layer: content
---

> **⚠️ Imported from external Heuresys wiki** — S10 (2026-05-04). Wikilinks `[[X]]` Obsidian-style preserved (resolution deferred to S11). Original frontmatter above maintained for reference. See footer for source path.

# Heuresys Theoretical Foundations

## Overview

**Sintesi strutturata** dei pilastri teorici di Heuresys emersi dal batch ingest di documenti interni fondativi (repositioning deliverables + scheda tecnica + descrittore workspace). Documento **derivato** — non deriva da una singola fonte ma ricostruisce coerenza transdocumentale.

È la **base** per future comparazioni con framework esterni (prossima synthesis: _"Heuresys vs Adjacent Frameworks"_).

## I 7 pilastri teorici

### Pilastro 1 — Capability come costrutto composto e misurabile

**Tesi**: [[capability]] organizzativa NON è attributo aggregato narrativo ma **costrutto composto di 5 dimensioni** ([[process]], [[structure]], [[role]], [[competence]], [[performance]]) in relazione tra loro, rappresentabili come grafo, misurabili via assessment.

**Slogan pivot** (da [[source-repo-strategic-positioning]]):

> _"SAP manages how the company runs. Heuresys manages the company's ability to run."_

**Implicazioni**:

- Capability ≠ talent (distinzione Ulrich 2004)
- Capability ≠ skill aggregate
- Capability = **proprietà emergente** della rete di relazioni tra 5 dimensioni

### Pilastro 2 — Taxonomy + Ontology + Semantics (3-layer rappresentazionali)

**Tesi** (da [[source-repo-definizioni]], formalizzata in [[taxonomy-ontology-semantics]]): rappresentare capability richiede **3 livelli combinati**:

| Livello    | Cosa fa          | Struttura   | Esempio Heuresys                       |
| ---------- | ---------------- | ----------- | -------------------------------------- |
| Tassonomia | classifica       | albero      | NACE/ATECO 6-level                     |
| Ontologia  | relaziona entità | grafo       | Property Graph pg_age                  |
| Semantica  | significa        | trasversale | proficiency_scale, KPI unit_of_measure |

Nessun competitor combina esplicitamente i 3 → base del differenziale [[organizational-intelligence-category]].

### Pilastro 3 — Seven-Layer Ontological Architecture

**Tesi** (da [[source-repo-definizioni]] §2, formalizzata in [[seven-layer-architecture]]): la capability è strutturata in **7 layer** con classi + relazioni + attributi + regole:

1. **Organizational** (Organization, OrgUnit, OrgStructureNode)
2. **Process** (BusinessProcess, ProcessPhase, BusinessCapability) — **prima classe**
3. **Operational** (ProcessAssignment: OrgUnit ↔ Process)
4. **Role** (Role, JobPosition, RoleAssignment)
5. **Skill & Competency** (Skill, SkillCategory, CompetencyProfile, ProficiencyLevel)
6. **Performance** (Objective, KPI, Metric, Target) — **doppio livello: processo + ruolo**
7. **Assessment & Monitoring** (PerformanceReview, Assessment, Measurement, Score, Feedback)

**Spina dorsale** (catena ontologica):

```
Org → OrgUnit → Process → Role → Skill + Objective → KPI → Measurement → Assessment
```

### Pilastro 4 — Process-Layer-Centric

**Tesi** (da [[source-repo-definizioni]] §2.2, formalizzata in [[process-layer-centric]]): il **processo è prima classe ontologica**, non solo contesto di ruoli/persone.

**Conseguenze**:

- Bidirezione skill: `process → REQUIRES → skill` (parallel a `role → REQUIRES → skill`)
- Bidirezione obiettivi: `process → HAS_OBJECTIVE` (parallel a `role → HAS_OBJECTIVE`)
- Design bottom-up invertito: processo prima, ruolo derivato
- Benchmark cross-azienda: stesso processo confrontabile tra tenant
- Org design optimizer: simulare cambi processo propaga automaticamente

**Ancoraggio classico**: [[nelson-winter-evolutionary-theory]] 1982 — organizational routines come "DNA" organizzativo.

### Pilastro 5 — Governance vs Administration

**Tesi** (da [[source-repo-analysis-v1]] §6, formalizzata in [[governance-vs-administration]]): Heuresys **governa** la capacità organizzativa, **non amministra**.

| Governance (Heuresys FA)                                                                           | Administration (Heuresys NON FA)                                                               |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Decisione: quanto pagare, chi formare, come strutturare, quali skill servono, come allocare budget | Esecuzione: calcolare buste paga, registrare timbrature, gestire pratiche, adempimenti fiscali |

**Categoria intermedia**: Heuresys ha **consapevolezza** dei dati amministrativi (retribuzioni effettive, presenze aggregate, costi) perché concorrono al budget organizzativo, ma **non li gestisce operativamente**.

**Formulazione definitiva**:

> _"Heuresys governa la capacità organizzativa. I sistemi transazionali (payroll, presenze operative, contabilità) restano nei sistemi dedicati — Heuresys ne integra i dati per alimentare il modello decisionale."_

### Pilastro 6 — Three Access Perspectives (3 Porte)

**Tesi** (da [[source-repo-analysis-v1]] §6.4, formalizzata in [[three-access-perspectives]]): **stessa piattaforma, stesso knowledge graph, 3 entry point UI**:

- **Porta 1 — Process Owner** (entry: processo; audience: COO, transformation leader)
- **Porta 2 — Direzione Organizzazione & Sistemi** (entry: struttura; audience: Chief Org Officer, CFO)
- **Porta 3 — HR Director** (entry: persone; audience: CHRO)

**Principio architetturale**: cambio in una porta **si propaga automaticamente** alle altre due via grafo unificato. Non 3 sistemi da integrare — 1 modello con 3 viste.

**Differenziale vs competitor**: nessuno copre più di 1-1.5 porte (vedi [[heuresys-vs-competitors]]).

### Pilastro 7 — Ontology Rules (4 regole logiche)

**Tesi** (da [[source-repo-definizioni]] §5, formalizzata in [[ontology-rules-heuresys]]): il modello è _"intelligente"_ perché computable via **4 regole logiche**:

1. **Coerenza skill**: skill richieste da Role ↔ skill richieste da Process (se Role ASSIGNED_TO Process)
2. **Cascata obiettivi**: Objective del Process → Role assegnato ha Objective derivato
3. **Validità KPI**: KPI misura Objective → `unit_of_measure` semanticamente coerente
4. **Gap analysis**: Persona HAS_SKILL(X), Role REQUIRES(Y) → Gap = Y − X → learning path

Le 4 regole coprono il ciclo capability governance: definire (R1) → allineare (R2) → misurare (R3) → trasformare (R4).

## Differenziale strutturale

Tutti i competitor del landscape ([[heuresys-vs-competitors]]) hanno **una porzione** di questi 7 pilastri:

| Pilastro                   | Chi lo copre già             | Chi lo manca        |
| -------------------------- | ---------------------------- | ------------------- |
| P1 Capability costrutto    | tutti (concept)              | nessuno strumentato |
| P2 Tax/Ont/Sem combined    | nessuno                      | tutti               |
| P3 7-layer ontology        | nessuno                      | tutti               |
| P4 Process-centric         | SAP Signavio (solo processi) | HCM, analytics      |
| P5 Governance vs Admin     | nessuno esplicita            | tutti               |
| P6 3 prospettive unificate | **nessuno**                  | tutti               |
| P7 Ontology rules          | nessuno formalizza           | tutti               |

**Heuresys è l'unico** a integrare tutti e 7 i pilastri.

## Nuova categoria di prodotto

I 7 pilastri insieme **definiscono** la nuova categoria [[organizational-intelligence-category]]:

> _Organizational Intelligence = governance layer per la capability organizzativa, operante sopra ERP/HR/BI esistenti, strumentata via 7-layer ontology + ESCO knowledge graph + 3 access perspectives._

## Nature of Heuresys theoretical stance (intervista B Q10 — D5)

> _Heuresys non deriva da una scuola di pensiero ereditata. È **sintesi strumentata** di paper accademici + framework istituzionali (ESCO · NACE · CCNL) + offering top consulting (Ulrich · Deloitte SBO · OW/Mercer · BCG · McKinsey). **Nessun autore-padre**. L'integrazione multi-source strumentata è essa stessa il contributo originale._

Questa stance ha tre implicazioni teoretiche vincolanti (decisione D5):

1. **Heuresys non ha autore-padre**. Non esiste un framework adottato e adattato; non esiste una teoria canonica ricevuta per eredità.
2. **Il valore Heuresys è l'integrazione** — multi-source, istituzionale (ESCO, NACE, CCNL), accademica (paper non citati singolarmente), consulting (top firms già catalogati in `external_sources.md`).
3. **Narrativa pitch/board/investor**: _«sintesi stato-dell'arte + instrumentazione + grafo ontologico»_, **non** _«sulle spalle di [autore singolo]»_.

**Conseguenza per la sezione _Validazione da framework esterni_ sotto**: le convergenze parziali con Ulrich · Deloitte SBO · OW/Mercer (P1 ingerite) sono **validazione a posteriori**, non genealogia. La 5° dimensione [[performance]] vs 4-componente OW/Mercer = **sviluppo autonomo** Heuresys, non extension cosciente di 4→5 (intervista B Q11b).

## Validazione da framework esterni (ancora da fare)

Questa synthesis si concentra su pilastri **interni** (generati dal batch repositioning). Una seconda synthesis futura (_"Heuresys vs Adjacent Frameworks"_) farà il mapping:

- P1 ↔ Ulrich / Prahalad-Hamel / Teece / Barney / BCG (validation)
- P3 ↔ BIZBOK / TOGAF (differenziazione: standard vs computable)
- P4 ↔ Nelson-Winter (ancoraggio) / BCG 4-components (superamento)
- P5 ↔ Deloitte SBO / BCG (convergenza governance)
- P6 ↔ nessuno (pure differenziale)
- P7 ↔ nessuno (pure differenziale)

## Open questions residue (non chiuse dai pilastri interni)

- **Measurement**: come misurare capability aggregata senza ridurla a somma (pilastro 7 Regola 4 fa gap analysis, manca metrica capability-level)
- **Maturity model**: Bain ha proto-maturity "essential vs good-enough", Ulrich ha "excel in 3 of 11" — Heuresys da produrre
- **Role vs Position**: formalizzazione operativa manca ([[role]] open)
- **Metodo fallisce quando?**: contesti fuori-scope (startup <20, pure-project, creative) da chiudere con intervista B

## Raccomandazione uso

Questa synthesis è **riferimento teorico unico** per:

1. **Investor pitch**: 7 pilastri come struttura narrativa coerente
2. **White paper academic-grade**: base per paper "Toward a Computable Theory of Organizational Capability"
3. **Onboarding nuovo utente/partner**: capire Heuresys in 7 punti
4. **Differenziazione strategica**: tabella pilastri × competitor per sales collateral

## Relazioni

### Concept compositori della synthesis

- [[capability]] (P1)
- [[taxonomy-ontology-semantics]] (P2)
- [[seven-layer-architecture]] (P3)
- [[process-layer-centric]] (P4)
- [[governance-vs-administration]] (P5)
- [[three-access-perspectives]] (P6)
- [[ontology-rules-heuresys]] (P7)
- [[organizational-intelligence-category]] (emergente)

### Sources compositori

- [[source-repo-definizioni]] (pilastri P2, P3, P4, P7)
- [[source-repo-strategic-positioning]] (pilastro P1 formulazione iniziale)
- [[source-repo-white-paper-board]] (pilastro P1 + categoria)
- [[source-repo-analysis-v1]] (pilastri P5, P6 — raffinamento critico)
- [[source-repo-sap-ontology-mapping]] (pilastro P4 applicato)
- [[source-repo-qa-investor-simulation]] (difesa pilastri VC-sceptic)
- [[scheda-tecnica-v1-1]] (implementazione prodotto)
- [[heuresys-hrms-cowork-context-v2-1]] (descrittore workspace)

### Synthesis future

- _"Heuresys vs Adjacent Frameworks"_ — mapping con 18 fonti esterne da `external_sources.md`
- _"Heuresys Capability Measurement Model"_ — chiusura open question measurement

## Changelog

- 2026-04-24: prima stesura — sintesi 7 pilastri teorici da batch repositioning ingerito 2026-04-24.
- 2026-04-25: aggiunta sezione _Nature of Heuresys theoretical stance_ (intervista B Q10 + decisione D5: integratore multi-source, no autore-padre, convergenze = validazione a posteriori).

---

## Source attribution

- **Imported from**: external Heuresys wiki — `C:\Users\enzospenuso\wiki-space\heuresys-wiki\wiki\syntheses\heuresys-theoretical-foundations.md`
- **Imported at**: 2026-05-04 (S10)
- **Wikilink status**: `[[X]]` Obsidian-style preserved as-is. Resolution to markdown links `[X](path)` deferred to S11 (task: map wiki paths → evo repo paths)
- **Frontmatter status**: original Obsidian frontmatter preserved at top of file. Cleanup deferred to S11 if needed
- **Re-import policy**: this file is a snapshot at import time. To refresh, re-run wiki import workflow against the source path above
