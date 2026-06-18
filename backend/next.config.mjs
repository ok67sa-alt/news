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
  
  // Simpler rewrites - only for root path
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;
