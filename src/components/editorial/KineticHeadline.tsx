'use client';

import React, { useRef, useEffect, useState } from 'react';

export interface KineticHeadlineProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  children: string;
  className?: string;
  staggerMs?: number;
  threshold?: number;
  delayMs?: number;
}

/**
 * KineticHeadline // Santioni Spirits XText Split-Word Architecture
 * 
 * Features:
 * 1. Masks each word in an overflow-hidden bounding box.
 * 2. Words animate in using Santioni's signature ease: cubic-bezier(0.215, 0.61, 0.355, 1).
 * 3. Complete Accessibility Parity: Full text provided to screen readers in an un-split
 *    sr-only element, while visual animated tokens are marked aria-hidden="true".
 * 4. Zero layout shifts / zero reflows.
 */
export const KineticHeadline: React.FC<KineticHeadlineProps> = ({
  as: Component = 'h2',
  children,
  className = '',
  staggerMs = 65,
  threshold = 0.2,
  delayMs = 0,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const words = children.split(' ');

  return (
    <Component className={`relative inline-block ${className}`}>
      {/* 1. Screen Reader Un-Split Accessibility Mirror & Intersection Anchor */}
      <span ref={containerRef} className="sr-only">
        {children}
      </span>

      {/* 2. Visual Split-Word Kinetic Presentation */}
      <span aria-hidden="true" className="flex flex-wrap items-baseline">
        {words.map((word, idx) => (
          <span
            key={idx}
            className="inline-block overflow-hidden mr-[0.28em] py-0.5"
          >
            <span
              className="inline-block transition-transform duration-[1100ms] will-change-transform"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
                transitionDelay: `${delayMs + idx * staggerMs}ms`,
                transform: isVisible
                  ? 'translate3d(0, 0, 0)'
                  : 'translate3d(0, 108%, 0)',
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </Component>
  );
};
