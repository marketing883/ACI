import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabase
      .from('whitepapers')
      .select('id, slug, title, excerpt, description, highlights, cover_image, file_url, category, tags, published_at')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ whitepaper: null });
    }

    // Transform data for the detail page - map highlights to key_takeaways for compatibility
    const whitepaper = data ? {
      ...data,
      // Use highlights as key_takeaways if key_takeaways doesn't exist
      key_takeaways: data.highlights || [],
      // Also expose excerpt for the card display
    } : null;

    return NextResponse.json({ whitepaper });
  } catch (error) {
    console.error('Fetch whitepaper error:', error);
    return NextResponse.json({ whitepaper: null });
  }
}
