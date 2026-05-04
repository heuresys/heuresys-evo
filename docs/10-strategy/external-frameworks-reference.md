---
type: meta
title: 'External Sources Inventory — Ricerche web 2026-04-24'
aliases: ['external sources', 'fonti esterne', 'research inventory']
created: 2026-04-24
updated: 2026-04-24
tags: [meta/research, external-sources, inventory, pre-ingest]
status: living
---

> **⚠️ Imported from external Heuresys wiki** — S10 (2026-05-04). Wikilinks `[[X]]` Obsidian-style preserved (resolution deferred to S11). Original frontmatter above maintained for reference. See footer for source path.

# External Sources Inventory

Inventario delle **18 fonti esterne** raccolte tramite web search il 2026-04-24 per colmare il gap teorico di [[capability]] / [[overview]] (metodo di consulenza Heuresys).

Ogni voce include: **autore/fonte**, **link**, **spiegazione sintetica**, **classificazione**, e un **commento d'integrazione** che ipotizza come la fonte può essere impiegata nel wiki e/o nel framework Heuresys.

Questo documento è **pre-ingest**: orienta la produzione di source pages e concepts dei prossimi turni. Viene aggiornato man mano che aggiungiamo fonti o approfondiamo singole voci.

---

## Struttura per voce

| Campo                        | Significato                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| **Framework / Autore**       | Chi e cosa                                                                                   |
| **Anno / Fonte**             | Data e canale di pubblicazione                                                               |
| **Link primari**             | URL di riferimento                                                                           |
| **Classificazione**          | Cluster tematico (vedi sotto)                                                                |
| **Spiegazione**              | 2-3 frasi sul core concept                                                                   |
| **Integrazione in Heuresys** | Ipotesi: dove/come inserirlo nel wiki, quale concept arricchisce, quale open question chiude |

## Cluster di classificazione

- **C1 — Seminal Academic**: teoria fondativa del concetto di capability organizzativa
- **C2 — Framework Enterprise**: standard industriali per architettura / skills / capability
- **C3 — Top Consulting**: offering commerciali dei leader consulting (McKinsey, BCG, Bain, Deloitte, Accenture, PwC, Oliver Wyman)
- **C4 — Business Schools / Thought Leaders**: accademia applicata (HBR, MIT Sloan, INSEAD) + thought leader di dominio (Bersin)

---

## C1 — Seminal Academic (5 fonti)

### 1.1 Core Competence of the Corporation

- **Autore**: C.K. Prahalad & Gary Hamel
- **Anno / Fonte**: 1990, Harvard Business Review (articolo seminale più citato sul tema)
- **Link**: [HBR 1990 — The Core Competence of the Corporation](https://hbr.org/1990/05/the-core-competence-of-the-corporation)
- **Classificazione**: C1 — fondazione teorica "capability as collective learning"
- **Spiegazione**: Definizione normativa: _"Core competence is the collective learning in the organization, especially the capacity to coordinate diverse production skills and integrate streams of technologies."_ Esempi: NEC, Honda, Canon che si pensano come _portfolio of competencies_ invece di _portfolio of SBUs_.
- **Integrazione in Heuresys**:
  - Arricchisce [[capability]] con **fondazione accademica ortodossa** (citabile nei deliverable investor)
  - ✅ **Ingesta P2 (2026-04-25)**: [[source-prahalad-hamel-1990]] + [[prahalad-hamel-core-competence]] — mapping 6-asse vs Heuresys + 3 case studies (NEC/Honda/Canon) riletti in ottica grafo + implicazione pitch/board
  - Utile per [[overview]] sezione "relazione con modelli adiacenti" — risponde a: _cosa aggiunge Heuresys a Prahalad-Hamel?_ (risposta: ontologia + grafo + misurabilità)
  - **Citazione pivot** in futura synthesis comparativa

### 1.2 Dynamic Capabilities Framework

- **Autore**: David J. Teece (UC Berkeley)
- **Anno / Fonte**: articoli multipli 1997-2016, libri + California Management Review
- **Link**: [davidjteece.com/dynamic-capabilities](https://www.davidjteece.com/dynamic-capabilities) · [TheoryHub — Dynamic Capabilities Theory](https://open.ncl.ac.uk/theories/19/dynamic-capabilities-theory/) · [CMR Berkeley — The Key to Keeping Up](https://cmr.berkeley.edu/2016/08/dynamic-capabilities/)
- **Classificazione**: C1 — evoluzione di capability teoria (post-RBV)
- **Spiegazione**: Tre cluster high-level per sopravvivenza in ambienti volatili: **(1) Sensing** (assessment opportunità + consumer needs esterni), **(2) Seizing** (reazione organizzativa, business model design, securing capital), **(3) Transforming** (renewing company processes, streamline, evolve).
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P2 (2026-04-25)**: [[source-teece-dynamic-capabilities]] + [[teece-dynamic-capabilities]] — 3-cluster mapping × [[pet-perspectives]] + framing _«Teece strumentato»_ + feature gap `dynamic-performance-index` + anti-routine paradox vs Nelson-Winter + SQ5 nuova (6° meta-dim formalizzazione)
  - **Insight critico per [[performance]]**: Teece ci dice che performance non è solo output, è _capacità di trasformarsi_. Potrebbe diventare una **6° meta-dimensione** di Heuresys (oppure attributo trasversale)
  - Utile per [[ai-advisor]]: l'advisor esegue continuamente _sensing_ (osservazione 24/7) e propone _seizing/transforming_ actions. Framework Teece dà **vocabolario teorico** all'advisor
  - Risponde a open question residua: _capability è potenziale o realizzazione?_ → Teece dice **entrambi**, dinamicamente

### 1.3 Resource-Based View + VRIN/VRIO

- **Autore**: Jay Barney (1991, 1995)
- **Anno / Fonte**: "Firm Resources and Sustained Competitive Advantage" 1991; evoluzione VRIO 1995
- **Link**: [Resource-Based View (Wikipedia)](https://en.wikipedia.org/wiki/Resource-based_view) · [VRIO Framework Explained (SMI)](https://strategicmanagementinsight.com/tools/resource-based-view/)
- **Classificazione**: C1 — pre-requisito teorico a Dynamic Capabilities
- **Spiegazione**: Una capability è vantaggio competitivo sostenibile se e solo se è **V**aluable · **R**are · **I**mitable (imperfettamente) · **O**rganized (l'organizzazione deve saperla sfruttare). VRIO è evoluzione del VRIN originale (Non-substitutable → Organized).
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P2 (2026-04-25)**: [[source-barney-rbv-vrio]] + [[barney-resource-based-view]] — VRIO 4 criteri + matrice outcome + mapping 5-dim + feature gap `vrio-scorecard` candidato F6+ con formula PL/pgSQL proposta
  - **Applicazione pratica**: ogni capability che un cliente Heuresys mappa può essere etichettata VRIO-wise (valuable? rare? inimitable? organized?). Diventa funzionalità di assessment nel prodotto: "delle tue capability mappate, quali sono VRIO-compliant?"
  - Convergenza con [[capability-maturity-scale]] L2+ (Organized criterio O corrisponde a Connesso L2)
  - Citabile per investor/board: dà linguaggio "strategy classics" a ciò che Heuresys fa

### 1.4 Evolutionary Theory + Organizational Routines

- **Autore**: Richard Nelson & Sidney Winter
- **Anno / Fonte**: _An Evolutionary Theory of Economic Change_, 1982 (libro fondativo)
- **Link**: [Nelson & Winter 1982 (Google Books)](https://books.google.com/books/about/An_Evolutionary_Theory_of_Economic_Chang.html?id=6Kx7s_HXxrkC) · [Teece — Evolutionary Economics, Routines, and Dynamic Capabilities (Berkeley PDF)](https://haas.berkeley.edu/wp-content/uploads/Evolutionary-capabilities-final.pdf)
- **Classificazione**: C1 — base pre-Teece, concetto "routine" come unità di analisi
- **Spiegazione**: Le organizzazioni sono fatte di **routine** (pattern ripetuti, "DNA" organizzativo). La capability evolve come "mutazione" intenzionale delle routine. Distinzione chiave: biological genotypes sono fissi, routine organizzative possono essere **modificate intenzionalmente** (origine dynamic capabilities).
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P5 (2026-04-25)**: [[source-nelson-winter-1982]] + [[nelson-winter-evolutionary-theory]] — routines as DNA + **revelation [[process-layer-centric]]** (routines reificate come entità ontologiche prime-classe) + [[employee-timeline-event-sourcing]] = evolutionary trajectory + anti-routine paradox risoluzione Heuresys
  - ~~Concept nuovo: `organizational-routines-nelson-winter`~~ → creato come `nelson-winter-evolutionary-theory` (naming più ampio)
  - **Revelation per il wiki**: il [[process]] di Heuresys è _Nelson-Winter routine_ reificata. Questo dà un'ancora teorica a "processo = prima classe ontologica"
  - **Uso pratico**: l'[[employee-timeline-event-sourcing]] (già implementato in prodotto) può essere re-letto come "tracciamento mutation delle routine individuali" — un'interpretazione **teoricamente solida**
  - Citazione tecnica per boost credibilità (libro 1982, tra i più citati in economic theory)

### 1.5 HR Transformation + Organizational Capability

- **Autore**: Dave Ulrich (University of Michigan / RBL Group)
- **Anno / Fonte**: _Human Resource Champions_ (1997) + articoli multipli (HBR 2004 "Capitalizing on Capabilities")
- **Link**: [Ulrich — 5 HR competencies (HRD Connect 2022)](https://www.hrdconnect.com/2022/02/28/dave-ulrich-5-hr-competencies-and-actions-to-enable-renewal-through-human-capability/) · [Dave Ulrich — HR Strategy & Organizational Capability](https://www.speakersassociates.com/speaker/dave-ulrich/) · [HBR — Capitalizing on Capabilities (Ulrich 2004)](https://hbr.org/2004/06/capitalizing-on-capabilities)
- **Classificazione**: C1 — fondazione HR teorica + modello HR-4-role operativo
- **Spiegazione**: Tesi: **"organizational capability outperforms individual talent as a business driver"**. 4-role HR model (Strategic Partner, Administrative Expert, Change Agent, Employee Champion). HR Competency Model con "Capability Builder" come competenza core. **11 intangible assets** (talent, speed, shared mind-set, accountability, collaboration, learning, leadership, customer connectivity, strategic unity, innovation, efficiency) — org excel in 3, parità in altri.
- **Integrazione in Heuresys**:
  - **Validazione della tesi Heuresys**: _"SAP manages how the company runs. Heuresys manages the company's ability to run"_ è la **stessa tesi** di Ulrich, ma strumentata
  - Concept nuovo: `hr-transformation-ulrich` — ancora teorica del posizionamento Heuresys
  - Sezione "11 intangible assets" di Ulrich mappa bene alle 5 dimensioni Heuresys ma è più granulare. **Idea**: usare le 11 intangibles come **sotto-dimensioni** di performance, per l'assessment
  - Il "Capability Builder" competency di Ulrich è essenzialmente **ciò che l'advisor Heuresys fa automaticamente** — framing potente per GTM
  - Ulrich è **la voce più autorevole** per interlocutori HR — citarlo è scelta commerciale obbligata

---

## C2 — Framework Enterprise (2 fonti)

### 2.1 BIZBOK + TOGAF Business Capability Map

- **Autore**: Business Architecture Guild (BIZBOK) + The Open Group (TOGAF)
- **Anno / Fonte**: BIZBOK v3+ (evolutivo), TOGAF 9.2 (integrazione con BIZBOK)
- **Link**: [Open Group TOGAF Business Capability](https://pubs.opengroup.org/togaf-standard/business-architecture/business-capabilities.html) · [Business Capabilities Guide (Bizzdesign)](https://bizzdesign.com/blog/business-capabilities-a-complete-guide)
- **Classificazione**: C2 — standard industriali per Enterprise Architecture
- **Spiegazione**: BIZBOK definisce "**enterprise on a page**" come high-level business capability map indipendente dalla struttura organizzativa e dai flussi di processo. TOGAF 9.2 integra capability come first-class entity nell'Enterprise Architecture. Le capability connettono _people + processes + information + resources_ per fornire valore.
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P4 (2026-04-25)**: [[source-bizbok-togaf-capability-map]] + [[bizbok-togaf-business-capability-map]] — differenziale **people inclusion foundational** (BIZBOK esclude, Heuresys integra) + mapping 34 aree Heuresys × BIZBOK Level 1 + feature gap `bizbok-bcm-export` F6+ GTM enterprise
  - **Importante**: BCM è **capability-centric** (come Heuresys). Ma BCM è **statico** (mappa piatta) mentre Heuresys è **grafo dinamico**. Citabile come: "Heuresys è BIZBOK BCM implementato come knowledge graph operativo"
  - Per **GTM enterprise**: interlocutori EA (CTO, Enterprise Architect) conoscono BIZBOK/TOGAF. Posizionare Heuresys come "BCM realizzato via ontologia ESCO + 3 prospettive" è linguaggio noto
  - **Gap proposta**: Heuresys potrebbe **esportare BCM standard BIZBOK-compatible** — feature di interoperabilità con EA tooling esistente (Bizzdesign, Avolution, Sparx EA)

### 2.2 ESCO — European Skills, Competences, Qualifications, Occupations

- **Autore**: European Commission
- **Anno / Fonte**: pubblicazione dal 2010, versione attuale v1.2+ (2025)
- **Link**: [ESCO Classification](https://esco.ec.europa.eu/en/classification) · [ESCO Download (RDF/OWL/SKOS)](https://esco.ec.europa.eu/en/use-esco/download)
- **Classificazione**: C2 — **substrate ontologico già presente in Heuresys**
- **Spiegazione**: Classificazione europea multilingua di **skills + competences + qualifications + occupations**. Usa **RDF + OWL + SKOS** (semantic web standard). Pillars: occupations (con hierarchical relationships + mapping ISCO) + skills (distinguere skill/competence vs knowledge). Disponibile in RDF/TTL/ODS/CSV/XML/JSON-LD per integrazione.
- **Integrazione in Heuresys**:
  - **Già integrato**: [[esco-knowledge-graph]] è core Heuresys (14k skill + 3k occupation + 126k relation + embeddings)
  - Arricchire [[esco-knowledge-graph]] con il **riferimento formale ufficiale** (URL classification, versioning upstream)
  - Dettaglio per [[kg-ontology-formalism]]: ESCO usa **RDF/OWL/SKOS** ma Heuresys ha scelto **Property Graph** (via [[kg-graph-layer]] pg*age) — c'è un \_impedance mismatch* gestito via conversione. Ipotesi di chiarimento futuro concept nuovo: `esco-ontology-formal` che documenti formalmente questa traduzione
  - **Tesi strategic**: ESCO come "public good" è il differenziatore chiave Heuresys vs Workday Skills Cloud (proprietario, ML-based, opaco)

---

## C3 — Top Consulting (7 fonti)

### 3.1 McKinsey — 9-box + OrgSolutions + State of Organizations 2026

- **Autore**: McKinsey & Company
- **Anno / Fonte**: 9-box matrix originale anni 70, OrgSolutions ongoing, State of Organizations 2026 (report)
- **Link**: [State of Organizations 2026](https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/the-state-of-organizations) · [McKinsey OrgSolutions](https://www.mckinsey.com/solutions/orgsolutions/overview)
- **Classificazione**: C3 — leader consulting globale
- **Spiegazione**: **9-box matrix** = performance × potential (3×3). **OrgSolutions** = portare "hard data, analytics, technology" alla "soft art of organizational leadership". **State of Organizations 2026** identifica 3 tectonic forces: AI technology, economic/geopolitical disruption, evolving employee expectations+demographics.
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P3 (2026-04-25)**: [[source-mckinsey-state-of-orgs]] + [[mckinsey-state-of-organizations]] — 9-box già nativo Heuresys + OrgSolutions commodity + OHI alternativa data-driven (feature gap `ohi-data-driven-scorecard` F6+) + 3 tectonic forces × value prop
  - ~~Concept nuovo: `mckinsey-9-box-ohi`~~ → concept creato come `mckinsey-state-of-organizations` (naming più ampio)
  - **Proposta feature**: l'**HR Director** (una delle [[three-access-perspectives]] di Heuresys) può eseguire automaticamente un 9-box su tutta l'organizzazione partendo dai dati di [[employee-timeline-event-sourcing]] + capability mapping → output feature **"9-box auto-generato data-driven"**, differenziatore vs calibrazione manuale
  - **OHI (Organizational Health Index)** di McKinsey è un survey. Heuresys può offrire alternative data-driven: score calcolato automaticamente da grafo + gap analysis
  - **State of Organizations 2026** — 3 tectonic forces allineate con Heuresys value prop (AI-ready via [[ai-advisor]], resilience via [[kg-scope-phase1]], skills-based via ESCO)

### 3.2 Deloitte — Skills-Based Organization Framework

- **Autore**: Deloitte + Josh Bersin (ex Bersin by Deloitte)
- **Anno / Fonte**: framework consolidato 2022-2024, report 2024 flagship
- **Link**: [Deloitte SBO Framework](https://www.deloitte.com/us/en/services/consulting/blogs/human-capital/skills-based-organization-skills-framework.html) · [Deloitte — The Skills-Based Organization Report PDF (2024)](https://www.deloitte.com/content/dam/insights/articles/2024/us175310_consulting-the-skills-based-org-report/di-the-skills-based-organization-report.pdf)
- **Classificazione**: C3 — competitor concettuale più convergente
- **Spiegazione**: SBO = shift da "managing employment in fixed jobs" a "dynamically orchestrating ever-evolving skills and work". Framework 3-element: **(1) Skills framework + common language**, **(2) Data + technology enablers** (single source truth skills data + integrated tools), **(3) Governance** (clear ownership + structures + change management). **63% in più probabilità di risultati** per org skills-based.
- **Integrazione in Heuresys**:
  - **Convergenza molto forte con Heuresys** — i 3 element SBO Deloitte = 3 componenti Heuresys:
    - Skills framework → [[esco-knowledge-graph]]
    - Data + technology → [[heuresys-hrms]] platform
    - Governance → [[rbp]] + 12 constraint + 3 ADR attivi
  - Concept nuovo: `skills-based-organization-deloitte` — riferimento principale per posizionamento
  - **Citazione magnete**: il "63% più probabilità risultati" è numero di impatto per investor pitch
  - **Rischio differenziazione**: Deloitte vende advisory-only (non ha prodotto). Heuresys ha prodotto software → _"Deloitte dice di fare SBO, Heuresys lo fa"_

### 3.3 BCG — People Strategy + Capability Building

- **Autore**: Boston Consulting Group
- **Anno / Fonte**: 2016 paper fondativo "Transformation That Lasts", update 2025 "Turbulent Times Call for a New People Strategy"
- **Link**: [BCG People Strategy](https://www.bcg.com/capabilities/people-strategy/overview) · [BCG — Turbulent Times Call for a New People Strategy (2025)](https://www.bcg.com/publications/2025/turbulent-times-call-for-a-new-people-strategy) · [BCG — Building Capabilities for Transformation That Lasts (2016)](https://www.bcg.com/publications/2016/transformation-people-organization-building-capabilities-transformation-that-lasts)
- **Classificazione**: C3 — leader consulting globale (competitor MBB)
- **Spiegazione**: BCG definizione: **capability = "an ingrained ability to do something well in a way that improves business performance"**. Framework 4-component: **competencies + tools + processes + governance**. Nel 2025 BCG raccomanda "workforce base adattabile e riconfigurabile in real time" — skills cross-functional, AI-augmented.
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P3 (2026-04-25)**: [[source-bcg-capability-building]] + [[bcg-capability-4-components]] — BCG subset Heuresys (3/4 componenti coperti) + quote _«ingrained ability»_ per [[capability]] §Definizione formale + 2025 People Strategy × value prop + L3+ threshold empirico _1-in-10 transformations_
  - **Mapping proposto**:
    - BCG _competencies_ = Heuresys [[competence]] (ESCO skills)
    - BCG _tools_ = non mappato direttamente (Heuresys si concentra su people/process/structure, non su tooling)
    - BCG _processes_ = Heuresys [[process]]
    - BCG _governance_ = Heuresys [[rbp]] + ADR attivi
  - BCG **non** include "structure" e "role" come dimensioni separate → Heuresys è **più granulare** su asse organizzativo. Argomento per pitch: _"BCG copre 4 dimensioni, Heuresys 5 + grafo"_
  - Arricchisce [[capability]] con definizione BCG ("ingrained ability") — utile come quote short-form

### 3.4 Bain — Operating Model + Org Navigator

- **Autore**: Bain & Company
- **Anno / Fonte**: ongoing, Org Navigator diagnostic tool
- **Link**: [Bain Organizational Design](https://www.bain.com/consulting-services/organization/organizational-design/) · [Bain Winning Operating Models](https://www.bain.com/insights/winning-operating-models-that-convert-strategy-to-results/)
- **Classificazione**: C3 — leader consulting globale
- **Spiegazione**: Tesi Bain: **"excel at only those few capabilities essential to realizing the strategy while being 'good enough' where that's sufficient"** (focus vs breadth). **Org Navigator** = diagnostic tool per assessing/identifying organizational performance gaps.
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P3 (2026-04-25)**: [[source-bain-operating-model]] + [[bain-operating-model]] — **direct mapping × [[capability-maturity-scale]]** (L3 threshold = Bain good-enough) + essential-capability-ranker F6+ feature gap + Bain Org Navigator-as-platform slogan
  - **Insight importante per Heuresys**: la tesi "few capabilities essential" può diventare una funzione **prodotto**: l'[[ai-advisor]] (o un concept nuovo `capability-prioritization`) suggerisce quali 3-5 capability sono _strategic_ per il tenant (top priority), quali _baseline_ (good enough)
  - Org Navigator = competitor diagnostic-tool diretto. Differenziazione Heuresys: Bain è project-based (fa assessment una tantum), Heuresys è platform-based (continuous)
  - Riferimento utile nel pitch GTM PMI 50-250: _"Bain-level diagnostics delivered as software"_

### 3.5 Accenture — Intelligent Organization Accelerator (IOA) + Talent & Organization

- **Autore**: Accenture
- **Anno / Fonte**: ongoing, IOA patented platform, 2025 focus Human+AI
- **Link**: [Accenture Talent & Organization](https://www.accenture.com/us-en/services/talent-organization) · [Accenture Intelligent Organization Accelerator (IOA)](https://www.accenture.com/us-en/services/talent-organization/operating-model-organization-design/intelligent-organization-accelerator)
- **Classificazione**: C3 — leader consulting "Big 4 digital"
- **Spiegazione**: IOA = "data-driven, generative AI-powered platform per operating model + organization design". Key focus 2025: **Human+AI collaboration** con co-learning continuo (solo **11% delle org** ready, gap enorme). Global Capability Centers (GCC): leader ISG 2025.
- **Integrazione in Heuresys**:
  - ✅ **Ingesta 2026-04-25** (residual C3 Big4): [[source-accenture-ioa]] + [[accenture-ioa-intelligent-organization]] — **competitor tecnologico diretto** (GenAI platform + operating model) counter-positioning 7-asse _«as subscription, non come Accenture project»_ + 89% mercato addressable + feature gap `ai-augmentation-score` F6+ + `gcc-multi-tenant-orchestration` F7+
  - **Differenziazione necessaria**: IOA è offerta di Accenture (locked-in al loro advisory), Heuresys è platform stand-alone. Posizionare: _"IOA-like capability as subscription, non come Accenture project"_
  - Il "Human+AI co-learning" di Accenture è **esattamente il ruolo** di [[ai-advisor]] Heuresys. Il 11% readiness è **mercato di riferimento** (89% org che vogliono ma non sanno come → target)
  - **Proposta feature**: `ai-augmentation-score` concept per valutare readiness Human+AI di un tenant

### 3.6 PwC — Workforce of the Future 2030

- **Autore**: PwC (People & Organisation service line)
- **Anno / Fonte**: Workforce of the Future (2017-ongoing), Global Workforce Hopes & Fears Survey 2025
- **Link**: [PwC Workforce of the Future 2030](https://www.pwc.com/gx/en/services/people-organisation/publications/workforce-of-the-future.html) · [PwC Workforce Hub](https://www.pwc.com/gx/en/services/workforce.html)
- **Classificazione**: C3 — leader consulting globale (Big 4)
- **Spiegazione**: Scenario analysis "4 colored worlds" (Red/Blue/Green/Yellow) per futuri alternative del lavoro 2030. Focus 2025: AI reshaping roles at pace + demographic shifts + hybrid work + rising expectations (flexibility, inclusion, purpose). PwC enfatizza "upskilling pathways visibili + equitable".
- **Integrazione in Heuresys**:
  - ✅ **Ingesta 2026-04-25** (residual C3 Big4 priority-basso): [[source-pwc-workforce-of-future]] + [[pwc-workforce-of-future-scenarios]] — 4 colored worlds × Heuresys positioning adapt (world-agnostic) + 4 forces 2025 × response + Hopes & Fears citation template. **Usage narrative/marketing primario** vs operational architecture.
  - **Meno prescrittivo dei competitor** (non dà un framework capability), più scenario-based. Ha valore **narrativo** per investor pitch ("il mondo va qui, Heuresys abilita")
  - PwC Hopes & Fears Survey 2025 = **data source pubblica** citabile per dimostrare domanda di mercato (workforce rewiring)
  - Più utile per comunicazione/marketing che per prodotto. Priorità bassa nell'integrazione wiki

### 3.7 Oliver Wyman + Mercer — Skill-Based Work Architecture

- **Autore**: Oliver Wyman (con Mercer)
- **Anno / Fonte**: ongoing, paper 2023 "Optimizing the Organization of the Future", 2024 "Build Future Sustainable Organization"
- **Link**: [Oliver Wyman People & Organizational Performance](https://www.oliverwyman.com/our-expertise/capabilities/people-and-organizational-performance.html) · [Oliver Wyman — Optimizing the Organization of the Future (2023)](https://www.oliverwyman.com/our-expertise/insights/2023/nov/optimizing-the-organization-of-the-future.html) · [Oliver Wyman — Build Future Sustainable Organization (2024)](https://www.oliverwyman.com/our-expertise/insights/2024/jun/build-future-sustainable-organization-boost-talent-and-value.html)
- **Classificazione**: C3 — **framework strutturalmente più vicino a Heuresys**
- **Spiegazione**: Skill-based work architecture (con Mercer) con **4 pillar**: **structure + roles + activity + skills**. Enfasi su: alignment workforce planning con strategic objectives, transformation holistic + senior leadership alignment + capability assessment + culture/norms.
- ✅ **Citazione letterale (Oliver Wyman 2024 «Build Future Sustainable Organization» — verifica WebFetch 2026-04-25)**:
  > _«Effective organizational transformation that embeds strategic workforce management into core operations requires a holistic methodology that captures value across the diverse pillars of **structure, roles, activity, and skills**.»_
  > 4 pillar → 4 step operativi: (1) osservare struttura + prevedere fabbisogni · (2) disegnare ruoli per workforce agile · (3) ottimizzare operazioni per sostenibilità · (4) equipaggiare talento.
- ℹ️ **Evoluzione 3 → 4 pillar**: il paper OW 2023 «Optimizing Organization of Future» propone **3-pillar** (Job architecture · _Value of work_ · Skills framework). La componente _value of work_ del 2023 è una **lente economica** non mappata 1:1 sulle 5 dim Heuresys — potenziale concept futuro per esplorazione (cfr. [[oliver-wyman-mercer-work-architecture]]).
- ℹ️ **Riattribuzione responsabilità interpretativa (intervista B Q11, 2026-04-25)**: il framing 4-pillar in questa entry era originariamente attribuito al ricordo di Enzo. La verifica ha confermato che era **risultato della ricerca approfondita LLM Wiki Agent** (responsabilità interpretativa LLM). Enzo era già consapevolmente a 5 dimensioni (performance inclusa) prima che il framing 4-pillar emergesse come ricerca esterna. La narrativa di posizionamento è **scenario B**: convergenza indipendente, validazione a posteriori (decisione D5).
- **Integrazione in Heuresys**:
  - ✅ **Competitor concettuale più vicino** — 4 pillar OW = 4 delle 5 dimensioni Heuresys (citazione verificata)
  - Mapping:
    - OW _structure_ = Heuresys [[structure]]
    - OW _roles_ = Heuresys [[role]]
    - OW _activity_ ≈ Heuresys [[process]]
    - OW _skills_ = Heuresys [[competence]]
    - **Heuresys in più**: [[performance]] (sviluppo autonomo, non extension cosciente di 4→5) + **grafo semantico unificante** ([[semantic-graph]] D1)
  - Concept dedicato: [[oliver-wyman-mercer-work-architecture]] — **benchmark comparativo** prioritario
  - ✅ **Open question intervista B chiusa** Q11: convergenza indipendente, non genealogia (cfr. [[oliver-wyman-mercer-work-architecture]] §Open question pivot risolta)

---

## C4 — Business Schools + Thought Leaders (4 fonti)

### 4.1 MIT Sloan — Organizational Design for Digital Transformation + SBO

- **Autore**: MIT Sloan School of Management + MIT SMR (Management Review)
- **Anno / Fonte**: exec education course ongoing, MIT SMR content recente
- **Link**: [MIT SMR — Unlocking the Skills-Based Organization](https://sloanreview.mit.edu/sponsors-content/unlocking-the-potential-of-a-skills-based-organization/) · [MIT Sloan Exec Ed — Organizational Design for Digital Transformation](https://executive.mit.edu/course/organizational-design-for-digital-transformation/a056g00000URaaNAAT.html)
- **Classificazione**: C4 — accademia applicata top-tier USA
- **Spiegazione**: 4-part organizational model per skills-based transformation. **5 key dimensions** per digital transformation. Approccio: "match skills to tasks" (flipping narrative da job-descriptions → skill-matching).
- **Integrazione in Heuresys**:
  - ✅ **Ingesta 2026-04-25** (residual C4): [[source-mit-sloan-organizational-design]] + [[mit-sloan-organizational-design-5d]] — 5 dimensions MIT × 5 dim Heuresys (complementary, strategic/behavioral vs structural/ontological) + 4-part × 7 pilastri + MIT SMR placement target
  - **Utile**: le "5 dimensions MIT Sloan per digital transformation" possono essere **mappate vs le 5 dimensioni Heuresys** (process/structure/role/competence/performance) per verificare convergenza/divergenza
  - MIT SMR = canale per articoli futuri _"Heuresys authored by Enzo"_ (placement strategic per credibilità accademica)
  - **Idea GTM**: il course "Organizational Design for Digital Transformation" MIT costa migliaia di $/participant. Heuresys lo fa come software continuous — positioning affordable

### 4.2 Harvard Business Review — Capitalizing on Capabilities (Ulrich 2004) + 11 Intangibles

- **Autore**: Dave Ulrich & Norm Smallwood (HBR)
- **Anno / Fonte**: HBR June 2004 (articolo seminale su capability measurement)
- **Link**: [HBR — Capitalizing on Capabilities (2004)](https://hbr.org/2004/06/capitalizing-on-capabilities)
- **Classificazione**: C4 — gold standard HBR, doppio contributo (autore + canale)
- **Spiegazione**: 11 intangible assets presenti in well-managed companies: **talent · speed · shared mind-set/brand · accountability · collaboration · learning · leadership · customer connectivity · strategic unity · innovation · efficiency**. Thesis: "organizations typically excel in only 3 of these capabilities while maintaining industry parity in the others".
- **Integrazione in Heuresys**:
  - **Doppio uso**: (1) come fonte Ulrich (vedi 1.5 sopra), (2) come **lista 11 intangibles** usabile in Heuresys come sotto-dimensioni operative
  - Concept nuovo: `ulrich-11-intangibles` — set di sotto-capability candidato per enrichment del modello Heuresys
  - **Proposta prodotto**: l'assessment Heuresys di un tenant può restituire output tipo "Your org excels in _accountability + learning + innovation_; parity on _speed/collaboration/efficiency_; **deficit on** _shared mind-set/leadership/strategic unity_" — output Ulrich-style da grafo semantico
  - **"Excel in 3"** diventa funzione di prioritization: Heuresys consiglia _su quali 3 capability focalizzarsi_

### 4.3 INSEAD — Strategy Execution Programme + 3 Propositions

- **Autore**: INSEAD faculty
- **Anno / Fonte**: Strategy Execution Programme (2-module), framework "Three Propositions"
- **Link**: [INSEAD Strategy Execution Programme](https://www.insead.edu/executive-education/strategy/strategy-execution-programme) · [INSEAD — New Framework for Strategic Execution](https://www.insead.edu/news/insead-study-provides-new-framework-strategic-execution)
- **Classificazione**: C4 — top EU business school
- **Spiegazione**: Framework "3 Propositions": **(1) Value proposition** (per buyers), **(2) Profit proposition** (robust per organization), **(3) People proposition** (motivating). Research data: **>50% managers** citano "implementation" come causa primaria di fallimento strategico; **67%** cita "lack of people and skills"; **50%** cita "ability to integrate acquired businesses".
- **Integrazione in Heuresys**:
  - ✅ **Ingesta 2026-04-25** (residual C4): [[source-insead-strategy-execution]] + [[insead-3-propositions-strategy-execution]] — 3 Propositions (Value/Profit/**People**) + 67% execution blocker killer number + People Proposition = Heuresys value prop materialized + risposta Q9 applicability-scope lens
  - **Numero killer**: "67% managers cite lack of people and skills" → **citazione da mettere in ogni deck Heuresys** (prova empirica del pain)
  - **People Proposition** di INSEAD è **esattamente** quello che Heuresys aiuta a formalizzare (aligning strategy → capability → role → skill → performance)
  - Risponde a open question: _quando il metodo fallisce?_ → INSEAD dice: quando manca "people proposition". Heuresys impedisce questo fallimento rendendolo **visibile ed evitabile**

### 4.4 Josh Bersin — Capability Academy + SBO

- **Autore**: Josh Bersin (Josh Bersin Company, ex Bersin by Deloitte)
- **Anno / Fonte**: articoli multipli 2020-2023, "Building a Skills-Based Organization: Sober Reality" 2023
- **Link**: [Josh Bersin — Building a Skills-Based Organization: Sober Reality (2023)](https://joshbersin.com/2023/07/building-a-skills-based-organization-the-exciting-but-sober-reality/) · [Josh Bersin — Building A Company Skills Strategy (2022)](https://joshbersin.com/2022/02/building-a-company-skills-strategy-harder-and-more-important-than-it-looks/)
- **Classificazione**: C4 — thought leader #1 di dominio HR Tech
- **Spiegazione**: **Capability Academy** = "architected collection of programs, content, experiences, assignments, and credentials based on a functional area". Organizzazione apprende **around business-specific, critical capabilities** (not generic skills). Distinzione: _generic skills_ vs _business-contextualized skills_ (unique, exclusive, proprietary to company).
- **Integrazione in Heuresys**:
  - ✅ **Ingesta P5 (2026-04-25)**: [[source-bersin-capability-academy]] + [[bersin-capability-academy]] — Capability Academy × 5 componenti Heuresys (4/5 già supportati) + distinction generic/contextualized mapping architettura ex-ante + **feature pivot `capability-academy-autogen` F6+ alto-valore commerciale** + positioning _«resolve hard part»_ vs SBO sober reality
  - **Validazione strategica**: la distinzione "generic skills vs business-contextualized skills" di Bersin è **esattamente** il confine tra [[esco-knowledge-graph]] (generic ESCO) e tenant-specific overlay in Heuresys (crosswalk ESCO↔NACE per industry profile tenant)
  - **Proposta feature prodotto**: Heuresys può **generare automaticamente** una Capability Academy per un tenant partendo dal grafo (gaps identificati → learning path → enrollment). Framing commerciale: _"Bersin Capability Academy as an auto-generated output from your org graph"_
  - **Citazione sobrietà 2023**: Bersin ammette che SBO _"exciting but hard"_ — utile per posizionare Heuresys come _"tool che risolve il hard part"_

---

## Cross-cutting osservazioni

### Convergenza framework vs unicità Heuresys

Dai 18 framework raccolti emerge un **pattern di convergenza**:

- Tutti definiscono capability come **costrutto multi-componente** (skills + structure + processes + governance + altro)
- Tutti riconoscono che **capability > individual talent** (tesi Ulrich 2004 che è diventata mainstream)
- La maggior parte (9/18) tratta capability come **asset strategico misurabile**

**Cosa nessuno ha** (= differenziazione Heuresys):

1. **Ontologia computable** aperta (ESCO-native) come substrate
2. **Knowledge graph** come modello primario (non come strumento di reporting)
3. **3 prospettive unificate** (Process Owner + Dir. Org + HR) sullo stesso grafo
4. **Platform continuous** vs project-based consulting

### Priorità di integrazione (proposta)

| Priorità | Fonti da trattare per prime                                              | Motivo                                       |
| -------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| **P1**   | Ulrich (1.5+4.2) + Deloitte/Bersin SBO (3.2) + Oliver Wyman (3.7)        | Convergenza più forte + validation tesi      |
| **P2**   | Prahalad-Hamel (1.1) + Teece (1.2) + Barney (1.3)                        | Fondazione accademica ortodossa (cite-power) |
| **P3**   | McKinsey (3.1) + BCG (3.3) + Bain (3.4)                                  | MBB credibility per board/investor           |
| **P4**   | BIZBOK/TOGAF (2.1) + INSEAD (4.3) + MIT Sloan (4.1)                      | Framework standard + academic-ready content  |
| **P5**   | Accenture (3.5) + PwC (3.6) + Nelson-Winter (1.4) + Bersin Academy (4.4) | Secondary, per completezza                   |

### Open question che le fonti **confermano** ma non chiudono

- _Come si misura capability senza ridurla a somma di competenze?_ → Tutti i framework lo pongono, nessuno dà una metrica univoca. Heuresys può **inventare** la sua (graph-based capability score) e diventare standard
- _Maturity model?_ → Bain ha "essential vs good-enough" (proto-maturity). Ulrich ha "excel in 3 of 11" (proto-maturity). Heuresys può produrre il proprio
- _Role vs position?_ → Nessun framework lo risolve pulito. Gap teorico ancora aperto

### Competitor diretti (prodotto) da approfondire in prossima ricerca (non fatto ancora)

Non ancora coperti nelle 18 ricerche — da ingerire in fase C-3 se Enzo vuole:

- **Nakisa/OrgVue/Concentra** — competitor più diretto (org design platform)
- **Eightfold AI** — talent intelligence ML-based
- **Workday Skills Cloud** — skills ontology proprietaria
- **SAP Signavio** — process intelligence (completa il lato process)
- **Lightcast (ex Burning Glass)** — labor market skill taxonomy
- **Visier** — people analytics
- **Gloat** — internal talent marketplace
- **Beamery** — talent lifecycle management

## Next steps

1. **Accordo Enzo su priorità P1-P5** (questo file è pre-ingest proposta)
2. **Creazione source pages** per le fonti selezionate, partendo da P1 (prossimo turno)
3. **Creazione concept pages** per ciascun framework (arricchimento wiki)
4. **Synthesis comparativa** "Heuresys vs Adjacent Frameworks" (post source+concept)
5. **Possibile C-3**: ricerca competitor diretti elencati sopra

## Changelog

- 2026-04-24: prima stesura — 18 fonti da ricerca web 2026-04-24, classificate in 4 cluster + priorità P1-P5 + ipotesi integrazione

## C5 — Competitor tech specifici (NEW 2026-04-25 fine S2)

Cluster aggiunto post-2026-04-25 per documentare competitor tech catturati via WebSearch durante sessione Heuresys (no batch ingest, riferimenti puntuali per pitch board/investor).

### 5.1 Beamery — Talent Lifecycle Management (skill ontology proprietary)

- **Vendor**: Beamery (UK-headquartered, founded 2014)
- **Anno / Fonte**: WebSearch 2026-04-25 (https://beamery.com)
- **Funding**: $235M Series E (2022)
- **Customer base**: LinkedIn, AB InBev, GSK, Schneider Electric, Vodafone
- **Skill ontology**: ~16.000 canonical skills derived via AI inference da 20M unnormalized strings (claim 90% accuracy on first review per Job Architecture autogen)
- **Architecture approach**: Knowledge Graph approach a talent management
- **Classificazione**: C5 — competitor tech più vicino a [[capability-academy-autogen]] su asse Job Architecture autogen
- **Spiegazione**: Talent Lifecycle Management AI-powered (hiring + mobility + development). Focus: pre-hire (sourcing) + intra-hire (mobility) + post-hire (development). Skill ontology proprietary lock-in (no public ESCO, no NACE crosswalk).
- **Integrazione in Heuresys**:
  - ✅ Catalogato in [[heuresys-vs-competitors]] §8 (NEW 2026-04-25) come **competitor concettuale più vicino** sul layer Job Architecture autogen
  - ✅ Entity stub creata 2026-04-25 21:15: [[competitor-beamery]]
  - ✅ Differenziatore Heuresys vs Beamery articolato (4-asse): (a) ESCO standard vs proprietary 16K, (b) integrazione full 5-dim vs solo talent, (c) maturity scale L0-L5 quantitativa vs assente, (d) self-issued credentials integrate vs partnership esterne dipendente
  - **Future tracking**: re-scan funding/customer base ogni 6 mesi per detect movement (acquisition Beamery? expansion mercati EU?)

### 5.2 Workday Skills Cloud — Skills ontology proprietary su HCM

- **Vendor**: Workday (US-headquartered, IPO 2012)
- **Anno / Fonte**: WebSearch 2026-04-25 (https://www.workday.com/en-us/products/human-capital-management/skills-cloud.html)
- **Skill ontology**: **5 miliardi skill** (vs 25M al lancio 2018) — consolidamento ML-driven da customer tenants + training data
- **Sinonimi handling**: gestisce sinonimi (es. _patient management_ → urgent care + clinical trials) via ML inference
- **Integration Workday stack**: nativo in Recruiting / Learning / Talent / Analytics modules
- **Classificazione**: C5 — competitor enterprise HCM full-suite (alternativa locked-in vs Heuresys modulare)
- **Spiegazione**: Workday Skills Cloud è **layer skills** sopra Workday HCM. Approach: ML-based universal skill extraction da job descriptions + employee profiles + training data. Black-box (no public ontology). Lock-in vendor (Workday-only).
- **Integrazione in Heuresys**:
  - ✅ Catalogato in [[heuresys-vs-competitors]] §5 (espanso 2026-04-25) "Workday + Skills Cloud (focus tech)" — full detail 5B skill + ML inference + sinonimi
  - **Coexistence pattern documentato**: Heuresys può sedere **sopra** Workday HCM consumando data export skill ontology Workday → ESCO mapping conversion. Posizionamento "complement, not replace" per audience enterprise con Workday established.
  - **Differenziale Heuresys**: ontologia **aperta** [[esco-knowledge-graph]] (public good europeo, no lock-in) + crosswalk NACE pubblico (4.565) + process layer first-class + modulare/lightweight (no full HCM replacement).
  - **Future tracking**: monitor Workday Skills Cloud evolution + new feature releases (es. potenziale annuncio open API per skill export?)

### 5.3 Concentra (rebrand OrgVue 2024) — Org Design + Workforce Planning

- **Vendor**: Concentra (rebrand OrgVue post acquisition 2024)
- **Anno / Fonte**: WebSearch 2026-04-25 + cross-reference history OrgVue
- **Customer base**: Coca-Cola, Disney, NHS, Vodafone, BAE Systems
- **Product line**: Org design + workforce planning + scenario modeling (people analytics esteso post-rebrand)
- **Classificazione**: C5 — competitor tech storico (rinominato 2024)
- **Spiegazione**: Erede di OrgVue/Nakisa. Solo Porta 2 (struttura) di [[three-access-perspectives]] Heuresys. Rebrand 2024 ha aggiunto people analytics ma **non** integrato process + skill knowledge graph.
- **Integrazione in Heuresys**:
  - ✅ Catalogato in [[heuresys-vs-competitors]] §1 (rebrand noted) + §9 (cross-ref)
  - ✅ Entity stub creata 2026-04-25 21:15: [[competitor-concentra]]
  - **Differenziatore Heuresys**: 3 prospettive integrate vs Concentra 1 (struttura), ESCO knowledge graph standard vs Concentra skill catalog imported, process layer first-class vs assente.

---

## Note su cluster C5 vs altri cluster

C5 introduce un nuovo asse di classificazione: **competitor tech specifici** (vs C1 academic + C2 enterprise standards + C3 consulting offering + C4 business schools/thought leaders). Vendor con product running, not framework descriptive. Pattern espandibile per future competitor (es. Eightfold detail, Visier expansion, Lightcast taxonomy, Gloat marketplace).

Tracking proposto: cluster C5 review semestrale per (a) update funding/customer numbers, (b) detect new entrants (es. AI-native competitors emerging Q3-Q4 2026), (c) track acquisitions / consolidations.

---

## Source attribution

- **Imported from**: external Heuresys wiki — `C:\Users\enzospenuso\wiki-space\heuresys-wiki\wiki\external_sources.md`
- **Imported at**: 2026-05-04 (S10)
- **Wikilink status**: `[[X]]` Obsidian-style preserved as-is. Resolution to markdown links `[X](path)` deferred to S11 (task: map wiki paths → evo repo paths)
- **Frontmatter status**: original Obsidian frontmatter preserved at top of file. Cleanup deferred to S11 if needed
- **Re-import policy**: this file is a snapshot at import time. To refresh, re-run wiki import workflow against the source path above
