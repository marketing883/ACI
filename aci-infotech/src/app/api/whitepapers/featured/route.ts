import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch the latest featured whitepaper from database
    const { data, error } = await supabase
      .from('whitepapers')
      .select('id, slug, title, description, cover_image, file_url')
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Return null for development without database
      return NextResponse.json({ whitepaper: null });
    }

    return NextResponse.json({ whitepaper: data });
  } catch (error) {
    console.error('Fetch featured whitepaper error:', error);
    return NextResponse.json({ whitepaper: null });
  }
}
