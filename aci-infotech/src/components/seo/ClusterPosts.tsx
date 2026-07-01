import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getClusterPosts } from '@/lib/content/blog-cluster';

/**
 * "From the blog" cluster hub: links a pillar page to its supporting
 * published articles (matched by topic keywords). This is an async Server
 * Component; it renders nothing when there are no matching posts, so a
 * pillar with no relevant articles yet simply omits the section.
 */
export default async function ClusterPosts({
  keywords,
  heading = 'From the blog',
  eyebrow,
  limit = 3,
}: {
  keywords: string[];
  heading?: string;
  eyebrow?: string;
  limit?: number;
}) {
  const posts = await getClusterPosts(keywords, limit);
  if (!posts.length) return null;

  return (
    <section className="py-14 md:py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <p className="text-[var(--aci-primary)] font-medium mb-2 tracking-wide uppercase text-sm">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-6">
          {heading}
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blogs/${p.slug}`}
              className="group flex flex-col p-6 bg-white border border-gray-200 rounded-xl hover:border-[var(--aci-primary)]/40 hover:shadow-sm transition-all"
            >
              {p.category && (
                <span className="text-xs font-medium text-[var(--aci-primary)] uppercase tracking-wide mb-2">
                  {p.category}
                </span>
              )}
              <h3 className="font-bold text-[var(--aci-secondary)] leading-snug mb-2 group-hover:text-[var(--aci-primary)] transition-colors">
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{p.excerpt}</p>
              )}
              <span className="inline-flex items-center gap-1 text-[var(--aci-primary)] text-sm font-medium mt-4">
                Read <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
