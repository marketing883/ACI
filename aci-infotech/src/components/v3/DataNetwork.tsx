'use client';

/**
 * Abstract "data to AI" 3D visual, written in vanilla three.js (no
 * react-three-fiber, so nothing augments the app-wide JSX types). A
 * point cloud shaped into a sphere with two faint wireframe shells,
 * royal blue and lime points, gentle auto-rotation and cursor
 * parallax, on a transparent canvas so the page gradient shows
 * through. Self-guards on WebGL support and cleans up fully.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Deterministic pseudo-random: stable cloud every mount.
function rand(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return (
      !!window.WebGLRenderingContext &&
      !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function DataNetwork({ reduced = false }: { reduced?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !hasWebGL()) return;

    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const BLUE = new THREE.Color('#1b45e0');
    const LIME = new THREE.Color('#c6ff3d');
    const SOFT = new THREE.Color('#9bb0ef');

    const group = new THREE.Group();
    scene.add(group);

    // Point cloud
    const count = 720;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const radius = 1.5 * (0.82 + rand(i) * 0.5);
      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;
      const pick = rand(i * 1.7 + 3.3);
      const c = pick > 0.78 ? LIME : pick > 0.34 ? BLUE : SOFT;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.045,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);

    // Wireframe shells
    const shellGeo = new THREE.IcosahedronGeometry(1.62, 1);
    const shellMat = new THREE.MeshBasicMaterial({
      color: BLUE,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    const coreGeo = new THREE.IcosahedronGeometry(0.62, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: LIME,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Pointer parallax (eased in the loop)
    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    const renderFrame = () => {
      const delta = clock.getDelta();
      if (!reduced) group.rotation.y += delta * 0.12;
      const tiltX = reduced ? 0 : pointerY * 0.25;
      const tiltZ = reduced ? 0 : pointerX * 0.12;
      group.rotation.x += (tiltX - group.rotation.x) * 0.05;
      group.rotation.z += (tiltZ - group.rotation.z) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderFrame);
    };

    if (reduced) {
      renderer.render(scene, camera); // single static frame
    } else {
      raf = requestAnimationFrame(renderFrame);
    }

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      geo.dispose();
      mat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [reduced]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} aria-hidden />;
}
