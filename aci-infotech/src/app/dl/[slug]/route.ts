/**
 * GET /dl/<slug>?k=<token>&e=<recipient email, optional>
 *
 * Streams a campaign ebook to anyone holding a valid signed link. See
 * src/lib/ebook.ts for why the file is stored encrypted and how the
 * token works. `e` is appended by the campaign tool's merge tag; it is
 * logged for attribution and is only enforced when the token was
 * minted bound to a recipient.
 *
 * Failure modes are deliberately quiet: a bad or expired link gets a
 * short HTML page pointing at /contact, not a stack of detail about
 * which check failed. The reason goes to the server log instead.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse, type NextRequest } from 'next/server';
import { EBOOKS, decryptEbook, getSecret, isEbookSlug, verifyToken } from '@/lib/ebook';

export const dynamic = 'force-dynamic';

function deniedPage(status: number) {
  const html = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Link expired | ACI Infotech</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:32rem;margin:6rem auto;padding:0 1.5rem;color:#111}a{color:#1D4ED8}</style>
<h1 style="font-size:1.4rem">This download link is no longer valid.</h1>
<p>It may have expired, or the address was copied incompletely. If you would like a copy of the ebook, <a href="/contact">get in touch</a> and we will send you a fresh link.</p>`;
  return new NextResponse(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!isEbookSlug(slug)) return deniedPage(404);

  const secret = getSecret();
  if (!secret) {
    console.error('[ebook] EBOOK_SECRET is not set; refusing to serve', slug);
    return deniedPage(503);
  }

  const url = req.nextUrl;
  const token = url.searchParams.get('k') ?? '';
  // Mail tools that merge an address into a query string do not always
  // encode it, and a `+` in a local part arrives here as a space.
  const email = (url.searchParams.get('e') ?? '').replace(/ /g, '+').trim() || null;

  const verdict = verifyToken(token, slug, email, secret);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!verdict.ok) {
    console.warn(`[ebook] denied slug=${slug} reason=${verdict.reason} e=${email ?? '-'} ip=${ip}`);
    return deniedPage(403);
  }

  const meta = EBOOKS[slug];
  const blobPath = path.join(process.cwd(), 'private', 'ebooks', meta.file);
  let pdf: Buffer;
  try {
    pdf = decryptEbook(await readFile(blobPath), slug, secret);
  } catch (err) {
    console.error('[ebook] could not read or decrypt', meta.file, err);
    return deniedPage(500);
  }

  console.info(`[ebook] served slug=${slug} campaign=${verdict.payload.c} e=${email ?? '-'} ip=${ip}`);
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-length': String(pdf.length),
      'content-disposition': `attachment; filename="${meta.download}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
