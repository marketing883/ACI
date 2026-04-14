-- Create the private 'resumes' storage bucket used by /api/jobs/apply.
-- Without this bucket the upload fails silently, the application is
-- still created, and the admin dashboard sees no resume.
--
-- The bucket is PRIVATE. Only the service role can read/write it.
-- The public site never references the bucket directly. The admin
-- dashboard streams downloads through /api/admin/resume/[...path],
-- which mints a short-lived signed URL using the service role key.
--
-- Idempotent: safe to re-run. The insert uses ON CONFLICT DO NOTHING
-- so existing buckets (created by hand in the Supabase dashboard,
-- for example) are left alone.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  5 * 1024 * 1024,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

-- Belt and suspenders: explicitly deny anonymous access. The bucket
-- is already private, but if RLS is later enabled on storage.objects
-- without per-bucket policies, this keeps the resumes locked. The
-- service role bypasses RLS entirely, so the apply route and the
-- admin signed-URL route both keep working.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'resumes_no_anon'
  ) then
    create policy resumes_no_anon
      on storage.objects
      for all
      to anon
      using (false)
      with check (false);
  end if;
end
$$;
