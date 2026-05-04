# Persona 02 — IT Admin

> _Note: nomi/dettagli sono illustrativi. Sostituibili con clienti reali quando confermati da Enzo._

## Profilo

**Davide Conti**, 38 anni, **IT Architect / Lead Engineer Enterprise Apps** in **RTL Bank**. Riporta al CIO. Responsabile di integrazione applicativa tra ERP (SAP S/4HANA), HRIS (SuccessFactors), data lake (Snowflake), middleware (MuleSoft).

Background informatico (ingegneria informatica + 12 anni di carriera). Stack quotidiano: Postgres, Kubernetes, OAuth/OIDC, Terraform. Conosce la differenza tra row-level security e application-level filtering.

## Cosa vuole davvero

Aggiungere uno strumento HR che **non sia un altro silos**. Vuole un sistema che:

- Si integri via API standard (REST/GraphQL, no proprietary connector da €50k)
- Rispetti il modello multi-tenant del gruppo
- Non richieda di esporre dati sensibili a un SaaS che fa "AI-powered insights" senza spiegare cosa fa il modello
- Sia auditable: log a riga, RLS DB-level, no application-side filtering bypassabile

## Cosa lo frustra

- Vendor HR che dicono "abbiamo SOC2" e poi non sanno rispondere su come segregano i dati tra tenant
- "AI-powered" senza model card, no spiegazione del prompt, no audit del data flow
- Connettori "out-of-the-box" che richiedono 3 mesi di consulenza per funzionare
- "Webhook" che in realtà sono polling ogni 15 minuti
- Roadmap public che mostra feature da 2 anni "coming soon"

## Cosa sa

- Distingue isolation logico (tenant_id where clause) da isolation database-level (RLS policy attiva)
- Sa cosa è un knowledge graph e perché RDF/SPARQL non sempre sono la risposta
- Conosce ESCO come standard EU
- Capisce la differenza tra OIDC e SAML federation

## Come arriva a Heuresys

- Maria (HR Director) gli passa il link e gli chiede una valutazione **technical due diligence**
- Lui legge i public docs `docs/30-developer/security-baseline.md`, gli ADR
- Apre il GitHub se public, guarda i package.json, legge il prisma schema
- Cerca CVE / penetration test result / SOC2 audit
- Verifica claim multi-tenant testando con un tenant test

## Cosa Heuresys deve dimostrare a Davide

1. **Architettura visibile** — diagram chiaro di servizi, porte, separazione tier (services/packages monorepo, API gateway 8200 + app 3200, RLS Postgres 5432 bare-metal)
2. **RLS DB-level** — query che dimostra che app principal `heuresys_app_user` non ha BYPASSRLS, e che cross-tenant query restituisce 0 righe anche con admin compromise
3. **Audit log atomico** — `audit_logs` insert in transazione con write business, mostrato in schema
4. **Conformità ESCO** — non è "AI-magic", è mapping deterministico con tassonomia EU
5. **Open architecture** — REST + GraphQL, webhook reali (non polling), no vendor lock-in
6. **Roadmap onesta** — ADR pubblici, no "coming soon" mai
7. **Risposta veloce a security questionnaire** — security-baseline.md come SoT, non un PDF da redigere

## Voce per parlargli (esempio)

| ❌ Mediocre                                            | ✅ Heuresys                                                                                                               |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| "Enterprise-grade security with bank-level encryption" | "Postgres RLS DB-level (605 policies). App principal senza BYPASSRLS. Audit log atomico in transazione. Schema pubblico." |
| "Trusted by leading enterprises"                       | "RTL Bank, 3.200 dipendenti, RLS coverage 100% delle tabelle tenant-scoped. Verificato in produzione."                    |

## Surface critiche per Davide

| Surface                            | Cosa deve trovare                                       |
| ---------------------------------- | ------------------------------------------------------- |
| Public docs / `docs/30-developer/` | Security baseline, architecture diagram, ADR            |
| Architecture page                  | Diagrama servizi, RLS flow, audit log schema            |
| Status page                        | Uptime real-time, no fake 99.99% claim                  |
| Developer portal                   | API reference, OpenAPI/GraphQL schema, webhook examples |
| GitHub (se public)                 | README con setup steps, prisma schema visibile          |

## Cosa NON fare con Davide

- Non vendergli "AI". Vendergli **schema deterministico ESCO + capability ontology**.
- Non nascondergli la complessità. Mostragli `RLS coverage 605 policies`, lui apprezza.
- Non offrirgli "white-label". Offrigli **theming + custom domain + SSO IdP suo**.
- Non chiedergli di chiamare sales. Dagli `docs/30-developer/` da leggere autonomamente.
