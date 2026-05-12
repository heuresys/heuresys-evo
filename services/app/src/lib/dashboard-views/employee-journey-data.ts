import { withTenant } from '@/lib/db';

/**
 * Server-side fetcher for /dashboard employee_journey view (S41 W4-final).
 * Reads employee profile + career timeline + skill assessments + review history
 * + succession bridges (where the current employee is a candidate).
 *
 * Returns shape consumable by EmployeeJourneyView. View keeps fixture fallback
 * for sections that miss live data (preserves brand-fedele layout).
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
}

const READINESS_MAP: Record<string, number> = {
  ready_now: 92,
  ready_1_year: 78,
  ready_2_years: 62,
  ready_3_years: 48,
  ready_3_plus_years: 35,
  development_needed: 25,
};

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

export async function fetchEmployeeJourneyData(
  tenantId: string | null,
  employeeId: string | null
): Promise<EmployeeJourneyLiveData> {
  const empty: EmployeeJourneyLiveData = {
    profile: null,
    stages: [],
    reviews: [],
    bridges: [],
    skillStats: { mapped: 0, total: 0, avgScore: 0, readinessNext: 0 },
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
        select: { assessed_level: true, required_level: true },
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
      };
    });
  } catch {
    return empty;
  }
}
