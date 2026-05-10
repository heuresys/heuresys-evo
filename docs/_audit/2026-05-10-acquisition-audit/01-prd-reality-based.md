# PRD Reality-Based — heuresys-evo as it stands today

> **Mandato**: ACQ-AUDIT-2026-05 · **Data**: 2026-05-10 · **Fase**: E (Sessione 2)
> **Scope**: cosa la piattaforma FA OGGI, evidence-based. NON cosa promette, NON cosa è in roadmap.
> **Source**: 11 audit deliverable D1-D9 (`02-` through `11-`) + git log + filesystem grep.
> **Lingua**: italiano · **Audience**: acquirente che deve sapere cosa sta comprando OGGI

---

## 1. Mission claim vs reality (one-line per claim)

| Claim (da CLAUDE.md / vision)         | Status                               | Evidence                                                                                                                                                                                                                                        |
| ------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| "Piattaforma SaaS B2B"                | ⚠️ INFRA-READY, NO BUSINESS LAYER    | Multi-tenant infra esiste; 0 paying customer, 0 subscription/billing, 0 customer support                                                                                                                                                        |
| "Organizational Intelligence"         | ⚠️ DASHBOARD ONLY                    | 7 dashboard view brand-fedeli role-driven via `role_default_dashboards` Phase 15.A. NO "intelligence" engine (no ML model, no predictive analytics, no recommendation system production). 1 OpenAI advisor V1 (`/ontology` con cost cap $5/day) |
| "Workforce Orchestration"             | ❌ NAME ONLY                         | Workflow engine assente. Nessun BPMN runtime. Nessun task automation. Marketplace plugin Tier 3 non iniziato                                                                                                                                    |
| "Layer ontologico tra ERP/HR/BI"      | ❌ ASPIRATIONAL                      | 0 connettori HRIS shipped. `/explorer/sap` è status-page placeholder. ERP/BI integration: roadmap, non product                                                                                                                                  |
| "Knowledge Graph ESCO bilingue IT/EN" | ✅ SHIPPED                           | 14.011 skills + 3.040 occupations + 126.051 occupation-skill links. Bilingue verified. 1536-dim embeddings via OpenAI                                                                                                                           |
| "Multi-tenant via RLS"                | ✅ SHIPPED (con caveat test)         | 312 tabelle `tenant_id NOT NULL` · 367 RLS policies attive · FORCE RLS · role no-BYPASSRLS. **CAVEAT**: 0 test cross-tenant bypass attack                                                                                                       |
| "RBP fine-grained data-driven"        | ⚠️ API-LAYER ONLY                    | `requirePermission(area, action)` middleware su 40+ endpoint Express. **GAP**: 0 matches `requirePermission                                                                                                                                     | usePermission`su`services/app/src` (Next.js App Router pages bypassano api-gateway via Prisma direct, protezione RLS-only) |
| "Audit logged ogni write"             | ⚠️ HELPER MIRRORED, ADOPTION PARTIAL | `auditedTransaction()` helper esiste in `services/app` + `services/api-gateway`. Adoption sweep S24 incompleta. Pre-S23 solo 6 audit_logs/30d con 4/5 user_id NULL                                                                              |

**Match score reality vs claim**: ~25-35% (D8 verdict riconfermato).

---

## 2. Cosa funziona OGGI — feature inventory production-grade

### 2.1 Authentication & Session

- ✅ NextAuth v4 Credentials provider con bcryptjs (12 rounds default)
- ✅ 8 canonical user (1 SUPERUSER `sysadmin` + 7 RTL Bank ruoli) testabili end-to-end (login canonical 8/8 PASS)
- ✅ Cross-service JWT decode (jose + HKDF NextAuth v4) shipped commit `9f7a283` — 11/11 test green
- ✅ CSRF HMAC-bound (non legacy double-submit)
- ⚠️ Auth dual-system NextAuth v4 (services/app) + @auth/express (services/api-gateway) — shared `AUTH_SECRET`, single bypass surface
- ❌ TOTP 2FA (deferred indefinitely)
- ❌ SSO/SAML (non in roadmap visible)
- ❌ Password reset email flow (mai implementato — auth-flow incompleto)

### 2.2 Multi-tenant data layer

- ✅ 4 tenant attivi seed: Heuresys System (platform), RTL Bank (test), SmartFood (test), EcoNova (test) — **TUTTI sintetici**
- ✅ 270 employees + 265 users + 1 platform user — **TUTTI seed**
- ✅ 8 ruoli RBP: SUPERUSER (-1), TENANT_OWNER (0), IT_ADMIN (1), HR_DIRECTOR (2), HR_MANAGER (3), DEPT_HEAD (4), LINE_MANAGER (5), EMPLOYEE (6)
- ✅ 33 functional areas (`rbp_functional_areas`) + 47 PET mapping (Process/Enterprise/Talent)
- ✅ 179 RBP role-area-permission joins canonical post-L54
- ✅ Tenant `domain` SoT esplicito (econova.org · heuresys.com · rtl-bank.org · smartfood.org)
- ✅ Email canonical `lower(strip-space-apostrophe(first.last))@<tenant.domain>`
- ❌ Tenant onboarding flow self-service (mai implementato)
- ❌ Tenant offboarding/data deletion automation (mai implementato)
- ❌ Tenant billing/subscription tracking (mai implementato)

### 2.3 Frontend pages production-deployable

- ✅ 5 pagine base: `/` (homepage), `/login`, `/dashboard`, `/showcase`, `/brand-studio`
- ✅ 17+ viste in `(app)/` route group con AppShell role-based
- ✅ 7 dashboard view brand-fedeli role-driven via `role_default_dashboards` Phase 15.A: org_systems_v2, hr_director_overview_v2, hr_manager_overview_v2, dept_head_overview_v2, line_manager_overview_v2, employee_overview_v2, tenant_owner_overview_v2
- ✅ Login = `login-aurora` mockup promosso production via Studio workflow
- ✅ AppShell topbar con LocaleSwitcher globale IT/EN + ThemeToggle + UserMenu
- ⚠️ 4 process\_\* secondary nav HR_DIRECTOR/HR_MANAGER mancano suffix `_v2` + elements seed (deferred ~2-3h, non-blocking)
- ⚠️ Boundary RSC (`loading.tsx`, `error.tsx`, `<Suspense>`) **completamente assenti** nelle 24 pagine `(app)/`
- ❌ `next/image` zero adoption (raw `<img>` su tutto services/app)

### 2.4 API endpoints

**Express (services/api-gateway, port 8200)**:

- ✅ 30 endpoint Pack 1-8 mounted
- ✅ Health checks
- ✅ Pack 1 helper: `escapeILIKE`, `safeParseInt`, `isUUID`, `buildMeta`, `validatePassword`, `generateSecurePassword`
- ✅ `requirePermission` lazy middleware
- ⚠️ Bypass effettivo: i Next.js App Router pages bypassano api-gateway via Prisma direct (RLS-only protection)

**Next.js Route Handlers (services/app)**:

- ✅ `/api/dashboard/data/[elementId]`
- ✅ `/api/dashboard/[code]/elements` (PUT)
- ✅ `/api/ontology/advisor` (OpenAI integration con cost cap $5/day, model `gpt-4o-mini`)
- ✅ `/api/explorer/{esco/tree, sap/status, kg/expand}`

**Mancanti per "platform completa"**:

- ❌ Marketplace API + webhooks + plugins (Tier 3 non iniziato)
- ❌ HRIS connector API (SAP SuccessFactors, Workday, Oracle HCM)
- ❌ ERP connector API
- ❌ BI/reporting export API (CSV/Excel/PDF generation)

### 2.5 Knowledge Graph ESCO

- ✅ ESCO v1.2.0 import: 14.011 skills · 3.040 occupations · 126.051 occupation-skill links
- ✅ Bilingue IT/EN
- ✅ 1536-dim embeddings tramite OpenAI (storage + retrieval)
- ✅ Endpoint `/api/explorer/esco/tree` + `/api/explorer/kg/expand`
- ⚠️ Vector search (pgvector) marker TODO in `services/api-gateway/src/routes/esco.ts:32` — feature future, non shipped
- ⚠️ Update cycle ESCO v1.3 (rilasciato 2025) NON migrato (heuresys ferma a v1.2)

### 2.6 AI / Advisor

- ✅ 1 OpenAI advisor V1 in `/api/ontology/advisor`: model `gpt-4o-mini`, cost cap $5/day in-memory, timeout 30s
- ⚠️ RBP gate `requirePermission('ESCO_KG', 'read')` esplicitamente **deferred** in ADR-0022 §Consequences
- ⚠️ Streaming response **deferred**
- ⚠️ Seconda surface promessa (`/explorer/kg` advisor) = roadmap, non shipped
- ❌ NO production ML model (no skill matching, no candidate ranking, no learning recommendations)

### 2.7 Background workers

- ✅ Scaffold `services/enrichment` con BullMQ + Redis (porta 6380)
- ✅ 7 file TypeScript implementation
- ❌ NON wired in topology runtime (D1 finding F1.x): worker esiste come scaffold ma non è chiamato da nessun production flow
- ❌ NO job production attualmente in coda Redis (verificato in D1)

### 2.8 UI library packages/ui

- ✅ ~180 component (Radix + CVA + Tailwind 4 tokens)
- ✅ Storybook 9 con 84-95 stories (~50% coverage)
- ✅ Cantiere B v2 design system completo
- ✅ Brand identity v0 promoted (palette OKLCH + Brand Book + motion language)
- ✅ Skip-link, live-region, accessibility-panel, focus-visible globale
- ✅ jest-axe baked in
- ⚠️ Touch target Button `sm: h-8` (32px) e `md: h-9` (36px) sotto AAA 2.5.5 Enhanced 44×44
- ⚠️ Storybook coverage 84-95/180 component (≈50%)
- ⚠️ Visual regression baseline NON implementata
- ⚠️ Bundle budget NON enforced

### 2.9 Database & migrations

- ✅ PostgreSQL 16.13 bare-metal su `oracle-vm-default:5432`
- ✅ 568 modelli Prisma + 8 enum
- ✅ 312 tabelle `tenant_id NOT NULL` + 367 RLS policies + FORCE RLS
- ✅ 5 mat views auto-refresh systemd timer ogni 4h UTC
- ✅ 0 FK NO ACTION default (646 CASCADE + 215 SET NULL + 81 RESTRICT post-S24)
- ✅ Vertical-split satellite tables Phase 1 additive: employees_pii, employees_hr, employees_payroll popolate 270/270 + sync trigger + view employees_full
- ⚠️ Phase 2 vertical-split DROP COLUMN deferred S27+ (65 view + 4 mat view dipendenti undocumented scoperte)
- ⚠️ Macro-modello employees 95 col / scope misto (PII+HR+payroll+auth legacy)
- ⚠️ ESCO v1.2 (NON v1.3 latest)
- ⚠️ Prisma client duplicato cross-service (services/app + services/api-gateway hanno proprio client generato)
- ✅ 40 file SQL seed (incluso `phase16o_employees_to_view.DRAFT-DEFERRED.sql` per Phase 2 future)
- ✅ Backup baseline + pre-phase16m + pre-phase16o (380MB) sha256-verified
- ❌ Off-site backup chain (bucket OCI cross-region) **NON provisionato** (documentato in deploy-evo.md)

### 2.10 Test coverage

- ✅ 865 test verdi (224 app + 462 api-gateway + 7 enrichment + 95 ui + 82 shared)
- ✅ E2E Playwright RBP matrix 100/100 verde (8 ruoli × 9 dashboard)
- ✅ login canonical 8/8 PASS bcrypt match end-to-end
- ✅ jest-axe a11y CI baked
- ✅ 1.2% skip rate (5 conditional `!HAS_FULL_STACK`, justified)
- ⚠️ Integration test contro DB reale: ZERO (testcontainers ADR-0002 status `Proposed` da 13 giorni)
- ⚠️ Coverage threshold ADR-0011 NON enforced in CI (target dichiarati 70-90% ma `quality.yml` non passa `--coverage`)
- ⚠️ RLS bypass / cross-tenant attack test: ZERO
- ❌ Mutation testing assente
- ❌ Property-based testing assente
- ❌ Load testing nightly assente

### 2.11 DevOps & Infra

- ✅ Bare-metal Ubuntu 24.04 ARM64 su Oracle VM (oracle-vm-default 80.225.82.207)
- ✅ nginx vhosts + certbot SSL
- ✅ 4 GitHub workflows (quality.yml, security.yml, storybook.yml, a11y.yml)
- ✅ husky pre-commit (lint-staged + gitleaks-lite) + commitlint
- ✅ Backup process documented (incident-runbook severity matrix + postmortem template)
- ⚠️ **Runtime ATTUALE = Docker Compose (porte 3012/8012/8020)**, NON systemd bare-metal (3200/8200) come la doc dichiara — drift severo
- ❌ Single Point of Failure: 1 VM Oracle Free Tier ARM64 host TUTTO lo stack (FE + API + enrichment + Postgres + Redis + nginx)
- ❌ Zero HA, zero standby, zero multi-region
- ❌ Off-site DR backup NOT PROVISIONED
- ❌ Sentry/APM monitoring deferred (cost optimization)
- ❌ IaC dichiarato (Terraform/Ansible)
- ❌ CD pipeline reale (deploy automation)

### 2.12 Brand identity & design

- ✅ Brand Book completo (15 sezioni)
- ✅ Palette OKLCH + tokens JSON
- ✅ Motion language documentato
- ✅ Logo originale + logo relativo (L27/L28 governance)
- ✅ 12 phase brand cycle ✅ chiuse (BRAND-STATE.md verified)
- ✅ Cantiere B v2 design system
- ✅ Asset showcase webapp localhost (346 assets · 138 promoted · 81 body distribuiti su 11 dashboardCode `*_v2`)
- ⚠️ v1.0 promotion checklist (8 categorie pre-flight) **NON eseguita** (~16-25h FTE pending)

### 2.13 Documentation governance

- ✅ 26 ADR (17 Accepted · 1 Proposed · 1 Superseded)
- ✅ DECISIONS-LOG L1→L60 append-only
- ✅ Sprint history Phase 13→S26
- ✅ Operating baseline 362 linee (P1-P10 + R1-R20 + CARD-1-4)
- ✅ 2 audit forensic doc (`2026-05-09-forensic-db-audit.md` + `2026-05-10-fk-ondelete-review.md`)
- ✅ Diátaxis numbered docs (`_meta`, `10-strategy`, `20-architecture`, `30-developer`, `40-operations`, `50-reference`, `70-planning`, `90-archive`)
- ⚠️ ADR fantasma: services/marketing, services/playground, packages/types mai esistiti (D1 finding H1)
- ⚠️ Wikilinks legacy Obsidian-style unrisolti in 4 file imported (deferred S11)
- ⚠️ License strategy pending (ADR-0019 open question)

---

## 3. Cosa NON funziona OGGI (gap material)

### Critici per "ready to sell"

1. **0 paying customer** — tutti i tenant sono seed sintetici
2. **0 connettori HRIS production** — claim "Layer ontologico ERP/HR/BI" non sustained
3. **0 workflow engine** — claim "Workforce Orchestration" è name only
4. **0 billing/subscription** — no monetization layer
5. **0 customer support tooling** — no help desk integration

### Critici per "ready for production at scale"

1. **SPOF infra** — 1 VM, no HA, no multi-region
2. **No off-site DR** — backup co-located su stessa VM
3. **No observability production** — Sentry deferred, APM assente
4. **No IaC** — manual setup runbook only
5. **Doc-runtime drift severo** — Docker Compose actual vs systemd documented

### Critici per "ready for compliance audit"

1. **0 RLS bypass test** — claim multi-tenant security senza runtime evidence
2. **WCAG AAA claim axe-only** — manual NVDA/VoiceOver mai eseguito, EAA 2025-06-28 mandatory già passata
3. **SOC 2 / ISO 27001 readiness assente** — no ISMS, no risk register, no DPO
4. **GDPR DPA + DPIA + Art. 30 records parziali**
5. **License strategy pending** + repo PUBLIC su GitHub senza LICENSE = legal grey

---

## 4. Cosa l'acquirente sta REALMENTE comprando

| Asset                                                                 | Replacement cost stimato                                 | Note                                                                                                           |
| --------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Code base + ESCO mapping bilingue + KG architecture**               | €60-180k (600-1200h FTE @ €100-150/h loaded)             | Replicabile in 12-18 mesi FTE da team competente, ma 18-30 mesi se include ESCO domain expert hiring + ramp-up |
| **Brand identity v0 + design system Cantiere B v2 + ~180 component**  | €80-150k (incluso agency cost evitato)                   | Asset chiavi-in-mano, separately monetizable                                                                   |
| **Documentation governance (26 ADR + 60 decisioni + audit forensic)** | €20-40k (savings reverse-engineering acquirer)           | Vale come asset autonomo per onboarding tech team                                                              |
| **Knowledge transfer + domain expertise founder**                     | €80-150k (recruitment + ramp-up senior ESCO+HR)          | Subject to founder retention package                                                                           |
| **Time-to-market opportunity cost evitato**                           | €600k-1.8M (12-18 mesi @ €50-100k/mese acquirer revenue) | Largo range, dipende da acquirer revenue baseline                                                              |
| **TOTAL asset value baseline**                                        | **€240-520k (excluding opportunity cost)**               | **€840k-2.32M including opportunity cost**                                                                     |

L'acquirente NON sta comprando:

- ❌ Paying customer / ARR
- ❌ Brand awareness / market recognition
- ❌ Proven product-market fit
- ❌ Sales pipeline
- ❌ Customer success organization
- ❌ Compliance certification (SOC 2, ISO 27001)
- ❌ Production-grade infrastructure ready for SLA commerciali

---

## 5. Use cases dimostrabili a buyer prospect

Cosa puoi mostrare in demo OGGI (live, end-to-end):

1. **Login + role-based dashboard** (8 ruoli, 7 view brand-fedeli, RBP matrix)
2. **Employee management** (CRUD limitato, alcuni form edit)
3. **ESCO knowledge graph navigation** (`/explorer/esco/tree`, `/explorer/kg/expand`)
4. **OpenAI advisor on ESCO context** (`/ontology` con cost cap demo)
5. **Multi-tenant separation** (login as tenant A, vede solo dati tenant A — RLS enforcement visibile)
6. **Audit logging** (mostrare `audit_logs` table + recent writes)
7. **Brand identity / design system showcase** (`/showcase`, `/brand-studio`)
8. **Localization IT/EN switch** (LocaleSwitcher globale)

NON dimostrabile (gap):

- ❌ HRIS sync con SAP/Workday (status page only)
- ❌ Tenant onboarding self-service
- ❌ Billing/subscription
- ❌ Workflow automation
- ❌ Predictive analytics / ML recommendations
- ❌ Production observability dashboards

---

## 6. Acquirer disclosure recommendations (R&W support)

Il seller dovrebbe disclosure proactive in CIM:

1. **0 paying customer** — i 4 tenant sono test data
2. **Mission claim "Layer ontologico ERP/HR/BI"** — aspirazionale, 0 connettori shipped
3. **Multi-tenant security** — implementato a DB-level (RLS), test runtime cross-tenant attack pending
4. **WCAG AAA claim** — basato su axe-core automated only, manual pass pending
5. **License strategy pending** — ADR-0019 open
6. **Runtime actual** — Docker Compose (NON systemd come doc dichiara)
7. **Phase 2 vertical-split deferred** — 65 view dipendenti undocumented (DECISIONS-LOG L60)
8. **Founder bus factor** — 314/335 commit (94%), velocity AI-assisted

Disclosure proactive riduce R&W liability + establishes trust + accelera due diligence acquirente.
