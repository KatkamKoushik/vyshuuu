'use client';

import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

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

const TEXTURE_ROUTES: { key: keyof LockedTextureSet; url: string; isSRGB: boolean }[] = [
  { key: 'baseColor', url: '/api/textures/base-color', isSRGB: true },
  { key: 'zariMask', url: '/api/textures/zari-mask', isSRGB: false },
  { key: 'borderMask', url: '/api/textures/border-mask', isSRGB: false },
  { key: 'palluMask', url: '/api/textures/pallu-mask', isSRGB: false },
  { key: 'redAccent', url: '/api/textures/red-accent', isSRGB: false },
  { key: 'weaveDirection', url: '/api/textures/weave-direction', isSRGB: false },
  { key: 'roughness', url: '/api/textures/roughness', isSRGB: false },
  { key: 'microNormal', url: '/api/textures/micro-normal', isSRGB: false },
  { key: 'edgeFringe', url: '/api/textures/edge-fringe', isSRGB: false },
];

export function useLockedTextures(): {
  textures: LockedTextureSet;
  isLoaded: boolean;
} {
  const [isLoaded, setIsLoaded] = useState(false);
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
    let loadedCount = 0;

    TEXTURE_ROUTES.forEach(({ key, url, isSRGB }) => {
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

          if (loadedCount === TEXTURE_ROUTES.length) {
            setIsLoaded(true);
          }
        },
        undefined,
        (err) => {
          console.warn(`[VYSHUUU Texture Loader] Failed to load ${key} from ${url}:`, err);
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

  return { textures: texturesRef.current, isLoaded };
}
