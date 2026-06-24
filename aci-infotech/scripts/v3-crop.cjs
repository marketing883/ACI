const { chromium } = require('playwright-core');
const OUT = '/tmp/claude-0/-home-user-ACI/07e02969-b771-5ebc-b7c1-7ba987d450a4/scratchpad';
const URL = 'http://localhost:4321/preview/v3/next';
const TARGETS = [
  ['partners', /Ecosystem Partners/i, 'start', -120],
  ['video', /finance core/i, 'start', -40],
  ['services', /Data and AI are the work/i, 'start', -40],
  ['work', /Built it\. Shipped it/i, 'start', -40],
];
(async () => {
  const b = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(URL, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await p.evaluate(() => document.querySelectorAll('.aci-cookie-banner').forEach((n) => n.remove()));
  await p.waitForTimeout(800);
  for (const [name, rx, , off] of TARGETS) {
    await p.evaluate(
      ({ src, offset }) => {
        const re = new RegExp(src, 'i');
        const el = [...document.querySelectorAll('h2,h3,span,p')].find((n) => re.test(n.textContent || ''));
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo(0, y);
        }
      },
      { src: rx.source, offset: off }
    );
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${OUT}/crop-${name}.png` });
  }
  await b.close();
  console.log('ok');
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
