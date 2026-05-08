import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { getServerLocale } from '@/lib/i18n/server';
import { hasMinRole, isRbpPlatformAdmin } from '@heuresys/shared/rbp';

const STRINGS = {
  it: {
    title: 'Integrazioni',
    platformWide: 'Integrazioni platform-wide',
    tenantScope: (id: string) => `Ambito tenant · ${id}…`,
    sapHint: (n: number) => `${n} dipendenti con SAP pernr`,
  },
  en: {
    title: 'Integrations',
    platformWide: 'Platform-wide integrations',
    tenantScope: (id: string) => `Tenant scope · ${id}…`,
    sapHint: (n: number) => `${n} employees with SAP pernr`,
  },
} as const;

const KNOWN_INTEGRATIONS = [
  {
    code: 'sap',
    name: 'SAP HCM',
    description: 'Employees + payroll sync from SAP HCM via PA infotypes',
    status: 'connected',
  },
  {
    code: 'esco',
    name: 'ESCO ontology',
    description:
      'European Skills/Competences/Occupations taxonomy (3,040 occupations + 14k skills)',
    status: 'connected',
  },
  {
    code: 'openai',
    name: 'OpenAI advisor',
    description: 'LLM advisor for ontology + skill extraction',
    status: process.env.OPENAI_API_KEY ? 'connected' : 'configured',
  },
  {
    code: 'redis',
    name: 'Redis cache',
    description: 'Session cache + RBP cache + BullMQ enrichment queue',
    status: 'connected',
  },
  {
    code: 'm365',
    name: 'Microsoft 365 SSO',
    description: 'OAuth login via Azure AD (planned)',
    status: 'planned',
  },
  {
    code: 'gws',
    name: 'Google Workspace SSO',
    description: 'OAuth login via Google Workspace (planned)',
    status: 'planned',
  },
];

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  connected: { bg: 'rgba(95,184,122,0.18)', fg: '#5fb87a' },
  configured: { bg: 'rgba(212,160,23,0.20)', fg: '#e8b835' },
  planned: { bg: 'rgba(138,142,155,0.18)', fg: '#8a8e9b' },
  failed: { bg: 'rgba(239,68,68,0.18)', fg: '#ef4444' },
};

export default async function IntegrationsPage() {
  const locale = await getServerLocale();
  const t = STRINGS[locale];
  const session = await auth();
  const user = session?.user as { role?: string; tenantId?: string } | undefined;
  if (!hasMinRole(user, 'IT_ADMIN')) redirect('/dashboard');

  // Pull SAP sync metrics if available
  let sapStatus: { sync_count: number; last_sync_at: Date | null } | null = null;
  try {
    if (user?.tenantId) {
      sapStatus = await withTenant(user.tenantId, async (tx) => {
        const count = await tx.employees.count({
          where: { pernr: { not: null }, is_active: true },
        });
        return { sync_count: count, last_sync_at: null };
      });
    }
  } catch {
    /* swallow */
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header>
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isRbpPlatformAdmin(user)
            ? t.platformWide
            : t.tenantScope(user?.tenantId?.slice(0, 8) ?? '—')}
        </p>
      </header>

      <section className="mt-6">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {KNOWN_INTEGRATIONS.map((i) => {
            const tone = STATUS_TONE[i.status] ?? { bg: 'rgba(138,142,155,0.18)', fg: '#8a8e9b' };
            return (
              <li key={i.code} className="rounded-md border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <code className="text-xs text-muted-foreground">{i.code}</code>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ background: tone.bg, color: tone.fg }}
                  >
                    {i.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{i.description}</p>
                {i.code === 'sap' && sapStatus ? (
                  <p className="mt-2 text-xs">{t.sapHint(sapStatus.sync_count)}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
