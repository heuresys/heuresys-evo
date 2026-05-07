import { describe, it, expect } from 'vitest';
import {
  hasMinRole,
  requireMinRole,
  isAuthenticated,
  isRbpPlatformAdmin,
  RbpDenied,
} from '../index.js';

describe('hasMinRole', () => {
  it('SUPERUSER passes any minimum', () => {
    const u = { role: 'SUPERUSER' };
    expect(hasMinRole(u, 'EMPLOYEE')).toBe(true);
    expect(hasMinRole(u, 'TENANT_OWNER')).toBe(true);
    expect(hasMinRole(u, 'SUPERUSER')).toBe(true);
  });

  it('EMPLOYEE only passes EMPLOYEE minimum', () => {
    const u = { role: 'EMPLOYEE' };
    expect(hasMinRole(u, 'EMPLOYEE')).toBe(true);
    expect(hasMinRole(u, 'LINE_MANAGER')).toBe(false);
    expect(hasMinRole(u, 'TENANT_OWNER')).toBe(false);
  });

  it('HR_DIRECTOR passes HR_MANAGER but not TENANT_OWNER', () => {
    const u = { role: 'HR_DIRECTOR' };
    expect(hasMinRole(u, 'HR_MANAGER')).toBe(true);
    expect(hasMinRole(u, 'HR_DIRECTOR')).toBe(true);
    expect(hasMinRole(u, 'TENANT_OWNER')).toBe(false);
  });

  it('null/undefined/empty role fails', () => {
    expect(hasMinRole(null, 'EMPLOYEE')).toBe(false);
    expect(hasMinRole(undefined, 'EMPLOYEE')).toBe(false);
    expect(hasMinRole({}, 'EMPLOYEE')).toBe(false);
    expect(hasMinRole({ role: '' }, 'EMPLOYEE')).toBe(false);
  });

  it('unknown role fails (least privilege)', () => {
    expect(hasMinRole({ role: 'GUEST' }, 'EMPLOYEE')).toBe(false);
    expect(hasMinRole({ role: 'legacy_admin' }, 'EMPLOYEE')).toBe(false);
  });

  it('case-insensitive role matching', () => {
    expect(hasMinRole({ role: 'superuser' }, 'EMPLOYEE')).toBe(true);
    expect(hasMinRole({ role: 'Hr_Director' }, 'HR_MANAGER')).toBe(true);
  });
});

describe('requireMinRole', () => {
  it('throws RbpDenied on failure', () => {
    expect(() => requireMinRole({ role: 'EMPLOYEE' }, 'TENANT_OWNER')).toThrow(RbpDenied);
  });

  it('returns silently on success', () => {
    expect(() => requireMinRole({ role: 'SUPERUSER' }, 'TENANT_OWNER')).not.toThrow();
  });

  it('error message includes the required role', () => {
    try {
      requireMinRole({ role: 'EMPLOYEE' }, 'HR_DIRECTOR');
    } catch (e) {
      expect(e).toBeInstanceOf(RbpDenied);
      expect((e as Error).message).toContain('HR_DIRECTOR');
      expect((e as Error).message).toContain('EMPLOYEE');
    }
  });
});

describe('isAuthenticated', () => {
  it('true for any canonical role', () => {
    expect(isAuthenticated({ role: 'SUPERUSER' })).toBe(true);
    expect(isAuthenticated({ role: 'EMPLOYEE' })).toBe(true);
  });

  it('false for null/empty/unknown role', () => {
    expect(isAuthenticated(null)).toBe(false);
    expect(isAuthenticated({})).toBe(false);
    expect(isAuthenticated({ role: 'XYZ' })).toBe(false);
  });
});

describe('isRbpPlatformAdmin', () => {
  it('true only for SUPERUSER', () => {
    expect(isRbpPlatformAdmin({ role: 'SUPERUSER' })).toBe(true);
    expect(isRbpPlatformAdmin({ role: 'TENANT_OWNER' })).toBe(false);
    expect(isRbpPlatformAdmin({ role: 'EMPLOYEE' })).toBe(false);
    expect(isRbpPlatformAdmin(null)).toBe(false);
  });
});
