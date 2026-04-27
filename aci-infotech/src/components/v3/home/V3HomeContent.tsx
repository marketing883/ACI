'use client';

import dynamic from 'next/dynamic';
import { ZoneHero } from '../zones/ZoneHero';
import { ZoneImpact } from '../zones/ZoneImpact';
import { ZoneWork } from '../zones/ZoneWork';
import { ZoneServices } from '../zones/ZoneServices';
import { ZoneChat } from '../zones/ZoneChat';
import { ZoneProof } from '../zones/ZoneProof';
import { ZoneLab } from '../zones/ZoneLab';
import { ZoneCTA } from '../zones/ZoneCTA';
import '@/styles/design-system-v3.css';

const World = dynamic(() => import('../world/World'), { ssr: false });

const TOTAL_HEIGHT_VH = 800;

const zones = [
  { top: '0%',    height: '12%',  Component: ZoneHero },
  { top: '12%',   height: '10%',  Component: ZoneImpact },
  { top: '22%',   height: '26%',  Component: ZoneWork },
  { top: '48%',   height: '14%',  Component: ZoneServices },
  { top: '62%',   height: '10%',  Component: ZoneChat },
  { top: '72%',   height: '8%',   Component: ZoneProof },
  { top: '80%',   height: '10%',  Component: ZoneLab },
  { top: '90%',   height: '10%',  Component: ZoneCTA },
];

export default function V3HomeContent() {
  return (
    <div
      style={{
        background: 'var(--v3-bg)',
        color: 'var(--v3-text)',
        fontFamily: 'var(--v3-font-body)',
      }}
    >
      <World />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: `${TOTAL_HEIGHT_VH}vh`,
          pointerEvents: 'none',
        }}
      >
        {zones.map(({ top, height, Component }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top,
              left: 0,
              width: '100%',
              height,
              pointerEvents: 'auto',
            }}
          >
            <Component />
          </div>
        ))}
      </div>
    </div>
  );
}
