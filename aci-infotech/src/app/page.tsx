/**
 * Root route — build-time switch between v1 and v2 homepage.
 *
 *   - When `NEXT_PUBLIC_USE_V2_HOME=true` at build time (staging), `/`
 *     renders the v2 homepage (dark-premium, editorial layout).
 *   - When unset (production), `/` renders the v1 homepage exactly as
 *     it has always rendered.
 *
 * `NEXT_PUBLIC_*` env vars are inlined at build time, so the constant
 * below collapses to a literal `true` or `false` before the Next.js
 * bundler runs — the inactive branch is pruned out of the bundle and
 * there is no runtime switch. This guarantees deterministic output
 * per environment and no shared bundle state between prod and
 * staging builds.
 *
 * Both builds also expose `/v1` (always v1) and `/preview/v2-home`
 * (always v2) so the other version remains reachable for comparison.
 */

export const revalidate = 60;

import V2HomeContent from '@/components/v2/home/V2HomeContent';
import V1HomePage from './v1/page';

const USE_V2_HOME = process.env.NEXT_PUBLIC_USE_V2_HOME === 'true';

export default async function HomePage() {
  if (USE_V2_HOME) {
    return <V2HomeContent />;
  }
  return <V1HomePage />;
}
