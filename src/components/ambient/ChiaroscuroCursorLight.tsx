'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * ChiaroscuroCursorLight — Tactile Moving Light Across Silk
 *
 * Implements an ethereal, hardware-accelerated ambient raking light that follows
 * the pointer with viscous silk damping (LERP).
 *
 * Requirements:
 * - Extremely low opacity (~0.035 - 0.045)
 * - Warm antique-gold bias (#c5a869 / #d4b980) in dark obsidian rooms
 * - Soft diffuse sunlit sheen in gossamer light corridors
 * - Large soft falloff (540px radius)
 * - Native cursor remains completely untouched (NO replacement)
 * - Automatically disabled on touch / coarse pointer devices
 * - Respects prefers-reduced-motion
 */
export const ChiaroscuroCursorLight: React.FC = () => {
  const isReducedMotion = usePrefersReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLightZone, setIsLightZone] = useState(false);
  const [isPointerActive, setIsPointerActive] = useState(false);

  const lightRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef({
    targetX: -1000,
    targetY: -1000,
    currentX: -1000,
    currentY: -1000,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch / coarse pointer
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(isCoarse);

    if (isCoarse || isReducedMotion) return;

    let rafId: number;

    const onPointerMove = (e: PointerEvent) => {
      // Ignore simulated touch mouse events
      if (e.pointerType === 'touch') return;

      coordsRef.current.targetX = e.clientX;
      coordsRef.current.targetY = e.clientY;

      // First entry: snap initial position to avoid flying in from corner
      if (coordsRef.current.currentX < -500) {
        coordsRef.current.currentX = e.clientX;
        coordsRef.current.currentY = e.clientY;
      }

      if (!isPointerActive) {
        setIsPointerActive(true);
      }
    };

    const onPointerLeave = () => {
      setIsPointerActive(false);
    };

    // Smooth viscous damping loop (LERP 0.08)
    const animate = () => {
      const { targetX, targetY, currentX, currentY } = coordsRef.current;

      const dx = targetX - currentX;
      const dy = targetY - currentY;

      // Heavy silk inertia
      coordsRef.current.currentX += dx * 0.08;
      coordsRef.current.currentY += dy * 0.08;

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${coordsRef.current.currentX}px, ${coordsRef.current.currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    // Check light corridor boundaries for adaptive chromatography
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

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', checkThemeZone, { passive: true });
    window.addEventListener('resize', checkThemeZone, { passive: true });

    rafId = requestAnimationFrame(animate);
    checkThemeZone();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', checkThemeZone);
      window.removeEventListener('resize', checkThemeZone);
      cancelAnimationFrame(rafId);
    };
  }, [isReducedMotion, isPointerActive]);

  if (isTouchDevice || isReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[15] pointer-events-none select-none overflow-hidden"
    >
      <div
        ref={lightRef}
        className={`absolute -top-[270px] -left-[270px] w-[540px] h-[540px] rounded-full transition-opacity duration-1000 ease-out will-change-transform ${
          isPointerActive ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isLightZone
            ? 'radial-gradient(circle 270px, rgba(255, 255, 255, 0.22) 0%, rgba(245, 242, 235, 0.08) 45%, rgba(245, 242, 235, 0) 75%)'
            : 'radial-gradient(circle 270px, rgba(212, 185, 128, 0.038) 0%, rgba(197, 168, 105, 0.016) 45%, rgba(11, 10, 9, 0) 75%)',
        }}
      />
    </div>
  );
};
