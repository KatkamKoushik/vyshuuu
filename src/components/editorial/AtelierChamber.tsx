'use client';

import React from 'react';
import { ATELIER_PLATES, AtelierPlateData } from '@/lib/atelier/atelierData';

export const AtelierChamber: React.FC = () => {

  return (
    <section
      id="atelier"
      aria-label="The Atelier — The Nocturnal Chamber"
      className="relative w-full pt-32 pb-14 md:pt-48 md:pb-16 select-none bg-[#070605] text-[#e8e4dc] border-t border-[#c5a869]/15 overflow-hidden scroll-mt-20"
    >
      {/* Background Darkroom Ambient Gradient */}
      <div className="absolute inset-0 bg-radial-at-c from-[#12100e]/40 via-[#070605] to-[#070605] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-16 lg:px-24">
        
        {/* ====================================================================
            CHAMBER THRESHOLD / PROLOGUE
            ==================================================================== */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-28 md:mb-40">
          <span className="mono-spec text-[10px] md:text-xs text-[#c5a869] tracking-[0.32em] uppercase block">
            [ THE ATELIER &mdash; THE NOCTURNAL SANCTUARY ]
          </span>

          <h2
            className="text-3xl md:text-5xl font-normal tracking-[0.03em] text-[#faf7f0]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            THE HIDDEN CHAMBER
          </h2>

          <p className="body-editorial text-xs md:text-sm text-[#8a7f6e] italic max-w-lg mx-auto">
            &ldquo;Beyond the exhibition gallery. The geometry of human hands, tension, and silence.&rdquo;
          </p>

          <div className="pt-6">
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#c5a869]/40 via-[#c5a869]/10 to-transparent mx-auto" />
          </div>
        </div>

        {/* ====================================================================
            THE FIVE CINEMATIC MOVEMENTS
            ==================================================================== */}
        <div className="space-y-36 md:space-y-52">
          {ATELIER_PLATES.map((plate) => (
            <AtelierPlateItem
              key={plate.id}
              plate={plate}
            />
          ))}
        </div>

        {/* ====================================================================
            CHAMBER OUTRO / PASSAGE TO LIVING HEIRLOOM
            ==================================================================== */}
        <div className="pt-36 md:pt-48 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#c5a869]/30 to-transparent mx-auto mb-6" />
          <span className="mono-spec text-[9px] md:text-[10px] text-[#8a7f6e] tracking-[0.24em] uppercase block">
            [ ARCHIVAL CONTINUITY &middot; UNSTITCHED ATELIER ]
          </span>
          <p className="text-xs md:text-sm text-[#e8e4dc]/70 font-light italic leading-relaxed">
            &ldquo;The loom falls silent. The custody is complete. The textile remains unbroken.&rdquo;
          </p>
        </div>

      </div>
    </section>
  );
};

interface AtelierPlateItemProps {
  plate: AtelierPlateData;
}

const AtelierPlateItem: React.FC<AtelierPlateItemProps> = ({
  plate,
}) => {
  // Editorial layouts vary by plate purpose:
  // 01: Large centered abstract plate
  // 02: Offset right-shifted narrative
  // 03: Central planar structural study
  // 04: Offset left-shifted intimate tactile profile
  // 05: Wide monumental plinth presentation

  if (plate.layoutVariant === 'abstract') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Typographic Specimen Marker */}
        <div className="w-full flex justify-between items-baseline mb-4 text-[10px] mono-spec text-[#8a7f6e]">
          <span className="text-[#c5a869] tracking-[0.22em]">
            {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
          </span>
          <span className="tracking-[0.24em] uppercase text-[#faf7f0]/80">
            {plate.emotionalPhase}
          </span>
        </div>

        {/* Primary Photographic Plate */}
        <div className="relative w-full aspect-[3/4] max-w-xl rounded-[1px] overflow-hidden border border-[#c5a869]/15 shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-[#0d0c0a] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plate.assetSrc}
            alt={plate.alt}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.03] transition-transform duration-1000 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>

        {/* Curatorial Inscription Footnote */}
        <div className="w-full max-w-xl mt-6 flex flex-col sm:flex-row justify-between items-baseline gap-2 pt-3 border-t border-[#c5a869]/15 text-[10px] mono-spec">
          <p className="body-editorial text-xs text-[#8a7f6e] italic max-w-md">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>
          <span className="text-[#c5a869] tracking-[0.2em] whitespace-nowrap uppercase">
            VYSHUUU ATELIER &middot; 01
          </span>
        </div>
      </article>
    );
  }

  if (plate.layoutVariant === 'offset') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
      >
        {/* Left Editorial Narrative Docket */}
        <div className="md:col-span-5 order-2 md:order-1 space-y-4 max-w-sm">
          <div className="space-y-1">
            <span className="mono-spec text-[10px] text-[#c5a869] tracking-[0.24em] block">
              {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
            </span>
            <h3
              className="text-2xl md:text-3xl font-normal text-[#faf7f0] tracking-[0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {plate.emotionalPhase}
            </h3>
          </div>

          <div className="w-8 h-[1px] bg-[#c5a869]/40" />

          <p className="body-editorial text-xs md:text-sm text-[#8a7f6e] italic leading-relaxed">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>

          <div className="pt-2 text-[9px] mono-spec text-[#8a7f6e]/70 tracking-[0.2em]">
            CALIBRATION &middot; UNBROKEN WEFT
          </div>
        </div>

        {/* Right Photographic Plate */}
        <div className="md:col-span-7 order-1 md:order-2">
          <div className="relative w-full aspect-[3/4] max-w-md ml-auto rounded-[1px] overflow-hidden border border-[#c5a869]/15 shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-[#0d0c0a] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plate.assetSrc}
              alt={plate.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.03] transition-transform duration-1000 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-transparent opacity-40 pointer-events-none" />
          </div>
        </div>
      </article>
    );
  }

  if (plate.layoutVariant === 'central') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Header Specimen Bar */}
        <div className="w-full flex justify-between items-baseline mb-4 text-[10px] mono-spec text-[#8a7f6e]">
          <span className="text-[#c5a869] tracking-[0.22em]">
            {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
          </span>
          <span className="tracking-[0.24em] uppercase text-[#faf7f0]/80">
            {plate.emotionalPhase}
          </span>
        </div>

        {/* Central Geometric Interlock Plate */}
        <div className="relative w-full aspect-[3/4] max-w-xl rounded-[1px] overflow-hidden border border-[#c5a869]/20 shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-[#0d0c0a] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plate.assetSrc}
            alt={plate.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.03] transition-transform duration-1000 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>

        {/* Curatorial Inscription Footnote */}
        <div className="w-full max-w-xl mt-6 flex flex-col sm:flex-row justify-between items-baseline gap-2 pt-3 border-t border-[#c5a869]/15 text-[10px] mono-spec">
          <p className="body-editorial text-xs text-[#8a7f6e] italic max-w-md">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>
          <span className="text-[#c5a869] tracking-[0.2em] whitespace-nowrap uppercase">
            STRUCTURAL JOINERY &middot; 03
          </span>
        </div>
      </article>
    );
  }

  if (plate.layoutVariant === 'intimate') {
    return (
      <article
        aria-label={`${plate.index} — ${plate.title}`}
        className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
      >
        {/* Left Photographic Plate */}
        <div className="md:col-span-7">
          <div className="relative w-full aspect-[3/4] max-w-md mr-auto rounded-[1px] overflow-hidden border border-[#c5a869]/15 shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-[#0d0c0a] group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plate.assetSrc}
              alt={plate.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.03] transition-transform duration-1000 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-transparent opacity-40 pointer-events-none" />
          </div>
        </div>

        {/* Right Editorial Narrative Docket */}
        <div className="md:col-span-5 space-y-4 max-w-sm">
          <div className="space-y-1">
            <span className="mono-spec text-[10px] text-[#c5a869] tracking-[0.24em] block">
              {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
            </span>
            <h3
              className="text-2xl md:text-3xl font-normal text-[#faf7f0] tracking-[0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {plate.emotionalPhase}
            </h3>
          </div>

          <div className="w-8 h-[1px] bg-[#c5a869]/40" />

          <p className="body-editorial text-xs md:text-sm text-[#8a7f6e] italic leading-relaxed">
            &ldquo;{plate.shortCuratorialLine}&rdquo;
          </p>

          <div className="pt-2 text-[9px] mono-spec text-[#8a7f6e]/70 tracking-[0.2em]">
            TACTILE CALIBRATION &middot; FOLD RESISTANCE
          </div>
        </div>
      </article>
    );
  }

  // plate.layoutVariant === 'monumental' (Plate 05)
  return (
    <article
      aria-label={`${plate.index} — ${plate.title}`}
      className="w-full max-w-4xl mx-auto flex flex-col items-center"
    >
      {/* Header Specimen Bar */}
      <div className="w-full flex justify-between items-baseline mb-4 text-[10px] mono-spec text-[#8a7f6e]">
        <span className="text-[#c5a869] tracking-[0.22em]">
          {'[ ' + plate.index + ' // ' + plate.title + ' ]'}
        </span>
        <span className="tracking-[0.24em] uppercase text-[#faf7f0]/80">
          {plate.emotionalPhase}
        </span>
      </div>

      {/* Monumental Architectural Plinth Presentation */}
      <div className="relative w-full aspect-[3/4] max-w-2xl rounded-[1px] overflow-hidden border border-[#c5a869]/20 shadow-[0_40px_100px_rgba(0,0,0,0.95)] bg-[#0d0c0a] group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={plate.assetSrc}
          alt={plate.alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.03] transition-transform duration-1000 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070605] via-transparent to-transparent opacity-35 pointer-events-none" />
      </div>

      {/* Curatorial Inscription Footnote */}
      <div className="w-full max-w-2xl mt-6 flex flex-col sm:flex-row justify-between items-baseline gap-2 pt-3 border-t border-[#c5a869]/15 text-[10px] mono-spec">
        <p className="body-editorial text-xs text-[#8a7f6e] italic max-w-lg">
          &ldquo;{plate.shortCuratorialLine}&rdquo;
        </p>
        <span className="text-[#c5a869] tracking-[0.2em] whitespace-nowrap uppercase">
          PERMANENCE &middot; SIX YARDS UNBROKEN
        </span>
      </div>
    </article>
  );
};
