/**
 * Phase 14.A — Server-side data prefetch for resolved dashboard elements.
 *
 * Runs `fetchWidgetData` in parallel for every element whose config_overrides
 * contains a `data_source` block. Returns a map of `elementId → fetched data`
 * suitable for passing to the client-side DashboardGrid via RSC payload.
 *
 * Errors are captured per-element (does not abort the whole dashboard).
 *
 * S47 perf: per-widget timing instrumentation. Activate via env PERF_LOG=1
 * to log slowest widget + total elapsed (server-side console.info). Non-breaking
 * shape: optional `_perfTrace` field on PrefetchedElement for client-side debug.
 */

import { fetchWidgetData, type DataSourceConfig, type FetchContext } from './data-fetcher';
import type { DashboardElementShape } from './resolver';

export interface PrefetchedElement {
  data: unknown | null;
  error?: string;
  /** S47: per-element fetch duration in ms (only when PERF_LOG=1). */
  _perfMs?: number;
}

export type PrefetchMap = Record<string, PrefetchedElement>;

interface ElementWithOverrides extends DashboardElementShape {
  config_overrides: unknown;
}

/**
 * Extracts `data_source` from element.config_overrides JSONB.
 * Returns null when missing or malformed (element renders demo fallback).
 */
function extractDataSource(overrides: unknown): DataSourceConfig | null {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) return null;
  const ds = (overrides as Record<string, unknown>).data_source;
  if (!ds || typeof ds !== 'object' || Array.isArray(ds)) return null;
  const type = (ds as Record<string, unknown>).type;
  if (typeof type !== 'string') return null;
  return ds as DataSourceConfig;
}

const PERF_LOG_ENABLED = process.env.PERF_LOG === '1';

function elapsedMs(start: bigint): number {
  return Number((process.hrtime.bigint() - start) / 1000000n);
}

export async function prefetchElements(
  elements: ElementWithOverrides[],
  ctx: FetchContext
): Promise<PrefetchMap> {
  const traceEnabled = PERF_LOG_ENABLED;
  const overallStart = traceEnabled ? process.hrtime.bigint() : 0n;

  const tasks = elements.map(async (el): Promise<[string, PrefetchedElement]> => {
    const id = String(el.id);
    const config = extractDataSource(el.config_overrides);
    if (!config) return [id, { data: null }];

    const widgetStart = traceEnabled ? process.hrtime.bigint() : 0n;
    const result = await fetchWidgetData({
      elementId: id,
      config,
      ctx,
    });
    const widgetMs = traceEnabled ? elapsedMs(widgetStart) : undefined;

    const entry: PrefetchedElement = { data: result.data, error: result.error };
    if (widgetMs !== undefined) entry._perfMs = widgetMs;
    return [id, entry];
  });

  const entries = await Promise.all(tasks);

  if (traceEnabled) {
    const total = elapsedMs(overallStart);
    let slowest = { id: '', ms: 0 };
    for (const [id, entry] of entries) {
      if ((entry._perfMs ?? 0) > slowest.ms) slowest = { id, ms: entry._perfMs ?? 0 };
    }
    // eslint-disable-next-line no-console
    console.info(
      `[perf:prefetch] elements=${entries.length} total=${total}ms slowest=${slowest.id}(${slowest.ms}ms) tenant=${ctx.tenantId?.slice(0, 8) ?? '-'}`
    );
  }

  return Object.fromEntries(entries);
}
