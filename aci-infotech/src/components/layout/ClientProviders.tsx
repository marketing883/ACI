'use client';

import dynamic from 'next/dynamic';

// Lazy-load non-critical client components to reduce initial JS bundle
// CookieConsent imports framer-motion (~40 KiB) and has a 1s delay anyway
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
});

// Analytics only load after user grants cookie consent
const ConsentGatedAnalytics = dynamic(
  () => import('@/components/analytics/ConsentGatedAnalytics'),
  { ssr: false }
);

export default function ClientProviders() {
  return (
    <>
      <CookieConsent />
      <ConsentGatedAnalytics />
    </>
  );
}
