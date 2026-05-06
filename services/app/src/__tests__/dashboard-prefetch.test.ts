import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/db', () => {
  const mockTx = { $queryRawUnsafe: vi.fn(async () => [{ value: 99 }]) };
  return {
    prisma: {} as unknown,
    withTenant: vi.fn(async (_tid: string | null, fn: (tx: typeof mockTx) => unknown) =>
      fn(mockTx)
    ),
    __mockTx: mockTx,
  };
});

import { prefetchElements } from '@/lib/dashboard-engine/prefetch';
import { __testing as fetcherTesting } from '@/lib/dashboard-engine/data-fetcher';
import type { DashboardElementShape } from '@/lib/dashboard-engine/resolver';

const TENANT = '0c54b84a-db6e-4da4-bc91-af5d480d524e';

function el(id: number, config_overrides: unknown): DashboardElementShape {
  return {
    id,
    position: id,
    widget_code: 'KpiRing',
    widget_catalog_id: null,
    grid_col_start: 1,
    grid_col_span: 4,
    grid_row_start: 1,
    grid_row_span: 1,
    perspective_code: null,
    visibility_min_role: 6,
    config_overrides,
    tenant_id: null,
  };
}

describe('prefetchElements', () => {
  beforeEach(() => fetcherTesting.clearCache());

  it('returns data:null when element has no config_overrides', async () => {
    const out = await prefetchElements([el(1, null)], { tenantId: TENANT });
    expect(out).toEqual({ '1': { data: null } });
  });

  it('returns data:null when config_overrides has no data_source', async () => {
    const out = await prefetchElements([el(2, { something_else: 'x' })], {
      tenantId: TENANT,
    });
    expect(out['2']).toEqual({ data: null });
  });

  it('fetches static data when data_source.type=static', async () => {
    const out = await prefetchElements(
      [el(3, { data_source: { type: 'static', value: { v: 1 } } })],
      { tenantId: TENANT }
    );
    expect(out['3']!.data).toEqual({ v: 1 });
  });

  it('fetches sql data when data_source.type=sql', async () => {
    const out = await prefetchElements(
      [el(4, { data_source: { type: 'sql', query: 'SELECT 99 AS value' } })],
      { tenantId: TENANT }
    );
    expect(out['4']!.data).toEqual([{ value: 99 }]);
  });

  it('runs multiple fetches in parallel and keys by id', async () => {
    const out = await prefetchElements(
      [
        el(10, { data_source: { type: 'static', value: 'a' } }),
        el(11, { data_source: { type: 'static', value: 'b' } }),
        el(12, null),
      ],
      { tenantId: TENANT }
    );
    expect(Object.keys(out).sort()).toEqual(['10', '11', '12']);
    expect(out['10']!.data).toBe('a');
    expect(out['11']!.data).toBe('b');
    expect(out['12']!.data).toBeNull();
  });

  it('captures per-element error without aborting batch', async () => {
    const out = await prefetchElements(
      [
        el(20, { data_source: { type: 'static', value: 'ok' } }),
        el(21, { data_source: { type: 'sql', query: 'INSERT INTO x VALUES (1)' } }),
      ],
      { tenantId: TENANT }
    );
    expect(out['20']!.data).toBe('ok');
    expect(out['21']!.data).toBeNull();
    expect(out['21']!.error).toContain('SELECT/WITH only');
  });
});
