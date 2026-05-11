/**
 * S37 W2 — GET /api/succession/candidates?tenant=<uuid>
 *
 * Lista succession_candidates per tenant (post-S35.4 CASCADIA TALPIPE).
 * RBP gate: DASHBOARD. RLS enforced via withTenant.
 *
 * S40 Item4 — Response shape: returns items[] pre-shaped for BridgeCard
 *   adapter (id, role, readinessLabel, readinessValue, gaps[], targetDate,
 *   readinessLevel). Wraps raw rows in { items } so bridgeCardAdapter
 *   passthrough works directly via data_source.type='api'.
 */

import { NextResponse } from 'next/server';
import { withTenant } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

const READINESS_TO_VALUE: Record<string, number> = {
  ready_now: 92,
  ready_1_year: 78,
  ready_2_years: 62,
  ready_3_years: 48,
  ready_3_plus_years: 35,
  development_needed: 25,
};

export async function GET(req: Request) {
  const guard = await requirePermissionApi('DASHBOARD', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const tenant = url.searchParams.get('tenant') ?? guard.user.tenantId;
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '50'), 200);
  if (!tenant) {
    return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });
  }

  const rows = await withTenant(tenant, async (tx) =>
    tx.succession_candidates.findMany({
      where: { tenant_id: tenant },
      orderBy: [{ critical_role_id: 'asc' }, { rank_order: 'asc' }],
      take: limit,
    })
  );

  // Fetch succession_plans for role + target_date join (kept separate to avoid Prisma include
  // complexity when relation may be missing on legacy rows)
  const planIds = Array.from(
    new Set(rows.map((r) => r.critical_role_id).filter((id): id is string => !!id))
  );
  const plans = planIds.length
    ? await withTenant(tenant, async (tx) =>
        tx.succession_plans.findMany({
          where: { id: { in: planIds } },
          select: { id: true, position_name: true, target_date: true, criticality_level: true },
        })
      )
    : [];
  const planById = new Map(plans.map((p) => [p.id, p]));

  const items = rows.map((r) => {
    const plan = r.critical_role_id ? planById.get(r.critical_role_id) : null;
    const rl = r.readiness_level ?? 'development_needed';
    const gaps: string[] = [];
    if (r.development_needs) {
      gaps.push(
        ...r.development_needs
          .split(/[;\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 4)
      );
    }
    return {
      id: r.id,
      role: plan?.position_name ?? 'Unknown role',
      readinessLabel: 'Readiness',
      readinessValue: READINESS_TO_VALUE[rl] ?? 50,
      readinessUnit: '%',
      gaps,
      targetDate: plan?.target_date ? plan.target_date.toISOString().slice(0, 10) : undefined,
      readinessLevel: rl,
    };
  });

  return NextResponse.json({ data: { items } });
}
