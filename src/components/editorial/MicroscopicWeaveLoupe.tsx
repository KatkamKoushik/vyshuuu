'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { getLenis } from '@/lib/lenis';

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
}

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
}) => {
  const isReducedMotion = usePrefersReducedMotion();

  // Transform state (Scale: 1.0 to 4.0, Offsets: pan coordinates in px)
  const [scale, setScale] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Raking light coordinates relative to container (px)
  const [lightPos, setLightPos] = useState({ x: 0, y: 0 });
  const [isLightActive, setIsLightActive] = useState(false);

  // Internal physics & gesture tracking refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, offX: 0, offY: 0 });
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const pinchDistRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const previousScrollY = useRef(0);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Reset transforms whenever opened or when source changes
  useEffect(() => {
    if (isOpen) {
      setScale(1.0);
      setOffset({ x: 0, y: 0 });

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
        document.body.style.overflow = '';
        getLenis()?.start();
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
        getLenis()?.start();
      }
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen, src]);

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
          const maxPan = 600 * (scale - 0.9);
          const nextX = Math.max(-maxPan, Math.min(maxPan, prev.x + velocityRef.current.vx));
          const nextY = Math.max(-maxPan, Math.min(maxPan, prev.y + velocityRef.current.vy));
          return { x: nextX, y: nextY };
        });
        rafIdRef.current = requestAnimationFrame(decay);
      }
    };
    rafIdRef.current = requestAnimationFrame(decay);
  }, [isReducedMotion, scale]);

  // Mouse wheel zoom centered on cursor
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      const zoomSpeed = 0.0018;
      const factor = 1 - e.deltaY * zoomSpeed;
      const targetScale = Math.max(1.0, Math.min(4.0, scale * factor));

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

  // Pointer move: update raking light & pan drag
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

        velocityRef.current = {
          vx: (e.clientX - lastPointerRef.current.x) / dt * 14,
          vy: (e.clientY - lastPointerRef.current.y) / dt * 14,
        };

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
          setScale((s) => Math.max(1.0, Math.min(4.0, s * factor)));
        }
        pinchDistRef.current = dist;
      }
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    pinchDistRef.current = null;
  }, []);

  // Keyboard Navigation: ESC to dismiss, +/- to zoom, 0 to reset
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        setScale((s) => Math.min(4.0, Number((s + 0.5).toFixed(2))));
      } else if (e.key === '-' || e.key === '_') {
        setScale((s) => {
          const next = Math.max(1.0, Number((s - 0.5).toFixed(2)));
          if (next === 1.0) setOffset({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0' || e.key.toLowerCase() === 'r') {
        setScale(1.0);
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Stepped zoom handlers for museum reticle buttons
  const stepZoomIn = () => {
    setScale((s) => Math.min(4.0, Number((s + 0.5).toFixed(2))));
  };

  const stepZoomOut = () => {
    setScale((s) => {
      const next = Math.max(1.0, Number((s - 0.5).toFixed(2)));
      if (next === 1.0) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1.0);
    setOffset({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Microscopic Weave Loupe Chamber"
      data-lenis-prevent="true"
      className="fixed inset-0 z-[200] select-none overflow-hidden bg-[#0a0908] text-[#f2ede4] flex flex-col justify-between"
      style={{
        backgroundColor: '#0a0908',
      }}
      onWheel={handleWheel}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ====================================================================
          MUSEUM INSTRUMENT HEADER (UI LAST — DISCREET & RESTRAINED)
          ==================================================================== */}
      <header className="relative z-30 w-full px-6 py-5 md:px-10 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 mono-spec text-[9px] text-[#c5a869] tracking-[0.25em] uppercase">
            <span>MICROSCOPIC WEAVE LOUPE</span>
            <span className="opacity-40">&middot;</span>
            <span className="text-white/60">{workNumber}</span>
            <span className="opacity-40">&middot;</span>
            <span>{movementTag}</span>
          </div>
          <h2 className="display-sm text-base md:text-lg font-normal tracking-[0.04em] text-white">
            {title}
          </h2>
          {structuralLogic && (
            <p className="caption-tracked text-[9.5px] text-white/50 tracking-[0.16em]">
              {structuralLogic}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Microscopic Examination"
            className="mono-spec text-[10px] tracking-[0.22em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer px-3 py-1.5 border border-white/15 rounded-[1px] hover:border-white/40"
          >
            [ CLOSE &times; ]
          </button>
        </div>
      </header>

      {/* ====================================================================
          INTERACTIVE WEAVE CANVAS (TEXTILE FIRST, LIGHT SECOND)
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
        {/* Archival Specimen Plate Mount with Viscous Inertial Pan/Zoom */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
            transition: isDragging
              ? 'none'
              : isReducedMotion
              ? 'none'
              : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={`max-w-[85vw] max-h-[72vh] md:max-w-[70vw] md:max-h-[76vh] object-contain shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-white/10 transition-opacity duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />

          {/* Dynamic Cursor-Controlled Raking Light Across Weave Surface */}
          {!isReducedMotion && isLightActive && isLoaded && (
            <>
              {/* Diffuse Warm Grazing Light */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 460px at ${lightPos.x}px ${lightPos.y}px, rgba(255, 250, 240, 0.28) 0%, rgba(212, 185, 128, 0.10) 40%, transparent 75%)`,
                }}
              />

              {/* Anisotropic Metallic Zari Specular Sheen Grazing Angle */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-35 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(ellipse 650px 380px at ${lightPos.x}px ${lightPos.y}px, ${metallicAccent}48 0%, transparent 65%)`,
                }}
              />
            </>
          )}
        </div>

        {/* Minimal Museum Crosshair Reticle (Discreet, 15% Opacity Center Reference) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          {/* Subtle Corner Brackets for Conservation Inspection Frame */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 pointer-events-none opacity-20 border border-white/20">
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-white" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-white" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-white" />

            {/* Subtle Crosshair Axis */}
            <div className="absolute top-1/2 inset-x-0 h-px bg-white/30" />
            <div className="absolute left-1/2 inset-y-0 w-px bg-white/30" />
          </div>
        </div>
      </main>

      {/* ====================================================================
          MUSEUM RETICLE CONTROLS FOOTER (UI LAST)
          Minimal controls: + / − / RESET / MAGNIFICATION INDICATOR
          ==================================================================== */}
      <footer className="relative z-30 w-full px-6 py-4 md:px-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-black/50 backdrop-blur-md">
        
        {/* Scale of Perception Indicator */}
        <div className="flex items-center gap-3 mono-spec text-[9.5px] text-white/60 tracking-[0.2em] uppercase">
          <span className="text-[#c5a869] font-medium">
            SCALE: {scale.toFixed(1)}&times;
          </span>
          <span className="opacity-30">&middot;</span>
          <span className="text-white/40">
            {scale <= 1.2
              ? 'MACRO SURFACE'
              : scale <= 2.5
              ? 'WEAVE TOPOLOGY'
              : 'FILAMENT INTERSTICES'}
          </span>
        </div>

        {/* Reticle Controls: -, +, Reset */}
        <div className="flex items-center gap-2 mono-spec text-[10px]">
          <button
            type="button"
            onClick={stepZoomOut}
            disabled={scale <= 1.0}
            aria-label="Decrease Magnification"
            className="w-8 h-8 flex items-center justify-center border border-white/15 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none rounded-[1px] text-white/80 hover:text-white transition-colors cursor-pointer"
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
            className="w-8 h-8 flex items-center justify-center border border-white/15 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none rounded-[1px] text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            &#43;
          </button>

          <button
            type="button"
            onClick={resetZoom}
            disabled={scale === 1.0 && offset.x === 0 && offset.y === 0}
            aria-label="Reset Scale and Pan"
            className="ml-2 px-3 py-1.5 border border-white/15 hover:border-white/40 disabled:opacity-30 disabled:pointer-events-none rounded-[1px] text-white/70 hover:text-white tracking-[0.18em] uppercase text-[9px] transition-colors cursor-pointer"
          >
            RESET
          </button>
        </div>

        {/* Discreet Interaction Inscription */}
        <div className="hidden sm:block mono-spec text-[8.5px] text-white/40 tracking-[0.18em] uppercase">
          <span>DRAG TO PAN &middot; SCROLL OR PINCH TO ZOOM &middot; ESC TO EXIT</span>
        </div>
      </footer>
    </div>,
    document.body
  );
};
