'use client';

import Link from 'next/link';
import type { CiteSourceArgs } from '@/lib/copilot/tools';

const HREFS: Record<CiteSourceArgs['sourceType'], (slug: string) => string> = {
  lp: (s) => `/lp/${s}`,
  service: (s) => `/services/${s}`,
  industry: (s) => `/industries/${s}`,
  platform: (s) => `/platforms/${s}`,
  case_study: (s) => `/case-studies/${s}`,
  blog: (s) => `/blogs/${s}`,
  whitepaper: (s) => `/whitepapers/${s}`,
  playbook: (s) => `/playbooks/${s}`,
};

const KICKERS: Record<CiteSourceArgs['sourceType'], string> = {
  lp: 'Landing page',
  service: 'Service',
  industry: 'Industry',
  platform: 'Platform',
  case_study: 'Case',
  blog: 'Blog',
  whitepaper: 'Whitepaper',
  playbook: 'Playbook',
};

export interface CitationPillProps {
  citation: CiteSourceArgs;
}

export default function CitationPill({ citation }: CitationPillProps) {
  const href = HREFS[citation.sourceType](citation.slug);
  const label = citation.title ?? citation.slug;
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--aci-secondary,#0A1628)] transition hover:border-[color:var(--aci-primary,#0052CC)] hover:text-[color:var(--aci-primary,#0052CC)]"
    >
      <span className="text-[10px] uppercase tracking-[0.1em] text-gray-500">
        {KICKERS[citation.sourceType]}
      </span>
      <span>{label}</span>
    </Link>
  );
}
