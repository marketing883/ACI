'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Linkedin, Twitter, Youtube } from 'lucide-react';

const ACCENT = '#1D4ED8';

type FooterLink = { label: string; href: string; external?: boolean; prefetch?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Services',
    links: [
      { label: 'Data Engineering', href: '/services/data-engineering' },
      { label: 'Applied AI & GenAI', href: '/services/applied-ai-ml' },
      { label: 'Cybersecurity', href: '/services/cyber-security' },
      { label: 'Cloud & Infrastructure', href: '/services/cloud-modernization' },
      { label: 'Managed Run & SRE', href: '/services/managed-operations' },
      { label: 'App Development', href: '/services/app-development' },
      { label: 'Quality Engineering', href: '/services/quality-engineering' },
      { label: 'Advisory & Strategy', href: '/services/advisory-strategy' },
      { label: 'GCC & Captive Centers', href: '/services/gcc' },
      { label: 'All services', href: '/services' },
    ],
  },
  {
    title: 'Products & Platforms',
    links: [
      { label: 'ACI Interactive', href: '/services/martech-cdp' },
      { label: 'ArqAI Labs', href: 'https://thearq.ai', external: true },
      { label: 'Databricks', href: '/platforms/databricks' },
      { label: 'Microsoft Azure', href: '/platforms/azure' },
      { label: 'Snowflake', href: '/platforms/snowflake' },
      { label: 'AWS', href: '/platforms/aws' },
      { label: 'Salesforce', href: '/platforms/salesforce' },
      { label: 'SAP', href: '/platforms/sap' },
      { label: 'Microsoft Dynamics 365', href: '/platforms/microsoft-dynamics' },
      { label: 'All platforms', href: '/platforms' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Financial Services', href: '/industries/financial-services' },
      { label: 'Healthcare', href: '/industries/healthcare' },
      { label: 'Retail & Consumer', href: '/industries/retail' },
      { label: 'Manufacturing', href: '/industries/manufacturing' },
      { label: 'Energy & Utilities', href: '/industries/energy' },
      { label: 'Oil & Gas', href: '/industries/oil-gas' },
      { label: 'Hospitality', href: '/industries/hospitality' },
      { label: 'Transportation', href: '/industries/transportation' },
      { label: 'All industries', href: '/industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'News', href: '/news' },
      { label: 'Partners', href: '/partners' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Insights', href: '/blogs' },
      { label: 'Whitepapers', href: '/whitepapers' },
      { label: 'Playbooks', href: '/playbooks' },
    ],
  },
];

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/aciinfotech', Icon: Linkedin },
  { label: 'X', href: 'https://x.com/ACIInfotech', Icon: Twitter },
  { label: 'YouTube', href: 'https://www.youtube.com/@aciinfotech', Icon: Youtube },
];

function FooterAnchor({ link, className }: { link: FooterLink; className?: string }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
        <ArrowUpRight size={12} className="ml-0.5 inline opacity-60" aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link href={link.href} prefetch={link.prefetch} className={className}>
      {link.label}
    </Link>
  );
}

export default function SiteFooter({ headingClass }: { headingClass: string }) {
  return (
    <footer className="relative overflow-hidden bg-[#080a12] text-white">
      {/* top accent hairline */}
      <div aria-hidden="true" className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* Brand */}
          <div>
            <Image src="/aci-infotech-logo-white.png" alt="ACI Infotech" width={150} height={42} className="h-9 w-auto" />
            <p className={`mt-5 max-w-xs text-lg leading-snug text-white/70 ${headingClass}`}>
              Enterprise data and AI, engineered and run in production.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              Start a project
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <div className="mt-8 flex gap-3">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor
                        link={link}
                        className="text-sm text-white/70 transition-colors hover:text-white"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized wordmark flourish. Sized against the container width
            (12 glyphs at ~0.55em average advance) so the trailing "h"
            never clips at any viewport. */}
        <div aria-hidden="true" className="pointer-events-none mt-14 select-none">
          <span
            className={`block whitespace-nowrap font-semibold leading-none tracking-tight text-white/[0.04] ${headingClass}`}
            style={{ fontSize: 'min(15vw, 13rem)' }}
          >
            ACI Infotech
          </span>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© 2026 ACI Infotech. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
