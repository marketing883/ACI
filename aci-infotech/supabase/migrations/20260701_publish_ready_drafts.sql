-- Publish the 34 finished 2026 posts that were stuck in status='draft'.
--
-- These posts already carried a `published_at` date, so the client blog
-- listing (which read via the service-role API and filtered on
-- published_at) linked to them, but the public detail page reads via the
-- anon key where RLS only exposes status='published' rows -- so every one
-- of them 404'd and none appeared in the sitemap.
--
-- All 34 were verified substantive (766-1984 words, none empty or thin)
-- before publishing. The 6 known empty/soft-404 posts are a DIFFERENT set
-- that is already status='published' and is handled separately (converted
-- to case studies), so this statement does not touch them.
--
-- Run in the Supabase SQL editor (or via the CLI) against production.
-- Expected result: UPDATE 34.

update public.blog_posts
set status = 'published',
    is_published = true
where status = 'draft'
  and published_at is not null;

-- Optional consistency cleanup (safe): align is_published with status for
-- any older rows where they disagree, so the three publish columns
-- (status / is_published / published_at) stop contradicting each other.
-- Uncomment to run:
-- update public.blog_posts set is_published = (status = 'published');
