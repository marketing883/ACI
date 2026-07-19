'use client';

import { useState } from 'react';
import FadingVideo from '@/components/v4/hero/FadingVideo';
import { v4Display } from '@/components/v4/fonts';
import mapData from './world-map-data.json';

const VIDEO = '/videos/v4-editorial-signal.mp4';
const VIDEO_WEBM = '/videos/v4-editorial-signal.webm';

type Office = { city: string; hq: boolean; region: string; x: number; y: number };

const { width: MAP_W, height: MAP_H } = mapData;
const DOTS = mapData.dots as [number, number][];
const OFFICES = mapData.offices as Office[];

// Label placement: which side of the marker the city name sits on, so
// neighboring labels (Noida/Hyderabad/Bangalore, Atlanta/Miami) never
// collide. Tuned by hand against the generated projection.
const LABEL_SIDE: Record<string, { dx: number; dy: number; anchor: 'start' | 'end' | 'middle' }> = {
  'Somerset, NJ': { dx: 8, dy: -6, anchor: 'start' },
  Atlanta: { dx: 8, dy: 2, anchor: 'start' },
  Dallas: { dx: -8, dy: 2, anchor: 'end' },
  Miami: { dx: 8, dy: 8, anchor: 'start' },
  London: { dx: -8, dy: -5, anchor: 'end' },
  Dubai: { dx: -8, dy: 8, anchor: 'end' },
  Noida: { dx: 7, dy: -6, anchor: 'start' },
  Hyderabad: { dx: 9, dy: 4, anchor: 'start' },
  Bangalore: { dx: -8, dy: 9, anchor: 'end' },
  'Kuala Lumpur': { dx: -9, dy: 2, anchor: 'end' },
  Singapore: { dx: 9, dy: 8, anchor: 'start' },
};

const REGIONS: { name: string; cities: string[] }[] = [
  { name: 'Americas', cities: ['Somerset, NJ (HQ)', 'Atlanta', 'Dallas', 'Miami'] },
  { name: 'Europe', cities: ['London'] },
  { name: 'Middle East', cities: ['Dubai'] },
  { name: 'Asia', cities: ['Noida', 'Hyderabad', 'Bangalore', 'Kuala Lumpur', 'Singapore'] },
];

/**
 * Full-width dark band: the homepage header video under a heavy veil,
 * with a dotted world map on top marking all 11 ACI offices. The dot
 * grid is generated from real land geometry (scripts/generate-world-dots.mjs),
 * so continents and city positions are accurate, not decorative.
 */
export default function GlobalOfficesBand({ headingClass = v4Display }: { headingClass?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative isolate overflow-hidden bg-[#070d1a] text-white">
      {/* Homepage header video, reframed for a wide short band and
          buried deeper under the veil so the map stays the subject. */}
      <FadingVideo
        src={VIDEO}
        webmSrc={VIDEO_WEBM}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'saturate(0.7) brightness(0.55)' }}
        scale={1.06}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,13,26,0.92) 0%, rgba(7,13,26,0.72) 35%, rgba(7,13,26,0.78) 70%, rgba(7,13,26,0.95) 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#84CC16]">/ Where we are</p>
        <h2
          className={`mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl ${headingClass}`}
          style={{ lineHeight: 1.08 }}
        >
          One firm, <span className="text-[#60A5FA]">eleven offices.</span>
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
                      <circle cx={o.x} cy={o.y} r={3.4} fill="#84CC16" />
                    </>
                  ) : (
                    <>
                      <circle cx={o.x} cy={o.y} r={7} fill="transparent" />
                      <circle
                        cx={o.x}
                        cy={o.y}
                        r={isActive ? 3.4 : 2.6}
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
                    fill={o.hq ? '#84CC16' : isActive ? '#ffffff' : 'rgba(255,255,255,0.82)'}
                    style={{ letterSpacing: '0.02em' }}
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
