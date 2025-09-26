/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Disable Next.js built-in image optimization for local builds to avoid
    // routing images through the _next/image optimizer which can return 400
    // for some locally-served public assets when config files conflict.
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep existing rewrites
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api-nivora.nahsbyte.my.id/api/v1/:path*',
      },
    ];
  },
  // Global headers (CORS) similar to next.config.ts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Some dev tuning
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
