# heuresys-evo — Current State

> Updated: 2026-05-11T17:10Z · S35.0 + S35.1 + S35.2 closed · CASCADIA pipeline skeleton + ITLAB shipped + audit forensic 100%

## Last session brief

S35 (~3h FTE effettive, vs 13-21h stimati grazie a issue forensic già chiuse post-L57):

**S35.0 Forensic precondition (commit `d26883e`)**: 
- Audit issue #5 chiuso: `role_default_dashboards` Prisma model aggiunto (era raw-SQL only) + back-relations su `tenants` + `dashboard_presets`
- Audit issue #9 (ESLint `lint:tenant-id`) e #10 (bcrypt rotation) verificati già closed post-L57 (S23-quater): `scripts/hardening/lint-tenant-id.sh` + `authorize.ts:114-129` one-shot rehash
- Forensic audit closure: 95% → **100%**

**S35.1 ITLAB phase18d (commit `ff0bd45`)**: 
- Migration `db/migrations/phase18d_italian_labor_context.sql` applied su VM (backup pre-migration `heuresys_platform-pre-phase18d-20260511T165129Z.dump` sha256 `194613fa...`)
- 3 nuove tabelle: `sindacati` (22 rows: 4 confederazioni + 18 federazioni), `tenant_ccnl_links` (4 rows), `sindacato_tenant_links` (12 rows)
- 9 `ccnl_levels` per CCNL_COMM_2024 (Heuresys, Confcommercio Terziario canonical)
- 3 Prisma model + back-relations + RLS attiva (P5)
- Holidays IT 144 rows 2025-2027 + ccnl_contracts (7 CCNL) + ccnl_levels per CCNL_CRED/ALIM/ENERGIA già presenti pre-S35.1

**S35.2 Infrastructure + Lexicon (TBD commit)**:
- `docs/_meta/lexicon.md` SoT canonical 16 sigle (4 ✅ + 12 ⭐): OPOURSKA, PET, INDOOR, TALPIPE, H2R, SKILGRO, GOKMER, PROGOV, ESKAP, ITLAB, RBP, DGOV, SMERTO, PULSAR, EPRA, CASCADIA
- `scripts/seed-generator/README.md` + skeleton lib/: 6 helpers (rls-tx, distributions, esco-grounded, audit-emit, semantic-query, openai-wrapper, industry-research)
- `db/seeds/realistic/README.md` + `.gitignore` update per `_generated_sql/`
- `CLAUDE.md` root aggiornato con sezione "Lexicon canonical + CASCADIA pipeline"

Plan canonical: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md` (~58-94 FTE-h totali multi-sessione, S35.0+S35.1+S35.2 chiusi in ~3h grazie a vasto pre-existing).

## Top priorities

1. **S35.3 Pilot RTL Bank end-to-end** (~20-30h FTE) — 14 stage: industry research RTL + INDOOR cascade + OPOURSKA full + PROGOV + GOKMER + TALPIPE + SKILGRO + H2R + SMERTO + PULSAR + ITLAB time-off + DGOV docs/audit + ESKAP KG projection RTL + EPRA. **HUMAN GATE M1** review industry profile JSON prima di taxonomy seed. **PILOT GATE M15** validation dashboards live.
2. **S35.4 Extension SmartFood + EcoNova + Heuresys** (~15-25h FTE) — replica metodologia pilot per 3 tenant restanti con industry profile customizzato (HACCP food, ISO 50001 energy, SaaS).
3. **S35.5 ESKAP full projection** (~5-7h) — ESCO catalog 14k+3k+126k+5.8k nodes/edges + tenant projection.

## Open questions

Nessuna bloccante. Decisioni pre-S35.3 aperte:
- Industry profile generation: implementare web research live (curl ESCO REST + Eurostat + OECD) PRIMA di S35.3, oppure popolare manualmente cache JSON per pilot RTL come bootstrap?
- OpenAI cost cap $5/day sufficiente per generation 4 tenant profile + iterazioni debug? (stima budget $0.30-1.00 totale).

## Stack snapshot (post-S35.2)

- **Audit forensic**: 100% closed (era 95% post-S24+L59). Tutti i 22 issues originali del 2026-05-09-forensic-db-audit.md → chiusi.
- **ITLAB infrastructure**: completa. 22 sindacati catalog + 4 tenant↔CCNL links + 12 RSU/RSA links + 9 CCNL_COMM levels. CCNL canonical: CRED (RTL), ALIM (SmartFood), ENERGIA (EcoNova), COMM (Heuresys). Holidays IT 2025-2027 144 rows.
- **CASCADIA pipeline skeleton**: 6 lib helpers + lexicon canonical + 2 README. Sub-directory `<sigla>/` per stages saranno popolate S35.3+.
- **DGOV base**: 367 RLS policies + lint:tenant-id + auditedTransaction + 4 fk_users_role + 8 canonical users + 274 active total.
- **OPOURSKA base**: role_default_dashboards Prisma model + 8 ruoli × 34 functional areas × 179 RBP perm canonical.
- **Tests**: typecheck PASS su services/app post-S35.0 + post-S35.1. `npm run lint:tenant-id` exit 0.
- **Commits S35**: `d26883e` (S35.0) · `ff0bd45` (S35.1) · TBD (S35.2 handoff).

## Verification

```bash
git log --oneline -6
# expected: cab78bd + 150518c + 1a61d62 + f412b00 + d26883e + ff0bd45 + S35.2 commit

# S35.1 ITLAB verification
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -c "
  SELECT '\''sindacati'\'' t, count(*)::text c FROM sindacati
  UNION ALL SELECT '\''tenant_ccnl_links'\'', count(*)::text FROM tenant_ccnl_links
  UNION ALL SELECT '\''sindacato_tenant_links'\'', count(*)::text FROM sindacato_tenant_links
  UNION ALL SELECT '\''ccnl_levels_COMM'\'', count(*)::text FROM ccnl_levels WHERE ccnl_code='\''CCNL_COMM_2024'\''"'
# expected: 22 · 4 · 12 · 9

# S35.0 forensic 100% closure
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -At -c "
  SELECT count(*) FROM pg_policy WHERE pg_get_expr(polqual, polrelid) LIKE '\''%current_tenant%'\'' 
    AND pg_get_expr(polqual, polrelid) NOT LIKE '\''%current_tenant_id%'\''"'
# expected: 0 (GUC typo)

# Typecheck + lint
npx tsc --noEmit -p services/app/tsconfig.json  # expected: exit 0
npm run lint:tenant-id                          # expected: exit 0

# Lexicon canonical SoT
test -f docs/_meta/lexicon.md && wc -l docs/_meta/lexicon.md
# expected: file exists, ~120 lines

# CASCADIA pipeline skeleton
ls scripts/seed-generator/lib/
# expected: 6 .mjs files (rls-tx, distributions, esco-grounded, audit-emit, semantic-query, openai-wrapper, industry-research)
```

Riferimenti: 
- Plan canonical: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md` (16 sigle, 14 stage pipeline)
- Lexicon SoT: `docs/_meta/lexicon.md`
- Pipeline scripts: `scripts/seed-generator/README.md`
- Migration ITLAB: `db/migrations/phase18d_italian_labor_context.sql`
- Forensic audit baseline: `docs/_audit/2026-05-09-forensic-db-audit.md`
- Backup baseline pre-CASCADIA: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump` + pre-phase18d: `heuresys_platform-pre-phase18d-20260511T165129Z.dump` (sha256 `194613fa...`)
