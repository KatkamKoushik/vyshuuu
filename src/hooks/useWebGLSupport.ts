'use client';

import { useSyncExternalStore } from 'react';
import { useExperienceStore } from '@/stores/experienceStore';

function checkWebGL(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

let cachedSupport: boolean | null = null;
function getWebGLSnapshot(): boolean {
  if (cachedSupport === null) {
    cachedSupport = checkWebGL();
    // Update store state once evaluated
    useExperienceStore.getState().setWebGLSupported(cachedSupport);
  }
  return cachedSupport;
}

function getServerSnapshot(): boolean {
  return true;
}

function subscribe(callback: () => void): () => void {
  // Listen for WebGL context creation failure or loss if window available
  if (typeof window === 'undefined') return () => {};

  const handleContextLoss = () => {
    cachedSupport = false;
    useExperienceStore.getState().setWebGLSupported(false);
    useExperienceStore.getState().setContextLost(true);
    callback();
  };

  window.addEventListener('webglcontextlost', handleContextLoss);
  return () => {
    window.removeEventListener('webglcontextlost', handleContextLoss);
  };
}

export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, getWebGLSnapshot, getServerSnapshot);
}
