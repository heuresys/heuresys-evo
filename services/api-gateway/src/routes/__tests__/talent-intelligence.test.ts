import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const EMP_ID = '22222222-2222-2222-2222-222222222222';

const queryRawUnsafeMock = vi.fn();

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = { $queryRawUnsafe: queryRawUnsafeMock };
    return fn(tx);
  }),
  mergeScopedWhere: vi.fn(),
  prisma: {} as unknown,
}));

let mockSession: {
  user?: { id?: string; role?: string; tenantId?: string | null; employeeId?: string };
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
};
vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheStub,
}));

import { talentIntelligenceRouter } from '../talent-intelligence.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/talent', talentIntelligenceRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = {
    user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA, employeeId: EMP_ID },
  };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('GET /talent/snapshot/:employeeId', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get(`/talent/snapshot/${EMP_ID}`);
    expect(res.status).toBe(401);
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/talent/snapshot/bad-id');
    expect(res.status).toBe(400);
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/talent/snapshot/${EMP_ID}`);
    expect(res.status).toBe(404);
  });

  it('200 returns snapshot', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ snapshot: { skills: 5, level: 3 } }]);
    const res = await request(buildApp()).get(`/talent/snapshot/${EMP_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.skills).toBe(5);
  });
});

describe('GET /talent/snapshot/me', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 returns own snapshot', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ snapshot: { mine: true } }]);
    const res = await request(buildApp()).get('/talent/snapshot/me');
    expect(res.status).toBe(200);
    expect(res.body.data.mine).toBe(true);
  });

  it('404 when no employee linked', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(true);
    const res = await request(buildApp()).get('/talent/snapshot/me');
    expect(res.status).toBe(404);
  });
});

describe('GET /talent/signals', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 returns employees + stats', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ employee_id: EMP_ID, attrition_risk_score: 75 }])
      .mockResolvedValueOnce([{ total: 10, at_risk: 3 }]);
    const res = await request(buildApp()).get('/talent/signals?risk_min=50');
    expect(res.status).toBe(200);
    expect(res.body.data.employees).toHaveLength(1);
    expect(res.body.data.stats.total).toBe(10);
  });

  it('200 with high_potential filter', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const res = await request(buildApp()).get('/talent/signals?high_potential=true');
    expect(res.status).toBe(200);
    const sql = queryRawUnsafeMock.mock.calls[0]![0] as string;
    expect(sql).toMatch(/is_high_potential = true/);
  });
});

describe('GET /talent/timeline/:employeeId', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 returns timeline', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { id: 't1', event_type: 'course_completed', event_date: '2026-01-01' },
    ]);
    const res = await request(buildApp()).get(
      `/talent/timeline/${EMP_ID}?event_type=course_completed`
    );
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toContain('course_completed');
  });
});

describe('POST /talent/signals/refresh', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('403 without EMPLOYEES.edit', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).post('/talent/signals/refresh');
    expect(res.status).toBe(403);
  });

  it('200 refreshes MV', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce(undefined).mockResolvedValueOnce([{ count: 42 }]);
    const res = await request(buildApp()).post('/talent/signals/refresh');
    expect(res.status).toBe(200);
    expect(res.body.data.refreshed).toBe(true);
    expect(res.body.data.rows).toBe(42);
  });
});
