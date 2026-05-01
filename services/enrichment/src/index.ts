import 'dotenv/config';
import pino from 'pino';
import { buildRedisConnection } from './clients/redis.js';
import { buildEnrichmentWorker, QUEUE_NAME } from './queues/enrichment.js';

/**
 * Enrichment worker bootstrap. Reads REDIS_URL from env, attaches a single
 * Worker that consumes the `enrichment` queue, logs job lifecycle events.
 *
 * In dev: `tsx watch src/index.ts` from this workspace, with Redis at localhost:6379.
 * In CI: not invoked yet (testcontainers gate not crossed — see ADR-0002).
 * In prod: `node dist/index.js`, run as a long-running service.
 */

const log = pino({ name: '@heuresys/enrichment' });

async function main(): Promise<void> {
  const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
  const connection = buildRedisConnection(redisUrl);

  const worker = buildEnrichmentWorker(
    connection,
    {
      now: () => Date.now(),
      log: (msg, meta) => log.info(meta, msg),
    },
  );

  worker.on('completed', (job) => {
    log.info({ jobId: job.id, name: job.name }, 'job completed');
  });
  worker.on('failed', (job, err) => {
    log.error({ jobId: job?.id, name: job?.name, err }, 'job failed');
  });

  log.info({ queue: QUEUE_NAME, redisUrl }, 'worker started');

  const shutdown = async (sig: string): Promise<void> => {
    log.info({ sig }, 'shutdown requested');
    await worker.close();
    await connection.quit();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err: unknown) => {
  log.fatal({ err }, 'worker bootstrap failed');
  process.exit(1);
});
