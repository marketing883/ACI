-- Chat Leads Table for Lead Gen Engine
-- Run this migration in your Supabase SQL Editor

-- Create chat_leads table
CREATE TABLE IF NOT EXISTS chat_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,

  -- Contact Information
  name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  job_title TEXT,
  location TEXT,

  -- Lead Context
  service_interest TEXT,
  requirements TEXT,
  preferred_time TEXT,

  -- Conversation Data
  conversation JSONB DEFAULT '[]'::jsonb,

  -- Page Context (new)
  entry_page TEXT,
  pages_visited TEXT[] DEFAULT '{}',

  -- Lead Scoring & Status
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  source TEXT DEFAULT 'chat_widget',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_chat_leads_email ON chat_leads(email);
CREATE INDEX IF NOT EXISTS idx_chat_leads_status ON chat_leads(status);
CREATE INDEX IF NOT EXISTS idx_chat_leads_lead_score ON chat_leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_chat_leads_created_at ON chat_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_leads_service_interest ON chat_leads(service_interest);

-- Enable Row Level Security
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from authenticated users or service role
CREATE POLICY "Allow insert for service role" ON chat_leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow select for authenticated admins only
CREATE POLICY "Allow select for authenticated users" ON chat_leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow update for authenticated users
CREATE POLICY "Allow update for authenticated users" ON chat_leads
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS chat_leads_updated_at ON chat_leads;
CREATE TRIGGER chat_leads_updated_at
  BEFORE UPDATE ON chat_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_leads_updated_at();

-- View for admin dashboard - lead summary
CREATE OR REPLACE VIEW chat_leads_summary AS
SELECT
  id,
  session_id,
  name,
  email,
  company,
  job_title,
  location,
  service_interest,
  preferred_time,
  lead_score,
  status,
  entry_page,
  array_length(pages_visited, 1) as pages_visited_count,
  jsonb_array_length(conversation) as message_count,
  created_at,
  last_activity_at
FROM chat_leads
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON chat_leads_summary TO authenticated;

-- Optional: Add to existing contacts table if you want to sync
-- This function creates a contact record when a chat lead is qualified
CREATE OR REPLACE FUNCTION sync_qualified_lead_to_contacts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'qualified' AND OLD.status != 'qualified' THEN
    INSERT INTO contacts (name, email, company, phone, inquiry_type, message, source, status)
    VALUES (
      COALESCE(NEW.name, 'Chat Lead'),
      NEW.email,
      NEW.company,
      NEW.phone,
      COALESCE(NEW.service_interest, 'General Inquiry'),
      format('[Qualified Chat Lead]%sJob Title: %s%sLocation: %s%sPreferred Time: %s%sLead Score: %s',
        E'\n\n', COALESCE(NEW.job_title, 'N/A'),
        E'\n', COALESCE(NEW.location, 'N/A'),
        E'\n', COALESCE(NEW.preferred_time, 'N/A'),
        E'\n', NEW.lead_score::text
      ),
      'chat_widget',
      'new'
    )
    ON CONFLICT (email) DO UPDATE SET
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Uncomment below if you want auto-sync to contacts table
-- DROP TRIGGER IF EXISTS sync_chat_lead_to_contacts ON chat_leads;
-- CREATE TRIGGER sync_chat_lead_to_contacts
--   AFTER UPDATE ON chat_leads
--   FOR EACH ROW
--   EXECUTE FUNCTION sync_qualified_lead_to_contacts();
