-- ============================================================
-- ACI Infotech - Database Schema Migration
-- Add SEO/AEO/GEO Fields to All Content Types
-- ============================================================
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- CASE STUDIES TABLE
-- ============================================================
ALTER TABLE case_studies
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(170),
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT[],
ADD COLUMN IF NOT EXISTS schema_markup JSONB;

-- Add comments for documentation
COMMENT ON COLUMN case_studies.excerpt IS 'Short summary for listings and cards (150-200 chars)';
COMMENT ON COLUMN case_studies.meta_title IS 'SEO title for search engines (50-60 chars optimal)';
COMMENT ON COLUMN case_studies.meta_description IS 'SEO description for search engines (150-160 chars optimal)';
COMMENT ON COLUMN case_studies.canonical_url IS 'Canonical URL for SEO (if different from default)';
COMMENT ON COLUMN case_studies.og_image_url IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN case_studies.keywords IS 'Array of SEO keywords';
COMMENT ON COLUMN case_studies.schema_markup IS 'Custom JSON-LD schema markup';

-- ============================================================
-- BLOG POSTS TABLE (verify existing columns, add missing)
-- ============================================================
-- Blog posts should already have most SEO fields, but let's ensure consistency
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS schema_markup JSONB;

COMMENT ON COLUMN blog_posts.canonical_url IS 'Canonical URL for SEO (if different from default)';
COMMENT ON COLUMN blog_posts.og_image_url IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN blog_posts.schema_markup IS 'Custom JSON-LD schema markup';

-- ============================================================
-- WHITEPAPERS TABLE
-- ============================================================
-- First, let's check if the table exists and add all needed columns
ALTER TABLE whitepapers
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(170),
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT[],
ADD COLUMN IF NOT EXISTS schema_markup JSONB,
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_bio TEXT,
ADD COLUMN IF NOT EXISTS author_image_url TEXT,
ADD COLUMN IF NOT EXISTS page_count INTEGER,
ADD COLUMN IF NOT EXISTS file_size_mb DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS table_of_contents JSONB,
ADD COLUMN IF NOT EXISTS related_services TEXT[],
ADD COLUMN IF NOT EXISTS related_industries TEXT[];

COMMENT ON COLUMN whitepapers.excerpt IS 'Short summary for listings (150-200 chars)';
COMMENT ON COLUMN whitepapers.meta_title IS 'SEO title (50-60 chars optimal)';
COMMENT ON COLUMN whitepapers.meta_description IS 'SEO description (150-160 chars optimal)';
COMMENT ON COLUMN whitepapers.table_of_contents IS 'JSON array of TOC items with title and page';

-- ============================================================
-- WEBINARS TABLE
-- ============================================================
ALTER TABLE webinars
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(70),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(170),
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT[],
ADD COLUMN IF NOT EXISTS schema_markup JSONB,
ADD COLUMN IF NOT EXISTS speakers JSONB,
ADD COLUMN IF NOT EXISTS agenda JSONB,
ADD COLUMN IF NOT EXISTS recording_url TEXT,
ADD COLUMN IF NOT EXISTS slides_url TEXT,
ADD COLUMN IF NOT EXISTS related_services TEXT[],
ADD COLUMN IF NOT EXISTS related_industries TEXT[];

COMMENT ON COLUMN webinars.excerpt IS 'Short summary for listings (150-200 chars)';
COMMENT ON COLUMN webinars.meta_title IS 'SEO title (50-60 chars optimal)';
COMMENT ON COLUMN webinars.meta_description IS 'SEO description (150-160 chars optimal)';
COMMENT ON COLUMN webinars.speakers IS 'JSON array of speaker objects with name, title, bio, image';
COMMENT ON COLUMN webinars.agenda IS 'JSON array of agenda items with time and topic';

-- ============================================================
-- CREATE INDEXES FOR BETTER QUERY PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(industry);
CREATE INDEX IF NOT EXISTS idx_case_studies_is_featured ON case_studies(is_featured);
CREATE INDEX IF NOT EXISTS idx_case_studies_published_at ON case_studies(published_at);

CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

CREATE INDEX IF NOT EXISTS idx_whitepapers_status ON whitepapers(status);
CREATE INDEX IF NOT EXISTS idx_whitepapers_is_featured ON whitepapers(is_featured);

CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars(status);
CREATE INDEX IF NOT EXISTS idx_webinars_is_featured ON webinars(is_featured);

-- ============================================================
-- FULL-TEXT SEARCH INDEXES (for better search functionality)
-- ============================================================
-- Case Studies
CREATE INDEX IF NOT EXISTS idx_case_studies_search ON case_studies
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(challenge, '') || ' ' || coalesce(solution, '') || ' ' || coalesce(results, '')));

-- Blog Posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

-- ============================================================
-- VERIFY THE CHANGES
-- ============================================================
-- Run these to verify columns were added:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'case_studies' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'blog_posts' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'whitepapers' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'webinars' ORDER BY ordinal_position;
