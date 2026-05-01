import { Redis } from 'ioredis';

/**
 * BullMQ-compatible Redis connection. We use lazy connection so importing
 * this module from a unit test does NOT open a socket — only when the worker
 * actually calls `.connect()` or BullMQ schedules work.
 *
 * Production: REDIS_URL env var (e.g. redis://localhost:6379). The same
 * Redis instance is shared with services/api-gateway's BullMQ producers
 * (when those are added).
 */
export function buildRedisConnection(redisUrl: string): Redis {
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });
}
