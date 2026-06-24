'use client';

import Link from 'next/link';
import { useState } from 'react';
import s from './v3.module.css';
import { industries } from './v3-data';
import { CountUp, BarFill, Reveal, motion } from './v3-motion';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function V3Industries() {
  const [active, setActive] = useState(0);

  return (
    <section className={`${s.section} ${s.industries}`} aria-label="Industry outcomes">
      <div className={s.container}>
        <div className={s.indGrid}>
          <div className={s.indSticky}>
            <Reveal className={s.eyebrow} as="div">
              Outcome led, by industry
            </Reveal>
            <h2 className={s.indStickyTitle}>
              We start with
              <br />
              your outcome.
            </h2>
            <p className={s.indCount}>
              <span className={s.indCountNow}>{pad(active + 1)}</span> / {pad(industries.length)}
            </p>
          </div>

          <div className={s.indList}>
            {industries.map((ind, i) => {
              const fraction = ind.metricValue / 100;
              return (
                <motion.div
                  className={s.indRow}
                  key={ind.name}
                  onViewportEnter={() => setActive(i)}
                  viewport={{ margin: '-45% 0px -45% 0px' }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={s.indName}>{ind.name}</span>
                  <Link
                    href={ind.href}
                    className={s.indPromise}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {ind.promise}
                  </Link>

                  <div className={s.indMetric}>
                    <span className={s.indMetricNum}>
                      {ind.metricPrefix}
                      <CountUp to={ind.metricValue} />
                      {ind.metricSuffix && (
                        <span className={s.indMetricSuffix}>{ind.metricSuffix}</span>
                      )}
                    </span>
                    <span className={s.indMetricLabel}>{ind.metricLabel}</span>
                  </div>

                  <div className={s.indBarTrack}>
                    <BarFill fraction={fraction} className={s.indBarFill} />
                  </div>

                  <p className={s.indProof}>{ind.proof}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
