/**
 * New homepage (staging review link: /preview/new-home).
 *
 * A ground-up redesign, art-directed after the Persistent Systems homepage
 * the CEO asked us to match for polish, built from ACI's approved site copy
 * and the 2026 Data and AI capability deck (deck-data.ts). Per the brief,
 * it carries no case studies or case-study results. Dark and light scenes
 * alternate; each light scene rises over the last on a Curtain:
 *
 *   hero → who we are → four pinned chapters → services index → seven
 *   Data & AI offerings (horizontal, pinned) → accelerator portfolio →
 *   frameworks → industries → AI with ArqAI Labs → partners and
 *   certifications → why ACI → insights → FAQ → call to action → footer.
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
import NHOfferings from '@/components/newhome/NHOfferings';
import NHAccelerators from '@/components/newhome/NHAccelerators';
import NHFrameworks from '@/components/newhome/NHFrameworks';
import Curtain from '@/components/newhome/Curtain';
import NHPlatforms from '@/components/newhome/NHPlatforms';
import NHWhy from '@/components/newhome/NHWhy';
import NHInsights from '@/components/newhome/NHInsights';
import NHCta from '@/components/newhome/NHCta';
import '@/components/newhome/newhome.css';
import { SmoothScroll } from '@/components/v2/craft/SmoothScroll';
import V5HomeFaq from '@/components/v5/V5HomeFaq';
import SiteFooter from '@/components/v4/hero/SiteFooter';
import { v4Display, v4Sans } from '@/components/v4/fonts';
import {
  getV4FeaturedNews,
  getV4Insights,
  getV4Whitepaper,
} from '@/lib/v4/fetch-v4-home';

export const metadata: Metadata = {
  title: 'New Homepage Preview | ACI Infotech',
  description: 'Design preview of the new homepage.',
  robots: { index: false, follow: false },
};

// Same CMS revalidation cadence as the root page.
export const revalidate = 3600;

export default async function NewHomePreviewPage() {
  const [news, insights, whitepaper] = await Promise.all([getV4FeaturedNews(), getV4Insights(3), getV4Whitepaper()]);

  return (
    <SmoothScroll>
      <div data-nh className={`bg-[#05070d] ${v4Sans}`}>
        <main>
          <NHHero headingClass={v4Display} />
          <Curtain>
            <NHIntro headingClass={v4Display} />
          </Curtain>
          <NHChapters headingClass={v4Display} />
          <Curtain>
            <NHServices headingClass={v4Display} />
          </Curtain>
          <NHOfferings headingClass={v4Display} />
          <Curtain>
            <NHAccelerators headingClass={v4Display} />
          </Curtain>
          <NHFrameworks headingClass={v4Display} />
          <Curtain>
            <NHIndustries headingClass={v4Display} />
          </Curtain>
          <NHAgentic headingClass={v4Display} />
          <Curtain>
            <NHPlatforms headingClass={v4Display} />
          </Curtain>
          <NHWhy headingClass={v4Display} />
          <Curtain>
            <NHInsights headingClass={v4Display} news={news} insights={insights} download={whitepaper} />
          </Curtain>
          <V5HomeFaq headingClass={v4Display} />
          <NHCta headingClass={v4Display} />
        </main>
        <SiteFooter headingClass={v4Display} />
      </div>
    </SmoothScroll>
  );
}
