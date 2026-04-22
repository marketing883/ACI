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
import ArqAIV2 from '@/components/v2/home/ArqAIV2';
import CTABand from '@/components/v2/home/CTABand';
import FooterV2 from '@/components/v2/home/FooterV2';
import {
  fetchFeaturedCaseStudies,
  fetchFeaturedNews,
  fetchFeaturedBlogs,
} from '@/lib/v2/fetch-home-data';
import { fetchFeaturedWhitepaper } from '@/lib/v2/fetch-menu-data';

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
        <ArqAIV2 />
        <CTABand />
        <FooterV2 />
      </MotionConfig>
    </main>
  );
}
