'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { resolveAdapter } from './adapters';

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
        value: 72,
        label: 'CAPABILITY',
        sublabel: 'company-wide · Q4',
        unit: '%',
        trend: 4.2,
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
        candidateName: 'Stefania Bianchi',
        currentRole: 'Head Credit Risk',
        targetRole: 'Director Risk & Analytics',
        readinessPercent: 88,
        readiness: 'ready-now' as const,
        risk: 'low' as const,
        readyBy: '2026 Q3',
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
        currentIndex: 2,
        stages: [
          { id: '1', label: 'Junior', year: '2018' },
          { id: '2', label: 'Analyst', year: '2020' },
          { id: '3', label: 'Senior', year: '2023' },
          { id: '4', label: 'Lead', year: '2026 →' },
          { id: '5', label: 'Head', year: '2029+' },
        ],
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
        nodes: [
          { id: 'finance', label: 'Finance', group: 'domain' },
          { id: 'risk', label: 'Risk', group: 'domain' },
          { id: 'sql', label: 'SQL', group: 'tech' },
          { id: 'leadership', label: 'Leadership', group: 'soft' },
        ],
        edges: [
          { id: 'e1', source: 'finance', target: 'risk' },
          { id: 'e2', source: 'risk', target: 'sql' },
          { id: 'e3', source: 'finance', target: 'leadership' },
        ],
        legend: [
          { group: 'domain', label: 'Domain', color: '#3b82f6' },
          { group: 'tech', label: 'Tech', color: '#a855f7' },
          { group: 'soft', label: 'Soft', color: '#5fb87a' },
        ],
      },
      (props) => <m.BrandKgGraph {...props} />
    ),
  }))
);

const SkillHeatmapWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => {
    const rows = [
      { id: 'fin', label: 'Finance' },
      { id: 'risk', label: 'Risk' },
      { id: 'eng', label: 'Engineering' },
      { id: 'hr', label: 'HR' },
    ];
    const cols = [
      { id: 'sql', label: 'SQL' },
      { id: 'py', label: 'Python' },
      { id: 'lead', label: 'Lead' },
      { id: 'comm', label: 'Comms' },
    ];
    const cells = rows.flatMap((r, ri) =>
      cols.map((c, ci) => ({
        rowId: r.id,
        colId: c.id,
        value: Math.floor(((Math.sin(ri * 13 + ci * 7) + 1) / 2) * 100),
      }))
    );
    return {
      default: liveWrapper(
        'SkillHeatmap',
        { rows, cols, cells, caption: 'Skill coverage' },
        (props) => <m.BrandSkillHeatmap {...props} />
      ),
    };
  })
);

const CapabilityRadarWidget: WidgetComponent = lazyWidget(() =>
  import('@/components/widgets/brand').then((m: any) => ({
    default: liveWrapper(
      'CapabilityRadar',
      {
        axes: [
          { id: 'tech', label: 'Tech' },
          { id: 'fin', label: 'Finance' },
          { id: 'lead', label: 'Lead' },
          { id: 'comm', label: 'Comms' },
          { id: 'risk', label: 'Risk' },
        ],
        series: [
          { id: 'cur', label: 'Current', values: [82, 70, 35, 60, 75] },
          { id: 'tgt', label: 'Target', values: [75, 80, 70, 80, 85] },
        ],
      },
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
        title: 'Activity feed',
        live: true,
        items: [
          { id: '1', when: '2 min ago', what: 'New review cycle started', who: 'HR Director' },
          { id: '2', when: '12 min ago', what: 'Skill assessment imported', who: 'system' },
          { id: '3', when: '34 min ago', what: 'Goal cascade published', who: 'Maria Rossi' },
          { id: '4', when: '1 h ago', what: 'Onboarding kickoff', who: 'Luca Bianchi' },
        ],
      },
      (props) => <m.BrandActivityFeed {...props} />
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
};

export function resolveWidget(widget_code: string): WidgetComponent | null {
  return WIDGET_REGISTRY[widget_code] ?? null;
}
