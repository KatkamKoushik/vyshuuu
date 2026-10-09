'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SecretSelvedgeGesture } from './SecretSelvedgeGesture';

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
  hasSelvedgeGesture?: boolean;
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
  hasSelvedgeGesture = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, nx: 0, ny: 0 });

  const isReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
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

  const settleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Restrained pointer-responsive depth & conservation glass specular sheen (max ±1.6°)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isReducedMotion || e.pointerType === 'touch' || !frameRef.current) return;

      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
      }

      const rect = frameRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      // Clamp strictly within ±1.6 degrees (restrained exhibition mount)
      const clampedX = Math.max(-1, Math.min(1, nx));
      const clampedY = Math.max(-1, Math.min(1, ny));

      setTilt({
        rotX: -clampedY * 1.6,
        rotY: clampedX * 1.6,
        nx: clampedX,
        ny: clampedY,
      });
      setIsHovered(true);

      // REST = BREATHING: When cursor rests, material gently settles towards equilibrium
      settleTimeoutRef.current = setTimeout(() => {
        setTilt((prev) => ({
          rotX: prev.rotX * 0.6,
          rotY: prev.rotY * 0.6,
          nx: prev.nx * 0.8,
          ny: prev.ny * 0.8,
        }));
      }, 350);
    },
    [isReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
    }
    setTilt({ rotX: 0, rotY: 0, nx: 0, ny: 0 });
    setIsHovered(false);
  }, []);

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
    <div
      className={`group relative flex flex-col select-none ${className}`}
      style={{ perspective: '1200px' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Outer frame: Refined luxury border & architectural drop-shadow with subtle exhibition mount depth */}
      <div
        ref={frameRef}
        className={`relative w-full overflow-hidden ${aspectClass} transition-all duration-900 ease-[cubic-bezier(0.2,0.9,0.3,1)] ${
          isLight
            ? 'bg-[#ede7dc] border border-[#dfd6c5]/70 shadow-[0_16px_48px_-16px_rgba(78,65,48,0.12)]'
            : 'bg-[#121110] border border-[var(--color-border-subtle)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]'
        }`}
        style={{
          transform:
            !isReducedMotion && isHovered
              ? `rotateX(${tilt.rotX.toFixed(2)}deg) rotateY(${tilt.rotY.toFixed(2)}deg)`
              : 'rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
          willChange: isHovered ? 'transform' : 'auto',
        }}
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
          } group-hover:scale-[1.012] ${imageClassName}`}
        />

        {/* Soft edge vignette & subtle raking gradient */}
        <div
          className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 ${
            isLight
              ? 'bg-gradient-to-t from-[#f6f2ea]/20 via-transparent to-transparent'
              : 'bg-gradient-to-t from-black/40 via-transparent to-transparent'
          }`}
        />

        {/* Restrained conservation-glass moving specular sheen */}
        {!isReducedMotion && (
          <div
            aria-hidden="true"
            className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-700 ease-out ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: `radial-gradient(circle 85% at ${(tilt.nx + 1) * 50}% ${(tilt.ny + 1) * 50}%, rgba(255, 255, 255, ${
                isLight ? 0.065 : 0.038
              }) 0%, rgba(255, 255, 255, 0.01) 35%, transparent 65%)`,
            }}
          />
        )}

        {/* Secret Textile Gesture (Pillar 3 — The Gold/Zari Selvedge Thread) */}
        {hasSelvedgeGesture && <SecretSelvedgeGesture />}
      </div>

      {/* Minimal editorial annotation / caption */}
      {(caption || metadata) && (
        <div className="mt-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
          {caption && (
            <span
              className={`caption-tracked text-[10.5px] sm:text-[10px] tracking-[0.22em] ${
                isLight ? 'text-[#5c5449]' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {caption}
            </span>
          )}
          {metadata && (
            <span
              className={`mono-spec text-[9.5px] sm:text-[9px] tracking-[0.16em] ${
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
