'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface EditorialPlateProps {
  src: string;
  alt: string;
  aspectRatio?: '4/5' | '16/9' | '3/4' | '1/1';
  caption?: string;
  metadata?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  variant?: 'dark' | 'light';
  speed?: 'standard' | 'slow';
}

export const EditorialPlate: React.FC<EditorialPlateProps> = ({
  src,
  alt,
  aspectRatio = '4/5',
  caption,
  metadata,
  priority = false,
  className = '',
  imageClassName = '',
  variant = 'dark',
  speed = 'standard',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sync cache state & guarantee visibility even if browser cache bypassed onLoad
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }
    const checkInterval = setInterval(() => {
      if (imgRef.current?.complete) {
        setIsLoaded(true);
        clearInterval(checkInterval);
      }
    }, 150);

    // Safety net: ensure editorial frames never remain blank holes
    const timer = setTimeout(() => {
      setIsLoaded(true);
      clearInterval(checkInterval);
    }, 2000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timer);
    };
  }, [src]);

  // Aspect ratio class mapping
  const aspectClass =
    aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '3/4'
      ? 'aspect-[3/4]'
      : 'aspect-[1/1]';

  const isLight = variant === 'light';
  const durationClass = speed === 'slow' ? 'duration-[2000ms]' : 'duration-[1400ms]';

  return (
    <div className={`group relative flex flex-col select-none ${className}`}>
      {/* Outer frame: Refined luxury border & architectural drop-shadow for separation */}
      <div
        className={`relative w-full overflow-hidden ${aspectClass} transition-shadow duration-1000 ${
          isLight
            ? 'bg-[#ede7dc] border border-[#dfd6c5]/70 shadow-[0_16px_48px_-16px_rgba(78,65,48,0.12)]'
            : 'bg-[#121110] border border-[var(--color-border-subtle)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
          className={`relative z-0 w-full h-full object-cover transition-all ${durationClass} ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
          } group-hover:scale-[1.015] ${imageClassName}`}
        />

        {/* Soft edge vignette & subtle raking gradient */}
        <div
          className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 ${
            isLight
              ? 'bg-gradient-to-t from-[#f6f2ea]/20 via-transparent to-transparent'
              : 'bg-gradient-to-t from-black/40 via-transparent to-transparent'
          }`}
        />
      </div>

      {/* Minimal editorial annotation / caption */}
      {(caption || metadata) && (
        <div className="mt-3 flex items-baseline justify-between gap-4">
          {caption && (
            <span
              className={`caption-tracked text-[10px] tracking-[0.22em] ${
                isLight ? 'text-[#5c5449]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {caption}
            </span>
          )}
          {metadata && (
            <span
              className={`mono-spec text-[9px] tracking-[0.16em] ${
                isLight ? 'text-[#8c8273]' : 'text-[var(--color-accent-zari)]/80'
              }`}
            >
              {metadata}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
