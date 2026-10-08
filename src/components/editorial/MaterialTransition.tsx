'use client';

import React from 'react';
import { getAtmosphere, getAtmosphereTransition } from '@/lib/atmosphere/collectionAtmospheres';

export interface MaterialTransitionProps {
  fromId?: string;
  toId?: string;
}

export const MaterialTransition: React.FC<MaterialTransitionProps> = ({
  fromId = 'vysh-arc-01',
  toId = 'vysh-chd-01',
}) => {
  const fromAtmo = getAtmosphere(fromId);
  const toAtmo = getAtmosphere(toId);
  const transition = getAtmosphereTransition(fromId, toId);

  return (
    <section
      aria-label="Colour and Material Transition"
      style={{
        background: `linear-gradient(to bottom, ${fromAtmo.palette.background} 0%, ${transition.midpointColor} 55%, ${toAtmo.palette.background} 100%)`,
      }}
      className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-6 md:px-16 py-32 text-center select-none"
    >
      {/* Decorative vertical filament line transitioning between atmosphere accents */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${fromAtmo.palette.accent}, #cbb17b, ${toAtmo.palette.accent})`,
        }}
        className="w-[1px] h-24 opacity-60 mb-12"
      />

      <div className="max-w-3xl mx-auto space-y-6">
        <span className="mono-spec text-[10px] md:text-xs text-[#d8c399] tracking-[0.32em] uppercase block">
          [ CHROMATIC INVERSION &mdash; CONTINUUM SHIFT ]
        </span>

        <h2 className="display-lg text-[#ede5d8] font-normal tracking-[0.04em]">
          FROM NIGHT INTO LIGHT
        </h2>

        <p className="body-editorial text-sm md:text-base text-[#b8ab96] tracking-[0.04em] max-w-xl mx-auto leading-relaxed">
          &ldquo;The continuum breathes between mass and air. {fromAtmo.name} dissolves into {toAtmo.name}&mdash;where density yields to translucency.&rdquo;
        </p>

        <div className="pt-8 flex items-center justify-center gap-6 text-[10px] mono-spec text-[#9c8e79]">
          <span>{fromAtmo.editorial.tagline}</span>
          <span
            style={{ backgroundColor: toAtmo.palette.accent }}
            className="w-1.5 h-1.5 rounded-full"
          />
          <span>{toAtmo.editorial.tagline}</span>
        </div>
      </div>
    </section>
  );
};
