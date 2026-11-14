'use client';

import React from 'react';
import { EditorialPlate } from './EditorialPlate';
import { InlineMediaHeadline } from './InlineMediaHeadline';

export const GossamerHero: React.FC = () => {
  return (
    <section
      id="gossamer"
      aria-label="Gossamer Kora Hero"
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-24 select-none bg-[#f5f1e8] text-[#1b1917]"
    >
      <div className="w-full max-w-[var(--max-content-width)] mx-auto flex flex-col items-center">
        {/* Haute Couture Avant-Garde Light-Themed Header */}
        <div className="w-full max-w-4xl mx-auto mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="mono-spec text-[10px] text-[#8c7443] tracking-[0.26em] block font-medium">
                STUDY NO. 02 &mdash; DIAPHANOUS WEAVE
              </span>
              <span className="text-[#8c7443]">&middot;</span>
              <span className="mono-spec text-[9px] text-[#6d6457] tracking-[0.16em]">
                TRANSMITTANCE: 68%
              </span>
            </div>

            {/* Inline Media Headline */}
            <InlineMediaHeadline
              prefix="GOSSAMER"
              mediaSrc="/api/collection/vysh-chd-01/macro"
              mediaAlt="Gossamer Kora Open Khat Microstructure"
              suffix="KORA"
              tag="h3"
              badgeLabel="KORA // SHEER"
              pillText="kora"
              className="text-3xl sm:text-4xl md:text-5xl text-[#1e1b18] font-normal tracking-[0.04em]"
            />
          </div>

          {/* Monospace Thread Telemetry */}
          <div className="flex flex-col md:items-end gap-1.5">
            <span className="mono-spec text-[11px] text-[#8c7443] tracking-[0.18em] font-medium">
              VYSH-CHD-01 // WORK 04
            </span>
            <span className="mono-spec text-[10px] text-[#6d6457] tracking-[0.14em]">
              WARP: 100/in &middot; WEFT: 80/in &middot; KORA COTTON-SILK
            </span>
            <span className="caption-tracked text-[10px] text-[#6d6457]/80 tracking-[0.2em]">
              Sheer Architectural Study
            </span>
          </div>
        </div>

        {/* Hero image occupying 60–75% of visual field */}
        <div className="w-full max-w-4xl mx-auto">
          <EditorialPlate
            src="/api/collection/vysh-chd-01/hero"
            alt="Gossamer Kora — Golden Sari Draped in Shadows"
            aspectRatio="4/5"
            priority={true}
            variant="light"
            caption="Gossamer Kora &mdash; Golden Sari Draped in Shadows"
            metadata="VYSH-CHD-01 // 01 HERO SPECIMEN"
            className="w-full max-w-2xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};
