const nextConfig = {
  reactStrictMode: false,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // تحسينات الأداء والضغط
  compress: true,
  swcMinify: true,
  
  // ملاحظة: compiler.removeConsole غير مدعوم في Turbopack
  // سيتم إزالة console.log في Production build تلقائياً
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
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
