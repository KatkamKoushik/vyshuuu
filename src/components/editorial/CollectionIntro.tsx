'use client';

import React from 'react';

export const CollectionIntro: React.FC = () => {
  return (
    <section
      id="collection"
      aria-label="Collection Introduction"
      className="relative w-full min-h-[60vh] flex flex-col justify-center items-center px-6 md:px-16 py-32 text-center select-none bg-[var(--color-bg)]"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="mono-spec text-[10px] md:text-xs text-[var(--color-accent-zari)] tracking-[0.32em] uppercase block">
          Act II &mdash; The Digital Atelier Catalogue
        </span>

        <h2 className="display-lg text-[var(--color-text)] font-normal tracking-[0.04em]">
          COLLECTION
        </h2>

        <div className="w-12 h-[1px] bg-[var(--color-accent-zari)]/40 mx-auto" />

        <p className="body-editorial text-sm md:text-base text-[var(--color-text-muted)] tracking-[0.06em] max-w-xl mx-auto">
          Ten canonical studies in the unstitched continuum &mdash; from monumental architectural silk to diaphanous open grids.
        </p>

        <p className="mono-spec text-[10px] text-[var(--color-text-muted)]/70 tracking-[0.2em] pt-4">
          [ SCROLL TO ENTER THE STUDY ROOMS &middot; 81 ARCHIVAL ASSETS ]
        </p>
      </div>
    </section>
  );
};
