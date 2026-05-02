# Auth NestJS Pattern — Heuresys Evo

**Status**: Active (2026-05-02)
**Scope**: `services/api-gateway` (NestJS) + interop con `services/app` (NextAuth v4 frontend).
**Audience**: backend dev evo, security reviewer.

## Decisione

Auth backend basata su `@nestjs/passport` + `passport-jwt`. NextAuth v4 sul frontend (`services/app`) emette session cookie e propaga il JWT al gateway via header `Authorization: Bearer`. Il gateway NON emette token: agisce come resource server. Refresh token flow gestito da NextAuth con endpoint dedicato `/api/v1/auth/refresh` sul gateway.

## JwtStrategy

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwksService } from './jwks.service';

export interface JwtPayload {
  sub: string; // user id
  tenant_id: string;
  role: string; // RBP role code (es. 'HR_MANAGER')
  email: string;
  iat: number;
  exp: number;
  kid?: string; // key id per rotation
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly jwks: JwksService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (req, rawJwt, done) => {
        const decoded = JSON.parse(Buffer.from(rawJwt.split('.')[0], 'base64url').toString());
        jwks
          .getKey(decoded.kid)
          .then((k) => done(null, k))
          .catch(done);
      },
      issuer: config.getOrThrow('JWT_ISSUER'),
      audience: config.getOrThrow('JWT_AUDIENCE'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.tenant_id || !payload.role)
      throw new UnauthorizedException('JWT_CLAIMS_INCOMPLETE');
    return payload;
  }
}
```

`req.user` viene popolato con `JwtPayload` dopo validazione.

## Guards composition (ordine vincolante)

1. **`JwtAuthGuard`** (`AuthGuard('jwt')` extends): verifica firma + claims base. Skippato da `@Public()` decorator.
2. **`TenantGuard`**: estrae `req.user.tenant_id`, valida appartenenza (tenant exists, not suspended), invoca `TenantContextService.run({ tenantId, userId, role })` per il resto della request lifecycle. Skippato da `@PlatformOnly()`.
3. **`RbpGuard`**: legge `@RequirePermission(area, action)` metadata, chiama `RbpService.check(role, area, action, scopeRule)`, applica scope filter al query (via `getScopeCondition()` injected nel service).

```typescript
// app.module.ts
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: RbpGuard },
  ],
})
export class AppModule {}
```

## @Public decorator

```typescript
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// JwtAuthGuard
canActivate(ctx: ExecutionContext) {
  const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    ctx.getHandler(), ctx.getClass(),
  ]);
  if (isPublic) return true;
  return super.canActivate(ctx);
}
```

Route pubbliche tipiche: `/health`, `/auth/login`, `/auth/refresh`, OpenAPI spec.

## Claims propagation: req.user → AsyncLocalStorage → Prisma

Catena completa:

```
Request → JwtAuthGuard (req.user = JwtPayload)
       → TenantGuard (TenantContextService.run({tenantId, userId, role, bypassRls?}, () => next()))
       → Controller method
       → Service.method() chiama prisma.<model>.<op>
       → PrismaService middleware legge TenantContextService.get() → applica set_config tenant_id
```

Niente request scope DI: l'AsyncLocalStorage propaga il context attraverso async boundaries (await, Promise chain, setTimeout). Vedi `rls-with-prisma-pattern.md` per dettagli middleware Prisma.

## Refresh token rotation

- Access token: 15 min, JWT firmato con chiave RS256 corrente.
- Refresh token: 7 giorni, opaque (UUID v7), salvato hash in `refresh_tokens` table con `tenant_id`, `user_id`, `revoked_at`, `replaced_by`.
- Rotation: ogni `/auth/refresh` invalida il vecchio (sets `revoked_at` + `replaced_by` = nuovo id) ed emette nuova coppia.
- Reuse detection: se arriva refresh con token già `revoked_at IS NOT NULL` → revoca tutta la chain (compromise sospetto), force logout user.

```typescript
@Post('refresh')
@Public()
async refresh(@Body() { refreshToken }: RefreshDto) {
  const stored = await this.refreshService.findActive(hash(refreshToken));
  if (!stored) throw new UnauthorizedException('REFRESH_INVALID');
  if (stored.revoked_at) {
    await this.refreshService.revokeChain(stored.id);
    throw new UnauthorizedException('REFRESH_REUSE_DETECTED');
  }
  const newPair = await this.authService.rotate(stored);
  return newPair;
}
```

## JWT key rotation con `kid`

Pattern portato da legacy ADR-010 (`heuresys.com.evo/docs/20-architecture/ADR-010-jwt-key-rotation.md`):

- Chiavi RSA in `jwt_signing_keys` table: `kid`, `public_key_pem`, `private_key_pem` (cifrato KMS), `created_at`, `activated_at`, `retired_at`.
- Una sola chiave `active` alla volta per signing; tutte le chiavi non `retired` accettate per verify (grace period 24h dopo rotation).
- `JwksService` cache JWKS con TTL 5 min, invalida su NOTIFY Postgres `jwt_keys_changed`.
- Rotation cron: ogni 30 giorni nuova chiave attivata, vecchia retired dopo 24h.
- Frontend NextAuth carica JWKS da `/api/v1/.well-known/jwks.json`.

## Edge cases

- **Token replay window**: clock skew tra gateway e client può generare 401 spurî. Usare `clockTolerance: 30` in `passport-jwt` (default è 0 → strict).
- **Multi-tab logout**: revoca refresh token NON invalida access token attivi (durata max 15 min). Per logout immediato: blacklist access token JTI in Redis con TTL = exp.
- **Tenant switch**: utente con accesso a >1 tenant deve emettere nuovo JWT con `tenant_id` diverso → endpoint `/auth/switch-tenant` che valida appartenenza e ri-emette.
- **NextAuth v4 session vs JWT**: la session frontend è cookie httpOnly; il JWT al gateway è estratto via `getToken({ raw: true })` e passato in Authorization. Sincronizzare `JWT_SECRET` / chiavi tra Next e gateway.

## Riferimenti

- `nestjs-module-conventions.md` — guards composition order
- `rls-with-prisma-pattern.md` — TenantContextService → Prisma middleware
- Legacy ADR-010 — JWT key rotation (porting integrale)
- NextAuth v4 docs (Context7 MCP per syntax aggiornata)
