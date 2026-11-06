'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Monogram } from '../brand/Monogram';
import { useExperienceStore } from '@/stores/experienceStore';

export const Masthead: React.FC = () => {
  const isIntroSettled = useExperienceStore((s) => s.isIntroSettled);
  const hasCompletedIntro = useExperienceStore((s) => s.hasCompletedIntro);
  const isAnimationPaused = useExperienceStore((s) => s.isAnimationPaused);
  const toggleAnimationPaused = useExperienceStore((s) => s.toggleAnimationPaused);
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

      {/* Right Anchor: Direct Navigation and Motion Control */}
      <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <Link
          href="#collection"
          className={`caption-tracked text-[10.5px] sm:text-[10px] py-2 px-2.5 inline-flex items-center min-h-[44px] transition-colors duration-500 rounded-[1px] focus-visible:ring-2 focus-visible:ring-[#c5a869] focus-visible:outline-none ${
            isLightZone
              ? 'text-[#6d6457] hover:text-[#1e1b18]'
              : 'text-[#a89f91] sm:text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          Collection
        </Link>

        <Link
          href="#atelier"
          className={`caption-tracked text-[10.5px] sm:text-[10px] py-2 px-2.5 inline-flex items-center min-h-[44px] transition-colors duration-500 rounded-[1px] focus-visible:ring-2 focus-visible:ring-[#c5a869] focus-visible:outline-none ${
            isLightZone
              ? 'text-[#6d6457] hover:text-[#1e1b18]'
              : 'text-[#a89f91] sm:text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
          }`}
        >
          Atelier
        </Link>

        <Link
          href="#collection-wall"
          className={`caption-tracked text-[10.5px] sm:text-[10px] py-2 px-2.5 inline-flex items-center min-h-[44px] transition-colors duration-500 rounded-[1px] focus-visible:ring-2 focus-visible:ring-[#c5a869] focus-visible:outline-none ${
            isLightZone
              ? 'text-[#8c7443] hover:text-[#1e1b18] font-medium'
              : 'text-[var(--color-accent-zari)] hover:text-[var(--color-text)]'
          }`}
        >
          Archive
        </Link>

        {/* Accessible 3D Animation Pause / Resume Control */}
        <button
          type="button"
          onClick={toggleAnimationPaused}
          aria-pressed={isAnimationPaused}
          aria-label={isAnimationPaused ? 'Resume 3D motion and animations' : 'Pause 3D motion and animations'}
          className={`px-2.5 py-1 min-h-[44px] min-w-[44px] inline-flex items-center justify-center border text-[9px] sm:text-[10px] tracking-[0.16em] uppercase rounded-[1px] transition-colors focus-visible:ring-2 focus-visible:ring-[#c5a869] focus-visible:outline-none cursor-pointer ${
            isAnimationPaused
              ? 'border-[#c5a869] text-[#c5a869] bg-[#c5a869]/15'
              : isLightZone
              ? 'border-[#6d6457]/30 text-[#6d6457] hover:border-[#1e1b18] hover:text-[#1e1b18]'
              : 'border-white/20 text-[#a89f91] hover:border-white/50 hover:text-[#faf7f0]'
          }`}
          title={isAnimationPaused ? 'Resume 3D Motion' : 'Pause 3D Motion'}
        >
          {isAnimationPaused ? '▶ RESUME' : '❚❚ PAUSE'}
        </button>
      </nav>
    </header>
  );
};
