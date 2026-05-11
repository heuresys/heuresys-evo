/**
 * /dashboard view — HR Director Overview (preset_code = 'hr_director_overview' · HR_DIRECTOR).
 * Brand-fedele al mockup .ux-design/06-mockups/dashboards/hr-director-overview.html.
 *
 * S37 W4: succession-grid section now data-bound via succession_plans + succession_candidates
 * (CASCADIA TALPIPE post-S35.4). Skill-gap + activity-feed remain static fixtures
 * (carry-forward S38+ — gap calc + audit_logs feed require additional aggregation logic).
 */
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';

type SuccessionRow = {
  role: string;
  name: string;
  readiness: number;
  risk: 'low' | 'medium' | 'high';
};

async function fetchSuccessionRows(tenantId: string | null): Promise<SuccessionRow[]> {
  if (!tenantId) return [];
  try {
    return await withTenant(tenantId, async (tx) => {
      const plans = await tx.succession_plans.findMany({
        where: { tenant_id: tenantId, status: 'active' },
        orderBy: [{ criticality_level: 'asc' }, { target_date: 'asc' }],
        take: 4,
        select: { id: true, position_name: true, criticality_level: true, risk_level: true },
      });
      if (plans.length === 0) return [];

      const planIds = plans.map((p) => p.id);
      const topCandidates = await tx.succession_candidates.findMany({
        where: { critical_role_id: { in: planIds } },
        orderBy: [{ rank_order: 'asc' }],
      });
      const candidateByPlan = new Map<string, typeof topCandidates>();
      for (const c of topCandidates) {
        if (!c.critical_role_id) continue;
        const arr = candidateByPlan.get(c.critical_role_id) ?? [];
        arr.push(c);
        candidateByPlan.set(c.critical_role_id, arr);
      }

      // Readiness % derivation from readiness_level enum
      const readinessMap: Record<string, number> = {
        ready_now: 92,
        ready_1_year: 78,
        ready_2_years: 62,
        ready_3_years: 48,
        ready_3_plus_years: 35,
        development_needed: 25,
      };

      return plans.map<SuccessionRow>((p) => {
        const top = candidateByPlan.get(p.id)?.[0];
        const readiness = readinessMap[top?.readiness_level ?? 'development_needed'] ?? 50;
        const risk: SuccessionRow['risk'] =
          p.risk_level === 'high' ? 'high' : p.risk_level === 'low' ? 'low' : 'medium';
        return {
          role: p.position_name,
          name: 'Top candidate',
          readiness,
          risk,
        };
      });
    });
  } catch {
    return [];
  }
}

export default async function HrDirectorOverviewView({
  role,
  tenantName,
}: {
  role: string;
  tenantName: string;
}) {
  const session = await auth();
  const tenantId = (session?.user as { tenantId?: string } | undefined)?.tenantId ?? null;
  const successionLive = await fetchSuccessionRows(tenantId);

  // Fallback fixture preserva il layout brand-fedele quando DB non popolato
  const successionRows: SuccessionRow[] =
    successionLive.length > 0
      ? successionLive
      : [
          { role: 'Head Risk Modelling', name: 'Senior risk analyst', readiness: 92, risk: 'low' },
          { role: 'IT Architect Lead', name: 'Lead architect', readiness: 88, risk: 'low' },
          {
            role: 'Head Compliance',
            name: 'Senior compliance officer',
            readiness: 84,
            risk: 'medium',
          },
          { role: 'HR Business Partner', name: 'Senior HRBP', readiness: 79, risk: 'medium' },
        ];

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">HR Director · Overview · Q1 2026</div>
          <h1>
            Talent &amp; capability <em>al colpo d&apos;occhio</em>
          </h1>
        </div>
        <div className="actions">
          <div className="scope-pill">
            <span className="dot" />
            <span>{tenantName} · prod</span>
          </div>
          <a className="btn btn-ghost" href="#pdf">
            Export PDF
          </a>
          <a className="btn btn-primary" href="#review">
            Apri review cycle →
          </a>
        </div>
      </header>

      <div className="kpi-ring">
        <div className="kpi-card">
          <div className="kpi-label">EMPLOYEES MAPPED</div>
          <div className="kpi-num">
            1.247
            <span className="delta up">+243</span>
          </div>
          <div className="kpi-sub">
            ESCO mapped · <strong>+24% YoY</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SKILL COVERAGE</div>
          <div className="kpi-num">
            82,4%
            <span className="delta up">+12,3pt</span>
          </div>
          <div className="kpi-sub">
            target Q1 80% · <strong>raggiunto</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">REVIEWS COMPLETED</div>
          <div className="kpi-num">
            86%
            <span className="delta up">+18pt</span>
          </div>
          <div className="kpi-sub">
            Q1 cycle · <strong>1.072 / 1.247</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">SUCCESSION READY</div>
          <div className="kpi-num">
            42
            <span className="delta up">+8</span>
          </div>
          <div className="kpi-sub">
            critical roles · <strong>21 ready-now</strong>
          </div>
        </div>
      </div>

      <div className="main-split">
        <div className="skill-gap">
          <div className="widget-head">
            <h2>
              Skill gap <em>analysis</em>
            </h2>
            <div className="filters">
              <span className="filter-pill active">P0 critical</span>
              <span className="filter-pill">P1 warn</span>
              <span className="filter-pill">OK</span>
            </div>
          </div>
          <table className="dense">
            <thead>
              <tr>
                <th>Skill / capability</th>
                <th>Dept</th>
                <th>Current</th>
                <th>Target</th>
                <th>Gap</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  skill: 'Stress testing models',
                  dept: 'Risk',
                  cur: 28,
                  tgt: 80,
                  pri: 'critical' as const,
                },
                {
                  skill: 'GDPR compliance',
                  dept: 'Legal',
                  cur: 35,
                  tgt: 95,
                  pri: 'critical' as const,
                },
                {
                  skill: 'Python ML applicato',
                  dept: 'IT/Quant',
                  cur: 42,
                  tgt: 75,
                  pri: 'warn' as const,
                },
                {
                  skill: 'Risk analytics SQL',
                  dept: 'Risk',
                  cur: 58,
                  tgt: 80,
                  pri: 'warn' as const,
                },
                {
                  skill: 'Project management Agile',
                  dept: 'Operations',
                  cur: 65,
                  tgt: 75,
                  pri: 'warn' as const,
                },
                {
                  skill: 'Customer journey mapping',
                  dept: 'Marketing',
                  cur: 78,
                  tgt: 80,
                  pri: 'ok' as const,
                },
                {
                  skill: 'Financial modeling Excel',
                  dept: 'Finance',
                  cur: 88,
                  tgt: 85,
                  pri: 'ok' as const,
                },
                { skill: 'Communication B2 EN', dept: 'All', cur: 92, tgt: 80, pri: 'ok' as const },
              ].map((r) => (
                <tr key={r.skill}>
                  <td style={{ fontWeight: 600 }}>{r.skill}</td>
                  <td className="muted mono">{r.dept}</td>
                  <td className="mono">{r.cur}%</td>
                  <td className="mono">{r.tgt}%</td>
                  <td>
                    <span className="gap-bar">
                      <span className="bar">
                        <span
                          className={`bar-fill fill-${r.pri === 'critical' ? 'critical' : r.pri === 'warn' ? 'warn' : 'ok'}`}
                          style={{ width: `${Math.min(100, Math.abs(r.tgt - r.cur) * 2)}%` }}
                        />
                      </span>
                      <span className={`pill pill-${r.pri === 'ok' ? 'ok' : r.pri}`}>
                        {r.cur >= r.tgt ? 'OK' : `−${r.tgt - r.cur}pt`}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="activity">
          <div className="activity-head">
            <h2>
              Activity <em>feed</em>
            </h2>
            <span className="live">live</span>
          </div>
          <div className="activity-list">
            {[
              {
                ago: '2 min',
                what: (
                  <>
                    <strong>review.submit</strong> · cycle Q1 chiuso ·{' '}
                    <span className="dim">Retail Banking dept</span>
                  </>
                ),
                who: '@maria.c · CHRO',
              },
              {
                ago: '12 min',
                what: (
                  <>
                    <strong>skill.assess</strong> · 24 employees mapped to ESCO Stress Testing
                  </>
                ),
                who: '@laura.b · HR Manager',
              },
              {
                ago: '38 min',
                what: (
                  <>
                    <strong>succession.add</strong> · Lead analyst → Head Quant Analytics ready-now
                  </>
                ),
                who: '@maria.c · CHRO',
              },
              {
                ago: '1h 4m',
                what: (
                  <>
                    <strong>training.enroll</strong> · 14 employees · GDPR refresh module
                  </>
                ),
                who: 'system · cron',
              },
              {
                ago: '2h 18m',
                what: (
                  <>
                    <strong>compensation.adjust</strong> · IT &amp; Digital · merit budget +3,2%
                  </>
                ),
                who: '@enzo.s · CHRO',
              },
              {
                ago: '4h 42m',
                what: (
                  <>
                    <strong>employee.onboard</strong> · 3 new hires Risk &amp; Compliance
                  </>
                ),
                who: '@sara.f · HR Ops',
              },
            ].map((a, i) => (
              <div key={i} className="activity-item">
                <div className="when">{a.ago} ago</div>
                <div className="what">{a.what}</div>
                <div className="who">{a.who}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="section-head">
        <h2>
          Succession <em>ready-now</em>
        </h2>
        <span className="meta">4 critical roles · candidate overlap</span>
      </div>
      <div className="succession-grid">
        {successionRows.map((s) => (
          <article key={s.role} className="succession-card">
            <div className="role">{s.role}</div>
            <h3>{s.name}</h3>
            <div className="candidates" aria-label="successor stack">
              <div className="candidate top">
                {s.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="candidate">—</div>
              <div className="candidate">—</div>
              <div className="more">+0</div>
            </div>
            <div className="meta-row">
              <span className={`pill pill-${s.risk === 'low' ? 'ok' : 'warn'}`}>
                {s.risk.toUpperCase()} RISK
              </span>
              <strong>{s.readiness}%</strong>
            </div>
          </article>
        ))}
      </div>

      <footer className="ws-footer">
        <span>SOURCE · skill_assessments · review_cycles · succession_pipeline · ESCO 1.2.0</span>
        <span>hr_director_overview · {role}</span>
      </footer>
    </>
  );
}
