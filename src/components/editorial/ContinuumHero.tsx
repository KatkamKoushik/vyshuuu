'use client';

import React from 'react';
import { EditorialPlate } from './EditorialPlate';

export const ContinuumHero: React.FC = () => {
  return (
    <section
      id="continuum"
      aria-label="The Continuum Archetype"
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-24 select-none bg-[var(--color-bg)]"
    >
      <div className="w-full max-w-[var(--max-content-width)] mx-auto flex flex-col items-center">
        {/* Restrained Header Typography: Subordinate to the Textile */}
        <div className="w-full max-w-4xl mx-auto mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="mono-spec text-[10px] text-[var(--color-accent-zari)] tracking-[0.26em] block mb-2">
              STUDY NO. 01 &mdash; ARCHIVAL CORE
            </span>
            <h3 className="display-md md:display-lg text-[var(--color-text)] font-normal tracking-[0.04em]">
              THE CONTINUUM ARCHETYPE
            </h3>
          </div>

          <div className="flex flex-col md:items-end gap-1.5">
            <span className="mono-spec text-[11px] text-[var(--color-text)] tracking-[0.16em]">
              VYSH-ARC-01
            </span>
            <span className="caption-tracked text-[10px] text-[var(--color-text-muted)] tracking-[0.2em]">
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
