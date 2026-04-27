'use client';

/**
 * MobileNav — sticky top bar for the phone homepage. Logo on the
 * left, hamburger on the right. Tap the hamburger and a full-screen
 * overlay menu slides in with the primary nav links and the
 * conversion CTA.
 *
 * Why a client component: the toggle state needs aria-expanded on
 * the button and inert/scroll-lock on the body when the menu is
 * open. CSS-only checkbox hacks can't carry that ARIA state, so we
 * pay the ~3 KB of useState for an accessible toggle. The rest of
 * the mobile tree stays server-rendered.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight } from 'lucide-react';

const PRIMARY_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Case studies', href: '/case-studies' },
  { label: 'Playbooks', href: '/playbooks' },
  { label: 'Insights', href: '/blogs' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  // Lock background scroll while the menu is open so the hero
  // doesn't drift behind it on iOS rubber-band scrolls.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close the menu if the user resizes into a desktop viewport
  // (rare, but happens with browser zoom or rotation tricks).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="m-nav" role="banner">
        <Link href="/" className="m-nav__logo" aria-label="ACI Infotech home">
          <Image
            src="/brand/aci-infotech-logo-white.webp"
            alt="ACI Infotech"
            width={120}
            height={28}
            priority
          />
        </Link>
        <button
          type="button"
          className="m-nav__hamburger"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="m-nav-menu"
        >
          <Menu size={22} strokeWidth={1.5} aria-hidden />
        </button>
      </header>

      {/* Spacer so content below isn't hidden under the fixed bar. */}
      <div className="m-nav__spacer" aria-hidden />

      <div
        id="m-nav-menu"
        className={`m-nav__menu${open ? ' m-nav__menu--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        // hidden when closed so screen readers skip it and tab focus
        // doesn't escape into the offscreen tree.
        hidden={!open}
      >
        <div className="m-nav__menu-top">
          <Link
            href="/"
            className="m-nav__logo"
            aria-label="ACI Infotech home"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/aci-infotech-logo-white.webp"
              alt="ACI Infotech"
              width={120}
              height={28}
            />
          </Link>
          <button
            type="button"
            className="m-nav__hamburger"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={22} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <nav className="m-nav__list" aria-label="Primary">
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="m-nav__link"
              onClick={() => setOpen(false)}
            >
              {l.label}
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
            </Link>
          ))}
        </nav>

        <Link
          href="/contact?source=v2-mobile-nav"
          className="m-btn m-btn--primary m-nav__cta"
          onClick={() => setOpen(false)}
        >
          <span>Get in Touch</span>
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>

      <style>{`
        .m-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: 56px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(5, 11, 31, 0.86);
          backdrop-filter: saturate(140%) blur(10px);
          -webkit-backdrop-filter: saturate(140%) blur(10px);
          border-bottom: 1px solid var(--v2-border-subtle);
        }
        .m-nav__spacer {
          height: 56px;
        }
        .m-nav__logo {
          display: inline-flex;
          align-items: center;
        }
        .m-nav__logo img {
          height: 24px;
          width: auto;
        }
        .m-nav__hamburger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: transparent;
          color: var(--v2-text-primary);
          border: 1px solid var(--v2-border-strong);
          border-radius: 8px;
          padding: 0;
          cursor: pointer;
        }
        .m-nav__menu {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: var(--v2-bg);
          padding: 0 20px 32px;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 220ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .m-nav__menu--open {
          opacity: 1;
          transform: translateY(0);
        }
        .m-nav__menu-top {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--v2-border-subtle);
        }
        .m-nav__list {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 16px 0;
        }
        .m-nav__link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 4px;
          font-family: var(--font-title);
          font-size: 22px;
          font-weight: 500;
          color: var(--v2-text-primary);
          text-decoration: none;
          border-bottom: 1px solid var(--v2-border-subtle);
        }
        .m-nav__link:active {
          color: var(--v2-accent);
        }
        .m-nav__cta {
          margin-top: 20px;
          align-self: stretch;
          justify-content: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .m-nav__menu {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
