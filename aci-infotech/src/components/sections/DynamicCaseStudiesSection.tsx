import { createClient } from '@supabase/supabase-js';
import CaseStudiesCarousel from './CaseStudiesCarousel';

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface CaseStudyDB {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client_logo?: string | null;
  client_industry?: string | null;
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  metrics?: { label: string; value: string; description?: string }[] | null;
  technologies?: string[] | null;
  services?: string[] | null;
  testimonial_quote?: string | null;
  testimonial_author?: string | null;
  testimonial_title?: string | null;
  is_featured?: boolean;
  status?: string;
  [key: string]: unknown;
}

async function getFeaturedCaseStudies(limit: number = 6) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }

  return data || [];
}

// Placeholder data with the new content structure
const placeholderCaseStudies = [
  {
    id: '1',
    slug: 'msci-data-automation',
    client_name: 'MSCI',
    client_logo: '/images/clients/msci-logo.svg',
    client_industry: 'Financial Services',
    challenge: '40+ finance systems. Post-acquisition chaos. Manual reconciliation eating 200 hours/month.',
    metrics: [
      { value: '$12M', label: 'saved annually' },
      { value: '18 months', label: 'start to finish' },
      { value: 'Zero', label: 'reporting disruptions' },
      { value: '95%', label: 'less manual work' },
    ],
    technologies: ['SAP S/4HANA', 'Python', 'Azure DevOps'],
    services: ['Data Engineering', 'Enterprise Integration'],
    testimonial_quote: 'ACI transformed our post-acquisition chaos into a unified, efficient system.',
    playbook_used: 'Multi-Location Playbook',
    playbook_count: 47,
    cta_text: 'See How It Worked',
  },
  {
    id: '2',
    slug: 'racetrac-martech',
    client_name: 'RaceTrac',
    client_logo: '/images/clients/racetrac-logo.svg',
    client_industry: 'Retail / Convenience',
    challenge: '600 locations. 18-hour data lag. Marketing flying blind on customer behavior.',
    metrics: [
      { value: '70%', label: 'faster data (18hr → 5hr)' },
      { value: '28%', label: 'better promotions' },
      { value: 'Zero', label: 'payment downtime' },
      { value: '7 months', label: 'to rollout' },
    ],
    technologies: ['Salesforce', 'Braze', 'AWS'],
    services: ['MarTech & CDP', 'Data Engineering'],
    testimonial_quote: "They've flawlessly delivered top-tier Digital Data, marking a critical milestone for RaceTrac.",
    playbook_used: 'Retail MarTech Playbook',
    playbook_count: 34,
    cta_text: 'See the Impact',
  },
  {
    id: '3',
    slug: 'sodexo-unified-data',
    client_name: 'Sodexo',
    client_logo: '/images/clients/sodexo-logo.svg',
    client_industry: 'Hospitality',
    challenge: '55 countries. Regional data silos. Reporting took 3 weeks of manual work.',
    metrics: [
      { value: '100%', label: 'data unified' },
      { value: 'Real-time', label: 'supply chain view' },
      { value: '85%', label: 'duplicate records gone' },
      { value: '3 weeks → 5 days', label: 'reporting time' },
    ],
    technologies: ['Informatica IICS', 'MDM', 'Cloud Integration'],
    services: ['Data Engineering', 'Cloud Modernization'],
    testimonial_quote: 'Their commitment to deliverables without compromising quality is impressive.',
    playbook_used: 'Global Data Unification Playbook',
    playbook_count: 22,
    cta_text: 'See the System',
  },
];

interface DynamicCaseStudiesSectionProps {
  headline?: string;
  subheadline?: string;
  limit?: number;
}

export default async function DynamicCaseStudiesSection({
  headline = "Here's What We Built. Here's What It Delivered.",
  subheadline = "Real projects. Real Fortune 500 clients. Real outcomes.",
  limit = 6,
}: DynamicCaseStudiesSectionProps) {
  const dbCaseStudies = await getFeaturedCaseStudies(limit);

  // Transform DB format to component format
  const caseStudies = dbCaseStudies.length > 0
    ? dbCaseStudies.map((cs: CaseStudyDB) => ({
        id: cs.id,
        slug: cs.slug,
        client_name: cs.client_name,
        client_logo: cs.client_logo || undefined,
        client_industry: cs.client_industry || '',
        challenge: cs.challenge || '',
        metrics: cs.metrics || [],
        technologies: cs.technologies || [],
        services: cs.services || [],
        testimonial_quote: cs.testimonial_quote || undefined,
        playbook_used: undefined, // Could be added to DB schema later
        playbook_count: undefined,
        cta_text: 'See the Full Story',
      }))
    : placeholderCaseStudies;

  return (
    <CaseStudiesCarousel
      headline={headline}
      subheadline={subheadline}
      caseStudies={caseStudies}
    />
  );
}
