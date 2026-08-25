import { Plus } from 'lucide-react';
import { HOME_FAQ } from '../v4/hero/home-faq-data';

/**
 * v5 homepage FAQ: the v4 AEO beat restyled for the dark page. Still
 * server-rendered native <details>/<summary> so every answer ships in
 * the initial HTML; the matching FAQPage JSON-LD is emitted by the
 * page from the same data module.
 */
export default function V5HomeFaq({ headingClass }: { headingClass: string }) {
  return (
    <section id="faq" className="border-t border-white/[0.08] bg-[#07080d] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#60A5FA]">/ Questions</p>
            <h2
              className={`text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[56px] ${headingClass}`}
              style={{ lineHeight: 1.06 }}
            >
              Answers before <span className="text-[#60A5FA]">the first&nbsp;call.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
              The questions we hear most, answered straight. Anything else belongs in a
              conversation.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {HOME_FAQ.map((item, i) => (
                <details key={item.question} className={`group ${i > 0 ? 'border-t border-white/10' : ''}`}>
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold text-white transition-colors hover:bg-white/[0.04] md:p-6 md:text-lg [&::-webkit-details-marker]:hidden ${headingClass}`}
                  >
                    {item.question}
                    <Plus size={18} aria-hidden="true" className="shrink-0 text-[#60A5FA] transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-white/65 md:px-6 md:pb-6 md:text-base">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
