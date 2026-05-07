import type { NextConfig } from 'next';

const config: NextConfig = {
  // Standalone output for systemd-managed deploy (RTG Phase 5 task 5.2).
  // Generates .next/standalone/services/app/server.js — single self-contained
  // node process invocable by `node server.js`.
  output: 'standalone',

  // Workspace packages must be transpiled by Next; otherwise their TS source
  // breaks SSR/RSC compilation.
  transpilePackages: ['@heuresys/ui', '@heuresys/shared'],

  // Allow LAN IPs to fetch dev-mode static chunks (Next.js 15+ blocks cross-origin
  // /_next/static/* by default; without this entry, dynamic-imported widget bundles
  // 4xx silently and the dashboard stays in "Loading widget…" forever when accessed
  // from another machine on the network).
  allowedDevOrigins: ['192.168.1.8', 'localhost', '127.0.0.1'],

  experimental: {
    // typedRoutes: true,  // enable later when route surface is stable
  },
};

export default config;
