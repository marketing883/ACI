'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import FadingVideo from './FadingVideo';
import SiteNav from './SiteNav';

// Note the directory: this one lives in /video, not /videos.
const VIDEO = '/video/hero-new-bg.mp4';
const VIDEO_WEBM = '/video/hero-new-bg.webm';
const ACCENT = '#1D4ED8'; // deep royal blue (primary)
const LIME = '#84CC16'; // lime (accent / highlight)
const EASE = [0.22, 1, 0.36, 1] as const;

// The pitch on the left never moves, so the proof card is free to keep
// cycling: nothing about the positioning depends on where it stops.
const CARD_DWELL = 5000;

type Mark = { src: string; alt: string; h: number };

/**
 * The fixed pitch. This is the whole point of the hero and it does not
 * rotate: whoever lands, whenever they land, reads the same thing.
 */
const LEAD = {
  eyebrow: 'What we build',
  /** Two headline lines. Wrap key words in *asterisks* to paint them in
   *  the accent blue, matching the section headings further down.
   *  Plain on purpose: "enterprises run on" is the load-bearing half, and
   *  it is what qualifies the work. The non-breaking spaces
   *  glue the last two words of each line, so a width narrow enough to
   *  wrap breaks two-and-two instead of stranding a single word. */
  headline: ['Data and AI platforms,', 'enterprises *run on.*'] as [string, string],
  // Non-breaking space before "matters.": at every desktop width the
  // paragraph otherwise wraps with that word alone on the last line.
  desc: 'Lakehouses, copilots, cloud cutovers, and the pager that comes with them. We engineer the foundation, build on top, and are still there at 3am when it matters.',
  tags: ['Pipelines', 'Governance', 'AI-ready data'],
  cta: { label: 'Explore data engineering', href: '/services/data-engineering' },
};

/**
 * Credentials that cycle in the card sitting on the video. Short on
 * purpose: a mark, a label, one line, one link. The long version of
 * each already lives on the page it points at, so repeating it here
 * only competed with the headline.
 */
type Proof = {
  eyebrow: string;
  title: string;
  /** What we actually build on that platform. Three at most: the card
   *  is a teaser, not the service page. */
  tags: string[];
  mark?: Mark;
  cta: { label: string; href: string };
};

/**
 * Every card leads with a platform mark and then says what we build on
 * it, so the rotation reads as capability rather than a logo parade.
 *
 * Marks are all confirmed legible on a light surface: the SVGs are
 * authored in near-black, Databricks uses the explicit on-light variant
 * (the shared databricks-color.svg is a white wordmark meant for dark
 * surfaces and would vanish here), and Azure and ArqAI are dark PNGs.
 */
const PROOF: Proof[] = [
  {
    eyebrow: 'Data & Lakehouse',
    title: 'From lakehouse to live AI.',
    tags: ['Delta Lake', 'MLflow', 'Workflows'],
    mark: { src: '/brand/databricks-color-on-light.svg', alt: 'Databricks', h: 34 },
    cta: { label: 'Read the case study', href: '/case-studies' },
  },
  {
    eyebrow: 'Platform Expertise',
    // Non-breaking space keeps "AI-led." whole. The balance wrap does
    // the real work; this stops a fallback from splitting the
    // hyphenate and stranding "led." on its own line.
    title: 'The whole Microsoft stack, AI-led.',
    tags: ['Azure', 'Dynamics 365', 'Power Platform'],
    mark: { src: '/images/Solution-Partners/azure.png', alt: 'Microsoft Azure', h: 42 },
    cta: { label: 'Explore Microsoft expertise', href: '/partners' },
  },
  {
    eyebrow: 'Applied AI & GenAI',
    title: 'Prototype to production in 90 days.',
    tags: ['Copilots & agents', 'RAG systems', 'MLOps & evals'],
    mark: { src: '/brand/anthropic-wordmark.svg', alt: 'Anthropic', h: 22 },
    cta: { label: 'Explore applied AI', href: '/services/applied-ai-ml' },
  },
  {
    eyebrow: 'Data Engineering',
    title: 'Campaign analysis, three weeks to four hours.',
    tags: ['Real-time pipelines', 'Governance', 'Self-service BI'],
    mark: { src: '/images/Solution-Partners/snowflake.svg', alt: 'Snowflake', h: 30 },
    cta: { label: 'Explore data engineering', href: '/services/data-engineering' },
  },
  {
    eyebrow: 'Cloud Modernization',
    title: 'Cutovers run in parallel. Nothing goes dark.',
    tags: ['Landing zones', 'Migrations', 'FinOps'],
    mark: { src: '/images/Solution-Partners/googlecloud.svg', alt: 'Google Cloud', h: 28 },
    cta: { label: 'Explore cloud modernization', href: '/services/cloud-modernization' },
  },
  {
    eyebrow: 'Managed Run & SRE',
    title: '99.97% uptime across a 72+ server estate.',
    tags: ['24/7 operations', 'Observability', 'On-call'],
    mark: { src: '/images/Solution-Partners/kubernetes.svg', alt: 'Kubernetes', h: 32 },
    cta: { label: 'Explore managed operations', href: '/services/managed-operations' },
  },
  {
    eyebrow: 'Strategic Partner',
    title: 'Forward deployed AI engineering, at scale.',
    tags: ['Forward-deployed', 'Accelerators', 'Production AI'],
    mark: { src: '/brand/arqai-labs-logo.png', alt: 'ArqAI Labs', h: 26 },
    cta: { label: 'Explore ArqAI Labs', href: 'https://thearq.ai' },
  },
];

/** Render a headline line, painting *marked* key words in the accent
 *  blue so the hero matches the partially-colored section headings. */
function HeadlineLine({ line }: { line: string }) {
  return (
    <>
      {line.split(/\*([^*]+)\*/g).map((part, idx) =>
        idx % 2 === 1 ? (
          <span key={idx} style={{ color: ACCENT }}>
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        ),
      )}
    </>
  );
}

/** Text link with a growing underline + arrow nudge on hover. External
 *  links (http/https) open in a new tab; internal links use next/link. */
function ArrowLink({
  href,
  children,
  className,
  style,
  arrowSize = 20,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  arrowSize?: number;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
      </span>
      <ArrowUpRight size={arrowSize} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );

  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`group inline-flex items-center gap-1.5 ${className ?? ''}`}
        style={style}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={`group inline-flex items-center gap-1.5 ${className ?? ''}`} style={style}>
      {inner}
    </Link>
  );
}

export default function EditorialHero({
  headingClass,
  bodyClass,
}: {
  headingClass: string;
  bodyClass: string;
}) {
  const [i, setI] = useState(0);
  // Set once the visitor picks a card by hand. A deliberate choice
  // outranks the timer, so the card they picked stays put.
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const reduce = useReducedMotion();

  // Don't burn through cards while the tab is in the background.
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (reduce || pinned || hovering || tabHidden) return;
    const t = setTimeout(() => setI((n) => (n + 1) % PROOF.length), CARD_DWELL);
    return () => clearTimeout(t);
  }, [i, reduce, pinned, hovering, tabHidden]);

  const card = PROOF[i];

  return (
    <section className={`relative min-h-[100dvh] overflow-hidden bg-white text-black ${bodyClass}`}>
      {/* Full-bleed dot-tunnel background.
          The footage is a flat grey field (luma ~189) carrying dot rings
          that are LIGHTER than the field. Brightening it the way the old
          sphere was treated would clip those dots away and leave a blank
          white rectangle, which is exactly what the previous video did
          behind the card. So it gets inverted first: the field then
          clips to pure white and the dots land as soft grey.
          That inversion is also why no mask or edge feathering is needed
          here. Measured across the clip, 97% of pixels come out at pure
          255, so the video's edges are invisible against the page. */}
      <div className="pointer-events-none absolute inset-0">
        <FadingVideo
          src={VIDEO}
          webmSrc={VIDEO_WEBM}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'invert(1) brightness(3.6)' }}
        />
        {/* Desktop: hold the texture off the pitch. The copy sits on
            clean white on the left, and the dots pick up again under the
            card on the right, which is what makes the glass read. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.95) 28%, rgba(255,255,255,0.6) 46%, rgba(255,255,255,0) 64%)',
          }}
        />
        {/* Phones stack, so the copy is up top and the card is below.
            Weight the veil to the top for the same reason. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.45) 55%, rgba(255,255,255,0.15) 100%)',
          }}
        />
      </div>

      {/* NAV — the shared v4 chrome (see SiteNav.tsx). Overlay variant:
          transparent over the hero, translucent glass once scrolled. */}
      <SiteNav variant="overlay" headingClass={headingClass} />

      {/* Foreground: fixed pitch left, rotating credential card right. */}
      {/* Bottom padding is tight on phones on purpose: the card grew
          when it took on capability tags, and this keeps the whole hero
          inside one viewport rather than a hair over it. */}
      <div className="relative z-20 flex min-h-[100dvh] flex-col justify-center px-5 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 md:px-12 md:pb-20 md:pt-32">
        {/* The card column widens with the viewport so the card keeps
            sitting ON the sphere. Kept narrow it drifts to the right of
            the footage on wide screens, ends up over plain white, and
            then reads as a solid panel no matter how low the tint is. */}
        <div className="grid w-full items-center gap-7 sm:gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-14 2xl:grid-cols-[minmax(0,1fr)_minmax(0,36rem)]">
          {/* ---------- LEFT: static ----------
              Wide enough that the authored two-line headline stays two
              lines. Narrower and "Foundation." drops to a line of its
              own, which is the widow the copy rules forbid. */}
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5, ease: EASE }}
              className="mb-5 flex items-center text-sm font-semibold capitalize tracking-[0.18em] sm:text-[15px]"
              style={{ color: ACCENT }}
            >
              <span className="text-black/35">/ </span>
              {LEAD.eyebrow}
            </motion.p>

            <h1
              className={`font-semibold capitalize text-black ${headingClass}`}
              style={{ fontSize: 'clamp(1.75rem, 3.9vw, 3.5rem)', lineHeight: 1.04, letterSpacing: '-0.015em' }}
            >
              {LEAD.headline.map((line, li) => (
                <span key={li} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 + li * 0.12, duration: 0.7, ease: EASE }}
                  >
                    <HeadlineLine line={line} />
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
              className="mt-7 max-w-md text-base font-medium leading-relaxed tracking-wide text-black/60 sm:text-lg"
            >
              {LEAD.desc}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.6, ease: EASE }}
              className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold capitalize tracking-wide text-black/45"
            >
              {LEAD.tags.map((t) => (
                <span key={t}>
                  <span style={{ color: LIME }}>/</span> {t}
                </span>
              ))}
            </motion.div>

            {/* CTA sits under the pitch it belongs to, rather than off
                on the far side of the row. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.6, ease: EASE }}
              className="mt-8"
            >
              <ArrowLink
                href={LEAD.cta.href}
                className="text-lg font-semibold capitalize tracking-wide sm:text-xl"
                style={{ color: ACCENT }}
              >
                {LEAD.cta.label}
              </ArrowLink>
            </motion.div>
          </div>

          {/* ---------- RIGHT: rotating credential card ----------
              Sits on top of the sphere. Glass rather than solid so the
              footage still reads behind it, with enough opacity to keep
              the type legible over the brightest frames. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
            className="w-full justify-self-start lg:justify-self-end"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {/* Real glass, not frost. The tint is only 18% white, so the
                sphere reads clearly through it. What keeps the type
                legible is the heavy backdrop blur: it flattens the
                footage's high-frequency detail into even tone, so dark
                text has a calm field to sit on rather than a busy one.
                Saturate stops the blur going gray and lifeless. */}
            <div
              className="relative overflow-hidden rounded-2xl border border-white/55 bg-white/[0.18] p-5 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.3)] sm:p-6 md:p-8"
              style={{
                backdropFilter: 'blur(34px) saturate(1.7)',
                WebkitBackdropFilter: 'blur(34px) saturate(1.7)',
              }}
            >
              {/* Top-left sheen, the tell that reads as a pane of glass. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(158deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.16) 40%, rgba(255,255,255,0) 78%)',
                }}
              />
              {/* Hairline inner edge so the pane has a defined lip where
                  it crosses the lighter parts of the sphere. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/[0.06]"
              />

              <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {card.mark ? (
                    <div className="mb-4 flex h-10 items-center sm:mb-5 sm:h-11">
                      <Image
                        src={card.mark.src}
                        alt={card.mark.alt}
                        width={220}
                        height={80}
                        className="w-auto object-contain"
                        style={{ height: card.mark.h }}
                      />
                    </div>
                  ) : null}

                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
                    {card.eyebrow}
                  </p>

                  {/* Reserve two lines. Titles run to one line or two,
                      and without this the card and its dots jog up and
                      down every time the credential changes. */}
                  <p className={`mt-2 min-h-[3.5rem] text-balance text-xl font-semibold leading-snug text-black ${headingClass}`}>
                    {card.title}
                  </p>

                  {/* What we build on that platform. Same slash motif as
                      the pitch on the left, one size down. Reserves two
                      lines for the same reason the title does: longer
                      tag sets wrap, and the card must not jog. */}
                  <div className="mt-3 flex min-h-[2.5rem] flex-wrap content-start gap-x-3 gap-y-1 text-[12px] font-semibold tracking-wide text-black/50">
                    {card.tags.map((t) => (
                      <span key={t}>
                        <span style={{ color: LIME }}>/</span> {t}
                      </span>
                    ))}
                  </div>

                  <ArrowLink
                    href={card.cta.href}
                    arrowSize={16}
                    className="mt-2 text-sm font-semibold tracking-wide"
                    style={{ color: ACCENT }}
                  >
                    {card.cta.label}
                  </ArrowLink>
                </motion.div>
              </AnimatePresence>

              {/* Card controls, scoped to the card they drive. */}
              <div className="mt-6 flex gap-2 border-t border-black/[0.06] pt-5">
                {PROOF.map((p, n) => (
                  <button
                    key={p.eyebrow}
                    onClick={() => {
                      setI(n);
                      setPinned(true);
                    }}
                    aria-label={p.title}
                    aria-current={n === i}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: n === i ? 26 : 10,
                      background: n === i ? ACCENT : 'rgba(0,0,0,0.18)',
                    }}
                  />
                ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Non-active credential cards, server-rendered so every mark and
          line is in the initial HTML (standard hidden-tab pattern;
          AnimatePresence only mounts the active one). */}
      <div hidden>
        {PROOF.map((p, idx) =>
          idx === i ? null : (
            <div key={p.eyebrow}>
              <p>{p.eyebrow}</p>
              <p>{p.title}</p>
              <p>{p.tags.join(', ')}</p>
              <p>{p.cta.label}</p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
