/**
 * Root route — build-time switch between v1, v2, and v3 homepage.
 *
 *   - `NEXT_PUBLIC_USE_V3_HOME=true` → v3 (scroll-driven 3D world)
 *   - `NEXT_PUBLIC_USE_V2_HOME=true` → v2 (dark-premium editorial)
 *   - Neither set → v1 (original production homepage)
 *
 * v3 takes priority over v2 when both are set. Inactive branches are
 * pruned from the bundle at build time.
 *
 * All versions remain reachable for comparison:
 *   /v1             → always v1
 *   /preview/v2-home → always v2
 *   /preview/v3-home → always v3
 */

export const revalidate = 60;

import V2HomeContent from '@/components/v2/home/V2HomeContent';
import V1HomePage from './v1/page';

const USE_V3_HOME = process.env.NEXT_PUBLIC_USE_V3_HOME === 'true';
const USE_V2_HOME = process.env.NEXT_PUBLIC_USE_V2_HOME === 'true';

export default async function HomePage() {
  if (USE_V3_HOME) {
    const V3HomeContent = (await import('@/components/v3/home/V3HomeContent')).default;
    return <V3HomeContent />;
  }
  if (USE_V2_HOME) {
    return <V2HomeContent />;
  }
  return <V1HomePage />;
}
