'use client';

import { useEffect } from 'react';
import { useExperienceStore } from '@/stores/experienceStore';

export function usePrefersReducedMotion(): boolean {
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);
  const setReducedMotion = useExperienceStore((s) => s.setReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setReducedMotion]);

  return isReducedMotion;
}
