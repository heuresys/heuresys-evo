/**
 * Phase 14.A — Dashboard data-fetcher (server-only).
 *
 * Resolves widget data per dashboard_element by dispatching on
 * `data_source_type` (sql | static | api | graph). Result is consumed by
 * widget-adapter.ts to produce widget-specific props.
 *
 * Cache: process-local LRU keyed by element + tenant. TTL from
 * widget_catalog.cache_ttl_seconds (or override in element config). Production
 * may upgrade to Redis later — interface stays the same.
 *
 * RLS: SQL queries run inside `withTenant(...)` transaction. SELECT/WITH only.
 *
 * V1 dispatch coverage: `static` + `sql`. `api` and `graph` reserved for
 * Sprint 2 (F · /ontology + OpenAI advisor) and Sprint 3 (G · KG explorer).
 */

import { withTenant } from '@/lib/db';

export type DataSourceType = 'sql' | 'static' | 'api' | 'graph';

export interface DataSourceConfig {
  type: DataSourceType;
  /** SQL query string for `type === 'sql'`. Allowed: SELECT, WITH (CTE). */
  query?: string;
  /** Inline static value for `type === 'static'`. */
  value?: unknown;
  /** Internal API endpoint path for `type === 'api'`. Must match /^\/api\/[a-z0-9\-\/]+$/i. */
  endpoint?: string;
  /** Per-config TTL override in seconds. Falls back to widget_catalog.cache_ttl_seconds. */
  ttl?: number;
}

export interface FetchContext {
  tenantId: string | null;
  userId?: string | null;
  role?: string | null;
  /** S40 Item3 — Current user's employee_id (resolved server-side from session.user). */
  employeeId?: string | null;
}

export interface FetchResult {
  data: unknown | null;
  error?: string;
  source: DataSourceType | null;
  cached: boolean;
  fetchedAt: number;
}

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const MAX_CACHE_ENTRIES = 500;

function cacheKey(elementId: string | number | bigint, tenantId: string | null): string {
  return `${tenantId ?? 'platform'}::${String(elementId)}`;
}

function evictIfFull(): void {
  if (cache.size < MAX_CACHE_ENTRIES) return;
  const firstKey = cache.keys().next().value;
  if (firstKey !== undefined) cache.delete(firstKey);
}

export interface FetchArgs {
  elementId: string | number | bigint;
  config: DataSourceConfig | null | undefined;
  /** widget_catalog.cache_ttl_seconds (catalog-level default). */
  ttlSeconds?: number;
  ctx: FetchContext;
}

export async function fetchWidgetData(args: FetchArgs): Promise<FetchResult> {
  const { elementId, config, ttlSeconds, ctx } = args;
  const now = Date.now();

  if (!config || !config.type) {
    return { data: null, source: null, cached: false, fetchedAt: now };
  }

  const ttlMs = (config.ttl ?? ttlSeconds ?? 0) * 1000;
  const key = cacheKey(elementId, ctx.tenantId);

  if (ttlMs > 0) {
    const hit = cache.get(key);
    if (hit && hit.expiresAt > now) {
      return { data: hit.data, source: config.type, cached: true, fetchedAt: now };
    }
  }

  let data: unknown = null;
  let error: string | undefined;

  try {
    switch (config.type) {
      case 'static':
        data = config.value ?? null;
        break;
      case 'sql':
        data = await fetchSql(config, ctx);
        break;
      case 'api':
        data = await fetchApi(config, ctx);
        break;
      case 'graph':
        error = `data_source_type "graph" not yet implemented (Sprint 3)`;
        break;
      default: {
        const exhaustive: never = config.type;
        error = `Unknown data_source_type: ${String(exhaustive)}`;
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  if (error) {
    return { data: null, error, source: config.type, cached: false, fetchedAt: now };
  }

  if (ttlMs > 0) {
    evictIfFull();
    cache.set(key, { data, expiresAt: now + ttlMs });
  }

  return { data, source: config.type, cached: false, fetchedAt: now };
}

async function fetchSql(config: DataSourceConfig, ctx: FetchContext): Promise<unknown> {
  if (!config.query || !config.query.trim()) {
    throw new Error('sql data source requires non-empty "query" field');
  }

  const trimmed = config.query.trim();
  if (!/^(SELECT|WITH)\s/i.test(trimmed)) {
    throw new Error('sql data source allows SELECT/WITH only (no mutations)');
  }

  return withTenant(ctx.tenantId, async (tx) => {
    return tx.$queryRawUnsafe(trimmed);
  });
}

const ALLOWED_ENDPOINT_RE = /^\/api\/[a-z][a-z0-9\-\/]*$/i;

async function fetchApi(config: DataSourceConfig, ctx: FetchContext): Promise<unknown> {
  if (!config.endpoint) {
    throw new Error('api data source requires "endpoint" path');
  }

  // S40 Item3 — Template substitution {employeeId} → ctx.employeeId BEFORE validation.
  // Bail if endpoint requires {employeeId} but ctx.employeeId not set (e.g. platform users).
  let resolvedEndpoint = config.endpoint;
  if (config.endpoint.includes('{employeeId}')) {
    if (!ctx.employeeId) {
      throw new Error('api endpoint requires {employeeId} but FetchContext.employeeId is unset');
    }
    resolvedEndpoint = config.endpoint.replace(
      /\{employeeId\}/g,
      encodeURIComponent(ctx.employeeId)
    );
  }

  // Validate resolved endpoint (no curly braces, safe path)
  const pathOnly = resolvedEndpoint.split('?')[0] ?? '';
  if (!ALLOWED_ENDPOINT_RE.test(pathOnly)) {
    throw new Error(
      'api endpoint must match /^\\/api\\/[a-z0-9\\-\\/]+$/i after template substitution'
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3200';
  const sep = resolvedEndpoint.includes('?') ? '&' : '?';
  const url = ctx.tenantId
    ? `${baseUrl}${resolvedEndpoint}${sep}tenant=${encodeURIComponent(ctx.tenantId)}`
    : `${baseUrl}${resolvedEndpoint}`;

  // Forward session cookie (server-side fetch needs explicit auth context)
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const ac = new AbortController();
  const timeoutId = setTimeout(() => ac.abort(), 5000);
  try {
    const res = await fetch(url, {
      signal: ac.signal,
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`api fetch ${res.status} ${res.statusText} (${config.endpoint})`);
    }
    const json = (await res.json()) as { data?: unknown };
    // Unwrap { data: ... } convention; fallback to whole response
    return json && typeof json === 'object' && 'data' in json ? json.data : json;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Internal — exported only for tests. */
export const __testing = {
  cache,
  clearCache: (): void => {
    cache.clear();
  },
  cacheSize: (): number => cache.size,
};
