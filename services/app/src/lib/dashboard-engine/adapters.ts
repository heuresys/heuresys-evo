/**
 * Phase 14.A — Widget data adapters.
 *
 * Maps raw fetched data (from data-fetcher.ts, typically pgsql JSON rows) to
 * widget-specific props. Each adapter returns either an object spread onto the
 * component, or `null` when data is missing/invalid (caller should then render
 * the demo fallback).
 *
 * Add a new entry whenever a widget is migrated from Demo to Live.
 *
 * Convention for SQL data sources: queries should return a single row whose
 * columns match the widget's primary props. Example:
 *   SELECT (avg(score)::float) AS value, 'Capability' AS label, '%' AS unit
 *     FROM skill_scores WHERE tenant_id = current_tenant_id();
 */

export type WidgetAdapter = (raw: unknown) => Record<string, unknown> | null;

function firstRow(raw: unknown): Record<string, unknown> | null {
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'object' && raw[0] !== null) {
    return raw[0] as Record<string, unknown>;
  }
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  return null;
}

/**
 * KpiRing adapter — maps `{ value, label?, sublabel?, unit?, trend? }` row to props.
 * Required: value (number). Other fields optional with safe defaults.
 */
export const kpiRingAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;

  if (row.value === null || row.value === undefined) return null;
  const value = typeof row.value === 'number' ? row.value : Number(row.value);
  if (!Number.isFinite(value)) return null;

  const props: Record<string, unknown> = { value };
  if (typeof row.label === 'string') props.label = row.label;
  if (typeof row.sublabel === 'string') props.sublabel = row.sublabel;
  if (typeof row.unit === 'string') props.unit = row.unit;
  if (typeof row.trend === 'number') props.trend = row.trend;
  if (typeof row.max === 'number') props.max = row.max;
  if (typeof row.min === 'number') props.min = row.min;
  if (row.thresholds && typeof row.thresholds === 'object' && !Array.isArray(row.thresholds)) {
    props.thresholds = row.thresholds;
  }
  return props;
};

export const ADAPTER_REGISTRY: Record<string, WidgetAdapter> = {
  KpiRing: kpiRingAdapter,
  // Sprint 1 follow-ups (future entries):
  // SuccessionCard: successionCardAdapter,
  // CareerArc: careerArcAdapter,
  // KgMiniGraph: kgMiniGraphAdapter,
  // SkillHeatmap: skillHeatmapAdapter,
  // CapabilityRadar: capabilityRadarAdapter,
  // RbacMatrix: rbacMatrixAdapter,
  // IntegrationHealthPill: integrationHealthPillAdapter,
};

export function resolveAdapter(widget_code: string): WidgetAdapter | null {
  return ADAPTER_REGISTRY[widget_code] ?? null;
}
