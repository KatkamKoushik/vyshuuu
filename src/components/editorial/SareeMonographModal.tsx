'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SareeConcept, SareeAssetMeta } from '@/lib/collection/collectionData';
import { EditorialPlate } from './EditorialPlate';
import { getAtmosphere } from '@/lib/atmosphere/collectionAtmospheres';

export interface SareeMonographModalProps {
  saree: SareeConcept | null;
  onClose: () => void;
}

export const SareeMonographModal: React.FC<SareeMonographModalProps> = ({ saree, onClose }) => {
  const [activeAssetKey, setActiveAssetKey] = useState<string>('hero');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset active movement to hero whenever a new saree is opened
  useEffect(() => {
    if (saree) {
      setActiveAssetKey('hero');
    }
  }, [saree]);

  // Handle ESC key to dismiss
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (saree) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [saree, handleKeyDown]);

  if (!saree || !isMounted) return null;

  const atmosphere = getAtmosphere(saree.id);

  const assetEntries: [string, SareeAssetMeta][] = Object.entries(saree.assets).filter(
    ([, meta]) => Boolean(meta)
  ) as [string, SareeAssetMeta][];

  const currentAsset: SareeAssetMeta =
    (saree.assets as Record<string, SareeAssetMeta>)[activeAssetKey] || saree.assets.hero;

  const currentIdx = assetEntries.findIndex(([k]) => k === activeAssetKey);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="monograph-title"
      className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto backdrop-blur-2xl p-4 sm:p-10 md:p-14 lg:p-20 select-none transition-colors duration-700"
      style={{
        backgroundColor: `${atmosphere.palette.background}f5`,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Archival Folio Object: Intimate examination chamber sheet surrounded by vast atmospheric negative space */}
      <div
        className="relative w-full max-w-4xl lg:max-w-[56rem] max-h-[94vh] overflow-y-auto bg-[#faf7f0] text-[#1b1916] border border-[#ded5c6] shadow-[0_35px_100px_-25px_rgba(0,0,0,0.92)] p-6 sm:p-10 md:p-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Subtle Top Dossier Bar: Archival Reference & Quiet Escape Inscription */}
        <div className="flex items-start justify-between gap-3 border-b border-[#ded5c6]/80 pb-3 mb-4.5">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mono-spec text-[8.5px] text-[#8a7f6e] tracking-[0.22em] uppercase">
              <span>TEXTILE EXAMINATION FOLIO</span>
              <span>&middot;</span>
              <span
                className="font-medium"
                style={{ color: atmosphere.palette.accent }}
              >
                STUDY {String(saree.number).padStart(2, '0')}
              </span>
              <span>&middot;</span>
              <span>{saree.code}</span>
              <span>&middot;</span>
              <span
                className="opacity-90"
                style={{ color: atmosphere.palette.accent }}
              >
                {atmosphere.editorial.tagline}
              </span>
            </div>
            <h2 id="monograph-title" className="display-md text-[#1b1916] font-normal tracking-[0.02em]">
              {saree.name}
            </h2>
            <p className="caption-tracked text-[9.5px] text-[#706657] tracking-[0.16em] line-clamp-1">
              {saree.lineage} &mdash; {saree.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Examination Chamber"
              className="mono-spec text-[9.5px] text-[#8a7f6e] hover:text-[#1b1916] tracking-[0.22em] uppercase transition-colors cursor-pointer"
            >
              [ CLOSE &times; ]
            </button>
          </div>
        </div>

        {/* Quiet Typographic Movement Index with Active Zari Indicator */}
        <nav
          aria-label="Movement Index"
          className="mb-7 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-[#ded5c6]/60 pb-2.5"
        >
          <div className="flex items-center gap-5 sm:gap-6 min-w-max">
            <span
              className="mono-spec text-[8.5px] tracking-[0.22em] uppercase mr-1"
              style={{ color: atmosphere.palette.accent }}
            >
              MOVEMENTS ({assetEntries.length}):
            </span>

            {assetEntries.map(([key, meta], idx) => {
              const isActive = key === activeAssetKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveAssetKey(key)}
                  className={`group relative py-1 text-left cursor-pointer transition-colors ${
                    isActive ? 'text-[#1b1916]' : 'text-[#8a7f6e] hover:text-[#1b1916]'
                  }`}
                >
                  <span className="mono-spec text-[9px] sm:text-[9.5px] tracking-[0.14em]">
                    <span className="opacity-50">{String(idx + 1).padStart(2, '0')}.</span>{' '}
                    <span className={isActive ? 'font-medium' : 'font-normal'}>{meta.label}</span>
                  </span>

                  {/* Thin Active Metallic Indicator Line */}
                  {isActive && (
                    <span
                      className="absolute -bottom-2.5 inset-x-0 h-[1.5px] transition-all"
                      style={{ backgroundColor: atmosphere.palette.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Central Textile Examination Stage: The Specimen Plate Dominates */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start mb-8">
          
          {/* Main Textile Specimen Plate */}
          <div className="lg:col-span-8">
            <EditorialPlate
              src={currentAsset.src}
              alt={`${saree.name} — ${currentAsset.caption}`}
              aspectRatio={currentAsset.aspectRatio}
              variant="light"
              speed="standard"
              priority={true}
              caption={currentAsset.caption}
              metadata={currentAsset.metadata}
              className="w-full"
            />
          </div>

          {/* Archival Specimen Docket & Observations (Quiet, Integrated Parchment Column) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:border-l lg:border-[#ded5c6]/70 lg:pl-6 lg:py-1">
            <div className="space-y-4">
              <div className="space-y-1">
                <span
                  className="mono-spec text-[8.5px] tracking-[0.24em] uppercase block font-medium"
                  style={{ color: atmosphere.palette.accent }}
                >
                  {currentAsset.movementTag}
                </span>
                <h3 className="display-sm text-[#1b1916] font-normal">
                  {currentAsset.label}
                </h3>
              </div>

              <div className="pt-3 border-t border-[#ded5c6]/70 space-y-2.5">
                <p className="body-editorial text-xs text-[#524a3e] leading-relaxed">
                  {currentAsset.notes}
                </p>
              </div>

              {/* Curatorial Art-Directed Attributes (Correction 04: No physical alloy claim) */}
              <div className="pt-3.5 border-t border-[#ded5c6]/70 space-y-2 mono-spec text-[9.5px] text-[#635a4d]">
                <div className="flex justify-between">
                  <span className="opacity-60">HAND FEEL &middot; DRAPE</span>
                  <span className="font-medium text-[#1b1916]">{saree.weightHand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">OPTICAL DENSITY</span>
                  <span className="font-medium text-[#1b1916]">{saree.opacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">SIGNATURE METALLIC TONE</span>
                  <span
                    className="font-medium"
                    style={{ color: atmosphere.palette.accent }}
                  >
                    {saree.primaryZari}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">TEXTILE LINEAGE</span>
                  <span className="font-medium text-[#1b1916]">{saree.textileFamily}</span>
                </div>
              </div>
            </div>

            {/* Quiet Previous / Next Stepper */}
            <div className="pt-4 border-t border-[#ded5c6]/70 flex items-center justify-between mono-spec text-[9.5px] text-[#8a7f6e]">
              <button
                type="button"
                onClick={() => {
                  const prevIdx = (currentIdx - 1 + assetEntries.length) % assetEntries.length;
                  setActiveAssetKey(assetEntries[prevIdx][0]);
                }}
                className="hover:text-[#1b1916] tracking-[0.16em] cursor-pointer transition-colors"
              >
                &larr; PREVIOUS
              </button>

              <span
                className="text-[9px] font-medium"
                style={{ color: atmosphere.palette.accent }}
              >
                {currentIdx + 1} / {assetEntries.length}
              </span>

              <button
                type="button"
                onClick={() => {
                  const nextIdx = (currentIdx + 1) % assetEntries.length;
                  setActiveAssetKey(assetEntries[nextIdx][0]);
                }}
                className="hover:text-[#1b1916] tracking-[0.16em] cursor-pointer transition-colors"
              >
                NEXT &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Specimen Strip: Quiet Overview Grid of All Movements */}
        <div className="pt-5 border-t border-[#ded5c6]/70">
          <div className="flex items-center justify-between mb-2.5 text-[8.5px] mono-spec text-[#8a7f6e] tracking-[0.2em] uppercase">
            <span>ARCHIVAL PLATES ({assetEntries.length})</span>
            <span>DIRECT SPECIMEN SELECTION</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-9 gap-2">
            {assetEntries.map(([key, meta]) => {
              const isSelected = key === activeAssetKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveAssetKey(key)}
                  className={`group relative aspect-square overflow-hidden border transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-1'
                      : 'border-[#ded5c6] opacity-70 hover:opacity-100 hover:border-[#8c7443]/60'
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: atmosphere.palette.accent,
                          boxShadow: `0 0 0 1px ${atmosphere.palette.accent}`,
                        }
                      : undefined
                  }
                  title={meta.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={meta.src}
                    alt={meta.caption}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-[#1b1916]/80 text-[#faf7f0] text-[7.5px] mono-spec truncate px-1 py-0.5 text-center">
                    {meta.label.slice(0, 10)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Curatorial Inscription Footnote */}
        <div className="mt-8 pt-4 border-t border-[#ded5c6]/60 flex flex-col sm:flex-row justify-between items-baseline gap-2 text-[9px] mono-spec text-[#8a7f6e]">
          <span className="italic">
            &ldquo;{saree.curatorialStatement}&rdquo;
          </span>
          <span className="whitespace-nowrap uppercase tracking-[0.18em]">
            VYSHUUU ARCHIVAL PROTOCOL &middot; CONTINUUM STUDY
          </span>
        </div>

      </div>
    </div>,
    document.body
  );
};
