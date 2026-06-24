import Link from 'next/link';
import { Inter } from 'next/font/google';
import s from './v3next.module.css';

/**
 * v3 homepage — full build in the approved Palantir-inspired language
 * (monochrome, neo-grotesque, blueprint motifs, editorial density).
 * Content is taken straight from ACI-Homepage-Content.md (hero) and
 * ACI-Website-Messaging-Spine.md (everything else): Data and AI paired
 * core, outcome and industry led, plain direct voice, no em dashes,
 * proof over adjectives. Preview-only, static (CSS only).
 */

const grotesk = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-grotesk',
});

const NAV = ['Data & AI', 'Capabilities', 'Industries', 'Platforms', 'Work', 'Company'];

const PARTNERS = [
  'Databricks',
  'Snowflake',
  'AWS',
  'Azure',
  'Google Cloud',
  'SAP',
  'ServiceNow',
  'Salesforce',
];

const PILLARS = [
  {
    no: '01',
    title: 'Data and AI, together',
    body: 'The AI works only when the data under it is AI-ready, and we are the ones who engineer it to be. That pairing is the difference, not two separate menus.',
  },
  {
    no: '02',
    title: 'We start with your outcome',
    body: 'We map the operation first, by industry, then build for the result you need. Not a generic platform you grow into.',
  },
  {
    no: '03',
    title: 'We ship it and run it',
    body: 'Past the pilot, into the live environment, with the same security and change discipline as anything else you run.',
  },
  {
    no: '04',
    title: 'We have the receipts',
    body: '250+ systems in production. $1B+ delivered. 95% client retention. 20 years of Fortune 500 work.',
  },
];

const CAPS = [
  { no: '/01', name: 'Data and Analytics', lead: true, tags: ['Databricks', 'Snowflake', 'Lakehouse'] },
  { no: '/02', name: 'Applied AI and GenAI', lead: true, tags: ['GenAI', 'MLOps', 'RAG'] },
  { no: '/03', name: 'Cloud and Infrastructure', lead: false, tags: ['AWS', 'Azure', 'GCP'] },
  { no: '/04', name: 'MarTech and CDP', lead: false, tags: ['Salesforce', 'CDP'] },
  { no: '/05', name: 'Platform Engineering', lead: false, tags: ['Kubernetes', 'Terraform'] },
  { no: '/06', name: 'Digital and Experience', lead: false, tags: ['Commerce', 'Apps'] },
  { no: '/07', name: 'Cyber and Trust', lead: false, tags: ['DevSecOps', 'SOC 2'] },
  { no: '/08', name: 'Managed Services', lead: false, tags: ['24/7', 'SLAs'] },
  { no: '/09', name: 'Advisory and Strategy', lead: false, tags: ['Roadmap', 'Architecture'] },
  { no: '/10', name: 'GCC and Captive Ops', lead: false, tags: ['Build-Operate', 'Teams'] },
];

const INDUSTRIES = [
  {
    name: 'Financial Services',
    promise: 'Real-time finance and reporting, modernized without downtime.',
    metric: '67%',
    metricLabel: 'Faster allocation processing',
    proof: 'SAP finance modernization, zero-downtime migration.',
  },
  {
    name: 'Retail and Convenience',
    promise: 'Decisions in hours, not days, across every store.',
    metric: '73%',
    metricLabel: 'Fewer stockouts',
    proof: '$4.2M saved across 500+ locations on Databricks.',
  },
  {
    name: 'Hospitality, Food and Facilities',
    promise: 'One view of data across every country you operate in.',
    metric: '34',
    metricLabel: 'Countries unified',
    proof: '78% faster processing, $4.7M procurement savings.',
  },
  {
    name: 'Manufacturing and Supply Chain',
    promise: 'End-to-end visibility and forecasting you can act on.',
    metric: '25%',
    metricLabel: 'Cost reduction',
    proof: '100% supply chain visibility across the network.',
  },
];

const RECEIPTS = [
  ['250+', 'Systems in production'],
  ['$1B+', 'Value delivered'],
  ['95%', 'Client retention'],
  ['20', 'Years, Fortune 500'],
];

const CERTS = ['SOC 2 Type II', 'ISO 27001', 'HIPAA ready', 'CMMI Level 3', 'GDPR'];

export default function V3Next() {
  return (
    <div className={`${grotesk.variable} ${s.root}`}>
      {/* ---- Top banner ---- */}
      <a className={s.topbar} href="#">
        Applied AI practice: 90 days from first RAG to production
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
          <Link className={s.navBtn} href="/contact">
            Get in touch
          </Link>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className={s.hero}>
        <div className={s.heroMedia} aria-hidden />
        <div className={s.heroScrim} aria-hidden />
        <div className={s.heroInner}>
          <p className={s.heroKicker}>Data + AI · In production</p>
          <h1 className={s.heroTitle}>
            From data foundation
            <br />
            to AI outcomes.
          </h1>
          <p className={s.heroSub}>
            We engineer the data foundation, build the AI on top, and run it in
            production. Most enterprise AI stalls before it gets there.
          </p>
          <Link className={s.heroBtn} href="/contact">
            Get in touch
          </Link>
        </div>
        <div className={s.heroFoot}>
          <span>250+ SYSTEMS IN PRODUCTION</span>
          <span>$1B VALUE DELIVERED</span>
          <span>95% CLIENT RETENTION</span>
          <span>SCROLL ↓</span>
        </div>
      </section>

      {/* ---- Partner strip ---- */}
      <div className={s.partners}>
        <span className={s.partnersLabel}>Certified across</span>
        <div className={s.partnersList}>
          {PARTNERS.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>

      {/* ---- The wedge: blueprint feature ---- */}
      <section className={s.feature}>
        <div className={s.featureTabs}>
          {['Data', 'AI', 'Cloud', 'Platform', 'CDP', 'Managed'].map((t, i) => (
            <span key={t} className={i === 0 ? s.tabActive : s.tab}>
              {t}
            </span>
          ))}
          <span className={s.tabAll}>ALL CAPABILITIES ↗</span>
        </div>

        <div className={s.featureBody}>
          <div className={s.blueprintHead}>
            <span className={s.blueprintTitle}>
              Most enterprise AI fails because the data under it was never ready.
              We build both, so it ships and runs.
            </span>
          </div>

          <svg
            className={s.blueprint}
            viewBox="0 0 1000 300"
            role="img"
            aria-label="Data to AI to production pipeline schematic"
          >
            <g stroke="#16171a" strokeWidth="1.2" fill="none">
              <rect x="40" y="110" width="70" height="22" />
              <rect x="40" y="140" width="70" height="22" />
              <rect x="40" y="170" width="70" height="22" />
              <path d="M110 151 H190" />
              <rect x="190" y="96" width="180" height="110" />
              <path d="M190 126 H370 M220 96 V206" strokeDasharray="2 4" />
              <path d="M370 151 H470" />
              <circle cx="540" cy="151" r="70" />
              <path d="M540 81 V221 M470 151 H610" strokeDasharray="2 4" />
              <path d="M610 151 H720" />
              <rect x="720" y="116" width="240" height="70" />
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
              <span className={s.metaK}>APPLIED AI PRACTICE</span>
              <span className={s.metaV}>12 live · 94% eval pass · 90-day RAG</span>
            </div>
            <div>
              <span className={s.metaK}>PROVEN ACROSS</span>
              <span className={s.metaV}>20 years · $1B+ delivered</span>
            </div>
          </div>

          <h2 className={s.featureWordmark}>
            Data<span className={s.featureX}>×</span>AI
          </h2>
        </div>
      </section>

      {/* ---- Value pillars ---- */}
      <section className={s.pillars}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ How we work</span>
          <h2 className={s.h2}>Four things that stay true on every build.</h2>
        </div>
        <div className={s.pillarGrid}>
          {PILLARS.map((p) => (
            <div className={s.pillar} key={p.no}>
              <span className={s.pillarNo}>{p.no}</span>
              <h3 className={s.pillarTitle}>{p.title}</h3>
              <p className={s.pillarBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Capabilities ---- */}
      <section className={s.caps}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ What we build</span>
          <h2 className={s.h2}>
            Data and AI are the work. The rest is what keeps it running.
          </h2>
          <p className={s.sectionLead}>
            Cloud, platform engineering, integration, and managed operations are
            the foundation underneath. We build all of it.
          </p>
        </div>
        <ul className={s.capList}>
          {CAPS.map((c) => (
            <li className={`${s.capRow} ${c.lead ? s.capRowLead : ''}`} key={c.no}>
              <div className={s.capLeft}>
                <span className={s.capNo}>{c.no}</span>
                {c.lead && <span className={s.capBadge}>HEADLINE</span>}
              </div>
              <span className={s.capName}>{c.name}</span>
              <span className={s.capTags}>
                {c.tags.map((t) => (
                  <span className={s.capTag} key={t}>
                    {t}
                  </span>
                ))}
              </span>
              <span className={s.capArrow} aria-hidden>
                →
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Industries ---- */}
      <section className={s.ind}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ Outcome led, by industry</span>
          <h2 className={s.h2}>We start with your outcome.</h2>
        </div>
        <div className={s.indList}>
          {INDUSTRIES.map((i) => (
            <a className={s.indRow} key={i.name} href="#">
              <span className={s.indName}>{i.name}</span>
              <span className={s.indPromise}>{i.promise}</span>
              <span className={s.indMetricWrap}>
                <span className={s.indMetric}>{i.metric}</span>
                <span className={s.indMetricLabel}>{i.metricLabel}</span>
              </span>
              <span className={s.indProof}>{i.proof}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---- Receipts band ---- */}
      <section className={s.receipts}>
        <div className={s.receiptsGrid} aria-hidden />
        <div className={s.receiptsInner}>
          <div className={s.receiptsLede}>
            <span className={s.kickerLime}>/ The receipts</span>
            <h2 className={s.receiptsTitle}>Twenty years of shipping, not slideware.</h2>
            <div className={s.certs}>
              {CERTS.map((c) => (
                <span className={s.cert} key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className={s.receiptsStats}>
            {RECEIPTS.map(([n, l]) => (
              <div className={s.receiptStat} key={l}>
                <span className={s.receiptN}>{n}</span>
                <span className={s.receiptL}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Build / photo ---- */}
      <section className={s.build}>
        <div className={s.buildPhoto} aria-hidden>
          <span className={s.buildPhotoTag}>IN PRODUCTION · FORTUNE 500</span>
        </div>
        <div className={s.buildCopy}>
          <h3 className={s.buildTitle}>The work is the thing that has to hold at 2am.</h3>
          <p className={s.buildText}>
            ACI Infotech designs, builds, and runs production data platforms,
            cloud infrastructure, and AI systems for Fortune 500 companies across
            financial services, healthcare, retail, and manufacturing. We do not
            hand off a deck. We run what we build.
          </p>
          <a className={s.buildLink} href="#">
            See the work ↗
          </a>
        </div>
      </section>

      {/* ---- ArqAI partner mention ---- */}
      <section className={s.arq}>
        <span className={s.arqLabel}>Partner</span>
        <p className={s.arqText}>
          We work with <strong>ArqAI</strong>, an independent operational-AI
          company, on production AI in regulated industries. ACI builds the full
          stack, from data foundation to outcome. ArqAI brings the vertical
          agents.
        </p>
      </section>

      {/* ---- Final CTA ---- */}
      <section className={s.cta}>
        <div className={s.ctaGlow} aria-hidden />
        <div className={s.ctaGridBg} aria-hidden />
        <div className={s.ctaInner}>
          <span className={s.kickerLime}>/ Start here</span>
          <h2 className={s.ctaTitle}>
            Tell us what
            <br />
            you need built.
          </h2>
          <p className={s.ctaLead}>
            Bring the outcome you are after. We map the operation, build the data
            and AI to reach it, and run it in production.
          </p>
          <div className={s.ctaActions}>
            <Link className={s.ctaBtn} href="/contact">
              Tell us what you need built →
            </Link>
            <Link className={s.ctaBtnGhost} href="/case-studies">
              See the work
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className={s.footer}>
        <div className={s.footerTop}>
          <span className={s.footerBrand}>ACI · Data &amp; AI</span>
          <span className={s.footerMeta}>© 2026 ACI Infotech. Built, shipped, run.</span>
        </div>
        <div className={s.footerCols}>
          {[
            ['Data & AI', ['Data and Analytics', 'Applied AI and GenAI', 'Platforms', 'ArqAI partnership']],
            ['Capabilities', ['Cloud and Infrastructure', 'Platform Engineering', 'MarTech and CDP', 'Managed Services']],
            ['Industries', ['Financial Services', 'Retail and Convenience', 'Hospitality', 'Manufacturing', 'Healthcare']],
            ['Company', ['About', 'Work', 'Newsroom', 'Careers', 'Contact']],
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
        <p className={s.footerBoiler}>
          ACI Infotech is an engineering services firm for enterprises. We design,
          build, and run production data platforms, cloud infrastructure, and AI
          systems for Fortune 500 companies. 250+ systems in production. $1B+
          delivered. 20 years.
        </p>
      </footer>
    </div>
  );
}
