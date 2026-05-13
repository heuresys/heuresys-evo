# ADR-0028: CASCADIA pipeline — realistic industry-flavored universe seeding

**Status**: Accepted-Implemented (closure S57 — 2026-05-13)
**Date**: 2026-05-11 · **Closed**: 2026-05-13
**Authors**: Enzo Spenuso
**Commits S35 baseline**: `5343731` (S35.3 M9+M11) · `5f08439` (phase18f ESKAP) · `1500369` (S35 handoff)
**Commits S55+→S57 closure**: `946af24` Stage 0 L78 · `f7ed98c` Stage 1a L79 · `2fd6dd1`+`a257ddf`+`96955be` Stage 1b L80 · `70b5f44`+`a8cd470` Stage 2b L81 · `fad4e59`+`a499049`+`30936e9` Stage 2f+3 L82 · `32354e2`+`9ab38e5`+`898d29b` EcoNova templates+verify-area fix L83 · `f893081` Stage 5 dashboard registry sweep L84 · `c49b5e8` handoff S57
**Closure metrics**: +1141 records + 136 tasks inseriti · verify-area 🟢 24/26 · ~6h effective (vs 58-94h plan iniziale)
**Lexicon**: CASCADIA + INDOOR + OPOURSKA + GOKMER + TALPIPE + ESKAP + ITLAB + DGOV + EPRA + H2R + SMERTO + PULSAR + SKILGRO

## Context

Pre-S35 il DBMS `heuresys_platform` era scheletrico per la maggior parte delle 25 aree dati gestite: ~570 tabelle, 367 RLS policies, ma diverse aree (career_paths, succession_pipeline, kpi master, assessments, business_processes, kg_nodes/edges) avevano <10 row per tenant o erano vuote. Decisione utente S35: il problema non era "demo data nel codice" (mockup-fedeli widget con hardcoded "Maria Rossi") ma **DBMS scheletrico che invalidava qualsiasi data binding live**.

Phase 2 originale del plan canonical (rimuovere demo identities dai 19 widget) avrebbe prodotto widget vuoti, API rotti, KG inattivo. Serviva prima realizzare il **primo case study autoreferenziale di Organizational Intelligence**: 4 tenant industry-flavoured (banking K.64 / food C.10 / energy D.35 / SaaS M.72), ciascuno con cascade coerente da Industry profile fino ad Assessment → Career → KG → AI predictions.

## Decision

Adottare **CASCADIA** come pipeline canonical multi-sessione (S35.0-S35.7, ~58-94 FTE-h totali) che proietta i 4 tenant attraverso 7-layer ontologia (OPOURSKA) + Industry cascade (INDOOR) + Performance cycle (GOKMER) + Talent pipeline (TALPIPE) + Skill learning (SKILGRO) + Process governance (PROGOV) + Italian labor context (ITLAB) + AI predictive (EPRA), con proiezione Knowledge Graph completa (ESKAP).

### Stage strutturale 8-fase

| Stage     | Scope                                                                      | Status post-S35                                                          |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **S35.0** | Forensic precondition (tenant_id + RLS + GUC + RBP drift parz.)            | shipped — audit 100% closure (commit `5343731` ext L57+L58+L59)          |
| **S35.1** | ITLAB Italian labor context (CCNL + payroll + sindacati + holidays)        | shipped phase18d (commit pre-S35.3)                                      |
| **S35.2** | Infrastructure pipeline + Lexicon canonical (`docs/_meta/lexicon.md`)      | shipped (16 sigle ADR-0030)                                              |
| **S35.3** | Pilot RTL Bank end-to-end (14 milestones M0-M14)                           | shipped 14/15 (M15 pending Chrome MCP walkthrough)                       |
| **S35.4** | Extension SmartFood + EcoNova + Heuresys                                   | pending (~15-25h FTE)                                                    |
| **S35.5** | Knowledge Graph full projection (ESCO catalog + tenant projection)         | shipped phase18f (17.260 nodes + 139.451 edges)                          |
| **S35.6** | Dashboard binding sweep + F-008 persona_label + widget_catalog_id backfill | partial — F-008 shipped phase18g, binding sweep deferred                 |
| **S35.7** | Verification finale (25-area SQL + Chrome MCP + ADR + handoff)             | shipped — verification PASS 22/24, 2 known gaps (RBP drift + Chrome MCP) |

### Acceptance criteria per stage

- Idempotency: ogni INSERT `ON CONFLICT DO NOTHING` o `ON CONFLICT DO UPDATE`
- RLS enforced: ogni transaction via `SET LOCAL app.current_tenant_id`
- Audit atomic: ogni write seed produce `audit_logs` row pre-commit (P4)
- Human gate: `<tenant>_industry_profile.json` review umana prima del seed downstream
- Backup pre-pipeline: `pg_dump` PRIMA di ogni stage major
- Verification gate: 25-area SQL checks PASS prima di promote stage

### Pilot RTL Bank (S35.3) — milestone gates evidence

| Milestone | Output                                                                        | Verified                                                           |
| --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| M0        | Backup baseline `heuresys_platform-pre-S35.3-pilot-rtl-20260511T171222Z.dump` | sha256 `2fcc0d85...`                                               |
| M1        | `rtl_bank_industry_profile.json` HUMAN GATE approved                          | committed cache                                                    |
| M2        | Industry taxonomy + NACE K.64 mapping                                         | `industry_profiles` 8 rows                                         |
| M3        | Org structure                                                                 | 32 org_units depth ≥3                                              |
| M4        | Job inventory + position assignments                                          | 32 job_templates + 158 emp con position                            |
| M5        | KPI framework                                                                 | 32 tenant_job_kpis                                                 |
| M6        | Process blueprint banking-specific                                            | 11 business_processes                                              |
| M7        | Compliance regulatory frameworks (phase18e)                                   | 10 regulatory_frameworks                                           |
| M8        | Workforce enrichment                                                          | 158/158 emp con position+org_unit (100%)                           |
| M9        | Assessment Gaussian distribution                                              | 1859 employee_skill_assessments                                    |
| M10       | Goals + KPI targets                                                           | shipped per emp                                                    |
| M11       | Career + succession + 9-box                                                   | 98 succession_candidates + 157 nine_box_grid + 10 succession_plans |
| M12       | L&D/Recruiting/Comp/Mentor/Engage/TimeOff/Docs/Notif/Audit                    | aree popolate per RTL                                              |
| M13       | ESCO KG + RTL projection (phase18f)                                           | 17.260 kg_nodes + 139.451 kg_edges + 1.766 RTL-scoped edges        |
| M14       | AI predictive seed                                                            | turnover_risk + perf_prediction shipped                            |
| **M15**   | **Chrome MCP walkthrough 88 cells**                                           | **pending — out-of-autonomous-scope**                              |

## Rationale

- **Universo dati come prodotto**: la mission Heuresys ("manage the company's ability to run") richiede che la piattaforma applichi il proprio Organizational Intelligence al proprio DB. RTL Bank case-study è il primo Self-Reference completo.
- **Industry-driven cascade vs random fixture**: NACE K.64 banking deve dettare il process blueprint (Retail/Corporate/Treasury/Compliance/Risk), il role inventory (ESCO ISCO 1346/2412/3334), il regulatory framework (PSD2/AML5/Basel III/GDPR), il CCNL (Credito ABI). Random data avrebbe prodotto incoherent assessments e succession unsuitable.
- **Pilot prima dell'extension**: validating pattern su 1 tenant (158 emp) consente refinement del pattern prima di replicare su 3 tenant residui — riduce rischio di rewriting massivo cross-tenant.
- **Lexicon canonical (ADR-0030)**: vocabolario controllato delle catene relazionali consente naming convention coerente (`scripts/seed-generator/<sigla>/`, commit scope `<type>(<sigla>):`, ADR title `<SIGLA>+<SIGLA>`).
- **Forensic precondition (S35.0)**: applicare seed senza prima fixare GUC typo + tenant_id gaps + RBP drift produrrebbe leakage cross-tenant e ghost dependencies.

## Consequences

### Positive

- DBMS production-grade per pilot RTL: 158 emp con full enrichment chain (Industry → Org → Role → Skill → KPI → Process → Assessment → Career → 9-box → KG → AI)
- API Explorer endpoints sbloccati (`/api/explorer/kg/expand` ritorna ~2k edges per RTL employee sample)
- Pack 2-8 Express endpoints funzionanti su RTL (skills/reviews/learning/recruiting)
- Demo pitch coerente per stakeholder presentation: storia organizzativa banking realistica
- Phase 2 dashboard binding sweep (S35.6) drasticamente ridotta in effort (~3-5h vs 12-18h originale): widget consumano DB ricco invece di mock fallback
- Verification SQL baseline (`docs/40-operations/cascadia-verify.sql` TBD) come regression detection per future migration

### Negative

- **Effort esteso**: ~58-94 FTE-h totali (vs originale Phase 2 ~12-18h) → multi-sessione obbligatorio
- **Backup overhead**: pre-stage `pg_dump` mandatory + sha256 log per ogni major stage
- **Human gate latency**: industry profile JSON richiede review umana per ogni nuovo tenant (S35.4)
- **Maintenance burden**: cascade pipeline è opinionated — modifiche ai 7-layer ontology richiedono ri-running stage downstream
- **RBP drift residuo**: 179/326 row in `rbp_role_permissions` non risolto in S35.0 (deferred S36+, non-blocking pilot)

### Carry-forward post-S35

- **S35.4 Extension**: 3 tenant restanti (SmartFood food / EcoNova energy / Heuresys SaaS) — pattern RTL replicable. Open question: industry profile JSON manuale vs web research via OpenAI advisor.
- **M15 Chrome MCP walkthrough**: validation visiva 88 cells (8 roles × 11 dashboard) — pending coordinamento umano.
- **S35.6 binding sweep**: `services/app/src/lib/dashboard-engine/registry.tsx` (19 widget) remove demo fallback + adoption `useWidgetData()` — pending design decision su per-widget data source.
- **org_unit_kpis strategic (M5b)**: ROE/CET1/Turnover BANKING-M root — defer a M16 cross-tenant.

## Related ADRs

- **ADR-0029** — ITLAB Italian labor context tables (CCNL + payroll + sindacati + holidays_it)
- **ADR-0030** — Lexicon canonical 16 sigle (vocabolario controllato catene relazionali)
- **ADR-0023** — Promote bare-metal as SoT (precondition: DBMS bare-metal source-of-truth)
- **ADR-0026** — Phase 15.A brand-fedele dashboard rendering (downstream consumer: 7 `_v2` preset + 11 mappati con persona_label F-008)
