'use client';

/**
 * ServicesDial — auto-cycling two-column "capability dial".
 *
 * Left: 8 service rows, large display type, current row highlighted in
 *   lime. Hovering pauses the auto-cycle and dims other rows.
 * Right: live preview panel that fades between service details when the
 *   active service changes. Shows tag, status, description, 3 stats,
 *   an ASCII diagram, and the tech stack.
 *
 * Auto-cycles every 3.4s while the section is visible. Pauses while the
 * list is being hovered.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from './services-data';

const CYCLE_MS = 3400;

export default function ServicesDial() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hovering, setHovering] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });

  // Auto-cycle while in view and not hovering.
  useEffect(() => {
    if (!inView || hovering) return;
    const t = setInterval(() => {
      setActiveIdx((i) => (i + 1) % SERVICES.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [inView, hovering]);

  const active = SERVICES[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden"
      style={{
        background: 'var(--v2-bg)',
        paddingTop: 'var(--v2-section-py)',
        paddingBottom: 'var(--v2-section-py)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
      }}
    >
      {/* subtle grid background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--v2-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--v2-border-subtle) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 70% 50%, black 0%, transparent 75%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto', position: 'relative' }}>
        {/* Section head */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <div>
            <div
              style={{
                color: 'var(--v2-text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--v2-text-muted)',
                  display: 'inline-block',
                }}
              />
              Services · 003
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(40px, 6.5vw, 88px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                color: 'var(--v2-text-primary)',
                margin: 0,
                maxWidth: 900,
              }}
            >
              What we{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 500, position: 'relative', display: 'inline-block' }}>
                <span style={{ position: 'relative', zIndex: 1 }}>actually do.</span>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: -4,
                    right: -4,
                    bottom: '0.1em',
                    height: '0.14em',
                    background: 'var(--v2-accent)',
                    zIndex: 0,
                  }}
                />
              </em>
            </h2>
          </div>
          <p
            style={{
              color: 'var(--v2-text-secondary)',
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 420,
              margin: 0,
            }}
          >
            Eight capabilities, one engineering floor. Hover the list to inspect,
            each one has a live preview of how we run the practice.
          </p>
        </div>

        {/* Stage: two columns. Right column sticks while the list
            on the left scrolls past it, so the live preview is
            always visible regardless of which row is active. */}
        <div
          className="svc-stage"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
            gap: 80,
            alignItems: 'start',
          }}
        >
          <style>{`
            @media (max-width: 960px) {
              .svc-stage { grid-template-columns: 1fr !important; gap: 40px !important; }
              .svc-row-title { font-size: clamp(28px, 6vw, 44px) !important; }
              .svc-preview-sticky { position: static !important; }
            }
          `}</style>

          {/* LEFT — list */}
          <div
            ref={listRef}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="v2-animates"
          >
            {SERVICES.map((svc, i) => {
              const isActive = i === activeIdx;
              const listHovered = hovering;
              const opacity = isActive ? 1 : listHovered ? 0.28 : 0.55;
              return (
                <button
                  key={svc.id}
                  type="button"
                  onMouseEnter={() => setActiveIdx(i)}
                  onFocus={() => setActiveIdx(i)}
                  className="svc-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    alignItems: 'center',
                    gap: 16,
                    width: '100%',
                    padding: '1rem 0',
                    background: 'transparent',
                    border: 'none',
                    borderTop: '1px solid var(--v2-border-subtle)',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                    opacity,
                    transition: 'opacity 300ms var(--v2-ease), transform 300ms var(--v2-ease)',
                    transform: isActive ? 'translateX(10px)' : 'translateX(0)',
                    position: 'relative',
                  }}
                >
                  {/* lime dot for active */}
                  {isActive && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--v2-accent)',
                        boxShadow: '0 0 10px var(--v2-accent)',
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      letterSpacing: '0.12em',
                      color: isActive ? 'var(--v2-accent)' : 'var(--v2-text-muted)',
                      fontWeight: 500,
                    }}
                  >
                    {svc.index}
                  </span>
                  <span
                    className="svc-row-title"
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: 'clamp(34px, 4.2vw, 64px)',
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      color: 'var(--v2-text-primary)',
                    }}
                  >
                    {svc.titlePrefix}
                    <em
                      style={{
                        fontStyle: 'italic',
                        fontWeight: 500,
                        color: isActive ? 'var(--v2-accent)' : 'inherit',
                        transition: 'color 300ms var(--v2-ease)',
                      }}
                    >
                      {svc.emphasis}
                    </em>
                    {svc.titleSuffix ?? ''}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid var(--v2-border-strong)',
                      background: isActive ? 'var(--v2-accent)' : 'transparent',
                      color: isActive ? 'var(--v2-text-inverted)' : 'var(--v2-text-secondary)',
                      transition: 'all 300ms var(--v2-ease)',
                    }}
                  >
                    <ArrowRight size={16} />
                  </span>
                </button>
              );
            })}
            <div style={{ height: 1, background: 'var(--v2-border-subtle)' }} />
          </div>

          {/* RIGHT — live preview panel (sticky on desktop) */}
          <aside
            className="svc-preview-sticky"
            style={{
              position: 'sticky',
              top: 96,
              borderRadius: 6,
              border: '1px solid var(--v2-border-strong)',
              background: 'var(--v2-surface-2)',
              backgroundImage:
                'linear-gradient(var(--v2-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--v2-border-subtle) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              overflow: 'hidden',
              maxHeight: 'calc(100vh - 128px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(198,255,61,0.08), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            {/* Head */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 22px',
                borderBottom: '1px solid var(--v2-border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--v2-text-muted)',
                position: 'relative',
              }}
            >
              <span>{active.tag}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--v2-accent)',
                  textTransform: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--v2-accent)',
                    boxShadow: '0 0 8px var(--v2-accent)',
                    animation: 'v2-pulse 1.6s ease-in-out infinite',
                  }}
                />
                {active.status}
              </span>
            </div>

            <style>{`
              @keyframes v2-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.35; }
              }
            `}</style>

            {/* Fading body (scrolls inside the sticky panel if needed) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: 26,
                  position: 'relative',
                  overflowY: 'auto',
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: '-0.015em',
                    margin: 0,
                    color: 'var(--v2-text-primary)',
                  }}
                >
                  {active.title}
                </h3>
                <p
                  style={{
                    color: 'var(--v2-text-secondary)',
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginTop: 12,
                    marginBottom: 20,
                  }}
                >
                  {active.desc}
                </p>

                {/* 3-up stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  {active.stats.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        padding: '14px 12px',
                        background: 'var(--v2-bg)',
                        border: '1px solid var(--v2-border-subtle)',
                        borderLeft: '2px solid var(--v2-accent)',
                        borderRadius: 4,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: 22,
                          fontWeight: 700,
                          color: 'var(--v2-text-primary)',
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
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
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ASCII diagram */}
                <pre
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    lineHeight: 1.55,
                    color: 'var(--v2-text-secondary)',
                    background: 'var(--v2-bg)',
                    border: '1px solid var(--v2-border-subtle)',
                    padding: 16,
                    borderRadius: 4,
                    overflowX: 'auto',
                    margin: 0,
                    marginBottom: 20,
                  }}
                >
                  {active.diagram}
                </pre>

                {/* Stack chips */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                  }}
                >
                  {active.stack.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '4px 8px',
                        background: 'var(--v2-surface-3)',
                        border: '1px solid var(--v2-border)',
                        borderRadius: 2,
                        color: 'var(--v2-text-secondary)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </section>
  );
}
