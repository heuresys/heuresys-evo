/**
 * S37 W2 — GET /api/ccnl
 *
 * ITLAB catalog: CCNL contracts + levels (platform-default, no tenant scope).
 * Reference data per payroll widget + leave compliance.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

export async function GET(req: Request) {
  const guard = await requirePermissionApi('EMPLOYEES', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const sector = url.searchParams.get('sector');
  const includeLevels = url.searchParams.get('include_levels') !== '0';

  const where = sector ? { sector } : undefined;

  const contracts = await prisma.ccnl_contracts.findMany({
    where,
    orderBy: [{ sector: 'asc' }, { name: 'asc' }],
  });

  if (!includeLevels) {
    return NextResponse.json({ data: contracts });
  }

  const codes = contracts.map((c) => c.code);
  const levels = codes.length
    ? await prisma.ccnl_levels.findMany({
        where: { ccnl_code: { in: codes }, is_current: true },
        orderBy: [{ ccnl_code: 'asc' }, { level_order: 'asc' }],
      })
    : [];

  const levelsByCode = new Map<string, typeof levels>();
  for (const l of levels) {
    const arr = levelsByCode.get(l.ccnl_code) ?? [];
    arr.push(l);
    levelsByCode.set(l.ccnl_code, arr);
  }

  return NextResponse.json({
    data: contracts.map((c) => ({
      ...c,
      levels: levelsByCode.get(c.code) ?? [],
    })),
  });
}
