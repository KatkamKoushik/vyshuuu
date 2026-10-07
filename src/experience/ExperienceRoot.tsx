'use client';

import React from 'react';
import { ThresholdScene } from './scenes/ThresholdScene';
import { UnfurlingScene } from './scenes/UnfurlingScene';

export const ExperienceRoot: React.FC = () => {
  return (
    <>
      {/* Broad Lateral Raking Key Light (Directional Chiaroscuro 3200K Temple Gold) */}
      <directionalLight
        position={[-3.5, 4.5, 3.8]}
        intensity={3.2}
        color="#FFF1D0"
      />

      {/* Cool Obsidian Shadow Fill (Subtle non-destructive floor) */}
      <ambientLight intensity={0.45} color="#18181A" />

      {/* Raking Grazing Rim (Catches metallic zari wire and selvedge edge highlights) */}
      <directionalLight
        position={[3.5, 1.2, -2.5]}
        intensity={1.4}
        color="#C5A869"
      />

      {/* Threshold Scene (Intro single golden filament) */}
      <ThresholdScene />

      {/* The Signature 6-Yard Unfurling Scene (Continuous woven saree with 9 locked maps) */}
      <UnfurlingScene />
    </>
  );
};
