# GTM audit — container GTM-NGTG3ZZ (workspace 12)

Audit of the exported container. GA4 property is **G-145NLC9TW3**;
server-side tagging is in use (Cloud Run endpoint). Fixes are ordered by
impact. I can't apply these from here (no console access), so each is a
UI step. Start with P0 — it's 30 seconds and it's currently breaking the
lead tracking.

---

## P0 — the lead events are firing into a dead property

**Finding:** the variable **`const - GA4 Measurement ID`** is still
`G-XXXXXXXXXX` (the placeholder from the import). Your real GA4 ID is
**`G-145NLC9TW3`**. Both new tags (`GA4 Event - form_start`,
`GA4 Event - generate_lead`) use this variable as their Measurement ID,
so every lead event is being sent to a property that doesn't exist.

**Fix:** Variables → **`const - GA4 Measurement ID`** → set value to
`G-145NLC9TW3` → Save → **Publish**.

**Also required:** the two events only fire once the site code that emits
them (`form_start` / `contact_form_submitted`) is **deployed to prod**
(it's on the `claude/bold-mccarthy-3tmn28` branch). GTM fix + deploy, then
they work.

---

## P1 — high impact

### 1. No hostname guard → your GA4 is polluted
Every "All Pages" tag fires on **any** domain that carries this container
ID: `zapnixinc.com`, `thearq.ai`, `sur.ly`, and `staging.aciinfotech.com`
are all sending data into your GA4 (confirmed in the tag-coverage report).
You can't remove your ID from those third-party sites, but you can stop
**your tags** from reporting their traffic.

**Fix:** create two exception triggers and add them to every page-level
tag.
- Trigger **`BLOCK - non-prod hostname`**: type *Page View*, fire on
  *Some Page Views* where **Page Hostname** *does not equal*
  `aciinfotech.com`. (Blocks www, staging, and every foreign domain.)
- Trigger **`BLOCK - admin`**: type *Page View*, *Some Page Views* where
  **Page Path** *starts with* `/admin`. (Stops your own admin tool, 73
  pages, from inflating analytics.)
- Add **both** as **Exceptions** (tag → Advanced → Exceptions) on:
  `Google Analytics GA4 Configuration`, `Conversion Linker`,
  `AdWords Remarketing`, `AdWords Conversion`, `AUTO Hotjar`,
  `Microsoft Clarity`, `PageSense_Snippet`, `Snitcher-Tracking`,
  `Google Tag AW-10929630630`, `LI Google tag`, `LI GA4 Event`,
  `Organization Schema`, `MQL - Form Fill Tracking`. (The two custom-event
  lead tags are already on-domain by nature, so they don't need it.)

### 2. Remove the dead Universal Analytics tag
Tag **`Google Analytics`** (type UA, `UA-91343359-1`) fires on every page
and does nothing — Universal Analytics was shut off in July 2023.
**Fix:** delete the tag **and** its now-orphan variable
`Google Analytics Code`.

### 3. Delete 8 orphan triggers
These exist but aren't attached to any tag (leftover from setup):
`Just Links`, `All Elements`, `Form Submission`, `Scroll Depth`,
`All Elements 1`, `Form Submission 1`, `Page View`, `Just Links 1`.
**Fix:** delete them so the container is legible.

### 4. Duplicate Organization schema
Tag **`Organization Schema`** injects `Corporation` JSON-LD (empty
phone/contactType, old HubSpot logo). The site already emits its own,
cleaner Organization schema server-side (`GlobalStructuredData`), so
Google now sees two org entities. **Fix:** delete the GTM tag; keep the
site's.

---

## P2 — worth doing

### 5. You're running three heatmap/session tools at once
**Hotjar**, **Microsoft Clarity**, and **Zoho PageSense** all do
session recording / heatmaps — that's three scripts doing one job, on
every page (a real speed cost). **Snitcher** is different (B2B visitor
de-anonymization) — keep it. **Recommendation:** pick one heatmap tool
(Clarity is free and solid) and remove the other two.

### 6. Contact-form leads aren't counted as Google Ads conversions
Your `AdWords Conversion` tag fires only on a `thank-you` page URL
(trigger `TY Page`). The contact form shows an inline success message (no
thank-you redirect), so **form leads never trigger an Ads conversion**.
**Fix (pick one):** import `generate_lead` from GA4 into Google Ads as a
conversion (cleanest, once P0 is done), or add a Google Ads conversion
tag firing on the `CE - contact_form_submitted` trigger.

### 7. Consent Mode v2
All tags are `consentStatus: NOT_SET`; consent is handled by load-gating
in the site code. That's fine as-is. Upgrading to Consent Mode v2 (to
recover conversions from cookie-rejecters) is specced separately in
`docs/consent-mode-v2.md` — it's a privacy-posture decision.

### 8. Two form systems
Heads-up for later: `MQL - Form Fill Tracking` patches embedded **Zoho**
form iframes with UTMs, so lead capture is split between Zoho forms and
the Next `/contact` form (which my attribution work covers). Worth
unifying eventually so attribution is consistent across both.

---

## Keep as-is (working well)
- **GA4 Configuration** (`G-145NLC9TW3`) with **server-side tagging** —
  good, modern setup.
- **Conversion Linker** + **Google Ads tag** (`AW-10929630630`) — correct.
- **Snitcher** — keep (distinct purpose).
- The **lead-events** tags/triggers/variables I provided — correct once
  P0 sets the Measurement ID.

## Suggested order
1. P0 Measurement ID (30 sec) → Publish.
2. Deploy the site branch so the events fire.
3. P1.1 hostname + admin exceptions (stops the pollution).
4. P1.2–1.4 cleanup (UA, orphans, dup schema).
5. P2 as you have time.
