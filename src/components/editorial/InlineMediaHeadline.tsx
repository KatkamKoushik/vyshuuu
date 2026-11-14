'use client';

import React, { useEffect, useRef, useState } from 'react';

interface InlineMediaHeadlineProps {
  prefix: string;
  mediaSrc: string;
  mediaAlt: string;
  suffix: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
  badgeLabel?: string;
  pillText?: string;
  mediaType?: 'image' | 'video' | 'auto';
}

export const InlineMediaHeadline: React.FC<InlineMediaHeadlineProps> = ({
  prefix,
  mediaSrc,
  mediaAlt,
  suffix,
  tag = 'h2',
  className = '',
  badgeLabel = 'SILK // MACRO',
  pillText = 'silk',
  mediaType = 'auto',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = tag;
  const isVideo =
    mediaType === 'video' ||
    (mediaType === 'auto' && (mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.webm')));

  return (
    <div ref={containerRef} className="relative overflow-hidden select-none block max-w-full">
      <Tag
        className={`font-serif tracking-[0.03em] leading-[1.04] uppercase text-[var(--color-text)] inline-flex flex-wrap items-baseline transition-transform duration-1000 ease-[var(--ease-silk)] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[115%] opacity-0'
          } ${className}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span>{prefix}</span>

        {/* Haute Couture Inline Media Punctuation Capsule (embedded at type height between monumental words: e.g. "THE [▶ silk] CONTINUUM") */}
        <span
          className="inline-flex items-center align-middle mx-[0.24em] relative top-[-0.08em] group cursor-pointer"
          title={badgeLabel}
        >
          <span className="relative inline-block h-[0.74em] w-[1.75em] sm:w-[2.1em] overflow-hidden rounded-[1px] border border-[var(--color-accent-zari)]/50 bg-[#12100e] shadow-[0_4px_16px_rgba(0,0,0,0.7)] align-middle transition-transform duration-500 group-hover:scale-105 ring-1 ring-[var(--color-accent-zari)]/20">
            {isVideo ? (
              <video
                src={mediaSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter brightness-[1.05] contrast-[1.12] transition-transform duration-700 group-hover:scale-115"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={mediaSrc}
                alt={mediaAlt}
                className="w-full h-full object-cover filter brightness-[1.05] contrast-[1.12] transition-transform duration-700 group-hover:scale-115"
                loading="lazy"
              />
            )}

            {/* Ambient Raking Specular Sheen */}
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Micro Haute Couture Telemetry Pill (e.g. "[▶ silk]") */}
            <span className="absolute bottom-[1.5px] left-[2.5px] mono-spec text-[6.5px] sm:text-[7.5px] text-[var(--color-accent-zari)] flex items-center gap-[2px] leading-none opacity-95 tracking-tight font-mono bg-black/60 px-[2px] py-[1px] rounded-[1px] backdrop-blur-[1px] border border-[var(--color-accent-zari)]/30">
              <span className="text-[5.5px]">▶</span> {pillText}
            </span>

            {/* Micro Gold Filament Indicator Dot */}
            <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[var(--color-accent-zari)] animate-pulse" />
          </span>
        </span>

        <span>{suffix}</span>
      </Tag>
    </div>
  );
};
