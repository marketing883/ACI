import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface RelatedLink {
  label: string;
  href: string;
  note?: string;
}

/**
 * Server-rendered band of internal links to adjacent service, platform,
 * and industry pages. This is the exact-match internal linking the SEO
 * audit called for: it wires the pillars and industries into one topical
 * cluster instead of leaving each page an island. Pure links in raw HTML,
 * good for both crawlers and readers.
 */
export default function RelatedLinks({
  items,
  heading = 'Explore related capabilities',
  eyebrow,
}: {
  items: RelatedLink[];
  heading?: string;
  eyebrow?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="py-14 md:py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="text-[var(--aci-primary)] font-medium mb-2 tracking-wide uppercase text-sm">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-6">
          {heading}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="group flex items-start justify-between gap-3 p-5 bg-white border border-gray-200 rounded-xl hover:border-[var(--aci-primary)]/40 hover:shadow-sm transition-all"
            >
              <div>
                <div className="font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors">
                  {it.label}
                </div>
                {it.note && <div className="text-sm text-gray-600 mt-1">{it.note}</div>}
              </div>
              <ArrowUpRight className="w-5 h-5 text-[var(--aci-primary)] flex-shrink-0 mt-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
