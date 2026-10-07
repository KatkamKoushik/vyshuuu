'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0A09] text-[#F5F2EB] min-h-screen flex items-center justify-center p-6 text-center font-serif">
        <div className="max-w-md space-y-6">
          <div className="text-xs uppercase tracking-[0.24em] text-[#C5A869]">
            VYSHUUU
          </div>
          <h1 className="text-3xl font-normal">
            The Atelier is Stilled
          </h1>
          <p className="text-sm text-[#9E9689] font-sans">
            A critical system variance was encountered. Please reload the experience.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 border border-[#C5A869]/30 text-[#C5A869] text-xs uppercase tracking-widest hover:border-[#F5F2EB] transition-colors cursor-pointer"
          >
            Restart Experience
          </button>
        </div>
      </body>
    </html>
  );
}
