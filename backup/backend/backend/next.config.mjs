const nextConfig = {
  reactStrictMode: false,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    minimumCacheTTL: 60,
  },
  
  // Rewrites for handling uploads and root path
  async rewrites() {
    return [
      // Serve uploaded files from public/uploads directory
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
  
  // Headers for static file caching
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
