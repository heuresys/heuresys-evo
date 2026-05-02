# RLS with Prisma — Pattern Multi-Tenant Heuresys Evo

**Status**: Active (2026-05-02)
**Scope**: tutti i service che accedono al PostgreSQL 16 condiviso. RLS attiva su 302 tabelle (`current_tenant_id()` SQL function + policy `tenant_id = current_tenant_id()`).
**Audience**: backend dev evo, security reviewer.

## Problema

Il legacy (`heuresys.com.evo`) usa un dual pool pattern: `pg.Pool` con `set_config('app.current_tenant_id', $1, false)` chiamato all'inizio di ogni request, mantenendo la sessione DB legata alla connection per la durata della request. Il pool è clonato in due varianti — una con utente normale (RLS enforced) e una con `BYPASSRLS` (`PLATFORM_DB_APP_USER`) per operazioni admin.

Prisma rompe questo pattern: il client gestisce le connection autonomamente, non è garantito che due query consecutive vadano sullo stesso physical socket. `set_config` con flag `false` (session-level) viene perso. L'evo deve ricostruire l'isolamento RLS in modo Prisma-native.

## Alternative valutate

| #   | Approccio                                                                                                       | Pro                                      | Contro                                                             | Esito                              |
| --- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ | ---------------------------------- |
| a   | `$use` middleware Prisma + `$queryRaw('SELECT set_config(..., true))` dentro `$transaction`, scope `local=true` | Native, no infra change, scope locale tx | Forza ogni query in transazione (overhead)                         | **SCELTO**                         |
| b   | Datasource Prisma per ruolo (admin BYPASSRLS vs normal) — 2 client                                              | Performance, no overhead per-query       | Doppio client da gestire, più connessioni, divergenza schema cache | Scartato (complessità)             |
| c   | Shadow Postgres role con `BYPASSRLS` solo per superuser; un client                                              | Semplice                                 | Non risolve propagazione tenant_id                                 | Scartato (non risolve il problema) |

## Decisione: middleware (a) + AsyncLocalStorage

Catena: `TenantGuard` (estrae tenant_id dal JWT claim) → `TenantContextService.run(tenantId, callback)` (AsyncLocalStorage) → ogni Prisma query dentro callback è automaticamente avvolta in `$transaction` con `set_config('app.current_tenant_id', tenantId, true)` come prima statement.

```typescript
// services/api-gateway/src/tenancy/tenant-context.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantContext {
  tenantId: string;
  userId: string;
  bypassRls?: boolean; // solo SUPERUSER, audit obbligatorio
}

@Injectable()
export class TenantContextService {
  private readonly als = new AsyncLocalStorage<TenantContext>();

  run<T>(ctx: TenantContext, fn: () => Promise<T>): Promise<T> {
    return this.als.run(ctx, fn);
  }

  get(): TenantContext | undefined {
    return this.als.getStore();
  }
}
```

```typescript
// services/api-gateway/src/prisma/prisma-tenant.middleware.ts
import { Prisma } from '@prisma/client';
import { TenantContextService } from '@tenancy/tenant-context.service';

export function tenantMiddleware(ctxService: TenantContextService): Prisma.Middleware {
  return async (params, next) => {
    const ctx = ctxService.get();
    if (!ctx) {
      // Operazioni di bootstrap (migrate, seed) o job senza tenant: esplicito
      if (process.env.ALLOW_NO_TENANT === 'true') return next(params);
      throw new Error(`PRISMA_NO_TENANT_CTX: ${params.model}.${params.action}`);
    }
    if (ctx.bypassRls) return next(params);

    // Wrap in transaction con set_config locale
    const client = (params as any).runInTransaction
      ? null
      : ((params as any).client as Prisma.TransactionClient | undefined);

    // Per chiamate non già in $transaction, eseguiamo in transaction implicita
    return next(params);
  };
}
```

> Nota implementativa: il pattern reale in evo usa **client extension `$extends`** con un `query` hook che fa `tx.$executeRawUnsafe("SELECT set_config('app.current_tenant_id', $1, true)", tenantId)` come prima operazione di una `$transaction` interattiva creata su demand. Codice completo in `services/api-gateway/src/prisma/prisma.service.ts` (TBD: scrivere implementazione + test prima del cutover Tier 1).

## Bypass RLS per operazioni platform

Solo per ruolo `SUPERUSER` o job di sistema (cron, enrichment worker). Pattern:

```typescript
await this.tenantContext.run(
  { tenantId: 'system', userId: 'system', bypassRls: true },
  async () => {
    return this.prisma.audit_log.create({ data: { ... } });
  },
);
```

Audit obbligatorio: ogni invocazione con `bypassRls=true` viene loggata in `audit_log_bypass` con stack trace + reason. Code review deve flaggarla.

## Test pattern: integration con rollback

I test di RLS isolation usano `$transaction` rollback per garantire isolamento tra test e verificare che tenant A non veda dati tenant B:

```typescript
import { PrismaClient } from '@prisma/client';

describe('Employee RLS isolation', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient({ datasources: { db: { url: process.env.TEST_DATABASE_URL } } });
  });

  it('tenant A non vede employee tenant B', async () => {
    await prisma
      .$transaction(async (tx) => {
        await tx.$executeRawUnsafe("SELECT set_config('app.current_tenant_id', 'tenant-a', true)");
        const employees = await tx.employee.findMany();
        expect(employees.every((e) => e.tenant_id === 'tenant-a')).toBe(true);

        // rollback automatico fine transaction
        throw new Error('ROLLBACK');
      })
      .catch((e) => {
        if (e.message !== 'ROLLBACK') throw e;
      });
  });
});
```

## Edge cases

- **Connection reuse PgBouncer**: con transaction pooling, `set_config(..., true)` è scoped al tx, non alla session — corretto, ma significa che ogni query DEVE essere in `$transaction`. Niente query "fuori transazione".
- **Nested transactions**: Prisma non supporta savepoints. Se `TenantContextService.run` è chiamato annidato, la transazione esterna prevale.
- **Raw queries**: `$queryRaw` dentro `tenantContext.run` deve essere wrappato manualmente in `$transaction` con set_config — il middleware non intercetta raw nello stesso modo.
- **BullMQ workers**: il job processor (`services/enrichment`) deve estrarre `tenant_id` dal job data e chiamare `tenantContext.run` esplicitamente prima di qualsiasi accesso DB.

## Riferimenti

- `prisma-data-access-pattern.md` — PrismaService base
- `auth-nestjs-pattern.md` — JwtStrategy → TenantGuard → TenantContextService.run
- Legacy `heuresys.com.evo/services/api-gateway/src/db/dual-pool.ts` — pattern legacy da NON portare 1:1
