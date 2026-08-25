/**
 * v5 homepage preview — the dark, template-inspired redesign.
 * Design source: docs/homepage-v5-ideation.md and the approved design
 * canvas. Content is frozen to the v4 staging homepage; only the
 * presentation changed.
 *
 * Section order: office-scene hero → "AI in production" ticker →
 * partner marquee → underwater "why AI stalls" → "the playbook vault"
 * ticker → vault ledger → success stories → services (expanding
 * columns) → insights → FAQ → "let's talk" ticker → footer. No CTA
 * sections anywhere; the footer's "Start a project" is the only ask.
 *
 * Marked noindex: this is a design preview, not a public page. On
 * promotion to `/` it inherits the root page's metadata and JSON-LD.
 */

import type { Metadata } from 'next';
import V5Hero from '@/components/v5/V5Hero';
import Ticker from '@/components/v5/Ticker';
import V5Foldcraft from '@/components/v5/V5Foldcraft';
import VaultLedger from '@/components/v5/VaultLedger';
import V5SuccessStories, { SUCCESS_STORY_SLUGS } from '@/components/v5/V5SuccessStories';
import ServicesColumns from '@/components/v5/ServicesColumns';
import V5Insights from '@/components/v5/V5Insights';
import V5HomeFaq from '@/components/v5/V5HomeFaq';
import PartnerMarquee from '@/components/v4/hero/PartnerMarquee';
import SiteFooter from '@/components/v4/hero/SiteFooter';
import { v4Display, v4Sans } from '@/components/v4/fonts';
import {
  getV4FeaturedNews,
  getV4Insights,
  getV4Whitepaper,
  getV4CaseStudyFacts,
} from '@/lib/v4/fetch-v4-home';

export const metadata: Metadata = {
  title: 'Homepage v5 Preview | ACI Infotech',
  description: 'Design preview of the v5 homepage.',
  robots: { index: false, follow: false },
};

// Same CMS revalidation cadence as the root page.
export const revalidate = 3600;

export default async function V5PreviewPage() {
  const [news, insights, whitepaper, storyFacts] = await Promise.all([
    getV4FeaturedNews(),
    getV4Insights(3),
    getV4Whitepaper(),
    getV4CaseStudyFacts(SUCCESS_STORY_SLUGS),
  ]);

  return (
    <div className={`bg-[#0a0b10] ${v4Sans}`}>
      <main>
        <V5Hero headingClass={v4Display} />
        <Ticker text="AI in production" headingClass={v4Display} />
        <PartnerMarquee headingClass={v4Display} />
        <V5Foldcraft headingClass={v4Display} />
        <Ticker text="The playbook vault" headingClass={v4Display} />
        <VaultLedger headingClass={v4Display} />
        <V5SuccessStories headingClass={v4Display} facts={storyFacts} />
        <ServicesColumns headingClass={v4Display} />
        <V5Insights headingClass={v4Display} news={news} insights={insights} download={whitepaper} />
        <V5HomeFaq headingClass={v4Display} />
        <Ticker text="Let's talk" headingClass={v4Display} background="#080a12" />
      </main>
      <SiteFooter headingClass={v4Display} />
    </div>
  );
}
