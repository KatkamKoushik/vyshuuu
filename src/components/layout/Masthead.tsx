'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Monogram } from '../brand/Monogram';
import { useExperienceStore } from '@/stores/experienceStore';

export const Masthead: React.FC = () => {
  const isIntroSettled = useExperienceStore((s) => s.isIntroSettled);
  const hasCompletedIntro = useExperienceStore((s) => s.hasCompletedIntro);
  const [isLightZone, setIsLightZone] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number;
    const updateThemeAndScroll = () => {
      // Check scroll distance past threshold top
      const scrolled = window.scrollY > 48;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));

      const lightEl = document.querySelector('[data-theme="light"]');
      if (!lightEl) {
        setIsLightZone(false);
        return;
      }
      const rect = lightEl.getBoundingClientRect();
      // Masthead height is 72px; check if light corridor covers masthead line (y = 40)
      const inLight = rect.top <= 40 && rect.bottom >= 40;
      setIsLightZone((prev) => (prev !== inLight ? inLight : prev));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateThemeAndScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateThemeAndScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!hasCompletedIntro) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[50] h-[72px] px-6 md:px-12 flex items-center justify-between transition-all duration-700 ${
        isIntroSettled ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${
        isScrolled
          ? isLightZone
            ? 'bg-[#f5f2eb]/80 backdrop-blur-md border-b border-[rgba(78,65,48,0.08)] shadow-[0_10px_30px_rgba(78,65,48,0.04)]'
            : 'bg-[#0b0a09]/75 backdrop-blur-md border-b border-[rgba(197,168,105,0.06)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent shadow-none'
      }`}
    >
      {/* Left Anchor: Monogram */}
      <Link
        href="/"
        className="flex items-center gap-3 group focus-visible:outline-none"
        aria-label="VYSHUUU Home"
      >
        <Monogram
          variant={isLightZone ? 'light' : 'dark'}
          className="transition-transform duration-500 group-hover:scale-105"
          size={26}
        />
        <span
          className={`caption-tracked text-[10px] transition-colors duration-500 hidden sm:inline ${
            isLightZone
              ? 'text-[#6d6457] group-hover:text-[#1e1b18]'
              : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'
          }`}
        >
          Atelier
        </span>
      </Link>

      {/* Center Anchor: Subtle Masthead Wordmark */}
      <div className="hidden md:block">
        <span
          className={`text-xs uppercase tracking-[0.26em] font-serif transition-colors duration-500 ${
            isLightZone ? 'text-[#6d6457]' : 'text-[var(--color-text-muted)]'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          VYSHUUU
        </span>
      </div>

      {/* Right Anchor: Direct Navigation */}
      <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-6 md:gap-8">
        <Link
          href="#collection"
          className={`caption-tracked text-[10.5px] sm:text-[10px] py-2 px-2 -my-2 inline-flex items-center transition-colors duration-500 ${
            isLightZone
              ? 'text-[#6d6457] hover:text-[#1e1b18]'
              : 'text-[#a89f91] sm:text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          Collection
        </Link>

        <Link
          href="#atelier"
          className={`caption-tracked text-[10.5px] sm:text-[10px] py-2 px-2 -my-2 inline-flex items-center transition-colors duration-500 ${
            isLightZone
              ? 'text-[#6d6457] hover:text-[#1e1b18]'
              : 'text-[#a89f91] sm:text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          Atelier
        </Link>

        <Link
          href="#collection-wall"
          className={`caption-tracked text-[10.5px] sm:text-[10px] py-2 px-2 -my-2 inline-flex items-center transition-colors duration-500 ${
            isLightZone
              ? 'text-[#8c7443] hover:text-[#1e1b18] font-medium'
              : 'text-[var(--color-accent-zari)] hover:text-[var(--color-text)]'
          }`}
        >
          Archive
        </Link>
      </nav>
    </header>
  );
};
