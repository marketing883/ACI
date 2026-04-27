-- Soft lock to prevent concurrent generateIntelligence runs for the same
-- chat_lead. upsertChatLead tries to claim the lock via a conditional
-- UPDATE before firing the LLM call: if another run already owns the
-- lock (and isn't stale), the current call skips. The 5-minute
-- staleness window is a safety valve so a function that crashed
-- mid-run doesn't pin the lock forever.
--
-- Null = no run in progress. Non-null = a run claimed the lock at that
-- timestamp. Cleared in the finally block of backgroundWork().

alter table public.chat_leads
  add column if not exists intelligence_running_since timestamptz;

comment on column public.chat_leads.intelligence_running_since is
  'Soft lock timestamp: set to now() when intelligence generation starts, cleared on completion. A run older than 5 minutes is treated as stale and can be claimed by another caller.';
