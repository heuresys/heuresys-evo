// Phase 13.C — Dashboard engine public API (server-safe).
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
