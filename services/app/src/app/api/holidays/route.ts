/**
 * S37 W2 — GET /api/holidays?year=<n>&country=IT&region=<code>
 *
 * Holidays catalog (ITLAB phase18d: ~96 holidays IT 2025-2026).
 * Tenant-scoped fallback: include platform-default (tenant_id NULL).
 */

import { NextResponse } from 'next/server';
import { withTenant } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

export async function GET(req: Request) {
  const guard = await requirePermissionApi('EXPLORER', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const year = url.searchParams.get('year');
  const country = url.searchParams.get('country') ?? 'IT';
  const region = url.searchParams.get('region');
  const tenant = url.searchParams.get('tenant') ?? guard.user.tenantId;

  if (!tenant) {
    return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });
  }

  const whereParts: Record<string, unknown> = { is_active: true, country_code: country };
  if (year && /^\d{4}$/.test(year)) {
    const y = Number(year);
    whereParts.date = {
      gte: new Date(`${y}-01-01T00:00:00Z`),
      lte: new Date(`${y}-12-31T23:59:59Z`),
    };
  }
  if (region) whereParts.region_code = region;

  const data = await withTenant(tenant, async (tx) =>
    tx.holidays.findMany({
      where: whereParts,
      orderBy: [{ date: 'asc' }],
      take: 500,
    })
  );

  return NextResponse.json({ data });
}
