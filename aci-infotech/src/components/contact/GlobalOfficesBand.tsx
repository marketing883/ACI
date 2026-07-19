'use client';

import { useState } from 'react';
import { v4Display } from '@/components/v4/fonts';
import mapData from './world-map-data.json';

type Office = { city: string; hq: boolean; region: string; x: number; y: number };

const { width: MAP_W, height: MAP_H } = mapData;
const DOTS = mapData.dots as [number, number][];
const OFFICES = mapData.offices as Office[];

// Label placement: which side of the marker the city name sits on, so
// neighboring labels (Noida/Hyderabad/Bangalore, Atlanta/Miami) never
// collide. Tuned by hand against the generated projection.
const LABEL_SIDE: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' | 'middle' }> = {
  'Somerset, NJ': { dx: 11, dy: -8, anchor: 'start' },
  Atlanta: { dx: 11, dy: 3, anchor: 'start' },
  Dallas: { dx: -11, dy: 3, anchor: 'end' },
  Miami: { dx: 11, dy: 10, anchor: 'start' },
  London: { dx: -11, dy: -6, anchor: 'end' },
  Dubai: { dx: -11, dy: 10, anchor: 'end' },
  Noida: { dx: 10, dy: -8, anchor: 'start' },
  Hyderabad: { dx: 12, dy: 4, anchor: 'start' },
  Bangalore: { dx: -11, dy: 11, anchor: 'end' },
  'Kuala Lumpur': { dx: -12, dy: 3, anchor: 'end' },
  Singapore: { dx: 12, dy: 10, anchor: 'start' },
};

const REGIONS: { name: string; cities: string[] }[] = [
  { name: 'Americas', cities: ['Somerset, NJ (HQ)', 'Atlanta', 'Dallas', 'Miami'] },
  { name: 'Europe', cities: ['London'] },
  { name: 'Middle East', cities: ['Dubai'] },
  { name: 'Asia', cities: ['Noida', 'Hyderabad', 'Bangalore', 'Kuala Lumpur', 'Singapore'] },
];

/**
 * Full-width dark band with a dotted world map marking all 11 ACI
 * offices. The dot grid is generated from real land geometry
 * (scripts/generate-world-dots.mjs), so continents and city positions
 * are accurate, not decorative. Background is a quiet layered
 * gradient: anything busier fights the map.
 */
export default function GlobalOfficesBand({ headingClass = v4Display }: { headingClass?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative isolate overflow-hidden bg-[#070d1a] text-white">
      {/* Subtle depth: a cool glow behind the Atlantic, a faint lime
          breath near the HQ side, and a vignette holding the edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 55% at 42% 38%, rgba(29,78,216,0.14) 0%, transparent 70%)',
            'radial-gradient(ellipse 45% 40% at 28% 30%, rgba(132,204,22,0.05) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 50% at 78% 55%, rgba(96,165,250,0.07) 0%, transparent 70%)',
            'linear-gradient(180deg, #0a1122 0%, #070d1a 45%, #060b16 100%)',
          ].join(', '),
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#84CC16]">/ Where we are</p>
        <h2
          className={`mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl ${headingClass}`}
          style={{ lineHeight: 1.08 }}
        >
          We&apos;re probably in <span className="text-[#60A5FA]">your time&nbsp;zone.</span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
          Headquartered in Somerset, New Jersey, with delivery hubs across four regions.
          Someone is always awake when your platform needs them.
        </p>

        {/* The map. Dots are land; markers are offices. */}
        <div className="mt-10">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="w-full"
            role="img"
            aria-label="World map marking ACI Infotech offices in Somerset, Atlanta, Dallas, Miami, London, Dubai, Noida, Hyderabad, Bangalore, Kuala Lumpur, and Singapore"
          >
            <g fill="rgba(148,163,184,0.35)">
              {DOTS.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={1.15} />
              ))}
            </g>

            {/* Office markers */}
            {OFFICES.map((o) => {
              const side = LABEL_SIDE[o.city] ?? { dx: 8, dy: -6, anchor: 'start' as const };
              const isActive = active === o.city;
              return (
                <g
                  key={o.city}
                  onMouseEnter={() => setActive(o.city)}
                  onMouseLeave={() => setActive(null)}
                  className="cursor-default"
                >
                  {o.hq ? (
                    <>
                      <circle cx={o.x} cy={o.y} r={9} fill="rgba(132,204,22,0.15)">
                        <animate attributeName="r" values="6;11;6" dur="2.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.6s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={o.x} cy={o.y} r={6} fill="none" stroke="rgba(132,204,22,0.45)" strokeWidth={1} />
                      <circle cx={o.x} cy={o.y} r={3.4} fill="#84CC16" />
                    </>
                  ) : (
                    <>
                      <circle cx={o.x} cy={o.y} r={9} fill="transparent" />
                      {/* Soft glow + hairline ring lift the marker off the
                          dot grid without shouting. */}
                      <circle cx={o.x} cy={o.y} r={6.5} fill={isActive ? 'rgba(96,165,250,0.18)' : 'rgba(226,232,240,0.08)'} className="transition-all duration-200" />
                      <circle
                        cx={o.x}
                        cy={o.y}
                        r={5}
                        fill="none"
                        stroke={isActive ? 'rgba(96,165,250,0.7)' : 'rgba(226,232,240,0.35)'}
                        strokeWidth={1}
                        className="transition-all duration-200"
                      />
                      <circle
                        cx={o.x}
                        cy={o.y}
                        r={isActive ? 3 : 2.4}
                        fill={isActive ? '#60A5FA' : '#e2e8f0'}
                        className="transition-all duration-200"
                      />
                    </>
                  )}
                  <text
                    x={o.x + side.dx}
                    y={o.y + side.dy}
                    textAnchor={side.anchor}
                    fontSize={o.hq ? 11.5 : 10.5}
                    fontWeight={o.hq ? 700 : 600}
                    fill={o.hq ? '#A3E635' : isActive ? '#ffffff' : 'rgba(255,255,255,0.88)'}
                    stroke="#070d1a"
                    strokeWidth={3}
                    style={{ letterSpacing: '0.02em', paintOrder: 'stroke' }}
                  >
                    {o.city}
                    {o.hq ? ' · HQ' : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Region roster under the map */}
        <div className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <div key={r.name}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">{r.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{r.cities.join(' · ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
