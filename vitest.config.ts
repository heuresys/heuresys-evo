import { defineConfig } from 'vitest/config';

/**
 * Vitest 4 root config — single command runs all workspace test suites.
 * Replaces the deprecated `defineWorkspace` helper (removed in vitest 4).
 *
 * Usage:
 *   npx vitest run                # all
 *   npx vitest run --coverage     # with coverage
 *   npx vitest run -t "auth"      # filter by name
 */
export default defineConfig({
  test: {
    projects: [
      './services/api-gateway/vitest.config.ts',
      './services/app/vitest.config.ts',
      './services/enrichment/vitest.config.ts',
      './packages/ui/vitest.config.ts',
      './packages/shared/vitest.config.ts',
    ],
  },
});
