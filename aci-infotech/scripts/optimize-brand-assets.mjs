/**
 * Compress and optimize the brand assets used by the v2 homepage.
 *
 * Inputs:
 *   public/aci-infotech-logo.png          (~77 KB, color on white bg)
 *   public/aci-infotech-logo-white.png    (~4 KB, white on transparent)
 *   public/images/favicon.png             (~24 KB)
 *
 * Outputs (committed to the repo):
 *   public/brand/aci-infotech-logo.png         (max 96px tall, optimized)
 *   public/brand/aci-infotech-logo.webp        (same, webp)
 *   public/brand/aci-infotech-logo-white.png
 *   public/brand/aci-infotech-logo-white.webp
 *   public/brand/favicon-32.png                (sharp 32 for browser tabs)
 *   public/brand/favicon-192.png               (192 for PWA / Apple touch)
 *
 * Sharp is already a dependency in package.json. Run with:
 *   node scripts/optimize-brand-assets.mjs
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');
const OUT = resolve(PUBLIC, 'brand');

await mkdir(OUT, { recursive: true });

async function processLogo(input, outName, height = 96) {
  const srcPath = resolve(PUBLIC, input);
  const base = sharp(srcPath).resize({ height, withoutEnlargement: true });

  const pngOut = resolve(OUT, `${outName}.png`);
  await base
    .clone()
    .png({
      compressionLevel: 9,
      palette: true,
      quality: 90,
      effort: 10,
    })
    .toFile(pngOut);

  const webpOut = resolve(OUT, `${outName}.webp`);
  await base.clone().webp({ quality: 88, effort: 6 }).toFile(webpOut);

  return { pngOut, webpOut };
}

async function processFavicon() {
  const src = resolve(PUBLIC, 'images', 'favicon.png');
  const base = sharp(src);
  const meta = await base.metadata();
  console.log(`  favicon source: ${meta.width}x${meta.height}`);

  // Standard tab favicon (32x32 PNG) — tiny, under 1KB
  await sharp(src)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 95 })
    .toFile(resolve(OUT, 'favicon-32.png'));

  // Apple touch / PWA icon (192)
  await sharp(src)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 95 })
    .toFile(resolve(OUT, 'favicon-192.png'));
}

console.log('Optimizing brand assets...');
const a = await processLogo('aci-infotech-logo.png', 'aci-infotech-logo', 96);
const b = await processLogo('aci-infotech-logo-white.png', 'aci-infotech-logo-white', 96);
console.log(`  color logo -> ${a.pngOut}, ${a.webpOut}`);
console.log(`  white logo -> ${b.pngOut}, ${b.webpOut}`);

console.log('Processing favicon...');
await processFavicon();

console.log('Done. Outputs in public/brand/.');
