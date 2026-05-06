// Phase 13.A — Atomic dashboard components
// 8 atomic components for data-driven dashboard composition.
// Source mockups: .ux-design/06-mockups/dashboards/{hr-director-overview,capability-graph,skills-heatmap,employee-journey,org-systems}.html

export { IntegrationHealthPill } from './integration-health-pill';
export type { IntegrationHealthPillProps, IntegrationHealthTone } from './integration-health-pill';

export { KpiRing } from './kpi-ring';
export type { KpiRingProps, KpiRingTone, KpiRingThresholds } from './kpi-ring';

export { SuccessionCard } from './succession-card';
export type { SuccessionCardProps, SuccessionRisk, SuccessionReadiness } from './succession-card';

export { CareerArc } from './career-arc';
export type { CareerArcProps, CareerStage, CareerStageStatus } from './career-arc';

export { KgMiniGraph } from './kg-mini-graph';
export type { KgMiniGraphProps, KgMiniGraphLegendItem } from './kg-mini-graph';

export { SkillHeatmap } from './skill-heatmap';
export type { SkillHeatmapProps, SkillHeatmapAxis, SkillHeatmapCell } from './skill-heatmap';

export { CapabilityRadar } from './capability-radar';
export type {
  CapabilityRadarProps,
  CapabilityRadarAxis,
  CapabilityRadarSeries,
} from './capability-radar';

export { RbacMatrix } from './rbac-matrix';
export type {
  RbacMatrixProps,
  RbacRole,
  RbacArea,
  RbacAssignment,
  RbacPermissionLevel,
} from './rbac-matrix';
