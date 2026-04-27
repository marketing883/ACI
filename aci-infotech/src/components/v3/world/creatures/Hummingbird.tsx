'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HummingbirdProps {
  position: [number, number, number];
  speed?: number;
  range?: number;
}

export function Hummingbird({ position, speed = 1, range = 3 }: HummingbirdProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wingLRef = useRef<THREE.Mesh>(null);
  const wingRRef = useRef<THREE.Mesh>(null);
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    if (groupRef.current) {
      groupRef.current.position.set(
        basePos.x + Math.sin(t * 0.4 + phase) * range,
        basePos.y + Math.sin(t * 0.6 + phase) * 0.8 + Math.cos(t * 0.3) * 0.3,
        basePos.z + Math.cos(t * 0.35 + phase) * range * 0.6
      );

      const moveDir = Math.sin(t * 0.4 + phase + 0.1) - Math.sin(t * 0.4 + phase);
      groupRef.current.rotation.y = moveDir * 2;
      groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    }

    const wingFlap = Math.sin(t * 40) * 0.8;
    if (wingLRef.current) wingLRef.current.rotation.z = wingFlap;
    if (wingRRef.current) wingRRef.current.rotation.z = -wingFlap;
  });

  return (
    <group ref={groupRef} position={position} scale={0.12}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
        <meshStandardMaterial
          color="#1a3a2a"
          emissive="#C4FF61"
          emissiveIntensity={0.15}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial
          color="#2a4a3a"
          emissive="#C4FF61"
          emissiveIntensity={0.1}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 1, 0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.05, 0.6, 4]} />
        <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left wing */}
      <group position={[-0.3, 0.3, 0]}>
        <mesh ref={wingLRef}>
          <planeGeometry args={[1.2, 0.4]} />
          <meshStandardMaterial
            color="#C4FF61"
            emissive="#C4FF61"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Right wing */}
      <group position={[0.3, 0.3, 0]}>
        <mesh ref={wingRRef}>
          <planeGeometry args={[1.2, 0.4]} />
          <meshStandardMaterial
            color="#C4FF61"
            emissive="#C4FF61"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[0, -0.8, -0.1]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[0.3, 0.6]} />
        <meshStandardMaterial
          color="#1a3a2a"
          emissive="#2DD4BF"
          emissiveIntensity={0.1}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
