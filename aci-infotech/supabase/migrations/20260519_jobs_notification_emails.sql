-- Per-job application-notification routing.
--
-- Optional comma-separated recipient list for the "new application"
-- email. Several HR people each own different openings; this lets an
-- admin point a job's notifications at the recruiter who owns it
-- instead of the single shared RMG inbox.
--
-- Blank/NULL falls back to the global RMG inbox in src/lib/email.ts,
-- so existing rows need no backfill and behaviour is unchanged until
-- an admin opts a job in. Stored as one raw text string (not text[])
-- to mirror the admin input verbatim; parsing, validation, and
-- dedupe happen in the email layer so a malformed value can never
-- break the notification path. Nullable, no index (never
-- filtered/queried on).

ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS notification_emails text;
