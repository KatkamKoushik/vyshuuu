import * as THREE from 'three';

export interface UnfurlingUniforms {
  uTime: { value: number };
  uProgress: { value: number };
  uScrollVelocity: { value: number };
  uPointer: { value: THREE.Vector2 };
  uLightPos: { value: THREE.Vector3 };
  uLightIntensity: { value: number };
  uQualityTier: { value: number };
  uOpacity: { value: number };
  uSettlingEnergy: { value: number };

  // Palette Constants (VYSHUUU Sacred Charcoal & Antique Zari)
  uBaseColor: { value: THREE.Color };
  uZariColor: { value: THREE.Color };
  uSheenColor: { value: THREE.Color };
  uRedAccentColor: { value: THREE.Color };

  // Dynamic Draping & Pleat Model
  uFoldAmplitude: { value: number };
  uFoldFrequency: { value: number };
  uPleatDensity: { value: number };
  uContinuumSag: { value: number };

  // All 9 Locked Production Texture Maps
  tBaseColor: { value: THREE.Texture | null };
  tZariMask: { value: THREE.Texture | null };
  tBorderMask: { value: THREE.Texture | null };
  tPalluMask: { value: THREE.Texture | null };
  tRedAccent: { value: THREE.Texture | null };
  tWeaveDirection: { value: THREE.Texture | null };
  tRoughness: { value: THREE.Texture | null };
  tMicroNormal: { value: THREE.Texture | null };
  tEdgeFringe: { value: THREE.Texture | null };
  uHasTextures: { value: number };
}

/**
 * Creates standardized shader uniforms for the 6-Yard Unfurling textile experience.
 */
export function createUnfurlingUniforms(qualityTier: number = 3): UnfurlingUniforms {
  return {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uScrollVelocity: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uLightPos: { value: new THREE.Vector3(-1.8, 2.2, 3.2) }, // Lateral raking illumination
    uLightIntensity: { value: 2.8 },
    uQualityTier: { value: qualityTier },
    uOpacity: { value: 0 },
    uSettlingEnergy: { value: 0 },

    // Charcoal Silk body with Antique Zari and auspicious Madder Red
    uBaseColor: { value: new THREE.Color('#141312') },
    uZariColor: { value: new THREE.Color('#C5A869') },
    uSheenColor: { value: new THREE.Color('#EDE8DC') },
    uRedAccentColor: { value: new THREE.Color('#8B2624') },

    // Draping constants
    uFoldAmplitude: { value: 0.42 },
    uFoldFrequency: { value: 2.1 },
    uPleatDensity: { value: 6.0 },
    uContinuumSag: { value: 0.35 },

    // Locked Production Maps
    tBaseColor: { value: null },
    tZariMask: { value: null },
    tBorderMask: { value: null },
    tPalluMask: { value: null },
    tRedAccent: { value: null },
    tWeaveDirection: { value: null },
    tRoughness: { value: null },
    tMicroNormal: { value: null },
    tEdgeFringe: { value: null },
    uHasTextures: { value: 0 },
  };
}
