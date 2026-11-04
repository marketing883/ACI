'use client';

// Hero: a full-viewport dark stage. The Magnific "data core" render sits
// on the right and drifts with the pointer and the scroll; aurora light
// breathes behind it; the headline rises word by word on the left. A glass
// proof chip cycles through four verified outcomes, and the partner
// platforms run along the bottom edge.

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import SiteNav from '../v4/hero/SiteNav';
import { Grain, MagneticLink, SplitHeadline } from './motion';
import NetworkField from './NetworkField';
import { EASE } from './tokens';

// Company figures from the corporate overview (deck slide 4).
const PROOFS = [
  { value: '280+', label: 'production deployments', where: 'Built, shipped, and run' },
  { value: '95%', label: 'client retention', where: 'Clients who stay with us' },
  { value: '35+', label: 'global markets', where: 'One global partnership, 4 regions' },
  { value: '20 yrs', label: 'in business', where: 'Founded 2006' },
];

const PARTNERS = [
  { src: '/brand/azure-color.png', alt: 'Microsoft Azure' },
  { src: '/brand/databricks-color.svg', alt: 'Databricks' },
  { src: '/brand/snowflake-color.svg', alt: 'Snowflake' },
  { src: '/brand/aws-color.png', alt: 'Amazon Web Services' },
  { src: '/brand/googlecloud-color.svg', alt: 'Google Cloud' },
  { src: '/brand/sap-color.svg', alt: 'SAP' },
  { src: '/brand/salesforce-color.png', alt: 'Salesforce' },
  { src: '/brand/dynatrace-color.svg', alt: 'Dynatrace' },
];

export default function NHHero({ headingClass }: { headingClass: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [proof, setProof] = useState(0);

  // Scroll: the stage sinks and dims as the page moves on.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const stageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer: a few pixels of parallax on the render, the opposite way on the glow.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  const glowX = useTransform(sx, (v) => v * -1.6);
  const glowY = useTransform(sy, (v) => v * -1.6);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setProof((p) => (p + 1) % PROOFS.length), 4200);
    return () => clearInterval(id);
  }, [reduce]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 16);
    (e.currentTarget as HTMLElement).style.setProperty('--sx', `${e.clientX - r.left}px`);
    (e.currentTarget as HTMLElement).style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  const p = PROOFS[proof];

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#05070d] text-white"
    >
      <SiteNav variant="overlay" theme="dark" headingClass={headingClass} />

      {/* Stage */}
      <motion.div aria-hidden="true" style={{ y: stageY, scale: stageScale }} className="absolute inset-0 -z-10">
        <motion.div style={{ x: sx, y: sy }} className="absolute inset-[-3%]">
          <Image
            src="/images/new-home/hero-core.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_50%] md:object-[center_50%]"
          />
        </motion.div>
      </motion.div>

      {/* Aurora light, breathing slowly */}
      <motion.div aria-hidden="true" style={{ x: glowX, y: glowY }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="nh-aurora absolute -left-[15%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-[#1d4ed8] opacity-40 blur-[120px]" />
        <div className="nh-aurora-slow absolute bottom-[-20%] left-[25%] h-[60vh] w-[60vh] rounded-full bg-[#22d3ee] opacity-20 blur-[140px]" />
      </motion.div>

      {/* Legibility scrims */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#05070d] via-[#05070d]/80 to-transparent md:via-[#05070d]/55" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#05070d] to-transparent" />
      {/* Fine engineering grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse at 30% 50%, black 10%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 30% 50%, black 10%, transparent 70%)',
        }}
      />
      {/* Interconnected network and a light that follows the pointer */}
      <NetworkField className="-z-10 opacity-70" density={0.00008} maxNodes={95} />
      <div aria-hidden="true" className="nh-spotlight pointer-events-none absolute inset-0 -z-10" />
      <Grain />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-52 pt-36 md:pb-56 md:pt-40"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-white/75 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a3e635] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#a3e635]" />
          </span>
          Enterprise data and AI, run in production
        </motion.div>

        <SplitHeadline
          as="h1"
          immediate
          delay={0.2}
          stagger={0.07}
          lines={['We build the systems', 'the business *runs on.*']}
          className={`text-[clamp(2.6rem,6.2vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.035em] ${headingClass}`}
          accentClassName="nh-accent-gradient"
        />

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          Data platforms, cloud, applications, and the operations that keep them up. We build the
          foundation, put AI on top of it, and stay on the hook long after&nbsp;go-live.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <MagneticLink href="/contact">Start a project</MagneticLink>
          <MagneticLink href="/services" variant="ghost">
            See all capabilities
          </MagneticLink>
        </motion.div>

        {/* Glass proof chip */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          className="mt-12 w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_30px_80px_-30px_rgba(29,78,216,0.6)] backdrop-blur-xl md:absolute md:bottom-56 md:right-6 md:mt-0 lg:right-10"
          aria-live="polite"
        >
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
            <span>ACI Infotech</span>
            <span className="flex gap-1">
              {PROOFS.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === proof ? 'w-5 bg-[#22d3ee]' : 'w-1.5 bg-white/25'}`} />
              ))}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={proof}
              initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: EASE }}
              className="mt-3"
            >
              <div className={`text-4xl font-semibold tracking-tight ${headingClass}`}>{p.value}</div>
              <div className="mt-1 text-sm text-white/80">{p.label}</div>
              <div className="mt-3 text-xs text-white/45">{p.where}</div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Partner platforms along the bottom edge */}
      <div className="absolute inset-x-0 bottom-14 border-t border-white/10 bg-[#05070d]/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-5">
          <span className="hidden shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45 md:block">
            Partner platforms
          </span>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="nh-marquee flex w-max items-center gap-14">
              {[...PARTNERS, ...PARTNERS].map((l, i) => (
                <Image
                  key={i}
                  src={l.src}
                  alt={i < PARTNERS.length ? l.alt : ''}
                  aria-hidden={i >= PARTNERS.length}
                  width={120}
                  height={32}
                  style={{ width: 'auto' }}
                  className="h-6 w-auto opacity-60 brightness-0 invert transition-opacity duration-300 hover:opacity-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
