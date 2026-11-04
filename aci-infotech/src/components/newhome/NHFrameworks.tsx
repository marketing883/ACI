'use client';

// Frameworks: a split-screen on midnight. On the left, four frameworks as
// a vertical selector with a progress line that walks down on its own
// every few seconds (and stops once someone picks one). On the right, a
// live diagram: source nodes feeding a central framework hub and on into
// outputs, with dashes of light flowing along every link, a hub that
// pulses, and the whole drawing leaning with the pointer. Below it, the
// business problem against what the framework gives back.

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Eyebrow, Grain } from './motion';
import { FRAMEWORKS } from './deck-data';
import { EASE } from './tokens';

const DIAGRAMS: Record<string, { inputs: string[]; hub: string; outputs: string[] }> = {
  observability: { inputs: ['Sources', 'Pipelines', 'Warehouse'], hub: 'Observe', outputs: ['Lineage', 'Latency', 'Alerts'] },
  quality: { inputs: ['Custom metrics', 'Standard metrics', 'Audit logs'], hub: 'Validate', outputs: ['Drift metrics', 'Dashboards', 'Alerts'] },
  lineage: { inputs: ['Spark SQL', 'Python', 'Jobs'], hub: 'Spline', outputs: ['Table lineage', 'Column lineage', 'REST API'] },
  fabric: { inputs: ['Strategy', 'Design & Setup', 'Deployment'], hub: 'Fabric', outputs: ['OneLake', 'Governance', 'Roadmap'] },
};

function Diagram({ k }: { k: string }) {
  const d = DIAGRAMS[k];
  const ys = [70, 160, 250];
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label={`${d.hub} framework diagram`}>
      <defs>
        <linearGradient id="nh-link" x1="0" x2="1">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="nh-hub">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1d4ed8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {ys.map((y, i) => (
        <g key={`in-${i}`}>
          <path d={`M150 ${y} C 230 ${y}, 240 160, 320 160`} stroke="url(#nh-link)" strokeWidth="1.5" fill="none" />
          <path d={`M150 ${y} C 230 ${y}, 240 160, 320 160`} stroke="#67e8f9" strokeWidth="2" fill="none" strokeDasharray="6 160" className="nh-flow" style={{ animationDelay: `${i * 0.4}s` }} />
          <path d={`M320 160 C 400 160, 410 ${y}, 490 ${y}`} stroke="url(#nh-link)" strokeWidth="1.5" fill="none" />
          <path d={`M320 160 C 400 160, 410 ${y}, 490 ${y}`} stroke="#a3e635" strokeWidth="2" fill="none" strokeDasharray="6 160" className="nh-flow" style={{ animationDelay: `${0.8 + i * 0.4}s` }} />
        </g>
      ))}
      <circle cx="320" cy="160" r="78" fill="url(#nh-hub)" className="nh-pulse" />
      <circle cx="320" cy="160" r="44" fill="#0a1024" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="320" y="165" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">{d.hub}</text>
      {d.inputs.map((t, i) => (
        <g key={t}>
          <rect x="10" y={ys[i] - 18} width="140" height="36" rx="18" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" />
          <text x="80" y={ys[i] + 5} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="12">{t}</text>
        </g>
      ))}
      {d.outputs.map((t, i) => (
        <g key={t}>
          <rect x="490" y={ys[i] - 18} width="140" height="36" rx="18" fill="rgba(163,230,53,0.08)" stroke="rgba(163,230,53,0.35)" />
          <text x="560" y={ys[i] + 5} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="12">{t}</text>
        </g>
      ))}
    </svg>
  );
}

export default function NHFrameworks({ headingClass }: { headingClass: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 80, damping: 16 });
  const ry = useSpring(mx, { stiffness: 80, damping: 16 });

  useEffect(() => {
    if (!auto || reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % FRAMEWORKS.length), 6500);
    return () => clearInterval(id);
  }, [auto, reduce]);

  const f = FRAMEWORKS[active];

  return (
    <section id="frameworks" className="relative overflow-hidden bg-[#0a1024] py-28 text-white md:py-36">
      <div aria-hidden="true" className="nh-aurora absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[#1d4ed8]/30 blur-[140px]" />
      <Grain />
      <div className="relative mx-auto max-w-7xl px-6">
        <Eyebrow>Frameworks</Eyebrow>
        <h2 className={`[color:inherit] mt-6 max-w-3xl text-[clamp(2.3rem,4.8vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${headingClass}`}>
          Data you can <span className="nh-accent-gradient">trust,</span> by&nbsp;design.
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.4fr]">
          <ol className="relative space-y-1 border-l border-white/12">
            {FRAMEWORKS.map((fw, i) => (
              <li key={fw.key}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setAuto(false);
                  }}
                  aria-pressed={i === active}
                  className={`relative w-full py-4 pl-6 text-left transition-colors duration-300 ${i === active ? 'text-white' : 'text-white/45 hover:text-white/75'}`}
                >
                  {i === active ? (
                    <motion.span layoutId="nh-fw-bar" className="absolute -left-px top-0 h-full w-0.5 bg-gradient-to-b from-[#3b82f6] to-[#22d3ee]" transition={{ duration: 0.5, ease: EASE }} />
                  ) : null}
                  <span className="text-xs tabular-nums text-white/40">0{i + 1}</span>
                  <span className={`mt-1 block text-xl font-semibold md:text-2xl ${headingClass}`}>{fw.title}</span>
                  {i === active && auto && !reduce ? (
                    <motion.span key={`t-${active}`} className="absolute bottom-0 left-6 h-px bg-white/40" initial={{ width: 0 }} animate={{ width: 'calc(100% - 1.5rem)' }} transition={{ duration: 6.5, ease: 'linear' }} />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>

          <div
            onMouseMove={(e) => {
              if (reduce) return;
              const r = e.currentTarget.getBoundingClientRect();
              mx.set(((e.clientX - r.left) / r.width - 0.5) * 8);
              my.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
            }}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
            className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8"
            style={{ perspective: 1000 }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={f.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease: EASE }}>
                <motion.div style={{ rotateX: rx, rotateY: ry }} className="aspect-[2/1] w-full">
                  <Diagram k={f.key} />
                </motion.div>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75">{f.summary}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">The business problem</div>
                    <ul className="mt-3 space-y-2">
                      {f.problem.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm text-white/60">
                          <X size={14} className="mt-0.5 shrink-0 text-[#f87171]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635]">What it gives back</div>
                    <ul className="mt-3 space-y-2">
                      {f.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                          <Check size={14} className="mt-0.5 shrink-0 text-[#a3e635]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
