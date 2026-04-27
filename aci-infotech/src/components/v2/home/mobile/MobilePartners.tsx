/**
 * MobilePartners — 4-cell grid of certified-partner logos.
 *
 * Visibility strategy: every logo gets the same monochrome tint
 * (`brightness(0) invert(1)`), so the source PNG's native color
 * doesn't matter — black-on-white wordmarks (AWS, SAP, Salesforce)
 * and color marks (Databricks, ServiceNow, Braze) all render as the
 * same soft white silhouette on the dark surface. Brand color is
 * sacrificed for legibility, which is the right tradeoff at chip
 * size on a phone screen.
 *
 * The shipped PNGs in /public/images/Solution-Partners are 2-3 KB
 * each; the seven listed below total ~18 KB. Lazy-loaded via
 * next/image so they don't block LCP.
 */

import Image from 'next/image';

interface PartnerLogo {
  name: string;
  src: string;
}

// Seven partners that have local PNG assets shipped under
// /public/images/Solution-Partners. Snowflake doesn't ship a logo
// here, so we leave it off the mobile grid rather than render a
// placeholder. The grid uses 4 columns × 2 rows; the trailing cell
// holds a "+ more" tile that links to the full partners page.
const PARTNERS: PartnerLogo[] = [
  { name: 'Databricks', src: '/images/Solution-Partners/databricks.png' },
  { name: 'AWS', src: '/images/Solution-Partners/aws.png' },
  { name: 'Microsoft Azure', src: '/brand/azure-mono.svg' },
  { name: 'SAP', src: '/images/Solution-Partners/sap.png' },
  { name: 'ServiceNow', src: '/images/Solution-Partners/servicenow.png' },
  { name: 'Salesforce', src: '/images/Solution-Partners/salesforce.png' },
  { name: 'Braze', src: '/images/Solution-Partners/braze.png' },
];

export default function MobilePartners() {
  return (
    <section className="m-partners" aria-labelledby="m-partners-h">
      <p className="m-eyebrow">/ Certified partner across</p>
      <h2 id="m-partners-h" className="m-h2 m-h2--small">
        The platforms our clients
        <br />
        <em className="m-h2-em">already&nbsp;run.</em>
      </h2>

      <ul className="m-partners__grid">
        {PARTNERS.map((p) => (
          <li key={p.name} className="m-partners__cell">
            <Image
              src={p.src}
              alt={`${p.name} partner logo`}
              width={120}
              height={48}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 25vw, 100px"
              className="m-partners__logo"
              unoptimized={p.src.endsWith('.svg')}
            />
          </li>
        ))}
        <li className="m-partners__cell m-partners__cell--more">
          <span className="m-partners__more">+ more</span>
        </li>
      </ul>

      <style>{`
        .m-partners {
          padding: 64px 24px 56px;
          background: var(--v2-bg);
        }
        .m-partners__grid {
          list-style: none;
          margin: 32px 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--v2-border-subtle);
          border: 1px solid var(--v2-border-subtle);
          border-radius: 12px;
          overflow: hidden;
        }
        .m-partners__cell {
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--v2-surface-1);
          padding: 14px;
        }
        .m-partners__logo {
          width: auto;
          height: 28px;
          max-width: 100%;
          object-fit: contain;
          /* Force every logo to a uniform white silhouette regardless
             of source color. Drops brand color but guarantees the
             mark is actually visible on the dark cell. */
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        .m-partners__cell--more {
          background: var(--v2-surface-2);
        }
        .m-partners__more {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--v2-text-muted);
        }
      `}</style>
    </section>
  );
}
