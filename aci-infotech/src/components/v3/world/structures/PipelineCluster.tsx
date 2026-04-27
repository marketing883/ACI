'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PIPE_COUNT = 12;

function createPipeCurve(index: number): THREE.CatmullRomCurve3 {
  const angle = (index / PIPE_COUNT) * Math.PI * 2;
  const radius = 0.4 + Math.random() * 0.8;
  const twist = 0.3 + Math.random() * 0.5;

  const points = [];
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const y = t * 12 - 2;
    const spiralAngle = angle + t * twist * Math.PI;
    const r = radius * (1 - t * 0.3) + Math.sin(t * Math.PI) * 0.3;
    points.push(new THREE.Vector3(
      Math.cos(spiralAngle) * r,
      y,
      Math.sin(spiralAngle) * r
    ));
  }
  return new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
}

function DataPipe({ curve, speed, color }: { curve: THREE.CatmullRomCurve3; speed: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const pulseProgress = useRef(Math.random());

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 48, 0.035, 8, false);
  }, [curve]);

  useFrame(({ clock }) => {
    pulseProgress.current = (pulseProgress.current + speed * 0.003) % 1;
    if (pulseRef.current) {
      const pos = curve.getPointAt(pulseProgress.current);
      pulseRef.current.position.copy(pos);
      const scale = 0.06 + Math.sin(clock.getElapsedTime() * 3) * 0.02;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#1a2a1a"
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function PipelineCluster() {
  const pipes = useMemo(() => {
    return Array.from({ length: PIPE_COUNT }, (_, i) => ({
      curve: createPipeCurve(i),
      speed: 0.5 + Math.random() * 1.5,
      color: i % 3 === 0 ? '#C4FF61' : i % 3 === 1 ? '#2DD4BF' : '#61DAFB',
    }));
  }, []);

  return (
    <group position={[0, 0, -4]}>
      {pipes.map((pipe, i) => (
        <DataPipe key={i} curve={pipe.curve} speed={pipe.speed} color={pipe.color} />
      ))}
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#C4FF61" distance={15} decay={2} />
    </group>
  );
}
