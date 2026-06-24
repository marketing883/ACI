import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import s from './v3next.module.css';

/**
 * v3 homepage — full build in the approved Palantir-inspired language
 * (monochrome, neo-grotesque, blueprint motifs, editorial density).
 * Hero copy is locked to ACI-Homepage-Content.md. Everything else
 * follows the Messaging Spine, rewritten in a concrete, plain, senior-
 * engineer voice (no em dashes, proof over adjectives). Playbooks come
 * from the current site (PlaybookVaultSection). Preview-only, static.
 */

const grotesk = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-grotesk',
});

const NAV = ['Data & AI', 'Capabilities', 'Industries', 'Playbooks', 'Work', 'Company'];

const LOGOS: Record<string, string> = {
  databricks: '/images/Solution-Partners/databricks.png',
  aws: '/images/Solution-Partners/aws.png',
  azure: '/images/Solution-Partners/azure.png',
  sap: '/images/Solution-Partners/sap.png',
  servicenow: '/images/Solution-Partners/servicenow.png',
  salesforce: '/images/Solution-Partners/salesforce.png',
  dynatrace: '/images/Solution-Partners/dynatrace.png',
  braze: '/images/Solution-Partners/braze.png',
};

const PARTNER_STRIP = [
  ['Databricks', 'databricks'],
  ['AWS', 'aws'],
  ['Microsoft Azure', 'azure'],
  ['SAP', 'sap'],
  ['ServiceNow', 'servicenow'],
  ['Salesforce', 'salesforce'],
  ['Dynatrace', 'dynatrace'],
  ['Braze', 'braze'],
];

// Patterns we have run enough times to quote a timeline and a number.
const PLAYBOOKS = [
  {
    cat: 'Integration',
    title: 'Post-Acquisition ERP Unification',
    body: 'You acquired your way into forty finance systems and a close that takes a week. We make it one system and one number.',
    metric: '$9.2M',
    metricLabel: 'Year-one savings',
  },
  {
    cat: 'Data',
    title: 'Real-Time Inventory Platform',
    body: 'When the data is a day old, every store decision is a guess. We move it from overnight batch to real-time.',
    metric: '64%',
    metricLabel: 'Lower latency',
  },
  {
    cat: 'Data',
    title: 'Global Data Unification',
    body: 'One metric, three regions, three different answers. We make it one source of truth everyone trusts.',
    metric: '50%',
    metricLabel: 'Faster decisions',
  },
  {
    cat: 'Analytics',
    title: 'Enterprise Self-Service Analytics',
    body: 'Every question turns into an IT ticket and a three-week wait. We hand the data back to the people asking.',
    metric: '88%',
    metricLabel: 'Fewer IT tickets',
  },
  {
    cat: 'AI',
    title: 'Enterprise Agentic AI',
    body: 'Agents that do the repetitive work, wired into your systems with a full audit trail. Not a chatbot demo.',
    metric: '40%',
    metricLabel: 'Faster operations',
  },
  {
    cat: 'Cloud',
    title: 'Legacy to Cloud Migration',
    body: 'The mainframe nobody wants to touch, moved to cloud without taking the business down for a weekend.',
    metric: '68%',
    metricLabel: 'Cost cut',
  },
];

const SERVICES = [
  {
    no: '/01',
    name: 'Data and Analytics',
    body: 'The lakehouse, the pipelines, the governance. The foundation the AI actually needs before it can work.',
    logos: ['databricks', 'sap'],
  },
  {
    no: '/02',
    name: 'Applied AI and GenAI',
    body: 'GenAI and forecasting wired into the operation, evaluated and shipped. We get it past the pilot.',
    logos: ['azure', 'aws'],
  },
  {
    no: '/03',
    name: 'Cloud and Infrastructure',
    body: 'Migrations and platform work that move the estate without taking it down on a Friday night.',
    logos: ['aws', 'azure'],
  },
  {
    no: '/04',
    name: 'Managed Services',
    body: 'We stay on the call after go-live. SLAs, on-call, and the change discipline to keep it running.',
    logos: ['dynatrace', 'servicenow'],
  },
];

const INDUSTRIES = [
  {
    name: 'Financial Services',
    promise: 'Real-time finance and reporting, modernized without the downtime.',
    metric: '67%',
    metricLabel: 'Faster allocation processing',
    proof: 'SAP finance rebuild, migrated with zero downtime.',
  },
  {
    name: 'Retail and Convenience',
    promise: 'Decisions in hours, not days, across every store you run.',
    metric: '73%',
    metricLabel: 'Fewer stockouts',
    proof: '$4.2M saved across 500+ locations on Databricks.',
  },
  {
    name: 'Hospitality, Food and Facilities',
    promise: 'One view of your data across every country you operate in.',
    metric: '34',
    metricLabel: 'Countries unified',
    proof: '78% faster processing, $4.7M off procurement.',
  },
  {
    name: 'Manufacturing and Supply Chain',
    promise: 'End-to-end visibility and forecasting you can actually act on.',
    metric: '25%',
    metricLabel: 'Cost reduction',
    proof: 'Full supply chain visibility across the network.',
  },
];

const RECEIPTS = [
  ['250+', 'Systems in production'],
  ['$1B+', 'Value delivered'],
  ['95%', 'Client retention'],
  ['20', 'Years, Fortune 500'],
];

const CERTS = ['SOC 2 Type II', 'ISO 27001', 'HIPAA ready', 'CMMI Level 3', 'GDPR'];

function Logo({ id, name }: { id: string; name: string }) {
  return (
    <span className={s.logo}>
      <Image src={LOGOS[id]} alt={name} fill sizes="120px" style={{ objectFit: 'contain' }} />
    </span>
  );
}

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

      {/* ---- Hero (locked copy) ---- */}
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

      {/* ---- Partner strip (logos) ---- */}
      <div className={s.partners}>
        <span className={s.partnersLabel}>Certified across</span>
        <div className={s.partnersList}>
          {PARTNER_STRIP.map(([name, id]) => (
            <Logo key={id} id={id} name={name} />
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
              Most enterprise AI never leaves the demo. The data underneath was
              never built for it. We build both, so it ships and keeps running.
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
              <span className={s.metaK}>APPLIED AI PRACTICE</span>
              <span className={s.metaV}>12 live · 94% eval pass · 90-day RAG</span>
            </div>
            <div>
              <span className={s.metaK}>RUN WITH</span>
              <span className={s.metaV}>SLAs · 99.98% uptime · on-call</span>
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

      {/* ---- Playbooks ---- */}
      <section className={s.playbooks}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ Playbooks</span>
          <h2 className={s.h2}>We have built this before.</h2>
          <p className={s.sectionLead}>
            The same problems show up across the Fortune 500. These are the ones
            we have run enough times to hand you a plan, a timeline, and the
            number you walk away with.
          </p>
        </div>
        <div className={s.pbGrid}>
          {PLAYBOOKS.map((p) => (
            <a className={s.pbCard} key={p.title} href="#">
              <span className={s.pbCat}>{p.cat}</span>
              <h3 className={s.pbTitle}>{p.title}</h3>
              <p className={s.pbBody}>{p.body}</p>
              <div className={s.pbFoot}>
                <span className={s.pbMetric}>{p.metric}</span>
                <span className={s.pbMetricLabel}>{p.metricLabel}</span>
              </div>
            </a>
          ))}
        </div>
        <a className={s.sectionMore} href="#">
          See all playbooks ↗
        </a>
      </section>

      {/* ---- Services (top 4) ---- */}
      <section className={s.caps}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ What we build</span>
          <h2 className={s.h2}>Data and AI are the work. The rest keeps it running.</h2>
          <p className={s.sectionLead}>
            The four we lead with are here. Platform engineering, integration,
            security, and the rest of the stack live on the services page.
          </p>
        </div>
        <div className={s.svcGrid}>
          {SERVICES.map((c) => (
            <a className={s.svc} key={c.no} href="#">
              <span className={s.svcNo}>{c.no}</span>
              <h3 className={s.svcName}>{c.name}</h3>
              <p className={s.svcBody}>{c.body}</p>
              <div className={s.svcLogos}>
                {c.logos.map((id) => (
                  <Logo key={id} id={id} name={id} />
                ))}
              </div>
            </a>
          ))}
        </div>
        <a className={s.sectionMore} href="#">
          See all 10 capabilities ↗
        </a>
      </section>

      {/* ---- Industries ---- */}
      <section className={s.ind}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ Outcome led, by industry</span>
          <h2 className={s.h2}>We start with your outcome.</h2>
          <p className={s.sectionLead}>
            Pick your industry. Here is the result we build toward, and what we
            have already shipped to back it up.
          </p>
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
          <h3 className={s.buildTitle}>The job is not done when it ships. It is done when it holds at 2am.</h3>
          <p className={s.buildText}>
            We design, build, and run production data, cloud, and AI for Fortune
            500 operators. We do not hand over a deck and walk. When the system
            that runs your business needs us, we pick up.
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
          company, on production AI in regulated industries. They bring the
          vertical agents. We bring the data foundation and everything it takes
          to run them in production.
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
            Bring us the outcome you are chasing. We will tell you straight
            whether we can build it, how long it takes, and what it costs. No
            pitch, just engineers.
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
