-- Schedule automatic cleanup of stale visitor sessions via pg_cron.
--
-- mark_inactive_sessions() (defined in 20240320_realtime_analytics.sql)
-- sets is_active = FALSE for sessions with last_activity_at older than
-- 30 minutes. Without this cron job, sessions stay "active" forever,
-- and the admin dashboard shows a permanent "50 active visitors" count
-- that never changes.
--
-- Runs every 5 minutes. Cost: negligible (one UPDATE query targeting
-- rows with a simple WHERE clause on a timestamptz column + boolean).
--
-- Prerequisite: pg_cron extension must be enabled in Supabase.
-- In the Supabase dashboard: Database → Extensions → search "pg_cron"
-- → enable. Or run:
--   CREATE EXTENSION IF NOT EXISTS pg_cron;
--
-- To verify after running:
--   SELECT * FROM cron.job;
-- To unschedule:
--   SELECT cron.unschedule('cleanup-stale-visitor-sessions');

-- Enable the extension if not already active.
create extension if not exists pg_cron;

-- Schedule the cleanup every 5 minutes.
select cron.schedule(
  'cleanup-stale-visitor-sessions',
  '*/5 * * * *',
  $$select mark_inactive_sessions()$$
);
