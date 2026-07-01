import Button from '@/components/ui/Button';
import { getPublishedBlogPosts } from '@/lib/content/blog';
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
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4 tracking-wide uppercase">
              Insights &amp; Thought Leadership
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enterprise Technology Blog
            </h1>
            <p className="text-xl text-gray-400">
              Deep dives into data engineering, AI/ML, cloud architecture, and enterprise technology trends from our team of practitioners.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive listing, seeded with server-fetched posts so every
          post link is in the initial HTML (crawlable). */}
      <BlogListingClient initialPosts={posts} total={total} pageSize={PAGE_SIZE} />

      {/* Crawlable numbered pagination to the full archive. */}
      <BlogPagination currentPage={1} totalPages={totalPages} basePath="/blogs" />

      {/* Newsletter CTA */}
      <section className="py-20 bg-[var(--aci-secondary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stay Ahead of Enterprise Tech Trends
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join 5,000+ technology leaders who receive our weekly insights on data, AI, and digital transformation.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-[var(--aci-primary)]"
            />
            <Button type="submit" variant="primary" size="lg">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </main>
  );
}
