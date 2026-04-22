'use client';

/**
 * MobileMenu — full-screen slide-over takeover for <768px. Replaces
 * every mega menu with an accordion: each top-level section expands
 * to show its items. No preview panels, no case-study imagery —
 * dense, tap-friendly, forgiving for thumbs.
 *
 * Open / close is controlled by the parent (NavV2). A lime CTA is
 * pinned to the top; the item list fills the rest of the viewport
 * and scrolls when tall.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, X } from 'lucide-react';
import {
  SERVICES,
  PLATFORM_CATEGORIES,
  INDUSTRIES,
  RESOURCES,
  COMPANY,
} from './menu-data';

interface Props {
  open: boolean;
  onClose: () => void;
}

type SectionId = 'services' | 'platforms' | 'industries' | 'resources' | 'company';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MobileMenu({ open, onClose }: Props) {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState<SectionId | null>('services');

  // Prevent background scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={reduced ? { opacity: 0 } : { x: '100%' }}
          animate={reduced ? { opacity: 1 } : { x: 0 }}
          exit={reduced ? { opacity: 0 } : { x: '100%' }}
          transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'var(--v2-bg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 22px',
              borderBottom: '1px solid var(--v2-border-subtle)',
            }}
          >
            <Link
              href="/"
              onClick={onClose}
              aria-label="ACI Infotech home"
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/aci-infotech-logo-white.png"
                alt="ACI Infotech"
                style={{ height: 28, width: 'auto', display: 'block' }}
              />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              style={{
                width: 40,
                height: 40,
                borderRadius: 2,
                border: '1px solid var(--v2-border-strong)',
                background: 'transparent',
                color: 'var(--v2-text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Pinned CTA */}
          <div
            style={{
              flex: 'none',
              padding: '16px 22px',
              borderBottom: '1px solid var(--v2-border-subtle)',
            }}
          >
            <Link
              href="/contact?source=v2-mobile-nav"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'var(--v2-accent)',
                color: 'var(--v2-text-inverted)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderRadius: 2,
                textDecoration: 'none',
              }}
            >
              Start a project
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Accordion list */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              padding: '8px 0 32px',
            }}
          >
            <Section
              id="services"
              label="Services"
              expanded={expanded === 'services'}
              onToggle={() =>
                setExpanded((x) => (x === 'services' ? null : 'services'))
              }
            >
              {SERVICES.map((svc) => (
                <MobileLink
                  key={svc.href}
                  href={svc.href}
                  onClick={onClose}
                  title={svc.label}
                  sub={svc.description}
                />
              ))}
            </Section>

            <Section
              id="platforms"
              label="Platforms"
              expanded={expanded === 'platforms'}
              onToggle={() =>
                setExpanded((x) => (x === 'platforms' ? null : 'platforms'))
              }
            >
              {PLATFORM_CATEGORIES.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--v2-text-muted)',
                      padding: '10px 22px 6px',
                    }}
                  >
                    / {cat.label}
                  </div>
                  {cat.items.map((p) => (
                    <MobileLink
                      key={p.href}
                      href={p.href}
                      onClick={onClose}
                      title={p.label}
                      sub={p.capability}
                    />
                  ))}
                </div>
              ))}
            </Section>

            <Section
              id="industries"
              label="Industries"
              expanded={expanded === 'industries'}
              onToggle={() =>
                setExpanded((x) => (x === 'industries' ? null : 'industries'))
              }
            >
              {INDUSTRIES.map((ind) => (
                <MobileLink
                  key={ind.href}
                  href={ind.href}
                  onClick={onClose}
                  title={ind.label}
                />
              ))}
            </Section>

            <Section
              id="resources"
              label="Resources"
              expanded={expanded === 'resources'}
              onToggle={() =>
                setExpanded((x) => (x === 'resources' ? null : 'resources'))
              }
            >
              {Object.entries(RESOURCES).map(([key, res]) => (
                <MobileLink
                  key={key}
                  href={res.indexHref}
                  onClick={onClose}
                  title={res.eyebrow}
                />
              ))}
            </Section>

            <Section
              id="company"
              label="Company"
              expanded={expanded === 'company'}
              onToggle={() =>
                setExpanded((x) => (x === 'company' ? null : 'company'))
              }
            >
              {COMPANY.map((item) => (
                <MobileLink
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  title={item.label}
                  sub={item.description}
                />
              ))}
            </Section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  id,
  label,
  expanded,
  onToggle,
  children,
}: {
  id: SectionId;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--v2-border-subtle)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`mobile-section-${id}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px',
          background: 'transparent',
          border: 'none',
          fontFamily: 'var(--font-title)',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--v2-text-primary)',
          cursor: 'pointer',
        }}
      >
        {label}
        <ChevronDown
          size={18}
          style={{
            color: 'var(--v2-text-muted)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 220ms var(--v2-ease)',
          }}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            id={`mobile-section-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: 8 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileLink({
  href,
  onClick,
  title,
  sub,
}: {
  href: string;
  onClick: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 22px',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-title)',
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.005em',
            color: 'var(--v2-text-primary)',
          }}
        >
          {title}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.4,
              color: 'var(--v2-text-secondary)',
              marginTop: 2,
            }}
          >
            {sub}
          </div>
        )}
      </div>
      <ArrowRight
        size={14}
        style={{ color: 'var(--v2-text-muted)', flexShrink: 0, marginTop: 4 }}
      />
    </Link>
  );
}
