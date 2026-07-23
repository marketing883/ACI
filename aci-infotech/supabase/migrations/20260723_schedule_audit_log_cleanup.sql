-- Schedule automatic cleanup of old admin audit log entries via pg_cron.
--
-- Replaces the external-cron dependency on /api/cron/cleanup-audit-logs
-- (which needed Vercel cron or cron-job.org to call it). The cleanup is
-- a plain DELETE, so it runs entirely inside Supabase — no app server
-- involvement, works the same on any hosting (VPS included).
--
-- Retention: 90 days, matching the default in src/lib/audit-log.ts.
-- Runs daily at 03:00 UTC.
--
-- Prerequisite: pg_cron extension enabled (already done by
-- 20260416_schedule_session_cleanup.sql, kept here for safety).
--
-- To verify after running:
--   SELECT * FROM cron.job;
-- To unschedule:
--   SELECT cron.unschedule('cleanup-admin-audit-log');

create extension if not exists pg_cron;

-- unschedule first so re-running the migration doesn't duplicate the job
do $$
begin
  perform cron.unschedule('cleanup-admin-audit-log');
exception when others then
  null; -- job didn't exist yet
end $$;

select cron.schedule(
  'cleanup-admin-audit-log',
  '0 3 * * *',
  $$delete from admin_audit_log where created_at < now() - interval '90 days'$$
);
