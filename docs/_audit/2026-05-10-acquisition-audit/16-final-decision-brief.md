# Final Decision Brief — heuresys-evo Acquisition

> **Mandato**: ACQ-AUDIT-2026-05 · **Data**: 2026-05-10 · **Status**: **SIGNED FINAL** post-rebuttal · **Update post-S28 Wave 1 docker-eradication**: vedi `19-remediation-execution-report.md`. C3 (Doc-runtime drift) era false-positive parziale — runtime ATTUALE è bare-metal puro (zero Docker container/compose nel repo, ADR-0023 già canonical). Wave 1 ha pulito doc + 13 script docker-legacy + ADR sweep (0002 superseded → 0027, 0004 superseded, 0023 annotated, 0006 fictional services puliti). Acquirer può scontare meno per C3 nel deal value.
> **Owner audit**: M&A Tech Due Diligence Team (12 subagent specialisti + 2 Devil's Advocate + main thread synthesis)
> **Audience**: Senior Partners (M&A committee acquirente)
> **Lingua**: italiano
> **Supersedes**: `00-executive-summary.md` draft preliminary

---

## DECISION

# **NEGOTIATE STRUTTURATO**

— deal eseguibile come **asset purchase + acqui-hire + earnout milestone-based**, NON come SaaS revenue-multiple

**Valuation range raccomandata**: **€380-750k all-in**, sweet spot **€500-600k** per acquirer mature
**Walk-away conditions**: 5 trigger espliciti (vedi §6)
**Pre-closing condition precedent**: 7 obbligatorie (vedi §5)
**Founder retention**: vincolante 36 mesi con vesting cliff 12 mesi + accelerator clause

---

## 1. Path to decision

| Fase                                                  | Output                                            | Verdict                                      |
| ----------------------------------------------------- | ------------------------------------------------- | -------------------------------------------- |
| Fase A discovery (10 subagent specialisti, parallelo) | 10 deliverable D1-D9                              | NEGOTIATE preliminary uniforme               |
| Fase B synthesis (main thread)                        | tech debt registry + executive draft              | NEGOTIATE preliminary consolidato            |
| Fase C Devil's Advocate (2 critic, parallelo)         | 16 attacchi tra DA-tech (7) + DA-business (9)     | WALK AWAY o NEGOTIATE -60% to -85%           |
| Fase D Rebuttal (main thread, seller-side)            | 7 accepted + 5 mitigated + 2 rejected + 2 partial | NEGOTIATE strutturato a €500-600k sweet spot |
| Fase E Final Brief (questa documento)                 | decision firmata                                  | **NEGOTIATE SIGNED**                         |

**Sanity check**: il rebuttal ha accettato il 44% degli attacchi DA, mitigato il 31%, respinto solo il 12%. Il verdict finale **non è una difesa del verdict preliminary** ma una **riformulazione che incorpora attacchi validi**.

---

## 2. Rationale: perché NEGOTIATE e non BUY/PASS

### Perché NON BUY straight (non era mai sul tavolo)

- 8 critical findings di cui 6 fixable + 2 strategici
- 0 paying customer = nessun ARR multiple applicabile
- Founder bus factor 94% = retention package obbligatorio, non optional
- Doc-runtime drift sistemico = credibility breach scoperta in audit
- Mission vs Reality 25-30% match = rappresentation breach risk

### Perché NON WALK AWAY (raccomandazione DA-business 65-75% probabilità)

- **Asset value reale verificato**: code base + ESCO mapping + KG architecture + brand identity + design system + governance documentation = €240-520k replacement cost baseline (escluso opportunity cost)
- **Wedge competitivo verificato via web research**: D9 conferma nessun competitor SaaS B2B EU usa ESCO commercialmente (Actonomy parziale solo). Differenziale ESCO bilingue IT/EN + multi-tenant RLS DB-level + on-prem option = 3-trick combo non replicabile in <12-18 mesi
- **Regulatory tailwind concreto**: EU Pay Transparency Directive 2027 + AI Act Annex III 2026-08-02 + CSRD ESRS S1 = 3 driver di adozione enterprise concreti
- **Window timing critico**: M&A landscape favorevole 2026 H2 / 2027 H1, deteriora dopo (consolidamento incumbent, commoditization LLM)
- **Cost-to-date competitive**: €61.8k-217.7k stimato (mid €141k) per stand-alone evo è 2.5-3.5x typical single dev velocity = founder ha eseguito efficiency reale

### Perché NEGOTIATE strutturato

Deal structure: **asset purchase + acqui-hire + earnout milestone-based**, non SaaS revenue-multiple.

- **Cash al closing 25-35% del totale** (€100-200k baseline asset value)
- **Earnout 24-36 mesi 50-65% del totale** (€200-400k vincolato a milestone tecniche misurabili)
- **Founder retention package 15-20% del totale** (€80-150k vesting 36 mesi + accelerator)

Reasoning: il deal NON è "comprare un business in operating", è "comprare un asset + un velocity multiplier (founder + AI tooling) + opportunity cost time-to-market". Ciascuno valore va prezzato separatamente.

---

## 3. Findings consolidati post-rebuttal

### Critical findings azionabili (6)

| ID  | Finding                                      | Severità          | Effort fix                             |
| --- | -------------------------------------------- | ----------------- | -------------------------------------- |
| C1  | Phase 2 vertical-split deferred (65 view)    | Technical fixable | 15-25h FTE seller-side, M+1 timeline   |
| C2  | SPOF VM Free Tier — no HA                    | Infra hardening   | 80h + €15-30k/anno; M+3 timeline       |
| C3  | Doc-runtime drift severo (Docker vs systemd) | Strategic + audit | €8-15k esterno indep audit pre-closing |
| C4  | NO DR off-site backup                        | Compliance/risk   | 16h + €200/anno; M+1 quick win         |
| C7  | Mission claim "ERP/HR/BI" senza connettori   | Product gap       | 200-400h primo connettore; M+6         |
| C8  | WCAG AAA claim axe-only                      | Compliance gap    | 80-100h + €8-15k auditor; M+3 VPAT     |

### Critical findings strategici (2 — non technical fixable)

| ID  | Finding                                   | Implicazione                                              |
| --- | ----------------------------------------- | --------------------------------------------------------- |
| C5  | 0 paying customer                         | NO ARR multiple, asset purchase paradigm                  |
| C6  | Competitive existential threat (SAP/MSFT) | Window timing critical, focus narrow segment obbligatorio |

### High findings prioritized (16)

Vedi `08-tech-debt-registry-consolidated.md` per dettaglio. Total effort H1-H16: ~700-1100h FTE distribuito M+1 → M+12.

---

## 4. Valuation range strutturata

### Range full: €380-750k all-in

| Component                                         | Range basso | Range alto | Sweet spot |
| ------------------------------------------------- | ----------: | ---------: | ---------: |
| Cash al closing                                   |       €100k |      €200k |      €150k |
| Earnout 24-36 mesi (milestone-based)              |       €200k |      €400k |      €300k |
| Founder retention (vesting 36 mesi + accelerator) |        €80k |      €150k |      €120k |
| **TOTAL**                                         |   **€380k** |  **€750k** |  **€570k** |

### Earnout milestone schedule

| Milestone | Trigger                                                                                         |                 Payout |
| --------- | ----------------------------------------------------------------------------------------------- | ---------------------: |
| M+3       | SOC 2 Type 1 readiness audit external complete + WCAG VPAT firmato + pen-test cross-tenant PASS |  20% earnout (€40-80k) |
| M+6       | First paying customer LOI → contract executed + first HRIS connector MVP production             | 30% earnout (€60-120k) |
| M+9       | 2nd paying customer onboarded + ARR ≥€50k cumulato                                              |  20% earnout (€40-80k) |
| M+12      | 3rd paying customer + ARR ≥€100-300k cumulato + SLA ≥99.5% sostenibile                          | 30% earnout (€60-120k) |

Total earnout 100% se tutti milestone PASS entro M+12.

### Founder retention schedule

| Period             |       Vesting | Trigger                                                            |
| ------------------ | ------------: | ------------------------------------------------------------------ |
| Closing day → M+12 | 33% (€26-50k) | continuous employment                                              |
| M+12 → M+24        | 33% (€26-50k) | continuous employment + ARR ≥€300k cumulato                        |
| M+24 → M+36        | 34% (€27-50k) | continuous employment + ARR ≥€500k cumulato OR ≥10 paying customer |

**Accelerator clause**: 100% vesting se acquirer è acquired by 3rd party OR strategic redirection rimuove product line entro M+24.

---

## 5. Pre-closing condition precedent (7 obbligatorie)

### CP1 — Pen-test cross-tenant isolation PASS [BLOCKING]

- Third party advisor (Cure53, Bishop Fox, equivalent) — €20-40k
- Seller deve implementare RLS bypass test suite (16-30h FTE) PRIMA del pen-test
- Output: report PUBLIC PASS o lista vulnerabilità con remediation plan
- Trigger: report PASS, sennò re-test post-remediation

### CP2 — IP forensic audit + LICENSE explicit [BLOCKING]

- Step 1 pre-LOI: seller aggiunge LICENSE file esplicito (proprietary B2B SaaS license)
- Step 2 pre-LOI: GitHub API audit fork count + geographies (DA-tech "domanda non posta" #1)
- Step 3 pre-closing: IP forensic audit (~€5-15k advisor) per trademark + copyright assignment + open-source dependency license compliance scan
- Step 4 pre-closing: legal opinion EU IP counsel su license strategy + clean-room procedure code authorship
- Trigger: nessun fork commerciale pre-existing scoperto; sennò revisione termini -20% to -30%

### CP3 — Off-site DR backup activated [BLOCKING — quick win]

- Bucket OCI cross-region encrypted activation (16h + €200/anno)
- Test restore drill PASS pre-closing
- Trigger: backup chain operational confirmed

### CP4 — Doc-runtime drift independent audit [BLOCKING]

- Third party audit (~€8-15k) per identificare TUTTI i drift residui
- Seller produce: lista runtime ports actual, processi systemd/Docker actual, lista ADR superseded vs Accepted con verifica filesystem
- Escrow specifico 5% deal value (€19-37k) held 6 mesi per remediation residua
- Trigger: ≤5 ulteriori drift critici scoperti; sennò revisione strutturale

### CP5 — Marketing claim revision + R&W warranty [BLOCKING]

- Pre-closing: seller riscrive mission statement (CLAUDE.md + website + pitch deck) per riflettere reality OGGI
- R&W: seller warranties accuracy of all marketing materials at closing
- Liability cap: legal opinion su existing pitch material in-circolazione
- Escrow specifico 3-5% (€11-37k) per settlement potenziale rappresentation breach claims
- Trigger: revisione completa documented pre-closing day

### CP6 — Buyer outreach exercise via M&A advisor [BLOCKING per acquirer]

- Pre-LOI: M&A advisor retainer (~€20-40k) per sondare ≥10 buyer alternativi
- Threshold: ≥3 buyer NDA + initial discussion entro 90 giorni
- Trigger: validate buyer pool reale, non speculative

### CP7 — Founder retention package + immediate team integration [CLOSING DAY]

- Founder retention vincolante 36 mesi vesting cliff 12 mesi + accelerator
- Non-compete clause 24 mesi
- Onboarding immediate L2 SRE + 1 senior fullstack pre-day-one (NOT day-30)
- Anthropic API account migration personal → corporate pre-closing
- 30 giorni stress-test pre-closing con AI access ridotto del 50% per misurare velocity baseline corporate
- Trigger: founder firma + integrazione team operativa day-1

---

## 6. Walk-away triggers (5)

Acquirente WALK AWAY incondizionatamente se:

1. **CP1 pen-test cross-tenant fails irrecuperabile** (impossible to fix in 90 giorni con ragionevole effort) → architectural rewrite required = deal-breaker
2. **CP2 IP forensic audit rivela fork commerciali pre-existing** o ownership disputed → IP grey area non risolvibile
3. **CP6 buyer outreach <3 buyer interest in 90 giorni** → asset value speculative, mercato non valida
4. **CP7 founder rifiuta retention package vincolante o non-compete 24+ mesi** → bus factor non mitigabile
5. **CP4 doc-runtime drift independent audit rivela ≥10 ulteriori critical drift** → credibility breach sistemico, intera DD inaffidabile

---

## 7. Acquirer-specific calibration

| Acquirer profile                                                                             |     Sweet spot all-in | Discount vs €570k baseline |                       Time-to-v1.0 |
| -------------------------------------------------------------------------------------------- | --------------------: | -------------------------: | ---------------------------------: |
| **EU tier-2 HCM scale-up DevOps-mature** (Personio · HiBob · **Zucchetti** · **TeamSystem**) |         **€500-600k** |                 -10% to 0% |                          9-12 mesi |
| **EU sustainability/ESG platform** (Workiva · Sweep · Greenly · Position Green)              |         **€450-550k** |               -15% to -20% |                         12-15 mesi |
| **Italian consultancy** (Capgemini · Reply · Engineering · Almaviva)                         |         **€350-500k** |               -25% to -35% |                         15-20 mesi |
| **PE roll-up add-on** (Vista · Thoma Bravo · Hg Capital)                                     |         **€300-450k** |               -30% to -45% |                         12-15 mesi |
| **Enterprise US incumbent** (Workday · SAP · Oracle · Microsoft)                             | **PASS** raccomandato |                        N/A | costruirebbero internal in 12 mesi |

**Buyer raccomandato**: **Zucchetti o TeamSystem** (Italian HR Tech leader) — domestic market access + ESCO IT bilingue alignment + skill ontology integration sinergica + M&A track record proven (Zucchetti ha acquisito 30+ companies last 5 anni).

---

## 8. Investment totale post-acquisition (sintesi roadmap)

Per portare la piattaforma a v1.0 commercial-ready (M+12):

| Categoria                                                            | Range                          |
| -------------------------------------------------------------------- | ------------------------------ |
| Acquisition cost (deal value)                                        | €500-600k sweet spot           |
| Pre-closing audit/advisor cost (CP1+CP2+CP3+CP4+CP5+CP6 esterni)     | €100-180k cumulative           |
| Team cost M+0 → M+12 (5-7 FTE loaded EU)                             | €700k-1.1M                     |
| External cost roadmap M+0 → M+12 (audit, infra HA, monitoring, ecc.) | €122-237k + €48-102k/anno OPEX |
| **TOTAL CAPEX TO V1.0 (excluding ongoing OPEX)**                     | **€1.42M-2.12M**               |

**Acquirer ROI horizon**: ARR €100-300k a M+12 + ARR €500k a M+18 + scale to €2-5M ARR by M+30-36 = **payback 30-48 mesi** in scenario mediano.

---

## 9. Dissenting opinion documented

I 2 Devil's Advocate hanno raccomandato:

- **DA-tech**: WALK AWAY o NEGOTIATE -60% (€200-360k)
- **DA-business**: WALK AWAY 65-75% probabilità OR NEGOTIATE -75/-85% (€75-130k cash + 70% earnout)

Il rebuttal ha accettato il 44% degli attacchi e mitigato il 31%. La differenza tra DA range (€75-360k) e final brief (€500-600k) si spiega con:

- Asset value baseline correttamente quantificato post-rebuttal (€240-520k incluso opportunity cost moderato)
- ESCO moat non "overhyped" come DA sostiene (verifica web research conferma gap commerciale storico)
- Brand workstream NON "burn" come DA sostiene (asset acquisibile reale, brand book completo)
- Acquirer profile EU mature (Zucchetti/TeamSystem) DA non aveva considerato

**Caveat**: se acquirente è **Enterprise US incumbent** (Workday/SAP), le DA recommendation diventano valide → **PASS o WALK AWAY**.

---

## 10. Key open questions per acquirer pre-LOI

Domande residue che il team interno NON ha risposto e che acquirente DEVE risolvere pre-LOI:

1. **Fork pubblici esistenti**: GitHub API check fork count + geographies di `Spen-Zosky/heuresys-evo` (CP2)
2. **Customer pipeline reale**: founder ha LOI/MOU/POC firmati con prospect non-sintetici? (CP6 + DA-business)
3. **Founder personal cash runway**: pricing power asimmetrico se <6 mesi runway (DA-business)
4. **AI velocity baseline test**: 30 giorni con Anthropic API access ridotto del 50% — quanto velocity rimane? (CP7 stress-test)
5. **License strategy decision**: proprietary B2B SaaS vs OSS dual-license — decisione commerciale acquirer-side (CP2)
6. **Repo legacy `heuresys.com.evo`**: included in deal o standalone? (cost-to-date implication)
7. **Trademark "Heuresys" registration status**: registered EU? Italian INPI? US? (CP2)
8. **Customer discovery interview log**: founder ha ≥30 interview log con prospect non-sintetici negli ultimi 12 mesi? (DA-business)

Risposte a queste 8 domande riducono incertezza valuation di ±20%.

---

## 11. Bottom line

# **NEGOTIATE €500-600k all-in con acquirer EU HCM tier-2 (Zucchetti / TeamSystem preferred), strutturato asset+acqui-hire+earnout, 7 condition precedent, 5 walk-away triggers**

L'audit ha verificato: foundation tecnico healthy, governance asset-grade, wedge competitivo verificato, regulatory tailwind concreto, ma anche 8 critical + 16 high finding che richiedono €1.42M-2.12M total CAPEX investment per portare a v1.0 commercial-ready in 12 mesi.

Il deal vale per acquirer mature che valorizza time-to-market (3-13x ROI vs cost-to-date). Non vale per acquirer enterprise US (build-internal in 12 mesi) né per PE pure-play (sub-scale per platform).

Window timing critico: 2026 H2 / 2027 H1 ottimale, deteriora dopo per consolidation incumbent + commoditization LLM.

---

**Decision Brief firmato dal team M&A Tech Due Diligence**:

- Architecture review: NEGOTIATE preliminary D1
- Database review: NEGOTIATE preliminary D2 (1 critical, fixable)
- Security audit: NEGOTIATE preliminary D3
- Frontend + a11y: NEGOTIATE preliminary D4
- DevOps + infra: NEGOTIATE preliminary D5 (3 critical, fixable + leverage acquirer)
- Test quality: NEGOTIATE preliminary D6
- Product scope: NEGOTIATE preliminary D8 (asset purchase paradigm)
- Competitor analysis: NEGOTIATE preliminary D9 (wedge cond.)
- Market context: NEGOTIATE preliminary D9 (window timing 2026 H2 / 2027 H1)
- Tech debt registry: 8 critical / 16 high consolidato
- Devil's Advocate (technical + business): WALK AWAY o NEGOTIATE -60% to -85%
- Rebuttal: 7 accepted / 5 mitigated / 2 rejected / 2 partial
- **CONSENSUS post-rebuttal**: **NEGOTIATE strutturato €500-600k sweet spot per acquirer mature EU HCM tier-2**

Document signed: 2026-05-10.
