import { Queue, Worker, type Job, type ConnectionOptions } from 'bullmq';
import { handleEscoMatch, type EscoMatchDeps } from '../handlers/esco-match.js';
import type { EscoMatchJobInput, EscoMatchJobOutput } from '../types/job.js';

export const QUEUE_NAME = 'enrichment' as const;

export const JOB_TYPES = {
  EscoMatch: 'esco-match',
} as const;

export type EnrichmentJobName = typeof JOB_TYPES[keyof typeof JOB_TYPES];

/**
 * Build a BullMQ Queue producer. The api-gateway will use this to enqueue
 * skill-match work; the worker (below) consumes from the same queue.
 */
export function buildEnrichmentQueue(connection: ConnectionOptions): Queue {
  return new Queue(QUEUE_NAME, { connection });
}

/**
 * Build a BullMQ Worker that routes jobs by name to the right handler.
 * Currently only `esco-match` is wired; future jobs (`llm-validate`,
 * `merge-commit`) plug into the same router.
 */
export function buildEnrichmentWorker(
  connection: ConnectionOptions,
  deps: EscoMatchDeps,
): Worker<EscoMatchJobInput, EscoMatchJobOutput> {
  return new Worker<EscoMatchJobInput, EscoMatchJobOutput>(
    QUEUE_NAME,
    async (job: Job<EscoMatchJobInput, EscoMatchJobOutput>) => {
      switch (job.name as EnrichmentJobName) {
        case JOB_TYPES.EscoMatch:
          return handleEscoMatch(job.data, deps);
        default:
          throw new Error(`unknown job name: ${job.name}`);
      }
    },
    { connection },
  );
}
