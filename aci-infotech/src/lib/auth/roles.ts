/**
 * Admin role-based access control.
 *
 * Single source of truth for which paths each role can reach. Both the
 * Edge middleware (page + API gating) and the admin layout (sidebar
 * filtering) read from this file, so the UI never offers a link the
 * server would refuse — and the server never refuses one the UI shows.
 *
 * Roles live in Supabase's `auth.users.app_metadata.role` JSONB field.
 * `app_metadata` is only writable by the service role, so a malicious
 * user cannot promote themselves by editing their own profile. Users
 * predating this feature have no role set and default to `admin` for
 * backwards compatibility — explicit demotion is an opt-in via SQL or
 * the Supabase dashboard.
 *
 * Adding a new role:
 *   1. Add it to the `Role` union below.
 *   2. Add a prefix list and update `canAccessPath`.
 *   3. Add a default landing in `defaultLandingFor`.
 */

// Public pages historically fetch from /api/admin/* read endpoints
// (the blogs list/detail, case-studies list, whitepapers list). The
// clean fix is to move those reads to dedicated public routes under
// /api/<resource>; until that refactor lands, this allowlist lets
// unauthenticated GET requests through on the specific endpoints
// the public site already depends on. WRITES on these paths still
// require auth + role — the carve-out is read-only.
//
// When you add a public-read endpoint here, make sure the underlying
// handler only ever returns published rows (or filters appropriately
// on slug) — anything else risks leaking drafts.
const PUBLIC_READ_ADMIN_PATHS = [
  '/api/admin/blogs',
  '/api/admin/case-studies',
  '/api/admin/whitepapers',
] as const;

export function isPublicReadOnAdminApi(pathname: string, method: string): boolean {
  if (method !== 'GET') return false;
  return PUBLIC_READ_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
}

export type Role = 'admin' | 'hr';

export const DEFAULT_ROLE: Role = 'admin';

export interface UserWithRole {
  // Supabase types `app_metadata` as a Record-like UserAppMetadata
  // (`{ provider?: string; providers?: string[]; [key: string]: unknown }`).
  // Match that shape so we can pass a plain `User` from @supabase/supabase-js
  // straight in without ceremony.
  app_metadata?: { [key: string]: unknown } | null;
}

export function roleForUser(user: UserWithRole | null | undefined): Role {
  const raw = user?.app_metadata?.role;
  if (raw === 'hr') return 'hr';
  if (raw === 'admin') return 'admin';
  return DEFAULT_ROLE;
}

// Path prefixes accessible to the HR role. A user lands here if they
// are explicitly tagged `app_metadata.role = 'hr'`. Listed once;
// `canAccessPath` matches both exact equality and prefix-with-/.
const HR_ALLOWED_PREFIXES = [
  '/admin/jobs',
  '/admin/job-applications',
  '/api/admin/jobs',
  '/api/admin/job-applications',
] as const;

export function canAccessPath(role: Role, pathname: string): boolean {
  if (role === 'admin') return true;
  if (role === 'hr') {
    return HR_ALLOWED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(p + '/'),
    );
  }
  return false;
}

// Where a role lands when it hits a forbidden /admin route or finishes
// login. HR goes straight to the jobs list — the root dashboard shows
// lead and revenue widgets they have no business seeing.
export function defaultLandingFor(role: Role): string {
  if (role === 'hr') return '/admin/jobs';
  return '/admin';
}

// Filter a sidebar nav tree for a role. Top-level items with an `href`
// are kept iff the role can access them. Section items with `children`
// are kept iff at least one child is allowed; the section itself is
// pruned to only the allowed children. Order is preserved.
export function navItemsForRole<
  T extends
    | { href: string; children?: undefined }
    | { children: ReadonlyArray<{ href: string }> },
>(items: ReadonlyArray<T>, role: Role): T[] {
  if (role === 'admin') return [...items];
  return items.flatMap((item): T[] => {
    if ('href' in item && item.href !== undefined) {
      return canAccessPath(role, item.href) ? [item] : [];
    }
    if ('children' in item && item.children) {
      const filtered = item.children.filter((c) => canAccessPath(role, c.href));
      if (filtered.length === 0) return [];
      return [{ ...item, children: filtered } as T];
    }
    return [];
  });
}
