import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const status: Record<string, unknown> = {
    env: {
      hasUrl: !!url,
      hasServiceKey: !!serviceKey,
      hasAnonKey: !!anonKey,
      urlPrefix: url ? url.substring(0, 30) + '...' : null,
    },
    tables: {},
    errors: [],
  };

  if (!url || !serviceKey) {
    status.mode = 'demo';
    status.message = 'Missing SUPABASE_SERVICE_ROLE_KEY - running in demo mode';
    return NextResponse.json(status);
  }

  try {
    const supabase = createClient(url, serviceKey);

    // Check whitepapers table
    const { data: whitepapers, error: wpError, count: wpCount } = await supabase
      .from('whitepapers')
      .select('id, slug, title, category', { count: 'exact' })
      .limit(5);

    if (wpError) {
      (status.errors as string[]).push(`Whitepapers: ${wpError.message}`);
      status.tables = { ...status.tables as Record<string, unknown>, whitepapers: { error: wpError.message } };
    } else {
      status.tables = {
        ...status.tables as Record<string, unknown>,
        whitepapers: {
          totalCount: wpCount,
          sample: whitepapers?.map(w => ({ id: w.id, slug: w.slug, title: w.title?.substring(0, 40) })),
        },
      };
    }

    // Check case_studies table
    const { data: caseStudies, error: csError, count: csCount } = await supabase
      .from('case_studies')
      .select('id, slug, title, client_name, status', { count: 'exact' })
      .limit(10);

    if (csError) {
      (status.errors as string[]).push(`Case Studies: ${csError.message}`);
      status.tables = { ...status.tables as Record<string, unknown>, case_studies: { error: csError.message } };
    } else {
      // Count by status
      const publishedCount = caseStudies?.filter(cs => cs.status === 'published').length || 0;
      const draftCount = caseStudies?.filter(cs => cs.status === 'draft').length || 0;
      const otherCount = (caseStudies?.length || 0) - publishedCount - draftCount;

      status.tables = {
        ...status.tables as Record<string, unknown>,
        case_studies: {
          totalCount: csCount,
          byStatus: { published: publishedCount, draft: draftCount, other: otherCount },
          sample: caseStudies?.map(cs => ({
            id: cs.id,
            slug: cs.slug,
            title: cs.title?.substring(0, 30),
            client: cs.client_name,
            status: cs.status,
          })),
        },
      };
    }

    // Check blog_posts table
    const { data: blogPosts, error: blogError, count: blogCount } = await supabase
      .from('blog_posts')
      .select('id, slug, title, status', { count: 'exact' })
      .limit(5);

    if (blogError) {
      (status.errors as string[]).push(`Blog Posts: ${blogError.message}`);
      status.tables = { ...status.tables as Record<string, unknown>, blog_posts: { error: blogError.message } };
    } else {
      status.tables = {
        ...status.tables as Record<string, unknown>,
        blog_posts: {
          totalCount: blogCount,
          sample: blogPosts?.map(b => ({ id: b.id, slug: b.slug, status: b.status })),
        },
      };
    }

    status.mode = 'production';
    status.message = 'Supabase connected successfully';

  } catch (error) {
    status.mode = 'error';
    status.message = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(status, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
