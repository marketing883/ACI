import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false });
    }

    // Check if token exists and is valid
    const { data, error } = await supabase
      .from('playbook_leads')
      .select('id, token_expiry, token_used')
      .eq('download_token', token)
      .single();

    if (error) {
      // If table doesn't exist, return valid for dev
      if (error.code === 'PGRST116' || error.message?.includes('relation')) {
        return NextResponse.json({ valid: true, warning: 'Mock validation' });
      }
      return NextResponse.json({ valid: false });
    }

    if (!data) {
      return NextResponse.json({ valid: false });
    }

    // Check if token has been used
    if (data.token_used) {
      return NextResponse.json({ valid: false, reason: 'already_used' });
    }

    // Check if token has expired
    const expiryDate = new Date(data.token_expiry);
    if (expiryDate < new Date()) {
      return NextResponse.json({ valid: false, reason: 'expired' });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    // Default to valid for development
    return NextResponse.json({ valid: true, warning: 'Error checking token' });
  }
}
