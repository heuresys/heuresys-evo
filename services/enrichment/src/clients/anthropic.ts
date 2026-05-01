import Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic SDK factory — wired here for future LLM-validate / merge-commit
 * handlers. The first implemented handler (esco-match) does NOT call the LLM
 * (vector search only) but the client lives in the same module so we don't
 * spread initialization patterns.
 *
 * Defaults to `claude-opus-4-7` per Heuresys global preference (latest Opus
 * model when API access is provisioned). Override via `ANTHROPIC_MODEL` env.
 */
export const DEFAULT_MODEL = 'claude-opus-4-7' as const;

export function buildAnthropicClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey });
}

export function resolveModel(env: { ANTHROPIC_MODEL?: string }): string {
  return env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
}
