'use client';

import { useState } from 'react';
import s from './v3.module.css';

/**
 * Resilient image: renders a real (Unsplash) photo, but if the URL
 * ever fails to load it swaps to a blue→lime gradient so the slot
 * never looks broken. Plain <img> with lazy loading keeps the preview
 * simple and bulletproof; swap for next/image once URLs are locked.
 */
export default function V3Image({
  src,
  alt,
  tint = true,
}: {
  src?: string;
  alt: string;
  tint?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={s.img}>
      {!failed && src ? (
        // Plain <img> on purpose: the onError gradient fallback keeps the
        // preview bulletproof even if an Unsplash URL 404s. Swap to
        // next/image once the final URLs are locked.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={s.imgEl}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={s.imgFallback} aria-hidden />
      )}
      <div className={s.imgGrade} aria-hidden />
      {tint && <div className={s.imgTint} aria-hidden />}
    </div>
  );
}
