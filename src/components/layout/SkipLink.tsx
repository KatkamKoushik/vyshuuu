import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-surface)] focus:text-[var(--color-accent-zari)] focus:border focus:border-[var(--color-border)] focus:text-xs focus:uppercase focus:tracking-widest"
    >
      Skip to main content
    </a>
  );
};
