// Common Types for ACI Website

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
}

export interface CTAButton {
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | 'ghost';
}

export interface StatItem {
  number: string;
  unit?: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  outcome: string;
  cta: CTAButton;
}

export interface CaseStudyItem {
  slug: string;
  client: string;
  logo_url?: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    description: string;
  }[];
  technologies: string[];
  timeline?: string;
  testimonial?: {
    quote: string;
    author: string;
    company: string;
  };
}

export interface TestimonialItem {
  quote: string;
  author: string;
  company: string;
  company_logo?: string;
  photo_url?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  source: string;
  date: string;
  url?: string;
}

export interface PartnerItem {
  name: string;
  logo_url: string;
  badge?: string;
  badge_style?: 'gold' | 'silver';
}

export interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  tags?: string[];
  featured_image?: string;
  read_time?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  role?: string;
  inquiry_type?: string;
  message: string;
  phone?: string;
}

export interface NewsletterFormData {
  email: string;
}
