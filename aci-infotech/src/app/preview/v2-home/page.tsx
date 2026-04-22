/**
 * v2 Homepage preview — full dark premium homepage matching the
 * design handoff. Pulls real featured content (case studies, news,
 * blogs, whitepaper) from Supabase; falls back to curated placeholders
 * when the CMS returns nothing so dev always shows the right look.
 *
 * Route: /preview/v2-home
 *
 * Wrapped in ConditionalLayout's v2-preview bypass, so no v1 Nav/Footer
 * is rendered on top of this page.
 */

import { MotionConfig } from 'framer-motion';
import NavV2 from '@/components/v2/nav/NavV2';
import HeroV2 from '@/components/v2/home/HeroV2';
import PlaybooksGrid from '@/components/v2/home/PlaybooksGrid';
import ServicesDial from '@/components/v2/home/ServicesDial';
import CaseStudiesPinned from '@/components/v2/home/CaseStudiesPinned';
import Marquee from '@/components/v2/home/Marquee';
import NewsGrid from '@/components/v2/home/NewsGrid';
import InsightsGrid from '@/components/v2/home/InsightsGrid';
import CTABand from '@/components/v2/home/CTABand';
import FooterV2 from '@/components/v2/home/FooterV2';
import {
  fetchFeaturedCaseStudies,
  fetchFeaturedNews,
  fetchFeaturedBlogs,
} from '@/lib/v2/fetch-home-data';
import { fetchFeaturedWhitepaper } from '@/lib/v2/fetch-menu-data';

// Keep the page dynamic so CMS changes show up without a rebuild.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'ACI Infotech — Engineering the signal in the noise',
  description:
    'We build, ship and run production-grade systems for Fortune 500 operations. AI, cloud, data, and the unglamorous platform work that holds them together.',
};

export default async function V2HomePage() {
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
        // NOTE: no overflow on <main>. Any overflow (including
        // overflow-x: clip) can break position: sticky on nested
        // children in some browser implementations. Horizontal
        // clipping for the case-studies pinned-scroll track lives
        // on the cs-pin element, which is where it belongs.
      }}
    >
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
            // featuredPlaybook is derived inside NavV2 from the PLAYBOOKS
            // client-side constant — passing it from this server component
            // would wrap the import as a client-reference proxy.
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
        <PlaybooksGrid />
        <ServicesDial />
        <CaseStudiesPinned caseStudies={caseStudies} />
        <Marquee />
        <NewsGrid items={news} />
        <InsightsGrid posts={blogs} />
        <CTABand />
        <FooterV2 />
      </MotionConfig>
    </main>
  );
}
