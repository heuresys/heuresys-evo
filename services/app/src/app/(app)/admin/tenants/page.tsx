import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { isRbpPlatformAdmin } from '@heuresys/shared/rbp';
import { RoleForbidden } from '@/app/(app)/_components/RoleForbidden';

/**
 * /admin/tenants — Platform-wide tenants directory (SUPERUSER only).
 */
export default async function TenantsPage() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;

  if (!isRbpPlatformAdmin(user)) {
    return (
      <RoleForbidden
        required="SUPERUSER"
        currentRole={user?.role}
        hint="L'elenco tenant è cross-tenant e visibile solo agli amministratori di piattaforma."
      />
    );
  }

  let tenants: Array<{
    id: string;
    code: string;
    name: string;
    region: string | null;
    status: string | null;
    employee_count: number | null;
    subscription_plan: string | null;
    industry_type: string | null;
    created_at: Date | null;
  }> = [];
  let fetchError: string | null = null;
  try {
    tenants = await prisma.tenants.findMany({
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        code: true,
        name: true,
        region: true,
        status: true,
        employee_count: true,
        subscription_plan: true,
        industry_type: true,
        created_at: true,
      },
    });
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">Tenants</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide directory · {tenants.length} total
        </p>
      </header>

      <section className="mt-6">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load tenants: <code>{fetchError}</code>
          </p>
        ) : tenants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tenants found.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {tenants.map((t) => {
              const isActive = t.status === 'active';
              return (
                <li
                  key={t.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 p-3 text-sm"
                >
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      <code>{t.code}</code>
                      {t.region ? <> · {t.region}</> : null}
                      {t.industry_type ? <> · {t.industry_type}</> : null}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.employee_count ?? 0} emp</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      background: 'rgba(94,105,209,0.18)',
                      color: 'var(--accent)',
                    }}
                  >
                    {t.subscription_plan ?? 'starter'}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      background: isActive ? 'rgba(95,184,122,0.18)' : 'rgba(138,142,155,0.18)',
                      color: isActive ? '#5fb87a' : '#8a8e9b',
                    }}
                  >
                    {t.status ?? 'unknown'}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
