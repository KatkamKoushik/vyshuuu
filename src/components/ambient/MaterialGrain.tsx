'use client';

import React, { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * MaterialGrain — Subtle Archival Celluloid Texture
 *
 * Implements an ultra-low-contrast procedural material grain overlay that gives
 * the digital viewport an organic tactile tooth (like 300gsm cold-press paper
 * and unstitched raw silk fiber) without visible digital noise patterns.
 *
 * Requirements:
 * - Extremely low contrast (~0.025 - 0.032 opacity)
 * - Adaptive to dark (obsidian) and light (kora/ecru) worlds
 * - Pointer-events: none, hardware composited
 * - Respects prefers-reduced-motion
 */
export const MaterialGrain: React.FC = () => {
  const isReducedMotion = usePrefersReducedMotion();
  const [isLightZone, setIsLightZone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number;
    const checkThemeZone = () => {
      const lightEl = document.querySelector('[data-theme="light"]');
      if (!lightEl) {
        setIsLightZone(false);
        return;
      }
      const rect = lightEl.getBoundingClientRect();
      const inLight = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
      setIsLightZone((prev) => (prev !== inLight ? inLight : prev));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkThemeZone);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    checkThemeZone();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // SVG Data URI with procedural fractal turbulence (fine grain structure)
  const grainSvg = `data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>`;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[35] pointer-events-none select-none ${
        isReducedMotion ? 'transition-none' : 'transition-opacity duration-1000'
      } ${
        isLightZone ? 'opacity-[0.022] mix-blend-multiply' : 'opacity-[0.028] mix-blend-overlay'
      }`}
      style={{
        backgroundImage: `url('${grainSvg}')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '160px 160px',
        willChange: 'opacity',
      }}
    />
  );
};
