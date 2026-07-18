import { ArrowUpRight } from 'lucide-react';
import { getPublishedBlogPosts } from '@/lib/content/blog';
import { v4Sans, v4Display } from '@/components/v4/fonts';
import BlogListingClient from './BlogListingClient';
import BlogPagination from '@/components/blog/BlogPagination';

// Revalidate so newly published posts surface without a redeploy. The
// canonical for /blogs is set in blogs/layout.tsx.
export const revalidate = 60;

const PAGE_SIZE = 12;

export default async function BlogPage() {
  const { posts, total } = await getPublishedBlogPosts(1, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-12 md:pt-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Blog
          </p>
          <h1
            className={`max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.06 }}
          >
            Engineering notes, written{' '}
            <span style={{ color: '#1D4ED8' }}>from&nbsp;production</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
            Deep dives into data engineering, AI, cloud architecture, and the
            enterprise systems around them, from the people who run them for
            a&nbsp;living.
          </p>
        </div>
      </section>

      {/* Interactive listing, seeded with server-fetched posts so every
          post link is in the initial HTML (crawlable). */}
      <BlogListingClient initialPosts={posts} total={total} pageSize={PAGE_SIZE} />

      {/* Crawlable numbered pagination to the full archive. */}
      <BlogPagination currentPage={1} totalPages={totalPages} basePath="/blogs" />

      {/* Newsletter */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / Newsletter
          </p>
          <h2
            className={`max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.06 }}
          >
            Stay close to <span style={{ color: '#1D4ED8' }}>the&nbsp;work</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-700">
            One email a week on data, AI, and digital transformation. No spam.
            Unsubscribe&nbsp;anytime.
          </p>
          <form className="mt-8 flex max-w-md items-center gap-6 border-b border-gray-300 pb-2 transition-colors focus-within:border-blue-700">
            <input
              type="email"
              placeholder="Work email"
              className="flex-1 border-0 bg-transparent py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
            >
              Subscribe
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
