'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface MagneticTargetInfo {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  label: string;
}

/**
 * MagneticChiaroscuroCursor — Sensory Haute-Couture Reticle
 *
 * Implements a bespoke precision reticle with spring inertia, magnetic attractor snapping,
 * fine millimetric coordinate crosshairs, and a raking grazing light halo.
 *
 * Performance Architecture:
 * - Active strictly on non-touch desktop devices (hidden on (pointer: coarse) or touch)
 * - Zero layout thrashing: uses cached target bounding boxes and textContent (no innerText reflows)
 * - Cached element comparison prevents redundant React re-renders during pointermove
 * - Stable RAF loop without useEffect re-triggering during hover transitions
 * - Dynamic media query tracking for hybrid / convertible viewports
 * - Strict pointer-events-none preserving native interactions and accessibility
 */
export const MagneticChiaroscuroCursor: React.FC = () => {
  const isReducedMotion = usePrefersReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPointerVisible, setIsPointerVisible] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [activeLabel, setActiveLabel] = useState<string>('');

  const reticleRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const coordsLabelRef = useRef<HTMLSpanElement>(null);

  // Physics state stored in refs to avoid React re-renders in the RAF loop
  const physicsRef = useRef({
    mouseX: -1000,
    mouseY: -1000,
    currentX: -1000,
    currentY: -1000,
    targetX: -1000,
    targetY: -1000,
    haloX: -1000,
    haloY: -1000,
    scale: 1,
    targetScale: 1,
  });

  const magneticTargetRef = useRef<MagneticTargetInfo | null>(null);
  const currentTargetElRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const fineQuery = window.matchMedia('(pointer: fine)');

    const evaluateDeviceSupport = () => {
      const isCoarseOnly = coarseQuery.matches && !fineQuery.matches;
      if (isCoarseOnly || isReducedMotion) {
        setIsEnabled(false);
      } else {
        setIsEnabled(true);
      }
    };

    evaluateDeviceSupport();

    if (coarseQuery.addEventListener) {
      coarseQuery.addEventListener('change', evaluateDeviceSupport);
      fineQuery.addEventListener('change', evaluateDeviceSupport);
    }

    return () => {
      if (coarseQuery.removeEventListener) {
        coarseQuery.removeEventListener('change', evaluateDeviceSupport);
        fineQuery.removeEventListener('change', evaluateDeviceSupport);
      }
    };
  }, [isReducedMotion]);

  useEffect(() => {
    if (!isEnabled || isReducedMotion) return;

    let rafId: number;

    const findInteractiveElement = (target: EventTarget | null): HTMLElement | null => {
      if (!target || !(target instanceof Element)) return null;
      return target.closest<HTMLElement>(
        'button, a, [role="button"], input, select, textarea, [data-magnetic], .cursor-pointer, [data-loupe-interactive], [data-selvedge-interactive], [data-seal-interactive]'
      );
    };

    const updateMagneticTarget = (el: HTMLElement | null) => {
      // Avoid layout thrashing and redundant state updates if element hasn't changed
      if (el === currentTargetElRef.current) return;
      currentTargetElRef.current = el;

      if (!el) {
        magneticTargetRef.current = null;
        setIsSnapping(false);
        setActiveLabel('');
        physicsRef.current.targetScale = 1;
        return;
      }

      const rect = el.getBoundingClientRect();
      const label =
        el.getAttribute('data-magnetic-label') ||
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.textContent?.slice(0, 14).trim() ||
        'INTERACT';

      magneticTargetRef.current = {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
        label: label.toUpperCase(),
      };

      setIsSnapping(true);
      setActiveLabel(label.toUpperCase());
      physicsRef.current.targetScale = 1.35;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      const { clientX, clientY } = e;
      const p = physicsRef.current;
      p.mouseX = clientX;
      p.mouseY = clientY;

      // Initial jump protection
      if (p.currentX < -500) {
        p.currentX = clientX;
        p.currentY = clientY;
        p.targetX = clientX;
        p.targetY = clientY;
        p.haloX = clientX;
        p.haloY = clientY;
      }

      setIsPointerVisible(true);

      // Check current hover target
      const interactiveEl = findInteractiveElement(e.target);
      updateMagneticTarget(interactiveEl);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setIsClicking(true);
      physicsRef.current.targetScale = magneticTargetRef.current ? 1.15 : 0.85;
    };

    const onPointerUp = () => {
      setIsClicking(false);
      physicsRef.current.targetScale = magneticTargetRef.current ? 1.35 : 1.0;
    };

    const onPointerLeave = () => {
      setIsPointerVisible(false);
      updateMagneticTarget(null);
    };

    const onScroll = () => {
      // Update target bounding box on scroll if locked to an element
      const el = currentTargetElRef.current;
      if (el && magneticTargetRef.current) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          updateMagneticTarget(null);
        } else {
          magneticTargetRef.current.centerX = rect.left + rect.width / 2;
          magneticTargetRef.current.centerY = rect.top + rect.height / 2;
        }
      }
    };

    // Physics Animation Loop
    const animate = () => {
      const p = physicsRef.current;
      const mag = magneticTargetRef.current;

      if (mag) {
        // Physical gravity well: clamped magnetic attraction vector
        // Subtly draws cursor toward target center without disorienting leaps on large cards
        const dx = mag.centerX - p.mouseX;
        const dy = mag.centerY - p.mouseY;
        const dist = Math.hypot(dx, dy);
        const maxPull = Math.min(22, Math.max(mag.width, mag.height) * 0.18);
        const pullDist = Math.min(dist * 0.35, maxPull);
        const angle = Math.atan2(dy, dx);

        p.targetX = p.mouseX + Math.cos(angle) * pullDist;
        p.targetY = p.mouseY + Math.sin(angle) * pullDist;

        // Snappier spring lerp in magnetic field
        p.currentX += (p.targetX - p.currentX) * 0.22;
        p.currentY += (p.targetY - p.currentY) * 0.22;
      } else {
        // Standard silk viscous damping
        p.targetX = p.mouseX;
        p.targetY = p.mouseY;

        p.currentX += (p.targetX - p.currentX) * 0.16;
        p.currentY += (p.targetY - p.currentY) * 0.16;
      }

      // Halo fluid trailing lag
      p.haloX += (p.currentX - p.haloX) * 0.12;
      p.haloY += (p.currentY - p.haloY) * 0.12;

      // Smooth scale interpolation
      p.scale += (p.targetScale - p.scale) * 0.18;

      // Update Reticle Transform
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${p.currentX.toFixed(2)}px, ${p.currentY.toFixed(2)}px, 0) scale(${p.scale.toFixed(3)})`;
      }

      // Update Raking Grazing Halo Transform (trails reticle with organic viscous fluidity)
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${p.haloX.toFixed(2)}px, ${p.haloY.toFixed(2)}px, 0)`;
      }

      // Update Coordinates Readout Text (only when pointer is active)
      if (coordsLabelRef.current && p.currentX > -500) {
        const xStr = Math.max(0, Math.round(p.currentX)).toString().padStart(4, '0');
        const yStr = Math.max(0, Math.round(p.currentY)).toString().padStart(4, '0');
        coordsLabelRef.current.textContent = `${xStr}·${yStr}`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isEnabled, isReducedMotion]);

  if (!isEnabled) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[160] pointer-events-none select-none overflow-hidden"
    >
      {/* 1. Grazing Raking Light Halo — soft warm gold radiance cast on darkroom silk */}
      <div
        ref={haloRef}
        className={`absolute -top-[90px] -left-[90px] w-[180px] h-[180px] rounded-full will-change-transform transition-opacity duration-500 ease-out ${
          isPointerVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isSnapping
            ? 'radial-gradient(circle 90px, rgba(212, 185, 128, 0.16) 0%, rgba(197, 168, 105, 0.05) 50%, transparent 80%)'
            : 'radial-gradient(circle 90px, rgba(197, 168, 105, 0.09) 0%, rgba(212, 185, 128, 0.025) 45%, transparent 75%)',
        }}
      />

      {/* 2. Precision Haute-Couture Reticle Assembly */}
      <div
        ref={reticleRef}
        className={`absolute -top-4 -left-4 w-8 h-8 will-change-transform transition-opacity duration-300 ease-out flex items-center justify-center ${
          isPointerVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Central Core: Obsidian Center with Antique Gold Filament Dot */}
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 flex items-center justify-center ${
            isSnapping
              ? 'bg-[#faf7f0] ring-2 ring-[#c5a869] shadow-[0_0_12px_rgba(197,168,105,0.9)]'
              : 'bg-[#c5a869] shadow-[0_0_6px_rgba(197,168,105,0.6)]'
          }`}
        >
          <div className="w-0.5 h-0.5 rounded-full bg-[#0b0a09]" />
        </div>

        {/* Outer Circular Optical Ring */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-300 ${
            isSnapping
              ? 'border-[#c5a869] ring-1 ring-[#c5a869]/30 shadow-[0_0_14px_rgba(197,168,105,0.4)]'
              : 'border-[#c5a869]/40'
          }`}
        />

        {/* Fine Cardinal Crosshair Ticks */}
        {/* Top Tick */}
        <div
          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-[1px] h-2 transition-colors duration-300 ${
            isSnapping ? 'bg-[#c5a869]' : 'bg-[#c5a869]/50'
          }`}
        />
        {/* Bottom Tick */}
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-[1px] h-2 transition-colors duration-300 ${
            isSnapping ? 'bg-[#c5a869]' : 'bg-[#c5a869]/50'
          }`}
        />
        {/* Left Tick */}
        <div
          className={`absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-[1px] transition-colors duration-300 ${
            isSnapping ? 'bg-[#c5a869]' : 'bg-[#c5a869]/50'
          }`}
        />
        {/* Right Tick */}
        <div
          className={`absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-[1px] transition-colors duration-300 ${
            isSnapping ? 'bg-[#c5a869]' : 'bg-[#c5a869]/50'
          }`}
        />

        {/* Diagonal Corner Framing Brackets (Visible during magnetic lock) */}
        {isSnapping && (
          <>
            <div className="absolute -top-1.5 -left-1.5 w-1.5 h-1.5 border-t border-l border-[#faf7f0]/80" />
            <div className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 border-t border-r border-[#faf7f0]/80" />
            <div className="absolute -bottom-1.5 -left-1.5 w-1.5 h-1.5 border-b border-l border-[#faf7f0]/80" />
            <div className="absolute -bottom-1.5 -right-1.5 w-1.5 h-1.5 border-b border-r border-[#faf7f0]/80" />
          </>
        )}

        {/* Momentary Tactile Impulse Ring on Click */}
        {isClicking && (
          <div className="absolute inset-[-8px] rounded-full border border-[#faf7f0] animate-ping opacity-75" />
        )}

        {/* Archival Readout Telemetry (Millimetric Coordinates & Active Target Tag) */}
        <div className="absolute left-6 top-5 flex flex-col items-start gap-0.5 whitespace-nowrap pointer-events-none">
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-[1px] bg-[#0b0a09]/80 border border-[#c5a869]/25 backdrop-blur-[2px]">
            <span
              ref={coordsLabelRef}
              className="font-mono text-[7.5px] text-[#c5a869] tracking-wider leading-none"
            >
              0000·0000
            </span>
            {isSnapping && (
              <span className="w-1 h-1 rounded-full bg-[#faf7f0] animate-pulse" />
            )}
          </div>

          {isSnapping && activeLabel && (
            <div className="px-1.5 py-0.5 rounded-[1px] bg-[#c5a869]/15 border border-[#c5a869]/40 backdrop-blur-[2px]">
              <span className="font-mono text-[6.5px] text-[#faf7f0] tracking-widest leading-none block font-medium">
                LOCK // {activeLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
