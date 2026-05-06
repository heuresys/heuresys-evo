import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';
const OCC_ID = '22222222-2222-2222-2222-222222222222';

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

import { escoRouter } from '../esco.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/esco', escoRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('GET /esco/stats', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/esco/stats');
    expect(res.status).toBe(401);
  });

  it('200 returns counters', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { isco_groups: 10, occupations: 50, skills: 100, digital_skills: 20 },
    ]);
    const res = await request(buildApp()).get('/esco/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.occupations).toBe(50);
  });
});

describe('GET /esco/isco-groups', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 default list', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([
      { id: '1', uri: 'http://x', code: '1', preferred_label_en: 'Managers', level: 1 },
    ]);
    const res = await request(buildApp()).get('/esco/isco-groups');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.count).toBe(1);
  });

  it('200 with level filter', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get('/esco/isco-groups?level=2');
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args[1]).toBe(2);
    expect(args[0]).toMatch(/g\.level = \$1/);
  });
});

describe('GET /esco/isco-groups/:code', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('404 when group not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get('/esco/isco-groups/9999');
    expect(res.status).toBe(404);
  });

  it('200 with children + occupations', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: '1', uri: 'http://x/1', code: '1', level: 1 }])
      .mockResolvedValueOnce([{ code: '11', preferred_label_en: 'Sub', level: 2 }])
      .mockResolvedValueOnce([{ id: OCC_ID, code: '1.1', preferred_label_en: 'Occ' }]);
    const res = await request(buildApp()).get('/esco/isco-groups/1');
    expect(res.status).toBe(200);
    expect(res.body.data.children).toHaveLength(1);
    expect(res.body.data.occupations).toHaveLength(1);
  });
});

describe('GET /esco/occupations (list)', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 default list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: OCC_ID, code: '01', preferred_label_en: 'X' }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/esco/occupations');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);
  });

  it('200 with search filter', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 0 }]);
    const res = await request(buildApp()).get('/esco/occupations?search=dev&isco_code=2');
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toContain('%dev%');
    expect(args).toContain('2');
  });
});

describe('GET /esco/occupations/:id', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('400 on invalid UUID', async () => {
    asAdmin();
    const res = await request(buildApp()).get('/esco/occupations/bad-id');
    expect(res.status).toBe(400);
  });

  it('404 when not found', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/esco/occupations/${OCC_ID}`);
    expect(res.status).toBe(404);
  });

  it('200 with essential + optional skills', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: OCC_ID, uri: 'http://x', preferred_label_en: 'Dev' }])
      .mockResolvedValueOnce([{ id: 's1', preferred_label_en: 'JS' }])
      .mockResolvedValueOnce([{ id: 's2', preferred_label_en: 'CSS' }]);
    const res = await request(buildApp()).get(`/esco/occupations/${OCC_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.data.essential_skills).toHaveLength(1);
    expect(res.body.data.optional_skills).toHaveLength(1);
  });
});

describe('GET /esco/skills (list)', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 default list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: 's1', preferred_label_en: 'JS' }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/esco/skills');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('200 with multiple filters', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]).mockResolvedValueOnce([{ count: 0 }]);
    const res = await request(buildApp()).get(
      '/esco/skills?search=java&skill_type=skill&is_digital=true&is_transversal=true'
    );
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toContain('%java%');
    expect(args).toContain('skill');
    const sql = args[0] as string;
    expect(sql).toMatch(/is_digital = true/);
    expect(sql).toMatch(/is_transversal = true/);
  });
});

describe('GET /esco/skill-groups', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 paginated list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: 'sg1', code: 'S1', preferred_label_en: 'Group' }])
      .mockResolvedValueOnce([{ count: 5 }]);
    const res = await request(buildApp()).get('/esco/skill-groups?limit=10&offset=0');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(5);
    expect(res.body.meta.limit).toBe(10);
  });
});
