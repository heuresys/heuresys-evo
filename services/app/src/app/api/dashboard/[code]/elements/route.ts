/**
 * Phase 14 Sprint 3.C — Dashboard layout mutation endpoint.
 *
 * PUT /api/dashboard/:code/elements
 *
 * Body: { updates: Array<{
 *   id: string,
 *   grid_col_start: number, grid_col_span: number,
 *   grid_row_start: number, grid_row_span: number,
 *   position: number,
 * }> }
 *
 * RBP gate: TENANT_OWNER | HR_DIRECTOR | SUPERUSER. One audit_logs row per
 * changed element via auditedDashboardMutation.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { auditedDashboardMutation } from '@/lib/audit/dashboard-audit';

const UpdateSchema = z.object({
  id: z.string().regex(/^\d+$/, 'id must be a stringified BigInt'),
  grid_col_start: z.number().int().min(1).max(12),
  grid_col_span: z.number().int().min(1).max(12),
  grid_row_start: z.number().int().min(1).max(50),
  grid_row_span: z.number().int().min(1).max(20),
  position: z.number().int().min(1),
});

const BodySchema = z.object({
  updates: z.array(UpdateSchema).min(1).max(50),
});

const EDITOR_ROLES = new Set(['SUPERUSER', 'TENANT_OWNER', 'HR_DIRECTOR']);

interface RouteContext {
  params: Promise<{ code: string }>;
}

export async function PUT(req: Request, ctx: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }
  const user = session.user as { id?: string; role?: string; tenantId?: string };
  if (!user.role || !EDITOR_ROLES.has(user.role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  if (!user.tenantId || !user.id) {
    return NextResponse.json({ error: 'missing_session_context' }, { status: 401 });
  }

  const { code } = await ctx.params;

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: 'invalid_body', detail: err instanceof Error ? err.message : 'parse error' },
      { status: 400 }
    );
  }

  const preset = await prisma.dashboard_presets.findUnique({
    where: { code },
    select: { id: true, code: true },
  });
  if (!preset) {
    return NextResponse.json({ error: 'preset_not_found' }, { status: 404 });
  }

  const ids = body.updates.map((u) => BigInt(u.id));
  const existing = await prisma.dashboard_elements.findMany({
    where: { id: { in: ids }, dashboard_preset_id: preset.id },
    select: {
      id: true,
      widget_code: true,
      grid_col_start: true,
      grid_col_span: true,
      grid_row_start: true,
      grid_row_span: true,
      position: true,
      tenant_id: true,
    },
  });

  if (existing.length !== body.updates.length) {
    return NextResponse.json(
      { error: 'element_not_in_preset', expected: body.updates.length, found: existing.length },
      { status: 400 }
    );
  }

  // Tenant gate: every targeted element must be either platform default
  // (tenant_id null) or owned by the caller's tenant.
  for (const el of existing) {
    if (el.tenant_id !== null && el.tenant_id !== user.tenantId) {
      return NextResponse.json({ error: 'tenant_mismatch' }, { status: 403 });
    }
  }

  const byId = new Map(existing.map((e) => [e.id.toString(), e]));
  const auditIds: string[] = [];
  let mutated = 0;

  for (const upd of body.updates) {
    const before = byId.get(upd.id);
    if (!before) continue;
    const noop =
      before.grid_col_start === upd.grid_col_start &&
      before.grid_col_span === upd.grid_col_span &&
      before.grid_row_start === upd.grid_row_start &&
      before.grid_row_span === upd.grid_row_span &&
      before.position === upd.position;
    if (noop) continue;

    const { auditId } = await auditedDashboardMutation({
      actor: { userId: user.id, userRole: user.role ?? null, tenantId: user.tenantId },
      action: 'UPDATE',
      resourceType: 'dashboard_elements',
      resourceId: before.id,
      resourceName: before.widget_code,
      description: `Layout edit on dashboard preset "${preset.code}"`,
      oldValue: {
        grid_col_start: before.grid_col_start,
        grid_col_span: before.grid_col_span,
        grid_row_start: before.grid_row_start,
        grid_row_span: before.grid_row_span,
        position: before.position,
      },
      newValue: {
        grid_col_start: upd.grid_col_start,
        grid_col_span: upd.grid_col_span,
        grid_row_start: upd.grid_row_start,
        grid_row_span: upd.grid_row_span,
        position: upd.position,
      },
      metadata: { source: 'dashboard-editor', presetCode: preset.code },
      mutate: (tx) =>
        // SAFE: tx already inside auditedDashboardMutation withTenant wrapper
        tx.dashboard_elements.update({
          where: { id: before.id },
          data: {
            grid_col_start: upd.grid_col_start,
            grid_col_span: upd.grid_col_span,
            grid_row_start: upd.grid_row_start,
            grid_row_span: upd.grid_row_span,
            position: upd.position,
          },
          select: { id: true },
        }),
    });
    auditIds.push(auditId);
    mutated++;
  }

  return NextResponse.json({ mutated, total: body.updates.length, auditIds });
}
