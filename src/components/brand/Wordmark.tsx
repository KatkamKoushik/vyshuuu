import React from 'react';

interface WordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  as?: 'h1' | 'h2' | 'div' | 'span';
}

export const Wordmark: React.FC<WordmarkProps> = ({
  className = '',
  size = 'hero',
  as,
}) => {
  // Editorial sizes mapped cleanly to viewport clamps
  const sizeClasses = {
    sm: 'text-sm tracking-[0.2em]',
    md: 'text-lg md:text-xl tracking-[0.22em]',
    lg: 'text-2xl md:text-4xl tracking-[0.24em]',
    hero: 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.22em]',
  };

  const Component = as || (size === 'hero' ? 'h1' : 'div');

  return (
    <Component
      aria-label="VYSHUUU"
      className={`select-none font-serif uppercase leading-none font-normal whitespace-nowrap inline-block m-0 p-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}
    >
      <span
        className="inline-block whitespace-nowrap transition-transform duration-700 ease-out"
        style={{ whiteSpace: 'nowrap' }}
      >
        VYSHUUU
      </span>
    </Component>
  );
};
