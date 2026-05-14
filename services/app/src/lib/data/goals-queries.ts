/**
 * goals-queries.ts — Role-aware OKR/goals queries (cycle 2 Phase 2).
 *
 * P11: ritorna null su schema mancante o query fail.
 */
import { withTenant } from '@/lib/db';
import { resolveScope, type ScopeContext } from './_role-shaper';

export interface GoalsKpi {
  total: number | null;
  active: number | null;
  onTrack: number | null;
  atRisk: number | null;
  onTrackPercent: number | null;
}

const EMPTY_KPI: GoalsKpi = {
  total: null,
  active: null,
  onTrack: null,
  atRisk: null,
  onTrackPercent: null,
};

export async function fetchGoalsKpi(ctx: ScopeContext): Promise<GoalsKpi> {
  if (!ctx.tenantId) return EMPTY_KPI;
  const scope = resolveScope(ctx, 'goals');
  if (!scope.requiresTenantWrap) return EMPTY_KPI;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          total: number;
          active: number;
          on_track: number;
          at_risk: number;
        }>
      >`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status NOT IN ('completed', 'cancelled', 'archived'))::int AS active,
          COUNT(*) FILTER (WHERE status = 'on_track')::int AS on_track,
          COUNT(*) FILTER (WHERE status = 'at_risk')::int AS at_risk
        FROM goals
        WHERE tenant_id = ${ctx.tenantId}::uuid
      `;
      const r = rows[0] ?? { total: 0, active: 0, on_track: 0, at_risk: 0 };
      return {
        total: r.total,
        active: r.active,
        onTrack: r.on_track,
        atRisk: r.at_risk,
        onTrackPercent: r.total > 0 ? Math.round((100 * r.on_track) / r.total) : null,
      };
    });
  } catch {
    return EMPTY_KPI;
  }
}

export interface GoalRow {
  id: string;
  title: string;
  status: string;
  ownerEmployeeId: string | null;
  progressPercent: number | null;
  dueDate: Date | null;
}

export async function fetchGoalsList(
  ctx: ScopeContext,
  opts: { limit?: number } = {}
): Promise<GoalRow[] | null> {
  if (!ctx.tenantId) return null;
  const scope = resolveScope(ctx, 'goals');
  if (!scope.requiresTenantWrap) return null;

  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          title: string;
          status: string;
          owner_employee_id: string | null;
          progress_percent: number | null;
          due_date: Date | null;
        }>
      >`
        SELECT id::text, title, status, owner_employee_id::text, progress_percent, due_date
        FROM goals
        WHERE tenant_id = ${ctx.tenantId}::uuid
          AND status NOT IN ('archived')
        ORDER BY due_date NULLS LAST, title
        LIMIT ${limit}
      `;
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        ownerEmployeeId: r.owner_employee_id,
        progressPercent: r.progress_percent,
        dueDate: r.due_date,
      }));
    });
  } catch {
    return null;
  }
}
