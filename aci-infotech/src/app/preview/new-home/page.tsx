/**
 * New homepage (staging review link: /preview/new-home).
 *
 * A ground-up redesign, art-directed after the Persistent Systems homepage
 * the CEO asked us to match for polish, built from ACI's own approved copy
 * and verified numbers. Section order, dark and light alternating:
 *
 *   hero (dark) → who we are (light) → four pinned chapters: build,
 *   modernize, run, innovate (dark) → services index (light) → AI with
 *   ArqAI Labs (dark) → industries bento (light) → success stories rail
 *   (midnight) → platforms (white) → why ACI + playbook ledger (dark) →
 *   insights (light) → FAQ (dark) → final call to action → footer.
 *
 * Components live in src/components/newhome. The live homepage's v5
 * components are untouched; the nav, footer, FAQ, stories data, and CMS
 * fetchers are shared with it.
 *
 * Marked noindex, and /preview/ is disallowed in robots.ts. On promotion
 * to `/` it should take over the root page's metadata and JSON-LD.
 */

import type { Metadata } from 'next';
import NHHero from '@/components/newhome/NHHero';
import NHIntro from '@/components/newhome/NHIntro';
import NHChapters from '@/components/newhome/NHChapters';
import NHServices from '@/components/newhome/NHServices';
import NHAgentic from '@/components/newhome/NHAgentic';
import NHIndustries from '@/components/newhome/NHIndustries';
import NHStories from '@/components/newhome/NHStories';
import NHPlatforms from '@/components/newhome/NHPlatforms';
import NHWhy from '@/components/newhome/NHWhy';
import NHInsights from '@/components/newhome/NHInsights';
import NHCta from '@/components/newhome/NHCta';
import '@/components/newhome/newhome.css';
import { SmoothScroll } from '@/components/v2/craft/SmoothScroll';
import V5HomeFaq from '@/components/v5/V5HomeFaq';
import SiteFooter from '@/components/v4/hero/SiteFooter';
import { SUCCESS_STORY_SLUGS } from '@/components/v5/success-stories-data';
import { v4Display, v4Sans } from '@/components/v4/fonts';
import {
  getV4FeaturedNews,
  getV4Insights,
  getV4Whitepaper,
  getV4CaseStudyFacts,
} from '@/lib/v4/fetch-v4-home';

export const metadata: Metadata = {
  title: 'New Homepage Preview | ACI Infotech',
  description: 'Design preview of the new homepage.',
  robots: { index: false, follow: false },
};

// Same CMS revalidation cadence as the root page.
export const revalidate = 3600;

export default async function NewHomePreviewPage() {
  const [news, insights, whitepaper, storyFacts] = await Promise.all([
    getV4FeaturedNews(),
    getV4Insights(3),
    getV4Whitepaper(),
    getV4CaseStudyFacts(SUCCESS_STORY_SLUGS),
  ]);

  return (
    <SmoothScroll>
      <div data-nh className={`bg-[#05070d] ${v4Sans}`}>
        <main>
          <NHHero headingClass={v4Display} />
          <NHIntro headingClass={v4Display} />
          <NHChapters headingClass={v4Display} />
          <NHServices headingClass={v4Display} />
          <NHAgentic headingClass={v4Display} />
          <NHIndustries headingClass={v4Display} />
          <NHStories headingClass={v4Display} facts={storyFacts} />
          <NHPlatforms headingClass={v4Display} />
          <NHWhy headingClass={v4Display} />
          <NHInsights headingClass={v4Display} news={news} insights={insights} download={whitepaper} />
          <V5HomeFaq headingClass={v4Display} />
          <NHCta headingClass={v4Display} />
        </main>
        <SiteFooter headingClass={v4Display} />
      </div>
    </SmoothScroll>
  );
}
