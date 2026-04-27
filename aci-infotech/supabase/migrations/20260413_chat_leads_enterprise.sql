-- Atheros Part 8: enterprise-grade lead qualification fields.
--
-- Part 1 chose a minimal qualify_lead tool schema (name/email/company/
-- job_title/industry/timeline/service_interest/role/team). In practice the
-- admin pipeline needs more texture: website (domain lookup, enrichment),
-- budget band (sales prioritization), urgency signal, and the model's own
-- intent confidence. The Zod + JSON schema in src/lib/copilot/tools.ts
-- already carries these; this migration matches the DB to that shape.
--
-- phone already exists on chat_leads from 20240110; we do not re-add it.
-- All new columns are nullable TEXT so existing rows stay valid. No
-- default coercion; the model is instructed to only fill fields it has
-- explicit signal for.

ALTER TABLE public.chat_leads
  ADD COLUMN IF NOT EXISTS website  TEXT,
  ADD COLUMN IF NOT EXISTS budget   TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT,
  ADD COLUMN IF NOT EXISTS intent   TEXT;

COMMENT ON COLUMN public.chat_leads.website  IS 'Company website / domain (from qualify_lead.website).';
COMMENT ON COLUMN public.chat_leads.budget   IS 'Budget band: unknown | under-100k | 100k-500k | 500k-1m | over-1m.';
COMMENT ON COLUMN public.chat_leads.priority IS 'Urgency: this-quarter | this-half | this-year | exploring | no-rush.';
COMMENT ON COLUMN public.chat_leads.intent   IS 'Model confidence lead is sales-ready: low | medium | high.';
