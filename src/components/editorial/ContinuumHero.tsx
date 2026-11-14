'use client';

import React from 'react';
import { EditorialPlate } from './EditorialPlate';
import { InlineMediaHeadline } from './InlineMediaHeadline';

export const ContinuumHero: React.FC = () => {
  return (
    <section
      id="continuum"
      aria-label="The Continuum Archetype"
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-24 select-none bg-[var(--color-bg)]"
    >
      <div className="w-full max-w-[var(--max-content-width)] mx-auto flex flex-col items-center">
        {/* Haute Couture Avant-Garde Header with Inline Media Punctuation */}
        <div className="w-full max-w-4xl mx-auto mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="mono-spec text-[10px] text-[var(--color-accent-zari)] tracking-[0.26em] block">
                STUDY NO. 01 &mdash; ARCHIVAL CORE
              </span>
              <span className="text-[var(--color-accent-zari)]">&middot;</span>
              <span className="mono-spec text-[9px] text-[var(--color-text-muted)] tracking-[0.16em]">
                LAT 17.38&deg; N
              </span>
            </div>

            {/* Inline Media Headline */}
            <InlineMediaHeadline
              prefix="THE"
              mediaSrc="/api/collection/vysh-arc-01/macro"
              mediaAlt="The Continuum Archetype Zari Inset"
              suffix="CONTINUUM"
              tag="h3"
              badgeLabel="MULBERRY // 3-PLY"
              pillText="silk"
              className="text-3xl sm:text-4xl md:text-5xl text-[var(--color-text)] font-normal tracking-[0.04em]"
            />
          </div>

          {/* Monospace Thread Telemetry */}
          <div className="flex flex-col md:items-end gap-1.5">
            <span className="mono-spec text-[11px] text-[var(--color-accent-zari)] tracking-[0.18em]">
              VYSH-ARC-01 // WORK 01
            </span>
            <span className="mono-spec text-[10px] text-[var(--color-text-muted)] tracking-[0.14em]">
              WARP: 160/in &middot; WEFT: 120/in &middot; 3-PLY
            </span>
            <span className="caption-tracked text-[10px] text-[var(--color-text-muted)]/80 tracking-[0.2em]">
              Contemporary Architectural Silk
            </span>
          </div>
        </div>

        {/* Hero image occupying 60–75% of visual field */}
        <div className="w-full max-w-4xl mx-auto">
          <EditorialPlate
            src="/api/collection/vysh-arc-01/hero"
            alt="The Continuum Archetype — Dramatic Black and Gold Silk Drapery"
            aspectRatio="4/5"
            priority={true}
            caption="The Continuum Archetype &mdash; Dramatic Silk Drapery"
            metadata="VYSH-ARC-01 // 01 HERO SPECIMEN"
            className="w-full max-w-2xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};
