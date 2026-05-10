# D6 — Test Coverage, Quality Discipline & Automation Assessment

**Auditor**: Senior QA & Test Automation Engineer (M&A DD team)
**Target**: heuresys-evo (greenfield rewrite di heuresys.com.evo)
**Data**: 2026-05-10
**Scope**: discipline test, pyramid balance, gap coverage, automation, CI gating
**Verdict preliminare D6**: **NEGOTIATE** (vedi §Acquirer perspective)

---

## TL;DR (≤80 parole)

865 test verdi, skip rate 1.2% tutto justified-by-env (`HAS_FULL_STACK` guard pulito, no `it.skip` orfani, no `it.todo`). Pyramid sano con bias unit-heavy (97% unit, 3% E2E). Discipline forte: Vitest 4 + Playwright + jest-axe + WCAG E2E + 100/100 RBP matrix verde. **Gap critico**: zero integration test reali contro DB (testcontainers ADR-0002 ancora `Proposed` da 13 giorni, helper mai implementato), zero mutation/property-based, zero RLS bypass tests, zero load test in CI. **Coverage thresholds dichiarate ma non emesse in CI**.

---

## Severity overview

| Severity     | Count | Findings                               |
| ------------ | ----- | -------------------------------------- |
| **Critical** | 0     | —                                      |
| **High**     | 3     | F6.1 · F6.2 · F6.3                     |
| **Medium**   | 4     | F6.4 · F6.5 · F6.6 · F6.7              |
| **Low**      | 3     | F6.8 · F6.9 · F6.10                    |
| **None**     | —     | (strenghts riconosciuti in §Strengths) |

---

## Findings

### F6.1 — [HIGH] Integration test contro DB reale: assenti, ADR-0002 ancora Proposed

**Evidence**:

- `docs/50-reference/decisions/0002-database-testing-strategy-ci.md` Status = **Proposed**, Date `2026-04-27` (13 giorni dormiente)
- `Grep testcontainers` → 16 hits, **tutti in docs/archive/CHANGELOG**, zero in `services/**/__tests__/`
- `Grep PostgreSqlContainer|startTestPostgres` → 0 occorrenze in source code
- `quality.yml` job `test` invoca `npm run test:integration` con `DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}` ma il secret è uno stub (vedi ADR-0002 §Context "il secret non è configurato e i test integration non esistono ancora")
- 462 test api-gateway sono **tutti unit con Prisma mockato** (vi.mock conta = 8 file × multipli mock, riferimento `services/api-gateway/src/routes/__tests__/*.test.ts`)

**Detail**: la strategia integration esiste solo on paper. I test "integration" eseguiti in CI sono di fatto unit con Prisma mockato che non esercitano: vincoli FK reali (646 CASCADE · 215 SET NULL · 81 RESTRICT post-S24), 367 RLS policies, 5 mat views auto-refresh, trigger di sync dei satellite tables `employees_pii/hr/payroll`. Il delta schema-mock vs schema-reale è il bug più frequente in production (lo dice ADR-0002 stesso, §Alternatives, sul mock totale).

**Risk**: regressioni RLS, FK orphan, trigger drift non rilevabili in CI. La promessa "P5 RLS DB-level" (CLAUDE.md) non è enforced da test automatici. Schema migrations possono passare CI verde e rompere production.

**Mitigation cost stimata**: 8-16h FTE per implementare helper `packages/shared/test-utils/postgres-container.ts`, portare 5-10 test critici a integration reale, attivare il job in CI.

---

### F6.2 — [HIGH] Coverage thresholds dichiarate ma non enforced in CI

**Evidence**:

- ADR-0011 §Coverage targets: api-gateway 70/60/70/70, app 50/40/50/50, ui 80/70/80/80, shared 90/85/90/90
- ADR-0011 §Threshold enforcement: "_`vitest.config.ts` per workspace ha `test.coverage.thresholds`. Failure threshold blocca il run._"
- `quality.yml` job `test` esegue `npm run test:unit` + `npm run test:integration` — **nessuna invocazione `--coverage`**, nessun upload artifact, nessun coverage gate
- Nessun report Codecov/Coveralls integrato

**Detail**: i threshold esistono nel config dei workspace ma sono "validi solo se qualcuno li lancia". In CI non vengono mai eseguiti, quindi un PR può mergeare codice non testato senza che nessun gate scatti. La CI gating si limita a "i test esistenti passano".

**Risk**: erosione progressiva coverage senza warning. Acquirer non può misurare drift coverage trimestre su trimestre. Soglia globale aggregata 70% lines/60% branches dichiarata in ADR ma **non verificata**.

**Mitigation cost**: 1-2h (aggiungere `npm run test:coverage` step in `quality.yml` + upload Codecov + branch protection check).

---

### F6.3 — [HIGH] RLS bypass / cross-tenant isolation: zero test dedicati

**Evidence**:

- `Grep "RLS|row.level.security|SET LOCAL app\.current_tenant"` su `services/**/*.test.ts` → **1 solo file**: `services/api-gateway/src/routes/__tests__/employees.test.ts` (e contiene solo riferimenti, non test attivi RLS bypass)
- `Grep "tenant.bypass|cross.tenant|tenant.isolation"` → 97 file totali ma sono **tutti docs/seed/route source**, zero test che tentino injection cross-tenant
- 312 tabelle `tenant_id NOT NULL` · 367 RLS policies attive (CLAUDE.md) — superficie enorme, copertura test = 0

**Detail**: P1 (multi-tenant always) e P5 (RLS DB-level) sono i principi più critici per un SaaS B2B con 4 tenant compartmentalized. Non esiste un test che simuli un attaccante con JWT tenant A che tenta di leggere/scrivere dati di tenant B. Tutta l'evidenza di safety è "guardiamo che il codice chiami `requirePermission`" — non "abbiamo verificato che il DB rifiuti la query se passa il middleware".

**Risk**: vulnerabilità GDPR/data-breach class-1 non rilevabile pre-merge. In contesto M&A questo è un finding che un acquirer enterprise (es. private equity o strategic con compliance team) marcherebbe come **show-stopper preliminare** in attesa di rimedio.

**Mitigation cost**: 6-10h per writing di una RLS test suite (~15-20 test mirati su tabelle critiche: employees, audit_logs, role_default_dashboards, performance_reviews) — richiede prima F6.1 risolto.

---

### F6.4 — [MEDIUM] E2E coverage molto magro — 3 spec file, 1 critical-path solo

**Evidence**:

- `Glob services/app/tests/e2e/*.spec.ts` → 3 file: `auth.spec.ts` (4 test), `dashboard.spec.ts`, `dashboard-rbp-matrix.spec.ts` (72 cases matrix + 1 anchor)
- Su 865 test totali, gli E2E sono **76 cases** = 8.8% del totale, ma effettivamente ~5 test "logici" (login render, redirect, login success, login fail, RBP matrix loop)
- E2E mancanti per flussi critici business: tenant onboarding, employee CRUD lifecycle, role assignment, audit log inspection, dashboard widget customization, bulk import/export, password reset, session expiry

**Detail**: l'E2E che esiste è ben fatto (RBP matrix 8×9=72 cases con stessa logica, login canonical 8/8 PASS bcrypt match end-to-end è un gold standard). Ma copre solo "user logga + apre dashboard". Il resto del journey utente è coperto solo da unit test mockati.

**Risk**: regressioni cross-component (es. cambio middleware auth rompe employee CRUD) non rilevabili. Performance regressions (es. RBP cache miss su listing employees) invisibili.

**Mitigation cost**: 12-20h per portare E2E a coprire ~10 user journey critici.

---

### F6.5 — [MEDIUM] Mock-heavy unit test in api-gateway: bilanciamento da verificare

**Evidence**:

- `Grep vi.mock|vi.fn|vi.spyOn` count → **323 occorrenze su 44 file**
- `Grep describe|it|test` count → **535 occorrenze su 39 file** in `services/api-gateway/src`
- Ratio ~0.6 mock-call per test → indicativo di test pattern "isolated unit" tipico ma con superficie mock ampia (Prisma client, audit helper, JWT decoder)

**Detail**: 462 test su api-gateway è un numero impressivo, ma se ogni test mocka Prisma e l'auditedTransaction(), si testa il _flusso_ del controller, non l'integrazione vera. È il pattern "test ceremony" classico: alta numerosità, valore protettivo medio. Bias rilevato: alcuni test sembrano testare "il framework chiama il framework" invece che "la business rule X passa dal controller al DB integro".

**Risk**: false sense of confidence dato dal numero alto. Coverage % alta su righe ma branch coverage delle business rule (es. RBP cache invalidation, audit log atomicity) potenzialmente bassa. Senza F6.2 (coverage emesso) non si può validare.

**Mitigation cost**: review pattern esistenti (~4h) + introdurre testing-library style "behavior over implementation" nelle 5 route più critiche (~8h).

---

### F6.6 — [MEDIUM] Mutation testing assente

**Evidence**:

- `Grep stryker|@stryker-mutator` → 0 occorrenze
- ADR-0011 non menziona mutation testing nemmeno in §Future work

**Detail**: con 865 test ma coverage non emesso (F6.2) e mock-heavy (F6.5), mutation testing sarebbe lo strumento standard per validare la qualità reale delle assert. Stryker su `packages/shared` (90% coverage target, libreria pura) sarebbe il quick win di entry.

**Risk**: test che passano anche se la business logic è rotta (assert weak / no-op). Frequente in code-base con AI-assisted test generation.

**Mitigation cost**: 4-6h per setup Stryker su `packages/shared` + nightly run + survival report.

---

### F6.7 — [MEDIUM] Property-based testing assente

**Evidence**: `Grep fast-check|@fast-check|fc.assert|fc.property` → 0 occorrenze.

**Detail**: per validare zod schemas, RBP role rank arithmetic (-1 SUPERUSER → 6 EMPLOYEE), permission matrix, ESCO ID validation, NACE code parsing — fast-check sarebbe ROI altissimo (genera 100+ casi edge per ogni invariante con poche righe). 82 test su `packages/shared` sono tutti example-based.

**Risk**: edge case non coperti (UUID malformati, stringhe Unicode in employee names, NULL propagation in ESCO graph traversal) emergono in production.

**Mitigation cost**: 6-8h per coprire i 5 invarianti più critici di shared.

---

### F6.8 — [LOW] Skip rate 1.2% tutto justified — but conditional explosion attenzione

**Evidence**:

- 5 `test.skip(!HAS_FULL_STACK, ...)` su 4 file E2E (verificato grep esaustivo, zero `it.todo`, zero `it.skip()` senza condition, zero `xdescribe`/`xit`)
- Pattern: `const HAS_FULL_STACK = !!process.env.DATABASE_URL && !!process.env.AUTH_SECRET && !!process.env.NEXT_PUBLIC_API_URL;`

**Detail**: gli skip sono environment-gated, non test abbandonati. Pulito. **Ma**: in CI questi skip non scattano mai perché `DATABASE_URL_TEST` secret esiste come stub (F6.1) — quindi la condizione è "se nei test E2E lanciati in dev/staging gira lo stack completo". Il design è onesto ma coverage E2E in CI è effettivamente ~0 sui flussi auth-required.

**Risk**: basso. Documentato e intenzionale.

---

### F6.9 — [LOW] Workflow CI ben architettato — 4 workflow, handoff-only fast-path

**Evidence**: `quality.yml` (lint+typecheck+test+build), `security.yml` (nightly), `storybook.yml`, `a11y.yml` (commit `95b08d0` workflow consolidation S11). Composite action `setup-node-prisma` come SoT cache. Guard `handoff-only-detect` evita di girare CI pesante per PR docs-only.

**Detail**: pattern industry-standard ben implementato. Fast-green per docs-only è un pattern raro e vincente. Concurrency group + cancel-in-progress riduce spreco runner.

**Risk**: nessuno significativo.

---

### F6.10 — [LOW] Performance/load test out-of-CI — script standalone esistenti

**Evidence**: `scripts/perf/autocannon-prod.mjs` + `scripts/perf/views-prod-bench.mjs` esistono. Risultati salvati in `scripts/perf/results/views-prod-2026-05-08T*.{md,json}` (6 run S24).

**Detail**: load testing con autocannon è scriptato ma non integrato in CI nightly. Roadmap §5 lo cita come "Production build perf bench (~1-2h, target P95 ≤ 500ms)".

**Risk**: regressioni performance silenziose. ROI medio rispetto a F6.1-F6.3.

---

## Test pyramid analysis

| Layer             | Count | %        | Tool                          | Quality                                   |
| ----------------- | ----- | -------- | ----------------------------- | ----------------------------------------- |
| Unit (mock-heavy) | 783   | 90.5%    | Vitest 4                      | Alta numerosità, mock-density 0.6/test    |
| Component (DOM)   | ~177  | 20.5%    | Vitest jsdom + RTL            | A11y testing baked-in (jest-axe)          |
| Integration (DB)  | **0** | **0%**   | (testcontainers ADR Proposed) | **Gap critico (F6.1)**                    |
| E2E               | ~5-76 | 0.6-8.8% | Playwright                    | RBP matrix gold-standard, breadth limited |

Pyramid è **invertita rispetto al rischio**: tanto unit dove i bug sono cheap, zero integration dove i bug sono catastrofici (RLS, FK, audit). Industry baseline per SaaS B2B mature: 70% unit / 25% integration / 5% E2E. Heuresys-evo: 91% unit / 0% integration / ~1% E2E effettivo in CI.

---

## Coverage gap analysis (domini under-tested)

| Dominio                               | Test presenti                                               | Gap evidence-based                         |
| ------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ |
| RBP middleware                        | 14 + 4 (rbp-cache, rbac, auth)                              | mock-heavy, no integration con DB          |
| RLS enforcement                       | 0 RLS bypass tests                                          | F6.3                                       |
| audit_logs atomicity                  | auditedTransaction.test.ts (×2)                             | unit only, no rollback testing reale       |
| Tenant onboarding                     | tenants.test.ts 34 cases                                    | mock, no E2E di provisioning end-to-end    |
| Migration integrity                   | `db/__tests__/migration-integrity.test.sh` (1 shell script) | non in CI quality.yml                      |
| Mat views refresh                     | 0 tests                                                     | systemd timer, no smoke test post-refresh  |
| pgvector / embeddings                 | esco.test.ts 8 cases                                        | nessun test su similarity threshold tuning |
| Vertical-split sync trigger employees | 0 tests                                                     | trigger SQL non coperto                    |
| Password policy / bcrypt              | password-policy.ts (4 tests)                                | OK                                         |
| Cross-service JWT (v4↔v5)             | jwt-v4-decoder.test.ts (8 cases)                            | gold-standard                              |

---

## Strengths (riconosciuti)

1. **865 test verdi**: cifra eccellente per progetto giovane (boot 2026-04-27, 13 giorni di codice).
2. **Skip rate 1.2% completamente justified**: zero test orfani, zero `it.todo`, pattern `HAS_FULL_STACK` pulito e onesto.
3. **RBP matrix 100/100 (8 ruoli × 9 dashboards)**: pattern riusabile data-driven, regressioni RBP catturate immediatamente.
4. **Login canonical 8/8 PASS bcrypt match end-to-end**: un test E2E vero che valida hash compatibility, raro vederlo così pulito.
5. **A11y first-class**: jest-axe in setup, `wcag-aaa.spec.ts` in E2E, ADR-0011 lo eleva a "first gate".
6. **Discipline pre-commit**: husky + lint-staged + commitlint enforced, no bypass culturalmente accettato (nemmeno R11 lo permette).
7. **CI architettura solida**: 4 workflow segregati, handoff-only fast-path, composite action SoT, concurrency cancel.
8. **ADR-0011 rigoroso**: tier per workspace differenziati, rationale esplicito, alternative considerate.
9. **Cross-service JWT decode 11/11**: la complessità reale (NextAuth v4 cookie + jose + HKDF) testata seriamente.
10. **Test fixtures shared canonical**: 4 tenant UUID + 8 canonical users in `tests/.test-env` SoT (post-L51).

---

## Open questions per management/seller

| #   | Domanda                                                                                       | Why it matters                     |
| --- | --------------------------------------------------------------------------------------------- | ---------------------------------- |
| Q1  | Quando ADR-0002 verrà promosso `Accepted` e i primi integration test scritti?                 | F6.1 risolution timeline           |
| Q2  | Esiste un piano per RLS bypass test suite? Su quali tabelle prioritarie?                      | F6.3, GDPR/compliance              |
| Q3  | Coverage attuale misurata almeno 1 volta in locale: che % lines/branches per workspace?       | F6.2 baseline                      |
| Q4  | Mutation testing è considerato fuori scope (cost/benefit) o solo deferred?                    | Calibrazione qualità test          |
| Q5  | Property-based testing su shared zod schemas: già valutato e scartato?                        | ROI per shared lib                 |
| Q6  | Load test in CI nightly su 8 viste auth-required: quando?                                     | Roadmap §5, perf SLA               |
| Q7  | Migration-integrity.test.sh perché è una shell script invece che vitest? Quando entra in CI?  | Drift schema/migration risk        |
| Q8  | Branch protection rimossa post-S11: chi/cosa garantisce CI verde pre-merge se non ci sono PR? | Disciplina del solo-coder workflow |

---

## Acquirer perspective

### Per acquirer enterprise (PE / strategic con compliance team)

**Soglia tipica enterprise**: 70%+ branch coverage, integration test reali contro DB, mutation testing su core domains, security test (incluso tenant isolation per multi-tenant SaaS), nightly perf regression. **Heuresys-evo soddisfa: parzialmente**. La discipline è alta (la più alta vista in scale-up greenfield 13-giorni-vecchi), ma le coperture di **rischio compliance** (RLS, GDPR-relevant, audit atomicity reale) sono carta. Un compliance officer chiede: _"mostratemi il test che dimostra che tenant A non legge dati di tenant B"_ — non c'è.

### Per acquirer technical (engineering-led)

Apprezzeranno: ADR-0011 rigore, fixtures canonical, JWT cross-service test, RBP matrix data-driven. Storceranno il naso: integration ADR Proposed da 13 giorni, mock density alta in api-gateway, coverage non enforced. Il sentore è "team che sa cosa fare ma non ha avuto ancora il tempo" — credibile dato l'età del repo, ma da chiudere pre-close acquisition.

### Verdict D6: **NEGOTIATE**

- **Non è BUY** perché 3 finding HIGH (F6.1, F6.2, F6.3) toccano enforcement di principi P1/P5 dichiarati core. Per un SaaS B2B multi-tenant la mancanza di RLS bypass test è una red flag che richiede remediation contrattuale.
- **Non è PASS** perché il foundation discipline è eccellente (ADR-0011, RBP matrix, JWT cross-service, a11y first-class, skip rate 1.2% pulito, 865 test verdi). Il gap è in **estensione/profondità**, non in **competenza**.
- **NEGOTIATE**: includere nella SPA condition precedent un piano remediation 30-60-90 giorni con milestone:
  - **30 gg**: ADR-0002 Accepted + helper testcontainers shipped + 5 integration test critici in CI
  - **60 gg**: RLS bypass suite (15-20 test) + coverage emesso in CI + Codecov badge ≥ 70% branch
  - **90 gg**: mutation testing su shared (Stryker) + load test nightly autocannon + E2E breadth (10 user journey)

Stima totale remediation effort: **40-65h FTE** (~1.5-2 sprint), bassissimo rispetto al valore della platform. Nessuna delle gap è strutturale o costosa — sono "non ancora fatte", non "impossibili da fare".

---

## Files/path di riferimento

- `D:\evo.heuresys.com\docs\50-reference\decisions\0002-database-testing-strategy-ci.md` (Status: Proposed)
- `D:\evo.heuresys.com\docs\50-reference\decisions\0011-test-coverage-strategy.md` (Accepted)
- `D:\evo.heuresys.com\.github\workflows\quality.yml`
- `D:\evo.heuresys.com\.github\workflows\security.yml`
- `D:\evo.heuresys.com\.github\workflows\a11y.yml`
- `D:\evo.heuresys.com\.github\workflows\storybook.yml`
- `D:\evo.heuresys.com\services\app\tests\e2e\auth.spec.ts`
- `D:\evo.heuresys.com\services\app\tests\e2e\dashboard.spec.ts`
- `D:\evo.heuresys.com\services\app\tests\e2e\dashboard-rbp-matrix.spec.ts`
- `D:\evo.heuresys.com\services\app\tests\e2e\a11y\wcag-aaa.spec.ts`
- `D:\evo.heuresys.com\services\api-gateway\src\routes\__tests__\` (33 test files)
- `D:\evo.heuresys.com\services\api-gateway\src\lib\__tests__\jwt-v4-decoder.test.ts`
- `D:\evo.heuresys.com\db\__tests__\migration-integrity.test.sh` (out-of-CI)
- `D:\evo.heuresys.com\scripts\perf\autocannon-prod.mjs`
- `D:\evo.heuresys.com\scripts\perf\results\` (6 run histor)
