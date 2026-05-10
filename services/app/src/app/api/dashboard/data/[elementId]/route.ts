/**
 * Phase 14.A.5 — Client-side widget data endpoint.
 *
 * GET /api/dashboard/data/:elementId
 *
 * Resolves the element by id, verifies the calling user is allowed to see it
 * (RBP visibility_min_role + tenant ownership), extracts the data_source from
 * config_overrides, and runs `fetchWidgetData` server-side. Returns the same
 * shape used by the prefetch pipeline, so the SWR client hook (14.A.6) can
 * stale-while-revalidate without redoing any auth/RBP logic on the client.
 *
 * Errors:
 *   401 unauthenticated
 *   404 element not found OR element invisible to caller (do not leak existence)
 *   200 always for valid+visible elements; data may be null and error populated
 *       when the underlying SQL/static fetch failed (consumer renders fallback).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchWidgetData, type DataSourceConfig } from '@/lib/dashboard-engine/data-fetcher';
import { userRoleLevel } from '@/lib/dashboard-engine/resolver';
import { requirePermissionApi } from '@/lib/authorize-api';

interface RouteContext {
  params: Promise<{ elementId: string }>;
}

function extractDataSource(overrides: unknown): DataSourceConfig | null {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) return null;
  const ds = (overrides as Record<string, unknown>).data_source;
  if (!ds || typeof ds !== 'object' || Array.isArray(ds)) return null;
  const type = (ds as Record<string, unknown>).type;
  if (typeof type !== 'string') return null;
  return ds as DataSourceConfig;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const guard = await requirePermissionApi('DASHBOARD', 'READ');
  if (!guard.ok) return guard.response;
  const { user } = guard;

  const { elementId } = await ctx.params;
  const idBig = (() => {
    try {
      return BigInt(elementId);
    } catch {
      return null;
    }
  })();
  if (idBig === null) {
    return NextResponse.json({ error: 'invalid element id' }, { status: 400 });
  }

  const el = await prisma.dashboard_elements.findUnique({
    where: { id: idBig },
    select: {
      id: true,
      visibility_min_role: true,
      tenant_id: true,
      config_overrides: true,
    },
  });

  if (!el) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  // RBP: visibility_min_role gate (lower number = higher privilege; user level <= required to see).
  const userLevel = userRoleLevel(user.role ?? null);
  if (userLevel > el.visibility_min_role) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  // Tenant gate: element either platform default (tenant_id null) or matches caller's tenant.
  if (el.tenant_id !== null && el.tenant_id !== user.tenantId) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const config = extractDataSource(el.config_overrides);
  const result = await fetchWidgetData({
    elementId: el.id.toString(),
    config,
    ctx: {
      tenantId: user.tenantId ?? null,
      role: user.role ?? null,
      userId: user.id ?? null,
    },
  });

  return NextResponse.json(
    {
      elementId: el.id.toString(),
      data: result.data,
      error: result.error,
      source: result.source,
      cached: result.cached,
      fetchedAt: result.fetchedAt,
    },
    {
      status: 200,
      headers: {
        // SWR-friendly cache headers — TTL value mirrored from data-fetcher cache.
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    }
  );
}
