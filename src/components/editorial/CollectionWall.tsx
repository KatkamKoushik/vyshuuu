'use client';

import React, { useState, useEffect } from 'react';
import {
  SAREE_COLLECTION,
  COLLECTION_CHAPTERS,
  CollectionChapterId,
  SareeConcept,
} from '@/lib/collection/collectionData';
import { SareeMonographModal } from './SareeMonographModal';
import { CinematicTextileStage } from './CinematicTextileStage';
import { useExperienceStore } from '@/stores/experienceStore';
import {
  getAtmosphere,
  generateAtmosphereCSSVars,
} from '@/lib/atmosphere/collectionAtmospheres';

export const CollectionWall: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<CollectionChapterId>('all');
  const [activeMonographSaree, setActiveMonographSaree] = useState<SareeConcept | null>(null);

  // Experience Store - Saree Atmosphere System
  const selectedAtmosphereId = useExperienceStore((state) => state.selectedAtmosphereId);
  const setSelectedAtmosphereId = useExperienceStore((state) => state.setSelectedAtmosphereId);
  const resetAtmosphere = useExperienceStore((state) => state.resetAtmosphere);

  // Active saree world (defaults to Study 01 Continuum Archetype or selected saree)
  const activeSareeId = selectedAtmosphereId || 'vysh-arc-01';
  const activeSaree =
    SAREE_COLLECTION.find((s) => s.id === activeSareeId) || SAREE_COLLECTION[0];

  const activeAtmosphere = getAtmosphere(activeSaree.id);
  const atmosphereVars = generateAtmosphereCSSVars(activeAtmosphere);

  // Auto-reset when entering the Atelier chamber
  useEffect(() => {
    const atelierEl = document.getElementById('atelier');
    if (!atelierEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && selectedAtmosphereId) {
            resetAtmosphere();
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(atelierEl);
    return () => observer.disconnect();
  }, [selectedAtmosphereId, resetAtmosphere]);

  // Filter sarees according to active chapter tab
  const displayedSarees =
    selectedChapter === 'all'
      ? SAREE_COLLECTION
      : SAREE_COLLECTION.filter((s) => s.chapterId === selectedChapter);

  const activeChapterInfo = COLLECTION_CHAPTERS.find((c) => c.id === selectedChapter);

  const handleSelectWorld = (sareeId: string) => {
    setSelectedAtmosphereId(sareeId);
    const stageEl = document.getElementById('cinematic-stage');
    if (stageEl) {
      stageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="collection-wall"
      aria-label="The Complete 10-Saree Collection Archive and Cinematic Stage"
      style={{
        background: 'linear-gradient(to bottom, #f5f1e8 0px, #121110 140px, #0b0a09 220px, #0b0a09 100%)',
        ...atmosphereVars,
      }}
      className="relative w-full py-28 md:py-36 scroll-mt-24 select-none text-[var(--color-text)] transition-colors duration-1000"
    >
      <div className="relative z-10 w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-14 lg:px-20 mb-20 md:mb-28">
        
        {/* ====================================================================
            PART 1: THE ARCHIVE SELECTOR (THE WORLD DOORWAY)
            “Choose which textile world you want to enter.”
            ==================================================================== */}
        <header className="space-y-6 mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="mono-spec text-[10px] text-[var(--color-accent-zari)] tracking-[0.3em] uppercase block mb-2">
                ACT II {'//'} THE DIGITAL ATELIER CATALOGUE
              </span>
              <h2 className="display-lg text-[var(--color-text)] font-normal tracking-[0.03em]">
                THE COMPLETE ARCHIVE
              </h2>
            </div>

            <div className="space-y-1 md:text-right">
              <span className="mono-spec text-[11px] text-[var(--color-text-muted)] tracking-[0.16em] block">
                [ 10 CANONICAL STUDIES &middot; 81 PRODUCTION PLATES ]
              </span>
              <p className="mono-spec text-[10px] text-[var(--color-accent-zari)] tracking-[0.2em] uppercase">
                CHOOSE WHICH TEXTILE WORLD TO ENTER &darr;
              </p>
            </div>
          </div>

          {/* Editorial Chapter Navigation */}
          <nav
            aria-label="Collection Chapter Navigation"
            className="flex items-center gap-6 sm:gap-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-[var(--color-border-subtle)] pb-3"
          >
            {COLLECTION_CHAPTERS.map((chap) => {
              const isSelected = selectedChapter === chap.id;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => setSelectedChapter(chap.id)}
                  className={`relative py-1 text-left cursor-pointer transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'text-[var(--color-text)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <span className="mono-spec text-[10px] tracking-[0.18em] uppercase">
                    {chap.id === 'all' ? 'ALL 10 STUDIES' : `${chap.number}. ${chap.title}`}
                  </span>

                  {/* Thin Active Zari Hairline */}
                  {isSelected && (
                    <span className="absolute -bottom-3 inset-x-0 h-[1.5px] bg-[var(--color-accent-zari)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Active Chapter Curatorial Context */}
          {activeChapterInfo && selectedChapter !== 'all' && (
            <div className="pt-2 space-y-1">
              <span className="mono-spec text-[10px] text-[var(--color-accent-zari)] tracking-[0.2em] block">
                CHAPTER {activeChapterInfo.number} &mdash; {activeChapterInfo.subtitle.toUpperCase()}
              </span>
              <p className="body-editorial text-xs md:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
                {activeChapterInfo.description}
              </p>
            </div>
          )}
        </header>

        {/* 10 Textile Worlds Selector Grid (The Architectural Index) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {displayedSarees.map((saree) => {
            const isCurrentWorld = saree.id === activeSaree.id;
            const sareeAtmo = getAtmosphere(saree.id);
            const isLightCard = saree.themeVariant === 'light';

            return (
              <article
                key={saree.id}
                onClick={() => handleSelectWorld(saree.id)}
                className={`group flex flex-col justify-between p-6 rounded-[1px] border cursor-pointer transition-all duration-700 ${
                  isCurrentWorld
                    ? 'bg-[#151413] text-[var(--color-text)] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] scale-[1.015] -translate-y-1'
                    : isLightCard
                    ? 'bg-[#faf7f0] border-[#d8cfbe] text-[#1e1b18] opacity-85 hover:opacity-100 hover:border-[#8c7443]/60'
                    : 'bg-[#121110] border-[var(--color-border-subtle)] text-[var(--color-text)] opacity-85 hover:opacity-100 hover:border-[var(--color-accent-zari)]/40'
                }`}
                style={
                  isCurrentWorld
                    ? {
                        borderColor: sareeAtmo.palette.accent,
                      }
                    : undefined
                }
              >
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between mono-spec text-[9px]">
                    <span
                      className={`tracking-[0.22em] uppercase ${
                        isLightCard ? 'text-[#8c7443]' : 'text-[var(--color-accent-zari)]'
                      }`}
                      style={isCurrentWorld ? { color: sareeAtmo.palette.accent } : undefined}
                    >
                      STUDY NO. {String(saree.number).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-2">
                      {isCurrentWorld && (
                        <span
                          className="text-[8.5px] tracking-[0.2em] uppercase font-medium"
                          style={{ color: sareeAtmo.palette.accent }}
                        >
                          &bull; ACTIVE WORLD
                        </span>
                      )}
                      <span className="opacity-50">{saree.code}</span>
                    </div>
                  </div>

                  <h3 className="display-sm font-normal tracking-[0.02em]">
                    {saree.name}
                  </h3>

                  <p
                    className={`caption-tracked text-[10px] tracking-[0.14em] line-clamp-1 ${
                      isLightCard ? 'text-[#6d6457]' : 'text-[var(--color-text-muted)]'
                    }`}
                  >
                    {saree.lineage}
                  </p>
                </div>

                {/* Hero Thumbnail Preview */}
                <div className="w-full aspect-[16/10] overflow-hidden bg-black/40 mb-4 border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={saree.assets.hero.src}
                    alt={saree.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>

                <div className="space-y-2.5 pt-3 border-t border-current/10">
                  <div className="flex items-center justify-between text-[9.5px] mono-spec opacity-75">
                    <span>{saree.weightHand}</span>
                    <span>&middot;</span>
                    <span className="truncate max-w-[130px]">{saree.primaryZari}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className="mono-spec text-[9.5px] tracking-[0.18em] uppercase"
                      style={{ color: sareeAtmo.palette.accent }}
                    >
                      ENTER TEXTILE STAGE &rarr;
                    </span>
                    <span className="mono-spec text-[8.5px] tracking-[0.16em] uppercase opacity-50">
                      {Object.keys(saree.assets).length} MOVEMENTS
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* ====================================================================
          PART 2: THE CINEMATIC TEXTILE STAGE
          Fixed / Sticky Viewport driven by scroll + gentle autoplay drift.
          Synchronized atmospheric evolution across all 8-9 observations.
          ==================================================================== */}
      <div className="border-t border-white/10">
        <CinematicTextileStage
          saree={activeSaree}
          onExamine={(s) => setActiveMonographSaree(s)}
          onSelectSaree={(id) => handleSelectWorld(id)}
          onReset={() => {
            resetAtmosphere();
            const wallEl = document.getElementById('collection-wall');
            if (wallEl) {
              wallEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />
      </div>

      {/* Saree Monograph Modal Overlay (Technical Examination Chamber) */}
      <SareeMonographModal
        saree={activeMonographSaree}
        onClose={() => setActiveMonographSaree(null)}
      />
    </section>
  );
};
