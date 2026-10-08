'use client';

import React, { useState, useMemo } from 'react';
import { SAREE_COLLECTION, SareeConcept } from '@/lib/collection/collectionData';
import { CompactArchiveWorld } from './CompactArchiveWorld';
import { SareeMonographModal } from './SareeMonographModal';
import { getAtmosphere } from '@/lib/atmosphere/collectionAtmospheres';

export const CollectionWall: React.FC = () => {
  const [activeMonographSaree, setActiveMonographSaree] = useState<SareeConcept | null>(null);

  // The 8 remaining compact archive worlds (Studies 01 and 04 remain frozen in their monumental vertical sections above)
  const compactSarees = useMemo(() => {
    return SAREE_COLLECTION.filter(
      (s) => s.id !== 'vysh-arc-01' && s.id !== 'vysh-chd-01'
    );
  }, []);

  return (
    <section
      id="collection-wall"
      aria-label="The Archive Continuum — Eight Compact Saree Worlds"
      className="relative w-full select-none text-[var(--color-text)]"
    >
      {/* ====================================================================
          CURATORIAL PROLOGUE & CHROMATIC BRIDGE
          Smoothly bridges from Gossamer Kora's daylight (#f5f1e8) into the nocturnal archive
          ==================================================================== */}
      <div
        className="relative w-full pt-32 pb-20 px-6 md:px-14 lg:px-20 border-b border-white/5"
        style={{
          background: 'linear-gradient(to bottom, #f5f1e8 0%, #2a2620 120px, #141210 240px, #0a0908 100%)',
        }}
      >
        <div className="w-full max-w-[var(--max-content-width)] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-b border-white/10 py-8">
            <div className="space-y-3">
              <span className="mono-spec text-[10px] text-[#c5a869] tracking-[0.3em] uppercase block">
                ACT II {'//'} THE DIGITAL ATELIER CATALOGUE
              </span>
              <h2 className="display-lg text-white font-normal tracking-[0.06em]">
                ARCHIVE WORLDS
              </h2>
              <p className="body-editorial text-sm md:text-base text-white/70 max-w-2xl leading-relaxed">
                Following the monumental vertical studies of <span className="text-white">The Continuum Archetype</span> and <span className="text-white">Gossamer Kora</span> above, the remaining eight masterworks unfold in continuous horizontal cadence.
              </p>
            </div>

            <div className="space-y-2 md:text-right">
              <span className="mono-spec text-[11px] text-white/60 tracking-[0.16em] block">
                [ 8 COMPACT WORLDS &middot; 65 PRODUCTION PLATES ]
              </span>
              <p className="mono-spec text-[10px] text-[#c5a869] tracking-[0.22em] uppercase">
                VERTICAL JOURNEY &middot; HORIZONTAL CADENCE &darr;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          THE 8 COMPACT ARCHIVE WORLDS
          Each world has its own atmosphere, restrained typography, ~3 images visible,
          continuous left-to-right cinematic drift, and 100% natural vertical scrolling.
          ==================================================================== */}
      <div className="relative w-full">
        {compactSarees.map((saree, idx) => {
          const prevSaree = idx > 0 ? compactSarees[idx - 1] : null;
          const nextSaree = idx < compactSarees.length - 1 ? compactSarees[idx + 1] : null;

          const prevBg = prevSaree
            ? getAtmosphere(prevSaree.id).palette.background
            : '#0a0908';
          const nextBg = nextSaree
            ? getAtmosphere(nextSaree.id).palette.background
            : '#050404'; // Transitions into the nocturnal darkroom of the Atelier

          return (
            <CompactArchiveWorld
              key={saree.id}
              saree={saree}
              index={idx}
              totalWorlds={compactSarees.length}
              prevBgColor={prevBg}
              nextBgColor={nextBg}
              onExamine={(s) => setActiveMonographSaree(s)}
            />
          );
        })}
      </div>

      {/* ====================================================================
          TRANSITION TERMINUS: Flowing into the Atelier Nocturnal Chamber
          ==================================================================== */}
      <div
        className="w-full h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #12070A 0%, #080506 60%, #050404 100%)',
        }}
      />

      {/* Saree Monograph Modal Overlay (Technical Examination Chamber) */}
      <SareeMonographModal
        saree={activeMonographSaree}
        onClose={() => setActiveMonographSaree(null)}
      />
    </section>
  );
};
