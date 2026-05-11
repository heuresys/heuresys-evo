/**
 * S37 W2 — GET /api/succession/candidates?tenant=<uuid>
 *
 * Lista succession_candidates per tenant (post-S35.4 CASCADIA TALPIPE).
 * RBP gate: DASHBOARD. RLS enforced via withTenant.
 */

import { NextResponse } from 'next/server';
import { withTenant } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

export async function GET(req: Request) {
  const guard = await requirePermissionApi('DASHBOARD', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const tenant = url.searchParams.get('tenant') ?? guard.user.tenantId;
  if (!tenant) {
    return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });
  }

  const data = await withTenant(tenant, async (tx) =>
    tx.succession_candidates.findMany({
      where: { tenant_id: tenant },
      orderBy: [{ critical_role_id: 'asc' }, { rank_order: 'asc' }],
      take: 200,
    })
  );

  return NextResponse.json({ data });
}
