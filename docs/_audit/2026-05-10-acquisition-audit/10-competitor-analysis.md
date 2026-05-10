# D9 — Competitive landscape & market position

> **Acquisition Due Diligence — Senior Market Research Analyst report**
> Target: `heuresys-evo` SaaS B2B Organizational Intelligence platform
> Date: 2026-05-10 · Method: WebSearch + WebFetch live + 3 internal strategy docs
> Severity: **medium** (defensible wedge condizionale, no incumbent ESCO-native EU)

---

## TL;DR (≤150 parole)

heuresys-evo si posiziona in una categoria emergente ("Organizational Intelligence") sovrapposta a 4 mercati maturi: HR Analytics ($4.1B 2026 → $6.13B 2030, CAGR 10.6%), HR Tech ($47.5B 2026 → $77.7B 2031, CAGR 10.35%), Talent Intelligence (Eightfold/Beamery/Gloat) e EA/BCM. Nessun incumbent occupa il combo specifico **ESCO-native + Knowledge Graph + multi-tenant + 3-perspectives + EU-first**. I giganti (Workday, SAP, Oracle, MS Viva) dominano HCM full-suite con skill ontologie proprietarie ML-driven e pricing $8-30 PEPM (min 1000 seat); gli specialist Tier 2 (Eightfold $410M raised, Beamery $223M, Gloat $192M) hanno scala 100-500x heuresys ma usano grafi proprietari. Il wedge difendibile esiste **se** heuresys mantiene focus PMI 50-500 EU regulated (PA italiana, banking, healthcare) dove ESCO+CCNL è requirement, non commodity. Threat principale: SAP Talent Intelligence Hub 1H 2026 sta aggiungendo skills governance — finestra strategica 12-18 mesi. **Raccomandazione D9: NEGOTIATE** (con sconto su valuation per absent commercial traction).

---

## 1. Market segmentation

### 1.1 TAM / SAM / SOM stimati per "Organizational Intelligence Platform" EU

heuresys-evo non è in una categoria standard di analyst report. La TAM va costruita per intersezione di 3 segmenti adiacenti.

| Layer                                                               | Definizione                   | Globale 2026                                                                | EU share (~30%)                                                                                                                   | Fonte                          |
| ------------------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **TAM lordo** (HR Tech full)                                        | Tutto HR software/cloud       | $47.5B                                                                      | ~$14.2B                                                                                                                           | Mordor Intelligence            |
| **TAM netto** (HR Analytics + Talent Intel)                         | Sottoinsieme analytics+skills | $4.1B (analytics only) + ~$2-3B (Talent Intel sub-segment estimato) ≈ $6-7B | ~$1.8-2.1B                                                                                                                        | Research and Markets           |
| **SAM** (EU mid-market regulated, skills-based, 50-2000 employee)   | Settore target heuresys-evo   | n/a                                                                         | ~$300-500M (stima derivata: 60% large EU enterprise usano analytics, ~70% prioritize talent — ma SOM compreso solo PMI/regulated) | Market Data Forecast (60%/70%) |
| **SOM realistico 5y** (ESCO-native + multi-tenant + bilingue IT/EN) | Differential heuresys         | n/a                                                                         | **~$15-30M** (3-6% del SAM EU, ottimistico per single-vendor early-stage)                                                         | Stima analitica                |

**Caveat severità HIGH**: nessun analyst mainstream (Gartner, Forrester, IDC) tracciava la categoria "Organizational Intelligence" prima del 2025. Heuresys-evo deve crearla, non inserirsi. Il rischio di category-creation failure va prezzato in due diligence.

### 1.2 Driver di crescita confermati da web research

- **62% delle organizzazioni** sta ricostruendo job architecture skill-based entro 2 anni (Mercer Skills Snapshot 2024-2025) — finestra di adozione attiva
- **>60% large EU enterprise** ha già integrato HR analytics (Market Data Forecast EU report)
- **70% companies EU** prioritize analytics per talent — adozione mainstream, non early
- **GDPR + EU AI Act** spingono verso platform EU-resident con ontology trasparente vs ML black-box (vantaggio competitivo per ESCO open vs Workday Skills Cloud proprietary)

---

## 2. Competitor feature matrix

10 player × 10 capability axes. Legenda: ✅ pieno · ⚪ parziale · ❌ assente · ❓ non disclosed.

| Capability axis                       | Workday Skills Cloud          | SAP TIH                       | Oracle HCM             | MS Viva People Skills | Eightfold AI                | Gloat                    | Beamery                       | Lattice      | Personio           | Hibob         | **heuresys-evo**                         |
| ------------------------------------- | ----------------------------- | ----------------------------- | ---------------------- | --------------------- | --------------------------- | ------------------------ | ----------------------------- | ------------ | ------------------ | ------------- | ---------------------------------------- |
| Multi-tenant native                   | ⚪ tenant-per-customer        | ⚪ tenant-per-customer        | ⚪ tenant-per-customer | ⚪ tenant=M365        | ✅                          | ✅                       | ✅                            | ✅           | ✅                 | ✅            | ✅                                       |
| Knowledge Graph ontology              | ⚪ ML opaque, 5B "skills"     | ⚪ unified Attributes Library | ⚪ Dynamic Skills      | ⚪ AI inferenced      | ⚪ Talent Graph proprietary | ⚪ Loomra KG proprietary | ⚪ Talent Graph 16K canonical | ❌           | ❌                 | ❌            | ✅ pg_age + ESCO public                  |
| ESCO mapping native                   | ❌                            | ❌                            | ❌                     | ❌                    | ❌                          | ❌                       | ❌ (proprietary 16K)          | ❌           | ⚪ via integration | ❌            | ✅ 14k skill + 3k occ + 126k rel         |
| RBP fine-grained (8 ruoli × 33 aree)  | ⚪ standard roles             | ⚪ permission groups          | ⚪ data roles          | ⚪ Entra roles        | ❌                          | ❌                       | ❌                            | ⚪ basic     | ⚪ basic           | ⚪ basic      | ✅ 179 RBP joins canonical               |
| AI advisor / agent                    | ✅ Workday Agents 2026        | ✅ AI Units licensed          | ✅ embedded            | ✅ Copilot agents     | ✅ AI Interviewer           | ✅ Career Coach Agent    | ✅ Ray (workforce planning)   | ⚪ basic     | ⚪ basic           | ⚪ basic      | ⚪ scaffolded `/api/ontology/advisor`    |
| EU compliance / GDPR data residency   | ✅ locality rules per-country | ✅ EU localization packs      | ✅                     | ✅ M365 EU regions    | ⚪ via AWS/GCP              | ⚪ via AWS/GCP           | ✅ UK-based                   | ⚪           | ✅ EU-native       | ✅ EU regions | ✅ bare-metal OCI EU + RLS DB-level      |
| Customizable role views (data-driven) | ⚪ via configurator           | ⚪ via Story Reports          | ⚪ OTBI                | ⚪ via Power Platform | ⚪                          | ⚪                       | ⚪                            | ⚪           | ⚪                 | ⚪            | ✅ `role_default_dashboards` 7 preset    |
| Audit logging (tenant-aware)          | ✅                            | ✅                            | ✅                     | ✅                    | ✅                          | ✅                       | ✅                            | ✅           | ✅                 | ✅            | ✅ `audit_logs` + `auditedTransaction()` |
| On-prem / single-tenant deploy option | ❌ cloud-only                 | ❌ cloud-only                 | ⚪ Cloud@Customer      | ❌ cloud-only         | ❌                          | ❌                       | ❌                            | ❌           | ❌                 | ❌            | ✅ bare-metal possibile                  |
| API-first / open ontology             | ⚪ Workday APIs proprietary   | ⚪ SAP APIs proprietary       | ⚪ Oracle REST         | ⚪ Graph API          | ❌ ML black-box             | ❌ proprietary KG        | ❌ proprietary 16K            | ⚪ basic API | ⚪ REST            | ⚪ REST       | ✅ Express + pg_age + ESCO public        |
| **Score (10 max)**                    | **5.5**                       | **6.0**                       | **6.5**                | **5.0**               | **5.5**                     | **5.5**                  | **5.5**                       | **3.0**      | **5.0**            | **4.5**       | **9.5**                                  |

> **Nota interpretazione score**: il valore alto di heuresys-evo riflette **completezza degli assi capability axes**, non maturità di mercato. Nei competitor ⚪/⚪/⚪ significa "feature maturo che 1000+ enterprise usano in produzione"; in heuresys ✅ significa "feature codificato in DB e funzionante per 4 tenant test". L'asimmetria scale è critica per la due diligence.

---

## 3. Tier-by-tier deep dive

### 3.1 Tier 1 — Giganti HCM full-suite

Tutti operano per "minimum seat count" (Oracle 1000+, Workday simil), pricing PEPM bundled.

| Vendor                     | Positioning 1-line                                                              | Pricing pubblico                                                              | Customer base proxy                                           | Threat per heuresys                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Workday Skills Cloud**   | ML-driven 5B skill universal taxonomy on top of HCM                             | $100-504/employee/anno; mid-market $175-212K Y1; large enterprise $4-5.7M Y1  | 11.000+ customer, $7.6B ARR FY24                              | **Alto** — Workday Agents 2026 release sta aggiungendo autonomous workforce planning. Lock-in pre-esistente nei clienti enterprise = barrier per heuresys         |
| **SAP SuccessFactors TIH** | Unified Attributes Library + AI inference + Skills Governance (1H 2026 release) | "Contact sales"; AI Units add-on premium; HCM SF licensing tipico $10-25 PEPM | ~10.000 enterprise, dominante in Europa banking/manufacturing | **Alto** — 1H 2026 release ha **skills governance enhanced** che è il claim core heuresys. Localization packs EU completi                                         |
| **Oracle HCM Cloud**       | Dynamic Skills + recruiting/learning/perf integrato                             | $8/employee/mese (talent only, min 1000 seat); $25-30 PEPM all-modules        | ~30.000 customer Oracle enterprise stack                      | **Medio** — solo dove Oracle ERP già installato. Min 1000 seat esclude PMI EU target heuresys                                                                     |
| **MS Viva People Skills**  | Skills profiles + Copilot agents nativi in M365                                 | $12/user/mese (Viva Suite); People Skills incluso in Copilot license          | 400M+ M365 commercial users (potenziale)                      | **Critico-emergente** — Microsoft può azzerare il segmento con bundle Copilot. Ma manca knowledge graph esplicito + ESCO. **Differenziale heuresys da difendere** |

### 3.2 Tier 2 — Specialist Talent Intelligence

Categoria nata 2018-2022, ben fondata, pricing enterprise non-disclosed.

| Vendor           | Positioning                                                                         | Funding                                                           | Customer base proxy                                                      | Threat per heuresys                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Eightfold AI** | Deep learning sui 1.6B career profiles → AI hiring + reskilling + internal mobility | $410M total raised (Series E $220M 2021, $2.1B valuation)         | 110 paesi, F500 (Bayer, CapitalOne, Vodafone, EY, Coca-Cola Europacific) | **Alto** — scala enterprise schiacciante, ma ML black-box (non ESCO)                                             |
| **Gloat**        | Internal Talent Marketplace + Career Coach Agent (Loomra KG)                        | $192M raised (Series D $90M 2022); ARR cresciuto 5x pandemia      | 120 paesi, Unilever/PepsiCo/Schneider/HSBC/Nestlé                        | **Medio** — focus job-matching interno, non ontologia capability completa. Coexistenza possibile                 |
| **Beamery**      | Talent Lifecycle Management (sourcing → development) + Talent Graph 16K             | $223M raised (Series D $50M unicorn $1B); UK-based (vantaggio EU) | "Hundreds" enterprise + 25.000 user (GM, VMware, J&J)                    | **Medio-alto** — UK base + KG approach + Job Architecture autogen = competitor concettuale primario per heuresys |
| **Lattice**      | Performance + OKR + Engagement (mid-market)                                         | $328.5M total raised (no nuovi round dal 2022); M&A Mandala 2026  | Mid-market US/global; $11-25 PEPM modular                                | **Basso** — focus performance/engagement, non skills-ontology. Adiacenza, non sovrapposizione                    |

### 3.3 Tier 3 — EU specialist HR SMB

| Vendor           | Positioning                             | Pricing                                            | Customer base                         | Threat                                                                                                                                                   |
| ---------------- | --------------------------------------- | -------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Personio**     | All-in-one HR EU SMB (50-2000 employee) | €8-15 PEPM full suite; €2.4-4K/mo per 200 employee | ~12.000 customer EU (DACH dominante)  | **Alto per market access** — Personio è il default EU SMB, ma non ha skills ontology. Heuresys può integrarsi sopra (rischio: Personio aggiunge feature) |
| **Factorial HR** | EU SMB lower-cost alternative           | €4-6 PEPM (più trasparente di Personio)            | ~13.000 SMB SUR/Sud Europa            | **Medio** — pricing aggressive, ma feature set basic. Non concorrente diretto su capability layer                                                        |
| **Hibob**        | Modern people platform mid-market scale | $5-15 PEPM                                         | ~3.500 customer (focus tech/scale-up) | **Basso-medio** — orientata UX/engagement, no ESCO                                                                                                       |

### 3.4 ESCO niche — chi davvero usa ESCO commercialmente

Il search WebFetch sul sito ESCO ufficiale (escopedia/esco-api) **non documenta nessun vendor commerciale** che usi l'API in produzione. Search collaterali identificano:

| Player                     | Uso ESCO                                                             | Note                                                              |
| -------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **EURES** (EU Commission)  | ESCO-native job portal pubblico                                      | Non commerciale, public good, non competitor                      |
| **Actonomy** (BE)          | HR-ontology proprietaria 500K concept che integra ESCO               | Vendor B2B HR matching, non SaaS multi-tenant capability platform |
| **AIHR.com**, **Bryq.com** | Reference pubbliche a ESCO come ontology pattern                     | Content marketing, non product                                    |
| **heuresys-evo**           | ESCO 14k skill + 3k occupation + 126k relation + crosswalk NACE/CCNL | Differential strutturale verificato                               |

> **Finding di rilevanza M&A high**: nessun competitor SaaS B2B EU usa ESCO come substrate primario in modo commercialmente attivo. Questo è il **wedge unico verificabile** di heuresys-evo. Vale la valutazione del DD se questo wedge è (a) difendibile (b) commercialmente desiderato dai buyer (PMI EU regulated).

---

## 4. Heuresys-evo differentials (cosa fa di unico)

| #   | Differential                                                    | Componente codice                             | Quanto è defensible                                                            |
| --- | --------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | ESCO ontology native (open vs proprietary)                      | `esco-knowledge-graph` + pg_age               | **Alto** — public good, no vendor lock-in, EU AI Act friendly                  |
| 2   | Property graph come modello dati primario                       | pg_age + 7-layer architecture                 | **Medio** — Beamery/Gloat hanno KG proprietary, heuresys ha KG aperto          |
| 3   | Multi-perspective unificata (Process Owner / Org Director / HR) | `pet_perspectives` (47 mapping)               | **Alto** — nessun competitor copre 3 personas su singolo grafo                 |
| 4   | Bilingue IT/EN nativo (CCNL crosswalk)                          | tenant.locale + ESCO IT translations          | **Alto per IT mercato**, basso fuori IT                                        |
| 5   | RLS DB-level + RBP fine-grained (367 policies + 179 joins)      | Postgres RLS + `requirePermission` middleware | **Medio** — tecnicamente solido, ma Workday/SAP ha equivalenti via app-layer   |
| 6   | On-prem / bare-metal deploy possibile                           | systemd + bare-metal Postgres                 | **Alto per regulated** (PA italiana, healthcare, defense, banking tier-2)      |
| 7   | Audit log atomico transazionale                                 | `auditedTransaction()` helper                 | **Medio** — feature standard enterprise, ma implementazione clean              |
| 8   | Customizable role views data-driven (7 preset brand-fedeli)     | `role_default_dashboards` + DashboardRenderer | **Basso** — competitor hanno equivalenti via Story Reports/OTBI/Power BI embed |

---

## 5. Heuresys-evo deficits vs competitor

| #   | Deficit                                                            | Gap rispetto a chi                                   | Effort estimate per chiudere                                    |
| --- | ------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Zero customer paganti, 4 tenant test only                          | Tutti i competitor (10K+ customer)                   | Years of GTM, not engineering                                   |
| 2   | AI advisor scaffolded, non agentic                                 | Workday Agents 2026, Gloat Career Coach, Beamery Ray | 6-12 mesi engineering + ML team                                 |
| 3   | No talent acquisition / sourcing module                            | Eightfold, Beamery, Gloat                            | 12-18 mesi                                                      |
| 4   | No native learning/training module                                 | SuccessFactors, Workday Learning, MS Viva Learning   | 12-24 mesi                                                      |
| 5   | No mobile app                                                      | Tutti Tier 1+2                                       | 6-9 mesi                                                        |
| 6   | 0 Gartner/Forrester analyst coverage                               | Tutti i Tier 1+2 inclusi nei MQ                      | 18-36 mesi GTM + PR                                             |
| 7   | No SOC2 / ISO 27001 / HIPAA cert                                   | Tutti i Tier 1, alcuni Tier 2                        | 6-12 mesi compliance work + audit cost ~$50-150K                |
| 8   | No partnership ecosystem (system integrator, big consulting)       | Tutti i Tier 1 hanno Deloitte/PwC/Accenture practice | Years                                                           |
| 9   | Skills ontology limitata a ESCO 14k vs Workday 5B / Eightfold 1.6M | Tutti i Tier 1+2                                     | Decisione strategica: vantaggio (curato) vs handicap (scarsità) |
| 10  | No marketplace / ecosystem app store                               | Workday App Center, SAP Store                        | Years                                                           |

---

## 6. Wedge analysis

### 6.1 Dove heuresys-evo può essere #1, anche se piccolo

**Ipotesi wedge primaria**: PMI italiane regulated 50-500 employee con requirement bilingue IT/EN, CCNL/NACE compliance, ESCO mapping, governance auditabile DB-level.

| Sub-segment                                          | Dimensione stimata           | Defensibility heuresys                                                     | Note                                                   |
| ---------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| PA italiana centrale e regionale (skills+CCNL)       | ~3.000-5.000 enti potenziali | **Alto** — Workday/SAP non hanno CCNL native; ESCO è EU mandate de facto   | Sales cycle lungo (12-24 mesi), CONSIP/MEPA dependency |
| Banking IT tier-2/3 (regulated, no Workday yet)      | ~50-100 banche IT            | **Medio-alto** — RLS DB-level + audit + on-prem option = compliance fit    | Concorrenza Personio/Zucchetti                         |
| Healthcare IT (ospedali, ASL, IRCCS)                 | ~200-300 enti                | **Medio** — ESCO healthcare occupations + CCNL sanità                      | Procurement complesso                                  |
| Manufacturing PMI 100-500 employee skills-based      | ~5.000-10.000 in IT          | **Basso** — Personio/Zucchetti dominanti, no skill-driven need urgente     | Highest market size, lowest fit                        |
| Consulting boutique che vogliono platform whitelabel | ~500-1.000 in EU             | **Medio** — multi-tenant native = fit; ma richiede partnership model nuovo | Channel play                                           |

### 6.2 Slogan wedge difendibile

> **"L'unica platform EU che strumenta ESCO + CCNL + multi-tenant + audit DB-level per PMI/PA regulated bilingui IT/EN che vogliono governance skills-based senza lock-in Workday."**

Specificità così alta da essere quasi una nicchia, ma esattamente il punto: in una nicchia difesa heuresys può essere #1 vs #15 in un mercato generalista.

---

## 7. Threat-by-threat assessment (5-7 minacce esistenziali)

| #   | Minaccia                                                                                                                     | Player driver           | Time-to-impact | Probabilità                                    | Severity                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------- | ---------------------------------------------- | -------------------------------------- |
| 1   | SAP SuccessFactors TIH 1H 2026 release aggiunge skills governance + EU localization completi                                 | SAP                     | **6-12 mesi**  | Alta (già rilasciato)                          | **Critical**                           |
| 2   | Microsoft Viva People Skills bundled in Copilot azzera il PEPM segment (free a fronte di Copilot license esistente)          | Microsoft               | 12-18 mesi     | Alta                                           | **High**                               |
| 3   | Workday Agents 2026 + autonomous workforce planning rende advisor heuresys obsoleto prima del lancio                         | Workday                 | 12-18 mesi     | Media-alta                                     | **High**                               |
| 4   | Eightfold/Gloat/Beamery espandono in EU mid-market con discount aggressivi (war chest funding $200-400M each)                | Tier 2                  | 18-24 mesi     | Media                                          | **Medium**                             |
| 5   | EU Commission rilascia "ESCO Studio" reference SaaS open-source che commodity-izza il differential heuresys                  | EU Commission           | 24-36 mesi     | Bassa                                          | **Medium**                             |
| 6   | Personio aggiunge skills/capability layer per difendersi da Workday entry in EU SMB                                          | Personio                | 12-24 mesi     | Media                                          | **Medium**                             |
| 7   | LLM commodity (GPT/Claude/Gemini agents) rende il Knowledge Graph heuresys obsoleto vs prompt-engineered talent intelligence | OpenAI/Anthropic/Google | 12-18 mesi     | Alta in domini generali, bassa in EU regulated | **Medium** (dipende da posizionamento) |

---

## 8. BUY/NEGOTIATE/PASS preliminary su D9

| Dimension                       | Verdict             | Rationale                                                                                                 |
| ------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| Defensible wedge esiste?        | **Condizionale-Sì** | Solo se focus PMI/PA EU regulated bilingui IT/EN. Wedge generalista enterprise = NO                       |
| Tech differential verificabile? | **Sì**              | ESCO native + KG + RLS + on-prem option = combo unica documentata                                         |
| Commercial traction?            | **No**              | 0 paying customer, 4 test tenant. Years dalla validation                                                  |
| Time-to-market window?          | **12-18 mesi**      | SAP TIH + MS Viva agent stanno chiudendo la finestra                                                      |
| Competitor M&A risk?            | **Medio**           | Non c'è dominante che possa "schiacciare" in 12 mesi, ma Workday/SAP possono assorbire feature in 18 mesi |

**Raccomandazione D9**: **NEGOTIATE** con sconto sostanziale su valuation pre-revenue.

- Asset code+ontologia ha valore strategico per acquirer EU che vogliono entrare in skills intelligence senza build-from-scratch
- Asset team+brand+market presence hanno valore prossimo a zero
- Rischio category-creation failure è prezzato in valuation
- Suggested buyer profile: Personio (per accelerare skills layer), Zucchetti (per modernizzare stack), grosso SI europeo (Capgemini/Reply/Engineering) per practice OI

**Severity D9 finale**: **medium** — non c'è incumbent ESCO-native EU che schiacci heuresys nei prossimi 12 mesi, ma 5 minacce high+critical convergono nel finestra 12-18 mesi.

---

## 9. Sources

### Web research live (WebSearch + WebFetch 2026-05-10)

- [Workday Skills Cloud Pricing 2026 — Vendr](https://www.vendr.com/marketplace/workday)
- [Workday Skills Cloud — Workday US](https://www.workday.com/en-us/products/human-capital-management/skills-cloud.html)
- [Josh Bersin — The Reinvention of Workday: From System of Record to Platform of Agents (2026)](https://joshbersin.com/2026/04/the-reinvention-of-workday-from-system-of-record-to-platform-of-agents/)
- [SAP SuccessFactors 1H 2026 Release](https://news.sap.com/2026/04/sap-successfactors-1h-2026-release/)
- [SAP Talent Intelligence Hub — SAP Help](https://help.sap.com/docs/successfactors-platform/using-talent-intelligence-hub/talent-intelligence-hub)
- [Oracle HCM Cloud Pricing 2026 — ITQlick](https://www.itqlick.com/oracle-hcm-cloud/pricing)
- [Oracle HCM Cloud Reviews 2026 — SelectHub](https://www.selecthub.com/p/hr-management-software/oracle-hcm-cloud/)
- [Microsoft Viva Pricing](https://www.microsoft.com/en-us/microsoft-viva/pricing)
- [Microsoft People Skills — Adoption](https://adoption.microsoft.com/en-us/ai-agents/people-skills/)
- [Microsoft Viva Suite Guide & Pricing 2026](https://www.aguidetocloud.com/licensing/viva-suite/)
- [AI Talent Intelligence: Eightfold, Beamery, Gloat 2026 — Knowlee Blog](https://www.knowlee.ai/blog/ai-talent-intelligence)
- [Eightfold 2026 Company Profile — PitchBook](https://pitchbook.com/profiles/company/167000-50)
- [Eightfold AI raises $220m, doubles valuation — Eightfold Blog](https://eightfold.ai/blog/eightfold-ai-raises-220m/)
- [Gloat raises $90M Series D — TechCrunch](https://techcrunch.com/2022/06/28/gloat-nabs-90m-to-build-ai-powered-internal-jobs-marketplaces/)
- [Talent Marketplace Platform Gloat Raises $57M Series C — AI-Tech Park](https://ai-techpark.com/talent-marketplace-platform-gloat-raises-57m-series-c/)
- [Beamery becomes a unicorn — TechCrunch](https://techcrunch.com/2022/12/12/beamery-the-all-in-one-talent-management-platform-becomes-a-unicorn/)
- [Beamery 2026 Company Profile — Tracxn](https://tracxn.com/d/companies/beamery/__RbEJXSPbX-x6tzTrs94g87K8ALw3_j2M_xp3GdSxVfE)
- [Gloat vs Eightfold vs Engagedly: Talent Mobility Comparison 2026](https://engagedly.com/blog/engagedly-vs-gloat-vs-eightfold-talent-mobility/)
- [Lattice Pricing 2026 — Vendr](https://www.vendr.com/marketplace/lattice)
- [Lattice 2026 Company Profile — PitchBook](https://pitchbook.com/profiles/company/155954-35)
- [Personio Pricing 2026 — Treegarden](https://treegarden.io/blog/personio-pricing-2026/)
- [HiBob vs Personio vs Workday — HiBob](https://www.hibob.com/blog/hibob-vs-personio-vs-workday/)
- [Best Personio Alternatives 2026 — Rework Resources](https://resources.rework.com/tools/hr-people/best-personio-alternatives)
- [ESCO Classification — European Commission](https://esco.ec.europa.eu/en/classification)
- [ESCO Web Service API](https://esco.ec.europa.eu/en/use-esco/use-esco-services-api/esco-web-service-api)
- [ESCO API — Escopedia (WebFetch)](https://esco.ec.europa.eu/en/about-esco/escopedia/escopedia/esco-api)
- [Actonomy: Combining Ontology with ESCO](https://www.actonomy.com/whats-new/blog/combining-actonomys-ontology-with-esco/)
- [HR Tech Market Size — Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/hr-tech-market)
- [HR Software Market Report 2026 — Research and Markets](https://www.researchandmarkets.com/reports/5983713/human-resource-hr-software-market-report)
- [Europe HR Technology Market — Market Data Forecast](https://www.marketdataforecast.com/market-reports/europe-human-resource-hr-technology-market)
- [HR Analytics Software Market 14.8% CAGR — OpenPR](https://www.openpr.com/news/4503899/people-hr-analytics-software-market-size-accelerating-at-14-8)
- [Best GDPR-Compliant Hiring Platform 2026 — MokaHR](https://www.mokahr.io/articles/en/the-best-GDPR-compliant-hiring-platform)

### Internal documentation (read 2026-05-10)

- `D:\evo.heuresys.com\docs\10-strategy\heuresys-vision.md` (overview wiki, 7 pilastri, 5 dim)
- `D:\evo.heuresys.com\docs\10-strategy\competitive-landscape.md` (synthesis 18 framework × 7 pilastri)
- `D:\evo.heuresys.com\docs\10-strategy\external-frameworks-reference.md` (catalogo 18 fonti C1-C5 inc. competitor tech)

### Information gaps (confidence calibration)

- **Pricing pubblico Workday Skills Cloud standalone**: NON disclosed (solo "contact sales"). Stima derivata da bundle HCM
- **SAP TIH AI Units pricing**: NON disclosed
- **Eightfold/Gloat/Beamery ARR 2026 esatto**: solo pre-2023 confermato; 2024-2026 estimated from growth trajectory
- **EU SOM specifica per "Organizational Intelligence"**: nessun analyst report dedicato esiste — TAM/SAM/SOM costruita per intersezione (margine ±40%)
- **Customer count Personio/Hibob 2026 esatto**: stime, non dato verificato

---

_Report compilato 2026-05-10 17:30 GMT+2 — Senior Market Research Analyst, M&A Acquisition DD team_
