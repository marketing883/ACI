'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Reveal, CountUp, EASE } from './v4-motion';
import HeroPipeline from './HeroPipeline';

const STATS = [
  { value: '2006', label: 'Founded' },
  { value: '1,200+', label: 'Experts' },
  { value: '500+', label: 'Large enterprise projects' },
  { value: '11', label: 'Global delivery hubs' },
];

const PLATFORMS = [
  'Databricks', 'Snowflake', 'AWS', 'Azure', 'SAP', 'ServiceNow',
  'Salesforce', 'Google Cloud', 'Microsoft Fabric', 'Dynamics 365',
];

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
  accent?: React.ReactNode;
};

const chip = (text: string) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      font: '500 12px/1 var(--font-jetbrains-mono)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--v4-lime)',
      border: '1px solid rgba(198,255,61,0.35)',
      borderRadius: 999,
      padding: '7px 14px',
      background: 'rgba(198,255,61,0.06)',
    }}
  >
    {text}
  </span>
);

const SLIDES: Slide[] = [
  {
    eyebrow: 'Data + AI · in production',
    title: (
      <>
        From data foundation
        <br />
        to AI outcomes.
      </>
    ),
    sub: 'We engineer the data foundation, build the AI on top, and run it in production. Most enterprise AI stalls before it gets there.',
  },
  {
    eyebrow: 'Databricks · lakehouse to models',
    title: (
      <>
        Your lakehouse, built
        <br />
        to actually ship AI.
      </>
    ),
    sub: 'Migration, Unity Catalog governance, and ML that runs under SLAs. We do the lakehouse rebuild your AI has been waiting on.',
    accent: chip('Databricks Partner'),
  },
  {
    eyebrow: 'Microsoft · Azure · Fabric · Dynamics 365',
    title: (
      <>
        Your Microsoft stack,
        <br />
        wired to work as one.
      </>
    ),
    sub: 'Azure, Fabric, and Dynamics 365 on one backbone, with Copilot where it earns its seat. Cloud, data, and business apps that finally agree.',
    accent: chip('Microsoft Solutions Partner'),
  },
  {
    eyebrow: 'Built by engineers who stay',
    title: (
      <>
        The team that ships it
        <br />
        is the team that stays.
      </>
    ),
    sub: 'Certified a Great Place to Work. Low churn means the engineers who built your system still know it, at 2am, a year later.',
  },
];

function RotatingHeadline() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 4600);
    return () => clearInterval(t);
  }, [reduce]);

  const s = SLIDES[i];
  const isGptw = i === 3;

  return (
    <div style={{ position: 'relative', minHeight: 284 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -14 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span
              style={{
                font: '500 12px/1 var(--font-jetbrains-mono)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--v4-lime)',
              }}
            >
              {s.eyebrow}
            </span>
            {isGptw && (
              <Image
                src="/images/certifications-awards/best-place-to-work.webp"
                alt="Great Place to Work Certified"
                width={40}
                height={52}
                style={{ height: 46, width: 'auto' }}
              />
            )}
          </div>

          <h1 className="v4-h1" style={{ color: '#fff', margin: '20px 0 0', maxWidth: 720 }}>
            {s.title}
          </h1>

          <p
            style={{
              maxWidth: 540,
              margin: '22px 0 0',
              font: '400 17.5px/1.6 var(--font-funnel-sans)',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            {s.sub}
          </p>

          {s.accent && <div style={{ marginTop: 20 }}>{s.accent}</div>}
        </motion.div>
      </AnimatePresence>

      {/* progress dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 30 }} aria-hidden>
        {SLIDES.map((_, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            aria-label={`Show headline ${n + 1}`}
            style={{
              width: n === i ? 26 : 8,
              height: 8,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              background: n === i ? 'var(--v4-lime)' : 'rgba(255,255,255,0.22)',
              transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function V4Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // Respect reduced motion: hold on the poster instead of autoplaying.
    if (reduce && videoRef.current) videoRef.current.removeAttribute('autoplay');
  }, [reduce]);

  return (
    <>
      <section className="v4-hero">
        {/* background video + scrim */}
        <div className="v4-hero-media" aria-hidden>
          {!reduce && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster="/video/hero-poster.jpg"
              preload="metadata"
            >
              <source src="/video/hero-graded.mp4" type="video/mp4" />
            </video>
          )}
          <div className="v4-hero-scrim" />
        </div>

        <div className="v4-hero-inner">
          <div className="v4-hero-copy">
            <RotatingHeadline />
            <div style={{ display: 'flex', gap: 14, marginTop: 34, flexWrap: 'wrap' }}>
              <Link href="/contact" className="v4-btn v4-btn--primary">
                Start a project
              </Link>
              <Link href="/case-studies" className="v4-btn v4-btn--onDark">
                See the work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* light band: the pipeline pokes its top third up into the hero,
          then stats + ticker follow. */}
      <section className="v4-hero-band">
        <Reveal tier="lg" delay={0.15} className="v4-pipeline-wrap">
          <div className="v4-pipeline-panel">
            <div className="v4-pipeline-head">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="v4-livedot" />
                LIVE PIPELINE
              </span>
              <span>SOURCES → LAKEHOUSE → MODELS → DECISIONS</span>
            </div>
            <HeroPipeline className="v4-pipeline-svg" />
          </div>
        </Reveal>

        <div className="v4-hero-band-inner" style={{ maxWidth: 1240, margin: '0 auto', padding: '72px 24px 0' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 24,
              paddingBottom: 40,
              borderBottom: '1px solid var(--v4-mist)',
            }}
          >
            {STATS.map((st, i) => (
              <Reveal key={st.label} tier="sm" delay={i * 0.07}>
                <div>
                  <div style={{ font: '600 clamp(1.9rem, 3vw, 2.6rem)/1.1 var(--font-funnel-display)', letterSpacing: '-0.02em' }}>
                    <CountUp value={st.value} />
                  </div>
                  <div style={{ marginTop: 6, font: '400 13.5px/1.4 var(--font-funnel-sans)', color: 'var(--v4-muted)' }}>
                    {st.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="v4-ticker" style={{ padding: '26px 0 8px' }} aria-hidden>
            {[0, 1].map((dup) => (
              <div className="v4-ticker-track" key={dup}>
                {PLATFORMS.map((p) => (
                  <span key={`${dup}-${p}`} style={{ font: '500 14px/1 var(--font-jetbrains-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--v4-muted)', whiteSpace: 'nowrap' }}>
                    {p}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
