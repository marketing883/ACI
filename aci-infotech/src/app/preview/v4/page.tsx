import type { Metadata } from 'next';
import { Funnel_Display, Funnel_Sans, Geist } from 'next/font/google';
import EditorialHero from '@/components/v4/hero/EditorialHero';
import PartnerMarquee from '@/components/v4/hero/PartnerMarquee';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import PlaybooksSection from '@/components/v4/hero/PlaybooksSection';
import SuccessStories, { SUCCESS_STORY_SLUGS } from '@/components/v4/hero/SuccessStories';
import ServicesSection from '@/components/v4/hero/ServicesSection';
import InsightsSection from '@/components/v4/hero/InsightsSection';
import CtaSection from '@/components/v4/hero/CtaSection';
import SiteFooter from '@/components/v4/hero/SiteFooter';
import {
  getV4FeaturedNews,
  getV4Insights,
  getV4Whitepaper,
  getV4CaseStudyFacts,
} from '@/lib/v4/fetch-v4-home';

// The news/insights/case-study content comes from the CMS at render
// time; revalidate hourly so fresh publishes show up without a deploy.
export const revalidate = 3600;

// Funnel Display for headings, Funnel Sans for body. Scoped to this
// preview, not the site's global font. Geist is scoped to the Foldcraft
// section below.
const display = Funnel_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });
const sans = Funnel_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });
const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: { absolute: 'ACI Infotech — Enterprise Data & AI, Run in Production' },
  description:
    'ACI Infotech builds the enterprise data foundation, puts AI on top, and stays on to run both in production. Databricks, Azure, Snowflake and more.',
  // Preview route stays out of the index until it is promoted to the live
  // homepage; flip these off then.
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/' },
  openGraph: {
    title: 'ACI Infotech — Enterprise Data & AI, Run in Production',
    description:
      'We build the data foundation, put the AI on top, and run both once they are live.',
    url: 'https://aciinfotech.com/',
    siteName: 'ACI Infotech',
    type: 'website',
  },
};

export default async function V4PreviewPage() {
  // One round-trip per content type, all in parallel. Each fetcher
  // degrades to null/empty so the sections fall back to their editorial
  // copy when the CMS is unreachable (e.g. local dev without creds).
  const [news, insights, whitepaper, storyFacts] = await Promise.all([
    getV4FeaturedNews(),
    getV4Insights(3),
    getV4Whitepaper(),
    getV4CaseStudyFacts(SUCCESS_STORY_SLUGS),
  ]);

  return (
    <div className={sans.className}>
      <EditorialHero headingClass={display.className} bodyClass={sans.className} />
      <PartnerMarquee headingClass={display.className} />
      <FoldcraftHero geistClass={geist.className} />
      <PlaybooksSection headingClass={display.className} />
      <SuccessStories headingClass={display.className} facts={storyFacts} />
      <ServicesSection headingClass={display.className} />
      <InsightsSection
        headingClass={display.className}
        news={news}
        insights={insights}
        download={whitepaper}
      />
      <CtaSection />
      <SiteFooter headingClass={display.className} />
    </div>
  );
}
