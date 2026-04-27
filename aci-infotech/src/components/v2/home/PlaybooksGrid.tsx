'use client';

/**
 * PlaybooksGrid — six playbook cards backed by the real PLAYBOOKS data.
 *
 * Card surface:
 *   - Title (playbook displayTitle)
 *   - Short challenge pattern line
 *   - Three outcomes the buyer can expect from this engagement
 *     (value + label), grouped under a single lime accent bar
 *   - Deployments count + go arrow in the footer
 *
 * Motion:
 *   - Scroll-triggered reveal (fade + rise), staggered by card index
 *     so the grid cascades in as the section enters the viewport
 *   - Subtle hover lift via framer `whileHover`
 *   - Cursor-tracking lime spotlight driven by CSS custom props on
 *     pointermove (kept as-is — pairs well with the new lift)
 *
 * The mono eyebrow tag from the previous layout has been removed to
 * make room for three-outcome display without crowding.
 */

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PLAYBOOKS, type PlaybookData } from '@/components/sections/PlaybookVaultSection';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PlaybooksGrid() {
  // Surface up to 6 playbooks, prioritizing those with more deployments.
  const cards = [...PLAYBOOKS]
    .sort((a, b) => b.deployments - a.deployments)
    .slice(0, 6);

  return (
    <section
      id="playbooks"
      style={{
        background: 'var(--v2-bg)',
        paddingTop: 'var(--v2-section-py)',
        paddingBottom: 'var(--v2-section-py)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
        borderTop: '1px solid var(--v2-border-subtle)',
      }}
    >
      <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Head */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
            marginBottom: 56,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(32px, 5vw, 68px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                color: 'var(--v2-text-primary)',
                margin: 0,
              }}
            >
              Use cases we deliver.{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: 'var(--v2-accent)',
                }}
              >
                AI-accelerated.
              </em>
            </h2>
          </div>
          <p
            style={{
              color: 'var(--v2-text-secondary)',
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 380,
              margin: 0,
            }}
          >
            Each playbook runs through ArqAI. That is why the timelines are weeks, not quarters, and the accuracy holds up to&nbsp;audit.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {cards.map((pb, i) => (
            <PlaybookCard key={pb.id} pb={pb} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaybookCard({ pb, index }: { pb: PlaybookData; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const outcomes = pb.outcomes.slice(0, 3);

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{
        duration: 0.5,
        delay: reduced ? 0 : index * 0.08,
        ease: EASE,
      }}
      style={{ display: 'flex' }}
    >
      <Link
        ref={ref}
        href={`/playbooks/${pb.slug}`}
        onMouseMove={(e) => {
          const el = ref.current;
          if (!el) return;
          const rect = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          el.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }}
        className="v2-pb-card"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          background: 'var(--v2-surface-1)',
          border: '1px solid var(--v2-border-strong)',
          borderRadius: 6,
          padding: '22px 24px',
          minHeight: 260,
          color: 'var(--v2-text-primary)',
          textDecoration: 'none',
          overflow: 'hidden',
          transition:
            'border-color 300ms var(--v2-ease), box-shadow 300ms var(--v2-ease)',
        }}
      >
        {/* cursor-tracking lime spotlight */}
        <span
          aria-hidden
          className="v2-pb-spotlight"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(320px 220px at var(--mx, 50%) var(--my, 50%), rgba(198, 255, 61, 0.12), transparent 70%)',
            opacity: 0,
            transition: 'opacity 300ms var(--v2-ease)',
            pointerEvents: 'none',
          }}
        />

        <style>{`
          .v2-pb-card:hover {
            border-color: var(--v2-border-hot);
            box-shadow: 0 18px 40px -20px rgba(198, 255, 61, 0.18);
          }
          .v2-pb-card:hover .v2-pb-spotlight { opacity: 1; }
          .v2-pb-card:hover .v2-pb-arrow {
            transform: rotate(-45deg);
            background: var(--v2-accent);
            border-color: var(--v2-accent);
            color: var(--v2-text-inverted);
          }
        `}</style>

        <h3
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.25,
            letterSpacing: '-0.015em',
            margin: 0,
            marginBottom: 12,
            color: 'var(--v2-text-primary)',
            position: 'relative',
          }}
        >
          {pb.displayTitle}
        </h3>

        {/* AI acceleration line */}
        {pb.arqaiAcceleration && (
          <p
            className="v2-pb-desc"
            style={{
              fontSize: 13,
              lineHeight: 1.55,
              color: 'var(--v2-text-secondary)',
              marginTop: 0,
              marginBottom: 20,
              position: 'relative',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {pb.arqaiAcceleration}
          </p>
        )}

        {/* Outcomes the buyer can expect. Three compact metric tiles
            under a shared lime accent bar, reading as "here is what
            this engagement returns". Non-active cards render values
            at 0.9 scale and fade up on scroll-reveal for a subtle
            "land" effect keyed off the card entering the viewport. */}
        {outcomes.length > 0 && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'stretch',
              marginTop: 'auto',
              marginBottom: 18,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 2,
                background: 'var(--v2-accent)',
                flexShrink: 0,
                marginRight: 14,
              }}
            />
            <motion.div
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'shown'}
              viewport={{ once: true, margin: '-60px' }}
              variants={{
                hidden: {},
                shown: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
              }}
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: `repeat(${outcomes.length}, minmax(0, 1fr))`,
                gap: 14,
              }}
            >
              {outcomes.map((o) => (
                <motion.div
                  key={o.description}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                  style={{ minWidth: 0 }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      color: 'var(--v2-text-primary)',
                    }}
                  >
                    {o.metric}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--v2-text-muted)',
                      marginTop: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {o.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        <div
          style={{
            paddingTop: 14,
            borderTop: '1px dashed var(--v2-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--v2-text-muted)',
            position: 'relative',
          }}
        >
          <span>
            <strong
              style={{
                color: 'var(--v2-text-primary)',
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              {pb.deployments}
            </strong>{' '}
            deployments
          </span>
          <span
            className="v2-pb-arrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid var(--v2-border-strong)',
              background: 'transparent',
              color: 'var(--v2-text-secondary)',
              transition: 'all 300ms var(--v2-ease)',
            }}
          >
            <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
