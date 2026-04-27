'use client';

/**
 * ServicesMenu — the centerpiece mega menu. Three zones:
 *
 *   LEFT  (narrow)  — editorial intro + "see all" link
 *   MIDDLE          — the 9-service list, index + title + arrow
 *   RIGHT           — live preview of the currently-hovered service:
 *                     tagline, key outcomes, "view practice" CTA
 *
 * Hovering any row in the middle column fades the right panel to
 * that service. Default state (no hover) shows the first service.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from './menu-data';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ServicesMenu() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [listHovered, setListHovered] = useState(false);
  const active = SERVICES[activeIdx];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.3fr) minmax(0, 1fr)',
        gap: 40,
        padding: '36px 40px',
        minHeight: 460,
      }}
    >
      {/* LEFT — intro */}
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
          / Practices
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--v2-text-primary)',
            margin: 0,
          }}
        >
          Our services.
          <br />
          <em
            style={{
              fontStyle: 'italic',
              fontWeight: 500,
              color: 'var(--v2-accent)',
            }}
          >
            Across the enterprise stack.
          </em>
        </h3>
        <p
          style={{
            color: 'var(--v2-text-secondary)',
            fontSize: 13,
            lineHeight: 1.55,
            marginTop: 14,
            marginBottom: 24,
          }}
        >
          Delivered end to end, from architecture through operations. Measured
          on the metric you came in with.
        </p>
        <Link
          href="/services"
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
          See all services
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* MIDDLE — service list */}
      <div onMouseEnter={() => setListHovered(true)} onMouseLeave={() => setListHovered(false)}>
        {SERVICES.map((svc, i) => {
          const isActive = i === activeIdx;
          const opacity = isActive ? 1 : listHovered ? 0.4 : 0.7;
          return (
            <Link
              key={svc.href}
              href={svc.href}
              onMouseEnter={() => setActiveIdx(i)}
              onFocus={() => setActiveIdx(i)}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr auto',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--v2-border-subtle)',
                textDecoration: 'none',
                color: 'inherit',
                opacity,
                transform: isActive ? 'translateX(6px)' : 'translateX(0)',
                transition:
                  'opacity 200ms var(--v2-ease), transform 200ms var(--v2-ease)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: isActive ? 'var(--v2-accent)' : 'var(--v2-text-muted)',
                  letterSpacing: '0.08em',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  color: 'var(--v2-text-primary)',
                }}
              >
                {svc.label}
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

      {/* RIGHT — live preview */}
      <aside
        style={{
          position: 'relative',
          background: 'var(--v2-surface-2)',
          border: '1px solid var(--v2-border-subtle)',
          borderRadius: 6,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 360,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.href}
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
                marginBottom: 12,
              }}
            >
              / Practice
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.015em',
                margin: 0,
                marginBottom: 10,
                color: 'var(--v2-text-primary)',
              }}
            >
              {active.label}
            </h4>
            {active.tagline && (
              <p
                style={{
                  color: 'var(--v2-text-secondary)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                {active.tagline}
              </p>
            )}

            {active.keyOutcomes && active.keyOutcomes.length > 0 && (
              <>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--v2-text-muted)',
                    marginBottom: 8,
                  }}
                >
                  Key outcomes
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  {active.keyOutcomes.map((outcome) => (
                    <li
                      key={outcome}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: 'var(--v2-text-primary)',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: 'var(--v2-accent)',
                          flexShrink: 0,
                          marginTop: 8,
                        }}
                      />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div style={{ marginTop: 'auto' }}>
              <Link
                href={active.href}
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
                View practice
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}
