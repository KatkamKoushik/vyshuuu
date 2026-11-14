'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ExperienceRoot } from './ExperienceRoot';
import { StaticFallback } from './fallback/StaticFallback';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { useExperienceStore } from '@/stores/experienceStore';

export const GlobalCanvas: React.FC = () => {
  const isWebGLSupported = useWebGLSupport();
  const [mounted, setMounted] = useState(false);
  const [isContextLost, setIsContextLost] = useState(false);

  const activeScene = useExperienceStore((s) => s.activeScene);
  const qualityTier = useExperienceStore((s) => s.qualityTier);
  const setWebGLSupported = useExperienceStore((s) => s.setWebGLSupported);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR hydration issues; render nothing or fallback until mounted
  if (!mounted) {
    return <StaticFallback />;
  }

  // Graceful degradation when WebGL is unsupported or disabled or context lost
  if (!isWebGLSupported || isContextLost) {
    return <StaticFallback />;
  }

  // Canvas maintains persistent atmospheric void (golden micro-dust particles & dynamic raking light)
  const is3DActive =
    activeScene === 'threshold' ||
    activeScene === 'loom' ||
    activeScene === 'specimen' ||
    activeScene === 'unfurling' ||
    activeScene === 'anthology';

  const dprRange: [number, number] =
    qualityTier === 'LOW'
      ? [1, 1]
      : qualityTier === 'MED'
        ? [1, 1.25]
        : [1, 1.5];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
    >
      <Canvas
        frameloop={is3DActive ? 'always' : 'never'}
        dpr={dprRange}
        gl={{
          antialias: qualityTier !== 'LOW',
          alpha: true,
          powerPreference: qualityTier === 'LOW' ? 'default' : 'high-performance',
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn('[VYSHUUU WebGL] WebGL context lost. Rendering static fallback.');
            setIsContextLost(true);
            setWebGLSupported(false);
          };
          const handleContextRestored = () => {
            console.info('[VYSHUUU WebGL] WebGL context restored.');
            setIsContextLost(false);
            setWebGLSupported(true);
          };
          canvas.addEventListener('webglcontextlost', handleContextLost, false);
          canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
        }}
        camera={{
          position: [0, 0, 5.8],
          fov: 38,
          near: 0.1,
          far: 50,
        }}
      >
        <Suspense fallback={null}>
          <ExperienceRoot />
        </Suspense>
      </Canvas>
    </div>
  );
};
