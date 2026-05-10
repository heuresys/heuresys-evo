# D2 — Database Schema & Integrity Assessment

> **Auditor**: database-admin subagent · **Data**: 2026-05-10 · **Mandato**: ACQ-AUDIT-2026-05
> **Repo**: `heuresys-evo` · **DB target**: PostgreSQL 16.13 bare-metal `oracle-vm-default:5432/heuresys_platform`
> **Modalità**: read-only su file (no live DB access). Cross-reference con audit forense L53 (2026-05-09) e FK review S24 (2026-05-10).

## TL;DR (≤80 parole)

Schema multi-tenant maturo (568 modelli Prisma, 312 tabelle `tenant_id NOT NULL`, 367 RLS attive, 0 FK NO ACTION post-S24). Difese in profondità solide a livello DB. Tre debiti rilevanti: (1) saga vertical-split `employees` Phase 2 fallita per 65 view + 4 mat view non documentate (debito ~15-25h FTE), (2) macro-modello `employees` 95 colonne con scope misto PII/HR/payroll/auth (privacy/GDPR design smell), (3) audit log enforcement irregolare (P4 gap parziale). Nessun blocker dirimente per acquisizione.

## Severity overview

| Severity   | Count | Note                                                                                |
| ---------- | ----- | ----------------------------------------------------------------------------------- |
| `critical` | 1     | Vertical-split Phase 2 deferred + 65 view dipendenti undocumented                   |
| `high`     | 3     | macro-model `employees`, audit log enforcement gap residuo, RLS context governance  |
| `medium`   | 4     | Mat view refresh cost, index bloat `employees`, schema_migrations drift, FK domains |
| `low`      | 2     | 50 SAP shadow tables senza PK, drift documentale post-S26                           |
| `none`     | -     | -                                                                                   |

---

## Findings

### F2.1 — Vertical-split `employees` Phase 2 deferred + debito 65-view

- **Severity**: `critical` (compliance + technical debt strutturale)
- **Evidence**:
  - `db/seeds/phase16o_employees_to_view.DRAFT-DEFERRED.sql` (linee 1-22 header DEFERRED): "Apply attempt 2026-05-10 ~06:50Z FAILED at Stage 4 (DROP COLUMN) due to 65 view + 4 mat view dependencies on employees columns NOT documented in the canonical plan. Transaction rolled back, DB integrity preserved."
  - `CLAUDE.md` § Carry-forward S27+: "Phase 2 attempt S26 ha rivelato 65 view + 4 mat view dipendenti da employees cols che il plan canonical NON menzionava. Effort revised: 15-25h FTE (vs 9-14h originale)."
  - `services/app/prisma/schema.prisma:34-130`: modello `employees` con 95 colonne effettivamente integrate (PII + HR + payroll + auth `auth_password_hash` linea 116).
  - Backup pre-attempt: `heuresys_platform-pre-phase16o-20260510T044105Z.dump` (sha256 `dba5a08b…`).
- **Detail**: Phase 1 (additive) shipped: 3 satellite tables (`employees_pii`, `employees_hr`, `employees_payroll`) + sync trigger + view `employees_full`, popolate 270/270 righe senza drift. Phase 2 (DROP COLUMN x77 + conversione tabella → VIEW + INSTEAD OF triggers) progettata in `phase16o` con 6 stage atomiche e pre-flight asserts robusti, ma transaction abortita allo Stage 4 perché Postgres ha bloccato il DROP COLUMN per dipendenze CASCADE non previste. Sequenza rimanente (audit § 1.2 + L60): audit dei 65 view → save `pg_get_viewdef` → DROP CASCADE → applica phase16o → ricreare view refactorate → verificare mat view refresh e 12 hot view shape integrity.
- **Risk**:
  - **Architettura**: il modello attuale rimane "monolitico" sui 95 col, l'investimento Phase 1 (sync trigger overhead + storage doppio per 77 col) è sospeso senza payoff.
  - **GDPR/data classification**: PII + payroll + auth co-localizzati nella stessa tabella → granular access control DB-level più difficile (oggi solo RLS tenant; manca classification per categoria sensibilità).
  - **Effort recupero**: 15-25h FTE (peggio del doppio rispetto al plan canonical originale 9-14h). Probabile ulteriore re-stima al rilancio per le ricreazioni view refactor.

### F2.2 — Macro-modello `employees`: 95 col / 19 indici, scope misto

- **Severity**: `high` (design smell + GDPR posture)
- **Evidence**:
  - Audit forense L53 § 1.2: `employees` 95 col flagged `[MEDIUM]` con raccomandazione vertical-split (PII vs HR vs payroll).
  - § 1.4: 19 indici su 270 righe (worst case del repo).
  - `schema.prisma:115-120`: presenza di `auth_username`, `auth_password_hash`, `auth_role`, `auth_permissions` direttamente sulla tabella employees — co-localizzazione auth + workforce data.
- **Detail**: La tabella amalgama identificativi (id/tenant_id/pernr), PII (38 col: nome, indirizzi, documenti, contatti), HR (28 col: org chunk, contratti), payroll (11 col: salary/IBAN/banking) e auth (6 col legacy). 19 indici su 270 righe non sono problema di performance immediato ma indicatore di overload semantico.
- **Risk**:
  - **GDPR**: data subject request (right to erasure / portability) richiede per ogni richiesta join cross-categoria su tabella unica → audit logging complicato, retention policy uniforme inappropriata (PII vs payroll hanno retention diverse per legge).
  - **Performance @ scale**: 270 righe oggi. A 100k+ righe (target SaaS B2B), table bloat + index maintenance cost crescono in modo non lineare. Vacuum cost stimato significativo.
  - **Auth confusion**: 6 col `auth_*` parallele a tabella canonical `users` (NextAuth v4) suggeriscono import legacy non normalizzato (vedi sprint history Phase 13.0 mining).

### F2.3 — RLS coverage eccellente ma context governance fragile

- **Severity**: `high` (defense-in-depth gap residuo)
- **Evidence**:
  - Audit L53 § 2.1: 100% (291/291) tabelle tenant_id-aware con FK + RLS.
  - § 2.4 closure (post-S23): 13 GUC typo policies ✅ chiuse via `phase16a_audit_quick_wins.sql`.
  - `docs/20-architecture/rls-with-prisma-pattern.md:23-76`: pattern `AsyncLocalStorage + $transaction set_config` correttamente implementato.
  - **Residual gap**: pattern Prisma richiede ogni query in `$transaction` per scope GUC `local=true`. Linea 126: "ogni query DEVE essere in `$transaction`. Niente query 'fuori transazione'." Audit L53 § 7.2 + L57: `prisma.X.findMany` calls senza filtro `tenant_id` esplicito sono numerosi (rely su RLS via `withTenant()`). Lint rule app-level `tenant_id` ancora **NOT STARTED** in carry-forward S24.
- **Detail**: Il design DB-side è canonical-grade. Il rischio runtime è applicativo: una qualsiasi `findMany` chiamata fuori dal wrapper `withTenant()` (es. nuovo route handler dimenticato, BullMQ worker mal configurato, raw query) bypassa la GUC e con essa il filtro RLS effettivo. Fail-closed: zero rows (non leak), ma maschera bug runtime e degrada l'esperienza dev.
- **Risk**:
  - **Cross-tenant leak**: zero osservato grazie al fail-closed, ma il margine dipende dalla disciplina dei dev. Per acquirente con team più ampio = rischio ↑.
  - **Mitigazione**: ESLint custom rule + pre-commit hook (carry-forward stimato 2-4 FTE-hour, già scopato).

### F2.4 — Audit log enforcement gap residuo (P4)

- **Severity**: `high` (compliance/SOC 2 readiness)
- **Evidence**:
  - Audit L53 § 8.4 pre-S23: 6 audit_logs in 30 giorni · 4/5 latest con `user_id NULL` → P4 violation.
  - Closure parziale L58 (S24): helper `auditedTransaction()` mirrored su services/app + services/api-gateway. Trigger `audit_permission_changes()` broken droppato via phase16h.
  - CLAUDE.md "Test/lint state": 865 test verdi inclusi 5 test del helper auditedTransaction.
  - **Residual**: helper attivo ma adoption non sweep-completa. Mancano category audit DASHBOARD, ROLE, TENANT, EMPLOYEE in finestre 30d osservate (L53 § 8.4 categorie).
- **Detail**: Il framework P4 è canonical-grade (helper testato, atomicità garantita via transaction). Il problema è copertura: writes Prisma diretti non instrumentati saltano l'audit. Sweep estesa stimata 1-2 FTE-day in carry-forward S23-tris.
- **Risk**:
  - **Compliance**: certificazioni (SOC 2 Type II, ISO 27001) richiedono audit trail completo su writes a dati controllati. Gap copertura → finding audit esterno probabile.
  - **Forensics**: incident response degraded (attribuire una modifica a un actor diventa impossibile per writes non instrumentati).

### F2.5 — Materialized view refresh: cost & schedule visibility

- **Severity**: `medium`
- **Evidence**:
  - Audit L53 § 1.8: 5 mat views (`mv_cross_tenant_rollup`, `mv_tenant_owner_rollup`, `mv_occupation_similarity` 69k righe, `mv_talent_signals`, `mv_employee_performance_context`).
  - Closure S24 L58: systemd timer ogni 4h UTC shipped (`docs/40-operations/dbms-mat-views-refresh.md`).
  - Carry-forward CLAUDE.md: "pg_cron migration future: se installato, sostituire systemd timer".
- **Detail**: Schedule attivo (no più gap di refresh come pre-S24), ma il refresh `mv_occupation_similarity` (69k righe) ogni 4h è un cost non bench-marked. A volume tenant ↑ (es. ×10 employees post-acquisizione), il refresh window può collidere con operational hours.
- **Risk**:
  - **Performance degradation finestra refresh**: vacuum + refresh + concurrent writes = potenziali lock contentions a scala.
  - **Mitigation suggested**: `REFRESH MATERIALIZED VIEW CONCURRENTLY` (richiede UNIQUE INDEX) + benchmark a volume target.

### F2.6 — FK ON DELETE strategy: pulita ma testarla

- **Severity**: `medium`
- **Evidence**:
  - `docs/_audit/2026-05-10-fk-ondelete-review.md` (file completo): 310 FK pre-S24 senza ON DELETE esplicito → tutti tagged via decision matrix L58 (8 domain × rule). Counts: Tenant CASCADE 82, Employee-ref SET NULL 70, Default CASCADE 63, Catalog RESTRICT 57, User-ref SET NULL 20, Payroll RESTRICT 12, HR-cascade CASCADE 4, Whistleblowing RESTRICT 2.
  - Post-S24 stato globale (CLAUDE.md): 0 FK NO ACTION · 646 CASCADE · 215 SET NULL · 81 RESTRICT.
- **Detail**: Decision matrix solida (priority order coerente: tenant nuke=cascade, audit/payroll/whistleblowing=restrict, employee soft-fields=set null). NON osservata una test suite che simuli `DELETE FROM tenants WHERE id=...` end-to-end per validare il subtree cleanup (oltre 80 tabelle cascade target).
- **Risk**:
  - **Tenant offboarding**: se mai eseguito un tenant delete reale, rischio orphan rows latente. Suggerito test integration "tenant nuke" su DB di staging.

### F2.7 — Schema migration drift documentale

- **Severity**: `medium`
- **Evidence**:
  - Audit L53 § 4.3: 215 `schema_migrations` entries vs 8 `.sql` files in repo (post-baseline reset ADR-0023 2026-05-07).
  - `prisma migrate status` non eseguibile (no `_prisma_migrations` table); Prisma è in `db pull/push` mode contro schema manualmente gestito.
- **Detail**: Acceptable per il pattern post-baseline (forward-only deltas) ma nuovo joiner/acquirer non può ricostruire lo schema da zero senza il dump baseline `heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump`. Dipendenza forte sul backup file.
- **Risk**:
  - **Disaster recovery / handover**: perdita del baseline dump = ricostruzione manuale da repo impossibile. Backup off-site (CLAUDE.md "off-site Oracle bucket") mitiga, ma da verificare retention policy + restore drill mensile.

---

## Strengths

- **RLS coverage 100%** (291/291 tabelle tenant-scoped con FK + policy attiva). Combo `tenant_id NOT NULL` + RLS = doppia barriera DB-level.
- **FK strategy esplicita post-S24**: zero NO ACTION default, decision matrix documentata per dominio, prevedibilità chirurgica.
- **Audit forense interno serio**: report L53 da 423 linee con 22 issue prioritizzati, closure tracking dettagliato (L54→L57 accountability), prima art che riduce drasticamente il rischio acquisizione "DB box nera".
- **Pattern RLS-Prisma canonical-grade**: AsyncLocalStorage + transaction-scoped GUC è approach moderno e robusto. Documentazione `rls-with-prisma-pattern.md` chiara per onboarding senior dev.
- **Backup hygiene**: baseline dump + pre-phase backup (380MB phase16o), sha256 verifiable. Dimostra discipline DBA.
- **Phase 1 vertical-split additivo eseguito senza drift**: 270/270 satellite popolati, pre-flight asserts robusti. La saga è in pausa ma su base solida.

## Open questions (Phase 2 vertical-split)

1. **Come si risolve il debito 65-view?** Le opzioni realistiche:
   - **Opzione A — Audit + refactor view (path canonical L60)**: ~15-25h FTE. Path tecnicamente pulito ma costoso. Richiede sessione dedicata e probabilmente DBA senior + dev senior in tandem.
   - **Opzione B — Abandon Phase 2**: lasciare tabella `employees` 95 col, dismettere satellite tables di Phase 1, archiviare phase16o. Recupera storage e rimuove sync trigger overhead. Rinuncia al benefit GDPR/granular access.
   - **Opzione C — Hybrid**: mantenere satellite per nuove letture sensibili (PII/payroll vista solo via satellite con grants distinti), lasciare `employees` come "wide-read" view di compatibilità. Compromesso: doppio scrittore (sync trigger persistente).
   - **Raccomandazione acquirente**: Opzione A nei primi 60 giorni post-deal, finanziata come "data architecture clean-up" voce di integration cost. ~3 giorni dev + 1 giorno DBA + 1 giorno QA regression.
2. **Scaling test**: a 100k employees x 20 tenant, mat view refresh window e RLS overhead sono benchmark verified? Suggerito perf bench in due diligence tecnica continuativa.
3. **Tenant offboarding drill**: il cascade chain è mai stato testato end-to-end? Suggerito test integration su clone DB.
4. **Catalog DB sync**: `09-asset-showcase` SQLite localhost (CLAUDE.md "no sync con postgres = scope architetturale separato, mai approvato"). Acquirente chiarire se rientra in scope acquisizione.

## Acquirer perspective

**Sintesi**: schema design è ben sopra la media per SaaS B2B early-stage. Il design multi-tenant è canonical (RLS DB-level, GUC convention coerente, FK strategy esplicita), il livello di documentazione interna (audit forense + decision matrix + ADR-0023…26) è raro in repo di questa fase. Il debito tecnico residuo è **noto, quantificato, ed isolato** — non scoperto in audit, ma già tracciato dal team con effort estimate pubblici.

**Valutazione D2 preliminary**: **NEGOTIATE**. Buy non gratuito; i tre tier-1 finding (vertical-split deferred, macro-model employees, audit log gap) richiedono ~25-40 FTE-day cumulativi nei primi 90 giorni post-acquisizione. Da negoziare:

- Sconto prezzo o earn-out clause su completamento Phase 2 vertical-split entro 90 giorni.
- Hand-over DBA senior con accesso live per validation drill (tenant nuke, mat view perf, restore).
- Garanzia retention policy backup off-site documentata (RTO/RPO in ADR).

**Phase 2 deferred = blocker o gestibile?** **Gestibile** ma non trascurabile. Il debito è quantificato (15-25h FTE), il backup pre-attempt è preservato, il rollback è già avvenuto cleanly senza data loss. NON è un finding "skeleton in closet" ma un classico "deferred refactor". Il rischio è di compounding: se Phase 2 non viene completata, i 5 mat view + 65 view restano frozen su una tabella che il team intendeva splittare → ogni feature futura che tocca `employees` deve gestire la doppia scrittura sync trigger e il design rimane semantically overloaded. Chiusura entro 6 mesi post-deal raccomandata.

**Top 3 finding ordinati per urgenza acquisizione**:

1. F2.1 — Phase 2 deferred (clausola earn-out o sconto)
2. F2.2 — `employees` macro-model (GDPR posture audit pre-onboarding clienti enterprise)
3. F2.4 — Audit log enforcement (compliance prerequisite per certificazioni)
