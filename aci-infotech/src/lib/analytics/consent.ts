// Google Consent Mode v2 wiring.
//
// CONSENT_DEFAULT_SCRIPT runs as an inline <script> in the document head
// (server-rendered, so it executes on parse — before GTM loads). It sets
// every consent signal to "denied" by default, then immediately replays a
// returning visitor's stored choice so they aren't re-denied. GTM then
// loads unconditionally; Google's tags read these signals natively
// (cookieless pings + conversion modeling while denied), and the
// third-party tags are gated on consent inside the container.
//
// updateConsent() is called by the cookie banner to flip signals to
// "granted" when the visitor accepts.

export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent','default',{
  ad_storage:'denied',
  analytics_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});
try {
  var s = localStorage.getItem('aci_cookie_consent');
  if (s) {
    var c = JSON.parse(s);
    var live = !c.expiry || new Date(c.expiry) > new Date();
    if (live && c.preferences) {
      var a = c.preferences.analytics ? 'granted' : 'denied';
      var m = c.preferences.marketing ? 'granted' : 'denied';
      gtag('consent','update',{
        analytics_storage:a, ad_storage:m, ad_user_data:m, ad_personalization:m
      });
    }
  }
} catch (e) {}
`;

interface ConsentWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

/**
 * Fire a Consent Mode `update` from the cookie banner. Analytics consent
 * controls analytics_storage; marketing consent controls the three ad
 * signals. Falls back to a raw dataLayer push if gtag isn't defined yet.
 */
export function updateConsent(prefs: { analytics?: boolean; marketing?: boolean }): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as ConsentWindow;
  w.dataLayer = w.dataLayer || [];

  const analytics = prefs.analytics ? 'granted' : 'denied';
  const marketing = prefs.marketing ? 'granted' : 'denied';
  const consent = {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  };

  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', consent);
  } else {
    w.dataLayer.push(['consent', 'update', consent]);
  }
}
