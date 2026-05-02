import type { NextConfig } from 'next';

const config: NextConfig = {
  // Standalone output for systemd-managed deploy (RTG Phase 5 task 5.2).
  // Generates .next/standalone/services/app/server.js — single self-contained
  // node process invocable by `node server.js`.
  output: 'standalone',

  // Workspace packages must be transpiled by Next; otherwise their TS source
  // breaks SSR/RSC compilation.
  transpilePackages: ['@heuresys/ui', '@heuresys/shared'],
  experimental: {
    // typedRoutes: true,  // enable later when route surface is stable
  },
};

export default config;
