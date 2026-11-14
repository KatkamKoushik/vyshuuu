'use client';

import React from 'react';

export interface OrganicBoundaryDividerProps {
  variant?: 'crest' | 'dip' | 'subtle';
  className?: string;
  strokeColor?: string;
}

/**
 * OrganicBoundaryDivider // Santioni Spirits Non-Scaling Stroke Boundary
 * 
 * Replaces sharp DOM cuts with breathing, organic handloom curves.
 * Features:
 * - Uses vector-effect="non-scaling-stroke" so 1px/1.5px lines never distort on scale.
 * - Dynamic SVG cubic bezier contour simulating the natural sag of draped silk.
 */
export const OrganicBoundaryDivider: React.FC<OrganicBoundaryDividerProps> = ({
  variant = 'crest',
  className = '',
  strokeColor = 'rgba(197, 168, 105, 0.28)',
}) => {
  const pathD = {
    crest: 'M0,40 Q360,10 720,40 T1440,40',
    dip: 'M0,15 Q360,65 720,15 T1440,15',
    subtle: 'M0,25 Q720,45 1440,25',
  }[variant];

  return (
    <div
      className={`relative w-full h-[50px] overflow-visible pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        {/* Soft Ambient Diffusion Glow */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          vectorEffect="non-scaling-stroke"
          className="opacity-20 blur-[3px]"
        />
        {/* Crisp Hairline Contour */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          className="opacity-80"
        />
      </svg>
    </div>
  );
};
