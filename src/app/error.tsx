'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error telemetry quietly without user-facing console spam
    console.error('[VYSHUUU Experience Error]', error.message);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center bg-[var(--color-bg)]">
      <div className="max-w-md space-y-6">
        <span className="caption-tracked text-xs text-[var(--color-accent-zari)] block">
          Notice &mdash; Experience Interruption
        </span>
        <h1 className="display-md text-[var(--color-text)]">
          The Weave Paused
        </h1>
        <p className="body-editorial text-[var(--color-text-muted)] text-sm">
          A temporary rendering variance occurred. The archive remains intact.
        </p>
        <div className="pt-6 flex justify-center gap-6">
          <button
            type="button"
            onClick={() => reset()}
            className="caption-tracked px-6 py-3 border border-[var(--color-border)] text-[var(--color-accent-zari)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors cursor-pointer text-xs"
          >
            Re-engage Weave
          </button>
          <Link
            href="/"
            className="caption-tracked px-6 py-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-xs"
          >
            Return to Threshold
          </Link>
        </div>
      </div>
    </div>
  );
}
