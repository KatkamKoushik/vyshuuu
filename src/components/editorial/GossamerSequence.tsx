'use client';

import React from 'react';
import { EditorialPlate } from './EditorialPlate';

export const GossamerSequence: React.FC = () => {
  return (
    <section
      aria-label="Gossamer Kora Editorial Sequence"
      className="relative w-full px-6 md:px-16 lg:px-24 py-16 sm:py-24 md:py-48 select-none bg-[#f5f1e8] text-[#1e1b18]"
    >
      <div className="w-full max-w-[var(--max-content-width)] mx-auto space-y-16 sm:space-y-24 md:space-y-64">
        
        {/* Sequence Movement 01: Quiet Translucent Flat Reference */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <span className="caption-tracked text-[10px] text-[#8c7443] font-medium">
              Movement I &mdash; Sheer Reference
            </span>
            <span className="mono-spec text-[9px] text-[#786e5e]">
              Open Khat Woven Transparency
            </span>
          </div>
          <EditorialPlate
            src="/api/collection/vysh-chd-01/flat"
            alt="Gossamer Kora — Sheer Ivory Saree with Golden Weave"
            aspectRatio="16/9"
            variant="light"
            speed="slow"
            caption="02 // Sheer Ivory Topological Plane"
            metadata="1672 &times; 941 px &middot; Specimen Map"
          />
        </div>

        {/* Sequence Movement 02: Asymmetric Grid Fold & Sunlit Pleats */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 lg:gap-24 items-start">
          <div className="md:col-span-6 md:pt-28">
            <EditorialPlate
              src="/api/collection/vysh-chd-01/fold"
              alt="Gossamer Kora — Golden Grid on Sheer Ivory Fabric"
              aspectRatio="3/4"
              variant="light"
              speed="slow"
              caption="03 // Open Khat Grid &amp; Airy Fold"
              metadata="De-gummed Silk &middot; Superfine Cotton Weft"
            />
          </div>

          <div className="md:col-span-5 md:col-start-8 md:pt-4">
            <EditorialPlate
              src="/api/collection/vysh-chd-01/pleat"
              alt="Gossamer Kora — Sunlit Champagne Sheer Textile Drapery"
              aspectRatio="3/4"
              variant="light"
              caption="04 // Sunlit Champagne Pleats"
              metadata="Diaphanous Fluid Interstices"
            />
          </div>
        </div>

        {/* Sequence Movement 03: Macro Material Waves & Soft Golden Border */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <EditorialPlate
              src="/api/collection/vysh-chd-01/macro"
              alt="Gossamer Kora — Golden Woven Sheer Fabric Waves"
              aspectRatio="1/1"
              variant="light"
              caption="05 // Material Macro &amp; Interstices"
              metadata="Optical Translucency &middot; Champagne Filament"
            />
          </div>

          <div className="md:pt-28">
            <EditorialPlate
              src="/api/collection/vysh-chd-01/border"
              alt="Gossamer Kora — Golden Woven Fabric in Soft Folds"
              aspectRatio="1/1"
              variant="light"
              caption="06 // Soft Woven Selvedge Fold"
              metadata="Narrow Tissue Ribbon &middot; Micro-Picks"
            />
          </div>
        </div>

        {/* Sequence Movement 04: Luminous Pallu in Ambient Light */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <span className="caption-tracked text-[10px] text-[#8c7443] font-medium">
              Movement II &mdash; Luminous Pallu
            </span>
            <span className="mono-spec text-[9px] text-[#786e5e]">
              Flowing Ivory Ribbon Terminus
            </span>
          </div>
          <EditorialPlate
            src="/api/collection/vysh-chd-01/pallu"
            alt="Gossamer Kora — Golden Light on Flowing Ivory Fabric"
            aspectRatio="16/9"
            variant="light"
            caption="07 // Golden Light Flowing Pallu"
            metadata="Pale Champagne Ribbons &middot; Eyelash Fringe"
          />
        </div>

        {/* Sequence Movement 05: Sunlit Stone Editorial Campaign Study */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <span className="caption-tracked text-[10px] text-[#8c7443] font-medium">
              Movement III &mdash; Sunlit Sanctuary
            </span>
            <span className="mono-spec text-[9px] text-[#786e5e]">
              Architectural Daylight Study
            </span>
          </div>
          <EditorialPlate
            src="/api/collection/vysh-chd-01/editorial"
            alt="Gossamer Kora — Ethereal Linen in Sunlit Stone"
            aspectRatio="16/9"
            variant="light"
            speed="slow"
            caption="08 // Ethereal Campaign Study"
            metadata="Natural Daylight Grazing &middot; Honed Limestone"
          />
        </div>

      </div>
    </section>
  );
};
