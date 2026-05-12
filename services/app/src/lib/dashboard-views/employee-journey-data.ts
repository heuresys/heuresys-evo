import { unstable_cache } from 'next/cache';
import { withTenant } from '@/lib/db';

/**
 * Server-side fetcher for /dashboard employee_journey view.
 * Reads employee profile + career timeline + skill assessments + review history
 * + succession bridges + skill trend + capability radar.
 *
 * Returns shape consumable by EmployeeJourneyView. View keeps fixture fallback
 * for sections that miss live data (preserves brand-fedele layout).
 *
 * S41 W4-final: profile/stages/reviews/bridges/skillStats bound.
 * S42 fixture purge: skillTrend (5 series × 5 quarters via employee_skill_history)
 * + radarSeries (5 OPOURSKA axes current vs target).
 */

export interface EmployeeProfile {
  id: string;
  fullName: string;
  initials: string;
  jobTitle: string | null;
  department: string | null;
  tenureYears: number;
  tenureMonths: number;
  level: number | null;
}

export interface CareerStage {
  id: string;
  label: string;
  year: string;
  status: 'past' | 'current' | 'future';
}

export interface ReviewRow {
  cycle: string;
  goal: number;
  comp: number;
  overall: number;
  outcome: 'meets' | 'grow' | 'exceeds';
}

export interface BridgeRole {
  role: string;
  readiness: number;
  gaps: string[];
}

export interface SkillTrendSeries {
  label: string;
  color: string;
  values: number[]; // 5 quarters, 0-100 scale
}

export interface SkillTrendData {
  quarters: string[]; // labels e.g. ['Q1 25','Q2 25',...]
  series: SkillTrendSeries[];
}

export interface RadarSeries {
  name: 'Current' | 'Target';
  values: number[]; // 5 axes (OPOURSKA: Process, Struct, Role, Skill, Perf), 0-100
}

export interface CapabilityRadarData {
  axes: string[];
  series: RadarSeries[];
}

export interface EmployeeJourneyLiveData {
  profile: EmployeeProfile | null;
  stages: CareerStage[];
  reviews: ReviewRow[];
  bridges: BridgeRole[];
  skillStats: {
    mapped: number;
    total: number;
    avgScore: number;
    readinessNext: number;
  };
  skillTrend: SkillTrendData | null;
  radar: CapabilityRadarData | null;
}

const READINESS_MAP: Record<string, number> = {
  ready_now: 92,
  ready_1_year: 78,
  ready_2_years: 62,
  ready_3_years: 48,
  ready_3_plus_years: 35,
  development_needed: 25,
};

const TREND_COLORS = ['#a855f7', '#3b82f6', '#5fb87a', '#f59e0b', '#6c5ce7'];
const RADAR_AXES = ['Process', 'Struct', 'Role', 'Skill', 'Perf'];

function deriveLevel(jobTitle: string | null): number | null {
  if (!jobTitle) return null;
  const lower = jobTitle.toLowerCase();
  if (lower.includes('director') || lower.includes('chief')) return 2;
  if (lower.includes('head') || lower.includes('manager')) return 3;
  if (lower.includes('senior') || lower.includes('lead')) return 5;
  if (lower.includes('junior') || lower.includes('intern')) return 7;
  return 6;
}

function quarterLabel(d: Date): string {
  return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
}

function quarterKey(d: Date): string {
  return `${d.getFullYear()}-${Math.ceil((d.getMonth() + 1) / 3)}`;
}

/**
 * Maps a free-form skill_name to one of 5 OPOURSKA capability axes.
 */
function axisOf(skillName: string): number {
  const s = skillName.toLowerCase();
  if (/process|workflow|operation|operat|lean|six.?sigma|agile|scrum/.test(s)) return 0;
  if (/struct|org|team|hierarchy|department/.test(s)) return 1;
  if (/lead|manag|director|role|head|chief/.test(s)) return 2;
  if (/perform|kpi|goal|outcome|result|metric|review/.test(s)) return 4;
  return 3;
}

async function fetchEmployeeJourneyDataUncached(
  tenantId: string | null,
  employeeId: string | null
): Promise<EmployeeJourneyLiveData> {
  const empty: EmployeeJourneyLiveData = {
    profile: null,
    stages: [],
    reviews: [],
    bridges: [],
    skillStats: { mapped: 0, total: 0, avgScore: 0, readinessNext: 0 },
    skillTrend: null,
    radar: null,
  };
  if (!tenantId || !employeeId) return empty;

  try {
    return await withTenant(tenantId, async (tx) => {
      const emp = await tx.employees.findFirst({
        where: { id: employeeId, tenant_id: tenantId, is_active: true },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          job_title: true,
          department: true,
          hire_date: true,
        },
      });
      if (!emp) return empty;

      const fullName = `${emp.first_name} ${emp.last_name}`.trim();
      const initials = `${emp.first_name[0] ?? ''}${emp.last_name[0] ?? ''}`.toUpperCase();
      let tenureYears = 0;
      let tenureMonths = 0;
      if (emp.hire_date) {
        const totalMonths = Math.floor(
          (Date.now() - emp.hire_date.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
        );
        tenureYears = Math.floor(totalMonths / 12);
        tenureMonths = totalMonths % 12;
      }

      const timeline = await tx.employee_timeline.findMany({
        where: { employee_id: employeeId, tenant_id: tenantId },
        orderBy: { event_date: 'asc' },
        take: 5,
        select: { id: true, event_type: true, event_date: true, payload: true, ai_summary: true },
      });
      const now = Date.now();
      const stages: CareerStage[] = timeline.map((t, idx) => {
        const ts = t.event_date.getTime();
        const isLast = idx === timeline.length - 1;
        const future = ts > now;
        const status: CareerStage['status'] = future ? 'future' : isLast ? 'current' : 'past';
        const payload = (t.payload ?? {}) as Record<string, unknown>;
        const label =
          (payload['title'] as string | undefined) ??
          (payload['role'] as string | undefined) ??
          t.ai_summary?.slice(0, 60) ??
          t.event_type;
        return { id: t.id, label, year: quarterLabel(t.event_date), status };
      });

      const reviews = await tx.performance_reviews.findMany({
        where: { employee_id: employeeId, tenant_id: tenantId },
        orderBy: { review_period_end: 'desc' },
        take: 4,
        select: {
          id: true,
          review_period_end: true,
          overall_rating: true,
          goal_achievement_rating: true,
          competency_rating: true,
          status: true,
        },
      });
      const reviewRows: ReviewRow[] = reviews.map((r) => {
        const goal = Number(r.goal_achievement_rating ?? 0);
        const comp = Number(r.competency_rating ?? 0);
        const overall = Number(r.overall_rating ?? Math.max(goal, comp));
        const outcome: ReviewRow['outcome'] =
          overall >= 4.5 ? 'exceeds' : overall >= 3.7 ? 'meets' : 'grow';
        return {
          cycle: r.review_period_end ? quarterLabel(r.review_period_end) : '—',
          goal,
          comp,
          overall,
          outcome,
        };
      });

      const candidacies = await tx.succession_candidates.findMany({
        where: { tenant_id: tenantId, candidate_employee_id: employeeId },
        orderBy: { rank_order: 'asc' },
        take: 3,
        select: { readiness_level: true, critical_role_id: true, development_needs: true },
      });
      const planIds = candidacies.map((c) => c.critical_role_id).filter((v): v is string => !!v);
      const plans = planIds.length
        ? await tx.succession_plans.findMany({
            where: { id: { in: planIds } },
            select: { id: true, position_name: true },
          })
        : [];
      const planById = new Map(plans.map((p) => [p.id, p.position_name]));
      const bridges: BridgeRole[] = candidacies.map((c) => {
        const gaps = c.development_needs
          ? c.development_needs
              .split(/[,;\n]/)
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 3)
          : [];
        return {
          role: c.critical_role_id
            ? (planById.get(c.critical_role_id) ?? 'Critical role')
            : 'Critical role',
          readiness: READINESS_MAP[c.readiness_level ?? 'development_needed'] ?? 50,
          gaps,
        };
      });

      // SAFE: employee_skill_assessments has no tenant_id; scoping is enforced
      // upstream by the employees.findFirst({ tenant_id }) gate + employee_id FK.
      const skillAssessments = await tx.employee_skill_assessments.findMany({
        where: { employee_id: employeeId },
        select: { skill_name: true, assessed_level: true, required_level: true },
      });
      const mapped = skillAssessments.length;
      const total = Math.max(mapped, 18);
      const avgScore = mapped
        ? Math.round(
            (skillAssessments.reduce((acc, s) => acc + Number(s.assessed_level ?? 0), 0) / mapped) *
              20
          )
        : 0;
      const readinessNext = bridges[0]?.readiness ?? 0;

      // ---- Capability radar (current vs target per OPOURSKA axis) ----
      const radar = computeRadar(skillAssessments);

      // ---- Skill trend (last 5 quarters × top 5 skills) ----
      const skillTrend = await fetchSkillTrend(tx, employeeId);

      return {
        profile: {
          id: emp.id,
          fullName,
          initials,
          jobTitle: emp.job_title,
          department: emp.department,
          tenureYears,
          tenureMonths,
          level: deriveLevel(emp.job_title),
        },
        stages,
        reviews: reviewRows,
        bridges,
        skillStats: { mapped, total, avgScore, readinessNext },
        skillTrend,
        radar,
      };
    });
  } catch {
    return empty;
  }
}

function computeRadar(
  assessments: Array<{
    skill_name: string;
    assessed_level: number;
    required_level: number | null;
  }>
): CapabilityRadarData | null {
  if (assessments.length === 0) return null;
  const currentBuckets = Array.from({ length: 5 }, () => ({ sum: 0, count: 0 }));
  const targetBuckets = Array.from({ length: 5 }, () => ({ sum: 0, count: 0 }));
  for (const a of assessments) {
    const axis = axisOf(a.skill_name ?? '');
    const assessed = Number(a.assessed_level ?? 0);
    const required = Number(a.required_level ?? assessed);
    if (assessed > 0) {
      currentBuckets[axis]!.sum += assessed * 20;
      currentBuckets[axis]!.count += 1;
    }
    if (required > 0) {
      targetBuckets[axis]!.sum += required * 20;
      targetBuckets[axis]!.count += 1;
    }
  }
  const current = currentBuckets.map((b) =>
    b.count > 0 ? Math.round(Math.min(100, b.sum / b.count)) : 0
  );
  const target = targetBuckets.map((b) =>
    b.count > 0 ? Math.round(Math.min(100, b.sum / b.count)) : 0
  );
  const hasAny = current.some((v) => v > 0) || target.some((v) => v > 0);
  if (!hasAny) return null;
  return {
    axes: RADAR_AXES,
    series: [
      { name: 'Current', values: current },
      { name: 'Target', values: target },
    ],
  };
}

/**
 * Aggregate employee_skill_history for the last 5 quarters, top 5 skills by
 * number of history records. employee_skill_history → employee_skill_profiles
 * → employee_id provides the scoping link.
 *
 * Returns null if no history records exist for this employee.
 */
type TrendRow = { skill_name: string; q_year: number; q_num: number; avg_score: number | null };

async function fetchSkillTrend(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: any,
  employeeId: string
): Promise<SkillTrendData | null> {
  // Get top 5 skills with history records for this employee
  const rows = (await tx.$queryRaw`
    WITH emp_profiles AS (
      SELECT esp.id, es.preferred_label AS skill_name
      FROM employee_skill_profiles esp
      JOIN esco_skills es ON es.id = esp.skill_id
      WHERE esp.employee_id = ${employeeId}::uuid
    ),
    top_skills AS (
      SELECT skill_name
      FROM emp_profiles ep
      JOIN employee_skill_history h ON h.profile_id = ep.id
      WHERE h.changed_at >= now() - interval '15 months'
      GROUP BY skill_name
      ORDER BY COUNT(*) DESC
      LIMIT 5
    )
    SELECT ts.skill_name,
           EXTRACT(YEAR FROM h.changed_at)::int AS q_year,
           CEIL(EXTRACT(MONTH FROM h.changed_at)::numeric / 3)::int AS q_num,
           AVG(h.new_composite_score)::float AS avg_score
    FROM emp_profiles ep
    JOIN employee_skill_history h ON h.profile_id = ep.id
    JOIN top_skills ts ON ts.skill_name = ep.skill_name
    WHERE h.changed_at >= now() - interval '15 months'
    GROUP BY ts.skill_name, q_year, q_num
    ORDER BY q_year, q_num
  `) as TrendRow[];
  if (rows.length === 0) return null;

  // Build last 5 quarters labels (oldest → newest)
  const nowDate = new Date();
  const quarters: { y: number; q: number; label: string }[] = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(nowDate.getFullYear(), nowDate.getMonth() - i * 3, 1);
    const y = d.getFullYear();
    const q = Math.ceil((d.getMonth() + 1) / 3);
    quarters.push({ y, q, label: `Q${q} ${String(y).slice(-2)}` });
  }

  const skillsSeen = Array.from(new Set(rows.map((r) => r.skill_name))).slice(0, 5);
  const series: SkillTrendSeries[] = skillsSeen.map((sk, idx) => {
    const values = quarters.map(({ y, q }) => {
      const row = rows.find((r) => r.skill_name === sk && r.q_year === y && r.q_num === q);
      const score = row?.avg_score ?? null;
      // composite_score scale assumed 0-5 → ×20 to %
      return score !== null ? Math.round(Math.min(100, Number(score) * 20)) : 0;
    });
    return {
      label: sk,
      color: TREND_COLORS[idx % TREND_COLORS.length]!,
      values,
    };
  });

  // Drop series entirely zero
  const nonEmpty = series.filter((s) => s.values.some((v) => v > 0));
  if (nonEmpty.length === 0) return null;

  return {
    quarters: quarters.map((q) => q.label),
    series: nonEmpty,
  };
}

export const fetchEmployeeJourneyData = unstable_cache(
  fetchEmployeeJourneyDataUncached,
  ['dashboard:employee-journey:v1'],
  { revalidate: 60, tags: ['dashboard:employee-journey'] }
);
