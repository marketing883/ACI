'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  fallback?: React.ReactNode;
}

// Simple blur placeholder for images
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  quality = 85,
  fallback,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Generate blur placeholder if not provided
  const generatedBlurDataURL = blurDataURL ||
    `data:image/svg+xml;base64,${toBase64(shimmer(width || 700, height || 475))}`;

  // If there's an error and a fallback is provided, show fallback
  if (error && fallback) {
    return <>{fallback}</>;
  }

  // If there's an error and no fallback, show placeholder
  if (error) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <svg
          className="w-12 h-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} ${loaded ? '' : 'animate-pulse bg-gray-100'}`}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={generatedBlurDataURL}
        sizes={sizes || '100vw'}
        quality={quality}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${loaded ? '' : 'animate-pulse bg-gray-100'}`}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={generatedBlurDataURL}
      sizes={sizes}
      quality={quality}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}
