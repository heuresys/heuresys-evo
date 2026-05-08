import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma } from '../../../../prisma/generated/client/index.js';
import { resolvePresetCodeForRole } from '@/lib/dashboard-engine/role-preset-resolver';
import { prefetchElements } from '@/lib/dashboard-engine/prefetch';
import { DashboardRenderer, type DashboardRendererSlot } from '@/components/DashboardRenderer';

import OrgSystemsView from './_views/OrgSystemsView';
import CrossTenantOverviewView from './_views/CrossTenantOverviewView';
import TenantOwnerOverviewView from './_views/TenantOwnerOverviewView';
import HrDirectorOverviewView from './_views/HrDirectorOverviewView';
import SkillsHeatmapView from './_views/SkillsHeatmapView';
import CapabilityGraphView from './_views/CapabilityGraphView';
import EmployeeJourneyView from './_views/EmployeeJourneyView';

/**
 * G6 adoption — element shape post-G4 (incluse parent_element_id + variant).
 * Fetched via $queryRaw finché `prisma generate` non è rieseguito (richiede
 * dev server fermo). Schema.prisma già aggiornato per S20+ regen.
 */
interface DashboardElementG4 {
  id: bigint;
  dashboard_preset_id: bigint;
  widget_code: string;
  position: number;
  grid_col_start: number;
  grid_col_span: number;
  grid_row_start: number;
  grid_row_span: number;
  perspective_code: string | null;
  visibility_min_role: number;
  config_overrides: unknown;
  tenant_id: string | null;
  parent_element_id: bigint | null;
  variant: string | null;
  widget_catalog_id: number | null;
}

async function loadG6Elements(
  presetCode: string,
  tenantId: string | null
): Promise<DashboardElementG4[] | null> {
  const tenantClause =
    tenantId !== null
      ? Prisma.sql`AND (de.tenant_id IS NULL OR de.tenant_id::text = ${tenantId})`
      : Prisma.sql`AND de.tenant_id IS NULL`;

  const rows = await prisma.$queryRaw<DashboardElementG4[]>`
    SELECT de.id, de.dashboard_preset_id, de.widget_code, de.position,
           de.grid_col_start, de.grid_col_span, de.grid_row_start, de.grid_row_span,
           de.perspective_code, de.visibility_min_role, de.config_overrides,
           de.tenant_id, de.parent_element_id, de.variant, de.widget_catalog_id
      FROM dashboard_elements de
      JOIN dashboard_presets dp ON dp.id = de.dashboard_preset_id
     WHERE dp.code = ${presetCode}
       ${tenantClause}
     ORDER BY de.position ASC
  `;
  return rows.length > 0 ? rows : null;
}

/**
 * Convert G4 element to DashboardRendererSlot (RSC-safe: BigInt → string).
 */
function toSlots(elements: DashboardElementG4[]): DashboardRendererSlot[] {
  return elements.map((el) => ({
    id: String(el.id),
    parent_element_id: el.parent_element_id !== null ? String(el.parent_element_id) : null,
    position: el.position,
    widget_code: el.widget_code,
    variant: el.variant,
    grid_col_start: el.grid_col_start,
    grid_col_span: el.grid_col_span,
  }));
}

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

  // G6 adoption — DB-driven hierarchical preset (`*_v2`) renders via DashboardRenderer.
  // Original 7 *View.tsx preserved as fallback for non-`_v2` codes (S21 deletion).
  if (presetCode.endsWith('_v2')) {
    const elements = await loadG6Elements(presetCode, tenantId);
    if (!elements || elements.length === 0) {
      return (
        <>
          <header className="ws-header">
            <div className="title-block">
              <div className="breadcrumb">DASHBOARD · {role}</div>
              <h1>
                Preset <em>{presetCode}</em> non popolato
              </h1>
            </div>
          </header>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', maxWidth: 600 }}>
            Il preset <code>{presetCode}</code> non ha elementi seedati. Verifica seed{' '}
            <code>db/seeds/phase15g6_full_preset_layouts.sql</code>.
          </p>
        </>
      );
    }

    const dataMap = await prefetchElements(
      elements.map((el) => ({
        id: el.id,
        position: el.position,
        widget_code: el.widget_code,
        widget_catalog_id: el.widget_catalog_id,
        grid_col_start: el.grid_col_start,
        grid_col_span: el.grid_col_span,
        grid_row_start: el.grid_row_start,
        grid_row_span: el.grid_row_span,
        perspective_code: el.perspective_code,
        visibility_min_role: el.visibility_min_role,
        config_overrides: el.config_overrides,
        tenant_id: el.tenant_id,
      })),
      { tenantId, role }
    );

    const slots = toSlots(elements);
    const data = Object.fromEntries(Object.entries(dataMap).map(([k, v]) => [k, v.data]));

    return (
      <>
        <header className="ws-header">
          <div className="title-block">
            <div className="breadcrumb">
              DASHBOARD · {role} · {presetCode}
            </div>
            <h1>
              Brand-fedele <em>dashboard</em> · DB-driven (G6)
            </h1>
          </div>
          <div className="actions">
            <div className="scope-pill">
              <span className="dot" />
              <span>
                scope · {tenantName.toLowerCase()} · {role.toLowerCase()}
              </span>
            </div>
          </div>
        </header>
        <DashboardRenderer elements={slots} data={data} />
      </>
    );
  }

  // Switch to the right brand-fedele view (non-`_v2` fallback path · S20+ deletion)
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
