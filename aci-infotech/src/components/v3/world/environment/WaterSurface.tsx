'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WaterSurface() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const positions = (meshRef.current.geometry as THREE.PlaneGeometry).attributes.position;
    const t = clock.getElapsedTime();

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      positions.setY(
        i,
        Math.sin(x * 0.3 + t * 0.4) * 0.08 +
        Math.cos(z * 0.2 + t * 0.3) * 0.06
      );
    }
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.5, -20]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100, 64, 64]} />
      <meshStandardMaterial
        color="#0A1A1A"
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.6}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}
