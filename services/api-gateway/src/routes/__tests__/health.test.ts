import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../../db/pool.js', () => ({
  prisma: {
    $queryRawUnsafe: vi.fn(async () => [{ ok: 1 }]),
  },
}));

import { healthRouter } from '../health.js';

function buildApp(): express.Express {
  const app = express();
  app.use('/health', healthRouter);
  return app;
}

describe('GET /health', () => {
  it('returns ok=true and uptime (liveness)', async () => {
    const res = await request(buildApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.service).toBe('api-gateway');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });
});

describe('GET /health/ready', () => {
  it('returns 200 + db=connected when DB query succeeds', async () => {
    const res = await request(buildApp()).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.db).toBe('connected');
    expect(typeof res.body.dbLatencyMs).toBe('number');
  });

  it('returns 503 + db=down when DB query throws', async () => {
    const { prisma } = await import('../../db/pool.js');
    (prisma.$queryRawUnsafe as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('boom'));
    const res = await request(buildApp()).get('/health/ready');
    expect(res.status).toBe(503);
    expect(res.body.ok).toBe(false);
    expect(res.body.db).toBe('down');
  });
});
