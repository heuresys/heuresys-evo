# D8 — Product Scope Reality vs Declared Mission

> **Audit type**: Senior Product/Business Analyst — M&A due diligence
> **Date**: 2026-05-10
> **Severity verdict**: **HIGH** (mission statement materially aspirational; gap "platform built for X" vs "X actually shipping" è ampio ma non ingannevole — il codice è onesto su ciò che fa)
> **Mission match score**: ~25-30% (scaffolding solido, narrativa molto avanti rispetto al runtime)

---

## TL;DR (≤100 parole)

`heuresys-evo` è una **piattaforma demo-ready ma non ancora paying-customer-ready**. Il claim "Layer ontologico tra ERP/HR/BI con Knowledge Graph ESCO bilingue" è parzialmente vero a livello dati (ESCO 14.011 skills + 3.040 occupations caricati, AI advisor implementato) ma **completamente non integrato** con i sistemi enterprise menzionati (zero connettori SAP/Workday/Oracle; SAP explorer è uno status-page). Multi-tenant è seed sintetico (4 tenant test, 0 customer paganti). I 7 dashboard view brand-fedeli sono shipped ma con dati misti live/mock. **First paying customer realistico: 9-15 mesi** post-acquisizione, condizionato a un primo connettore HRIS reale + un design partner.

---

## 1. Mission vs Reality

| Mission claim (CLAUDE.md)                                   | Status             | Evidence                                                                                                                                                                        |
| ----------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Piattaforma SaaS B2B"                                      | **scaffold**       | Multi-tenant runtime OK · billing/subscription/contract layer = assente · 0 customer reali                                                                                      |
| "Organizational Intelligence & Workforce Orchestration"     | **scaffold**       | 7 dashboard view brand-fedeli shipped (`/dashboard/*_v2`) · "orchestration" features (workflow engine) = assenti                                                                |
| "Layer ontologico tra ERP/HR/BI"                            | **planned**        | Zero connettori shipped · `/explorer/sap` è status-page non integrazione · `webhooks/marketplace` = stage Tier 3                                                                |
| "Governare processi/struttura/ruoli/competenze/performance" | **partial**        | 5/5 dimensioni rappresentate in DB (566 tabelle Prisma) · 2/5 con UI production-grade (employees + dashboard)                                                                   |
| "Knowledge Graph ESCO bilingue (IT/EN)"                     | **shipped**        | 14.011 skills + 3.040 occupations + 126.051 occupation-skill caricati · `esco_occupations.preferred_label_{en,it}` · `/ontology` page funzionante                               |
| "8 ruoli RBP × 33 functional areas"                         | **shipped**        | 179 RBP role-area-permission joins canonical post-L54 · `requirePermission()` middleware enforced (P3)                                                                          |
| "47 PET mapping (Process/Enterprise/Talent)"                | **shipped (DB)**   | `rbp_area_perspectives` popolato · UI lens-switcher non shipped (carry-forward)                                                                                                 |
| "Multi-tenant 4 tenant"                                     | **shipped (test)** | 4 tenant DB-resident: Heuresys System (platform) + RTL Bank + SmartFood + EcoNova — **tutti seed sintetici**                                                                    |
| "AI advisor"                                                | **shipped (V1)**   | `services/app/src/app/api/ontology/advisor/route.ts` 1-129 · OpenAI `gpt-4o-mini` · cost cap in-memory · auth-only (RBP gate ESCO_KG **deferred**, vedi ADR-0022 §Consequences) |
| "ESCO embeddings 1536-dim"                                  | **partial**        | `pgvector` extension installata · embeddings popolati per ESCO core · 0 endpoint similarity search shipped end-to-end                                                           |

---

## 2. Feature inventory production-grade (cosa un buyer può "vedere demo")

**Pagine Next.js shipped** (27 totali, 24 protette via `(app)` group post-S22):

| Cluster         | Routes accessibili demo                                                                   | Stato                                       |
| --------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| Core            | `/`, `/login`, `/dashboard` (role-driven 7+ view), `/dashboard/[code]/edit`               | production-grade                            |
| Self-service    | `/me`, `/me/goals`, `/me/reviews`, `/me/skills`, `/me/learning`                           | shipped (UI + RBP gate)                     |
| Manager         | `/team`, `/reviews`, `/goals`, `/learning`, `/compensation`                               | shipped (UI + data parziale)                |
| HR ops          | `/employees`                                                                              | shipped (CRUD live)                         |
| Admin           | `/admin/users`, `/admin/tenants`, `/admin/rbac`, `/admin/audit`, `/admin/integrations`    | shipped (gated SUPERUSER/IT_ADMIN)          |
| Knowledge layer | `/ontology` (ESCO search + AI advisor), `/explorer/esco`, `/explorer/kg`, `/explorer/sap` | shipped (ESCO/KG live · SAP = status panel) |
| Brand/showcase  | `/showcase`, `/brand-studio`                                                              | shipped (internal tooling)                  |

**API endpoints**:

- 36 router Express in `services/api-gateway/src/routes/` (auth · employees · org-units · roles · users · tenants · workforce-planning · skills · esco · candidates · job-postings · interviews · offers · courses · learning-paths · enrollments · certifications · attendance · time-off · merit-cycles · 360-reviews · succession · talent-intelligence · platform · workspace · tenant-onboarding · skill-taxonomy · skill-analytics · etc.)
- 7 Next.js Route Handler `services/app/src/app/api/**/route.ts` (auth · dashboard data · ontology advisor · explorer KG/SAP/ESCO · dashboard elements PUT)

**Database asset**:

- 566 modelli Prisma · 312 tabelle `tenant_id NOT NULL` · 367 RLS policies attive · 0 FK NO ACTION
- ESCO seed: 14.011 skills · 3.040 occupations · 126.051 occupation-skill links · 5.818 skill-skill links · 3.276 NACE/ATECO con 4.565 ESCO crosswalks
- RBP seed: 8 ruoli · 33 functional areas · 47 PET mappings · 179 role-area-permission · 11 dashboard preset (di cui 11 `*_v2`) · 138 promoted asset di catalog

**UI library**:

- `packages/ui/` ~180 componenti, Storybook 9 con 84 stories, GH Pages auto-deploy

---

## 3. Gaps espliciti (marketing copy implica · prodotto non fa)

| Claim implicito mission                                                         | Realtà runtime                                                                                                                                                                                         |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Si integra con il tuo ERP/HR/BI"                                               | Zero connettori shipped. `/explorer/sap` mostra status non sync. `marketplace/webhooks/api-keys/plugins` = stage Tier 3 (non iniziato)                                                                 |
| "Workforce Orchestration"                                                       | Nessun workflow engine. Performance review ciclo: schema OK, UI = `/me/reviews` legge ma non instrada approvazioni.                                                                                    |
| "Governance processi" (vision pillar 4)                                         | Process layer "rotto" (notable tension confermata in `heuresys-vision.md` riga 167). 0 pagine `/processes/*` shipped.                                                                                  |
| "8 ruoli operativi"                                                             | 8 ruoli definiti + RBP enforced, ma di fatto `/dashboard/*_v2` è popolato per **6/7 preset** (4 process\_\* secondary nav HR_DIRECTOR/HR_MANAGER mancano `_v2` suffix — carry-forward S27+)            |
| "Bilingual IT/EN"                                                               | LocaleSwitcher AppShell shipped (Sprint 1.H) · ESCO label IT/EN OK · molte stringhe UI hardcoded inglese o italiano misto · 9 viste i18n verified, restanti = scope incompleto                         |
| "Capability Maturity rubric L1-L5"                                              | Rubric documentata in `heuresys-vision.md` riga 121 + `capability-maturity-scale.md` (wiki) · zero query/UI shipped contro tabelle live → empirical validation roadmap T+0/+90/+180/+270/+365 = aperta |
| "AI Talent Advisor multi-surface"                                               | 1 advisor shipped (`/ontology`) · seconda surface `/explorer/kg` advisor = roadmap (ADR-0022 §Consequences)                                                                                            |
| "Compliance audits, policy violations, whistleblowing" (Tier 2 PET-driven plan) | Zero pagine shipped. `/admin/audit` = audit log viewer interno, non compliance suite per cliente                                                                                                       |

---

## 4. Multi-tenant real maturity

**Verdict**: tenant attivi sono **seed sintetici per testing**, non customer reali.

| Tenant          | Tipo         | Evidenza                                                                                                                    |
| --------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Heuresys System | Platform     | `tenant_id` riservato per cross-tenant SUPERUSER. Atteso (è il tenant proprietario).                                        |
| RTL Bank        | Test fixture | Tutti gli 8 utenti canonical (`Heuresys2026!`) restano in `tests/.test-env` SoT (post-L51) · domain `rtl-bank.org` fittizio |
| SmartFood       | Demo seed    | `db/seeds/seed_process_layer_smartfood.sql` esiste · domain `smartfood.org` fittizio                                        |
| EcoNova         | Demo seed    | `db/seeds/seed_process_layer_econova.sql` esiste · domain `econova.org` fittizio                                            |

**Popolazione**: 270 active employees + 265 active users + 1 platform user. **Nessun MAU reale, nessun NPS, nessun CSAT, nessun churn** — sono tutti dati di scenario brandizzati. Questo non è negativo per una piattaforma in pre-launch, **ma deve essere dichiarato esplicitamente nel CIM**: la marketing dei `/dashboard` viste mostra numeri credibili che un acquirente non addestrato potrebbe scambiare per metriche operative.

**Maturity multi-tenant infra (positiva)**: RLS DB-level con 367 policies attive · `requirePermission(area,action)` middleware · audit log atomico via `auditedTransaction()` · `tenants.domain` SoT NOT NULL UNIQUE post-L50 — l'**isolamento tecnico è enterprise-grade**, mancano solo i clienti.

---

## 5. AI/ML feature ranking

| Feature                                     | Stato             | Note                                                                                                                                                                            |
| ------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OpenAI advisor `/ontology` (career-path)    | **production V1** | ADR-0022 accepted · `gpt-4o-mini` · cost cap in-memory daily · 503 fallback se key assente · zero real API calls in CI · streaming deferred · RBP gate **deferred** (auth-only) |
| ESCO Knowledge Graph 1-hop neighborhood     | **production V1** | `/explorer/kg` page · `esco_occupation_skills` 1-hop edge expansion · `KGGraphCanvas` atomic in `packages/ui` · Cytoscape upgrade = follow-up                                   |
| ESCO embeddings 1536-dim (pgvector)         | **dev**           | extension installata · embeddings popolati per ESCO core · 0 endpoint similarity search end-to-end shipped                                                                      |
| Skill gap analysis · skill-galaxy · what-if | **planned**       | Pagine legacy esistenti · zero porting in evo · Tier 1 PET-driven plan ma "alto effort"                                                                                         |
| Workforce Intelligence career simulator     | **planned**       | Tier 1 plan · effort medio-alto stimato                                                                                                                                         |
| Predictive analytics / HR predictions       | **planned**       | `analytics/predictions` legacy area · stage `legacy-only` in feature-parity-tracking.md                                                                                         |
| Capability maturity rubric L1-L5            | **experiment**    | Documentato + 5 query SQL auditable in wiki · zero UI/endpoint live · empirical validation roadmap aperta                                                                       |

**Bilancio**: 1 feature AI in production reale (advisor), 1 feature in production limitata (KG explorer), tutto il resto è scaffolding strategico. Nessun differenziatore AI difensibile **oggi**.

---

## 6. Workstream paralleli — accountability

| Workstream                                                          | Asset acquisibili                                                                                                                                                                                                    | Burn rate / distrazione                                                                                                                                                                                                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ux-design/` brand identity                                        | Brand book v0 (15 sezioni) · 5 dashboard mockup HTML brand-fedeli · 17 palette × 2 mode framework runtime · `motion-final.md` · `palette-final.md` v2 OKLCH · `typography-final.md` (Exo 2 + Inter + JetBrains Mono) | Phase 14 in re-exploration con 32 direzioni esplorate (Set 1+2+3+4+5) → indica iterazione strategica costosa per founder solo. **Asset = SI** se acquirente vuole identità chiavi in mano; burn rate alto se acquirente preferisce rebranding |
| `09-asset-showcase/` Express+Prisma+SQLite                          | 346 assets catalogati · 138 promoted · 374 variants · 11 dashboardCode `*_v2` mappati · governance shift L46+L47                                                                                                     | Tool **localhost-only gitignored** (eccetto `_legacy/`) → asset operativo per founder, non scalabile a team. Da migrare a postgres se acquirente cresce team UX → costo ~1-2 sessioni                                                         |
| Storybook 9 (84 stories)                                            | Componenti UI documentati interattivi · GH Pages live                                                                                                                                                                | Mantenibile · ROI alto per onboarding nuovi sviluppatori                                                                                                                                                                                      |
| `cowork_code_exchange/` (protocollo PROMPT/PLAN/EXEC/REPORT/REVIEW) | Audit trail di sessioni AI-orchestrated                                                                                                                                                                              | Zero overhead per acquirente · può essere ignorato o adottato                                                                                                                                                                                 |

**Verdict workstream**: brand workstream è un asset reale ma indica anche che il founder ha investito molto tempo su forma vs funzione negli ultimi 6 sprint (S20-S26). Per un acquirente technical, segnala possibile **product-market fit ancora non raggiunto** → priorità founder sbilanciate verso identità.

---

## 7. Feature parity vs legacy `heuresys.com.evo`

**Numeri ufficiali da `migration-strategy-pet-driven.md` (2026-05-02)**:

- Pagine: legacy 231 · evo 3 al baseline (oggi 27) → **gap 88%**
- Endpoint: legacy 1.481 · evo 11 al baseline (oggi ~36 router gateway + 7 next API) → **gap 97%**
- DBMS schema: 566 tabelle entrambi (allineato post baseline-squash 2026-04-27)

**Legacy import registry** (`.handoff/legacy-import-registry.csv`, 124 righe oggi):

| Stage      | Count | Note                                                                               |
| ---------- | ----- | ---------------------------------------------------------------------------------- |
| Promoted   | 30    | Endpoint completi portati in produzione (Pack 1-8 chiusi)                          |
| Test Stage | 57    | Helper, allowlist Prisma, costanti, env-config in attesa promozione                |
| Rejected   | 36    | Heavy CTE / aggregation handler, applyFieldPolicy, ecc. → deferred Pack 1c o oltre |

**Decisione strategica vincolante (migration-strategy-pet-driven §2.2)**: cutover-event abbandonato, **phased portfolio over 24+ mesi**. Legacy resta vivo indefinitamente come fonte di verità per aree non ancora portate.

---

## 8. Open questions per acquirente

1. **First paying customer profile**: il founder ha mai fatto outbound? Il vertical PMI 50-250 (`heuresys-vision.md` notable tension riga 171) o Enterprise 1000+ è ancora da consolidare. Senza un design partner reale entro 6 mesi, il PMF resta ipotesi.
2. **Wedge feature**: il claim differenziante è "3 lenti PET su Knowledge Graph". Quale lens-switcher UI è shipped? Risposta: nessuno. Gli explorer ESCO/KG sono la cosa più vicina, ma sono _knowledge browsers_, non _governance instruments_.
3. **Complementary partner economics**: il fatto che la piattaforma _non_ replichi un HRIS classico (per scelta) significa che ogni vendita richiede una HRIS source-of-truth pre-esistente nel cliente → **vendita a TI di clienti enterprise già attrezzati**, ciclo lungo (9-18 mesi tipico).
4. **Pricing/billing layer**: schema, tabelle, UI per subscription/contract/usage = assenti. Pre-revenue completo. Stripe/contract management = green field.
5. **GTM team**: solo coder = solo founder. Zero sales, zero marketing, zero CS — risk profile = founder-dependency 100%.
6. **Compliance posture cliente**: GDPR/SOC2/ISO27001 = zero certificazioni pubbliche. Per Enterprise audience richiesto.

---

## 9. Acquirer perspective

**BUY rationale (positivo)**:

- ESCO data layer + Knowledge Graph + RLS multi-tenant + RBP DB-driven = **costruzione tecnica ~12-18 mesi-uomo già fatta**, riproduzione greenfield costerebbe €300-500k effort
- Brand identity v0 completo (Brand Book 15 sezioni · palette OKLCH · motion language) = €30-60k saved on agency
- Audit trail e ADR (26 documenti) = governance di qualità inusuale per pre-revenue startup
- Code quality alto: 865 test verdi · 0 npm audit vulns · typecheck PASS · forensic DB audit closure 95% post-S24

**NEGOTIATE rationale (riserve)**:

- Gap mission 70-75% → **valutazione deve scontare** la narrativa "Organizational Intelligence platform" e prezzare ciò che esiste oggi (ESCO browser + role-based dashboard + RBP infra)
- Multi-tenant = 0 paying customer · 4 seed sintetici → **revenue multiplier non applicabile**, asset-based valuation
- AI features = 1 advisor V1 + 1 KG canvas → **non è un AI-first product** ad oggi
- Founder-dependency 100% → retention/earnout vincolante
- Re-exploration brand Phase 4 (32 direzioni esplorate) suggerisce founder ancora a livello strategico esplorativo, non execution mode → **mismatch potenziale con acquirer aspettative scaling**

**PASS rationale (rosso)**:

- Se acquirente cerca **ARR-multiple**: zero ARR, no
- Se acquirente cerca **ICP validato**: target PMI vs Enterprise non risolto, no
- Se acquirente cerca **AI moat**: 1 advisor su gpt-4o-mini con prompt 1-paragrafo non è moat, no

**Preliminary D8 verdict**: **NEGOTIATE** — l'acquisizione ha senso come **acqui-hire + asset purchase** (codebase + ESCO seed + brand identity + governance pattern + founder onboarded come tech lead), valutazione **NON** come SaaS revenue-multiple. **Range di anchor 350-700k€ asset-based**, condizionato a (a) earnout 18-24 mesi su milestone first-paying-customer (b) clauses su consegna roadmap Tier 1 PET-driven completo entro 12 mesi (c) due diligence supplementare su IP cleanliness (legacy vs evo separation, 3rd party deps).

**First paying customer realistico timeline**: **9-15 mesi** post-acquisizione, condizionato a:

1. design partner reale firmato entro M+3 (zero pipeline visibile oggi)
2. primo connettore HRIS reale (Workday/SuccessFactors/BambooHR) entro M+6
3. compliance posture (GDPR DPA + SOC2 type 1) entro M+9

Senza questi tre, anche la roadmap "Tier 1 PET-driven Q3 2026 narrative" (`migration-strategy-pet-driven.md` §7 punto 3) resta narrativa per investitori, non revenue-generating.

---

## 10. Severity breakdown

| Categoria                                            | Severity     | Note                                                                                  |
| ---------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| Mission "ERP/HR/BI integration"                      | **high**     | zero connettori shipped vs claim "layer ontologico tra ERP/HR/BI"                     |
| Mission "Workforce Orchestration"                    | **high**     | nessun workflow engine vs nome prodotto                                               |
| Multi-tenant "4 tenant attivi" (CIM-style messaging) | **high**     | rischio mis-rappresentazione se non dichiarato come seed sintetico                    |
| AI advisor surface count                             | **medium**   | 1 di 3 surface promesse ADR-0022 shipped, RBP gate deferred                           |
| `/dashboard/*_v2` coverage                           | **medium**   | 6 di 7 preset role popolati (4 process\_\* secondary HR_DIRECTOR/HR_MANAGER mancano)  |
| ESCO bilingue IT/EN                                  | **low**      | shipped reale (label) · UI strings parzialmente i18n · ROI fix basso                  |
| Brand identity workstream burn                       | **medium**   | re-exploration Phase 4 in corso → indica non-converged, non bloccante                 |
| Feature parity vs legacy                             | **high**     | 88% pagine + 97% endpoint gap · phased portfolio 24+ mesi acknowledged                |
| Compliance/billing/sales infrastructure              | **critical** | non esiste alcuna infrastruttura subscription/contract/billing — pre-revenue completo |

**Severity totale**: 1 critical · 4 high · 3 medium · 1 low

---

## 11. Recommendation reading per BoD acquirer

1. Confronto diretto founder + acquirente su **ICP definitivo** (PMI 50-250 vs Enterprise 1000+) prima di chiudere term sheet
2. Audit indipendente IP separation legacy `heuresys.com.evo` ↔ evo (entrambi repo founder, ma copyright assignment è acquisition material)
3. Test demo dal vivo dei 7 dashboard view brand-fedeli con dati live (non screenshots) → verificare che il claim "production-grade" regga sotto interrogazione
4. Richiedere a founder lista pipeline customer (anche only-conversation/letter-of-intent) → se 0, prezzare come pure asset purchase
