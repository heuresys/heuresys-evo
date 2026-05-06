import type { Action } from '../services/rbp-cache.js';

export const ROLES = {
  SUPERUSER: -1,
  TENANT_OWNER: 0,
  IT_ADMIN: 1,
  HR_DIRECTOR: 2,
  HR_MANAGER: 3,
  DEPT_HEAD: 4,
  LINE_MANAGER: 5,
  EMPLOYEE: 6,
  ADMIN: 0,
  TENANT_ADMIN: 0,
  SYSADMIN: 0,
  HR: 3,
  DEMO: 6,
  USER: 6,
} as const;

export type Role = keyof typeof ROLES;

export const LEGACY_ALIAS_MAP: Record<string, string> = {
  ADMIN: 'TENANT_OWNER',
  TENANT_ADMIN: 'TENANT_OWNER',
  SYSADMIN: 'TENANT_OWNER',
  HR: 'HR_MANAGER',
  DEMO: 'EMPLOYEE',
  USER: 'EMPLOYEE',
};

export interface RoleHierarchyResponse {
  roles: Record<string, number>;
  legacyAliases: Record<string, { mapsTo: string; level: number }>;
  description: string;
}

export const ROLE_DESCRIPTIONS: Record<keyof typeof ROLES, string> = {
  SUPERUSER: 'Platform god-role - Cross-tenant full access',
  TENANT_OWNER: 'Per-tenant full admin - Setup and configuration',
  IT_ADMIN: 'IT Director - Team + IT configuration access',
  HR_DIRECTOR: 'HR Strategic - All employees, full HR access',
  HR_MANAGER: 'HR Operational - All employees, limited strategic',
  DEPT_HEAD: 'OrgUnit Head - OrgUnit scope access',
  LINE_MANAGER: 'Team Manager - Direct reports access',
  EMPLOYEE: 'Standard Employee - Self-only access',
  ADMIN: 'Tenant administrator (legacy) - Maps to TENANT_OWNER',
  TENANT_ADMIN: 'Tenant administrator (legacy) - Maps to TENANT_OWNER',
  SYSADMIN: 'System Administrator (legacy) - Maps to TENANT_OWNER',
  HR: 'Human Resources Manager - Access to HR functions',
  DEMO: 'Demo/read-only access - View-only access for demonstrations',
  USER: 'Standard user - Basic access',
};

export function buildRoleHierarchy(): RoleHierarchyResponse {
  const primaryRoles: Record<string, number> = {};
  const legacyAliases: Record<string, { mapsTo: string; level: number }> = {};

  for (const [role, level] of Object.entries(ROLES)) {
    if (role in LEGACY_ALIAS_MAP) {
      legacyAliases[role] = { mapsTo: LEGACY_ALIAS_MAP[role]!, level };
    } else {
      primaryRoles[role] = level;
    }
  }

  return {
    roles: primaryRoles,
    legacyAliases,
    description:
      'Role hierarchy: lower number = higher privilege. ' +
      'SUPERUSER (-1) is the platform god-role. ' +
      'Legacy aliases map old DB values to the current hierarchy.',
  };
}

export type { Action };
