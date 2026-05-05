-- Structured location on jobs.
--
-- Replaces the single free-text `location` column ("Atlanta, GA or
-- Remote (US)") with three structured fields the admin form can
-- capture and the public surfaces can format consistently. This
-- unlocks Schema.org JobPosting structured data, location-based
-- filtering on /careers, and clean SEO-grade headings instead of
-- whatever the editor typed that day.
--
-- We keep the legacy `location` column. The admin API recomputes its
-- value from the structured fields on every write, so every display
-- path (admin list, careers grid, candidate detail page, RMG India
-- notification email) keeps working without a coordinated change.
-- Existing rows with only the legacy text are not auto-parsed —
-- splitting "Bengaluru, India" vs "Remote (US)" vs "Atlanta, GA"
-- reliably is harder than asking the admin to re-enter the data once
-- on the next edit.
--
-- All three columns are nullable so existing rows pass validation
-- and the rollout doesn't require a backfill in the same deploy.

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS city          text,
  ADD COLUMN IF NOT EXISTS state_region  text,
  ADD COLUMN IF NOT EXISTS country       text;

-- Index on country so /careers can offer a country filter without a
-- full table scan once the structured data is populated.
CREATE INDEX IF NOT EXISTS jobs_country_idx ON jobs (country) WHERE country IS NOT NULL;
