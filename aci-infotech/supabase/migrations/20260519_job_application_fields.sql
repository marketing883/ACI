-- Extra candidate fields on job applications.
--
-- The application form historically collected only name/email/phone,
-- links, current role, resume, and cover letter. Recruiters need
-- more signal up front — where the candidate is based, whether they
-- need sponsorship, how soon they can start, their salary
-- expectation, and which channel brought them in (attribution).
--
-- All nullable, no backfill, no index — existing rows and the apply
-- path keep working unchanged; the form simply starts populating
-- these going forward. Free text / short enum values stored as text
-- to mirror the form input verbatim (the form uses selects for the
-- enum-ish ones but we don't constrain at the DB layer so option
-- lists can evolve without a migration).

ALTER TABLE job_applications
  ADD COLUMN IF NOT EXISTS location            text,
  ADD COLUMN IF NOT EXISTS work_authorization  text,
  ADD COLUMN IF NOT EXISTS notice_period       text,
  ADD COLUMN IF NOT EXISTS salary_expectation  text,
  ADD COLUMN IF NOT EXISTS heard_from          text;
