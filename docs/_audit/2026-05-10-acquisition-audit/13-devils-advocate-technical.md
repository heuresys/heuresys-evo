# Devil's Advocate — Technical Attack Memo

> **From**: DA-tech (devil's advocate, hired by acquirer CTO)
> **To**: Senior Partners (M&A committee)
> **Re**: heuresys-evo acquisition — KILL THIS DEAL OR DEMAND −60% PRICE
> **Date**: 2026-05-10 · **Sessione 2 · Fase C** · Counterpoint a `00-executive-summary.md` NEGOTIATE preliminary

---

## TL;DR

Non state comprando una SaaS. State comprando **un single-coder + un AI multiplier + 13 giorni di greenfield** con ZERO clienti, ZERO connettori HRIS, ZERO test cross-tenant attack, runtime divergente dalla doc, infrastruttura su una VM Free Tier che il provider può reclaim. Il team interno scrive NEGOTIATE perché ha letto il codice e si è innamorato della governance documentale. La governance documentale **descrive servizi che non esistono**. Il pitch è "Layer ontologico tra ERP/HR/BI": match con la realtà ~25-30%. Ogni multiplo SaaS-ARR è inapplicabile (ARR = 0). La valutazione corretta è **acqui-hire del founder + asset-purchase del KG ESCO + brand identity**: target indicativo €120-220k, **non** la valuation che il seller sta presentando. **Raccomandazione: WALK AWAY** salvo strutturazione come acqui-hire con −60% sul prezzo richiesto, founder-vesting 24-36 mesi e earnout su milestone tecniche.

---

## Why the internal team is wrong

Il NEGOTIATE preliminary è viziato da **tre bias compositi**:

1. **Sycophancy verso il founder-craft**: il team ha apprezzato ADR rigorosi, sprint-history pulita, CARD-1/2/3/4 e operating-baseline. Bello. Ma la qualità della cerimonia documentale **non genera revenue**, e quando la documentazione descrive workspace fantasma (`services/marketing`, `services/playground`, `packages/types` mai esistiti — F1.1) o framework sbagliati (NestJS port 8012 vs Express 5 port 8200 — F1.2) la cerimonia diventa **liability di disclosure**, non asset.
2. **Severity downgrade su finding compliance-hard**: il team ha rated H13 (RLS bypass test = 0) come HIGH e non CRITICAL. Per un acquirer enterprise compliance team **questo singolo gap è un blocker P0**. Idem H5 (RBP UI gap services/app = 0 matches `requirePermission`). I due insieme = il claim "multi-tenant security enterprise-grade" non ha **alcun runtime evidence** che lo sostenga.
3. **Cost-to-rebuild non internalizzato come deal anchor**: il registry ammette ~1200-1850h FTE di technical debt fix + €350-550k loaded cost a 12-18 mesi per arrivare a v1.0. Quel numero da solo dovrebbe **azzerare** la valuation se applicato come "build-vs-buy" calculation, non "negoziare giù". Stiamo pagando il seller per un MVP che dobbiamo rifare per **2-3× il costo-to-date**.

Sotto, sette attacchi distinti con evidence concreta. Ognuno autonomamente sufficiente per rinegoziare al ribasso. Cumulativamente: **WALK AWAY**.

---

## Attack #1 — Founder bus factor + AI velocity = stiamo comprando un servizio bundle, non un asset

**Evidence**:

- `00-executive-summary.md` §2: "314 commit Spen-Zosky in 10 giorni calendar (2026-05-01 → 2026-05-10) — velocity AI-assisted ~30 commit/giorno".
- `08-tech-debt-registry-consolidated.md` cross-cutting #3: "Founder bus factor estremo: 314 commit Spen-Zosky / 335 totali = **94%**".
- `06-devops-infra-assessment.md` F5.5: "On-call: Primary Enzo (founder) — Slack DM + telefono. Backup: TBD (placeholder, da definire al primo hire infra)". Zero rotation, zero pager, zero escalation policy.
- Cross-cutting #5: "300 commit in 10 giorni calendar è impossibile umanamente. Productivity multiplier founder + AI è ~3-5x dev tradizionale".

**Acquirer-side severity**: **BLOCKER**.

**The team said**: "retention package vincolante 18-24 mesi + earnout con clawback + onboarding L2 SRE pre-day-one" (cond. precedent #3). Implicitamente: il rischio è gestibile contrattualmente.

**Reality is**: il rischio NON è gestibile contrattualmente perché la velocity osservata (8-15h/giorno solo coder, 30 commit/giorno) **non è replicabile in un ambiente corporate**. Quando lo integriamo in HR/payroll standard, con timesheet, ferie, code review process, security review, change management e on-call 24/7, la sua velocity scenderà fisiologicamente del 70-83% a 5-10 commit/giorno. La roadmap "v1.0 in 12-18 mesi" del team interno **assume velocity attuale**: con velocity dimezzata, timeline raddoppia (24-36 mesi) e il TCO sale da €350-550k loaded a **€700k-1.1M**. Inoltre: la sua productivity dipende anche da **AI access** (Anthropic API). Se ToS Anthropic cambiano, costi salgono, o key viene revocata per violazione policy, l'altro multiplier evapora.

**Financial implication**: TCO post-acquisition rivisto a **€700k-1.1M** per arrivare a v1.0 (vs €350-550k team interno). Earnout retention da −€80-120k addizionali. Risk-adjusted NPV negativo se prezzo richiesto >€250k.

**Recommendation**: **WALK AWAY** salvo strutturazione esplicita come acqui-hire (no goodwill, no platform-multiple). Founder vesting 36 mesi (non 18-24), 4-year cliff su 30% del payout.

---

## Attack #2 — C5 + C7 + C6 combo: questa è una scommessa pre-revenue, non una SaaS

**Evidence**:

- C5 (`08-tech-debt-registry-consolidated.md`): "Multi-tenant = **0 paying customer**. 4 tenant attivi (RTL Bank, SmartFood, EcoNova) sono **100% seed sintetici** con domain fittizi. 270 employees + 265 users = popolazione test".
- C7: "Mission 'Layer ontologico tra ERP/HR/BI' senza connettori shipped. `/explorer/sap` è status-page, marketplace plugin Tier 3 non iniziato".
- C6: "Competitive existential threat: SAP SuccessFactors TIH 1H 2026 release ha già aggiunto Skills Governance + EU localization packs completi. Microsoft Viva People Skills bundled in Copilot. Time-to-impact 6-18 mesi".
- H14: "Workforce Orchestration motore assente: il nome prodotto implica workflow engine, non c'è. Mancano: subscription/billing layer, customer support, marketplace API/webhooks/plugins".

**Acquirer-side severity**: **BLOCKER**.

**The team said**: "C5 strategico, fact non debt fixable. C6 market timing. C7 200-400h per primo connettore" — e ha tenuto NEGOTIATE.

**Reality is**: i tre finding combinati definiscono **cosa stiamo realmente comprando**. Non una SaaS multi-tenant operativa con seed = test (lettura caritatevole), bensì **uno stub multi-tenant con tutti i dati simulati**, **senza un solo cliente che paghi un euro**, **senza un solo connettore HRIS che giustifichi la mission**, mentre i due hyperscaler mondiali nel segmento HCM (SAP + Microsoft) shipperanno feature equivalenti **in bundle gratuito** in 6-18 mesi. Qualsiasi multiplo ARR (3-8× tipico SaaS B2B) **è matematicamente inapplicabile**: ARR = 0. Qualsiasi DCF ha hockey-stick a 24-36 mesi che dipende dall'attivare 3 leve simultaneamente (build connettori + acquisire customer + outrun SAP/MSFT). P(success) realistica: 10-20%.

**Financial implication**: il valore intrinseco è **non-SaaS**. Va valutato come somma asset:

- KG ESCO bilingue + 367 RLS policies + RBP data-driven: **~€80-150k** (12-18 mesi FTE rebuild).
- Brand identity + design system + ~180 component packages/ui: **~€30-60k** (~6-9 mesi FTE).
- Codice greenfield (resto): **~€10-20k** scrap value (ricostruibile in 2-3 mesi con stack equivalente).
- TOTAL asset-purchase fair value: **€120-230k**. Più +founder retention/acqui-hire = **€220-380k all-in**.

**Recommendation**: **NEGOTIATE-DOWN −60%** dal prezzo richiesto se strutturato come asset purchase + acqui-hire. WALK AWAY se seller insiste su SaaS-multiple.

---

## Attack #3 — Doc-runtime drift è CRITICAL, non MEDIUM: l'intera operations doc è inaffidabile

**Evidence**:

- C3 (`08-tech-debt-registry-consolidated.md`): "runtime ATTUALE = Docker Compose (3012/8012/8020), NON systemd bare-metal (3200/8200) come tutta la documentazione dichiara".
- F5.2 (`06-devops-infra-assessment.md`): "il dominio task descrive bare-metal systemd come scelta esplicita ADR-0001, ma quella scelta vale **solo per Postgres**. Il resto dello stack applicativo gira in Docker Compose su una directory utente (`/home/ubuntu/heuresys-evo/`), non come servizio systemd-managed. Le porte produzione `3200/8200` documentate in CLAUDE.md non corrispondono al runtime attuale (3012/8012)".
- F5.7: "deploy = `ssh ubuntu@VM` + `git pull && docker compose up -d`. Nessun smoke automatico post-deploy, nessun rollback strategy automatica".
- F1.1 (`02-architecture-assessment.md`): "ADR-0006 + monorepo-strategy.md descrivono workspace inesistenti (`services/marketing`, `services/playground`, `packages/types`)". F1.2: "monorepo-strategy.md:13 dichiara api-gateway 'NestJS port 8012' — codice è Express 5 port 8200".
- Cross-cutting #1: "Documentation maturity > Implementation maturity. Pattern dominante: 'documento detailed, implementazione partial'".

**Acquirer-side severity**: **MAJOR** (sotto-pesato dal team a "8-16h doc fix + decisione strategica").

**The team said**: C3 effort fix "8-16h doc + decision" — banalizza il problema a un cleanup di documentazione.

**Reality is**: questo non è un drift di doc. È un **systemic credibility breach** che invalida l'intera due diligence basata su lettura. Se la doc dichiara "bare-metal systemd su porte 3200/8200" e il runtime gira "Docker Compose su porte 3012/8012", e se gli ADR descrivono `services/marketing`/`playground`/`packages/types` che **non esistono**, e se monorepo-strategy.md dichiara NestJS quando è Express, e se package.json description dice "NextAuth v5" quando è v4 (F1.6), allora **non possiamo fidarci di nulla** che abbiamo letto. Ogni claim della seller-side ("backup off-site provisioned", "RLS coverage", "RBP enforced", "AAA passing") deve essere **verificato indipendentemente** prima del closing — costo DD aggiuntivo significativo.

E peggio: l'incident runbook (`docs/40-operations/incident-runbook-evo.md`) è scritto **per l'architettura documentata, non per il runtime attivo**. Un on-call esterno che lo segue cercherà unit systemd inesistenti, leggerà porte sbagliate, applicherà restart procedure non valide. Il runbook è **operativamente velenoso** finché non è riscritto + ri-validato (16-30h FTE).

**Financial implication**: +€30-50k cost di re-discovery indipendente pre-closing (auditor tecnico esterno) + €15-25k di rewrite operativo runbook + impact reputazionale se l'acquirente firma in base a doc poi smentita. Liability disclosure: rappresentation breach material in CIM se doc è stata data come allegato.

**Recommendation**: **NEGOTIATE-DOWN −15%** + esigere un **technical fact-sheet firmato dal seller** che concilia ogni claim doc con runtime, accompagnato da grep evidence in tempo reale. Senza fact-sheet firmato → escrow +20% del prezzo per 12 mesi.

---

## Attack #4 — RBP UI gap + RLS bypass test = 0: il core value prop non ha runtime evidence

**Evidence**:

- H5 (`08-tech-debt-registry-consolidated.md`): "`Grep requirePermission|usePermission` su services/app/src = **0 matches** vs 40 su api-gateway".
- F3.1 (`04-security-compliance-assessment.md`): "Le route Next.js App Router (che bypassano api-gateway via Prisma direct) sono protette solo da RLS DB-level, mancano del livello area-action".
- H13 / F6.3 (`07-test-quality-assessment.md`): "`Grep tenant.bypass|cross.tenant|tenant.isolation` → 97 file totali ma sono **tutti docs/seed/route source**, **zero test che tentino injection cross-tenant**. 312 tabelle `tenant_id NOT NULL` · 367 RLS policies attive — superficie enorme, copertura test = 0".
- F6.1: "462 test api-gateway sono **tutti unit con Prisma mockato**. Il delta schema-mock vs schema-reale è il bug più frequente in production".
- Cross-cutting #2 registry: "P1+P5 multi-tenant è il cuore della value proposition, ma nessun test simula attacker cross-tenant. Trio H13 + H4 + H5 è il **vero rischio compliance** della piattaforma".

**Acquirer-side severity**: **BLOCKER**.

**The team said**: H5 "8-16h FTE", H13 "16-30h FTE" — entrambi HIGH ma chiusi con condition precedent 60-90 giorni.

**Reality is**: il pitch della piattaforma è "multi-tenant always" (P1) + "RLS DB-level" (P5). Il **wedge competitivo** dichiarato verso SAP/MSFT è proprio l'enforcement compliance. Ma:

- Nessun test prova mai che un JWT tenant-A non legga dati tenant-B.
- Lato Next.js (services/app) **non c'è alcun gate area-action**: la sicurezza dipende interamente da RLS DB-level. Se un developer dimentica `SET LOCAL app.current_tenant_id` su una nuova route, **silent cross-tenant leak** (CVSS 9.0+).
- I 462 test api-gateway che dovrebbero proteggerci sono **mock di Prisma**: testano "il middleware chiama il middleware", non "il DB rifiuta la query".

Per un acquirer enterprise (PE con compliance team o strategic buyer regolato — banche, sanità, PA), questo singolo cluster significa: **GDPR class-1 breach risk non rilevabile pre-merge**, **EAA compliance impossibile da firmare**, **SOC 2 CC6.1/CC7.2 non auditabile**, **DPA con cliente impossibile da onorare** finché non c'è test runtime. Non è un "fix da 16-30h": è un cluster che richiede **prima** l'integration test infra (ADR-0002 da 13 giorni `Proposed`, F6.1) **poi** RLS bypass suite (15-20 test mirati) **poi** RBP UI sweep su 24 pagine `(app)/`. Effort realistico end-to-end: **80-120h FTE** + audit pen-test esterno (€8-15k).

**Financial implication**: −€60-100k dal prezzo (effort + pen-test) **+** rappresentation & warranty insurance premium addizionale (€20-40k/anno per coprire breach risk pre-existing) **+** M&A escrow vincolato a milestone "RLS bypass suite green" (15-25% prezzo per 12 mesi). Se breach emerge post-closing: claw-back fino al 50% prezzo per indemnification.

**Recommendation**: **NEGOTIATE-DOWN −20%** + escrow vincolato + R&W insurance obbligatoria + condizione precedente "pen-test esterno cross-tenant attack PASS pre-closing".

---

## Attack #5 — SPOF C2 non è "infra hardening", è "MVP camuffato da production"

**Evidence**:

- C2: "SPOF: 1 VM Oracle Free Tier ARM64 host TUTTO lo stack (FE+API+enrichment+Postgres+Redis+nginx). Zero HA, zero standby, zero multi-region".
- C4: "NO Disaster Recovery off-site: backup co-locati sulla stessa VM del DB. Bucket OCI dichiarato 'not yet provisioned'".
- F5.1: "Free Tier OCI ha SLA dichiarato dal provider tipicamente best-effort senza credit policy per istanze Always Free (vs 99.95% paid)".
- F5.6: "NO Infrastructure as Code: VM stato non riproducibile. Setup VM = istruzioni manuali documentate parzialmente".
- F5.4 + F5.5: "MTTD = humano. SLA P1 <15min è dichiarativo non operativo. Founder = single point of human failure".
- Operational maturity scoring `06-devops-infra-assessment.md`: media ponderata **2.4/5 — DEV-grade ops, NOT production-enterprise grade**.

**Acquirer-side severity**: **BLOCKER**.

**The team said**: C2 effort "80h + ~15-30k EUR/anno HA infra", C4 "16h + ~200 EUR/anno bucket". Ha rated entrambi CRITICAL ma comunque NEGOTIATE.

**Reality is**: il team ha quantificato la spesa minima ma non l'**impatto sistemico**:

- VM Free Tier ARM64 può essere reclaim da Oracle per inactivity policy → DB + 7 daily + 8 weekly + 12 monthly backup **distrutti contemporaneamente** = **data loss totale**, **GDPR Art. 32 fail**, **SOC 2 CC7.4 fail**, **ISO 27001 A.12.3 fail**, esposizione sanzionatoria EU >€10M.
- Nessuna capacità di onorare SLA contrattuali ≥99.5% **per design**: ogni cliente paying enterprise futuro è esposto a breach contrattuale strutturale.
- IaC zero → DR procedure documentata `dbms-backup-restore.md` assume VM esistente. Se VM è persa, c'è una **fase undocumented "ricostruisci la VM"** prima di restore. RTO 30min dichiarato è **fiction**.
- L'audit ha calcolato il vero costo di production-readiness (sez. F5 §"Cosa serve per production-ready"): **€80-150k EUR + 3-6 mesi calendar + 2 ops hire** (L2 SRE + L1 on-call).

Quel costo €80-150k è **CAPEX day-one obbligatorio** se vogliamo monetizzare la piattaforma. Non è "investimento futuro post-acquisition", è **prerequisito per esistere come SaaS commerciale**.

**Financial implication**: −€80-150k dal prezzo deal + commitment vincolante 2 ops hire entro M+3 (~€140-200k loaded annuo). Total CAPEX+OPEX year-1 incrementale: **€220-350k** prima di vedere un singolo euro di revenue.

**Recommendation**: **NEGOTIATE-DOWN −25%** + condizione precedente "off-site backup provisioned + HA Postgres primary+replica entro M+1" con automatic price reduction se non hit.

---

## Attack #6 — Brand workstream burn: founder ha priorità invertite (governance red flag)

**Evidence**:

- Cost-to-date `00-executive-summary.md` §5: "Brand identity workstream (12 phase): **120-200h FTE**" su un totale greenfield 310-520h FTE.
- Cross-cutting #4 registry: "Brand workstream maturo > codice frontend immaturo. paradosso. Brand identity v0 shipped + Brand Book completo + design system Cantiere B v2 ricco (~180 component, 84 stories), ma **frontend services/app manca pattern essenziali (boundary RSC, next/image, RBP UI gate)**".
- H8: "Boundary RSC mancanti completamente: `loading.tsx`/`error.tsx`/`<Suspense>` **assenti nelle 24 pagine `(app)/`**".
- H9: "`next/image` zero adoption: 0 import su services/app".
- H5: "0 matches `requirePermission` su services/app".

**Acquirer-side severity**: **MATERIAL**.

**The team said**: ha trattato il brand come "asset chiavi-in-mano, ricostruirlo costa €30-60k + 6-9 mesi". Strength.

**Reality is**: 120-200h FTE in brand identity, su un totale di 310-520h del greenfield, significa che il founder ha **investito 25-40% del proprio tempo totale** in attività estetiche **mentre**:

- 0 connettori HRIS shipped
- 0 paying customer
- 0 RBP UI enforcement (services/app)
- 0 RLS bypass test
- 0 boundary RSC su 24 pagine
- 0 IaC
- 0 disaster recovery off-site

Questa è una **gravissima inversion di priorità per uno stadio pre-revenue**. Per un acquirer è un segnale di **decision-making founder non allineato a value creation commerciale**. Domanda implicita: post-closing, quando gli si chiederà di shippare il primo connettore HRIS (200-400h, hard work, no fun), il founder reagirà come ha reagito al brand (sprint multi-fase, governance pulita) o come ha reagito a integration test (ADR-0002 dormiente da 13 giorni, mai implementato)?

Pattern: **founder vince le sfide creative, posticipa quelle revenue-critical**. Per acqui-hire è un red flag grosso.

**Financial implication**: −15% confidence factor sull'execution della roadmap commerciale post-acquisition. Riduce P(success) della scommessa C5+C7+C6 (Attack #2) di ulteriori 5-10 punti percentuali.

**Recommendation**: **NEGOTIATE-DOWN −10%** addizionale + clausola earnout esplicita "founder dedicates ≥80% time post-closing a roadmap commerciale (connettori HRIS + paying customer onboarding), brand workstream freezing per minimo 12 mesi". Pattern monitorato in QBR.

---

## Attack #7 — License pending + repo PUBLIC senza LICENSE: legal grey area pre-deal

**Evidence**:

- F3.10 (`04-security-compliance-assessment.md`): "License decision pending. Repo PUBLIC senza LICENSE = default copyright restrittivo, complica M&A IP transfer e blocca contributi esterni. Da decidere AGPL/MIT/proprietary prima del closing".
- Condition precedent #5 `00-executive-summary.md`: "Repo è PUBLIC su GitHub (Spen-Zosky/heuresys-evo) senza LICENSE OSS = legal risk acquirente".
- ADR-0019 status: open question.

**Acquirer-side severity**: **MATERIAL**.

**The team said**: condition precedent 5, "License strategy decision pre-LOI".

**Reality is**: il repo è **pubblico su GitHub da settimane senza LICENSE file**. Conseguenze legali:

1. **No grant esplicito di copia/modifica/distribuzione** ai terzi che hanno fatto fork/clone in questo periodo. Se anche una sola company sta sperimentando con un fork (verificabile via GitHub Network/Forks), c'è uso non-autorizzato in essere — esposizione reciproca.
2. **IP chain of custody non chiara**: ogni dependency LICENSE va verificata (copyleft GPL/AGPL contamination check) prima di poter scegliere licenza commerciale chiusa. Audit dipendenze 600+ packages = 8-16h legal review.
3. **Contributor agreement assente**: anche se il repo è 94% Spen-Zosky, il restante 6% include commit auto-generated (Dependabot, GitHub Actions auto-PR, MCP tools) di provenienza diversa. CLA retroattivo necessario.
4. **Trademark "heuresys"**: registrato? In quali class/giurisdictions? Se non registrato, post-acquisition può essere registrato da terzi (squatting risk).

**Financial implication**: −€10-20k legal review pre-closing + escrow su IP indemnification (€30-50k bloccati 24 mesi) + se trademark non registrato +€5-10k filing immediato. Risk indeterminate se fork pre-existing rivendica diritti.

**Recommendation**: **NEGOTIATE-DOWN −5%** + condizione precedente assoluta "LICENSE file committed + trademark filing iniziato + contributor agreement firmati per 100% commit non-Spen-Zosky" PRIMA di LOI signing. Senza compliance: **WALK AWAY**.

---

## What the team didn't ask

Cinque domande critiche che il team interno **non ha posto** e che cambiano materialmente il deal:

1. **Quanti fork pubblici e cloni ha il repo PUBLIC oggi, e chi sono?** GitHub API è interrogabile in 30 secondi. Se ci sono fork attivi (specialmente da company tech), parte dell'asset è già **distribuito in giro** senza che possiamo fermarlo. Cambia profondamente la negoziazione IP.

2. **Qual è il churn rate "phantom" degli oltre 60 ADR/L# entries?** Quante decisioni sono state superseded vs implementate? Il team ha contato 60 entry DECISIONS-LOG come asset di governance. Ma se la metà sono state revocate/sostituite (ADR-0006 servizi fantasma, ADR-0002 testcontainers Proposed da 13 giorni mai implementato, ADR-0012 CSP enforce mai flippato — pattern documentato Cross-cutting #1), allora la governance documentale è **plot armor narrativo**, non execution disciplinare. Va misurata.

3. **Cosa succede al velocity se rimuoviamo Anthropic API access per 30 giorni come stress-test pre-closing?** Mai chiesto. Senza questo dato non sappiamo se stiamo comprando un developer + tool, o un developer-tool-bundle che si rompe se uno dei due manca. Test critico per pricing acqui-hire vs platform.

4. **Esiste evidence di un pen-test esterno mai condotto?** Il team ha listato Q5 `07-test-quality-assessment.md` come open question generica. Va trasformata in **prerequisito assoluto pre-closing**: pen-test esterno cross-tenant attack (€8-15k auditor) con report che dichiara explicit PASS su scenario "JWT tenant-A → query data tenant-B". Senza questo, non firmiamo nulla.

5. **Qual è il customer pipeline reale (non i 4 tenant fittizi)?** LOI/MOU/POC firmati con prospect reali? Se la risposta è "nessuno" — come implicito in C5 — allora i €350-550k a v1.0 + €220-350k anno-1 ops + retention founder vanno bruciati su una scommessa GTM senza alcun customer signal. **Demand attestation by seller** firmata: lista prospect, stage funnel, $ARR atteso, contracts firmati (incl. POC unpaid). Se vuoto: la valuation deve essere **asset-purchase + acqui-hire pure**, non SaaS.

---

## Bottom line

Il team interno ha scritto NEGOTIATE perché ha confuso **craftsmanship documentale** con **execution commerciale**. La realtà aggregata:

| Dimensione                        | Reality                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| Paying customer                   | **0**                                                                                           |
| Connettori HRIS shipped           | **0**                                                                                           |
| RLS bypass test                   | **0**                                                                                           |
| RBP UI enforcement (services/app) | **0 matches** `requirePermission`                                                               |
| Boundary RSC                      | **0 su 24 pagine**                                                                              |
| `next/image` adoption             | **0**                                                                                           |
| IaC                               | **0**                                                                                           |
| DR off-site backup                | **NOT PROVISIONED**                                                                             |
| Founder commit share              | **94%** (314/335)                                                                               |
| Doc ADR stale (servizi fantasma)  | **3+** (`marketing`/`playground`/`@heuresys/types`)                                             |
| Mission vs Reality match          | **25-30%**                                                                                      |
| Operational maturity              | **2.4/5** (DEV-grade)                                                                           |
| Effort to v1.0                    | **2000-3000h FTE** = €350-550k loaded + €80-150k infra (€430-700k) — assumendo velocity attuale |
| Effort realistic post-integration | **€700k-1.1M** (velocity halved + on-call + ops hires + audit)                                  |
| Cost-to-date proxy seller         | **€48-180k** (greenfield + brand)                                                               |

**Verdict**: il valore per l'acquirente è **non-SaaS**. Va valutato come somma di:

- KG ESCO + multi-tenant infra + RBP data-driven: **€80-150k** (asset)
- Brand identity + ~180 UI components + design system: **€30-60k** (asset)
- Founder acqui-hire (24-36 mesi vesting): **€80-130k** loaded
- Greenfield code residual: **€10-20k** scrap

**Total fair value range: €200-360k all-in**, vs verosimile prezzo richiesto seller (1-3M EUR per "SaaS multi-tenant enterprise-grade").

**Raccomandazione finale**:

1. **WALK AWAY** se il seller insiste su SaaS-multiple (ARR/customer-pipeline based) e non accetta riformulazione asset-purchase + acqui-hire.
2. **NEGOTIATE-DOWN −60%** vs prezzo richiesto se strutturato come asset purchase + acqui-hire founder, con:
   - Founder vesting 36 mesi, 4-year cliff su 30% payout
   - Earnout vincolato a milestone tecniche **misurabili** (HA infra M+3 / RLS bypass suite green M+6 / primo connettore HRIS M+9 / primo paying customer M+12)
   - Escrow 25% prezzo per 24 mesi su IP indemnification + RLS breach claw-back
   - R&W insurance obbligatoria (€20-40k/anno premium)
   - Pen-test esterno cross-tenant PASS **pre-closing** (no-go condition)
   - LICENSE file + trademark filing + CLA pre-LOI (no-go condition)
   - Technical fact-sheet firmato che concilia ogni claim doc con runtime
3. Se seller rifiuta anche solo 1 dei punti 2.a-2.g: **WALK AWAY**.

I senior partner devono ricordare che il NEGOTIATE preliminary del team interno è basato su una **lettura caritatevole della governance documentale**. Quando si toglie l'effetto-aurora della cerimonia ADR e si guarda il runtime, si compra **un single-coder + un MVP camuffato + una scommessa GTM contro SAP/MSFT**. Non è un asset SaaS. È un option premium su un founder, e va prezzato come tale.

---

**Filed by**: DA-tech · **Status**: ATTACK COMPLETE · **Next step**: Rebuttal `15-rebuttal-and-synthesis.md` (Sessione 2 Fase D)
