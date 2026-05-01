import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      $queryRawUnsafe: vi.fn(async (sql: string, q: string) => {
        // Return mock occupations; SQL pattern check ensures correct lang column.
        const isItalian = /preferred_label_it/.test(sql);
        return [
          {
            id: 'occ-1',
            uri:
              'http://data.europa.eu/esco/occupation/' + (isItalian ? 'sviluppatore' : 'developer'),
            code: '2511.4',
            preferred_label: isItalian ? 'Sviluppatore software' : 'Software developer',
            isco_code: '2512',
            level: 4,
          },
        ];
      }),
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

import { escoRouter } from '../esco.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/esco', escoRouter);
  app.use(errorHandler);
  return app;
}

describe('GET /esco/occupations/search', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/esco/occupations/search?q=developer');
    expect(res.status).toBe(401);
  });

  it('403 when role lacks both ESCO_KG.view and EMPLOYEES.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/esco/occupations/search?q=developer');
    expect(res.status).toBe(403);
  });

  it('200 fallback ESCO_KG denied → EMPLOYEES allowed', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    // First call (ESCO_KG.view) → false; second call (EMPLOYEES.view) → true
    cacheStub.isAllowed.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const res = await request(buildApp()).get('/esco/occupations/search?q=developer');
    expect(res.status).toBe(200);
  });

  it('200 returns occupations for query', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/esco/occupations/search?q=developer');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.query.mode).toBe('keyword');
    expect(res.body.query.lang).toBe('en');
  });

  it('200 lang=it uses italian columns', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/esco/occupations/search?q=sviluppatore&lang=it');
    expect(res.status).toBe(200);
    expect(res.body.query.lang).toBe('it');
    expect(res.body.data[0].preferred_label).toContain('Sviluppatore');
  });

  it('400 on q shorter than 2 chars', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/esco/occupations/search?q=a');
    expect(res.status).toBe(400);
  });

  it('400 on invalid lang', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/esco/occupations/search?q=developer&lang=fr');
    expect(res.status).toBe(400);
  });

  it('400 on limit > 50', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/esco/occupations/search?q=developer&limit=999');
    expect(res.status).toBe(400);
  });
});
