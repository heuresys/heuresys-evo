# ADR-0029: ITLAB — Italian labor context tables (CCNL + payroll + sindacati + holidays)

**Status**: Accepted
**Date**: 2026-05-11
**Authors**: Enzo Spenuso
**Commits**: `5343731` (phase18d_italian_labor_context.sql incluso) · S35.1 shipping
**Lexicon**: ITLAB
**Migration**: `db/migrations/phase18d_italian_labor_context.sql` (+ DOWN)

## Context

Heuresys è piattaforma SaaS B2B targeted al mercato italiano (Heuresys System tenant `heuresys.com` + clienti italiani RTL Bank/SmartFood/EcoNova). Pre-S35 il DBMS non rappresentava il **contesto labor italiano** in forma strutturata:

- CCNL (Contratto Collettivo Nazionale di Lavoro) — nessuna tabella. I CCNL governano livelli retributivi minimi, ferie, permessi ROL, indennità, periodi di prova per ogni settore (ABI Credito, Federalimentare, ElettricoConfindustria, Commercio Terziario).
- Payroll calendar — nessun riferimento a 13a/14a mensilità, TFR quota, INPS registration.
- Sindacati — nessuna tabella per rappresentanze sindacali (UILCA, FIRST CISL, FABI, etc.) o link tenant↔sindacato.
- Holidays IT — la tabella `holidays` esisteva ma senza scoping regionale italiano (Festa Patrono, ricorrenze territoriali).
- Job→CCNL mapping — nessun ponte fra `job_templates` (ESCO-grounded) e CCNL levels.

Senza queste tabelle, qualsiasi widget compensation/payroll/holiday italiano sarebbe stato un placeholder generico; KPI compliance HR (es. "% headcount allineato a CCNL level") impossibili; nessun supporto a workflow di assunzione/cessazione coerenti col diritto del lavoro italiano.

## Decision

Migration `phase18d_italian_labor_context.sql` introduce **5 tabelle master + 3 junction + 1 view** che codificano il contesto labor italiano allineato ai 4 tenant:

### Tabelle master (platform-default, no tenant_id)

| Tabella                | Scopo                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `ccnl_contracts`       | Master CCNL (ABI Credito, Alimentari Industria, Elettrici, Commercio Terziario, etc.) — code, name, sector, version, effective_from, regulator |
| `ccnl_levels`          | Livelli retributivi per ogni CCNL (junior/senior/quadro/dirigente) con `gross_salary_min/max`, `vacation_days`, `notice_period_days`           |
| `ccnl_executive_bands` | Bande dirigenziali (Q1/Q2/Q3/Q4) per CCNL con livelli executive                                                                                |
| `ccnl_seniority_rules` | Regole anzianità (scatti, automatismi, scaglioni) per CCNL                                                                                     |
| `sindacati`            | Rappresentanze sindacali (UILCA, FIRST CISL, FABI, FILCAMS, FAI, etc.) con `sector`, `federation_parent_id`                                    |

### Junction tables (tenant-scoped)

| Junction                 | Link                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `tenant_ccnl_links`      | Tenant ↔ CCNL applicato (RTL Bank → ABI Credito, SmartFood → Alimentari, EcoNova → Elettrici, Heuresys → Commercio Terziario) |
| `ccnl_job_title_mapping` | job_template (ESCO) ↔ ccnl_level (Italian level) — ponte ESCO↔CCNL                                                            |
| `industry_ccnl_mapping`  | industry_profile (NACE) ↔ ccnl_contract — default CCNL per industria                                                          |

### Holidays IT — colonne aggiunte alla tabella `holidays` esistente

- `name_it` VARCHAR(255) — denominazione italiana ("Festa della Repubblica", "Immacolata Concezione", "Santo Patrono")
- `region_code` VARCHAR(8) — codice ISO regionale per festa patrono territoriale
- `country_code` default `'IT'`

Seed companion: ~96 festività italiane 2025-2026 (nazionali + ricorrenze regionali principali) inserite via `phase18d` seed block.

### View

- `v_ccnl_summary` — vista riassuntiva CCNL × livelli × seniority_rules per query rapide

## Rationale

- **ITLAB obbligatorio per credibilità mercato italiano**: piattaforma HR senza CCNL/payroll IT non è enterprise-grade per clienti italiani. Differenzia Heuresys da competitor anglo-saxon (Workday, SuccessFactors) localizzati superficialmente.
- **Bridge ESCO↔CCNL**: `ccnl_job_title_mapping` consente alla cascade industry-driven (INDOOR) di propagare ESCO ISCO occupation → CCNL level → salary band → compensation policy. Senza il bridge, ESCO è teorico e CCNL è isolato.
- **Junction tenant_ccnl_links**: P10 multi-level Platform/Tenant supportato — il catalog CCNL è platform-level (no tenant_id), ma l'adoption è tenant-specific via junction.
- **Holidays esteso vs nuova tabella**: estendere `holidays` esistente (vs creare `holiday_calendars_it` come nel plan originale) preserva il dual-purpose (multi-country + IT-specific) e evita duplicazione codice.
- **Seed 4 CCNL canonici**: 1 per tenant pilot — pattern replicable per nuovi tenant (es. CCNL Metalmeccanici per cliente manifatturiero futuro).

## Consequences

### Positive

- 4 tenant linked a CCNL canonical (RTL→ABI Credito, SmartFood→Alimentari, EcoNova→Elettrici, Heuresys→Commercio Terziario)
- Job templates RTL Bank (32) mappati a CCNL Credito levels via `ccnl_job_title_mapping`
- 96 festività italiane 2025-2026 disponibili per leave/timeoff calendar
- 13a/14a mensilità + TFR quota encoded in `ccnl_contracts` metadata (JSONB)
- Sindacati referenziabili da `employees.sindacato_id` (FK) per workflow rappresentanza
- Compliance dashboard widget abilitati ("% employees allineato a CCNL", "scadenze rinnovi CCNL")
- Pattern replicable per nuovi mercati (TFR-equivalent, holiday locali, sectoral bargaining agreement)

### Negative

- **Maintenance CCNL**: i CCNL si rinnovano periodicamente (ABI Credito 2024-2026 vigente). Serve workflow update CCNL versions + back-effective_from semantics
- **Seed completeness**: solo 4 CCNL seedati. Tenant futuri con sector diversi (Metalmeccanici, Sanità, Edilizia, etc.) richiedono nuovi seed blocks
- **CCNL_levels gross_salary_min/max**: il dato è platform-default ma le aziende possono superare i minimi → semantica "minimum compliance" non "actual compensation"
- **Sindacati seed minimo**: solo le principali rappresentanze settore — non un catalogo completo

## Related ADRs

- **ADR-0028** — CASCADIA pipeline (ITLAB è stage S35.1 della pipeline)
- **ADR-0030** — Lexicon canonical (ITLAB è una delle 16 sigle)
- **ADR-0023** — Promote bare-metal as SoT
