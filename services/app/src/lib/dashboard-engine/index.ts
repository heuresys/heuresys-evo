// Phase 13.C / 14.A — Dashboard engine public API (server-safe).
// `registry` and `grid` are 'use client' and must be imported directly from those files
// when needed in client contexts.

export {
  loadDashboardPreset,
  listPublishedPresets,
  type DashboardPresetWithElements,
  type LoadPresetOptions,
} from './loader';

export {
  resolveElements,
  userRoleLevel,
  ROLE_LEVEL,
  DEFAULT_USER_LEVEL,
  type ResolverContext,
  type DashboardElementShape,
} from './resolver';

// Phase 14.A — server-side data layer
export {
  fetchWidgetData,
  type DataSourceConfig,
  type DataSourceType,
  type FetchContext,
  type FetchResult,
} from './data-fetcher';

export { prefetchElements, type PrefetchMap, type PrefetchedElement } from './prefetch';

export { resolveAdapter, ADAPTER_REGISTRY, type WidgetAdapter } from './adapters';
