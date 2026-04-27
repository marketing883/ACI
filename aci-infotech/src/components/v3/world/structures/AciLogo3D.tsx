'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AciLogo3D() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 4, 0]}>
      {/* Core shape */}
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#C4FF61"
          emissive="#C4FF61"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Orbital ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#C4FF61"
          emissive="#C4FF61"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial
          color="#C4FF61"
          transparent
          opacity={0.04}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
