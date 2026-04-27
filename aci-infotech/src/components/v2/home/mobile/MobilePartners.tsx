/**
 * MobilePartners — 4x2 grid of certified-partner logos. The eight
 * shipped PNGs in /public/images/Solution-Partners are 2-3 KB each,
 * so all eight cost ~25 KB total — affordable on mobile and worth it
 * for the visual proof.
 *
 * The dark-on-white logos (AWS, SAP, Salesforce) need inverting to
 * read on the dark surface; that flag is set per row. Azure uses the
 * purpose-drawn icon-only SVG so the brand mark fills the cell
 * instead of shrinking to fit a wide wordmark.
 */

import Image from 'next/image';

interface PartnerLogo {
  name: string;
  src: string;
  invert?: boolean;
  mono?: boolean;
}

const PARTNERS: PartnerLogo[] = [
  { name: 'Databricks', src: '/images/Solution-Partners/databricks.png' },
  { name: 'Snowflake', src: '/images/Solution-Partners/aws.png' }, // placeholder removed below
  { name: 'AWS', src: '/images/Solution-Partners/aws.png', invert: true },
  { name: 'Microsoft Azure', src: '/brand/azure-mono.svg', mono: true },
  { name: 'SAP', src: '/images/Solution-Partners/sap.png', invert: true },
  { name: 'ServiceNow', src: '/images/Solution-Partners/servicenow.png' },
  { name: 'Salesforce', src: '/images/Solution-Partners/salesforce.png', invert: true },
  { name: 'Braze', src: '/images/Solution-Partners/braze.png' },
];

// Snowflake doesn't have a shipped logo in /public/images/Solution-
// Partners; drop it from the eight rather than ship a duplicate AWS
// mark. Final grid is 7 brands; CSS auto-fills the empty cell.
const FINAL_PARTNERS = PARTNERS.filter((p) => p.name !== 'Snowflake');

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
        {FINAL_PARTNERS.map((p) => (
          <li key={p.name} className="m-partners__cell">
            <Image
              src={p.src}
              alt={`${p.name} partner logo`}
              width={100}
              height={36}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 25vw, 100px"
              className={[
                'm-partners__logo',
                p.invert ? 'm-partners__logo--invert' : '',
                p.mono ? 'm-partners__logo--mono' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </li>
        ))}
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
          padding: 12px;
        }
        .m-partners__logo {
          width: auto;
          height: 28px;
          max-width: 100%;
          object-fit: contain;
          opacity: 0.85;
          filter: grayscale(0.2);
        }
        .m-partners__logo--invert {
          filter: grayscale(0.2) invert(1) brightness(1.6);
        }
        .m-partners__logo--mono {
          filter: brightness(0) invert(1) opacity(0.9);
        }
      `}</style>
    </section>
  );
}
