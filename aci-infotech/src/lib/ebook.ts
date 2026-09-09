/**
 * Email-campaign ebook delivery.
 *
 * This is not the website's gated whitepaper flow (form, verify,
 * download). A campaign email links straight to the file; the link has
 * to work on click and not be guessable, and the file must not be
 * fetchable any other way. Two facts shape the design:
 *
 *   - This repository is public. Anything committed in the clear, in
 *     public/ or anywhere else, is one raw.githubusercontent.com URL away.
 *     So the PDF is committed encrypted (AES-256-GCM) and decrypted on
 *     the way out. The repo only ever holds ciphertext.
 *   - The only secret that has to exist outside the repo is one env
 *     var, EBOOK_SECRET. Both the file key and the link-signing key are
 *     derived from it, so there is one value to set on the server and
 *     one value to rotate.
 *
 * A link carries a signed token: slug, campaign id, expiry, and
 * optionally a hash of the recipient's email that binds the link to
 * one person. Campaign tools cannot compute an HMAC per recipient, so a
 * campaign link is minted once and the tool's merge tag appends the
 * recipient's email as a plain query param for attribution only; the
 * signature is what gates the download. Forwarding a campaign link
 * forwards access, but every click logs which recipient's link it was.
 */

import { createHmac, createHash, randomBytes, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';

export type EbookSlug = keyof typeof EBOOKS;

export const EBOOKS = {
  arqvantage: {
    /** Ciphertext under private/ebooks/. Never under public/. */
    file: 'arqvantage.pdf.enc',
    /** Filename the browser saves as. */
    download: 'ArqVantage-eBook.pdf',
    title: 'ArqVantage eBook',
  },
} as const;

export function isEbookSlug(s: string): s is EbookSlug {
  return Object.prototype.hasOwnProperty.call(EBOOKS, s);
}

/** 32 random bytes, base64url. Paste into EBOOK_SECRET. */
export function generateSecret(): string {
  return randomBytes(32).toString('base64url');
}

export function getSecret(): string | null {
  const s = process.env.EBOOK_SECRET;
  return s && s.length >= 32 ? s : null;
}

// One secret in, two independent keys out. Rotating EBOOK_SECRET
// invalidates every outstanding link and requires re-encrypting the
// files with the `encrypt` script.
function deriveKey(secret: string, purpose: 'enc' | 'sig'): Buffer {
  return createHmac('sha256', secret).update(`aci-ebook-${purpose}-v1`).digest();
}

/* ----------------------------- file crypto ----------------------------- */

const IV_LEN = 12;
const TAG_LEN = 16;

/** iv || tag || ciphertext. The slug is bound in as AAD so a blob
 *  encrypted for one ebook cannot be served under another slug. */
export function encryptEbook(plain: Buffer, slug: string, secret: string): Buffer {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv('aes-256-gcm', deriveKey(secret, 'enc'), iv);
  cipher.setAAD(Buffer.from(slug));
  const body = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]);
}

export function decryptEbook(blob: Buffer, slug: string, secret: string): Buffer {
  const iv = blob.subarray(0, IV_LEN);
  const tag = blob.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const body = blob.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv('aes-256-gcm', deriveKey(secret, 'enc'), iv);
  decipher.setAAD(Buffer.from(slug));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]);
}

/* ------------------------------- tokens -------------------------------- */

type Payload = {
  /** ebook slug */
  s: string;
  /** campaign id, free text, for the log line */
  c: string;
  /** expiry, unix seconds */
  x: number;
  /** optional recipient binding: first 16 hex of sha256(lowercased email) */
  b?: string;
};

function emailBinding(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 16);
}

function sign(payloadB64: string, secret: string): string {
  return createHmac('sha256', deriveKey(secret, 'sig')).update(payloadB64).digest('base64url');
}

export function mintToken(
  opts: { slug: EbookSlug; campaign: string; expiresAt: Date; email?: string },
  secret: string,
): string {
  const payload: Payload = {
    s: opts.slug,
    c: opts.campaign,
    x: Math.floor(opts.expiresAt.getTime() / 1000),
  };
  if (opts.email) payload.b = emailBinding(opts.email);
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${p}.${sign(p, secret)}`;
}

export type Verdict =
  | { ok: true; payload: Payload }
  | { ok: false; reason: 'malformed' | 'bad-signature' | 'wrong-ebook' | 'expired' | 'wrong-recipient' };

export function verifyToken(token: string, slug: string, email: string | null, secret: string): Verdict {
  const dot = token.indexOf('.');
  if (dot <= 0 || dot === token.length - 1) return { ok: false, reason: 'malformed' };
  const p = token.slice(0, dot);
  const given = token.slice(dot + 1);
  const expected = sign(p, secret);
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: 'bad-signature' };

  let payload: Payload;
  try {
    payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (payload.s !== slug) return { ok: false, reason: 'wrong-ebook' };
  if (typeof payload.x !== 'number' || payload.x * 1000 < Date.now()) return { ok: false, reason: 'expired' };
  if (payload.b) {
    if (!email || emailBinding(email) !== payload.b) return { ok: false, reason: 'wrong-recipient' };
  }
  return { ok: true, payload };
}
