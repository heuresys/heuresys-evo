/**
 * S41 W4-final — GET /api/capability/aggregate?employeeId=<uuid>
 *
 * Returns CapabilityRadar-shaped payload (5 capability dimensions current vs target).
 * Used by CapabilityRadar widget binding (phase18o).
 *
 * Modes:
 *   - With employeeId: per-employee capability radar (employee skill level avg
 *     vs required_level avg, grouped by canonical OPOURSKA dimensions).
 *   - Without employeeId: tenant-wide aggregate (avg across all employees).
 *
 * RBP gate: DASHBOARD READ. RLS via withTenant. Employee scoping enforced when
 * employeeId provided.
 *
 * Response shape (consumed by capabilityRadarAdapter):
 *   {
 *     data: {
 *       axes: ['Process','Struct','Role','Skill','Perf'],
 *       series: [
 *         { name: 'Current', values: [n1, n2, ...] },
 *         { name: 'Target',  values: [n1, n2, ...] }
 *       ],
 *       max: 100,
 *       rings: 4,
 *       showLegend: true
 *     }
 *   }
 */

import { NextResponse } from 'next/server';
import { withTenant } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

const AXES = ['Process', 'Struct', 'Role', 'Skill', 'Perf'];

/**
 * Maps a free-form skill_name to one of 5 OPOURSKA capability axes using
 * deterministic keyword heuristics. Returns axis index 0-4.
 */
function axisOf(skillName: string): number {
  const s = skillName.toLowerCase();
  if (/process|workflow|operation|operat|lean|six.?sigma|agile|scrum/.test(s)) return 0; // Process
  if (/struct|org|team|hierarchy|department/.test(s)) return 1; // Struct
  if (/lead|manag|director|role|head|chief/.test(s)) return 2; // Role
  if (/perform|kpi|goal|outcome|result|metric|review/.test(s)) return 4; // Perf
  return 3; // Skill (default — competency dimension)
}

export async function GET(req: Request) {
  const guard = await requirePermissionApi('DASHBOARD', 'READ');
  if (!guard.ok) return guard.response;

  const tenant = guard.user.tenantId;
  if (!tenant) return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });

  const url = new URL(req.url);
  const employeeId = url.searchParams.get('employeeId');
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (employeeId && !UUID_RE.test(employeeId)) {
    return NextResponse.json({ error: 'invalid_employee_id' }, { status: 400 });
  }

  const rows = await withTenant(tenant, async (tx) => {
    if (employeeId) {
      const emp = await tx.employees.findFirst({
        where: { id: employeeId, tenant_id: tenant, is_active: true },
        select: { id: true },
      });
      if (!emp) return null;
      return tx.employee_skill_assessments.findMany({
        where: { employee_id: employeeId },
        select: { skill_name: true, assessed_level: true, required_level: true },
      });
    }
    // tenant-wide aggregation
    return tx.$queryRaw<
      { skill_name: string; avg_assessed: number; avg_required: number | null }[]
    >`
      SELECT esca.skill_name,
             AVG(esca.assessed_level)::float AS avg_assessed,
             AVG(esca.required_level)::float AS avg_required
      FROM employee_skill_assessments esca
      JOIN employees e ON e.id = esca.employee_id
      WHERE e.tenant_id = ${tenant}::uuid AND e.is_active = true
      GROUP BY esca.skill_name
    `;
  });

  if (rows === null) {
    return NextResponse.json({ error: 'employee_not_found' }, { status: 404 });
  }

  // Aggregate per-axis: sum assessed × 20 (1-5 scale → %) + sum required × 20, then mean
  const currentBucket = Array.from({ length: 5 }, () => ({ sum: 0, count: 0 }));
  const targetBucket = Array.from({ length: 5 }, () => ({ sum: 0, count: 0 }));

  for (const r of rows as Array<{
    skill_name: string;
    assessed_level?: number;
    required_level?: number | null;
    avg_assessed?: number;
    avg_required?: number | null;
  }>) {
    const axis = axisOf(r.skill_name ?? '');
    const assessed = r.avg_assessed ?? r.assessed_level ?? 0;
    const required = r.avg_required ?? r.required_level ?? assessed;
    if (assessed > 0) {
      currentBucket[axis]!.sum += Number(assessed) * 20;
      currentBucket[axis]!.count += 1;
    }
    if (required && Number(required) > 0) {
      targetBucket[axis]!.sum += Number(required) * 20;
      targetBucket[axis]!.count += 1;
    }
  }

  const current = currentBucket.map((b) =>
    b.count > 0 ? Math.round(Math.min(100, b.sum / b.count)) : 0
  );
  const target = targetBucket.map((b) =>
    b.count > 0 ? Math.round(Math.min(100, b.sum / b.count)) : 0
  );

  // If no data at all, return null payload so adapter falls back to demo
  const hasAny = current.some((v) => v > 0) || target.some((v) => v > 0);
  if (!hasAny) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({
    data: {
      axes: AXES,
      series: [
        { name: 'Current', values: current },
        { name: 'Target', values: target },
      ],
      max: 100,
      rings: 4,
      showLegend: true,
    },
  });
}
