/**
 * MobileServices — accordion list of all ten services. Tap a row to
 * expand a tight summary: tagline + three concrete outcomes + a link
 * to the full service page.
 *
 * Source of truth is `SERVICES` in nav/menu-data.ts. Keeping the
 * accordion bound to that array means menu, footer, and accordion
 * never drift in either direction — edit one place.
 *
 * Implementation note: native <details>/<summary>. Zero JS, native
 * keyboard support, native aria-expanded handling via the browser.
 * No client-component cost on the LCP path.
 */

import Link from 'next/link';
import { ChevronDown, ArrowRight, Plus, Minus } from 'lucide-react';
import { SERVICES } from '@/components/v2/nav/menu-data';

export default function MobileServices() {
  return (
    <section className="m-services" aria-labelledby="m-services-h">
      <p className="m-eyebrow">/ What we do</p>
      <h2 id="m-services-h" className="m-h2">
        Ten practices.
        <br />
        <em className="m-h2-em">One delivery&nbsp;team.</em>
      </h2>

      <ul className="m-services__list">
        {SERVICES.map((s, idx) => (
          <li key={s.href} className="m-services__item">
            <details name="m-services-accordion" className="m-services__det">
              <summary className="m-services__summary">
                <span className="m-services__index">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="m-services__head">
                  <span className="m-services__title">{s.label}</span>
                  <span className="m-services__desc">{s.description}</span>
                </span>
                <span className="m-services__icons" aria-hidden>
                  <Plus size={16} strokeWidth={1.5} className="m-services__plus" />
                  <Minus size={16} strokeWidth={1.5} className="m-services__minus" />
                </span>
              </summary>
              <div className="m-services__body">
                {s.tagline && <p className="m-services__tagline">{s.tagline}</p>}
                {s.keyOutcomes && s.keyOutcomes.length > 0 && (
                  <ul className="m-services__outcomes">
                    {s.keyOutcomes.map((o) => (
                      <li key={o}>
                        <span className="m-services__bullet" aria-hidden />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={s.href} className="m-services__link">
                  View service
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ul>

      <Link href="/services" className="m-services__more">
        See the full services portfolio
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden
        />
      </Link>

      <style>{`
        .m-services {
          padding: 64px 24px 56px;
          background: var(--v2-bg);
        }
        .m-services__list {
          list-style: none;
          margin: 32px 0 24px;
          padding: 0;
          border-top: 1px solid var(--v2-border-subtle);
        }
        .m-services__item {
          border-bottom: 1px solid var(--v2-border-subtle);
        }
        .m-services__det {
          /* Reset the default disclosure triangle on every browser. */
        }
        .m-services__det summary::-webkit-details-marker { display: none; }
        .m-services__det summary { list-style: none; }
        .m-services__summary {
          display: grid;
          grid-template-columns: 32px 1fr 18px;
          gap: 14px;
          align-items: center;
          padding: 18px 4px;
          cursor: pointer;
          min-height: 56px;
        }
        .m-services__index {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: var(--v2-text-muted);
        }
        .m-services__head {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .m-services__title {
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 600;
          color: var(--v2-text-primary);
          line-height: 1.3;
        }
        .m-services__desc {
          font-family: var(--font-sans);
          font-size: 13px;
          color: var(--v2-text-muted);
          line-height: 1.4;
        }
        .m-services__icons {
          position: relative;
          width: 18px;
          height: 18px;
          color: var(--v2-text-muted);
        }
        .m-services__icons > svg {
          position: absolute;
          inset: 0;
          margin: auto;
          transition: opacity 180ms ease;
        }
        .m-services__minus { opacity: 0; }
        .m-services__det[open] .m-services__plus { opacity: 0; }
        .m-services__det[open] .m-services__minus { opacity: 1; color: var(--v2-accent); }
        .m-services__det[open] .m-services__title { color: var(--v2-accent); }
        .m-services__body {
          padding: 4px 4px 22px 50px;
          animation: m-svc-fade 220ms ease-out;
        }
        @keyframes m-svc-fade {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .m-services__body { animation: none; }
        }
        .m-services__tagline {
          margin: 0 0 14px;
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 1.55;
          color: var(--v2-text-secondary);
        }
        .m-services__outcomes {
          list-style: none;
          margin: 0 0 18px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .m-services__outcomes li {
          display: grid;
          grid-template-columns: 14px 1fr;
          gap: 10px;
          font-family: var(--font-sans);
          font-size: 13px;
          line-height: 1.5;
          color: var(--v2-text-secondary);
        }
        .m-services__bullet {
          width: 6px;
          height: 6px;
          margin-top: 7px;
          border-radius: 50%;
          background: var(--v2-accent);
          display: inline-block;
        }
        .m-services__link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--v2-accent);
          text-decoration: none;
          padding: 6px 0;
          border-bottom: 1px solid var(--v2-border-strong);
        }
        .m-services__more {
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
      `}</style>
    </section>
  );
}
