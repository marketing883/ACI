-- First-touch marketing attribution on contact submissions.
--   contacts.attribution — one jsonb blob captured client-side on the
--                          contact form and posted to /api/contact. Holds
--                          any of: utm_source, utm_medium, utm_campaign,
--                          utm_term, utm_content, gclid, gbraid, wbraid,
--                          fbclid, li_fat_id, referrer, landing_page.
--                          Null when a visitor arrives direct with nothing
--                          to attribute.
--
-- Additive. `ADD COLUMN ... NULL` is instant on Postgres; safe to run
-- without a maintenance window. /api/contact already degrades gracefully
-- when this column is absent, so applying it only turns storage on.

alter table public.contacts
  add column if not exists attribution jsonb;

comment on column public.contacts.attribution is
  'First-touch marketing attribution captured on the contact form: utm_*, click IDs (gclid/gbraid/wbraid/fbclid/li_fat_id), external referrer, and landing page.';
