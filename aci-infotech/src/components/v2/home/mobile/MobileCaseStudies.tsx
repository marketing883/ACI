/**
 * MobileCaseStudies — condensed case study list. No carousels, no
 * images, no decontextualised percentages. Each card carries the
 * three things a senior buyer is scanning for:
 *
 *   1. Industry  — does this match my world?
 *   2. Title     — what got shipped?
 *   3. Stack     — was it built on something I'd take seriously?
 *
 * The headline percentages that previously sat at the bottom of each
 * card looked impressive in isolation but read as advertising once
 * you'd seen three in a row. Replacing them with the stack chips
 * gives the same proof signal in a way an exec actually wants to
 * read.
 *
 * Reuses the `HomeCaseStudy` shape the desktop tree fetches, so one
 * Supabase query feeds both layouts.
 */

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { displayClient } from '@/lib/content/anonymize';
import type { HomeCaseStudy } from '@/lib/v2/fetch-home-data';

interface Props {
  caseStudies: HomeCaseStudy[];
}

const MAX_STACK_CHIPS = 4;

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
          Featured case studies are publishing soon. The full library is on{' '}
          <Link href="/case-studies" className="m-cases__empty-link">
            our case studies page
          </Link>
          .
        </p>
      ) : (
        <ul className="m-cases__list">
          {top.map((cs) => {
            const tag = cs.industry?.trim() || displayClient(cs);
            const stack = (cs.technologies ?? []).slice(0, MAX_STACK_CHIPS);
            const moreCount = Math.max(0, (cs.technologies?.length ?? 0) - MAX_STACK_CHIPS);
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
                  {stack.length > 0 && (
                    <div className="m-cases__stack" aria-label="Technology stack">
                      {stack.map((t) => (
                        <span key={t} className="m-cases__chip">
                          {t}
                        </span>
                      ))}
                      {moreCount > 0 && (
                        <span className="m-cases__chip m-cases__chip--more">
                          +{moreCount}
                        </span>
                      )}
                    </div>
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
          margin-bottom: 12px;
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
          margin: 0 0 16px;
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 600;
          line-height: 1.35;
          color: var(--v2-text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .m-cases__stack {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-top: 12px;
          border-top: 1px solid var(--v2-border-subtle);
        }
        .m-cases__chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--v2-text-secondary);
          background: var(--v2-surface-3);
          border: 1px solid var(--v2-border-subtle);
          border-radius: 4px;
          line-height: 1;
        }
        .m-cases__chip--more {
          color: var(--v2-text-muted);
          background: transparent;
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
