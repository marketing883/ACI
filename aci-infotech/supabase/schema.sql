-- ACI Infotech Database Schema (Fixed Version)
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)
-- This schema handles existing tables gracefully

-- ============================================
-- STEP 1: ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================
-- This handles the case where contacts table already exists

DO $$
BEGIN
  -- Add columns to contacts if they don't exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contacts') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'source') THEN
      ALTER TABLE contacts ADD COLUMN source TEXT DEFAULT 'contact_form';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'status') THEN
      ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT 'new';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'lead_score') THEN
      ALTER TABLE contacts ADD COLUMN lead_score INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'location') THEN
      ALTER TABLE contacts ADD COLUMN location TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'country') THEN
      ALTER TABLE contacts ADD COLUMN country TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'metadata') THEN
      ALTER TABLE contacts ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'updated_at') THEN
      ALTER TABLE contacts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'job_title') THEN
      ALTER TABLE contacts ADD COLUMN job_title TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'service_interest') THEN
      ALTER TABLE contacts ADD COLUMN service_interest TEXT;
    END IF;
  END IF;
END $$;

-- ============================================
-- 1. CONTACTS TABLE (Create if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  message TEXT,
  service_interest TEXT,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new',
  lead_score INTEGER DEFAULT 0,
  location TEXT,
  country TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- ============================================
-- 2. CHAT LEADS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS chat_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  session_id TEXT NOT NULL,
  service_interest TEXT,
  conversation_summary TEXT,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  lead_score INTEGER DEFAULT 0,
  is_qualified BOOLEAN DEFAULT FALSE,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ai_analysis JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_chat_leads_session ON chat_leads(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_leads_email ON chat_leads(email);
CREATE INDEX IF NOT EXISTS idx_chat_leads_created_at ON chat_leads(created_at DESC);

-- ============================================
-- 3. BLOG POSTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  category TEXT,
  tags TEXT[],
  author_id UUID,
  author_name TEXT,
  author_avatar TEXT,
  featured_image TEXT,
  featured_image_alt TEXT,
  status TEXT DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- ============================================
-- 4. CASE STUDIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  client_name TEXT NOT NULL,
  client_logo TEXT,
  client_industry TEXT,
  client_size TEXT,
  client_location TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  metrics JSONB DEFAULT '[]'::jsonb,
  technologies TEXT[],
  services TEXT[],
  testimonial_quote TEXT,
  testimonial_author TEXT,
  testimonial_title TEXT,
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(client_industry);

-- ============================================
-- 5. WHITEPAPERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS whitepapers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  file_url TEXT,
  file_size_bytes INTEGER,
  page_count INTEGER,
  category TEXT,
  tags TEXT[],
  topics TEXT[],
  cover_image TEXT,
  preview_pages JSONB DEFAULT '[]'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  requires_registration BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft'
);

CREATE INDEX IF NOT EXISTS idx_whitepapers_slug ON whitepapers(slug);
CREATE INDEX IF NOT EXISTS idx_whitepapers_status ON whitepapers(status);

-- ============================================
-- 6. WHITEPAPER DOWNLOADS
-- ============================================

CREATE TABLE IF NOT EXISTS whitepaper_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  whitepaper_id UUID,
  contact_id UUID,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  job_title TEXT,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_whitepaper_downloads_whitepaper ON whitepaper_downloads(whitepaper_id);
CREATE INDEX IF NOT EXISTS idx_whitepaper_downloads_email ON whitepaper_downloads(email);

-- ============================================
-- 7. WEBINARS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS webinars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'America/New_York',
  speakers JSONB DEFAULT '[]'::jsonb,
  topics TEXT[],
  tags TEXT[],
  featured_image TEXT,
  platform TEXT,
  registration_url TEXT,
  join_url TEXT,
  recording_url TEXT,
  is_recorded BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'upcoming'
);

CREATE INDEX IF NOT EXISTS idx_webinars_slug ON webinars(slug);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars(status);
CREATE INDEX IF NOT EXISTS idx_webinars_scheduled_at ON webinars(scheduled_at);

-- ============================================
-- 8. WEBINAR REGISTRATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  webinar_id UUID,
  contact_id UUID,
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  job_title TEXT,
  attended BOOLEAN DEFAULT FALSE,
  external_registration_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar ON webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_email ON webinar_registrations(email);

-- ============================================
-- 9. NEWSLETTER SUBSCRIBERS
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  topics TEXT[],
  frequency TEXT DEFAULT 'weekly',
  status TEXT DEFAULT 'active',
  unsubscribed_at TIMESTAMPTZ,
  source TEXT,
  contact_id UUID
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- ============================================
-- 10. CONTENT CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS content_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID,
  content_type TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_content_categories_slug ON content_categories(slug);
CREATE INDEX IF NOT EXISTS idx_content_categories_type ON content_categories(content_type);

-- ============================================
-- 11. SEO METRICS
-- ============================================

CREATE TABLE IF NOT EXISTS seo_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  cpc DECIMAL(10, 2),
  competition DECIMAL(5, 4),
  difficulty INTEGER,
  related_keywords JSONB DEFAULT '[]'::jsonb,
  serp_data JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_metrics_keyword ON seo_metrics(keyword);

-- ============================================
-- 12. ADMIN ACTIVITY LOG
-- ============================================

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_user ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_resource ON admin_activity_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON admin_activity_log(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist (to avoid errors)
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
DROP TRIGGER IF EXISTS update_chat_leads_updated_at ON chat_leads;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
DROP TRIGGER IF EXISTS update_whitepapers_updated_at ON whitepapers;
DROP TRIGGER IF EXISTS update_webinars_updated_at ON webinars;
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
DROP TRIGGER IF EXISTS update_seo_metrics_updated_at ON seo_metrics;

-- Create triggers
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_leads_updated_at
  BEFORE UPDATE ON chat_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whitepapers_updated_at
  BEFORE UPDATE ON whitepapers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webinars_updated_at
  BEFORE UPDATE ON webinars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_metrics_updated_at
  BEFORE UPDATE ON seo_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitepapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitepaper_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can update contacts" ON contacts;
DROP POLICY IF EXISTS "Admins can delete contacts" ON contacts;
DROP POLICY IF EXISTS "Public can submit contacts" ON contacts;

DROP POLICY IF EXISTS "Admins can view chat leads" ON chat_leads;
DROP POLICY IF EXISTS "Public can insert chat leads" ON chat_leads;
DROP POLICY IF EXISTS "Admins can update chat leads" ON chat_leads;

DROP POLICY IF EXISTS "Admins can do everything with blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;

DROP POLICY IF EXISTS "Admins can do everything with case studies" ON case_studies;
DROP POLICY IF EXISTS "Public can view published case studies" ON case_studies;

DROP POLICY IF EXISTS "Admins can do everything with whitepapers" ON whitepapers;
DROP POLICY IF EXISTS "Public can view published whitepapers" ON whitepapers;

DROP POLICY IF EXISTS "Admins can view whitepaper downloads" ON whitepaper_downloads;
DROP POLICY IF EXISTS "Public can register downloads" ON whitepaper_downloads;

DROP POLICY IF EXISTS "Admins can do everything with webinars" ON webinars;
DROP POLICY IF EXISTS "Public can view non-draft webinars" ON webinars;

DROP POLICY IF EXISTS "Admins can view webinar registrations" ON webinar_registrations;
DROP POLICY IF EXISTS "Public can register for webinars" ON webinar_registrations;

DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON newsletter_subscribers;

DROP POLICY IF EXISTS "Admins can manage categories" ON content_categories;
DROP POLICY IF EXISTS "Public can view categories" ON content_categories;

DROP POLICY IF EXISTS "Admins can manage SEO metrics" ON seo_metrics;

DROP POLICY IF EXISTS "Admins can view activity log" ON admin_activity_log;
DROP POLICY IF EXISTS "System can insert activity log" ON admin_activity_log;

-- Create new policies

-- Contacts
CREATE POLICY "Admins can view all contacts" ON contacts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert contacts" ON contacts
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update contacts" ON contacts
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete contacts" ON contacts
  FOR DELETE TO authenticated USING (true);
CREATE POLICY "Public can submit contacts" ON contacts
  FOR INSERT TO anon WITH CHECK (true);

-- Chat leads
CREATE POLICY "Admins can view chat leads" ON chat_leads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can insert chat leads" ON chat_leads
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admins can update chat leads" ON chat_leads
  FOR UPDATE TO authenticated USING (true);

-- Blog posts
CREATE POLICY "Admins can do everything with blog posts" ON blog_posts
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT TO anon USING (status = 'published');

-- Case studies
CREATE POLICY "Admins can do everything with case studies" ON case_studies
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view published case studies" ON case_studies
  FOR SELECT TO anon USING (status = 'published');

-- Whitepapers
CREATE POLICY "Admins can do everything with whitepapers" ON whitepapers
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view published whitepapers" ON whitepapers
  FOR SELECT TO anon USING (status = 'published');

-- Whitepaper downloads
CREATE POLICY "Admins can view whitepaper downloads" ON whitepaper_downloads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can register downloads" ON whitepaper_downloads
  FOR INSERT TO anon WITH CHECK (true);

-- Webinars
CREATE POLICY "Admins can do everything with webinars" ON webinars
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view non-draft webinars" ON webinars
  FOR SELECT TO anon USING (status != 'draft');

-- Webinar registrations
CREATE POLICY "Admins can view webinar registrations" ON webinar_registrations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can register for webinars" ON webinar_registrations
  FOR INSERT TO anon WITH CHECK (true);

-- Newsletter
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Categories
CREATE POLICY "Admins can manage categories" ON content_categories
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view categories" ON content_categories
  FOR SELECT TO anon USING (true);

-- SEO metrics
CREATE POLICY "Admins can manage SEO metrics" ON seo_metrics
  FOR ALL TO authenticated USING (true);

-- Activity log
CREATE POLICY "Admins can view activity log" ON admin_activity_log
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert activity log" ON admin_activity_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO content_categories (name, slug, content_type, sort_order) VALUES
  ('Data & Analytics', 'data-analytics', 'all', 1),
  ('Cloud Infrastructure', 'cloud-infrastructure', 'all', 2),
  ('AI & Machine Learning', 'ai-machine-learning', 'all', 3),
  ('Digital Transformation', 'digital-transformation', 'all', 4),
  ('Cybersecurity', 'cybersecurity', 'all', 5),
  ('DevOps & Automation', 'devops-automation', 'all', 6),
  ('Enterprise Applications', 'enterprise-applications', 'all', 7),
  ('Industry Insights', 'industry-insights', 'blog', 8),
  ('Best Practices', 'best-practices', 'blog', 9),
  ('Technology News', 'technology-news', 'blog', 10)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- After running this schema:
-- 1. Go to Authentication > Users > Add user
-- 2. Create an admin user with email/password
-- 3. Test login at /admin/login
