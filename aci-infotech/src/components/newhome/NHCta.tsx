'use client';

// Final call to action: an aurora of cobalt, violet, and cyan light that
// drifts behind a frosted panel, with the closer line from the playbook
// vault and two magnetic buttons.

import { Grain, MagneticLink, Reveal, SplitHeadline } from './motion';

export default function NHCta({ headingClass }: { headingClass: string }) {
  return (
    <section id="start" className="relative overflow-hidden bg-[#05070d] px-6 py-24 text-white md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="nh-aurora absolute left-[5%] top-[10%] h-[55vh] w-[55vh] rounded-full bg-[#1d4ed8] opacity-60 blur-[110px]" />
        <div className="nh-aurora-slow absolute right-[8%] top-[25%] h-[50vh] w-[50vh] rounded-full bg-[#7c3aed] opacity-40 blur-[120px]" />
        <div className="nh-aurora absolute bottom-[-10%] left-[40%] h-[45vh] w-[45vh] rounded-full bg-[#22d3ee] opacity-30 blur-[120px]" />
      </div>
      <Grain opacity={0.09} />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/15 bg-white/[0.05] px-6 py-16 text-center shadow-[0_40px_160px_-40px_rgba(29,78,216,0.7)] backdrop-blur-2xl md:px-16 md:py-24">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Can&rsquo;t find your scenario?</span>
        </Reveal>
        <SplitHeadline
          lines={['Bring the mess.', '*We’ll bring the blueprint.*']}
          className={`mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-[1] tracking-[-0.035em] ${headingClass}`}
          accentClassName="nh-accent-gradient"
        />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Start with a conversation. Advisory engagements produce a written plan within 48 hours, and a
            build pod can be shipping within two&nbsp;weeks.
          </p>
        </Reveal>
        <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <MagneticLink href="/contact">Start a project</MagneticLink>
          <MagneticLink href="/contact" variant="ghost">
            Talk to an architect
          </MagneticLink>
        </Reveal>
      </div>
    </section>
  );
}
