'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// 404 page. Renders inside the global chrome (nav + footer), so this
// component only owns the hero: a scrub-on-mouse background video
// (self-hosted; CSP allows media-src 'self' only), a blurred intro
// from Atheros (the site copilot), a typewriter line, and pill links
// back into the site. Next.js serves this with a real 404 status.

const TYPEWRITER_TEXT =
  'This page is a 404. The rest of the site is very much alive. Where do you want to go?';

const PILLS: { label: string; href: string }[] = [
  { label: 'Explore services', href: '/services' },
  { label: 'Read the case studies', href: '/case-studies' },
  { label: 'Browse the blog', href: '/blogs' },
  { label: 'Talk to an architect', href: '/contact' },
];

const EMAIL = 'insights@aciinfotech.com';

/** Reveal `text` one character at a time after `startDelay`. */
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            if (interval) clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);
  return { displayed: text.slice(0, count), done: count >= text.length };
}

/** Scrub the background video with horizontal mouse movement. */
function useMouseScrub(videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SENSITIVITY = 0.8;
    let prevX: number | null = null;
    let targetTime = 0;
    let seeking = false;

    const seekTo = (t: number) => {
      seeking = true;
      video.currentTime = t;
    };

    const onSeeked = () => {
      seeking = false;
      // Queue the next seek if the target moved while we were busy,
      // instead of flooding the decoder with one seek per mousemove.
      if (Math.abs(video.currentTime - targetTime) > 0.01) seekTo(targetTime);
    };

    const onMove = (e: MouseEvent) => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      targetTime = Math.min(
        video.duration,
        Math.max(0, targetTime + (delta / window.innerWidth) * SENSITIVITY * video.duration),
      );
      if (!seeking) seekTo(targetTime);
    };

    video.addEventListener('seeked', onSeeked);
    window.addEventListener('mousemove', onMove);
    return () => {
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('mousemove', onMove);
    };
  }, [videoRef]);
}

export default function NotFound() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT);
  useMouseScrub(videoRef);

  // Pills fade in 400ms after load, independent of the typewriter.
  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the address is visible either way.
    }
  };

  return (
    <main className="relative h-screen overflow-hidden bg-white">
      {/* Scrub-controlled background video (decorative) */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: '70% center' }}
      >
        <source src="/videos/v4-editorial-signal.webm" type="video/webm" />
        <source src="/videos/v4-editorial-signal.mp4" type="video/mp4" />
      </video>

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="max-w-xl">
          <h1 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-black/60">
            404. Page not found.
          </h1>

          {/* Blurred intro from the copilot */}
          <p
            className="pointer-events-none mb-5 select-none text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              filter: 'blur(4px)',
            }}
          >
            Hey there, this is Atheros,
            <br />
            the copilot behind this site.
          </p>

          {/* Typewriter */}
          <p
            className="mb-5 text-black sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: 54,
            }}
            aria-label={TYPEWRITER_TEXT}
          >
            {displayed}
            {!done && (
              <span
                className="ml-[2px] inline-block h-[1.1em] w-[2px] animate-[nf-blink_1s_step-end_infinite] bg-black align-middle"
                aria-hidden="true"
              />
            )}
          </p>

          {/* Action pills */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {PILLS.map((pill) => (
              <Link
                key={pill.href}
                href={pill.href}
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              >
                {pill.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={copyEmail}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-black bg-transparent px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:gap-3 sm:px-5 sm:text-[15px]"
            >
              <span aria-live="polite">
                {copied ? (
                  'Copied to clipboard'
                ) : (
                  <>
                    Reach us: <span className="underline underline-offset-1">{EMAIL}</span>
                  </>
                )}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <rect x="3.5" y="3.5" width="8" height="8" rx="1" stroke="currentColor" />
                <rect x="0.5" y="0.5" width="8" height="8" rx="1" stroke="currentColor" fill="white" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cursor blink keyframes, scoped to this page */}
      <style>{`
        @keyframes nf-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </main>
  );
}
