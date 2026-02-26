'use client';

import Script from 'next/script';

// LinkedIn Partner ID
const LINKEDIN_PARTNER_ID = '7426420';

// Declare LinkedIn tracking function on window
declare global {
  interface Window {
    lintrk: (action: string, data?: { conversion_id: number }) => void;
    _linkedin_data_partner_ids: string[];
  }
}

// Conversion IDs for different form types
// These should be created in LinkedIn Campaign Manager > Conversions
export const LINKEDIN_CONVERSIONS = {
  CONTACT_FORM: 19847316,      // Contact form submission
  WHITEPAPER_DOWNLOAD: 19847324, // Whitepaper download
  PLAYBOOK_ACCESS: 19847332,   // Playbook access request
  NEWSLETTER_SIGNUP: 19847340, // Newsletter subscription
  DEMO_REQUEST: 19847348,      // Demo/consultation request
} as const;

/**
 * Track a LinkedIn conversion event
 * Call this when a form is successfully submitted
 */
export function trackLinkedInConversion(conversionId: number) {
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { conversion_id: conversionId });
  }
}

/**
 * Track contact form submission
 */
export function trackContactFormConversion() {
  trackLinkedInConversion(LINKEDIN_CONVERSIONS.CONTACT_FORM);
}

/**
 * Track whitepaper download
 */
export function trackWhitepaperDownloadConversion() {
  trackLinkedInConversion(LINKEDIN_CONVERSIONS.WHITEPAPER_DOWNLOAD);
}

/**
 * Track playbook access request
 */
export function trackPlaybookAccessConversion() {
  trackLinkedInConversion(LINKEDIN_CONVERSIONS.PLAYBOOK_ACCESS);
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignupConversion() {
  trackLinkedInConversion(LINKEDIN_CONVERSIONS.NEWSLETTER_SIGNUP);
}

/**
 * Track demo/consultation request
 */
export function trackDemoRequestConversion() {
  trackLinkedInConversion(LINKEDIN_CONVERSIONS.DEMO_REQUEST);
}

/**
 * LinkedIn Insight Tag Component
 * Add this to your root layout to enable LinkedIn tracking
 */
export default function LinkedInInsightTag() {
  return (
    <>
      {/* LinkedIn Insight Tag - Base Code */}
      <Script id="linkedin-insight-tag" strategy="afterInteractive">
        {`
          _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}
      </Script>
      <Script id="linkedin-insight-loader" strategy="afterInteractive">
        {`
          (function(l) {
            if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
            window.lintrk.q=[]}
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);
          })(window.lintrk);
        `}
      </Script>
      {/* LinkedIn noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
