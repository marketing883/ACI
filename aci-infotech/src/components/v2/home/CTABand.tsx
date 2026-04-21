'use client';

/**
 * CTABand — enormous closing headline, one subhead, two CTAs. The
 * emotional peak of the page. Background is the same 80x80 blue grid
 * as the hero with a radial mask for a vignette effect.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTABand() {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        background: 'var(--v2-bg)',
        paddingTop: 'clamp(100px, 14vw, 180px)',
        paddingBottom: 'clamp(100px, 14vw, 180px)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(27, 42, 88, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(27, 42, 88, 0.4) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(700px 500px at 50% 50%, black 0%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(44px, 7.5vw, 116px)',
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: '-0.035em',
            margin: '0 0 40px 0',
            color: 'var(--v2-text-primary)',
          }}
        >
          Put your next system{' '}
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 500,
              color: 'var(--v2-accent)',
            }}
          >
            in production.
          </em>
        </h2>
        <p
          style={{
            color: 'var(--v2-text-secondary)',
            fontSize: 17,
            lineHeight: 1.55,
            maxWidth: 560,
            margin: '0 auto 40px',
          }}
        >
          Tell us about the work.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            href="/contact?source=v2-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '22px 28px',
              background: 'var(--v2-accent)',
              color: 'var(--v2-text-inverted)',
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              borderRadius: 2,
              textDecoration: 'none',
            }}
          >
            <span>Start a project</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
