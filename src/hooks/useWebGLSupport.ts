'use client';

import { useState, useEffect } from 'react';
import { useExperienceStore, QualityTier } from '@/stores/experienceStore';

export function useWebGLSupport(): boolean {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const setWebGLSupported = useExperienceStore((s) => s.setWebGLSupported);
  const setQualityTier = useExperienceStore((s) => s.setQualityTier);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const canvas = document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const supported = Boolean(gl2 || gl1);
      
      setIsSupported(supported);
      setWebGLSupported(supported);

      if (supported) {
        // Adaptive device tier detection
        const nav = navigator as unknown as {
          hardwareConcurrency?: number;
          deviceMemory?: number;
          maxTouchPoints?: number;
        };
        const cores = nav.hardwareConcurrency || 4;
        const memory = nav.deviceMemory || 4;
        const isMobileOrTouch = Boolean(nav.maxTouchPoints && nav.maxTouchPoints > 1);

        let detectedTier: QualityTier = 'HIGH';
        if (!gl2 || cores <= 4 || memory <= 4 || (isMobileOrTouch && cores < 6)) {
          detectedTier = 'LOW';
        } else if (cores < 8 || memory < 8) {
          detectedTier = 'MED';
        } else {
          detectedTier = 'HIGH';
        }

        setQualityTier(detectedTier);
      }
    } catch {
      setIsSupported(false);
      setWebGLSupported(false);
      setQualityTier('FALLBACK');
    }
  }, [setWebGLSupported, setQualityTier]);

  return isSupported;
}
