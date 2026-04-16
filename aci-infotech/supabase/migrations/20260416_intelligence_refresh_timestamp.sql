-- Track when the intelligence report was last written for a chat_lead.
-- upsertChatLead uses this as a cooldown so a burst of qualify_lead
-- calls (each carrying a new high-signal field) doesn't fire back-to-
-- back LLM runs. Also makes 'how stale is this intelligence' visible
-- in admin views.
--
-- Additive. Nullable. Existing rows get NULL (treated as 'never
-- written' -> cooldown expired -> first high-signal delta after the
-- migration triggers a refresh).

alter table public.chat_leads
  add column if not exists intelligence_updated_at timestamptz;

comment on column public.chat_leads.intelligence_updated_at is
  'Timestamp of last successful generateIntelligence write. Used as a cooldown gate; refreshes fire at most every 60 seconds when a new high-signal field arrives.';
