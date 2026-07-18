import {
  getCaseStudiesByIndustry,
  getCaseStudiesByService,
  getCaseStudiesByTechnology,
  parseCaseStudyMetrics,
} from '@/lib/content/case-study';
import { displayClient } from '@/lib/content/anonymize';
import { ProofCards, type ProofCard } from './kit';

// Server component: the proof grid fed by the CMS. Pulls published case
// studies tagged with this page's service, so the cards are real,
// current, properly linked, and carry each study's own featured image.
// Every card needs a headline metric to earn the layout, so rows
// without one are skipped. When the CMS is unreachable or the service
// has fewer than two usable rows, the page's authored cards render
// instead: the section never disappears and never half-renders.

/** Industry keyword -> on-brand backdrop, for rows without an image. */
const INDUSTRY_IMAGES: [string, string][] = [
  ['retail', '/images/v4/case-retail.jpg'],
  ['consumer', '/images/v4/case-retail.jpg'],
  ['financ', '/images/v4/case-finance.jpg'],
  ['insur', '/images/v4/case-finance.jpg'],
  ['bank', '/images/v4/case-finance.jpg'],
  ['health', '/images/v4/case-healthcare.jpg'],
  ['manufactur', '/images/v4/case-manufacturing.jpg'],
  ['transport', '/images/v4/case-transport.jpg'],
  ['logistic', '/images/v4/case-transport.jpg'],
  ['energy', '/images/v4/case-energy.jpg'],
  ['utilit', '/images/v4/case-energy.jpg'],
  ['hospitality', '/images/v4/case-retail.jpg'],
  ['food', '/images/v4/case-retail.jpg'],
  ['technology', '/images/v4/svc-ops.jpg'],
];

function industryImage(industry: string | null): string | undefined {
  const needle = (industry ?? '').toLowerCase();
  if (!needle) return undefined;
  return INDUSTRY_IMAGES.find(([key]) => needle.includes(key))?.[1];
}

export default async function CmsProofCards({
  service,
  technology,
  industry,
  fallback,
  fallbackVideo,
  fallbackImages,
}: {
  /** Service display name as tagged in the CMS, e.g. "Data Engineering". */
  service?: string;
  /** Technology tag for platform pages, e.g. "Databricks". Used when
      `service` is not given. */
  technology?: string;
  /** Industry name for industry pages, e.g. "Retail". Used when neither
      `service` nor `technology` is given. */
  industry?: string;
  /** Authored cards shown when the CMS yields fewer than two usable rows. */
  fallback: ProofCard[];
  fallbackVideo?: { mp4: string; webm?: string };
  fallbackImages?: string[];
}) {
  const rows = service
    ? await getCaseStudiesByService(service, 6)
    : technology
      ? await getCaseStudiesByTechnology(technology, 6)
      : industry
        ? await getCaseStudiesByIndustry(industry, 6)
        : [];

  const cards: ProofCard[] = [];
  for (const row of rows) {
    const metric = parseCaseStudyMetrics(row.metrics)[0];
    if (!metric || !row.title) continue;
    cards.push({
      eyebrow: displayClient(row),
      metric: metric.value,
      metricLabel: metric.label,
      summary: row.title,
      href: `/case-studies/${row.slug}`,
      linkLabel: 'Read the case study',
      image: row.featured_image_url ?? industryImage(row.industry),
    });
    if (cards.length === 3) break;
  }

  if (cards.length < 2) {
    return <ProofCards cards={fallback} video={fallbackVideo} images={fallbackImages} />;
  }

  // Retail footage only when the feature story is actually retail;
  // otherwise the card leads with the study's own image.
  const video = (rows[0]?.industry ?? '').toLowerCase().includes('retail')
    ? { mp4: '/videos/retail-bg.mp4' }
    : undefined;

  return <ProofCards cards={cards} video={video} />;
}
