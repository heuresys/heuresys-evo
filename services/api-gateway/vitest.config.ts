import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/**/__tests__/**/*.test.ts',
      'src/**/*.test.ts',
      'tests/**/*.spec.ts', // S28 Wave 5 integration + security suites (skip if no DB)
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.test.ts',
        'src/index.ts',
        'src/types.ts',
        'src/auth.ts',
      ],
      // ADR-0011 ratchet baseline (S28 H12). Increase over time as coverage grows.
      thresholds: {
        lines: 40,
        branches: 30,
        functions: 40,
        statements: 40,
      },
    },
  },
});
