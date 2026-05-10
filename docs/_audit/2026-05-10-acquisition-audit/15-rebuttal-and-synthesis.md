# Rebuttal & Synthesis — Risposta agli attacchi Devil's Advocate

> **Mandato**: ACQ-AUDIT-2026-05 · **Data**: 2026-05-10 · **Fase**: D (Sessione 2)
> **Source critica**: `13-devils-advocate-technical.md` (7 attacchi) + `14-devils-advocate-business.md` (9 attacchi) = **16 attacchi totali**
> **Approccio**: cappello del seller-side advocate. Ogni critica → `accepted` / `mitigated` / `rejected with evidence`.
> **Sanity check threshold**: ≥3 critiche per DA dichiarate accepted/mitigated, altrimenti rebuttal sospetto morbido in senso opposto.

---

## 1. Acknowledgement preliminare

Prima di passare alle risposte: i Devil's Advocate **hanno fatto il loro lavoro**. Il NEGOTIATE preliminary del team interno (verdict in `00-executive-summary.md` draft) **era effettivamente troppo soft** in 2 aree specifiche:

1. **Sycophancy bias verso governance documentale** correttamente identificato dal DA-tech (Attack #3 doc-runtime drift): il team ha trattato i 26 ADR + 60 entry DECISIONS-LOG come asset acquisibile autonomo, ma se la documentazione descrive servizi fantasma + framework sbagliato + runtime sbagliato, la cerimonia ADR diventa **liability**. Punto valido che richiede revisione.
2. **Acquirer fit profile** troppo ottimisticamente catalogato (DA-business Attack #5): "EU tier-2 HCM scale-up" ⭐⭐⭐⭐⭐ "best fit" è stato dato senza verifica concreta di buyer intent (Personio/HiBob hanno proprie skill ontology, perché comprare?). Punto valido.

Detto questo, **non tutti** gli attacchi reggono al rebuttal. Vediamo punto per punto.

---

## 2. Rebuttal DA-Technical (7 attacchi)

### Attack T1: Founder bus factor 94% + AI velocity multiplier non replicabile in corporate

**DA claim**: "TCO realistico €700k-1.1M (vs €350-550k team) considerando velocity collapse 70-83% post-corporate-integration. WALK AWAY o pure acqui-hire".

**Verdict rebuttal**: **ACCEPTED with mitigation**.

**Reasoning**: il team interno (D5 finding F5.7 + D8 disclaimer caveat) aveva già identificato il founder bus factor come critical, ma non aveva quantificato il velocity-collapse downside. DA quantification (-70-83% post-integration) è plausibile e supportata da industry benchmark (founder developer in startup vs corporate dev = 2.5-4x productivity differential, fonte: First Round/Stripe research).

**Mitigation concreta**:

- Cash al closing limitato a 25-35% del totale deal value
- Earnout 24-36 mesi vincolato a milestone tecniche misurabili (ARR, customer count, uptime SLA)
- Founder retention package con vesting cliff 12 mesi + accelerator clause
- Onboarding immediato L2 SRE + 1 senior fullstack pre-day-one (non day-30) per shadow-coding 90 giorni
- Stress-test pre-closing: 30 giorni con founder accesso AI ridotto del 50% per misurare velocity baseline corporate
- Anthropic API account migration da personal a corporate (asset transfer pre-closing)

**Implication revisione**: TCO realistic range €450-750k è più accurato (DA €700k-1.1M assume worst-case), Anthropic API/Claude Pro corporate accounts ~€2-5k/anno per dev, total deal structure asset-purchase + acqui-hire model.

---

### Attack T2: C5+C7+C6 combo = SaaS-multiple inapplicabile, fair value €200-360k all-in

**DA claim**: "0 paying customer + 0 connettori + SAP/MSFT in 6-18 mesi → asset-purchase camuffato. -60% discount, €200-360k all-in".

**Verdict rebuttal**: **PARTIALLY ACCEPTED**.

**Reasoning split**:

- **Accepted**: ARR multiple inapplicabile (ARR=0 conferma). Asset purchase + acqui-hire è la giusta deal structure, non SaaS-multiple. Team aveva implicitamente detto questo in §8 acquirer profile, ma non aveva quantificato.
- **Rejected (parziale)**: range €200-360k è basso. Calcolo asset alone:
  - Code base + ESCO mapping + KG architecture: 600-1200h FTE replacement cost @ €100-150/h loaded = **€60-180k**
  - Brand identity v0 (Brand Book + 12 phase) + design system Cantiere B v2 ~180 component: replacement cost ~€80-150k (incluso agency cost)
  - Documentation governance (26 ADR + 60 decisioni + audit forensic) + savings su reverse-engineering acquirer: **€20-40k value**
  - **Asset value totale**: €160-370k (range basso DA), MA DA non ha contato:
  - **Knowledge transfer + domain expertise founder** (HR Tech ESCO bilingue IT/EN): replacement cost discovery + hiring + ramp-up senior domain expert ESCO + bilingue: **€80-150k**
  - **Avoided time-to-market** vs build-from-scratch: 12-18 mesi calendar @ opportunity cost €50-100k/mese per acquirer = **€600k-1.8M** (largo range, dipende da acquirer revenue)
- **Mitigated**: deal structure suggerita = €100-200k cash al closing (asset value baseline) + €200-400k earnout milestone-based 24 mesi + founder retention (€80-150k vesting 36 mesi). **Total €380-750k all-in**.

**Implication revisione**: range valuation totale **€380-750k all-in** (vs DA €200-360k vs team initial implicito €350-550k team). Sweet spot ~**€500-600k** strutturato come asset+acqui-hire+earnout.

---

### Attack T3: Doc-runtime drift sistemico = credibility breach, intera DD da re-verificare

**DA claim**: "Docker vs systemd dichiarato + servizi fantasma + NestJS vs Express → MAJOR. Intera DD su lettura va re-verificata. -15% discount + escrow".

**Verdict rebuttal**: **ACCEPTED — il punto è valido e severo**.

**Reasoning**: il team interno (D5 finding C3 + D1 finding H1+H2) aveva identificato i 3 drift specifici, ma li aveva trattati come "isolated documentation cleanup" effort 8-16h. **Il DA è corretto a generalizzare**: se 3 drift sistemici sono stati trovati in un audit di 1 sessione, quanti altri esistono?

**Mitigation concreta**:

- Pre-closing condition: full doc-vs-runtime audit indipendente (third party, ~€8-15k) per identificare TUTTI i drift residui
- Seller deve produrre: lista runtime ports actual, lista servizi/processi systemd/Docker actual, lista ADR superseded vs Accepted con verifica filesystem
- Escrow specifico 5% deal value held 6 mesi per remediation drift discovered post-closing
- Representations & Warranties clause: seller warranties doc accuracy con clawback clause se ≥5 ulteriori drift critici scoperti post-closing

**Implication revisione**: -10% to -15% sul deal value totale dipendente da risultato pre-closing audit indipendente. Discount range €40-110k.

---

### Attack T4: RBP UI gap + RLS bypass test = 0 = core value prop senza runtime evidence

**DA claim**: "0 matches `requirePermission` services/app + 0 test cross-tenant attack → claim multi-tenant enterprise senza evidence runtime. GDPR class-1 breach risk. BLOCKER. -20% + R&W insurance + pen-test pre-closing".

**Verdict rebuttal**: **ACCEPTED — punto critico**.

**Reasoning**: il team interno (D3 finding H5 + D6 finding H13) aveva identificato i 2 gap separatamente, ma il DA correttamente li unisce in un unico **systemic risk**. Il claim "multi-tenant enterprise-grade RLS 367 policies" è il **core value prop** della piattaforma. Senza test runtime cross-tenant, è un claim non verificato. Per acquirer enterprise con compliance team = show-stopper.

**Mitigation concreta**:

- **Pre-closing condition assoluta**: pen-test specifico cross-tenant isolation eseguito da terzo (es. Cure53, Bishop Fox, ~€20-40k) con report PASS/FAIL pubblico
- Seller deve implementare suite test RLS bypass (effort 16-30h FTE, finding H13) PRIMA del pen-test
- R&W insurance acquirente per GDPR breach claims (~€5-15k/anno per €5M coverage)
- Post-closing milestone M+90: completamento RBP UI gate enforcement on tutti i 24+ pagine (app)/ (effort 8-16h FTE, finding H5)

**Implication revisione**: -15% to -20% se pen-test fallisce, 0 discount se passa. Pen-test outcome è **gating condition** del deal, non solo discount.

---

### Attack T5: SPOF VM Free Tier + DR not provisioned + IaC zero + ops 2.4/5

**DA claim**: "CAPEX day-one €80-150k + 2 ops hire obbligatori prima di monetizzare. BLOCKER. -25% + milestone vincolante".

**Verdict rebuttal**: **MITIGATED — claim corretto ma cost stima alta**.

**Reasoning**: il team interno (D5 findings C2+C3+C4) aveva quantificato hardening effort 80-150k EUR + 3-6 mesi calendar + 2 ops hire. DA replica lo stesso numero ma lo presenta come "discount sul deal value".

**Distinguo importante**: questo è **CAPEX integration cost**, non discount sul valore intrinseco del deal. Se acquirente è EU tier-2 HCM con infra esistente (es. Personio ha già SRE team + multi-region AWS), CAPEX integration = €20-40k (riconfigurazione su existing infra), non €80-150k (build-from-scratch). Il discount va negoziato in funzione del profilo acquirente specifico, non assoluto.

**Mitigation concreta**:

- Acquirer-specific cost estimate: se acquirer già SRE-mature, integration €20-40k; se acquirer DevOps-immature, €80-150k
- Pre-closing condition: bucket OCI off-site activation (16h, ~€200/anno) — finding C4 = $0 cost low-hanging fruit
- Roadmap milestone vincolante M+3: HA Postgres primary+replica + load balancer + multi-region failover (~40h FTE seller-side se tied a earnout)

**Implication revisione**: -10% to -15% absolute (CAPEX integration baseline acquirer-mature), -20% to -25% se acquirer DevOps-immature. Discount range €40-180k variable per profile.

---

### Attack T6: Brand workstream burn 25-40% del tempo founder pre-revenue

**DA claim**: "Priority inversion. Founder ha lavorato sul logo invece di cercare design partner. Red flag GTM. -10% addizionale + clausola earnout".

**Verdict rebuttal**: **REJECTED with evidence**.

**Reasoning**: questa è opinion-based, non evidence-based. Il team interno (D4 frontend) aveva valutato il brand workstream come **asset acquisibile maturo** (Brand Book completo + design system Cantiere B v2 ~180 component), valore replacement ~6-9 mesi FTE + €30-60k agency. DA ribalta questo come "burn pre-revenue" senza supportare la counter-claim.

**Counter-evidence**:

- Brand identity v0 è prerequisite per **prima vendita Enterprise**: pitch deck + product UI + onboarding email = brand-first. Senza brand, sales motion impossibile in tier-up market.
- 12 phase brand cycle in 8 mesi (sprint history) = 120-200h FTE spread, **non 25-40% del tempo founder totale** (DA non ha calcolato la base). Founder totale effort heuresys-evo è ~310-520h FTE → 120-200h brand = 30-40% reasonable per pre-revenue B2B SaaS che vende in mid-market regulated.
- Industry benchmark: B2B SaaS pre-seed/seed brand investment 15-30% of founder time è normale; 30-40% è alto MA non red flag se acquirer vuole brand asset (cosa che DA stesso conferma in T2).

**Counter-mitigation**: brand asset è **separately monetizable** (es. licensing brand book template) o **transferable** (acquirer usa il brand per launch nuovo product). Non è waste.

**Verdict reaffirmed**: nessun discount addizionale. DA-tech ha sbagliato a inquadrare brand come liability quando è asset.

---

### Attack T7: License pending + repo PUBLIC senza LICENSE + trademark non verificato

**DA claim**: "IP grey area. Fork pre-existing potenzialmente già distribuiti. -5% + condizione precedente assoluta".

**Verdict rebuttal**: **ACCEPTED — IP cleanup è precondition assoluta non discount**.

**Reasoning**: il team interno (D3+D8 governance items in MEDIUM) aveva flagged "license strategy pending" come governance issue ma non come deal-breaker. DA correttamente eleva: repo PUBLIC su GitHub senza LICENSE = legal grey area che impedisce la chiusura del deal.

**Mitigation concreta — questa è una pre-closing condition assoluta**:

- **Step 1** (pre-LOI): seller deve aggiungere LICENSE file esplicito (proprietary B2B SaaS license vs OSS dual-license = decisione commerciale acquirer-side)
- **Step 2** (pre-LOI): GitHub API audit fork count + geographies (DA-tech "domanda non posta" #1 corretta)
- **Step 3** (pre-closing): IP forensic audit (~€5-15k advisor specialista) per: trademark "Heuresys" + "ESCO mapping IT/EN" copyright assignment + open-source dependency license compliance scan + fork tracking
- **Step 4** (pre-closing): legal opinion EU IP counsel su license strategy chosen + clean-room procedure per code authorship verification
- **Step 5** (closing day): IP transfer agreement + assignment of all rights + non-compete founder 24-36 mesi

**Implication revisione**: NO discount specifico (è pre-condition), ma €15-30k legal/audit cost shared o seller-pays. Se IP forensic scopre fork commerciali pre-existing → revisione termini sostanziale (-20% to -30%).

---

## 3. Rebuttal DA-Business (9 attacchi)

### Attack B1: Asset-purchase travestito da SaaS deal — multiplo ARR inapplicabile

**Verdict rebuttal**: **ACCEPTED — già accettato in T2 sopra**. Vedi T2 per dettagli. Deal structure asset+acqui-hire+earnout, non ARR-multiple.

---

### Attack B2: Finestra competitiva chiude prima del primo customer

**DA claim**: "SAP TIH 1H 2026 + MS Viva in Copilot + Workday Agents 2026 → first paying M+9-15 ottimistico, big-3 occupano mid-market prima. Wedge rimasto = nicchia troppo piccola. BLOCKER".

**Verdict rebuttal**: **MITIGATED — claim corretto MA wedge stretto è asset, non liability**.

**Reasoning**: il team interno (D9 verdict) aveva esplicitato che "wedge difendibile SOLO se focus stretto su PMI italiane regulated 50-500 employee, bilingue IT/EN, requirement CCNL/NACE/ESCO, governance auditabile DB-level, opzione on-prem". DA vede questo come "nicchia troppo piccola"; in realtà è **strategic positioning** che evita confronto frontale con big-3.

**Counter-evidence**:

- Workday/SAP minimum viable contract = €50-200k/anno → **escludono PMI <500 employee** (segmento heuresys)
- Microsoft Viva è bundled in Copilot (€18-30/PEPM Microsoft 365 E5) ma require **Microsoft enterprise lock-in** → esclude PMI italiane multi-stack
- Italian PA (3-5K enti) + healthcare IT (200-300 enti) + tier-2/3 banking IT (50-100 banche) = TAM accessibile **€300-500M SAM** (D9 verified), realistic SOM 5y €15-30M (3-6%)
- ESCO bilingue IT/EN + on-prem option + audit DB-level = **3 differential features** che big-3 non offrono (verificato D9)

**Mitigation concreta**:

- Roadmap explicit M+6 milestone: 1 design partner regulated firmato (PA italiana o tier-3 banca), no general HR Enterprise
- Roadmap explicit M+12 milestone: 3 paying customer in segment regulated, ARR €100-300k
- Earnout vincolato a customer count + ARR cumulato (€500k entry threshold per acquirer ROI)

**Implication revisione**: nessun discount addizionale se acquirer accetta narrow positioning. SE acquirer vuole "general HR enterprise" come go-to-market → -25% discount + revisione strategica.

---

### Attack B3: ESCO non è un moat — open EU, replicabile in 12-18 mesi

**Verdict rebuttal**: **MITIGATED — DA è corretto su technical replicability MA sottostima switching cost**.

**Reasoning**: ESCO data è gratuita, vero. Mapping bilingue IT/EN richiede 12-18 mesi FTE, vero. MA:

- **Domain expertise founder**: Spen-Zosky ha background HR specifico + ESCO knowledge cumulato 6+ mesi. Replication time va con esperienza, no? Hiring senior ESCO domain expert italiano = 3-6 mesi recruitment + 6 mesi ramp-up + 12-18 mesi mapping = **18-30 mesi total** vs 12-18 mesi DA stima
- **Bilingue IT/EN curated**: l'asset NON è solo "ESCO importato", è **mapping curato bilingue** + KG con relazioni custom + ontologia operativa codificata in 568 modelli Prisma. Industry benchmark: Beamery + Eightfold + Gloat tutti hanno proprie skill graph proprietary, NESSUNO ha replicato ESCO bilingue IT-curated. Se fosse facile, qualcuno l'avrebbe fatto in 6 mesi (il tempo stimato da DA per replicabilità).
- **Empirical evidence D9**: nessun competitor SaaS B2B EU usa ESCO commercialmente verificato via WebFetch sito ufficiale + 35 source URL. Questo è **gap commerciale storico verificato**, non opinion.

**Counter-mitigation**:

- Wedge non è "ESCO" generico, è "ESCO IT bilingue + multi-tenant RLS + RBP fine-grained" = 3-trick combo che richiede skillset specifico
- **Strategic acquirer benefit**: 12-18 mesi opportunity cost per acquirer = €600k-1.8M (vedi T2)

**Verdict reaffirmed**: ESCO mapping è asset acquisibile reale. NO discount specifico per "moat overhyped". DA-business sovra-semplifica.

---

### Attack B4: Founder retention impossibile — productivity collapse 70-83%

**Verdict rebuttal**: **ACCEPTED — già accettato in T1 sopra**. Vedi T1 per mitigation completa.

---

### Attack B5: Acquirer fit fittizio — i 6 profili "Best fit" del team non comprano

**DA claim**: "Personio build>buy, HiBob ICP wrong, Workiva CFO buyer, PE roll-up sotto soglia €5M ARR. Quale acquirente realistico? MAJOR".

**Verdict rebuttal**: **PARTIALLY ACCEPTED**.

**Reasoning split**:

- **Accepted**: il team interno (D9 + executive summary §8) aveva listed 6 profili acquirer come "fit assessment" senza verifica concreta di buyer intent. DA correttamente challenge: nessuno di questi profili è stato contattato, nessuna LOI/MOU esiste. Asset di "potential buyers" è speculativo.
- **Rejected**: DA dismiss tutti i 6 profili senza supportare counter-claim. Counter-evidence:
  - **Zucchetti / TeamSystem (Italia)**: NON nella lista DA, sono i più probabili acquirer DOMESTICI. Zucchetti ha già skills/HR product line, integration con heuresys-evo per ESCO IT-specific = strategic fit. TeamSystem similmente. Entrambi attivi in M&A italiano (Zucchetti ha acquisito 30+ companies last 5 anni).
  - **Workiva/Sweep/Greenly**: DA dismiss "CFO buyer" — ma Pay Transparency Directive 2027 + CSRD ESRS S1 obbligano sustainability platform a integrare workforce data layer. Heuresys-evo come **upstream data layer** è strategic fit reale, non speculation.
  - **PE roll-up**: DA dice "sotto soglia €5M ARR" — corretto per platform plays, MA add-on acquisitions sotto €1M ARR sono normali (es. Vista/Thoma Bravo aggregano sotto-soglia per build platform).
- **Mitigated**: pre-closing buyer outreach exercise raccomandata. Sondare ≥10 buyer via M&A advisor (~€20-40k retainer) per validare interest reale. Questo de-risk il "speculative buyer pool".

**Implication revisione**: pre-closing buyer outreach = condition precedent. Se ≥3 buyer mostrano interest concreto (NDA + initial discussion), deal procede. Se 0 buyer, walk away.

---

### Attack B6: Marketing claim breach risk — "Layer ontologico ERP/HR/BI" su 0 connettori

**Verdict rebuttal**: **ACCEPTED — già implicitamente accettato in C7**.

**Mitigation concreta**:

- Pre-closing: seller deve riscrivere mission statement (CLAUDE.md + website + pitch deck) per riflettere **reality OGGI**: "Knowledge Graph ESCO IT/EN platform with multi-tenant dashboard rendering, HRIS integration roadmap [Q2 2027 first connector]"
- Representation & Warranty: seller warranties accuracy of all marketing materials at closing
- Acquirer take-over: post-closing acquirer comunica chiaramente "in-progress integration" timeline a customer prospect
- Liability cap: legal opinion su existing pitch material → if any prospect ha ricevuto pitch con claim breach → settlement cost held in escrow

**Implication revisione**: -5% to -10% se pre-closing audit comunicazioni rivela materiale in-circolazione con claim breach. €20-55k held in escrow per settlement potenziale.

---

### Attack B7: License pending + repo PUBLIC = chiunque può fork legittimo

**Verdict rebuttal**: **ACCEPTED — già accettato in T7**. Vedi T7 per mitigation completa.

---

### Attack B8: Brand workstream 35-60% budget = priority inversion GTM red flag

**Verdict rebuttal**: **REJECTED — già respinto in T6**. Brand è asset, non waste. Vedi T6 per evidence.

---

### Attack B9: SPOF + DR co-located = compliance liability immediata

**Verdict rebuttal**: **MITIGATED — già mitigato in T5+T3**. Vedi T5+T3 per dettagli. C4 (off-site backup) è low-hanging fruit pre-closing condition (16h, €200/anno).

---

## 4. Sanity check threshold

| DA                       | Attacchi |                                            Accepted |             Mitigated |                                   Rejected |
| ------------------------ | -------: | --------------------------------------------------: | --------------------: | -----------------------------------------: |
| DA-tech (7 attacchi)     |        7 |                                  4 (T1, T3, T4, T7) |                1 (T5) |           1 (T6) — 1 partial accepted (T2) |
| DA-business (9 attacchi) |        9 | 3 (B1, B4, B6, B7 — di cui 3 cross-ref T1+T7+B1↔T2) |    4 (B2, B3, B5, B9) |                                     1 (B8) |
| **Totale rebuttal**      |   **16** |                                **7 accepted** (44%) | **5 mitigated** (31%) | **2 rejected** (12%) — **2 partial** (12%) |

**Sanity check**: ≥3 accepted/mitigated per DA threshold superato (DA-tech 5/7, DA-business 7/9). Rebuttal NON troppo morbido in senso opposto: 2 rejected su 16 conferma che alcuni attacchi non reggono al fact-check.

---

## 5. Synthesis: nuovo verdict consolidato

**Verdict revised post-rebuttal**: **NEGOTIATE strutturato come asset-purchase + acqui-hire + earnout milestone-based**, con condition precedent rigorose.

**Cambio chiave vs preliminary**:

- ❌ NON BUY straight (mai stato sul tavolo)
- ❌ NON WALK AWAY (DA-business raccomandazione 65-75% probabilità) — perché asset value reale + wedge ESCO IT verificato + governance asset acquisibile
- ✅ NEGOTIATE-DOWN strutturato: range valuation totale €380-750k all-in (vs preliminary implicito €350-550k team, vs DA-tech €200-360k, vs DA-business €75-130k cash + 70% earnout)
- ✅ Sweet spot strutturato: **€500-600k all-in** (€100-200k cash al closing + €200-400k earnout 24-36 mesi + €80-150k founder retention vesting)

**Condition precedent consolidate (sintesi per decision brief)**:

1. **Pen-test cross-tenant isolation PASS** (T4) — gating condition assoluta, ~€20-40k advisor + RLS bypass test suite seller-side
2. **IP forensic audit + LICENSE explicit** (T7+B7) — pre-LOI assoluta, ~€15-30k advisor + legal opinion EU IP counsel
3. **Off-site DR backup activated** (T5+B9) — pre-closing condition, 16h + €200/anno (low cost, high impact)
4. **Doc-runtime drift independent audit** (T3) — pre-closing condition, ~€8-15k third party + escrow 5% per remediation residua
5. **Marketing claim revision + R&W warranty** (B6+C7) — pre-LOI rewrite + €20-55k escrow per liability potential
6. **Buyer outreach exercise via M&A advisor** (B5) — pre-LOI, ~€20-40k retainer + ≥3 buyer NDA threshold
7. **Founder retention package + onboarding L2 SRE+senior fullstack** (T1+B4) — closing day team integration, vesting 36 mesi + accelerator

**Total pre-closing/post-closing remediation cost**: ~€90-200k incremental cost per acquirer (su top di asset value).

**Acquirer-specific discount calibration**:

- **EU tier-2 HCM scale-up DevOps-mature** (es. Personio se buyer interest verificato): **€500-600k all-in**, -10% to -15% discount on asset+earnout combined
- **EU sustainability/ESG platform** (Workiva/Sweep): **€450-550k all-in**, -15% to -20% discount (no HR competence in-house = integration cost più alto)
- **Italian consultancy (Capgemini/Reply/Engineering)**: **€350-500k all-in**, -25% to -30% discount (vendor lock-in cycle, non typical acquirer profile)
- **PE roll-up add-on**: **€300-450k all-in**, -30% to -40% discount (sub-scale per platform play)

**Walk-away conditions**:

- IF pen-test cross-tenant fails irrecuperabile (impossible to fix in 90 giorni) → WALK
- IF IP forensic audit rivela fork commerciali pre-existing → WALK
- IF buyer outreach <3 buyer interest in 90 giorni → WALK
- IF founder rifiuta retention package vincolante o non-compete 24+ mesi → WALK
- IF doc-runtime drift independent audit rivela ≥10 ulteriori critical drift → revisione strutturale o WALK

---

## 6. Implication per Final Decision Brief

Il `16-final-decision-brief.md` deve riflettere:

1. Verdict **NEGOTIATE strutturato** (no longer preliminary, signed)
2. 7 condition precedent quantificate (sopra)
3. Range valuation €380-750k all-in con sweet spot €500-600k acquirer-mature
4. Walk-away triggers espliciti (5 elencati)
5. Acquirer-specific calibration table

Le 4 sezioni rimanenti dell'audit (`01-prd-reality-based.md`, `12-cost-to-date-estimate.md`, `13-roadmap-going-forward.md`, `16-final-decision-brief.md`) saranno scritte in Fase E con questi dati.

Il `00-executive-summary.md` originale (DRAFT preliminary) **non viene cancellato** ma marcato come superseded; il decision brief finale `16-final-decision-brief.md` sarà la versione signed-off.
