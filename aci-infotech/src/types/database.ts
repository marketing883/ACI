// Supabase Database Types

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
  client_name: string;
  client_logo_url: string | null;
  industry: string;
  service_category: string;
  headline: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  technologies: string[];
  testimonial_quote: string | null;
  testimonial_author: string | null;
  testimonial_title: string | null;
  featured_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
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
  author_image_url: string | null;
  category: string;
  tags: string[];
  featured_image_url: string | null;
  read_time_minutes: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
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
