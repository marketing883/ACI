'use client';

// Dark-to-light (and back) transition. A section wrapped in Curtain rises
// over the one before it with rounded top corners, and as it scrolls in
// the corners flatten and its slight inset opens to full width, like a
// sheet being drawn up over the previous scene. overflow: clip (not
// hidden) keeps position: sticky working inside.

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export default function Curtain({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  const radius = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const inset = useTransform(scrollYProgress, [0, 1], ['3%', '0%']);
  return (
    <div ref={ref} className={`relative z-10 -mt-14 ${className}`}>
      <motion.div
        style={reduce ? undefined : { borderTopLeftRadius: radius, borderTopRightRadius: radius, marginLeft: inset, marginRight: inset }}
        className="overflow-clip shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.6)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
