-- Atheros / ACI Co-Pilot: admin-side tables (Part 6).
-- Adds the schema the admin live view, handoff inbox, outcome-copy
-- editor, and error-log silence feature need.

-- ----------------------------------------------------------------------
-- outcome_copy_overrides
--
-- Admin-editable copy used by the pill (idle / peek), the consultation
-- shell's primary outcome footer, and the action chips. Resolved by
-- src/lib/copilot/pillCopy.ts and src/lib/copilot/welcome.ts at request
-- time; cached in module scope with a short TTL so a save reflects on
-- the live site within ~60 seconds without a redeploy.
--
-- The "CTO" name (Call-to-Outcome) was renamed to "Outcome Copy" per
-- the canonical plan correction to avoid the C-suite acronym collision.
-- ----------------------------------------------------------------------

create table if not exists public.outcome_copy_overrides (
  id              uuid primary key default gen_random_uuid(),
  -- Pattern matched against pathname. Supports glob trailing wildcard
  -- (e.g. '/lp/databricks-migration', '/services/data-engineering',
  -- '/lp/*' as a prefix). Resolver picks longest specific match first.
  route_pattern   text not null,
  -- Where the override applies. Idle/peek live on the mobile pill;
  -- panel.primary_oc lives on the desktop content-canvas footer; chip
  -- targets the offer_action_buttons output for that route.
  surface         text not null check (surface in (
    'idle','peek.proactive','peek.narration','panel.primary_oc','chip','welcome'
  )),
  -- Optional persona key (cio | cdo | cto | ciso | ceo | cmo | any).
  variant_key     text,
  text            text not null,
  is_active       boolean not null default true,
  notes           text,
  updated_by      uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists outcome_copy_overrides_lookup_idx
  on public.outcome_copy_overrides (route_pattern, surface, variant_key)
  where is_active = true;

create or replace function public.outcome_copy_overrides_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_outcome_copy_overrides_updated on public.outcome_copy_overrides;
create trigger trg_outcome_copy_overrides_updated
  before update on public.outcome_copy_overrides
  for each row
  execute function public.outcome_copy_overrides_touch_updated_at();

alter table public.outcome_copy_overrides enable row level security;

drop policy if exists "admin read outcome_copy_overrides" on public.outcome_copy_overrides;
create policy "admin read outcome_copy_overrides"
  on public.outcome_copy_overrides for select
  using (auth.role() = 'authenticated');

drop policy if exists "admin write outcome_copy_overrides" on public.outcome_copy_overrides;
create policy "admin write outcome_copy_overrides"
  on public.outcome_copy_overrides for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------
-- chat_error_silences
--
-- Lets an admin suppress a noisy fingerprint for a window of time. The
-- error log dashboard groups by sha256(stage + normalized message) and
-- offers a "silence for 24h" button. When silenced, the error still
-- writes to chat_errors but is hidden from the default dashboard view
-- and excluded from rate alerts.
-- ----------------------------------------------------------------------

create table if not exists public.chat_error_silences (
  id           uuid primary key default gen_random_uuid(),
  fingerprint  text not null,
  silenced_at  timestamptz not null default now(),
  silenced_until timestamptz not null,
  silenced_by  uuid,
  reason       text
);

create index if not exists chat_error_silences_active_idx
  on public.chat_error_silences (fingerprint, silenced_until);

alter table public.chat_error_silences enable row level security;

drop policy if exists "admin chat_error_silences" on public.chat_error_silences;
create policy "admin chat_error_silences"
  on public.chat_error_silences for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------
-- chat_sessions: confirm Part-1 added the handoff fields. (No-op when
-- the migration already ran; included here so a fresh staging branch
-- gets the right shape even if Part 1 was skipped.)
-- ----------------------------------------------------------------------
alter table public.chat_sessions
  add column if not exists handoff_at        timestamptz,
  add column if not exists handoff_reason    text,
  add column if not exists admin_claimed_by  uuid,
  add column if not exists admin_mode        text;

-- Constraint added separately so add-if-not-exists works idempotently.
do $$
begin
  if not exists (
    select 1 from information_schema.check_constraints
     where constraint_name = 'chat_sessions_admin_mode_check'
  ) then
    alter table public.chat_sessions
      add constraint chat_sessions_admin_mode_check
      check (admin_mode is null or admin_mode in ('relay','copilot'));
  end if;
end $$;

-- ----------------------------------------------------------------------
-- View: admin live conversations feed.
-- Joins chat_sessions + per-session message stats + lead enrichment.
-- ----------------------------------------------------------------------
create or replace view public.admin_live_conversations as
select
  s.session_id,
  s.visitor_id,
  s.started_at,
  s.ended_at,
  s.page_entry,
  s.flag_bucket,
  s.device_class,
  s.handoff_at,
  s.handoff_reason,
  s.admin_claimed_by,
  s.admin_mode,
  l.id            as lead_id,
  l.name          as lead_name,
  l.email         as lead_email,
  l.company       as lead_company,
  l.job_title     as lead_job_title,
  l.service_interest as lead_service_interest,
  l.lead_score    as lead_score,
  l.status        as lead_status,
  ss.message_count,
  ss.total_input_tokens,
  ss.total_output_tokens,
  ss.total_cost_usd,
  ss.last_message_at,
  ss.last_model
from public.chat_sessions s
left join public.chat_sessions_summary ss on ss.session_id = s.session_id
left join public.chat_leads l on l.session_id = s.session_id;

grant select on public.admin_live_conversations to authenticated;
