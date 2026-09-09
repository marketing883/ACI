/**
 * Campaign ebook tooling. Run with `npx tsx scripts/ebook.ts <cmd>`.
 *
 *   secret
 *     Print a fresh EBOOK_SECRET. Set it in the server env (prod:
 *     env/aci-prod.env, staging: .env.staging) and keep it somewhere
 *     safe; links and files are both keyed off it.
 *
 *   encrypt <slug> <path/to/file.pdf>
 *     Encrypt a PDF into private/ebooks/<slug>.pdf.enc. Needs
 *     EBOOK_SECRET in the environment. Commit the .enc; never the PDF.
 *
 *   link <slug> --campaign <id> [--days 45] [--email a@b.com] [--host https://aciinfotech.com]
 *     Mint a signed download link. Without --email it is a campaign
 *     link: paste it into the mail tool and append &e=<merge tag> so
 *     each click logs its recipient. With --email the link only works
 *     when that address is present in `e`.
 *
 *   check <slug> <url>
 *     Verify a link locally and print its payload.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { EBOOKS, encryptEbook, generateSecret, isEbookSlug, mintToken, verifyToken } from '../src/lib/ebook';

function arg(flag: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function needSecret(): string {
  const s = process.env.EBOOK_SECRET;
  if (!s || s.length < 32) {
    console.error('EBOOK_SECRET is not set. Run `npx tsx scripts/ebook.ts secret` to make one.');
    process.exit(1);
  }
  return s;
}

function needSlug(s: string | undefined): keyof typeof EBOOKS {
  if (!s || !isEbookSlug(s)) {
    console.error(`unknown ebook slug "${s}". Known: ${Object.keys(EBOOKS).join(', ')}`);
    process.exit(1);
  }
  return s;
}

async function main() {
  const [cmd, a1, a2] = process.argv.slice(2);
  switch (cmd) {
    case 'secret': {
      console.log(generateSecret());
      return;
    }
    case 'encrypt': {
      const slug = needSlug(a1);
      const secret = needSecret();
      if (!a2) throw new Error('usage: encrypt <slug> <file.pdf>');
      const plain = await readFile(a2);
      const out = path.join(process.cwd(), 'private', 'ebooks', EBOOKS[slug].file);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, encryptEbook(plain, slug, secret));
      console.log(`wrote ${path.relative(process.cwd(), out)} (${plain.length} bytes in)`);
      return;
    }
    case 'link': {
      const slug = needSlug(a1);
      const secret = needSecret();
      const campaign = arg('--campaign');
      if (!campaign) throw new Error('--campaign <id> is required');
      const days = Number(arg('--days', '45'));
      const email = arg('--email');
      const host = (arg('--host', 'https://aciinfotech.com') as string).replace(/\/$/, '');
      const expiresAt = new Date(Date.now() + days * 86400_000);
      const token = mintToken({ slug, campaign, expiresAt, email }, secret);
      const url = `${host}/dl/${slug}?k=${token}`;
      console.log(url + (email ? `&e=${encodeURIComponent(email)}` : ''));
      console.error(`expires ${expiresAt.toISOString()}${email ? ` | bound to ${email}` : ' | campaign link (append &e=<merge tag> in the mail tool)'}`);
      return;
    }
    case 'check': {
      const slug = needSlug(a1);
      const secret = needSecret();
      if (!a2) throw new Error('usage: check <slug> <url>');
      const u = new URL(a2);
      const v = verifyToken(u.searchParams.get('k') ?? '', slug, u.searchParams.get('e'), secret);
      console.log(JSON.stringify(v, null, 2));
      process.exit(v.ok ? 0 : 2);
    }
    default:
      console.error('commands: secret | encrypt | link | check');
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
