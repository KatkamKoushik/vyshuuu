'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface SecretSelvedgeGestureProps {
  /**
   * Edge orientation. Defaults to 'right' (the natural selvedge boundary).
   */
  edge?: 'right' | 'left';
  /**
   * Maximum thread separation depth in pixels.
   */
  maxSeparation?: number;
  /**
   * Additional class name for outer container.
   */
  className?: string;
}

/**
 * SecretSelvedgeGesture (Pillar 3 — Secret Textile Gesture)
 * 
 * An intimate, discoverable interaction anchored to the gold/zari selvedge edge.
 * A slow, deliberate horizontal drag gently separates the selvedge thread from the cloth,
 * revealing the underlying digital warp/weft lattice and an intimate authored inscription.
 * 
 * Zero game mechanics, zero badges, zero tutorial popups.
 * Fully supports touch, desktop, reduced motion, and WCAG keyboard accessibility.
 */
export const SecretSelvedgeGesture: React.FC<SecretSelvedgeGestureProps> = ({
  edge = 'right',
  maxSeparation = 160,
  className = '',
}) => {
  const isReducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const [separation, setSeparation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [dragY, setDragY] = useState(200);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  const pointerIntentRef = useRef<'idle' | 'undecided' | 'dragging'>('idle');
  const startPosRef = useRef({ x: 0, y: 0 });

  // Measure dimensions of the parent frame
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setDimensions({ width: rect.width, height: rect.height });
          setDragY(rect.height / 2);
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Viscous settling animation when drag finishes and not locked open
  const settleAnimRef = useRef<number | null>(null);
  const settleTo = useCallback(
    (targetVal: number) => {
      if (isReducedMotion) {
        setSeparation(targetVal);
        return;
      }

      if (settleAnimRef.current) {
        cancelAnimationFrame(settleAnimRef.current);
      }

      const startTime = performance.now();
      const initialSep = separation;
      const duration = 600; // ms

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Overdamped cubic-bezier easing: 1 - (1 - p)^3
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = initialSep + (targetVal - initialSep) * ease;
        setSeparation(currentVal);

        if (progress < 1) {
          settleAnimRef.current = requestAnimationFrame(step);
        } else {
          settleAnimRef.current = null;
        }
      };

      settleAnimRef.current = requestAnimationFrame(step);
    },
    [separation, isReducedMotion]
  );

  useEffect(() => {
    return () => {
      if (settleAnimRef.current) {
        cancelAnimationFrame(settleAnimRef.current);
      }
    };
  }, []);

  // Keyboard accessibility handler (Tab + Enter/Space to unfold)
  const handleToggleAccessibleReveal = useCallback(() => {
    setIsRevealed((prev) => {
      const next = !prev;
      settleTo(next ? maxSeparation * 0.92 : 0);
      return next;
    });
  }, [maxSeparation, settleTo]);

  // Handle ESC key to refold if revealed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRevealed) {
        setIsRevealed(false);
        settleTo(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, settleTo]);

  // Pointer event handlers with strict non-interference for vertical scrolling
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    if (settleAnimRef.current) {
      cancelAnimationFrame(settleAnimRef.current);
    }

    startPosRef.current = { x: e.clientX, y: e.clientY };
    pointerIntentRef.current = 'undecided';

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const localY = Math.max(16, Math.min(rect.height - 16, e.clientY - rect.top));
      setDragY(localY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) return; // Handled by global window listener

    const dx = edge === 'right' ? startPosRef.current.x - e.clientX : e.clientX - startPosRef.current.x;
    const dy = Math.abs(e.clientY - startPosRef.current.y);

    if (pointerIntentRef.current === 'undecided') {
      if (dy > 8 && dy > Math.abs(dx)) {
        // Visitor is scrolling vertically: cancel gesture intent
        pointerIntentRef.current = 'idle';
        return;
      }
      if (dx > 5 && dx > dy) {
        // Deliberate horizontal thread displacement confirmed
        pointerIntentRef.current = 'dragging';
        setIsDragging(true);

        const rawInward = Math.max(0, dx);
        const viscousSeparation = Math.min(
          maxSeparation,
          Math.pow(rawInward, 0.84) * 2.1
        );
        setSeparation(viscousSeparation);
      }
    }
  };

  // Window-level tracking during active dragging for fluid drag across viewport
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMove = (e: PointerEvent) => {
      const dx = edge === 'right' ? startPosRef.current.x - e.clientX : e.clientX - startPosRef.current.x;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const localY = Math.max(16, Math.min(rect.height - 16, e.clientY - rect.top));
        setDragY(localY);
      }

      const rawInward = Math.max(0, dx);
      const viscousSeparation = Math.min(
        maxSeparation,
        Math.pow(rawInward, 0.84) * 2.1
      );
      setSeparation(viscousSeparation);
    };

    const handleGlobalUp = () => {
      setIsDragging(false);
      pointerIntentRef.current = 'idle';
      if (!isRevealed) {
        settleTo(0);
      }
    };

    window.addEventListener('pointermove', handleGlobalMove);
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointercancel', handleGlobalUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalMove);
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointercancel', handleGlobalUp);
    };
  }, [isDragging, edge, maxSeparation, isRevealed, settleTo]);

  // Normalized revelation progress (0.00 to 1.00)
  const normProgress = Math.max(0, Math.min(1, separation / maxSeparation));
  const isSeparated = separation > 3;

  // Compute curved catenary path for the separating gold selvedge thread
  const w = dimensions.width;
  const h = dimensions.height;
  const isRight = edge === 'right';

  // Thread apex coordinates
  const anchorX = isRight ? w : 0;
  const apexX = isRight ? w - separation : separation;

  const threadCurvePath = isRight
    ? `M ${w} 0 Q ${apexX} ${dragY} ${w} ${h}`
    : `M 0 0 Q ${apexX} ${dragY} 0 ${h}`;

  // 7 transverse micro-filaments (delicate warp ties stretching from cloth to separated thread)
  const filamentCount = 7;
  const filaments = Array.from({ length: filamentCount }, (_, i) => {
    const t = (i + 1) / (filamentCount + 1);
    const filY = h * t;
    // Quadratic Bezier deflection at parameter t: B(t) = 2 * (1 - t) * t * separation
    const filDeflection = 2 * (1 - t) * t * (separation * 1.05);
    const filX = isRight ? w - filDeflection : filDeflection;
    return {
      id: i,
      x1: anchorX,
      y1: filY,
      x2: filX,
      y2: filY,
      opacity: Math.min(0.65, normProgress * 0.75),
    };
  });

  return (
    <div
      ref={containerRef}
      data-testid="secret-selvedge-gesture"
      data-selvedge-state={isDragging ? 'dragging' : isRevealed ? 'revealed' : 'resting'}
      className={`absolute inset-0 z-20 pointer-events-none select-none overflow-hidden ${className}`}
    >
      {/* ====================================================================
          CONCEALED INTERSTICE CHAMBER: DIGITAL WARP/WEFT & INTIMATE INSCRIPTION
          Revealed behind the separating gold thread via smooth unmasking aperture.
          ==================================================================== */}
      <div
        aria-hidden={!isSeparated && !isRevealed}
        className="absolute top-0 bottom-0 pointer-events-none transition-opacity duration-300 ease-out overflow-hidden"
        style={{
          [isRight ? 'right' : 'left']: 0,
          width: `${Math.max(0, separation)}px`,
          opacity: normProgress > 0.05 ? 1 : 0,
        }}
      >
        {/* Full-width unmasked content container anchored to the selvedge edge */}
        <div
          className="absolute top-0 bottom-0 w-[240px] sm:w-[280px] overflow-hidden"
          style={{
            [isRight ? 'right' : 'left']: 0,
          }}
        >
          {/* Deep Obsidian Ground & Smoked Glass Veil */}
          <div className="absolute inset-0 bg-[#090807]/95 backdrop-blur-md border-l border-[#c5a869]/25" />

          {/* Digital Warp & Weft Structural Matrix (160x120 orthogonal lattice) */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(197, 168, 105, 0.22) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(222, 213, 198, 0.14) 1px, transparent 1px)
              `,
              backgroundSize: '12px 12px',
            }}
          />

          {/* Microscopic Weave Notation (Truthful Digital Loom Specification) */}
          <div
            className="absolute top-3 right-3 mono-spec text-[7.5px] text-[#c5a869]/80 tracking-[0.22em] uppercase transition-opacity duration-300"
            style={{ opacity: normProgress > 0.35 ? 1 : 0 }}
          >
            [ WARP 160 &times; WEFT 120 &middot; SILICON LOOM ]
          </div>

          {/* Intimate Curatorial Inscription (Authored by Vyshnavi for VYSHUUU) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-all duration-400 ease-out"
            style={{
              opacity: normProgress > 0.2 ? Math.min(1, (normProgress - 0.2) / 0.45) : 0,
              transform: isReducedMotion
                ? 'none'
                : `translateX(${(1 - normProgress) * 16}px)`,
            }}
          >
            <span className="mono-spec text-[8px] sm:text-[8.5px] text-[#c5a869] tracking-[0.3em] uppercase block mb-2">
              THE UNSTITCHED CONTINUUM
            </span>

            <p className="font-serif italic text-[11px] sm:text-xs text-[#ded5c6] leading-relaxed max-w-[200px] sm:max-w-[220px]">
              &ldquo;Six yards of topological memory, held solely by tension, friction, and light.&rdquo;
            </p>

            <div className="mt-3 pt-1.5 border-t border-[#c5a869]/30 flex items-center justify-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#c5a869]/80" />
              <span className="mono-spec text-[8px] text-[#c5a869] tracking-[0.24em] uppercase font-medium">
                VYSHUUU &mdash; VYSHNAVI
              </span>
              <span className="w-1 h-1 rounded-full bg-[#c5a869]/80" />
            </div>
          </div>

          {/* Bottom Selvedge Terminus Tag */}
          <div
            className="absolute bottom-3 left-3 mono-spec text-[7px] text-[#8a7f6e] tracking-[0.2em] uppercase transition-opacity duration-300"
            style={{ opacity: normProgress > 0.4 ? 0.8 : 0 }}
          >
            SELVEDGE WIRE &middot; 0.035 GRAZING
          </div>
        </div>
      </div>

      {/* ====================================================================
          SVG THREAD SEPARATION LAYER: CATENARY DEFLECTION & WARP FILAMENTS
          ==================================================================== */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Metallic Antique Gold Gradient for the Selvedge Wire */}
          <linearGradient id="selvedgeGoldThread" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8c7443" />
            <stop offset="20%" stopColor="#d4b872" />
            <stop offset="50%" stopColor="#f7ecd0" />
            <stop offset="80%" stopColor="#d4b872" />
            <stop offset="100%" stopColor="#8c7443" />
          </linearGradient>

          {/* Microscopic Glisten Filter */}
          <filter id="threadGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Transverse Warp Filaments (Stretching between cloth and separated thread) */}
        {isSeparated &&
          filaments.map((fil) => (
            <line
              key={fil.id}
              x1={fil.x1}
              y1={fil.y1}
              x2={fil.x2}
              y2={fil.y2}
              stroke="var(--color-accent-zari, #c5a869)"
              strokeWidth="0.75"
              strokeDasharray="1.5 2"
              opacity={fil.opacity}
            />
          ))}

        {/* The Primary Selvedge Wire (Deflected Bezier Curve during drag / straight at rest) */}
        <path
          d={isSeparated ? threadCurvePath : `M ${anchorX} 0 L ${anchorX} ${h}`}
          fill="none"
          stroke="url(#selvedgeGoldThread)"
          strokeWidth={isSeparated ? 1.75 : 1.25}
          filter="url(#threadGlow)"
          className="transition-opacity duration-300"
          style={{
            opacity: isHovered || isSeparated ? 1 : 0.82,
          }}
        />

        {/* Discrete Interlock Teeth along the Resting Selvedge Edge (Authentic brocade pick ticks) */}
        {!isSeparated && (
          <g opacity="0.45">
            {Array.from({ length: Math.floor(h / 14) }, (_, i) => {
              const tickY = (i + 1) * 14;
              return (
                <line
                  key={i}
                  x1={isRight ? anchorX - 2.5 : anchorX}
                  y1={tickY}
                  x2={isRight ? anchorX : anchorX + 2.5}
                  y2={tickY}
                  stroke="var(--color-accent-zari, #c5a869)"
                  strokeWidth="0.8"
                />
              );
            })}
          </g>
        )}
      </svg>

      {/* ====================================================================
          INTERACTIVE SELVEDGE EDGE HIT ZONE (Touch + Mouse Pointer)
          Safe touch-action: pan-y ensures vertical scrolling is never locked.
          ==================================================================== */}
      <div
        role="presentation"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => {
          if (!isDragging) setIsHovered(false);
        }}
        className={`absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize touch-pan-y z-30 transition-colors ${
          isRight ? 'right-0 w-8 sm:w-10' : 'left-0 w-8 sm:w-10'
        }`}
        style={{
          touchAction: 'pan-y',
        }}
        title="Selvedge edge"
      >
        {/* Subtle, restrained hover glint along the thread boundary */}
        <div
          className={`absolute inset-y-0 w-[2px] transition-all duration-500 ${
            isRight ? 'right-0' : 'left-0'
          } ${
            isHovered || isSeparated
              ? 'bg-[#c5a869] shadow-[0_0_8px_rgba(197,168,105,0.8)]'
              : 'bg-[#c5a869]/70'
          }`}
        />
      </div>

      {/* ====================================================================
          ACCESSIBLE ALTERNATIVE: KEYBOARD TRIGGER & ARIA-LIVE REGION (WCAG 2.1)
          Allows visitors who cannot perform a physical drag gesture to unfold.
          ==================================================================== */}
      <button
        id="selvedge-accessible-btn"
        type="button"
        aria-label={
          isRevealed
            ? 'Release selvedge thread to conceal author inscription'
            : 'Separate selvedge thread to inspect underlying weave'
        }
        aria-expanded={isRevealed}
        onClick={handleToggleAccessibleReveal}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRight ? 'right-1' : 'left-1'
        } ${
          isRevealed
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none focus-visible:opacity-100 focus-visible:pointer-events-auto'
        } focus-visible:ring-1 focus-visible:ring-[#c5a869] bg-[#0c0b0a]/90 text-[#ded5c6] mono-spec text-[8px] tracking-[0.16em] uppercase px-2 py-1.5 border border-[#c5a869]/50 shadow-lg z-40 transition-opacity cursor-pointer`}
      >
        <span>
          {isRevealed ? '[ REFOLD THREAD ]' : '[ UNFOLD SELVEDGE THREAD ]'}
        </span>
      </button>

      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite">
        {isRevealed
          ? 'Selvedge thread separated. Authored inscription revealed: Six yards of topological memory, held solely by tension, friction, and light. — VYSHUUU / Vyshnavi.'
          : ''}
      </div>
    </div>
  );
};
