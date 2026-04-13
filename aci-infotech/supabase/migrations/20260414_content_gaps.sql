-- Atheros / ACI Co-Pilot: content-gap tracking.
--
-- Adds a retrieval_summary JSONB column to chat_messages so the
-- /admin/copilot/analytics Content Gap feed can surface queries where
-- retrieval returned nothing useful. Populated by the v2 route on every
-- assistant turn that calls hybridRetrieve.
--
-- Shape:
--   {
--     "topK": number,          -- how many chunks were returned
--     "topSimilarity": number, -- best chunk's similarity (0..1), 0 if none
--     "sourceTypes": string[]  -- distinct source_type values in the top-k
--   }

alter table public.chat_messages
  add column if not exists retrieval_summary jsonb;

-- Partial index for the content-gap scan: cheap to maintain since most
-- assistant turns populate this and we only query when topSimilarity is
-- low.
create index if not exists chat_messages_retrieval_top_sim_idx
  on public.chat_messages (((retrieval_summary->>'topSimilarity')::float))
  where retrieval_summary is not null;
