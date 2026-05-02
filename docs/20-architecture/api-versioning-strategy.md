# API Versioning Strategy — Heuresys Evo

**Status**: Active (2026-05-02)
**Scope**: tutti gli endpoint HTTP esposti da `services/api-gateway`. Definisce il contratto pubblico verso `services/app` (Next.js) e mobile/SDK terze parti.
**Audience**: backend dev evo, frontend dev, integratori esterni.

## Decisione

L'evo adotta **URI versioning** (`/api/v1/...`, `/api/v2/...`) per gli endpoint REST, scartando header versioning. Motivazioni:

- **Cache-friendly**: CDN e reverse proxy possono cachare per URL senza ispezionare header.
- **Visibility**: la versione è nei log, nelle traces, nel browser dev tools senza step extra.
- **Routing semplice**: NestJS supporta URI versioning nativamente (`VersioningType.URI`) con namespace per controller.
- **Frontend Next.js** può fare hardcode di prefisso `/api/v1` in `lib/api/client.ts` senza intercettori che modifichino header.

Header versioning (`Accept-Version: 1`) rimane un'opzione futura per API SDK enterprise se la richiesta dovesse emergere. Niente content negotiation versioning (`Accept: application/vnd.heuresys.v1+json`).

## NestJS implementation

```typescript
// services/api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });
  app.enableShutdownHooks();
  await app.listen(8012, '0.0.0.0');
}
bootstrap();
```

Risultato: ogni controller `@Controller('employees')` è automaticamente raggiungibile su `/api/v1/employees`. Per route v2: `@Controller({ path: 'employees', version: '2' })`. Per route multi-version (compat): `version: ['1', '2']`.

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'employees', version: ['1', '2'] })
export class EmployeesController {
  @Get()
  list() {
    /* logica condivisa */
  }

  @Get(':id')
  @Version('2') // override: solo v2
  detailV2() {
    /* shape arricchita */
  }
}
```

## Deprecation lifecycle

| Fase       | Durata                | Comportamento                                                                                                   |
| ---------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| Active     | indefinita            | versione corrente, default per nuovi client                                                                     |
| Deprecated | 6 mesi (T0 → T+6mesi) | header response `Deprecation: true` + `Sunset: <RFC1123 date>` + `Link: </api/v2/...>; rel="successor-version"` |
| Sunset     | T+6mesi               | endpoint risponde 410 Gone con body che indica nuovo path                                                       |

Esempio header risposta v1 dopo annuncio v2:

```
HTTP/1.1 200 OK
Deprecation: true
Sunset: Thu, 01 Nov 2026 00:00:00 GMT
Link: </api/v2/employees>; rel="successor-version"
Warning: 299 - "v1 deprecated, migrate to v2 by 2026-11-01"
```

Il frontend Next.js deve loggare e mostrare warning agli utenti developer (in dev mode). I client esterni ricevono notifica via newsletter API + dashboard developer portal.

## Parity legacy ↔ evo durante phased migration

L'evo gateway su `/api/v1` espone un superset di route: alcune servite nativamente da NestJS, altre proxy verso il legacy `heuresys.com.evo` (porta 8012 sulla stessa VM).

```typescript
// services/api-gateway/src/proxy/legacy-proxy.controller.ts
import { All, Controller, Req, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LEGACY_PROXY_AREAS } from './legacy-proxy.config';

@Controller({ path: '*', version: '1' })
export class LegacyProxyController {
  @All()
  async proxy(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const area = extractArea(req.url);
    if (!LEGACY_PROXY_AREAS.includes(area)) {
      return reply.status(404).send({ error_code: 'NOT_FOUND' });
    }
    return this.proxyService.forward(req, reply, area);
  }
}
```

`LEGACY_PROXY_AREAS` è una lista DBMS-driven (tabella `evo_proxy_routing`) con `area_code`, `proxy_target_url`, `phase` (`dual_write` / `shadow` / `evo_native`). Ogni area passa per i 4 step di `cutover-strategy-evo.md`. Quando un'area arriva a step 3 (cutover read), viene rimossa da `LEGACY_PROXY_AREAS`.

> **Vincolo SLA**: il proxy aggiunge ≤15ms di latency p95 (single VM, loopback). Per aree latency-sensitive il proxy è disattivato e l'area diventa priorità Tier 1.

## Edge cases

- **Mismatch shape v1 ↔ v2**: se v2 introduce campo `gender` (esempio) e v1 non lo aveva, v1 deve continuare a non esporlo. Soluzione: DTO separati `EmployeeDtoV1` / `EmployeeDtoV2`, mapper esplicito. No "campo nascosto se v1".
- **Breaking change urgente in v1**: vietato. Se serve fix di sicurezza che rompe contratto, emettere v1.1 (minor non-breaking) per il fix backportato + accelerare v2 release.
- **Proxy auth**: il legacy si aspetta JWT firmato con chiave legacy (issuer diverso). Il gateway evo riemette il JWT per il legacy con `LegacyJwtBridgeService` che firma con chiave legacy condivisa. Pattern temporaneo: termina con cutover area-by-area.
- **OpenAPI spec**: ogni versione ha la sua spec esposta su `/api/v1/openapi.json` e `/api/v2/openapi.json`. Generata da `@nestjs/swagger` con `DocumentBuilder().setVersion('1.0')`. Frontend NextAuth e SDK clients si basano sulla spec per type generation.
- **Versioning mobile/SDK**: mobile app pin la versione major (v1 finché non release update). Mai forzare update mobile per minor — SLA: minor sempre backward compatible.

## Niente versioning su query/path utility

`/health`, `/metrics`, `/api/v1/.well-known/jwks.json` (auth), `/api/v1/openapi.json`: non versionate (sono infra/meta). Il prefix `v1` su jwks è solo coincidenza di routing.

## Riferimenti

- `nestjs-module-conventions.md` — guards e structure
- `cutover-strategy-evo.md` — Tier list e proxy area phase
- NestJS docs su `enableVersioning` (consultare via Context7 per opzioni aggiornate)
