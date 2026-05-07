/**
 * Server-side navigation builder — entry point for the (app) layout.
 *
 * Usage:
 *   const session = await auth();
 *   const sections = getNavForUser(session);
 *   <AppShellClient nav={sections} ... />
 *
 * The session shape comes from NextAuth v4 (services/app/src/lib/auth.ts);
 * we pluck `role` and pass it through `normalizeRole` so unknown / legacy
 * role strings collapse to EMPLOYEE (least privilege).
 */

import { SIDEBAR_MAP, DEFAULT_NAV } from './role-nav-map';
import { normalizeRole, type UserRole, type NavSection } from './types';

/**
 * Loose session shape: any object with an optional user.role string.
 * We don't type-pin this to NextAuth's `Session` because v4's default user
 * type doesn't carry `role` — it's added via JWT callback at runtime
 * (see services/app/src/lib/auth.ts).
 */
export type SessionLike = unknown;

export function getNavForUser(session: SessionLike): NavSection[] {
  const role: UserRole = normalizeRole(extractRole(session));
  return SIDEBAR_MAP[role] ?? DEFAULT_NAV;
}

function extractRole(session: unknown): string | undefined {
  if (!session || typeof session !== 'object') return undefined;
  const user = (session as { user?: unknown }).user;
  if (!user || typeof user !== 'object') return undefined;
  const role = (user as { role?: unknown }).role;
  return typeof role === 'string' ? role : undefined;
}

export { SIDEBAR_MAP, DEFAULT_NAV };
export * from './types';
