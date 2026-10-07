'use client';

import React from 'react';
import Link from 'next/link';
import { Monogram } from '../brand/Monogram';
import { useExperienceStore } from '@/stores/experienceStore';

export const Masthead: React.FC = () => {
  const isAudioMuted = useExperienceStore((s) => s.isAudioMuted);
  const toggleAudio = useExperienceStore((s) => s.toggleAudio);
  const isIntroSettled = useExperienceStore((s) => s.isIntroSettled);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[50] h-[72px] px-6 md:px-12 flex items-center justify-between transition-opacity duration-1000 ${
        isIntroSettled ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Left Anchor: Monogram */}
      <Link
        href="/"
        className="flex items-center gap-3 group focus-visible:outline-none"
        aria-label="VYSHUUU Home"
      >
        <Monogram className="transition-transform duration-500 group-hover:scale-105" size={26} />
        <span className="caption-tracked text-[10px] text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
          Atelier
        </span>
      </Link>

      {/* Center Anchor: Subtle Masthead Wordmark */}
      <div className="hidden sm:block">
        <span
          className="text-xs uppercase tracking-[0.26em] text-[var(--color-text-muted)] font-serif"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          VYSHUUU
        </span>
      </div>

      {/* Right Anchor: Controls & Direct Navigation */}
      <nav aria-label="Primary" className="flex items-center gap-6 md:gap-8">
        <button
          type="button"
          onClick={toggleAudio}
          className="caption-tracked text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent-zari)] transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none"
          aria-label={isAudioMuted ? 'Unmute soundscape' : 'Mute soundscape'}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
              isAudioMuted ? 'bg-[var(--color-text-muted)] opacity-40' : 'bg-[var(--color-accent-zari)] animate-pulse'
            }`}
          />
          <span className="hidden md:inline">{isAudioMuted ? 'Sound Off' : 'Sound On'}</span>
        </button>

        <Link
          href="#anthology"
          className="caption-tracked text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Anthology
        </Link>

        <Link
          href="#salon"
          className="caption-tracked text-[10px] text-[var(--color-accent-zari)] hover:text-[var(--color-text)] transition-colors"
        >
          Private Salon
        </Link>
      </nav>
    </header>
  );
};
