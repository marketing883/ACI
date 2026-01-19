-- ============================================================
-- ACI Infotech - COMPLETE Database Schema
-- Run this ONCE to set up all tables correctly
-- ============================================================
-- WARNING: This will DROP and RECREATE tables. Back up data first!
-- ============================================================

-- ============================================================
-- CASE STUDIES TABLE - Complete Schema
-- ============================================================
DROP TABLE IF EXISTS case_studies CASCADE;

CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,

  -- Client Info
  client_name VARCHAR(255) NOT NULL,
  client_logo_url TEXT,
  industry VARCHAR(100),
  client_size VARCHAR(100),
  client_location VARCHAR(255),

  -- Story Content
  challenge TEXT,
  solution TEXT,
  results TEXT,

  -- Structured Data (JSON)
  metrics JSONB DEFAULT '[]',
  technologies TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',

  -- Testimonial
  testimonial_quote TEXT,
  testimonial_author VARCHAR(255),
  testimonial_title VARCHAR(255),

  -- Media
  featured_image_url TEXT,

  -- Publishing
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,

  -- SEO Fields
  meta_title VARCHAR(70),
  meta_description VARCHAR(170),
  canonical_url TEXT,
  og_image_url TEXT,
  keywords TEXT[] DEFAULT '{}',
  schema_markup JSONB
);

-- Indexes for performance
CREATE INDEX idx_case_studies_slug ON case_studies(slug);
CREATE INDEX idx_case_studies_status ON case_studies(status);
CREATE INDEX idx_case_studies_industry ON case_studies(industry);
CREATE INDEX idx_case_studies_is_featured ON case_studies(is_featured);
CREATE INDEX idx_case_studies_published_at ON case_studies(published_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_case_studies_updated_at
    BEFORE UPDATE ON case_studies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- BLOG POSTS TABLE - Complete Schema
-- ============================================================
DROP TABLE IF EXISTS blog_posts CASCADE;

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,

  -- Author Info
  author_name VARCHAR(255),
  author_title VARCHAR(255),
  author_bio TEXT,
  author_image_url TEXT,
  author_linkedin TEXT,
  author_twitter TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  article_type VARCHAR(50) DEFAULT 'blog',

  -- FAQ/AEO
  faqs JSONB DEFAULT '[]',

  -- Media
  featured_image_url TEXT,

  -- Reading
  read_time_minutes INTEGER DEFAULT 5,

  -- Publishing
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,

  -- SEO Fields
  seo_title VARCHAR(70),
  seo_description VARCHAR(170),
  canonical_url TEXT,
  og_image_url TEXT,
  schema_markup JSONB
);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- WHITEPAPERS TABLE - Complete Schema
-- ============================================================
DROP TABLE IF EXISTS whitepapers CASCADE;

CREATE TABLE whitepapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  description TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',

  -- Files
  thumbnail_url TEXT,
  pdf_url TEXT,

  -- Author Info
  author_name VARCHAR(255),
  author_title VARCHAR(255),
  author_bio TEXT,
  author_image_url TEXT,

  -- Content Details
  page_count INTEGER,
  file_size_mb DECIMAL(5,2),
  table_of_contents JSONB,

  -- Related
  related_services TEXT[] DEFAULT '{}',
  related_industries TEXT[] DEFAULT '{}',

  -- Publishing
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,

  -- SEO Fields
  meta_title VARCHAR(70),
  meta_description VARCHAR(170),
  canonical_url TEXT,
  og_image_url TEXT,
  keywords TEXT[] DEFAULT '{}',
  schema_markup JSONB
);

-- Indexes
CREATE INDEX idx_whitepapers_slug ON whitepapers(slug);
CREATE INDEX idx_whitepapers_status ON whitepapers(status);
CREATE INDEX idx_whitepapers_is_featured ON whitepapers(is_featured);

CREATE TRIGGER update_whitepapers_updated_at
    BEFORE UPDATE ON whitepapers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- WEBINARS TABLE - Complete Schema
-- ============================================================
DROP TABLE IF EXISTS webinars CASCADE;

CREATE TABLE webinars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  description TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',

  -- Media
  thumbnail_url TEXT,

  -- Schedule
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  timezone VARCHAR(50) DEFAULT 'America/New_York',

  -- Registration
  registration_url TEXT,
  max_attendees INTEGER,
  registered_count INTEGER DEFAULT 0,

  -- Speakers & Agenda
  speakers JSONB DEFAULT '[]',
  agenda JSONB DEFAULT '[]',

  -- Post-webinar
  recording_url TEXT,
  slides_url TEXT,

  -- Related
  related_services TEXT[] DEFAULT '{}',
  related_industries TEXT[] DEFAULT '{}',

  -- Publishing
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'upcoming', 'live', 'completed')),

  -- SEO Fields
  meta_title VARCHAR(70),
  meta_description VARCHAR(170),
  canonical_url TEXT,
  og_image_url TEXT,
  keywords TEXT[] DEFAULT '{}',
  schema_markup JSONB
);

-- Indexes
CREATE INDEX idx_webinars_slug ON webinars(slug);
CREATE INDEX idx_webinars_status ON webinars(status);
CREATE INDEX idx_webinars_scheduled_at ON webinars(scheduled_at);
CREATE INDEX idx_webinars_is_featured ON webinars(is_featured);

CREATE TRIGGER update_webinars_updated_at
    BEFORE UPDATE ON webinars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- CONTACTS TABLE
-- ============================================================
DROP TABLE IF EXISTS contacts CASCADE;

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  inquiry_type VARCHAR(50) DEFAULT 'general',
  message TEXT,
  source VARCHAR(100),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  notes TEXT,
  assigned_to VARCHAR(255)
);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- ============================================================
-- Enable Row Level Security (RLS) - Optional
-- ============================================================
-- Uncomment these if you want RLS enabled:
-- ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE whitepapers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these to verify tables were created correctly:

SELECT 'case_studies columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'case_studies'
ORDER BY ordinal_position;

SELECT 'blog_posts columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blog_posts'
ORDER BY ordinal_position;

SELECT 'Tables created successfully!' as status;
