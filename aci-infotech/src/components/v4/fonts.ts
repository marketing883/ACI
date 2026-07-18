import { Funnel_Display, Funnel_Sans, Geist } from 'next/font/google';

// Shared v4 font instances. Lives in a server-safe module (no
// 'use client') so both server pages and client components can import
// the classNames; Next dedupes the underlying font files.

const display = Funnel_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  // CSS variable form so rich-text renderers (dangerouslySetInnerHTML
  // article bodies) can style descendant headings via
  // [font-family:var(--font-v4-display)] without per-node classNames.
  variable: '--font-v4-display',
});
const sans = Funnel_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });
const geist = Geist({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

export const v4Display = display.className;
export const v4DisplayVar = display.variable;
export const v4Sans = sans.className;
export const v4Geist = geist.className;
