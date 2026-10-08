'use client';

import React from 'react';
import { Wordmark } from '@/components/brand/Wordmark';

export const AtelierClosing: React.FC = () => {
  return (
    <footer
      aria-label="Atelier Dedication and Closing"
      className="relative w-full min-h-[70vh] flex flex-col justify-between items-center px-6 md:px-16 py-24 text-center select-none bg-[#070605] text-[#e8e4dc]"
    >
      <div className="w-full pt-8" />

      {/* Central Closing Identity */}
      <div className="max-w-3xl mx-auto space-y-6">
        <p className="caption-tracked text-[11px] md:text-xs text-[var(--color-text-muted)] tracking-[0.28em]">
          THE UNSTITCHED CONTINUUM
        </p>

        <div className="pt-2 whitespace-nowrap" style={{ whiteSpace: 'nowrap' }}>
          <Wordmark size="hero" className="text-[var(--color-text)] drop-shadow-sm whitespace-nowrap" />
        </div>

        <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-accent-zari)] to-transparent opacity-40 mx-auto mt-6" />
      </div>

      {/* Restrained Footnote & Typographic Return */}
      <div className="w-full max-w-[var(--max-content-width)] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-[var(--color-border-subtle)]/40 text-[10px] mono-spec text-[var(--color-text-muted)]">
        <span>VYSHUUU DIGITAL ATELIER &middot; SIX YARDS UNBROKEN</span>
        <div className="flex items-center gap-6 tracking-[0.16em]">
          <a href="#atelier" className="hover:text-[var(--color-accent-zari)] transition-colors">
            [&uarr; ATELIER CHAMBER]
          </a>
          <a href="#collection-wall" className="hover:text-[var(--color-accent-zari)] transition-colors">
            [&uarr; COLLECTION ARCHIVE]
          </a>
          <a href="#unfurling" className="hover:text-[var(--color-accent-zari)] transition-colors">
            [&uarr; 6-YARD CONTINUUM]
          </a>
        </div>
        <span>&copy; {new Date().getFullYear()} VYSHUUU. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
};
