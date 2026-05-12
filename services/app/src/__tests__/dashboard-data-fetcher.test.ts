import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock '@/lib/db' before importing the module under test
vi.mock('@/lib/db', () => {
  const mockTx = {
    $queryRawUnsafe: vi.fn(async (_q: string) => [{ value: 42 }]),
  };
  return {
    prisma: {} as unknown,
    withTenant: vi.fn(async (_tenantId: string | null, fn: (tx: typeof mockTx) => unknown) =>
      fn(mockTx)
    ),
    __mockTx: mockTx,
  };
});

import {
  fetchWidgetData,
  __testing,
  type DataSourceConfig,
} from '@/lib/dashboard-engine/data-fetcher';
import * as dbModule from '@/lib/db';

const mockTx = (dbModule as unknown as { __mockTx: { $queryRawUnsafe: ReturnType<typeof vi.fn> } })
  .__mockTx;
const mockWithTenant = vi.mocked(dbModule.withTenant);

const TENANT = '0c54b84a-db6e-4da4-bc91-af5d480d524e';

describe('fetchWidgetData — static source', () => {
  beforeEach(() => {
    __testing.clearCache();
    mockTx.$queryRawUnsafe.mockReset();
    mockWithTenant.mockClear();
  });

  it('returns inline static value', async () => {
    const config: DataSourceConfig = { type: 'static', value: { hello: 'world' } };
    const r = await fetchWidgetData({ elementId: 1, config, ctx: { tenantId: TENANT } });
    expect(r.data).toEqual({ hello: 'world' });
    expect(r.source).toBe('static');
    expect(r.error).toBeUndefined();
  });

  it('returns null when value omitted', async () => {
    const r = await fetchWidgetData({
      elementId: 1,
      config: { type: 'static' },
      ctx: { tenantId: null },
    });
    expect(r.data).toBeNull();
  });
});

describe('fetchWidgetData — null/missing config', () => {
  beforeEach(() => __testing.clearCache());

  it('returns null+source=null when config is null', async () => {
    const r = await fetchWidgetData({ elementId: 1, config: null, ctx: { tenantId: null } });
    expect(r.data).toBeNull();
    expect(r.source).toBeNull();
  });

  it('returns null+source=null when config has no type', async () => {
    const r = await fetchWidgetData({
      elementId: 1,
      config: {} as DataSourceConfig,
      ctx: { tenantId: null },
    });
    expect(r.data).toBeNull();
    expect(r.source).toBeNull();
  });
});

describe('fetchWidgetData — sql source', () => {
  beforeEach(() => {
    __testing.clearCache();
    mockTx.$queryRawUnsafe.mockReset();
    mockTx.$queryRawUnsafe.mockResolvedValue([{ value: 42 }]);
    mockWithTenant.mockClear();
  });

  it('executes SELECT via withTenant', async () => {
    const config: DataSourceConfig = { type: 'sql', query: 'SELECT count(*) FROM employees' };
    const r = await fetchWidgetData({ elementId: 7, config, ctx: { tenantId: TENANT } });
    expect(r.data).toEqual([{ value: 42 }]);
    expect(r.source).toBe('sql');
    expect(r.error).toBeUndefined();
    expect(mockWithTenant).toHaveBeenCalledWith(TENANT, expect.any(Function));
    expect(mockTx.$queryRawUnsafe).toHaveBeenCalledWith('SELECT count(*) FROM employees');
  });

  it('accepts WITH (CTE) queries', async () => {
    const config: DataSourceConfig = {
      type: 'sql',
      query: 'WITH x AS (SELECT 1) SELECT * FROM x',
    };
    const r = await fetchWidgetData({ elementId: 8, config, ctx: { tenantId: TENANT } });
    expect(r.error).toBeUndefined();
  });

  it('rejects mutations (INSERT/UPDATE/DELETE/DROP)', async () => {
    for (const verb of [
      'INSERT INTO x VALUES (1)',
      'UPDATE x SET y=1',
      'DELETE FROM x',
      'DROP TABLE x',
    ]) {
      const r = await fetchWidgetData({
        elementId: 1,
        config: { type: 'sql', query: verb },
        ctx: { tenantId: TENANT },
      });
      expect(r.data).toBeNull();
      expect(r.error).toContain('SELECT/WITH only');
    }
  });

  it('rejects empty query', async () => {
    const r = await fetchWidgetData({
      elementId: 1,
      config: { type: 'sql', query: '   ' },
      ctx: { tenantId: TENANT },
    });
    expect(r.error).toContain('non-empty');
  });

  it('captures Prisma errors as error string (data=null)', async () => {
    mockTx.$queryRawUnsafe.mockRejectedValueOnce(new Error('relation "x" does not exist'));
    const r = await fetchWidgetData({
      elementId: 1,
      config: { type: 'sql', query: 'SELECT * FROM x' },
      ctx: { tenantId: TENANT },
    });
    expect(r.data).toBeNull();
    expect(r.error).toContain('relation "x" does not exist');
  });
});

describe('fetchWidgetData — cache TTL', () => {
  beforeEach(() => {
    __testing.clearCache();
    mockTx.$queryRawUnsafe.mockReset();
    mockTx.$queryRawUnsafe.mockResolvedValue([{ value: 1 }]);
    mockWithTenant.mockClear();
  });

  it('cache miss then hit within TTL window', async () => {
    const config: DataSourceConfig = { type: 'sql', query: 'SELECT 1', ttl: 60 };
    const r1 = await fetchWidgetData({ elementId: 11, config, ctx: { tenantId: TENANT } });
    const r2 = await fetchWidgetData({ elementId: 11, config, ctx: { tenantId: TENANT } });
    expect(r1.cached).toBe(false);
    expect(r2.cached).toBe(true);
    expect(mockTx.$queryRawUnsafe).toHaveBeenCalledTimes(1);
  });

  it('falls back to widget_catalog ttlSeconds when config.ttl missing', async () => {
    const config: DataSourceConfig = { type: 'sql', query: 'SELECT 1' };
    await fetchWidgetData({ elementId: 12, config, ttlSeconds: 30, ctx: { tenantId: TENANT } });
    const r = await fetchWidgetData({
      elementId: 12,
      config,
      ttlSeconds: 30,
      ctx: { tenantId: TENANT },
    });
    expect(r.cached).toBe(true);
  });

  it('TTL=0 disables cache (always fresh)', async () => {
    const config: DataSourceConfig = { type: 'sql', query: 'SELECT 1', ttl: 0 };
    await fetchWidgetData({ elementId: 13, config, ctx: { tenantId: TENANT } });
    await fetchWidgetData({ elementId: 13, config, ctx: { tenantId: TENANT } });
    expect(mockTx.$queryRawUnsafe).toHaveBeenCalledTimes(2);
  });

  it('different tenants do not share cache entries', async () => {
    const config: DataSourceConfig = { type: 'sql', query: 'SELECT 1', ttl: 60 };
    await fetchWidgetData({ elementId: 14, config, ctx: { tenantId: TENANT } });
    await fetchWidgetData({ elementId: 14, config, ctx: { tenantId: 'other-tenant' } });
    expect(mockTx.$queryRawUnsafe).toHaveBeenCalledTimes(2);
    expect(__testing.cacheSize()).toBe(2);
  });

  it('does not cache failed queries', async () => {
    mockTx.$queryRawUnsafe.mockRejectedValueOnce(new Error('boom'));
    const config: DataSourceConfig = { type: 'sql', query: 'SELECT 1', ttl: 60 };
    await fetchWidgetData({ elementId: 15, config, ctx: { tenantId: TENANT } });
    expect(__testing.cacheSize()).toBe(0);
  });
});

describe('fetchWidgetData — partially implemented sources', () => {
  beforeEach(() => __testing.clearCache());

  it('api source without endpoint returns explicit validation error', async () => {
    // S40 Item3+ shipped `api` source implementation; the test originally
    // asserted "not yet implemented", but the dispatcher now validates
    // endpoint presence and surfaces a domain-specific error instead.
    const r = await fetchWidgetData({
      elementId: 1,
      config: { type: 'api' },
      ctx: { tenantId: TENANT },
    });
    expect(r.error).toContain('endpoint');
    expect(r.data).toBeNull();
  });

  it('graph source returns explicit "not yet implemented" error', async () => {
    const r = await fetchWidgetData({
      elementId: 1,
      config: { type: 'graph' },
      ctx: { tenantId: TENANT },
    });
    expect(r.error).toContain('not yet implemented');
  });
});
