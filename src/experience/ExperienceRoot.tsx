'use client';

import React from 'react';
import { ThresholdScene } from './scenes/ThresholdScene';
import { UnfurlingScene } from './scenes/UnfurlingScene';

export const ExperienceRoot: React.FC = () => {
  return (
    <>
      {/* Controlled Lateral Raking Key Light (Acute Chiaroscuro Grazing Beam) */}
      <directionalLight
        position={[-4.2, 2.5, 2.2]}
        intensity={1.7}
        color="#F9E8C8"
      />

      {/* Deep Obsidian Shadow Floor (Preserves near-black silk body at rest) */}
      <ambientLight intensity={0.18} color="#0F0E10" />

      {/* Selective Antique Zari Rim Graze (Catches thread crowns and selvedge edge) */}
      <directionalLight
        position={[3.8, 1.0, -2.8]}
        intensity={0.65}
        color="#8B7443"
      />

      {/* Threshold Scene (Intro single golden filament) */}
      <ThresholdScene />

      {/* The Signature 6-Yard Unfurling Scene (Continuous woven saree with 9 locked maps) */}
      <UnfurlingScene />
    </>
  );
};
