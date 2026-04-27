'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function QuantumComputer() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Mesh>(null);
  const ringBRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerRef.current) {
      outerRef.current.rotation.x = t * 0.15;
      outerRef.current.rotation.y = t * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.2;
      innerRef.current.rotation.z = t * 0.15;
    }
    if (ringARef.current) {
      ringARef.current.rotation.x = t * 0.3;
      ringARef.current.rotation.y = t * 0.1;
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.y = t * 0.25;
      ringBRef.current.rotation.z = t * 0.15;
    }
    if (glowRef.current) {
      const pulse = 0.08 + Math.sin(t * 1.5) * 0.03;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  return (
    <group position={[0, 4, -46]}>
      {/* Outer lattice */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#111111"
          emissive="#C4FF61"
          emissiveIntensity={0.2}
          wireframe
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner core */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#C4FF61"
          emissive="#C4FF61"
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Orbital ring A */}
      <mesh ref={ringARef}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#C4FF61"
          emissive="#C4FF61"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Orbital ring B */}
      <mesh ref={ringBRef}>
        <torusGeometry args={[1.8, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#2DD4BF"
          emissive="#2DD4BF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.5, 24, 24]} />
        <meshBasicMaterial
          color="#C4FF61"
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point light from core */}
      <pointLight intensity={2} color="#C4FF61" distance={20} decay={2} />
    </group>
  );
}
