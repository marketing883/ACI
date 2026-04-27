'use client';

import dynamic from 'next/dynamic';
import { ZoneHero } from '../zones/ZoneHero';
import { ZoneImpact } from '../zones/ZoneImpact';
import '@/styles/design-system-v3.css';

const World = dynamic(() => import('../world/World'), { ssr: false });

const TOTAL_ZONES = 8;
const VH_PER_ZONE = 100;

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

      {/* Scroll spacer — creates the scroll height the camera rides on */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: `${TOTAL_ZONES * VH_PER_ZONE}vh`,
          pointerEvents: 'none',
        }}
      >
        {/* Zone 1: Hero */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '12%', pointerEvents: 'auto' }}>
          <ZoneHero />
        </div>

        {/* Zone 2: Impact metrics */}
        <div style={{ position: 'absolute', top: '12%', left: 0, width: '100%', height: '10%', pointerEvents: 'auto' }}>
          <ZoneImpact />
        </div>

        {/* Zone 3-8 placeholders — will be built next */}
      </div>
    </div>
  );
}
