import client from 'prom-client';
import type { Request, Response, NextFunction } from 'express';

/**
 * Prometheus metrics exporter (RTGB B5.4, B5.5).
 *
 * Default metrics (process CPU, memory, event loop lag) collected every 5s.
 * Custom metrics:
 *   - http_requests_total{method,route,status} counter
 *   - http_request_duration_seconds{method,route,status} histogram
 *   - http_in_flight gauge
 *
 * Exposed on /metrics in Prometheus exposition format.
 */
export const registry = new client.Registry();
registry.setDefaultLabels({ service: 'api-gateway' });
client.collectDefaultMetrics({ register: registry, prefix: 'heuresys_' });

const httpRequestsTotal = new client.Counter({
  name: 'heuresys_http_requests_total',
  help: 'Count of HTTP requests by method, route, status',
  labelNames: ['method', 'route', 'status'] as const,
  registers: [registry],
});

const httpRequestDuration = new client.Histogram({
  name: 'heuresys_http_request_duration_seconds',
  help: 'Latency of HTTP requests in seconds (p50/p95/p99 derivable)',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [registry],
});

const httpInFlight = new client.Gauge({
  name: 'heuresys_http_in_flight',
  help: 'Current in-flight HTTP requests',
  registers: [registry],
});

/**
 * Express middleware: starts a hrtime, increments in-flight, observes on
 * response close. Use route.path or req.originalUrl as label, defensively
 * stripping cardinality-explosive segments (UUIDs, query strings).
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();
  httpInFlight.inc();

  res.on('close', () => {
    httpInFlight.dec();
    const route = sanitiseRoute(req.route?.path ?? req.originalUrl ?? req.url ?? 'unknown');
    const labels = {
      method: req.method,
      route,
      status: String(res.statusCode),
    };
    httpRequestsTotal.inc(labels);
    const elapsedNs = Number(process.hrtime.bigint() - start);
    httpRequestDuration.observe(labels, elapsedNs / 1e9);
  });

  next();
}

/**
 * GET /metrics handler — Prometheus exposition format.
 */
export async function metricsHandler(_req: Request, res: Response): Promise<void> {
  res.set('Content-Type', registry.contentType);
  res.send(await registry.metrics());
}

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
function sanitiseRoute(path: string): string {
  return path.split('?')[0]!.replace(UUID_RE, ':uuid');
}
