# GTM wiring for the contact-form conversion events

The site now pushes two lead events to the dataLayer. The **code side is
done** — these fire on their own. This is the GTM side (container
`GTM-NGTG3ZZ`) to forward them to GA4 and count them as conversions.
About 15 minutes in the GTM UI.

## What the site pushes

On the contact form:

| dataLayer `event`        | When it fires                     | Parameters on the push |
|--------------------------|-----------------------------------|------------------------|
| `form_start`             | First field the visitor touches   | `form_location` |
| `contact_form_submitted` | Successful submit                 | `form_location`, `inquiry_type`, `has_company`, `has_phone`, plus any captured attribution: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `referrer`, `landing_page` |

## Set it up in GTM

**1. dataLayer variables** (Variables → New → Data Layer Variable) — one
each for the parameters you want on the GA4 event. At minimum:
`inquiry_type`, `utm_source`, `utm_medium`, `utm_campaign`, `gclid`.
(Name each variable `dlv - <param>` for clarity.)

**2. Triggers** (Triggers → New → Custom Event):
- `CE - form_start` → Event name: `form_start`
- `CE - contact_form_submitted` → Event name: `contact_form_submitted`

**3. GA4 event tags** (Tags → New → Google Analytics: GA4 Event; point at
your existing GA4 Configuration tag / Measurement ID):
- Tag `GA4 - form_start`, Event name `form_start`, trigger `CE - form_start`.
- Tag `GA4 - generate_lead`, Event name `generate_lead` (GA4's standard
  lead event), trigger `CE - contact_form_submitted`. Add event
  parameters mapping the dataLayer variables (utm_source, utm_campaign,
  gclid, inquiry_type, …).

**4. Mark the conversion.** In **GA4** (Admin → Events → mark as key
event) flag `generate_lead` as a key event / conversion. If you run
Google Ads, import `generate_lead` as a conversion there.

## Verify

- GA4 **DebugView** (or Tag Assistant): fill the contact form → you
  should see `form_start` on first keystroke and `generate_lead` on
  submit, with the `utm_*` / `gclid` parameters attached when you arrived
  via a tagged link (e.g. `?utm_source=google&gclid=test`).

## Note on consent

Because analytics currently **load-gate** on consent (see
`docs/consent-mode-v2.md`), these events only reach GA4 once the visitor
accepts cookies. A visitor who submits without accepting won't be
counted until Consent Mode v2 is adopted. Everything above still applies;
Consent Mode just widens the coverage.
