import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@heuresys/ui', '@heuresys/shared'],
};

export default nextConfig;
