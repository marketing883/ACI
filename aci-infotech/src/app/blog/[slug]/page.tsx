'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, Share2, Linkedin, Twitter, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  author_name: string;
  author_title?: string;
  author_bio?: string;
  author_image_url?: string;
  author_linkedin?: string;
  category?: string;
  tags?: string[];
  featured_image_url?: string;
  read_time_minutes?: number;
  published_at?: string;
  created_at?: string;
  seo_title?: string;
  seo_description?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/blogs?slug=${encodeURIComponent(slug)}`);
        const result = await response.json();

        if (result.error) {
          setError(result.error);
          setPost(null);
        } else if (result.post) {
          setPost(result.post);
        } else {
          setError('Article not found');
          setPost(null);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load article');
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen">
        <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading article...</p>
          </div>
        </section>
      </main>
    );
  }

  // Error/not found state
  if (error || !post) {
    return (
      <main className="min-h-screen">
        <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[var(--aci-primary-light)] font-medium mb-4">Blog</p>
            <h1 className="text-4xl font-bold text-white mb-6">Article Not Found</h1>
            <p className="text-xl text-gray-400 mb-8">
              {error || "The article you're looking for doesn't exist or has been removed."}
            </p>
            <Button href="/blog" variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const readTime = post.read_time_minutes ? `${post.read_time_minutes} min read` : '5 min read';
  const dateStr = post.published_at || post.created_at || new Date().toISOString();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[var(--aci-secondary)] pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Category & Meta */}
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
          {post.excerpt && (
            <p className="text-xl text-gray-400 mb-8">
              {post.excerpt}
            </p>
          )}

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
              <div className="w-14 h-14 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {post.author_name?.charAt(0) || 'A'}
              </div>
            )}
            <div>
              <div className="font-semibold text-white">{post.author_name}</div>
              {post.author_title && (
                <div className="text-gray-400 text-sm">{post.author_title}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative w-full h-[400px] md:h-[500px] -mt-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="relative h-full rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Prose content */}
          <div className="prose prose-lg max-w-none prose-headings:text-[var(--aci-secondary)] prose-a:text-[var(--aci-primary)] prose-strong:text-[var(--aci-secondary)]">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-12 mb-6 text-[var(--aci-secondary)]">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-10 mb-4 text-[var(--aci-secondary)]">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-3 text-[var(--aci-secondary)]">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--aci-primary)] pl-4 italic text-gray-600 my-6">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-[var(--aci-primary)]">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-[var(--aci-primary)] hover:underline">
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-8 border-gray-200" />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-[var(--aci-secondary)] mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 font-medium">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Share this article:</span>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[var(--aci-primary)] hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[var(--aci-primary)] hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-[var(--aci-primary)] hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
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
                <div className="w-20 h-20 bg-[var(--aci-primary)] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {post.author_name?.charAt(0) || 'A'}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-[var(--aci-secondary)] mb-1">
                  About {post.author_name}
                </h3>
                {post.author_title && (
                  <p className="text-[var(--aci-primary)] font-medium mb-3">{post.author_title}</p>
                )}
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

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Put These Insights Into Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team of experts can help you implement these strategies at your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact?reason=architecture-call" variant="secondary" size="lg">
              Schedule Architecture Call
            </Button>
            <Button href="/blog" variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Read More Articles
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
