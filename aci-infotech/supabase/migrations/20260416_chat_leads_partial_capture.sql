-- Allow chat_leads rows to exist before email is captured. qualify_lead
-- fires whenever a new field surfaces in the conversation; under the
-- previous gate, any fields captured before the visitor gave an email
-- (name, company, role, painPoint, etc.) were dropped on the floor by
-- application logic. Relaxing the DB constraint + removing the gate lets
-- us persist as-we-go; thank-you email and intelligence generation still
-- fire only when email is finally captured (gated in application code).
--
-- Also add industry and role columns: captured by qualify_lead since
-- day one but never persisted (absent from the upsert body). Adding them
-- here so the route/session layers can start writing them.
--
-- All changes are additive and safe to run without a maintenance window:
--   - DROP NOT NULL on a column: instant, no row rewrites.
--   - ADD COLUMN ... NULL: instant, no row rewrites.

alter table public.chat_leads
  alter column email drop not null;

alter table public.chat_leads
  add column if not exists industry text,
  add column if not exists role     text;

comment on column public.chat_leads.industry is 'Industry the visitor mentioned (qualify_lead.industry).';
comment on column public.chat_leads.role     is 'C-suite role: cio | cdo | cto | ciso | ceo | cmo | other (qualify_lead.role).';
