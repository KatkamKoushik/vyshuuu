'use client';

import React, { Suspense, useSyncExternalStore } from 'react';
import { Canvas } from '@react-three/fiber';
import { ExperienceRoot } from './ExperienceRoot';
import { StaticFallback } from './fallback/StaticFallback';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';
import { useExperienceStore } from '@/stores/experienceStore';

const emptySubscribe = () => () => {};

export const GlobalCanvas: React.FC = () => {
  const isWebGLSupported = useWebGLSupport();
  const isContextLost = useExperienceStore((s) => s.isContextLost);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Avoid SSR hydration issues; render nothing or fallback until mounted
  if (!isMounted) {
    return <StaticFallback />;
  }

  // Graceful degradation when WebGL is unsupported, disabled, or context lost
  if (!isWebGLSupported || isContextLost) {
    return <StaticFallback />;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        camera={{
          position: [0, 0, 5.8],
          fov: 38,
          near: 0.1,
          far: 50,
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const handleContextLost = (event: Event) => {
            event.preventDefault();
            console.warn('[VYSHUUU WebGL] Context lost event received');
            useExperienceStore.getState().setContextLost(true);
          };
          const handleContextRestored = () => {
            console.info('[VYSHUUU WebGL] Context restored event received');
            useExperienceStore.getState().setContextLost(false);
          };

          canvas.addEventListener('webglcontextlost', handleContextLost, false);
          canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
        }}
      >
        <Suspense fallback={null}>
          <ExperienceRoot />
        </Suspense>
      </Canvas>
    </div>
  );
};
