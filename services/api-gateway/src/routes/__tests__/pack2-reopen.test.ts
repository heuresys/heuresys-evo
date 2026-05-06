import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const ID = '22222222-2222-2222-2222-222222222222';

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

import { skillAnalyticsRouter } from '../skill-analytics.js';
import { skillTaxonomyRouter } from '../skill-taxonomy.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/skill-analytics', skillAnalyticsRouter);
  app.use('/skill-taxonomy', skillTaxonomyRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('/skill-analytics', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET /summary 401', async () => {
    const res = await request(buildApp()).get('/skill-analytics/summary');
    expect(res.status).toBe(401);
  });

  it('GET /summary 403 without EMPLOYEES.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/skill-analytics/summary');
    expect(res.status).toBe(403);
  });

  it('GET /summary 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      {
        total_employees: 50,
        employees_with_profiles: 30,
        total_skills_tracked: 80,
        avg_proficiency: 3.4,
        critical_shortages: 5,
        departments: 6,
      },
    ]);
    const res = await request(buildApp()).get('/skill-analytics/summary');
    expect(res.status).toBe(200);
    expect(res.body.data.total_employees).toBe(50);
  });

  it('GET /shortages 200 + summary breakdown', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { skill_name: 'JS', shortage_count: 5, severity: 'high' },
      { skill_name: 'Py', shortage_count: 3, severity: 'medium' },
      { skill_name: 'Rust', shortage_count: 1, severity: 'low' },
    ]);
    const res = await request(buildApp()).get('/skill-analytics/shortages');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(3);
    expect(res.body.summary.high).toBe(1);
    expect(res.body.summary.medium).toBe(1);
    expect(res.body.summary.low).toBe(1);
  });

  it('GET /shortages with filter', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get('/skill-analytics/shortages?min_shortage=3');
    expect(res.status).toBe(200);
    const sql = queryRawUnsafeMock.mock.calls[0]![0] as string;
    expect(sql).toMatch(/required_positions - COALESCE\(avs\.available_employees, 0\)\) >=/);
  });

  it('GET /dashboard 200 (composito)', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ total_employees: 50, departments: 6 }])
      .mockResolvedValueOnce([{ skill_name: 'X', severity: 'critical' }]);
    const res = await request(buildApp()).get('/skill-analytics/dashboard');
    expect(res.status).toBe(200);
    expect(res.body.data.summary.total_employees).toBe(50);
    expect(res.body.data.critical_shortages).toHaveLength(1);
    expect(res.body.data.shortages_summary.critical).toBe(1);
  });

  it('GET /skill/:id/coverage 400 invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/skill-analytics/skill/bad/coverage');
    expect(res.status).toBe(400);
  });

  it('GET /skill/:id/coverage 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { employees_with_skill: 12, avg_proficiency: 3.8, expert_level_count: 4 },
    ]);
    const res = await request(buildApp()).get(`/skill-analytics/skill/${ID}/coverage`);
    expect(res.status).toBe(200);
    expect(res.body.data.employees_with_skill).toBe(12);
  });
});

describe('/skill-taxonomy', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET /stats 200 with breakdown', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ total_classifications: 100, needs_review: 5, unique_clusters: 12 }])
      .mockResolvedValueOnce([{ primary_category: 'hard', count: 60 }])
      .mockResolvedValueOnce([{ cognitive_level: 4, count: 30 }])
      .mockResolvedValueOnce([{ transferability: 'transferable', count: 80 }]);
    const res = await request(buildApp()).get('/skill-taxonomy/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.total_classifications).toBe(100);
    expect(res.body.data.by_category).toHaveLength(1);
    expect(res.body.data.by_cognitive_level).toHaveLength(1);
    expect(res.body.data.by_transferability).toHaveLength(1);
  });

  it('GET /classifications 200 list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ID, primary_category: 'hard' }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/skill-taxonomy/classifications');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /classifications with filters', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 0 }]);
    const res = await request(buildApp()).get(
      '/skill-taxonomy/classifications?primary_category=hard&cognitive_level=4&transferability=transferable'
    );
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toContain('hard');
    expect(args).toContain(4);
    expect(args).toContain('transferable');
  });

  it('GET /skills/:id/classification 404', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/skill-taxonomy/skills/${ID}/classification`);
    expect(res.status).toBe(404);
  });

  it('GET /skills/:id/classification 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { esco_skill_id: ID, primary_category: 'soft', cluster_code: 'COMM' },
    ]);
    const res = await request(buildApp()).get(`/skill-taxonomy/skills/${ID}/classification`);
    expect(res.status).toBe(200);
  });

  it('GET /clusters 200', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ID, code: 'TECH', name_en: 'Technical', skills_count: 20 }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/skill-taxonomy/clusters');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /clusters/:id 404', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/skill-taxonomy/clusters/${ID}`);
    expect(res.status).toBe(404);
  });

  it('GET /clusters/:id 200 with skills + children', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ID, code: 'TECH', name_en: 'Tech' }])
      .mockResolvedValueOnce([{ esco_skill_id: 's1', preferred_label_en: 'JS' }])
      .mockResolvedValueOnce([{ id: 'c1', code: 'WEB', name_en: 'Web Dev' }]);
    const res = await request(buildApp()).get(`/skill-taxonomy/clusters/${ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.skills).toHaveLength(1);
    expect(res.body.data.children).toHaveLength(1);
  });
});
