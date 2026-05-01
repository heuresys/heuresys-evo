import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { metricsMiddleware, metricsHandler, registry } from '../metrics.js';

function buildApp(): express.Express {
  const app = express();
  app.use(metricsMiddleware);
  app.get('/test', (_req, res) => res.json({ ok: true }));
  app.get('/employees/:id', (_req, res) => res.json({ ok: true }));
  app.get('/metrics', metricsHandler);
  return app;
}

describe('metrics', () => {
  beforeEach(() => {
    registry.resetMetrics();
  });

  it('exposes Prometheus exposition format', async () => {
    const res = await request(buildApp()).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toContain('# HELP heuresys_http_requests_total');
    expect(res.text).toContain('# TYPE heuresys_http_request_duration_seconds histogram');
  });

  it('counts http_requests_total per request', async () => {
    const app = buildApp();
    await request(app).get('/test');
    await request(app).get('/test');
    const res = await request(app).get('/metrics');
    expect(res.text).toMatch(/heuresys_http_requests_total\{[^}]*route="\/test"[^}]*\} 2/);
  });

  it('sanitises route uuid segments to :uuid label', async () => {
    const app = buildApp();
    await request(app).get('/employees/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    await request(app).get('/employees/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    const res = await request(app).get('/metrics');
    // Express route matched param means route.path is /employees/:id (express style).
    // Either way the path label should not contain raw uuids.
    expect(res.text).not.toMatch(/aaaaaaaa-aaaa/);
    expect(res.text).not.toMatch(/bbbbbbbb-bbbb/);
  });

  it('exposes default node process metrics', async () => {
    const res = await request(buildApp()).get('/metrics');
    expect(res.text).toMatch(/heuresys_process_cpu_user_seconds_total/);
    expect(res.text).toMatch(/heuresys_nodejs_eventloop_lag_seconds/);
  });
});
