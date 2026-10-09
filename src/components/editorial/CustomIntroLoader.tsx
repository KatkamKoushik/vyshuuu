'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useExperienceStore } from '@/stores/experienceStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getLenis } from '@/lib/lenis';

/**
 * CustomIntroLoader (Part A — Private Exhibition Opening)
 * 
 * An intimate, high-fashion opening featuring:
 * vyshnavi
 * 
 * - Deep obsidian chiaroscuro background
 * - Cormorant Garamond display serif typography
 * - Restrained antique-gold silk filament drawing animation
 * - Genuine resource measurement (fonts, WebGL canvas, 9 locked texture maps)
 * - Strict session memory (plays once per session, zero reload replay)
 * - Comprehensive reduced-motion & timeout safety gates
 */
export const CustomIntroLoader: React.FC = () => {
  const isReducedMotion = usePrefersReducedMotion();

  // Experience store hooks
  const texturesLoadedCount = useExperienceStore((s) => s.texturesLoadedCount);
  const isTexturesLoaded = useExperienceStore((s) => s.isTexturesLoaded);
  const setIntroSettled = useExperienceStore((s) => s.setIntroSettled);
  const setCompletedIntro = useExperienceStore((s) => s.setCompletedIntro);

  // Local state
  const [fontsReady, setFontsReady] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountTimeRef = useRef<number>(Date.now());

  // 1. Measure fonts readiness
  useEffect(() => {
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready
        .then(() => setFontsReady(true))
        .catch(() => setFontsReady(true)); // Safe fallback
    } else {
      setFontsReady(true);
    }
  }, []);

  // 3. Measure canvas initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if WebGL canvas is mounted in DOM
    const checkCanvas = () => {
      const canvasEl = document.querySelector('canvas');
      if (canvasEl) {
        setCanvasReady(true);
        return true;
      }
      return false;
    };

    if (checkCanvas()) return;

    const interval = setInterval(() => {
      if (checkCanvas()) {
        clearInterval(interval);
      }
    }, 100);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setCanvasReady(true); // Safe fallback
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // 4. Lock background scrolling while loader is active
  useEffect(() => {
    if (isComplete) return;

    // Disable scrolling
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const lenis = getLenis();
    lenis?.stop();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow || '';
      lenis?.start();
    };
  }, [isComplete]);

  // 5. Compute genuine loading progress (11 discrete steps: 1 font + 1 canvas + 9 textures)
  const progress = useMemo(() => {
    let score = 0;
    if (fontsReady) score += 1;
    if (canvasReady) score += 1;
    score += Math.min(9, texturesLoadedCount);

    return Math.min(1.0, score / 11);
  }, [fontsReady, canvasReady, texturesLoadedCount]);

  const isReady = useMemo(() => {
    return (progress >= 1.0 || isTexturesLoaded) && fontsReady && canvasReady;
  }, [progress, isTexturesLoaded, fontsReady, canvasReady]);

  // Dismiss transition logic
  const handleDismiss = useCallback(() => {
    if (isDismissing || isComplete) return;
    setIsDismissing(true);

    const duration = isReducedMotion ? 300 : 1200;
    setTimeout(() => {
      setIsComplete(true);
      setCompletedIntro(true);
      setIntroSettled(true);

      // Re-enable Lenis and body scroll cleanly
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      getLenis()?.start();
    }, duration);
  }, [isDismissing, isComplete, isReducedMotion, setCompletedIntro, setIntroSettled]);

  // 6. Auto-dismiss after readiness with a graceful contemplation pause
  useEffect(() => {
    if (isReady && !isDismissing && !isComplete && !hasInteracted) {
      const elapsed = Date.now() - mountTimeRef.current;
      const minDisplay = isReducedMotion ? 600 : 3800;
      const remainingTime = Math.max(0, minDisplay - elapsed);
      // Wait for minimum display time plus a dignified contemplation pause
      const waitTime = remainingTime + (isReducedMotion ? 200 : 1400);

      autoDismissTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, waitTime);
    }

    return () => {
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
      }
    };
  }, [isReady, isDismissing, isComplete, hasInteracted, isReducedMotion, handleDismiss]);

  // 7. Safety timeout: never leave visitor trapped if assets stall
  useEffect(() => {
    safetyTimerRef.current = setTimeout(() => {
      if (!isDismissing && !isComplete) {
        handleDismiss();
      }
    }, 7000);

    return () => {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
      }
    };
  }, [isDismissing, isComplete, handleDismiss]);

  // 8. Keyboard navigation: Space or Enter triggers dismissal once ready
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (isReady) {
          e.preventDefault();
          setHasInteracted(true);
          handleDismiss();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReady, handleDismiss]);

  const hasCompletedIntro = useExperienceStore((s) => s.hasCompletedIntro);

  // Do not render once intro has completed
  if (isComplete || hasCompletedIntro) {
    return null;
  }

  const percentInt = Math.min(100, Math.round(progress * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      aria-describedby="intro-subtitle"
      style={{
        backgroundColor: '#050404',
        zIndex: 150,
      }}
      className={`fixed inset-0 flex flex-col justify-between items-center px-6 py-10 md:py-16 select-none overflow-hidden text-[#FAF7F0] ${
        isDismissing
          ? 'opacity-0 scale-[1.015] pointer-events-none'
          : 'opacity-100 scale-100'
      } ${
        isReducedMotion
          ? 'transition-opacity duration-300'
          : 'transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]'
      }`}
    >
      {/* Background Subtle Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(23, 19, 14, 0.45) 0%, rgba(7, 6, 5, 0.95) 65%, #050404 100%)',
        }}
      />

      {/* ====================================================================
          TOP DOCKET: EXHIBITION PROLOGUE
          ==================================================================== */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between text-[9px] mono-spec text-[#8a7f6e] tracking-[0.28em] uppercase border-b border-white/5 pb-3">
        <span className="text-[#c5a869]">
          [ PROLOGUE &middot; PRIVATE EXHIBITION ]
        </span>
        <span className="hidden sm:inline opacity-70">
          CHAMBER ARCHITECTURE &middot; 00
        </span>
      </div>

      {/* ====================================================================
          CENTER CORE: THE SILK THREAD & VYSHNAVI TITLE
          ==================================================================== */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-3xl px-4">
        {/* Antique Gold Filament Animation */}
        <div className="relative w-12 h-20 sm:h-24 mb-6 sm:mb-8 flex items-center justify-center">
          <svg
            width="48"
            height="96"
            viewBox="0 0 48 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-auto h-full ${
              isReducedMotion ? '' : 'transition-opacity duration-1000'
            }`}
            aria-hidden="true"
          >
            {/* Delicate curved silk thread path */}
            <path
              d="M 24 0 C 23 24, 25 48, 24 96"
              stroke="#C5A869"
              strokeWidth="0.85"
              strokeLinecap="round"
              className={isReducedMotion ? '' : 'animate-pulse'}
              style={{
                strokeDasharray: '96',
                strokeDashoffset: isReducedMotion ? '0' : undefined,
                animationDuration: '3s',
              }}
            />
            {/* Luminous micro-reticle at thread node */}
            <circle
              cx="24"
              cy="48"
              r="1.2"
              fill="#FAF7F0"
              className={isReducedMotion ? '' : 'animate-ping'}
              style={{ animationDuration: '4s' }}
            />
          </svg>
        </div>

        {/* Minimal Curatorial Inscription */}
        <span className="mono-spec text-[9px] sm:text-[10px] tracking-[0.34em] text-[#8a7f6e] uppercase mb-3 block">
          ATELIER DÉBUT
        </span>

        {/* The Central Exhibition Name: vyshnavi */}
        <h1
          id="intro-title"
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[0.24em] text-[#FAF7F0] lowercase leading-none drop-shadow-md"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          vyshnavi
        </h1>

        {/* Restrained Antique-Gold Accent Rule */}
        <div className="w-12 h-[1px] bg-[#c5a869]/50 my-4 sm:my-5" />

        {/* Understated Subtitle */}
        <p
          id="intro-subtitle"
          className="caption-tracked text-[10px] sm:text-xs text-[#c5a869] tracking-[0.32em] uppercase font-light"
        >
          A STUDY IN SILK &amp; LIGHT
        </p>
      </div>

      {/* ====================================================================
          BOTTOM TELEMETRY & PROGRESS INDICATOR
          ==================================================================== */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center gap-3 pt-4">
        {/* Genuine Hairline Loading Indicator (1px height) */}
        <div
          role="progressbar"
          aria-valuenow={percentInt}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Experience Loading Progress"
          className="w-44 sm:w-56 h-[1px] bg-white/10 overflow-hidden relative"
        >
          <div
            className={`h-full bg-gradient-to-r from-[#c5a869]/60 via-[#c5a869] to-[#FAF7F0] ${
              isReducedMotion ? '' : 'transition-all duration-300 ease-out'
            }`}
            style={{ width: `${percentInt}%` }}
          />
        </div>

        {/* Subtle Status Line / Action Prompt */}
        <div className="flex items-center justify-center min-h-[32px]">
          {isReady ? (
            <button
              type="button"
              onClick={() => {
                setHasInteracted(true);
                handleDismiss();
              }}
              className="mono-spec text-[9.5px] sm:text-[10px] text-[#FAF7F0] hover:text-[#c5a869] tracking-[0.28em] uppercase transition-all duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#c5a869] px-4 py-1.5 border border-[#c5a869]/40 hover:border-[#c5a869] bg-white/[0.03] backdrop-blur-sm shadow-[0_4px_20px_rgba(197,168,105,0.08)]"
            >
              [ ENTER EXHIBITION &rarr; ]
            </button>
          ) : (
            <span className="mono-spec text-[8.5px] sm:text-[9px] text-[#8a7f6e] tracking-[0.24em] uppercase">
              [ CALIBRATING SILK CONTINUUM &middot; {percentInt}% ]
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
