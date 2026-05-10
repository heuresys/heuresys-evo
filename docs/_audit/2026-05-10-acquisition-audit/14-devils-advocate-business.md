# Devil's Advocate — Business Attack Memo

> **From**: DA-business (devil's advocate hired by acquirer CFO + Head M&A)
> **To**: Senior Partners (M&A committee)
> **Re**: heuresys-evo acquisition — WHY YOU SHOULD WALK AWAY (or pay 70-85% less)
> **Date**: 2026-05-10 · Status: kill-the-deal mandate

---

## TL;DR (≤120 parole)

Il team di DD interno raccomanda **NEGOTIATE** con anchor 350-700k€ asset-based. Sbagliato per difetto. Voi state per comprare un repository di 13 giorni (`heuresys-evo` greenfield iniziato 2026-05-01), zero ARR, zero design partner, zero pipeline, founder solo, su una VM Free Tier OCI senza HA, in una finestra competitiva di 6-18 mesi che si chiude con SAP TIH 1H 2026 già rilasciato e Microsoft Viva People Skills bundled in Copilot. La narrativa "Layer ontologico tra ERP/HR/BI" copre un dashboard renderer + un browser ESCO. Il moat dichiarato (ESCO) è scaricabile gratuitamente in 28 lingue. Multipli ARR EU SaaS 2026: mediana 4.5x; ARR di heuresys-evo: **0**. Multiplo applicabile: **non esiste**. Raccomandazione: **WALK AWAY**, in subordine NEGOTIATE -75/-85% con earnout 70% subordinato a paying customer reali.

---

## Why this is NOT a SaaS acquisition

Sgombriamo subito un equivoco contagiato dal verdict preliminary. Il team scrive "NEGOTIATE" e parla di "platform". I fatti dell'audit dicono altro:

- **0 paying customer · 0 ARR · 0 design partner · 0 LOI** ([`00-executive-summary.md`](./00-executive-summary.md) §3 finding C5; [`09-product-scope-reality.md`](./09-product-scope-reality.md) §4)
- **4 tenant attivi sono 100% seed sintetici** con domain fittizi `rtl-bank.org` / `smartfood.org` / `econova.org` ([`09-product-scope-reality.md`](./09-product-scope-reality.md) tabella §4)
- **270 employees + 265 users = popolazione di test**, nessun MAU, nessun NPS, nessun CSAT, nessun churn ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §4 riga 90)
- **Repo greenfield 10 giorni calendar** (314 commit Spen-Zosky 2026-05-01 → 2026-05-10) con velocity AI-assisted ~30 commit/giorno ([`00-executive-summary.md`](./00-executive-summary.md) §2 cost-to-date)
- **NO subscription/billing/contract layer** ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §8 punto 4: "Pre-revenue completo. Stripe/contract management = green field")
- **NO sales, NO marketing, NO CS** ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §8 punto 5: "founder-dependency 100%")

Questa non è una **SaaS acquisition**. È un **acqui-hire camuffato da platform deal** dove il principale (e unico) deliverable è il founder e il codice che ha scritto in 13 giorni con AI assistance. Qualunque multiplo ARR è inapplicabile per definizione: zero × N = zero. Il team di DD propone "asset-based" 350-700k€, ma anche quel range è gonfiato di 2-3x rispetto al fair value che dimostrerò.

---

## Attack #1: Asset-purchase travestito da SaaS deal — multiplo ARR inesistente

**Evidence**: Mediana EV/Revenue marzo 2026 EU SaaS lower middle market = **3.4x ARR** ([`11-market-context-deep.md`](./11-market-context-deep.md) §4, fonte Aventis Advisors / Livmo 2026). Premium tier 7-10x richiede NRR>120% e Rule of 40>50. heuresys-evo: ARR = €0 confermato. NRR = N/A (no customer). Rule of 40 = N/A.

**Severity**: **BLOCKER** per qualunque tesi di "platform investment".

**The team said**: "Range di anchor 350-700k€ asset-based" ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §9).

**Reality is**: 350-700k€ per 310-520h FTE di greenfield ([`00-executive-summary.md`](./00-executive-summary.md) §5) implica un loaded cost €670-2.250/h, cioè 4-15× il rate di un senior fullstack EU. Stiamo pagando un premium per "documentation governance" e "brand identity v0" — asset reali ma non finanziabili a multiplo SaaS. Il fair value asset-only è €110-220k (max 1.5x cost-to-replicate del greenfield, esclusi brand workstream e governance overhead non strategici per acquirer). Tutto sopra è premio per la promise, non per cash flow.

**Financial implication**: Pagare 500k€ vs fair-value 150k€ = **€350k overpayment immediato**, con zero meccanismo di clawback se la promise non si materializza in 18-24 mesi (probabilità >60% data finestra competitiva, vedi Attack #2).

**Recommendation**: Se procedete, **NEGOTIATE -75% sul mid-point team** (€350-700k → €87-175k cash al closing) + **70% earnout su 36 mesi** subordinato a milestone di 3 paying customer con ARR cumulato ≥€500k.

---

## Attack #2: Finestra competitiva chiude PRIMA del primo customer

**Evidence**: SAP SuccessFactors TIH **1H 2026 release già rilasciato** con Skills Governance + EU localization packs completi ([`10-competitor-analysis.md`](./10-competitor-analysis.md) tabella §3.1; [`11-market-context-deep.md`](./11-market-context-deep.md) §3 headwind). Microsoft Viva People Skills **bundled in Copilot** dal 2025-04 ([`10-competitor-analysis.md`](./10-competitor-analysis.md) §3.1 e §7 minaccia #2). Workday Agents 2026 in roll-out ([`10-competitor-analysis.md`](./10-competitor-analysis.md) §7 minaccia #3). First paying customer realistico per heuresys-evo: **9-15 mesi post-acquisizione** ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §9).

**Severity**: **BLOCKER** strategico.

**The team said**: "Time-to-market window 12-18 mesi" e "non c'è incumbent ESCO-native EU che schiacci heuresys nei prossimi 12 mesi" ([`10-competitor-analysis.md`](./10-competitor-analysis.md) §8).

**Reality is**: il team si concentra su "ESCO-native EU" come se fosse il dimensione di scelta del cliente. **Non lo è**. Il cliente PMI/PA EU regulated sceglie SAP perché ha già SAP, Personio perché ha già Personio, Microsoft perché ha già M365. Il momento in cui il **primo decision-maker compara** heuresys-evo vs SAP TIH (M+9-15) è **dopo** che SAP TIH ha già Skills Governance shipped (oggi). Non si compete sulla feature roadmap, si compete sull'inerzia stack esistente. Il "wedge ESCO bilingue IT/EN" non sopravvive a una RFP dove SAP allega "we will support ESCO mapping in next minor release" — che è esattamente quello che SAP fa di routine in ogni RFP che perde.

**Financial implication**: Probabilità che il primo paying customer firmi entro M+12 = **<25%** (zero pipeline, zero design partner, founder con 0 sales experience documentata, ciclo enterprise EU 9-18 mesi tipico). Se M+12 senza customer → mark-to-market loss 80-100% del cash al closing.

**Recommendation**: **WALK AWAY** unless founder porta in DD una **lettera di intent o design partner agreement firmato** da almeno 1 cliente reale. Senza, NO DEAL.

---

## Attack #3: ESCO non è un moat, è un asset open EU

**Evidence**: "ESCO v1.2.0 disponibile **gratuitamente in 28 lingue EU** in formati RDF/TTL/CSV/XML/JSON-LD" ([`11-market-context-deep.md`](./11-market-context-deep.md) §1, fonte ESCO Download portal). "Mantenimento gestito direttamente da DG EMPL della Commissione, no costi di licenza, no obblighi commerciali per integrazione" (idem). "Replicabile in **12-18 mesi FTE** da zero per un team competente" ([`11-market-context-deep.md`](./11-market-context-deep.md) §1 verdict moat).

**Severity**: **MAJOR** — invalida il differenziale primario citato dal team.

**The team said**: "Il vero moat è… 12-18 mesi di full-time work per replicare" ([`11-market-context-deep.md`](./11-market-context-deep.md) §1 TL;DR) e "wedge unico verificabile" ([`10-competitor-analysis.md`](./10-competitor-analysis.md) §3.4).

**Reality is**: 12-18 mesi-FTE = **~€80-150k loaded cost EU**. Non è un moat, è una task. Beamery ($223M raised), Eightfold ($410M raised), Gloat ($192M raised), Personio (~12.000 customer EU) hanno ognuno il budget per replicarlo in **1 quarter** se la categoria diventa interessante. Il fatto che oggi nessuno usi ESCO commercialmente in modo dominante non significa "barrier to entry alta" — significa "demand non ancora dimostrata". Quando la demand emerge (Pay Transparency 2027), gli incumbent si attrezzano in 6 mesi e schiacciano l'unico player con 0 paying customer.

Inoltre: ANPAL ha già adottato ESCO come framework nazionale italiano ([`11-market-context-deep.md`](./11-market-context-deep.md) §1, riferimento ANPAL Allegato C Fondo Nuove Competenze). Significa che **qualunque vendor IT può claim "ESCO-aligned" senza pagare licenze e senza vincoli IP**. heuresys-evo non ha brevetti su mapping bilingue, non ha contratti esclusivi con ANPAL, non ha lock-in customer. **Zero defensibility legale.**

**Financial implication**: Il "premium ESCO moat" che giustifica 350-700k€ vs cost-to-replicate ~150k€ è **fittizio**. Un acquirente sofisticato (Personio, TeamSystem) **non paga** per qualcosa che può internamente buildare in 6-9 mesi con 2 senior + 1 ESCO domain expert. Lo build, non lo compra. Premium da scontare: -€150-300k.

**Recommendation**: **NEGOTIATE-DOWN -€200k** sul valore "moat ESCO" dichiarato dal team, oppure pretendere clausola IP transfer + non-compete founder 36 mesi su qualunque progetto ESCO-related.

---

## Attack #4: Founder retention impossibile — productivity collapse 70-83% post-closing

**Evidence**: "314 commit Spen-Zosky in 10 giorni calendar" = ~31 commit/giorno ([`00-executive-summary.md`](./00-executive-summary.md) §2). "94% commit founder" ([`08-tech-debt-registry-consolidated.md`](./08-tech-debt-registry-consolidated.md) §cross-cutting #3). "Velocity AI-assisted = both asset and risk" — "se AI access removed o founder leaves, productivity collapses" ([`08-tech-debt-registry-consolidated.md`](./08-tech-debt-registry-consolidated.md) §cross-cutting #5). "Productivity multiplier founder + AI è ~3-5x dev tradizionale" (idem).

**Severity**: **BLOCKER** operativo.

**The team said**: "Founder retention package vincolante 18-24 mesi" + "earnout con clawback" + "Onboarding immediato L2 SRE + L1 on-call pre-day-one" ([`00-executive-summary.md`](./00-executive-summary.md) §7 condizione #3).

**Reality is**: nessuna delle mitigation citate funziona se il moltiplicatore di produttività dipende da: (a) accesso AI senza guardrail corporate, (b) zero Jira/Linear ticket overhead, (c) zero code review esterna, (d) zero compliance gating su deploy, (e) zero stakeholder management. Ogni acquirente HCM serio ha **tutti e cinque** questi vincoli. La velocity 31 commit/giorno **NON SOPRAVVIVE** all'integrazione in qualsiasi org corporate post-day-1. Calo realistico: -70% a -83% (da 31 commit/giorno a 5-9 commit/giorno) — torniamo a una velocity normale di senior fullstack singolo. Il che significa: roadmap "v1.0 in 12-18 mesi" pianificata su 2000-3000h FTE ([`00-executive-summary.md`](./00-executive-summary.md) §6) diventa **24-36 mesi**, con earnout already paid e ROI negativo.

Aggiungo: 31 commit/giorno per 10 giorni implica **12-15h/giorno di lavoro continuo**. Non è velocity sostenibile: è burn-out timebomb. Probabilità che il founder collassi entro 6 mesi post-closing (per stanchezza, frustrazione integrazione corporate, o entrambi) = **alta**. Retention package non basta a comprare salute mentale.

**Financial implication**: Cost overrun 1.5-2x sulla roadmap to v1.0 = **+€175-550k** sopra i €350-550k stimati ([`00-executive-summary.md`](./00-executive-summary.md) §6). Cumulativo cash impact post-closing: **€525k-1.1M extra burn** rispetto al business case "team 2-3 senior".

**Recommendation**: **NEGOTIATE earnout 70% del prezzo subordinato a milestone tech (non solo retention founder)**: roadmap delivery a M+6, M+12, M+18. Senza milestone tech, retention package = pagamento per zero output.

---

## Attack #5: Acquirer fit — il team ha proposto profili che NON comprano

**Evidence**: Acquirer profile fit table ([`00-executive-summary.md`](./00-executive-summary.md) §8 e [`11-market-context-deep.md`](./11-market-context-deep.md) §6).

**Severity**: **MAJOR** — invalida la tesi exit.

**The team said**: "EU tier-2 HCM scale-up (Personio, HiBob, Talentech, Zucchetti, TeamSystem) ⭐⭐⭐⭐⭐ Best fit" ([`00-executive-summary.md`](./00-executive-summary.md) §8).

**Reality is**: prendiamoli uno per uno.

| Profile proposto                                     | Perché in realtà NON compra                                                                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Personio** (~12.000 customer EU, Series E unicorn) | Build-internal in 6 mesi a costo €150-300k loaded vs acquisition €500-700k + integration cost €200-400k. ROI build > buy a 18 mesi |
| **HiBob**                                            | Customer base UK/IL tech scale-up, NON regulated EU PMI. ESCO/CCNL = irrelevant per loro ICP. Zero strategic fit                   |
| **Talentech**                                        | Nordics-focused, ESCO non priorità (loro hanno proprio framework O\*NET-derived). Nessun pain solved                               |
| **Zucchetti**                                        | Già stack proprietario maturo IT, no historical M&A pattern su skills-tech, cultura build-internal forte                           |
| **TeamSystem**                                       | M&A pattern su software contabile/fiscale, zero precedenti su HR competence platform                                               |
| **Workiva / Sweep / Greenly** (sustainability)       | Zero competence HR in casa, integration cost > savings, ICP completamente diverso (CFO/CSO buyer, non CHRO)                        |
| **PE roll-up Vista/Thoma Bravo/Hg**                  | Soglia minima tipica €5-10M ARR per add-on, €30-50M ARR per anchor. heuresys-evo: €0 ARR. Non in scope                             |
| **Workday/SAP/Oracle**                               | Build-internal in 12 mesi, già notato dal team ([`00-executive-summary.md`](./00-executive-summary.md) §8: "Improbabile")          |
| **Italian PA via Capgemini/Reply**                   | Vendor lock-in cycle 18-24 mesi, no fit per acquisition (loro non comprano, integrano in practice billable)                        |

**Net**: dei 6 profili "Best fit / Strong fit" del team, **zero** sono compratori realistici a quotazione 350-700k€ per asset pre-revenue. Restano due categorie: (a) un single buyer molto strategico con tesi specifica (probabilità trovare = bassa, time-to-find = 6-12 mesi), (b) acqui-hire pure dove l'acquirente compra il founder per €100-200k cash + RSU.

**Financial implication**: Pricing power dell'acquirente in negoziazione = **~90%** (heuresys-evo non ha alternative buyer, founder non ha cash runway personale documentato). Sconto realistico atteso vs anchor team: -75% a -85%.

**Recommendation**: Pretendere lista di 3+ acquirenti alternativi documentati prima di firmare LOI. Senza alternativi reali, **WALK AWAY** — il founder verrà a noi a un prezzo migliore in 6 mesi quando il runway si stringe.

---

## Attack #6: Marketing claim breach risk — "Layer ontologico tra ERP/HR/BI" è representation breach

**Evidence**: Mission CLAUDE.md dichiara "Layer ontologico tra ERP/HR/BI per governare processi, struttura, ruoli, competenze e performance via Knowledge Graph ESCO bilingue (IT/EN)". Reality runtime: "Zero connettori shipped. `/explorer/sap` mostra status non sync. `marketplace/webhooks/api-keys/plugins` = stage Tier 3 (non iniziato)" ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §3 prima riga).

**Severity**: **MATERIAL** legale.

**The team said**: "Mission match score: ~25-30%" e classifica come "high" ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §10), suggerendo che il codice è "onesto sui gap".

**Reality is**: il fatto che il **codice** sia onesto non protegge l'**acquirente** dalle representation che il founder ha pubblicato. Repo PUBLIC su GitHub (Spen-Zosky/heuresys-evo) con CLAUDE.md e marketing claim accessibili a chiunque, incluso a futuri clienti pilot. Se l'acquirente promuove post-closing con la stessa narrativa "layer ontologico ERP/HR/BI" → primo cliente pilot disilluso può azionare:

- Action di **representation breach** (claim non corrisponde al delivered)
- Action di **acquisition material misrepresentation** (acquirente pagò per X, vende come X, X non esiste)
- In giurisdizione EU: violazione **Direttiva 2005/29/CE Pratiche Commerciali Sleali** B2B-extended

Inoltre: il team segnala anche "AAA passing claim è axe-only (~30-57% delle violazioni reali)... EAA 2025-06-28 mandatory già passata" ([`08-tech-debt-registry-consolidated.md`](./08-tech-debt-registry-consolidated.md) finding C8). Quindi l'acquirente eredita anche **exposure sanzioni EU per accessibility claim non sostenibili** — sanzioni EAA possono arrivare a 5% revenue annuo per nazione di violazione.

**Financial implication**: Liability legale stimabile €50-300k per primo claim, oltre a PR damage incalcolabile. Costo per "rebrandare onestamente" il prodotto post-acquisition = 80-150h FTE marketing/legal/product = **€15-30k** + potential revenue delay 6 mesi.

**Recommendation**: **NEGOTIATE-DOWN -€100-200k** + clausola di **R&W insurance obbligatoria** (€20-50k premium) + indennizzo founder personale per claim ante-closing.

---

## Attack #7: License strategy pending = repo PUBLIC senza LICENSE = chiunque può fork

**Evidence**: "License strategy decision pre-LOI — ADR-0019 open question. B2B SaaS commercial license vs OSS dual-license: pre-condition contrattuale per IP clarity. **Repo è PUBLIC su GitHub (Spen-Zosky/heuresys-evo) senza LICENSE OSS = legal risk acquirente**" ([`00-executive-summary.md`](./00-executive-summary.md) §7 condizione #5).

**Severity**: **MATERIAL** IP.

**The team said**: Lo include come "condition precedent" da risolvere pre-LOI.

**Reality is**: questo è peggio di un open issue di compliance. Un repo pubblico su GitHub **senza file LICENSE** è in stato di **default copyright** US/EU — il copyright è del founder, ma chiunque ha già potenzialmente clonato/forkato il codice (GitHub conserva fork pubblici indelebilmente). Se domani Eightfold o un consorzio open-source EU forka il repo, aggiunge LICENSE Apache 2.0 sul proprio fork e claim "legitimate fork", l'acquirente affronta **anni di IP litigation** per dimostrare che il fork è illegale (in giurisdizioni come Germania o Olanda dove il "good faith use" è più tutelato di US).

Verifico inoltre: il team non ha quantificato quanti fork esistono **oggi**. Senza il dato, l'acquirente non sa **quante copie del proprio asset core esistono già fuori dal proprio controllo** post-closing.

**Financial implication**: IP litigation cost €100-500k worst-case per giurisdizione, con probabilità >0% e <30% (range largo per incertezza). Outcome anche se vinto = 18-36 mesi di legal hold sull'asset, durante i quali non si può IPO né rivendere.

**Recommendation**: **CONDITION PRECEDENT BLOCCANTE**: founder deve (a) chiudere repo pubblico → privato 90 giorni prima di closing, (b) firmare assignment IP esclusivo, (c) garantire indemnification per fork pre-existenti, (d) fornire forensic GitHub fork audit. Senza, **WALK AWAY**.

---

## Attack #8: Brand workstream burn-rate rivela GTM incapacity

**Evidence**: "Brand identity workstream (12 phase) **120-200h FTE**" ([`00-executive-summary.md`](./00-executive-summary.md) §5). "Re-exploration brand Phase 4 (32 direzioni esplorate) suggerisce founder ancora a livello strategico esplorativo, non execution mode → mismatch potenziale con acquirer aspettative scaling" ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §9). "Per un acquirente technical, segnala possibile **product-market fit ancora non raggiunto** → priorità founder sbilanciate verso identità" ([`09-product-scope-reality.md`](./09-product-scope-reality.md) §6 verdict workstream).

**Severity**: **MAJOR** signal su capability founder.

**The team said**: Brand identity v0 è "asset chiavi-in-mano" che vale "€30-60k saved on agency" ([`00-executive-summary.md`](./00-executive-summary.md) §4 strength #2).

**Reality is**: tradotto in linguaggio CFO — **il founder ha investito 120-200h FTE (35-60% del budget cost-to-date) sul logo invece di chiamare un design partner**. In una startup pre-revenue dove zero-customer è il problema #1, allocare 1/3 del effort budget su brand identity è un **red flag GTM capability** enorme. Significa una di tre cose: (a) il founder non sa fare outbound sales, (b) il founder evita conversazioni difficili con clienti reali, (c) il founder pensa che il design risolva il problema commerciale. Tutte e tre = **acquirente eredita un product-driven founder che NON sa scalare commercialmente**.

L'asset brand €30-60k saved è reale **solo se l'acquirente accetta il branding heuresys**. Acquirenti tipo Personio o TeamSystem **rebranderanno** il prodotto post-closing — i €30-60k diventano **sunk cost throwaway**.

**Financial implication**: Brand asset value scontato a €0-15k (residual reuse di palette/typography tokens, non logo/wordmark). Inoltre: founder GTM capability red flag = sales lead executive da assumere day-1 con loaded cost €120-180k/anno = **€240-360k extra burn nei 24 mesi post-closing** non previsti dal business case del team.

**Recommendation**: **NEGOTIATE-DOWN -€50-80k** sul valore brand workstream. Pretendere che il founder partecipi ad almeno 5 customer discovery call prima del closing per validare GTM capability.

---

## Attack #9: Single Point of Failure infra + DR co-located = compliance immediate liability

**Evidence**: "1 VM Oracle Free Tier ARM64 host TUTTO lo stack (FE+API+enrichment+Postgres+Redis+nginx). Zero HA, zero standby, zero multi-region" ([`00-executive-summary.md`](./00-executive-summary.md) §3 finding C2). "NO Disaster Recovery off-site: backup co-locati sulla stessa VM del DB. Bucket OCI dichiarato 'not yet provisioned'" (idem finding C4). "Viola SOC 2 CC7.4 + ISO 27001 A.12.3 + GDPR Art. 32" ([`08-tech-debt-registry-consolidated.md`](./08-tech-debt-registry-consolidated.md) C4).

**Severity**: **MATERIAL** compliance.

**The team said**: Effort fix C2 = "80h + ~15-30k EUR/anno" + C4 = "16h + ~200 EUR/anno bucket".

**Reality is**: il team conta solo il **technical fix cost**. Manca:

- **Sanzioni potenziali GDPR Art. 32** per data loss event pre-fix: fino a 4% revenue mondiale o €20M (whichever higher). heuresys-evo: zero revenue, sanzione cap €20M legale anche con 0 fatturato
- **Liability customer pilot perso per data loss**: se primo paying customer (M+9-15) sperimenta data loss durante DR gap, customer trust irreparabile + breach contract action
- **Insurance premium**: cyber insurance per platform su Free Tier OCI single-VM = **non assicurabile** da underwriter mainstream (Lloyd's, Allianz, Munich Re hanno baseline minima HA + DR off-site). Acquirente eredita **rischio non trasferibile**

**Financial implication**: Costo reale Day-1 di mettere infra in stato assicurabile = €50-100k (HA + DR + cyber insurance + audit) + €25-40k/anno running cost. **Non €15-30k come dice il team.**

**Recommendation**: **NEGOTIATE-DOWN -€80-120k** per pre-funded infra hardening, oppure pretendere che founder spenda i primi €80k post-closing su HA+DR prima di toccare feature work.

---

## Acquirer fit reality check

Riprendiamo i profili del team, con valutazione diretta:

| Profile team                | Rating team | Mio rating | Razionale brutale                                                                                                |
| --------------------------- | ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| EU tier-2 HCM scale-up      | ⭐⭐⭐⭐⭐  | ⭐⭐       | Build > Buy a €150-300k vs €500-700k. Personio/HiBob non hanno historical M&A pattern su skills-tech pre-revenue |
| Sustainability/ESG platform | ⭐⭐⭐⭐    | ⭐         | ICP completamente diverso (CFO buyer), zero competence HR in casa per integrare                                  |
| Italian PA / consulting     | ⭐⭐⭐      | ⭐         | Non comprano, integrano in practice billable. Capgemini/Reply usano build-or-license, non acquisition            |
| PE roll-up                  | ⭐⭐        | ⭐         | Soglia minima €5M ARR per add-on. heuresys-evo: €0 ARR. Out of scope strutturalmente                             |
| Enterprise US incumbent     | ⭐          | ⭐         | Build-internal in 12 mesi. Confermato dal team                                                                   |
| EU OSS exit                 | ⭐          | ⭐⭐       | Unica via realmente plausibile, ma non commerciale (€0-50k token)                                                |

**Bottom line acquirer fit**: **realistic acquirer pool size = 1-3 buyer**, di cui 0 ha pattern M&A documentato per pre-revenue skills-tech. Pricing power asimmetrico schiacciante per buyer.

---

## TAM/SAM reality check

**Team claim**: SAM EU €300-500M, SOM 5y €15-30M ([`10-competitor-analysis.md`](./10-competitor-analysis.md) §1.1).

**Brutale**:

- Il team stesso ammette "**±40% incertezza**" e "nessun analyst mainstream tracciava la categoria 'Organizational Intelligence' prima del 2025" ([`10-competitor-analysis.md`](./10-competitor-analysis.md) §1.1 caveat severità HIGH)
- SOM "3-6% del SAM EU, **ottimistico per single-vendor early-stage**" — l'aggettivo è del team stesso
- Realistic SOM 5y per single-vendor con €0 ARR oggi e zero pipeline: **€2-5M** (top 1% startup outcome), median outcome **€0-500k** (95° percentile = exit/acqui-hire pre-revenue)
- "Heuresys-evo deve crearla [la categoria], non inserirsi" — category-creation success rate B2B EU 2020-2025 = **<10%** per startup pre-revenue (fonte: CB Insights startup graveyard pattern, PitchBook EU SaaS post-mortems)

**Net**: il SOM realistico per sostenere una valuation €350-700k è **4-8× quello che heuresys-evo realisticamente catturerà** nei prossimi 5 anni in scenario base, **20-40×** in scenario downside.

---

## What CFO will ask (3-5 domande dure non poste dal team)

1. **"Quante conversazioni di customer discovery (≥30 min) ha condotto il founder negli ultimi 12 mesi, e con chi nominativamente?"** — il team non ha chiesto. Se la risposta è <10, abbiamo prova che la GTM motion non esiste e il founder è ingegneristico-only.

2. **"Quanti fork pubblici esistono OGGI del repo `Spen-Zosky/heuresys-evo` e in quali geografie/società?"** — il team ha segnalato la license issue ma non ha quantificato l'esposizione. Senza forensic fork audit, non possiamo quantificare IP risk.

3. **"Qual è il founder's personal cash runway in mesi senza questo deal?"** — determina pricing power asimmetrico. Se runway <6 mesi, possiamo aspettare e comprare a -50% in Q4 2026.

4. **"Quale percentuale dei 314 commit del founder è stata generata con AI agent (Claude Code CLI / Cursor / Copilot) vs hand-written?"** — proxy diretto per "productivity collapse risk" post-acquisition se AI access viene corporate-restricted.

5. **"In scenario worst-case (founder leaves M+3 + zero customer M+12), qual è il salvage value dell'asset?"** — se la risposta del seller è <30% del cash al closing, il deal è strutturalmente sbagliato a qualunque prezzo non-zero.

---

## Bottom line

**Verdict primario**: **WALK AWAY** in assenza di:

- ≥1 design partner agreement firmato (LOI o pilot contract)
- IP cleanliness audit completo (fork forensic + LICENSE assignment)
- Founder GTM evidence (≥10 customer discovery call documentate)
- 3 alternativi buyer documentati (proof di pricing tension)

**Verdict alternativo se Senior Partners insistono**: **NEGOTIATE -75% a -85%** sul mid-point team €525k:

| Componente deal                    | Team anchor        | DA-business raccomandato                                             |
| ---------------------------------- | ------------------ | -------------------------------------------------------------------- |
| Cash al closing                    | €350-700k          | **€75-130k** (asset-only fair value)                                 |
| Earnout 36 mesi su milestone       | non strutturato    | **€200-350k** subordinato a ≥3 paying customer + ARR ≥€500k cumulato |
| Founder salary post-closing        | non quantificato   | **€80-110k/anno × 24 mesi = €160-220k** capped                       |
| R&W insurance + IP indemnification | non previsto       | **€30-50k premium** + indemnification cap €200k                      |
| **Total max exposure**             | **€350-700k cash** | **€465-810k** ma 70% subordinato a milestone                         |

Questo struttura il deal come **option call su un acqui-hire success scenario** invece che come **asset purchase di una platform inesistente**. Se il founder rifiuta, il prezzo che chiede è **proof per absurdo** che non crede al proprio business case — e dovreste credere a lui.

**Walk-away probability raccomandata**: **65-75%**.

Cordialmente, l'avvocato del diavolo che vi protegge dal bruciare €350-700k.

— DA-business

---

_Memo prodotto su mandato CFO + Head M&A. Non vincolante. Da consumare in combinato disposto con `13-devils-advocate-technical.md` (parallel) e `15-rebuttal-and-synthesis.md` (Sessione 2)._
