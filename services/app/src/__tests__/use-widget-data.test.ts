/**
 * Phase 14.A.6 — Tests for useWidgetData hook.
 *
 * Uses jsdom (vitest config) + React Testing Library renderHook.
 * Mocks global fetch.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

import { useWidgetData, __testing } from '@/lib/dashboard-engine/use-widget-data';

const mockFetch = vi.fn();

beforeEach(() => {
  __testing.clearCache();
  mockFetch.mockReset();
  globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('useWidgetData — basics', () => {
  it('fires fetch on mount and surfaces data', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        elementId: '1',
        data: [{ value: 99 }],
        source: 'sql',
        cached: false,
        fetchedAt: 123,
      })
    );

    const { result } = renderHook(() => useWidgetData('1'));
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([{ value: 99 }]);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/dashboard/data/1',
      expect.objectContaining({
        credentials: 'same-origin',
      })
    );
  });

  it('returns null+isLoading=false when elementId is null', async () => {
    const { result } = renderHook(() => useWidgetData(null));
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('exposes server-reported error string', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        elementId: '2',
        data: null,
        error: 'sql data source allows SELECT/WITH only',
        source: 'sql',
        cached: false,
        fetchedAt: 456,
      })
    );
    const { result } = renderHook(() => useWidgetData('2'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toContain('SELECT/WITH only');
    expect(result.current.data).toBeNull();
  });

  it('surfaces HTTP error code on non-2xx response', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'not found' }, 404));
    const { result } = renderHook(() => useWidgetData('999'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toContain('HTTP 404');
  });

  it('captures network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network down'));
    const { result } = renderHook(() => useWidgetData('1'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toContain('network down');
  });
});

describe('useWidgetData — caching', () => {
  it('cache hit returns synchronously without re-fetch', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ elementId: '5', data: 'first', source: 'static', cached: false, fetchedAt: 1 })
    );
    const { result, unmount } = renderHook(() => useWidgetData('5', { ttlSeconds: 60 }));
    await waitFor(() => expect(result.current.data).toBe('first'));
    expect(mockFetch).toHaveBeenCalledTimes(1);
    unmount();

    // Second mount within TTL: no new fetch
    const second = renderHook(() => useWidgetData('5', { ttlSeconds: 60 }));
    expect(second.result.current.isLoading).toBe(false);
    expect(second.result.current.data).toBe('first');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('mutate() bypasses cache and refetches', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ elementId: '6', data: 'old', source: 'static', cached: false, fetchedAt: 1 })
    );
    const { result } = renderHook(() => useWidgetData('6', { ttlSeconds: 60 }));
    await waitFor(() => expect(result.current.data).toBe('old'));

    mockFetch.mockResolvedValueOnce(
      jsonResponse({ elementId: '6', data: 'new', source: 'static', cached: false, fetchedAt: 2 })
    );
    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.data).toBe('new');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('ttlSeconds=0 disables cache', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ elementId: '7', data: 1, source: 'static', cached: false, fetchedAt: 1 })
    );
    const { unmount } = renderHook(() => useWidgetData('7', { ttlSeconds: 0 }));
    await waitFor(() => expect(__testing.cache.size).toBe(0));
    unmount();

    mockFetch.mockResolvedValueOnce(
      jsonResponse({ elementId: '7', data: 2, source: 'static', cached: false, fetchedAt: 2 })
    );
    const second = renderHook(() => useWidgetData('7', { ttlSeconds: 0 }));
    await waitFor(() => expect(second.result.current.data).toBe(2));
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('useWidgetData — endpointPrefix override', () => {
  it('uses custom endpoint prefix', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ elementId: '8', data: null, source: null, cached: false, fetchedAt: 0 })
    );
    renderHook(() => useWidgetData('8', { endpointPrefix: '/custom/data' }));
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith('/custom/data/8', expect.any(Object));
  });
});
