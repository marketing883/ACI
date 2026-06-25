'use client';

import { useEffect, useRef } from 'react';

/**
 * The "data material": a refined wireframe icosahedron (structure) inside a
 * drifting particle field (raw data), monochrome ink on the cream ground.
 * Auto-rotates with mouse parallax. three.js is dynamically imported only
 * when the section nears the viewport, the loop pauses when off-screen, and
 * prefers-reduced-motion renders a single static frame.
 */
export default function DataCrystal({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup = () => {};
    let started = false;

    const init = async () => {
      const THREE = await import('three');
      if (disposed) return;

      const INK = 0x16171a;
      let w = mount.clientWidth || 1000;
      let h = mount.clientHeight || 420;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      camera.position.set(0, 0, 6.2);

      const group = new THREE.Group();
      scene.add(group);

      // Core: faceted wireframe icosahedron
      const coreGeo = new THREE.IcosahedronGeometry(1.7, 1);
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(coreGeo),
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.5 }),
      );
      group.add(wire);

      // Vertex points on the core
      const vGeo = new THREE.IcosahedronGeometry(1.7, 1);
      const vPoints = new THREE.Points(
        vGeo,
        new THREE.PointsMaterial({ color: INK, size: 0.055, transparent: true, opacity: 0.85, sizeAttenuation: true }),
      );
      group.add(vPoints);

      // Faint larger shell, counter-rotating, for depth
      const shellGeo = new THREE.IcosahedronGeometry(2.55, 1);
      const shell = new THREE.LineSegments(
        new THREE.WireframeGeometry(shellGeo),
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.12 }),
      );
      scene.add(shell);

      // Drifting particle field (raw data)
      const N = 650;
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r = 2.4 + Math.pow((i % 97) / 97, 0.5) * 2.2;
        const t = (i * 2.399963) % (Math.PI * 2);
        const ph = Math.acos(1 - (2 * ((i % 53) + 0.5)) / 53);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(t);
        pos[i * 3 + 1] = r * Math.cos(ph);
        pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(t);
      }
      const fieldGeo = new THREE.BufferGeometry();
      fieldGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const field = new THREE.Points(
        fieldGeo,
        new THREE.PointsMaterial({ color: INK, size: 0.022, transparent: true, opacity: 0.34, sizeAttenuation: true }),
      );
      scene.add(field);

      // Mouse parallax
      let mx = 0;
      let my = 0;
      let tx = 0;
      let ty = 0;
      const onMove = (e: MouseEvent) => {
        const r = mount.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMove, { passive: true });

      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      let raf = 0;
      let running = true;
      let frame = 0;
      const render = () => {
        frame += 1;
        mx += (tx - mx) * 0.05;
        my += (ty - my) * 0.05;
        group.rotation.y += 0.0016;
        group.rotation.x = my * 0.25;
        group.rotation.z = mx * 0.06;
        shell.rotation.y -= 0.0011;
        shell.rotation.x = my * 0.18;
        field.rotation.y -= 0.0006;
        const s = 1 + Math.sin(frame * 0.012) * 0.02;
        group.scale.setScalar(s);
        camera.position.x += (mx * 0.5 - camera.position.x) * 0.04;
        camera.position.y += (-my * 0.35 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      const loop = () => {
        if (!running) return;
        render();
        raf = requestAnimationFrame(loop);
      };

      // Pause the loop when the canvas is off-screen
      const vis = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && !running && !reduce) {
              running = true;
              loop();
            } else if (!e.isIntersecting) {
              running = false;
              cancelAnimationFrame(raf);
            }
          }
        },
        { threshold: 0.01 },
      );
      vis.observe(mount);

      if (reduce) {
        running = false;
        render();
      } else {
        loop();
      }

      const ro = new ResizeObserver(() => {
        w = mount.clientWidth || w;
        h = mount.clientHeight || h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (!running) render();
      });
      ro.observe(mount);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMove);
        vis.disconnect();
        ro.disconnect();
        coreGeo.dispose();
        vGeo.dispose();
        shellGeo.dispose();
        fieldGeo.dispose();
        wire.geometry.dispose();
        (wire.material as { dispose(): void }).dispose();
        (vPoints.material as { dispose(): void }).dispose();
        shell.geometry.dispose();
        (shell.material as { dispose(): void }).dispose();
        (field.material as { dispose(): void }).dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    };

    // Only spin up WebGL once the section is near the viewport
    const trigger = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            trigger.disconnect();
            init();
            break;
          }
        }
      },
      { rootMargin: '250px' },
    );
    trigger.observe(mount);

    return () => {
      disposed = true;
      trigger.disconnect();
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
