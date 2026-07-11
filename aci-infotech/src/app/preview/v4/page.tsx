import type { Metadata } from 'next';
import { Funnel_Display, Funnel_Sans } from 'next/font/google';
import HeroDeck from '@/components/v4/hero/HeroDeck';
import PartnerMarquee from '@/components/v4/hero/PartnerMarquee';

// Funnel Display for headings, Funnel Sans for body. Scoped to this
// preview, not the site's global font.
const display = Funnel_Display({ subsets: ['latin'], weight: ['500', '600', '700', '800'], display: 'swap' });
const sans = Funnel_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600'], display: 'swap' });

export const metadata: Metadata = {
  title: { absolute: 'ACI Infotech' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/' },
};

export default function V4PreviewPage() {
  return (
    <div className={sans.className}>
      <HeroDeck headingClass={display.className} />
      <PartnerMarquee headingClass={display.className} />
    </div>
  );
}
