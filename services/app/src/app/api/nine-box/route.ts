/**
 * S37 W2 — GET /api/nine-box?tenant=<uuid>
 *
 * Nine-box grid view per tenant (CASCADIA TALPIPE M11 derivation).
 * nine_box_grid è VIEW (non Prisma model) — usa $queryRaw + withTenant per RLS.
 */

import { NextResponse } from 'next/server';
import { Prisma } from '../../../../prisma/generated/client/index.js';
import { withTenant } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

type NineBoxRow = {
  tenant_id: string;
  employee_id: string;
  employee_name: string | null;
  job_title: string | null;
  department: string | null;
  overall_rating: number | null;
  potential_rating: string | null;
  performance_box: number | null;
  potential_box: number | null;
  nine_box_category: string | null;
  review_cycle_id: string | null;
};

export async function GET(req: Request) {
  const guard = await requirePermissionApi('DASHBOARD', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const tenant = url.searchParams.get('tenant') ?? guard.user.tenantId;
  if (!tenant) {
    return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });
  }

  const rows = await withTenant(tenant, async (tx) =>
    tx.$queryRaw<NineBoxRow[]>(Prisma.sql`
      SELECT tenant_id, employee_id, employee_name, job_title, department,
             overall_rating, potential_rating, performance_box, potential_box,
             nine_box_category, review_cycle_id
      FROM nine_box_grid
      WHERE tenant_id = ${tenant}::uuid
      ORDER BY performance_box DESC NULLS LAST, potential_box DESC NULLS LAST
      LIMIT 500
    `)
  );

  // Aggregate counts per nine_box_category for chart-friendly response
  const counts = new Map<string, number>();
  for (const r of rows) {
    const cat = r.nine_box_category ?? 'uncategorized';
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }

  return NextResponse.json({
    data: {
      rows,
      categories: Array.from(counts.entries()).map(([category, count]) => ({ category, count })),
    },
  });
}
