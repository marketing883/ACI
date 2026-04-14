'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, Share2, Linkedin, Twitter, Loader2, ChevronDown, Facebook, Link2, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  content_format?: 'markdown' | 'html';
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Share URL helpers
  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.href;
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(post?.title || '');
    window.open(`https://x.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`${post?.title || ''} - `);
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
            <Button href="/blogs" variant="secondary">
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
            href="/blogs"
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
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/favicon.ico"
                  alt={post.author_name || 'ACI Team'}
                  width={40}
                  height={40}
                  className="object-contain"
                />
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
            {/* Auto-detect HTML content: if content_format is 'html' OR content contains HTML tags */}
            {post.content_format === 'html' || /^<[a-z]|<p>|<div>|<h[1-6]>|<ul>|<ol>|<span/i.test(post.content.trim()) ? (
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="blog-html-content [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-12 [&_h1]:mb-6 [&_h1]:text-[var(--aci-secondary)] [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[var(--aci-secondary)] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[var(--aci-secondary)] [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:text-gray-700 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--aci-primary)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-6 [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-[var(--aci-primary)] [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_a]:text-[var(--aci-primary)] [&_a]:hover:underline [&_hr]:my-8 [&_hr]:border-gray-200"
              />
            ) : (
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
            )}
          </div>

          {/* FAQs - Accordion Style */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {post.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-[var(--aci-secondary)] pr-4">{faq.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-[var(--aci-primary)] flex-shrink-0 transition-transform duration-200 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        openFaqIndex === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="p-5 pt-0 bg-white">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
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
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-600 font-medium">Share this article:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={shareOnLinkedIn}
                  className="p-2.5 bg-gray-100 rounded-full hover:bg-[#0077B5] hover:text-white transition-colors"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="p-2.5 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"
                  title="Share on X (Twitter)"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="p-2.5 bg-gray-100 rounded-full hover:bg-[#1877F2] hover:text-white transition-colors"
                  title="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="p-2.5 bg-gray-100 rounded-full hover:bg-[#25D366] hover:text-white transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`p-2.5 rounded-full transition-colors ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-[var(--aci-primary)] hover:text-white'
                  }`}
                  title={copied ? 'Copied!' : 'Copy link'}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
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
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                  <Image
                    src="/favicon.ico"
                    alt={post.author_name || 'ACI Team'}
                    width={56}
                    height={56}
                    className="object-contain"
                  />
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
            <a
              href="/contact?reason=architecture-call"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--aci-primary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Schedule Architecture Call
            </a>
            <a
              href="/blogs"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/50 hover:bg-white/10 transition-colors"
            >
              Read More Articles
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
