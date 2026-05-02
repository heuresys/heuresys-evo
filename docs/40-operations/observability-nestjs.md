# Observability NestJS — evo stack

Stack: NestJS 10 + Prisma + BullMQ. Target: VM OCI ARM64. Esposizione interna `/metrics`, esposizione pubblica solo `/health` e `/health/ready`.

## Health checks — `@nestjs/terminus`

Install: `npm i @nestjs/terminus @nestjs/axios` (workspace `services/api-gateway`).

### `HealthModule`

```ts
// services/api-gateway/src/health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './indicators/prisma.health';
import { RedisHealthIndicator } from './indicators/redis.health';
import { EscoGraphHealthIndicator } from './indicators/esco.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, RedisHealthIndicator, EscoGraphHealthIndicator],
})
export class HealthModule {}
```

### `HealthController`

```ts
// services/api-gateway/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaHealthIndicator } from './indicators/prisma.health';
import { RedisHealthIndicator } from './indicators/redis.health';
import { EscoGraphHealthIndicator } from './indicators/esco.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
    private redis: RedisHealthIndicator,
    private esco: EscoGraphHealthIndicator
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  liveness() {
    return this.health.check([() => this.prisma.pingCheck('database', 1500)]);
  }

  @Get('ready')
  @Public()
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.prisma.pingCheck('database', 1500),
      () => this.redis.isHealthy('redis'),
      () => this.esco.isReachable('esco_graph'),
    ]);
  }
}
```

`PrismaHealthIndicator.pingCheck` esegue `SELECT 1`; `RedisHealthIndicator` un `PING`; `EscoGraphHealthIndicator` una `SELECT count(*) FROM esco_skills LIMIT 1` per validare che la tabella ESCO sia raggiungibile (custom check).

Risposte: `200` se tutti gli indicator healthy, `503` se almeno uno down (default Terminus). `/health` = liveness (DB-only, leggero); `/health/ready` = readiness (DB+Redis+ESCO).

## Logging strutturato — `nestjs-pino`

Install: `npm i nestjs-pino pino-http pino-pretty`.

```ts
// services/api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger, LoggerModule } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// app.module.ts (estratto)
LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.LOG_LEVEL ?? 'info',
    transport: process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { singleLine: true } }
      : undefined,                                  // JSON puro in prod
    autoLogging: { ignore: (req) => req.url === '/health' },
    redact: ['req.headers.authorization', 'req.headers.cookie', '*.password'],
    customProps: (req) => ({ correlationId: req.correlationId, tenantId: req.tenantId }),
  },
}),
```

Levels: `trace|debug|info|warn|error|fatal`. Output JSON in prod, pretty-printed in dev. Redact obbligatorio per header `authorization`, `cookie`, e campi `password` ricorsivi.

## Correlation-id — middleware + AsyncLocalStorage

```ts
// services/api-gateway/src/common/middleware/correlation-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

export const cidStorage = new AsyncLocalStorage<{ correlationId: string }>();

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const incoming = req.header('x-correlation-id');
    const correlationId = incoming && /^[0-9a-f-]{36}$/i.test(incoming) ? incoming : randomUUID();
    (req as any).correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    cidStorage.run({ correlationId }, () => next());
  }
}
```

Registrato globalmente in `AppModule.configure(consumer)` con `forRoutes('*')`. Il middleware popola `req.correlationId` (consumato dal `customProps` di pino) e lo restituisce sull'header di response. AsyncLocalStorage rende il `correlationId` accessibile da qualsiasi punto async (es. service Prisma, BullMQ producer) via `cidStorage.getStore()?.correlationId`.

## OpenTelemetry tracing

Install: `npm i @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http`.

```ts
// services/api-gateway/src/tracing.ts (caricato PRIMA di AppModule via --require)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';

const exporter =
  process.env.NODE_ENV === 'production'
    ? new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://tempo:4318/v1/traces',
      })
    : new ConsoleSpanExporter();

const sdk = new NodeSDK({
  serviceName: 'heuresys-evo-api',
  traceExporter: exporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false }, // troppo verboso
    }),
  ],
});
sdk.start();
process.on('SIGTERM', () => sdk.shutdown());
```

Avvio: `node --require ./dist/tracing.js dist/main.js`. Auto-instrumentation copre HTTP, Express, Prisma (via `@prisma/instrumentation`), ioredis. In prod gli span vanno a Grafana Tempo; in dev a console.

## Prometheus exporter — `prom-client`

Install: `npm i prom-client @willsoto/nestjs-prometheus`.

```ts
// services/api-gateway/src/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true }, // process_*, nodejs_*
    }),
  ],
})
export class MetricsModule {}
```

Custom counters/histograms per business logic (esempio):

```ts
@Injectable()
export class RbpMetrics {
  private permissionChecks = new Counter({
    name: 'rbp_permission_checks_total',
    help: 'Total RBP permission checks',
    labelNames: ['area', 'action', 'result'] as const,
  });
  recordCheck(area: string, action: string, result: 'allow' | 'deny') {
    this.permissionChecks.inc({ area, action, result });
  }
}
```

### Esposizione `/metrics` solo interna

Vhost Nginx (`infra/nginx/evo.heuresys.com.deployed.conf`) blocca `/metrics` pubblico:

```nginx
location = /metrics {
    allow 127.0.0.1;
    allow 10.0.0.0/8;             # subnet interna OCI
    deny all;
    proxy_pass http://127.0.0.1:8012;
}
```

Prometheus scrape via `127.0.0.1:8012/metrics` direttamente (bypass Nginx) — scrape config in `infra/monitoring/prometheus.yml`.

## Riferimenti

- `infra/nginx/evo.heuresys.com.deployed.conf` — block `/metrics` pubblico
- `infra/monitoring/prometheus.yml` — scrape config (target `localhost:8012`, `localhost:8020`)
- `docs/40-operations/incident-runbook-evo.md` §Diagnostic — uso health/metrics in incident
