'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCookieConsent } from '@/components/CookieConsent';

// Lazy-load analytics components - only loaded after consent is granted
const GoogleTagManager = dynamic(() => import('./GoogleTagManager'), { ssr: false });
const LinkedInInsightTag = dynamic(() => import('./LinkedInInsightTag'), { ssr: false });
const VisitorTracker = dynamic(() => import('./VisitorTracker'), { ssr: false });

const COOKIE_CONSENT_KEY = 'aci_cookie_consent';

/**
 * Loads analytics scripts only after the user has granted cookie consent.
 * Listens for consent changes via localStorage events and periodic checks.
 */
export default function ConsentGatedAnalytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = getCookieConsent();
      if (consent) {
        setAnalyticsAllowed(consent.preferences.analytics ?? false);
        setMarketingAllowed(consent.preferences.marketing ?? false);
      }
    };

    // Check on mount
    checkConsent();

    // Listen for consent changes (from CookieConsent component)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === COOKIE_CONSENT_KEY) checkConsent();
    };
    window.addEventListener('storage', handleStorage);

    // Also listen for same-tab changes via a custom event
    const handleConsentChange = () => checkConsent();
    window.addEventListener('cookie-consent-updated', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cookie-consent-updated', handleConsentChange);
    };
  }, []);

  return (
    <>
      {analyticsAllowed && <GoogleTagManager />}
      {analyticsAllowed && <VisitorTracker />}
      {marketingAllowed && <LinkedInInsightTag />}
    </>
  );
}
