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

import { workspaceRouter } from '../workspace.js';
import { platformRouter } from '../platform.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/workspace', workspaceRouter);
  app.use('/platform', platformRouter);
  app.use(errorHandler);
  return app;
}

function asAdmin(): void {
  mockSession = { user: { id: 'u1', role: 'TENANT_OWNER', tenantId: ECONOVA } };
  cacheStub.isAllowed.mockReturnValue(true);
}

describe('/workspace/templates', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET 401', async () => {
    const res = await request(buildApp()).get('/workspace/templates');
    expect(res.status).toBe(401);
  });

  it('GET 200 list', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ID, name: 'T' }])
      .mockResolvedValueOnce([{ count: 1 }]);
    const res = await request(buildApp()).get('/workspace/templates');
    expect(res.status).toBe(200);
  });

  it('GET /:id 404', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([]);
    const res = await request(buildApp()).get(`/workspace/templates/${ID}`);
    expect(res.status).toBe(404);
  });

  it('POST 400 missing body', async () => {
    asAdmin();
    const res = await request(buildApp()).post('/workspace/templates').send({});
    expect(res.status).toBe(400);
  });

  it('POST 201', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
    const res = await request(buildApp()).post('/workspace/templates').send({ name: 'New' });
    expect(res.status).toBe(201);
  });

  it('PATCH 200', async () => {
    asAdmin();
    queryRawUnsafeMock
      .mockResolvedValueOnce([{ id: ID }])
      .mockResolvedValueOnce([{ id: ID, name: 'Updated' }]);
    const res = await request(buildApp())
      .patch(`/workspace/templates/${ID}`)
      .send({ name: 'Updated' });
    expect(res.status).toBe(200);
  });

  it('DELETE 204', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID }]);
    const res = await request(buildApp()).delete(`/workspace/templates/${ID}`);
    expect(res.status).toBe(204);
  });
});

describe('/workspace/widgets', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID, name: 'Chart' }]);
    const res = await request(buildApp()).get('/workspace/widgets');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('/platform', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
    queryRawUnsafeMock.mockReset();
  });

  it('GET /features 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID, name: 'feat-1' }]);
    const res = await request(buildApp()).get('/platform/features');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /pages 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ id: ID, name: 'page-1' }]);
    const res = await request(buildApp()).get('/platform/pages');
    expect(res.status).toBe(200);
  });

  it('GET /stats 200', async () => {
    asAdmin();
    queryRawUnsafeMock.mockResolvedValueOnce([{ active_features: 5, active_pages: 10 }]);
    const res = await request(buildApp()).get('/platform/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.active_features).toBe(5);
  });

  it('GET /features 401', async () => {
    const res = await request(buildApp()).get('/platform/features');
    expect(res.status).toBe(401);
  });
});
