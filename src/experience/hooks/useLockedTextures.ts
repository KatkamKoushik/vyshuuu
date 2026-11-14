'use client';

import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { getTextureUrl } from '@/lib/assets/cloudinaryAssets';
import { useExperienceStore } from '@/stores/experienceStore';

export interface LockedTextureSet {
  baseColor: THREE.Texture | null;
  zariMask: THREE.Texture | null;
  borderMask: THREE.Texture | null;
  palluMask: THREE.Texture | null;
  redAccent: THREE.Texture | null;
  weaveDirection: THREE.Texture | null;
  roughness: THREE.Texture | null;
  microNormal: THREE.Texture | null;
  edgeFringe: THREE.Texture | null;
}

const TEXTURE_ROUTES: { key: keyof LockedTextureSet; textureKey: string; isSRGB: boolean }[] = [
  { key: 'baseColor', textureKey: 'base-color', isSRGB: true },
  { key: 'zariMask', textureKey: 'zari-mask', isSRGB: false },
  { key: 'borderMask', textureKey: 'border-mask', isSRGB: false },
  { key: 'palluMask', textureKey: 'pallu-mask', isSRGB: false },
  { key: 'redAccent', textureKey: 'red-accent', isSRGB: false },
  { key: 'weaveDirection', textureKey: 'weave-direction', isSRGB: false },
  { key: 'roughness', textureKey: 'roughness', isSRGB: false },
  { key: 'microNormal', textureKey: 'micro-normal', isSRGB: false },
  { key: 'edgeFringe', textureKey: 'edge-fringe', isSRGB: false },
];

export function useLockedTextures(): {
  textures: LockedTextureSet;
  isLoaded: boolean;
  hasValidTextures: boolean;
} {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasValidTextures, setHasValidTextures] = useState(false);
  const texturesRef = useRef<LockedTextureSet>({
    baseColor: null,
    zariMask: null,
    borderMask: null,
    palluMask: null,
    redAccent: null,
    weaveDirection: null,
    roughness: null,
    microNormal: null,
    edgeFringe: null,
  });

  useEffect(() => {
    let isCancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    let loadedCount = 0;
    let successCount = 0;
    let failureCount = 0;

    const checkCompletion = () => {
      if (loadedCount === TEXTURE_ROUTES.length) {
        setIsLoaded(true);
        // Only mark textures valid if all required textures loaded successfully
        const allValid = successCount === TEXTURE_ROUTES.length && failureCount === 0;
        setHasValidTextures(allValid);
        useExperienceStore.getState().setTexturesLoaded(allValid);
      }
    };

    TEXTURE_ROUTES.forEach(({ key, textureKey, isSRGB }) => {
      const url = getTextureUrl(textureKey);
      loader.load(
        url,
        (tex) => {
          if (isCancelled) {
            tex.dispose();
            return;
          }
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
          tex.needsUpdate = true;

          texturesRef.current[key] = tex;
          loadedCount++;
          successCount++;
          useExperienceStore.getState().setTexturesLoadedCount(loadedCount);
          checkCompletion();
        },
        undefined,
        (err) => {
          console.warn(`[VYSHUUU Texture Loader] Failed to load ${key} from ${url}:`, err);
          loadedCount++;
          failureCount++;
          useExperienceStore.getState().setTexturesLoadedCount(loadedCount);
          checkCompletion();
        }
      );
    });

    const currentTextures = texturesRef.current;
    return () => {
      isCancelled = true;
      Object.values(currentTextures).forEach((tex) => {
        if (tex) tex.dispose();
      });
    };
  }, []);

  return { textures: texturesRef.current, isLoaded, hasValidTextures };
}
