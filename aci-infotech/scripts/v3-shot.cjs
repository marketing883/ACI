const { chromium } = require('playwright-core');
const fs = require('fs');

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = process.env.OUT || '/tmp/claude-0/-home-user-ACI/07e02969-b771-5ebc-b7c1-7ba987d450a4/scratchpad';
const URL = process.env.URL || 'http://localhost:4321/preview/v3';

(async () => {
  const browser = await chromium.launch({
    executablePath: EXEC,
    args: ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader', '--ignore-gpu-blocklist'],
  });
  const tag = process.env.TAG || 'v3';
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['mobile', 390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' }).catch(() => {});
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});

    // Remove global cookie/consent chrome that overlays the preview.
    await page
      .evaluate(() => {
        document.querySelectorAll('.aci-cookie-banner').forEach((n) => n.remove());
      })
      .catch(() => {});

    // Scroll through the page so IntersectionObserver reveal animations
    // (opacity:0 -> 1) actually fire, then return to top.
    await page
      .evaluate(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const h = document.body.scrollHeight;
        for (let y = 0; y <= h; y += 500) {
          window.scrollTo(0, y);
          await sleep(120);
        }
        window.scrollTo(0, 0);
        await sleep(400);
      })
      .catch(() => {});
    await page.waitForTimeout(1200);
    // Force any not-yet-revealed (opacity:0) content visible so a static
    // capture shows the real layout, not empty skeletons.
    await page
      .addStyleTag({ content: '*{opacity:1 !important;}' })
      .catch(() => {});
    await page.waitForTimeout(300);
    await page
      .evaluate(() => {
        document.querySelectorAll('.aci-cookie-banner').forEach((n) => n.remove());
      })
      .catch(() => {});

    const file = `${OUT}/${tag}-${name}.png`;
    await page.screenshot({ path: file, fullPage: name === 'desktop' });
    console.log('wrote', file);
    await page.close();
  }
  await browser.close();
})().catch((e) => {
  console.error('SHOT ERROR', e.message);
  process.exit(1);
});
