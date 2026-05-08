/**
 * Heuresys brand widget variants — μ-architect-legacy mockup-fedele.
 * Used by the dashboard registry to swap @heuresys/ui Phase 13.A widgets
 * with brand-faithful implementations sharing CSS classes from
 * dashboard-brand.css (.kpi-card, .matrix-wrap, .skill-gap, .activity,
 * .succession-card, .career-arc, .capability-radar, .kg-graph, .heatmap-wrap,
 * .widget-head, etc.).
 */
export { BrandKpiCard, type BrandKpiCardProps } from './BrandKpiCard';
export {
  BrandIntegrationHealth,
  type BrandIntegrationHealthProps,
  type IntegrationTone,
} from './BrandIntegrationHealth';
export {
  BrandSuccessionCard,
  type BrandSuccessionCardProps,
  type SuccessionRisk,
  type SuccessionReadiness,
} from './BrandSuccessionCard';
export {
  BrandRbacMatrix,
  type BrandRbacMatrixProps,
  type RbacRole,
  type RbacArea,
  type RbacAssignment,
  type RbacPermissionLevel,
} from './BrandRbacMatrix';
export {
  BrandSkillHeatmap,
  type BrandSkillHeatmapProps,
  type HeatmapAxis,
  type HeatmapCell,
} from './BrandSkillHeatmap';
export {
  BrandActivityFeed,
  type BrandActivityFeedProps,
  type ActivityFeedItem,
} from './BrandActivityFeed';
export {
  BrandKgGraph,
  type BrandKgGraphProps,
  type KgNode,
  type KgEdge,
  type KgLegendItem,
} from './BrandKgGraph';
export { BrandCareerArc, type BrandCareerArcProps, type CareerStage } from './BrandCareerArc';
export {
  BrandCapabilityRadar,
  type BrandCapabilityRadarProps,
  type RadarAxis,
  type RadarSeries,
} from './BrandCapabilityRadar';
export { BrandGaugeCard, type BrandGaugeCardProps, type GaugeTone } from './BrandGaugeCard';
export {
  BrandHistogram,
  type BrandHistogramProps,
  type HistogramItem,
  type HistogramTone,
} from './BrandHistogram';
export { BrandCompCard, type BrandCompCardProps, type CompItem } from './BrandCompCard';
export { BrandBridgeCard, type BrandBridgeCardProps, type BridgeItem } from './BrandBridgeCard';
export {
  BrandProfileHero,
  type BrandProfileHeroProps,
  type ProfileBadge,
  type ProfileBadgeKind,
  type ProfileStat,
} from './BrandProfileHero';
export {
  BrandDoubleSplit,
  BrandMainSplit,
  BrandKpiRing,
  BrandPanel,
  LAYOUT_CONTAINERS,
  type LayoutContainerProps,
  type LayoutContainerCode,
} from './BrandLayoutContainers';
