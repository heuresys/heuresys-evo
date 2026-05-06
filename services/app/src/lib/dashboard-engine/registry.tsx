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
 *   - Live entries (e.g. KpiRing) apply the adapter to `data` and render real
 *     props on the underlying component; fall back to demo fixture when data
 *     is null or adapter returns null.
 *   - Demo entries (Sprint 1 follow-ups) ignore `data` and render hardcoded
 *     fixtures (backward compat — gradual migration).
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

function lazyWidget(
  loader: () => Promise<{ default: WidgetComponent } | { [k: string]: WidgetComponent }>,
  exportName?: string
) {
  return dynamic<{ data?: unknown }>(
    async () => {
      const mod = await loader();
      const cmp = exportName
        ? ((mod as Record<string, WidgetComponent>)[exportName] as WidgetComponent)
        : ((mod as { default: WidgetComponent }).default ??
          Object.values(mod as Record<string, WidgetComponent>)[0]);
      return { default: cmp };
    },
    { loading: Loading, ssr: false }
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Phase 14.A — KpiRing is the first Live widget. Adapter maps fetched data to
// component props; falls back to a demo fixture when data is null/invalid.
const KPI_RING_DEMO_PROPS = {
  value: 72,
  label: 'Capability',
  sublabel: 'company-wide · Q4',
  unit: '%',
  thresholds: { goodAt: 80, warnAt: 60 },
  trend: 4.2,
};

const KpiRingDemo: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
    default: ({ data }: { data?: unknown }) => {
      const adapter = resolveAdapter('KpiRing');
      const live = adapter && data != null ? adapter(data) : null;
      const props = live ?? KPI_RING_DEMO_PROPS;
      return <m.KpiRing {...props} />;
    },
  }))
);

const IntegrationHealthPillDemo: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
    default: () => (
      <div className="flex flex-wrap items-center gap-2">
        <m.IntegrationHealthPill tone="ok" />
        <m.IntegrationHealthPill tone="warn" pulse />
        <m.IntegrationHealthPill tone="info" label="SYNC" />
      </div>
    ),
  }))
);

const SuccessionCardDemo: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
    default: () => (
      <m.SuccessionCard
        candidateName="Stefania Bianchi"
        currentRole="Head Credit Risk"
        targetRole="Director Risk & Analytics"
        readinessPercent={88}
        readiness="ready-now"
        risk="low"
        readyBy="2026 Q3"
      />
    ),
  }))
);

const CareerArcDemo: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
    default: () => (
      <m.CareerArc
        currentIndex={2}
        stages={[
          { id: '1', label: 'Junior', year: '2018' },
          { id: '2', label: 'Analyst', year: '2020' },
          { id: '3', label: 'Senior', year: '2023' },
          { id: '4', label: 'Lead', year: '2026 →' },
          { id: '5', label: 'Head', year: '2029+' },
        ]}
      />
    ),
  }))
);

const KgMiniGraphDemo: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
    default: () => (
      <m.KgMiniGraph
        nodes={[
          { id: 'finance', label: 'Finance', group: 'domain' },
          { id: 'risk', label: 'Risk', group: 'domain' },
          { id: 'sql', label: 'SQL', group: 'tech' },
          { id: 'leadership', label: 'Leadership', group: 'soft' },
        ]}
        edges={[
          { id: 'e1', source: 'finance', target: 'risk' },
          { id: 'e2', source: 'risk', target: 'sql' },
          { id: 'e3', source: 'finance', target: 'leadership' },
        ]}
        legend={[
          { group: 'domain', label: 'Domain', color: '#3b82f6' },
          { group: 'tech', label: 'Tech', color: '#a855f7' },
          { group: 'soft', label: 'Soft', color: '#5fb87a' },
        ]}
      />
    ),
  }))
);

const SkillHeatmapDemo: WidgetComponent = lazyWidget(() =>
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
      default: () => (
        <m.SkillHeatmap rows={rows} cols={cols} cells={cells} caption="Skill coverage" />
      ),
    };
  })
);

const CapabilityRadarDemo: WidgetComponent = lazyWidget(() =>
  import('@heuresys/ui').then((m: any) => ({
    default: () => (
      <m.CapabilityRadar
        axes={[
          { id: 'tech', label: 'Tech' },
          { id: 'fin', label: 'Finance' },
          { id: 'lead', label: 'Lead' },
          { id: 'comm', label: 'Comms' },
          { id: 'risk', label: 'Risk' },
        ]}
        series={[
          { id: 'cur', label: 'Current', values: [82, 70, 35, 60, 75] },
          { id: 'tgt', label: 'Target', values: [75, 80, 70, 80, 85] },
        ]}
      />
    ),
  }))
);

const RbacMatrixDemo: WidgetComponent = lazyWidget(() =>
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
    const assignments = roles.flatMap((r) =>
      areas.map((a) => ({
        roleId: r.id,
        areaId: a.id,
        level:
          r.id === 'su'
            ? 'owner'
            : r.id === 'to'
              ? 'admin'
              : r.id === 'hrd' && a.id === 'employees'
                ? 'admin'
                : r.id === 'emp' && a.id === 'employees'
                  ? 'read'
                  : 'none',
      }))
    ) as { roleId: string; areaId: string; level: 'none' | 'read' | 'write' | 'admin' | 'owner' }[];
    return {
      default: () => (
        <m.RbacMatrix roles={roles} areas={areas} assignments={assignments} readonly />
      ),
    };
  })
);
/* eslint-enable @typescript-eslint/no-explicit-any */

export const WIDGET_REGISTRY: Record<string, WidgetComponent> = {
  KpiRing: KpiRingDemo, // Live (Phase 14.A) — uses adapter, demo fallback
  IntegrationHealthPill: IntegrationHealthPillDemo, // Demo (TBD: Sprint 1.A.4)
  SuccessionCard: SuccessionCardDemo, // Demo (TBD: Sprint 1.A.4)
  CareerArc: CareerArcDemo, // Demo (TBD: Sprint 1.A.4)
  KgMiniGraph: KgMiniGraphDemo, // Demo (TBD: Sprint 1.A.4)
  SkillHeatmap: SkillHeatmapDemo, // Demo (TBD: Sprint 1.A.4)
  CapabilityRadar: CapabilityRadarDemo, // Demo (TBD: Sprint 1.A.4)
  RbacMatrix: RbacMatrixDemo, // Demo (TBD: Sprint 1.A.4)
};

export function resolveWidget(widget_code: string): WidgetComponent | null {
  return WIDGET_REGISTRY[widget_code] ?? null;
}
