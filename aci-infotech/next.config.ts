import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the file-tracing root to this Next.js app directory. On the
  // VPS the repo is checked out as `/var/www/<env>/aci-infotech/`, so
  // without this setting Next could walk up to the wrapper directory
  // (or even further) looking for a lockfile and confuse the trace
  // output — especially when prod and staging sit under the same
  // parent. Pin it explicitly so every build traces from the exact
  // app root.
  outputFileTracingRoot: path.join(__dirname),

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
      // QA & Testing rebranded to Quality Engineering. Keep the
      // 301 so existing inbound links, sitemaps, and Google's
      // cached results funnel to the new slug.
      {
        source: '/services/qa-testing',
        destination: '/services/quality-engineering',
        permanent: true,
      },
      // Case-study slugs anonymized (real client names removed).
      // Keep 301s so search results, social shares, and any
      // inbound links funnel to the new descriptor-based slugs.
      {
        source: '/case-studies/msci-data-automation',
        destination: '/case-studies/modernizes-finance-reporting-with-sap-transformation',
        permanent: true,
      },
      {
        source: '/case-studies/financial-giant-sap-consolidation',
        destination: '/case-studies/modernizes-finance-reporting-with-sap-transformation',
        permanent: true,
      },
      {
        source: '/case-studies/racetrac-martech',
        destination: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
        permanent: true,
      },
      {
        source: '/case-studies/convenience-retailer-martech',
        destination: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
        permanent: true,
      },
      {
        source: '/case-studies/racetrac-real-time-data',
        destination: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
        permanent: true,
      },
      {
        source: '/case-studies/convenience-retailer-realtime-data',
        destination: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
        permanent: true,
      },
      {
        source: '/case-studies/sodexo-unified-data',
        destination: '/case-studies/global-food-facilities-data-intelligence',
        permanent: true,
      },
      {
        source: '/case-studies/hospitality-leader-unified-data',
        destination: '/case-studies/global-food-facilities-data-intelligence',
        permanent: true,
      },

      // ================= LEGACY-SITE REDIRECT MAP =================
      // GTM tag-coverage data (July 2026) showed hundreds of old
      // HubSpot-era URLs still receiving traffic and 404ing on the
      // new app. Specific slugs first, section wildcards last
      // (redirects are evaluated in order). All 301.

      // -- Client-name slugs still in the wild (anonymization policy) --
      { source: '/case-study/msci-powers-scalable-data-automation-with-aci-infotech', destination: '/case-studies/modernizes-finance-reporting-with-sap-transformation', permanent: true },
      { source: '/case-study/nestle-self-service-intelligence', destination: '/case-studies/global-cpg-self-service-analytics-brand-managers', permanent: true },
      { source: '/case-studies/how-nestle-empowered-brand-managers-with-self-service-intelligence', destination: '/case-studies/global-cpg-self-service-analytics-brand-managers', permanent: true },
      { source: '/case-studies/databricks-modernization-ai-enablement-for-racetrac', destination: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain', permanent: true },
      { source: '/case-studies/yesbot-enhances-eligibility-verification-for-a-leading-healthcare-giant', destination: '/case-studies/healthcare-eligibility-verification-automation-aci-yesbot', permanent: true },
      { source: '/case-study/:path*', destination: '/case-studies', permanent: true },

      // -- Foundation pages, old paths --
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/partner', destination: '/partners', permanent: true },
      { source: '/insights', destination: '/blogs', permanent: true },
      { source: '/carrers', destination: '/careers', permanent: true },
      { source: '/media/news', destination: '/news', permanent: true },
      { source: '/news-events', destination: '/news', permanent: true },
      { source: '/testimonials', destination: '/case-studies', permanent: true },
      { source: '/gallery', destination: '/about', permanent: true },
      { source: '/automation', destination: '/services/digital-transformation', permanent: true },
      { source: '/build-your-data-ai-advantage', destination: '/services/data-engineering', permanent: true },
      { source: '/solutions-that-power-whats-next', destination: '/services', permanent: true },

      // -- Legacy service slugs --
      { source: '/services/data-engineering-services', destination: '/services/data-engineering', permanent: true },
      { source: '/services/data-analytics', destination: '/services/data-engineering', permanent: true },
      { source: '/services/data-analytics-services', destination: '/services/data-engineering', permanent: true },
      { source: '/services/analytics-big-data', destination: '/services/data-engineering', permanent: true },
      { source: '/services/ai-ml-services', destination: '/services/applied-ai-ml', permanent: true },
      { source: '/services/ai-ml-devlopment', destination: '/services/applied-ai-ml', permanent: true },
      { source: '/services/applied-ai-ml-services', destination: '/services/applied-ai-ml', permanent: true },
      { source: '/services/artificial-intelligence-old', destination: '/services/applied-ai-ml', permanent: true },
      { source: '/services/generative-ai-service', destination: '/services/applied-ai-ml', permanent: true },
      { source: '/services/generative-ai-services', destination: '/services/applied-ai-ml', permanent: true },
      { source: '/services/cloud-consulting-services', destination: '/services/cloud-modernization', permanent: true },
      { source: '/services/cloud-enablement-services', destination: '/services/cloud-modernization', permanent: true },
      { source: '/services/cloud-devops', destination: '/services/cloud-modernization', permanent: true },
      { source: '/services/cyber-security-services', destination: '/services/cyber-security', permanent: true },
      { source: '/services/cloud-cybersecurity', destination: '/services/cyber-security', permanent: true },
      { source: '/services/devsecops-services', destination: '/services/cyber-security', permanent: true },
      { source: '/services/managed-it', destination: '/services/managed-operations', permanent: true },
      { source: '/services/managed-it-services', destination: '/services/managed-operations', permanent: true },
      { source: '/services/it-service-management', destination: '/services/managed-operations', permanent: true },
      { source: '/services/intelligent-automation-services', destination: '/services/digital-transformation', permanent: true },
      { source: '/services/intelligent-process-automation', destination: '/services/digital-transformation', permanent: true },
      { source: '/services/business-transformation', destination: '/services/digital-transformation', permanent: true },
      { source: '/services/digitalcore', destination: '/services/digital-transformation', permanent: true },
      { source: '/services/quality-engineering-and-assurance', destination: '/services/quality-engineering', permanent: true },
      { source: '/services/digital-application-development', destination: '/services/app-development', permanent: true },
      { source: '/services/digital-application', destination: '/services/app-development', permanent: true },
      { source: '/services/enterprise-application', destination: '/services/app-development', permanent: true },
      { source: '/services/enterprise-application-services', destination: '/services/app-development', permanent: true },
      { source: '/services/digital-experience', destination: '/services/martech-cdp', permanent: true },
      { source: '/services/digital-experience-services', destination: '/services/martech-cdp', permanent: true },
      { source: '/services/digital-commerce-services', destination: '/services/martech-cdp', permanent: true },
      { source: '/services/customer-experience', destination: '/services/martech-cdp', permanent: true },
      { source: '/services/digital-consulting-services', destination: '/services/advisory-strategy', permanent: true },
      { source: '/services/sap', destination: '/platforms/sap', permanent: true },
      { source: '/services/sap-brim', destination: '/platforms/sap', permanent: true },
      { source: '/services/erp', destination: '/platforms/sap', permanent: true },
      { source: '/services/salesforce-integration', destination: '/platforms/salesforce', permanent: true },

      // -- Legacy platform slugs --
      { source: '/platforms/snowflake-consulting', destination: '/platforms/snowflake', permanent: true },
      { source: '/platforms/salesforce-consulting-solutions', destination: '/platforms/salesforce', permanent: true },
      { source: '/platforms/sap-consulting-solutions', destination: '/platforms/sap', permanent: true },
      { source: '/platforms/mulesoft-consulting-services', destination: '/platforms', permanent: true },
      { source: '/platforms/sitecore', destination: '/platforms', permanent: true },
      { source: '/platforms/adobe-consulting-services', destination: '/platforms', permanent: true },

      // -- Old /industry/* structure --
      { source: '/industry/banking', destination: '/industries/financial-services', permanent: true },
      { source: '/industry/insurance', destination: '/industries/financial-services', permanent: true },
      { source: '/industry/life-sciences', destination: '/industries/healthcare', permanent: true },
      { source: '/industry/healthcare-lifesciences', destination: '/industries/healthcare', permanent: true },
      { source: '/industry/utility', destination: '/industries/energy', permanent: true },
      { source: '/industry/oil-and-gas', destination: '/industries/oil-gas', permanent: true },
      { source: '/industry/retail-consulting', destination: '/industries/retail', permanent: true },
      { source: '/industry/:path*', destination: '/industries', permanent: true },
      { source: '/industries/insurance-industry', destination: '/industries/financial-services', permanent: true },
      { source: '/industries/transportation-logistics-industry', destination: '/industries/transportation', permanent: true },

      // -- Old /solutions/* structure --
      { source: '/solutions/cybersecurity', destination: '/services/cyber-security', permanent: true },
      { source: '/solutions/sap-modernization', destination: '/platforms/sap', permanent: true },
      { source: '/solutions/salesforce-optimization-assessment', destination: '/platforms/salesforce', permanent: true },
      { source: '/solutions/retail-enterprise-ai-cloud-data-success', destination: '/industries/retail', permanent: true },
      { source: '/solutions/:path*', destination: '/services', permanent: true },

      // -- Old gated-content sections (singular/renamed) --
      { source: '/whitepaper/:path*', destination: '/whitepapers', permanent: true },
      { source: '/whitepaper', destination: '/whitepapers', permanent: true },
      { source: '/ebook/:path*', destination: '/whitepapers', permanent: true },
      { source: '/ebook', destination: '/whitepapers', permanent: true },
      { source: '/press-releases/:path*', destination: '/news', permanent: true },
      { source: '/webinar/:path*', destination: '/news', permanent: true },

      // -- Old nested blog categories (new structure is flat).
      //    2-level: keep the post slug; 3-level: keep the last segment.
      //    Excludes /blogs/page/:n pagination. --
      { source: '/blogs/:category((?!page/)[^/]+)/:slug([^/]+)', destination: '/blogs/:slug', permanent: true },
      { source: '/blogs/:category/:sub/:slug([^/]+)', destination: '/blogs/:slug', permanent: true },

      // -- Root-level legacy post URL still receiving hits --
      { source: '/how-rpa-is-playing-a-paramount-role-in-reducing-rd-costs-for-the-pharma-industry', destination: '/blogs/how-rpa-is-playing-a-paramount-role-in-reducing-rd-costs-for-the-pharma-industry', permanent: true },

      // -- Renamed LP --
      { source: '/lp/power-bi-consulting-services', destination: '/lp/power-bi-consulting', permanent: true },
    ];
  },

  // Cache control and security headers
  async headers() {
    // Off-production builds (staging) must never be indexed. robots.txt
    // already disallows crawling there; this header is the second lock —
    // it de-indexes anything Google already picked up before the gate
    // existed. Duplicated from src/lib/site-url.ts because next.config
    // cannot use the app's path aliases.
    const deployUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://aciinfotech.com'
    ).replace(/\/+$/, '');
    const isProdDeployment = deployUrl === 'https://aciinfotech.com';

    return [
      ...(!isProdDeployment
        ? [
            {
              source: '/:path*',
              headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
            },
          ]
        : []),
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://snap.licdn.com https://static.hotjar.com https://script.hotjar.com https://www.clarity.ms https://cdn-in.pagesense.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' blob:",
              "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://px.ads.linkedin.com https://server-side-tagging-p5uycbintq-uc.a.run.app https://*.supabase.co https://api.aciinfotech.com https://*.hotjar.com https://*.hotjar.io https://www.clarity.ms https://cdn-in.pagesense.io ",
              "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net https://bid.g.doubleclick.net https://vars.hotjar.com",
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
      {
        // The homepage and the v2 preview branch on User-Agent in
        // V2HomeContent (phones get the mobile-only tree, everyone
        // else gets the desktop tree). Any shared cache between this
        // origin and the visitor — the staging nginx layer, a future
        // CDN — must keep one entry per UA variant or it will serve
        // the wrong tree to the wrong device. `Vary: User-Agent` is
        // the standard signal for that.
        source: '/',
        headers: [{ key: 'Vary', value: 'User-Agent' }],
      },
      {
        source: '/preview/v2-home',
        headers: [{ key: 'Vary', value: 'User-Agent' }],
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
