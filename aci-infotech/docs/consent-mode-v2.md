# Consent Mode v2 — spec and decision doc

Status: **proposal, not implemented.** This documents what moving to
Google Consent Mode v2 would involve, why, and the trade-offs, so the
change can be approved (or declined) deliberately. No code has changed.

---

## Where we are today

The site **load-gates** analytics. `ConsentGatedAnalytics` only injects
GTM / GA4 / LinkedIn scripts *after* the visitor grants consent in the
`CookieConsent` banner (consent is read from the `aci_cookie_consent`
localStorage key and the `cookie-consent-updated` event; GTM container is
`GTM-NGTG3ZZ`).

Consequence: if a visitor **rejects** cookies, no tag ever loads, so we
capture **nothing** about them — including any conversion they complete.
Those conversions are simply invisible. On typical B2B traffic that's a
meaningful chunk of pipeline you can't see or optimize toward.

## What Consent Mode v2 changes

Instead of blocking the tags, you **load** GTM on every page but tell
Google the consent state:

- Before GTM loads, set consent **defaults to `denied`** for
  `ad_storage`, `analytics_storage`, `ad_user_data`,
  `ad_personalization`.
- When the visitor accepts (all or by category), fire a consent
  **`update`** flipping the relevant keys to `granted`.
- While denied, Google's tags send **cookieless pings** (no identifiers,
  no cookies). Google uses these to **model** the conversions and traffic
  you'd otherwise lose, and it's what Google Ads now expects for EEA
  traffic.

Net effect: you recover a large share of the currently-invisible
conversions, and stay measurable without setting cookies before consent.

## The decision this needs

This is a **privacy-posture change**, not just code. Under Consent Mode
v2, GTM loads *before* consent (in cookieless-denied mode). That is the
Google-recommended, widely-used pattern, but whether "load the tag
manager in denied mode pre-consent" is acceptable is a call for whoever
owns your privacy policy / cookie compliance. Two things to confirm
before implementing:

1. Your privacy owner is comfortable with GTM loading pre-consent in
   denied/cookieless mode.
2. Your cookie policy text reflects it.

If either is uncertain, keep the current load-gating until it's resolved.

## Implementation plan (when approved)

Code side (small, ~half a day):

1. **Add a consent-default init** that runs before GTM. A tiny inline
   script in the document `<head>` (or a `beforeInteractive` next/script):
   ```js
   window.dataLayer = window.dataLayer || [];
   function gtag(){dataLayer.push(arguments);}
   gtag('consent', 'default', {
     ad_storage: 'denied',
     analytics_storage: 'denied',
     ad_user_data: 'denied',
     ad_personalization: 'denied',
     wait_for_update: 500,
   });
   ```
2. **Load GTM unconditionally.** Move `GTMHead`/`GTMBody` out of
   `ConsentGatedAnalytics`'s gate so GTM is always present. Keep LinkedIn
   / other marketing pixels gated on `marketing` consent as they are.
3. **Fire consent `update` from `CookieConsent`.** When the banner writes
   `aci_cookie_consent`, also push:
   ```js
   gtag('consent', 'update', {
     analytics_storage: prefs.analytics ? 'granted' : 'denied',
     ad_storage: prefs.marketing ? 'granted' : 'denied',
     ad_user_data: prefs.marketing ? 'granted' : 'denied',
     ad_personalization: prefs.marketing ? 'granted' : 'denied',
   });
   ```
4. **Persist prior consent** on repeat visits: replay the stored decision
   as an `update` on load (so returning visitors aren't re-defaulted to
   denied after they've chosen).

GTM side (container `GTM-NGTG3ZZ`, done in the GTM UI — I provide a
container export or click-by-click steps):

1. Turn on **Consent Overview** (Admin → Container Settings → Enable
   consent overview) and set each tag's **built-in consent checks**
   (GA4 = `analytics_storage`; Google Ads = `ad_storage` + `ad_user_data`
   + `ad_personalization`).
2. Add a **Consent Initialization** trigger if not present.
3. Confirm GA4 config + the `form_start` / `contact_form_submitted`
   conversion tags (already pushed to the dataLayer by the site) respect
   consent.

## Verify after rollout

- Google Tag Assistant → load the site without accepting: GA4 fires in
  **denied/cookieless** mode (no `_ga` cookie set).
- Accept: consent `update` fires, cookies set, tags run normally.
- GA4 DebugView shows `form_start` and `contact_form_submitted`.
- Google Ads → Conversions shows "modeled conversions" accruing.

## If you'd rather not

Staying on load-gating is a legitimate, more-conservative choice. The
cost is only the modeled conversions from consent-rejecters. Everything
else in the tracking work (attribution capture, `form_start`, storing
attribution with the lead) works the same either way.
