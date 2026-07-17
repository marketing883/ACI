/**
 * Shared OpenGraph image constants.
 *
 * Next.js SHALLOW-merges the top-level `openGraph` metadata key: a page
 * that sets `openGraph` at all replaces the root layout's object entirely,
 * including `images`. Every per-page `openGraph` therefore has to carry its
 * own `images` array or the page ships with no og:image / twitter:image.
 * Import these constants instead of re-declaring the literal per page.
 */

export const DEFAULT_OG_IMAGES = [
  {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'ACI Infotech: Build the AI foundation. Run it in production.',
  },
];

export const DEFAULT_TWITTER_IMAGES = ['/og-image.png'];
