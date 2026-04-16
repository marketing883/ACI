-- Lead-qualification fields for Atheros v2:
--   chat_leads.pain_point      — concrete pain captured via qualify_lead
--                                painPoint (visitor's own words, ~400 char)
--   chat_leads.decision_role   — leading | scoping | researching | unclear,
--                                captured once the conversation makes the
--                                visitor's decision-making posture clear
--   chat_sessions.handoff_priority — critical | urgent | normal, captured
--                                    from handoff_to_human. Admin handoff
--                                    inbox will sort by this in a later
--                                    pass; TODO left in the admin UI.
--
-- Additive. No data migration needed. `ADD COLUMN ... NULL` is instant on
-- Postgres; safe to run without a maintenance window.

alter table public.chat_leads
  add column if not exists pain_point     text,
  add column if not exists decision_role  text;

alter table public.chat_sessions
  add column if not exists handoff_priority text;

comment on column public.chat_leads.pain_point     is 'Verbatim pain point captured by qualify_lead.painPoint. Not paraphrased.';
comment on column public.chat_leads.decision_role  is 'leading | scoping | researching | unclear (qualify_lead.decisionRole).';
comment on column public.chat_sessions.handoff_priority is 'critical | urgent | normal (handoff_to_human.priority).';
