'use client';

/**
 * StackChip — one chip representing a technology or platform.
 *
 * Resolution order:
 *   1. Simple Icons CDN slug (monochrome SVG, tinted via URL color).
 *      Preferred when available because the tint matches the palette.
 *   2. Local partner-logo PNG shipped under /public. Filtered to
 *      monochrome via CSS so it sits next to the Simple Icons SVGs.
 *   3. Dashboard-icons CDN (homarr-labs on jsdelivr). Broad enterprise
 *      coverage for brands Simple Icons has dropped. Also filtered to
 *      monochrome.
 *   4. Uppercase mono text fallback.
 *
 * Used in both the ServicesDial preview panel (default size) and the
 * case-studies slides (compact size).
 */

import {
  STACK_CDN_SLUGS,
  STACK_LOCAL_LOGOS,
  STACK_DASHBOARD_SLUGS,
} from './stack-icons';

const LOGO_TINT_HEX = '9AA7C2'; // --v2-text-secondary without the #

// Default logo filter: mild grayscale + slight dim. Keeps logos in
// their native colors enough to remain recognizable (Microsoft blue,
// AWS orange, Power BI yellow, etc.) while toning them down so the
// row reads as an editorial strip.
const SOFTEN_FILTER = 'grayscale(0.25) brightness(0.95)';

// Applied to brand PNGs that are dark-on-white by default (SAP blue,
// Azure wordmark, Salesforce cloud mark) so they don't disappear
// against our dark card surface. Inverts the image to light-on-
// transparent then adds a mild brightness lift so the stroke weight
// reads clearly.
const INVERT_FILTER = 'invert(1) brightness(1.15)';

interface StackChipProps {
  label: string;
  /** Render a tighter chip (still readable, for dense rows). */
  compact?: boolean;
}

export default function StackChip({ label, compact = false }: StackChipProps) {
  const cdnSlug = STACK_CDN_SLUGS[label];
  const localEntry = !cdnSlug ? STACK_LOCAL_LOGOS[label] : undefined;
  const dashSlug =
    !cdnSlug && !localEntry ? STACK_DASHBOARD_SLUGS[label] : null;

  // Sizes are intentionally generous — the row reads as a brand strip,
  // not an afterthought.
  const shellHeight = compact ? 48 : 52;
  const svgHeight = compact ? 26 : 28; // monochrome SVG
  const rasterHeight = compact ? 28 : 30; // full-color PNG / SVG, filtered
  const textSize = compact ? 12 : 13;
  const shellPad = compact ? '0 16px' : '0 18px';

  const shellStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: shellHeight,
    padding: shellPad,
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
          style={{ height: svgHeight, width: 'auto', display: 'block', opacity: 0.92 }}
          loading="lazy"
        />
      </span>
    );
  }

  if (localEntry) {
    const localFilter = localEntry.mono
      ? 'none'
      : localEntry.invert
        ? INVERT_FILTER
        : SOFTEN_FILTER;
    return (
      <span title={label} style={shellStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={localEntry.src}
          alt={label}
          style={{
            height: rasterHeight,
            width: 'auto',
            display: 'block',
            filter: localFilter,
            opacity: 0.95,
          }}
          loading="lazy"
        />
      </span>
    );
  }

  if (dashSlug) {
    return (
      <span title={label} style={shellStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/${dashSlug}.svg`}
          alt={label}
          style={{
            height: rasterHeight,
            width: 'auto',
            display: 'block',
            filter: SOFTEN_FILTER,
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
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}
