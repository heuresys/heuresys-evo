import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { hasMinRole } from '@heuresys/shared/rbp';

async function fetchCompensation(tenantId: string) {
  return withTenant(tenantId, async (tx) => {
    const [plans, salaryAgg] = await Promise.all([
      tx.bonus_plans.findMany({
        where: {},
        orderBy: { period_start: 'desc' },
        take: 20,
        select: {
          id: true,
          name: true,
          bonus_type: true,
          period_start: true,
          period_end: true,
          total_budget: true,
          status: true,
        },
      }),
      tx.employees.aggregate({
        where: { is_active: true, deleted_at: null, salary: { not: null } },
        _avg: { salary: true },
        _min: { salary: true },
        _max: { salary: true },
        _count: { id: true },
      }),
    ]);
    return { plans, salaryAgg };
  });
}

export default async function CompensationPage() {
  const session = await auth();
  const user = session?.user as { role?: string; tenantId?: string } | undefined;
  if (!hasMinRole(user, 'HR_DIRECTOR')) redirect('/dashboard');
  if (!user?.tenantId)
    return (
      <main className="p-8">
        <h1>Compensation</h1>
        <p>No tenant context.</p>
      </main>
    );

  let data: Awaited<ReturnType<typeof fetchCompensation>> = {
    plans: [],
    salaryAgg: {
      _avg: { salary: null },
      _min: { salary: null },
      _max: { salary: null },
      _count: { id: 0 },
    },
  };
  let err: string | null = null;
  try {
    data = await fetchCompensation(user.tenantId);
  } catch (e) {
    err = e instanceof Error ? e.message : String(e);
  }

  const eur = (n: unknown) =>
    n != null ? `€${Number(n).toLocaleString('it-IT', { maximumFractionDigits: 0 })}` : '—';

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">Compensation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Salary stats + bonus plans · tenant {user.tenantId.slice(0, 8)}…
        </p>
      </header>
      <section className="mt-6">
        {err ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load: <code>{err}</code>
          </p>
        ) : (
          <>
            <h2 className="text-lg font-medium">Salary distribution</h2>
            <dl className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-md border border-border bg-card p-4">
              <Stat label="Employees" value={String(data.salaryAgg._count.id)} />
              <Stat label="Avg salary" value={eur(data.salaryAgg._avg.salary)} />
              <Stat label="Min" value={eur(data.salaryAgg._min.salary)} />
              <Stat label="Max" value={eur(data.salaryAgg._max.salary)} />
            </dl>

            <h2 className="mt-8 text-lg font-medium">Bonus plans</h2>
            {data.plans.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No bonus plans.</p>
            ) : (
              <ul className="mt-2 divide-y divide-border rounded-md border border-border">
                {data.plans.map((p) => (
                  <li
                    key={p.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.bonus_type} · {p.period_start?.toISOString().slice(0, 10) ?? '—'} →{' '}
                        {p.period_end?.toISOString().slice(0, 10) ?? '—'}
                      </div>
                    </div>
                    <span className="font-mono text-sm">{eur(p.total_budget)}</span>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-foreground">
                      {p.status ?? '—'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
    </div>
  );
}
