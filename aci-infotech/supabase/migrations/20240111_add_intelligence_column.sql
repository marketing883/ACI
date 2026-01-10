-- Add intelligence JSONB column to both tables for caching AI analysis
-- This allows instant display of intelligence reports without re-generating

-- Add intelligence column to chat_leads table
ALTER TABLE chat_leads
ADD COLUMN IF NOT EXISTS intelligence JSONB DEFAULT NULL;

-- Add intelligence column to contacts table
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS intelligence JSONB DEFAULT NULL;

-- Create index for efficient queries on intelligence data
CREATE INDEX IF NOT EXISTS idx_chat_leads_intelligence ON chat_leads USING GIN (intelligence);
CREATE INDEX IF NOT EXISTS idx_contacts_intelligence ON contacts USING GIN (intelligence);

-- Update the chat_leads_summary view to include intelligence status
DROP VIEW IF EXISTS chat_leads_summary;
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
  intelligence IS NOT NULL as has_intelligence,
  created_at,
  last_activity_at
FROM chat_leads
ORDER BY created_at DESC;

-- Grant access to the updated view
GRANT SELECT ON chat_leads_summary TO authenticated;
