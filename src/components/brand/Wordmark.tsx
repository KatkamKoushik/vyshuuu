import React from 'react';

interface WordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const Wordmark: React.FC<WordmarkProps> = ({
  className = '',
  size = 'hero',
}) => {
  // Editorial sizes mapped cleanly to viewport clamps
  const sizeClasses = {
    sm: 'text-sm tracking-[0.2em]',
    md: 'text-lg md:text-xl tracking-[0.22em]',
    lg: 'text-2xl md:text-4xl tracking-[0.24em]',
    hero: 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.22em]',
  };

  return (
    <div
      aria-label="VYSHUUU"
      className={`select-none font-serif uppercase leading-none font-normal ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      <span className="inline-block transition-transform duration-700 ease-out">
        V&thinsp;Y&thinsp;S&thinsp;H&ensp;U&thinsp;U&thinsp;U
      </span>
    </div>
  );
};
