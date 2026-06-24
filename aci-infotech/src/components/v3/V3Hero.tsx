'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import s from './v3.module.css';
import { hero, partners } from './v3-data';
import { LineReveal, Reveal, Magnetic } from './v3-motion';

export default function V3Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  // Parallax: grid drifts up, headline lifts slightly slower for depth.
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Duplicate the partner list so the marquee loops seamlessly.
  const loop = [...partners, ...partners];

  return (
    <section className={s.hero} ref={ref}>
      <motion.div
        className={s.heroGrid}
        style={reduce ? undefined : { y: gridY, opacity: fade }}
        aria-hidden
      />

      <div className={`${s.container} ${s.heroContent}`}>
        <Reveal className={`${s.eyebrow} ${s.heroEyebrow}`} as="div" delay={0.1}>
          {hero.eyebrow}
        </Reveal>

        <h1 className={`${s.display} ${s.heroHeadline}`}>
          <LineReveal className={s.heroLine} innerClassName={s.heroLineInner} delay={0.15}>
            {hero.headlineTop}
          </LineReveal>
          <LineReveal className={s.heroLine} innerClassName={s.heroLineInner} delay={0.28}>
            <span className={s.heroAccent}>{hero.headlineBottom}</span>
          </LineReveal>
        </h1>

        <div className={s.heroBody}>
          <Reveal className={s.lead} as="div" delay={0.5}>
            {hero.subhead}
            <span className={s.heroCaret} aria-hidden />
          </Reveal>
          <Reveal className={s.btnRow} as="div" delay={0.62}>
            <Magnetic>
              <Link href={hero.primaryCta.href} className={s.btn}>
                {hero.primaryCta.label}
                <span className={s.arrow}>→</span>
              </Link>
            </Magnetic>
            <Link href={hero.secondaryCta.href} className={`${s.btn} ${s.btnGhost}`}>
              {hero.secondaryCta.label}
            </Link>
          </Reveal>
        </div>
      </div>

      <div className={s.container} style={{ position: 'relative', zIndex: 2 }}>
        <div className={s.marquee}>
          <span className={s.marqueeLabel}>Certified across</span>
          <motion.div
            className={s.marqueeTrack}
            animate={reduce ? undefined : { x: ['0%', '-50%'] }}
            transition={
              reduce
                ? undefined
                : { duration: 24, ease: 'linear', repeat: Infinity }
            }
          >
            {loop.map((p, i) => (
              <span className={s.marqueeItem} key={`${p}-${i}`}>
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
