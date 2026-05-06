export function safeParseInt(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

export interface PaginationMeta {
  timestamp: string;
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export function buildMeta(params: {
  totalCount: number;
  limit: number;
  offset: number;
  rowCount: number;
}): PaginationMeta {
  const { totalCount, limit, offset, rowCount } = params;
  return {
    timestamp: new Date().toISOString(),
    totalCount,
    limit,
    offset,
    hasMore: offset + rowCount < totalCount,
  };
}
