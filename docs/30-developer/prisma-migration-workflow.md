# Prisma Migration Workflow — Heuresys evo

> Schema canonical: `services/app/prisma/schema.prisma` (566 modelli, post db pull 2026-05-02).
> DB target: PostgreSQL bare-metal (vedi `db/` per baseline SQL legacy).

## Comandi chiave

| Comando                                   | Quando                   | Effetto                                                  |
| ----------------------------------------- | ------------------------ | -------------------------------------------------------- |
| `prisma migrate dev --name <desc>`        | Development              | Genera SQL diff + applica + rigenera client              |
| `prisma migrate deploy`                   | Production / CI          | Applica solo migration pendenti, **non** rigenera client |
| `prisma migrate status`                   | Drift detection          | Mostra divergenza schema ↔ migration history ↔ DB        |
| `prisma migrate resolve --applied <name>` | Baseline DB esistente    | Marca migration come applicata senza eseguirla           |
| `prisma migrate reset`                    | DEV only                 | Drop schema → riapplica da zero → seed                   |
| `prisma db seed`                          | Dopo migrate dev / reset | Esegue `prisma/seed.ts`                                  |
| `prisma generate`                         | Dopo edit manuale schema | Rigenera `@prisma/client`                                |

## Naming convention

Formato: `<YYYYMMDDHHMMSS>_<short_description>` — timestamp UTC + snake_case ≤50 char.

Esempi validi:

- `20260502143000_add_employee_locale_field`
- `20260502150000_index_audit_log_tenant_created`

Esempi invalidi (rifiutare in PR):

- `quick_fix.sql` (no timestamp)
- `20260502_AddField` (no time, camelCase)

Prisma genera automaticamente il prefisso quando si usa `migrate dev --name`.

## Baseline su DB esistente (situazione evo 2026-05-02)

Lo schema è stato estratto via `prisma db pull` da DB esistente con 566 modelli. Per integrare migration history:

```bash
# 1. Crea cartella migration vuota con SQL coerente con stato attuale
mkdir -p services/app/prisma/migrations/20260502000000_baseline_v1
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel services/app/prisma/schema.prisma \
  --script > services/app/prisma/migrations/20260502000000_baseline_v1/migration.sql

# 2. Marca come applicata (DB già contiene le tabelle)
npx prisma migrate resolve --applied 20260502000000_baseline_v1

# 3. Verifica drift = 0
npx prisma migrate status
```

Da qui in poi ogni nuova modifica passa da `prisma migrate dev`.

## Drift detection

`prisma migrate status` rileva 3 stati problematici:

1. **Migration history modificata** — qualcuno ha editato un file `migration.sql` già applicato. Risoluzione: rigenerare diff in nuova migration, ripristinare il vecchio file.
2. **DB schema diverge da migration history** — modifica manuale al DB (psql diretto). Risoluzione: `prisma db pull` → diff → nuova migration `_align_drift`.
3. **Migration pending non applicata** — file presente ma `_prisma_migrations` non lo registra. Risoluzione: `prisma migrate deploy`.

In CI, fail il build se `migrate status` non è clean.

## Rollback

| Ambiente   | Strategia                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------- |
| DEV        | `prisma migrate reset` (drop + reapply + seed)                                              |
| Staging    | Rollback manual SQL revert + `migrate resolve --rolled-back <name>`                         |
| Production | **Mai** `migrate reset`. Forward-only: scrivi nuova migration `_revert_<X>` con SQL inverso |

Forward-only in prod è imposto dal vincolo P4 (audit logged): rollback distruttivi cancellano audit trail.

## Seeding

File: `services/app/prisma/seed.ts`. Configurato in `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Pattern minimo (rispetta P1 multi-tenant, P9 data-driven):

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Idempotente: usa upsert su unique key
  const platformTenant = await prisma.tenant.upsert({
    where: { code: 'PLATFORM' },
    update: {},
    create: { code: 'PLATFORM', name: 'Heuresys Platform', isPlatform: true },
  });
  // Seed RBP roles, areas, perspectives, navigation — sempre via DB, mai array hardcoded
}

main().finally(() => prisma.$disconnect());
```

## Workflow completo: aggiungere campo a `users`

```bash
# 1. Modifica schema
$EDITOR services/app/prisma/schema.prisma
# aggiungi: locale String @default("it") nel model User

# 2. Genera + applica + rigenera client
cd services/app
npx prisma migrate dev --name add_user_locale

# 3. Verifica
npx prisma migrate status                    # → "Database schema is up to date"
psql -d heuresys_evo -c "\d users" | grep locale

# 4. Aggiorna codice consumer (api-gateway, app)
# 5. Commit: feat(db): add user.locale field for i18n preference
```

CI verifica: `prisma generate` non produce diff non committati, `prisma migrate status` clean.

---

## Appendix: legacy `db pull` workflow (RTGB B2, pre 2026-05-02)

> **Status**: Historical reference. Il workflow attuale usa `prisma migrate dev/deploy` (sezioni sopra). Questa appendix documenta l'approccio legacy che ha portato alla baseline 2026-05-02 (566 modelli post `db pull`).

In greenfield evo era stato adottato **introspection** (`prisma db pull`) come source of truth, NON `prisma migrate`. Lo schema DB era owned dalle migration SQL in `db/migrations/`, e Prisma era solo un typed query client mirroring quello schema.

### Flow legacy

```
db/migrations/*.sql   ←  authoritative DDL (psql)
        │
        ▼
   psql apply        →  Postgres state
        │
        ▼
   prisma db pull    →  prisma/schema.prisma (services/<svc>/)
        │
        ▼
   prisma generate   →  @prisma/client typings
```

### Daily commands legacy (per service)

```bash
# 1. Apply SQL migrations (canonical via db/scripts/migrate.sh)
DATABASE_URL=... db/scripts/migrate.sh

# 2. Pull DB schema into Prisma
cd services/api-gateway   # or services/app
npx prisma db pull --schema=prisma/schema.prisma

# 3. Optional: prune (remove tables not used by this service from schema)
./scripts/prune-prisma-schema.sh   # see services/api-gateway/scripts/

# 4. Regenerate client
npx prisma generate
```

### Verify in sync legacy (RTGB B2.1)

`scripts/hardening/prisma-verify.sh <workspace>` esegue temp `db pull` + diff vs `schema.prisma` committato. Exit non-zero on drift.

```bash
DATABASE_URL=... ./scripts/hardening/prisma-verify.sh services/api-gateway
```

Wired come husky pre-commit gate (B2.2) solo quando `schema.prisma` è staged.

### RLS coverage legacy (RTGB B2.3)

`db/scripts/rls-coverage.sql` enumera tenant-aware tables e valida RLS pattern (vedi ADR-0008/0010).

```bash
psql "$DATABASE_URL" -f db/scripts/rls-coverage.sql
```

### Rationale legacy "introspection-first"

- Legacy `.com.evo` aveva standardizzato raw SQL migrations + introspection
- `prisma migrate` avrebbe richiesto a Prisma owning della migration history, in conflitto con DDL hand-written che includeva RLS policies, triggers, e indici `pgvector` non fully introspectable da Prisma
- Pull-based generation manteneva `schema.prisma` slim (filtered via prune script per service)

### Pitfalls comuni legacy

- **Forgetting `DATABASE_URL`** prima di `db pull` → silent failure o wrong target
- **Different schemas per service** (api-gateway vs app) → run prune script per ogni service
- **RLS during `db pull`**: introspection runs come connecting role. Use BYPASSRLS role (`heuresys_app_admin`) per full schema visibility

### Migration to current workflow (2026-05-02)

Il greenfield è transitato a `migrate dev/deploy` post baseline. Il workflow legacy `db pull` rimane utile per:

- Re-baseline puntuale dopo modifiche manuali al DB (drift detection)
- Audit periodico schema vs codice
- Bootstrap di un nuovo servizio che deve generare il proprio `schema.prisma`

Per workflow operativo corrente: vedi sezioni sopra (Daily commands, Naming convention, Drift detection, Rollback, Seeding).
