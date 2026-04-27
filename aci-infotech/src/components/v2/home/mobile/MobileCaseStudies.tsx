/**
 * MobileCaseStudies — condensed list of up to 3 case studies for the
 * mobile homepage. No carousels, no images: just industry tag, title,
 * the headline metric, and a chevron. Tap routes to the case-study
 * detail page.
 *
 * Reuses the same `HomeCaseStudy` shape the desktop tree fetches, so
 * one Supabase query feeds both layouts. Renders a discreet empty
 * state when the CMS returns nothing rather than collapsing the
 * section silently.
 */

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { displayClient } from '@/lib/content/anonymize';
import type { HomeCaseStudy } from '@/lib/v2/fetch-home-data';

interface Props {
  caseStudies: HomeCaseStudy[];
}

function pickHeadlineMetric(cs: HomeCaseStudy): { value: string; label: string } | null {
  const m = cs.metrics?.[0];
  if (!m) return null;
  return { value: m.value, label: m.label };
}

export default function MobileCaseStudies({ caseStudies }: Props) {
  const top = caseStudies.slice(0, 3);

  return (
    <section className="m-cases" aria-labelledby="m-cases-h">
      <p className="m-eyebrow">/ In production</p>
      <h2 id="m-cases-h" className="m-h2">
        Built it.
        <br />
        <em className="m-h2-em">Running&nbsp;today.</em>
      </h2>

      {top.length === 0 ? (
        <p className="m-cases__empty">
          Featured case studies are publishing soon. In the meantime, the
          full library is on{' '}
          <Link href="/case-studies" className="m-cases__empty-link">
            our case studies page
          </Link>
          .
        </p>
      ) : (
        <ul className="m-cases__list">
          {top.map((cs) => {
            const metric = pickHeadlineMetric(cs);
            const tag = cs.industry?.trim() || displayClient(cs);
            return (
              <li key={cs.id}>
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="m-cases__row"
                >
                  <div className="m-cases__top">
                    <span className="m-cases__industry">{tag}</span>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="m-cases__arrow"
                      aria-hidden
                    />
                  </div>
                  <p className="m-cases__title">{cs.title}</p>
                  {metric && (
                    <p className="m-cases__metric">
                      <span className="m-cases__metric-value">{metric.value}</span>
                      <span className="m-cases__metric-label">{metric.label}</span>
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/case-studies" className="m-cases__more">
        Browse all case studies
        <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
      </Link>

      <style>{`
        .m-cases {
          padding: 64px 24px;
          background: var(--v2-surface-1);
        }
        .m-cases__list {
          list-style: none;
          margin: 32px 0 24px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .m-cases__row {
          display: block;
          padding: 18px;
          border: 1px solid var(--v2-border-subtle);
          border-radius: 12px;
          background: var(--v2-surface-2);
          color: inherit;
          text-decoration: none;
        }
        .m-cases__row:active {
          border-color: var(--v2-accent);
        }
        .m-cases__top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .m-cases__industry {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--v2-text-muted);
        }
        .m-cases__arrow {
          color: var(--v2-text-muted);
        }
        .m-cases__row:active .m-cases__arrow {
          color: var(--v2-accent);
        }
        .m-cases__title {
          margin: 0 0 14px;
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 600;
          line-height: 1.35;
          color: var(--v2-text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .m-cases__metric {
          margin: 0;
          padding-top: 12px;
          border-top: 1px solid var(--v2-border-subtle);
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .m-cases__metric-value {
          font-family: var(--font-title);
          font-size: 22px;
          font-weight: 600;
          color: var(--v2-accent);
          line-height: 1;
        }
        .m-cases__metric-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--v2-text-muted);
        }
        .m-cases__more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--v2-text-secondary);
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid var(--v2-border-strong);
        }
        .m-cases__empty {
          margin: 32px 0 24px;
          padding: 20px;
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 1.55;
          color: var(--v2-text-secondary);
          background: var(--v2-surface-2);
          border: 1px solid var(--v2-border-subtle);
          border-radius: 12px;
        }
        .m-cases__empty-link {
          color: var(--v2-accent);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
      `}</style>
    </section>
  );
}
