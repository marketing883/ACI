-- Persist the full contact intelligence the form already captures.
--
-- The contact form posts structured intent (which CTA / service /
-- platform / industry / topic the lead came from), a resolved
-- service_interest label, the smart-form qualification (job title,
-- stage, focus areas), any merged Atheros chat context, and spam
-- scoring. The production contacts table was missing the columns to
-- hold them, so /api/contact hit its column-missing fallback and
-- inserted only the core fields, dropping every bit of that
-- intelligence. The admin dashboard then had nothing to show under
-- "where did this lead come from."
--
-- Additive and idempotent: `add column if not exists` is instant on
-- Postgres and safe to run live. /api/contact already writes these
-- columns, so applying this simply turns the storage on. Existing
-- rows keep their values; only new submissions gain the richer data.

alter table public.contacts
  add column if not exists metadata jsonb default '{}'::jsonb,
  add column if not exists service_interest text,
  add column if not exists spam_score integer,
  add column if not exists spam_flags jsonb;

comment on column public.contacts.metadata is
  'Structured lead journey captured by /api/contact: '
  '{ intent: { service, platform, industry, topic, playbook, reason, source }, '
  'qualification: { job_title, stage, focus_areas }, '
  'chat_context: { ...Atheros session fields, lead_score }, atheros_session_id }.';
comment on column public.contacts.service_interest is
  'Resolved service/platform/industry label the lead expressed interest in.';
comment on column public.contacts.spam_score is
  'Bot-detection score at submission time (higher = more suspicious).';
comment on column public.contacts.spam_flags is
  'Array of bot-detection flags raised at submission time, or null.';
