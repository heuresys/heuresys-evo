import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      $queryRawUnsafe: vi.fn(async () => [
        {
          id: 'log-1',
          timestamp: new Date(),
          user_id: 'u1',
          user_email: 'a@e.org',
          user_role: 'HR_DIRECTOR',
          action: 'UPDATE',
          category: 'EMPLOYEE',
          resource_type: 'employees',
          resource_id: 'e1',
          description: 'Updated employee record',
          success: true,
          created_at: new Date(),
        },
      ]),
    };
    return fn(tx);
  }),
  mergeScopedWhere: vi.fn(),
  prisma: {} as unknown,
}));

let mockSession: { user?: { id?: string; role?: string; tenantId?: string | null } } | null = null;
vi.mock('../../middleware/auth.js', () => ({
  requireAuth: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!mockSession?.user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    (req as unknown as { session: typeof mockSession }).session = mockSession;
    next();
  },
}));

const cacheStub = {
  ensureLoaded: vi.fn().mockResolvedValue(undefined),
  isAllowed: vi.fn(),
  getPermission: vi.fn(),
};
vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheStub,
}));

import { auditLogsRouter } from '../audit-logs.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/audit-logs', auditLogsRouter);
  app.use(errorHandler);
  return app;
}

describe('GET /audit-logs', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/audit-logs');
    expect(res.status).toBe(401);
  });

  it('403 when role lacks AUDIT.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/audit-logs');
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ area: 'AUDIT', action: 'view' });
  });

  it('200 returns audit logs for IT_ADMIN', async () => {
    mockSession = { user: { id: 'u1', role: 'IT_ADMIN', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/audit-logs');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('200 with category filter', async () => {
    mockSession = { user: { id: 'u1', role: 'IT_ADMIN', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/audit-logs?category=EMPLOYEE&action=UPDATE');
    expect(res.status).toBe(200);
  });

  it('400 on invalid category', async () => {
    mockSession = { user: { id: 'u1', role: 'IT_ADMIN', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/audit-logs?category=NONSENSE');
    expect(res.status).toBe(400);
  });

  it('400 on invalid action', async () => {
    mockSession = { user: { id: 'u1', role: 'IT_ADMIN', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/audit-logs?action=DESTROY');
    expect(res.status).toBe(400);
  });

  it('400 on limit > 200', async () => {
    mockSession = { user: { id: 'u1', role: 'IT_ADMIN', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/audit-logs?limit=999');
    expect(res.status).toBe(400);
  });
});
