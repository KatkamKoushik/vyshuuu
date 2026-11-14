'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { SAREE_COLLECTION, SareeConcept } from '@/lib/collection/collectionData';
import { getAtmosphere } from '@/lib/atmosphere/collectionAtmospheres';
import { getCollectionUrl } from '@/lib/assets/cloudinaryAssets';
import { audioEngine } from '@/lib/audio/webAudioEngine';
import { InlineMediaHeadline } from './InlineMediaHeadline';
import { TactileGlowButton } from '@/components/ui/TactileGlowButton';

interface SpatialCollectionExhibitionProps {
  onExamine: (saree: SareeConcept) => void;
}

export const SpatialCollectionExhibition: React.FC<SpatialCollectionExhibitionProps> = ({
  onExamine,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const lastWheelTimeRef = useRef(0);

  const total = SAREE_COLLECTION.length;
  const activeSaree = useMemo(() => SAREE_COLLECTION[currentIndex], [currentIndex]);
  const activeAtmosphere = useMemo(() => getAtmosphere(activeSaree.id), [activeSaree]);

  // Handle smooth transition to a target index with infinite orbital wrap
  const goToIndex = useCallback(
    (targetIndex: number) => {
      const nextIndex = ((targetIndex % total) + total) % total;
      if (nextIndex !== currentIndex) {
        setCurrentIndex(nextIndex);
        audioEngine.triggerZariChime(1.0 + (nextIndex / total) * 0.4, 0.45);
      }
      setDragOffset(0);
    },
    [currentIndex, total]
  );

  const handleNext = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const handlePrev = useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  // Pointer / Touch Drag Events for 3D Ribbon Inertial Navigation
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max(0.005, (now - lastTimeRef.current) / 1000);
    const dx = e.clientX - currentXRef.current;
    dragVelocityRef.current = dx / dt;
    currentXRef.current = e.clientX;
    lastTimeRef.current = now;

    const totalDelta = e.clientX - startXRef.current;
    if (Math.abs(totalDelta) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(totalDelta);

    // Audio feedback: whispering silk friction modulated by drag speed
    audioEngine.triggerTouchFriction(Math.min(1.0, Math.abs(dragVelocityRef.current) / 1000));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore capture release error
    }

    const totalDelta = e.clientX - startXRef.current;
    const velocity = dragVelocityRef.current;

    // Threshold calculation for inertial snap:
    // If dragged > 65px OR rapid flick velocity > 320px/s
    if (totalDelta < -65 || velocity < -320) {
      handleNext();
    } else if (totalDelta > 65 || velocity > 320) {
      handlePrev();
    } else {
      setDragOffset(0);
    }
  };

  // Horizontal Wheel & Trackpad Gesture Navigation with Momentum
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Respond to horizontal two-finger swipe or vertical wheel over stage
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 4) return;

    const now = performance.now();
    wheelAccumulatorRef.current += delta;

    // Modulate silk friction by wheel rate
    audioEngine.triggerTouchFriction(Math.min(1.0, Math.abs(delta) / 100));

    // Cooldown of 200ms between discrete ribbon steps
    if (now - lastWheelTimeRef.current > 200) {
      if (wheelAccumulatorRef.current > 48) {
        handleNext();
        wheelAccumulatorRef.current = 0;
        lastWheelTimeRef.current = now;
      } else if (wheelAccumulatorRef.current < -48) {
        handlePrev();
        wheelAccumulatorRef.current = 0;
        lastWheelTimeRef.current = now;
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process when container or child has focus or active
      if (document.activeElement?.closest('#collection-wall')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          handlePrev();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          onExamine(activeSaree);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onExamine, activeSaree]);

  return (
    <section
      id="collection-wall"
      aria-label="Spatial Collection Exhibition — Dimensional Floating Ribbon Stage"
      className="relative w-full min-h-screen py-24 select-none overflow-hidden transition-colors duration-1000"
      style={{
        background: `radial-gradient(ellipse 90% 65% at 50% 35%, ${activeAtmosphere.palette.backgroundSurface} 0%, ${activeAtmosphere.palette.background} 65%, #050404 100%)`,
      }}
    >
      {/* Ambient Lateral Chiaroscuro Beam Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 65% 28%, ${activeAtmosphere.palette.accent}25 0%, transparent 55%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-14">
        {/* ====================================================================
            HAUTE COUTURE TYPOGRAPHIC HEADER & TELEMETRY
            ==================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="mono-spec text-[10px] text-[var(--color-accent-zari)] tracking-[0.28em] uppercase">
                ACT II {'//'} SPATIAL EXHIBITION CONTINUUM
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-zari)] animate-ping" />
            </div>

            {/* Monumental Display Headline with Inline Macro Media Punctuation */}
            <InlineMediaHeadline
              prefix="THE"
              mediaSrc={getCollectionUrl(activeSaree.id, 'macro')}
              mediaAlt={`${activeSaree.name} Macro Weave`}
              suffix="CURVED RIBBON STAGE"
              tag="h2"
              pillText="ribbon"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal"
            />

            <p className="body-editorial text-xs sm:text-sm text-white/70 max-w-xl mt-3 leading-relaxed">
              Ten canonical masterpieces mounted along an infinite 3D orbital ribbon. Drag, swipe, or wheel to travel the continuous loop; select any specimen to enter its optical inspection chamber.
            </p>
          </div>

          {/* Monospace Thread Telemetry */}
          <div className="flex flex-col md:items-end gap-1.5">
            <span className="mono-spec text-[11px] text-[var(--color-accent-zari)] tracking-[0.2em]">
              SPECIMEN {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span className="mono-spec text-[10px] text-white/50 tracking-[0.16em]">
              WARP: 140/in &middot; WEFT: 110/in &middot; 2-PLY SILK
            </span>
            <span className="mono-spec text-[9px] text-white/40 tracking-[0.14em]">
              LAT 17.38&deg; N &middot; CADENCE: INFINITE 3D RIBBON
            </span>
          </div>
        </div>

        {/* ====================================================================
            3D CURVED RIBBON STAGE (DIMENSIONAL FLOATING GALLERY)
            ==================================================================== */}
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          tabIndex={0}
          role="region"
          aria-label="Interactive 3D Curved Saree Ribbon Gallery"
          className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] flex items-center justify-center cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent-zari)]/40"
          style={{
            perspective: '1400px',
            transformStyle: 'preserve-3d',
            touchAction: 'pan-y',
          }}
        >
          {/* Central Ribbon Stage Horizon Line */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-zari)]/20 to-transparent top-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Render Floating Plinths along the Continuous Infinite 3D Ribbon */}
          {SAREE_COLLECTION.map((saree, index) => {
            // Shortest angular distance around 10-item circle
            let diff = (index - currentIndex) % total;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const offset = diff + dragOffset / 400;
            const absOffset = Math.abs(offset);

            // Hide cards beyond horizon cone
            if (absOffset > 4.6) return null;

            // Ribbon spatial curve calculations:
            const angleStep = 0.38; // radians per card along catenary arc
            const currentAngle = offset * angleStep;
            const translateX = Math.sin(currentAngle) * 440;
            const translateZ = -(1 - Math.cos(currentAngle)) * 480 - absOffset * 60;
            const translateY = Math.sin(absOffset * 0.8) * 18;
            const rotateY = -offset * 22; // cards angle towards center view
            const scale = Math.max(0.60, 1.0 - absOffset * 0.12);

            // Optical Depth-of-Field Blur: active card = 0px, peripheral cards blur smoothly
            const blurPx = Math.min(10, absOffset * 3.4);
            const opacity = Math.max(0, 1.0 - absOffset * 0.24);
            const isFocused = index === currentIndex;
            const zIndex = Math.round(100 - absOffset * 10);

            return (
              <div
                key={saree.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${saree.workNumber}: ${saree.name}`}
                aria-hidden={!isFocused}
                onClick={() => {
                  if (hasDraggedRef.current) return;
                  if (isFocused) {
                    onExamine(saree);
                  } else {
                    goToIndex(index);
                  }
                }}
                className={`absolute w-[260px] sm:w-[320px] md:w-[360px] aspect-[4/5] rounded-[2px] transition-shadow duration-500 overflow-hidden cursor-pointer select-none ${isFocused
                    ? 'ring-1 ring-[var(--color-accent-zari)]/80 shadow-[0_35px_80px_rgba(0,0,0,0.9),0_0_35px_rgba(197,168,105,0.2)]'
                    : 'shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:ring-1 hover:ring-white/20'
                  }`}
                style={{
                  transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  filter: `blur(${blurPx}px)`,
                  opacity,
                  zIndex,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                  backgroundColor: '#0c0b0a',
                }}
              >
                {/* Master Artwork Plate */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCollectionUrl(saree.id, 'hero')}
                  alt={`${saree.name} — ${saree.workNumber}`}
                  className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.08] transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />

                {/* Chiaroscuro Lateral Sheen & Shadow Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/20 to-transparent opacity-85 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />

                {/* Top Telemetry Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9px] mono-spec pointer-events-none">
                  <span className="px-2 py-0.5 rounded-[1px] bg-black/75 backdrop-blur-md text-[var(--color-accent-zari)] border border-[var(--color-accent-zari)]/30">
                    {saree.workNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-[1px] bg-black/60 backdrop-blur-md text-white/70">
                    {saree.code}
                  </span>
                </div>

                {/* Bottom Curatorial Title Plate */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5 pointer-events-none">
                  <span className="caption-tracked text-[9px] text-[var(--color-accent-zari)] block">
                    {saree.lineage}
                  </span>
                  <h3
                    className="text-lg sm:text-xl font-normal text-white uppercase tracking-[0.04em] font-serif line-clamp-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {saree.name}
                  </h3>
                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] mono-spec text-white/60">
                    <span>{saree.textileFamily}</span>
                    <span className="text-[var(--color-accent-zari)]">
                      {isFocused ? '[ EXAMINE ]' : '[ SELECT ]'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ====================================================================
            CURATORIAL SPECIMEN DOSSIER & MONOGRAPH ACTION
            ==================================================================== */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Specimen Identity & Lineage */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="mono-spec text-[10px] text-[var(--color-accent-zari)]">
                {activeSaree.workNumber} {'//'} {activeSaree.code}
              </span>
              <span className="text-white/30">&middot;</span>
              <span className="caption-tracked text-[10px] text-white/60">
                {activeSaree.textileFamily}
              </span>
            </div>

            <h3
              className="display-md text-2xl sm:text-3xl md:text-4xl text-white font-normal uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {activeSaree.name}
            </h3>

            <p className="body-editorial text-xs sm:text-sm text-white/70 italic leading-relaxed">
              &ldquo;{activeSaree.tagline}&rdquo;
            </p>

            {/* Action CTA Button smoothly connecting to SareeMonographModal with Noomo-Grade Micro-Physics */}
            <div className="pt-2">
              <TactileGlowButton
                variant="zari"
                size="md"
                soundTone="yaman"
                onClick={() => onExamine(activeSaree)}
                className="w-full sm:w-auto"
              >
                EXAMINE MONOGRAPH &amp; WEAVE LOUPE &rarr;
              </TactileGlowButton>
            </div>
          </div>

          {/* Center Column: Museum Taxonomy Docket */}
          <div className="md:col-span-4 space-y-2.5 text-xs text-white/75 bg-black/40 backdrop-blur-md p-4 rounded-[1px] border border-white/5">
            <div className="flex items-start justify-between pb-2 border-b border-white/5">
              <span className="mono-spec text-[10px] text-white/50">CHROMATIC FIELD:</span>
              <span className="text-right text-[11px] text-white font-light max-w-[200px]">
                {activeSaree.field}
              </span>
            </div>
            <div className="flex items-start justify-between pb-2 border-b border-white/5">
              <span className="mono-spec text-[10px] text-white/50">METALLIC VOCAB:</span>
              <span className="text-right text-[11px] text-[var(--color-accent-zari)] font-light max-w-[200px]">
                {activeSaree.metallicVocabulary}
              </span>
            </div>
            <div className="flex items-start justify-between pb-2 border-b border-white/5">
              <span className="mono-spec text-[10px] text-white/50">STRUCTURAL LOGIC:</span>
              <span className="text-right text-[11px] text-white/80 font-light max-w-[200px]">
                {activeSaree.structuralLogic}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="mono-spec text-[10px] text-white/50">DRAPE BEHAVIOR:</span>
              <span className="text-right text-[11px] text-white/80 font-light max-w-[200px]">
                {activeSaree.simulatedBehavior}
              </span>
            </div>
          </div>

          {/* Right Column: Navigation Controls & Specimen Index Bar */}
          <div className="md:col-span-3 flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Saree Specimen"
                className="w-10 h-10 rounded-[1px] border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[var(--color-accent-zari)] transition-colors cursor-pointer"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Saree Specimen"
                className="w-10 h-10 rounded-[1px] border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[var(--color-accent-zari)] transition-colors cursor-pointer"
              >
                &rarr;
              </button>
            </div>

            {/* 10-Item Specimen Index Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mono-spec text-[9px] text-white/50">
                <span>ORBITAL CADENCE</span>
                <span>{currentIndex + 1} / {total}</span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {SAREE_COLLECTION.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToIndex(idx)}
                    aria-label={`Jump to ${s.workNumber}: ${s.name}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex
                        ? 'bg-[var(--color-accent-zari)] scale-y-125'
                        : 'bg-white/20 hover:bg-white/40'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};