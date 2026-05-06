import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';

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

import { naceRouter } from '../nace.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/nace', naceRouter);
  app.use(errorHandler);
  return app;
}

describe('GET /nace/sections', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/nace/sections');
    expect(res.status).toBe(401);
  });

  it('403 when role lacks both ESCO_KG.view and EMPLOYEES.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/nace/sections');
    expect(res.status).toBe(403);
    expect(res.body.area).toBe('ESCO_KG');
  });

  it('200 returns level-1 sections', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    queryRawUnsafeMock.mockResolvedValueOnce([
      { code: 'A', name_it: 'Agricoltura', name_en: 'Agriculture', icon: '🌾', color: '#0a0' },
    ]);
    const res = await request(buildApp()).get('/nace/sections');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].code).toBe('A');
    const sql = queryRawUnsafeMock.mock.calls[0]![0] as string;
    expect(sql).toMatch(/level\s*=\s*1/);
  });
});

describe('GET /nace/divisions', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/nace/divisions');
    expect(res.status).toBe(401);
  });

  it('200 returns all divisions when no section filter', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    queryRawUnsafeMock.mockResolvedValueOnce([
      { code: '01', section_code: 'A', name_it: 'Coltivazioni', name_en: 'Crop' },
    ]);
    const res = await request(buildApp()).get('/nace/divisions');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args).toHaveLength(1); // SQL only, no params
  });

  it('200 filters by section param', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    queryRawUnsafeMock.mockResolvedValueOnce([
      { code: '01', section_code: 'A', name_it: 'X', name_en: 'X' },
    ]);
    const res = await request(buildApp()).get('/nace/divisions?section=A');
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args[1]).toBe('A');
    const sql = args[0] as string;
    expect(sql).toMatch(/parent_code\s*=\s*\$1/);
  });
});

describe('GET /nace/groups', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('200 returns all groups when no division filter', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    queryRawUnsafeMock.mockResolvedValueOnce([
      { code: '01.1', division_code: '01', name_it: 'Y', name_en: 'Y' },
    ]);
    const res = await request(buildApp()).get('/nace/groups');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('200 filters by division param', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get('/nace/groups?division=01');
    expect(res.status).toBe(200);
    const args = queryRawUnsafeMock.mock.calls[0]!;
    expect(args[1]).toBe('01');
  });
});

describe('GET /nace/size-classes', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/nace/size-classes');
    expect(res.status).toBe(401);
  });

  it('200 returns size classes ordered by sort_order', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    queryRawUnsafeMock.mockResolvedValueOnce([
      {
        code: 'MICRO',
        name_it: 'Micro',
        name_en: 'Micro',
        min_employees: 0,
        max_employees: 9,
        sort_order: 1,
      },
      {
        code: 'SMALL',
        name_it: 'Piccola',
        name_en: 'Small',
        min_employees: 10,
        max_employees: 49,
        sort_order: 2,
      },
    ]);
    const res = await request(buildApp()).get('/nace/size-classes');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].code).toBe('MICRO');
    const sql = queryRawUnsafeMock.mock.calls[0]![0] as string;
    expect(sql).toMatch(/company_sizes/);
    expect(sql).toMatch(/ORDER BY sort_order/);
  });
});

describe('GET /nace/hierarchy', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/nace/hierarchy');
    expect(res.status).toBe(401);
  });

  it('200 returns full sections + divisions + groups tree', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ code: 'A', name_it: 'Agri', name_en: 'Agri' }])
      .mockResolvedValueOnce([{ code: '01', section_code: 'A', name_it: 'D', name_en: 'D' }])
      .mockResolvedValueOnce([{ code: '01.1', division_code: '01', name_it: 'G', name_en: 'G' }]);
    const res = await request(buildApp()).get('/nace/hierarchy');
    expect(res.status).toBe(200);
    expect(res.body.data.sections).toHaveLength(1);
    expect(res.body.data.divisions).toHaveLength(1);
    expect(res.body.data.groups).toHaveLength(1);
    expect(queryRawUnsafeMock).toHaveBeenCalledTimes(3);
  });

  it('403 with no RBP permission', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/nace/hierarchy');
    expect(res.status).toBe(403);
  });
});
