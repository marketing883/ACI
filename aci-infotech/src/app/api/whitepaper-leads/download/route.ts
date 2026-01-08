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
    const { data, error } = await supabase
      .from('whitepaper_leads')
      .update({ token_used: true, downloaded_at: new Date().toISOString() })
      .eq('download_token', token)
      .eq('token_used', false)
      .select('id')
      .single();

    if (error && !error.message?.includes('relation')) {
      console.error('Token update error:', error);
    }

    // Generate download URL
    // In production, this would be a signed URL from cloud storage
    // For now, return the public path
    const downloadUrl = `/whitepapers/pdfs/${whitepaperSlug}.pdf`;

    return NextResponse.json({
      success: true,
      downloadUrl,
      tokenUsed: !!data
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
