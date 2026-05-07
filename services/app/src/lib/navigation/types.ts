/**
 * Heuresys evo — sidebar navigation types & role hierarchy.
 *
 * Adapted from legacy `services/frontend/src/lib/navigation.ts`, scoped to
 * the 8 canonical evo roles defined in the DB (`users.role`).
 *
 * Data-driven nav via `rbp_*` tables is the long-term SoT (FASE 3+ in
 * Phase 14.SH); this module provides the static SIDEBAR_MAP fallback that
 * always works without DB round-trips.
 */

/**
 * The 8 canonical evo roles, with hierarchy levels (lower = more powerful).
 * Source: μ-architect mockup RBAC schema + `rbp_role_area_permissions`.
 */
export type UserRole =
  | 'SUPERUSER'
  | 'TENANT_OWNER'
  | 'IT_ADMIN'
  | 'HR_DIRECTOR'
  | 'HR_MANAGER'
  | 'DEPT_HEAD'
  | 'LINE_MANAGER'
  | 'EMPLOYEE';

export const ROLE_LEVELS: Record<UserRole, number> = {
  SUPERUSER: -1,
  TENANT_OWNER: 0,
  IT_ADMIN: 1,
  HR_DIRECTOR: 2,
  HR_MANAGER: 3,
  DEPT_HEAD: 4,
  LINE_MANAGER: 5,
  EMPLOYEE: 6,
};

export const ALL_ROLES: readonly UserRole[] = [
  'SUPERUSER',
  'TENANT_OWNER',
  'IT_ADMIN',
  'HR_DIRECTOR',
  'HR_MANAGER',
  'DEPT_HEAD',
  'LINE_MANAGER',
  'EMPLOYEE',
] as const;

/** A user role meets a minimum required role iff its level <= minRole's level. */
export function hasMinRole(userRole: UserRole, minRole: UserRole): boolean {
  return ROLE_LEVELS[userRole] <= ROLE_LEVELS[minRole];
}

/**
 * Normalize unknown role strings to the canonical 8.
 * Falls back to EMPLOYEE for any unknown value (least privilege).
 */
export function normalizeRole(input: string | null | undefined): UserRole {
  if (!input) return 'EMPLOYEE';
  const candidate = input.toUpperCase() as UserRole;
  return candidate in ROLE_LEVELS ? candidate : 'EMPLOYEE';
}

export interface NavItem {
  /** Stable identifier (used as React key, also used by tests). */
  id: string;
  /** Display label (i18n applied at render time). */
  label: string;
  /** Route path. Optional for grouping items (when children are present). */
  href?: string;
  /** Icon name from a fixed registry (rendered in placeholder-nav). */
  icon?: NavIconName;
  /** Sub-items (1 level of nesting supported by AppShell). */
  children?: Omit<NavItem, 'children' | 'icon'>[];
  /** Optional badge text (notifications, counts). */
  badge?: string;
  /** If true, the item is hidden from the rendered menu but the route is still accessible. */
  hidden?: boolean;
}

export interface NavSection {
  /** Section header label (μ-architect mono uppercase). */
  title: string;
  /** Stable identifier per section. */
  id: string;
  /** Navigation items. */
  items: NavItem[];
}

/**
 * Names of icons supported by the static SIDEBAR_MAP. Renderer maps these to
 * SVG paths (services/app/src/app/(app)/_components/nav-icons.tsx).
 * We avoid importing lucide-react directly here so the map is plain JSON-able.
 */
export type NavIconName =
  | 'dashboard'
  | 'employees'
  | 'capability'
  | 'reviews'
  | 'goals'
  | 'learning'
  | 'analytics'
  | 'compensation'
  | 'org-chart'
  | 'tenant'
  | 'system'
  | 'users-admin'
  | 'audit'
  | 'rbac'
  | 'integrations'
  | 'ontology'
  | 'esco'
  | 'sap'
  | 'kg'
  | 'profile'
  | 'team'
  | 'settings'
  | 'showcase';
