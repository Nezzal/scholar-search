/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/scholar-search',
  images: {
    unoptimized: true,
  },
  // Ensure your SerpAPI calls work in production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://serpapi.com/:path*',
      },
    ];
  }
};

module.exports = nextConfig;