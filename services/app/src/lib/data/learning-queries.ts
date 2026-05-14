/**
 * learning-queries.ts — Role-aware learning path / enrollment queries (cycle 2 Phase 2).
 *
 * Source per /learning + KPI hero process_learning_paths_v2. P11 compliant.
 */
import { withTenant } from '@/lib/db';
import { resolveScope, type ScopeContext } from './_role-shaper';

export interface LearningKpi {
  activePaths: number | null;
  activeEnrollments: number | null;
  completedEnrollments: number | null;
  completionPercent: number | null;
}

const EMPTY_KPI: LearningKpi = {
  activePaths: null,
  activeEnrollments: null,
  completedEnrollments: null,
  completionPercent: null,
};

export async function fetchLearningKpi(ctx: ScopeContext): Promise<LearningKpi> {
  if (!ctx.tenantId) return EMPTY_KPI;
  const scope = resolveScope(ctx, 'learning');
  if (!scope.requiresTenantWrap) return EMPTY_KPI;

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const [pathRows, enrollmentRows] = await Promise.all([
        tx.$queryRaw<Array<{ active: number }>>`
          SELECT COUNT(*)::int AS active
          FROM learning_paths
          WHERE tenant_id = ${ctx.tenantId}::uuid AND is_active = true
        `,
        tx.$queryRaw<Array<{ total: number; active: number; completed: number }>>`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status NOT IN ('completed', 'cancelled'))::int AS active,
            COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
          FROM learning_path_enrollments
          WHERE tenant_id = ${ctx.tenantId}::uuid
        `,
      ]);

      const path = pathRows[0] ?? { active: 0 };
      const enr = enrollmentRows[0] ?? { total: 0, active: 0, completed: 0 };

      return {
        activePaths: path.active,
        activeEnrollments: enr.active,
        completedEnrollments: enr.completed,
        completionPercent: enr.total > 0 ? Math.round((100 * enr.completed) / enr.total) : null,
      };
    });
  } catch {
    return EMPTY_KPI;
  }
}

export interface LearningEnrollmentRow {
  id: string;
  employeeId: string | null;
  pathId: string | null;
  pathTitle: string;
  status: string;
  progressPercent: number | null;
  enrolledAt: Date | null;
  completedAt: Date | null;
}

export async function fetchLearningEnrollments(
  ctx: ScopeContext,
  opts: { limit?: number } = {}
): Promise<LearningEnrollmentRow[] | null> {
  if (!ctx.tenantId) return null;
  const scope = resolveScope(ctx, 'learning');
  if (!scope.requiresTenantWrap) return null;

  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);

  try {
    return await withTenant(ctx.tenantId, async (tx) => {
      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          employee_id: string | null;
          path_id: string | null;
          path_title: string;
          status: string;
          progress_percent: number | null;
          enrolled_at: Date | null;
          completed_at: Date | null;
        }>
      >`
        SELECT
          lpe.id::text,
          lpe.employee_id::text,
          lpe.learning_path_id::text AS path_id,
          COALESCE(lp.title_it, lp.title, lp.code, '(no title)') AS path_title,
          lpe.status,
          lpe.progress_percent,
          lpe.enrolled_at,
          lpe.completed_at
        FROM learning_path_enrollments lpe
        LEFT JOIN learning_paths lp ON lp.id = lpe.learning_path_id
        WHERE lpe.tenant_id = ${ctx.tenantId}::uuid
        ORDER BY lpe.enrolled_at DESC NULLS LAST
        LIMIT ${limit}
      `;
      return rows.map((r) => ({
        id: r.id,
        employeeId: r.employee_id,
        pathId: r.path_id,
        pathTitle: r.path_title,
        status: r.status,
        progressPercent: r.progress_percent,
        enrolledAt: r.enrolled_at,
        completedAt: r.completed_at,
      }));
    });
  } catch {
    return null;
  }
}
