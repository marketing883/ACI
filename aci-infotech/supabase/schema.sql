-- ACI Infotech Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)

-- ============================================
-- 1. CONTACTS TABLE (Enhanced)
-- ============================================
-- This table stores all leads from various sources

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,

  -- Lead Details
  message TEXT,
  service_interest TEXT,

  -- Lead Tracking
  source TEXT DEFAULT 'contact_form', -- contact_form, chat, newsletter, whitepaper, webinar
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
  lead_score INTEGER DEFAULT 0,

  -- Location
  location TEXT,
  country TEXT,

  -- Additional Data (JSON for flexibility)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT contacts_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- ============================================
-- 2. CHAT LEADS TABLE
-- ============================================
-- Stores leads captured through the chat widget

CREATE TABLE IF NOT EXISTS chat_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Lead Info (captured progressively)
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,

  -- Chat Details
  session_id TEXT NOT NULL,
  service_interest TEXT,
  conversation_summary TEXT,
  conversation_history JSONB DEFAULT '[]'::jsonb,

  -- Lead Quality
  lead_score INTEGER DEFAULT 0,
  is_qualified BOOLEAN DEFAULT FALSE,

  -- Tracking
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,

  -- AI Analysis
  ai_analysis JSONB DEFAULT '{}'::jsonb
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_leads_session ON chat_leads(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_leads_email ON chat_leads(email);
CREATE INDEX IF NOT EXISTS idx_chat_leads_created_at ON chat_leads(created_at DESC);

-- ============================================
-- 3. BLOG POSTS TABLE
-- ============================================
-- CMS for blog articles

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],

  -- Categorization
  category TEXT,
  tags TEXT[],

  -- Author
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  author_avatar TEXT,

  -- Media
  featured_image TEXT,
  featured_image_alt TEXT,

  -- Status
  status TEXT DEFAULT 'draft', -- draft, published, archived

  -- Metrics
  view_count INTEGER DEFAULT 0,
  read_time_minutes INTEGER,

  -- AI Generated
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- ============================================
-- 4. CASE STUDIES TABLE
-- ============================================
-- CMS for case studies

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,

  -- Client Info
  client_name TEXT NOT NULL,
  client_logo TEXT,
  client_industry TEXT,
  client_size TEXT, -- SMB, Mid-Market, Enterprise
  client_location TEXT,

  -- Case Study Content
  challenge TEXT,
  solution TEXT,
  results TEXT,

  -- Metrics (structured for display)
  metrics JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"label": "Cost Reduction", "value": "45%"}, {"label": "Time Saved", "value": "60%"}]

  -- Technologies Used
  technologies TEXT[],
  services TEXT[],

  -- Testimonial
  testimonial_quote TEXT,
  testimonial_author TEXT,
  testimonial_title TEXT,

  -- Media
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Status
  status TEXT DEFAULT 'draft', -- draft, published, archived
  is_featured BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry ON case_studies(client_industry);

-- ============================================
-- 5. WHITEPAPERS TABLE
-- ============================================
-- CMS for whitepapers/downloadable resources

CREATE TABLE IF NOT EXISTS whitepapers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- File
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  page_count INTEGER,

  -- Categorization
  category TEXT,
  tags TEXT[],
  topics TEXT[],

  -- Media
  cover_image TEXT,
  preview_pages JSONB DEFAULT '[]'::jsonb,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Lead Capture
  requires_registration BOOLEAN DEFAULT TRUE,

  -- Metrics
  download_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'draft' -- draft, published, archived
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_whitepapers_slug ON whitepapers(slug);
CREATE INDEX IF NOT EXISTS idx_whitepapers_status ON whitepapers(status);

-- ============================================
-- 6. WHITEPAPER DOWNLOADS (Lead Capture)
-- ============================================
-- Track who downloaded which whitepaper

CREATE TABLE IF NOT EXISTS whitepaper_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  whitepaper_id UUID REFERENCES whitepapers(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,

  -- Lead Info (if not linked to contact)
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  job_title TEXT,

  -- Tracking
  ip_address TEXT,
  user_agent TEXT
);

-- Index
CREATE INDEX IF NOT EXISTS idx_whitepaper_downloads_whitepaper ON whitepaper_downloads(whitepaper_id);
CREATE INDEX IF NOT EXISTS idx_whitepaper_downloads_email ON whitepaper_downloads(email);

-- ============================================
-- 7. WEBINARS TABLE
-- ============================================
-- CMS for webinar announcements

CREATE TABLE IF NOT EXISTS webinars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Schedule
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'America/New_York',

  -- Speakers
  speakers JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"name": "John Doe", "title": "CTO", "company": "ACI", "avatar": "url"}]

  -- Topics
  topics TEXT[],
  tags TEXT[],

  -- Media
  featured_image TEXT,

  -- External Platform
  platform TEXT, -- zoom, teams, webex, gotowebinar
  registration_url TEXT,
  join_url TEXT,

  -- Recording (after webinar)
  recording_url TEXT,
  is_recorded BOOLEAN DEFAULT FALSE,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Status
  status TEXT DEFAULT 'upcoming' -- upcoming, live, completed, cancelled
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_webinars_slug ON webinars(slug);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars(status);
CREATE INDEX IF NOT EXISTS idx_webinars_scheduled_at ON webinars(scheduled_at);

-- ============================================
-- 8. WEBINAR REGISTRATIONS
-- ============================================
-- Track webinar registrations (for lead capture)

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  webinar_id UUID REFERENCES webinars(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,

  -- Lead Info
  email TEXT NOT NULL,
  name TEXT,
  company TEXT,
  job_title TEXT,

  -- Status
  attended BOOLEAN DEFAULT FALSE,

  -- External Platform ID
  external_registration_id TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_webinar ON webinar_registrations(webinar_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_email ON webinar_registrations(email);

-- ============================================
-- 9. NEWSLETTER SUBSCRIBERS
-- ============================================
-- Newsletter subscription management

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  email TEXT NOT NULL UNIQUE,
  name TEXT,

  -- Preferences
  topics TEXT[],
  frequency TEXT DEFAULT 'weekly', -- daily, weekly, monthly

  -- Status
  status TEXT DEFAULT 'active', -- active, unsubscribed, bounced
  unsubscribed_at TIMESTAMPTZ,

  -- Tracking
  source TEXT, -- footer, popup, blog, whitepaper

  -- Link to contact if exists
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- ============================================
-- 10. CONTENT CATEGORIES
-- ============================================
-- Shared categories for all content types

CREATE TABLE IF NOT EXISTS content_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Parent for hierarchical categories
  parent_id UUID REFERENCES content_categories(id),

  -- Content type this category applies to
  content_type TEXT NOT NULL, -- blog, case_study, whitepaper, webinar, all

  -- Display order
  sort_order INTEGER DEFAULT 0
);

-- Index
CREATE INDEX IF NOT EXISTS idx_content_categories_slug ON content_categories(slug);
CREATE INDEX IF NOT EXISTS idx_content_categories_type ON content_categories(content_type);

-- ============================================
-- 11. SEO METRICS (DataforSEO Cache)
-- ============================================
-- Cache SEO data from DataforSEO

CREATE TABLE IF NOT EXISTS seo_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Keyword
  keyword TEXT NOT NULL,

  -- Metrics
  search_volume INTEGER,
  cpc DECIMAL(10, 2),
  competition DECIMAL(5, 4),
  difficulty INTEGER,

  -- Related data
  related_keywords JSONB DEFAULT '[]'::jsonb,
  serp_data JSONB DEFAULT '{}'::jsonb,

  -- Cache control
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Index
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_metrics_keyword ON seo_metrics(keyword);

-- ============================================
-- 12. ADMIN ACTIVITY LOG
-- ============================================
-- Track admin actions for audit

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,

  action TEXT NOT NULL, -- create, update, delete, publish, etc.
  resource_type TEXT NOT NULL, -- blog_post, case_study, contact, etc.
  resource_id UUID,

  -- Details
  details JSONB DEFAULT '{}'::jsonb,

  -- Request info
  ip_address TEXT,
  user_agent TEXT
);

-- Index
CREATE INDEX IF NOT EXISTS idx_admin_activity_user ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_resource ON admin_activity_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON admin_activity_log(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
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

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(title),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

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

-- Policies for authenticated admin users
-- Contacts - admins can do everything
CREATE POLICY "Admins can view all contacts" ON contacts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert contacts" ON contacts
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update contacts" ON contacts
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete contacts" ON contacts
  FOR DELETE TO authenticated USING (true);

-- Public can insert contacts (for forms)
CREATE POLICY "Public can submit contacts" ON contacts
  FOR INSERT TO anon WITH CHECK (true);

-- Chat leads - admins can view, public can insert
CREATE POLICY "Admins can view chat leads" ON chat_leads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can insert chat leads" ON chat_leads
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admins can update chat leads" ON chat_leads
  FOR UPDATE TO authenticated USING (true);

-- Blog posts - admins full access, public can view published
CREATE POLICY "Admins can do everything with blog posts" ON blog_posts
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT TO anon USING (status = 'published');

-- Case studies - same as blog
CREATE POLICY "Admins can do everything with case studies" ON case_studies
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view published case studies" ON case_studies
  FOR SELECT TO anon USING (status = 'published');

-- Whitepapers - same pattern
CREATE POLICY "Admins can do everything with whitepapers" ON whitepapers
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view published whitepapers" ON whitepapers
  FOR SELECT TO anon USING (status = 'published');

-- Whitepaper downloads - admins view, public insert
CREATE POLICY "Admins can view whitepaper downloads" ON whitepaper_downloads
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can register downloads" ON whitepaper_downloads
  FOR INSERT TO anon WITH CHECK (true);

-- Webinars - same as blog
CREATE POLICY "Admins can do everything with webinars" ON webinars
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view non-draft webinars" ON webinars
  FOR SELECT TO anon USING (status != 'draft');

-- Webinar registrations - admins view, public insert
CREATE POLICY "Admins can view webinar registrations" ON webinar_registrations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public can register for webinars" ON webinar_registrations
  FOR INSERT TO anon WITH CHECK (true);

-- Newsletter - admins full, public insert
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Categories - admins manage, public view
CREATE POLICY "Admins can manage categories" ON content_categories
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Public can view categories" ON content_categories
  FOR SELECT TO anon USING (true);

-- SEO metrics - admins only
CREATE POLICY "Admins can manage SEO metrics" ON seo_metrics
  FOR ALL TO authenticated USING (true);

-- Activity log - admins only
CREATE POLICY "Admins can view activity log" ON admin_activity_log
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert activity log" ON admin_activity_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- SEED DATA - Default Categories
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
-- 1. Create an admin user in Supabase Auth
-- 2. Test the login at /admin/login
-- 3. Configure your environment variables:
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - ANTHROPIC_API_KEY (for AI features)
