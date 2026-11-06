'use client';

import { useSyncExternalStore } from 'react';
import { useExperienceStore } from '@/stores/experienceStore';

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (e: MediaQueryListEvent) => {
    useExperienceStore.getState().setReducedMotion(e.matches);
    callback();
  };

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  const matches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (useExperienceStore.getState().isReducedMotion !== matches) {
    useExperienceStore.getState().setReducedMotion(matches);
  }
  return matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
