'use client';

// Frameworks: a split-screen on midnight, sized so the whole scene sits in
// one viewport on desktop. On the left, the heading and four frameworks
// as a vertical selector with a progress line that walks down on its own
// every few seconds (and stops once someone picks one). On the right, one
// panel holds everything for the selected framework: a live diagram
// (sources feeding a hub and on into outputs, dashes of light flowing
// along every link, a pulsing hub, the drawing leaning with the pointer),
// the summary, and the business problem against what it gives back.
// Below lg the selector becomes a swipeable row of pills above the panel.

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

// Diagram geometry (viewBox 640 x 200): three rows, a hub in the middle.
const W = 640;
const H = 200;
const CY = H / 2;
const ROWS = [34, CY, H - 34];
const PILL_W = 136;

function Diagram({ k }: { k: string }) {
  const d = DIAGRAMS[k];
  const inX = 8 + PILL_W;
  const outX = W - 8 - PILL_W;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`${d.hub} framework diagram`}>
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
      {ROWS.map((y, i) => {
        const inPath = `M${inX} ${y} C ${inX + 80} ${y}, ${W / 2 - 80} ${CY}, ${W / 2} ${CY}`;
        const outPath = `M${W / 2} ${CY} C ${W / 2 + 80} ${CY}, ${outX - 80} ${y}, ${outX} ${y}`;
        return (
          <g key={i}>
            <path d={inPath} stroke="url(#nh-link)" strokeWidth="1.5" fill="none" />
            <path d={inPath} stroke="#67e8f9" strokeWidth="2" fill="none" strokeDasharray="6 160" className="nh-flow" style={{ animationDelay: `${i * 0.4}s` }} />
            <path d={outPath} stroke="url(#nh-link)" strokeWidth="1.5" fill="none" />
            <path d={outPath} stroke="#a3e635" strokeWidth="2" fill="none" strokeDasharray="6 160" className="nh-flow" style={{ animationDelay: `${0.8 + i * 0.4}s` }} />
          </g>
        );
      })}
      <circle cx={W / 2} cy={CY} r="70" fill="url(#nh-hub)" className="nh-pulse" style={{ transformOrigin: `${W / 2}px ${CY}px` }} />
      <circle cx={W / 2} cy={CY} r="40" fill="#0a1024" stroke="#3b82f6" strokeWidth="1.5" />
      <text x={W / 2} y={CY + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="600">
        {d.hub}
      </text>
      {d.inputs.map((t, i) => (
        <g key={t}>
          <rect x="8" y={ROWS[i] - 17} width={PILL_W} height="34" rx="17" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" />
          <text x={8 + PILL_W / 2} y={ROWS[i] + 4} textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="12.5">
            {t}
          </text>
        </g>
      ))}
      {d.outputs.map((t, i) => (
        <g key={t}>
          <rect x={outX} y={ROWS[i] - 17} width={PILL_W} height="34" rx="17" fill="rgba(163,230,53,0.08)" stroke="rgba(163,230,53,0.35)" />
          <text x={outX + PILL_W / 2} y={ROWS[i] + 4} textAnchor="middle" fill="rgba(255,255,255,0.88)" fontSize="12.5">
            {t}
          </text>
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

  const pick = (i: number) => {
    setActive(i);
    setAuto(false);
  };
  const f = FRAMEWORKS[active];

  return (
    <section id="frameworks" className="relative overflow-hidden bg-[#0a1024] py-24 text-white md:py-28 lg:flex lg:min-h-screen lg:items-center lg:py-14">
      <div aria-hidden="true" className="nh-aurora absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[#1d4ed8]/30 blur-[140px]" />
      <Grain />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[0.78fr_1.4fr] lg:items-center lg:gap-12">
        {/* Left: heading + selector. min-w-0 stops the pill row from
            widening the grid column past the screen on phones. */}
        <div className="min-w-0">
          <Eyebrow>Frameworks</Eyebrow>
          <h2 className={`[color:inherit] mt-5 text-[clamp(2.1rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${headingClass}`}>
            Data you can <span className="nh-accent-gradient">trust,</span> by&nbsp;design.
          </h2>

          {/* Desktop: vertical selector */}
          <ol className="relative mt-10 hidden space-y-1 border-l border-white/12 lg:block">
            {FRAMEWORKS.map((fw, i) => (
              <li key={fw.key}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={i === active}
                  className={`relative w-full py-3 pl-6 text-left transition-colors duration-300 ${i === active ? 'text-white' : 'text-white/45 hover:text-white/75'}`}
                >
                  {i === active ? (
                    <motion.span layoutId="nh-fw-bar" className="absolute -left-px top-0 h-full w-0.5 bg-gradient-to-b from-[#3b82f6] to-[#22d3ee]" transition={{ duration: 0.5, ease: EASE }} />
                  ) : null}
                  <span className="text-xs tabular-nums text-white/40">0{i + 1}</span>
                  <span className={`mt-0.5 block text-lg font-semibold leading-snug xl:text-xl ${headingClass}`}>{fw.title}</span>
                  {i === active && auto && !reduce ? (
                    <motion.span
                      key={`t-${active}`}
                      className="absolute bottom-0 left-6 h-px bg-white/40"
                      initial={{ width: 0 }}
                      animate={{ width: 'calc(100% - 1.5rem)' }}
                      transition={{ duration: 6.5, ease: 'linear' }}
                    />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>

          {/* Mobile and tablet: swipeable pills */}
          <div className="nh-scroll-hide -mx-6 mt-8 flex gap-2 overflow-x-auto px-6 lg:hidden">
            {FRAMEWORKS.map((fw, i) => (
              <button
                key={fw.key}
                type="button"
                onClick={() => pick(i)}
                aria-pressed={i === active}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                  i === active ? 'border-[#3b82f6] bg-[#1d4ed8] text-white' : 'border-white/15 text-white/65'
                }`}
              >
                {fw.title.replace(' Framework', '').replace(' Solution', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Right: the whole framework in one panel */}
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
          className="min-w-0 rounded-[26px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-7"
          style={{ perspective: 1000 }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={f.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASE }}>
              <h3 className={`[color:inherit] text-lg font-semibold lg:hidden ${headingClass}`}>{f.title}</h3>
              <motion.div style={{ rotateX: rx, rotateY: ry, aspectRatio: `${W} / ${H}` }} className="mt-3 hidden w-full sm:block lg:mt-0">
                <Diagram k={f.key} />
              </motion.div>
              {/* Phones: the same flow, stacked, so labels stay readable */}
              <div className="mt-4 flex flex-col items-center gap-2 sm:hidden" aria-hidden="true">
                <div className="flex flex-wrap justify-center gap-1.5">
                  {DIAGRAMS[f.key].inputs.map((t) => (
                    <span key={t} className="rounded-full border border-white/18 bg-white/5 px-3 py-1 text-xs text-white/80">{t}</span>
                  ))}
                </div>
                <span className="h-5 w-px bg-gradient-to-b from-[#3b82f6] to-[#22d3ee]" />
                <span className="rounded-full border border-[#3b82f6] bg-[#0a1024] px-5 py-2 text-sm font-semibold shadow-[0_0_30px_rgba(59,130,246,0.6)]">{DIAGRAMS[f.key].hub}</span>
                <span className="h-5 w-px bg-gradient-to-b from-[#22d3ee] to-[#a3e635]" />
                <div className="flex flex-wrap justify-center gap-1.5">
                  {DIAGRAMS[f.key].outputs.map((t) => (
                    <span key={t} className="rounded-full border border-[#a3e635]/35 bg-[#a3e635]/10 px-3 py-1 text-xs text-white/85">{t}</span>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-[15px]">{f.summary}</p>
              <div className="mt-5 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">The business problem</div>
                  <ul className="mt-2.5 space-y-1.5">
                    {f.problem.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-[13px] leading-snug text-white/60">
                        <X size={13} className="mt-0.5 shrink-0 text-[#f87171]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635]">What it gives back</div>
                  <ul className="mt-2.5 space-y-1.5">
                    {f.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] leading-snug text-white/80">
                        <Check size={13} className="mt-0.5 shrink-0 text-[#a3e635]" />
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
    </section>
  );
}
