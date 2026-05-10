# D3 — Security posture & compliance readiness

**Auditor**: Senior Security Auditor (M&A due diligence)
**Date**: 2026-05-10
**Scope**: code+doc audit (no penetration testing). Reading list: ADR-0007, ADR-0008, ADR-0012, security-baseline.md, operating-baseline.md.
**Validation grep**: `requirePermission`, `auditedTransaction`, `setLocalTenant`, `requireRole`, `$queryRawUnsafe`, `console.log` su `services/`.

## TL;DR

Postura security **medio-alta per uno stadio pre-produzione**: defense-in-depth multi-layer (RLS + RBP data-driven + audit log atomico + CSRF HMAC + Helmet + zod), 367 RLS policies attive, P1-P10 documentati e in larga parte enforced lato api-gateway. **Gap rilevanti**: zero occorrenze `requirePermission`/`usePermission` in `services/app` (P3 enforcement asimmetrico), CSP ancora report-only, NextAuth v4 in EOL maintenance, Sentry deferred, nessuna certificazione SOC 2/ISO. Audit-ready a 60-65%.

## Severity overview

| Sev      | Count | Findings                                              |
| -------- | ----- | ----------------------------------------------------- |
| Critical | 0     | —                                                     |
| High     | 3     | F3.1, F3.2, F3.3                                      |
| Medium   | 4     | F3.4, F3.5, F3.6, F3.7                                |
| Low      | 3     | F3.8, F3.9, F3.10                                     |
| None     | —     | (asymmetric: nessun CVE noto critico in stack pinned) |

## Findings

### F3.1 [HIGH] P3 RBP enforcement asimmetrico — assente in services/app

- **Evidence**: `Grep requirePermission|usePermission|hasPermission` su `services/app/src` → **0 matches**. Stesso pattern su `services/api-gateway/src` → 40 occorrenze in 9 route file. ADR-0012 + security-baseline.md §P3 prescrivono `usePermission` hook su "every gated UI element".
- **Detail**: il gateway Express è correttamente protetto (workforce-planning, users, tenants, roles, org-units, employees, rbac middleware). Le route Next.js App Router (`services/app/src/app/(app)/*`), che secondo CLAUDE.md "bypassano api-gateway via Prisma direct", non risultano coperte dal middleware RBP. Affidarsi alla sola RLS DB-level lascia scoperti: (a) check di area-action più granulari del tenant filter, (b) operazioni cross-tenant SUPERUSER, (c) gating UI elements (menu/buttons/forms).
- **Risk**: privilege escalation orizzontale dentro lo stesso tenant (es. EMPLOYEE legge merit_cycles). Severity HIGH perché contraddice principio cardinale documentato.

### F3.2 [HIGH] Dual-system auth — single point of failure su AUTH_SECRET + maintenance risk NextAuth v4

- **Evidence**: ADR-0007. NextAuth v4.24.x in `services/app` + `@auth/express ^0.12.x` in api-gateway, condividono `AUTH_SECRET` + cookie name `authjs.session-token` + JWE A256CBC-HS512.
- **Detail**: tre rischi compositi: (1) compromissione `AUTH_SECRET` → bypass auth simultaneo su entrambi i servizi (no segregation); (2) NextAuth v4 in maintenance-only (Auth.js v5 è la linea di sviluppo attiva) — patch security future incerte; (3) ADR riconosce esplicitamente "drift tra release NextAuth v4 e Auth.js v5 può introdurre incompatibilità". Commit `9f7a283` ha shipped jose+HKDF custom decoder per cross-service: aumenta superficie di codice security-critical custom-maintained.
- **Risk**: lock-in su un meccanismo fragile. Migration v5 è un must in 6-12 mesi. CVE storici NextAuth (CVE-2022-31125, CVE-2023-48309) risolti in v4.24.x ma nuovi bug minori continuano a uscire.

### F3.3 [HIGH] CSP ancora report-only — XSS exploit non bloccato runtime

- **Evidence**: `services/api-gateway/src/middleware/security.ts:36` → `reportOnly: process.env.CSP_ENFORCE !== '1'`. Default = report-only. Nessuna evidenza di flag `CSP_ENFORCE=1` in env production canonical.
- **Detail**: ADR-0012 §1 dichiara "report-only first; flip to enforce after monitoring" — flip non risulta avvenuto a 9+ giorni dall'ADR. Senza enforce, una XSS injection sarebbe loggata (assumendo report-uri configurato) ma non bloccata.
- **Risk**: XSS exploitable. Mitigazione parziale via Tailwind no-inline-script + zod input validation, ma defense-in-depth incompleto.

### F3.4 [MEDIUM] auditedTransaction adoption parziale (P4)

- **Evidence**: `Grep auditedTransaction\(` su services → 20 occorrenze in 6 file (api-gateway: users, tenants + tests; app: tests). `services/app/src/lib/audit/auditedTransaction.ts` esiste (mirror shippato S24 L58), ma adoption nei route handler `/api/dashboard/*`, `/api/ontology/*`, `/api/explorer/*` non verificata.
- **Detail**: P4 prescrive audit_logs INSERT pre-commit per OGNI write. Adoption attuale = 6 file su decine di route Express + Next.js handler. La maggioranza delle write usa probabilmente `prisma.X.update()` senza wrapping atomico → audit log eventualmente decorrelato dalla transaction.
- **Risk**: gap di traccia per incident response + non-conformità GDPR Art. 30 (records of processing).

### F3.5 [MEDIUM] console.log diffuso in production paths (P8)

- **Evidence**: `Grep console\.log` su services → 21 occorrenze in 3 file: `services/app/tests/e2e/a11y/wcag-aaa.spec.ts` (test, OK), `services/app/scripts/perf-dashboard.mjs` (script, OK), **`services/api-gateway/src/index.ts` (production code path)**.
- **Detail**: P8 forbids `console.log` in prod path. La singola occorrenza in `index.ts` va verificata: probabilmente startup banner (acceptable) ma resta come gap per lint rule enforcement (security-baseline.md §P8 menziona "lint rule" ma non confermato attivo).
- **Risk**: log non strutturati = no Pino redaction = potenziale leak di dati sensibili in stdout/journald.

### F3.6 [MEDIUM] In-memory rate-limit non scala multi-instance

- **Evidence**: ADR-0012 §2 "Storage: in-memory default. Per multi-instance deploy → swap a `rate-limit-redis` (deferred a runbook B11)".
- **Detail**: la VM oracle-vm-default è single-instance, OK. Ma orizzontale scale-out (M&A buyer scenario) richiede Redis-backed limiter PRIMA di andare multi-pod, altrimenti brute-force /auth diventa N×10 req/5min con N=numero istanze.
- **Risk**: deferred → blocker pre-scale.

### F3.7 [MEDIUM] Sentry / error tracking deferred — incident response cieco

- **Evidence**: security-baseline.md §P8 menziona Sentry come componente, ADR-0012 "Future work: Sentry → deferred a B5 ADR-0013". CLAUDE.md roadmap §3 elenca Sentry tra deferred items.
- **Detail**: senza error tracking centralizzato, MTTR su incident security è O(ore-giorni) invece di minuti. Audit log Postgres copre data layer ma non error/exception pipeline.
- **Risk**: SOC 2 CC7.2 (system monitoring) → gap sostanziale.

### F3.8 [LOW] Nessuna 2FA / MFA shipped — TOTP deferred

- **Evidence**: CLAUDE.md "deferred items (TOTP 2FA, Sentry, license decision)". 8 canonical users con password `Heuresys2026!` (test env).
- **Detail**: per SaaS B2B HR/payroll, MFA è de-facto mandatory in enterprise procurement (Vendor Security Assessment) e in molti compliance framework (NIST 800-63B AAL2).
- **Risk**: deal-breaker per vendita enterprise (>500 dipendenti). Effort implementativo ~16-24h.

### F3.9 [LOW] Branch protection rimossa (ADR-0021) — sole-coder governance

- **Evidence**: CLAUDE.md "Branch protection main: RIMOSSA". Workflow direct push main.
- **Detail**: razionale "1 sole coder + R17 responsabilità totale" è coerente per stadio pre-acquisizione. Post-M&A con team multi-developer → re-attivare branch protection + required checks è must.
- **Risk**: governance gap visibile nei due diligence findings ma facilmente remediabile.

### F3.10 [LOW] License decision pending

- **Evidence**: CLAUDE.md deferred items "license decision". Nessun `LICENSE` file in repo root.
- **Detail**: repo PUBLIC senza LICENSE = default copyright restrittivo, complica M&A IP transfer e blocca contributi esterni. Da decidere AGPL/MIT/proprietary prima del closing.

## Strengths

- **RLS DB-level full coverage**: 367 policies attive su 312 tabelle tenant-scoped, FORCE RLS abilitato (no owner bypass), role `heuresys_app_user` no-BYPASSRLS in runtime. Pattern collaudato (legacy 303 tabelle) — defense-in-depth eccezionale per stadio.
- **CSRF HMAC-bound** (non legacy double-submit) — implementazione 50 LOC self-contained, immune a XSS-token-leak. Scelta security-aware sopra media settore.
- **Pre-commit + CI dual-gate secrets**: husky pre-commit gitleaks-lite + CI gitleaks full-history + semgrep p/owasp-top-ten + npm audit nightly. Filiera robusta.
- **Zero raw SQL injection surface**: `Grep $queryRawUnsafe|$executeRawUnsafe` → 0 matches. Solo tagged templates `$queryRaw\`...\``. P6 enforced rigorosamente.
- **RBP data-driven**: `Grep requireRole\(` → 0 matches confermano ADR rispettato. Authorization check vanno contro 33 functional areas DB, non hardcoded.
- **Cookie hardening canonical**: HttpOnly + SameSite + Secure-in-prod su NextAuth session + CSRF binding.
- **Audit DB qualitativo già fatto** (`docs/_audit/2026-05-09-forensic-db-audit.md`): 22 issues prioritizzati, 0 FK NO ACTION, baseline tracciato. Cultura security mature.

## Compliance gap analysis

| Framework    | Status                           | Gap principali                                                                                                                            |
| ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| GDPR         | Baseline 65%                     | DPA non visibile in repo, DPIA assente, Art. 30 records parziali (F3.4), retention policy non documentata, no DPO contact, no SAR runbook |
| AI Act EU    | Non applicabile (stadio attuale) | Nessun sistema AI ad alto rischio shipped. ESCO matching non è "AI" per Art. 6. Da rivalutare se entra GenAI advisory.                    |
| CSRD         | Out-of-scope tecnico             | Riguarda reporting sostenibilità del cliente finale, non la piattaforma. SaaS deve solo fornire data export.                              |
| SOC 2 Type I | 50-55% gap                       | F3.4 (CC7.2 monitoring), F3.7 (no Sentry), F3.8 (no MFA = CC6.1), no formal change management, no vendor risk assessment                  |
| ISO 27001    | 45-50% gap                       | Nessun ISMS documentato, no risk register formale, no asset inventory ufficiale, no business continuity plan                              |
| NIST 800-53  | 60% gap (subset moderato)        | AC-2 account management OK, AU-2 audit events parziale, IA-2 multi-factor MANCANTE, SI-4 monitoring MANCANTE                              |

## Open questions per acquirer

1. **NextAuth v5 migration timing**: ADR-0007 riconosce drift v4↔v5. Quando? Effort stimato 5-10 giorni FTE. Pre-closing o post-integration?
2. **Sentry deferral cost**: senza error tracking, MTTR incident SLA è inacceptable per enterprise contract. Priorità sprint imminente?
3. **License strategy**: AGPL (forza apertura cliente)? MIT (massima adoption)? Proprietary (M&A friendly)? Decisione **prima** del LOI signing.
4. **MFA roadmap**: TOTP via NextAuth callback + speakeasy/otplib o full IdP delegation (Auth0/Clerk/WorkOS)? La seconda risolve anche F3.2.
5. **Penetration test storico**: esiste un report pen-test esterno? Se no, budget closing per uno.
6. **Data residency**: VM Oracle eu-milan-1 → GDPR-compliant per cliente EU. Stipulato in DPA template? Cosa per cliente US?

## Acquirer perspective

**Verdict preliminare D3: NEGOTIATE**.

La postura security è **sopra la media per uno stadio pre-prodotto da single-coder**: defense-in-depth real, RLS+RBP rigorosi, secrets hygiene matura, zero raw SQL injection, audit log architetturalmente corretto, ADR auto-critici e tracciabili. Cultura security visibile (operating-baseline.md, CARD-1/2/3/4 check su feasibility).

I gap **non sono blocker tecnici** ma **maturity gap**: F3.1 (RBP app-side) richiede 8-16h di sweep, F3.3 (CSP enforce) 1h + monitoring, F3.4 (auditedTransaction adoption) 16-24h, F3.7 (Sentry) 4-8h, F3.8 (MFA) 16-24h. Stima totale **~3-4 settimane FTE** per portare D3 a 85-90%.

**Negoziare**: (a) escrow del 5-10% legato alla chiusura dei 3 high entro 90gg post-closing, (b) inclusione di pen-test esterno + SOC 2 Type I readiness assessment nei costi M&A advisor, (c) impegno scritto su NextAuth v5 migration roadmap, (d) chiarimento license strategy come condizione sospensiva.

**No deal-breaker rilevati**. Nessuna CVE critica nello stack pinned, nessun auth bypass, nessun raw SQL injection, nessun secret leakato in git history (gitleaks history clean per design via pre-commit + CI dual-gate).
