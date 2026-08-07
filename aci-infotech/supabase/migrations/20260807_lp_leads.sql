-- Landing page leads: every form under /lp/*.
--
-- This table was never created. /api/lp/submit has been inserting into
-- lp_leads since the landing pages shipped, PostgREST answered PGRST205
-- ("Could not find the table 'public.lp_leads' in the schema cache")
-- every time, and the route logged the error and returned success. So the
-- visitor saw a thank-you screen, the notification email went out, and the
-- row went nowhere. The only surviving record of those leads is the inbox.
--
-- Columns mirror exactly what src/app/api/lp/submit/route.ts inserts.
-- Kept separate from event_leads on purpose: LP leads have no draw and no
-- one-entry-per-email constraint, since the same person can legitimately
-- convert on more than one landing page.

CREATE TABLE IF NOT EXISTS lp_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,

  -- What they asked for, and where from
  looking_for TEXT NOT NULL,
  landing_page TEXT NOT NULL,
  service_cluster TEXT NOT NULL DEFAULT 'general',

  -- Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  industry_param TEXT,
  role_param TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,

  -- Pipeline. Same vocabulary as event_leads so the admin status filters
  -- behave the same on both tables.
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lp_leads_created_at ON lp_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lp_leads_landing_page ON lp_leads (landing_page);
CREATE INDEX IF NOT EXISTS idx_lp_leads_email ON lp_leads (lower(email));

ALTER TABLE lp_leads ENABLE ROW LEVEL SECURITY;

-- Inserts come only through the API route using the service role key.
CREATE POLICY "Allow insert for service role" ON lp_leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" ON lp_leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON lp_leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- PostgREST caches the schema. Without this the route keeps getting
-- PGRST205 until the API restarts, which is the failure this migration
-- exists to end.
NOTIFY pgrst, 'reload schema';
