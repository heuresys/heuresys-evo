'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';
import { resolveAdapter } from './adapters';
import { LAYOUT_CONTAINERS } from '@/components/widgets/brand/BrandLayoutContainers';

/**
 * Phase 15.A — Widget registry (brand-fedele variants).
 *
 * Maps `widget_code` (from dashboard_elements) to brand React component
 * lazy-imported via next/dynamic for code-splitting per route.
 *
 * Brand variants live in services/app/src/components/widgets/brand/ and
 * use the canonical CSS classes from dashboard-brand.css (.kpi-card,
 * .matrix-wrap, .skill-gap, .activity, .succession-card, .career-arc,
 * .capability-radar, .kg-graph, .heatmap-wrap, .widget-head). The original
 * Phase 13.A widgets in @heuresys/ui are preserved for non-dashboard use cases.
 *
 * Each wrapper applies the matching adapter; when `data` is null or the
 * adapter rejects the shape, the wrapper falls back to a hardcoded demo
 * fixture so dashboards remain renderable while data sources are progressively
 * seeded.
 */

type WidgetComponent = ComponentType<{ data?: unknown }>;

const Loading = () => (
  <div
    role="status"
    aria-label="Widget loading"
    style={{
      minHeight: 120,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      border: '1px dashed var(--rule)',
      background: 'var(--surface-2)',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      letterSpacing: 1,
      color: 'var(--ink-muted)',
      textTransform: 'uppercase',
    }}
  >
    Loading widget…
  </div>
);

function lazyWidget(loader: () => Promise<{ default: WidgetComponent }>) {
  return dynamic<{ data?: unknown }>(loader, { loading: Loading, ssr: false });
}

function liveWrapper<P extends object>(
  widgetCode: string,
  demoProps: P,
  render: (props: P) => React.ReactNode
) {
  return ({ data }: { data?: unknown }) => {
    const adapter = resolveAdapter(widgetCode);
    const live = adapter && data != null ? adapter(data) : null;
    const props = (live ?? demoProps) as P;
    return <>{render(props)}</>;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

const KpiRingWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'KpiRing',
      {
        // Empty-state placeholder — actual data via useWidgetData
        value: 0,
        label: 'KPI',
        sublabel: 'no data yet',
        unit: '',
        trend: 0,
      },
      (props) => <m.BrandKpiCard {...props} />
    ),
  }))
);

const IntegrationHealthPillWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'IntegrationHealthPill',
      { tone: 'ok' as const, pulse: false },
      (props) => <m.BrandIntegrationHealth {...props} />
    ),
  }))
);

const SuccessionCardWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'SuccessionCard',
      {
        // Generic placeholder — actual data via useWidgetData from succession_candidates+plans
        candidateName: '—',
        currentRole: 'Current role',
        targetRole: 'Target role',
        readinessPercent: 0,
        readiness: 'development_needed' as const,
        risk: 'medium' as const,
        readyBy: '—',
      },
      (props) => <m.BrandSuccessionCard {...props} />
    ),
  }))
);

const CareerArcWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'CareerArc',
      {
        // Empty-state placeholder — actual data via useWidgetData from career_paths
        currentIndex: 0,
        stages: [{ id: '0', label: '—', year: '—' }],
      },
      (props) => <m.BrandCareerArc {...props} />
    ),
  }))
);

const KgMiniGraphWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'KgMiniGraph',
      {
        // Empty-state placeholder — actual data via useWidgetData from kg_nodes/kg_edges
        nodes: [],
        edges: [],
        legend: [],
      },
      (props) => <m.BrandKgGraph {...props} />
    ),
  }))
);

const SkillHeatmapWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'SkillHeatmap',
      // Empty-state placeholder — actual data via useWidgetData from employee_skill_assessments
      { rows: [], cols: [], cells: [], caption: 'no data yet' },
      (props) => <m.BrandSkillHeatmap {...props} />
    ),
  }))
);

const CapabilityRadarWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'CapabilityRadar',
      // Empty-state placeholder — actual data via useWidgetData from skill_gap_analyses
      { axes: [], series: [] },
      (props) => <m.BrandCapabilityRadar {...props} />
    ),
  }))
);

const RbacMatrixWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => {
    const roles = [
      { id: 'su', label: 'SUPERUSER', level: -1 },
      { id: 'to', label: 'TENANT_OWNER', level: 0 },
      { id: 'hrd', label: 'HR_DIRECTOR', level: 2 },
      { id: 'emp', label: 'EMPLOYEE', level: 6 },
    ];
    const areas = [
      { id: 'employees', label: 'Employees' },
      { id: 'audit', label: 'Audit' },
      { id: 'rbp', label: 'RBP' },
    ];
    type Lvl = 'none' | 'read' | 'write' | 'admin' | 'owner';
    const assignments: { roleId: string; areaId: string; level: Lvl }[] = roles.flatMap((r) =>
      areas.map((a) => ({
        roleId: r.id,
        areaId: a.id,
        level: (r.id === 'su'
          ? 'owner'
          : r.id === 'to'
            ? 'admin'
            : r.id === 'hrd' && a.id === 'employees'
              ? 'admin'
              : r.id === 'emp' && a.id === 'employees'
                ? 'read'
                : 'none') as Lvl,
      }))
    );
    return {
      default: liveWrapper('RbacMatrix', { roles, areas, assignments, readonly: true }, (props) => (
        <m.BrandRbacMatrix {...props} />
      )),
    };
  })
);
const ActivityFeedWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'ActivityFeed',
      {
        // Empty-state placeholder — actual data via useWidgetData from audit_logs
        title: 'Activity feed',
        live: false,
        items: [],
      },
      (props) => <m.BrandActivityFeed {...props} />
    ),
  }))
);

const GaugeCardWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'GaugeCard',
      // Empty-state placeholder — actual data via useWidgetData
      { label: 'METRIC', value: 0, unit: '', tone: 'neutral' as const },
      (props) => <m.BrandGaugeCard {...props} />
    ),
  }))
);

const HistogramWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'Histogram',
      // Empty-state placeholder — actual data via useWidgetData from performance_reviews/assessments
      { items: [] },
      (props) => <m.BrandHistogram {...props} />
    ),
  }))
);

const CompCardWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'CompCard',
      {
        // Empty-state placeholder — actual data via useWidgetData from salary_history/bonus_plans
        items: [
          { id: 'salary', label: 'BASE SALARY', value: 0, unit: '€' },
          { id: 'bonus', label: 'BONUS', value: 0, unit: '€' },
          { id: 'total', label: 'TOTAL TC', value: 0, unit: '€' },
        ],
      },
      (props) => <m.BrandCompCard {...props} />
    ),
  }))
);

const BridgeCardWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'BridgeCard',
      // Empty-state placeholder — actual data via useWidgetData from succession_candidates+plans
      { items: [] },
      (props) => <m.BrandBridgeCard {...props} />
    ),
  }))
);

const ProfileHeroWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'ProfileHero',
      {
        // Generic placeholder — actual data via useWidgetData from employees + assessments
        name: '—',
        sub: 'Role · Department · tenure',
        badges: [
          { kind: 'role' as const, label: 'Role' },
          { kind: 'dept' as const, label: 'Department' },
          { kind: 'tenure' as const, label: '—' },
        ],
        stats: [
          { id: 'cap', label: 'CAPABILITY', value: 0, unit: '%' },
          { id: 'goals', label: 'GOALS Q4', value: 0, unit: '/5' },
          { id: 'next', label: 'NEXT REVIEW', value: '—' },
        ],
      },
      (props) => <m.BrandProfileHero {...props} />
    ),
  }))
);

const TenantCardWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'TenantCard',
      {
        // Generic placeholder — actual data via useWidgetData from tenants + employees count
        name: 'Tenant',
        tid: '— · 0 employees',
        kind: 'tenant' as const,
        rows: [
          { label: 'INDUSTRY', value: '—' },
          { label: 'PLAN', value: '—' },
          { label: 'STATUS', value: '—', success: false },
        ],
        health: { label: 'pending data', strong: '—', tone: 'info' as const },
      },
      (props) => <m.BrandTenantCard {...props} />
    ),
  }))
);

const MetricCardWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'MetricCard',
      // Empty-state placeholder — actual data via useWidgetData
      { label: 'METRIC', value: 0, unit: '', sparkline: [] },
      (props) => <m.BrandMetricCard {...props} />
    ),
  }))
);

const SectionHeadWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'SectionHead',
      // Empty-state placeholder — actual data via useWidgetData
      { title: '—', meta: '' },
      (props) => <m.BrandSectionHead {...props} />
    ),
  }))
);

const IntRowWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'IntRow',
      // Empty-state placeholder — actual data via useWidgetData from integrations table
      { name: '—', meta: 'no data yet', tone: 'neutral' as const, status: '—' },
      (props) => <m.BrandIntRow {...props} />
    ),
  }))
);

const AuditRowWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'AuditRow',
      // Empty-state placeholder — actual data via useWidgetData from audit_logs
      { ts: '—', what: '—', actor: '—' },
      (props) => <m.BrandAuditRow {...props} />
    ),
  }))
);
/* eslint-enable @typescript-eslint/no-explicit-any */

export const WIDGET_REGISTRY: Record<string, WidgetComponent> = {
  KpiRing: KpiRingWidget,
  IntegrationHealthPill: IntegrationHealthPillWidget,
  SuccessionCard: SuccessionCardWidget,
  CareerArc: CareerArcWidget,
  KgMiniGraph: KgMiniGraphWidget,
  SkillHeatmap: SkillHeatmapWidget,
  CapabilityRadar: CapabilityRadarWidget,
  RbacMatrix: RbacMatrixWidget,
  ActivityFeed: ActivityFeedWidget,
  GaugeCard: GaugeCardWidget,
  Histogram: HistogramWidget,
  CompCard: CompCardWidget,
  BridgeCard: BridgeCardWidget,
  ProfileHero: ProfileHeroWidget,
  TenantCard: TenantCardWidget,
  MetricCard: MetricCardWidget,
  SectionHead: SectionHeadWidget,
  IntRow: IntRowWidget,
  AuditRow: AuditRowWidget,
};

export function resolveWidget(widget_code: string): WidgetComponent | null {
  return WIDGET_REGISTRY[widget_code] ?? null;
}

/* ============================================================
 * G5-phase-2 — Layout container registry
 * ============================================================
 * Mappa widget_code → Container component che accetta { data?, children }.
 * Distinguibile da WIDGET_REGISTRY per signature: il renderer prima cerca qui,
 * se trova rende ricorsivamente i figli (parent_element_id) come children.
 */

export type LayoutContainerComponent = (props: {
  data?: unknown;
  children: ReactNode;
}) => ReactNode;

export const LAYOUT_REGISTRY: Record<string, LayoutContainerComponent> = LAYOUT_CONTAINERS;

export function resolveLayout(widget_code: string): LayoutContainerComponent | null {
  return LAYOUT_REGISTRY[widget_code] ?? null;
}
