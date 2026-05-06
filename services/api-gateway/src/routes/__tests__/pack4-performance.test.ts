import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const REVIEW_ID = '22222222-2222-2222-2222-222222222222';
const CYCLE_ID = '33333333-3333-3333-3333-333333333333';
const EMP_ID = '44444444-4444-4444-4444-444444444444';

const queryRawUnsafeMock = vi.fn();

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = { $queryRawUnsafe: queryRawUnsafeMock };
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
};
vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheStub,
}));

import { reviews360Router } from '../reviews-360.js';
import { meritCyclesRouter } from '../merit-cycles.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/reviews-360', reviews360Router);
  app.use('/merit-cycles', meritCyclesRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('/reviews-360', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET /summary 401 without session', async () => {
    const res = await request(buildApp()).get('/reviews-360/summary');
    expect(res.status).toBe(401);
  });

  it('GET /summary 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ tenant_id: ECONOVA, total: 5 }]);
    const res = await request(buildApp()).get('/reviews-360/summary');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /response-rates 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ rate: 80 }]);
    const res = await request(buildApp()).get('/reviews-360/response-rates');
    expect(res.status).toBe(200);
  });

  it('GET / list with target filter', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: REVIEW_ID, status: 'pending' }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get(`/reviews-360?target_employee_id=${EMP_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /:id 400 invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/reviews-360/bad');
    expect(res.status).toBe(400);
  });

  it('GET /:id 404', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/reviews-360/${REVIEW_ID}`);
    expect(res.status).toBe(404);
  });

  it('GET /:id 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: REVIEW_ID, status: 'completed' }]);
    const res = await request(buildApp()).get(`/reviews-360/${REVIEW_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(REVIEW_ID);
  });

  it('POST 400 missing required fields', async () => {
    asAdmin();
    const res = await request(buildApp()).post('/reviews-360').send({});
    expect(res.status).toBe(400);
  });

  it('POST 201 creates review', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: REVIEW_ID }]);
    const res = await request(buildApp())
      .post('/reviews-360')
      .send({ target_employee_id: EMP_ID, reviewer_employee_id: EMP_ID });
    expect(res.status).toBe(201);
  });

  it('PATCH 404 missing', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp())
      .patch(`/reviews-360/${REVIEW_ID}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(404);
  });

  it('PATCH 200', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: REVIEW_ID }])
      .mockResolvedValueOnce([{ id: REVIEW_ID, status: 'completed' }]);
    const res = await request(buildApp())
      .patch(`/reviews-360/${REVIEW_ID}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
  });

  it('DELETE 204', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: REVIEW_ID }]);
    const res = await request(buildApp()).delete(`/reviews-360/${REVIEW_ID}`);
    expect(res.status).toBe(204);
  });
});

describe('/merit-cycles', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET /stats 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { total: 3, active: 1, planning: 1, completed: 1, total_budget: 100000, total_spent: 30000 },
    ]);
    const res = await request(buildApp()).get('/merit-cycles/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(3);
  });

  it('GET /current returns null when no active cycle', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get('/merit-cycles/current');
    expect(res.status).toBe(200);
    expect(res.body.data).toBe(null);
  });

  it('GET / list with status filter', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: CYCLE_ID, name: 'Q1 Merit', status: 'active' }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/merit-cycles?status=active');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /:id 400 invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/merit-cycles/bad');
    expect(res.status).toBe(400);
  });

  it('GET /:id 404', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/merit-cycles/${CYCLE_ID}`);
    expect(res.status).toBe(404);
  });

  it('POST 400 missing required', async () => {
    asAdmin();
    const res = await request(buildApp()).post('/merit-cycles').send({});
    expect(res.status).toBe(400);
  });

  it('POST 201', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: CYCLE_ID, name: 'Q1' }]);
    const res = await request(buildApp())
      .post('/merit-cycles')
      .send({ name: 'Q1 Merit', effective_date: '2026-01-01' });
    expect(res.status).toBe(201);
  });

  it('POST /:id/activate 404 if not in planning', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).post(`/merit-cycles/${CYCLE_ID}/activate`);
    expect(res.status).toBe(404);
  });

  it('POST /:id/activate 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: CYCLE_ID, status: 'active' }]);
    const res = await request(buildApp()).post(`/merit-cycles/${CYCLE_ID}/activate`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('active');
  });

  it('POST /:id/complete 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: CYCLE_ID, status: 'completed' }]);
    const res = await request(buildApp()).post(`/merit-cycles/${CYCLE_ID}/complete`);
    expect(res.status).toBe(200);
  });

  it('PATCH 200', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: CYCLE_ID }])
      .mockResolvedValueOnce([{ id: CYCLE_ID, name: 'Updated' }]);
    const res = await request(buildApp())
      .patch(`/merit-cycles/${CYCLE_ID}`)
      .send({ name: 'Updated' });
    expect(res.status).toBe(200);
  });

  it('DELETE 204 (cancel)', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: CYCLE_ID }]);
    const res = await request(buildApp()).delete(`/merit-cycles/${CYCLE_ID}`);
    expect(res.status).toBe(204);
  });
});
