'use client';

import React from 'react';
import { EditorialPlate } from './EditorialPlate';

export const GossamerHero: React.FC = () => {
  return (
    <section
      id="gossamer"
      aria-label="Gossamer Kora Hero"
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-24 select-none bg-[#f5f1e8] text-[#1b1917]"
    >
      <div className="w-full max-w-[var(--max-content-width)] mx-auto flex flex-col items-center">
        {/* Restrained Light-Themed Header Typography */}
        <div className="w-full max-w-4xl mx-auto mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="mono-spec text-[10px] text-[#8c7443] tracking-[0.26em] block mb-2 font-medium">
              STUDY NO. 02 &mdash; DIAPHANOUS WEAVE
            </span>
            <h3 className="display-md md:display-lg text-[#1e1b18] font-normal tracking-[0.04em]">
              GOSSAMER KORA
            </h3>
          </div>

          <div className="flex flex-col md:items-end gap-1.5">
            <span className="mono-spec text-[11px] text-[#1e1b18] tracking-[0.16em] font-medium">
              VYSH-CHD-01
            </span>
            <span className="caption-tracked text-[10px] text-[#6d6457] tracking-[0.2em]">
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
