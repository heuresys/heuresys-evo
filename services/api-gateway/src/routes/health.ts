import { Router, type Request, type Response } from 'express';
import { prisma } from '../db/pool.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  const startedAt = process.uptime();
  let db: 'connected' | 'down' = 'down';
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    db = 'connected';
  } catch {
    db = 'down';
  }
  res.json({
    ok: db === 'connected',
    db,
    uptime: Math.round(startedAt),
    timestamp: new Date().toISOString(),
  });
});
