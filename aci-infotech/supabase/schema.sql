-- ACI Infotech Database Schema (Robust Version)
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: CREATE ALL TABLES FIRST
-- ============================================

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  email TEXT,
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

CREATE TABLE IF NOT EXISTS chat_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  session_id TEXT,
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

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  title TEXT,
  slug TEXT,
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
  ai_metadata JSONB DEFAULT '{}'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  client_name TEXT,
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

CREATE TABLE IF NOT EXISTS whitepapers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  title TEXT,
  slug TEXT,
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
  status TEXT DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS whitepaper_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  whitepaper_id UUID,
  contact_id UUID,
  email TEXT,
  name TEXT,
  company TEXT,
  job_title TEXT,
  ip_address TEXT,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS webinars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT,
  slug TEXT,
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

CREATE TABLE IF NOT EXISTS webinar_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  webinar_id UUID,
  contact_id UUID,
  email TEXT,
  name TEXT,
  company TEXT,
  job_title TEXT,
  attended BOOLEAN DEFAULT FALSE,
  external_registration_id TEXT
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT,
  name TEXT,
  topics TEXT[],
  frequency TEXT DEFAULT 'weekly',
  status TEXT DEFAULT 'active',
  unsubscribed_at TIMESTAMPTZ,
  source TEXT,
  contact_id UUID
);

CREATE TABLE IF NOT EXISTS content_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  slug TEXT,
  description TEXT,
  parent_id UUID,
  content_type TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS seo_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  keyword TEXT,
  search_volume INTEGER,
  cpc DECIMAL(10, 2),
  competition DECIMAL(5, 4),
  difficulty INTEGER,
  related_keywords JSONB DEFAULT '[]'::jsonb,
  serp_data JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  user_email TEXT,
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================
-- PLAYBOOK LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS playbook_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Lead information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  job_title TEXT,

  -- Playbook information
  playbook_slug TEXT NOT NULL,
  playbook_title TEXT,

  -- Download token system
  download_token TEXT UNIQUE NOT NULL,
  token_used BOOLEAN DEFAULT FALSE,
  token_expiry TIMESTAMPTZ NOT NULL,
  downloaded_at TIMESTAMPTZ,

  -- Tracking
  source TEXT DEFAULT 'playbooks-page',
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================
-- WHITEPAPER LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS whitepaper_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Lead information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  job_title TEXT,

  -- Whitepaper information
  whitepaper_slug TEXT NOT NULL,
  whitepaper_title TEXT,

  -- Download token system
  download_token TEXT UNIQUE NOT NULL,
  token_used BOOLEAN DEFAULT FALSE,
  token_expiry TIMESTAMPTZ NOT NULL,
  downloaded_at TIMESTAMPTZ,

  -- Tracking
  source TEXT DEFAULT 'whitepapers-page',
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================
-- STEP 2: ADD MISSING COLUMNS TO ALL TABLES
-- ============================================

DO $$
BEGIN
  -- contacts
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'status') THEN
    ALTER TABLE contacts ADD COLUMN status TEXT DEFAULT 'new';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'source') THEN
    ALTER TABLE contacts ADD COLUMN source TEXT DEFAULT 'contact_form';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'lead_score') THEN
    ALTER TABLE contacts ADD COLUMN lead_score INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'updated_at') THEN
    ALTER TABLE contacts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contacts' AND column_name = 'metadata') THEN
    ALTER TABLE contacts ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- blog_posts
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'status') THEN
    ALTER TABLE blog_posts ADD COLUMN status TEXT DEFAULT 'draft';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'is_featured') THEN
    ALTER TABLE blog_posts ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
  END IF;

  -- case_studies
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'status') THEN
    ALTER TABLE case_studies ADD COLUMN status TEXT DEFAULT 'draft';
  END IF;

  -- whitepapers
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'whitepapers' AND column_name = 'status') THEN
    ALTER TABLE whitepapers ADD COLUMN status TEXT DEFAULT 'draft';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'whitepapers' AND column_name = 'is_featured') THEN
    ALTER TABLE whitepapers ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
  END IF;

  -- webinars
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'webinars' AND column_name = 'status') THEN
    ALTER TABLE webinars ADD COLUMN status TEXT DEFAULT 'upcoming';
  END IF;

  -- newsletter_subscribers
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'status') THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
END $$;

-- ============================================
-- STEP 3: CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_chat_leads_session ON chat_leads(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_leads_email ON chat_leads(email);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_whitepapers_slug ON whitepapers(slug);
CREATE INDEX IF NOT EXISTS idx_whitepapers_status ON whitepapers(status);
CREATE INDEX IF NOT EXISTS idx_webinars_slug ON webinars(slug);
CREATE INDEX IF NOT EXISTS idx_webinars_status ON webinars(status);

-- Playbook leads indexes
CREATE INDEX IF NOT EXISTS idx_playbook_leads_email ON playbook_leads(email);
CREATE INDEX IF NOT EXISTS idx_playbook_leads_token ON playbook_leads(download_token);
CREATE INDEX IF NOT EXISTS idx_playbook_leads_playbook ON playbook_leads(playbook_slug);
CREATE INDEX IF NOT EXISTS idx_playbook_leads_created ON playbook_leads(created_at DESC);

-- Whitepaper leads indexes
CREATE INDEX IF NOT EXISTS idx_whitepaper_leads_email ON whitepaper_leads(email);
CREATE INDEX IF NOT EXISTS idx_whitepaper_leads_token ON whitepaper_leads(download_token);
CREATE INDEX IF NOT EXISTS idx_whitepaper_leads_whitepaper ON whitepaper_leads(whitepaper_slug);
CREATE INDEX IF NOT EXISTS idx_whitepaper_leads_created ON whitepaper_leads(created_at DESC);

-- ============================================
-- STEP 4: FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
DROP TRIGGER IF EXISTS update_chat_leads_updated_at ON chat_leads;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
DROP TRIGGER IF EXISTS update_whitepapers_updated_at ON whitepapers;
DROP TRIGGER IF EXISTS update_webinars_updated_at ON webinars;
DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
DROP TRIGGER IF EXISTS update_seo_metrics_updated_at ON seo_metrics;
DROP TRIGGER IF EXISTS update_playbook_leads_updated_at ON playbook_leads;
DROP TRIGGER IF EXISTS update_whitepaper_leads_updated_at ON whitepaper_leads;

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_leads_updated_at BEFORE UPDATE ON chat_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whitepapers_updated_at BEFORE UPDATE ON whitepapers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webinars_updated_at BEFORE UPDATE ON webinars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_metrics_updated_at BEFORE UPDATE ON seo_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_playbook_leads_updated_at BEFORE UPDATE ON playbook_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whitepaper_leads_updated_at BEFORE UPDATE ON whitepaper_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 5: ENABLE RLS
-- ============================================

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
ALTER TABLE playbook_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitepaper_leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: DROP ALL EXISTING POLICIES
-- ============================================

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('contacts', 'chat_leads', 'blog_posts', 'case_studies',
                      'whitepapers', 'whitepaper_downloads', 'webinars',
                      'webinar_registrations', 'newsletter_subscribers',
                      'content_categories', 'seo_metrics', 'admin_activity_log',
                      'playbook_leads', 'whitepaper_leads')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ============================================
-- STEP 7: CREATE ALL POLICIES
-- ============================================

-- Contacts
CREATE POLICY "contacts_select_auth" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "contacts_insert_auth" ON contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "contacts_update_auth" ON contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "contacts_delete_auth" ON contacts FOR DELETE TO authenticated USING (true);
CREATE POLICY "contacts_insert_anon" ON contacts FOR INSERT TO anon WITH CHECK (true);

-- Chat leads
CREATE POLICY "chat_leads_select_auth" ON chat_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "chat_leads_insert_anon" ON chat_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "chat_leads_update_auth" ON chat_leads FOR UPDATE TO authenticated USING (true);

-- Blog posts
CREATE POLICY "blog_posts_all_auth" ON blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "blog_posts_select_anon" ON blog_posts FOR SELECT TO anon USING (status = 'published');

-- Case studies
CREATE POLICY "case_studies_all_auth" ON case_studies FOR ALL TO authenticated USING (true);
CREATE POLICY "case_studies_select_anon" ON case_studies FOR SELECT TO anon USING (status = 'published');

-- Whitepapers
CREATE POLICY "whitepapers_all_auth" ON whitepapers FOR ALL TO authenticated USING (true);
CREATE POLICY "whitepapers_select_anon" ON whitepapers FOR SELECT TO anon USING (status = 'published');

-- Whitepaper downloads
CREATE POLICY "whitepaper_downloads_select_auth" ON whitepaper_downloads FOR SELECT TO authenticated USING (true);
CREATE POLICY "whitepaper_downloads_insert_anon" ON whitepaper_downloads FOR INSERT TO anon WITH CHECK (true);

-- Webinars
CREATE POLICY "webinars_all_auth" ON webinars FOR ALL TO authenticated USING (true);
CREATE POLICY "webinars_select_anon" ON webinars FOR SELECT TO anon USING (status != 'draft');

-- Webinar registrations
CREATE POLICY "webinar_registrations_select_auth" ON webinar_registrations FOR SELECT TO authenticated USING (true);
CREATE POLICY "webinar_registrations_insert_anon" ON webinar_registrations FOR INSERT TO anon WITH CHECK (true);

-- Newsletter
CREATE POLICY "newsletter_all_auth" ON newsletter_subscribers FOR ALL TO authenticated USING (true);
CREATE POLICY "newsletter_insert_anon" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);

-- Categories
CREATE POLICY "categories_all_auth" ON content_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "categories_select_anon" ON content_categories FOR SELECT TO anon USING (true);

-- SEO metrics
CREATE POLICY "seo_all_auth" ON seo_metrics FOR ALL TO authenticated USING (true);

-- Activity log
CREATE POLICY "activity_select_auth" ON admin_activity_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "activity_insert_auth" ON admin_activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- Playbook leads - anyone can submit, authenticated can read/update
CREATE POLICY "playbook_leads_select_auth" ON playbook_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "playbook_leads_insert_anon" ON playbook_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "playbook_leads_insert_auth" ON playbook_leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "playbook_leads_update_anon" ON playbook_leads FOR UPDATE TO anon USING (true);
CREATE POLICY "playbook_leads_update_auth" ON playbook_leads FOR UPDATE TO authenticated USING (true);

-- Whitepaper leads - anyone can submit, authenticated can read/update
CREATE POLICY "whitepaper_leads_select_auth" ON whitepaper_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "whitepaper_leads_insert_anon" ON whitepaper_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "whitepaper_leads_insert_auth" ON whitepaper_leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "whitepaper_leads_update_anon" ON whitepaper_leads FOR UPDATE TO anon USING (true);
CREATE POLICY "whitepaper_leads_update_auth" ON whitepaper_leads FOR UPDATE TO authenticated USING (true);

-- ============================================
-- STEP 8: SEED DATA
-- ============================================

INSERT INTO content_categories (name, slug, content_type, sort_order)
SELECT * FROM (VALUES
  ('Data & Analytics', 'data-analytics', 'all', 1),
  ('Cloud Infrastructure', 'cloud-infrastructure', 'all', 2),
  ('AI & Machine Learning', 'ai-machine-learning', 'all', 3),
  ('Digital Transformation', 'digital-transformation', 'all', 4),
  ('Cybersecurity', 'cybersecurity', 'all', 5)
) AS v(name, slug, content_type, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM content_categories WHERE slug = v.slug);

-- ============================================
-- STEP 9: VIEWS
-- ============================================

-- Combined leads view for dashboard
CREATE OR REPLACE VIEW all_leads AS
SELECT
  id,
  created_at,
  name,
  email,
  company,
  'contact' as lead_type,
  'Contact Form' as item_name,
  NULL::boolean as downloaded
FROM contacts
UNION ALL
SELECT
  id,
  created_at,
  name,
  email,
  company,
  'playbook' as lead_type,
  playbook_title as item_name,
  token_used as downloaded
FROM playbook_leads
UNION ALL
SELECT
  id,
  created_at,
  name,
  email,
  company,
  'whitepaper' as lead_type,
  whitepaper_title as item_name,
  token_used as downloaded
FROM whitepaper_leads
ORDER BY created_at DESC;

-- Lead stats summary view
CREATE OR REPLACE VIEW lead_stats AS
SELECT
  (SELECT COUNT(*) FROM contacts) as total_contacts,
  (SELECT COUNT(*) FROM contacts WHERE status = 'new') as new_contacts,
  (SELECT COUNT(*) FROM playbook_leads) as total_playbook_leads,
  (SELECT COUNT(*) FROM playbook_leads WHERE token_used = true) as playbook_downloads,
  (SELECT COUNT(*) FROM whitepaper_leads) as total_whitepaper_leads,
  (SELECT COUNT(*) FROM whitepaper_leads WHERE token_used = true) as whitepaper_downloads,
  (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') as published_posts,
  (SELECT COUNT(*) FROM case_studies WHERE status = 'published') as published_case_studies;

-- ============================================
-- DONE!
-- ============================================
