'use client';

import Link from 'next/link';
import Image from 'next/image';

const LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blogs' },
  { label: 'About', href: '/about' },
];

// Persistent across both slides, so it doesn't morph — it just stays.
export default function AciNav() {
  return (
    <div className="relative z-30 px-6 pt-6">
      <div className="liquid-glass mx-auto flex max-w-5xl items-center justify-between rounded-full px-5 py-2.5">
        <Link href="/" aria-label="ACI Infotech home" className="flex items-center gap-2">
          <Image src="/aci-infotech-logo-white.png" alt="ACI Infotech" width={110} height={30} priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          Start a project
        </Link>
      </div>
    </div>
  );
}
