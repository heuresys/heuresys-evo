import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { isAuthenticated } from '@heuresys/shared/rbp';

/**
 * /me — Profilo personale (qualsiasi utente autenticato).
 * Resolves `users.employee_id` → `employees` row + JOIN locations per nome città.
 */
async function fetchMyProfile(tenantId: string, userId: string) {
  return withTenant(tenantId, async (tx) => {
    const u = await tx.users.findUnique({
      where: { id: userId },
      select: { employee_id: true },
    });
    if (!u?.employee_id) return null;
    const emp = await tx.employees.findUnique({
      where: { id: u.employee_id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        job_title: true,
        department: true,
        location: true,
        location_id: true,
        manager_id: true,
        hire_date: true,
        performance_rating: true,
        potential: true,
        skills: true,
      },
    });
    if (!emp) return null;
    const locationName = emp.location_id
      ? ((
          await tx.locations.findUnique({
            where: { id: emp.location_id },
            select: { name: true },
          })
        )?.name ?? null)
      : null;
    return { ...emp, locationName };
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
        <h1 className="text-3xl font-semibold">Il mio profilo</h1>
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Sessione senza contesto utente/tenant.
        </p>
      </main>
    );
  }

  let emp: Awaited<ReturnType<typeof fetchMyProfile>> = null;
  let fetchError: string | null = null;
  try {
    emp = await fetchMyProfile(user.tenantId, user.id);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  const formatDate = (d: Date | string): string => {
    try {
      return new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(new Date(d));
    } catch {
      return String(d).slice(0, 10);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">Il mio profilo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accesso come <strong>{user.username}</strong> · {user.role}
        </p>
      </header>

      <section className="mt-8">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Impossibile caricare il profilo: <code>{fetchError}</code>
          </p>
        ) : !emp ? (
          <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Nessun record dipendente collegato a questo account utente.{' '}
            <span className="text-xs">
              (Gli utenti creati al di fuori della batch canonical potrebbero non avere il
              collegamento.)
            </span>
          </p>
        ) : (
          <dl className="grid grid-cols-1 gap-4 rounded-md border border-border bg-card p-6 sm:grid-cols-2">
            <Field label="Nome completo" value={`${emp.first_name} ${emp.last_name}`} />
            <Field label="Email" value={emp.email} />
            <Field label="Ruolo aziendale" value={emp.job_title ?? '—'} />
            <Field label="Dipartimento" value={emp.department ?? '—'} />
            <Field label="Sede" value={emp.locationName ?? emp.location ?? '—'} />
            <Field
              label="Data di assunzione"
              value={emp.hire_date ? formatDate(emp.hire_date) : '—'}
            />
            <Field
              label="Performance"
              value={
                emp.performance_rating != null ? Number(emp.performance_rating).toFixed(1) : '—'
              }
            />
            <Field label="Potenziale" value={emp.potential ?? '—'} />
            {emp.skills && emp.skills.length > 0 ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                  Competenze
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
