import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Server-rendered FAQ section. Uses native <details>/<summary> so the
 * questions and answers are in the raw HTML (no client JS), which is what
 * makes them readable by search snippets and AI answer engines. Also
 * emits FAQPage JSON-LD built from the same items.
 *
 * Drop it into any page above the CTA:
 *   <FaqBlock items={[{ q: '...', a: '...' }]} />
 */
export default function FaqBlock({
  items,
  heading = 'Frequently asked questions',
  eyebrow,
}: {
  items: FaqItem[];
  heading?: string;
  eyebrow?: string;
}) {
  if (!items?.length) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="text-[var(--aci-primary)] font-medium mb-3 tracking-wide uppercase text-sm">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--aci-secondary)] mb-8">
          {heading}
        </h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <details
              key={i}
              className="group border border-gray-200 rounded-lg bg-white open:shadow-sm"
            >
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-semibold text-[var(--aci-secondary)]">
                <span>{item.q}</span>
                <ChevronDown className="w-5 h-5 text-[var(--aci-primary)] flex-shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 -mt-1 text-gray-700 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
