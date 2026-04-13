/**
 * CaseStudiesKineticSection - server component that fetches the
 * top 3 featured case studies and hands them to CaseStudyKinetic with
 * the three identity themes assigned in display order.
 *
 * Data source: same Supabase fetch used by DynamicCaseStudiesSection
 * (status='published' AND is_featured=true, sorted by created_at desc).
 * Falls back to placeholders if DB returns nothing.
 *
 * Client safety: every visible client reference goes through
 * displayClient() / client_descriptor. Real client_name is never read.
 */

import { createClient } from '@supabase/supabase-js';
import { displayClient } from '@/lib/content/anonymize';
import CaseStudyKinetic, {
  type KineticStudy,
  type Theme,
} from './CaseStudyKinetic';
import { assignDiverseArt } from './caseStudyArt';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface CaseStudyDB {
  id: string;
  slug: string;
  title: string;
  client_descriptor?: string | null;
  client_name?: string | null;
  industry?: string | null;
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  metrics?: { label: string; value: string; description?: string }[] | null;
  technologies?: string[] | null;
  services?: string[] | null;
  featured_image_url?: string | null;
  art_variant?: string | null;
  is_featured?: boolean;
  status?: string;
}

async function fetchTopFeatured(limit: number): Promise<CaseStudyDB[]> {
  if (!supabaseUrl || !supabaseServiceKey) return [];
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error(
      'CaseStudiesKineticSection fetch error:',
      error.message,
      error.code,
    );
    return [];
  }
  return (data ?? []) as CaseStudyDB[];
}

const PLACEHOLDERS: KineticStudy[] = [
  {
    id: 'p1',
    slug: 'post-acquisition-consolidation',
    descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    metric: '$12M',
    metricLabel: 'saved in year one',
    outcome:
      'Consolidated 40+ post-acquisition finance systems into a single audited platform.',
    approach:
      'Phased migration with parallel runs, automated reconciliation, and SOX-grade audit logging across SAP S/4HANA on Azure.',
    playbookUsed: 'Post-Acquisition Consolidation',
  },
  {
    id: 'p2',
    slug: 'real-time-retail-data',
    descriptor: 'National Retail and Convenience Operator',
    industry: 'Retail and Convenience',
    metric: '600',
    metricLabel: 'locations on a single real-time data plane',
    outcome:
      'Cut customer-data lag from 18 hours to 5, with zero payment downtime through the rollout.',
    approach:
      'Dual-write payment integration, Kafka-based event streaming into Databricks Delta Lake, and Salesforce and Braze activation on top.',
    playbookUsed: 'Multi-Location Real-Time Data Platform',
  },
  {
    id: 'p3',
    slug: 'global-data-unification',
    descriptor: 'Global Hospitality Group',
    industry: 'Hospitality',
    metric: '55',
    metricLabel: 'countries unified onto one operational view',
    outcome:
      'Reduced executive reporting from 3 weeks of manual work to 5 days with live dashboards.',
    approach:
      'MDM-first design, Informatica IICS for regional integration, and a global data lake with regional GDPR boundaries.',
    playbookUsed: 'Global Operations Data Unification',
  },
];

const THEMES: Theme[] = ['industrial', 'analytical', 'warm'];

function pickMetric(
  metrics: CaseStudyDB['metrics'],
): { metric: string; metricLabel: string } {
  if (!metrics || metrics.length === 0) {
    return { metric: '-', metricLabel: 'outcome forthcoming' };
  }
  const first = metrics[0];
  return {
    metric: first.value,
    metricLabel: (first.label || first.description || '').toLowerCase(),
  };
}

function shorten(s: string | null | undefined, max = 220): string {
  const v = (s ?? '').trim();
  if (v.length <= max) return v;
  return v.slice(0, max - 1).trimEnd() + '.';
}

function dbRowToKinetic(row: CaseStudyDB, fallbackIndex: number): KineticStudy {
  const { metric, metricLabel } = pickMetric(row.metrics);
  const placeholder = PLACEHOLDERS[fallbackIndex] ?? PLACEHOLDERS[0];
  return {
    id: row.id,
    slug: row.slug,
    descriptor: displayClient(row),
    industry: row.industry || placeholder.industry,
    metric,
    metricLabel,
    outcome: shorten(row.results) || row.title || placeholder.outcome,
    approach: shorten(row.solution) || shorten(row.challenge) || placeholder.approach,
    playbookUsed: undefined,
    featuredImageUrl: row.featured_image_url ?? undefined,
    services: row.services ?? undefined,
    artVariant: row.art_variant ?? undefined,
  };
}

export default async function CaseStudiesKineticSection() {
  // Pull as many featured rows as we can (up to 3) and render exactly
  // what the CMS has. If the CMS has zero featured case studies at all,
  // we fall back to the placeholder trio so the section is never empty
  // on first load; any real rows take precedence over placeholders.
  const dbRows = await fetchTopFeatured(3);
  const dbStudies = dbRows.map((row, i) => dbRowToKinetic(row, i));
  const studies: KineticStudy[] = dbStudies.length > 0 ? dbStudies : PLACEHOLDERS;

  return (
    <section className="bg-white">
      {/* Section header sits on white above the first study, then each study
          asserts its own palette below. */}
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="font-mono text-xs md:text-sm text-neutral-500 tracking-wider mb-5">
          {`// ${studies.length.toString().padStart(2, '0')} case studies . live in production`}
        </div>
        <h2
          className="text-[#0A1628] font-[var(--font-title)] font-bold max-w-3xl"
          style={{
            fontSize: 'clamp(36px, 5.4vw, 64px)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
          }}
        >
          {'See the Work in\u00A0Production.'}
        </h2>
        <p className="mt-5 text-neutral-600 max-w-2xl text-base md:text-lg leading-relaxed">
          {'Featured builds, live today at Fortune-scale\u00A0operators. Scroll for the problem each one walked into, what we built, and what changed once it\u00A0shipped.'}
        </p>
      </div>

      {/* Studies stacked, each with its own theme. Theme cycles so 1 or 2
          real rows still get their own identities. Art assignment is
          computed in one pass across all siblings so no two stacked
          cards share the same generated metaphor. */}
      {(() => {
        const artKeys = assignDiverseArt(studies);
        return studies.map((s, i) => (
          <CaseStudyKinetic
            key={s.id}
            study={s}
            theme={THEMES[i % THEMES.length]}
            index={i}
            artKey={artKeys[i]}
          />
        ));
      })()}
    </section>
  );
}
