'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface VideoLightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  title?: string;
}

export default function VideoLightbox({
  open,
  onClose,
  src,
  title,
}: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;

    const video = videoRef.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [open, onClose]);

  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Video player'}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 ring-1 ring-white/20"
        aria-label="Close video"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div
        className="relative w-full max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="absolute -top-8 left-0 text-sm text-white/70 font-medium sm:-top-10 sm:text-base">
            {title}
          </div>
        )}
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          preload="metadata"
          playsInline
          className="w-full h-full rounded-xl shadow-2xl bg-black"
        />
      </div>
    </div>,
    document.body
  );
}
