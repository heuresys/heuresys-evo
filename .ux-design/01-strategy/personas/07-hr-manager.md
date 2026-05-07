# Persona 07 — HR Manager (department-scoped)

> _Note: nomi/dettagli sono illustrativi. Sostituibili con clienti reali quando confermati da Enzo._

## Profilo

**Federica Galli**, 39 anni, **HR Business Partner** assegnata al dipartimento **Risk & Compliance** di **RTL Bank** (141 dipendenti, 12 ruoli specialistici). 12 anni di carriera HR di cui 4 nel ruolo attuale. Master HR + corso CIPD-certified.

Riporta a Maria (CHRO, persona 01) ma con linea dotted al Head of Risk & Compliance (Sabrina Conti). Gestisce review cycles · talent pipeline · compensation calibration per il proprio dipartimento. RBP role `HR_MANAGER` (level 3) — scope dipartimentale (`?scope=dept`).

## Cosa vuole davvero

**Spostare la review cycle da carta a strumento operativo**. Oggi raccoglie 141 review da Excel, riconcilia ratings con il manager, fa calibration in workshop fisico — perde 3 settimane ogni Q1. Vuole una surface dove vede in tempo reale lo status review del proprio dept, gli outliers calibration, e i gap capability rispetto al CHRO target.

Vuole anche un canale strutturato per fare richiesta hire al CHRO: 7 open req nel suo dept, ognuna con justification capability-based (non "ne abbiamo bisogno", ma "Risk Modelling skill coverage 79,4% vs target 85%, serve 1 senior").

## Cosa la frustra

- Excel come tool review primario nel 2026
- I performance review sono compilati al 91,6% nel suo dept ma 65% nel resto della banca: lei non vede il proprio progress relativo
- Non ha visibilità sui talent registry degli altri dept — quando un suo employee chiede "voglio cambiare team", non sa proporre alternative
- I dati ESCO mapping arrivano in ritardo (capability gap calc scorre 2 settimane after fact)
- Le sue calibration session sono "consenso del più rumoroso", non un protocollo basato su rubric

## Cosa sa

- Distingue performance da potenziale (9-box matrix interna) — sa applicare la rubric corretta
- Conosce le 12 skill specialistiche del Risk & Compliance + i 4 entry path standard (modeller · analyst · auditor · regulator-facing)
- Conosce i 6 framework di calibration (Korn Ferry, Mercer, Lominger, ecc.) — sa quale apply quando
- Conosce le 4 fasi del review cycle (set goals · check-in · self-assessment · 360 + manager review · calibration)
- Sa leggere CCNL banking e applicare le band salariali corrette

## Come arriva a Heuresys

- Maria (CHRO) ha lanciato il rollout RTL Bank · Federica è uno dei primi 5 HR_MANAGER ad essere onboarded
- Riceve un'email con link a `/login` + 30 minuti di training screen-share con Maria
- Il primo task richiesto è: "configura il prossimo Q2 review cycle per Risk & Compliance"

## Cosa Heuresys deve dimostrare in 5 minuti di demo

1. **Reviews scoped to dept** (`/reviews?scope=dept`): 141 review filtrate al proprio dept · status (draft · in_progress · completed) · rating distribution · outliers calibration auto-flagged
2. **Goals scoped to dept** (`/goals?scope=dept`): OKR cascaded dal Head di dept ai senior poi ai junior · progress %
3. **Skill heatmap dept**: matrice 12 ruoli × 12 skill specialistiche · gap visibili a colpo d'occhio · drill-down employee single
4. **Hire request workflow**: bottone "request hire" che apre un form precompilato con (a) capability gap rationale (b) headcount budget impact (c) onboarding timeline expected — il form viene reindirizzato a Maria CHRO

## Voce per parlare a Federica

| ❌ Mediocre                       | ✅ Heuresys                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| "Streamline your HR workflow"     | "141 review Risk & Compliance · 91,6% completate · 4 outliers calibration flagged"          |
| "Empower line managers with data" | "1 hire senior Risk Modelling chiude gap skill coverage 79,4% → 85,8% (target Maria)"       |
| "AI-powered review insights"      | "Review cycle Q2 ready · 12 ruoli scope · calibration session 14/06 · timer scadenza 28/06" |

## Surface critiche per Federica

| Surface                           | Cosa deve trovare                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| `/dashboard` (HR_MANAGER default) | KPI ring scope dept · review status · skill coverage gap · top performer & at-risk        |
| `/reviews?scope=dept`             | 141 review · filter status · drill-down employee · calibration outliers                   |
| `/goals?scope=dept`               | OKR cascade vista dept · progress % per individuo                                         |
| `/learning`                       | Learning paths consigliati per chiudere capability gap dipartimentali                     |
| `/employees?scope=dept`           | Talent registry dept con perf · skill coverage · band · tenure · 9-box position           |
| Form "request hire"               | Capability gap rationale + headcount budget + onboarding timeline + redirect a CHRO Maria |

## Cosa NON fare con Federica

- Non darle visibility cross-dept senza filtro esplicito (RBP `?scope=dept` enforce server-side)
- Non aprirle i dashboard cross-tenant (`/dashboard/cross_tenant_overview`) — è scope SUPERUSER
- Non chiedere SQL · non aprirle `/admin/rbac` matrix viewer (scope HR_DIRECTOR+)
- Non chiamarla "junior HR". Ha 12 anni di seniority + master + certification — è specialist.
- Non gamificare i review (badge, streak, XP). Sono performance review, non un gioco
- Non darle 12 colonne di filtri in tabella. Lei ne usa 3-4 max (status · band · perf rating · last review date)
