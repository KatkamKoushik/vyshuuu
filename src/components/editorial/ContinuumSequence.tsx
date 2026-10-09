'use client';

import React from 'react';
import { EditorialPlate } from './EditorialPlate';

export const ContinuumSequence: React.FC = () => {
  return (
    <section
      aria-label="Continuum Archetype Editorial Sequence"
      className="relative w-full px-6 md:px-16 lg:px-24 py-16 sm:py-24 md:py-48 select-none bg-[var(--color-bg)]"
    >
      <div className="w-full max-w-[var(--max-content-width)] mx-auto space-y-16 sm:space-y-24 md:space-y-64">
        
        {/* Sequence Movement 01: Quiet Flat Topological Reference */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <span className="caption-tracked text-[10px] text-[var(--color-accent-zari)]">
              Movement I &mdash; Flat Reference
            </span>
            <span className="mono-spec text-[9px] text-[var(--color-text-muted)]">
              Full 6-Yard Topological Plane
            </span>
          </div>
          <EditorialPlate
            src="/api/collection/vysh-arc-01/flat"
            alt="The Continuum Archetype — Flat Geometric Saree"
            aspectRatio="16/9"
            speed="slow"
            caption="02 // Flat Topological Plane"
            metadata="1672 &times; 941 px &middot; Specimen Map"
          />
        </div>

        {/* Sequence Movement 02: Asymmetric Viscous Fold & Pleats */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 lg:gap-24 items-start">
          <div className="md:col-span-6 md:pt-28">
            <EditorialPlate
              src="/api/collection/vysh-arc-01/fold"
              alt="The Continuum Archetype — Luxurious Brocade Folds"
              aspectRatio="3/4"
              speed="slow"
              caption="03 // Viscous Drape &amp; Fold Memory"
              metadata="3-Ply Twisted Mulberry Silk"
            />
          </div>

          <div className="md:col-span-5 md:col-start-8 md:pt-4">
            <EditorialPlate
              src="/api/collection/vysh-arc-01/pleat"
              alt="The Continuum Archetype — Antique Gold Silk Pleats"
              aspectRatio="3/4"
              caption="04 // Cascading Structural Pleats"
              metadata="Repetitive Wave Tension"
            />
          </div>
        </div>

        {/* Sequence Movement 03: Macro Material Interstices & Brocade Selvedge */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <EditorialPlate
              src="/api/collection/vysh-arc-01/macro"
              alt="The Continuum Archetype — Woven Textile Microstructure"
              aspectRatio="1/1"
              caption="05 // Weave Macro &amp; Anisotropic Crown"
              metadata="Micro-Normal &middot; Longitudinal Tangent"
            />
          </div>

          <div className="md:pt-28">
            <EditorialPlate
              src="/api/collection/vysh-arc-01/border"
              alt="The Continuum Archetype — Brocade Selvedge Ribbon"
              aspectRatio="1/1"
              caption="06 // Solid Brocade Selvedge Ribbon"
              metadata="Transverse Zari Inset &middot; Madder Edge"
              hasSelvedgeGesture={true}
            />
          </div>
        </div>

        {/* Sequence Movement 04: Monumental Pallu Architectural Terminus */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <span className="caption-tracked text-[10px] text-[var(--color-accent-zari)]">
              Movement II &mdash; Pallu Field
            </span>
            <span className="mono-spec text-[9px] text-[var(--color-text-muted)]">
              Architectural Gold Insertion
            </span>
          </div>
          <EditorialPlate
            src="/api/collection/vysh-arc-01/pallu"
            alt="The Continuum Archetype — Black Silk and Gold Geometric Brocade Pallu"
            aspectRatio="16/9"
            caption="07 // Monumental Pallu Field"
            metadata="Transverse Weft Dominance &middot; Knotted Fringe Boundary"
          />
        </div>

        {/* Sequence Movement 05: Chiaroscuro Editorial Campaign Study */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <span className="caption-tracked text-[10px] text-[var(--color-accent-zari)]">
              Movement III &mdash; Silhouette in Shadow
            </span>
            <span className="mono-spec text-[9px] text-[var(--color-text-muted)]">
              Chiaroscuro Editorial Horizon
            </span>
          </div>
          <EditorialPlate
            src="/api/collection/vysh-arc-01/editorial"
            alt="The Continuum Archetype — Black and Gold Silk in Shadow"
            aspectRatio="16/9"
            speed="slow"
            caption="08 // Editorial Campaign Study"
            metadata="Grazing Lateral 3200K Key &middot; Obsidian Floor"
          />
        </div>

      </div>
    </section>
  );
};
