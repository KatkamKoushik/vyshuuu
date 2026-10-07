import * as THREE from 'three';

export interface LoomUniforms {
  uTime: { value: number };
  uProgress: { value: number };
  uPointer: { value: THREE.Vector2 };
  uLightPos: { value: THREE.Vector3 };
  uLightIntensity: { value: number };
  uWarpDensity: { value: number };
  uWeftDensity: { value: number };
  uWarpStrength: { value: number };
  uWeftStrength: { value: number };
  uWeaveIrregularity: { value: number };
  uZariMaskStrength: { value: number };
  uZariFrequency: { value: number };
  uQualityTier: { value: number };
  uBaseColor: { value: THREE.Color };
  uZariColor: { value: THREE.Color };
  uSheenColor: { value: THREE.Color };
  uOpacity: { value: number };
  // SHOT 12 / 12.5 Specimen Material System Parameters
  uSpecimenProgress: { value: number };
  uFoldAmplitude: { value: number };
  uFoldFrequency: { value: number };
  uSurfaceDepth: { value: number };
  uEdgeThickness: { value: number };
  uContinuumBend: { value: number };
}

/**
 * Creates standardized shader uniforms for the Loom textile surface.
 * Values are visual authoring parameters calibrated for luxurious silk drape and restrained zari.
 */
export function createLoomUniforms(qualityTier: number = 3): LoomUniforms {
  // Density scaled conservatively by quality tier
  const warpDensity = qualityTier >= 3 ? 150.0 : qualityTier === 2 ? 100.0 : 65.0;
  const weftDensity = qualityTier >= 3 ? 115.0 : qualityTier === 2 ? 80.0 : 50.0;

  return {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uLightPos: { value: new THREE.Vector3(1.2, 1.6, 2.4) },
    uLightIntensity: { value: 2.4 },
    uWarpDensity: { value: warpDensity },
    uWeftDensity: { value: weftDensity },
    uWarpStrength: { value: 0.30 }, // SHOT 12.5A: Restrained thread contrast (silk body dominates)
    uWeftStrength: { value: 0.25 },
    uWeaveIrregularity: { value: 0.030 }, // Subtle organic handloom nuance
    uZariMaskStrength: { value: 0.48 }, // Selective antique zari: discovered under raking light
    uZariFrequency: { value: 24.0 }, // Discrete thread interval
    uQualityTier: { value: qualityTier },
    uBaseColor: { value: new THREE.Color('#161412') }, // Rich Charcoal Silk body (VYSHUUU palette)
    uZariColor: { value: new THREE.Color('#C5A869') }, // Antique Zari
    uSheenColor: { value: new THREE.Color('#EDE8DC') }, // Warm Kora Silk sheen
    uOpacity: { value: 0 },
    // SHOT 12.5 Refined Specimen authoring parameters
    uSpecimenProgress: { value: 0 },
    uFoldAmplitude: { value: 0.32 }, // Heavy, viscous silk fold memory
    uFoldFrequency: { value: 1.35 }, // Long, elegant wavelength (no water waves)
    uSurfaceDepth: { value: 0.04 }, // Subtle tactile depth
    uEdgeThickness: { value: 0.030 }, // Selvedge border thickness
    uContinuumBend: { value: 0.52 }, // Continuous diagonal ribbon arch
  };
}
