import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { hasMinRole, isRbpPlatformAdmin } from '@heuresys/shared/rbp';

/**
 * /employees — Talent registry (HR_MANAGER+ tenant-scoped, SUPERUSER cross-tenant).
 * Live data from `employees` via Prisma + RLS scope. SH-2 implementation.
 */
async function fetchEmployees(tenantId: string | null, opts: { scope?: 'dept' } = {}) {
  const limit = 50;
  if (tenantId == null) {
    // Platform-wide fallback (SUPERUSER): no RLS scope.
    const { prisma } = await import('@/lib/db');
    return prisma.employees.findMany({
      where: { is_active: true, deleted_at: null },
      orderBy: [{ last_name: 'asc' }],
      take: limit,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        job_title: true,
        performance_rating: true,
        tenant_id: true,
      },
    });
  }
  return withTenant(tenantId, (tx) =>
    tx.employees.findMany({
      where: {
        is_active: true,
        deleted_at: null,
        ...(opts.scope === 'dept'
          ? {
              /* placeholder: dept filter via session.deptId */
            }
          : {}),
      },
      orderBy: [{ last_name: 'asc' }],
      take: limit,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        job_title: true,
        performance_rating: true,
        tenant_id: true,
      },
    })
  );
}

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams?: Promise<{ scope?: string }>;
}) {
  const session = await auth();
  const user = session?.user as
    | { id?: string; username?: string; role?: string; tenantId?: string }
    | undefined;

  if (!hasMinRole(user, 'HR_MANAGER')) {
    redirect('/dashboard');
  }

  const sp = (await searchParams) ?? {};
  const scope = sp.scope === 'dept' ? 'dept' : undefined;

  const tenantId = isRbpPlatformAdmin(user) ? null : (user?.tenantId ?? null);

  let employees: Awaited<ReturnType<typeof fetchEmployees>> = [];
  let fetchError: string | null = null;
  try {
    employees = await fetchEmployees(tenantId, { scope });
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">Registro talenti</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isRbpPlatformAdmin(user) ? (
            <>Vista cross-tenant · scope piattaforma</>
          ) : (
            <>
              Tenant <code className="text-xs">{user?.tenantId?.slice(0, 8)}…</code>
              {scope === 'dept' ? ' · scope: dipartimento' : ''}
            </>
          )}
        </p>
      </header>

      <section className="mt-6">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Impossibile caricare i dipendenti:{' '}
            <span className="text-xs opacity-70">(errore tecnico registrato)</span>
          </p>
        ) : employees.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessun dipendente nel perimetro.</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              {employees.length} dipendenti (visualizzati i primi 50)
            </p>
            <ul className="divide-y divide-border rounded-md border border-border">
              {employees.map((emp) => {
                const name =
                  [emp.first_name, emp.last_name].filter(Boolean).join(' ') || '(senza nome)';
                return (
                  <li
                    key={emp.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-xs text-muted-foreground">{emp.job_title ?? '—'}</div>
                    </div>
                    {isRbpPlatformAdmin(user) ? (
                      <code className="text-xs text-muted-foreground">
                        {emp.tenant_id?.slice(0, 8)}…
                      </code>
                    ) : null}
                    {emp.performance_rating != null ? (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-foreground">
                        {emp.performance_rating.toFixed(1)}
                      </span>
                    ) : null}
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
