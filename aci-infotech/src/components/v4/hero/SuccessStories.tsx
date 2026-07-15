'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Database, BrainCircuit, ServerCog, Workflow, type LucideIcon } from 'lucide-react';
import './success-stories.css';

const ROTATE_MS = 8000;

type Story = {
  id: string;
  tab: string;
  Icon: LucideIcon;
  eyebrow: string;
  title: string;
  metric: string;
  metricLabel: string;
  summary: string;
  tags: string[];
  cta: string;
  href: string;
  video: string;
  webm: string;
};

const STORIES: Story[] = [
  {
    id: 'data-velocity',
    tab: 'Data velocity',
    Icon: Database,
    eyebrow: 'Retail / Data engineering',
    title: 'Retail data, rebuilt for operational speed.',
    metric: '87%',
    metricLabel: 'reduction in data-processing time',
    summary:
      'ACI replaced fragmented pipelines with a governed Databricks lakehouse, moving critical analytics from days to hours.',
    tags: ['Azure', 'Databricks', 'Delta Lake'],
    cta: 'Read the Databricks story',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    video: '/assets/success-stories/data-velocity.mp4',
    webm: '/assets/success-stories/data-velocity.webm',
  },
  {
    id: 'ai-in-production',
    tab: 'AI in production',
    Icon: BrainCircuit,
    eyebrow: 'Financial services / Applied AI',
    title: 'A lakehouse that moves models into production faster.',
    metric: '90d',
    metricLabel: 'from prototype to production',
    summary:
      'ACI connected Azure Data Lake, Databricks, AKS, and Synapse into a governed foundation for analytics and machine learning.',
    tags: ['Azure', 'MLOps', 'Databricks'],
    cta: 'Read the Azure Lakehouse story',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    video: '/assets/success-stories/decision-intelligence.mp4',
    webm: '/assets/success-stories/decision-intelligence.webm',
  },
  {
    id: 'reliable-scale',
    tab: 'Reliable scale',
    Icon: ServerCog,
    eyebrow: 'Technology / DevOps and platform',
    title: 'A complex digital estate, engineered to stay available.',
    metric: '99.97%',
    metricLabel: 'system uptime across 72+ servers',
    summary:
      'Automated CI/CD, monitoring, load balancing, and centralized logs helped releases move faster without disrupting operations.',
    tags: ['CI/CD', 'Monitoring', 'Platform ops'],
    cta: 'Read the DevOps story',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    video: '/assets/success-stories/reliable-scale.mp4',
    webm: '/assets/success-stories/reliable-scale.webm',
  },
  {
    id: 'intelligent-operations',
    tab: 'Intelligent operations',
    Icon: Workflow,
    eyebrow: 'Technology / Workflow automation',
    title: 'Contract operations that move at business speed.',
    metric: '67%',
    metricLabel: 'reduction in contract cycle time',
    summary:
      'ACI automated creation, review, approval, compliance, and renewal in a governed Conga CLM environment.',
    tags: ['Conga CLM', 'Automation', 'Governance'],
    cta: 'Read the automation story',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    video: '/assets/success-stories/intelligent-operations.mp4',
    webm: '/assets/success-stories/intelligent-operations.webm',
  },
];

/** Case-study slugs behind the curated stories — the server page uses
 *  these to pull each story's live headline metric from the CMS. */
export const SUCCESS_STORY_SLUGS = STORIES.map((s) => s.href.split('/').pop() as string);

/** Live CMS facts per case-study slug (headline metric). */
export type StoryFacts = Record<string, { metricValue: string | null; metricLabel: string | null }>;

/** Entrance-reveal wrapper: fade + rise once the section scrolls in. */
function revealStyle(revealed: boolean, delay: number): React.CSSProperties {
  return {
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'none' : 'translateY(30px)',
    transition: `opacity 600ms ease-out ${delay}s, transform 600ms ease-out ${delay}s`,
  };
}

export default function SuccessStories({
  headingClass,
  facts,
}: {
  headingClass: string;
  facts?: StoryFacts;
}) {
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0); // bump to restart timer + progress
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal + rotation gating.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.12, rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = useCallback(
    (i: number) => {
      setCycle((c) => c + 1);
      setActive((prev) => {
        if (i === prev) return prev;
        setOutgoing(prev);
        if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
        outgoingTimer.current = setTimeout(() => setOutgoing(null), 720);
        return i;
      });
    },
    [],
  );

  // Auto-advance.
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const t = setTimeout(() => select((active + 1) % STORIES.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, cycle, paused, inView, reduce, select]);

  // Resume after hover/focus ends: restart the timer + progress line.
  const resume = useCallback(() => {
    setPaused(false);
    setCycle((c) => c + 1);
  }, []);

  // Play/pause video layers: only while the section is on screen, the
  // active (and outgoing during the crossfade) play; the rest pause and
  // reset. Off-screen, nothing decodes.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (inView && (i === active || i === outgoing)) {
        v.play().catch(() => {});
      } else {
        v.pause();
        try {
          if (i !== active) v.currentTime = 0;
        } catch {
          /* not loaded yet */
        }
      }
    });
  }, [active, outgoing, inView]);

  const s = STORIES[active];
  // Prefer the live CMS metric for the active story; the curated copy
  // stays as the fallback when the fetch came back empty.
  const fact = facts?.[SUCCESS_STORY_SLUGS[active]];
  const metricValue = fact?.metricValue ?? s.metric;
  const metricLabel = fact?.metricLabel ?? s.metricLabel;

  return (
    <section
      id="success-stories"
      ref={sectionRef}
      className="border-t border-gray-200 bg-white text-black"
    >
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-2 text-center">
        {/* Eyebrow */}
        <div
          className="mb-5 mt-12 flex items-center justify-center gap-3"
          style={revealStyle(revealed, 0.1)}
        >
          <span aria-hidden="true" className="h-px w-6 bg-blue-700" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
            Selected Success Stories
          </span>
          <span aria-hidden="true" className="h-px w-6 bg-blue-700" />
        </div>

        {/* Heading */}
        <h2
          className={`mb-4 text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-[64px] ${headingClass}`}
          style={{ lineHeight: 1.04, ...revealStyle(revealed, 0.2) }}
        >
          Proof that runs
          <br />
          <span className="text-[#1D4ED8]">in production.</span>
        </h2>

        {/* Subtext */}
        <p
          className="mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base"
          style={revealStyle(revealed, 0.3)}
        >
          From lakehouse modernization and production AI to resilient platforms and automated
          operations, see what changes when engineering is tied to the outcome.
        </p>

        {/* Primary CTA */}
        <div className="mb-9" style={revealStyle(revealed, 0.4)}>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Explore all success stories
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex justify-center" style={revealStyle(revealed, 0.5)}>
          <div
            role="tablist"
            aria-label="Success stories"
            className="grid w-fit max-w-full grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1 md:flex md:flex-row"
          >
            {STORIES.map((story, n) => {
              const isActive = n === active;
              return (
                <button
                  key={story.id}
                  role="tab"
                  id={`ss-tab-${story.id}`}
                  aria-selected={isActive}
                  aria-controls={`ss-panel-${story.id}`}
                  onClick={() => select(n)}
                  className={`relative flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-4 py-2.5 text-sm font-medium transition-colors md:min-w-[150px] md:px-4 lg:min-w-[190px] lg:px-5 ${
                    isActive ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-700`}
                >
                  <story.Icon size={17} aria-hidden="true" />
                  {story.tab}
                  {isActive && !reduce ? (
                    <span
                      key={`${active}-${cycle}`}
                      className="ss-progress"
                      style={{ animationPlayState: paused || !inView ? 'paused' : 'running' }}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Media stage */}
        <div
          aria-live="polite"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={resume}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) resume();
          }}
          className="relative mx-auto h-[560px] max-w-[1120px] overflow-hidden rounded-3xl bg-gray-950 md:h-[520px] lg:aspect-[16/7] lg:h-auto"
          style={revealStyle(revealed, 0.6)}
        >
          {/* Stacked video layers */}
          {STORIES.map((story, n) => (
            <div
              key={story.id}
              className={`ss-video-layer ${n === active ? 'is-active' : ''} ${
                n === outgoing ? 'is-outgoing' : ''
              }`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[n] = el;
                }}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                className="h-full w-full object-cover object-center"
              >
                <source src={story.webm} type="video/webm" />
                <source src={story.video} type="video/mp4" />
              </video>
            </div>
          ))}

          {/* Uniform overlay */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/25" />

          {/* Case-study card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              role="tabpanel"
              id={`ss-panel-${s.id}`}
              aria-labelledby={`ss-tab-${s.id}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: reduce
                  ? { duration: 0.001 }
                  : { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{
                opacity: 0,
                y: reduce ? 0 : -8,
                scale: reduce ? 1 : 0.985,
                transition: reduce ? { duration: 0.001 } : { duration: 0.18, ease: [0.4, 0, 1, 1] },
              }}
              className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-2xl border p-6 text-left md:inset-x-auto md:left-[5%] md:w-[460px] md:p-7"
              style={{
                background: 'rgba(255,255,255,0.94)',
                borderColor: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: '0 24px 64px rgba(3,12,24,0.28)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                  {s.eyebrow}
                </p>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <s.Icon size={19} aria-hidden="true" />
                </span>
              </div>

              <h3 className={`mt-1.5 text-2xl font-semibold leading-snug text-black md:text-[28px] ${headingClass}`}>
                {s.title}
              </h3>

              <div className="my-4 flex items-center gap-3 border-y border-gray-200 py-3">
                <span className={`text-[52px] font-semibold leading-none text-black ${headingClass}`}>
                  {metricValue}
                </span>
                <span className="max-w-[170px] text-[13px] leading-tight text-gray-500">
                  {metricLabel}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-gray-600">{s.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <Link
                href={s.href}
                className="group mt-5 inline-flex items-center gap-1 text-sm font-semibold text-black transition-colors hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {s.cta}
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Counter */}
          <div
            aria-hidden="true"
            className="absolute bottom-4 right-4 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm"
          >
            {String(active + 1).padStart(2, '0')} / {String(STORIES.length).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
}
