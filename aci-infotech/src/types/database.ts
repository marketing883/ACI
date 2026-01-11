// Supabase Database Types - Updated with full SEO/AEO fields

export interface Contact {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  inquiry_type: 'architecture-call' | 'project-inquiry' | 'partnership' | 'careers' | 'general';
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes: string | null;
  assigned_to: string | null;
}

export interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  source: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  unsubscribed_at: string | null;
}

export interface CaseStudy {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  client_name: string;
  client_logo_url: string | null;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  metrics: { label: string; value: string; description?: string }[];
  technologies: string[];
  services: string[];
  testimonial_quote: string | null;
  testimonial_author: string | null;
  testimonial_title: string | null;
  featured_image_url: string | null;
  is_featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
  // SEO Fields
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  keywords: string[] | null;
  schema_markup: Record<string, unknown> | null;
}

export interface CaseStudyResult {
  metric: string;
  description: string;
}

export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_title: string | null;
  author_bio: string | null;
  author_image_url: string | null;
  author_linkedin: string | null;
  author_twitter: string | null;
  category: string;
  tags: string[];
  keywords: string[];
  article_type: string;
  faqs: { question: string; answer: string }[];
  featured_image_url: string | null;
  read_time_minutes: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  // SEO Fields
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  schema_markup: Record<string, unknown> | null;
}

export interface Whitepaper {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  pdf_url: string | null;
  is_featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
  download_count: number;
  // Author Info
  author_name: string | null;
  author_title: string | null;
  author_bio: string | null;
  author_image_url: string | null;
  // Content Details
  page_count: number | null;
  file_size_mb: number | null;
  table_of_contents: { title: string; page?: number }[] | null;
  // Related Content
  related_services: string[] | null;
  related_industries: string[] | null;
  // SEO Fields
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  keywords: string[] | null;
  schema_markup: Record<string, unknown> | null;
}

export interface Webinar {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  excerpt: string | null;
  description: string;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  is_featured: boolean;
  status: 'draft' | 'published' | 'upcoming' | 'live' | 'completed';
  // Schedule
  scheduled_at: string | null;
  duration_minutes: number | null;
  timezone: string | null;
  // Registration
  registration_url: string | null;
  max_attendees: number | null;
  registered_count: number;
  // Speakers
  speakers: {
    name: string;
    title: string;
    bio?: string;
    image_url?: string;
    linkedin?: string;
  }[] | null;
  // Agenda
  agenda: {
    time: string;
    topic: string;
    speaker?: string;
  }[] | null;
  // Post-webinar
  recording_url: string | null;
  slides_url: string | null;
  // Related Content
  related_services: string[] | null;
  related_industries: string[] | null;
  // SEO Fields
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image_url: string | null;
  keywords: string[] | null;
  schema_markup: Record<string, unknown> | null;
}

export interface TeamMember {
  id: string;
  created_at: string;
  name: string;
  title: string;
  bio: string;
  photo_url: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_visible: boolean;
}

export interface Partner {
  id: string;
  created_at: string;
  name: string;
  logo_url: string;
  badge: string | null;
  badge_style: 'gold' | 'silver' | null;
  website_url: string | null;
  display_order: number;
  is_visible: boolean;
}

export interface Certification {
  id: string;
  created_at: string;
  name: string;
  description: string;
  logo_url: string;
  type: 'security' | 'quality' | 'culture' | 'partnership';
  display_order: number;
  is_visible: boolean;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: Contact;
        Insert: Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contact, 'id' | 'created_at'>>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, 'id' | 'created_at'>;
        Update: Partial<Omit<NewsletterSubscriber, 'id' | 'created_at'>>;
      };
      case_studies: {
        Row: CaseStudy;
        Insert: Omit<CaseStudy, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CaseStudy, 'id' | 'created_at'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPost, 'id' | 'created_at'>>;
      };
      whitepapers: {
        Row: Whitepaper;
        Insert: Omit<Whitepaper, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Whitepaper, 'id' | 'created_at'>>;
      };
      webinars: {
        Row: Webinar;
        Insert: Omit<Webinar, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Webinar, 'id' | 'created_at'>>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, 'id' | 'created_at'>;
        Update: Partial<Omit<TeamMember, 'id' | 'created_at'>>;
      };
      partners: {
        Row: Partner;
        Insert: Omit<Partner, 'id' | 'created_at'>;
        Update: Partial<Omit<Partner, 'id' | 'created_at'>>;
      };
      certifications: {
        Row: Certification;
        Insert: Omit<Certification, 'id' | 'created_at'>;
        Update: Partial<Omit<Certification, 'id' | 'created_at'>>;
      };
    };
  };
}
