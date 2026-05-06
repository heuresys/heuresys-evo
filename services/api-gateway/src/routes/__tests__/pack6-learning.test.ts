import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const ID = '22222222-2222-2222-2222-222222222222';
const REL_ID = '33333333-3333-3333-3333-333333333333';

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

import { coursesRouter } from '../courses.js';
import { learningPathsRouter } from '../learning-paths.js';
import { enrollmentsRouter } from '../enrollments.js';
import { certificationsRouter } from '../certifications.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/courses', coursesRouter);
  app.use('/learning-paths', learningPathsRouter);
  app.use('/enrollments', enrollmentsRouter);
  app.use('/certifications', certificationsRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

const crudEndpoints = [
  {
    name: 'courses',
    base: '/courses',
    create: { title: 'TS Advanced' },
    update: { is_active: false },
  },
  {
    name: 'learning-paths',
    base: '/learning-paths',
    create: { name: 'Frontend Dev' },
    update: { is_active: false },
  },
  {
    name: 'certifications',
    base: '/certifications',
    create: { employee_id: REL_ID, name: 'AWS Solutions Architect' },
    update: { status: 'expired' },
  },
];

for (const ep of crudEndpoints) {
  describe(ep.name, () => {
    beforeEach(() => {
      mockSession = null;
      cacheStub.isAllowed.mockReset().mockReturnValue(true);
      queryRawUnsafeMock.mockReset();
    });

    it('GET / 401', async () => {
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

    it('GET /:id 400/404', async () => {
      asAdmin();
      const r1 = await request(buildApp()).get(`${ep.base}/bad`);
      expect(r1.status).toBe(400);
      queryRawUnsafeMock.mockResolvedValueOnce([]);
      const r2 = await request(buildApp()).get(`${ep.base}/${ID}`);
      expect(r2.status).toBe(404);
    });

    it('POST 400/201', async () => {
      asAdmin();
      const r1 = await request(buildApp()).post(ep.base).send({});
      expect(r1.status).toBe(400);
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
      const r2 = await request(buildApp()).post(ep.base).send(ep.create);
      expect(r2.status).toBe(201);
    });

    it('PATCH 200', async () => {
      asAdmin();
      queryRawUnsafeMock
        .mockResolvedValueOnce([{ id: ID }])
        .mockResolvedValueOnce([{ id: ID, ...ep.update }]);
      const res = await request(buildApp()).patch(`${ep.base}/${ID}`).send(ep.update);
      expect(res.status).toBe(200);
    });

    it('DELETE 204', async () => {
      asAdmin();
      queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
      const res = await request(buildApp()).delete(`${ep.base}/${ID}`);
      expect(res.status).toBe(204);
    });
  });
}

describe('enrollments', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET /courses 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID, course_title: 'TS' }]);
    const res = await request(buildApp()).get('/enrollments/courses');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('POST /courses 404 if course missing', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp())
      .post('/enrollments/courses')
      .send({ course_id: REL_ID, employee_id: REL_ID });
    expect(res.status).toBe(404);
  });

  it('POST /courses 201', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: REL_ID }]).mockResolvedValueOnce([{ id: ID }]);
    const res = await request(buildApp())
      .post('/enrollments/courses')
      .send({ course_id: REL_ID, employee_id: REL_ID });
    expect(res.status).toBe(201);
  });

  it('PATCH /courses/:id 200', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ID }])
      .mockResolvedValueOnce([{ id: ID, status: 'completed' }]);
    const res = await request(buildApp())
      .patch(`/enrollments/courses/${ID}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
  });

  it('DELETE /courses/:id 204', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
    const res = await request(buildApp()).delete(`/enrollments/courses/${ID}`);
    expect(res.status).toBe(204);
  });
});
