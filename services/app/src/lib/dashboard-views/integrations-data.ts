import { prisma } from '@/lib/db';

/**
 * Server-side fetcher for integration health used by /dashboard org_systems
 * and cross_tenant_overview views (S41 W4-final). Reads integrations table.
 *
 * Cross-tenant: integrations table has tenant_id but for the platform view
 * we aggregate across tenants — SUPERUSER intentional.
 */

export interface IntegrationHealthRow {
  name: string;
  meta: string;
  status: 'ok' | 'warn' | 'critical';
  color: string;
}

function relativeAgo(ts: Date | null): string {
  if (!ts) return 'never';
  const ms = Date.now() - ts.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'now';
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ${min % 60}m ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const COLOR_BY_STATUS: Record<IntegrationHealthRow['status'], string> = {
  ok: 'var(--accent)',
  warn: 'var(--semantic-warning)',
  critical: 'var(--semantic-error)',
};

function deriveStatus(
  status: string | null,
  lastSyncStatus: string | null,
  errorCount: number | null
): IntegrationHealthRow['status'] {
  if (status === 'failed' || lastSyncStatus === 'failed' || (errorCount ?? 0) > 3)
    return 'critical';
  if (
    status === 'warning' ||
    status === 'degraded' ||
    lastSyncStatus === 'warning' ||
    (errorCount ?? 0) > 0
  ) {
    return 'warn';
  }
  return 'ok';
}

export async function fetchIntegrationsHealth(limit = 7): Promise<IntegrationHealthRow[]> {
  try {
    // SAFE: cross-tenant aggregation for platform admin views (SUPERUSER intentional)
    const integrations = await prisma.integrations.findMany({
      orderBy: { name: 'asc' },
      take: limit,
      select: {
        id: true,
        name: true,
        provider: true,
        status: true,
        last_sync_at: true,
        last_sync_status: true,
        sync_frequency: true,
        error_count: true,
      },
    });
    if (integrations.length === 0) return [];

    return integrations.map((i) => {
      const status = deriveStatus(i.status ?? null, i.last_sync_status ?? null, i.error_count ?? 0);
      const lastSyncTxt = relativeAgo(i.last_sync_at ?? null);
      const meta = i.sync_frequency
        ? `${i.provider} · ${i.sync_frequency} · last ${lastSyncTxt}`
        : `${i.provider} · last ${lastSyncTxt}`;
      return { name: i.name, meta, status, color: COLOR_BY_STATUS[status] };
    });
  } catch {
    return [];
  }
}
