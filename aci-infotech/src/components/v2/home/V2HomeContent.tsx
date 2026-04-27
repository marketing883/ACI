/**
 * V2HomeContent — the full dark-premium v2 homepage body, shared by
 * two routes:
 *
 *   1. `/preview/v2-home` — always rendered on every build
 *      (design-review route, also a safety net if the env flag ever
 *      gets dropped).
 *   2. `/` on staging — when `NEXT_PUBLIC_USE_V2_HOME=true` at build
 *      time, the root route renders this component instead of the v1
 *      HomePage.
 *
 * Keeping a single source of truth prevents drift between the two
 * URLs as v2 content evolves. The component is a pure async server
 * component: no props, no state, all CMS fetching done inline.
 *
 * Below-fold sections are lazy-loaded via next/dynamic to cut TTI.
 * Only HeroV2 and NavV2 are eagerly loaded (above the fold).
 */

import dynamic from 'next/dynamic';
import { MotionConfig } from 'framer-motion';
import { SmoothScrollInit } from '@/components/v2/craft/SmoothScroll';
import NavV2 from '@/components/v2/nav/NavV2';
import HeroV2 from '@/components/v2/home/HeroV2';
import FooterV2 from '@/components/v2/home/FooterV2';
import {
  fetchFeaturedCaseStudies,
  fetchFeaturedNews,
  fetchFeaturedBlogs,
} from '@/lib/v2/fetch-home-data';
import { fetchFeaturedWhitepaper } from '@/lib/v2/fetch-menu-data';

const ServicesDial = dynamic(() => import('@/components/v2/home/ServicesDial'));
const CaseStudiesPinned = dynamic(() => import('@/components/v2/home/CaseStudiesPinned'));
const MetricsStrip = dynamic(() => import('@/components/v2/home/MetricsStrip').then(m => ({ default: m.MetricsStrip })));
const PlaybooksGrid = dynamic(() => import('@/components/v2/home/PlaybooksGrid'));
const ArqAIV2 = dynamic(() => import('@/components/v2/home/ArqAIV2'));
const Marquee = dynamic(() => import('@/components/v2/home/Marquee'));
const NewsGrid = dynamic(() => import('@/components/v2/home/NewsGrid'));
const InsightsGrid = dynamic(() => import('@/components/v2/home/InsightsGrid'));
const CTABand = dynamic(() => import('@/components/v2/home/CTABand'));

export default async function V2HomeContent() {
  const [caseStudies, news, blogs, whitepaper] = await Promise.all([
    fetchFeaturedCaseStudies(4),
    fetchFeaturedNews(4),
    fetchFeaturedBlogs(4),
    fetchFeaturedWhitepaper(),
  ]);

  const topCaseStudy = caseStudies[0] ?? null;
  const topBlog = blogs[0] ?? null;
  const latestPress = news[0] ?? null;

  return (
    <main
      style={{
        background: 'var(--v2-bg)',
        color: 'var(--v2-text-primary)',
        fontFamily: 'var(--font-sans)',
        minHeight: '100vh',
      }}
    >
      {/* Organization + WebSite structured data for SEO/AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': 'https://aciinfotech.com/#organization',
                name: 'ACI Infotech',
                url: 'https://aciinfotech.com',
                logo: 'https://aciinfotech.com/brand/aci-infotech-logo.png',
                description:
                  'Enterprise technology services firm delivering data & AI, cloud infrastructure, and managed operations for Fortune 500 companies.',
                sameAs: [],
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'sales',
                  url: 'https://aciinfotech.com/contact',
                },
                numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 200 },
                foundingDate: '2005',
                knowsAbout: [
                  'Data Engineering',
                  'Applied AI & ML',
                  'Cloud Modernization',
                  'Managed Operations',
                  'Cyber Security',
                  'Enterprise Application Development',
                  'MarTech & CDP',
                  'Digital Transformation',
                ],
              },
              {
                '@type': 'WebSite',
                '@id': 'https://aciinfotech.com/#website',
                url: 'https://aciinfotech.com',
                name: 'ACI Infotech',
                publisher: { '@id': 'https://aciinfotech.com/#organization' },
              },
            ],
          }),
        }}
      />
      <SmoothScrollInit />
      <MotionConfig reducedMotion="user">
        <NavV2
          resources={{
            featuredCaseStudy: topCaseStudy
              ? {
                  slug: topCaseStudy.slug,
                  title: topCaseStudy.title,
                  featured_image_url: topCaseStudy.featured_image_url,
                }
              : null,
            featuredWhitepaper: whitepaper
              ? {
                  slug: whitepaper.slug,
                  title: whitepaper.title,
                  cover_image: whitepaper.cover_image,
                }
              : null,
            featuredBlog: topBlog
              ? {
                  slug: topBlog.slug,
                  title: topBlog.title,
                  featured_image_url: topBlog.featured_image_url,
                  category: topBlog.category,
                }
              : null,
          }}
          company={{
            latestPress: latestPress
              ? {
                  title: latestPress.title,
                  source: latestPress.source,
                  published_at: latestPress.published_at,
                  external_url: latestPress.external_url,
                  image_url: latestPress.image_url,
                }
              : null,
          }}
        />
        <HeroV2 />
        <ServicesDial />
        <CaseStudiesPinned caseStudies={caseStudies} />
        <MetricsStrip />
        <PlaybooksGrid />
        <ArqAIV2 />
        <Marquee />
        <NewsGrid items={news} />
        <InsightsGrid posts={blogs} />
        <CTABand />
        <FooterV2 />
      </MotionConfig>
    </main>
  );
}
