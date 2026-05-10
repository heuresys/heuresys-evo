# Executive Summary — heuresys-evo Acquisition Audit

> **Mandato**: ACQ-AUDIT-2026-05 · **Data**: 2026-05-10 · **Status**: **DRAFT PRELIMINARY (post-Sessione 1, pre-Devil's Advocate)**
> **Decisione preliminary**: **NEGOTIATE** con condizioni precedenti — soggetta a revisione post-attacco DA in Sessione 2

---

## 1. Verdict preliminary

**NEGOTIATE** — non BUY straight, non PASS.

L'audit forense (10 dimensioni assessed da subagent specialisti + governance review) identifica una piattaforma con foundation tecnico solido, governance interna eccezionale per stadio, brand identity matura, **MA** con 8 critical findings + 16 high findings che precludono BUY senza condizioni e una posizione competitiva che richiede focus stretto per rimanere defensible.

La raccomandazione finale BUY/NEGOTIATE/PASS sarà confermata o revisionata in Sessione 2 dopo Devil's Advocate attack (tecnico + business) e rebuttal.

---

## 2. Snapshot piattaforma

| Aspetto                      | Stato                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mission dichiarata**       | Piattaforma SaaS B2B di Organizational Intelligence & Workforce Orchestration, layer ontologico tra ERP/HR/BI via Knowledge Graph ESCO bilingue IT/EN |
| **Mission vs reality match** | ~25-30% (D8 verdict) — claim aspirazionale, codice onesto sui gap                                                                                     |
| **Stack tecnico**            | Next.js 16 + React 19 + Express 5 + Prisma 5.22 + PostgreSQL 16 + Tailwind 4 + Vitest 4 + NextAuth v4                                                 |
| **Scale dichiarato**         | 568 modelli Prisma · 312 tabelle multi-tenant · 367 RLS policies · 8 ruoli RBP × 33 functional areas                                                  |
| **Test suite**               | 865 verdi (224 app + 462 api-gateway + 7 enrichment + 95 ui + 82 shared) · 1.2% skip justified                                                        |
| **Dipendenze**               | Stack moderno, latest versions. NextAuth v4→v5 deferred Q3-Q4 2026 (stable release)                                                                   |
| **Cost-to-date proxy**       | 314 commit Spen-Zosky in 10 giorni calendar (2026-05-01 → 2026-05-10) — **velocity AI-assisted** ~30 commit/giorno                                    |
| **Multi-tenant runtime**     | 4 tenant attivi = **100% seed sintetici** (RTL Bank, SmartFood, EcoNova). 270 employees + 265 users = test data                                       |
| **Documentation maturity**   | 26 ADR (17 Accepted) · 60 entry DECISIONS-LOG · sprint-history Phase 13→S26 · operating-baseline 362 linee                                            |

---

## 3. Findings critici (8)

I findings critical sono **fixable o strategici** — nessuno è "irreversibile". Ordinati per impatto acquirer:

| #      | Finding                                                                                                                                    | Tipo               | Effort/Impact                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | ----------------------------- |
| **C1** | Phase 2 vertical-split employees deferred (65 view dipendenti undocumented scoperte al DROP COLUMN)                                        | Technical fixable  | 15-25h FTE                    |
| **C2** | SPOF: 1 VM Oracle Free Tier ARM64 host TUTTO lo stack (FE+API+enrichment+Postgres+Redis+nginx). Zero HA, zero standby, zero multi-region   | Infra hardening    | 80h + ~15-30k EUR/anno        |
| **C3** | Doc-runtime drift: runtime ATTUALE è Docker Compose, NON systemd bare-metal come tutta la doc dichiara                                     | Strategic decision | 8-16h doc + decision          |
| **C4** | NO Disaster Recovery off-site: backup co-locati sulla stessa VM del DB. Bucket OCI dichiarato "not yet provisioned"                        | Compliance/risk    | 16h + ~200 EUR/anno           |
| **C5** | Multi-tenant = 0 paying customer. CIM-risk se pitch deck mostra 4 tenant come operativi                                                    | Strategic fact     | N/A — go-to-market            |
| **C6** | Competitive existential threat: SAP SuccessFactors TIH 1H 2026 + Microsoft Viva People Skills bundled in Copilot. Time-to-impact 6-18 mesi | Market timing      | N/A — positioning             |
| **C7** | Mission "Layer ontologico tra ERP/HR/BI" senza connettori HRIS shipped. `/explorer/sap` è status-page                                      | Product gap        | 200-400h per primo connettore |
| **C8** | "AAA passing" claim è axe-only (~30-57% delle violazioni reali). Manual NVDA/VoiceOver mai eseguito. EAA 2025-06-28 mandatory già passata  | Compliance gap     | 80-100h + 8-15k EUR auditor   |

Dettaglio completo: [`08-tech-debt-registry-consolidated.md`](./08-tech-debt-registry-consolidated.md) sezione CRITICAL.

---

## 4. Strengths chiave (3+)

1. **Governance interna documentale eccezionale per stadio**: 26 ADR strutturati, append-only DECISIONS-LOG (60 entry), sprint-history Phase 13→S26, operating-baseline canonico (P1-P10 + R1-R20 + CARD-1-4). Questo è raro per single-coder pre-revenue. Vale come asset acquisibile autonomo (~80-150h evitate di reverse-engineering per acquirer).
2. **Brand identity v0 completo + design system maturo**: 12 phase brand cycle ✅ chiuse, Brand Book completo, palette OKLCH, motion language, ~180 component packages/ui, Storybook 9 (84 stories), Cantiere B v2 design system. Ricostruire questo asset costa ~6-9 mesi FTE + ~30-60k EUR agency. **Asset chiavi-in-mano**.
3. **Knowledge Graph ESCO + multi-tenant infra enterprise-grade**: ESCO 14.011 skills + 3.040 occupations + 126.051 occupation-skill links bilingue IT/EN, RLS 367 policies + FORCE RLS + role no-BYPASSRLS, RBP data-driven (mai requireRole hardcode), `auditedTransaction()` atomico mirrored cross-service. Ricostruire ~12-18 mesi FTE. **Wedge competitivo verificato** (D9: nessun competitor SaaS B2B EU usa ESCO commercialmente).
4. (Bonus) **Code quality baseline healthy**: 1 TODO marker, 8 `any` annotated/justified, 5 console.log (critical path), 13 eslint-disable annotated, 2 @ts-ignore lib types. Zero spam. 865 test verdi su repo 13 giorni.
5. (Bonus) **Stack moderno across the board**: latest versions di tutti i layer principali. No legacy debt, no dead pattern. NextAuth v4→v5 migration pianificata Q3-Q4 2026.

---

## 5. Cost-to-date stimato (PRELIMINARY)

> **Caveat metodologico**: stima basata su git log proxy + sprint-history. NON include legacy `heuresys.com.evo` (repo separato, fuori scope di questo audit). Velocity AI-assisted distorce significativamente metriche tradizionali commit-count.

| Componente                                                                    | Range stima                             | Note                                                           |
| ----------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| Greenfield rewrite heuresys-evo (10 giorni calendar, 2026-05-01 → 2026-05-10) | **80-150h FTE**                         | 8-15h/giorno solo coder con AI-assistance                      |
| Brand identity workstream (12 phase)                                          | **120-200h FTE**                        | inclusi 32 mockup, 8+ direzioni esplorate, brand book completo |
| Documentation governance (26 ADR + 60 decisioni + audit forensic)             | **40-60h FTE**                          | strutturazione ADR + L# entries + 2 forensic audit doc         |
| Test suite construction (865 test)                                            | **40-60h FTE**                          | spread across S1→S26                                           |
| Database migrations (40 seed file)                                            | **30-50h FTE**                          | inclusi Phase 16.A→16.O                                        |
| **TOTAL heuresys-evo (greenfield only)**                                      | **310-520h FTE**                        | ~2-3 mesi FTE solo coder                                       |
| Legacy `heuresys.com.evo` (separato, NON in scope)                            | **N/A — da quantificare separatamente** | —                                                              |
| **TOTAL effort proxy combinato**                                              | **probabilmente 600-1200h FTE+**        | dipende da legacy scope                                        |

**Loaded cost EU senior fullstack** (€80-150/h): **€25k-78k per il greenfield only**, **€48k-180k+ combinato** (range largo per incertezza legacy).

---

## 6. Roadmap teaser to v1.0 commercial-ready

Dettaglio completo in `12-roadmap-going-forward.md` (Fase E, Sessione 2).

| Phase                      | Scope                                                                                                                            | Effort          | Calendar           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------ |
| **M+1 (post-acquisition)** | C1 Phase 2 + C4 DR off-site + H7 CSP enforce + H8 RSC boundary + first connector design                                          | ~80-120h FTE    | 1 mese             |
| **M+3**                    | C2 HA infra + C8 a11y manual+VPAT + H1+H2 doc cleanup + H11 integration test setup + first HRIS connector MVP                    | ~250-350h FTE   | 3 mesi cumulative  |
| **M+6**                    | First paying customer pilot + H13 RLS bypass test suite + H14 workflow engine MVP + IaC complete + SOC 2 Type 1 readiness        | ~500-700h FTE   | 6 mesi cumulative  |
| **M+12**                   | v1.0 commercial-ready: HA + DR + multi-region + IaC + SOC 2 Type 1 + 3+ connectors + ≥3 paying customer + observability complete | ~1000-1500h FTE | 12 mesi cumulative |
| **M+18**                   | Scale-ready: SOC 2 Type 2 + ISO 27001 + multi-region active-active + paying customer ≥10                                         | ~1500-2200h FTE | 18 mesi cumulative |

**Order of magnitude TOTAL effort to v1.0**: **2000-3000h FTE** distribuiti su 12-18 mesi con team 2-3 senior engineer + 1 ops/SRE + 1 design/PM (~€350-550k loaded cost EU) + ~50-80k EUR infra/audit/tooling esterno.

---

## 7. Condizioni precedenti preliminary (5)

Da raffinare in `16-final-decision-brief.md` post-Devil's Advocate. Preliminary:

1. **Phase 2 vertical-split closure entro 90 giorni post-closing** — Effort 15-25h FTE, evidence-based plan in `phase16o_employees_to_view.DRAFT-DEFERRED.sql`. Senza questo, sync trigger doppia scrittura permane = compounding risk.
2. **Off-site DR backup attivato entro 30 giorni post-closing** — bucket OCI cross-region encrypted. Compliance prerequisite (SOC 2 CC7.4, ISO 27001 A.12.3, GDPR Art. 32). Effort 16h + ~200 EUR/anno.
3. **Founder retention package vincolante 18-24 mesi** — bus factor estremo (314/335 commit = 94% Spen-Zosky). Earnout con clawback se founder leaves pre-milestone. Onboarding immediato L2 SRE + L1 on-call pre-day-one per de-risk.
4. **WCAG 2.2 AA VPAT firmato auditor esterno entro 6 mesi post-closing** — gap 80-100h + 8-15k EUR. EAA 2025-06-28 deadline già passata, exposure sanzioni EU. Senza questo, market access EU public sector bloccato.
5. **License strategy decision pre-LOI** — ADR-0019 open question. B2B SaaS commercial license vs OSS dual-license: pre-condition contrattuale per IP clarity. Repo è PUBLIC su GitHub (Spen-Zosky/heuresys-evo) senza LICENSE OSS = legal risk acquirente.

Ulteriori 2-3 condition aggiuntive emergeranno post-Devil's Advocate.

---

## 8. Acquirer profile fit

| Profile                                                                                                       | Fit                   | Razionale                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **EU tier-2 HCM scale-up** (Personio DE, HiBob UK/IL, Talentech Nordics, **Zucchetti IT**, **TeamSystem IT**) | ⭐⭐⭐⭐⭐ Best fit   | Cercano competence ontology layer senza overlap proprio. Skills-graph + ESCO bilingue = differenziazione naturale per stack EU SMB esistente |
| **Sustainability/ESG reporting platform** (Workiva, Sweep, Greenly, Position Green)                           | ⭐⭐⭐⭐ Strong fit   | Heuresys-evo come **upstream workforce data layer** per CSRD ESRS S1 reporting. Tailwind regolatorio diretto                                 |
| **Italian PA / consulting** (Capgemini, Reply, Engineering, Almaviva)                                         | ⭐⭐⭐ Moderate fit   | Practice OI per consulting digital transformation. ANPAL ESCO adoption Italia + Pay Transparency 2027 = target chiaro                        |
| **PE roll-up skills-tech** (Vista, Thoma Bravo, Hg Capital)                                                   | ⭐⭐ Anchor or add-on | Asset attractive ma scale-up funding richiesto post-acquisizione                                                                             |
| **Enterprise US incumbent** (Workday, SAP, Oracle, Microsoft)                                                 | ⭐ Improbabile        | Costruirebbero internal in 12 mesi. Eightfold/Gloat overlap funzionale alto, acquisizione meno strategica                                    |
| **EU Commission OSS contribution**                                                                            | ⭐ Niche              | Exit non-commerciale via open-sourcing in ESCO ecosystem                                                                                     |

---

## 9. Disclaimer e prossimi step

Questo executive summary è **PRELIMINARY post-Sessione 1 (Fase A discovery + Fase B synthesis)**.

Sessione 2 prevista produrrà:

- **Fase C** Devil's Advocate attack (`13-devils-advocate-technical.md` + `14-devils-advocate-business.md`) — 2 critic agent attaccheranno questo brief con istruzioni esplicite kill-the-deal
- **Fase D** Rebuttal (`15-rebuttal-and-synthesis.md`) — risposta punto-per-punto: accepted/mitigated/rejected
- **Fase E** Final brief & roadmap completi (`01-prd-reality-based.md`, `11-cost-to-date-estimate.md` definitivo, `12-roadmap-going-forward.md`, `16-final-decision-brief.md` signed)

**Top 3 aree dove DA probabilmente attaccherà più duro** (anticipazione difensiva):

1. **C5 + C7 + C6 combo**: "Senza paying customer, senza connettori, con SAP/Microsoft già nel segmento a 1 anno → questa è una scommessa, non un'acquisizione"
2. **Founder bus factor + AI-velocity**: "Productivity dipende 100% da founder + AI access. Remove uno dei due e collassa. Cosa stai comprando, codice o un servizio bundle?"
3. **Mission vs Reality 25-30% match**: "Marketing copy promette layer ontologico ERP/HR/BI. Codice è dashboard render. Acquirer paga per la promise; rischio claw-back o rappresentation breach"

---

**Documento da considerarsi non-vincolante fino alla firma del Decision Brief finale (`16-final-decision-brief.md`) post-Sessione 2.**
