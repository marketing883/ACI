import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Helper to get the actual host from forwarded headers or request
function getPublicUrl(request: NextRequest, pathname: string, searchParams?: URLSearchParams): string {
  // Try forwarded headers first (set by nginx/reverse proxy)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';

  // Fall back to host header
  const host = forwardedHost || request.headers.get('host') || 'aciinfotech.com';

  // Build the URL - use localhost in development, public host in production
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const publicHost = isLocalhost ? host : host;
  const protocol = isLocalhost ? 'http' : (forwardedProto === 'http' ? 'http' : 'https');

  let url = `${protocol}://${publicHost}${pathname}`;
  if (searchParams && searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }
  return url;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Check if Supabase is configured - if not, allow all requests (demo mode)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Demo mode - skip auth checks
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname === '/admin/login';
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Skip middleware for API routes and public pages
  if (isApiRoute || !isAdminPage) {
    return supabaseResponse;
  }

  // If user is not logged in and trying to access admin pages (except login)
  if (!user && isAdminPage && !isAuthPage) {
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', request.nextUrl.pathname);
    const redirectUrl = getPublicUrl(request, '/admin/login', searchParams);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and trying to access login page, redirect to admin
  if (user && isAuthPage) {
    const adminUrl = getPublicUrl(request, '/admin');
    return NextResponse.redirect(adminUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
