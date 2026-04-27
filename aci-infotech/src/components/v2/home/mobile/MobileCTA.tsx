/**
 * MobileCTA — terminal section before the footer. One headline, one
 * line of subtext, one primary CTA. The conversion surface for an
 * exec who scrolled this far on a phone.
 *
 * No card-within-card chrome, no secondary noise: the whole section
 * is the CTA.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MobileCTA() {
  return (
    <section className="m-cta" aria-labelledby="m-cta-h">
      <h2 id="m-cta-h" className="m-cta__h">
        Put your next system
        <br />
        <em className="m-cta__h-em">in&nbsp;production.</em>
      </h2>
      <p className="m-cta__sub">Tell us what you need built.</p>
      <Link
        href="/contact?source=v2-mobile-cta"
        className="m-btn m-btn--primary m-cta__btn"
      >
        <span>Start a project</span>
        <ArrowRight size={14} aria-hidden />
      </Link>

      <style>{`
        .m-cta {
          padding: 80px 24px;
          background: var(--v2-bg);
          text-align: center;
          border-top: 1px solid var(--v2-border-subtle);
        }
        .m-cta__h {
          margin: 0 0 16px;
          font-family: var(--font-title);
          font-size: clamp(34px, 9vw, 44px);
          line-height: 1.0;
          letter-spacing: -0.03em;
          font-weight: 700;
          color: var(--v2-text-primary);
        }
        .m-cta__h-em {
          color: var(--v2-accent);
          font-style: italic;
          font-weight: 500;
        }
        .m-cta__sub {
          margin: 0 0 28px;
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.55;
          color: var(--v2-text-secondary);
        }
        .m-cta__btn {
          margin: 0 auto;
        }
      `}</style>
    </section>
  );
}
