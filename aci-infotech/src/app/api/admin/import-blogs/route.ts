import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { downloadAndUploadImage, generateSafeFileName, isValidImageUrl } from '@/lib/supabase-storage';

// Lazy load supabase credentials to avoid build errors
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  }

  return createClient(supabaseUrl, supabaseServiceKey || '');
}

interface BlogData {
  slug: string;
  title: string;
  description: string;
  image: string;
  publishDate: string;
  author: string;
  tags: string[];
  content: string;
}

interface ImportResult {
  slug: string;
  title: string;
  status: 'success' | 'skipped' | 'error';
  message?: string;
  imageUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogs, options } = body as {
      blogs: BlogData[];
      options?: {
        skipExisting?: boolean;
        importImages?: boolean;
        setPublished?: boolean;
      }
    };

    if (!blogs || !Array.isArray(blogs)) {
      return NextResponse.json(
        { error: 'Invalid request: blogs array required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const skipExisting = options?.skipExisting ?? true;
    const importImages = options?.importImages ?? true;
    const setPublished = options?.setPublished ?? true;

    const results: ImportResult[] = [];
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Get existing slugs
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('slug');

    const existingSlugs = new Set(existingPosts?.map(p => p.slug) || []);

    for (const blog of blogs) {
      try {
        // Check if already exists
        if (existingSlugs.has(blog.slug)) {
          if (skipExisting) {
            results.push({
              slug: blog.slug,
              title: blog.title,
              status: 'skipped',
              message: 'Already exists'
            });
            skippedCount++;
            continue;
          }
        }

        // Handle image
        let featuredImageUrl = blog.image || null;
        if (importImages && blog.image) {
          // Validate that the URL is actually an image URL before attempting download
          if (isValidImageUrl(blog.image)) {
            const safeFileName = `${generateSafeFileName(blog.slug)}`;
            const uploadResult = await downloadAndUploadImage(
              blog.image,
              'blog-images',
              safeFileName
            );

            if (uploadResult.success && uploadResult.url) {
              featuredImageUrl = uploadResult.url;
            }
            // If upload fails, keep original URL as fallback
          } else {
            // Non-image URL (like Zoom links) - set to null instead of keeping invalid URL
            console.log(`Skipping non-image URL for ${blog.slug}: ${blog.image}`);
            featuredImageUrl = null;
          }
        }

        // Parse and format the publish date
        const publishDate = blog.publishDate ? new Date(blog.publishDate) : new Date();

        // Calculate read time (rough estimate: 200 words per minute)
        const wordCount = blog.content
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .split(/\s+/)
          .filter(Boolean).length;
        const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

        // Prepare blog post data - using both column names for compatibility
        const blogPost = {
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.description?.trim() || null,
          content: blog.content,
          featured_image: featuredImageUrl,
          featured_image_url: featuredImageUrl, // Both for compatibility
          featured_image_alt: blog.title,
          author_name: blog.author || 'ACI Infotech',
          category: blog.tags?.[0] || 'Insights', // Use first tag as category
          tags: blog.tags?.length > 0 ? blog.tags : null,
          published_at: publishDate.toISOString(),
          status: setPublished ? 'published' : 'draft',
          is_published: setPublished,
          read_time_minutes: readTimeMinutes,
          view_count: 0,
          ai_generated: false,
        };

        // Insert or update
        if (existingSlugs.has(blog.slug)) {
          // Update existing
          const { error } = await supabase
            .from('blog_posts')
            .update(blogPost)
            .eq('slug', blog.slug);

          if (error) throw error;

          results.push({
            slug: blog.slug,
            title: blog.title,
            status: 'success',
            message: 'Updated',
            imageUrl: featuredImageUrl ?? undefined
          });
        } else {
          // Insert new
          const { error } = await supabase
            .from('blog_posts')
            .insert(blogPost);

          if (error) throw error;

          results.push({
            slug: blog.slug,
            title: blog.title,
            status: 'success',
            message: 'Imported',
            imageUrl: featuredImageUrl ?? undefined
          });
        }

        successCount++;
      } catch (error) {
        results.push({
          slug: blog.slug,
          title: blog.title,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: blogs.length,
        success: successCount,
        skipped: skippedCount,
        errors: errorCount
      },
      results
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch blogs from external URL
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      count: Array.isArray(data) ? data.length : 0,
      blogs: data
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
