/**
 * v3 homepage preview — "Data and AI" reframe.
 *
 * Standalone route, fully isolated from the live site. It renders its
 * own nav, footer, and design system (src/components/v3) and shares no
 * chrome with the production homepage. ConditionalLayout bypasses the
 * v1/v2 Navigation/Footer for /preview/v3, the same way it already does
 * for /preview/v2 and /lp.
 *
 * Marked noindex: this is a design preview, not a public page.
 */

import type { Metadata } from 'next';
import V3Home from '@/components/v3/V3Home';

export const metadata: Metadata = {
  title: 'ACI Infotech | Data and AI, in production (preview)',
  description:
    'Preview of the Data and AI homepage. We engineer the data foundation, build the AI on top, and run it in production.',
  robots: { index: false, follow: false },
};

export default function V3PreviewPage() {
  return <V3Home />;
}
