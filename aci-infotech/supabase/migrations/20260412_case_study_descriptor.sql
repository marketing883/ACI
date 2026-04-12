-- Atheros / ACI Co-Pilot: client-name sanitization.
-- Adds a `client_descriptor` column to public.case_studies. This becomes
-- the only field the app reads when rendering a case study or citing one
-- in an Atheros response. The legacy client_name column is left intact so
-- the content team can rewrite it on their own schedule, but the app
-- stops reading it the moment the Part-1 codemod ships.
--
-- Policy is enforced in code:
--   * src/lib/content/anonymize.ts exposes `displayClient(row)`.
--   * scripts/check-no-client-leak.ts fails CI on bare `.client` render paths.
--
-- Seed strategy: when no descriptor is provided yet, synthesize one from
-- the `industry` column so the page does not regress to "Enterprise Client"
-- for every row. Content team will refine these values later.

alter table public.case_studies
  add column if not exists client_descriptor text;

update public.case_studies
set client_descriptor = coalesce(
  client_descriptor,
  'Fortune 500 ' || coalesce(nullif(trim(industry), ''), 'Enterprise') || ' Client'
)
where client_descriptor is null;

-- Optional index: case studies are filtered by industry in admin lists.
create index if not exists idx_case_studies_client_descriptor
  on public.case_studies(client_descriptor);

-- Safety check: if any future insert forgets to populate client_descriptor,
-- the seed-style default keeps the app safe rather than silently leaking.
alter table public.case_studies
  alter column client_descriptor set default 'Enterprise Client';
