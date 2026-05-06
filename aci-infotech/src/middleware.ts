import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { canAccessPath, defaultLandingFor, roleForUser } from '@/lib/auth/roles';

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

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === '/admin/login';
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isPublicApi = pathname.startsWith('/api') && !isAdminApi;

  // Public API routes (e.g. /api/jobs/apply, /api/contact) handle their
  // own auth — middleware only gates the admin tree.
  if (isPublicApi) {
    return supabaseResponse;
  }

  // Admin API: must be authenticated AND the user's role must permit
  // the path. Returns JSON, not a redirect — these endpoints are
  // called by fetch() from admin pages, not navigated to.
  if (isAdminApi) {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!canAccessPath(roleForUser(user), pathname)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return supabaseResponse;
  }

  // Non-admin pages — public site, no gate.
  if (!isAdminPage) {
    return supabaseResponse;
  }

  // If user is not logged in and trying to access admin pages (except login)
  if (!user && !isAuthPage) {
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', pathname);
    const redirectUrl = getPublicUrl(request, '/admin/login', searchParams);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and trying to access login page, redirect to
  // their role's default landing (HR users go to /admin/jobs, full
  // admins to /admin) instead of the unconditional /admin redirect
  // that would just bounce HR back to the forbidden dashboard.
  if (user && isAuthPage) {
    const role = roleForUser(user);
    const landing = getPublicUrl(request, defaultLandingFor(role));
    return NextResponse.redirect(landing);
  }

  // Logged in, on a real admin page — enforce role.
  if (user && !isAuthPage) {
    const role = roleForUser(user);
    if (!canAccessPath(role, pathname)) {
      const landing = getPublicUrl(request, defaultLandingFor(role));
      return NextResponse.redirect(landing);
    }
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
