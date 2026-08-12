import { NextResponse } from 'next/server';

/**
 * The response a CMS write returns when the server has no working
 * service-role key.
 *
 * These routes used to answer a missing SUPABASE_SERVICE_ROLE_KEY with
 * HTTP 200 and a mock row carrying `demo: true`. Every caller in the admin
 * only checks `response.ok`, so a save that wrote nothing looked exactly
 * like a save that worked: the editor redirected back to the list, and the
 * post simply was not there. Nobody was told, so the missing key read as
 * "the CMS is broken" rather than "the server cannot reach the database".
 *
 * A write that did not write is a failure, so it gets a failure status.
 * 503 rather than 500: the request was fine, the backing store is not
 * reachable, and it will work once the key is set.
 *
 * Reads keep their `demo: true` behaviour - the public marketing site
 * depends on those endpoints degrading to an empty list rather than
 * throwing.
 */
export function cmsWriteUnavailable(resource: string): NextResponse {
  return NextResponse.json(
    {
      error:
        `${resource} was not saved. The server has no SUPABASE_SERVICE_ROLE_KEY, ` +
        'so it cannot write to the database. Set it in .env.local on the server ' +
        'and restart, then check /api/admin/health.',
      demo: true,
      persisted: false,
    },
    { status: 503 },
  );
}
