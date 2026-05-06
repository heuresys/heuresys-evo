'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { resolveAdapter } from './adapters';

/**
 * Phase 13.C / 14.A — Widget registry.
 * Maps `widget_code` (from dashboard_elements) to React component lazy-imported
 * via next/dynamic for code-splitting per route.
 *
 * Phase 14.A V2 contract: every entry receives `{data?: unknown}` prop.
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
    className="flex h-full min-h-[120px] w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-xs text-muted-fg"
  >
    Loading widget…
  </div>
);

function lazyWidget(loader: () => Promise<{ default: WidgetComponent }>) {
  return dynamic<{ data?: unknown }>(loader, { loading: Loading, ssr: false });
}

/**
 * Build a Live+Demo-fallback wrapper for a widget code.
 * `widgetCode` selects the adapter from ADAPTER_REGISTRY.
 * `demoProps` is the static fixture used when data is null/invalid.
 * `render(props)` is the JSX projection — typically `<m.Component {...props}/>`.
 */
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
  import('@heuresys/ui').then((m: any) => ({
    default: liveWrapper(
      'KpiRing',
      {
        value: 72,
        label: 'Capability',
        sublabel: 'company-wide · Q4',
        unit: '%',
        thresholds: { goodAt: 80, warnAt: 60 },
        trend: 4.2,
      },
      (props) => <m.KpiRing {...props} />
    ),
  }))
);

const IntegrationHealthPillWidget: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
    default: liveWrapper(
      'IntegrationHealthPill',
      { tone: 'ok' as const, pulse: false, label: undefined as string | undefined },
      (props) => (
        <div className="flex flex-wrap items-center gap-2">
          <m.IntegrationHealthPill {...props} />
        </div>
      )
    ),
  }))
);

const SuccessionCardWidget: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
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
      (props) => <m.SuccessionCard {...props} />
    ),
  }))
);

const CareerArcWidget: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
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
      (props) => <m.CareerArc {...props} />
    ),
  }))
);

const KgMiniGraphWidget: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
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
      (props) => <m.KgMiniGraph {...props} />
    ),
  }))
);

const SkillHeatmapWidget: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => {
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
        (props) => <m.SkillHeatmap {...props} />
      ),
    };
  })
);

const CapabilityRadarWidget: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
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
      (props) => <m.CapabilityRadar {...props} />
    ),
  }))
);

const RbacMatrixWidget: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => {
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
        <m.RbacMatrix {...props} />
      )),
    };
  })
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
};

export function resolveWidget(widget_code: string): WidgetComponent | null {
  return WIDGET_REGISTRY[widget_code] ?? null;
}
