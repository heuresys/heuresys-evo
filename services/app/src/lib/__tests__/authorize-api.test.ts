/**
 * Tests for the Next.js RBP gate helper (S28 Wave 4 H5 scaffold).
 *
 * Pure shape tests — no DB, no actual auth() invocation. We verify the
 * exported types and the ALLOWED_ROLES_FOR_AREA invariants. Integration
 * with auth() session is exercised by route-level tests when adoption
 * sweep lands (S29+).
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

import { requirePermissionApi } from '../authorize-api';
import { auth } from '@/lib/auth';

describe('requirePermissionApi', () => {
  it('returns 401 when no session', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const r = await requirePermissionApi('DASHBOARD', 'UPDATE');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.response.status).toBe(401);
    }
  });

  it('returns 401 when session is missing tenantId', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'TENANT_OWNER' },
    });
    const r = await requirePermissionApi('DASHBOARD', 'UPDATE');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.response.status).toBe(401);
    }
  });

  it('returns 403 when role not in allow-list', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'EMPLOYEE', tenantId: 't1' },
    });
    const r = await requirePermissionApi('DASHBOARD', 'UPDATE');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.response.status).toBe(403);
    }
  });

  it('returns ok with user when role is allowed', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: 't1', email: 'a@b.it' },
    });
    const r = await requirePermissionApi('DASHBOARD', 'UPDATE');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.user.id).toBe('u1');
      expect(r.user.role).toBe('TENANT_OWNER');
      expect(r.user.tenantId).toBe('t1');
    }
  });

  it('returns 500 for unknown area code', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'TENANT_OWNER', tenantId: 't1' },
    });
    const r = await requirePermissionApi('NONEXISTENT_AREA', 'UPDATE');
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.response.status).toBe(500);
    }
  });

  it('SUPERUSER is allowed across the canonical area set', async () => {
    (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'u1', role: 'SUPERUSER', tenantId: 't1' },
    });
    for (const area of [
      'DASHBOARD',
      'EMPLOYEES',
      'ROLE',
      'TENANT',
      'AUDIT_LOG',
      'ONTOLOGY',
      'EXPLORER',
    ]) {
      const r = await requirePermissionApi(area, 'READ');
      expect(r.ok).toBe(true);
    }
  });
});
