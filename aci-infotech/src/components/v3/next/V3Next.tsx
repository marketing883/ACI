import { Inter } from 'next/font/google';
import s from './v3next.module.css';

/**
 * Concept D2 — Palantir-inspired language for the v3 homepage.
 * Monochrome (black / cream / grey), neo-grotesque typography with
 * dramatic weight contrast, engineering-blueprint motifs with mono
 * annotations, editorial density, dark photographic hero alternating
 * into bright whitespace. Preview-only, static (CSS only).
 */

const grotesk = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-grotesk',
});

const NAV = ['Platform', 'Data', 'AI', 'Industries', 'Work', 'Company'];

const TABS = [
  'Foundry',
  'Lakehouse',
  'Applied AI',
  'Cloud',
  'CDP',
  'Managed Run',
];

const CAPS = [
  { no: '/01', desc: 'Unify and govern the data the AI depends on, built for scale.', name: 'Data' },
  { no: '/02', desc: 'Predictive and generative systems wired into the operation.', name: 'AI' },
  { no: '/03', desc: 'Migrate and modernize the estate without taking it down.', name: 'Cloud' },
  { no: '/04', desc: 'Customer data unified and activated, end to end.', name: 'CDP' },
  { no: '/05', desc: 'We run what we build. SLAs, on-call, change discipline.', name: 'Run' },
];

const OUTCOMES = [
  {
    tag: 'Fortune 100 convenience retailer',
    body: 'Decisions in hours, not days, across 500+ locations. $4.2M saved in the first year on a governed lakehouse.',
  },
  {
    tag: 'Global financial services',
    body: 'SAP finance modernization with a zero-downtime migration. 67% faster allocation processing.',
  },
  {
    tag: 'Multinational hospitality group',
    body: 'One view of data across 34 countries. 78% faster processing and $4.7M in procurement savings.',
  },
  {
    tag: 'Industrial manufacturer',
    body: 'End-to-end supply chain visibility with forecasting that holds. 25% cost reduction across the network.',
  },
];

export default function V3Next() {
  return (
    <div className={`${grotesk.variable} ${s.root}`}>
      {/* ---- Top banner ---- */}
      <a className={s.topbar} href="#">
        Read our 2026 Data &amp; AI in Production report
        <span className={s.topbarArrow}>↗</span>
      </a>

      {/* ---- Nav ---- */}
      <header className={s.nav}>
        <a className={s.brand} href="#">
          ACI<span className={s.brandMark}>·</span>Data&amp;AI
        </a>
        <nav className={s.navLinks}>
          {NAV.map((n) => (
            <a key={n} href="#" className={s.navLink}>
              {n}
            </a>
          ))}
        </nav>
        <div className={s.navRight}>
          <span className={s.navSearch} aria-hidden>
            ⌕
          </span>
          <a className={s.navBtn} href="#">
            Get started
          </a>
        </div>
      </header>

      {/* ---- Hero (dark, photographic) ---- */}
      <section className={s.hero}>
        <div className={s.heroMedia} aria-hidden />
        <div className={s.heroScrim} aria-hidden />
        <div className={s.heroInner}>
          <p className={s.heroKicker}>Data + AI · In production</p>
          <h1 className={s.heroTitle}>
            AI you can put
            <br />
            into production.
          </h1>
          <p className={s.heroSub}>
            We engineer the data foundation, build the AI on top, and run it for
            the enterprises that cannot afford for it to fail.
          </p>
          <a className={s.heroBtn} href="#">
            Explore the platform
          </a>
        </div>
        <div className={s.heroFoot}>
          <span>EST. 2004</span>
          <span>250+ SYSTEMS IN PRODUCTION</span>
          <span>FORTUNE 500</span>
          <span>SCROLL ↓</span>
        </div>
      </section>

      {/* ---- Feature: blueprint panel ---- */}
      <section className={s.feature}>
        <div className={s.featureTabs}>
          {TABS.map((t, i) => (
            <span key={t} className={i === 0 ? s.tabActive : s.tab}>
              {t}
            </span>
          ))}
          <span className={s.tabAll}>ALL ↗</span>
        </div>

        <div className={s.featureBody}>
          <div className={s.blueprintHead}>
            <span className={s.blueprintTitle}>
              The operating system for data and AI in production ↗
            </span>
          </div>

          {/* engineering blueprint diagram */}
          <svg
            className={s.blueprint}
            viewBox="0 0 1000 300"
            role="img"
            aria-label="Data to AI to production pipeline schematic"
          >
            <g stroke="#16171a" strokeWidth="1.2" fill="none">
              {/* sources */}
              <rect x="40" y="110" width="70" height="22" />
              <rect x="40" y="140" width="70" height="22" />
              <rect x="40" y="170" width="70" height="22" />
              <path d="M110 151 H190" />
              {/* lakehouse */}
              <rect x="190" y="96" width="180" height="110" />
              <path d="M190 126 H370 M220 96 V206" strokeDasharray="2 4" />
              {/* to models */}
              <path d="M370 151 H470" />
              <circle cx="540" cy="151" r="70" />
              <path d="M540 81 V221 M470 151 H610" strokeDasharray="2 4" />
              {/* to production */}
              <path d="M610 151 H720" />
              <rect x="720" y="116" width="240" height="70" />
              {/* dimension ticks */}
              <path d="M40 240 H960" strokeDasharray="1 5" opacity="0.5" />
              <path d="M40 235 V245 M540 235 V245 M960 235 V245" opacity="0.5" />
            </g>
            <g
              fill="#16171a"
              fontSize="11"
              fontFamily="var(--font-jetbrains-mono), monospace"
              letterSpacing="0.08em"
            >
              <text x="40" y="92">01 / SOURCES</text>
              <text x="190" y="86">02 / GOVERNED LAKEHOUSE</text>
              <text x="478" y="70">03 / AI &amp; ML MODELS</text>
              <text x="720" y="106">04 / PRODUCTION</text>
              <text x="40" y="262" opacity="0.6">INGEST</text>
              <text x="508" y="262" opacity="0.6">MODEL · EVALUATE</text>
              <text x="880" y="262" opacity="0.6">SERVE</text>
            </g>
          </svg>

          <div className={s.featureMeta}>
            <div>
              <span className={s.metaK}>BUILT ON</span>
              <span className={s.metaV}>Databricks · Snowflake · SAP</span>
            </div>
            <div>
              <span className={s.metaK}>RUN WITH</span>
              <span className={s.metaV}>SLAs · 99.98% uptime · On-call</span>
            </div>
            <div>
              <span className={s.metaK}>PROVEN ACROSS</span>
              <span className={s.metaV}>20 years · $1B+ delivered</span>
            </div>
          </div>

          <h2 className={s.featureWordmark}>
            Production<span className={s.featureX}>×</span>Grade
          </h2>
        </div>
      </section>

      {/* ---- Statement ---- */}
      <section className={s.statement}>
        <p className={s.statementText}>
          Our work powers real-time, <span className={s.muted}>AI-driven</span>{' '}
          decisions inside the operations that run the economy,{' '}
          <span className={s.muted}>from the factory floor to the financial close</span>,
          and it runs in production.
        </p>
        <span className={s.statementLabel}>Our</span>
      </section>

      {/* ---- Capabilities: big-type list ---- */}
      <section className={s.caps}>
        <ul className={s.capList}>
          {CAPS.map((c) => (
            <li className={s.capRow} key={c.no}>
              <div className={s.capLeft}>
                <span className={s.capDesc}>{c.desc}</span>
                <span className={s.capNo}>{c.no}</span>
              </div>
              <span className={s.capName}>{c.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Build / photo ---- */}
      <section className={s.build}>
        <div className={s.buildPhoto} aria-hidden>
          <span className={s.buildPhotoTag}>IN THE FIELD · PRODUCTION SYSTEMS</span>
        </div>
        <div className={s.buildCopy}>
          <h3 className={s.buildTitle}>There is still so much left to build.</h3>
          <p className={s.buildText}>
            For twenty years we have shipped the systems Fortune 500 operators
            depend on, then stayed to run them. The work is not the pilot. The
            work is the thing that has to hold at 2am.
          </p>
          <a className={s.buildLink} href="#">
            See the work ↗
          </a>
        </div>
      </section>

      {/* ---- Outcomes (editorial columns) ---- */}
      <section className={s.outcomes}>
        <span className={s.outcomesLabel}>What we have shipped</span>
        <div className={s.outcomeGrid}>
          {OUTCOMES.map((o) => (
            <div className={s.outcome} key={o.tag}>
              <span className={s.outcomeTag}>{o.tag}</span>
              <p className={s.outcomeBody}>{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA blocks ---- */}
      <section className={s.ctaRow}>
        <a className={s.ctaBlock} href="#">
          <span className={s.ctaLabel}>Request a working session</span>
          <span className={s.ctaArrow}>→</span>
        </a>
        <a className={`${s.ctaBlock} ${s.ctaBlockDark}`} href="#">
          <span className={s.ctaLabel}>Start a build</span>
          <span className={s.ctaArrow}>→</span>
        </a>
      </section>

      {/* ---- Footer ---- */}
      <footer className={s.footer}>
        <div className={s.footerTop}>
          <span className={s.footerBrand}>ACI · Data &amp; AI</span>
          <span className={s.footerMeta}>© 2026 ACI Infotech. Built, shipped, run.</span>
        </div>
        <div className={s.footerCols}>
          {[
            ['Platform', ['Foundry', 'Lakehouse', 'Applied AI', 'Cloud', 'CDP', 'Managed Run']],
            ['Industries', ['Financial Services', 'Retail & Consumer', 'Hospitality', 'Manufacturing', 'Healthcare']],
            ['Company', ['About', 'Careers', 'Newsroom', 'Partners', 'Contact']],
            ['Resources', ['Case Studies', 'Playbooks', 'Reports', 'Security', 'Privacy']],
          ].map(([head, links]) => (
            <div className={s.footerCol} key={head as string}>
              <p className={s.footerHead}>{head}</p>
              {(links as string[]).map((l) => (
                <a className={s.footerLink} href="#" key={l}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
