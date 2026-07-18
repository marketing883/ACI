import { getPublishedCaseStudies } from '@/lib/content/case-study';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Display } from '@/components/v4/fonts';
import CaseStudiesClient from './CaseStudiesClient';

// Server component: fetch published case studies on the server and seed the
// interactive island with them so every `<a href="/case-studies/{slug}">`
// lands in the initial HTML (crawlable). Revalidate so newly published rows
// surface without a redeploy. The canonical for /case-studies is set in
// case-studies/layout.tsx.
export const revalidate = 60;

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Case Studies
          </p>
          <h1
            className={`max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.06 }}
          >
            The work, and <span style={{ color: '#1D4ED8' }}>what it&nbsp;changed</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Enterprise data, AI, and cloud engagements, written up with the
            stack, the timeline, and the numbers the client signed off on. No
            composite&nbsp;stories.
          </p>
        </div>
      </section>

      {/* Facts band */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {[
              { value: '2006', label: 'Founded' },
              { value: '1,200+', label: 'Engineers' },
              { value: '500+', label: 'Large enterprise projects' },
              { value: '11', label: 'Global delivery hubs' },
            ].map((fact) => (
              <div key={fact.label}>
                <p className={`text-4xl font-bold leading-none text-[#1D4ED8] sm:text-5xl ${v4Display}`}>
                  {fact.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive listing, seeded with server-fetched case studies so
          every case-study link is in the initial HTML (crawlable). */}
      <CaseStudiesClient initialItems={caseStudies} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Start your own case study" />
    </main>
  );
}
