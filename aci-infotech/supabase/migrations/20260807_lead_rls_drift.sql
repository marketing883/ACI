-- Stop anonymous reads of contacts and chat_leads.
--
-- supabase/schema.sql grants SELECT on both tables to `authenticated`
-- only, but the deployed database has drifted: with nothing but the anon
-- key from the public client bundle, /rest/v1/contacts returns 57 rows and
-- /rest/v1/chat_leads returns 20. Every name, work email, phone, company,
-- message and AI intelligence blob we hold is fetchable by anyone who
-- reads the bundle, which is everyone.
--
-- The drift is either RLS switched off on the tables or a SELECT policy
-- added for anon/public out of band, so this repairs both cases rather
-- than assuming one. Policy names are not assumed either - the loop drops
-- whatever grants anon or public a read, under whatever name it was
-- created with.
--
-- Run this together with the deploy that moves the admin dashboard onto
-- /api/admin/stats. Before that deploy the dashboard counts these tables
-- from the browser with the anon key, so tightening RLS first makes its
-- "Contact Form" card read 0.

-- INSERT for anon stays: the public forms depend on it. Only reads go.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('contacts', 'chat_leads')
      AND cmd IN ('SELECT', 'ALL')
      AND (roles::text[] && ARRAY['anon', 'public'])
  LOOP
    RAISE NOTICE 'Dropping anon-readable policy % on %', pol.policyname, pol.tablename;
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- A table with RLS disabled ignores policies entirely, which is the other
-- way these rows could have been readable.
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;

-- Restore the intended reads, matching supabase/schema.sql.
DROP POLICY IF EXISTS "contacts_select_auth" ON contacts;
CREATE POLICY "contacts_select_auth" ON contacts
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "chat_leads_select_auth" ON chat_leads;
CREATE POLICY "chat_leads_select_auth" ON chat_leads
  FOR SELECT TO authenticated USING (true);

NOTIFY pgrst, 'reload schema';

-- Verify after running. Both should come back 0 rows when queried with
-- the anon key; the admin pages read through the service role and are
-- unaffected:
--
--   curl -s "$SUPABASE_URL/rest/v1/contacts?select=id" \
--     -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
