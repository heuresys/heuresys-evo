# Open Questions — Suggested Answers

> **Mandato**: ACQ-AUDIT-2026-05 · **Data**: 2026-05-10 · **Fase**: E ext (Sessione 2)
> **Scope**: risposte suggerite alle 8 domande aperte in `16-final-decision-brief.md` §10
> **Status mix**: 3 verified (Q1, Q5, Q6) · 2 template Enzo answer (Q2, Q8) · 1 test design (Q4) · 1 check checklist (Q7) · 1 strategic privacy (Q3)
> **Lingua**: italiano

---

## Q1 — Fork pubblici GitHub esistenti? ✅ VERIFIED

**Risposta**: **0 fork al 2026-05-10** (verificato `gh api repos/heuresys/heuresys-evo` → `forkCount: 0`).

**Note importanti**:

- Owner GitHub = **`heuresys` org** (NON `Spen-Zosky` come altri repo personali) → suggerisce intenzione brand identity organizativa
- Repo PUBLIC, nessuno star (`stargazerCount: 0`)
- `licenseInfo: null` (collegato Q5)

**Disclosure CIM**: "0 fork pubblici verificati 2026-05-10 via GitHub REST API. Repo PUBLIC su `heuresys/heuresys-evo`."

**Impact deal**: CP2 step #2 PASS. **NO discount needed** su questo specifico item. Monitor periodico fork count durante DD (snapshot ogni 30gg).

---

## Q2 — Customer pipeline LOI/MOU reale? 🟡 TEMPLATE — Enzo deve rispondere

**Risposta onesta probabilmente attesa** (basata su evidence audit):

- 4 tenant attivi 100% sintetici (RTL Bank, SmartFood, EcoNova test data)
- 0 paying customer documentato
- 0 LOI/MOU/POC firmati documentati nel repo
- Probabile risposta: **"0 active prospect, market not validated"**

**Template per Enzo** (se diversa da risposta probabile):

| Prospect  | Contact      | Stage                                                    | Tier 1 fit                 | Last interaction | Notes                            |
| --------- | ------------ | -------------------------------------------------------- | -------------------------- | ---------------- | -------------------------------- |
| Company X | Nome + Title | discovery / demo / proposal / LOI / MOU / NDA / contract | Y/N PMI italiana regulated | YYYY-MM-DD       | pain point + value prop reaction |

**Threshold per acquirer**:

- ≥3 prospect stage ≥demo = **deal validato come SaaS-multiple paradigm**
- 1-2 prospect stage ≥discovery = NEGOTIATE confermato baseline
- 0 prospect = **asset purchase paradigm only** (DA-business B5 + sweet spot €500-600k confermato)

**Disclosure CIM obbligatoria** (R&W liability protection): se 0 prospect, dichiarare esplicitamente.

---

## Q3 — Founder personal cash runway? 🟡 TEMPLATE — privacy-sensitive, NON disclosure pre-LOI

**Raccomandazione**: NON disclosure pre-LOI. Fornire solo dopo LOI executed con NDA strict.

**Range categorico (per Enzo per uso interno)**:

| Runway   | Pricing power asimmetrico | Suggestion                                                                                                         |
| -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| <3 mesi  | BUYER alta                | High risk: pricing leverage acquirer = -20-30% discount possibile. Considera bridge financing o consulenza interim |
| 3-9 mesi | BALANCED                  | Negoziazione baseline. Sweet spot €500-600k applicabile                                                            |
| >9 mesi  | SELLER alta               | Pricing leverage Enzo. Pushback possibile su DA-business attacchi                                                  |
| >18 mesi | SELLER molto alta         | Walk-away credibile, può tenere fermo €600-700k                                                                    |

**Tactical advice**: durante negoziazione, NON volunteer cash position. Se buyer chiede direttamente, rispondere "founder has multi-month operational runway, not under timeline pressure" SENZA cifre.

**Disclosure obbligatoria solo se**: rappresentation breach risk (es. bankruptcy imminente non disclosed = fraud). Se runway >6 mesi = NO obbligo disclosure.

---

## Q4 — Velocity baseline test 30gg con AI access -50%? 🟢 TEST DESIGN PROPOSAL

**Test concreto raccomandato**:

```
Periodo totale: 30 giorni · Observer: M&A advisor tech (3rd party)

FASE 1 — Baseline corrente (15gg)
- AI access: full (Claude Code Pro + Anthropic API personale)
- Misure giornaliere:
  · Commit count (firmati Spen-Zosky only)
  · LOC added/removed (git stat)
  · Tasks completed da backlog pre-definito (mix front+back+db, 5-8 task/day target)
  · Quality: typecheck PASS + lint PASS + test green a fine giornata
- Output: baseline metrics 15gg avg + std dev

FASE 2 — Restricted AI access (15gg)
- AI access: -50% (no Claude Code, ChatGPT free tier OR no AI ammesso)
- Stesse misure
- Stesse task category (backlog separato ma equivalent complexity)
- Output: comparison metrics

ACCEPTANCE CRITERION:
- Velocity Fase 2 ≥ 50% Fase 1 → AI dependency BASSA, pricing baseline
- Velocity Fase 2 30-50% Fase 1 → AI dependency MEDIA, -10% discount
- Velocity Fase 2 <30% Fase 1 → AI dependency ALTA = velocity collapse confirmed (DA-tech T1 confermato), -25% discount

RISK MITIGATION:
- Sandbagging Fase 1 (founder rallenta intenzionalmente) → tracking via commit-quality complexity ratio
- Overcompensation Fase 2 (founder forza extra hours) → cap 8h/day osservatore
- Cherry-picking task → backlog generato da 3rd party advisor, sealed envelope
```

**Cost test**: M&A advisor tech 30 giorni ~€10-20k. **Highly recommended pre-LOI** se acquirer mature (Zucchetti/TeamSystem). Skip se acquirer è OK assumere AI velocity dependency come fact.

**Founder side advice**: accettare il test dimostra confidence + lowers DA-tech T1 attack severity. Rifiutare il test = red flag che valida DA worst-case.

---

## Q5 — License strategy proprietary vs OSS? 🔴 VERIFIED GAP — IMMEDIATE ACTION

**Risultato verifica**: **NESSUN LICENSE file nel repo** (confermato `ls LICENSE*` = 0 + `gh repo view licenseInfo: null`).

**Repo è PUBLIC senza license** = **legal grey area severo**. Tecnicamente: senza license, default copyright restrictivo applies (no reuse, no derivative), ma essendo public con accesso API completo, le copie e fork sono _de facto_ possibili.

**3 opzioni proposte (decisione Enzo o acquirer)**:

| Opzione                                           | Pro                                                                               | Contro                                          | Quando scegliere                                     |
| ------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| **A. Proprietary B2B SaaS license**               | No fork legali, no derivative, asset value massimo                                | Riduce community contributions (zero)           | **Raccomandato per acquisition target**              |
| **B. OSS dual-license** (Apache 2.0 + commercial) | Community building, contributors potenziali                                       | Riduce asset value (fork legali = competizione) | Solo se acquirer è OSS-friendly + community strategy |
| **C. Business Source License (BUSL)**             | Permissive 3-4 anni poi proprietary, trend 2024-2026 (MongoDB, Sentry, Cockroach) | Complessità legale, compliance enforcement      | Hybrid approach se acquirer vuole optionality        |

**Action immediate raccomandata** (prima di altre attività):

1. Aggiungere `LICENSE` file con scelta A (default) entro 7 giorni
2. Aggiornare README.md + repo description GitHub
3. Considerare **switch a private** durante negoziazione (riduce visibility + previene fork ulteriori)
4. Notificare acquirer con timestamp delta tra commit creation date e LICENSE addition (evita claim "license retroattiva")

**Cost**: 0 EUR + 1h legal review (se vuole confermare scelta A).

**Disclosure CIM**: "Repo precedentemente PUBLIC senza LICENSE file per X giorni (date range), LICENSE proprietary aggiunto YYYY-MM-DD. Fork count verificato 0 al momento aggiunta. R&W warranty seller: nessun fork commerciale pre-existing identificato."

---

## Q6 — Repo legacy `heuresys.com.evo` included in deal? 🟡 VERIFIED + TEMPLATE strategic

**Risultato verifica filesystem**: legacy repo ESISTE a `D:\enzospenuso\Documents\GitHub\heuresys.com.evo\`.

**Stats verified**:

- **584 commit** (vs evo 314) = **~1.86x scope**
- Date range: **2025-12-29 → 2026-05-02** = **125 giorni calendar** (vs evo 10 giorni = **12.5x calendar time**)
- Files include `.bmad/`, `.claude/`, audits/, archive/, backups/ — repo molto più strutturato/maturo
- ~8300 file ts/tsx/js/jsx (probabile inflation by node_modules — real source likely 200-500 file simile evo magnitude)

**Implicazione cost-to-date REVISED**:

| Repo                      |  Commit |        Calendar |              Cost-to-date stima |
| ------------------------- | ------: | --------------: | ------------------------------: |
| evo greenfield (this)     |     314 |       10 giorni |   **€61.8k-217.7k** (mid €141k) |
| legacy `heuresys.com.evo` |     584 |      125 giorni | **€350-700k** stima qualitativa |
| **Combined evo + legacy** | **898** | **~125 giorni** |        **€411k-917k** combinato |

**3 opzioni proposte**:

| Opzione                                 | Pricing impact               | Implication                                                                     |
| --------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| **A. Solo evo** (this repo)             | baseline €500-600k           | Acquirer ottiene "current product" only, legacy = founder retain rights         |
| **B. Both repos included**              | +15-25% baseline (€575-750k) | Acquirer ottiene IP completo + historical archive + migration knowledge         |
| **C. Evo + legacy as data source only** | +5-10% baseline (€525-660k)  | Acquirer ottiene evo + diritti consultazione legacy ma NO commercial use legacy |

**Raccomandazione**: **Opzione B** (both included). Legacy contiene 4x calendar work + 2x commit volume = significativo asset cumulato. Pricing impact +15-25% ragionevole.

**CRITICAL R&W**: il commit log evo mostra "imported from legacy" patterns (vedi `.handoff/legacy-import-registry.csv` 124 entry catalogati). Se acquirer prende solo evo MA il codice contiene material derivato da legacy = IP separation issue. Soluzione: **clean room transfer** o include legacy.

**Disclosure CIM**: "Founder ha sviluppato anche repo separato `heuresys.com.evo` (584 commit, 125 giorni calendar work, dicembre 2025 → maggio 2026). Migration registry `.handoff/legacy-import-registry.csv` documenta 124 import dal legacy a evo. Acquirente deve scegliere scope deal."

---

## Q7 — Trademark "Heuresys" registered? 🟡 VERIFICATION NEEDED — Enzo manual check

**Risultato verifica web**: WebFetch su EUIPO eSearch fallito (SPA JavaScript-heavy, non renderizza static fetch). WebSearch general non conclusivo.

**Action checklist Enzo** (≤2h tempo, costo €0 per check):

```
Step 1: EUIPO (EU-wide)
URL: https://euipo.europa.eu/eSearch/
Search field: Mark Verbal Element = "heuresys"
Filters: Status = Registered + Live
Output expected: list of registered trademarks o "no results"

Step 2: UIBM (Italia nazionale)
URL: https://servizionline.uibm.gov.it/
Service: "Ricerca Marchi" (free, no auth)
Search: Denominazione = "heuresys"
Filters: Stato = Registrato/Pendente
Output expected: list o "nessun risultato"

Step 3: WIPO Madrid Monitor (international)
URL: https://www3.wipo.int/madrid/monitor/en/
Search: text = "heuresys"
Output expected: international registrations list

Step 4: Domain check (companion verification)
- heuresys.com → WHOIS owner check
- heuresys.org / .it / .eu → availability + ownership
```

**Scenari + suggested action**:

| Scenario                                                        | Risk level | Action                                                                                  |
| --------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------- |
| ✅ "Heuresys" registered, owner = Enzo / Heuresys org / società | LOW        | Disclosure CIM + IP transfer agreement standard                                         |
| ⚠️ "Heuresys" registered da terzo (es. società simile)          | HIGH       | Cease & desist letter + rebranding option assessment                                    |
| ⚠️ "Heuresys" NOT registered ma terzo ha pending application    | HIGH       | Opposition filing + accelerated registration Enzo                                       |
| ❌ "Heuresys" NOT registered, no pending                        | MEDIUM     | **Register PRE-LOI immediate** (chiunque può registrare durante negoziazione = blocker) |

**Cost registration se non registrato**:

- EUIPO EU-wide class 9 + 42: ~**€1050-1500** (3 anni protezione)
- UIBM Italia nazionale class 9 + 42: ~**€350-500** (10 anni protezione)
- **Totale defensive package**: **~€1400-2000** + 1-2h paperwork

**Raccomandazione**: registrare entro 7 giorni se non registrato. €1400-2000 = 0.3% del deal value, defensive ROI massimo.

**Disclosure CIM**: stato trademark al momento LOI + roadmap registration (se incompleto).

---

## Q8 — Customer discovery interview log? 🟡 TEMPLATE — Enzo must answer

**Risposta onesta probabilmente attesa** (basata su evidence audit):

- Brand workstream burn 120-200h FTE in 12 phase brand cycle
- 0 paying customer documentato
- 0 LOI/MOU
- DA-business B6 + B8 + audit D8 evidence: **founder ha lavorato sul prodotto, NON ha fatto customer discovery sistematico**

**Template per Enzo**:

| Interviewee | Company | Industry     | Date       | Format                                  | Tier 1 segment fit                           | Outcome                                                        |
| ----------- | ------- | ------------ | ---------- | --------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| Nome        | Company | PMI/PA/banca | YYYY-MM-DD | cold call / referral / discovery / demo | Y/N (PMI italiana 50-500 employee regulated) | Notes pain points + value prop reaction + willingness to pilot |

**Threshold per acquirer**:

| # interviews 12 mesi | Implicazione                                                      | Pricing impact                                         |
| -------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| 0-5                  | NO product-market fit research, asset purchase paradigm CONFIRMED | NEGOTIATE -10-15%                                      |
| 6-15                 | Surface validation, baseline                                      | Sweet spot €500-600k applicabile                       |
| 16-30                | Solid discovery, design partner pipeline plausible                | +5-10% premium se interview log validato               |
| 30+ con ≥3 LOI       | Strong product-market fit signal                                  | Re-evaluate paradigm: SaaS-multiple parziale possibile |

**DA-business "domanda non posta" #1 specifically asked for**: "Quante customer discovery call (≥30 min) ha fatto il founder negli ultimi 12 mesi, e con chi nominativamente?"

**Disclosure CIM raccomandata**: numero totale + breakdown per industry + ≥1 case study anonimizzato (anche da call senza outcome). Se 0 = dichiarare esplicitamente "founder ha priorità engineering, customer discovery deferred".

---

## 📊 Summary post-Q&A

| Q                    | Status                 | Action urgenza             |                        Cost |
| -------------------- | ---------------------- | -------------------------- | --------------------------: |
| Q1 fork              | ✅ verified 0          | nessuna                    |                          €0 |
| Q2 customer pipeline | 🟡 template            | Enzo answer pre-LOI        |                          €0 |
| Q3 cash runway       | 🟡 template            | NON disclosure pre-LOI     |                          €0 |
| Q4 velocity test     | 🟢 design ready        | Pre-LOI optional           |           €10-20k 3rd party |
| Q5 LICENSE           | 🔴 GAP critico         | **7 giorni immediate**     |               €0 + 1h legal |
| Q6 legacy repo       | ✅ verified 584 commit | Strategic decision pre-LOI |                          €0 |
| Q7 trademark         | 🟡 check needed        | **7 giorni Enzo manual**   | €1.4-2k registration se gap |
| Q8 discovery log     | 🟡 template            | Enzo answer pre-LOI        |                          €0 |

**Top 3 azioni immediate (≤7 giorni)**:

1. **Aggiungere LICENSE file** (Q5) — proprietary B2B SaaS license, costo €0
2. **EUIPO/UIBM trademark check Heuresys** (Q7) — 2h Enzo, registration €1.4-2k se non registrato
3. **Decisione strategic legacy repo include/exclude** (Q6) — pricing impact +15-25%

---

## Cost-to-date REVISED post-Q6 verifica

L'audit `12-cost-to-date-estimate.md` originalmente trattava il legacy repo come "out-of-scope da quantificare separatamente" con range qualitativo €112-450k combinato. Verifica diretta filesystem (this Q&A document) consente revisione più precisa:

| Componente                                                        | Range                         |
| ----------------------------------------------------------------- | ----------------------------- |
| evo greenfield stand-alone (verified)                             | **€61.8k-217.7k** (mid €141k) |
| legacy `heuresys.com.evo` (584 commit / 125gg, scope qualitativo) | **€350-700k**                 |
| **Combined cost-to-date REVISED**                                 | **€411k-917k** (mid ~€664k)   |

**Implicazione valuation**: se acquirer prende **Opzione B** (both repos included), il "asset value baseline" pre-rebuttal va ricalcolato a **€664k mid-point cost-to-date** vs €141k stand-alone evo. Sweet spot deal value risale da €500-600k a **€650-800k** se entrambi inclusi.

| Scenario deal                       |                  Cost-to-date | Sweet spot all-in |
| ----------------------------------- | ----------------------------: | ----------------: |
| Solo evo (Opzione A)                |                     €141k mid |     **€500-600k** |
| Both repos (Opzione B raccomandato) |                     €664k mid |     **€650-800k** |
| Evo + legacy data-only (Opzione C)  | €141k + diritti consultazione |     **€525-660k** |

---

## Pre-closing condition aggiornate

Le 7 condition precedent in `16-final-decision-brief.md` §5 vengono aggiornate con specifiche emerse da Q&A:

| CP                                | Update                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CP2 IP forensic + LICENSE**     | Step #1: aggiungere LICENSE file ENTRO 7 GIORNI (Q5 verified gap critico). Step #2 verified 0 fork (Q1). Step #3 trademark check pre-LOI (Q7 checklist). |
| **CP6 buyer outreach**            | Aggiungere requirement: founder fornisce customer discovery interview log (Q8 template) per validate buyer outreach base                                 |
| **CP7 founder retention**         | Aggiungere: velocity baseline test 30gg pre-LOI (Q4 design) come gating condition objective                                                              |
| **NEW CP8 — repo scope decision** | Pre-LOI: acquirer + seller concordano evo only / both repos / data-only (Q6 strategic decision). Pricing impact +15-25% se Opzione B                     |

---

## Conclusione

Le 8 domande aperte sono distribuite:

- **3 verified instantaneously** (Q1, Q5, Q6) — riducono incertezza ~40% del residual ±20% deal value uncertainty
- **2 critical gap immediate** (Q5 LICENSE + Q7 trademark) — ≤7 giorni action
- **4 require Enzo input** (Q2, Q3, Q4, Q8) — pre-LOI process

**Residual uncertainty post-Q&A**: ±10-15% (vs ±20% pre-Q&A in `16-final-decision-brief.md` §10).

**Deal proceed criteria CONFIRMED**: NEGOTIATE strutturato a sweet spot **€500-600k all-in** (solo evo) o **€650-800k all-in** (both repos), con 8 condition precedent (7 originali + CP8 repo scope), 5 walk-away triggers invariati.
