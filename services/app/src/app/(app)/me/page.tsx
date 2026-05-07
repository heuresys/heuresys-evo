import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { isAuthenticated } from '@heuresys/shared/rbp';

/**
 * /me — Self-service profile (any authenticated user).
 * Resolves `users.employee_id` → `employees` row, scoped to user's tenant.
 */
async function fetchMyEmployee(tenantId: string, userId: string) {
  return withTenant(tenantId, async (tx) => {
    const u = await tx.users.findUnique({
      where: { id: userId },
      select: { employee_id: true },
    });
    if (!u?.employee_id) return null;
    return tx.employees.findUnique({
      where: { id: u.employee_id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        job_title: true,
        department: true,
        location: true,
        manager_id: true,
        hire_date: true,
        performance_rating: true,
        potential: true,
        skills: true,
      },
    });
  });
}

export default async function MePage() {
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; role?: string; tenantId?: string }
    | undefined;

  if (!isAuthenticated(user)) {
    redirect('/login');
  }
  if (!user?.id || !user?.tenantId) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-semibold">My profile</h1>
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Session lacks user/tenant context.
        </p>
      </main>
    );
  }

  let emp: Awaited<ReturnType<typeof fetchMyEmployee>> = null;
  let fetchError: string | null = null;
  try {
    emp = await fetchMyEmployee(user.tenantId, user.id);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">My profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <strong>{user.username}</strong> · {user.role}
        </p>
      </header>

      <section className="mt-8">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load profile: <code>{fetchError}</code>
          </p>
        ) : !emp ? (
          <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            No employee record linked to this user account.{' '}
            <span className="text-xs">
              (Users created outside the canonical batch may be missing the link.)
            </span>
          </p>
        ) : (
          <dl className="grid grid-cols-1 gap-4 rounded-md border border-border bg-card p-6 sm:grid-cols-2">
            <Field label="Full name" value={`${emp.first_name} ${emp.last_name}`} />
            <Field label="Email" value={emp.email} />
            <Field label="Job title" value={emp.job_title ?? '—'} />
            <Field label="Department" value={emp.department ?? '—'} />
            <Field label="Location" value={emp.location ?? '—'} />
            <Field
              label="Hire date"
              value={emp.hire_date ? new Date(emp.hire_date).toISOString().slice(0, 10) : '—'}
            />
            <Field
              label="Performance"
              value={
                emp.performance_rating != null ? Number(emp.performance_rating).toFixed(1) : '—'
              }
            />
            <Field label="Potential" value={emp.potential ?? '—'} />
            {emp.skills && emp.skills.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                  Skills
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {emp.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        )}
      </section>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}
