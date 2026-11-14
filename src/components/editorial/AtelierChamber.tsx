'use client';

import React, { useState, useRef } from 'react';
import { ATELIER_PLATES, AtelierPlateData } from '@/lib/atelier/atelierData';
import { getOptimizedCloudinaryUrl, getCloudinarySrcSet } from '@/lib/assets/cloudinaryAssets';
import { InlineMediaHeadline } from './InlineMediaHeadline';
import { audioEngine } from '@/lib/audio/webAudioEngine';

interface PlateCalibrationData {
  tension: string;
  tolerance: string;
  metricA: string;
  metricB: string;
  status: string;
  threadCount: string;
}

const PLATE_CALIBRATIONS: Record<string, PlateCalibrationData> = {
  'vysh-atl-01': {
    tension: '14.8 cN/tex',
    tolerance: '±0.02 mm',
    metricA: 'WARP COUNT: 9,600 ENDS',
    metricB: 'BEAM TENSION: MEASURED EQUILIBRIUM',
    status: 'WARP // LOCKED',
    threadCount: '9,600 CONTINUOUS FILAMENTS',
  },
  'vysh-atl-02': {
    tension: '16.4 cN/tex',
    tolerance: '±0.04 mm',
    metricA: 'SHUTTLE SPEED: 1.42 m/s',
    metricB: 'BEAT-UP DENSITY: 128 PICKS/IN',
    status: 'CADENCE // PULSE',
    threadCount: '128 WEFT PICKS / INCH',
  },
  'vysh-atl-03': {
    tension: '15.2 cN/tex',
    tolerance: '±0.01 mm',
    metricA: 'SEAM OVERLAP: 1.2 mm',
    metricB: 'INTERLOCK SYMMETRY: 99.4%',
    status: 'JOINERY // INTERLOCKED',
    threadCount: 'DUAL-PLANE INTERLOCK WEAVE',
  },
  'vysh-atl-04': {
    tension: '18.1 cN/tex',
    tolerance: '±0.05 mm',
    metricA: 'AREAL MASS: 420 g/m²',
    metricB: 'REBOUND COEFFICIENT: 0.88',
    status: 'VISCOSITY // CALIBRATED',
    threadCount: '420 GSM PURE MULBERRY SILK',
  },
  'vysh-atl-05': {
    tension: '00.0 cN/tex',
    tolerance: '0.00 mm',
    metricA: 'DRAPE CONTINUUM: 5,486 mm',
    metricB: 'PERMANENCE INDEX: 1.00',
    status: 'SETTLED // PERMANENT',
    threadCount: '6.00 YARDS UNBROKEN CUSTODY',
  },
};

/**
 * AtelierPlateFrame — Master Photographic Plate with Dynamic Chiaroscuro Raking Light
 *
 * Implements:
 * - Dynamic specular raking grazing light responding in real time to pointer movement
 * - Archival millimetric crosshairs (+ ticks with exact frame coordinates)
 * - Fine vertical Vernier scale ticks along the frame boundary
 * - Thread tension calibration stamps and live equilibrium indicators
 */
interface AtelierPlateFrameProps {
  plate: AtelierPlateData;
  widthMaxClass?: string;
  loading?: 'eager' | 'lazy';
  cloudinaryWidth?: number;
}

const AtelierPlateFrame: React.FC<AtelierPlateFrameProps> = ({
  plate,
  widthMaxClass = 'max-w-xl',
  loading = 'lazy',
  cloudinaryWidth = 1080,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const lightOverlayRef = useRef<HTMLDivElement>(null);

  const cal = PLATE_CALIBRATIONS[plate.id] || PLATE_CALIBRATIONS['vysh-atl-01'];

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!frameRef.current || !lightOverlayRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    lightOverlayRef.current.style.background = `radial-gradient(circle 420px at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(212, 185, 128, 0.28) 0%, rgba(197, 168, 105, 0.08) 45%, transparent 80%)`;
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    try {
      audioEngine.triggerZariChime(0.85, 0.2);
    } catch {
      // Audio safety
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (lightOverlayRef.current) {
      lightOverlayRef.current.style.background = 'radial-gradient(circle 360px at 50% 32%, rgba(212, 185, 128, 0.12) 0%, rgba(197, 168, 105, 0.03) 40%, transparent 70%)';
    }
  };

  return (
    <div
      ref={frameRef}
      onPointerMove={onPointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      data-magnetic
      data-magnetic-label={`PLATE ${plate.index}`}
      className={`relative w-full aspect-[3/4] ${widthMaxClass} rounded-[1px] overflow-hidden border border-[#c5a869]/25 shadow-[0_35px_95px_rgba(0,0,0,0.98)] bg-[#0d0c0a] group cursor-crosshair transition-all duration-700 hover:border-[#c5a869]/60 hover:shadow-[0_45px_120px_rgba(197,168,105,0.12)]`}
    >
      {/* 1. Master Photographic Textile Plate */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getOptimizedCloudinaryUrl(plate.assetSrc, { width: cloudinaryWidth })}
        srcSet={getCloudinarySrcSet(plate.assetSrc)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 720px, 880px"
        alt={plate.alt}
        loading={loading}
        decoding="async"
        className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.08] transition-transform duration-1000 ease-[var(--ease-silk)] group-hover:scale-[1.018]"
      />

      {/* 2. Dynamic Specular Raking Grazing Light — grazes silk weave under pointer */}
      <div
        ref={lightOverlayRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out will-change-transform mix-blend-screen"
        style={{
          background: 'radial-gradient(circle 360px at 50% 32%, rgba(212, 185, 128, 0.12) 0%, rgba(197, 168, 105, 0.03) 40%, transparent 70%)',
          opacity: isHovered ? 1 : 0.75,
        }}
      />

      {/* 3. Deep Chiaroscuro Volumetric Vignette (Darkroom Atmosphere) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-[#070605]/45 opacity-65 pointer-events-none" />

      {/* 4. Fine Millimetric Vernier Scale Ruler along Left Edge */}
      <div className="absolute left-0 top-0 bottom-0 w-3 pointer-events-none z-20 flex flex-col justify-between py-6 px-0.5 border-r border-[#c5a869]/20 bg-[#070605]/40 backdrop-blur-[1px]">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => (
          <div key={tick} className="flex items-center gap-0.5">
            <div
              className={`h-[1px] bg-[#c5a869]/60 ${
                tick % 20 === 0 ? 'w-2 bg-[#c5a869]' : 'w-1'
              }`}
            />
            {tick % 50 === 0 && (
              <span className="font-mono text-[5.5px] text-[#c5a869]/70 leading-none">
                {tick}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 5. Four Archival Corner Precision Crosshairs (+ ticks with millimetric frame offsets) */}
      {/* Top-Left */}
      <div className="absolute top-2.5 left-4 z-20 flex items-center gap-1 text-[8px] font-mono text-[#c5a869]/80 pointer-events-none tracking-widest select-none">
        <span className="text-[#faf7f0] font-bold">+</span>
        <span>[00.0 · 00.0]</span>
      </div>

      {/* Top-Right */}
      <div className="absolute top-2.5 right-3 z-20 flex items-center gap-1 text-[8px] font-mono text-[#c5a869]/80 pointer-events-none tracking-widest select-none">
        <span>[54.0 · 00.0]</span>
        <span className="text-[#faf7f0] font-bold">+</span>
      </div>

      {/* Bottom-Left */}
      <div className="absolute bottom-2.5 left-4 z-20 flex items-center gap-1 text-[8px] font-mono text-[#c5a869]/80 pointer-events-none tracking-widest select-none">
        <span className="text-[#faf7f0] font-bold">+</span>
        <span>[00.0 · 72.0]</span>
      </div>

      {/* Bottom-Right */}
      <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1 text-[8px] font-mono text-[#c5a869]/80 pointer-events-none tracking-widest select-none">
        <span>[54.0 · 72.0]</span>
        <span className="text-[#faf7f0] font-bold">+</span>
      </div>

      {/* 6. Archival Thread Tension Calibration Stamp Badge (Docked at bottom of frame) */}
      <div className="absolute bottom-3 left-14 right-14 z-20 hidden sm:flex items-center justify-between px-3 py-1.5 rounded-[1px] bg-[#070605]/90 border border-[#c5a869]/30 backdrop-blur-[3px] text-[7.5px] font-mono pointer-events-none select-none transition-all duration-300 group-hover:border-[#c5a869]/60 group-hover:bg-[#070605]/95">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869] animate-pulse" />
          <span className="text-[#faf7f0] tracking-wider uppercase font-medium">
            {cal.status}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-[#c5a869]">
          <span>TENSION: {cal.tension}</span>
          <span className="text-[#8a7f6e]">&middot;</span>
          <span>TOLERANCE: {cal.tolerance}</span>
        </div>
      </div>
    </div>
  );
};

export const AtelierChamber: React.FC = () => {
  return (
    <section
      id="atelier"
      aria-label="The Atelier — The Nocturnal Sanctuary"
      className="relative w-full pt-32 pb-16 md:pt-48 md:pb-24 select-none bg-[#070605] text-[#e8e4dc] border-t border-[#c5a869]/20 overflow-hidden scroll-mt-20"
    >
      {/* Background Volumetric Raking Beams (Chiaroscuro Darkroom Atmosphere) */}
      <div className="absolute inset-0 bg-radial-at-c from-[#14120f]/50 via-[#070605] to-[#070605] pointer-events-none" />

      {/* Grazing Angled Skylight Beams cutting across darkroom silence */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(115deg, rgba(197, 168, 105, 0.05) 0%, transparent 28%, rgba(212, 185, 128, 0.02) 48%, transparent 70%)',
        }}
      />

      {/* Archival Calibration Grid Rules */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full bg-[linear-gradient(to_right,#c5a869_1px,transparent_1px),linear-gradient(to_bottom,#c5a869_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-16 lg:px-24">
        {/* ====================================================================
            CHAMBER THRESHOLD / PROLOGUE WITH INLINE MEDIA PUNCTUATION
            ==================================================================== */}
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-28 md:mb-40">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-[1px] bg-[#c5a869]" />
            <span className="mono-spec text-[10px] md:text-xs text-[#c5a869] tracking-[0.34em] uppercase block">
              [ THE ATELIER &mdash; THE NOCTURNAL SANCTUARY ]
            </span>
            <span className="w-2 h-[1px] bg-[#c5a869]" />
          </div>

          {/* Haute-Couture Inline Media Headline */}
          <div className="flex justify-center">
            <InlineMediaHeadline
              prefix="THE"
              mediaSrc="/api/atelier/vysh-atl-01"
              mediaAlt="Raw silk filaments under tension on dark loom beam"
              suffix="NOCTURNAL CHAMBER"
              badgeLabel="ATELIER // NOCTURNAL SANCTUARY"
              pillText="sanctuary"
              tag="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.03em] text-[#faf7f0] justify-center text-center"
            />
          </div>

          <p className="body-editorial text-xs md:text-sm text-[#b8ac99] italic max-w-lg mx-auto leading-relaxed">
            &ldquo;Beyond the exhibition gallery. The geometry of human hands, tension, and silence.&rdquo;
          </p>

          <div className="pt-4 flex flex-col items-center gap-2">
            <span className="mono-spec text-[8.5px] text-[#8a7f6e] tracking-[0.28em] uppercase">
              CALIBRATION: 0.02MM TOLERANCE &middot; RAKING CHIAROSCURO LIGHT
            </span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#c5a869]/50 via-[#c5a869]/15 to-transparent mx-auto" />
          </div>
        </div>

        {/* ====================================================================
            THE FIVE CINEMATIC MOVEMENTS
            ==================================================================== */}
        <div className="space-y-20 sm:space-y-28 md:space-y-48">
          {ATELIER_PLATES.map((plate, index) => (
            <AtelierPlateItem
              key={plate.id}
              plate={plate}
              isFirst={index === 0}
            />
          ))}
        </div>

        {/* ====================================================================
            CHAMBER OUTRO / PASSAGE TO LIVING HEIRLOOM SEAL
            ==================================================================== */}
        <div className="pt-36 md:pt-48 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#c5a869]/40 to-transparent mx-auto mb-6" />
          <span className="mono-spec text-[9.5px] md:text-[10.5px] text-[#c5a869] tracking-[0.28em] uppercase block">
            [ ARCHIVAL CONTINUITY &middot; UNSTITCHED ATELIER ]
          </span>
          <p className="text-xs md:text-sm text-[#e8e4dc]/80 font-light italic leading-relaxed">
            &ldquo;The loom falls silent. The custody is complete. The textile remains unbroken.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
};

interface AtelierPlateItemProps {
  plate: AtelierPlateData;
  isFirst?: boolean;
}

const AtelierPlateItem: React.FC<AtelierPlateItemProps> = ({ plate, isFirst = false }) => {
  const cal = PLATE_CALIBRATIONS[plate.id] || PLATE_CALIBRATIONS['vysh-atl-01'];

  // 01: Abstract — Centered large architectural study
  if (plate.layoutVariant === 'abstract') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Header Specimen Docket */}
        <div className="w-full flex justify-between items-baseline mb-4 text-[10px] mono-spec text-[#8a7f6e] border-b border-[#c5a869]/15 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869]" />
            <span className="text-[#c5a869] tracking-[0.22em] font-medium">
              {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
            </span>
          </div>
          <span className="tracking-[0.24em] uppercase text-[#faf7f0]/90">
            {plate.emotionalPhase} &middot; {cal.tension}
          </span>
        </div>

        {/* Primary Photographic Plate with Raking Grazing Light */}
        <AtelierPlateFrame
          plate={plate}
          widthMaxClass="max-w-xl"
          loading={isFirst ? 'eager' : 'lazy'}
          cloudinaryWidth={1080}
        />

        {/* Curatorial Inscription Footnote & Calibration Docket */}
        <div className="w-full max-w-xl mt-6 flex flex-col sm:flex-row justify-between items-baseline gap-3 pt-3 border-t border-[#c5a869]/20 text-[10px] mono-spec">
          <p className="body-editorial text-xs text-[#b8ac99] italic max-w-md leading-relaxed">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>
          <div className="flex flex-col sm:items-end gap-1 text-[9px]">
            <span className="text-[#c5a869] tracking-[0.2em] whitespace-nowrap uppercase font-medium">
              VYSHUUU ATELIER &middot; 01
            </span>
            <span className="text-[#8a7f6e] tracking-wider">
              {cal.threadCount}
            </span>
          </div>
        </div>
      </article>
    );
  }

  // 02: Offset — Right-shifted plate with left-aligned narrative docket
  if (plate.layoutVariant === 'offset') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center"
      >
        {/* Left Editorial Narrative Docket */}
        <div className="md:col-span-5 order-2 md:order-1 space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <span className="mono-spec text-[10px] text-[#c5a869] tracking-[0.26em] block">
              {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
            </span>
            <h3
              className="text-2xl md:text-3xl font-normal text-[#faf7f0] tracking-[0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {plate.emotionalPhase}
            </h3>
          </div>

          <div className="w-8 h-[1px] bg-[#c5a869]/50" />

          <p className="body-editorial text-xs md:text-sm text-[#b8ac99] italic leading-relaxed">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>

          {/* Technical Calibration Docket */}
          <div className="pt-3 space-y-1 border-t border-[#c5a869]/15 text-[8.5px] mono-spec text-[#8a7f6e]">
            <div className="text-[#c5a869] tracking-[0.2em]">{cal.metricA}</div>
            <div className="tracking-wider">{cal.metricB}</div>
            <div className="text-[#faf7f0]/70 pt-0.5">TOLERANCE: {cal.tolerance}</div>
          </div>
        </div>

        {/* Right Photographic Plate */}
        <div className="md:col-span-7 order-1 md:order-2 flex justify-end">
          <AtelierPlateFrame
            plate={plate}
            widthMaxClass="max-w-md"
            cloudinaryWidth={1080}
          />
        </div>
      </article>
    );
  }

  // 03: Central — Geometric interlock structural study
  if (plate.layoutVariant === 'central') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Header Specimen Bar */}
        <div className="w-full flex justify-between items-baseline mb-4 text-[10px] mono-spec text-[#8a7f6e] border-b border-[#c5a869]/15 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869]" />
            <span className="text-[#c5a869] tracking-[0.22em] font-medium">
              {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
            </span>
          </div>
          <span className="tracking-[0.24em] uppercase text-[#faf7f0]/90">
            {plate.emotionalPhase} &middot; {cal.tension}
          </span>
        </div>

        {/* Central Geometric Interlock Plate */}
        <AtelierPlateFrame
          plate={plate}
          widthMaxClass="max-w-xl"
          cloudinaryWidth={1080}
        />

        {/* Curatorial Inscription Footnote */}
        <div className="w-full max-w-xl mt-6 flex flex-col sm:flex-row justify-between items-baseline gap-3 pt-3 border-t border-[#c5a869]/20 text-[10px] mono-spec">
          <p className="body-editorial text-xs text-[#b8ac99] italic max-w-md leading-relaxed">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>
          <div className="flex flex-col sm:items-end gap-1 text-[9px]">
            <span className="text-[#c5a869] tracking-[0.2em] whitespace-nowrap uppercase font-medium">
              STRUCTURAL JOINERY &middot; 03
            </span>
            <span className="text-[#8a7f6e] tracking-wider">
              {cal.metricB}
            </span>
          </div>
        </div>
      </article>
    );
  }

  // 04: Intimate — Tactile Profile
  if (plate.layoutVariant === 'intimate') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center"
      >
        {/* Left Photographic Plate */}
        <div className="md:col-span-7 flex justify-start">
          <AtelierPlateFrame
            plate={plate}
            widthMaxClass="max-w-md"
            cloudinaryWidth={1080}
          />
        </div>

        {/* Right Editorial Narrative Docket */}
        <div className="md:col-span-5 space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <span className="mono-spec text-[10px] text-[#c5a869] tracking-[0.26em] block">
              {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
            </span>
            <h3
              className="text-2xl md:text-3xl font-normal text-[#faf7f0] tracking-[0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {plate.emotionalPhase}
            </h3>
          </div>

          <div className="w-8 h-[1px] bg-[#c5a869]/50" />

          <p className="body-editorial text-xs md:text-sm text-[#b8ac99] italic leading-relaxed">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>

          {/* Technical Calibration Docket */}
          <div className="pt-3 space-y-1 border-t border-[#c5a869]/15 text-[8.5px] mono-spec text-[#8a7f6e]">
            <div className="text-[#c5a869] tracking-[0.2em]">{cal.metricA}</div>
            <div className="tracking-wider">{cal.metricB}</div>
            <div className="text-[#faf7f0]/70 pt-0.5">TOLERANCE: {cal.tolerance}</div>
          </div>
        </div>
      </article>
    );
  }

  // 05: Monumental — The Living Heirloom on dark stone
  return (
    <article
      aria-label={`${plate.index} — ${plate.title}`}
      className="w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* Header Specimen Bar */}
      <div className="w-full flex justify-between items-baseline mb-4 text-[10px] mono-spec text-[#8a7f6e] border-b border-[#c5a869]/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869]" />
          <span className="text-[#c5a869] tracking-[0.22em] font-medium">
            {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
          </span>
        </div>
        <span className="tracking-[0.24em] uppercase text-[#faf7f0]/90">
          {plate.emotionalPhase} &middot; {cal.status}
        </span>
      </div>

      {/* Monumental Architectural Plinth Presentation */}
      <AtelierPlateFrame
        plate={plate}
        widthMaxClass="max-w-2xl"
        cloudinaryWidth={1280}
      />

      {/* Curatorial Inscription Footnote */}
      <div className="w-full max-w-2xl mt-6 flex flex-col sm:flex-row justify-between items-baseline gap-3 pt-3 border-t border-[#c5a869]/20 text-[10px] mono-spec">
        <p className="body-editorial text-xs text-[#b8ac99] italic max-w-lg leading-relaxed">
          &ldquo;{plate.shortCuratorialLine}&rdquo;
        </p>
        <div className="flex flex-col sm:items-end gap-1 text-[9px]">
          <span className="text-[#c5a869] tracking-[0.2em] whitespace-nowrap uppercase font-medium">
            PERMANENCE &middot; SIX YARDS UNBROKEN
          </span>
          <span className="text-[#8a7f6e] tracking-wider">
            {cal.metricA}
          </span>
        </div>
      </div>
    </article>
  );
};
