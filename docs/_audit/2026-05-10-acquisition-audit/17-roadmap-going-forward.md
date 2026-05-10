# Roadmap Going-Forward — heuresys-evo to v1.0 commercial-ready

> **Mandato**: ACQ-AUDIT-2026-05 · **Data**: 2026-05-10 · **Fase**: E (Sessione 2)
> **Scope**: roadmap consolidata post-acquisition per portare la piattaforma da stato attuale (S26) a **v1.0 commercial-ready** (paying customer + SLA enterprise + compliance baseline)
> **Audience**: acquirer roadmap planning + founder retention milestone definition
> **Lingua**: italiano

---

## 1. Definition: "v1.0 commercial-ready"

Per "commercial-ready" intendiamo lo stato che permette:

- **≥3 paying customer** in segmento target (PMI italiana regulated 50-500 employee)
- **SLA contrattuale ≥99.5% uptime** sostenibile
- **SOC 2 Type 1 readiness** (audit external complete, ACR firmato)
- **WCAG 2.2 AA VPAT** firmato auditor esterno
- **Disaster Recovery off-site cross-region** operational
- **Almeno 1 connettore HRIS production-grade** (Zucchetti / TeamSystem / Personio EU)
- **Workflow engine MVP** (process autonomy minima)
- **Subscription/billing** layer (Stripe o equivalente)
- **Customer support tooling** (help desk integration)

---

## 2. Phase model: M+1 → M+18

### M+1 — Foundation cleanup (post-acquisition first month)

**Obiettivo**: chiudere debiti critici low-hanging fruit + setup acquirer integration.

| Epic                                                              |                                                                       Effort | Sprint count | Dependencies                |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------: | -----------: | --------------------------- |
| C4 Off-site DR backup activation (bucket OCI cross-region)        |                                                                      16h FTE |            1 | nessuna                     |
| C1 Phase 2 vertical-split employees apply (post 65 view audit)    |                                                                   15-25h FTE |          1-2 | view audit pre-prerequisito |
| H7 CSP report-only → enforce flip (post monitoring window)        |                                                                     4-8h FTE |            1 | monitoring data             |
| H8 RSC boundary loading.tsx/error.tsx/Suspense — 24 pagine (app)/ |                                                                      10h FTE |            1 | nessuna                     |
| H1+H2 ADR fantasma cleanup + monorepo doc drift fix               |                                                                     6-8h FTE |            1 | nessuna                     |
| H9 next/image adoption sweep                                      |                                                                       6h FTE |            1 | nessuna                     |
| H10 Touch target Button sm/md → 44×44 AAA fix                     |                                                                     4-8h FTE |            1 | regression test             |
| C3 doc-runtime drift independent audit (third party)              |                                                   8-15h doc + €8-15k esterno |            1 | acquirer-side               |
| Founder onboarding L2 SRE + senior fullstack (shadow coding 90gg) |                                                               80-120h shared |            4 | hire complete               |
| **TOTAL M+1**                                                     | **~150-220h FTE seller-side + ~80-120h acquirer team-side + €8-15k esterno** | **4 sprint** | —                           |

**Output M+1**: 24+ pagine con boundary RSC stable · DR off-site operational · Phase 2 closed · doc-runtime drift audited · founder + acquirer team integration day-1 → day-90 shadow.

### M+3 — Compliance baseline + first connector design

**Obiettivo**: SOC 2 Type 1 readiness path + a11y certification + first connector HRIS architecture spike.

| Epic                                                                           |                                Effort |                             Sprint count | Dependencies              |
| ------------------------------------------------------------------------------ | ------------------------------------: | ---------------------------------------: | ------------------------- |
| C8 WCAG 2.2 AA manual NVDA/VoiceOver pass — 9 viste + estensione CRUD flows    |              80-100h + €8-15k auditor |                                      4-6 | M+1 H10 closed            |
| C8 VPAT firmato auditor esterno (Deque / Level Access / TPGi)                  |            inclusa nei €8-15k auditor |                                        — | manual pass complete      |
| C2 HA infra: Postgres primary+replica + load balancer + multi-region failover  |           80h + €15-30k/anno HA infra |                                        4 | acquirer SRE team         |
| H5 RBP UI gap closure (`requirePermission`/`usePermission` su services/app)    |                             8-16h FTE |                                        2 | nessuna                   |
| H4 Audit log enforcement adoption sweep (`auditedTransaction()` cross-service) |                            12-20h FTE |                                        2 | nessuna                   |
| H11 Integration test setup (testcontainers, ADR-0002 status → Accepted)        |                            30-50h FTE |                                        4 | acquirer test infra       |
| H13 RLS bypass test suite (cross-tenant attack scenarios)                      |                            16-30h FTE |                                      2-3 | M+1 view audit complete   |
| H12 Coverage threshold enforcement in CI (Codecov + gate)                      |                              4-8h FTE |                                        1 | nessuna                   |
| First HRIS connector architecture spike (Zucchetti/TeamSystem evaluation)      |                            40-80h FTE |                                        4 | buyer outreach validation |
| Pen-test cross-tenant isolation (third party Cure53 / Bishop Fox)              |                       €20-40k advisor |                                        — | H13 complete              |
| **TOTAL M+1 → M+3 cumulative**                                                 | **~370-580h FTE + ~€51-100k esterno** | **6 sprint addizionali (10 cumulative)** | —                         |

**Output M+3**: SOC 2 Type 1 audit-ready · WCAG VPAT firmato · HA Postgres operational · pen-test PASS · RBP enforcement complete cross-layer · first HRIS connector spec firmato.

### M+6 — Production-ready + first paying customer pilot

**Obiettivo**: production-grade infra + first paying customer (design partner) + workflow engine MVP.

| Epic                                                                   |                                    Effort |                                    Sprint count | Dependencies                          |
| ---------------------------------------------------------------------- | ----------------------------------------: | ----------------------------------------------: | ------------------------------------- |
| First HRIS connector MVP production (Zucchetti o TeamSystem)           |                              200-400h FTE |                                            8-12 | M+3 spec firmato                      |
| H14 Workflow engine MVP (BullMQ + state machine + UI)                  |                              300-600h FTE |                                           12-20 | acquirer sponsor                      |
| First paying customer pilot onboarding (design partner LOI → contract) |                               80-120h FTE |                                             6-8 | sales motion                          |
| H6 NextAuth v4 → v5 migration (Auth.js)                                |                                40-80h FTE |                                             4-6 | NextAuth v5 stable release Q3-Q4 2026 |
| C7 Subscription/billing layer (Stripe) — MVP                           |                               80-160h FTE |                                             6-8 | acquirer payment vendor decision      |
| Customer support tooling integration (Intercom / Zendesk / etc.)       |                                40-80h FTE |                                             4-6 | acquirer support vendor decision      |
| IaC complete (Terraform + Ansible end-to-end idempotent)               |                               80-120h FTE |                                               6 | acquirer SRE team                     |
| Sentry + APM + Grafana dashboards production                           |                  30-60h FTE + €3-12k/anno |                                               4 | acquirer monitoring vendor            |
| ESCO v1.3 migration (current 1.2 → 1.3 latest)                         |                                30-50h FTE |                                               2 | nessuna                               |
| **TOTAL M+3 → M+6 cumulative**                                         | **~880-1670h FTE + ~€3-12k/anno tooling** | **12-20 sprint addizionali (22-30 cumulative)** | —                                     |

**Output M+6**: 1 paying customer (design partner) live · workflow engine MVP · Stripe billing operational · IaC complete · APM dashboards · NextAuth v5 migration complete.

### M+12 — v1.0 commercial-ready milestone

**Obiettivo**: ≥3 paying customer · SLA ≥99.5% sostenibile · SOC 2 Type 1 ACR firmato · scaling motion attivo.

| Epic                                                                 |                                                             Effort |                                    Sprint count | Dependencies                  |
| -------------------------------------------------------------------- | -----------------------------------------------------------------: | ----------------------------------------------: | ----------------------------- |
| Customer #2 + #3 onboarding                                          |                                                       120-240h FTE |                                            8-12 | first paying customer success |
| 2nd HRIS connector (alternative se segmento richiede)                |                                                       200-400h FTE |                                            8-12 | sales motion                  |
| SOC 2 Type 1 audit external — ACR firmato                            |                            €30-50k audit + 80-150h preparation FTE |                                            6-12 | M+3 readiness baseline        |
| ESG/sustainability reporting plug-in (CSRD ESRS S1 export)           |                                                        60-120h FTE |                                             4-6 | mercato pull                  |
| Pay Transparency Directive 2027 toolkit (skill-based pay assessment) |                                                         40-80h FTE |                                               4 | regulatory deadline           |
| Scale infra (auto-scaling, multi-region active-active)               |                                        120-200h FTE + €30-60k/anno |                                               8 | M+6 IaC complete              |
| Marketplace API + webhooks + plugins (Tier 3)                        |                                                       150-300h FTE |                                            8-12 | partnership strategy          |
| Brand v1.0 promotion completo (8 categorie pre-flight)               |                                                         16-25h FTE |                                               2 | brand workstream complete     |
| **TOTAL M+6 → M+12 cumulative**                                      | **~786-1615h FTE + ~€60-110k esterno + ~€30-60k/anno scale infra** | **40-66 sprint addizionali (62-96 cumulative)** | —                             |

**Output M+12 (v1.0)**: ≥3 paying customer · ARR ≥€100-300k · SLA ≥99.5% · SOC 2 Type 1 ACR firmato · CSRD/Pay Transparency tooling · scaling motion attivo · marketplace foundation.

### M+18 — Scale-ready

**Obiettivo**: SOC 2 Type 2 + ISO 27001 + paying customer ≥10 + ARR ≥€500k.

| Epic                                                 | Effort                                  | Hours range |
| ---------------------------------------------------- | --------------------------------------- | ----------: |
| SOC 2 Type 2 audit (12-month observation period)     | €50-80k audit + 100-200h FTE            |    100-200h |
| ISO 27001 certification (ISMS + risk register + DPO) | €40-60k consultant + 200-400h FTE       |    200-400h |
| 7+ paying customer onboarding (cumulative ≥10)       | 280-560h FTE                            |    280-560h |
| 3rd-4th HRIS connector                               | 400-800h FTE                            |    400-800h |
| Customer success + retention organization            | 200-300h FTE                            |    200-300h |
| **TOTAL M+12 → M+18 cumulative**                     | **~1180-2260h FTE + ~€90-140k esterno** |           — |

**Output M+18 (scale-ready)**: SOC 2 Type 2 + ISO 27001 certified · ≥10 paying customer · ARR ≥€500k · multi-region active-active · 3+ HRIS connectors · customer success org operational.

---

## 3. Effort cumulativo summary

| Phase                                   | Effort cumulative | Calendar |  External cost cumulative |
| --------------------------------------- | ----------------: | -------: | ------------------------: |
| M+1 (foundation cleanup)                |      150-220h FTE |   1 mese |                    €8-15k |
| M+3 (compliance baseline)               |      520-800h FTE |   3 mesi |   €59-115k + €15-30k/anno |
| M+6 (production-ready + first customer) |    1400-2470h FTE |   6 mesi |   €62-127k + €18-42k/anno |
| M+12 (v1.0 commercial-ready)            |    2186-4085h FTE |  12 mesi | €122-237k + €48-102k/anno |
| M+18 (scale-ready)                      |    3366-6345h FTE |  18 mesi | €212-377k + €48-102k/anno |

**v1.0 commercial-ready (M+12)**: **2186-4085h FTE** = **~€175-490k loaded EU** + **€122-237k external** + **€48-102k/anno operational** + **€48-102k/anno scaling infra** = **TOTAL CAPEX €344-829k + OPEX €96-204k/anno post-M+6**.

**Order of magnitude per "v1.0 commercial-ready"**: **€350-800k CAPEX + €100-200k/anno OPEX** distribuiti su 12 mesi calendar con team 2-3 senior engineer + 1 ops/SRE + 1 design/PM.

---

## 4. Team structure raccomandata

| Role                                 |             FTE | Contesto                                        |
| ------------------------------------ | --------------: | ----------------------------------------------- |
| Founder / Tech Lead                  |             1.0 | post-acquisition, retention package vincolante  |
| Senior Fullstack (TS/Next.js/Prisma) |         1.0-2.0 | shadow founder day-1 → day-90, then independent |
| Senior SRE / DevOps                  |             1.0 | infra, IaC, monitoring, on-call                 |
| QA / Test Automation                 |         0.5-1.0 | test coverage, integration test, E2E breadth    |
| Design / Frontend (a11y)             |         0.5-1.0 | brand v1.0 promotion, design system maintenance |
| Product Manager                      |             0.5 | customer interviews, roadmap, sales liaison     |
| Customer Success                     |         0.5-1.0 | M+6+ onboarding, retention                      |
| **Total team**                       | **5.0-7.5 FTE** |                                                 |

**Loaded cost EU senior team** (€100-150k/anno per FTE):

- M+0 → M+6 (5.5 FTE avg): €550-825k/anno × 0.5 anno = €275-412k
- M+6 → M+12 (6.5 FTE avg): €650-975k/anno × 0.5 anno = €325-487k
- **TOTAL team cost M+0 → M+12**: **€600-900k loaded**

Confronto con effort estimate sopra (€350-800k CAPEX): suggerisce che la stima h FTE è **prudente** (i.e. team grande è più costoso del puro effort; differenza include onboarding, meeting, planning, holiday, sick days). Range realistic: **€700k-1.1M total team cost a v1.0**.

---

## 5. Critical path & dependencies

```
M+1 [view audit] → [Phase 2 apply] → [DR off-site]
                                  → [doc audit indep] → [escrow remediation]
                ↓
M+3 [WCAG manual] → [VPAT firmato]
    [HA Postgres] → [load balancer]
    [pen-test] → [closing condition PASS]
    [first connector spec] → [M+6 connector MVP]
                ↓
M+6 [first connector MVP] → [first paying customer pilot]
    [workflow engine MVP] → [process automation differentiation]
    [Stripe billing] → [revenue recognition]
    [IaC complete] → [scale-ready M+12]
                ↓
M+12 [SOC 2 Type 1 ACR] → [enterprise sales unlock]
     [3 paying customer] → [ARR ≥€100-300k]
     [scale infra] → [SLA ≥99.5%]
                ↓
M+18 [SOC 2 Type 2] → [enterprise scale unlock]
     [ISO 27001] → [public sector EU procurement unlock]
     [≥10 paying customer] → [ARR ≥€500k]
```

**Hard dependencies**:

- View audit (M+1 first 2 weeks) → blocking Phase 2 + integration test M+3
- HA Postgres (M+3) → blocking SLA ≥99.5% M+12
- First connector spec (M+3) → blocking first paying customer M+6
- SOC 2 Type 1 (M+12) → blocking enterprise sales motion
- Founder retention (closing day) → blocking ENTIRE roadmap (bus factor)

---

## 6. Acquirer-specific roadmap calibration

### Acquirer profile A: EU tier-2 HCM scale-up (Personio / HiBob / **Zucchetti** / **TeamSystem**)

- ✅ Existing SRE team → M+3 HA infra effort -50% (acquirer-side)
- ✅ Existing customer success → M+6 customer onboarding effort -30%
- ✅ Existing brand → brand workstream M+12 può essere paused/integrated
- ✅ Existing connector library → first HRIS connector M+6 può essere fast-tracked
- ❌ Skill ontology esistente → potential conflict con ESCO approach (negotiation point)
- **Total effort reduction**: -25-35% vs baseline → **€500-700k total team cost** vs €700k-1.1M baseline
- **Time to v1.0**: 9-12 mesi vs 12-15 baseline

### Acquirer profile B: EU sustainability/ESG platform (Workiva / Sweep / Greenly)

- ❌ NO HR competence in-house → integration cost più alto, hire HR domain expert necessario
- ✅ Existing compliance team → SOC 2 / ISO 27001 effort -30%
- ✅ Existing customer relationships → first paying customer faster (cross-sell to existing CSRD clients)
- ✅ Existing API platform → marketplace + webhooks Tier 3 può essere integrated faster
- **Total effort estimate**: baseline +5-10% (+integration cost) - 10% (compliance reuse) = **€700k-1.1M total** simile baseline
- **Time to v1.0**: 12-15 mesi (similar)

### Acquirer profile C: Italian consultancy (Capgemini / Reply / Engineering / **Almaviva**)

- ✅ Italian market access → first paying customer accelerato (cross-sell consulting clients)
- ✅ Public sector access → CSRD/Pay Transparency timing perfetto
- ❌ Slower internal velocity (corporate process overhead) → effort +20-30%
- ❌ NO product engineering practice tipicamente → workflow engine M+6 effort +50% (need external)
- **Total effort estimate**: baseline +30-50% = **€900k-1.5M total**
- **Time to v1.0**: 15-20 mesi

### Acquirer profile D: PE roll-up add-on

- ❌ NO operational integration → standalone team needs to scale
- ❌ NO existing infra/customer → tutti gli effort baseline
- ✅ Capital availability → can hire fast
- **Total effort estimate**: baseline = **€700k-1.1M total**
- **Time to v1.0**: 12-15 mesi

---

## 7. Risk register roadmap

| ID   | Rischio                                                                           | Probabilità | Impatto | Mitigazione                                                                            |
| ---- | --------------------------------------------------------------------------------- | ----------- | ------- | -------------------------------------------------------------------------------------- |
| RR1  | Founder velocity collapse post-acquisition (-70-83%)                              | Alta        | Alto    | Retention package vincolante 36 mesi + immediate L2 SRE + senior fullstack hire        |
| RR2  | First HRIS connector misallineato con segmento target                             | Media       | Alto    | Buyer outreach pre-LOI per validate segmento (Zucchetti vs TeamSystem vs altri)        |
| RR3  | First paying customer pipeline vuota a M+6                                        | Alta        | Critico | Design partner LOI firmato pre-closing condition                                       |
| RR4  | SOC 2 Type 1 audit fails (gap >50%)                                               | Media       | Alto    | M+3 readiness review esterna pre-formal audit                                          |
| RR5  | Workflow engine MVP M+6 underestimated (300-600h potrebbe essere 600-1200h reale) | Media       | Medio   | Sponsor acquirer-side senior engineer obbligatorio                                     |
| RR6  | NextAuth v5 stable release ritarda Q4 2026                                        | Bassa       | Basso   | Continue v4 maintenance; non-blocking                                                  |
| RR7  | ESCO v1.3 migration breaking changes                                              | Bassa       | Medio   | Test upgrade in staging M+6                                                            |
| RR8  | Pen-test cross-tenant fallisce → re-architecting RLS                              | Media       | Critico | M+3 RLS bypass test suite seller-side PRIMA del pen-test esterno                       |
| RR9  | Marketplace + webhooks Tier 3 (M+12) richiede 600h reale (vs 300 stima)           | Alta        | Medio   | Roadmap flexible, marketplace è "nice to have" v1.0 non essential                      |
| RR10 | Acquirer integration culture clash → founder leaves M+6-12                        | Alta        | Critico | Equity vesting accelerator clause; explicit "founder mode" team protection contractual |

---

## 8. Bottom line per acquirer

| Decisione                                  | Output atteso M+12                                      | Investment totale (h FTE × loaded + esterno + infra) |
| ------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| **GO con acquirer mature (HCM EU tier-2)** | v1.0 commercial-ready, 3 paying customer, ARR €100-300k | **€500-700k total** in 9-12 mesi                     |
| **GO con acquirer immature (ESG/PE)**      | v1.0 commercial-ready, 3 paying customer, ARR €100-300k | **€700k-1.1M total** in 12-15 mesi                   |
| **GO con consultancy italiana (PA focus)** | v1.0 ma orientato public sector                         | **€900k-1.5M total** in 15-20 mesi                   |
| **NO GO**                                  | sunset evo, founder consulting model alternativo        | sunk cost €141k mid-point cost-to-date               |

**Roadmap raccomandata**: GO con acquirer profile A (EU tier-2 HCM scale-up con SRE team mature). Sweet spot effort-to-value. Time-to-v1.0 più breve. Founder retention più stable (acquirer culture compatible con product engineering).
