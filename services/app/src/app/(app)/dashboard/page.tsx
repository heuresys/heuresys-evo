import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolvePresetCodeForRole } from '@/lib/dashboard-engine/role-preset-resolver';
import {
  getCachedTenantName,
  getCachedPresetMeta,
} from '@/lib/dashboard-engine/dashboard-meta-cache';
import { prefetchElements } from '@/lib/dashboard-engine/prefetch';
import { DashboardRenderer, type DashboardRendererSlot } from '@/components/DashboardRenderer';
import { DEFAULT_LOCALE, pickBilingual } from '@/lib/i18n';

import OrgSystemsView from './_views/OrgSystemsView';
import CrossTenantOverviewView from './_views/CrossTenantOverviewView';
import TenantOwnerOverviewView from './_views/TenantOwnerOverviewView';
import HrDirectorOverviewView from './_views/HrDirectorOverviewView';
import SkillsHeatmapView from './_views/SkillsHeatmapView';
import CapabilityGraphView from './_views/CapabilityGraphView';
import EmployeeJourneyView from './_views/EmployeeJourneyView';

type DashboardElementG4 =
  Awaited<ReturnType<typeof loadG6Elements>> extends (infer T)[] | null ? T : never;

async function loadG6Elements(presetCode: string, tenantId: string | null) {
  const elements = await prisma.dashboard_elements.findMany({
    where: {
      dashboard_presets: { code: presetCode },
      OR:
        tenantId !== null ? [{ tenant_id: null }, { tenant_id: tenantId }] : [{ tenant_id: null }],
    },
    orderBy: { position: 'asc' },
  });
  return elements.length > 0 ? elements : null;
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

  // S48 G6 perf: parallelize the 2 independent cold-data lookups.
  // tenant name (cached 300s) + role → preset_code (cached 300s).
  const [tenantNameRaw, presetCode] = await Promise.all([
    tenantId ? getCachedTenantName(tenantId) : Promise.resolve(null),
    resolvePresetCodeForRole({ role, tenantId }),
  ]);
  const tenantName = tenantNameRaw ?? 'Heuresys System';

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
    // S48 G6 perf: parallelize elements load + cached preset metadata lookup.
    const [elements, presetMeta] = await Promise.all([
      loadG6Elements(presetCode, tenantId),
      getCachedPresetMeta(presetCode),
    ]);
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

    // Resolve preset name (localized) for header title — uses cached meta from
    // S48 G6 parallelized lookup above.
    const presetName = presetMeta ? pickBilingual(presetMeta, 'name', DEFAULT_LOCALE) : presetCode;
    // Multi-word accent support (S54 W#1 P6 visual audit): if presetName contains
    // `||`, split into [plain, accent] preserving multi-word accent phrases
    // ("Talent & capability||al colpo d'occhio" → "Talent & capability" / "al colpo d'occhio").
    // Fallback to legacy split-last-word for presets without delimiter.
    let titlePlain: string;
    let titleAccent: string;
    if (presetName.includes('||')) {
      const [plain, accent] = presetName.split('||');
      titlePlain = (plain ?? '').trim();
      titleAccent = (accent ?? '').trim();
    } else {
      const titleParts = presetName.trim().split(/\s+/);
      titleAccent = titleParts.length > 1 ? (titleParts.pop() ?? '') : '';
      titlePlain = titleParts.join(' ') || presetName;
    }
    const breadcrumb = presetMeta?.persona_label
      ? `DASHBOARD · ${presetMeta.perspective_code ?? role} · ${presetMeta.persona_label}`
      : `DASHBOARD · ${role} · ${presetCode}`;

    return (
      <>
        <header className="ws-header">
          <div className="title-block">
            <div className="breadcrumb">{breadcrumb}</div>
            <h1>
              {titlePlain}
              {titleAccent ? (
                <>
                  {' '}
                  <em>{titleAccent}</em>
                </>
              ) : null}
            </h1>
          </div>
          <div className="actions">
            <div className="scope-pill">
              <span className="dot" />
              <span>
                scope · {tenantName.toLowerCase()} · {role.toLowerCase()}
              </span>
            </div>
            {presetCode === 'hr_director_overview_v2' && (
              <>
                <a
                  className="btn btn-ghost"
                  href="#export-pdf"
                  aria-disabled="true"
                  title="Export PDF — coming soon"
                  style={{ opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'none' }}
                >
                  Export PDF
                </a>
                <a className="btn btn-primary" href="/reviews">
                  Apri review cycle →
                </a>
              </>
            )}
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
