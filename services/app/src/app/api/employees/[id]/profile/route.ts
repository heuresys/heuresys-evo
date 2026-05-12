/**
 * S41 W4-final — GET /api/employees/{id}/profile
 *
 * Returns ProfileHero-shaped payload for a given employee, scoped to tenant via
 * withTenant. Used by ProfileHero widget binding (phase18o).
 *
 * RBP gate: DASHBOARD READ. RLS enforced. Employee scoping: only employees in
 * the caller's tenant are accessible (P1 multi-tenant).
 *
 * Response shape (consumed by profileHeroAdapter):
 *   {
 *     data: {
 *       name, sub, initials,
 *       badges: [{ kind, label }],
 *       stats: [{ id, label, value, unit? }]
 *     }
 *   }
 */

import { NextResponse } from 'next/server';
import { withTenant } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

const READINESS_TO_VALUE: Record<string, number> = {
  ready_now: 92,
  ready_1_year: 78,
  ready_2_years: 62,
  ready_3_years: 48,
  ready_3_plus_years: 35,
  development_needed: 25,
};

function deriveLevel(jobTitle: string | null): number {
  if (!jobTitle) return 6;
  const lower = jobTitle.toLowerCase();
  if (lower.includes('director') || lower.includes('chief')) return 2;
  if (lower.includes('head') || lower.includes('manager')) return 3;
  if (lower.includes('senior') || lower.includes('lead')) return 5;
  if (lower.includes('junior') || lower.includes('intern')) return 7;
  return 6;
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requirePermissionApi('DASHBOARD', 'READ');
  if (!guard.ok) return guard.response;

  const tenant = guard.user.tenantId;
  if (!tenant) return NextResponse.json({ error: 'missing_tenant' }, { status: 400 });

  const { id } = await ctx.params;
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'invalid_employee_id' }, { status: 400 });
  }

  const result = await withTenant(tenant, async (tx) => {
    const emp = await tx.employees.findFirst({
      where: { id, tenant_id: tenant, is_active: true },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        job_title: true,
        department: true,
        hire_date: true,
      },
    });
    if (!emp) return null;

    const [skillCount, lastReview, topCandidacy] = await Promise.all([
      tx.employee_skill_assessments.count({ where: { employee_id: id } }),
      tx.performance_reviews.findFirst({
        where: { employee_id: id, tenant_id: tenant },
        orderBy: { review_period_end: 'desc' },
        select: { overall_rating: true, competency_rating: true, goal_achievement_rating: true },
      }),
      tx.succession_candidates.findFirst({
        where: { tenant_id: tenant, candidate_employee_id: id },
        orderBy: { rank_order: 'asc' },
        select: { readiness_level: true },
      }),
    ]);

    return { emp, skillCount, lastReview, topCandidacy };
  });

  if (!result) {
    return NextResponse.json({ error: 'employee_not_found' }, { status: 404 });
  }

  const { emp, skillCount, lastReview, topCandidacy } = result;
  const fullName = `${emp.first_name} ${emp.last_name}`.trim();
  const initials = `${emp.first_name[0] ?? ''}${emp.last_name[0] ?? ''}`.toUpperCase();
  const level = deriveLevel(emp.job_title);

  let tenureYears = 0;
  let tenureMonths = 0;
  if (emp.hire_date) {
    const totalMonths = Math.floor(
      (Date.now() - emp.hire_date.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    );
    tenureYears = Math.floor(totalMonths / 12);
    tenureMonths = totalMonths % 12;
  }

  const reviewScore = Number(
    lastReview?.overall_rating ??
      lastReview?.competency_rating ??
      lastReview?.goal_achievement_rating ??
      0
  );
  const readinessNext = topCandidacy?.readiness_level
    ? (READINESS_TO_VALUE[topCandidacy.readiness_level] ?? 0)
    : 0;

  const sub = [`e/${emp.id.slice(0, 4)}`, emp.job_title ?? null, emp.department ?? null]
    .filter(Boolean)
    .join(' · ');

  const badges: Array<{ kind: 'role' | 'dept' | 'tenure'; label: string }> = [
    { kind: 'role', label: `Level ${level}` },
  ];
  if (emp.department) badges.push({ kind: 'dept', label: emp.department });
  if (emp.hire_date) {
    badges.push({ kind: 'tenure', label: `${tenureYears}y ${tenureMonths}m tenure` });
  }

  const stats = [
    { id: 'skill', label: 'SKILL MAPPED', value: `${skillCount}/${Math.max(skillCount, 18)}` },
    {
      id: 'review',
      label: 'REVIEW SCORE',
      value: reviewScore > 0 ? `${reviewScore.toFixed(1).replace('.', ',')}` : '—',
      unit: reviewScore > 0 ? '/5' : undefined,
    },
    { id: 'readiness', label: 'READINESS NEXT', value: readinessNext, unit: '%' },
  ];

  return NextResponse.json({
    data: {
      name: fullName,
      sub,
      initials,
      badges,
      stats,
    },
  });
}
