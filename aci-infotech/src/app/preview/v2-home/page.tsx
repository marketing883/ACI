/**
 * v2 Homepage preview route.
 *
 * Always rendered on every build (staging and production), regardless
 * of the `NEXT_PUBLIC_USE_V2_HOME` flag. Share one source of truth
 * with `/` (when staged) by delegating to the `V2HomeContent` server
 * component — any edit to v2 content is automatically reflected on
 * both URLs.
 *
 * Route: /preview/v2-home
 *
 * Wrapped in ConditionalLayout's v2-preview bypass (path starts with
 * `/preview/v2`), so no v1 Nav/Footer is rendered on top of this.
 */

import V2HomeContent from '@/components/v2/home/V2HomeContent';

// Keep the page dynamic so CMS changes show up without a rebuild.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'ACI Infotech — Engineering the signal in the noise',
  description:
    'We build, ship and run production-grade systems for Fortune 500 operations. AI, cloud, data, and the unglamorous platform work that holds them together.',
};

export default async function V2HomePreviewPage() {
  return <V2HomeContent />;
}
