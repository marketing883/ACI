import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Linkedin } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/content/blog';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getClusterPosts, getRecentPosts } from '@/lib/content/blog-cluster';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Display, v4Sans } from '@/components/v4/fonts';
import { cardShadow } from '@/components/v4/page/kit';
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
      images: image ? [{ url: image }] : DEFAULT_OG_IMAGES,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
      images: image ? [image] : DEFAULT_TWITTER_IMAGES,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  // Real reading time when the CMS field is empty: ~200 wpm over the
  // body text (tags stripped), clamped so junk content can't show "0".
  const estimatedMinutes = Math.max(
    1,
    Math.round((post.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200),
  );
  const readTime = `${post.read_time_minutes || estimatedMinutes} min read`;
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
        author: {
          '@type': 'Person',
          name: post.author_name || 'ACI Infotech',
          ...(post.author_title ? { jobTitle: post.author_title } : {}),
          ...(post.author_linkedin ? { sameAs: [post.author_linkedin] } : {}),
          worksFor: { '@id': 'https://aciinfotech.com/#organization' },
        },
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
    <main className={`min-h-screen bg-white text-black ${v4Sans}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article header */}
      <header className="bg-white">
        <div className="mx-auto max-w-[840px] px-6 pt-12 md:pt-16">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
          >
            <span className="relative">
              All articles
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / {post.category || 'Insights'}
          </p>
          <h1
            className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{post.excerpt}</p>
          )}

          {/* Meta line */}
          <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-200 pt-6 text-sm text-gray-500">
            <span>{formatDate(dateStr)}</span>
            <span aria-hidden="true" className="text-gray-300">/</span>
            <span>{readTime}</span>
            {post.author_name ? (
              <>
                <span aria-hidden="true" className="text-gray-300">/</span>
                <span>
                  By {post.author_name}
                  {post.author_title ? `, ${post.author_title}` : ''}
                </span>
              </>
            ) : null}
          </p>
        </div>
      </header>

      {/* Featured image */}
      {post.featured_image_url && (
        <div className="mx-auto max-w-[960px] px-6 pt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={post.featured_image_url} alt={post.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Article body */}
      <article className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[720px] px-6">
          <ArticleBody content={post.content} contentFormat={post.content_format} />

          {post.faqs && post.faqs.length > 0 && <BlogFaqs faqs={post.faqs} />}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Tags</p>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {post.tags.map((tag) => (
                  <span key={tag} className="whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </p>
            </div>
          )}

          <ShareButtons title={post.title} />
        </div>
      </article>

      {/* Author card (E-E-A-T) */}
      {post.author_bio && (
        <section className="border-t border-gray-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[720px] px-6">
            <div className={`flex flex-col gap-6 rounded-2xl bg-white p-7 sm:flex-row sm:items-start md:p-8 ${cardShadow}`}>
              {post.author_image_url ? (
                <Image
                  src={post.author_image_url}
                  alt={post.author_name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50">
                  <Image src="/favicon.ico" alt={post.author_name || 'ACI Team'} width={44} height={44} className="object-contain" />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ About the author</p>
                <h3 className={`mt-3 text-xl font-semibold text-black ${v4Display}`}>{post.author_name}</h3>
                {post.author_title && (
                  <p className="mt-1 text-sm font-medium text-gray-500">{post.author_title}</p>
                )}
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{post.author_bio}</p>
                {post.author_linkedin && (
                  <a
                    href={post.author_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                    <span className="relative">
                      Connect on LinkedIn
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </span>
                    <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
        <section className="border-t border-gray-200 bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ Keep reading</p>
            <h2
              className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
              style={{ lineHeight: 1.08 }}
            >
              Related articles
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blogs/${r.slug}`}
                  className={`group flex flex-col overflow-hidden rounded-2xl bg-white transition-shadow duration-300 hover:shadow-[0_6px_18px_rgba(63,74,126,0.1),0_2px_40px_rgba(63,74,126,0.16)] ${cardShadow}`}
                >
                  <div className="relative aspect-video">
                    {r.featuredImage ? (
                      <Image src={r.featuredImage} alt={r.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {r.category && (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">{r.category}</p>
                    )}
                    <h3 className={`mt-2 line-clamp-2 text-lg font-semibold text-black ${v4Display}`}>{r.title}</h3>
                    {r.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{r.excerpt}</p>}
                    <span className="mt-4 flex items-center gap-1 pt-1 text-sm font-semibold text-blue-700">
                      Read the article
                      <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Put These Ideas to Work" href="/contact?reason=architecture-call" />
    </main>
  );
}
