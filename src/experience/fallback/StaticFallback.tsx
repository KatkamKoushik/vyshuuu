import React from 'react';

export const StaticFallback: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none flex items-center justify-center overflow-hidden bg-[var(--color-bg)]"
    >
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
