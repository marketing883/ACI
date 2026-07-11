import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import HeroDeck from '@/components/v4/hero/HeroDeck';

// Inter for UI text, Instrument Serif for the slide-1 heading. Both are
// scoped to this preview page, not the site's global font.
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], display: 'swap' });
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], display: 'swap' });

export const metadata: Metadata = {
  title: { absolute: 'ACI Infotech' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/' },
};

export default function V4PreviewPage() {
  return (
    <div className={inter.className}>
      <HeroDeck serifClass={instrument.className} />
    </div>
  );
}
