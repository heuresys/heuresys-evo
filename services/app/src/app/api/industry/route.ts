/**
 * S37 W6.1 — GET /api/industry?tenant=<uuid>|<code>
 *
 * Returns the cached industry_profile JSON for a given tenant (CASCADIA INDOOR).
 * Combines DB-level industry_profile metadata + filesystem cache (research JSON).
 *
 * RBP gate: EXPLORER. Tenant scoped via session fallback.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const CACHE_DIR = 'db/seeds/realistic/_research_cache';

// Map tenant.code → JSON cache filename (rtl-bank → rtl_bank_industry_profile.json)
function cacheFilename(code: string): string {
  return `${code.replace(/-/g, '_')}_industry_profile.json`;
}

export async function GET(req: Request) {
  const guard = await requirePermissionApi('EXPLORER', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const tenant = url.searchParams.get('tenant') ?? guard.user.tenantId;
  if (!tenant) {
    return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });
  }

  // Resolve tenant uuid → tenant.code (or accept code directly)
  let tenantCode: string | null = null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenant)) {
    const t = await prisma.tenants.findUnique({ where: { id: tenant }, select: { code: true } });
    tenantCode = t?.code ?? null;
  } else {
    tenantCode = tenant;
  }
  if (!tenantCode) {
    return NextResponse.json({ error: 'tenant_not_found' }, { status: 404 });
  }

  // Read JSON cache file
  const filePath = join(process.cwd(), CACHE_DIR, cacheFilename(tenantCode));
  try {
    const raw = await readFile(filePath, 'utf-8');
    const profile = JSON.parse(raw);
    return NextResponse.json({ data: { tenant_code: tenantCode, profile } });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'industry_profile_not_found',
        tenant_code: tenantCode,
        details: err instanceof Error ? err.message : 'unknown',
      },
      { status: 404 }
    );
  }
}
