'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import HeroMegaNav, { type NavTheme } from './HeroMegaNav';
import { v4Display, v4Sans } from '../fonts';
import './nav.css';

// The v4 site navigation, extracted from EditorialHero so the same
// mega-nav chrome serves every page:
//   - variant="overlay": transparent over the homepage hero, glass
//     once scrolled (the original hero behavior).
//   - variant="solid": glass from the first pixel, for inner pages
//     that start with their own content instead of a white hero.
// theme="dark" repaints the bar, the mobile sheet and the mega panels
// for the dark homepage. The partner wordmarks in the platforms panel
// are black ink on transparency, so that theme inverts them; without
// it they render as empty rows.
// The component owns its fonts so layout-level callers do not need to
// thread className props through.

export const v4HeadingClass = v4Display;
export const v4BodyClass = v4Sans;

const MOBILE_NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Platforms', href: '/platforms' },
  { label: 'Industries', href: '/industries' },
  { label: 'Resources', href: '/playbooks' },
  { label: 'Company', href: '/about' },
];

/** Text link with a growing underline + arrow nudge on hover. */
function ArrowLink({
  href,
  children,
  className,
  style,
  arrowSize = 20,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  arrowSize?: number;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className={`group inline-flex items-center gap-1.5 ${className ?? ''}`} style={style}>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <ArrowUpRight size={arrowSize} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export default function SiteNav({
  variant = 'solid',
  theme = 'light',
  headingClass,
}: {
  variant?: 'overlay' | 'solid';
  theme?: NavTheme;
  headingClass?: string;
}) {
  const [menu, setMenu] = useState(false);
  const [pastFold, setPastFold] = useState(false);
  const heading = headingClass ?? v4Display;
  const dark = theme === 'dark';
  const ACCENT = dark ? '#60A5FA' : '#1D4ED8';
  // Solid variant is always glass; overlay goes glass after scroll.
  const scrolled = variant === 'solid' || pastFold;

  useEffect(() => {
    if (variant === 'solid') return;
    const onScroll = () => setPastFold(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial position check runs from a frame callback, not the
    // effect body, so state never updates synchronously in render.
    const raf = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [variant]);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-5 transition-all duration-300 sm:px-8 md:px-6 lg:px-7 xl:px-12 ${v4Sans} ${
          scrolled
            ? dark
              ? 'border-b border-white/10 bg-[#0a0b10]/85 py-3 backdrop-blur-2xl'
              : 'border-b border-black/[0.06] bg-white/80 py-3 shadow-[0_12px_40px_-18px_rgba(3,12,24,0.25)] backdrop-blur-2xl'
            : 'border-b border-transparent bg-transparent py-5 md:py-6'
        }`}
      >
        <div className="nav-fade-down shrink-0" style={{ animationDelay: '0ms' }}>
          <Link href="/" aria-label="ACI Infotech home" className="flex items-center">
            <Image
              src="/aci-infotech-logo.png"
              alt="ACI Infotech"
              width={200}
              height={64}
              priority
              className={`w-auto transition-all duration-300 ${dark ? 'brightness-0 invert' : ''} ${
                scrolled ? 'h-10 md:h-11' : 'h-12 md:h-14'
              }`}
            />
          </Link>
        </div>

        <div className="nav-fade-down" style={{ animationDelay: '120ms' }}>
          <HeroMegaNav headingClass={heading} theme={theme} />
        </div>

        <div className="nav-fade-down flex shrink-0 items-center gap-4" style={{ animationDelay: '240ms' }}>
          {/* Wrapped rather than classed: ArrowLink sets inline-flex on
              itself, which would fight a `hidden` utility passed in. Only
              shows at lg — below that the nav has no room for it. */}
          <span className="hidden lg:block">
            <ArrowLink
              href="/contact"
              arrowSize={16}
              className={`whitespace-nowrap text-[15px] font-semibold tracking-wide ${
                dark ? 'text-white' : 'text-black'
              }`}
            >
              Start a project
            </ArrowLink>
          </span>
          <button
            onClick={() => setMenu(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 lg:hidden"
          >
            <span className={`h-0.5 w-5 ${dark ? 'bg-white' : 'bg-black'}`} />
            <span className={`h-0.5 w-5 ${dark ? 'bg-white' : 'bg-black'}`} />
            <span className={`h-0.5 w-5 ${dark ? 'bg-white' : 'bg-black'}`} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menu ? (
          <div
            /* z-[70] clears the Atheros nudge and chat launcher, which sit
               at z-[60]: at z-50 the floating bubble covered this sheet's
               "Start a project" link on every page that renders both. */
            className={`nav-overlay-in fixed inset-0 z-[70] flex flex-col px-6 py-5 ${v4Sans} ${
              dark ? 'bg-[#0a0b10] text-white' : 'bg-white text-black'
            }`}
          >
            <div className="flex items-center justify-between">
              <Image
                src="/aci-infotech-logo.png"
                alt="ACI Infotech"
                width={150}
                height={42}
                className={`h-10 w-auto ${dark ? 'brightness-0 invert' : ''}`}
              />
              <button
                onClick={() => setMenu(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center"
              >
                <X size={22} className={dark ? 'text-white' : 'text-black'} />
              </button>
            </div>
            <div className="mt-14 flex flex-col gap-7">
              {MOBILE_NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className={`text-3xl font-semibold capitalize tracking-wide ${dark ? 'text-white' : 'text-black'}`}
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="https://thearq.ai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenu(false)}
                className="inline-flex items-center gap-2 text-3xl font-semibold capitalize tracking-wide"
                style={{ color: ACCENT }}
              >
                ArqAI Labs
                <ArrowUpRight size={26} />
              </a>
            </div>
            <ArrowLink
              href="/contact"
              onClick={() => setMenu(false)}
              arrowSize={22}
              className="mt-auto text-xl font-semibold tracking-wide"
              style={{ color: ACCENT }}
            >
              Start a project
            </ArrowLink>
          </div>
        ) : null}
    </>
  );
}
