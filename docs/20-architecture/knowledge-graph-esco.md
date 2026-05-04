---
type: concept
title: ESCO Knowledge Graph
aliases:
  - ESCO KG
  - ESCO
  - European Skills/Competences/Qualifications
created: 2026-04-24
updated: 2026-04-24
sources:
  - raw/md/scheda-tecnica-v1.1-2026-04-22.md
tags:
  - product
  - asset/knowledge-graph
  - dimension/competence
dimension: competence
status: draft
facet: principle
layer: architecture
authority: authoritative
scope: platform-wide
temporal-status: current
---

> **⚠️ Imported from external Heuresys wiki** — S10 (2026-05-04). Wikilinks `[[X]]` Obsidian-style preserved (resolution deferred to S11). Original frontmatter above maintained for reference. See footer for source path.

# ESCO Knowledge Graph

## Overview

Knowledge graph europeo di skill e occupazioni (ESCO = _European Skills/Competences/Qualifications and Occupations_), integrato in [[heuresys-hrms]] come materializzazione concreta della dimensione [[competence]] del framework Heuresys.

## Dimensioni

Snapshot da [[scheda-tecnica-v1-1]]:

| Entità                       | Count             |
| ---------------------------- | ----------------- |
| Skill                        | 14.011            |
| Occupation                   | 3.040             |
| Relazioni occupation ↔ skill | 126.051           |
| Relazioni skill ↔ skill      | 5.818             |
| Embeddings                   | EN + IT, 1536 dim |

Storage in PostgreSQL con estensione **pgvector** per embeddings + **ltree** per gerarchie + **pg_trgm** per fuzzy match.

## Crosswalk

**4.565 crosswalk ESCO ↔ NACE** verso [[enterprise-taxonomy]] — ponte tra dimensione `competence` e dimensione `structure` settoriale.

## Notable gap

Da [[scheda-tecnica-v1-1]] (sezione _Asset chiave non ancora sfruttati_): _"ESCO KG sotto-utilizzato: 14k skills + 126k relations consumati solo via query SQL puntuali"_. Il grafo esiste nei dati ma non è trattato come grafo dalla logica applicativa. Leva aperta tra asset-grafo passivo e intelligenza organizzativa attiva.

## Dual-level: catalog vs operational

Aggiornamento 2026-04-25 (review `HEURESYS_COGNITIVE_ECOSYSTEM_DATABASE_BLUEPRINT.md`): lo schema PostgreSQL espone ESCO su **2 livelli distinti**:

| Livello                                    |                          Cardinality | Tabella primaria                                                                                                     | Use case                                                                           |
| ------------------------------------------ | -----------------------------------: | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Catalog full** (ESCO standard import)    |                         14.011 skill | `skills_master` (con metadata avanzato: `is_emerging`, `growth_rate`, `automation_risk`, `market_demand`, `version`) | reference ontology — tenant-agnostic, full ESCO catalog disponibile                |
| **Operational i18n** (multi-lingua attivo) | 1.388 skill (snapshot blueprint dev) | `i18n_skills` (per language_code, con `synonyms` + `is_verified`)                                                    | runtime — solo skill effettivamente in uso nei tenant attivi, tradotti in 9 lingue |

**Crosswalk multi-source**: `i18n_skills_mappings` traccia mapping ESCO ↔ altre taxonomy (es. ISCO, NACE, proprietary) con `confidence_score` + `semantic_similarity_score` + `verified_date` — supporta integration con **Workday Skills Cloud** + **Beamery proprietary 16K** + **Lightcast 30K** (vedi [[heuresys-vs-competitors]] §coexistence pattern).

## AI integration (vector embeddings)

`ai_skills_embeddings` table (cfr. [[database-architecture]] §Cluster):

- `model_name` configurabile per skill (default `sentence-transformer`, override possibile per skill domain-specific)
- `embedding_vector` text-encoded (per portabilità) + `vector_id` external reference (Pinecone/Weaviate fallback se `is_external_stored=true`)
- `similarity_threshold` default 0.8 — calibrabile per use case (matching strict 0.9+ vs broad 0.6+)
- `language_code` per embedding — supporto bilingual EN+IT come da [[scheda-tecnica-v1-1]] §ESCO embeddings 1536-dim

**Use case downstream**: skill gap analysis · semantic search · occupation similarity · career path bridging · [[capability-academy-autogen]] §stage [3] learning path design.

## Relazioni

- asset chiave di [[heuresys-hrms]]
- materializza [[competence]]
- interconnesso con [[enterprise-taxonomy]] via 4.565 crosswalk ESCO↔NACE
- parte del [[semantic-graph]] Heuresys
- richiesto da [[role]] (via occupation ↔ skill)

## Sources

- [[scheda-tecnica-v1-1]]

## ESCO KG diagram (D6 Mermaid)

Diagram completo: `wiki/_assets/diagrams/03-esco-knowledge-graph.mmd` (cfr. [[_assets/diagrams/README]] §03). 3.040 occupations (ISCO Group 1 Managers, 2 Professionals, 3 Technicians, ... 9 groups) × 14.011 skills (Knowledge · Skill/Competence · Transversal) × **126.051 occupation→skill links** (essential + optional) + **5.818 skill→skill links** (broader/narrower/related) + **1536-dim bilingual embeddings** (skill vectors 14.011 EN+IT, occupation vectors 3.040 EN+IT). Enterprise Taxonomy: NACE L1-L4 EU + ATECO L5-L6 IT 2025 = 3.276 classifications + 4.565 crosswalk to ESCO. AI Functions: skill gap analysis · career path bridging · occupation similarity · semantic search.

---

## Source attribution

- **Imported from**: external Heuresys wiki — `C:\Users\enzospenuso\wiki-space\heuresys-wiki\wiki\concepts\esco-knowledge-graph.md`
- **Imported at**: 2026-05-04 (S10)
- **Wikilink status**: `[[X]]` Obsidian-style preserved as-is. Resolution to markdown links `[X](path)` deferred to S11 (task: map wiki paths → evo repo paths)
- **Frontmatter status**: original Obsidian frontmatter preserved at top of file. Cleanup deferred to S11 if needed
- **Re-import policy**: this file is a snapshot at import time. To refresh, re-run wiki import workflow against the source path above
