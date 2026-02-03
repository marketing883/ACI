import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure sharp for server-side image processing
  serverExternalPackages: ['sharp'],

  // Redirects for legacy URLs
  async redirects() {
    return [
      // Redirect /blog/* to /blogs/* (canonical URL is /blogs)
      {
        source: '/blog/:slug',
        destination: '/blogs/:slug',
        permanent: true, // 301 redirect for SEO
      },
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
    ];
  },

  // Cache control headers - prevent long caching of HTML pages
  async headers() {
    return [
      {
        // Apply to all HTML pages (not static assets)
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Allow longer caching for static assets
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    // Remote image patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
    // Image formats for optimization
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for layout optimization
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
