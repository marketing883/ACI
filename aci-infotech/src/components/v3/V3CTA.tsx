'use client';

import Link from 'next/link';
import s from './v3.module.css';
import { cta } from './v3-data';
import { Reveal, Magnetic } from './v3-motion';

export default function V3CTA() {
  return (
    <section className={`${s.section} ${s.cta} ${s.dark}`} aria-label="Get started">
      <div className={s.ctaGrid} aria-hidden />
      <div className={s.container}>
        <div className={s.ctaInner}>
          <Reveal className={s.eyebrow} as="div">
            {cta.eyebrow}
          </Reveal>
          <Reveal>
            <h2 className={s.ctaTitle}>
              {cta.title[0]}
              <br />
              <em>{cta.title[1]}</em>
            </h2>
          </Reveal>
          <Reveal className={s.lead} as="div" delay={0.08}>
            {cta.body}
          </Reveal>
          <Reveal className={s.btnRow} as="div" delay={0.16}>
            <Magnetic>
              <Link href={cta.primary.href} className={s.btn}>
                {cta.primary.label}
                <span className={s.arrow}>→</span>
              </Link>
            </Magnetic>
            <Link href={cta.secondary.href} className={`${s.btn} ${s.btnGhost}`}>
              {cta.secondary.label}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
