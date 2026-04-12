-- Atheros / ACI Co-Pilot: content index.
-- Part 2 of the rebuild. Adds pgvector and a single table that holds
-- every retrievable chunk of ACI content (LPs, services, industries,
-- platforms, case studies, blogs, whitepapers, playbooks).
--
-- Chunks are written by scripts/index-content.ts with OpenAI
-- text-embedding-3-small (1536 dimensions). The hybrid retriever in
-- src/lib/copilot/retrieval.ts reads via cosine similarity.

create extension if not exists vector;

create table if not exists public.content_chunks (
  id            uuid primary key default gen_random_uuid(),
  source_type   text not null check (source_type in (
    'lp','service','industry','platform','case_study','blog','whitepaper','playbook'
  )),
  source_slug   text not null,
  title         text not null,
  section_path  text,
  text          text not null,
  metadata      jsonb not null default '{}'::jsonb,
  embedding     vector(1536),
  token_count   int,
  checksum      text not null,
  indexed_at    timestamptz not null default now(),
  stale_at      timestamptz,
  unique (source_type, source_slug, section_path)
);

-- ANN index for cosine similarity. ivfflat requires ANALYZE after first
-- bulk insert; the indexer calls `analyze public.content_chunks` at the
-- end of every full rebuild. list count is tuned for the ~2-3k chunk
-- corpus this site is expected to carry.
create index if not exists content_chunks_embedding_idx
  on public.content_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

create index if not exists content_chunks_source_idx
  on public.content_chunks (source_type, source_slug);

create index if not exists content_chunks_metadata_idx
  on public.content_chunks using gin (metadata);

create index if not exists content_chunks_stale_idx
  on public.content_chunks (stale_at) where stale_at is not null;

-- RLS: service-role only. Atheros runtime queries use the service role;
-- public anon clients must not query the index directly.
alter table public.content_chunks enable row level security;

-- Authenticated admins may read for the /admin/copilot/content page.
drop policy if exists "admin read content_chunks" on public.content_chunks;
create policy "admin read content_chunks"
  on public.content_chunks for select
  using (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------
-- Invalidation triggers. When a DB-sourced row (case_studies, blog_posts,
-- whitepapers) is updated, mark its chunks stale so the next incremental
-- reindex picks them up. Triggers do NOT delete chunks; the indexer
-- does that after it rewrites them, so retrieval keeps working during
-- a slow reindex.
-- ----------------------------------------------------------------------

create or replace function public.mark_content_chunks_stale(
  p_source_type text,
  p_source_slug text
) returns void language sql as $$
  update public.content_chunks
     set stale_at = now()
   where source_type = p_source_type
     and source_slug = p_source_slug;
$$;

create or replace function public.case_studies_stale_trigger()
returns trigger language plpgsql as $$
begin
  perform public.mark_content_chunks_stale('case_study', new.slug);
  return new;
end;
$$;

drop trigger if exists trg_case_studies_stale on public.case_studies;
create trigger trg_case_studies_stale
  after update on public.case_studies
  for each row
  execute function public.case_studies_stale_trigger();

create or replace function public.blog_posts_stale_trigger()
returns trigger language plpgsql as $$
begin
  perform public.mark_content_chunks_stale('blog', new.slug);
  return new;
end;
$$;

drop trigger if exists trg_blog_posts_stale on public.blog_posts;
create trigger trg_blog_posts_stale
  after update on public.blog_posts
  for each row
  execute function public.blog_posts_stale_trigger();

create or replace function public.whitepapers_stale_trigger()
returns trigger language plpgsql as $$
begin
  perform public.mark_content_chunks_stale('whitepaper', new.slug);
  return new;
end;
$$;

drop trigger if exists trg_whitepapers_stale on public.whitepapers;
create trigger trg_whitepapers_stale
  after update on public.whitepapers
  for each row
  execute function public.whitepapers_stale_trigger();

-- ----------------------------------------------------------------------
-- RPC: match_content_chunks — used by src/lib/copilot/retrieval.ts.
-- Returns top-k chunks by cosine similarity, with optional filters.
-- ----------------------------------------------------------------------
create or replace function public.match_content_chunks(
  query_embedding vector(1536),
  match_count int default 8,
  source_types text[] default null,
  industry_filter text default null,
  cluster_filter text default null,
  role_filter text default null
)
returns table (
  id uuid,
  source_type text,
  source_slug text,
  title text,
  section_path text,
  text text,
  metadata jsonb,
  similarity float
)
language sql stable as $$
  select
    c.id,
    c.source_type,
    c.source_slug,
    c.title,
    c.section_path,
    c.text,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.content_chunks c
  where c.embedding is not null
    and (source_types is null or c.source_type = any(source_types))
    and (industry_filter is null or c.metadata->>'industry' = industry_filter)
    and (cluster_filter  is null or c.metadata->>'cluster'  = cluster_filter)
    and (role_filter     is null or c.metadata->>'role'     = role_filter)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

grant execute on function public.match_content_chunks(
  vector(1536), int, text[], text, text, text
) to authenticated, service_role;
