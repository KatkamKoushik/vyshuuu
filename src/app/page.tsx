'use client';

import React, { useRef } from 'react';
import { Wordmark } from '@/components/brand/Wordmark';
import { useExperienceStore } from '@/stores/experienceStore';
import { useScrollProgress, useScrollTriggerCallback } from '@/hooks/useScrollProgress';
import { setUnfurlingProgress, setGlobalProgress } from '@/lib/scrollBridge';

// Editorial Collection Sections
import { CollectionIntro } from '@/components/editorial/CollectionIntro';
import { ContinuumHero } from '@/components/editorial/ContinuumHero';
import { ContinuumSequence } from '@/components/editorial/ContinuumSequence';
import { MaterialTransition } from '@/components/editorial/MaterialTransition';
import { GossamerHero } from '@/components/editorial/GossamerHero';
import { GossamerSequence } from '@/components/editorial/GossamerSequence';
import { CollectionWall } from '@/components/editorial/CollectionWall';
import { AtelierChamber } from '@/components/editorial/AtelierChamber';
import { AtelierClosing } from '@/components/editorial/AtelierClosing';

export default function Home() {
  const isIntroSettled = useExperienceStore((s) => s.isIntroSettled);
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);
  const setActiveScene = useExperienceStore((s) => s.setActiveScene);
  const webglSupported = useExperienceStore((s) => s.webglSupported);

  const containerRef = useRef<HTMLDivElement>(null);
  const unfurlingContainerRef = useRef<HTMLDivElement>(null);

  // Overall page narrative progress (0 -> 1) without unnecessary root re-renders
  useScrollTriggerCallback({
    triggerRef: containerRef,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (p) => {
      setGlobalProgress(p);
    },
  });

  // Dedicated 6-Yard Unfurling progression across 360vh
  const { progress: unfurlProgress } = useScrollProgress({
    triggerRef: unfurlingContainerRef,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (p, velocity) => {
      setUnfurlingProgress(p, velocity / 1000.0);

      // Discrete scene state toggle at boundaries
      if (p > 0.05) {
        if (useExperienceStore.getState().activeScene !== 'unfurling') {
          setActiveScene('unfurling');
        }
      } else {
        if (useExperienceStore.getState().activeScene !== 'threshold') {
          setActiveScene('threshold');
        }
      }
    },
  });

  // Computed yardage milestone (0.00 to 6.00 yards)
  const yardsDraped = (unfurlProgress * 6.0).toFixed(2);

  // Determine current sequence phase tag
  const getPhaseTag = () => {
    if (unfurlProgress < 0.15) return 'FILAMENT // LOOM';
    if (unfurlProgress < 0.30) return 'SURFACE EMERGENCE';
    if (unfurlProgress < 0.45) return 'CONTINUOUS UNFURL';
    if (unfurlProgress < 0.60) return 'TRAVELING PLEATS';
    if (unfurlProgress < 0.75) return 'PALLU RAKING GLINT';
    if (unfurlProgress < 0.90) return '6-YARD CONTINUUM';
    return 'SETTLED // VYSHUUU';
  };

  // Active narrative description for mobile compact presentation
  const getActiveChapterText = () => {
    if (unfurlProgress < 0.30) {
      return 'Golden filament dissolves into the digital loom; obsidian silk surface materializes.';
    }
    if (unfurlProgress < 0.45) {
      return 'Continuous fabric arcs through 3D space with visceral mass and viscous inertia.';
    }
    if (unfurlProgress < 0.65) {
      return 'Cascading fold memory responds kinetically to scroll velocity before settling.';
    }
    if (unfurlProgress < 0.85) {
      return 'The monumental pallu enters; transverse gold threads glint under lateral chiaroscuro light.';
    }
    return 'All six yards settle into quiet breathing equilibrium; VYSHUUU identity revealed.';
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ====================================================================
          SECTION 01: THE THRESHOLD (0vh — 100vh)
          The Single Golden Filament descending from darkness
          ==================================================================== */}
      <section
        id="threshold"
        aria-label="The Threshold"
        className="relative min-h-[85vh] w-full flex flex-col justify-between items-center px-6 py-10 md:py-14 text-center select-none"
      >
        <div className="w-full pt-8" />

        {/* Central Threshold Core: Wordmark Reveal */}
        <div className="relative z-[10] flex flex-col items-center justify-center w-full max-w-5xl mx-auto whitespace-nowrap">
          <div
            className={`whitespace-nowrap transition-all duration-700 ease-out ${
              isIntroSettled
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Wordmark size="hero" className="text-[var(--color-text)] drop-shadow-sm whitespace-nowrap" />
          </div>

          <p
            className={`mt-4 md:mt-6 caption-tracked text-[11px] md:text-xs text-[var(--color-text-muted)] tracking-[0.28em] whitespace-nowrap transition-all duration-700 delay-150 ${
              isIntroSettled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ whiteSpace: 'nowrap' }}
          >
            THE UNSTITCHED CONTINUUM
          </p>
        </div>

        {/* Bottom Scroll Cue */}
        <div
          className={`flex flex-col items-center gap-2.5 whitespace-nowrap transition-all duration-700 delay-300 ${
            isIntroSettled ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <span
            className="mono-spec text-[10px] text-[var(--color-text-muted)] tracking-[0.2em] whitespace-nowrap select-none"
            style={{ whiteSpace: 'nowrap' }}
          >
            [ SCROLL TO UNFURL &mdash; {yardsDraped} / 6.00 YARDS ]
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[var(--color-accent-zari)] to-transparent opacity-40 animate-pulse" />
        </div>
      </section>

      {/* ====================================================================
          SECTION 02: THE 6-YARD UNFURLING (Sticky sequence across 360vh)
          Continuous handloom silk draped across spatial dimensions
          ==================================================================== */}
      <div
        id="unfurling"
        ref={unfurlingContainerRef}
        aria-label="The 6-Yard Unfurling Sequence"
        className="relative w-full min-h-[360vh]"
      >
        {/* Sticky Editorial Layer: Aligned to bottom on mobile so 3D cloth dominates the upper 70% */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-end md:justify-center items-center px-4 md:px-16 lg:px-24 pb-6 md:pb-0 overflow-hidden pointer-events-none">
          <div className="w-full max-w-[var(--max-content-width)] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Spatial Field: Either Spatial negative space (WebGL active) OR Photographic Continuum Fallback (No WebGL) */}
            {webglSupported ? (
              <div className="md:col-span-7 lg:col-span-8 hidden md:flex flex-col justify-between h-[65vh] pointer-events-none select-none">
                <div className="space-y-1.5">
                  <span className="caption-tracked text-[10px] text-[var(--color-accent-zari)]">
                    The Six-Yard Continuum &mdash; Handloom Silk Prototype
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="mono-spec text-[10px] text-[var(--color-text-muted)]">
                      Cadence: {yardsDraped} Yds · Phase:
                    </span>
                    <span className="mono-spec text-[10px] text-[var(--color-accent-zari)] font-medium">
                      {getPhaseTag()}
                    </span>
                  </div>
                </div>

                {/* Interaction Callout (Desktop Cursor & Mobile Touch) */}
                <div className="mono-spec text-[10px] text-[var(--color-text-muted)] flex items-center gap-3">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent-zari)] animate-ping" />
                  <span>[ MOVE CURSOR OR DRAG TO RAKE LIGHT ACROSS ZARI MOTIFS &amp; PLEATS ]</span>
                </div>
              </div>
            ) : (
              <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center items-center select-none pointer-events-auto">
                <div className="relative w-full max-w-lg aspect-[4/5] rounded-[1px] overflow-hidden border border-[#c5a869]/25 shadow-[0_30px_70px_rgba(0,0,0,0.85)] bg-[#0d0c0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/api/collection/vysh-arc-01/hero"
                    alt="The Six-Yard Continuum — Photographic Architectural Study"
                    className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-transparent to-transparent opacity-60 pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] mono-spec text-[#e8e4dc]/80">
                    <span>VYSH-ARC-01 // ARCHIVAL CONTINUUM</span>
                    <span>CADENCE: {yardsDraped} / 6.00 YDS</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Fallback Plate when WebGL is unavailable */}
            {!webglSupported && (
              <div className="md:hidden col-span-1 w-full max-w-xs mx-auto mb-2 pointer-events-auto">
                <div className="relative w-full aspect-[4/3] rounded-[1px] overflow-hidden border border-[#c5a869]/25 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#0d0c0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/api/collection/vysh-arc-01/hero"
                    alt="The Six-Yard Continuum — Photographic Architectural Study"
                    className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.05]"
                  />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[8px] mono-spec text-[#e8e4dc]/80">
                    <span>VYSH-ARC-01 // CONTINUUM</span>
                    <span>{yardsDraped} / 6.00 YDS</span>
                  </div>
                </div>
              </div>
            )}

            {/* Right Editorial Field: Compact, bottom-anchored slate on mobile; full column panel on desktop */}
            <div className="pointer-events-auto md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10 w-full max-w-[310px] md:max-w-[320px] mx-auto md:ml-auto space-y-2 md:space-y-4 relative z-20 p-3.5 md:p-5 rounded-[1px] bg-[rgba(8,7,6,0.65)] md:bg-[rgba(8,7,6,0.35)] backdrop-blur-[10px] md:backdrop-blur-[8px] border border-[rgba(197,168,105,0.12)] md:border-[rgba(197,168,105,0.05)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] md:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-opacity duration-700 hover:opacity-100">
              
              {/* Desktop Full Editorial Narrative (md and up) */}
              <div className="hidden md:block space-y-4">
                <div>
                  <span className="caption-tracked text-[11px] text-[var(--color-accent-zari)] block mb-2">
                    Signature Narrative &mdash; 6 Yards
                  </span>
                  <h2 className="display-md text-[var(--color-text)] font-normal mb-3">
                    THE 6-YARD UNFURLING
                  </h2>
                  <p className="body-editorial text-xs md:text-sm text-[var(--color-text-muted)] italic">
                    &ldquo;One continuous piece of woven silk emerging from darkness&mdash;sculpted by fold, mass, and lateral raking light.&rdquo;
                  </p>
                </div>

                {/* Sequential Chapters: 01 WARP & WEFT / 02 UNFURL / 03 PLEATS / 04 PALLU & ZARI */}
                <div className="space-y-3 pt-3 border-t border-[var(--color-border-subtle)]">
                  {/* 01: EMERGENCE (0% - 30%) */}
                  <div
                    className={`transition-all duration-700 ${
                      isReducedMotion || unfurlProgress >= 0.15
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-25 translate-x-2'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="caption-tracked text-xs text-[var(--color-text)]">
                        01 &mdash; EMERGENCE
                      </span>
                      <span className="mono-spec text-[10px] text-[var(--color-accent-zari)]">
                        {isReducedMotion || unfurlProgress >= 0.15 ? 'WOVEN' : '0.00 YDS'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-light leading-relaxed">
                      Golden filament dissolves into the digital loom; obsidian silk surface materializes.
                    </p>
                  </div>

                  {/* 02: UNFURLING (30% - 45%) */}
                  <div
                    className={`transition-all duration-700 ${
                      isReducedMotion || unfurlProgress >= 0.30
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-25 translate-x-2'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="caption-tracked text-xs text-[var(--color-text)]">
                        02 &mdash; CATENARY DRAPE
                      </span>
                      <span className="mono-spec text-[10px] text-[var(--color-accent-zari)]">
                        {isReducedMotion || unfurlProgress >= 0.30 ? 'UNFURLING' : '1.80 YDS'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-light leading-relaxed">
                      Continuous fabric arcs through 3D space with visceral mass and viscous inertia.
                    </p>
                  </div>

                  {/* 03: TRAVELING PLEATS (45% - 60%) */}
                  <div
                    className={`transition-all duration-700 ${
                      isReducedMotion || unfurlProgress >= 0.45
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-25 translate-x-2'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="caption-tracked text-xs text-[var(--color-text)]">
                        03 &mdash; TRAVELING PLEATS
                      </span>
                      <span className="mono-spec text-[10px] text-[var(--color-accent-zari)]">
                        {isReducedMotion || unfurlProgress >= 0.45 ? 'RIPPLE' : '3.20 YDS'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-light leading-relaxed">
                      Cascading fold memory responds kinetically to scroll velocity before settling.
                    </p>
                  </div>

                  {/* 04: PALLU & ZARI GLINT (60% - 85%) */}
                  <div
                    className={`transition-all duration-700 ${
                      isReducedMotion || unfurlProgress >= 0.65
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-25 translate-x-2'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="caption-tracked text-xs text-[var(--color-text)]">
                        04 &mdash; PALLU &amp; ZARI
                      </span>
                      <span className="mono-spec text-[10px] text-[var(--color-accent-zari)]">
                        {isReducedMotion || unfurlProgress >= 0.65 ? 'RAKING' : '4.80 YDS'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-light leading-relaxed">
                      The monumental pallu enters; transverse gold threads glint under lateral chiaroscuro light.
                    </p>
                  </div>

                  {/* 05: FULL SETTLED CONTINUUM (85% - 100%) */}
                  <div
                    className={`transition-all duration-700 ${
                      isReducedMotion || unfurlProgress >= 0.85
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-25 translate-x-2'
                    }`}
                  >
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="caption-tracked text-xs text-[var(--color-text)]">
                        05 &mdash; EQUILIBRIUM
                      </span>
                      <span className="mono-spec text-[10px] text-[var(--color-accent-zari)]">
                        {isReducedMotion || unfurlProgress >= 0.85 ? 'SETTLED' : '6.00 YDS'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] font-light leading-relaxed">
                      All six yards settle into quiet breathing equilibrium; VYSHUUU identity revealed.
                    </p>
                  </div>
                </div>

                {/* Progress Metric Bar */}
                <div className="pt-2 flex items-center justify-between mono-spec text-[10px] text-[var(--color-text-muted)]">
                  <span>Continuum Cadence</span>
                  <span>{(unfurlProgress * 100).toFixed(0)}% Complete</span>
                </div>
              </div>

              {/* Mobile Compact Editorial Slate (< md): Compact, unobtrusive footer slate leaving upper 75% for 3D cloth */}
              <div className="md:hidden space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="caption-tracked text-[9px] text-[var(--color-accent-zari)]">
                    6-Yard Continuum &middot; {getPhaseTag()}
                  </span>
                  <span className="mono-spec text-[9px] text-[var(--color-accent-zari)] font-medium">
                    {yardsDraped} / 6.00 YDS
                  </span>
                </div>

                <h2 className="display-sm text-[var(--color-text)] font-normal text-xs uppercase tracking-[0.14em]">
                  THE 6-YARD UNFURLING
                </h2>

                <p className="text-[11px] text-[var(--color-text-muted)] font-light leading-relaxed line-clamp-2">
                  {getActiveChapterText()}
                </p>

                <div className="pt-1.5 flex items-center justify-between mono-spec text-[8.5px] text-[var(--color-text-muted)] border-t border-[var(--color-border-subtle)]">
                  <span className="text-[var(--color-accent-zari)]/90">[ TOUCH TO RAKE LIGHT ]</span>
                  <span>{(unfurlProgress * 100).toFixed(0)}% Settled</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 03: COLLECTION INTRODUCTION
          After the WebGL hero settles, introduce the collection gallery
          ==================================================================== */}
      <CollectionIntro />

      {/* ====================================================================
          SECTION 04: THE CONTINUUM ARCHETYPE (VYSH-ARC-01 HERO)
          Monumental architectural silk presented as first major textile
          ==================================================================== */}
      <ContinuumHero />

      {/* ====================================================================
          SECTION 05: CONTINUUM EDITORIAL SEQUENCE
          Flat reference, viscous fold, pleat rhythm, macro, border, pallu, campaign
          ==================================================================== */}
      <ContinuumSequence />

      {/* ====================================================================
          SECTION 06: COLOUR / MATERIAL TRANSITION
          From Night into Light: Moving from Obsidian into Luminous Ecru
          ==================================================================== */}
      <MaterialTransition />

      {/* ====================================================================
          SECTION 07 & 08: GOSSAMER KORA LIGHT CORRIDOR
          Diaphanous sheer silk-cotton presented in sunlit light gallery
          ==================================================================== */}
      <div data-theme="light" className="relative w-full">
        <GossamerHero />
        <GossamerSequence />
      </div>

      {/* ====================================================================
          SECTION 09: THE COLLECTION WALL
          Side-by-side desktop / stacked mobile comparison proving dual spectrum
          ==================================================================== */}
      <CollectionWall />

      {/* ====================================================================
          SECTION 10: THE ATELIER (The Hidden Nocturnal Chamber)
          The five approved cinematic plates revealing anonymous human mastery
          ==================================================================== */}
      <AtelierChamber />

      {/* ====================================================================
          SECTION 11: ATELIER CLOSING
          Return to obsidian silence: THE UNSTITCHED CONTINUUM // VYSHUUU
          ==================================================================== */}
      <AtelierClosing />
    </div>
  );
}
