'use client';

import React from 'react';
import { CameraController } from './controllers/CameraController';
import { ThresholdScene } from './scenes/ThresholdScene';
import { UnfurlingScene } from './scenes/UnfurlingScene';

export const ExperienceRoot: React.FC = () => {
  return (
    <>
      <CameraController />
      {/* Controlled Lateral Raking Key Light (Acute Chiaroscuro Grazing Beam) */}
      <directionalLight
        position={[-4.2, 2.5, 2.2]}
        intensity={2.2}
        color="#FFF3DC"
      />

      {/* Warm Obsidian Gallery Ambient (Reveals rich charcoal twill & gold thread in shadow) */}
      <ambientLight intensity={0.45} color="#2A251F" />

      {/* Restrained Architectural Shadow Fill (Subtle warm fill in pleat valleys) */}
      <directionalLight
        position={[2.5, 0.8, -1.5]}
        intensity={0.35}
        color="#3A3228"
      />

      {/* Threshold Scene (Intro single golden filament) */}
      <ThresholdScene />

      {/* The Signature 6-Yard Unfurling Scene (Continuous woven saree with 9 locked maps) */}
      <UnfurlingScene />
    </>
  );
};
