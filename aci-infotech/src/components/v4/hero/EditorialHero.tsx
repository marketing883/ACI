'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import FadingVideo from './FadingVideo';
import SiteNav from './SiteNav';

const VIDEO = '/videos/v4-editorial-signal.mp4';
const VIDEO_WEBM = '/videos/v4-editorial-signal.webm';
const ACCENT = '#1D4ED8'; // deep royal blue (primary)
const LIME = '#84CC16'; // lime (accent / highlight)
const EASE = [0.22, 1, 0.36, 1] as const;


type Mark =
  | { kind: 'logo'; src: string; alt: string; h: number }
  | { kind: 'badge'; src: string; alt: string; w: number };

type Slide = {
  eyebrow: string;
  /** Optional logo shown in place of the eyebrow text (e.g. a partner
   *  wordmark) — kept alongside `eyebrow` for alt text / a11y. */
  eyebrowLogo?: { src: string; w: number; h: number };
  /** Two headline lines. Wrap the key words in *asterisks* to render
   *  them in the accent blue, matching the section headings below. */
  headline: [string, string];
  desc: string;
  tags: string[];
  cta: { label: string; href: string };
  mark?: Mark;
  stat?: { value: string; label: string };
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'Service Foundation',
    headline: ['Build the AI foundation.', 'Run it *in production.*'],
    desc: 'ACI Infotech engineers the data foundation, builds the AI on top, and runs it in production. Most enterprise AI stalls before it gets there.',
    tags: ['Pipelines', 'Governance', 'AI-ready data'],
    cta: { label: 'Explore data engineering', href: '/services/data-engineering' },
  },
  {
    eyebrow: 'Case Study',
    headline: ['From Lakehouse', 'to *Live AI.*'],
    desc: 'Lakehouse modernization, Delta pipelines, MLflow, governance, and real-time analytics for teams that need Databricks to run in production.',
    tags: ['Delta Lake', 'MLflow', 'Workflows'],
    cta: { label: 'Read the case study', href: '/case-studies' },
    // On-light variant: the shared databricks-color.svg carries a white
    // wordmark for dark surfaces, which disappears on the white hero.
    mark: { kind: 'logo', src: '/brand/databricks-color-on-light.svg', alt: 'Databricks', h: 56 },
    stat: { value: '87%', label: 'Reduction in data processing time' },
  },
  {
    eyebrow: 'Platform Expertise',
    headline: ['The Whole Microsoft Stack.', '*AI-Led.*'],
    desc: 'Azure is strongest when it connects to the business stack. We bring Azure, Dynamics 365, Power Platform, and data engineering together around measurable operations.',
    tags: ['Azure', 'Dynamics 365', 'Power Platform'],
    cta: { label: 'Explore Microsoft expertise', href: '/partners' },
    mark: { kind: 'logo', src: '/images/Solution-Partners/azure.png', alt: 'Microsoft Azure', h: 80 },
  },
  {
    eyebrow: 'ArqAI Labs',
    eyebrowLogo: { src: '/brand/arqai-labs-logo.png', w: 2439, h: 858 },
    headline: ['Forward Deployed AI', 'Engineering *At Scale.*'],
    desc: 'Engineers embedded in the problem, not advising from outside. Delivered with our strategic partner ArqAI, whose accelerators come from years of doing this work.',
    tags: ['Forward-deployed', 'Accelerators', 'Production AI'],
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
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 7000);
    return () => clearInterval(t);
  }, [reduce]);


  const s = SLIDES[i];

  return (
    <section className={`relative min-h-[100dvh] overflow-hidden bg-white text-black ${bodyClass}`}>
      {/* Reduced, vertically-centered video sitting on the right. The
          render ships on a soft gray studio background; a mild
          brightness/contrast lift pushes that gray to white, and a radial
          mask feathers every edge into the page so the sphere floats on a
          uniformly white field with no visible video box. */}
      <div className="pointer-events-none absolute inset-x-0 top-[9%] h-[30%] w-full sm:left-auto sm:right-0 sm:top-[15%] sm:h-[40%] sm:w-[64%] md:top-1/2 md:h-[66%] md:w-[50%] md:-translate-y-1/2">
        <FadingVideo
          src={VIDEO}
          webmSrc={VIDEO_WEBM}
          mirror
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            filter: 'saturate(0.9) brightness(1.06) contrast(1.18)',
            WebkitMaskImage:
              'radial-gradient(ellipse 60% 72% at 50% 50%, #000 40%, rgba(0,0,0,0.55) 66%, transparent 92%)',
            maskImage:
              'radial-gradient(ellipse 60% 72% at 50% 50%, #000 40%, rgba(0,0,0,0.55) 66%, transparent 92%)',
          }}
        />
        {/* The footage's studio vignette still ghosts through at the
            frame's top and bottom edges where the radial mask is thin.
            White feathers erase those bands without touching the sphere. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.92) 12%, rgba(255,255,255,0) 34%), linear-gradient(0deg, #fff 0%, rgba(255,255,255,0.85) 6%, rgba(255,255,255,0) 22%)',
          }}
        />
      </div>

      {/* NAV — the shared v4 chrome (see SiteNav.tsx). Overlay variant:
          transparent over the hero, translucent glass once scrolled. */}
      <SiteNav variant="overlay" headingClass={headingClass} />

      {/* Foreground */}
      <div className="relative z-20 flex min-h-[100dvh] flex-col pt-24 md:pt-28">
        {/* CONTENT (left) — vertically centered */}
        <div className="flex flex-1 flex-col justify-center px-5 sm:px-8 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: EASE } }}
              className="max-w-full md:max-w-[63%]"
            >
              {/* brand mark / credential */}
              {s.mark || s.stat ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } }}
                  className="mb-7 flex flex-wrap items-center gap-x-6 gap-y-4"
                >
                  {s.mark ? (
                    s.mark.kind === 'badge' ? (
                      <Image src={s.mark.src} alt={s.mark.alt} width={s.mark.w} height={108} className="h-20 w-auto" />
                    ) : (
                      <Image
                        src={s.mark.src}
                        alt={s.mark.alt}
                        width={200}
                        height={106}
                        className="w-auto object-contain"
                        // Scale the mark down with the viewport so the
                        // credential row fits a phone without wrapping.
                        style={{ height: `min(${s.mark.h}px, 14vw)` }}
                      />
                    )
                  ) : null}
                  {s.stat ? (
                    <>
                      {s.mark ? <span className="h-12 w-px bg-black/15" /> : null}
                      <div className="flex items-baseline gap-3">
                        <span className={`text-4xl font-bold leading-none sm:text-5xl ${headingClass}`} style={{ color: ACCENT }}>
                          {s.stat.value}
                        </span>
                        <span className="max-w-[150px] text-[12px] font-semibold uppercase leading-tight tracking-wide text-black/55">
                          {s.stat.label}
                        </span>
                      </div>
                    </>
                  ) : null}
                </motion.div>
              ) : null}

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.5, ease: EASE } }}
                className="mb-5 flex items-center text-sm font-semibold capitalize tracking-[0.18em] sm:text-[15px]"
                style={{ color: ACCENT }}
              >
                <span className="text-black/35">/ </span>
                {s.eyebrowLogo ? (
                  <Image
                    src={s.eyebrowLogo.src}
                    alt={s.eyebrow}
                    width={s.eyebrowLogo.w}
                    height={s.eyebrowLogo.h}
                    className="ml-1.5 h-6 w-auto object-contain"
                  />
                ) : (
                  s.eyebrow
                )}
              </motion.p>

              <h1
                className={`font-semibold capitalize text-black ${headingClass}`}
                style={{ fontSize: 'clamp(1.55rem, 3.7vw, 3.5rem)', lineHeight: 1.04, letterSpacing: '-0.015em' }}
              >
                {s.headline.map((line, li) => (
                  <span key={li} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{ y: '110%' }}
                      animate={{ y: 0, transition: { delay: 0.2 + li * 0.12, duration: 0.7, ease: EASE } }}
                    >
                      <HeadlineLine line={line} />
                    </motion.span>
                  </span>
                ))}
              </h1>

              {/* Stays stacked through tablet: side-by-side at md crushed
                  the paragraph to a word a line. */}
              <div className="mt-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-md">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.6, ease: EASE } }}
                    className="text-base font-medium leading-relaxed tracking-wide text-black/60 sm:text-lg"
                  >
                    {s.desc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.62, duration: 0.6, ease: EASE } }}
                    className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold capitalize tracking-wide text-black/45"
                  >
                    {s.tags.map((t) => (
                      <span key={t}>
                        <span style={{ color: LIME }}>/</span> {t}
                      </span>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.72, duration: 0.6, ease: EASE } }}
                >
                  <ArrowLink
                    href={s.cta.href}
                    className="whitespace-nowrap text-xl font-semibold capitalize tracking-wide sm:text-2xl"
                    style={{ color: ACCENT }}
                  >
                    {s.cta.label}
                  </ArrowLink>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* rotation indicator pinned to the bottom */}
        <div className="px-5 pb-10 sm:px-8 md:px-12 md:pb-12">
          <div className="flex gap-2">
            {SLIDES.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Slide ${n + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: n === i ? 30 : 12,
                  background: n === i ? ACCENT : 'rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Non-active hero slides, server-rendered so every headline and
          description is in the initial HTML (standard hidden-tab
          pattern; AnimatePresence only mounts the active slide). */}
      <div hidden>
        {SLIDES.map((s, idx) =>
          idx === i ? null : (
            <div key={s.eyebrow}>
              <p>{s.eyebrow}</p>
              <p>{s.headline.join(' ').replace(/\*/g, '')}</p>
              <p>{s.desc}</p>
              {s.stat ? (
                <p>
                  {s.stat.value} {s.stat.label}
                </p>
              ) : null}
            </div>
          ),
        )}
      </div>
    </section>
  );
}
