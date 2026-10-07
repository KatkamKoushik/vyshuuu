'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/brand/Wordmark';
import { useExperienceStore } from '@/stores/experienceStore';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { setUnfurlingProgress, setGlobalProgress } from '@/lib/scrollBridge';

export default function Home() {
  const isIntroSettled = useExperienceStore((s) => s.isIntroSettled);
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);
  const setActiveScene = useExperienceStore((s) => s.setActiveScene);

  const containerRef = useRef<HTMLDivElement>(null);
  const unfurlingContainerRef = useRef<HTMLDivElement>(null);

  // Overall page narrative progress (0 -> 1)
  useScrollProgress({
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

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ====================================================================
          SECTION 01: THE THRESHOLD (0vh — 100vh)
          The Single Golden Filament descending from darkness
          ==================================================================== */}
      <section
        aria-label="The Threshold"
        className="relative min-h-screen w-full flex flex-col justify-between items-center px-6 py-12 md:py-16 text-center select-none"
      >
        <div className="w-full pt-12" />

        {/* Central Threshold Core: Wordmark Reveal */}
        <div className="relative z-[10] flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 ease-out ${
              isIntroSettled
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <Wordmark size="hero" className="text-[var(--color-text)] drop-shadow-sm" />
          </div>

          <p
            className={`mt-6 md:mt-8 caption-tracked text-[11px] md:text-xs text-[var(--color-text-muted)] tracking-[0.28em] transition-all duration-1000 delay-300 ${
              isIntroSettled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            THE UNSTITCHED CONTINUUM
          </p>
        </div>

        {/* Bottom Scroll Cue */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-1000 delay-700 ${
            isIntroSettled ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <span className="mono-spec text-[10px] text-[var(--color-text-muted)] tracking-[0.2em]">
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
        {/* Sticky Editorial Layer */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
          <div className="w-full max-w-[var(--max-content-width)] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Spatial Field (Columns 1-7): Negative space for 3D Textile */}
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

              {/* Interaction Callout */}
              <div className="mono-spec text-[10px] text-[var(--color-text-muted)] flex items-center gap-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent-zari)] animate-ping" />
                <span>[ MOVE CURSOR TO RAKE LIGHT ACROSS ZARI MOTIFS &amp; PLEATS ]</span>
              </div>
            </div>

            {/* Right Editorial Field (Columns 8-12): Sequential Chapters */}
            <div className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9 space-y-6">
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
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 03: THE SETTLED CONTINUUM & VYSHUUU IDENTITY REVEAL
          Revealed at the culmination of the 6-yard sequence (100%)
          ==================================================================== */}
      <section
        id="reveal"
        aria-label="The Settled Identity"
        className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 py-24 text-center select-none bg-gradient-to-b from-transparent via-[var(--color-surface)]/20 to-[var(--color-surface)]/60"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <span className="caption-tracked text-xs text-[var(--color-accent-zari)] tracking-[0.32em] block">
            THE 6-YARD CONTINUUM SETTLED
          </span>

          <div className="transform transition-transform duration-1000">
            <Wordmark size="hero" className="text-[var(--color-text)] drop-shadow-md" />
          </div>

          <p className="body-editorial text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            &ldquo;Six yards of unbroken handloom silk. No cuts. No seams. A continuous topological plane born of tension, weight, and ancient craft.&rdquo;
          </p>

          <div className="pt-6 flex flex-wrap justify-center items-center gap-6">
            <Link
              href="#anthology"
              className="inline-flex items-center gap-3 px-8 py-3 text-xs uppercase tracking-[0.24em] text-[var(--color-background)] bg-[var(--color-accent-zari)] hover:bg-[#d4b97c] transition-colors rounded-sm"
            >
              <span>Explore The Specimen Holdings</span>
              <span>&rarr;</span>
            </Link>
            <span className="mono-spec text-[11px] text-[var(--color-text-muted)]">
              Specimen No. 01 &mdash; Edition 01 of 01
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 04: THE ANTHOLOGY INVITATION
          ==================================================================== */}
      <section
        id="anthology"
        aria-label="The Anthology"
        className="relative min-h-screen w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-16 lg:px-24 py-32 flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7 space-y-6">
            <span className="caption-tracked text-[11px] text-[var(--color-accent-zari)] block">
              Act III &mdash; Curated Works
            </span>
            <h2 className="display-lg text-[var(--color-text)]">
              MATERIAL STUDY 01
            </h2>
            <p className="body-editorial text-[var(--color-text-muted)]">
              An unstitched exploration in drape, chiaroscuro reflection, and continuous silk plane.
              Archival specimen holding.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-9 flex flex-col items-start gap-6 pb-2">
            <Link
              href="#salon"
              className="inline-flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[var(--color-accent-zari)] hover:text-[var(--color-text)] transition-colors py-3 border-b border-[var(--color-border)] hover:border-[var(--color-text)] group"
            >
              <span>Enter The Atelier Salon</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <span className="mono-spec text-[10px] text-[var(--color-text-muted)]">
              Edition 01 of 01 &mdash; Archival Holding
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 05: THE PRIVATE SALON FOOTNOTE
          ==================================================================== */}
      <footer
        id="salon"
        aria-label="Atelier Dedication"
        className="relative w-full border-t border-[var(--color-border-subtle)] px-6 md:px-16 py-20 bg-[var(--color-surface)]/40 backdrop-blur-sm"
      >
        <div className="max-w-[var(--max-content-width)] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span
              className="text-base tracking-[0.24em] uppercase text-[var(--color-text)] font-serif block mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              VYSHUUU
            </span>
            <p className="text-xs text-[var(--color-text-muted)] tracking-wider">
              Vyshnavi &rarr; Vyshuuu &rarr; The Unstitched Continuum.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-[11px]">
            <span className="mono-spec text-[var(--color-text-muted)]">
              &copy; {new Date().getFullYear()} VYSHUUU. All Rights Reserved.
            </span>
            <span className="mono-spec text-[var(--color-accent-zari)]">
              Handloom Digital Atelier
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
