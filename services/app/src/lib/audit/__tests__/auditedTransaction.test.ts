/**
 * Phase 16 · L54 · S23 — auditedTransaction helper smoke tests.
 *
 * P4 invariant: actor.userId required (no NULL actor).
 * Helper does NOT silently swallow missing actor.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => {
  const tx = {
    audit_logs: {
      create: vi.fn(async () => ({ id: 'audit-id-mock' })),
    },
  };
  return {
    prisma: {},
    withTenant: vi.fn(async (tenantId: string, fn: (tx: unknown) => Promise<unknown>) => fn(tx)),
  };
});

import { auditedTransaction, auditEvent } from '../auditedTransaction';

const baseActor = {
  tenantId: '00000000-0000-0000-0000-000000000001',
  userId: 'user-uuid-1',
  userEmail: 'sysadmin@heuresys.com',
  userRole: 'SUPERUSER',
};

const basePayload = {
  action: 'CREATE' as const,
  category: 'USER' as const,
  resourceType: 'users',
  resourceId: 'res-1',
  description: 'unit test',
};

describe('auditedTransaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when actor.tenantId missing', async () => {
    await expect(
      auditedTransaction({ ...baseActor, tenantId: '' }, basePayload, async () => 'ok')
    ).rejects.toThrow(/tenantId is required/);
  });

  it('throws when actor.userId missing (P4: no NULL actor)', async () => {
    await expect(
      auditedTransaction({ ...baseActor, userId: '' }, basePayload, async () => 'ok')
    ).rejects.toThrow(/userId is required/);
  });

  it('runs the mutation and inserts the audit row, returns auditId', async () => {
    const result = await auditedTransaction(baseActor, basePayload, async () => 42);
    expect(result.result).toBe(42);
    expect(result.auditId).toBe('audit-id-mock');
  });
});

describe('auditEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when actor is invalid (does not throw upstream)', async () => {
    const id = await auditEvent({ ...baseActor, userId: '' }, basePayload);
    expect(id).toBeNull();
  });

  it('returns the auditId on success', async () => {
    const id = await auditEvent(baseActor, basePayload);
    expect(id).toBe('audit-id-mock');
  });
});
