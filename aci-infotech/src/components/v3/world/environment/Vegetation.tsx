'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';

function Fern({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5 + position[0]) * 0.05;
  });

  return (
    <Billboard position={position}>
      <group ref={meshRef} scale={scale}>
        <mesh>
          <planeGeometry args={[1.2, 1.8]} />
          <meshStandardMaterial
            color="#0a2a0a"
            emissive="#1a4a1a"
            emissiveIntensity={0.1}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Billboard>
  );
}

function GlowMushroom({ position, color = '#C4FF61' }: { position: [number, number, number]; color?: string }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 1.5 + position[0] * 2) * 0.08;
  });

  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.3, 6]} />
        <meshStandardMaterial color="#2a2a1a" roughness={0.8} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.08, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Glow */}
      <mesh ref={glowRef} position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function Vegetation() {
  const ferns = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 50,
          Math.random() * 0.5,
          (Math.random() - 0.5) * 70 - 5,
        ],
        scale: 0.4 + Math.random() * 0.8,
      });
    }
    return arr;
  }, []);

  const mushrooms = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string }[] = [];
    const colors = ['#C4FF61', '#2DD4BF', '#61DAFB', '#C4FF61'];
    for (let i = 0; i < 30; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 40,
          -0.3 + Math.random() * 0.2,
          (Math.random() - 0.5) * 60 - 8,
        ],
        color: colors[i % colors.length],
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {ferns.map((f, i) => (
        <Fern key={`f-${i}`} position={f.pos} scale={f.scale} />
      ))}
      {mushrooms.map((m, i) => (
        <GlowMushroom key={`m-${i}`} position={m.pos} color={m.color} />
      ))}
    </group>
  );
}
