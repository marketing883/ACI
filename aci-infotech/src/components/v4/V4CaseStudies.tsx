'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Reveal, ImageSettle, ArrowCircle } from './v4-motion';
import type { CaseStudyListItem } from '@/lib/content/case-study';

// Local/dev fallback when Supabase creds are absent. Production renders
// live published case studies passed down from the server component.
const FALLBACK: V4Case[] = [
  {
    slug: 'databricks-modernization-ai-enablement-for-leading-c-store-chain',
    title: 'Real-time retail data across 600 stores',
    descriptor: 'Fortune 500 Convenience Retailer',
    industry: 'Retail',
    metric: { value: '5hr', label: 'data lag, down from 18' },
    image: '/images/v4/case-retail.jpg',
  },
  {
    slug: 'modernizes-finance-reporting-with-sap-transformation',
    title: 'SAP finance core, modernized live',
    descriptor: 'Fortune 500 Financial Services',
    industry: 'Financial Services',
    metric: { value: '67%', label: 'faster close cycle' },
    image: '/images/v4/case-finance.jpg',
  },
  {
    slug: 'manufacturing-iot',
    title: 'Predictive maintenance on the line',
    descriptor: 'Global Manufacturer',
    industry: 'Manufacturing',
    metric: { value: '31%', label: 'less unplanned downtime' },
    image: '/images/v4/case-manufacturing.jpg',
  },
  {
    slug: 'msci-data-automation',
    title: 'Index data automation at scale',
    descriptor: 'Financial Index Provider',
    industry: 'Financial Services',
    metric: { value: '80+', label: 'countries unified' },
    image: '/images/v4/case-energy.jpg',
  },
  {
    slug: 'servicenow-university-service-transformation-case-study',
    title: 'Service desk, rebuilt on ServiceNow',
    descriptor: 'Higher Education',
    industry: 'Education',
    metric: { value: '45%', label: 'ticket deflection' },
    image: '/images/v4/case-healthcare.jpg',
  },
  {
    slug: 'agile-multi-cloud-transformation-case-study',
    title: 'Multi-cloud without the sprawl',
    descriptor: 'Fortune 500 Logistics Company',
    industry: 'Transportation',
    metric: { value: '38%', label: 'lower cloud spend' },
    image: '/images/v4/case-transport.jpg',
  },
];

interface V4Case {
  slug: string;
  title: string;
  descriptor: string;
  industry: string;
  metric: { value: string; label: string } | null;
  image: string;
}

const INDUSTRY_IMAGE: Array<[RegExp, string]> = [
  [/financ|bank|insur/i, '/images/v4/case-finance.jpg'],
  [/retail|commerce/i, '/images/v4/case-retail.jpg'],
  [/manufactur|industrial/i, '/images/v4/case-manufacturing.jpg'],
  [/energy|oil|gas|util/i, '/images/v4/case-energy.jpg'],
  [/health|pharma|life/i, '/images/v4/case-healthcare.jpg'],
  [/transport|logistic|supply/i, '/images/v4/case-transport.jpg'],
];

function toV4Case(cs: CaseStudyListItem, i: number): V4Case {
  const m = Array.isArray(cs.metrics) ? (cs.metrics[0] as { value?: string; label?: string } | undefined) : undefined;
  const byIndustry = INDUSTRY_IMAGE.find(([re]) => re.test(cs.industry ?? ''))?.[1];
  return {
    slug: cs.slug,
    title: cs.title || 'Case study',
    descriptor: cs.client_descriptor || 'Enterprise Client',
    industry: cs.industry || 'Enterprise',
    metric: m?.value ? { value: m.value, label: m.label || 'improvement' } : null,
    image: cs.featured_image_url || byIndustry || FALLBACK[i % FALLBACK.length].image,
  };
}

export default function V4CaseStudies({ items }: { items: CaseStudyListItem[] }) {
  const cases: V4Case[] = items.length ? items.slice(0, 6).map(toV4Case) : FALLBACK;

  return (
    <section style={{ padding: '48px 24px 96px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal tier="sm">
          <span className="v4-eyebrow">The work</span>
        </Reveal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
            marginTop: 14,
          }}
        >
          <Reveal tier="md">
            <h2 className="v4-h2" style={{ maxWidth: 620 }}>
              Shipped, measured, still running.
            </h2>
          </Reveal>
          <Reveal tier="sm" delay={0.1}>
            <Link
              href="/case-studies"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                font: '500 15px/1 var(--font-funnel-sans)',
                color: 'var(--v4-ink)',
                textDecoration: 'none',
              }}
            >
              All case studies <ArrowCircle />
            </Link>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
            marginTop: 48,
          }}
        >
          {cases.map((c, i) => (
            <Reveal key={c.slug} tier="md" delay={(i % 3) * 0.08}>
              <Link
                href={`/case-studies/${c.slug}`}
                className="v4-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  border: '1px solid var(--v4-mist)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'var(--v4-ink)',
                  height: '100%',
                }}
              >
                <ImageSettle style={{ aspectRatio: '16/9', position: 'relative' }}>
                  <div className="v4-zoom" style={{ position: 'absolute', inset: 0 }}>
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 400px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  {/* metric flag over the image */}
                  {c.metric && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 14,
                        bottom: 14,
                        background: 'var(--v4-ink)',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 8,
                        zIndex: 1,
                      }}
                    >
                      <span
                        style={{
                          font: '600 20px/1 var(--font-funnel-display)',
                          color: 'var(--v4-lime)',
                        }}
                      >
                        {c.metric.value}
                      </span>
                      <span
                        style={{
                          font: '400 11.5px/1.2 var(--font-jetbrains-mono)',
                          color: 'var(--v4-muted-dark)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {c.metric.label}
                      </span>
                    </div>
                  )}
                </ImageSettle>
                <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <span className="v4-chip" style={{ alignSelf: 'flex-start' }}>
                    {c.industry}
                  </span>
                  <h3 style={{ margin: 0, font: '600 18.5px/1.25 var(--font-funnel-display)', letterSpacing: '-0.01em' }}>
                    {c.title}
                  </h3>
                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ font: '400 13px/1.4 var(--font-funnel-sans)', color: 'var(--v4-muted)' }}>
                      {c.descriptor}
                    </span>
                    <ArrowCircle />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
