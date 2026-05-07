# Persona 06 — Tenant Owner (C-level cliente)

> _Note: nomi/dettagli sono illustrativi. Sostituibili con clienti reali quando confermati da Enzo._

## Profilo

**Marco Rossi**, 54 anni, **Chief Operating Officer** di **RTL Bank** (corporate banking italiano, 1.247 dipendenti, 8 dipartimenti, 18 sedi). 25 anni di carriera in banking + 5 nel ruolo attuale. Riporta direttamente al CEO + Comitato Esecutivo.

Sponsor del contratto Heuresys per RTL Bank. RBP role `TENANT_OWNER` (level 0) — visibility completa nel proprio tenant, nessuna visibility cross-tenant.

Ha P&L responsibility per operations + IT + HR (tre funzioni che riportano direttamente a lui). Budget annuale per workforce strategy ~€8M/anno.

## Cosa vuole davvero

**Vedere RTL Bank come una organizzazione, non come 8 silos**. Quando il CEO chiede "siamo pronti per il piano industriale 2030?", lui vuole rispondere con un dashboard organico (struttura · capability · succession · compensation · risk readiness) — non con un consulto di 6 settimane.

Vuole strumenti C-level: meno granularità, più decisioni. Non gli interessa quale candidate ha il pernr SAP `12345678`, gli interessa sapere quanti dipartimenti hanno skill coverage <80% e dove allocare il budget capacity-building.

## Cosa lo frustra

- I report del CFO arrivano in tempo (T+5 giorni). I report HR/people arrivano in ritardo (T+3 settimane) e in formato slide
- Le 3 capability che pensava di avere "in casa" si rivelano avere 1 senior + 4 junior (alta concentrazione di rischio key-person)
- I budget compensation vengono allineati ad inizio anno e non si toccano fino a Dicembre — anche se a Maggio è chiaro che metà del bonus pool andrà "sotto target"
- I consulenti McKinsey gli portano org chart redesign che durano 18 mesi e lasciano la stessa struttura di prima
- Il CIO gli dice "abbiamo SAP HCM" ma quando chiede "quanti hanno skill X mappata?" la risposta è "dovremmo fare un'estrazione"

## Cosa sa

- Distingue OKR da KPI da capability — le tre cose hanno semantica diversa nel suo modello mentale
- Ha letto il libro di Reid Hoffman "The Alliance" + Ulrich + qualcosa di Goleman EI
- Conosce le funzioni HR ad alto livello, non i dettagli ATS/HRIS
- Conosce la BIA e la digital workforce strategy di alcuni competitor (UniCredit, Intesa, Mediobanca)
- Sa cosa è il rischio operativo regolamentare: capability mancante in compliance/risk = sanzione potenziale ECB

## Come arriva a Heuresys

- Demo presentata dal CHRO Maria (persona 01) e dal CIO Davide (persona 02) — è arrivato in fase consolidata
- Ha letto il MIT Sloan Review article sul layer ontologico (lo stesso che ha citato Maria)
- Ha visto un competitor banking adottare qualcosa di simile (rumor da conferenza ABI)

## Cosa Heuresys deve dimostrare in 5 minuti di demo

1. **Tenant owner overview** (`/dashboard/tenant_owner_overview`): organization snapshot · 8 dipartimenti breakdown (headcount + skill coverage + perf avg + open req) · compensation plan FY26 · 9-box top-2 succession ready · capability readiness gauge. Una sola schermata, decisioni multiple.
2. **Workforce analytics** (`/analytics/workforce`): trend longitudinale 12-mesi su 4 KPI core (headcount net change · perf avg · skill coverage · attrition rate)
3. **Compensation snapshot**: 3 bonus pools attivi · base payroll vs variable pool % · executive LTI · benefits — con drill-down per dept
4. **Drill-down 1-click**: da KPI aggregato a dipartimento singolo a employee single — senza export/SQL/help-desk

## Voce per parlare a Marco

| ❌ Mediocre                                          | ✅ Heuresys                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| "Empower the C-suite with workforce intelligence"    | "RTL Bank: 1.247 emp · 8 dept · 82,4% skill coverage · 364 high-potential · 17 open req critical"        |
| "Strategic dashboards for executive decision-making" | "Capability readiness 29,2% · target FY26 35% · gap chiuso con 12 hire mirati + 8 internal mobility"     |
| "AI-powered talent insights"                         | "Succession ready 9-box top-2 = 147 emp tenant · 22% IT&Digital, 34% Risk, 12% HR — squilibrio top-down" |

## Surface critiche per Marco

| Surface                            | Cosa deve trovare                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `/dashboard/tenant_owner_overview` | Organization snapshot + 8-dept breakdown + compensation FY + 9-box succession + capability gauge |
| `/dashboard/hr_director_overview`  | (Read-only) view della CHRO Maria, per allineamento talent strategy                              |
| `/analytics/workforce`             | Trend 12-mesi headcount + perf + skill coverage + attrition                                      |
| `/compensation`                    | Salary distribution + 3 bonus pools + executive LTI + benefits coverage                          |
| `/employees`                       | Talent registry con filter per dept · band · perf · skill coverage                               |
| Quarterly report export            | PDF brand-conforme · executive summary 1 pagina · drill-down 5 pagine                            |

## Cosa NON fare con Marco

- Non chiamarlo "user". È **buyer + executive sponsor**, non power user
- Non aprirgli mai un dashboard granulare (es. `/admin/audit` o `/admin/rbac` viewer) — sono surface IT_ADMIN, non sue
- Non chiedergli di scrivere SQL · non chiedergli di "configurare" — quello è IT_ADMIN/HR_MANAGER scope
- Non tradurgli "RBP" o "RLS" — usa "permessi" e "isolamento dati"
- Non gamificare. Non promettere "transformation". Promettere **decisioni misurabili al prossimo board**
- Non onboarding wizard step-by-step. Lui clicca, vede, capisce. Se serve >10 minuti per capire una surface, è surface mal progettata
