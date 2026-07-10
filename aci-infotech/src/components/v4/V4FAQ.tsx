'use client';

import { Reveal, AccordionItem } from './v4-motion';

const FAQS = [
  {
    q: 'How fast can you start?',
    a: 'Discovery calls happen within the week. A scoped engagement with a senior architect assigned typically starts two to four weeks after that, depending on access and approvals on your side.',
  },
  {
    q: 'Do you work with our in-house team or replace it?',
    a: 'With it. Most engagements pair our architects with your engineers, and the code, the docs, and the runbooks stay in your repos. If you want us to run production afterwards, that is a separate managed operations agreement.',
  },
  {
    q: 'What does a typical engagement cost?',
    a: 'Enterprise work gets scoped, not price-tagged. After a discovery call we return a plan with a fixed number attached. Senior engineers do the work, so the number buys production code rather than a pyramid of analysts.',
  },
  {
    q: 'Our data is a mess. Can you still build AI on it?',
    a: 'That mess is usually the first phase of the work. We consolidate scattered systems into a governed lakehouse with lineage and quality gates, then build the AI on top. Skipping that step is how pilots die.',
  },
  {
    q: 'Who owns the IP?',
    a: 'You do. Code, models, pipelines, and documentation are yours from day one. We keep nothing proprietary between you and your own platform.',
  },
  {
    q: 'What happens after launch?',
    a: 'Either your team runs it with our runbooks, or we run it under SLAs with on-call rotations and monthly reviews. Systems we built and systems we inherited both qualify.',
  },
];

export default function V4FAQ() {
  return (
    <section style={{ padding: '48px 24px 96px' }}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <Reveal tier="sm">
            <span className="v4-eyebrow">FAQ</span>
          </Reveal>
          <Reveal tier="md">
            <h2 className="v4-h2" style={{ marginTop: 14, maxWidth: 420 }}>
              The questions buyers actually ask.
            </h2>
          </Reveal>
          <Reveal tier="sm" delay={0.1}>
            <p style={{ margin: '18px 0 0', maxWidth: 400, font: '400 15.5px/1.6 var(--font-funnel-sans)', color: 'var(--v4-muted)' }}>
              Anything else, ask a person instead:{' '}
              <a href="mailto:info@aciinfotech.com" style={{ color: 'var(--v4-royal)', textDecoration: 'none', fontWeight: 500 }}>
                info@aciinfotech.com
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal tier="md" delay={0.08}>
          <div style={{ borderTop: '1px solid var(--v4-mist)' }}>
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} question={f.q} defaultOpen={i === 0}>
                {f.a}
              </AccordionItem>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
