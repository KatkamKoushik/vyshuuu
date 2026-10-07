import React from 'react';

interface MonogramProps {
  className?: string;
  size?: number;
}

export const Monogram: React.FC<MonogramProps> = ({
  className = '',
  size = 28,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="VYSHUUU Monogram"
      role="img"
    >
      {/* Structural Crosshair Hairlines */}
      <line x1="16" y1="2" x2="16" y2="30" stroke="var(--color-border)" strokeWidth="0.75" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="var(--color-border)" strokeWidth="0.75" />

      {/* Letterform Glyphs */}
      <text
        x="9"
        y="14"
        fill="var(--color-accent-zari)"
        fontSize="9"
        fontFamily="var(--font-display)"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        V
      </text>
      <text
        x="23"
        y="21"
        fill="var(--color-text)"
        fontSize="9"
        fontFamily="var(--font-display)"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Y
      </text>
    </svg>
  );
};
