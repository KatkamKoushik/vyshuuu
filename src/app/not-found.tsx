import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center bg-[var(--color-bg)]">
      <div className="max-w-md space-y-6">
        <span className="caption-tracked text-xs text-[var(--color-accent-zari)] block">
          Folio 404 &mdash; Unrecorded
        </span>
        <h1 className="display-md text-[var(--color-text)]">
          The Unfound Weave
        </h1>
        <p className="body-editorial text-[var(--color-text-muted)] text-sm">
          This thread does not exist within the current archive.
        </p>
        <div className="pt-6">
          <Link
            href="/"
            className="caption-tracked px-8 py-3.5 border border-[var(--color-border)] text-[var(--color-accent-zari)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] transition-colors inline-block text-xs"
          >
            Return to Threshold &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
