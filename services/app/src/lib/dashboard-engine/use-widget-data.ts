/**
 * Phase 14.A.6 — Client-side widget data hook (SWR-style, zero deps).
 *
 * Stale-while-revalidate over /api/dashboard/data/[elementId]. The hook is
 * intentionally minimal — no library dependency, no global subscription bus —
 * because Phase 14.A widget refresh is not a hot path. It covers the cases
 * the dashboard engine actually needs:
 *   - First mount: fire request, render `data:null` while pending.
 *   - Cache hit within TTL: return cached value synchronously.
 *   - Manual `mutate()`: bust cache, refetch.
 *   - Optional revalidate on window focus.
 *
 * The server route (14.A.5) already enforces auth + RBP; this hook only
 * relays the elementId. Fetch errors surface via `error` string + data:null.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface CacheEntry {
  data: unknown | null;
  error: string | null;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

export interface UseWidgetDataResult {
  data: unknown | null;
  error: string | null;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
}

export interface UseWidgetDataOptions {
  /** TTL in seconds for client-side cache. Defaults to 60. Pass 0 to disable cache. */
  ttlSeconds?: number;
  /** Refetch when window regains focus. Defaults to false. */
  revalidateOnFocus?: boolean;
  /** Override fetch URL prefix (test/SSR friendly). Defaults to /api/dashboard/data. */
  endpointPrefix?: string;
}

interface ApiResponse {
  elementId: string;
  data: unknown | null;
  error?: string;
  source: string | null;
  cached: boolean;
  fetchedAt: number;
}

async function doFetch(elementId: string, prefix: string): Promise<CacheEntry> {
  const key = elementId;
  const existingFlight = inflight.get(key);
  if (existingFlight) return existingFlight;

  const flight = (async (): Promise<CacheEntry> => {
    try {
      const res = await fetch(`${prefix}/${encodeURIComponent(elementId)}`, {
        credentials: 'same-origin',
      });
      if (!res.ok) {
        return {
          data: null,
          error: `HTTP ${res.status}`,
          expiresAt: 0,
        };
      }
      const json = (await res.json()) as ApiResponse;
      return {
        data: json.data,
        error: json.error ?? null,
        expiresAt: 0, // caller fills in based on ttlSeconds
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : String(err),
        expiresAt: 0,
      };
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, flight);
  return flight;
}

export function useWidgetData(
  elementId: string | number | bigint | null | undefined,
  options: UseWidgetDataOptions = {}
): UseWidgetDataResult {
  const {
    ttlSeconds = 60,
    revalidateOnFocus = false,
    endpointPrefix = '/api/dashboard/data',
  } = options;
  const idStr = elementId != null ? String(elementId) : null;

  // Initial state primed from cache (sync).
  const initial: CacheEntry | null = idStr ? (cache.get(idStr) ?? null) : null;
  const initialFresh = initial && initial.expiresAt > Date.now();

  const [state, setState] = useState<{
    data: unknown | null;
    error: string | null;
    isLoading: boolean;
    isValidating: boolean;
  }>({
    data: initial?.data ?? null,
    error: initial?.error ?? null,
    isLoading: !initialFresh && idStr != null,
    isValidating: false,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const revalidate = useCallback(
    async (force = false): Promise<void> => {
      if (!idStr) return;
      const cached = cache.get(idStr);
      const now = Date.now();
      if (!force && cached && cached.expiresAt > now) {
        // Cache hit — surface synchronously, skip network.
        setState({
          data: cached.data,
          error: cached.error,
          isLoading: false,
          isValidating: false,
        });
        return;
      }
      setState((s) => ({ ...s, isValidating: true }));
      const entry = await doFetch(idStr, endpointPrefix);
      const ttlMs = ttlSeconds * 1000;
      const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : 0;
      cache.set(idStr, { ...entry, expiresAt });
      if (mountedRef.current) {
        setState({
          data: entry.data,
          error: entry.error,
          isLoading: false,
          isValidating: false,
        });
      }
    },
    [idStr, ttlSeconds, endpointPrefix]
  );

  useEffect(() => {
    void revalidate(false);
  }, [revalidate]);

  useEffect(() => {
    if (!revalidateOnFocus || typeof window === 'undefined') return;
    const onFocus = () => void revalidate(false);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [revalidateOnFocus, revalidate]);

  const mutate = useCallback(async (): Promise<void> => {
    if (idStr) cache.delete(idStr);
    await revalidate(true);
  }, [idStr, revalidate]);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isValidating: state.isValidating,
    mutate,
  };
}

/** Internal — exported only for tests. */
export const __testing = {
  cache,
  inflight,
  clearCache: (): void => {
    cache.clear();
    inflight.clear();
  },
};
