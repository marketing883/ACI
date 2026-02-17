import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const status: Record<string, unknown> = {
    config: {
      hasUrl: !!url,
      hasAnonKey: !!anonKey,
      hasServiceKey: !!serviceKey,
    },
    auth: {},
  };

  if (!url || !anonKey) {
    status.message = 'Supabase not configured - missing URL or anon key';
    return NextResponse.json(status);
  }

  try {
    // Use service key to list auth users (admin operation)
    if (serviceKey) {
      const supabase = createClient(url, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data: { users }, error } = await supabase.auth.admin.listUsers();

      if (error) {
        status.auth = { error: error.message };
      } else {
        status.auth = {
          userCount: users?.length || 0,
          users: users?.map(u => ({
            email: u.email,
            created: u.created_at,
            lastSignIn: u.last_sign_in_at,
            confirmed: !!u.email_confirmed_at,
          })),
        };
      }
    } else {
      status.auth = { message: 'Cannot list users without service role key' };
    }

    status.message = 'Auth check complete';

  } catch (error) {
    status.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(status, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
