'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GodRays() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child: THREE.Object3D, i: number) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.02 + Math.sin(t * 0.15 + i * 1.2) * 0.015;
    });
  });

  const rays = [
    { x: -5, z: -5, rotZ: 0.15, width: 3, height: 30 },
    { x: 3, z: -12, rotZ: -0.1, width: 2.5, height: 28 },
    { x: -8, z: -20, rotZ: 0.2, width: 4, height: 32 },
    { x: 6, z: -30, rotZ: -0.15, width: 3, height: 26 },
    { x: -2, z: -40, rotZ: 0.08, width: 2, height: 30 },
  ];

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh
          key={i}
          position={[ray.x, 15, ray.z]}
          rotation={[0, 0, ray.rotZ]}
        >
          <planeGeometry args={[ray.width, ray.height]} />
          <meshBasicMaterial
            color="#ffeedd"
            transparent
            opacity={0.025}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
