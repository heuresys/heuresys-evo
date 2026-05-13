# Persona 08 — Department Head (team-scoped strategist)

> _Note: nomi/dettagli sono illustrativi. Sostituibili con clienti reali quando confermati da Enzo._

## Profilo

**Sabrina Conti**, 51 anni, **Head of Risk & Compliance** in **RTL Bank** (141 dipendenti, 12 ruoli specialistici, 4 line manager riportano a lei). 24 anni di carriera in risk + 11 nel ruolo attuale. Master in Risk Management + executive program INSEAD. Riporta direttamente al COO Marco (persona 06).

P&L responsibility per la funzione Risk & Compliance · sponsor budget compliance ~€4.2M/anno (di cui ~€1.8M people). RBP role `DEPT_HEAD` (level 4) — scope team (suo intero dipartimento, no cross-dept visibility salvo Risk-relevant data dei dept correlati).

## Cosa vuole davvero

**Sapere se il suo dipartimento è regolatoriamente sicuro tra 18 mesi**. Le nuove regulation ECB/Bankitalia richiedono capability emergenti (es. ESG risk modelling · climate scenario analysis · AI risk governance) che il suo team **non ha ancora**. Vuole vedere il gap, prevedere il time-to-coverage, e decidere se chiudere via hire vs internal mobility vs reskilling.

Vuole anche **valorizzare i suoi top performer** prima che li cacci la concorrenza: 5 succession-ready ad alto potenziale + 3 a rischio attrition. Heuresys gli dà evidence per fare retention conversation con Marco (COO).

## Cosa la frustra

- Il piano formativo annuale è "1 corso compliance + 1 corso leadership" — non risponde alle specifiche capability emergenti
- Quando porta a Marco (COO) il caso del talent scarcity in ESG risk modelling, lui chiede "quanti?" e lei deve fare excel
- Ha 4 line manager che fanno review qualitative ma non comparable — alcuni sono harsh raters, altri lenient (calibration bias non gestito)
- Le HR Business Partner (Federica · persona 07) ascoltano lei poco perché HR risponde al CHRO, non al Department Head
- I tool di workforce planning vendor-side vendono "talent intelligence" ma non sanno cosa è SREP, SRT, ICAAP

## Cosa sa

- Le 12 capability specialistiche del Risk & Compliance + 8 capability emergenti regulatory-driven (ESG · climate · AI · operational resilience · cyber · third-party · model risk · ML governance)
- I 4 quadranti del 9-box (high perf/high pot · high perf/mid pot · mid perf/high pot · risk-of-attrition)
- Il modello economic capital + il calcolo capital ratios — capisce perché un capability gap è anche un capital impact
- I tempi di hire per i ruoli senior (4-6 mesi) vs reskilling (12-18 mesi) vs internal mobility (3-6 mesi)
- Conosce ESCO ma non ne ha confidenza — preferisce che HR le mappi i ruoli su un framework

## Come arriva a Heuresys

- Marco (COO) le ha presentato Heuresys in un meeting strategico ("Sabrina, qui vedi il rischio capability del tuo dept aggregato")
- Federica (HR Business Partner persona 07) la onboarda nelle surface DEPT_HEAD-scoped
- Il primo task: "valuta capability readiness del tuo dept rispetto alle 8 capability emergenti regulatory"

## Cosa Heuresys deve dimostrare in 5 minuti di demo

1. **Team capability scope** (`/dashboard/capability_graph?scope=team`): grafo capability del proprio dept · 12 ruoli mappati · 12 skill core + 8 emerging · gap visibili
2. **Team registry**: 141 employees · filter per ruolo · last perf rating · 9-box position · attrition risk score
3. **Succession workflow**: 5 high-potential nel proprio team · gap-to-readiness % · time-to-readiness prediction
4. **Capability emerging gap analysis**: 8 capability emerging (ESG · climate · AI risk · op resilience · ecc.) · current coverage % · target coverage % entro 18 mesi · 3 path proposti (hire / mobility / reskilling) con cost/time tradeoff

## Voce per parlare a Sabrina

| ❌ Mediocre                          | ✅ Heuresys                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| "Optimize your team's performance"   | "Risk & Compliance · 141 emp · perf avg 3,87 · ESG risk capability coverage 18% (target 60% Q4 2027)"              |
| "AI-powered talent insights"         | "5 high-pot top-2 9-box · 3 attrition risk · Davide M. comparable bench RTL Bank · UniCredit · Mediobanca"         |
| "Empower department heads with data" | "Hire 1 senior ESG modeller chiude 18% → 35% in 6 mesi · reskilling 4 junior chiude 18% → 50% in 14 mesi · choice" |

## Surface critiche per Sabrina

| Surface                                  | Cosa deve trovare                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| `/dashboard` (DEPT_HEAD default)         | Team KPI · capability scope team · top performer + at-risk · capability emerging gap      |
| `/team`                                  | 141 emp registry · filter ruolo + 9-box + attrition risk · drill-down profile             |
| `/dashboard/capability_graph?scope=team` | Capability KG scoped al proprio dept · 12 ruoli + 12 skill core + 8 emerging · gap radial |
| `/explorer/esco` (read-only ontoLite)    | ESCO tree per validare il mapping interno dei propri ruoli                                |
| `/me/{profile,goals,reviews,learning}`   | Vista personale (lei è anche un employee del proprio team)                                |
| Quarterly report export                  | PDF · executive summary capability + succession + emerging gap + 3 path tradeoff          |

## Cosa NON fare con Sabrina

- Non darle visibility cross-dept (`scope=team` enforce server-side via RBP)
- Non aprirle `/admin/*` (non è IT_ADMIN né HR_DIRECTOR)
- Non darle workflow "approval" troppo lunghi (>3 step) per hire request — le serve speed (4-6 mesi è già lungo)
- Non chiedere SQL · non chiedere setup tecnico · non chiedere config RBP
- Non motivational copy. Non gamification. Non onboarding wizard step-by-step
- Non offrirle "talent recommendation" generici (es. "consider these 100 candidates from LinkedIn"). Vuole shortlist mirata di 3-5, con rationale capability-based
- Non parlare di "transformation". Parlare di **capability readiness regulatorily-relevant entro 18 mesi**
