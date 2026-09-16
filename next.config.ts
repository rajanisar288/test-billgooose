import type { NextConfig } from 'next';

const isProdBuild = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Azure Static Web Apps serves the exported files directly; no Node.js server
  // is available at runtime. Keep this off in `next dev` so /journey/:id can be
  // rewritten to the static resume page without generateStaticParams.
  ...(isProdBuild ? { output: 'export' as const } : {}),
  trailingSlash: true,
  images: {
    // The Next.js image optimizer requires a server. Keep image assets static.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // ✅ Add this to silence the Turbopack warning
  turbopack: {
    // Empty config - add turbopack specific config here if needed
  },

  webpack: (config, { isServer }) => {
    config.optimization?.usedExports !== undefined && (config.optimization.usedExports = true);

    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          net: false,
          tls: false,
        },
      };
    }

    return config;
  },
};

export default nextConfig;
