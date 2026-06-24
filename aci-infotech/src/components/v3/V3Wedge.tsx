'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import s from './v3.module.css';
import { wedge } from './v3-data';
import { Reveal } from './v3-motion';

export default function V3Wedge() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // The connector line draws across the three steps as the section
  // scrolls through the viewport. pathLength is driven directly by
  // scroll progress, so it builds and unbuilds with the user.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'center 55%'],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.wedgeHead}>
          <Reveal className={s.eyebrow} as="div">
            {wedge.eyebrow}
          </Reveal>
          <Reveal>
            <h2 className={s.h2}>
              {wedge.title[0]}
              <br />
              {wedge.title[1]}
            </h2>
          </Reveal>
          <Reveal className={s.lead} as="div" delay={0.1}>
            {wedge.body}
          </Reveal>
        </div>

        <div className={s.wedgeSteps} ref={ref}>
          <svg
            className={s.wedgeLineSvg}
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="rgba(10,10,10,0.16)" strokeWidth="1" />
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="#b4f01e"
              strokeWidth="2"
              style={reduce ? { pathLength: 1 } : { pathLength }}
            />
          </svg>

          {wedge.steps.map((step, i) => (
            <motion.div
              className={s.wedgeStep}
              key={step.no}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.14 }}
            >
              <span className={s.wedgeStepNo}>{step.no}</span>
              <h3 className={s.wedgeStepTitle}>{step.title}</h3>
              <p className={s.wedgeStepBody}>{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
