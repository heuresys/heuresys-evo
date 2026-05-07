/**
 * Coarse-grained role-based access gate for server components & Route Handlers.
 *
 * SH-2 scope: a static role-level check (lower number = more powerful), aligned
 * with `services/app/src/lib/navigation/types.ts`. The DB-driven full RBP matrix
 * (`rbp_role_area_permissions`) is the long-term SoT — its server helper will
 * land in SH-3 alongside the FASE 3.6 composite work.
 */

export type Action = 'read' | 'create' | 'update' | 'delete';

export type UserRole =
  | 'SUPERUSER'
  | 'TENANT_OWNER'
  | 'IT_ADMIN'
  | 'HR_DIRECTOR'
  | 'HR_MANAGER'
  | 'DEPT_HEAD'
  | 'LINE_MANAGER'
  | 'EMPLOYEE';

export interface RbpSessionUser {
  id?: string;
  username?: string;
  role?: string;
  tenantId?: string;
}

const ROLE_LEVELS: Record<UserRole, number> = {
  SUPERUSER: -1,
  TENANT_OWNER: 0,
  IT_ADMIN: 1,
  HR_DIRECTOR: 2,
  HR_MANAGER: 3,
  DEPT_HEAD: 4,
  LINE_MANAGER: 5,
  EMPLOYEE: 6,
};

export class RbpDenied extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RbpDenied';
  }
}

function levelOf(role: string | null | undefined): number | null {
  if (!role) return null;
  const upper = role.toUpperCase() as UserRole;
  return upper in ROLE_LEVELS ? ROLE_LEVELS[upper] : null;
}

/** Returns `true` iff the user's role level ≤ `min` level (more or equally powerful). */
export function hasMinRole(user: RbpSessionUser | null | undefined, min: UserRole): boolean {
  const userLvl = levelOf(user?.role);
  const minLvl = ROLE_LEVELS[min];
  return userLvl != null && minLvl != null && userLvl <= minLvl;
}

/**
 * Throws `RbpDenied` if the user does not meet the minimum role.
 * Server components should catch this and redirect/notFound.
 */
export function requireMinRole(user: RbpSessionUser | null | undefined, min: UserRole): void {
  if (!hasMinRole(user, min)) {
    throw new RbpDenied(
      `Access denied: requires role ${min} or higher (got ${user?.role ?? 'none'})`
    );
  }
}

/** Convenience: returns `true` for any authenticated user (any role). */
export function isAuthenticated(user: RbpSessionUser | null | undefined): boolean {
  return levelOf(user?.role) != null;
}

/** Returns true if user is platform-level (SUPERUSER) — bypasses tenant scoping. */
export function isRbpPlatformAdmin(user: RbpSessionUser | null | undefined): boolean {
  return user?.role === 'SUPERUSER';
}
