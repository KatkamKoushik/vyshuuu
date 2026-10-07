'use client';

import React, { useEffect, useState } from 'react';
import { initLenis, destroyLenis } from '@/lib/lenis';
import { Masthead } from './Masthead';
import { SkipLink } from './SkipLink';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useExperienceStore } from '@/stores/experienceStore';

interface SiteShellProps {
  children: React.ReactNode;
}

export const SiteShell: React.FC<SiteShellProps> = ({ children }) => {
  const isReducedMotion = usePrefersReducedMotion();
  const [debugActive, setDebugActive] = useState(false);
  const activeScene = useExperienceStore((s) => s.activeScene);
  const webglSupported = useExperienceStore((s) => s.webglSupported);

  useEffect(() => {
    // Check for development debug flag (?debug=1)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('debug') === '1') {
        setDebugActive(true);
      }
    }

    // Initialize smooth scrolling unless reduced motion is preferred
    if (!isReducedMotion) {
      initLenis();
    }

    return () => {
      destroyLenis();
    };
  }, [isReducedMotion]);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-accent-zari)] selection:text-[var(--color-bg)]">
      <SkipLink />
      <Masthead />

      {/* Main Content Area */}
      <main id="content" className="relative z-[10] focus:outline-none">
        {children}
      </main>

      {/* Dev-only Telemetry Overlay (?debug=1) */}
      {debugActive && (
        <aside
          aria-label="Development Telemetry"
          className="fixed bottom-4 left-4 z-[999] p-3.5 bg-black/90 border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text)] space-y-1 backdrop-blur-sm pointer-events-none select-none max-w-xs"
        >
          <div className="text-[var(--color-accent-zari)] font-bold tracking-wider">VYSHUUU DEBUG v0.4 [SHOT 12.5A]</div>
          <div>Scene: {activeScene.toUpperCase()}</div>
          <div>WebGL: {webglSupported ? 'Active (WebGL2)' : 'Fallback (Static)'}</div>
          <div>Motion: {isReducedMotion ? 'Reduced' : 'Dynamic'}</div>
          <div className="pt-1 border-t border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
            <div>Warp/Weft: 160 &times; 120</div>
            <div>Fold Wave: 0.38 (Asymmetric S)</div>
            <div>Selvedge Edge: 0.035 Rim Grazing</div>
            <div>Continuum: Diagonal Arch (0.55)</div>
          </div>
        </aside>
      )}
    </div>
  );
};
