const { chromium } = require('playwright-core');
const OUT = '/tmp/claude-0/-home-user-ACI/07e02969-b771-5ebc-b7c1-7ba987d450a4/scratchpad';
const URL = 'http://localhost:4321/preview/v3/next';
(async () => {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(URL, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await p.evaluate(() => document.querySelectorAll('.aci-cookie-banner').forEach((n) => n.remove()));
  await p.waitForTimeout(800);
  // partner strip is just below the hero; scroll so it's in view
  await p.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find((s) => /Certified across/i.test(s.textContent || ''));
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + '/crop-partners.png' });
  // services section
  await p.evaluate(() => {
    const el = [...document.querySelectorAll('h2')].find((s) => /Data and AI are the work/i.test(s.textContent || ''));
    if (el) el.scrollIntoView({ block: 'start' });
  });
  await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + '/crop-services.png' });
  await b.close();
  console.log('ok');
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
