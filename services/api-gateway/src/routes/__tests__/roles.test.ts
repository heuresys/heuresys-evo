import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

type MockSession = {
  expires: string;
  user?: { id?: string; role?: string; tenantId?: string | null };
};
const FAR_FUTURE = '2099-12-31T23:59:59Z';
let mockSession: MockSession | null = null;

vi.mock('../../middleware/auth.js', () => ({
  requireAuth: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!mockSession?.user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    (req as express.Request & { session?: MockSession }).session = mockSession;
    next();
  },
}));

const cacheMock = {
  ensureLoaded: vi.fn().mockResolvedValue(undefined),
  isAllowed: vi.fn().mockReturnValue(true),
};

vi.mock('../../services/rbp-cache.js', () => ({
  getRBPCache: () => cacheMock,
}));

import { rolesRouter } from '../roles.js';
import { errorHandler } from '../../middleware/error.js';

function buildApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use('/roles', rolesRouter);
  app.use((_req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'not_found' });
  });
  app.use(errorHandler);
  return app;
}

describe('GET /roles contract', () => {
  beforeEach(() => {
    mockSession = null;
    cacheMock.ensureLoaded.mockReset().mockResolvedValue(undefined);
    cacheMock.isAllowed.mockReset().mockReturnValue(true);
  });

  it('returns 401 when no session is present', async () => {
    const res = await request(buildApp()).get('/roles');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'unauthorized' });
  });

  it('returns 401 when session has no role', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1' } };
    const res = await request(buildApp()).get('/roles');
    expect(res.status).toBe(401);
  });

  it('returns 403 when role is not allowed for SECURITY:view', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'EMPLOYEE' } };
    cacheMock.isAllowed.mockReturnValue(false);
    const res = await request(buildApp()).get('/roles');
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ error: 'forbidden', area: 'SECURITY', action: 'view' });
  });

  it('returns 503 when cache loading fails', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'TENANT_OWNER' } };
    cacheMock.ensureLoaded.mockRejectedValue(new Error('db down'));
    const res = await request(buildApp()).get('/roles');
    expect(res.status).toBe(503);
    expect(res.body.error).toBe('rbac_unavailable');
  });

  it('returns 200 with role hierarchy when authorized', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'TENANT_OWNER' } };
    cacheMock.isAllowed.mockReturnValue(true);
    const res = await request(buildApp()).get('/roles');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      roles: expect.objectContaining({
        SUPERUSER: -1,
        TENANT_OWNER: 0,
        IT_ADMIN: 1,
        HR_DIRECTOR: 2,
        HR_MANAGER: 3,
        DEPT_HEAD: 4,
        LINE_MANAGER: 5,
        EMPLOYEE: 6,
      }),
      legacyAliases: expect.objectContaining({
        ADMIN: { mapsTo: 'TENANT_OWNER', level: 0 },
        HR: { mapsTo: 'HR_MANAGER', level: 3 },
        USER: { mapsTo: 'EMPLOYEE', level: 6 },
      }),
      description: expect.stringContaining('Role hierarchy'),
    });
  });

  it('separates primary roles from legacy aliases (no overlap)', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'TENANT_OWNER' } };
    const res = await request(buildApp()).get('/roles');
    expect(res.status).toBe(200);
    const primaryKeys = Object.keys(res.body.data.roles);
    const legacyKeys = Object.keys(res.body.data.legacyAliases);
    const overlap = primaryKeys.filter((k) => legacyKeys.includes(k));
    expect(overlap).toEqual([]);
    expect(legacyKeys).toEqual(
      expect.arrayContaining(['ADMIN', 'TENANT_ADMIN', 'SYSADMIN', 'HR', 'DEMO', 'USER'])
    );
  });

  it('legacy aliases preserve correct level mapping', async () => {
    mockSession = { expires: FAR_FUTURE, user: { id: 'u1', role: 'TENANT_OWNER' } };
    const res = await request(buildApp()).get('/roles');
    expect(res.body.data.legacyAliases.SYSADMIN.level).toBe(0);
    expect(res.body.data.legacyAliases.SYSADMIN.mapsTo).toBe('TENANT_OWNER');
    expect(res.body.data.legacyAliases.DEMO.level).toBe(6);
    expect(res.body.data.legacyAliases.DEMO.mapsTo).toBe('EMPLOYEE');
  });
});
