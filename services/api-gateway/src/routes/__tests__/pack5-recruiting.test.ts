import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const ID = '22222222-2222-2222-2222-222222222222';
const REL_ID = '33333333-3333-3333-3333-333333333333';

const queryRawUnsafeMock = vi.fn();

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      $queryRawUnsafe: queryRawUnsafeMock,
      // F2 H4: auditedTransaction wraps writes in tx.audit_logs.create
      audit_logs: {
        create: vi.fn(async () => ({ id: 'audit-mock-id' })),
      },
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
};
vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheStub,
}));

import { candidatesRouter } from '../candidates.js';
import { jobPostingsRouter } from '../job-postings.js';
import { requisitionsRouter } from '../requisitions.js';
import { interviewsRouter } from '../interviews.js';
import { offersRouter } from '../offers.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/candidates', candidatesRouter);
  app.use('/job-postings', jobPostingsRouter);
  app.use('/requisitions', requisitionsRouter);
  app.use('/interviews', interviewsRouter);
  app.use('/offers', offersRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

const endpoints: Array<{
  name: string;
  base: string;
  createBody: Record<string, unknown>;
  updateBody: Record<string, unknown>;
}> = [
  {
    name: 'candidates',
    base: '/candidates',
    createBody: { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' },
    updateBody: { stage: 'screening' },
  },
  {
    name: 'job-postings',
    base: '/job-postings',
    createBody: { title: 'Senior Engineer' },
    updateBody: { status: 'closed' },
  },
  {
    name: 'requisitions',
    base: '/requisitions',
    createBody: { position_title: 'Senior Engineer' },
    updateBody: { status: 'approved' },
  },
  {
    name: 'interviews',
    base: '/interviews',
    createBody: {
      candidate_id: REL_ID,
      interview_type: 'phone',
      scheduled_at: '2026-06-01T10:00:00Z',
    },
    updateBody: { status: 'completed' },
  },
  {
    name: 'offers',
    base: '/offers',
    createBody: {
      candidate_id: REL_ID,
      position_title: 'Engineer',
      base_salary: 70000,
      start_date: '2026-06-01',
    },
    updateBody: { status: 'accepted' },
  },
];

for (const ep of endpoints) {
  describe(ep.name, () => {
    beforeEach(() => {
      mockSession = null;
      cacheStub.isAllowed.mockReset().mockReturnValue(true);
      queryRawUnsafeMock.mockReset();
    });

    it('GET / 401 without session', async () => {
      const res = await request(buildApp()).get(ep.base);
      expect(res.status).toBe(401);
    });

    it('GET / 200 list', async () => {
      asAdmin();
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]).mockResolvedValueOnce([{ count: 1 }]);
      const res = await request(buildApp()).get(ep.base);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('GET /:id 400 invalid UUID', async () => {
      asAdmin();
      const res = await request(buildApp()).get(`${ep.base}/bad`);
      expect(res.status).toBe(400);
    });

    it('GET /:id 404', async () => {
      asAdmin();
      queryRawUnsafeMock.mockResolvedValueOnce([]);
      const res = await request(buildApp()).get(`${ep.base}/${ID}`);
      expect(res.status).toBe(404);
    });

    it('POST 400 missing required', async () => {
      asAdmin();
      const res = await request(buildApp()).post(ep.base).send({});
      expect(res.status).toBe(400);
    });

    it('POST 201 creates', async () => {
      asAdmin();
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
      const res = await request(buildApp()).post(ep.base).send(ep.createBody);
      expect(res.status).toBe(201);
    });

    it('PATCH 404 missing', async () => {
      asAdmin();
      queryRawUnsafeMock.mockResolvedValueOnce([]);
      const res = await request(buildApp()).patch(`${ep.base}/${ID}`).send(ep.updateBody);
      expect(res.status).toBe(404);
    });

    it('PATCH 200', async () => {
      asAdmin();
      queryRawUnsafeMock
        .mockResolvedValueOnce([{ id: ID }])
        .mockResolvedValueOnce([{ id: ID, ...ep.updateBody }]);
      const res = await request(buildApp()).patch(`${ep.base}/${ID}`).send(ep.updateBody);
      expect(res.status).toBe(200);
    });

    it('DELETE 204', async () => {
      asAdmin();
      // F2 H4: SELECT existing (for audit oldValue) + DELETE
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]).mockResolvedValueOnce([{ id: ID }]);
      const res = await request(buildApp()).delete(`${ep.base}/${ID}`);
      expect(res.status).toBe(204);
    });
  });
}
