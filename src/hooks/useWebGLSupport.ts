'use client';

import { useState, useEffect } from 'react';
import { useExperienceStore } from '@/stores/experienceStore';

export function useWebGLSupport(): boolean {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const setWebGLSupported = useExperienceStore((s) => s.setWebGLSupported);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const supported = Boolean(gl);
      setIsSupported(supported);
      setWebGLSupported(supported);
    } catch {
      setIsSupported(false);
      setWebGLSupported(false);
    }
  }, [setWebGLSupported]);

  return isSupported;
}
