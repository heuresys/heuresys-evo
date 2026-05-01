import { Router, type Request, type Response } from 'express';
import { prisma } from '../db/pool.js';

export const healthRouter = Router();

/**
 * GET /health — liveness probe. Always 200 if the process is alive.
 * Use this for k8s liveness or HAProxy/nginx upstream health.
 */
healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'api-gateway',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health/ready — readiness probe. 200 only if downstream deps healthy.
 * Use this for k8s readiness or load balancer routing decisions.
 */
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  let db: 'connected' | 'down' = 'down';
  let dbLatencyMs: number | null = null;
  const start = Date.now();
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    db = 'connected';
    dbLatencyMs = Date.now() - start;
  } catch {
    db = 'down';
  }

  const ok = db === 'connected';
  res.status(ok ? 200 : 503).json({
    ok,
    service: 'api-gateway',
    db,
    dbLatencyMs,
    timestamp: new Date().toISOString(),
  });
});
