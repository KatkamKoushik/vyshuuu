'use client';

import React from 'react';
import { useExperienceStore } from '@/stores/experienceStore';

export const StaticFallback: React.FC = () => {
  const isContextLost = useExperienceStore((s) => s.isContextLost);
  const webglSupported = useExperienceStore((s) => s.webglSupported);
  const hasTextureError = useExperienceStore((s) => s.hasTextureError);

  const fallbackReason = !webglSupported
    ? 'Hardware WebGL graphics acceleration is not supported or disabled in this browser.'
    : isContextLost
    ? 'GPU WebGL context was lost or reclaimed by the system.'
    : hasTextureError
    ? 'Network failure encountered while fetching GPU texture maps.'
    : 'Presenting high-fidelity static photographic and editorial archive.';

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none flex items-center justify-center overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Screen-reader and accessible announcement of fallback mode */}
      <div className="sr-only" role="status" aria-live="polite">
        Archival Still Exhibition Mode: {fallbackReason} Full unstitched saree monographs, weave analyses, and high-resolution photographic plates remain completely accessible throughout the gallery.
      </div>

      {/* Editorial Vertical Hairline in Antique Zari */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-[var(--color-accent-zari)] to-transparent opacity-60"
          style={{
            boxShadow: '0 0 12px rgba(197, 168, 105, 0.15)',
          }}
        />
      </div>
    </div>
  );
};
