/**
 * Phase 14.A.5 — Tests for /api/dashboard/data/[elementId] route handler.
 *
 * Mocks @/lib/auth, @/lib/db, and @/lib/dashboard-engine/data-fetcher to
 * exercise the auth + RBP + tenant gates without touching Postgres.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(async () => ({
    user: { role: 'HR_DIRECTOR', tenantId: 'tenant-A', id: 'user-1' },
  })),
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    dashboard_elements: {
      findUnique: vi.fn(),
    },
  },
  withTenant: vi.fn(),
}));

vi.mock('@/lib/dashboard-engine/data-fetcher', () => ({
  fetchWidgetData: vi.fn(async () => ({
    data: [{ value: 1 }],
    source: 'sql',
    cached: false,
    fetchedAt: 1234567890,
  })),
}));

import { GET } from '@/app/api/dashboard/data/[elementId]/route';
import * as authModule from '@/lib/auth';
import * as dbModule from '@/lib/db';
import * as fetcherModule from '@/lib/dashboard-engine/data-fetcher';

const mockAuth = vi.mocked(authModule.auth);
const mockFindUnique = vi.mocked(
  dbModule.prisma.dashboard_elements.findUnique as unknown as (args: unknown) => Promise<unknown>
);
const mockFetchWidgetData = vi.mocked(fetcherModule.fetchWidgetData);

function makeReq(): Request {
  return new Request('http://localhost/api/dashboard/data/123');
}
function ctx(elementId = '123') {
  return { params: Promise.resolve({ elementId }) };
}

describe('GET /api/dashboard/data/[elementId] — auth gate', () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockFindUnique.mockReset();
    mockFetchWidgetData.mockClear();
  });

  it('401 when no session', async () => {
    mockAuth.mockResolvedValueOnce(
      null as unknown as ReturnType<typeof authModule.auth> extends Promise<infer T> ? T : never
    );
    const r = await GET(makeReq(), ctx());
    expect(r.status).toBe(401);
  });

  it('400 when elementId is not a valid bigint', async () => {
    mockAuth.mockResolvedValueOnce({
      user: { role: 'HR_DIRECTOR', tenantId: 'tenant-A' },
    } as unknown as Awaited<ReturnType<typeof authModule.auth>>);
    const r = await GET(makeReq(), ctx('not-a-number'));
    expect(r.status).toBe(400);
  });
});

describe('GET /api/dashboard/data/[elementId] — element resolution', () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue({
      user: { role: 'HR_DIRECTOR', tenantId: 'tenant-A', id: 'user-1' },
    } as unknown as Awaited<ReturnType<typeof authModule.auth>>);
    mockFindUnique.mockReset();
    mockFetchWidgetData.mockClear();
  });

  it('404 when element does not exist', async () => {
    mockFindUnique.mockResolvedValueOnce(null);
    const r = await GET(makeReq(), ctx());
    expect(r.status).toBe(404);
  });

  it('404 when user role level > element visibility_min_role (invisible)', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: BigInt(123),
      visibility_min_role: 0, // TENANT_OWNER+ only — HR_DIRECTOR (level 2) blocked
      tenant_id: null,
      config_overrides: null,
    });
    const r = await GET(makeReq(), ctx());
    expect(r.status).toBe(404);
  });

  it('404 when tenant_id mismatch (tenant override leak prevention)', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: BigInt(123),
      visibility_min_role: 6,
      tenant_id: 'tenant-B', // different from user's tenant-A
      config_overrides: null,
    });
    const r = await GET(makeReq(), ctx());
    expect(r.status).toBe(404);
  });

  it('200 when platform default (tenant_id null) visible to user', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: BigInt(123),
      visibility_min_role: 6,
      tenant_id: null,
      config_overrides: { data_source: { type: 'sql', query: 'SELECT 1' } },
    });
    const r = await GET(makeReq(), ctx());
    expect(r.status).toBe(200);
    const json = await r.json();
    expect(json.elementId).toBe('123');
    expect(json.data).toEqual([{ value: 1 }]);
    expect(json.source).toBe('sql');
  });

  it('200 when tenant_id matches caller tenant', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: BigInt(123),
      visibility_min_role: 6,
      tenant_id: 'tenant-A',
      config_overrides: { data_source: { type: 'static', value: 'hello' } },
    });
    const r = await GET(makeReq(), ctx());
    expect(r.status).toBe(200);
    const json = await r.json();
    expect(json.data).toEqual([{ value: 1 }]); // mocked fetchWidgetData
  });

  it('passes tenantId+role+userId to fetchWidgetData ctx', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: BigInt(456),
      visibility_min_role: 6,
      tenant_id: null,
      config_overrides: { data_source: { type: 'static', value: 'x' } },
    });
    await GET(makeReq(), ctx('456'));
    expect(mockFetchWidgetData).toHaveBeenCalledWith(
      expect.objectContaining({
        elementId: '456',
        ctx: expect.objectContaining({
          tenantId: 'tenant-A',
          role: 'HR_DIRECTOR',
          userId: 'user-1',
        }),
      })
    );
  });

  it('200 with data:null when element has no data_source', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: BigInt(123),
      visibility_min_role: 6,
      tenant_id: null,
      config_overrides: null,
    });
    mockFetchWidgetData.mockResolvedValueOnce({
      data: null,
      source: null,
      cached: false,
      fetchedAt: 999,
    });
    const r = await GET(makeReq(), ctx());
    expect(r.status).toBe(200);
    const json = await r.json();
    expect(json.data).toBeNull();
    expect(json.source).toBeNull();
  });

  it('Cache-Control header is private no-cache', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: BigInt(123),
      visibility_min_role: 6,
      tenant_id: null,
      config_overrides: null,
    });
    const r = await GET(makeReq(), ctx());
    expect(r.headers.get('Cache-Control')).toContain('private');
    expect(r.headers.get('Cache-Control')).toContain('must-revalidate');
  });
});
