/**
 * Shared schemas for Atheros content data files.
 *
 * The indexer (scripts/index-content.ts) and the Part-4 panel registry
 * (src/components/copilot/panels/*) both import from these types.
 *
 * Design notes:
 *   - All copy that could render to a user (public or admin) belongs here
 *     and MUST go through `displayClient` when naming engagements.
 *   - `slug` is the stable identifier used in routing, citations (`[case:slug]`),
 *     and the content_chunks.source_slug column.
 *   - Optional fields stay optional; the indexer skips empty sections.
 */

import type { AnonymizableCaseStudyLike } from '@/lib/content/anonymize';

export type ServiceClusterId =
  | 'data-engineering'
  | 'applied-ai-ml'
  | 'cloud-modernization'
  | 'martech-cdp'
  | 'digital-transformation'
  | 'cyber-security'
  | 'app-development'
  | 'quality-engineering'
  | 'advisory-strategy'
  | 'gcc'
  | 'managed-operations';

export type IndustryId =
  | 'financial-services'
  | 'healthcare'
  | 'retail'
  | 'manufacturing'
  | 'hospitality'
  | 'energy'
  | 'oil-gas'
  | 'transportation';

export type PlatformId =
  | 'databricks'
  | 'snowflake'
  | 'aws'
  | 'azure'
  | 'gcp'
  | 'salesforce'
  | 'sap'
  | 'servicenow'
  | 'braze'
  | 'microsoft-dynamics';

export type AudienceRole =
  | 'cio'
  | 'cdo'
  | 'cto'
  | 'ciso'
  | 'ceo'
  | 'cmo'
  | 'other';

export interface Offering {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  outcomes?: string[];
}

export interface Outcome {
  label: string;
  description?: string;
}

export interface ProcessPhase {
  number?: number;
  title: string;
  duration?: string;
  description: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Anonymized case-study stub bound to a service/industry/platform entry.
 * Real DB case studies live in Supabase; these stubs are the curated proof
 * points hand-picked for each page.
 */
export interface CaseStudyStub extends AnonymizableCaseStudyLike {
  slug: string;
  industry?: string;
  service?: string;
  challenge: string;
  solution?: string;
  results: Array<{ metric: string; description: string }>;
  technologies?: string[];
}

export interface ServiceEntry {
  id: ServiceClusterId;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  keyOutcomes: string[];
  offerings: Offering[];
  caseStudies: CaseStudyStub[];
  processPhases: ProcessPhase[];
  faqs: FaqEntry[];
  /** Optional role-tuned overrides. Keyed by AudienceRole. */
  audienceOverrides?: Partial<
    Record<AudienceRole, { tagline?: string; keyOutcomes?: string[] }>
  >;
}

export interface IndustryEntry {
  id: IndustryId;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  painPoints: Array<{ title: string; description: string }>;
  useCases: Array<{ title: string; description: string }>;
  relevantServices: ServiceClusterId[];
  caseStudies: CaseStudyStub[];
  faqs: FaqEntry[];
}

export interface PlatformEntry {
  id: PlatformId;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: Array<{ title: string; description: string }>;
  integrations?: string[];
  useCases: Array<{ title: string; description: string }>;
  caseStudies: CaseStudyStub[];
  faqs?: FaqEntry[];
}

/**
 * Canonical chunk written to public.content_chunks. Consumer code uses
 * this type for both writes (indexer) and reads (retrieval).
 */
export interface ContentChunk {
  id?: string;
  source_type:
    | 'lp'
    | 'service'
    | 'industry'
    | 'platform'
    | 'case_study'
    | 'blog'
    | 'whitepaper'
    | 'playbook';
  source_slug: string;
  title: string;
  section_path?: string;
  text: string;
  metadata: {
    cluster?: ServiceClusterId;
    industry?: IndustryId | string;
    platform?: PlatformId;
    role?: AudienceRole;
    tech?: string[];
    outcomes?: string[];
  };
  embedding?: number[];
  token_count?: number;
  checksum: string;
  indexed_at?: string;
  stale_at?: string | null;
}

export interface RetrievedChunk extends Omit<ContentChunk, 'embedding' | 'checksum'> {
  similarity: number;
}
