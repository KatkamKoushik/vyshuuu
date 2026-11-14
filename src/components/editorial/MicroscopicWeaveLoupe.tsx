'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getLenis } from '@/lib/lenis';
import { audioEngine } from '@/lib/audio/webAudioEngine';

export interface MicroscopicWeaveLoupeProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title: string;
  workNumber: string;
  structuralLogic?: string;
  metallicAccent?: string;
  movementTag?: string;
  isNested?: boolean;
}

/**
 * MicroscopicWeaveLoupe (Phase 4 — Optical Glass Weave Loupe Simulation)
 * Active Theory / Santioni Spirits glass tier:
 * 1. Spherical lens curvature & barrel distortion profile across the magnified canvas.
 * 2. Chromatic aberration / dispersion separating red and cyan/blue wavelengths toward the outer perimeter.
 * 3. Physical glass coating specular reflections (MgF₂ multi-layer AR coating) and conservation-glass reticle.
 * 4. Interactive raking chiaroscuro spotlight responding to cursor coordinates with dynamic directional shadows & zari sheen.
 * 5. Web Audio integration: subtle optical focus clicks during zoom and pan detents.
 */
export const MicroscopicWeaveLoupe: React.FC<MicroscopicWeaveLoupeProps> = ({
  isOpen,
  onClose,
  src,
  alt,
  title,
  workNumber,
  structuralLogic,
  metallicAccent = '#c5a869',
  movementTag = 'WEAVE ARCHITECTURE',
  isNested = false,
}) => {
  const isReducedMotion = usePrefersReducedMotion();

  // Transform state (Scale: 1.0 to 4.0, Offsets: pan coordinates in px)
  const [scale, setScale] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Raking light coordinates relative to container (px)
  const [lightPos, setLightPos] = useState({ x: 0, y: 0 });
  const [isLightActive, setIsLightActive] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });

  // Internal physics & gesture tracking refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, offX: 0, offY: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const panAccumulatorRef = useRef(0);
  const pinchDistRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const previousScrollY = useRef(0);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Update container size on mount/resize
  useEffect(() => {
    if (!isOpen) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ width: rect.width, height: rect.height });
          // Default light position to top-right quadrant (classic museum raking light angle)
          setLightPos({ x: rect.width * 0.68, y: rect.height * 0.32 });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isOpen]);

  // Reset transforms whenever opened or when source changes
  useEffect(() => {
    if (isOpen) {
      setScale(1.0);
      setOffset({ x: 0, y: 0 });
      panAccumulatorRef.current = 0;

      // Play initial lens aperture focus sound
      audioEngine.triggerFocusClick('zoom', 1.0, 0.28);

      // Immediate cache check to avoid opacity-0 when already in browser memory
      if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
      }

      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 500);

      if (typeof window !== 'undefined') {
        previousScrollY.current = window.scrollY;
        previousActiveElement.current = document.activeElement as HTMLElement | null;

        // Lock background scroll via Lenis and body styles
        document.body.style.overflow = 'hidden';
        getLenis()?.stop();
      }

      return () => {
        clearTimeout(timer);
      };
    } else {
      if (typeof window !== 'undefined') {
        if (!isNested) {
          document.body.style.overflow = '';
          getLenis()?.start();
        }
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        if (!isNested) {
          document.body.style.overflow = '';
          getLenis()?.start();
        }
      }
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen, src, isNested]);

  // Inertial momentum decay loop
  const startMomentumDecay = useCallback(() => {
    if (isReducedMotion) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

    const decay = () => {
      velocityRef.current.vx *= 0.88;
      velocityRef.current.vy *= 0.88;

      if (Math.abs(velocityRef.current.vx) > 0.15 || Math.abs(velocityRef.current.vy) > 0.15) {
        setOffset((prev) => {
          // Boundary calculation
          const maxPan = 650 * (scale - 0.9);
          const nextX = Math.max(-maxPan, Math.min(maxPan, prev.x + velocityRef.current.vx));
          const nextY = Math.max(-maxPan, Math.min(maxPan, prev.y + velocityRef.current.vy));
          return { x: nextX, y: nextY };
        });
        rafIdRef.current = requestAnimationFrame(decay);
      }
    };
    rafIdRef.current = requestAnimationFrame(decay);
  }, [isReducedMotion, scale]);

  // Mouse wheel zoom centered on cursor with audio feedback
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const zoomSpeed = 0.0018;
      const factor = 1 - e.deltaY * zoomSpeed;
      const targetScale = Math.max(1.0, Math.min(4.0, scale * factor));

      if (Math.abs(targetScale - scale) > 0.015) {
        audioEngine.triggerFocusClick('zoom', 0.85 + targetScale * 0.28, 0.24);
      }

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = e.clientX - rect.left - rect.width / 2;
        const cursorY = e.clientY - rect.top - rect.height / 2;

        const ratio = targetScale / scale;
        const newX = cursorX - (cursorX - offset.x) * ratio;
        const newY = cursorY - (cursorY - offset.y) * ratio;

        const maxPan = 650 * (targetScale - 0.9);
        setOffset({
          x: targetScale === 1.0 ? 0 : Math.max(-maxPan, Math.min(maxPan, newX)),
          y: targetScale === 1.0 ? 0 : Math.max(-maxPan, Math.min(maxPan, newY)),
        });
      }

      setScale(targetScale);
    },
    [scale, offset]
  );

  // Pointer move: update raking light & pan drag with tactile audio detents
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      setLightPos({ x: lx, y: ly });
      if (!isLightActive) setIsLightActive(true);

      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const now = performance.now();
        const dt = Math.max(1, now - lastPointerRef.current.time);

        const stepDx = e.clientX - lastPointerRef.current.x;
        const stepDy = e.clientY - lastPointerRef.current.y;
        const stepDist = Math.hypot(stepDx, stepDy);

        panAccumulatorRef.current += stepDist;
        if (panAccumulatorRef.current > 62) {
          audioEngine.triggerFocusClick('pan', 1.0, 0.15);
          panAccumulatorRef.current = 0;
        }

        const vx = (stepDx / dt) * 14;
        const vy = (stepDy / dt) * 14;
        velocityRef.current = { vx, vy };

        // Subtle glint chime if rapid raking across zari slubs
        if (Math.hypot(vx, vy) > 28 && Math.random() < 0.12) {
          audioEngine.triggerZariChime(1.2 + Math.random() * 0.35, 0.22);
        }

        lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };

        const maxPan = 650 * (scale - 0.9);
        setOffset({
          x: Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.offX + dx)),
          y: Math.max(-maxPan, Math.min(maxPan, dragStartRef.current.offY + dy)),
        });
      }
    },
    [isDragging, isLightActive, scale]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offX: offset.x,
        offY: offset.y,
      };
      lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      velocityRef.current = { vx: 0, vy: 0 };
    },
    [offset]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    startMomentumDecay();
  }, [isDragging, startMomentumDecay]);

  // Touch Pinch-to-Zoom Support
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

        if (pinchDistRef.current !== null) {
          const delta = dist - pinchDistRef.current;
          const factor = 1 + delta * 0.005;
          const nextScale = Math.max(1.0, Math.min(4.0, scale * factor));
          if (Math.abs(nextScale - scale) > 0.05) {
            audioEngine.triggerFocusClick('zoom', 0.9 + nextScale * 0.25, 0.2);
          }
          setScale(nextScale);
        }
        pinchDistRef.current = dist;
      }
    },
    [scale]
  );

  const handleTouchEnd = useCallback(() => {
    pinchDistRef.current = null;
  }, []);

  // Keyboard Navigation: ESC to dismiss, +/- to zoom, 0 to reset
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale((s) => {
          const next = Math.min(4.0, Number((s + 0.5).toFixed(2)));
          audioEngine.triggerFocusClick('zoom', 1.3, 0.28);
          return next;
        });
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setScale((s) => {
          const next = Math.max(1.0, Number((s - 0.5).toFixed(2)));
          if (next === 1.0) setOffset({ x: 0, y: 0 });
          audioEngine.triggerFocusClick('zoom', 0.9, 0.28);
          return next;
        });
      } else if (e.key === '0' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        audioEngine.triggerFocusClick('reset', 1.0, 0.35);
        setScale(1.0);
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Stepped zoom handlers for museum reticle buttons
  const stepZoomIn = () => {
    audioEngine.triggerFocusClick('zoom', 1.3, 0.28);
    setScale((s) => Math.min(4.0, Number((s + 0.5).toFixed(2))));
  };

  const stepZoomOut = () => {
    audioEngine.triggerFocusClick('zoom', 0.9, 0.28);
    setScale((s) => {
      const next = Math.max(1.0, Number((s - 0.5).toFixed(2)));
      if (next === 1.0) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const resetZoom = () => {
    audioEngine.triggerFocusClick('reset', 1.0, 0.35);
    setScale(1.0);
    setOffset({ x: 0, y: 0 });
  };

  // Optical physics calculations for Active Theory glass simulation:
  const opticalPhysics = useMemo(() => {
    const cx = containerSize.width / 2;
    const cy = containerSize.height / 2;

    // Vector from center of loupe viewport to light source
    const lx = lightPos.x - cx;
    const ly = lightPos.y - cy;
    const lightDist = Math.hypot(lx, ly);
    const lightAngleRad = Math.atan2(ly, lx);
    const lightAngleDeg = (lightAngleRad * 180) / Math.PI;

    // Opposite angle for grazing shadow cast (shadow falls opposite to light)
    const shadowAngleDeg = (lightAngleDeg + 180) % 360;

    // Specular highlight parallax on curved glass (moves inversely to cursor)
    const specParallaxX = Math.max(15, Math.min(85, 100 - (lightPos.x / containerSize.width) * 100));
    const specParallaxY = Math.max(15, Math.min(85, 100 - (lightPos.y / containerSize.height) * 100));

    // Screen vector from transformed specimen visual center to cursor light
    const screenCenterLightDx = lightPos.x - cx - offset.x;
    const screenCenterLightDy = lightPos.y - cy - offset.y;

    // In local untransformed coordinates (scaled by 1/scale)
    const localLightOffset = {
      x: screenCenterLightDx / scale,
      y: screenCenterLightDy / scale,
    };

    const localSpotlightX = `calc(50% + ${localLightOffset.x.toFixed(1)}px)`;
    const localSpotlightY = `calc(50% + ${localLightOffset.y.toFixed(1)}px)`;

    // Chromatic dispersion vector: grows with scale and distance from optical center
    const panDist = Math.hypot(offset.x, offset.y);
    const normPan = Math.min(1.0, panDist / 420);
    const dispersionMag = Math.max(0, (scale - 1.0) * 1.8 + normPan * 2.2);

    // Directional dispersion offsets
    const dispAngle = Math.atan2(offset.y, offset.x || 1);
    const dispRedX = Math.cos(dispAngle) * dispersionMag * 1.4;
    const dispRedY = Math.sin(dispAngle) * dispersionMag * 1.4;
    const dispCyanX = -dispRedX;
    const dispCyanY = -dispRedY;

    // Microscopic resolution readout (ISO 105-B02 conservation scale)
    const micronResolution = (0.85 / scale).toFixed(2);
    const graticuleDiv = (100 / scale).toFixed(0);

    // Barrel distortion scale: subtle at 1.0x, increases with magnification up to 7px
    const barrelDistortionScale = Math.min(7.5, Math.max(1.5, (scale - 1.0) * 2.6 + 1.2));

    return {
      lightAngleDeg,
      shadowAngleDeg,
      lightDist,
      specParallaxX,
      specParallaxY,
      localSpotlightX,
      localSpotlightY,
      dispersionMag,
      dispRedX,
      dispRedY,
      dispCyanX,
      dispCyanY,
      micronResolution,
      graticuleDiv,
      barrelDistortionScale,
    };
  }, [containerSize, lightPos, offset, scale]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Microscopic Weave Loupe Chamber"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[200] select-none overflow-hidden bg-[#070605] text-[#f2ede4] flex flex-col justify-between"
      style={{
        backgroundColor: '#070605',
      }}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ====================================================================
          SVG OPTICAL FILTERS & RETICLE SHADERS
          ==================================================================== */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          {/* Spherical Crown Glass Reticle Glow */}
          <filter id="glassReticleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Authentic Wavelength Spectral Channel Decomposition Filters */}
          <filter id="spectralRedChannel" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id="spectralCyanChannel" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            />
          </filter>

          {/* Spherical Optical Barrel Distortion Shader (Active Theory glass tier) */}
          <filter id="sphericalBarrelDistortion" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.002 0.002" numOctaves="1" result="lensWarp" />
            <feDisplacementMap in="SourceGraphic" in2="lensWarp" scale={opticalPhysics.barrelDistortionScale.toFixed(1)} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ====================================================================
          MUSEUM INSTRUMENT HEADER (UI LAST — DISCREET & RESTRAINED)
          ==================================================================== */}
      <header className="relative z-30 w-full px-6 py-4 md:px-10 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 mono-spec text-[8.5px] text-[#c5a869] tracking-[0.25em] uppercase">
            <span>MICROSCOPIC WEAVE LOUPE</span>
            <span className="opacity-40">&middot;</span>
            <span className="text-white/60">{workNumber}</span>
            <span className="opacity-40">&middot;</span>
            <span>{movementTag}</span>
            <span className="opacity-40 hidden sm:inline">&middot;</span>
            <span className="text-white/40 hidden sm:inline">APOCHROMAT f/1.4</span>
          </div>
          <h2 className="display-sm text-base md:text-lg font-normal tracking-[0.04em] text-white">
            {title}
          </h2>
          {structuralLogic && (
            <p className="caption-tracked text-[9px] text-white/50 tracking-[0.16em]">
              {structuralLogic}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Microscopic Examination"
            className="mono-spec text-[9.5px] tracking-[0.22em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer px-3.5 py-1.5 border border-white/15 rounded-[1px] hover:border-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a869]"
          >
            [ CLOSE &times; ]
          </button>
        </div>
      </header>

      {/* ====================================================================
          OPTICAL GLASS INSTRUMENT CHAMBER (ACTIVE THEORY / SANTIONI SPIRITS TIER)
          ==================================================================== */}
      <main
        ref={containerRef}
        className={`relative flex-1 w-full overflow-hidden flex items-center justify-center cursor-grab ${
          isDragging ? 'cursor-grabbing active:cursor-grabbing' : ''
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* ==================================================================
            1. SPHERICAL LENS BARREL HOUSING & BEVELED HOOD
            Concentric curvature rings indicating thick crown glass meniscus.
            ================================================================== */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
        >
          {/* Inner Spherical Lens Contour Vignette (cos⁴ θ falloff toward outer perimeter) */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 45%, rgba(7, 6, 5, 0.45) 75%, rgba(7, 6, 5, 0.88) 100%)`,
            }}
          />

          {/* Meniscus Curvature Contour Rings (Subtle 5% opacity concentric glass rings) */}
          <div className="relative w-[88vw] max-w-[980px] aspect-square rounded-full border border-white/[0.04] pointer-events-none flex items-center justify-center">
            <div className="w-[74%] aspect-square rounded-full border border-white/[0.035] flex items-center justify-center">
              <div className="w-[62%] aspect-square rounded-full border border-white/[0.028]" />
            </div>

            {/* Perimeter Degree Indices on the Lens Bezel */}
            <div className="absolute inset-0 flex items-center justify-between px-3 text-[7px] mono-spec text-white/20 uppercase tracking-widest">
              <span>180&deg; W</span>
              <span>000&deg; E</span>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-3 text-[7px] mono-spec text-white/20 uppercase tracking-widest">
              <span>090&deg; N</span>
              <span>270&deg; S</span>
            </div>
          </div>
        </div>

        {/* ==================================================================
            2. THE MAGNIFIED WEAVE SPECIMEN CANVAS (TEXTILE FIRST)
            With Inertial Pan/Zoom + Spherical Curvature & Chromatic Aberration
            ================================================================== */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
            transition: isDragging
              ? 'none'
              : isReducedMotion
              ? 'none'
              : 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center center',
          }}
        >
          {/* Strict Aspect-Constrained Textile Frame */}
          <div
            className="relative inline-block max-w-[85vw] max-h-[72vh] md:max-w-[70vw] md:max-h-[76vh]"
            style={{
              filter: !isReducedMotion && scale > 1.15 ? 'url(#sphericalBarrelDistortion)' : undefined,
            }}
          >
            {/* Layer A: Base High-Fidelity Textile Specimen */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              className={`max-w-[85vw] max-h-[72vh] md:max-w-[70vw] md:max-h-[76vh] object-contain shadow-[0_30px_100px_rgba(0,0,0,0.95)] border border-white/10 transition-opacity duration-700 block ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              draggable={false}
            />

            {/* Layer B: True Red Wavelength Dispersion Fringe */}
            {!isReducedMotion && isLoaded && opticalPhysics.dispersionMag > 0.08 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-screen block"
                style={{
                  transform: `translate3d(${opticalPhysics.dispRedX.toFixed(2)}px, ${opticalPhysics.dispRedY.toFixed(2)}px, 0)`,
                  filter: 'url(#spectralRedChannel)',
                  opacity: Math.min(0.55, 0.22 + opticalPhysics.dispersionMag * 0.08),
                }}
                draggable={false}
              />
            )}

            {/* Layer C: True Cyan/Blue Wavelength Dispersion Fringe */}
            {!isReducedMotion && isLoaded && opticalPhysics.dispersionMag > 0.08 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-screen block"
                style={{
                  transform: `translate3d(${opticalPhysics.dispCyanX.toFixed(2)}px, ${opticalPhysics.dispCyanY.toFixed(2)}px, 0)`,
                  filter: 'url(#spectralCyanChannel)',
                  opacity: Math.min(0.55, 0.22 + opticalPhysics.dispersionMag * 0.08),
                }}
                draggable={false}
              />
            )}

            {/* ================================================================
                4. INTERACTIVE RAKING CHIAROSCURO SPOTLIGHT
                Dynamic grazing beam, anisotropic zari glint, and fiber drop shadows.
                ================================================================ */}
            {!isReducedMotion && isLightActive && isLoaded && (
              <>
                {/* Primary Diffuse Warm Grazing Beam Centered on Cursor */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle 520px at ${opticalPhysics.localSpotlightX} ${opticalPhysics.localSpotlightY}, rgba(255, 250, 240, 0.35) 0%, rgba(212, 185, 128, 0.14) 40%, transparent 75%)`,
                  }}
                />

                {/* Anisotropic Metallic Zari Specular Sheen (Grazing Angle Highlight) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-45 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(ellipse 680px 380px at ${opticalPhysics.localSpotlightX} ${opticalPhysics.localSpotlightY}, ${metallicAccent}60 0%, transparent 68%)`,
                  }}
                />

                {/* Fiber Relief Micro-Embossing Shadow (Directional shadow opposite to light beam) */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-28 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(${opticalPhysics.shadowAngleDeg}deg, rgba(12, 10, 8, 0.45) 0%, transparent 35%)`,
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* ==================================================================
            3. PHYSICAL GLASS COATING SPECULAR REFLECTIONS (MgF₂ MULTI-LAYER AR)
            Interactive violet/cyan & golden amber anti-reflective coating glare.
            ================================================================== */}
        {!isReducedMotion && isLoaded && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-15 overflow-hidden"
          >
            {/* Primary Anti-Reflective Magnesium Fluoride Coating Sheen (Deep Violet / Cerulean) */}
            <div
              className="absolute inset-0 mix-blend-screen transition-all duration-300 ease-out"
              style={{
                background: `radial-gradient(ellipse 55% 42% at ${opticalPhysics.specParallaxX.toFixed(1)}% ${opticalPhysics.specParallaxY.toFixed(1)}%, rgba(98, 54, 180, 0.09) 0%, rgba(30, 80, 160, 0.04) 40%, transparent 75%)`,
              }}
            />

            {/* Secondary Crown Glass Amber Sheen */}
            <div
              className="absolute inset-0 mix-blend-color-dodge transition-all duration-300 ease-out opacity-60"
              style={{
                background: `radial-gradient(ellipse 40% 30% at ${(100 - opticalPhysics.specParallaxX).toFixed(1)}% ${(100 - opticalPhysics.specParallaxY).toFixed(1)}%, rgba(197, 168, 105, 0.065) 0%, transparent 60%)`,
              }}
            />
          </div>
        )}

        {/* ==================================================================
            3B. CONSERVATION-GLASS SCIENTIFIC RETICLE & CALIBRATION GRATICULE
            Dynamic micron scale, cardinal ticks, and sub-millimeter clearance hole.
            ================================================================== */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
        >
          {/* Central Precision Optical Graticule Box */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 pointer-events-none opacity-25 border border-white/20">
            {/* Corner Architectural Brackets */}
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#c5a869]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#c5a869]" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#c5a869]" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#c5a869]" />

            {/* Precision Crosshair with Central Clearance Aperture (12px gap) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/25">
              <div className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-transparent" />
            </div>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/25">
              <div className="absolute left-1/2 -translate-x-1/2 h-px w-3 bg-transparent" />
            </div>

            {/* Central Clearance Focus Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/35" />

            {/* Micron Scale Bar (Calibrated dynamically by magnification scale) */}
            <div className="absolute bottom-2 left-2 flex flex-col gap-0.5 mono-spec text-[7.5px] text-[#c5a869]/80 tracking-widest">
              <span>CAL: {opticalPhysics.graticuleDiv}&mu;m DIV</span>
              <div className="flex items-center gap-1">
                <span className="w-8 h-px bg-[#c5a869]/70" />
                <span className="text-[6.5px] opacity-60">100&mu;m</span>
              </div>
            </div>

            {/* Resolving Power Stamp */}
            <div className="absolute top-2 right-2 mono-spec text-[7px] text-white/50 tracking-[0.2em] uppercase text-right">
              RES: {opticalPhysics.micronResolution}&mu;m
            </div>
          </div>
        </div>
      </main>

      {/* ====================================================================
          MUSEUM RETICLE CONTROLS FOOTER (UI LAST)
          Minimal controls: + / − / RESET / MAGNIFICATION INDICATOR & TELEMETRY
          ==================================================================== */}
      <footer className="relative z-30 w-full px-6 py-4 md:px-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-black/60 backdrop-blur-xl">
        {/* Scale of Perception Indicator & Telemetry */}
        <div className="flex items-center gap-3 mono-spec text-[9px] text-white/60 tracking-[0.2em] uppercase">
          <span className="text-[#c5a869] font-medium">
            SCALE: {scale.toFixed(1)}&times;
          </span>
          <span className="opacity-30">&middot;</span>
          <span className="text-white/40">
            {scale <= 1.2
              ? 'MACRO SURFACE [0.85μm]'
              : scale <= 2.5
              ? 'WEAVE TOPOLOGY [0.42μm]'
              : 'FILAMENT INTERSTICES [0.21μm]'}
          </span>
        </div>

        {/* Reticle Controls: -, +, Reset */}
        <div className="flex items-center gap-2 mono-spec text-[10px]">
          <button
            type="button"
            onClick={stepZoomOut}
            disabled={scale <= 1.0}
            aria-label="Decrease Magnification"
            className="w-8 h-8 flex items-center justify-center border border-white/15 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none rounded-[1px] text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a869]"
          >
            &minus;
          </button>

          <span
            className="px-3 py-1 min-w-[56px] text-center border border-white/10 bg-white/5 font-medium tracking-[0.14em]"
            style={{ color: metallicAccent }}
          >
            {scale.toFixed(1)}&times;
          </span>

          <button
            type="button"
            onClick={stepZoomIn}
            disabled={scale >= 4.0}
            aria-label="Increase Magnification"
            className="w-8 h-8 flex items-center justify-center border border-white/15 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none rounded-[1px] text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a869]"
          >
            &#43;
          </button>

          <button
            type="button"
            onClick={resetZoom}
            disabled={scale === 1.0 && offset.x === 0 && offset.y === 0}
            aria-label="Reset Scale and Pan"
            className="ml-2 px-3 py-1.5 border border-white/15 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none rounded-[1px] text-white/70 hover:text-white tracking-[0.18em] uppercase text-[8.5px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a869]"
          >
            RESET
          </button>
        </div>

        {/* Discreet Interaction Inscription */}
        <div className="hidden sm:block mono-spec text-[8.5px] text-white/40 tracking-[0.18em] uppercase">
          <span>DRAG TO PAN &middot; SCROLL/PINCH TO ZOOM &middot; ESC TO EXIT</span>
        </div>
      </footer>
    </div>,
    document.body
  );
};
