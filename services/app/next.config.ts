import type { NextConfig } from 'next';

const config: NextConfig = {
  // Workspace packages must be transpiled by Next; otherwise their TS source
  // breaks SSR/RSC compilation.
  transpilePackages: ['@heuresys/ui', '@heuresys/shared'],
  experimental: {
    // typedRoutes: true,  // enable later when route surface is stable
  },
};

export default config;
