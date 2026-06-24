'use client';

import s from './v3.module.css';
import { pillars, pillarsHead } from './v3-data';
import { Reveal, motion } from './v3-motion';
import V3Image from './V3Image';

export default function V3Pillars() {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.pillarsHead}>
          <Reveal className={s.eyebrow} as="div">
            {pillarsHead.eyebrow}
          </Reveal>
          <Reveal>
            <h2 className={s.h2}>
              {pillarsHead.title[0]}
              <br />
              <span className={s.accentBlue}>{pillarsHead.title[1]}</span>
            </h2>
          </Reveal>
          <Reveal className={s.lead} as="div" delay={0.1}>
            {pillarsHead.body}
          </Reveal>
        </div>

        <div className={s.pillarsGrid}>
          {pillars.map((p, i) => (
            <motion.div
              className={s.pillar}
              key={p.no}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            >
              <span className={s.pillarGlow} aria-hidden />
              <span className={s.pillarNo}>{p.no}</span>
              <h3 className={s.pillarTitle}>{p.title}</h3>
              <p className={s.pillarBody}>{p.body}</p>
            </motion.div>
          ))}

          <motion.div
            className={`${s.pillar} ${s.pillarFeature}`}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={s.pillarFeatureCopy}>
              <span className={s.pillarNo}>{pillarsHead.featureKicker}</span>
              <h3 className={s.pillarTitle}>{pillarsHead.featureTitle}</h3>
              <p className={s.pillarBody}>{pillarsHead.featureBody}</p>
            </div>
            <div className={s.pillarFeatureImg}>
              <V3Image src={pillarsHead.featureImage} alt="Production systems running at scale" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
