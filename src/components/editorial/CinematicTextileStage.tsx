'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SareeConcept, SareeAssetMeta, SAREE_COLLECTION } from '@/lib/collection/collectionData';
import {
  getAtmosphere,
  getProgressionColor,
  generateAtmosphereCSSVars,
} from '@/lib/atmosphere/collectionAtmospheres';

export interface CinematicTextileStageProps {
  saree: SareeConcept;
  onExamine: (saree: SareeConcept) => void;
  onSelectSaree: (sareeId: string) => void;
  onReset?: () => void;
}

/**
 * TUNABLE SCROLL ENVELOPE (Constraint 1)
 * Starts at 200vh for natural pacing with Lenis smooth scroll.
 * Tunable between 180vh–220vh.
 */
const STAGE_SCROLL_HEIGHT_VH = 200;

export const CinematicTextileStage: React.FC<CinematicTextileStageProps> = ({
  saree,
  onExamine,
  onSelectSaree,
  onReset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract ordered non-null plates from saree assets
  const plates = useMemo<SareeAssetMeta[]>(() => {
    return Object.values(saree.assets).filter(Boolean) as SareeAssetMeta[];
  }, [saree]);

  const [activePlateIndex, setActivePlateIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const activeIndexRef = useRef(activePlateIndex);
  activeIndexRef.current = activePlateIndex;

  // Retrieve art-directed atmosphere and synchronized progression
  const atmosphere = useMemo(() => getAtmosphere(saree.id), [saree.id]);
  const atmosphereVars = useMemo(() => generateAtmosphereCSSVars(atmosphere), [atmosphere]);

  // Synchronized background color across the 8-9 plate observations
  const currentProgressionColor = useMemo(() => {
    const normProgress = plates.length > 1 ? activePlateIndex / (plates.length - 1) : 0;
    return getProgressionColor(atmosphere, normProgress);
  }, [atmosphere, activePlateIndex, plates.length]);

  // Reset to Plate 01 whenever the saree world changes
  useEffect(() => {
    setActivePlateIndex(0);
    setScrollProgress(0);
    lastInteractionTimeRef.current = Date.now();
  }, [saree.id]);

  // --------------------------------------------------------------------------
  // SCROLL-DRIVEN PROGRESSION
  // --------------------------------------------------------------------------
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDist = rect.height - windowHeight;

      if (scrollableDist <= 0) return;

      // When the top of the container hits or passes viewport top
      const scrolled = -rect.top;
      const rawProgress = scrolled / scrollableDist;
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Only engage if container is currently in or around the viewport
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        setScrollProgress((prev) => {
          if (Math.abs(prev - progress) < 0.005 && progress > 0 && progress < 1) {
            return prev;
          }
          return progress;
        });

        const targetIdx = Math.min(
          plates.length - 1,
          Math.floor(progress * plates.length)
        );

        if (targetIdx !== activeIndexRef.current) {
          setActivePlateIndex(targetIdx);
        }

        setIsUserInteracting(true);
        lastInteractionTimeRef.current = Date.now();
      }
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          handleScroll();
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [plates.length]);

  // --------------------------------------------------------------------------
  // USER IDLE DETECTION & GENTLE AUTOPLAY DRIFT (Constraint 2)
  // Autoplay moves slowly when idle, but STOPS at the final plate. No infinite looping.
  // --------------------------------------------------------------------------
  useEffect(() => {
    const idleCheckInterval = setInterval(() => {
      if (Date.now() - lastInteractionTimeRef.current > 2400) {
        setIsUserInteracting(false);
      }
    }, 500);

    return () => clearInterval(idleCheckInterval);
  }, []);

  useEffect(() => {
    const driftInterval = setInterval(() => {
      // If user is actively scrolling/scrubbing, do not advance
      if (isUserInteracting) return;

      // Constraint 2: STOP AT FINAL PLATE. No looping back to 01.
      if (activeIndexRef.current >= plates.length - 1) {
        return; // Holds quietly on culmination plate
      }

      // Generous, slow cinematic advance
      setActivePlateIndex((prev) => Math.min(plates.length - 1, prev + 1));
    }, 4200);

    return () => clearInterval(driftInterval);
  }, [isUserInteracting, plates.length]);

  const currentPlate = plates[activePlateIndex] || plates[0];
  const isFinalPlate = activePlateIndex >= plates.length - 1;

  const handleManualPlateJump = useCallback((index: number) => {
    setActivePlateIndex(index);
    lastInteractionTimeRef.current = Date.now();
    setIsUserInteracting(true);

    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist > 0) {
        const targetProgress = index / (plates.length - 1);
        const containerTop = window.scrollY + rect.top;
        window.scrollTo({
          top: containerTop + targetProgress * scrollableDist,
          behavior: 'smooth',
        });
      }
    }
  }, [plates.length]);

  return (
    <div
      ref={containerRef}
      id="cinematic-stage"
      aria-label={`${saree.name} — Cinematic Textile Stage`}
      style={{
        height: `${STAGE_SCROLL_HEIGHT_VH}vh`,
        ...atmosphereVars,
      }}
      className="relative w-full select-none"
    >
      {/* ====================================================================
          FIXED / STICKY CINEMATIC VIEWPORT
          The stage viewport remains visually stable while the textile plates evolve.
          ==================================================================== */}
      <div
        className="sticky top-0 w-full h-screen min-h-[640px] flex flex-col justify-between overflow-hidden transition-colors duration-1000 ease-out z-10"
        style={{
          backgroundColor: currentProgressionColor,
        }}
      >
        {/* Directional raking ambient light wash */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out z-0"
          style={{
            background: `linear-gradient(135deg, ${atmosphere.palette.accent}14 0%, transparent 65%)`,
            opacity: 0.35,
          }}
        />

        {/* ====================================================================
            TOP ARCHITECTURAL DOSSIER HEADER (Quiet & Anchored)
            ==================================================================== */}
        <header className="relative z-20 w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-14 pt-20 sm:pt-14 md:pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 mono-spec text-[9px] tracking-[0.24em] uppercase">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block transition-colors duration-700"
                style={{ backgroundColor: atmosphere.palette.accent }}
              />
              <span className="text-[var(--color-text)]">
                STUDY {String(saree.number).padStart(2, '0')} {'//'} {saree.name.toUpperCase()}
              </span>
              <span className="opacity-40">&middot;</span>
              <span style={{ color: atmosphere.palette.accent }}>{saree.code}</span>
            </div>
            <p className="mono-spec text-[10px] text-[var(--color-text-muted)] tracking-[0.18em] uppercase">
              {atmosphere.editorial.tagline}
            </p>
          </div>

          {/* Quick World Switcher & Reset Controls */}
          <div className="flex items-center gap-4 mono-spec text-[9px] tracking-[0.16em] uppercase">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] tracking-[0.18em] transition-colors cursor-pointer"
              >
                [ RESET TO ARCHIVE &times; ]
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 max-w-[320px] sm:max-w-none">
              {SAREE_COLLECTION.map((s) => {
                const isCurrent = s.id === saree.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectSaree(s.id)}
                    className={`px-2 py-0.5 border text-[8.5px] transition-colors cursor-pointer ${
                      isCurrent
                        ? 'border-current font-medium'
                        : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                    }`}
                    style={isCurrent ? { color: atmosphere.palette.accent } : undefined}
                    title={s.name}
                  >
                    {String(s.number).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ====================================================================
            CENTRAL CINEMATIC TEXTILE STAGE (Constraint 3: Intelligent Containment)
            Never crops aggressively; preserves native framing and borders.
            ==================================================================== */}
        <main className="relative z-10 flex-1 w-full flex items-center justify-center px-4 sm:px-8 py-3 overflow-hidden">
          <div className="relative w-full h-full max-h-[66vh] md:max-h-[72vh] max-w-[88vw] mx-auto flex items-center justify-center">
            {plates.map((plate, idx) => {
              const isActive = idx === activePlateIndex;
              return (
                <div
                  key={`${saree.id}-plate-${idx}`}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-out ${
                    isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                  onClick={() => onExamine(saree)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={plate.src}
                    alt={`${saree.name} — ${plate.caption}`}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                    className="max-h-full max-w-full w-auto h-auto object-contain shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)] cursor-pointer transition-transform duration-700 ease-out hover:scale-[1.01]"
                  />
                </div>
              );
            })}
          </div>
        </main>

        {/* ====================================================================
            BOTTOM TIMELINE THREAD & MOVEMENT CONTROLS
            Continuous thread navigation without conventional carousel dots.
            ==================================================================== */}
        <footer className="relative z-20 w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-14 pb-8 md:pb-10 space-y-4">
          
          {/* Active Observation Metadata Inscription */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-3 mono-spec text-[9.5px] tracking-[0.2em] uppercase">
              <span style={{ color: atmosphere.palette.accent }} className="font-medium">
                OBSERVATION {String(activePlateIndex + 1).padStart(2, '0')} / {String(plates.length).padStart(2, '0')}
              </span>
              <span className="opacity-30">&middot;</span>
              <span className="text-[var(--color-text)] font-normal">
                {currentPlate.movementTag}
              </span>
            </div>

            <div className="flex items-center gap-4 mono-spec text-[9.5px] tracking-[0.18em]">
              <button
                type="button"
                onClick={() => onExamine(saree)}
                className="hover:text-[var(--color-text)] transition-colors cursor-pointer uppercase font-medium flex items-center gap-1.5"
                style={{ color: atmosphere.palette.accent }}
              >
                <span>EXAMINE TEXTILE</span>
                <span>&rarr;</span>
              </button>

              {isFinalPlate && (
                <span className="text-[8.5px] text-[var(--color-text-muted)] tracking-[0.16em] uppercase">
                  [CULMINATION HELD]
                </span>
              )}
            </div>
          </div>

          {/* Continuous Traveling Sequence Thread */}
          <nav aria-label="Cinematic Plate Navigation" className="w-full space-y-2.5">
            {/* Fine continuous progression gauge */}
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-0 transition-all duration-200"
                style={{
                  width: `${(scrollProgress * 100).toFixed(1)}%`,
                  backgroundColor: atmosphere.palette.accent,
                }}
              />
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-9 gap-1.5 items-center">
              {plates.map((plate, idx) => {
                const isActive = idx === activePlateIndex;
                const isPassed = idx < activePlateIndex;

                return (
                  <button
                    key={`step-${idx}`}
                    type="button"
                    onClick={() => handleManualPlateJump(idx)}
                    className="group relative flex flex-col items-center py-1 cursor-pointer transition-all"
                  >
                    {/* Number Mark */}
                    <span
                      className={`mono-spec text-[8.5px] sm:text-[9px] tracking-[0.16em] transition-colors ${
                        isActive
                          ? 'font-medium scale-110'
                          : isPassed
                          ? 'text-[var(--color-text-muted)]'
                          : 'opacity-40 group-hover:opacity-80'
                      }`}
                      style={isActive ? { color: atmosphere.palette.accent } : undefined}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {/* Thread Bar Segment */}
                    <div className="w-full h-[1.5px] mt-1 bg-white/10 relative overflow-hidden">
                      {isActive ? (
                        <div
                          className="absolute inset-0 transition-all duration-300"
                          style={{ backgroundColor: atmosphere.palette.accent }}
                        />
                      ) : isPassed ? (
                        <div className="absolute inset-0 bg-white/40" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

        </footer>
      </div>
    </div>
  );
};
