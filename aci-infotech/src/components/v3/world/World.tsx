'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { Fireflies } from './creatures/Fireflies';
import { Hummingbird } from './creatures/Hummingbird';
import { FogLayer } from './environment/FogLayer';
import { WaterSurface } from './environment/WaterSurface';
import { GodRays } from './environment/GodRays';
import { Vegetation } from './environment/Vegetation';
import { AciLogo3D } from './structures/AciLogo3D';
import { PipelineCluster } from './structures/PipelineCluster';
import { QuantumComputer } from './structures/QuantumComputer';

export default function World() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: '#0A0A0A',
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, 1.5]}
        camera={{ fov: 60, near: 0.1, far: 200 }}
      >
        <color attach="background" args={['#0A0A0A']} />
        <fog attach="fog" args={['#0A0A0A', 20, 80]} />

        <Suspense fallback={null}>
          <CameraRig />
          <ambientLight intensity={0.15} />
          <directionalLight
            position={[10, 20, 5]}
            intensity={0.4}
            color="#ffeedd"
          />
          <pointLight
            position={[0, 5, 0]}
            intensity={0.6}
            color="#C4FF61"
            distance={30}
            decay={2}
          />

          <Fireflies count={3000} />
          <Hummingbird position={[3, 6, 2]} speed={0.8} range={4} />
          <Hummingbird position={[-4, 7, -8]} speed={1.1} range={3} />
          <Hummingbird position={[2, 5, -15]} speed={0.9} range={5} />
          <Hummingbird position={[-3, 4, -30]} speed={1.0} range={3} />
          <FogLayer />
          <GodRays />
          <WaterSurface />
          <Vegetation />
          <AciLogo3D />
          <PipelineCluster />
          <QuantumComputer />
        </Suspense>
      </Canvas>
    </div>
  );
}
