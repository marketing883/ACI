-- Event leads: National Digital Trust Summit (AION 2026) landing page.
--
-- Captures registrations from /lp/digital-trust-summit-2026. Each row is
-- both a sales lead and a lucky draw entry (draw runs live at the booth
-- on 31 July 2026). pain_points + journey_stage are the qualification
-- payload the booth team uses to pick conversations and the draw winner.
--
-- Kept separate from lp_leads on purpose: event entries need a unique
-- (event, email) constraint so nobody enters the draw twice, and the
-- table doubles as the draw pool export.

CREATE TABLE IF NOT EXISTS event_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug TEXT NOT NULL DEFAULT 'digital-trust-summit-2026',

  -- Contact
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,

  -- Qualification (the point of the form)
  pain_points TEXT[] NOT NULL DEFAULT '{}',
  pain_point_other TEXT,
  journey_stage TEXT CHECK (journey_stage IN ('exploring', 'piloting', 'scaling', 'optimizing')),
  wants_expert_meeting BOOLEAN NOT NULL DEFAULT FALSE,

  -- Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,

  -- Pipeline
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'attended', 'qualified', 'converted', 'lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One draw entry per person per event.
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_leads_event_email
  ON event_leads (event_slug, lower(email));

CREATE INDEX IF NOT EXISTS idx_event_leads_created_at ON event_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_leads_journey_stage ON event_leads (journey_stage);

ALTER TABLE event_leads ENABLE ROW LEVEL SECURITY;

-- Inserts come only through the API route using the service role key.
CREATE POLICY "Allow insert for service role" ON event_leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users" ON event_leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow update for authenticated users" ON event_leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');
