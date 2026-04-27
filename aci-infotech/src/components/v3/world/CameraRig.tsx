'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';

const SPLINE_POINTS = [
  new THREE.Vector3(0, 12, 25),    // Zone 1: Arrival — above, looking down through canopy
  new THREE.Vector3(0, 8, 18),     // Zone 1→2: Descending
  new THREE.Vector3(0, 5, 10),     // Zone 2: Identity — clearing
  new THREE.Vector3(2, 4, 3),      // Zone 2→3: Approaching pipeline
  new THREE.Vector3(4, 3, -2),     // Zone 3: Selected Work — circling pipeline
  new THREE.Vector3(3, 6, -6),     // Zone 3→4: Rising above
  new THREE.Vector3(0, 14, -10),   // Zone 4: Services — aerial view
  new THREE.Vector3(-2, 8, -14),   // Zone 4→5: Descending to grove
  new THREE.Vector3(-3, 2, -18),   // Zone 5: Chat — mushroom grove
  new THREE.Vector3(0, 3, -22),    // Zone 5→6: Moving along forest floor
  new THREE.Vector3(2, 3, -28),    // Zone 6: Proof — partner emblems
  new THREE.Vector3(0, 5, -34),    // Zone 7: Lab — playbooks
  new THREE.Vector3(0, 4, -40),    // Zone 7→8: Following pipelines
  new THREE.Vector3(0, 5, -46),    // Zone 8: CTA — quantum computer reveal
];

const LOOKAT_POINTS = [
  new THREE.Vector3(0, 4, 0),      // Zone 1: Looking at logo
  new THREE.Vector3(0, 4, 0),      // Zone 1→2
  new THREE.Vector3(0, 3, 2),      // Zone 2: Looking at text area
  new THREE.Vector3(3, 3, -4),     // Zone 2→3
  new THREE.Vector3(0, 3, -4),     // Zone 3: Looking at pipeline center
  new THREE.Vector3(0, 3, -8),     // Zone 3→4
  new THREE.Vector3(0, 2, -12),    // Zone 4: Looking down at network
  new THREE.Vector3(-2, 1, -18),   // Zone 4→5
  new THREE.Vector3(-2, 1, -18),   // Zone 5: Looking at grove
  new THREE.Vector3(0, 2, -26),    // Zone 5→6
  new THREE.Vector3(0, 2, -30),    // Zone 6: Looking at partners
  new THREE.Vector3(0, 4, -38),    // Zone 7: Looking at playbooks
  new THREE.Vector3(0, 4, -46),    // Zone 7→8
  new THREE.Vector3(0, 4, -48),    // Zone 8: Looking at quantum computer
];

export function CameraRig() {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const currentPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  const positionCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(SPLINE_POINTS, false, 'centripetal', 0.5);
  }, []);

  const lookAtCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3(LOOKAT_POINTS, false, 'centripetal', 0.5);
  }, []);

  useFrame(() => {
    const progress = scrollYProgress.get();
    const t = Math.max(0, Math.min(1, progress));

    const targetPos = positionCurve.getPointAt(t);
    currentPos.current.lerp(targetPos, 0.08);
    camera.position.copy(currentPos.current);

    lookAtCurve.getPointAt(t, targetLookAt.current);
    currentLookAt.current.lerp(targetLookAt.current, 0.06);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
