/**
 * Root route — build-time switch between v1 and v2 homepage.
 *
 *   - `NEXT_PUBLIC_USE_V2_HOME=true` → v2 (dark-premium editorial)
 *   - Unset → v1 (original production homepage)
 *
 * Inactive branch is pruned from the bundle at build time.
 *
 * All versions remain reachable for comparison:
 *   /v1             → always v1
 *   /preview/v2-home → always v2
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
