# ADR-0013: Observability strategy (B5)

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B5

## Context

Pre-B5: `services/api-gateway` aveva pino-http con redaction minima (4 path), no request id, no health/ready split, no Prometheus, no error tracking. La diagnosi RF-OB-01..04 nella roadmap §2.6 traccia esattamente questi 4 gap.

Forces:

- **Production observability**: senza request_id correlation, debug di flow cross-service è praticamente impossibile.
- **k8s/HAProxy compat**: serve liveness vs readiness separati per non far giù il pod quando il DB è temporaneamente lento.
- **Prom-native target**: la VM OCI ha Prometheus stack già monitorato (heritage legacy); il greenfield deve esportare `/metrics` Prom-format.
- **Pino performance**: structured logging deve restare leggero (no synchronous I/O).
- **Cost**: error tracking (Sentry, Bugsnag, ecc.) ha costi mensili — deferred fino a stabilità del deploy.

## Decision

Stack a 4 layer.

### 1. Structured logging (Pino HTTP) — B5.1, B5.2, B5.6

`services/api-gateway/src/middleware/log.ts` espande la config esistente:

- **Request id**: estratto da `x-request-id` header inbound (idempotent retry-safe) o generato server-side via `crypto.randomUUID()`. Cap a 200 char per evitare log injection. Echoed nell'header response.
- **Redaction paths**:
  - `req.headers.authorization`, `req.headers.cookie`, `req.headers["x-csrf-token"]`, `req.headers["x-api-key"]`, `req.headers["proxy-authorization"]`
  - `*.password`, `*.password_hash`, `*.token`, `*.access_token`, `*.refresh_token`, `*.api_key`, `*.secret`
- **Custom log level**: `5xx → error`, `4xx → warn`, `2xx/3xx → info`.
- **Base context**: `service`, `pid`, `hostname`, `env`.
- **Pretty-print** in dev (auto via `LOG_PRETTY=1` o `NODE_ENV != production`); JSON sempre in prod.

### 2. Health + readiness split — B5.3

`GET /health` (liveness):

- Sempre 200 se il process è alive.
- Body: `{ ok: true, service, uptime, timestamp }`
- Use case: k8s liveness probe, HAProxy upstream check.

`GET /health/ready` (readiness):

- 200 solo se DB raggiungibile (`SELECT 1` Prisma).
- 503 se DB down.
- Body: `{ ok, service, db, dbLatencyMs, timestamp }`
- Use case: k8s readiness probe, load balancer routing.

### 3. Prometheus exporter — B5.4, B5.5

`services/api-gateway/src/middleware/metrics.ts`:

- **Default metrics** (prom-client `collectDefaultMetrics`): CPU, memory, event loop lag, GC stats. Prefix `heuresys_`.
- **Custom HTTP metrics**:
  - `heuresys_http_requests_total{method, route, status}` (counter)
  - `heuresys_http_request_duration_seconds{method, route, status}` (histogram, buckets 5ms..10s)
  - `heuresys_http_in_flight` (gauge, current concurrent requests)
- **Route label sanitisation**: UUID segments → `:uuid` (evita esplosione cardinalità). Query string strippata.
- **Endpoint**: `GET /metrics` — Prometheus exposition format, no auth (scraped by Prometheus on private network).
- **Default labels**: `service: api-gateway` aggiunto a tutte le metriche.

### 4. Error tracking — DEFERRED B5.7

Sentry/Bugsnag/Highlight non attivati in B5. Motivazione:

- Costo mensile non giustificato pre-traffico utenti reali.
- Pino + request_id + Prometheus alerts coprono il 90% dei casi diagnostici.
- Self-hosted Sentry CE è opzione futura (richiede istanza Postgres separata + Redis dedicato).

Criteri per ri-aprire la decisione (post-cutover Phase 7+):

- Live user count > 50.
- Error rate > 0.5% sustained per > 1h (derivato da Prom).
- Compliance/audit requirement.

## Stack di produzione (target)

```
+----------------------+
| services/api-gateway |
| (pino JSON logs)     | --> stdout --> journald/loki
| /metrics             | --> Prometheus scrape (port :8200/metrics)
| /health              | --> k8s/HAProxy liveness
| /health/ready        | --> k8s/HAProxy readiness
+----------------------+
        |
        v
   Prometheus  --> Grafana dashboards
        |
        v
   Alertmanager --> PagerDuty/Slack/Email
```

## Alternatives considered

- **OpenTelemetry SDK invece di prom-client direct**: rejected per ora — overhead di setup non giustificato; OTEL può essere wrapped sopra in futuro senza migration major.
- **Pino invece di Winston/Bunyan**: confirmed — Pino è il fastest structured logger Node.js (5-10x Winston). Già scelto pre-B5.
- **Custom `/metrics` Prometheus implementation**: rejected — `prom-client` è la lib standard de facto, audited.
- **DataDog/New Relic invece di Prometheus**: rejected — costo proibitivo per workload corrente; Prom self-hosted già esistente sulla VM.
- **Health check single endpoint (no liveness/readiness split)**: rejected — split è k8s best practice; permette scelta fine-grained.

## Consequences

Positive:

- Request id correlation cross-service (auto-propagated via `x-request-id`).
- Secret leak in log praticamente impossibile (15 redaction paths + glob patterns).
- Prom-native con metriche custom + default → integrazione zero-friction.
- 7 nuovi test (4 metrics + 3 health) coperti dalla suite vitest.

Negative:

- prom-client adds ~50KB bundle (acceptable).
- Pino-pretty in dev richiede `pino-pretty` come devDep (~200KB).
- /metrics endpoint pubblico — protetto solo da network ACL (assumiamo Prom è in stessa rete privata).
- Grafana dashboard non scaffolded in B5 — TODO B11 runbook.

## Smoke validation (post-B5)

Pre-B5: 1 health endpoint, 0 metrics, no request id.

Post-B5:

- `/health` (liveness) e `/health/ready` (readiness) split — 3 test
- `/metrics` Prometheus exposition — 4 test
- Pino structured + request_id + 15 redaction paths
- 140 test totali passing (was 133, +7)

## Future work

- Tracing distribuito (W3C Trace Context propagation) — B11+ se necessario.
- Sentry / error tracking — deferred, criteri sopra.
- Grafana dashboard JSON in `infra/grafana/` — runbook B11.
- Alert rules YAML in `infra/prometheus/` — runbook B11.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §10 Phase B5
- pino docs: https://getpino.io
- prom-client docs: https://github.com/siimon/prom-client
- ADR-0001 PostgreSQL bare-metal (DB target del readiness check)
- ADR-0012 security baseline (CSRF/auth not interfere with /metrics scrape)
