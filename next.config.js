/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api-nivora.nahsbyte.my.id/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
