/**
 * Phase 14.A — Server-side data prefetch for resolved dashboard elements.
 *
 * Runs `fetchWidgetData` in parallel for every element whose config_overrides
 * contains a `data_source` block. Returns a map of `elementId → fetched data`
 * suitable for passing to the client-side DashboardGrid via RSC payload.
 *
 * Errors are captured per-element (does not abort the whole dashboard).
 */

import { fetchWidgetData, type DataSourceConfig, type FetchContext } from './data-fetcher';
import type { DashboardElementShape } from './resolver';

export interface PrefetchedElement {
  data: unknown | null;
  error?: string;
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

export async function prefetchElements(
  elements: ElementWithOverrides[],
  ctx: FetchContext
): Promise<PrefetchMap> {
  const tasks = elements.map(async (el): Promise<[string, PrefetchedElement]> => {
    const id = String(el.id);
    const config = extractDataSource(el.config_overrides);
    if (!config) return [id, { data: null }];

    const result = await fetchWidgetData({
      elementId: id,
      config,
      ctx,
    });
    return [id, { data: result.data, error: result.error }];
  });

  const entries = await Promise.all(tasks);
  return Object.fromEntries(entries);
}
