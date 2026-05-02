# NestJS Module Conventions — Heuresys Evo

**Status**: Active (2026-05-02)
**Scope**: `services/api-gateway` (NestJS 10 + Fastify adapter). Convenzioni vincolanti per ogni feature module dell'evo.
**Audience**: backend dev evo, reviewer PR.

## Decisione architetturale

L'evo adotta una organizzazione a **feature module** (un module per dominio funzionale: `EmployeesModule`, `OrgUnitsModule`, `RbpModule`, `AuthModule`, ecc.) con un set ristretto di **shared module** (`PrismaModule`, `ConfigModule`, `LoggerModule`, `TenantContextModule`). I shared module sono `@Global()` solo se davvero usati ovunque (Prisma, Logger, TenantContext); il resto va importato esplicitamente.

| Tipo               | Esempio                               | Caratteristiche                                                                          |
| ------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Feature            | `EmployeesModule`                     | controller + service + DTO + provider locali, esporta solo se altri feature ne dipendono |
| Shared `@Global()` | `PrismaModule`, `TenantContextModule` | provider singleton, importato una sola volta in `AppModule`                              |
| Shared scoped      | `EscoModule`, `KgModule`              | esportato esplicitamente, no `@Global()`                                                 |
| Dynamic            | `ConfigModule.forRoot({ ... })`       | config caricata via `forRoot` / `forRootAsync`                                           |

## forRoot vs forRootAsync

`forRoot` per config statiche (env già parsata). `forRootAsync` per config che dipendono da `ConfigService` o da altri provider (DB, Redis):

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow<string>('REDIS_HOST'),
          port: config.getOrThrow<number>('REDIS_PORT'),
        },
      }),
    }),
  ],
})
export class JobsModule {}
```

## DI scope — quando usare REQUEST

Default = `Scope.DEFAULT` (singleton). Usare `Scope.REQUEST` solo per provider che devono accedere al `Request` corrente (tenant_id, user, correlation-id) **e** non possono usare `AsyncLocalStorage`. In Heuresys-evo preferiamo `AsyncLocalStorage` (pattern `TenantContextService`) e teniamo i service singleton: vedi `rls-with-prisma-pattern.md`. `Scope.REQUEST` è ammesso solo per cause specifiche (es. interceptor che mantiene stato per request) perché propaga lo scope su tutta la dependency tree (perf cost).

```typescript
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

@Injectable({ scope: Scope.REQUEST })
export class RequestAuditService {
  constructor(@Inject(REQUEST) private readonly req: FastifyRequest) {}
}
```

`Scope.TRANSIENT` è bandito salvo casi documentati: rompe il pattern singleton e moltiplica istanze.

## Exception filters globali

Due filter registrati a livello app in `main.ts`, in ordine: `HttpExceptionFilter` (cattura `HttpException` Nest e mappa a body coerente con `error_code`, `message`, `correlation_id`) seguito da `AllExceptionsFilter` (catch-all per errori non Nest, log a Pino con stack e ritorna 500 generico). Il body di errore standard è:

```typescript
{
  error_code: string;        // es. 'RBP_FORBIDDEN', 'TENANT_MISMATCH'
  message: string;           // human-readable, NO stack trace in prod
  correlation_id: string;    // x-request-id propagato da gateway
  details?: Record<string, unknown>;
}
```

`AllExceptionsFilter` deve catturare e tradurre `Prisma.PrismaClientKnownRequestError` (P2002 → 409, P2025 → 404) e `Prisma.PrismaClientValidationError` → 400.

## Interceptors

- `LoggingInterceptor` (globale): log strutturato Pino con `method`, `url`, `tenant_id`, `user_id`, `duration_ms`, `status_code`. Nessun payload by default (PII). Toggle `LOG_REQUEST_BODY=true` per debug.
- `TransformInterceptor` (globale): wrappa risposte 2xx in `{ data, meta? }`. Skippato se controller usa `@SkipTransform()` (es. file download, SSE).
- `TimeoutInterceptor` (globale): default 30s, override per route via `@Timeout(60_000)`.

Ordine registrazione: `Logging → Timeout → Transform`.

## Guards composition

L'ordine guard è **vincolante** e definito in `app.module.ts` via `APP_GUARD`:

1. `JwtAuthGuard` — verifica JWT, popola `req.user`. Skippato da `@Public()`.
2. `TenantGuard` — estrae `tenant_id` dal claim, valida appartenenza, registra in `TenantContextService` (AsyncLocalStorage). Skippato da `@PlatformOnly()` (route platform-scope).
3. `RbpGuard` — legge `@RequirePermission('AREA', 'ACTION')` dal metadata, chiama `RbpService.check()`, applica scope rule.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/jwt.guard';
import { TenantGuard } from '@tenancy/tenant.guard';
import { RbpGuard, RequirePermission } from '@rbp/rbp.guard';

@Controller('employees')
@UseGuards(JwtAuthGuard, TenantGuard, RbpGuard)
export class EmployeesController {
  @Get()
  @RequirePermission('EMPLOYEES', 'READ')
  list() {
    /* ... */
  }
}
```

Override: `@Public()` skippa tutti i guard auth-related; `@SkipRbp()` skippa solo `RbpGuard` (uso raro, audit log obbligatorio).

## Riferimenti

- `auth-nestjs-pattern.md` — dettaglio JwtStrategy + claims propagation
- `rls-with-prisma-pattern.md` — TenantContextService + middleware Prisma
- `prisma-data-access-pattern.md` — PrismaService singleton
- Legacy ADR-010 (`heuresys.com.evo/docs/20-architecture/`) — JWT key rotation
