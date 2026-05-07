import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { hasMinRole } from '@heuresys/shared/rbp';

/**
 * /team — Direct reports for DEPT_HEAD and LINE_MANAGER.
 * Resolves `users.employee_id` → manager id → employees WHERE manager_id = self.
 */
async function fetchDirectReports(tenantId: string, userId: string) {
  return withTenant(tenantId, async (tx) => {
    const u = await tx.users.findUnique({
      where: { id: userId },
      select: { employee_id: true },
    });
    if (!u?.employee_id) return null;
    const reports = await tx.employees.findMany({
      where: { manager_id: u.employee_id, is_active: true, deleted_at: null },
      orderBy: [{ last_name: 'asc' }],
      take: 100,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        job_title: true,
        department: true,
        performance_rating: true,
        potential: true,
      },
    });
    return { managerId: u.employee_id, reports };
  });
}

const POTENTIAL_TONE: Record<string, string> = {
  high: 'rgba(95,184,122,0.25)',
  medium: 'rgba(94,105,209,0.25)',
  low: 'rgba(138,142,155,0.20)',
};

export default async function TeamPage() {
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; role?: string; tenantId?: string }
    | undefined;

  if (!hasMinRole(user, 'LINE_MANAGER')) {
    redirect('/dashboard');
  }
  if (!user?.id || !user?.tenantId) {
    return (
      <main className="mx-auto max-w-5xl p-8">
        <h1 className="text-3xl font-semibold">My team</h1>
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Session lacks user/tenant context.
        </p>
      </main>
    );
  }

  let data: Awaited<ReturnType<typeof fetchDirectReports>> = null;
  let fetchError: string | null = null;
  try {
    data = await fetchDirectReports(user.tenantId, user.id);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">My team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Direct reports of <strong>{user.username}</strong>
        </p>
      </header>

      <section className="mt-6">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load team: <code>{fetchError}</code>
          </p>
        ) : !data ? (
          <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            No employee record linked to this user (cannot resolve direct reports).
          </p>
        ) : data.reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active direct reports for this manager.
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              {data.reports.length} direct reports
            </p>
            <ul className="divide-y divide-border rounded-md border border-border">
              {data.reports.map((emp) => (
                <li
                  key={emp.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 p-3 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {emp.first_name} {emp.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {emp.job_title ?? '—'}
                      {emp.department ? <> · {emp.department}</> : null}
                    </div>
                  </div>
                  {emp.potential ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background:
                          POTENTIAL_TONE[emp.potential.toLowerCase()] ?? 'rgba(138,142,155,0.18)',
                      }}
                    >
                      potential: {emp.potential}
                    </span>
                  ) : (
                    <span />
                  )}
                  {emp.performance_rating != null ? (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-foreground">
                      {Number(emp.performance_rating).toFixed(1)}
                    </span>
                  ) : (
                    <span />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
