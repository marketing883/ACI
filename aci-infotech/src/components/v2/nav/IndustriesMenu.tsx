'use client';

/**
 * IndustriesMenu — two-zone layout.
 *
 *   LEFT  — 7-industry editorial list
 *   RIGHT — featured engagement for the hovered industry
 *           (client descriptor, short headline, one metric, link)
 *
 * Default state shows the first industry. Hovering another row fades
 * the right panel to its engagement.
 */

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { INDUSTRIES, INDUSTRY_FEATURES } from './menu-data';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function IndustriesMenu() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = INDUSTRIES[activeIdx];
  const feature = INDUSTRY_FEATURES[active.slug];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
        gap: 32,
        padding: '36px 40px',
        minHeight: 360,
      }}
    >
      {/* LEFT — industry list */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--v2-text-muted)',
            marginBottom: 18,
          }}
        >
          / Industries
        </div>
        <div>
          {INDUSTRIES.map((ind, i) => {
            const isActive = i === activeIdx;
            return (
              <Link
                key={ind.slug}
                href={ind.href}
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--v2-border-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transform: isActive ? 'translateX(6px)' : 'translateX(0)',
                  transition: 'transform 200ms var(--v2-ease)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 17,
                    fontWeight: 600,
                    color: isActive ? 'var(--v2-accent)' : 'var(--v2-text-primary)',
                    letterSpacing: '-0.01em',
                    transition: 'color 200ms var(--v2-ease)',
                  }}
                >
                  {ind.label}
                </span>
                <ArrowRight
                  size={14}
                  style={{
                    color: isActive ? 'var(--v2-accent)' : 'var(--v2-text-muted)',
                    transition: 'color 200ms var(--v2-ease)',
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* RIGHT — featured engagement */}
      <aside
        style={{
          position: 'relative',
          background: 'var(--v2-surface-2)',
          border: '1px solid var(--v2-border-subtle)',
          borderRadius: 6,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 280,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {feature && (
            <motion.div
              key={active.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--v2-accent)',
                  marginBottom: 10,
                }}
              >
                / {active.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--v2-text-secondary)',
                  marginBottom: 14,
                }}
              >
                {feature.clientDescriptor}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  letterSpacing: '-0.015em',
                  color: 'var(--v2-text-primary)',
                  margin: '0 0 22px 0',
                }}
              >
                {feature.headline}
              </p>

              <div
                style={{
                  display: 'inline-block',
                  borderLeft: '2px solid var(--v2-accent)',
                  paddingLeft: 14,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: 'var(--v2-text-primary)',
                  }}
                >
                  {feature.metric.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--v2-text-muted)',
                    marginTop: 6,
                  }}
                >
                  {feature.metric.label}
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link
                  href={feature.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--v2-accent)',
                    textDecoration: 'none',
                  }}
                >
                  Read the case study
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}
