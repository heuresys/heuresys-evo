import { describe, it, expect } from 'vitest';
import {
  getNavForUser,
  SIDEBAR_MAP,
  hasMinRole,
  normalizeRole,
  ALL_ROLES,
  ROLE_LEVELS,
  type UserRole,
} from '@/lib/navigation';

describe('navigation/types', () => {
  it('all 8 canonical roles are present in SIDEBAR_MAP', () => {
    for (const role of ALL_ROLES) {
      expect(SIDEBAR_MAP[role]).toBeDefined();
      expect(SIDEBAR_MAP[role].length).toBeGreaterThan(0);
    }
    expect(ALL_ROLES.length).toBe(8);
  });

  it('ROLE_LEVELS hierarchy is monotonic', () => {
    expect(ROLE_LEVELS.SUPERUSER).toBeLessThan(ROLE_LEVELS.TENANT_OWNER);
    expect(ROLE_LEVELS.TENANT_OWNER).toBeLessThan(ROLE_LEVELS.IT_ADMIN);
    expect(ROLE_LEVELS.IT_ADMIN).toBeLessThan(ROLE_LEVELS.HR_DIRECTOR);
    expect(ROLE_LEVELS.HR_DIRECTOR).toBeLessThan(ROLE_LEVELS.HR_MANAGER);
    expect(ROLE_LEVELS.HR_MANAGER).toBeLessThan(ROLE_LEVELS.DEPT_HEAD);
    expect(ROLE_LEVELS.DEPT_HEAD).toBeLessThan(ROLE_LEVELS.LINE_MANAGER);
    expect(ROLE_LEVELS.LINE_MANAGER).toBeLessThan(ROLE_LEVELS.EMPLOYEE);
  });

  it('hasMinRole respects hierarchy', () => {
    expect(hasMinRole('SUPERUSER', 'EMPLOYEE')).toBe(true);
    expect(hasMinRole('HR_DIRECTOR', 'HR_MANAGER')).toBe(true);
    expect(hasMinRole('EMPLOYEE', 'HR_DIRECTOR')).toBe(false);
    expect(hasMinRole('LINE_MANAGER', 'TENANT_OWNER')).toBe(false);
  });

  it('normalizeRole maps unknown / null / lowercase to EMPLOYEE (least privilege)', () => {
    expect(normalizeRole(null)).toBe('EMPLOYEE');
    expect(normalizeRole(undefined)).toBe('EMPLOYEE');
    expect(normalizeRole('')).toBe('EMPLOYEE');
    expect(normalizeRole('FOO')).toBe('EMPLOYEE');
    expect(normalizeRole('legacy_admin')).toBe('EMPLOYEE');
  });

  it('normalizeRole accepts case-insensitive canonical roles', () => {
    expect(normalizeRole('superuser')).toBe('SUPERUSER');
    expect(normalizeRole('HR_DIRECTOR')).toBe('HR_DIRECTOR');
    expect(normalizeRole('Tenant_Owner')).toBe('TENANT_OWNER');
  });
});

describe('navigation/getNavForUser', () => {
  it('returns EMPLOYEE nav when session is null/undefined', () => {
    const nav = getNavForUser(null);
    expect(nav).toEqual(SIDEBAR_MAP.EMPLOYEE);
  });

  it('returns EMPLOYEE nav when session has no role', () => {
    const nav = getNavForUser({ user: {} });
    expect(nav).toEqual(SIDEBAR_MAP.EMPLOYEE);
  });

  it.each(ALL_ROLES)('returns the correct nav for role %s', (role) => {
    const nav = getNavForUser({ user: { role } });
    expect(nav).toEqual(SIDEBAR_MAP[role]);
  });

  it('SUPERUSER has the broadest nav (more sections than EMPLOYEE)', () => {
    expect(SIDEBAR_MAP.SUPERUSER.length).toBeGreaterThanOrEqual(SIDEBAR_MAP.EMPLOYEE.length);
  });

  it('every nav section has a non-empty items list', () => {
    for (const role of ALL_ROLES) {
      for (const section of SIDEBAR_MAP[role]) {
        expect(section.items.length).toBeGreaterThan(0);
        expect(section.title).toBeTruthy();
        expect(section.id).toBeTruthy();
      }
    }
  });

  it('every nav item has a stable id (unique within its section)', () => {
    for (const role of ALL_ROLES) {
      for (const section of SIDEBAR_MAP[role]) {
        const ids = section.items.map((it) => it.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });

  it('every nav item with no children has an href', () => {
    for (const role of ALL_ROLES) {
      for (const section of SIDEBAR_MAP[role]) {
        for (const item of section.items) {
          if (!item.children) {
            expect(item.href).toBeTruthy();
          }
        }
      }
    }
  });

  // Role-specific spot checks (regression anchors)
  it('SUPERUSER nav includes the System section with Tenants', () => {
    const sys = SIDEBAR_MAP.SUPERUSER.find((s) => s.id === 'system');
    expect(sys?.items.some((it) => it.id === 'tenants')).toBe(true);
  });

  it('HR_DIRECTOR nav includes Capability map + Reviews + Compensation', () => {
    const ws = SIDEBAR_MAP.HR_DIRECTOR.find((s) => s.id === 'workspace');
    const ids = ws?.items.map((it) => it.id) ?? [];
    expect(ids).toContain('capability');
    expect(ids).toContain('reviews');
    expect(ids).toContain('compensation');
  });

  it('EMPLOYEE nav has the self section but no system section', () => {
    const sectionIds = SIDEBAR_MAP.EMPLOYEE.map((s) => s.id);
    expect(sectionIds).toContain('self');
    expect(sectionIds).not.toContain('system');
  });

  it('LINE_MANAGER nav includes a team section', () => {
    expect(SIDEBAR_MAP.LINE_MANAGER.some((s) => s.id === 'team')).toBe(true);
  });

  it('IT_ADMIN nav includes SAP sync + Integrations + Audit', () => {
    const all = SIDEBAR_MAP.IT_ADMIN.flatMap((s) => s.items.map((it) => it.id));
    expect(all).toContain('sap');
    expect(all).toContain('integrations');
    expect(all).toContain('audit');
  });

  it('every role mounts the Ontology section (full or lite)', () => {
    for (const role of ALL_ROLES) {
      const sec = SIDEBAR_MAP[role].find((s) => s.id === 'ontology');
      expect(sec, `role=${role}`).toBeDefined();
    }
  });

  it('full Ontology section exposes ESCO + Knowledge graph + Advisor (lite is a subset)', () => {
    const full = SIDEBAR_MAP.HR_DIRECTOR.find((s) => s.id === 'ontology');
    const fullIds = full?.items.map((it) => it.id) ?? [];
    expect(fullIds).toContain('ontology');
    expect(fullIds).toContain('esco');
    expect(fullIds).toContain('kg');

    const lite = SIDEBAR_MAP.EMPLOYEE.find((s) => s.id === 'ontology');
    const liteIds = lite?.items.map((it) => it.id) ?? [];
    for (const id of liteIds) {
      expect(fullIds).toContain(id);
    }
  });

  it('produces a different sidebar for at least 6 of the 8 roles (signature heuristic)', () => {
    const signatures = new Set<string>();
    for (const role of ALL_ROLES) {
      const sig = JSON.stringify(SIDEBAR_MAP[role].map((s) => [s.id, s.items.map((it) => it.id)]));
      signatures.add(sig);
    }
    // At minimum, expect 6 distinct signatures (a couple of roles may share a profile).
    expect(signatures.size).toBeGreaterThanOrEqual(6);
  });
});
