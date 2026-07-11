import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import VexHero from '@/components/v4/VexHero';

// Inter, scoped to this preview page (does not change the site's global
// font). Applied to the hero root so all text inside inherits it.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: { absolute: 'ACI Infotech' },
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/' },
};

export default function V4PreviewPage() {
  return (
    <div className={inter.className}>
      <VexHero />
    </div>
  );
}
