import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma, withTenant } from '@/lib/db';
import { hasMinRole, isRbpPlatformAdmin } from '@heuresys/shared/rbp';

/**
 * /admin/users — User management (IT_ADMIN+ tenant-scoped, SUPERUSER cross-tenant).
 */
async function fetchUsers(tenantId: string | null) {
  // users → employees join for tenant scope (users.tenant_id does not exist;
  // tenant is derived via the employees FK).
  if (tenantId == null) {
    return prisma.users.findMany({
      where: { is_active: true, deleted_at: null },
      orderBy: [{ role: 'asc' }, { username: 'asc' }],
      take: 100,
      select: {
        id: true,
        username: true,
        role: true,
        employee_id: true,
        last_login: true,
        created_at: true,
      },
    });
  }
  // Tenant-scoped: pluck users whose linked employee belongs to tenantId.
  // Use raw join via Prisma `employees` filter on relation.
  return withTenant(tenantId, async (tx) => {
    const empIds = await tx.employees.findMany({
      where: { tenant_id: tenantId, is_active: true, deleted_at: null },
      select: { id: true },
      take: 500,
    });
    const ids = empIds.map((e) => e.id);
    return tx.users.findMany({
      where: {
        is_active: true,
        deleted_at: null,
        OR: [{ employee_id: { in: ids } }, { employee_id: null }],
      },
      orderBy: [{ role: 'asc' }, { username: 'asc' }],
      take: 100,
      select: {
        id: true,
        username: true,
        role: true,
        employee_id: true,
        last_login: true,
        created_at: true,
      },
    });
  });
}

const ROLE_BADGE: Record<string, { bg: string; fg: string }> = {
  SUPERUSER: { bg: 'rgba(168,85,247,0.15)', fg: '#a855f7' },
  TENANT_OWNER: { bg: 'rgba(94,105,209,0.18)', fg: '#7280e0' },
  IT_ADMIN: { bg: 'rgba(59,130,246,0.15)', fg: '#3b82f6' },
  HR_DIRECTOR: { bg: 'rgba(95,184,122,0.18)', fg: '#5fb87a' },
  HR_MANAGER: { bg: 'rgba(95,184,122,0.10)', fg: '#5fb87a' },
  DEPT_HEAD: { bg: 'rgba(212,160,23,0.15)', fg: '#d4a017' },
  LINE_MANAGER: { bg: 'rgba(212,160,23,0.10)', fg: '#d4a017' },
  EMPLOYEE: { bg: 'rgba(138,142,155,0.15)', fg: '#c8ccd6' },
};

export default async function AdminUsersPage() {
  const session = await auth();
  const user = session?.user as { role?: string; tenantId?: string } | undefined;

  if (!hasMinRole(user, 'IT_ADMIN')) {
    redirect('/dashboard');
  }

  const tenantId = isRbpPlatformAdmin(user) ? null : (user?.tenantId ?? null);
  let users: Awaited<ReturnType<typeof fetchUsers>> = [];
  let fetchError: string | null = null;
  try {
    users = await fetchUsers(tenantId);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isRbpPlatformAdmin(user)
            ? 'Cross-tenant directory · platform scope'
            : `Tenant scope · ${user?.tenantId?.slice(0, 8)}…`}
        </p>
      </header>

      <section className="mt-6">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load users: <code>{fetchError}</code>
          </p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active users.</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">{users.length} active users</p>
            <ul className="divide-y divide-border rounded-md border border-border">
              {users.map((u) => {
                const badge = ROLE_BADGE[u.role ?? 'EMPLOYEE'] ?? {
                  bg: 'rgba(138,142,155,0.15)',
                  fg: '#c8ccd6',
                };
                return (
                  <li
                    key={u.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{u.username}</div>
                      {u.last_login ? (
                        <div className="text-xs text-muted-foreground">
                          Last login: {new Date(u.last_login).toISOString().slice(0, 10)}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">Never logged in</div>
                      )}
                    </div>
                    {isRbpPlatformAdmin(user) ? (
                      <code className="text-xs text-muted-foreground">
                        {u.employee_id ? `${String(u.employee_id).slice(0, 8)}…` : '—'}
                      </code>
                    ) : null}
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ background: badge.bg, color: badge.fg }}
                    >
                      {u.role}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
