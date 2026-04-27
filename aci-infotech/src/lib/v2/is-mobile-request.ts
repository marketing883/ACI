/**
 * Server-side mobile detection used by V2HomeContent to branch
 * between the desktop tree and the mobile-only tree.
 *
 * Strategy: phone-only. Tablets (iPad, Android tablet form factor)
 * fall through to the desktop layout because:
 *   - their viewports are wide enough to render the full tree
 *     without horizontal pain
 *   - the desktop tree's media queries already accommodate them
 *
 * Override: a `?layout=mobile` or `?layout=desktop` query string
 * forces the branch in either direction. Used by QA and Lighthouse
 * audits, and as a safety valve if a UA we don't recognize lands on
 * the wrong tree.
 *
 * Trade-off: UA sniffing is ~98% reliable, never 100%. Anyone
 * spoofing a desktop UA on a phone will see the desktop tree. That's
 * acceptable for an opt-out, not an opt-in, behavior.
 *
 * Caching: callers that branch on the result must add `Vary:
 * User-Agent` to the response (or to the route in next.config.ts) so
 * shared caches keep one entry per variant.
 */

import { headers } from 'next/headers';

// Conservative phone match. Excludes plain "iPad" and "Android" (no
// "Mobile" token) so tablets fall through.
const PHONE_UA = /(iphone|ipod|android.+mobile|windows phone|iemobile|blackberry|bb10|opera mini)/i;

export async function isMobileRequest(searchParams?: {
  layout?: string | string[];
}): Promise<boolean> {
  // QA / Lighthouse override wins over UA detection.
  const layout = Array.isArray(searchParams?.layout)
    ? searchParams?.layout[0]
    : searchParams?.layout;
  if (layout === 'mobile') return true;
  if (layout === 'desktop') return false;

  const h = await headers();
  const ua = h.get('user-agent') ?? '';
  return PHONE_UA.test(ua);
}
