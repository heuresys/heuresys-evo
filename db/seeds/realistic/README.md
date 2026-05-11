# db/seeds/realistic/ — CASCADIA pipeline data artifacts

> **Plan canonical**: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
> **Pipeline scripts**: `scripts/seed-generator/<sigla>/`
> **Lexicon**: [`docs/_meta/lexicon.md`](../../../docs/_meta/lexicon.md)

Directory per artefatti versionati prodotti dalla pipeline CASCADIA: research cache (INDOOR), SQL emessi (gitignored), rollback scripts.

## Layout

```
db/seeds/realistic/
├── _research_cache/         # JSON industry profiles (versioned in git)
│   ├── rtl_bank_industry_profile.json    (S35.3.1)
│   ├── smartfood_industry_profile.json   (S35.4)
│   ├── econova_industry_profile.json     (S35.4)
│   ├── heuresys_industry_profile.json    (S35.4)
│   └── raw_*.json                         (raw research fetches per NACE)
├── _generated_sql/          # SQL emessi from stages (gitignored, regenerable)
│   └── <tenant>_<stage>_<timestamp>.sql
├── _rollback/               # DELETE filtered by tenant_id (CASCADE FK)
│   ├── rollback_rtl_bank.sql        (S35.3.M0)
│   ├── rollback_smartfood.sql       (S35.4)
│   ├── rollback_econova.sql         (S35.4)
│   ├── rollback_heuresys.sql        (S35.4)
│   └── rollback_full.sql            (rollback all 4 tenants)
└── README.md                # this file
```

## Run patterns

```bash
# Generate SQL for a stage (does NOT apply)
node scripts/seed-generator/cascadia/run-stage.mjs \
  --tenant=rtl-bank --stage=opourska/11_org_structure --dry-run

# Apply SQL via psql
psql -h vm -U postgres -d heuresys_platform \
  -f db/seeds/realistic/_generated_sql/rtl_bank_opourska_11_2026-05-11T17.sql

# Rollback per tenant
psql -d heuresys_platform -f db/seeds/realistic/_rollback/rollback_rtl_bank.sql
```

## Idempotency contract

Ogni SQL emesso da CASCADIA segue il pattern:

- `INSERT ... ON CONFLICT (natural_key) DO NOTHING` per nuove righe
- `INSERT ... ON CONFLICT (natural_key) DO UPDATE SET ...` per upsert
- `UPDATE ... WHERE ... AND (column IS DISTINCT FROM new_value)` per modifiche condizionali

Re-run safe: lanciare 2 volte lo stesso script produce 0 nuove righe.

## Rollback contract

Ogni `rollback_<tenant>.sql` esegue:

- DELETE FROM seed-touched tables WHERE tenant_id = (SELECT id FROM tenants WHERE code = '<tenant>')
- Ordine inverso topologico (figli prima dei genitori) per evitare FK violations
- CASCADE FK (646 active) gestiscono cleanup downstream automaticamente
- audit_logs preservati (storico, non rimosso) salvo richiesta esplicita

## Stato corrente

| File                              | Status       | Owner stage             |
| --------------------------------- | ------------ | ----------------------- |
| `_research_cache/*.json`          | non popolato | S35.3.1 (INDOOR)        |
| `_generated_sql/*.sql`            | gitignored   | S35.3+                  |
| `_rollback/rollback_rtl_bank.sql` | TBD          | S35.3.M0 backup precede |

## .gitignore

Aggiungere a `.gitignore` root:

```
db/seeds/realistic/_generated_sql/*.sql
!db/seeds/realistic/_generated_sql/.gitkeep
```

## Riferimenti

- Plan: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- Pipeline scripts: `scripts/seed-generator/README.md`
- Migration ITLAB: `db/migrations/phase18d_italian_labor_context.sql`
- Backup baseline: `/var/backups/heuresys-evo/heuresys_platform-SoT-baseline-2026-05-07T143000Z.dump`
