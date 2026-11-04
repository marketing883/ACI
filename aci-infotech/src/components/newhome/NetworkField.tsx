'use client';

// Interconnected network field drawn on a canvas: drifting nodes that link
// when close, with the links brightening and the nodes leaning toward the
// pointer. Cheap by design: node count scales with area and is capped, the
// pixel ratio is capped at 2, drawing stops while the canvas is off
// screen, and with reduced motion it renders a single still frame.

import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number; r: number };

export default function NetworkField({
  className = '',
  color = '96,165,250',
  accent = '34,211,238',
  density = 0.00009,
  maxNodes = 110,
  linkDistance = 150,
}: {
  className?: string;
  /** RGB triplet for nodes and links. */
  color?: string;
  /** RGB triplet for links near the pointer. */
  accent?: string;
  density?: number;
  maxNodes?: number;
  linkDistance?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(maxNodes, Math.round(w * h * density));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        if (!reduce) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 220 * 220) {
            n.vx += dx * 0.000018;
            n.vy += dy * 0.000018;
          }
          n.vx *= 0.995;
          n.vy *= 0.995;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }
      const ld2 = linkDistance * linkDistance;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > ld2) continue;
          const mx = (a.x + b.x) / 2 - mouse.x;
          const my = (a.y + b.y) / 2 - mouse.y;
          const near = mx * mx + my * my < 180 * 180;
          const alpha = (1 - d2 / ld2) * (near ? 0.55 : 0.16);
          ctx.strokeStyle = `rgba(${near ? accent : color},${alpha})`;
          ctx.lineWidth = near ? 1 : 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${color},0.7)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    draw();
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduce) raf = requestAnimationFrame(draw);
      if (!visible) cancelAnimationFrame(raf);
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [color, accent, density, maxNodes, linkDistance]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
