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
      .select('id, slug, title, description, cover_image, file_url, category')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ whitepaper: null });
    }

    return NextResponse.json({ whitepaper: data });
  } catch (error) {
    console.error('Fetch whitepaper error:', error);
    return NextResponse.json({ whitepaper: null });
  }
}
