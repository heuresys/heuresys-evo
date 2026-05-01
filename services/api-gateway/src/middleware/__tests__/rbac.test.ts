import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { buildRequirePermission, getScopeCondition } from '../rbac.js';
import type { RBPCacheService } from '../../services/rbp-cache.js';

interface MockCache {
  ensureLoaded: ReturnType<typeof vi.fn>;
  isAllowed: ReturnType<typeof vi.fn>;
}

function makeCache(): MockCache {
  return {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    isAllowed: vi.fn().mockReturnValue(true),
  };
}

let mockSession: {
  user?: { id?: string; role?: string; tenantId?: string | null; employeeId?: string | null };
} | null = null;

function buildApp(cache: MockCache): express.Express {
  const app = express();
  const requirePermission = buildRequirePermission(cache as unknown as RBPCacheService);
  app.use((req, _res, next) => {
    if (mockSession) {
      // Bypass Auth.js Session typing in tests — only the shape rbac.ts reads matters.
      (req as unknown as { session: typeof mockSession }).session = mockSession;
    }
    next();
  });
  app.get('/employees', requirePermission('EMPLOYEES', 'view'), (_req, res) => {
    res.json({ ok: true });
  });
  app.delete('/employees/:id', requirePermission('EMPLOYEES', 'delete'), (_req, res) => {
    res.json({ deleted: true });
  });
  return app;
}

describe('requirePermission middleware', () => {
  let cache: MockCache;

  beforeEach(() => {
    mockSession = null;
    cache = makeCache();
  });

  it('returns 401 when session missing', async () => {
    const res = await request(buildApp(cache)).get('/employees');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('unauthorized');
  });

  it('returns 401 when session present but role missing', async () => {
    mockSession = { user: { id: 'u1' } };
    const res = await request(buildApp(cache)).get('/employees');
    expect(res.status).toBe(401);
  });

  it('returns 503 when cache loading fails', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE' } };
    cache.ensureLoaded.mockRejectedValue(new Error('db down'));
    const res = await request(buildApp(cache)).get('/employees');
    expect(res.status).toBe(503);
    expect(res.body.error).toBe('rbac_unavailable');
  });

  it('returns 403 when cache.isAllowed returns false', async () => {
    mockSession = { user: { id: 'u1', role: 'EMPLOYEE' } };
    cache.isAllowed.mockReturnValue(false);
    const res = await request(buildApp(cache)).delete('/employees/123');
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ error: 'forbidden', area: 'EMPLOYEES', action: 'delete' });
  });

  it('passes through when cache.isAllowed returns true', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR' } };
    cache.isAllowed.mockReturnValue(true);
    const res = await request(buildApp(cache)).get('/employees');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(cache.isAllowed).toHaveBeenCalledWith('HR_DIRECTOR', 'EMPLOYEES', 'view');
  });

  it('calls ensureLoaded before isAllowed (TTL refresh hook)', async () => {
    mockSession = { user: { id: 'u1', role: 'HR_DIRECTOR' } };
    await request(buildApp(cache)).get('/employees');
    const ensureCallOrder = cache.ensureLoaded.mock.invocationCallOrder[0]!;
    const isAllowedCallOrder = cache.isAllowed.mock.invocationCallOrder[0]!;
    expect(ensureCallOrder).toBeLessThan(isAllowedCallOrder);
  });
});

describe('getScopeCondition', () => {
  it('PLATFORM returns empty condition (no filter)', () => {
    expect(getScopeCondition('PLATFORM', { tenantId: 't1' })).toEqual({});
  });

  it('TENANT requires tenantId, otherwise deny-all sentinel', () => {
    expect(getScopeCondition('TENANT', { tenantId: 't1' })).toEqual({ tenant_id: 't1' });
    expect(getScopeCondition('TENANT', {})).toEqual({ id: '__deny_all__' });
  });

  it('DEPARTMENT requires non-empty managedDepartmentIds', () => {
    expect(getScopeCondition('DEPARTMENT', { managedDepartmentIds: ['d1', 'd2'] })).toEqual({
      department_id: { in: ['d1', 'd2'] },
    });
    expect(getScopeCondition('DEPARTMENT', { managedDepartmentIds: [] })).toEqual({
      id: '__deny_all__',
    });
    expect(getScopeCondition('DEPARTMENT', {})).toEqual({ id: '__deny_all__' });
  });

  it('HIERARCHY filters by manager_id = employeeId', () => {
    expect(getScopeCondition('HIERARCHY', { employeeId: 'e1' })).toEqual({ manager_id: 'e1' });
    expect(getScopeCondition('HIERARCHY', {})).toEqual({ id: '__deny_all__' });
  });

  it('TEAM filters by team_lead_id = employeeId', () => {
    expect(getScopeCondition('TEAM', { employeeId: 'e1' })).toEqual({ team_lead_id: 'e1' });
  });

  it('SELF filters by id = employeeId', () => {
    expect(getScopeCondition('SELF', { employeeId: 'e1' })).toEqual({ id: 'e1' });
    expect(getScopeCondition('SELF', {})).toEqual({ id: '__deny_all__' });
  });
});
