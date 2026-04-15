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

  // Cache control and security headers
  async headers() {
    return [
      {
        // Security + cache headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://snap.licdn.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' blob:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://px.ads.linkedin.com https://*.supabase.co https://api.aciinfotech.com",
              "frame-src 'self'",
              // Allow the PWA manifest to load through the GitHub Codespaces
              // auth tunnel (private port forwarding redirects /manifest.webmanifest
              // through https://github.dev/pf-signin?...). On a real production
              // domain the manifest is served from 'self' so this is a no-op.
              "manifest-src 'self' https://*.github.dev https://github.dev",
            ].join('; '),
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
        // Supabase custom domain. After switching
        // NEXT_PUBLIC_SUPABASE_URL to the custom domain, new storage
        // public URLs (from supabase.storage.getPublicUrl) resolve
        // against this host instead of .supabase.co. Keep both
        // entries so pre-existing DB rows with .supabase.co URLs
        // still optimise through next/image.
        protocol: 'https',
        hostname: 'api.aciinfotech.com',
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
