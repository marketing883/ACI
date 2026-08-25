'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import { v4Sans } from '../v4/fonts';

// Minimal dark nav for the v5 preview. The shared v4 SiteNav (and its
// mega-nav) is built for light surfaces; giving it a full dark variant
// is promotion-time work, so the preview ships this slim chrome
// instead: transparent over the hero, dark glass once scrolled. The
// standard logo is dark-on-transparent, so it renders inverted here.

const LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Platforms', href: '/platforms' },
  { label: 'Partners', href: '/partners' },
  { label: 'Resources', href: '/playbooks' },
  { label: 'Company', href: '/about' },
];

export default function V5Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    const raf = requestAnimationFrame(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8 md:px-12 ${v4Sans} ${
          scrolled
            ? 'border-b border-white/10 bg-[#0a0b10]/85 py-3 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent py-5'
        }`}
      >
        <Link href="/" aria-label="ACI Infotech home" className="flex shrink-0 items-center">
          <Image
            src="/aci-infotech-logo.png"
            alt="ACI Infotech"
            width={200}
            height={64}
            priority
            className="h-10 w-auto brightness-0 invert md:h-11"
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/80 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/contact"
            className="group hidden items-center gap-1.5 text-sm font-semibold text-white lg:inline-flex"
          >
            <span className="relative">
              Start a project
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            onClick={() => setMenu(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1 lg:hidden"
          >
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </button>
        </div>
      </nav>

      {menu ? (
        <div className={`fixed inset-0 z-50 flex flex-col bg-[#0a0b10] px-6 py-5 text-white ${v4Sans}`}>
          <div className="flex items-center justify-between">
            <Image
              src="/aci-infotech-logo.png"
              alt="ACI Infotech"
              width={150}
              height={42}
              className="h-10 w-auto brightness-0 invert"
            />
            <button onClick={() => setMenu(false)} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center">
              <X size={22} className="text-white" />
            </button>
          </div>
          <div className="mt-14 flex flex-col gap-7">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="text-3xl font-semibold capitalize tracking-wide text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            onClick={() => setMenu(false)}
            className="mt-auto inline-flex items-center gap-2 text-xl font-semibold capitalize tracking-wide text-[#60A5FA]"
          >
            Start a project
            <ArrowUpRight size={22} />
          </Link>
        </div>
      ) : null}
    </>
  );
}
