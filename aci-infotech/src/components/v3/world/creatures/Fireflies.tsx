'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FirefliesProps {
  count?: number;
}

export function Fireflies({ count = 3000 }: FirefliesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 60,
        y: Math.random() * 15,
        z: (Math.random() - 0.5) * 80 - 10,
        speed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 2,
        scale: 0.02 + Math.random() * 0.04,
      });
    }
    return arr;
  }, [count]);

  const color = useMemo(() => new THREE.Color('#C4FF61'), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const wobbleX = Math.sin(t * p.speed + p.phase) * 0.3;
      const wobbleY = Math.cos(t * p.speed * 0.7 + p.phase) * 0.2;
      const wobbleZ = Math.sin(t * p.speed * 0.5 + p.phase * 1.3) * 0.3;

      dummy.position.set(
        p.x + wobbleX,
        p.y + wobbleY,
        p.z + wobbleZ
      );

      const pulse = 0.5 + 0.5 * Math.sin(t * p.pulseSpeed + p.phase);
      const s = p.scale * (0.6 + pulse * 0.4);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </instancedMesh>
  );
}
