'use client';

import React from 'react';
import { InlineMediaHeadline } from './InlineMediaHeadline';

export const CollectionIntro: React.FC = () => {
  return (
    <section
      id="collection"
      aria-label="Collection Introduction"
      className="relative w-full min-h-[65vh] flex flex-col justify-center items-center px-6 md:px-16 py-32 text-center select-none bg-[var(--color-bg)]"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3">
          <span className="mono-spec text-[10px] md:text-xs text-[var(--color-accent-zari)] tracking-[0.32em] uppercase block">
            ACT II &mdash; THE DIGITAL ATELIER CATALOGUE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-zari)] animate-pulse" />
        </div>

        {/* Monumental Avant-Garde Headline with Inline Media Punctuation */}
        <div className="flex justify-center">
          <InlineMediaHeadline
            prefix="THE"
            mediaSrc="/api/collection/vysh-arc-01/macro"
            mediaAlt="Architectural Silk Macro Structure"
            suffix="COLLECTION"
            tag="h2"
            badgeLabel="WARP // WEFT"
            pillText="weave"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--color-text)] font-normal justify-center"
          />
        </div>

        <div className="w-12 h-[1px] bg-[var(--color-accent-zari)]/40 mx-auto" />

        <p className="body-editorial text-sm md:text-base text-[var(--color-text-muted)] tracking-[0.06em] max-w-xl mx-auto leading-relaxed">
          Ten canonical studies in the unstitched continuum &mdash; from monumental architectural silk to diaphanous open grids.
        </p>

        {/* Monospace Thread Telemetry Manifest */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mono-spec text-[10px] text-[var(--color-text-muted)]/80 tracking-[0.2em]">
          <span>[ WARP: 140/in &middot; WEFT: 110/in ]</span>
          <span className="text-[var(--color-accent-zari)]">&bull;</span>
          <span>[ 10 SPECIMEN MANIFESTS ]</span>
          <span className="text-[var(--color-accent-zari)]">&bull;</span>
          <span>[ 81 PRODUCTION PLATES ]</span>
        </div>
      </div>
    </section>
  );
};
