import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { token, whitepaperSlug } = await request.json();

    if (!token || !whitepaperSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify and mark token as used
    const { data: leadData, error: leadError } = await supabase
      .from('whitepaper_leads')
      .update({ token_used: true, downloaded_at: new Date().toISOString() })
      .eq('download_token', token)
      .eq('token_used', false)
      .select('id')
      .single();

    if (leadError && !leadError.message?.includes('relation')) {
      console.error('Token update error:', leadError);
    }

    // Fetch the actual file_url from whitepapers table
    const { data: whitepaper, error: wpError } = await supabase
      .from('whitepapers')
      .select('file_url, title')
      .eq('slug', whitepaperSlug)
      .single();

    let downloadUrl = `/whitepapers/pdfs/${whitepaperSlug}.pdf`; // Fallback

    if (!wpError && whitepaper?.file_url) {
      downloadUrl = whitepaper.file_url;
    }

    return NextResponse.json({
      success: true,
      downloadUrl,
      title: whitepaper?.title,
      tokenUsed: !!leadData
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
