'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ExperienceRoot } from './ExperienceRoot';
import { StaticFallback } from './fallback/StaticFallback';
import { useWebGLSupport } from '@/hooks/useWebGLSupport';

export const GlobalCanvas: React.FC = () => {
  const isWebGLSupported = useWebGLSupport();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid SSR hydration issues; render nothing or fallback until mounted
  if (!mounted) {
    return <StaticFallback />;
  }

  // Graceful degradation when WebGL is unsupported or disabled
  if (!isWebGLSupported) {
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
          position: [0, 0, 5],
          fov: 42,
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
