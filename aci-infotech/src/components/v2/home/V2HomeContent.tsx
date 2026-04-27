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
 * Below-fold sections use content-visibility: auto to skip rendering
 * until they approach the viewport. No dynamic() imports — those
 * cause React hydration mismatches in server components.
 */

import { MotionConfig } from 'framer-motion';
import { SmoothScrollInit } from '@/components/v2/craft/SmoothScroll';
import NavV2 from '@/components/v2/nav/NavV2';
import HeroV2 from '@/components/v2/home/HeroV2';
import ServicesDial from '@/components/v2/home/ServicesDial';
import CaseStudiesPinned from '@/components/v2/home/CaseStudiesPinned';
import { MetricsStrip } from '@/components/v2/home/MetricsStrip';
import PlaybooksGrid from '@/components/v2/home/PlaybooksGrid';
import ArqAIV2 from '@/components/v2/home/ArqAIV2';
import Marquee from '@/components/v2/home/Marquee';
import NewsGrid from '@/components/v2/home/NewsGrid';
import InsightsGrid from '@/components/v2/home/InsightsGrid';
import CTABand from '@/components/v2/home/CTABand';
import FooterV2 from '@/components/v2/home/FooterV2';
import MobileV2Home from '@/components/v2/home/mobile/MobileV2Home';
import { isMobileRequest } from '@/lib/v2/is-mobile-request';
import {
  fetchFeaturedCaseStudies,
  fetchFeaturedNews,
  fetchFeaturedBlogs,
} from '@/lib/v2/fetch-home-data';
import { fetchFeaturedWhitepaper } from '@/lib/v2/fetch-menu-data';

const LAZY_SECTION: React.CSSProperties = {
  contentVisibility: 'auto' as string,
  containIntrinsicSize: 'auto 600px',
} as React.CSSProperties;

interface Props {
  searchParams?: { layout?: string | string[] };
}

export default async function V2HomeContent({ searchParams }: Props = {}) {
  const isMobile = await isMobileRequest(searchParams);

  // Mobile path skips news/blogs/whitepaper fetches the desktop tree
  // needs for the mega-menu and below-fold sections. Three saved DB
  // round trips per phone request.
  if (isMobile) {
    const caseStudies = await fetchFeaturedCaseStudies(3);
    return <MobileV2Home caseStudies={caseStudies} />;
  }

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
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'sales',
                  url: 'https://aciinfotech.com/contact',
                },
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
        <div style={LAZY_SECTION}><ServicesDial /></div>
        <div style={LAZY_SECTION}><CaseStudiesPinned caseStudies={caseStudies} /></div>
        <div style={LAZY_SECTION}><MetricsStrip /></div>
        <div style={LAZY_SECTION}><PlaybooksGrid /></div>
        <div style={LAZY_SECTION}><ArqAIV2 /></div>
        <div style={LAZY_SECTION}><Marquee /></div>
        <div style={LAZY_SECTION}><NewsGrid items={news} /></div>
        <div style={LAZY_SECTION}><InsightsGrid posts={blogs} /></div>
        <div style={LAZY_SECTION}><CTABand /></div>
        <FooterV2 />
      </MotionConfig>
    </main>
  );
}
