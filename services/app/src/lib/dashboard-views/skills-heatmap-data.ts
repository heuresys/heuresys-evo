import { unstable_cache } from 'next/cache';
import { withTenant } from '@/lib/db';

/**
 * Server-side fetcher for /dashboard skills_heatmap view (S41 W4-final).
 * Aggregates employee_skill_assessments per (department × top skill)
 * to produce coverage matrix + critical cells.
 *
 * Note: employee_skill_assessments does NOT have a tenant_id column —
 * tenant scoping is enforced via JOIN to employees.tenant_id.
 *
 * S45 perf: wrapped with unstable_cache (revalidate=60s · per-tenant key).
 */

export interface HeatmapCell {
  dept: string;
  skill: string;
  coverage: number;
  bucket: 'critical' | 'warn' | 'ok' | 'healthy';
}

export interface HeatmapBucket {
  range: string;
  count: number;
  tone: 'critical' | 'warn' | 'ok' | 'info';
}

export interface SkillsHeatmapLiveData {
  departments: string[];
  skills: string[];
  cells: number[][]; // [deptIdx][skillIdx] = coverage %
  buckets: HeatmapBucket[];
  criticalCells: HeatmapCell[];
  totals: {
    critical: number;
    warning: number;
    healthy: number;
    avgCoverage: number;
  };
}

function bucketOf(v: number): HeatmapCell['bucket'] {
  if (v >= 75) return 'healthy';
  if (v >= 60) return 'ok';
  if (v >= 30) return 'warn';
  return 'critical';
}

async function fetchSkillsHeatmapDataUncached(
  tenantId: string | null
): Promise<SkillsHeatmapLiveData> {
  const fallback: SkillsHeatmapLiveData = {
    departments: [],
    skills: [],
    cells: [],
    buckets: [],
    criticalCells: [],
    totals: { critical: 0, warning: 0, healthy: 0, avgCoverage: 0 },
  };
  if (!tenantId) return fallback;

  try {
    return await withTenant(tenantId, async (tx) => {
      const deptRows = await tx.employees.groupBy({
        by: ['department'],
        where: { tenant_id: tenantId, is_active: true, department: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 8,
      });
      const departments = deptRows.map((d) => d.department).filter((d): d is string => !!d);
      if (departments.length === 0) return fallback;

      const skillRows = await tx.$queryRaw<{ skill_name: string; c: bigint }[]>`
        SELECT esca.skill_name, COUNT(*)::bigint AS c
        FROM employee_skill_assessments esca
        JOIN employees e ON e.id = esca.employee_id
        WHERE e.tenant_id = ${tenantId}::uuid
          AND esca.skill_name IS NOT NULL
        GROUP BY esca.skill_name
        ORDER BY c DESC
        LIMIT 12
      `;
      const skills = skillRows.map((r) => r.skill_name);
      if (skills.length === 0) return fallback;

      // assessed_level is INT 1-5 → coverage % = avg(level) / 5 * 100
      const matrix = await tx.$queryRaw<
        { department: string; skill_name: string; avg_lvl: number | null }[]
      >`
        SELECT e.department, esca.skill_name, AVG(esca.assessed_level)::float AS avg_lvl
        FROM employee_skill_assessments esca
        JOIN employees e ON e.id = esca.employee_id
        WHERE e.tenant_id = ${tenantId}::uuid
          AND e.department = ANY(${departments}::text[])
          AND esca.skill_name = ANY(${skills}::text[])
        GROUP BY e.department, esca.skill_name
      `;
      const cellMap = new Map<string, number>();
      for (const r of matrix) {
        const pct = Math.min(100, Math.round((Number(r.avg_lvl ?? 0) / 5) * 100));
        cellMap.set(`${r.department}::${r.skill_name}`, pct);
      }

      const cells: number[][] = departments.map((d) =>
        skills.map((s) => cellMap.get(`${d}::${s}`) ?? 0)
      );

      let crit = 0,
        warn = 0,
        healthy = 0,
        total = 0,
        sum = 0;
      const criticalCells: HeatmapCell[] = [];
      const bucketBins = { critical: 0, warn: 0, ok: 0, healthy: 0 };
      cells.forEach((row, di) => {
        row.forEach((v, si) => {
          total += 1;
          sum += v;
          const b = bucketOf(v);
          bucketBins[b] += 1;
          if (b === 'critical') {
            crit += 1;
            criticalCells.push({
              dept: departments[di]!,
              skill: skills[si]!,
              coverage: v,
              bucket: b,
            });
          } else if (b === 'warn') {
            warn += 1;
          } else {
            healthy += 1;
          }
        });
      });
      criticalCells.sort((a, b) => a.coverage - b.coverage);

      const buckets: HeatmapBucket[] = [
        { range: '0-30%', count: bucketBins.critical, tone: 'critical' },
        { range: '30-60%', count: bucketBins.warn, tone: 'warn' },
        { range: '60-75%', count: bucketBins.ok, tone: 'ok' },
        { range: '75-100%', count: bucketBins.healthy, tone: 'info' },
      ];

      return {
        departments,
        skills,
        cells,
        buckets,
        criticalCells: criticalCells.slice(0, 6),
        totals: {
          critical: crit,
          warning: warn,
          healthy,
          avgCoverage: total > 0 ? Math.round(sum / total) : 0,
        },
      };
    });
  } catch {
    return fallback;
  }
}

export const fetchSkillsHeatmapData = unstable_cache(
  fetchSkillsHeatmapDataUncached,
  ['dashboard:skills-heatmap:v1'],
  { revalidate: 60, tags: ['dashboard:skills-heatmap'] }
);
