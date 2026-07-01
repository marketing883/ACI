import Button from '@/components/ui/Button';
import { getPublishedWhitepapers } from '@/lib/content/whitepaper';
import WhitepapersClient from './WhitepapersClient';

// Server component: fetch published whitepapers on the server and seed the
// interactive island with them so every `<a href="/whitepapers/{slug}">`
// lands in the initial HTML (crawlable). Revalidate so newly published rows
// surface without a redeploy. The canonical for /whitepapers is set in
// whitepapers/layout.tsx.
export const revalidate = 60;

export default async function WhitepapersPage() {
  const whitepapers = await getPublishedWhitepapers();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Resource Library
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Whitepapers &amp; Guides
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Deep-dive resources from architects who have deployed these solutions at scale.
              Technical depth without the vendor fluff.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{whitepapers.length}</div>
                <div className="text-gray-400">Whitepapers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">200+</div>
                <div className="text-gray-400">Pages of Content</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">80+</div>
                <div className="text-gray-400">Enterprise Insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive listing, seeded with server-fetched whitepapers so
          every whitepaper link is in the initial HTML (crawlable). */}
      <WhitepapersClient initialItems={whitepapers} />

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Custom Research?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our architects can provide tailored analysis and recommendations for your specific challenges.
          </p>
          <Button href="/contact?reason=architecture-call" variant="lime" size="lg">
            Schedule Architecture Call
          </Button>
        </div>
      </section>
    </main>
  );
}
