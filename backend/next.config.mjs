const nextConfig = {
  reactStrictMode: false, // Disable in development for faster reload
  
  // Skip type checking and linting during build (faster builds)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    minimumCacheTTL: 60,
  },
  
  // Configure rewrites to serve frontend from root and admin from /admin
  async rewrites() {
    return {
      beforeFiles: [
        // Admin routes stay in Next.js
        {
          source: '/admin/:path*',
          destination: '/admin/:path*',
        },
        // API routes stay in Next.js
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ],
      afterFiles: [
        // Serve frontend SPA - all other routes go to index.html
        {
          source: '/:path*',
          destination: '/index.html',
        },
      ],
      fallback: [],
    };
  },
  
  // Configure headers for frontend SPA
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  
  // Faster dev server (Turbopack compatible)
  webpack: (config, { dev, isServer }) => {
    if (dev && !process.env.TURBOPACK) {
      // Only apply webpack config when NOT using Turbopack
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  },
};

export default nextConfig;
