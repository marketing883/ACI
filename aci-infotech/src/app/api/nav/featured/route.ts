/**
 * Public endpoint that powers the V2 nav mega menus on inner pages.
 *
 * On the homepage, V2HomeContent is a server component and pre-fetches
 * featured case study / whitepaper / blog / press inline, passing
 * them as props to NavV2. On every other route the layout is the
 * client-only ConditionalLayout, which can't `await` server fetchers
 * — so it calls this endpoint instead.
 *
 * Returns the four spotlight items the Resources + Company mega
 * menus need:
 *   - resources.featuredCaseStudy   (latest published case study)
 *   - resources.featuredWhitepaper  (latest published whitepaper)
 *   - resources.featuredBlog        (latest published blog)
 *   - company.latestPress           (latest published news item)
 *
 * Each fetcher already swallows errors and returns null, so a flaky
 * backend reduces to "no spotlight image" rather than a broken nav.
 *
 * Caching: HTTP Cache-Control gives this a 5-minute fresh window and
 * a 10-minute stale-while-revalidate budget. With a CDN in front,
 * one DB roundtrip serves every visitor for 5 minutes; without a
 * CDN, every browser still caches it for those 5 minutes. The client
 * also dedupes via a module-level promise (see nav-featured-client.ts).
 */

import { NextResponse } from 'next/server';
import { fetchLatestCaseStudy } from '@/lib/v2/fetch-home-data';
import { fetchLatestWhitepaper } from '@/lib/v2/fetch-menu-data';
import { fetchFeaturedBlogs, fetchFeaturedNews } from '@/lib/v2/fetch-home-data';

export const revalidate = 300;

export async function GET() {
  const [caseStudy, whitepaper, blogs, news] = await Promise.all([
    fetchLatestCaseStudy().catch(() => null),
    fetchLatestWhitepaper().catch(() => null),
    fetchFeaturedBlogs(1).catch(() => []),
    fetchFeaturedNews(1).catch(() => []),
  ]);

  const blog = blogs[0] ?? null;
  const press = news[0] ?? null;

  const payload = {
    resources: {
      featuredCaseStudy: caseStudy
        ? {
            slug: caseStudy.slug,
            title: caseStudy.title,
            featured_image_url: caseStudy.featured_image_url,
          }
        : null,
      featuredWhitepaper: whitepaper
        ? {
            slug: whitepaper.slug,
            title: whitepaper.title,
            cover_image: whitepaper.cover_image,
          }
        : null,
      featuredBlog: blog
        ? {
            slug: blog.slug,
            title: blog.title,
            featured_image_url: blog.featured_image_url,
            category: blog.category,
          }
        : null,
    },
    company: {
      latestPress: press
        ? {
            title: press.title,
            source: press.source,
            published_at: press.published_at,
            external_url: press.external_url,
            image_url: press.image_url,
          }
        : null,
    },
  };

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
