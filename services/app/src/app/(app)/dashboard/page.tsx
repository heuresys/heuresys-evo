import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';

/**
 * /dashboard — server component reading employees directly from Prisma
 * with RLS enforcement via withTenant(). Bypasses api-gateway since the
 * cross-service JWT decode (NextAuth v4 JWE → Auth.js v5) is non-trivial
 * and not needed here — the same Postgres SoT is reachable from both
 * services with the same RLS policies.
 *
 * Phase 14.SH SH-2 — replaces the api-gateway fetch with direct Prisma.
 */
async function fetchTopEmployees(tenantId: string) {
  return withTenant(tenantId, (tx) =>
    tx.employees.findMany({
      where: { is_active: true, deleted_at: null },
      orderBy: [{ performance_rating: 'desc' }, { last_name: 'asc' }],
      take: 10,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        job_title: true,
        performance_rating: true,
      },
    })
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user as { username?: string; role?: string; tenantId?: string } | undefined;

  let employees: Awaited<ReturnType<typeof fetchTopEmployees>> = [];
  let fetchError: string | null = null;
  if (user?.tenantId) {
    try {
      employees = await fetchTopEmployees(user.tenantId);
    } catch (e) {
      fetchError = e instanceof Error ? e.message : String(e);
    }
  } else {
    fetchError = 'No tenant context — cannot scope query.';
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <strong>{user?.username ?? 'unknown'}</strong>
          {user?.role ? <> · {user.role}</> : null}
          {user?.tenantId ? (
            <>
              {' '}
              · tenant <code className="text-xs">{user.tenantId.slice(0, 8)}…</code>
            </>
          ) : null}
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-medium">Top employees by performance</h2>
        {fetchError ? (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load employees: <code>{fetchError}</code>
          </p>
        ) : employees.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No employees in scope (tenant may have empty registry).
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-md border border-border">
            {employees.map((emp) => {
              const name = [emp.first_name, emp.last_name].filter(Boolean).join(' ') || '(unnamed)';
              return (
                <li key={emp.id} className="flex items-center gap-3 p-3 text-sm">
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">{emp.job_title ?? '—'}</span>
                  {emp.performance_rating != null ? (
                    <span className="ml-auto rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-foreground">
                      {emp.performance_rating.toFixed(1)}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
