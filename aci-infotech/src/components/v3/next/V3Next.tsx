import Link from 'next/link';
import { Inter } from 'next/font/google';
import s from './v3next.module.css';
import LazyVideo from './LazyVideo';
import DataCrystal from './DataCrystal';
import {
  fetchFeaturedCaseStudies,
  fetchFeaturedBlogs,
  type HomeCaseStudy,
  type HomeBlogPost,
} from '@/lib/v2/fetch-home-data';

/**
 * v3 homepage — Palantir-inspired language (monochrome, neo-grotesque,
 * editorial) with the ACI signature: full-color cinematic video moments
 * that break the monochrome flow. Hero copy locked to
 * ACI-Homepage-Content.md; the rest follows the Messaging Spine in a
 * concrete, plain voice. Case studies and insights come from the CMS
 * (Supabase) via fetch-home-data; both degrade to anonymized fallbacks
 * when the CMS is not reachable (e.g. local preview).
 */

const grotesk = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-grotesk',
});

const NAV = ['Data & AI', 'Capabilities', 'Industries', 'Playbooks', 'Work', 'Company'];

// Ecosystem partner logos. PNGs are full wordmarks; the two sourced SVGs
// are monochrome marks. All rendered grayscale so they read as one set.
const PARTNERS: [string, string][] = [
  ['Databricks', '/images/Solution-Partners/databricks.png'],
  ['Snowflake', '/images/Solution-Partners/snowflake.svg'],
  ['AWS', '/images/Solution-Partners/aws.png'],
  ['Microsoft Azure', '/images/Solution-Partners/azure.png'],
  ['Google Cloud', '/images/Solution-Partners/googlecloud.svg'],
  ['SAP', '/images/Solution-Partners/sap.png'],
  ['ServiceNow', '/images/Solution-Partners/servicenow.png'],
  ['Salesforce', '/images/Solution-Partners/salesforce.png'],
  ['Dynatrace', '/images/Solution-Partners/dynatrace.png'],
  ['Braze', '/images/Solution-Partners/braze.png'],
];

const SVC_LOGOS: Record<string, string> = {
  databricks: '/images/Solution-Partners/databricks.png',
  snowflake: '/images/Solution-Partners/snowflake.svg',
  aws: '/images/Solution-Partners/aws.png',
  azure: '/images/Solution-Partners/azure.png',
  sap: '/images/Solution-Partners/sap.png',
  servicenow: '/images/Solution-Partners/servicenow.png',
  dynatrace: '/images/Solution-Partners/dynatrace.png',
  kubernetes: '/images/Solution-Partners/kubernetes.svg',
};

const CERTS: [string, string | null][] = [
  ['ISO 27001', '/images/certifications-awards/iso-27001.webp'],
  ['CMMI Level 3', '/images/certifications-awards/cmmi.webp'],
  ['SOC 2 Type II', null],
  ['HIPAA ready', null],
  ['GDPR', null],
];

const PLAYBOOKS = [
  { cat: 'Integration', title: 'Post-Acquisition ERP Unification', body: 'You acquired your way into forty finance systems and a close that takes a week. We make it one system and one number.', metric: '$9.2M', metricLabel: 'Year-one savings' },
  { cat: 'Data', title: 'Real-Time Inventory Platform', body: 'When the data is a day old, every store decision is a guess. We move it from overnight batch to real-time.', metric: '64%', metricLabel: 'Lower latency' },
  { cat: 'Data', title: 'Global Data Unification', body: 'One metric, three regions, three different answers. We make it one source of truth everyone trusts.', metric: '$4.7M', metricLabel: 'Procurement saved' },
  { cat: 'Analytics', title: 'Enterprise Self-Service Analytics', body: 'Every question turns into an IT ticket and a three-week wait. We hand the data back to the people asking.', metric: '$1.8M', metricLabel: 'Productivity gained' },
  { cat: 'AI', title: 'Enterprise Agentic AI', body: 'Agents that do the repetitive work, wired into your systems with a full audit trail. Not a chatbot demo.', metric: '40%', metricLabel: 'Faster operations' },
  { cat: 'Cloud', title: 'Legacy to Cloud Migration', body: 'The mainframe nobody wants to touch, moved to cloud without taking the business down for a weekend.', metric: '$20M', metricLabel: 'Saved over 3 years' },
];

const SERVICES = [
  { no: '/01', tag: 'Data Foundation', title: 'Data Engineering & Lakehouse', tagline: 'Move your data onto modern ground.', subs: ['Lakehouse migration', 'Real-time pipelines', 'Governance & lineage', 'Self-service BI'], proof: 'Campaign analysis cut from 3 weeks to 4 hours, 94% adoption.', logos: ['databricks', 'snowflake', 'azure'], bg: '/images/preview-bg/svc-data.jpg' },
  { no: '/02', tag: 'Applied AI', title: 'Applied AI & GenAI', tagline: 'Build the AI on a foundation that holds.', subs: ['Copilots & agents', 'RAG systems', 'Forecasting & ML', 'MLOps & evals'], proof: '12 live engagements, 94% eval pass rate, 90 days to production.', logos: ['azure', 'aws', 'databricks'], bg: '/images/preview-bg/svc-ai.jpg' },
  { no: '/03', tag: 'Data Trust', title: 'Integration & Governance', tagline: 'Make the data AI can actually trust.', subs: ['Multi-source integration', 'Master data (MDM)', 'Data quality', 'Compliance & audit'], proof: 'One operation unified across 34 countries, 78% faster processing.', logos: ['sap', 'servicenow', 'azure'], bg: '/images/preview-bg/svc-integration.jpg' },
  { no: '/04', tag: 'Production', title: 'Managed Run & SRE', tagline: 'Past the pilot, into production, run for good.', subs: ['24/7 operations', 'SRE & on-call', 'Observability', 'Change management'], proof: '250+ systems in production, 99.98% uptime, on call at 2am.', logos: ['kubernetes', 'dynatrace', 'servicenow'], bg: '/images/preview-bg/svc-run.jpg' },
];

// Anonymized: role and industry descriptor only, never a client name.
const TESTIMONIALS = [
  { quote: 'They flawlessly delivered top-tier digital data on a milestone that mattered to us. Their dedication and expertise made them a genuine partner, not a vendor.', role: 'Director of Data and MarTech', org: 'A national convenience retailer' },
  { quote: 'Their work on our Informatica and MDM integrations was impressive. They hit every deliverable without compromising on quality, and they were a pleasure to work with.', role: 'Senior Director', org: 'A global facilities and food group' },
  { quote: 'I was genuinely impressed by the quality of the work. The team helped us find the best ways to add value to the institution, not just ship a project and leave.', role: 'Interim CIO', org: 'A private university' },
];

// Anonymized fallbacks shown when the CMS has nothing to return.
const FALLBACK_CASES: HomeCaseStudy[] = [
  { id: 'f1', slug: '#', title: 'SAP finance core, modernized live', client_descriptor: 'A Fortune 500 financial index provider', industry: 'Financial Services', challenge: null, solution: null, metrics: [{ label: 'Faster', value: '67%' }], technologies: ['SAP', 'Azure'], services: [], testimonial_quote: null, featured_image_url: '/images/preview-bg/case-financial.jpg' },
  { id: 'f2', slug: '#', title: 'Real-time across 500+ stores', client_descriptor: 'A national convenience retailer', industry: 'Retail', challenge: null, solution: null, metrics: [{ label: 'Saved', value: '$4.2M' }], technologies: ['Databricks'], services: [], testimonial_quote: null, featured_image_url: '/images/preview-bg/case-retail.jpg' },
  { id: 'f3', slug: '#', title: 'One data view across 34 countries', client_descriptor: 'A global facilities and food group', industry: 'Hospitality', challenge: null, solution: null, metrics: [{ label: 'Faster', value: '78%' }], technologies: ['Informatica'], services: [], testimonial_quote: null, featured_image_url: '/images/preview-bg/case-global.jpg' },
  { id: 'f4', slug: '#', title: 'Supply chain, end to end', client_descriptor: 'A global manufacturer', industry: 'Manufacturing', challenge: null, solution: null, metrics: [{ label: 'Cost down', value: '25%' }], technologies: ['Databricks'], services: [], testimonial_quote: null, featured_image_url: '/images/preview-bg/case-manufacturing.jpg' },
];

const FALLBACK_BLOGS: HomeBlogPost[] = [
  { id: 'b1', slug: '#', title: 'Why most enterprise AI never leaves the pilot', excerpt: 'The model is rarely the problem. The data underneath it is.', category: 'AI & ML', read_time_minutes: 6, published_at: null, featured_image_url: null },
  { id: 'b2', slug: '#', title: 'The data work nobody budgets for, and always needs', excerpt: 'Governance and lineage are boring right up until an auditor asks.', category: 'Data', read_time_minutes: 7, published_at: null, featured_image_url: null },
  { id: 'b3', slug: '#', title: 'Migrating a mainframe without a maintenance window', excerpt: 'How we cut over a core system with the business still running on it.', category: 'Cloud', read_time_minutes: 9, published_at: null, featured_image_url: null },
];

/* Plain <img> for logos: fixed height + natural width gives a clean,
   consistently-sized strip; grayscale keeps the page monochrome. */
function Logo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className ?? s.logo} src={src} alt={alt} loading="lazy" />;
}

export default async function V3Next() {
  const [cmsCases, cmsBlogs] = await Promise.all([
    fetchFeaturedCaseStudies(4).catch(() => [] as HomeCaseStudy[]),
    fetchFeaturedBlogs(3).catch(() => [] as HomeBlogPost[]),
  ]);
  const cases = cmsCases.length ? cmsCases : FALLBACK_CASES;
  const blogs = cmsBlogs.length ? cmsBlogs : FALLBACK_BLOGS;

  return (
    <div className={`${grotesk.variable} ${s.root}`}>
      <a className={s.topbar} href="#">
        Production data and AI, built and run by engineers who stay
        <span className={s.topbarArrow}>↗</span>
      </a>

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
          <span className={s.navSearch} aria-hidden>⌕</span>
          <Link className={s.navBtn} href="/contact">Get in touch</Link>
        </div>
      </header>

      {/* ---- Hero (locked copy) ---- */}
      <section className={s.hero}>
        <LazyVideo className={s.heroMedia} src="/video/hero-graded.mp4" poster="/video/hero-poster.jpg" />
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
          <Link className={s.heroBtn} href="/contact">Get in touch</Link>
        </div>
        <div className={s.heroFoot}>
          <span>250+ SYSTEMS IN PRODUCTION</span>
          <span>$1B VALUE DELIVERED</span>
          <span>95% CLIENT RETENTION</span>
          <span>SCROLL ↓</span>
        </div>
      </section>

      {/* ---- Ecosystem Partners ---- */}
      <div className={s.partners}>
        <span className={s.partnersLabel}>Ecosystem Partners</span>
        <div className={s.partnersList}>
          {PARTNERS.map(([name, src]) => (
            <Logo key={name} src={src} alt={name} />
          ))}
        </div>
      </div>

      {/* ---- The wedge ---- */}
      <section className={s.feature}>
        <div className={s.featureBody}>
          <div className={s.blueprintHead}>
            <span className={s.blueprintTitle}>
              Most enterprise AI never leaves the demo. The data underneath was
              never built for it. We build both, so it ships and keeps running.
            </span>
          </div>
          <DataCrystal className={s.crystal} />
          <div className={s.featureMeta}>
            <div><span className={s.metaK}>Foundation</span><span className={s.metaV}>A governed lakehouse</span></div>
            <div><span className={s.metaK}>On top</span><span className={s.metaV}>Evaluated, governed AI</span></div>
            <div><span className={s.metaK}>In production</span><span className={s.metaV}>Shipped, then run</span></div>
          </div>
          <h2 className={s.featureWordmark}>Data<span className={s.featureX}>×</span>AI</h2>
        </div>
      </section>

      {/* ---- Playbooks ---- */}
      <section className={s.playbooks}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ Playbooks</span>
          <h2 className={s.h2}>Hard problems we have already solved.</h2>
          <p className={s.sectionLead}>
            The same problems show up across the Fortune 500. We have run these
            enough times to quote you a timeline and a number up front.
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
        <a className={s.sectionMore} href="#">See all playbooks ↗</a>
      </section>

      {/* ---- Signature: full-bleed video impact moment ---- */}
      <section className={s.vid}>
        <LazyVideo className={s.vidMedia} src="/video/retail-bg-graded.mp4" poster="/video/retail-bg-poster.jpg" />
        <div className={s.vidScrim} aria-hidden />
        <div className={s.vidInner}>
          <span className={s.vidKicker}>For retail and convenience</span>
          <h2 className={s.vidTitle}>
            Every store, real-time.
            <br />
            $4.2M back, every year.
          </h2>
          <p className={s.vidSub}>
            We took a 500-store convenience chain from overnight batch to
            real-time. The decisions that used to wait a day now happen in hours.
          </p>
          <a className={s.vidLink} href="#">See how we did it ↗</a>
        </div>
        <div className={s.vidFoot}>
          <span>CASE · RETAIL AND CONVENIENCE</span>
          <span>FROM OVERNIGHT BATCH TO REAL-TIME</span>
          <span>500+ STORES</span>
        </div>
      </section>

      {/* ---- Services (top 4, big-type list) ---- */}
      <section className={s.caps}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ What we build</span>
          <h2 className={s.h2}>From raw data to AI in production.</h2>
          <p className={s.sectionLead}>
            We build the data foundation, put the AI on top of it, and stay on to
            run both once they are live.
          </p>
        </div>
        <ul className={s.svcList}>
          {SERVICES.map((c) => (
            <li key={c.no}>
              <a className={s.svcRow} href="#">
                <span className={s.svcBg} style={{ backgroundImage: `url(${c.bg})` }} aria-hidden />
                <span className={s.svcNo}>{c.no}</span>
                <span className={s.svcNameWrap}>
                  <span className={s.svcTag}>{c.tag}</span>
                  <span className={s.svcName}>{c.title}</span>
                  <span className={s.svcTagline}>{c.tagline}</span>
                </span>
                <span className={s.svcMid}>
                  <span className={s.svcSubs}>
                    {c.subs.map((sub) => (
                      <span className={s.svcSub} key={sub}>{sub}</span>
                    ))}
                  </span>
                  <span className={s.svcLogos}>
                    {c.logos.map((id) => (
                      <Logo key={id} src={SVC_LOGOS[id]} alt={id} className={s.svcLogo} />
                    ))}
                  </span>
                </span>
                <span className={s.svcArrow} aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
        <a className={s.sectionMore} href="#">See all capabilities ↗</a>
      </section>

      {/* ---- Case studies (CMS, featured only) ---- */}
      <section className={s.work}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ Selected work</span>
          <h2 className={s.h2}>We start with your outcome.</h2>
          <p className={s.sectionLead}>
            A few of the systems we put into production, and what changed once
            they were live.
          </p>
        </div>
        <div className={s.csList}>
          {cases.map((c) => (
            <a
              className={s.csRow}
              key={c.id}
              href={c.slug && c.slug !== '#' ? `/case-studies/${c.slug}` : '#'}
            >
              {c.featured_image_url && (
                <span
                  className={s.csBg}
                  style={{ backgroundImage: `url(${c.featured_image_url})` }}
                  aria-hidden
                />
              )}
              <span className={s.csIndustry}>{c.industry ?? 'Enterprise'}</span>
              <span className={s.csTitle}>{c.title}</span>
              <span className={s.csMetricWrap}>
                <span className={s.csMetric}>{c.metrics?.[0]?.value ?? ''}</span>
                {c.metrics?.[0]?.label && (
                  <span className={s.csMetricLabel}>{c.metrics[0].label}</span>
                )}
              </span>
              <span className={s.csDesc}>{c.client_descriptor ?? 'Fortune 500 operator'}</span>
              <span className={s.csArrow} aria-hidden>→</span>
            </a>
          ))}
        </div>
        <Link className={s.sectionMore} href="/case-studies">See all case studies ↗</Link>
      </section>

      {/* ---- Testimonials ---- */}
      <section className={s.quotes}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ In their words</span>
          <h2 className={s.h2}>From the people we built it for.</h2>
        </div>
        <figure className={s.qLead}>
          <blockquote className={s.qLeadText}>{TESTIMONIALS[0].quote}</blockquote>
          <figcaption className={s.qLeadBy}>
            <span className={s.qLeadRole}>{TESTIMONIALS[0].role}</span>
            <span className={s.qLeadOrg}>{TESTIMONIALS[0].org}</span>
          </figcaption>
        </figure>
        <div className={s.qRest}>
          {TESTIMONIALS.slice(1).map((t) => (
            <figure className={s.qItem} key={t.role}>
              <blockquote className={s.qItemText}>{t.quote}</blockquote>
              <figcaption className={s.qItemBy}>
                <span className={s.qItemRole}>{t.role}</span>
                <span className={s.qItemOrg}>{t.org}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---- Signature: manufacturing video moment ---- */}
      <section className={s.vid}>
        <LazyVideo className={s.vidMedia} src="/video/factory-graded.mp4" poster="/video/factory-poster.jpg" />
        <div className={s.vidScrim} aria-hidden />
        <div className={s.vidInner}>
          <span className={s.vidKicker}>For manufacturing and heavy industry</span>
          <h2 className={s.vidTitle}>
            The data layer under
            <br />
            the factory floor.
          </h2>
          <p className={s.vidSub}>
            We build the forecasting and supply chain platforms that keep the line
            moving, for the places where an hour of downtime has a real dollar
            figure attached.
          </p>
          <a className={s.vidLink} href="#">See how we did it ↗</a>
        </div>
        <div className={s.vidFoot}>
          <span>MANUFACTURING · SUPPLY CHAIN</span>
          <span>FORECASTING YOU CAN ACT ON</span>
          <span>BUILT TO RUN</span>
        </div>
      </section>

      {/* ---- Insights (CMS) ---- */}
      <section className={s.insights}>
        <div className={s.sectionHead}>
          <span className={s.kicker}>/ Insights</span>
          <h2 className={s.h2}>Notes from people who have shipped it.</h2>
        </div>
        <div className={s.insGrid}>
          {blogs.map((b) => (
            <a className={s.insCard} key={b.id} href={b.slug && b.slug !== '#' ? `/blog/${b.slug}` : '#'}>
              <span className={s.insCat}>{b.category ?? 'Engineering'}</span>
              <h3 className={s.insTitle}>{b.title}</h3>
              {b.excerpt && <p className={s.insExcerpt}>{b.excerpt}</p>}
              <span className={s.insMeta}>
                {b.read_time_minutes ? `${b.read_time_minutes} min read` : 'Read'} ↗
              </span>
            </a>
          ))}
        </div>
        <Link className={s.sectionMore} href="/blog">Read all insights ↗</Link>
      </section>

      {/* ---- ArqAI ---- */}
      <section className={s.arq}>
        <span className={s.arqLabel}>Partner</span>
        <p className={s.arqText}>
          We work with <strong>ArqAI</strong>, an independent operational-AI
          company, on production AI in regulated industries. They bring the
          vertical agents. We bring the data foundation and everything it takes
          to run them in production.
        </p>
      </section>

      {/* ---- CTA ---- */}
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
            <Link className={s.ctaBtn} href="/contact">Tell us what you need built →</Link>
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
                <a className={s.footerLink} href="#" key={l}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <p className={s.footerBoiler}>
          ACI Infotech is an engineering services firm for enterprises. We design,
          build, and run production data platforms, cloud infrastructure, and AI
          systems for Fortune 500 companies across financial services, retail,
          manufacturing, and healthcare.
        </p>
        <div className={s.footerCerts}>
          {CERTS.map(([name, src]) =>
            src ? (
              <span className={s.footerCertLogo} key={name}>
                <Logo src={src} alt={name} className={s.footerCertImg} />
              </span>
            ) : (
              <span className={s.footerCert} key={name}>{name}</span>
            )
          )}
        </div>
      </footer>
    </div>
  );
}
