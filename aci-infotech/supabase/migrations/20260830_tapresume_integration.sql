-- TapResume careers integration (wire contract 2026-08-29).
-- See docs/integrations/TAPRESUME-CAREERS-CONTRACT-2026-08-30.md.
--
-- Two tables plus three columns on jobs. The projection of each opening
-- lives in tapresume_publications; the public-facing jobs row is derived
-- from it so the existing careers pages render TapResume openings with no
-- separate read path.

-- One row per publication TapResume has ever pushed here, including ones
-- since unpublished (the manifest must list those too).
create table if not exists public.tapresume_publications (
  tapresume_publication_id uuid primary key,
  aci_job_id uuid references public.jobs(id) on delete set null,
  organization_external_key text not null,
  tapresume_role_id uuid,
  tapresume_requisition_id uuid,
  applied_version integer not null,
  applied_state text not null check (applied_state in ('published', 'unpublished')),
  content_hash text not null,
  last_event_id text not null,
  application_url text,
  public_url text,
  page_state text not null default 'pending' check (page_state in ('pending', 'ready')),
  -- The full wire body of the applied version, verbatim. The GET route
  -- serves this; drift checks compare against it.
  projection jsonb not null,
  applied_at timestamptz not null,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Event ids are inserted BEFORE the upsert is applied (contract 3.3), so a
-- crash between store and apply leaves a row with a null ack - visible,
-- and safe to resume because apply is idempotent per version.
--
-- ack is TEXT, not jsonb, on purpose: jsonb re-orders object keys, and the
-- contract requires duplicate deliveries to get the SAME acknowledgement
-- bytes back, applied_at included. The exact string we sent is the only
-- thing that satisfies that.
create table if not exists public.tapresume_events (
  event_id text primary key,
  tapresume_publication_id uuid not null,
  desired_version integer,
  ack text,
  received_at timestamptz not null default now(),
  applied_at timestamptz
);

create index if not exists tapresume_events_publication_idx
  on public.tapresume_events (tapresume_publication_id);

-- Columns the projection needs on the public jobs row.
--   application_url: when set, the careers page renders Apply as an
--     external link to TapResume instead of the on-site form.
--   salary_display: TapResume sends salary as one display string; the
--     numeric salary_min/max columns cannot carry it faithfully.
--   managed_by: 'tapresume' locks the row against admin edits outside the
--     audited emergency detachment.
alter table public.jobs add column if not exists application_url text;
alter table public.jobs add column if not exists salary_display text;
alter table public.jobs add column if not exists managed_by text;

-- Service-role access only. RLS enabled with no policies denies anon and
-- authenticated; the service key bypasses RLS. The integration tables
-- hold no candidate PII (contract section 1) but there is still no reason
-- for any browser-side read.
alter table public.tapresume_publications enable row level security;
alter table public.tapresume_events enable row level security;
