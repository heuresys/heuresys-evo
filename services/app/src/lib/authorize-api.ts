/**
 * Next.js App Router RBP gate helper (S28 Wave 4 H5 scaffold).
 *
 * Mirrors the Express middleware `requirePermission(area, action)` in
 * services/api-gateway/src/middleware/require-permission.ts but adapted
 * to Next.js route handlers (which return NextResponse instead of calling
 * next()).
 *
 * USAGE in route handlers:
 *
 *   import { requirePermissionApi } from '@/lib/authorize-api';
 *
 *   export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
 *     const guard = await requirePermissionApi('DASHBOARD', 'UPDATE');
 *     if (!guard.ok) return guard.response;
 *     const { user } = guard;
 *     // ... business logic with user.id, user.tenantId, user.role
 *   }
 *
 * **Status**: scaffold helper. Full data-driven adoption sweep across all
 * 7 Next.js API routes pending S29+ (registry H5). Currently uses a hardcoded
 * area→roles map fallback; full integration with `rbp_role_area_permissions`
 * DB table requires either:
 *   (a) inline Prisma query at every gate (OK but adds latency), or
 *   (b) shared in-process RBP cache mirror of api-gateway/services/rbp-cache.ts
 *       (preferred; requires extracting cache to packages/shared)
 *
 * Day-1 fallback (this file): reads ALLOWED_ROLES_FOR_AREA hardcoded map.
 * Day-2 ratchet: replace ALLOWED_ROLES_FOR_AREA with Prisma query against
 * rbp_role_area_permissions joining canonical 179 RBP role-area-permission
 * rows (post-L54 canonical sweep).
 */
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'EXPORT';

export interface AuthorizedSession {
  ok: true;
  user: {
    id: string;
    role: string;
    tenantId: string;
    email?: string | null;
  };
}

export interface AuthorizationFailure {
  ok: false;
  response: NextResponse;
}

export type GuardResult = AuthorizedSession | AuthorizationFailure;

/**
 * Day-1 hardcoded fallback. Replace with DB-driven RBP cache lookup
 * in S29+ sweep. Maps area code → set of role codes that may perform
 * any of the 5 standard actions (CRUD + EXPORT).
 *
 * Currently lifted from inline `EDITOR_ROLES` patterns scattered across
 * routes. Single source of truth here pending DB-driven refactor.
 */
const ALLOWED_ROLES_FOR_AREA: Record<string, Set<string>> = {
  DASHBOARD: new Set(['SUPERUSER', 'TENANT_OWNER', 'HR_DIRECTOR']),
  EMPLOYEES: new Set(['SUPERUSER', 'TENANT_OWNER', 'IT_ADMIN', 'HR_DIRECTOR', 'HR_MANAGER']),
  ROLE: new Set(['SUPERUSER', 'TENANT_OWNER', 'IT_ADMIN']),
  TENANT: new Set(['SUPERUSER', 'TENANT_OWNER']),
  AUDIT_LOG: new Set(['SUPERUSER', 'TENANT_OWNER', 'IT_ADMIN']),
  ONTOLOGY: new Set(['SUPERUSER', 'TENANT_OWNER', 'HR_DIRECTOR', 'HR_MANAGER']),
  EXPLORER: new Set([
    'SUPERUSER',
    'TENANT_OWNER',
    'IT_ADMIN',
    'HR_DIRECTOR',
    'HR_MANAGER',
    'DEPT_HEAD',
    'LINE_MANAGER',
    'EMPLOYEE',
  ]),
};

/**
 * Authenticate + authorize a Next.js route handler request.
 *
 * @param area  area code (e.g. 'DASHBOARD', 'EMPLOYEES'). Must exist in
 *              ALLOWED_ROLES_FOR_AREA map.
 * @param _action  action code (CREATE/READ/UPDATE/DELETE/EXPORT). Currently
 *                 unused (day-1 gate is per-area, not per-area-action). Day-2
 *                 ratchet will use both.
 *
 * @returns      `{ ok: true, user }` on success or `{ ok: false, response }`
 *               with an HTTP-ready NextResponse (401 unauthenticated,
 *               403 forbidden, 401 missing_session_context).
 */
export async function requirePermissionApi(
  area: keyof typeof ALLOWED_ROLES_FOR_AREA | string,
  _action: Action
): Promise<GuardResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'unauthenticated' }, { status: 401 }),
    };
  }
  const u = session.user as {
    id?: string;
    role?: string;
    tenantId?: string;
    email?: string | null;
  };
  if (!u.id || !u.tenantId) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'missing_session_context' }, { status: 401 }),
    };
  }
  const role = u.role ?? 'EMPLOYEE';
  const allowed = ALLOWED_ROLES_FOR_AREA[area];
  if (!allowed) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'unknown_area', area }, { status: 500 }),
    };
  }
  if (!allowed.has(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'forbidden', area, role }, { status: 403 }),
    };
  }
  return {
    ok: true,
    user: {
      id: u.id,
      role,
      tenantId: u.tenantId,
      email: u.email ?? null,
    },
  };
}
