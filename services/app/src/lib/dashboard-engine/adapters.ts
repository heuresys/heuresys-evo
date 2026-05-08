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
 * Convention for SQL data sources:
 *   - Simple props (KpiRing, IntegrationHealthPill, SuccessionCard): query
 *     returns a single row whose columns match the widget's primary props.
 *   - Composite props (CareerArc, KgMiniGraph, SkillHeatmap, CapabilityRadar,
 *     RbacMatrix): query returns a single row containing JSONB-aggregated
 *     fields (e.g. `jsonb_agg(...) AS stages`), or use `static` data_source
 *     with an inline JSON value.
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

function asArray(v: unknown): unknown[] | null {
  return Array.isArray(v) ? v : null;
}

function asString(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

function asNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asBoolean(v: unknown): boolean | null {
  return typeof v === 'boolean' ? v : null;
}

/**
 * KpiRing — `{ value, label?, sublabel?, unit?, trend?, max?, min?, thresholds? }`.
 * Required: value (number).
 */
export const kpiRingAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const value = asNumber(row.value);
  if (value === null) return null;

  const props: Record<string, unknown> = { value };
  const label = asString(row.label);
  if (label !== null) props.label = label;
  const sublabel = asString(row.sublabel);
  if (sublabel !== null) props.sublabel = sublabel;
  const unit = asString(row.unit);
  if (unit !== null) props.unit = unit;
  const trend = typeof row.trend === 'number' ? row.trend : null;
  if (trend !== null) props.trend = trend;
  const max = typeof row.max === 'number' ? row.max : null;
  if (max !== null) props.max = max;
  const min = typeof row.min === 'number' ? row.min : null;
  if (min !== null) props.min = min;
  if (row.thresholds && typeof row.thresholds === 'object' && !Array.isArray(row.thresholds)) {
    props.thresholds = row.thresholds;
  }
  return props;
};

/**
 * IntegrationHealthPill — `{ tone, label?, pulse?, showDot? }`.
 * Tone allowed: 'ok' | 'warn' | 'down' | 'info'. Defaults to 'ok' when missing.
 */
const HEALTH_TONES = new Set(['ok', 'warn', 'down', 'info']);

export const integrationHealthPillAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const toneCandidate = asString(row.tone);
  const tone = toneCandidate && HEALTH_TONES.has(toneCandidate) ? toneCandidate : 'ok';

  const props: Record<string, unknown> = { tone };
  const label = asString(row.label);
  if (label !== null) props.label = label;
  const pulse = asBoolean(row.pulse);
  if (pulse !== null) props.pulse = pulse;
  const showDot = asBoolean(row.show_dot ?? row.showDot);
  if (showDot !== null) props.showDot = showDot;
  return props;
};

/**
 * SuccessionCard — `{ candidateName, currentRole, targetRole, readinessPercent, ... }`.
 * Accepts both camelCase and snake_case column names (Postgres convention).
 */
const SUCCESSION_RISKS = new Set(['low', 'medium', 'high', 'critical']);
const SUCCESSION_READINESS = new Set(['ready-now', '1-2y', '3-5y', 'not-ready']);

export const successionCardAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const candidateName = asString(row.candidateName ?? row.candidate_name);
  const currentRole = asString(row.currentRole ?? row.current_role);
  const targetRole = asString(row.targetRole ?? row.target_role);
  const readinessPercent = asNumber(row.readinessPercent ?? row.readiness_percent);
  if (!candidateName || !currentRole || !targetRole || readinessPercent === null) return null;

  const props: Record<string, unknown> = {
    candidateName,
    currentRole,
    targetRole,
    readinessPercent,
  };
  const readiness = asString(row.readiness);
  if (readiness && SUCCESSION_READINESS.has(readiness)) props.readiness = readiness;
  const risk = asString(row.risk);
  if (risk && SUCCESSION_RISKS.has(risk)) props.risk = risk;
  const readyBy = asString(row.readyBy ?? row.ready_by);
  if (readyBy !== null) props.readyBy = readyBy;
  const candidateAvatarUrl = asString(row.candidateAvatarUrl ?? row.candidate_avatar_url);
  if (candidateAvatarUrl !== null) props.candidateAvatarUrl = candidateAvatarUrl;
  return props;
};

/**
 * CareerArc — `{ stages: [{id, label, year?, status?, description?}], currentIndex? }`.
 * Accepts: (a) `[{stages, currentIndex?}]` row, or (b) raw array = stages list.
 */
export const careerArcAdapter: WidgetAdapter = (raw) => {
  // Case (a): single row with composite "stages" field
  const row = firstRow(raw);
  if (row && Array.isArray(row.stages)) {
    const stages = row.stages.filter(
      (s): s is Record<string, unknown> => typeof s === 'object' && s !== null
    );
    if (stages.length === 0) return null;
    const props: Record<string, unknown> = { stages };
    const currentIndex = asNumber(row.currentIndex ?? row.current_index);
    if (currentIndex !== null) props.currentIndex = currentIndex;
    return props;
  }
  // Case (b): raw is itself an array of stage rows
  if (
    Array.isArray(raw) &&
    raw.length > 0 &&
    raw.every((r) => typeof r === 'object' && r !== null)
  ) {
    return { stages: raw };
  }
  return null;
};

/**
 * KgMiniGraph — `{ nodes, edges, legend?, layout?, height?, ariaLabel? }`.
 * Composite: typically populated via `jsonb_build_object('nodes', ..., 'edges', ...)`.
 */
export const kgMiniGraphAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const nodes = asArray(row.nodes);
  const edges = asArray(row.edges);
  if (!nodes || !edges) return null;
  const props: Record<string, unknown> = { nodes, edges };
  const legend = asArray(row.legend);
  if (legend !== null) props.legend = legend;
  const layout = asString(row.layout);
  if (layout !== null) props.layout = layout;
  const height = asNumber(row.height);
  if (height !== null) props.height = height;
  const ariaLabel = asString(row.ariaLabel ?? row.aria_label);
  if (ariaLabel !== null) props.ariaLabel = ariaLabel;
  return props;
};

/**
 * SkillHeatmap — `{ rows, cols, cells, caption?, showValue? }`.
 */
export const skillHeatmapAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const rows = asArray(row.rows);
  const cols = asArray(row.cols);
  const cells = asArray(row.cells);
  if (!rows || !cols || !cells) return null;
  const props: Record<string, unknown> = { rows, cols, cells };
  const caption = asString(row.caption);
  if (caption !== null) props.caption = caption;
  const showValue = asBoolean(row.showValue ?? row.show_value);
  if (showValue !== null) props.showValue = showValue;
  return props;
};

/**
 * CapabilityRadar — `{ axes, series, max?, size?, rings?, showLegend? }`.
 */
export const capabilityRadarAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const axes = asArray(row.axes);
  const series = asArray(row.series);
  if (!axes || !series || axes.length < 3) return null;
  const props: Record<string, unknown> = { axes, series };
  const max = asNumber(row.max);
  if (max !== null) props.max = max;
  const size = asNumber(row.size);
  if (size !== null) props.size = size;
  const rings = asNumber(row.rings);
  if (rings !== null) props.rings = rings;
  const showLegend = asBoolean(row.showLegend ?? row.show_legend);
  if (showLegend !== null) props.showLegend = showLegend;
  return props;
};

/**
 * RbacMatrix — `{ roles, areas, assignments, readonly? }`.
 */
export const rbacMatrixAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const roles = asArray(row.roles);
  const areas = asArray(row.areas);
  const assignments = asArray(row.assignments);
  if (!roles || !areas || !assignments) return null;
  const props: Record<string, unknown> = { roles, areas, assignments };
  const readonly = asBoolean(row.readonly);
  if (readonly !== null) props.readonly = readonly;
  return props;
};

/**
 * ActivityFeed — `{ items: ActivityFeedItem[], title?, live? }`.
 * Items expected as JSONB array of `{ id, when, what, who? }`.
 */
export const activityFeedAdapter: WidgetAdapter = (raw) => {
  const row = firstRow(raw);
  if (!row) return null;
  const items = asArray(row.items);
  if (!items) return null;
  const props: Record<string, unknown> = { items };
  const title = asString(row.title);
  if (title !== null) props.title = title;
  const live = asBoolean(row.live);
  if (live !== null) props.live = live;
  return props;
};

export const ADAPTER_REGISTRY: Record<string, WidgetAdapter> = {
  KpiRing: kpiRingAdapter,
  IntegrationHealthPill: integrationHealthPillAdapter,
  SuccessionCard: successionCardAdapter,
  CareerArc: careerArcAdapter,
  KgMiniGraph: kgMiniGraphAdapter,
  SkillHeatmap: skillHeatmapAdapter,
  CapabilityRadar: capabilityRadarAdapter,
  RbacMatrix: rbacMatrixAdapter,
  ActivityFeed: activityFeedAdapter,
};

export function resolveAdapter(widget_code: string): WidgetAdapter | null {
  return ADAPTER_REGISTRY[widget_code] ?? null;
}
