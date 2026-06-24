'use client';

import s from './v3.module.css';
import { proofs } from './v3-data';
import { CountUp, motion } from './v3-motion';

export default function V3Proof() {
  return (
    <section aria-label="By the numbers">
      <div className={s.proof}>
        {proofs.map((p, i) => (
          <motion.div
            className={s.proofCell}
            key={p.label}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
          >
            <div className={s.proofNum}>
              {p.prefix && <span>{p.prefix}</span>}
              <CountUp to={p.value} />
              {p.suffix && <span className={s.proofSuffix}>{p.suffix}</span>}
            </div>
            <div className={s.proofLabel}>{p.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
