# Prisma Data Access Pattern — Heuresys Evo

**Status**: Active (2026-05-02)
**Scope**: `services/api-gateway`, `services/enrichment`. Pattern unico per accesso al PostgreSQL 16 condiviso (566 modelli Prisma, RLS attiva su 302 tabelle).
**Audience**: backend dev evo.

## Decisione: direct service, no repository layer

Per l'evo si adotta **direct service** (i feature service iniettano `PrismaService` e chiamano `prisma.<model>.<op>` direttamente), senza repository pattern. Motivazioni:

- KISS: il legacy ha attraversato fasi di repository wrapper che si sono rivelati boilerplate puro (delegavano 1:1 a Prisma).
- Prisma client è già un'astrazione DB-agnostica con type safety end-to-end.
- Test: integration test su DB reale (test container) sono più informativi del mocking del repository.

Eccezione ammessa: se una query richiede composizione SQL complessa o riuso cross-service (es. `kg.findOccupationsForSkill`), incapsularla in un service dedicato (`KgQueryService`), non in un "repository".

## PrismaService singleton

Provider `@Global()` in `PrismaModule`. Estende `PrismaClient` con `onModuleInit` (connect esplicito) e `onModuleDestroy` (disconnect graceful):

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Niente `enableShutdownHooks` con `process.exit` listener: in NestJS 10 si usa `app.enableShutdownHooks()` in `main.ts` che invoca `onModuleDestroy` correttamente.

## Transactions: interactive vs sequential

**Sequential** (`$transaction([op1, op2])`): operazioni indipendenti, nessuna logica condizionale tra esse. Più performante (single roundtrip se `pg` supporta batch).

```typescript
const [user, profile] = await this.prisma.$transaction([
  this.prisma.user.create({ data: userData }),
  this.prisma.userProfile.create({ data: profileData }),
]);
```

**Interactive** (`$transaction(async (tx) => { ... })`): logica condizionale, branching, query intermedie. Default isolation `READ COMMITTED`; specificare `Serializable` per scenari conflict-prone (concurrent updates su risorse condivise):

```typescript
await this.prisma.$transaction(
  async (tx) => {
    const slot = await tx.bookingSlot.findUnique({
      where: { id },
      select: { capacity: true, taken: true },
    });
    if (!slot || slot.taken >= slot.capacity) throw new ConflictException('SLOT_FULL');
    await tx.bookingSlot.update({ where: { id }, data: { taken: { increment: 1 } } });
    await tx.booking.create({ data: { slotId: id, userId } });
  },
  { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10_000 }
);
```

Timeout default Prisma è 5s; alzare a 10-30s per operazioni multi-step. Mai >60s: indica design da rivedere.

## Middleware Prisma

Tre middleware registrati in `PrismaService.onModuleInit`:

1. **RLS injection** — vedi `rls-with-prisma-pattern.md`. Esegue `SELECT set_config('app.current_tenant_id', $1, true)` prima di ogni query in transazione.
2. **Soft delete** — modelli con campo `deleted_at` filtrati di default. Override esplicito via `where: { deleted_at: null } negato` o flag `includeDeleted`.
3. **Logging** — slow query (>500ms) loggate a warn con `model`, `action`, `duration_ms`. Query body solo in `LOG_LEVEL=debug`.

> Nota: dalla 4.16 Prisma raccomanda **client extensions** (`$extends`) al posto di `$use` middleware. Per l'evo iniziamo con `$extends` ovunque possibile (più type-safe). Solo l'RLS injection resta su `$use` finché non disponibile equivalente con accesso al `tx`-level config.

## Type safety con relation includes

Mai `any`. Usare i tipi generati Prisma per relation includes:

```typescript
import { Prisma } from '@prisma/client';

export type EmployeeWithUnit = Prisma.EmployeeGetPayload<{
  include: { orgUnit: true; user: { select: { email: true } } };
}>;

@Injectable()
export class EmployeesService {
  async findById(id: string): Promise<EmployeeWithUnit | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: { orgUnit: true, user: { select: { email: true } } },
    });
  }
}
```

Per DTO di output usare `class-transformer` con whitelisting esplicito; non ritornare l'entity Prisma raw al client (rischio leak campi sensitive come `password_hash`).

## Connection pooling

PostgreSQL 16 bare-metal su VM OCI: usare PgBouncer in transaction-pool mode davanti a Prisma. Connection string:

```
DATABASE_URL="postgresql://user:pass@pgbouncer:6432/heuresys?pgbouncer=true&connection_limit=10&pool_timeout=20"
```

`pgbouncer=true` disabilita prepared statement caching client-side (incompatibile con transaction pooling). `connection_limit` per istanza Nest: 10 (con 4 istanze API gateway = 40 connessioni totali, sotto il `max_connections=200` Postgres). Per migrazioni Prisma usare `DIRECT_URL` che bypassa PgBouncer (porta 5433).

## Edge cases

- `findFirst` vs `findUnique`: `findUnique` solo su unique constraint reali (PK o `@unique`). Per query su index non-unique usare `findFirst`.
- `upsert` su modelli con RLS: l'`update` branch fallisce silenziosamente se RLS nasconde il record → si crea un duplicato. Usare `findFirst` + branching esplicito.
- Bulk insert: `createMany({ skipDuplicates: true })` non ritorna i record creati; se servono ID, fare `$transaction` con loop `create` (più lento ma deterministico).

## Riferimenti

- `rls-with-prisma-pattern.md` — middleware tenant injection
- `nestjs-module-conventions.md` — PrismaModule global
- Prisma docs: `$transaction`, `$extends` (consultare via Context7 MCP per syntax aggiornata)
