'use client';

/**
 * StackChip — one chip representing a technology or platform.
 *
 * Resolution order:
 *   1. Simple Icons CDN slug (monochrome SVG, tinted via URL color)
 *   2. Local partner-logo PNG (tinted via CSS filter to blend with SVGs)
 *   3. Uppercase mono text fallback
 *
 * Used in both the ServicesDial preview panel and the case-studies
 * slides, so it lives in its own file.
 */

import { STACK_CDN_SLUGS, STACK_LOCAL_LOGOS } from './stack-icons';

const LOGO_TINT_HEX = '9AA7C2'; // --v2-text-secondary without the #

interface StackChipProps {
  label: string;
  /** Render a more compact chip (smaller logo + shell). */
  compact?: boolean;
}

export default function StackChip({ label, compact = false }: StackChipProps) {
  const cdnSlug = STACK_CDN_SLUGS[label];
  const localSrc = cdnSlug ? null : STACK_LOCAL_LOGOS[label];

  const shellHeight = compact ? 34 : 44;
  const svgHeight = compact ? 16 : 22;
  const pngHeight = compact ? 18 : 24;
  const textSize = compact ? 10 : 11;

  const shellStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: shellHeight,
    padding: compact ? '0 12px' : '0 16px',
    background: 'var(--v2-surface-3)',
    border: '1px solid var(--v2-border)',
    borderRadius: 4,
  };

  if (cdnSlug) {
    return (
      <span title={label} style={shellStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://cdn.simpleicons.org/${cdnSlug}/${LOGO_TINT_HEX}`}
          alt={label}
          style={{ height: svgHeight, width: 'auto', display: 'block', opacity: 0.9 }}
          loading="lazy"
        />
      </span>
    );
  }

  if (localSrc) {
    return (
      <span title={label} style={shellStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={localSrc}
          alt={label}
          style={{
            height: pngHeight,
            width: 'auto',
            display: 'block',
            filter: 'brightness(0) invert(0.65)',
            opacity: 0.95,
          }}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span
      style={{
        ...shellStyle,
        fontFamily: 'var(--font-mono)',
        fontSize: textSize,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--v2-text-secondary)',
      }}
    >
      {label}
    </span>
  );
}
