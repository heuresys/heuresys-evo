import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const ECONOVA = '11111111-1111-1111-1111-111111111111';

vi.mock('../../db/pool.js', () => ({
  withTenant: vi.fn(async (_t: string, fn: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      $queryRawUnsafe: vi.fn(async (sql: string) => {
        if (/^INSERT/i.test(sql)) {
          return [{ id: 'v-new', version: 2, applied_at: new Date(), notes: 'bump test' }];
        }
        return [
          {
            id: 'v-1',
            tenant_id: ECONOVA,
            version: 1,
            applied_at: new Date(),
            applied_by: null,
            notes: 'baseline',
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

import { adminTenantSchemaRouter } from '../admin-tenant-schema.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/admin/tenant-schema-version', adminTenantSchemaRouter);
  app.use(errorHandler);
  return app;
}

describe('GET /admin/tenant-schema-version', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
  });

  it('401 without session', async () => {
    const res = await request(buildApp()).get('/admin/tenant-schema-version');
    expect(res.status).toBe(401);
  });

  it('403 when role lacks TENANT_ADMIN.view', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/admin/tenant-schema-version');
    expect(res.status).toBe(403);
  });

  it('200 returns current version + history', async () => {
    mockSession = { user: { id: 'u1', role: 'TENANT_OWNER', tenantId: ECONOVA } };
    const res = await request(buildApp()).get('/admin/tenant-schema-version');
    expect(res.status).toBe(200);
    expect(res.body.data.current).toBe(1);
    expect(res.body.data.history).toHaveLength(1);
  });
});

describe('POST /admin/tenant-schema-version/bump', () => {
  beforeEach(() => {
    mockSession = null;
    cacheStub.isAllowed.mockReset().mockReturnValue(true);
  });

  it('403 when role lacks TENANT_ADMIN.edit', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE', tenantId: ECONOVA } };
    cacheStub.isAllowed.mockReturnValue(false);
    const res = await request(buildApp())
      .post('/admin/tenant-schema-version/bump')
      .send({ notes: 'testing' });
    expect(res.status).toBe(403);
  });

  it('400 Zod rejection on missing notes', async () => {
    mockSession = { user: { id: 'u1', role: 'TENANT_OWNER', tenantId: ECONOVA } };
    const res = await request(buildApp()).post('/admin/tenant-schema-version/bump').send({});
    expect(res.status).toBe(400);
  });

  it('400 Zod rejection on empty notes', async () => {
    mockSession = { user: { id: 'u1', role: 'TENANT_OWNER', tenantId: ECONOVA } };
    const res = await request(buildApp())
      .post('/admin/tenant-schema-version/bump')
      .send({ notes: '' });
    expect(res.status).toBe(400);
  });

  it('201 successful bump', async () => {
    mockSession = { user: { id: 'u1', role: 'TENANT_OWNER', tenantId: ECONOVA } };
    const res = await request(buildApp())
      .post('/admin/tenant-schema-version/bump')
      .send({ notes: 'Move to ontology v2 — adds skill clusters' });
    expect(res.status).toBe(201);
    expect(res.body.data.version).toBe(2);
  });
});
