import type { Metadata } from 'next';
import { Funnel_Display, Funnel_Sans, Geist } from 'next/font/google';
import EditorialHero from '@/components/v4/hero/EditorialHero';
import PartnerMarquee from '@/components/v4/hero/PartnerMarquee';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import SuccessStories from '@/components/v4/hero/SuccessStories';
import ServicesSection from '@/components/v4/hero/ServicesSection';

// Funnel Display for headings, Funnel Sans for body. Scoped to this
// preview, not the site's global font. Geist is scoped to the Foldcraft
// section below.
const display = Funnel_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });
const sans = Funnel_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600'], display: 'swap' });
const geist = Geist({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: { absolute: 'ACI Infotech' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/' },
};

export default function V4PreviewPage() {
  return (
    <div className={sans.className}>
      <EditorialHero headingClass={display.className} bodyClass={sans.className} />
      <PartnerMarquee headingClass={display.className} />
      <FoldcraftHero geistClass={geist.className} />
      <SuccessStories headingClass={display.className} />
      <ServicesSection headingClass={display.className} />
    </div>
  );
}
