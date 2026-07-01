import Button from '@/components/ui/Button';
import { getPublishedCaseStudies } from '@/lib/content/case-study';
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
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Client Success Stories
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              280+ Projects Delivered.
              <br />
              <span className="text-[var(--aci-primary-light)]">Real Results.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Explore how we&apos;ve helped enterprise companies and industry leaders
              solve their most complex data, AI, and technology challenges.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">25+</div>
                <div className="text-gray-400">Enterprise Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">$45M+</div>
                <div className="text-gray-400">Value Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">15+</div>
                <div className="text-gray-400">Industries Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive listing, seeded with server-fetched case studies so
          every case-study link is in the initial HTML (crawlable). */}
      <CaseStudiesClient initialItems={caseStudies} />

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let&apos;s discuss how we can help transform your business with enterprise-grade solutions.
          </p>
          <Button href="/contact?reason=architecture-call" variant="lime" size="lg">
            Discuss Your Project
          </Button>
        </div>
      </section>
    </main>
  );
}
