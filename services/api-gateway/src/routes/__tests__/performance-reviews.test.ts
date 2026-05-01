import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const EMP_ID = 'aaaaaaaa-1111-1111-1111-111111111111';

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      $queryRawUnsafe: vi.fn(async () => [
        {
          id: 'pr-1',
          employee_id: EMP_ID,
          reviewer_id: 'rev-1',
          review_period_start: '2025-01-01',
          review_period_end: '2025-12-31',
          review_type: 'annual',
          overall_rating: 4.5,
          status: 'submitted',
          submitted_at: new Date(),
          created_at: new Date(),
        },
      ]),
    };
    return fn(tx);
  }),
  mergeScopedWhere: vi.fn(),
  prisma: {} as unknown,
}));

let mockSession: {
  user?: { id?: string; role?: string; tenantId?: string | null; employeeId?: string | null };
} | null = null;
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

import { performanceReviewsRouter } from '../performance-reviews.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/performance-reviews', performanceReviewsRouter);
  app.use(errorHandler);
  return app;
}

describe('GET /performance-reviews', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    cacheStub.getPermission.mockReset().mockReturnValue({ scopeType: 'SELF' });
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/performance-reviews');
    expect(res.status).toBe(401);
  });

  it('403 when role lacks PERFORMANCE_REVIEWS.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ID } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/performance-reviews');
    expect(res.status).toBe(403);
  });

  it('200 returns reviews with SELF scope', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ID } };
    const res = await request(buildApp()).get('/performance-reviews');
    expect(res.status).toBe(200);
    expect(res.body.scope).toBe('SELF');
    expect(res.body.data).toHaveLength(1);
  });

  it('200 with HIERARCHY scope (LINE_MANAGER reviewing subordinates)', async () => {
    mockSession = {
      user: { id: 'u1', role: 'LINE_MANAGER', tenantId: ECONOVA, employeeId: EMP_ID },
    };
    cacheStub.getPermission.mockReturnValue({ scopeType: 'HIERARCHY' });
    const res = await request(buildApp()).get('/performance-reviews');
    expect(res.status).toBe(200);
    expect(res.body.scope).toBe('HIERARCHY');
  });

  it('400 on invalid status filter', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA, employeeId: EMP_ID } };
    const res = await request(buildApp()).get('/performance-reviews?status=ghost');
    expect(res.status).toBe(400);
  });
});
