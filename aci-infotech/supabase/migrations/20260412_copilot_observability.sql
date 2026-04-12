-- Atheros / ACI Co-Pilot: observability tables.
-- Part 1 of the rebuild. Creates the foundation that every later part
-- (new brain, desktop canvas, mobile pill, admin live view) writes into.
--
-- Tables:
--   chat_sessions  - one row per user session across all pages/devices.
--   chat_messages  - one row per turn, including tool calls and streaming metadata.
--   chat_errors    - one row per failure, fingerprint-groupable, fully contexted.
--
-- All three are admin-read only; only the service-role writes.

-- ----------------------------------------------------------------------
-- chat_sessions
-- ----------------------------------------------------------------------
create table if not exists public.chat_sessions (
  session_id       text primary key,
  visitor_id       text,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  page_entry       text,
  flag_bucket      int,
  client_version   text,
  device_class     text,

  -- Part-6 admin takeover hooks. Nullable; only set when a handoff fires.
  handoff_at       timestamptz,
  handoff_reason   text,
  admin_claimed_by uuid,
  admin_mode       text check (admin_mode is null or admin_mode in ('relay','copilot')),

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_chat_sessions_visitor_id on public.chat_sessions(visitor_id);
create index if not exists idx_chat_sessions_started_at on public.chat_sessions(started_at desc);
create index if not exists idx_chat_sessions_handoff_at on public.chat_sessions(handoff_at desc nulls last);

-- ----------------------------------------------------------------------
-- chat_messages
-- ----------------------------------------------------------------------
create table if not exists public.chat_messages (
  message_id     uuid primary key default gen_random_uuid(),
  session_id     text not null references public.chat_sessions(session_id) on delete cascade,
  role           text not null check (role in ('user','assistant','tool','admin','system')),
  content        text,
  tool_name      text,
  tool_args      jsonb,
  tool_result    jsonb,
  model          text,
  input_tokens   int,
  output_tokens  int,
  latency_ms     int,
  cost_usd       numeric(10,6),

  -- Part-3 thought streaming. Stored for admin replay (Part 6).
  thoughts       jsonb,        -- array of strings emitted as 'thought' events
  status_events  jsonb,        -- array of {at, text} pipeline narration

  stream_incomplete boolean default false,
  created_at     timestamptz not null default now()
);

create index if not exists idx_chat_messages_session on public.chat_messages(session_id, created_at);
create index if not exists idx_chat_messages_created_at on public.chat_messages(created_at desc);
create index if not exists idx_chat_messages_tool_name on public.chat_messages(tool_name) where tool_name is not null;

-- ----------------------------------------------------------------------
-- chat_errors
-- ----------------------------------------------------------------------
create table if not exists public.chat_errors (
  id         uuid primary key default gen_random_uuid(),
  session_id text,
  stage      text not null check (stage in (
    'retrieve','generate','tool','stream','render','panel','pill','indexer','ratelimit','health','init','other'
  )),
  severity   text not null check (severity in ('info','warn','error','fatal')),
  message    text not null,
  stack      text,
  context    jsonb not null default '{}'::jsonb,
  -- Fingerprint for Part-6 grouping. Computed client-side as sha256(stage + normalized message).
  fingerprint text,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_errors_created_at on public.chat_errors(created_at desc);
create index if not exists idx_chat_errors_session on public.chat_errors(session_id);
create index if not exists idx_chat_errors_fingerprint on public.chat_errors(fingerprint);
create index if not exists idx_chat_errors_stage_severity on public.chat_errors(stage, severity);

-- ----------------------------------------------------------------------
-- Auto-update updated_at on chat_sessions
-- ----------------------------------------------------------------------
create or replace function public.chat_sessions_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists chat_sessions_updated_at on public.chat_sessions;
create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row
  execute function public.chat_sessions_touch_updated_at();

-- ----------------------------------------------------------------------
-- RLS: admin-only read; service-role writes
-- ----------------------------------------------------------------------
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_errors   enable row level security;

-- Authenticated admin users can read.
drop policy if exists "admin read chat_sessions" on public.chat_sessions;
create policy "admin read chat_sessions"
  on public.chat_sessions for select
  using (auth.role() = 'authenticated');

drop policy if exists "admin read chat_messages" on public.chat_messages;
create policy "admin read chat_messages"
  on public.chat_messages for select
  using (auth.role() = 'authenticated');

drop policy if exists "admin read chat_errors" on public.chat_errors;
create policy "admin read chat_errors"
  on public.chat_errors for select
  using (auth.role() = 'authenticated');

-- Service-role is implicit (bypasses RLS). We do not add anon/insert policies,
-- so writes must come through route handlers that use the service role key.

-- ----------------------------------------------------------------------
-- Summary view for the admin live dashboard.
-- ----------------------------------------------------------------------
create or replace view public.chat_sessions_summary as
select
  s.session_id,
  s.visitor_id,
  s.started_at,
  s.ended_at,
  s.page_entry,
  s.flag_bucket,
  s.device_class,
  s.handoff_at is not null as is_handoff,
  s.admin_claimed_by,
  s.admin_mode,
  coalesce(m.message_count, 0)       as message_count,
  coalesce(m.total_input_tokens, 0)  as total_input_tokens,
  coalesce(m.total_output_tokens, 0) as total_output_tokens,
  coalesce(m.total_cost_usd, 0)      as total_cost_usd,
  m.last_message_at,
  m.last_model
from public.chat_sessions s
left join (
  select
    session_id,
    count(*)                         as message_count,
    sum(coalesce(input_tokens, 0))   as total_input_tokens,
    sum(coalesce(output_tokens, 0))  as total_output_tokens,
    sum(coalesce(cost_usd, 0))       as total_cost_usd,
    max(created_at)                  as last_message_at,
    max(model)                       as last_model
  from public.chat_messages
  group by session_id
) m on m.session_id = s.session_id;

grant select on public.chat_sessions_summary to authenticated;
