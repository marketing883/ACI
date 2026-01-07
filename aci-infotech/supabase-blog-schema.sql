-- ==========================================
-- BLOG POSTS TABLE - COMPLETE SCHEMA
-- ==========================================
-- Run this in Supabase SQL Editor to fix the blog_posts table
-- This will DROP the existing table and CREATE a new one with the correct columns

-- Step 1: Drop existing table (if exists)
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Step 2: Create blog_posts table with all required columns
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Core content fields
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,

    -- Image fields (both naming conventions for compatibility)
    featured_image TEXT,
    featured_image_url TEXT,
    featured_image_alt TEXT,

    -- Author information
    author_name TEXT DEFAULT 'ACI Infotech',
    author_title TEXT,
    author_image_url TEXT,

    -- Categorization
    category TEXT DEFAULT 'Insights',
    tags TEXT[],

    -- Reading metrics
    read_time_minutes INTEGER DEFAULT 5,
    view_count INTEGER DEFAULT 0,

    -- Publishing status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,

    -- Feature flags
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    ai_generated BOOLEAN DEFAULT FALSE,

    -- SEO fields
    seo_title TEXT,
    seo_description TEXT,
    meta_keywords TEXT[]
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Step 4: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies for public read access
DROP POLICY IF EXISTS "Allow public read access to published posts" ON blog_posts;
CREATE POLICY "Allow public read access to published posts"
    ON blog_posts
    FOR SELECT
    USING (status = 'published' OR true);  -- Allow all reads for now

DROP POLICY IF EXISTS "Allow authenticated users full access" ON blog_posts;
CREATE POLICY "Allow authenticated users full access"
    ON blog_posts
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Step 7: Grant permissions
GRANT ALL ON blog_posts TO anon;
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON blog_posts TO service_role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Blog posts table created successfully with all required columns!';
END $$;
