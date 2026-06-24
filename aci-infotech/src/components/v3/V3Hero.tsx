'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import s from './v3.module.css';
import { hero, partners } from './v3-data';
import { LineReveal, Reveal, Magnetic } from './v3-motion';
import HeroVisual from './HeroVisual';

export default function V3Hero() {
  const reduce = useReducedMotion();
  const loop = [...partners, ...partners];

  return (
    <>
      <section className={s.hero}>
        <div className={`${s.container}`} style={{ width: '100%' }}>
          <div className={s.heroInner}>
            <div className={s.heroCopy}>
              <Reveal className={`${s.eyebrow} ${s.heroEyebrow}`} as="div" delay={0.1}>
                {hero.eyebrow}
              </Reveal>

              <h1 className={s.display}>
                <LineReveal className={s.heroLine} innerClassName={s.heroLineInner} delay={0.15}>
                  {hero.headlineTop}
                </LineReveal>
                <LineReveal className={s.heroLine} innerClassName={s.heroLineInner} delay={0.28}>
                  <span className={s.accentUnderline}>{hero.headlineBottom}</span>
                </LineReveal>
              </h1>

              <div className={s.heroBody}>
                <Reveal className={s.lead} as="div" delay={0.48}>
                  {hero.subhead}
                </Reveal>
                <Reveal className={s.btnRow} as="div" delay={0.6}>
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

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      <div className={s.container}>
        <div className={s.marquee}>
          <span className={s.marqueeLabel}>Certified across</span>
          <motion.div
            className={s.marqueeTrack}
            animate={reduce ? undefined : { x: ['0%', '-50%'] }}
            transition={reduce ? undefined : { duration: 26, ease: 'linear', repeat: Infinity }}
          >
            {loop.map((p, i) => (
              <span className={s.marqueeItem} key={`${p}-${i}`}>
                {p}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
