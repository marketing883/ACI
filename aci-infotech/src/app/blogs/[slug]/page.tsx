import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag, Linkedin } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/content/blog';
import { getClusterPosts, getRecentPosts } from '@/lib/content/blog-cluster';
import ArticleBody from './ArticleBody';
import BlogFaqs from './BlogFaqs';
import ShareButtons from './ShareButtons';

export const revalidate = 60;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const selfCanonical = `https://aciinfotech.com/blogs/${slug}`;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { alternates: { canonical: selfCanonical } };

  const rawTitle = post.seo_title || post.title;
  const title = rawTitle.includes('ACI Infotech') ? rawTitle : `${rawTitle} | ACI Infotech`;
  const description = post.seo_description || post.excerpt || undefined;
  const canonical = post.canonical_url || selfCanonical;
  const image = post.og_image_url || post.featured_image_url || undefined;

  return {
    title: { absolute: title },
    description: description ?? undefined,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description: description ?? undefined,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
      publishedTime: post.published_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
  const dateStr = post.published_at || post.created_at || new Date().toISOString();
  const url = `https://aciinfotech.com/blogs/${slug}`;
  const ogImage = post.featured_image_url || post.og_image_url || undefined;

  // Related articles: keyword-match on this post's category + tags, then
  // top up with the most recent OTHER posts so every article always links
  // to siblings (server-rendered anchors -> no crawl dead-ends).
  const relatedKeywords = [post.category, ...(post.tags ?? [])].filter(
    (k): k is string => Boolean(k && k.trim()),
  );
  let related = relatedKeywords.length
    ? await getClusterPosts(relatedKeywords, 6, slug)
    : [];
  if (related.length < 3) {
    const seen = new Set(related.map((r) => r.slug));
    const recent = await getRecentPosts(6, slug);
    related = [...related, ...recent.filter((r) => !seen.has(r.slug))].slice(0, 6);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.seo_title || post.title,
        ...(post.seo_description || post.excerpt
          ? { description: post.seo_description || post.excerpt }
          : {}),
        ...(ogImage ? { image: [ogImage] } : {}),
        datePublished: dateStr,
        dateModified: post.updated_at || dateStr,
        author: { '@type': 'Person', name: post.author_name || 'ACI Infotech' },
        publisher: {
          '@type': 'Organization',
          name: 'ACI Infotech',
          logo: { '@type': 'ImageObject', url: 'https://aciinfotech.com/brand/favicon-192.png' },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        ...(post.category ? { articleSection: post.category } : {}),
        ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://aciinfotech.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://aciinfotech.com/blogs' },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      ...(post.faqs?.length
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: post.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.category && (
              <span className="px-3 py-1 bg-[var(--aci-primary)] text-white text-sm font-medium rounded">
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(dateStr)}
            </span>
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && <p className="text-xl text-gray-400 mb-8">{post.excerpt}</p>}

          {/* Author */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-700">
            {post.author_image_url ? (
              <Image
                src={post.author_image_url}
                alt={post.author_name}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <Image src="/favicon.ico" alt={post.author_name || 'ACI Team'} width={40} height={40} className="object-contain" />
              </div>
            )}
            <div>
              <div className="font-semibold text-white">{post.author_name}</div>
              {post.author_title && <div className="text-gray-400 text-sm">{post.author_title}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative w-full h-[400px] md:h-[500px] -mt-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="relative h-full rounded-xl overflow-hidden shadow-2xl">
              <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" priority />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleBody content={post.content} contentFormat={post.content_format} />

          {post.faqs && post.faqs.length > 0 && <BlogFaqs faqs={post.faqs} />}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ShareButtons title={post.title} />
        </div>
      </article>

      {/* Author Bio */}
      {post.author_bio && (
        <section className="py-12 bg-gray-50 border-y">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6 items-start">
              {post.author_image_url ? (
                <Image
                  src={post.author_image_url}
                  alt={post.author_name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                  <Image src="/favicon.ico" alt={post.author_name || 'ACI Team'} width={56} height={56} className="object-contain" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-1">About {post.author_name}</h3>
                {post.author_title && <p className="text-[var(--aci-primary)] font-medium mb-3">{post.author_title}</p>}
                <p className="text-gray-600">{post.author_bio}</p>
                {post.author_linkedin && (
                  <a
                    href={post.author_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--aci-primary)] font-medium mt-4 hover:underline"
                  >
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related articles — server-rendered internal links so every post
          links to siblings (crawlable, kills the orphan problem). */}
      {related.length > 0 && (
        <section className="py-16 bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Related articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blogs/${r.slug}`}
                  className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video relative">
                    {r.featuredImage ? (
                      <Image src={r.featuredImage} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                  </div>
                  <div className="p-5">
                    {r.category && <span className="text-xs font-medium text-[var(--aci-primary)]">{r.category}</span>}
                    <h3 className="text-base font-bold text-[var(--aci-secondary)] mt-1 line-clamp-2 group-hover:text-[var(--aci-primary)] transition-colors">{r.title}</h3>
                    {r.excerpt && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Put These Insights Into Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team can help you implement these strategies at your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?reason=architecture-call"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--aci-primary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Schedule Architecture Call
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/50 hover:bg-white/10 transition-colors"
            >
              Read More Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
