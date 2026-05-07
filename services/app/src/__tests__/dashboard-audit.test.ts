/**
 * Phase 14 Sprint 2 · E — Tests for auditedDashboardMutation().
 *
 * Mocks @/lib/db `withTenant` + the transactional `audit_logs.create` so we
 * can exercise the helper contract without touching Postgres. The real DB
 * integration is verified once a route handler consumes the helper
 * (Sprint 3 · C).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

interface MockTx {
  audit_logs: { create: ReturnType<typeof vi.fn> };
}

const { mockAuditCreate, mockTx, mockWithTenant } = vi.hoisted(() => {
  const create = vi.fn();
  const tx: MockTx = { audit_logs: { create } };
  const withTenant = vi.fn(async (_tenantId: string, fn: (tx: MockTx) => unknown) => fn(tx));
  return { mockAuditCreate: create, mockTx: tx, mockWithTenant: withTenant };
});

vi.mock('@/lib/db', () => ({
  prisma: { $transaction: vi.fn() },
  withTenant: mockWithTenant,
}));

import { auditedDashboardMutation } from '@/lib/audit/dashboard-audit';

const ACTOR = { userId: 'user-1', userRole: 'TENANT_OWNER', tenantId: 'tenant-A' };

beforeEach(() => {
  mockAuditCreate.mockReset();
  mockAuditCreate.mockResolvedValue({ id: 'audit-row-1' });
  mockWithTenant.mockClear();
});

describe('auditedDashboardMutation — happy path', () => {
  it('runs mutation + creates audit row in same transaction (UPDATE)', async () => {
    const mutate = vi.fn().mockResolvedValue({ updated: true });
    const out = await auditedDashboardMutation({
      actor: ACTOR,
      action: 'UPDATE',
      resourceType: 'dashboard_presets',
      resourceId: 42n,
      resourceName: 'hr_director_overview',
      description: 'Renamed preset',
      oldValue: { name_en: 'Old' },
      newValue: { name_en: 'New' },
      mutate,
    });
    expect(out).toEqual({ result: { updated: true }, auditId: 'audit-row-1' });
    expect(mutate).toHaveBeenCalledWith(mockTx);
    expect(mockWithTenant).toHaveBeenCalledWith('tenant-A', expect.any(Function));
    expect(mockAuditCreate).toHaveBeenCalledTimes(1);
    const auditArgs = mockAuditCreate.mock.calls[0]![0];
    expect(auditArgs.data).toMatchObject({
      tenant_id: 'tenant-A',
      user_id: 'user-1',
      user_role: 'TENANT_OWNER',
      action: 'UPDATE',
      category: 'CONFIG',
      resource_type: 'dashboard_presets',
      resource_id: '42',
      resource_name: 'hr_director_overview',
      description: 'Renamed preset',
      old_value: { name_en: 'Old' },
      new_value: { name_en: 'New' },
      success: true,
    });
  });

  it('CREATE: omits old_value (null) but includes new_value', async () => {
    await auditedDashboardMutation({
      actor: ACTOR,
      action: 'CREATE',
      resourceType: 'dashboard_elements',
      resourceId: 77,
      resourceName: 'KpiRing',
      description: 'Added KpiRing widget',
      oldValue: null,
      newValue: { widget_code: 'KpiRing', position: 1 },
      mutate: vi.fn().mockResolvedValue(undefined),
    });
    const data = mockAuditCreate.mock.calls[0]![0].data;
    expect(data.action).toBe('CREATE');
    expect(data.old_value).toBeUndefined();
    expect(data.new_value).toEqual({ widget_code: 'KpiRing', position: 1 });
  });

  it('DELETE: omits new_value (null) but includes old_value', async () => {
    await auditedDashboardMutation({
      actor: ACTOR,
      action: 'DELETE',
      resourceType: 'dashboard_elements',
      resourceId: 77,
      resourceName: 'KpiRing',
      description: 'Removed widget',
      oldValue: { widget_code: 'KpiRing', position: 1 },
      newValue: null,
      mutate: vi.fn().mockResolvedValue(undefined),
    });
    const data = mockAuditCreate.mock.calls[0]![0].data;
    expect(data.action).toBe('DELETE');
    expect(data.old_value).toEqual({ widget_code: 'KpiRing', position: 1 });
    expect(data.new_value).toBeUndefined();
  });

  it('PUBLISH action: keeps both old/new value snapshots of is_published flip', async () => {
    await auditedDashboardMutation({
      actor: ACTOR,
      action: 'PUBLISH',
      resourceType: 'dashboard_presets',
      resourceId: 5,
      resourceName: 'process_recruiting_funnel',
      description: 'Published preset',
      oldValue: { is_published: false },
      newValue: { is_published: true },
      mutate: vi.fn().mockResolvedValue(undefined),
    });
    const data = mockAuditCreate.mock.calls[0]![0].data;
    expect(data.action).toBe('PUBLISH');
    expect(data.old_value.is_published).toBe(false);
    expect(data.new_value.is_published).toBe(true);
  });

  it('passes optional metadata through', async () => {
    await auditedDashboardMutation({
      actor: ACTOR,
      action: 'UPDATE',
      resourceType: 'dashboard_elements',
      resourceId: 1,
      resourceName: 'KpiRing',
      description: '...',
      oldValue: {},
      newValue: {},
      metadata: { source: 'editor', requestId: 'req-9' },
      mutate: vi.fn().mockResolvedValue(undefined),
    });
    const data = mockAuditCreate.mock.calls[0]![0].data;
    expect(data.metadata).toEqual({ source: 'editor', requestId: 'req-9' });
  });

  it('defaults metadata to empty object when omitted', async () => {
    await auditedDashboardMutation({
      actor: ACTOR,
      action: 'UPDATE',
      resourceType: 'dashboard_presets',
      resourceId: 1,
      resourceName: 'x',
      description: '...',
      oldValue: {},
      newValue: {},
      mutate: vi.fn().mockResolvedValue(undefined),
    });
    const data = mockAuditCreate.mock.calls[0]![0].data;
    expect(data.metadata).toEqual({});
  });
});

describe('auditedDashboardMutation — guard contract', () => {
  it('throws when actor.tenantId missing', async () => {
    await expect(
      auditedDashboardMutation({
        actor: { userId: 'u', userRole: null, tenantId: '' },
        action: 'UPDATE',
        resourceType: 'dashboard_presets',
        resourceId: 1,
        resourceName: 'x',
        description: '',
        oldValue: {},
        newValue: {},
        mutate: vi.fn(),
      })
    ).rejects.toThrow(/tenantId is required/);
  });

  it('throws when actor.userId missing', async () => {
    await expect(
      auditedDashboardMutation({
        actor: { userId: '', userRole: null, tenantId: 't' },
        action: 'UPDATE',
        resourceType: 'dashboard_presets',
        resourceId: 1,
        resourceName: 'x',
        description: '',
        oldValue: {},
        newValue: {},
        mutate: vi.fn(),
      })
    ).rejects.toThrow(/userId is required/);
  });

  it('rejects CREATE with non-null oldValue', async () => {
    await expect(
      auditedDashboardMutation({
        actor: ACTOR,
        action: 'CREATE',
        resourceType: 'dashboard_presets',
        resourceId: 1,
        resourceName: 'x',
        description: '',
        oldValue: { something: 1 },
        newValue: {},
        mutate: vi.fn(),
      })
    ).rejects.toThrow(/CREATE requires oldValue=null/);
  });

  it('rejects DELETE with non-null newValue', async () => {
    await expect(
      auditedDashboardMutation({
        actor: ACTOR,
        action: 'DELETE',
        resourceType: 'dashboard_elements',
        resourceId: 1,
        resourceName: 'x',
        description: '',
        oldValue: {},
        newValue: { something: 1 },
        mutate: vi.fn(),
      })
    ).rejects.toThrow(/DELETE requires newValue=null/);
  });
});

describe('auditedDashboardMutation — atomicity', () => {
  it('mutation error aborts before audit insert', async () => {
    const mutate = vi.fn().mockRejectedValue(new Error('mutate failed'));
    await expect(
      auditedDashboardMutation({
        actor: ACTOR,
        action: 'UPDATE',
        resourceType: 'dashboard_presets',
        resourceId: 1,
        resourceName: 'x',
        description: '',
        oldValue: {},
        newValue: {},
        mutate,
      })
    ).rejects.toThrow(/mutate failed/);
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  it('audit insert error propagates (transaction would rollback)', async () => {
    mockAuditCreate.mockRejectedValueOnce(new Error('audit insert failed'));
    const mutate = vi.fn().mockResolvedValue('ok');
    await expect(
      auditedDashboardMutation({
        actor: ACTOR,
        action: 'UPDATE',
        resourceType: 'dashboard_presets',
        resourceId: 1,
        resourceName: 'x',
        description: '',
        oldValue: {},
        newValue: {},
        mutate,
      })
    ).rejects.toThrow(/audit insert failed/);
    expect(mutate).toHaveBeenCalled();
  });
});
