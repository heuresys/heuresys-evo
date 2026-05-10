import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const EMP_ID = '22222222-2222-2222-2222-222222222222';
const ASSESS_ID = '33333333-3333-3333-3333-333333333333';

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

import { skillAssessmentsRouter } from '../skill-assessments.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/skill-assessments', skillAssessmentsRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('GET /skill-assessments/stats', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/skill-assessments/stats');
    expect(res.status).toBe(401);
  });

  it('403 without EMPLOYEES.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/skill-assessments/stats');
    expect(res.status).toBe(403);
  });

  it('200 returns totals + by_method + by_level', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([
        {
          total_assessments: 10,
          employees_assessed: 5,
          unique_skills: 8,
          avg_level: 3.5,
          with_gaps: 4,
          avg_gap: 1.5,
        },
      ])
      .mockResolvedValueOnce([{ assessment_method: 'self', count: 5 }])
      .mockResolvedValueOnce([{ assessed_level: 3, count: 4 }]);
    const res = await request(buildApp()).get('/skill-assessments/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.total_assessments).toBe(10);
    expect(res.body.data.by_method).toHaveLength(1);
    expect(res.body.data.by_level).toHaveLength(1);
  });
});

describe('GET /skill-assessments/skills/summary', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 returns per-skill summary', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { skill_name: 'JS', employees_with_skill: 3, avg_level: 4 },
    ]);
    const res = await request(buildApp()).get('/skill-assessments/skills/summary');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('GET /skill-assessments/gaps', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 returns gaps + distribution', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ASSESS_ID, skill_name: 'JS', gap: 2, employee_name: 'A B' }])
      .mockResolvedValueOnce([{ gap: 2, count: 3 }]);
    const res = await request(buildApp()).get('/skill-assessments/gaps?min_gap=2');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.gap_distribution).toHaveLength(1);
  });
});

describe('GET /skill-assessments/employee/:employeeId', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/skill-assessments/employee/bad');
    expect(res.status).toBe(400);
  });

  it('404 when employee not in tenant', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/skill-assessments/employee/${EMP_ID}`);
    expect(res.status).toBe(404);
  });

  it('200 with assessments + summary', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([
        { id: EMP_ID, first_name: 'Jane', last_name: 'Doe', job_title: 'Dev' },
      ])
      .mockResolvedValueOnce([{ id: ASSESS_ID, skill_name: 'JS', assessed_level: 4 }])
      .mockResolvedValueOnce([
        { total_skills: 1, avg_level: 4, skills_with_gaps: 0, total_gap: 0 },
      ]);
    const res = await request(buildApp()).get(`/skill-assessments/employee/${EMP_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.employee.id).toBe(EMP_ID);
    expect(res.body.data.assessments).toHaveLength(1);
    expect(res.body.data.summary.total_skills).toBe(1);
  });
});

describe('GET /skill-assessments (list)', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 default list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ASSESS_ID, skill_name: 'JS' }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/skill-assessments');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);
  });

  it('200 with skill_name filter', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 0 }]);
    const res = await request(buildApp()).get('/skill-assessments?skill_name=java&has_gap=true');
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toContain('%java%');
    const sql = args[0] as string;
    expect(sql).toMatch(/esa\.gap > 0/);
  });
});

describe('GET /skill-assessments/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/skill-assessments/bad');
    expect(res.status).toBe(400);
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/skill-assessments/${ASSESS_ID}`);
    expect(res.status).toBe(404);
  });

  it('200 returns single', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ASSESS_ID, skill_name: 'JS' }]);
    const res = await request(buildApp()).get(`/skill-assessments/${ASSESS_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(ASSESS_ID);
  });
});

describe('POST /skill-assessments', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).post('/skill-assessments').send({});
    expect(res.status).toBe(401);
  });

  it('400 on invalid body', async () => {
    asAdmin();
    const res = await request(buildApp()).post('/skill-assessments').send({ skill_name: 'X' });
    expect(res.status).toBe(400);
  });

  it('404 when employee missing', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp())
      .post('/skill-assessments')
      .send({ employee_id: EMP_ID, skill_name: 'JS', assessed_level: 4 });
    expect(res.status).toBe(404);
  });

  it('201 creates assessment', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: EMP_ID }])
      .mockResolvedValueOnce([{ id: ASSESS_ID, skill_name: 'JS', assessed_level: 4 }]);
    const res = await request(buildApp())
      .post('/skill-assessments')
      .send({ employee_id: EMP_ID, skill_name: 'JS', assessed_level: 4 });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(ASSESS_ID);
  });
});

describe('PATCH /skill-assessments/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp())
      .patch('/skill-assessments/bad')
      .send({ assessed_level: 5 });
    expect(res.status).toBe(400);
  });

  it('400 on empty body', async () => {
    asAdmin();
    const res = await request(buildApp()).patch(`/skill-assessments/${ASSESS_ID}`).send({});
    expect(res.status).toBe(400);
  });

  it('404 when assessment missing', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp())
      .patch(`/skill-assessments/${ASSESS_ID}`)
      .send({ assessed_level: 5 });
    expect(res.status).toBe(404);
  });

  it('200 updates', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ASSESS_ID }])
      .mockResolvedValueOnce([{ id: ASSESS_ID, assessed_level: 5 }]);
    const res = await request(buildApp())
      .patch(`/skill-assessments/${ASSESS_ID}`)
      .send({ assessed_level: 5 });
    expect(res.status).toBe(200);
    expect(res.body.data.assessed_level).toBe(5);
  });
});

describe('DELETE /skill-assessments/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).delete('/skill-assessments/bad');
    expect(res.status).toBe(400);
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).delete(`/skill-assessments/${ASSESS_ID}`);
    expect(res.status).toBe(404);
  });

  it('204 deletes', async () => {
    asAdmin();
    // F2 H4: SELECT existing (for audit oldValue) + DELETE
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ASSESS_ID }])
      .mockResolvedValueOnce([{ id: ASSESS_ID }]);
    const res = await request(buildApp()).delete(`/skill-assessments/${ASSESS_ID}`);
    expect(res.status).toBe(204);
  });
});
