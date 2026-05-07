import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { isAuthenticated } from '@heuresys/shared/rbp';

/**
 * /me/skills — User's ESCO skills + assessments (self-service).
 * Falls back to the freeform `employees.skills` array if the structured
 * `employee_skills` table has no row for this user.
 */
async function fetchMySkills(tenantId: string, userId: string) {
  return withTenant(tenantId, async (tx) => {
    const u = await tx.users.findUnique({
      where: { id: userId },
      select: { employee_id: true },
    });
    if (!u?.employee_id) return null;

    const [structured, freeform] = await Promise.all([
      tx.employee_skills.findMany({
        where: { employee_id: u.employee_id, deleted_at: null },
        take: 100,
        select: {
          id: true,
          skill_id: true,
          proficiency_level: true,
          years_experience: true,
        },
      }),
      tx.employees.findUnique({
        where: { id: u.employee_id },
        select: { skills: true },
      }),
    ]);

    return {
      employeeId: u.employee_id,
      structured,
      freeform: freeform?.skills ?? [],
    };
  });
}

const PROFICIENCY_TONE: Record<string, string> = {
  novice: 'rgba(138,142,155,0.18)',
  basic: 'rgba(138,142,155,0.25)',
  intermediate: 'rgba(94,105,209,0.25)',
  proficient: 'rgba(95,184,122,0.18)',
  expert: 'rgba(95,184,122,0.30)',
  master: 'rgba(168,85,247,0.25)',
};

export default async function MySkillsPage() {
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
        <h1 className="text-3xl font-semibold">My skills</h1>
        <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Session lacks user/tenant context.
        </p>
      </main>
    );
  }

  let data: Awaited<ReturnType<typeof fetchMySkills>> = null;
  let fetchError: string | null = null;
  try {
    data = await fetchMySkills(user.tenantId, user.id);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">My skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ESCO-mapped + freeform — owner: {user.username}
        </p>
      </header>

      <section className="mt-8">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load skills: <code>{fetchError}</code>
          </p>
        ) : !data ? (
          <p className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            No employee record linked to this user.
          </p>
        ) : (
          <>
            <h2 className="mt-4 text-lg font-medium">ESCO-mapped skills</h2>
            {data.structured.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No structured ESCO mapping yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-border rounded-md border border-border">
                {data.structured.map((s) => (
                  <li
                    key={s.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-3 p-3 text-sm"
                  >
                    <code className="text-xs">
                      {s.skill_id ? `${String(s.skill_id).slice(0, 12)}…` : '—'}
                    </code>
                    {s.proficiency_level ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          background:
                            PROFICIENCY_TONE[s.proficiency_level] ?? 'rgba(138,142,155,0.18)',
                        }}
                      >
                        {s.proficiency_level}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {s.years_experience != null
                        ? `${Number(s.years_experience).toFixed(1)} yrs`
                        : '—'}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-8 text-lg font-medium">Freeform tags</h2>
            {data.freeform.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No freeform skills declared.</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {data.freeform.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
