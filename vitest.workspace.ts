import { defineWorkspace } from 'vitest/config';

/**
 * Vitest workspace — single command runs all workspace test suites.
 * Usage:
 *   npx vitest run                # all
 *   npx vitest run --coverage     # with coverage
 *   npx vitest run -t "auth"      # filter by name
 */
export default defineWorkspace([
  './services/api-gateway/vitest.config.ts',
  './services/app/vitest.config.ts',
  './packages/ui/vitest.config.ts',
  './packages/shared/vitest.config.ts',
]);
