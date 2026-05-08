import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolvePresetCodeForRole } from '@/lib/dashboard-engine/role-preset-resolver';

import OrgSystemsView from './_views/OrgSystemsView';
import CrossTenantOverviewView from './_views/CrossTenantOverviewView';
import TenantOwnerOverviewView from './_views/TenantOwnerOverviewView';
import HrDirectorOverviewView from './_views/HrDirectorOverviewView';
import SkillsHeatmapView from './_views/SkillsHeatmapView';
import CapabilityGraphView from './_views/CapabilityGraphView';
import EmployeeJourneyView from './_views/EmployeeJourneyView';

/**
 * /dashboard — canonical role-driven dashboard route (Phase 15.A).
 *
 *   1. Auth + redirect to login if no session
 *   2. resolvePresetCodeForRole(role, tenantId) → preset_code
 *      via role_default_dashboards table (P9 data-driven · P10 multi-tenant)
 *   3. Switch to brand-fedele view per preset_code (mockup-faithful inline)
 *
 * Each view renders the canonical mockup design from
 * .ux-design/06-mockups/dashboards/{preset}.html with live data where
 * available + demo data where DB tables not yet populated.
 *
 * For explicit override (admin preview · super-user simulation), use
 * /dashboard/[code] (generic engine renderer).
 */
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?next=/dashboard');
  }

  const user = session.user as {
    role?: string;
    tenantId?: string;
    username?: string;
    name?: string | null;
    email?: string | null;
  };
  const role = user.role ?? 'EMPLOYEE';
  const tenantId = user.tenantId ?? null;
  const username = user.name ?? user.username ?? user.email ?? 'user';

  // Tenant name for views that need branded breadcrumb
  let tenantName = 'Heuresys System';
  if (tenantId) {
    const t = await prisma.tenants.findUnique({
      where: { id: tenantId },
      select: { name: true },
    });
    if (t?.name) tenantName = t.name;
  }

  // Resolve preset_code for the logged-in role (data-driven via DB)
  const presetCode = await resolvePresetCodeForRole({ role, tenantId });

  if (!presetCode) {
    return (
      <>
        <header className="ws-header">
          <div className="title-block">
            <div className="breadcrumb">DASHBOARD · {role}</div>
            <h1>
              Nessuna dashboard <em>configurata</em>
            </h1>
          </div>
        </header>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 600 }}>
          Il ruolo <strong>{role}</strong> non ha una dashboard di default mappata in{' '}
          <code>role_default_dashboards</code>. Contatta l&apos;amministratore di piattaforma.
        </p>
      </>
    );
  }

  // Switch to the right brand-fedele view
  switch (presetCode) {
    case 'org_systems':
      return <OrgSystemsView role={role} />;
    case 'cross_tenant_overview':
      return <CrossTenantOverviewView role={role} />;
    case 'tenant_owner_overview':
      return <TenantOwnerOverviewView role={role} tenantName={tenantName} />;
    case 'hr_director_overview':
      return <HrDirectorOverviewView role={role} tenantName={tenantName} />;
    case 'skills_heatmap':
      return <SkillsHeatmapView role={role} tenantName={tenantName} />;
    case 'capability_graph':
      return <CapabilityGraphView role={role} tenantName={tenantName} />;
    case 'employee_journey':
      return <EmployeeJourneyView role={role} username={username} tenantName={tenantName} />;
    default:
      return (
        <>
          <header className="ws-header">
            <div className="title-block">
              <div className="breadcrumb">DASHBOARD · {role}</div>
              <h1>
                Preset <em>{presetCode}</em> non ancora migrato
              </h1>
            </div>
          </header>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 600 }}>
            Il preset <code>{presetCode}</code> non ha una view brand-fedele dedicata. Visita{' '}
            <code>/dashboard/{presetCode}</code> per il rendering generico via Dashboard Engine.
          </p>
        </>
      );
  }
}
