# scripts/seed-generator/ — CASCADIA Realistic Universe Seeding Pipeline

> **Plan canonical**: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
> **Lexicon**: [`docs/_meta/lexicon.md`](../../docs/_meta/lexicon.md) (16 sigle)
> **Stato**: skeleton S35.2 — stages popolati progressivamente S35.3+

Pipeline multi-stage di Realistic Industry-Flavored Seeding per i 4 tenant `heuresys_platform`. Architettura organizzata per sigle canonical del lexicon. Ogni directory `<sigla>/` corrisponde a una catena relazionale del lexicon.

## Directory layout

| Directory   | Sigla    | Responsabilità                                                                                                       |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `cascadia/` | CASCADIA | Orchestrator end-to-end pipeline (run-pilot, run-extension, run-stage)                                               |
| `indoor/`   | INDOOR   | Web research industry profile generation + ESCO/Eurostat/OECD fetch + LLM synthesis                                  |
| `opourska/` | OPOURSKA | 7-layer ontology seeding (Org → Process → OrgUnit → Role → Skill → KPI → Assessment)                                 |
| `progov/`   | PROGOV   | Workflow + approval chains + compliance frameworks + audit policies                                                  |
| `gokmer/`   | GOKMER   | Performance reviews + calibration + goals/OKRs + KPI targets                                                         |
| `talpipe/`  | TALPIPE  | Career paths + succession_pipeline (semantic-driven) + talent pools + mentorship                                     |
| `skilgro/`  | SKILGRO  | Learning paths + course enrollments + certifications + recommendations                                               |
| `h2r/`      | H2R      | Recruiting requisitions + candidates + interviews + offers + onboarding                                              |
| `smerto/`   | SMERTO   | Salary bands + assignments + merit cycles + bonus allocations                                                        |
| `pulsar/`   | PULSAR   | Engagement surveys + pulse checks + responses + action plans                                                         |
| `itlab/`    | ITLAB    | Time-off + attendance + holiday calendars (CCNL-aware) — complementa phase18d                                        |
| `dgov/`     | DGOV     | Employee documents + signatures + retention + notifications + webhooks                                               |
| `eskap/`    | ESKAP    | ESCO catalog projection (14k skills + 3k occupations + 126k relations) + tenant projection                           |
| `epra/`     | EPRA     | AI/predictive seeding (turnover risk + performance predictions + recommendations)                                    |
| `lib/`      | —        | Shared helpers (distributions, rls-tx, esco-grounded, industry-research, audit-emit, semantic-query, openai-wrapper) |

## Stato implementazione

| Stage                                          | Status         | Note                                                          |
| ---------------------------------------------- | -------------- | ------------------------------------------------------------- |
| S35.0 Forensic precondition                    | ✅ closed      | role_default_dashboards Prisma model added (audit 95% → 100%) |
| S35.1 ITLAB phase18d                           | ✅ closed      | 22 sindacati + 12 RSU + 4 tenant↔CCNL + 9 CCNL_COMM levels    |
| S35.2 Infrastructure + Lexicon                 | ⏳ in progress | Skeleton + lexicon.md + lib helpers                           |
| S35.3 Pilot RTL Bank (14 stage)                | pending        | Industry research + INDOOR cascade + OPOURSKA full + ...      |
| S35.4 Extension SmartFood + EcoNova + Heuresys | pending        | Replica pilot pattern per 3 tenant                            |
| S35.5 ESKAP KG full projection                 | pending        | 14k+3k nodes + 126k+5.8k edges                                |
| S35.6 Dashboard binding + F-008                | pending        | Sweep registry.tsx + persona_label rename                     |
| S35.7 Verification + handoff                   | pending        | 25-area SQL checks + Chrome MCP walkthrough                   |

## Convenzioni

### Idempotency

Ogni script SQL/JS emette INSERT con `ON CONFLICT DO NOTHING` o `ON CONFLICT DO UPDATE`. Re-run safe.

### Backup pre-stage

Mandatory: `pg_dump -Fc heuresys_platform -f /var/backups/heuresys-evo/heuresys_platform-pre-<stage>-<ts>.dump` + sha256 logged.

### RLS-aware tx

Ogni write tramite `lib/rls-tx.mjs` che esegue `SET LOCAL app.current_tenant_id = $tenantUuid` (P5 enforcement).

### Audit trail

Ogni write emette `audit_logs` row pre-commit via `lib/audit-emit.mjs` (P4 `auditedTransaction()` pattern).

### Cost cap LLM

Riuso `services/app/src/lib/ontology/openai-client.ts` con `OPENAI_COST_CAP_USD_DAILY=5`. Cache versionato in `db/seeds/realistic/_research_cache/`.

## Run patterns

```bash
# Pilot end-to-end RTL Bank
node scripts/seed-generator/cascadia/run-pilot.mjs --tenant=rtl-bank

# Single stage re-run (es. failed assessment generator)
node scripts/seed-generator/cascadia/run-stage.mjs --tenant=rtl-bank --stage=gokmer/21_assessments

# Extension full (SmartFood + EcoNova + Heuresys)
node scripts/seed-generator/cascadia/run-extension.mjs --skip-rtl-bank

# Force refresh industry research cache (rare)
node scripts/seed-generator/indoor/00_research_industry.mjs --refresh --tenant=rtl-bank
```

## Verification

Ogni stage emette report con row counts + sha256 SQL eseguito. Master verification: `scripts/seed-generator/cascadia/verify-25-area.mjs` esegue tutte le 25-area SQL checks.

## Rollback

```bash
# Per tenant
psql -d heuresys_platform -f db/seeds/realistic/_rollback/rollback_<tenant>.sql

# Full pipeline (4 tenants)
psql -d heuresys_platform -f db/seeds/realistic/_rollback/rollback_full.sql
```

Rollback rispetta CASCADE FK (646 active). Idempotente.

## Riferimenti

- Plan: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Lexicon: `docs/_meta/lexicon.md`
- ADR-0027: CASCADIA pipeline (TBD S35.7)
- ADR-0028: ITLAB tables design (TBD S35.7)
- ADR-0029: Lexicon canonical (TBD S35.7)
- Operating baseline: `docs/_meta/operating-baseline.md`
- Forensic audit baseline: `docs/_audit/2026-05-09-forensic-db-audit.md`
- STATE.md: `.handoff/STATE.md`
