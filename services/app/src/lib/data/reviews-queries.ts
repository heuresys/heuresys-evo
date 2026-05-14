/**
 * reviews-queries.ts — Role-aware performance reviews queries (cycle 2 Phase 2).
 *
 * Source per /reviews route + KPI hero su /dashboard process_performance_cycle.
 * P11: ritorna null quando schema mancante / query fail.
 */
import { withTenant } from '@/lib/db';
import { resolveScope, type ScopeContext } from './_role-shaper';

export interface ReviewsCycleKpi {
  totalParticipants: number | null;
  completed: number | null;
  completionPercent: number | null;
  avgRating: number | null;
  ratingStddev: number | null;
  calibratedPercent: number | null;
}

const EMPTY_CYCLE: ReviewsCycleKpi = {
  totalParticipants: null,
  completed: null,
  completionPercent: null,
  avgRating: null,
  ratingStddev: null,
  calibratedPercent: null,
};

export async function fetchReviewsCycleKpi(ctx: ScopeContext): Promise<ReviewsCycleKpi> {
  if (!ctx.tenantId) return EMPTY_CYCLE;
  const scope = resolveScope(ctx, 'reviews');
  if (!scope.requiresTenantWrap) return EMPTY_CYCLE;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const [participantRows, reviewRows] = await Promise.all([
        tx.$queryRaw<Array<{ total: number; completed: number }>>`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
          FROM review_cycle_participants
          WHERE tenant_id = ${ctx.tenantId}::uuid
        `,
        tx.$queryRaw<
          Array<{
            avg_r: number | null;
            stddev_r: number | null;
            calibrated: number;
            total: number;
          }>
        >`
          SELECT
            AVG(overall_rating)::float AS avg_r,
            STDDEV(overall_rating)::float AS stddev_r,
            COUNT(*) FILTER (WHERE calibrated_at IS NOT NULL)::int AS calibrated,
            COUNT(*)::int AS total
          FROM performance_reviews
          WHERE tenant_id = ${ctx.tenantId}::uuid
        `,
      ]);

      const p = participantRows[0] ?? { total: 0, completed: 0 };
      const r = reviewRows[0] ?? { avg_r: null, stddev_r: null, calibrated: 0, total: 0 };

      return {
        totalParticipants: p.total,
        completed: p.completed,
        completionPercent: p.total > 0 ? Math.round((100 * p.completed) / p.total) : null,
        avgRating: r.avg_r !== null ? Math.round(r.avg_r * 10) / 10 : null,
        ratingStddev: r.stddev_r !== null ? Math.round(r.stddev_r * 100) / 100 : null,
        calibratedPercent: r.total > 0 ? Math.round((100 * r.calibrated) / r.total) : null,
      };
    });
  } catch {
    return EMPTY_CYCLE;
  }
}

export interface ReviewsByStatusRow {
  status: string;
  count: number;
}

export async function fetchReviewsByStatus(
  ctx: ScopeContext
): Promise<ReviewsByStatusRow[] | null> {
  if (!ctx.tenantId) return null;
  const scope = resolveScope(ctx, 'reviews');
  if (!scope.requiresTenantWrap) return null;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<Array<{ status: string; count: number }>>`
        SELECT status, COUNT(*)::int AS count
        FROM review_cycle_participants
        WHERE tenant_id = ${ctx.tenantId}::uuid
        GROUP BY status
        ORDER BY status
      `;
      return rows;
    });
  } catch {
    return null;
  }
}
