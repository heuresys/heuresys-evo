import { z } from 'zod';

/**
 * Enrichment job types — input/output contracts for queue workers.
 *
 * The first handler implemented (esco-match) takes a free-form skill name
 * and returns the best ESCO occupation match. Future handlers (llm-validate,
 * merge-commit) will follow the same shape: typed input → typed output.
 */

export const EscoMatchJobInputSchema = z.object({
  skillName: z.string().min(1).max(255),
  tenantId: z.string().uuid(),
  context: z.string().max(2000).optional(),
  /**
   * L57 (S23-quater) — employee scope + GDPR consent.
   * If the enrichment is for a specific employee, the caller MUST pass
   * `employeeId` AND `enrichmentConsent` (read from `employees.enrichment_consent`).
   * The handler enforces consent: if `employeeId` is set and `enrichmentConsent`
   * is false/missing, the job is short-circuited (no PII processed).
   * For "abstract" skill matching (no employee link), both fields are omitted.
   */
  employeeId: z.string().uuid().optional(),
  enrichmentConsent: z.boolean().optional(),
});
export type EscoMatchJobInput = z.infer<typeof EscoMatchJobInputSchema>;

export const EscoMatchJobOutputSchema = z.object({
  inputSkillName: z.string(),
  matchedOccupationCode: z.string().nullable(),
  matchedOccupationLabel: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  source: z.enum(['vector', 'keyword', 'none']),
  durationMs: z.number().int().nonnegative(),
});
export type EscoMatchJobOutput = z.infer<typeof EscoMatchJobOutputSchema>;
