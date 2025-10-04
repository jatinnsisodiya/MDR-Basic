// next.config.js - Next.js configuration for Builder.io
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.builder.io', 'builder.io'],
  },
  env: {
    BUILDER_PUBLIC_KEY: process.env.BUILDER_PUBLIC_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://builder.io",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    // Handle Builder.io components
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './components',
      '@styles': './styles',
    };
    return config;
  },
};

module.exports = nextConfig;