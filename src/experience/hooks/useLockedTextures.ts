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
  loadErrors: string[];
} {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [textures, setTextures] = useState<LockedTextureSet>({
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

  const activeTexturesRef = useRef<Record<string, THREE.Texture>>({});

  useEffect(() => {
    let isCancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    let completedCount = 0;
    const currentErrors: string[] = [];

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

          activeTexturesRef.current[key] = tex;
          setTextures((prev) => ({ ...prev, [key]: tex }));

          completedCount++;
          useExperienceStore.getState().setTexturesLoadedCount(completedCount);

          if (completedCount === TEXTURE_ROUTES.length) {
            setIsLoaded(true);
            useExperienceStore.getState().setTexturesLoaded(true);
          }
        },
        undefined,
        (err) => {
          console.warn(`[VYSHUUU Texture Loader] Failed to load ${key} from ${url}:`, err);
          currentErrors.push(key);
          setLoadErrors([...currentErrors]);
          useExperienceStore.getState().setHasTextureError(true);

          completedCount++;
          useExperienceStore.getState().setTexturesLoadedCount(completedCount);
          if (completedCount === TEXTURE_ROUTES.length) {
            setIsLoaded(true);
            useExperienceStore.getState().setTexturesLoaded(true);
          }
        }
      );
    });

    return () => {
      isCancelled = true;
      Object.values(activeTexturesRef.current).forEach((tex) => {
        if (tex) {
          tex.dispose();
        }
      });
      activeTexturesRef.current = {};
    };
  }, []);

  return { textures, isLoaded, loadErrors };
}
