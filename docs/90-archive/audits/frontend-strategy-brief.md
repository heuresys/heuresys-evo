# Frontend Strategy Brief — Legacy `.com.evo` → Evo `heuresys-evo`

**Date**: 2026-05-01
**Phase**: 4 — STOP AUTONOMO 1-BIS (frontend strategy decision before BLOCK 11 endpoint port)
**Status**: 3 options presented, recommendation provided. Awaiting Enzo's call.
**Author**: CLI autonomous-max session, post-BLOCK-9 parity audit

---

## Executive summary

Legacy `.com.evo` ha un frontend Next.js maturo: **231 pagine, 11 dashboard, 27 widget,
186 nav items, 135 backend routes**. Evo è essenzialmente vuoto sul frontend: solo
landing/login/dashboard scaffold, **0 dashboard tracciate, 1 widget di prova in S4,
0 nav items**, 3 backend routes (auth/health/employees).

Con scope-cut P0-only già applicato in BLOCK 9 (parity audit Phase 4), serve scegliere
**come porting frontend** prima del task 4.10 (endpoint port) — perché lo scope endpoint
backend dipende dalla strategia UI scelta.

3 opzioni in esame: **P (Preserve)** porting 1:1, **R (Rewrite)** nuovo design,
**H (Hybrid)** P0 preserve + resto rewrite progressive. **Raccomandazione: H** —
allinea frontend con scope backend già definito (P0-only), bilancia speed/risk/quality.

---

## 1. Inventario completo legacy (ground truth 2026-05-01)

### 1.1 Pagine frontend (Next.js App Router)

| Dominio              | Pagine `page.tsx` | Note                                                                                                          |
| -------------------- | ----------------: | ------------------------------------------------------------------------------------------------------------- |
| `app/admin/**`       |               148 | Tech admin, blueprint, audit, RBP mgmt, integrations                                                          |
| `app/company-pet/**` |                37 | PET perspective: governance (recruiting, compensation, performance, learning), org-chart, ontology, processes |
| `app/portal/**`      |                16 | Employee self-service portal                                                                                  |
| `app/platform/**`    |                14 | Platform Console (tenants, users, system-health, blueprint)                                                   |
| `app/dashboards/**`  |                 3 | Dashboard hub + dashboard pages                                                                               |
| `app/(misc)`         |                13 | login, onboarding, panoramica, landing, design-editor, blueprint-standalone, 403, root, locale                |
| **Totale**           |           **231** | matches `find services/frontend/src/app -name page.tsx \| wc -l`                                              |

CLAUDE.md aveva "99 pagine" — quel valore è **stale** (pre-refactor 2026-04-15 e
pre-AI Insights additions). Conta autoritativa odierna: **231**.

### 1.2 Dashboards (11 codici DBMS-driven)

```
platform_console        Platform Console (tenant mgmt, system health, billing)
tech_admin              Tech Administration (config, SSO, integrations, logs, marketplace)
hr_strategic            HR Strategic (succession, calibration, compensation modeling)
hr_operations           HR Operations (day-to-day HR ops)
manager_hub             Manager Hub (line manager dashboard)
department_console      Department Console (dept head)
employee_portal         Employee Portal (self-service)
executive_overview      Executive Overview (C-level)
workforce_intelligence  Workforce Intelligence (analytics-heavy)
dashboards_hub          Dashboards Hub (entry/landing)
company_pet             Company PET perspective
```

### 1.3 Widget catalog (27 codici)

| Widget Type | Count | Codes                                                                                                                                              |
| ----------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| KPI_CARD    |     9 | active_users_kpi, headcount_kpi, open_positions_kpi, turnover_kpi, ai_insights, engagement_score, time_tracking, leave_balance, performance_scores |
| CHART       |     7 | skill_gaps_chart, compensation_bands, learning_progress, api_usage, system_health, compliance_status, process_health                               |
| CUSTOM      |     4 | ai_assistant, career_path, my_card, org_chart_mini                                                                                                 |
| LIST        |     4 | my_documents, my_tasks, pending_approvals, team_absences                                                                                           |
| CALENDAR    |     1 | calendar_view                                                                                                                                      |
| FEED        |     1 | notifications_feed                                                                                                                                 |
| SHORTCUT    |     1 | quick_links                                                                                                                                        |

**Frontend impl**: solo 11 file `.tsx` in `services/frontend/src/components/widgets/types/`
— gli altri 16 widget fanno fallback a `generic-placeholder.tsx` (osservato nel filesystem).
Quindi solo **11/27 widget hanno UI custom**, gli altri sono codegen-mapped a placeholder
generico. **Implication**: porting frontend widget = 11 implementations + 16 placeholder.

### 1.4 Nav items (186 totali)

CLAUDE.md baseline: **186 nav items** post migration 209 (hide non-active filter).
Distribuiti su ~10 migration files (`152_rbp_dashboard_nav_items_seed.sql` con 36
INSERT diretti + 9 altre migration con UPDATE/INSERT progressive). Source-of-truth
DBMS: tabella `rbp_dashboard_nav_items` con scope (PLATFORM | TENANT | DEPARTMENT | SELF).

### 1.5 Backend routes (135)

`services/api-gateway/src/routes/*.ts` (escluso test). Sample top-domain:
auth, auth-2fa, employees, leaves, performance reviews (360-reviews, calibration-sessions),
payroll (bonus-plans, benefits, compensation), analytics (analytics-ai, analytics-workforce,
benchmarking), AI (ai-chat, ai-providers, analysis-sessions), HR ops (attendance, candidates),
admin (audit-logs, admin-components, blueprint).

### 1.6 Evo current state (gap baseline)

| Aspect          |     Legacy |                                             Evo |
| --------------- | ---------: | ----------------------------------------------: |
| Pages           |        231 |           ~5 (landing/login/dashboard scaffold) |
| Dashboard codes |         11 | 0 (1 mentioned in S4 HANDOFF, not in DB schema) |
| Widget codes    |         27 |                               0 (1 dummy in S4) |
| Nav items       |        186 |                                               0 |
| Backend routes  |        135 |                     3 (auth, health, employees) |
| RBP framework   |       full |                                               0 |
| RLS policies    | 303 tables |                                               0 |

**Gap totale: ~99% UI, 98% backend.**

---

## 2. Le 3 opzioni — P / R / H

### Option P (Preserve) — porting 1:1

> Porta tutto il frontend legacy a evo as-is, adattando solo per Next 16 + React 19 +
> Tailwind 3 (post Cantiere B downgrade) + NextAuth v4. Zero cambiamento UX.

**Backend coverage required**: 100% (porting necessario di **tutti i 135 routes** per
non rompere chiamate UI esistenti).

**Effort breakdown**:

| Item                                                                                |                       Effort |
| ----------------------------------------------------------------------------------- | ---------------------------: |
| Page port (231 × ~1.5h media — Next 16 import refactor + auth config + state hooks) |                         50gg |
| Backend route port completo (132 missing routes × ~3h media)                        |                         50gg |
| RBP framework (33 aree, 159+ permessi)                                              |                          4gg |
| RLS port (303 tabelle)                                                              |                          5gg |
| Widget impl port (11 components)                                                    |                          1gg |
| Dashboard schema + 11 dashboards seed                                               |                          2gg |
| Nav items 186 seed                                                                  |                        0.5gg |
| Integration tests + smoke E2E                                                       |                          5gg |
| **Total**                                                                           | **~117gg** (~5-6 mesi 1 dev) |

**Pro**:

- Zero feature-loss risk
- Zero training utenti
- UX identica = stakeholder satisfaction immediate
- Test E2E legacy riusabili (after URL/import refactor)

**Contro**:

- Costo enorme — 117gg = oltre 5 mesi
- **Cantiere B hardening sprecato**: 33 UI components shadcn/ui + Storybook + Tier-3
  design system inutilizzati (legacy UI ha proprio design)
- Q3 cutover impossibile (richiederebbe Q4 2026 minimum, più probabile Q1 2027)
- Tech debt portato avanti (component patterns legacy non ottimali per modern React)
- NextAuth v4 limitato vs design moderno

**Verdict**: P è **fuori scope cutover Q3 2026**. Considerare solo se Enzo decide
spostare cutover a Q4 2026+.

### Option R (Rewrite) — nuovo design da zero

> Rewrite UI da scratch usando UI library hardened in Cantiere B (33 shadcn/ui
> components + Storybook + design tokens + Zod). Mantieni solo i contratti API.

**Backend coverage required**: minimum P0 (5-10 endpoint critical, già scope-cut
in Phase 4 task 4.10 BLOCK 9). Pages selettivamente scelte (~30-40 pagine MVP).

**Effort breakdown**:

| Item                                                     |                    Effort |
| -------------------------------------------------------- | ------------------------: |
| Page MVP design + impl (30 pagine × ~3h modeling+wiring) |                      12gg |
| Backend route port P0 (10 routes × ~3h)                  |                       4gg |
| RBP framework (P0 scope: 5 aree)                         |                     1.5gg |
| RLS port (50 tabelle critical)                           |                     1.5gg |
| Widget rebuild (8 widget critical, nuovo design)         |                       2gg |
| Dashboard schema + 2 dashboards critical                 |                       1gg |
| Nav items P0 (~30 items)                                 |                    0.25gg |
| Tests + E2E                                              |                       4gg |
| **Total**                                                | **~26gg** (~1 mese 1 dev) |

**Pro**:

- Rapido — Q3 cutover viable
- Sfrutta Cantiere B hardening (UI library già pronta)
- Codice clean, no legacy debt, Tailwind 3 + Tier-3 design tokens
- Performance migliore (componenti ottimizzati, no over-rendering)

**Contro**:

- **Feature loss**: ~200 pagine legacy non portate → utenti perdono workflow esistenti
- Training utenti necessario (UX cambia)
- Stakeholder satisfaction risk (HR/finance/admin team possono lamentarsi)
- Re-discovery di edge case già risolti nel legacy
- Test E2E legacy non riusabili (nuove URL, nuovo DOM)

**Verdict**: R è **veloce ma rischioso**. Sostenibile solo se Enzo accetta che il
post-cutover Q3 2026 sarà "MVP minimo viable" e che Q4-Q1 2027 sarà speso a
completare le pagine mancanti (con UX possibly già rejected da utenti).

### Option H (Hybrid) — P0 preserve + resto rewrite progressive

> Preserva 1:1 le pagine P0 critical (~10-15 pagine: employee portal core, manager
> approvals, login, basic admin), rewrite il resto incrementally con design system
> Cantiere B. Doppio stile coesistente per 6-9 mesi.

**Backend coverage required**: P0 + ~30 secondary route per pagine preservate critical.
**Total ~40-50 routes** (vs 132 di P, vs 10 di R).

**Effort breakdown**:

| Item                                                            |                    Effort |
| --------------------------------------------------------------- | ------------------------: |
| P0 page preserve (12 pagine × ~3h adattamento Next 16)          |                     4.5gg |
| MVP rewrite secondary (20 pagine × ~3h nuovo design)            |                     7.5gg |
| Backend route port (40 routes × ~3h)                            |                      15gg |
| RBP framework (5 aree P0 + 5 aree secondary scope-loose)        |                       2gg |
| RLS port (80 tabelle: 50 P0 + 30 secondary)                     |                     2.5gg |
| Widget impl port + redesign (15 widget)                         |                     2.5gg |
| Dashboard schema + 4 dashboards (2 P0 preserved + 2 redesigned) |                     1.5gg |
| Nav items selective (~80 items P0+secondary)                    |                     0.5gg |
| Tests + E2E + dual-style integration                            |                       5gg |
| **Total**                                                       | **~41gg** (~2 mesi 1 dev) |

**Pro**:

- Q3 cutover **viable e realistic** (41gg = ~6-8 settimane 1 dev)
- Zero feature loss su P0 critical (employee/manager core workflows)
- Sfrutta Cantiere B hardening per nuove pagine (no spreco)
- Stakeholder satisfaction: workflow critical preservati, miglioramento progressive sul resto
- Phase post-cutover (Q4 2026+) può rifinire/redesignare gradualmente
- Test E2E P0 legacy riusabili (riducono regression risk)

**Contro**:

- Doppio stile UI durante transizione (6-9 mesi) — leggero design debt visibile
- Maintenance overhead temporaneo (2 sets di components)
- Discrimination "P0 vs non-P0" richiede engagement Enzo per identificare critical paths
- Edge case scoperti durante port preserved = need retro-fit nel rewrite

**Verdict**: H è **Q3-realistic + risk-balanced**. Allinea naturalmente con scope
cut backend già fatto in Phase 4 BLOCK 9 (P0-only).

---

## 3. Backend coverage assessment per opzione (mapping API → vista)

### 3.1 Mapping P0 critical (route → vista)

Stesso per tutte e 3 le opzioni — è il "minimum viable cutover" baseline:

| Backend route                         | Frontend page                             | Domain             |
| ------------------------------------- | ----------------------------------------- | ------------------ |
| `auth.ts`, `auth-2fa.ts` (TOTP gated) | `/login`, `/(protected)/dashboard`        | Auth core          |
| `employees.ts`                        | `/admin/employees`, `/portal/profile`     | Employee CRUD      |
| `leaves.ts`                           | `/portal/leaves`, `/admin/leaves/approve` | Leave self-service |
| `performance-reviews.ts` (subset)     | `/portal/reviews`, `/admin/reviews`       | Performance core   |
| `payroll.ts` (read-only payslip)      | `/portal/payslips`                        | Compensation core  |
| `dashboards.ts`                       | `/dashboards`                             | Dashboard data     |
| `widget-data.ts`                      | `/components/widgets`                     | Widget rendering   |
| `audit-logs.ts` (read)                | `/admin/audit`                            | Compliance         |
| `tenants.ts`, `users.ts`              | `/platform/tenants`, `/platform/users`    | Platform admin     |
| `health.ts`                           | `/admin/system-health`                    | Ops                |

**Total P0 minimum: ~10-12 routes, ~10-15 pages**.

### 3.2 Mapping per opzione

| Opzione | Routes scope |                           Pages scope | API surface                              |
| ------- | -----------: | ------------------------------------: | ---------------------------------------- |
| P       |    135 (all) |                             231 (all) | full parity required, 100% port          |
| R       |   10-12 (P0) |                   30 (MVP redesigned) | minimum-viable, allows feature pivot     |
| H       |        40-50 | 32 (P0 preserved + 20 MVP redesigned) | P0 + critical secondary, structured port |

### 3.3 Detailed route-to-page mapping per H scope

**P0 preserved 1:1** (12 pages, 12 routes):

- `/login` ← auth, auth-2fa
- `/portal/profile` ← employees (self)
- `/portal/leaves` ← leaves
- `/portal/reviews` ← performance-reviews (employee view)
- `/portal/payslips` ← payroll (read-only)
- `/admin/employees` ← employees (CRUD)
- `/admin/leaves/approve` ← leaves (approve flow)
- `/admin/reviews` ← performance-reviews (manager view)
- `/admin/audit` ← audit-logs
- `/platform/tenants` ← tenants
- `/platform/users` ← users
- `/admin/system-health` ← health, system-health

**MVP redesigned** (20 pages, 28-38 secondary routes):

- `/dashboards/*` ← dashboards, widget-data, widget-catalog (3 routes)
- `/admin/recruiting/*` ← candidates, requisitions, recruiting-pipeline (4 routes)
- `/admin/compensation/*` ← compensation, bonus-plans, benefits (4 routes)
- `/admin/learning/*` ← learning-paths, certifications (3 routes)
- `/admin/calibration/*` ← calibration-sessions, 360-reviews (3 routes)
- `/admin/analytics/*` ← analytics, analytics-ai, analytics-workforce, benchmarking (5 routes)
- `/admin/ai/*` ← ai-chat, ai-providers, analysis-sessions (3 routes)
- `/admin/blueprint/*` ← blueprint, blueprint-standalone (2 routes)
- `/admin/integrations/*` ← integrations, sso (2 routes)
- `/admin/onboarding` ← onboarding (1 route)

**NON ported (post-cutover)** (~190 pages, ~85 routes): tutto il resto del legacy
admin (governance secondary, ontology deep-views, advanced search, niche analytics).
Tracked in `docs/audits/post-cutover-backlog.md` (TBD — generato dopo cutover).

---

## 4. Raccomandazione

**Opzione H (Hybrid)**.

### Razionale

1. **Allineamento scope Phase 4 BLOCK 9** — già scope-cut a P0-only. H estende
   naturalmente questo principio al frontend: P0 preserve, secondary redesign,
   tail post-cutover.
2. **Q3 2026 cutover deadline rispettato** — 41gg = ~6-8 settimane 1 dev a tempo
   pieno; con 2 dev (Cantiere A + B parallel) ~3-4 settimane.
3. **Cantiere B hardening sfruttato** — UI library shadcn/ui + Storybook usata
   dove serve (MVP redesign), non sprecata.
4. **Risk-balanced** — feature loss limitato a 1-2 dashboard heavy (workforce-intelligence,
   benchmarking) che possono essere recuperati post-cutover.
5. **Stakeholder satisfaction** — workflow employee/manager (HR core) preservati identici,
   stakeholder admin/exec accettano redesign in cambio di velocità.
6. **Test reuse** — E2E P0 legacy riusabili = ~5gg risparmiati di test writing.
7. **Reversibilità** — se durante port emergono ostacoli, sempre possibile
   espandere preserve (quasi-P) o ridurre (quasi-R), no commit irrevocabile.

### Decision points per Enzo

- ✅ Confermare lista 12 P0 preserved (può aggiungere/rimuovere su feedback HR)
- ✅ Confermare lista 20 MVP redesigned (può ri-prioritizzare)
- ✅ Approvare effort 41gg + buffer 20% = **~50gg cutover-ready timeline**
- ✅ Decidere se Cantiere B continua hardening avanzato in parallel o si fonde in
  Cantiere A per accelerazione

### Path comune (eseguibile prima della decisione P/R/H)

Indipendentemente dall'opzione scelta, queste task sono **path comune** e si possono
fare ora senza attendere decisione:

- **4.8 RBP framework port** (1.5-2gg) — backend, scope P0 (5 aree)
- **4.9 RLS policies port** (1.5-2.5gg) — backend, scope P0 (50 tabelle)
- **4.11 ESCO+NACE verify** (0.5gg) — backend
- **4.12 ADR-010 Tenant ontology versioning** (1gg) — schema
- **4.13 ADR-011 Governance audit trail** (1gg) — schema

**Totale path comune: ~5.5-7gg backend work** (BLOCK 10).

Solo **4.10 endpoint port** (BLOCK 11) richiede la decisione P/R/H per definire
quali e quante routes portare.

---

## 5. Decisione richiesta

| Domanda                        | Default suggerito                                   |
| ------------------------------ | --------------------------------------------------- |
| Quale opzione (P/R/H)?         | **H** (Hybrid)                                      |
| Lista P0 preserved corretta?   | 12 pages elencate sopra (rivedere dopo feedback HR) |
| Lista MVP redesigned corretta? | 20 pages elencate sopra (priorità admin core)       |
| Cutover deadline confermato?   | Q3 2026 (settembre)                                 |
| Buffer sui 41gg?               | +20% = ~50gg                                        |

**Action**: Enzo conferma l'opzione (H suggerito) + valida le liste P0/MVP. Una volta
confermato, il task 4.10 Phase 4 BLOCK 11 procede con scope chiaro.

Nel frattempo, BLOCK 10 (4.8 + 4.9 + 4.11 + 4.12 + 4.13) procede in autonomous-max
come path comune.

---

## DECISIONE OWNER (2026-05-01)

**Opzione H (Hybrid) — CONFIRMED da Enzo Spenuso 2026-05-01.**

Cantiere A procede con BLOCK 11 (Phase 4 endpoint port 4.10-4.13) seguendo lo scope Hybrid:

- **P0 preserve 1:1** (~12 pagine): `/portal/*` employee core, `/manager-hub/*` approvals, login + onboarding, dashboard `employee_portal` + `manager_hub`, widget P0 (pending_approvals, team_absences, headcount_kpi, my_card).
- **Rewrite con Cantiere B UI library** (~20 pagine): `/admin/*` core subset 30 pagine high-traffic, dashboard `hr_operations` + `tech_admin` MVP redesigned, widget secondary redesigned.
- **Tail post-cutover** (Phase 7+): `/admin/blueprint/*` (148 pagine) — solo P0 ora, resto Q4-Q1 2027. Dashboard `workforce_intelligence`, `executive_overview`, `benchmarking` deferred. Widget complex deferred.

**Backend coverage scope**: ~40-50 routes (P0 + secondary), RBP 5+5 aree, RLS 80 tabelle.

Vedi §2.3 e §4 del brief per dettagli effort breakdown. Effort totale stimato: ~41gg.
