'use client';

/**
 * Marquee — "what recognizes us" strip that scrolls the firm's key
 * certifications and awards across a dark band. Each item is a white
 * logo chip (so the certification badges keep their native colors and
 * look legit) next to a caps-lock label. Lime borders top and bottom
 * preserve the accent rhythm the previous lime-band marquee had,
 * without washing out the cert logos against the background.
 *
 * Content duplicates inline so the track loops seamlessly. Pauses on
 * hover. Disabled under prefers-reduced-motion (renders static).
 */

import { useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface MarqueeItem {
  label: string;
  /** Path to a cert/award logo on a transparent or white background. */
  logo?: string;
  /** Alt text for the logo image. */
  alt?: string;
  /** Fallback icon when there is no shipped logo. Rendered on a
   *  white chip so it reads the same as logo items. */
  fallbackIcon?: boolean;
}

const ITEMS: MarqueeItem[] = [
  {
    label: 'Great Place to Work',
    logo: '/images/certifications-awards/best-place-to-work.webp',
    alt: 'Great Place to Work Certified',
  },
  {
    label: 'ISO 27001 Certified',
    logo: '/images/certifications-awards/iso-27001.webp',
    alt: 'ISO/IEC 27001:2022',
  },
  {
    label: 'SOC 2 Type II',
    fallbackIcon: true,
  },
  {
    label: 'CMMI Level 3',
    logo: '/images/certifications-awards/cmmi.webp',
    alt: 'CMMI Level 3',
  },
  {
    label: 'Best Data Analytics Company',
    logo: '/images/certifications-awards/best-data-analytics-company.webp',
    alt: 'Best Data Analytics Company',
  },
  {
    label: 'HIPAA Ready',
    fallbackIcon: true,
  },
];

function Chip({ item }: { item: MarqueeItem }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        minWidth: 96,
        padding: '0 14px',
        background: '#FFFFFF',
        borderRadius: 6,
        flexShrink: 0,
      }}
    >
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt={item.alt ?? item.label}
          style={{
            height: 44,
            width: 'auto',
            display: 'block',
          }}
          loading="lazy"
        />
      ) : (
        <ShieldCheck size={28} style={{ color: '#0A1838' }} strokeWidth={2.2} />
      )}
    </span>
  );
}

export default function Marquee() {
  const reduced = useReducedMotion();

  const content = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 36,
        padding: '0 18px',
      }}
    >
      {ITEMS.map((it, i) => (
        <span
          key={`${it.label}-${i}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 36 }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <Chip item={it} />
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(18px, 1.8vw, 24px)',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-primary)',
              }}
            >
              {it.label}
            </span>
          </span>
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--v2-accent)',
              flexShrink: 0,
            }}
          />
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-label="Certifications and awards"
      role="region"
      className="v2-marquee"
      style={{
        width: '100%',
        overflow: 'hidden',
        background: 'var(--v2-bg)',
        borderTop: '2px solid var(--v2-accent)',
        borderBottom: '2px solid var(--v2-accent)',
        padding: '20px 0',
      }}
    >
      <div
        className="v2-marquee-track"
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          animation: reduced ? 'none' : 'v2-marquee-scroll 44s linear infinite',
        }}
      >
        {content}
        {content}
      </div>

      <style>{`
        @keyframes v2-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .v2-marquee:hover .v2-marquee-track { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
