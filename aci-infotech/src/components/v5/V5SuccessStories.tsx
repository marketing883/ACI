'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Database, BrainCircuit, ServerCog, Workflow, type LucideIcon } from 'lucide-react';
import '../v4/hero/success-stories.css';
import './v5.css';

// v5 success stories: the v4 tabbed video stage restyled for the dark
// page. Same stories, same rotation and CMS-facts wiring; the section
// chrome goes near-black, the tab bar becomes glass, and the white
// case card stays the one light object. The media stage reveals with
// a bottom-up clip wipe.

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

export const SUCCESS_STORY_SLUGS = STORIES.map((s) => s.href.split('/').pop() as string);

export type StoryFacts = Record<string, { metricValue: string | null; metricLabel: string | null }>;

function revealStyle(revealed: boolean, delay: number): React.CSSProperties {
  return {
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'none' : 'translateY(30px)',
    transition: `opacity 600ms ease-out ${delay}s, transform 600ms ease-out ${delay}s`,
  };
}

export default function V5SuccessStories({
  headingClass,
  facts,
}: {
  headingClass: string;
  facts?: StoryFacts;
}) {
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const select = useCallback((i: number) => {
    setCycle((c) => c + 1);
    setActive((prev) => {
      if (i === prev) return prev;
      setOutgoing(prev);
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
      outgoingTimer.current = setTimeout(() => setOutgoing(null), 720);
      return i;
    });
  }, []);

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const t = setTimeout(() => select((active + 1) % STORIES.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, cycle, paused, inView, reduce, select]);

  const resume = useCallback(() => {
    setPaused(false);
    setCycle((c) => c + 1);
  }, []);

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
  const fact = facts?.[SUCCESS_STORY_SLUGS[active]];
  const metricValue = fact?.metricValue ?? s.metric;
  const metricLabel = fact?.metricLabel ?? s.metricLabel;

  return (
    <section
      id="success-stories"
      ref={sectionRef}
      className={`border-t border-white/[0.08] bg-[#0a0b10] text-white ${revealed ? 'is-revealed' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 text-center">
        <div className="mb-5 mt-14 flex items-center justify-center gap-3" style={revealStyle(revealed, 0.1)}>
          <span aria-hidden="true" className="h-px w-6 bg-[#60A5FA]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#60A5FA]">
            Selected Success Stories
          </span>
          <span aria-hidden="true" className="h-px w-6 bg-[#60A5FA]" />
        </div>

        <h2
          className={`mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px] ${headingClass}`}
          style={{ lineHeight: 1.04, ...revealStyle(revealed, 0.2) }}
        >
          Proof that runs
          <br />
          <span className="text-[#60A5FA]">in production.</span>
        </h2>

        <p className="mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base" style={revealStyle(revealed, 0.3)}>
          From lakehouse modernization and production AI to resilient platforms and automated
          operations, see what changes when engineering is tied to the outcome.
        </p>

        <div className="mb-9" style={revealStyle(revealed, 0.4)}>
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]"
          >
            <span className="relative">
              Explore all success stories
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </span>
            <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mb-5 flex justify-center" style={revealStyle(revealed, 0.5)}>
          <div
            role="tablist"
            aria-label="Success stories"
            className="grid w-fit max-w-full grid-cols-2 gap-1 rounded-xl bg-white/[0.08] p-1 md:flex md:flex-row"
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
                    isActive ? 'bg-white text-black shadow-sm' : 'text-white/60 hover:text-white'
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#60A5FA]`}
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

        {/* Media stage: bottom-up clip reveal, then business as usual. */}
        <div
          aria-live="polite"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={resume}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) resume();
          }}
          className="v5-clip relative mx-auto h-[560px] max-w-[1120px] overflow-hidden rounded-3xl bg-black md:h-[520px] lg:aspect-[16/7] lg:h-auto"
          style={{ '--v5-d': '0.35s' } as React.CSSProperties}
        >
          {STORIES.map((story, n) => (
            <div
              key={story.id}
              className={`ss-video-layer ${n === active ? 'is-active' : ''} ${n === outgoing ? 'is-outgoing' : ''}`}
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

          <div aria-hidden="true" className="absolute inset-0 bg-black/30" />

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
                transition: reduce ? { duration: 0.001 } : { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
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
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">{s.eyebrow}</p>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <s.Icon size={19} aria-hidden="true" />
                </span>
              </div>

              <h3 className={`mt-1.5 text-2xl font-semibold leading-snug text-black md:text-[28px] ${headingClass}`}>{s.title}</h3>

              <div className="my-4 flex items-center gap-3 border-y border-gray-200 py-3">
                <span className={`text-[52px] font-semibold leading-none text-black ${headingClass}`}>{metricValue}</span>
                <span className="max-w-[170px] text-[13px] leading-tight text-gray-500">{metricLabel}</span>
              </div>

              <p className="text-sm leading-relaxed text-gray-600">{s.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {t}
                  </span>
                ))}
              </div>

              <Link
                href={s.href}
                className="group mt-5 inline-flex items-center gap-1 text-sm font-semibold text-black transition-colors hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {s.cta}
                <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </AnimatePresence>

          <div
            aria-hidden="true"
            className="absolute bottom-4 right-4 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm"
          >
            {String(active + 1).padStart(2, '0')} / {String(STORIES.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Non-active stories, server-rendered for crawlers. */}
      <div hidden>
        {STORIES.map((story, idx) =>
          idx === active ? null : (
            <div key={story.id}>
              <h3>{story.title}</h3>
              <p>{story.eyebrow}</p>
              <p>
                {story.metric} {story.metricLabel}
              </p>
              <p>{story.summary}</p>
              <Link href={story.href}>{story.cta}</Link>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
