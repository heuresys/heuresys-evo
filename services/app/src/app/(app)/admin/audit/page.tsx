import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma, withTenant } from '@/lib/db';
import { hasMinRole, isRbpPlatformAdmin } from '@heuresys/shared/rbp';

/**
 * /admin/audit — Audit log viewer (HR_DIRECTOR+ tenant-scoped, SUPERUSER cross-tenant).
 */
async function fetchAuditLogs(tenantId: string | null) {
  const select = {
    id: true,
    action: true,
    user_email: true,
    user_role: true,
    resource_type: true,
    resource_id: true,
    category: true,
    tenant_id: true,
    success: true,
    timestamp: true,
  } as const;
  if (tenantId == null) {
    return prisma.audit_logs.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      select,
    });
  }
  return withTenant(tenantId, (tx) =>
    tx.audit_logs.findMany({
      where: { tenant_id: tenantId },
      orderBy: { timestamp: 'desc' },
      take: 100,
      select,
    })
  );
}

const CATEGORY_TONE: Record<string, string> = {
  AUTH: 'var(--brand-blue)',
  CONFIG: 'var(--accent)',
  DATA: 'var(--semantic-success)',
  SECURITY: 'var(--semantic-danger)',
  PROCESS: 'var(--brand-purple)',
};

export default async function AuditPage() {
  const session = await auth();
  const user = session?.user as { role?: string; tenantId?: string } | undefined;

  if (!hasMinRole(user, 'HR_DIRECTOR')) {
    redirect('/dashboard');
  }

  const tenantId = isRbpPlatformAdmin(user) ? null : (user?.tenantId ?? null);
  let logs: Awaited<ReturnType<typeof fetchAuditLogs>> = [];
  let fetchError: string | null = null;
  try {
    logs = await fetchAuditLogs(tenantId);
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e);
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isRbpPlatformAdmin(user)
            ? 'Cross-tenant audit trail · platform scope'
            : `Tenant scope · ${user?.tenantId?.slice(0, 8)}…`}
        </p>
      </header>

      <section className="mt-6">
        {fetchError ? (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Could not load audit log: <code>{fetchError}</code>
          </p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audit entries.</p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">{logs.length} most recent entries</p>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left font-mono">When (UTC)</th>
                    <th className="p-2 text-left font-mono">Category</th>
                    <th className="p-2 text-left font-mono">Action</th>
                    <th className="p-2 text-left font-mono">Resource</th>
                    <th className="p-2 text-left font-mono">Actor</th>
                    {isRbpPlatformAdmin(user) ? (
                      <th className="p-2 text-left font-mono">Tenant</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t border-border">
                      <td className="p-2 font-mono text-xs">
                        {log.timestamp?.toISOString().slice(0, 19).replace('T', ' ')}
                      </td>
                      <td className="p-2 font-mono text-xs">
                        <span
                          style={{ color: CATEGORY_TONE[log.category ?? ''] ?? 'var(--ink-muted)' }}
                        >
                          {log.category ?? '—'}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-xs">
                        {log.action}
                        {log.success === false ? (
                          <span className="ml-1 text-destructive">FAIL</span>
                        ) : null}
                      </td>
                      <td className="p-2 text-xs">
                        <code>{log.resource_type ?? '—'}</code>
                        {log.resource_id ? (
                          <span className="ml-1 text-muted-foreground">
                            · {String(log.resource_id).slice(0, 8)}…
                          </span>
                        ) : null}
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">
                        {log.user_email ?? '—'}
                        {log.user_role ? (
                          <span className="ml-1 text-xs">({log.user_role})</span>
                        ) : null}
                      </td>
                      {isRbpPlatformAdmin(user) ? (
                        <td className="p-2 font-mono text-xs text-muted-foreground">
                          {log.tenant_id?.slice(0, 8) ?? '—'}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
