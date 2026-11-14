'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { LivingHeirloomSeal } from './LivingHeirloomSeal';

interface StudyEncounter {
  id: string;
  number: string;
  name: string;
  encountered: boolean;
}

const CANONICAL_STUDIES = [
  { id: 'vysh-arc-01', number: '01', name: 'The Continuum Archetype' },
  { id: 'vysh-kjv-01', number: '02', name: 'Obsidian Korvai' },
  { id: 'vysh-bnr-01', number: '03', name: 'Shikar Gah in Shadow' },
  { id: 'vysh-chd-01', number: '04', name: 'Gossamer Kora' },
  { id: 'vysh-pth-01', number: '05', name: 'Tapestry Dusk' },
  { id: 'vysh-jmd-01', number: '06', name: 'Vapor Inlay' },
  { id: 'vysh-kta-01', number: '07', name: 'Obsidian Khat Grid' },
  { id: 'vysh-tsr-01', number: '08', name: 'Raw Honeycomb Slub' },
  { id: 'vysh-ctr-01', number: '09', name: 'Liquid Metal Continuum' },
  { id: 'vysh-kjv-02', number: '10', name: 'Madder Petni' },
];

/**
 * AtelierClosing (Phase 6 — Sensory Summit & Atelier Nocturnal Sanctuary)
 *
 * Synthesizes the visitor's journey through the six unbroken yards and ten textile worlds:
 * 1. The Archival Memory Layer (Recollection Ledger)
 * 2. The Golden Filament Bridge (Closing the loop of creation)
 * 3. The Living Heirloom Seal (Interactive gold medallion with 3D tilt & harmonic resonance)
 * 4. The Digital Fashion House Identity (Avant-garde brand dedication)
 * 5. Discreet Return Navigation & Terminus
 * 6. Monumental Obsidian Silence (The ultimate quietude)
 */
export const AtelierClosing: React.FC = () => {
  const isReducedMotion = usePrefersReducedMotion();
  const [encounteredIds, setEncounteredIds] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Session-local encounter discovery tracking (strictly in-session, zero tracking/analytics)
  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;

    const storageKey = 'vyshuuu_session_encounters';
    const encounteredSet = new Set<string>();

    try {
      const cached = sessionStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => encounteredSet.add(id));
        }
      }
    } catch {
      // Safe fallback
    }

    const updateStorageAndState = () => {
      const arr = Array.from(encounteredSet);
      setEncounteredIds(arr);
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(arr));
      } catch {
        // Safe fallback
      }
    };

    // Initial update from session storage if present
    if (encounteredSet.size > 0) {
      setEncounteredIds(Array.from(encounteredSet));
    }

    // Map targets to study IDs
    const elementsToWatch: { el: Element; id: string }[] = [];

    const continuumEl = document.getElementById('continuum');
    if (continuumEl) {
      elementsToWatch.push({ el: continuumEl, id: 'vysh-arc-01' });
    }

    const gossamerEl =
      document.getElementById('gossamer') || document.querySelector('[data-theme="light"]');
    if (gossamerEl) {
      elementsToWatch.push({ el: gossamerEl, id: 'vysh-chd-01' });
    }

    const articles = document.querySelectorAll('article[aria-label*="Textile World"]');
    articles.forEach((art) => {
      const label = art.getAttribute('aria-label') || '';
      const match = label.match(/Textile World (\d+):/);
      if (match) {
        const study = CANONICAL_STUDIES.find((s) => s.number === match[1]);
        if (study) {
          elementsToWatch.push({ el: art, id: study.id });
        }
      }
    });

    // Check elements immediately (e.g. if scrolled or landed directly)
    let hasChanged = false;
    const windowH = window.innerHeight;
    elementsToWatch.forEach(({ el, id }) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowH && rect.bottom >= 0) {
        if (!encounteredSet.has(id)) {
          encounteredSet.add(id);
          hasChanged = true;
        }
      }
    });

    if (hasChanged) {
      updateStorageAndState();
    }

    // Set up IntersectionObserver for dynamic scrolling
    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          let batchChanged = false;
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const matched = elementsToWatch.find((item) => item.el === entry.target);
              if (matched && !encounteredSet.has(matched.id)) {
                encounteredSet.add(matched.id);
                batchChanged = true;
              }
            }
          });
          if (batchChanged) {
            updateStorageAndState();
          }
        },
        { threshold: 0.15 }
      );

      elementsToWatch.forEach(({ el }) => observer?.observe(el));
    }

    // Fallback passive scroll listener
    let rafId: number | null = null;
    const checkScroll = () => {
      let scrollChanged = false;
      const h = window.innerHeight;
      elementsToWatch.forEach(({ el, id }) => {
        if (!encounteredSet.has(id)) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= h && rect.bottom >= 0) {
            encounteredSet.add(id);
            scrollChanged = true;
          }
        }
      });
      if (scrollChanged) {
        updateStorageAndState();
      }
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          checkScroll();
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const studiesWithEncounter: StudyEncounter[] = useMemo(() => {
    return CANONICAL_STUDIES.map((s) => ({
      ...s,
      encountered: isClient ? encounteredIds.includes(s.id) : false,
    }));
  }, [encounteredIds, isClient]);

  const encounteredCount = useMemo(() => {
    return studiesWithEncounter.filter((s) => s.encountered).length;
  }, [studiesWithEncounter]);

  return (
    <footer
      id="dedication"
      aria-label="Atelier Dedication and Closing"
      className="relative w-full min-h-screen flex flex-col justify-between items-center px-6 md:px-16 lg:px-24 pt-10 pb-0 select-none bg-[#050404] text-[#e8e4dc] overflow-hidden"
    >
      {/* Background Subtle Radial Vignette */}
      <div className="absolute inset-0 bg-radial-at-c from-[#110e0c]/40 via-[#050404] to-[#050404] pointer-events-none" />

      {/* ====================================================================
          PART I: THE MEMORY LAYER (RECOLLECTION LEDGER)
          Synthesizes the journey completed through the ten textile studies.
          ==================================================================== */}
      <section
        aria-label="Archival Memory Layer"
        className="relative z-10 w-full max-w-4xl mx-auto pt-4 text-center space-y-6"
      >
        <div className="space-y-2">
          <span className="mono-spec text-[9px] sm:text-[10px] text-[#c5a869] tracking-[0.32em] uppercase block">
            [ ARCHIVAL MEMORY LEDGER &middot; CONTINUUM RECOLLECTION ]
          </span>
          <p className="caption-tracked text-[11px] sm:text-xs text-[#8a7f6e] tracking-[0.2em] uppercase">
            TEN STUDIES IN TOPOLOGICAL SILK &middot; ALL SIX YARDS WOVEN
          </p>
        </div>

        {/* Minimal Session-Local Encounter Strip */}
        <div className="pt-2 max-w-2xl mx-auto border-t border-white/10 pb-4">
          <div className="flex items-center justify-between text-[9px] mono-spec text-[#8a7f6e] mb-3 px-1">
            <span className="tracking-[0.2em] uppercase">
              STUDIES ENCOUNTERED IN SESSION:
            </span>
            <span className="text-[#c5a869] font-medium tracking-[0.16em]">
              {encounteredCount} / {CANONICAL_STUDIES.length}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
            {studiesWithEncounter.map((s) => (
              <div
                key={s.id}
                data-magnetic
                data-magnetic-label={`STUDY ${s.number}`}
                className={`py-1.5 px-1 border text-center rounded-[1px] cursor-pointer ${
                  isReducedMotion ? '' : 'transition-colors duration-500'
                } ${
                  s.encountered
                    ? 'border-[#c5a869]/70 bg-[#c5a869]/15 text-[#faf7f0] font-medium'
                    : 'border-white/10 bg-white/[0.02] text-[#8a7f6e]'
                }`}
                title={`${s.number} // ${s.name} ${s.encountered ? '(Encountered)' : ''}`}
              >
                <span className="mono-spec text-[9px] sm:text-[8.5px] block">
                  {s.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          PART II: THE GOLDEN FILAMENT BRIDGE
          Echoes the opening Threshold filament, closing the 6-yard loop.
          ==================================================================== */}
      <div className="relative z-10 my-8 sm:my-12 flex flex-col items-center">
        <div className="w-[1px] h-20 sm:h-24 bg-gradient-to-b from-[#c5a869]/60 via-[#c5a869]/20 to-transparent" />
      </div>

      {/* ====================================================================
          PART III: THE LIVING HEIRLOOM SEAL (SENSORY SUMMIT)
          Interactive gold medallion responding to pointer tilt & emitting harmonic resonance
          ==================================================================== */}
      <section
        id="seal"
        aria-label="The Living Heirloom Seal"
        className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center my-4"
      >
        <LivingHeirloomSeal />
      </section>

      {/* ====================================================================
          PART IV: THE DIGITAL ATELIER CLOSING IDENTITY
          VYSHUUU (House Identity) + Avant-Garde Brand Closing
          ==================================================================== */}
      <section
        aria-label="Atelier Creative Institution Closing"
        className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-10 sm:space-y-14 my-12"
      >
        {/* Digital Fashion House Identity */}
        <div className="space-y-4 sm:space-y-5">
          <h2
            className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-[0.16em] uppercase text-[#faf7f0] drop-shadow-md"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            VYSHUUU
          </h2>

          <p className="caption-tracked text-[11px] sm:text-xs text-[#c5a869] tracking-[0.28em] uppercase">
            A DIGITAL ATELIER FOR THE UNSTITCHED CONTINUUM
          </p>

          <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#ded5c6]/90 leading-relaxed max-w-xl mx-auto pt-1">
            &ldquo;An experimental fashion house devoted to the saree&mdash;where textile, structure, light, and movement become digital art.&rdquo;
          </p>
        </div>

        {/* Quiet Restrained Visual Separation */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-[1px] bg-[#c5a869]/30" />
        </div>

        {/* Restrained Brand Closing */}
        <div className="space-y-3 sm:space-y-4">
          <p className="mono-spec text-[9.5px] sm:text-[10.5px] text-[#c5a869] tracking-[0.32em] uppercase">
            TEXTILE &middot; STRUCTURE &middot; LIGHT &middot; MOVEMENT
          </p>

          <h3
            className="text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.2em] uppercase text-[#e8e4dc]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            VYSHUUU DIGITAL ATELIER
          </h3>
        </div>
      </section>

      {/* ====================================================================
          PART V: DISCREET RETURN NAVIGATION & ARCHIVAL TERMINUS
          ==================================================================== */}
      <nav
        aria-label="Return Navigation"
        className="relative z-10 w-full max-w-[var(--max-content-width)] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 pb-12 border-t border-white/10 text-[9.5px] mono-spec text-[#8a7f6e]"
      >
        <span className="tracking-[0.18em]">
          VYSHUUU DIGITAL ATELIER &middot; AN UNSTITCHED ARTWORK
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 tracking-[0.16em]">
          <a
            href="#threshold"
            data-magnetic
            data-magnetic-label="THRESHOLD"
            className="py-2 px-2 -my-2 inline-flex items-center text-[#a89f91] sm:text-[#8a7f6e] hover:text-[#c5a869] transition-colors cursor-pointer"
            title="Return to The Threshold"
          >
            [&uarr; THE THRESHOLD]
          </a>
          <a
            href="#unfurling"
            data-magnetic
            data-magnetic-label="6-YARD"
            className="py-2 px-2 -my-2 inline-flex items-center text-[#a89f91] sm:text-[#8a7f6e] hover:text-[#c5a869] transition-colors cursor-pointer"
            title="Return to 6-Yard Unfurling"
          >
            [&uarr; 6-YARD CONTINUUM]
          </a>
          <a
            href="#collection-wall"
            data-magnetic
            data-magnetic-label="ARCHIVE"
            className="py-2 px-2 -my-2 inline-flex items-center text-[#a89f91] sm:text-[#8a7f6e] hover:text-[#c5a869] transition-colors cursor-pointer"
            title="Return to Archive Worlds"
          >
            [&uarr; ARCHIVE WORLDS]
          </a>
          <a
            href="#atelier"
            data-magnetic
            data-magnetic-label="ATELIER"
            className="py-2 px-2 -my-2 inline-flex items-center text-[#a89f91] sm:text-[#8a7f6e] hover:text-[#c5a869] transition-colors cursor-pointer"
            title="Return to The Atelier"
          >
            [&uarr; THE ATELIER]
          </a>
        </div>

        <span className="tracking-[0.14em]">
          &copy; {isClient ? new Date().getFullYear() : 2025} VYSHUUU. ALL RIGHTS RESERVED.
        </span>
      </nav>

      {/* ====================================================================
          PART VI: THE MONUMENTAL SILENCE (THE OBSIDIAN STILLNESS)
          Monumental quiet ending returning the viewer to absolute obsidian silence
          ==================================================================== */}
      <section
        aria-label="The Obsidian Stillness"
        className="relative z-10 w-full min-h-[55vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-transparent via-[#000000] to-[#000000]"
      >
        <div className="w-[1px] h-28 bg-gradient-to-b from-[#c5a869]/50 via-[#c5a869]/15 to-transparent mb-8" />

        <p className="font-serif italic text-base sm:text-lg md:text-xl text-[#8a7f6e] tracking-wide max-w-md mx-auto leading-relaxed">
          &ldquo;Nothing is cut. Nothing is joined.<br />The continuum breathes in stillness.&rdquo;
        </p>

        <div className="mt-8 space-y-2">
          <span className="mono-spec text-[8.5px] sm:text-[9.5px] text-[#c5a869]/60 tracking-[0.38em] uppercase block">
            VYSHUUU &middot; THE UNSTITCHED CONTINUUM &middot; SILENCE
          </span>
          <span className="mono-spec text-[7.5px] text-[#8a7f6e]/40 tracking-[0.24em] block">
            [ OBSIDIAN EQUILIBRIUM &middot; LOOM SETTLED ]
          </span>
        </div>

        <div
          data-magnetic
          data-magnetic-label="STILLNESS"
          className="w-1.5 h-1.5 rounded-full bg-[#c5a869]/50 hover:bg-[#c5a869] shadow-[0_0_8px_rgba(197,168,105,0.4)] animate-pulse mt-8 cursor-pointer transition-colors"
          title="The Continuum Breathes in Stillness"
        />
      </section>
    </footer>
  );
};
