import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock } from 'lucide-react';
import { getPublishedBlogPosts } from '@/lib/content/blog';
import BlogPagination from '@/components/blog/BlogPagination';

export const revalidate = 60;

const PAGE_SIZE = 12;
const BASE = 'https://aciinfotech.com';

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = parseInt(raw, 10);
  // Page 1 canonically lives at /blogs, not /blogs/page/1.
  return n >= 2 ? n : null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ page: string }> },
): Promise<Metadata> {
  const { page } = await params;
  const n = parsePage(page);
  if (!n) return { title: 'Blog', alternates: { canonical: `${BASE}/blogs` } };
  return {
    title: `Enterprise Technology Blog — Page ${n}`,
    description:
      'More insights on data engineering, AI/ML, cloud architecture, and enterprise technology from the ACI Infotech team.',
    alternates: { canonical: `${BASE}/blogs/page/${n}` },
    robots: { index: true, follow: true },
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function BlogArchivePage(
  { params }: { params: Promise<{ page: string }> },
) {
  const { page } = await params;
  const n = parsePage(page);
  if (!n) notFound();

  const { posts, total } = await getPublishedBlogPosts(n, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Out-of-range page (or empty slice) -> 404, no crawl trap / soft-404.
  if (n > totalPages || posts.length === 0) notFound();

  return (
    <main className="min-h-screen">
      <section className="bg-[var(--aci-secondary)] pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[var(--aci-primary-light)] font-medium mb-3 tracking-wide uppercase">
            Insights &amp; Thought Leadership
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Enterprise Technology Blog
          </h1>
          <p className="text-gray-400 mt-3">Page {n} of {totalPages}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
              const dateStr = post.published_at || post.created_at || new Date().toISOString();
              return (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="aspect-video relative">
                    {post.featured_image_url ? (
                      <Image src={post.featured_image_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-xs font-medium rounded">{post.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(dateStr)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{readTime}</span>
                    </div>
                    <h2 className="text-lg font-bold text-[var(--aci-secondary)] mb-2 group-hover:text-[var(--aci-primary)] transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <BlogPagination currentPage={n} totalPages={totalPages} basePath="/blogs" />
    </main>
  );
}
