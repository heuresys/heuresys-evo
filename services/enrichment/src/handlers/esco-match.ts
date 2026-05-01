import {
  EscoMatchJobInputSchema,
  type EscoMatchJobInput,
  type EscoMatchJobOutput,
} from '../types/job.js';

/**
 * EscoMatchHandler — match a free-form skill name to an ESCO occupation.
 *
 * **Smoke implementation (RTG Phase 3 task 3.10)**: this is a no-DB stub that
 * uses a small in-memory dictionary to validate the queue → handler → output
 * pipe end-to-end without requiring Postgres+pgvector setup. The "real" version
 * (Phase 4 task 4.11) will:
 *   1. Embed the input skillName with text-embedding-3-small (1536-dim)
 *   2. Run pgvector cosine on `esco_occupations.embedding` LIMIT 5
 *   3. If top-1 cosine ≥ 0.85, return it with source='vector'
 *   4. Else fallback to keyword match on `esco_occupations.label_it/en`
 *   5. Else return source='none' with confidence 0
 *
 * For now: hardcoded mapping covers a few well-known cases for smoke testing.
 */

const ESCO_SMOKE_MAP: Record<string, { code: string; label: string }> = {
  'machine learning': { code: '2511.4', label: 'Software developer (ML)' },
  'sql': { code: '2521.1', label: 'Database designer and administrator' },
  'react': { code: '2512.1', label: 'Frontend web developer' },
  'leadership': { code: '1213.0', label: 'Policy and planning manager' },
};

export interface EscoMatchDeps {
  now: () => number;
  log: (msg: string, meta: Record<string, unknown>) => void;
}

export async function handleEscoMatch(
  rawInput: unknown,
  deps: EscoMatchDeps,
): Promise<EscoMatchJobOutput> {
  const start = deps.now();
  const input: EscoMatchJobInput = EscoMatchJobInputSchema.parse(rawInput);

  const normalized = input.skillName.trim().toLowerCase();
  const hit = ESCO_SMOKE_MAP[normalized];

  const output: EscoMatchJobOutput = hit
    ? {
        inputSkillName: input.skillName,
        matchedOccupationCode: hit.code,
        matchedOccupationLabel: hit.label,
        confidence: 0.95,
        source: 'keyword',
        durationMs: deps.now() - start,
      }
    : {
        inputSkillName: input.skillName,
        matchedOccupationCode: null,
        matchedOccupationLabel: null,
        confidence: 0,
        source: 'none',
        durationMs: deps.now() - start,
      };

  deps.log('esco-match completed', {
    tenantId: input.tenantId,
    skillName: input.skillName,
    matchedCode: output.matchedOccupationCode,
    source: output.source,
    durationMs: output.durationMs,
  });

  return output;
}
