'use client';

import React from 'react';
import { useExperienceStore } from '@/stores/experienceStore';
import { audioEngine } from '@/lib/audio/webAudioEngine';

interface SoundWaveToggleProps {
  className?: string;
  isLightZone?: boolean;
}

export const SoundWaveToggle: React.FC<SoundWaveToggleProps> = ({
  className = '',
  isLightZone = false,
}) => {
  const isAudioMuted = useExperienceStore((s) => s.isAudioMuted);
  const setAudioMuted = useExperienceStore((s) => s.setAudioMuted);

  const handleToggle = () => {
    const nextMuted = !isAudioMuted;
    setAudioMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
    if (!nextMuted) {
      audioEngine.triggerYamanZariChime(0, 0.45);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isAudioMuted}
      aria-label={isAudioMuted ? 'Unmute procedural sound scenography' : 'Mute procedural sound scenography'}
      onClick={handleToggle}
      data-magnetic
      data-magnetic-label="AUDIO"
      className={`group relative inline-flex items-center gap-2 py-1.5 px-2.5 rounded-[1px] transition-all duration-300 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent-zari)] ${
        isLightZone
          ? 'text-[#6d6457] hover:text-[#1e1b18] hover:bg-[#1e1b18]/5'
          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5'
      } ${className}`}
    >
      {/* Animated Sound Wave Bars */}
      <span className="flex items-end gap-[2px] h-3.5 w-3.5 justify-center py-[1px]" aria-hidden="true">
        <span
          className={`w-[1.5px] rounded-full transition-all ${
            isAudioMuted
              ? 'h-1 bg-current opacity-40'
              : 'bg-[var(--color-accent-zari)] animate-[waveBar1_1.2s_ease-in-out_infinite]'
          }`}
        />
        <span
          className={`w-[1.5px] rounded-full transition-all ${
            isAudioMuted
              ? 'h-1.5 bg-current opacity-40'
              : 'bg-[var(--color-accent-zari)] animate-[waveBar2_0.9s_ease-in-out_infinite_0.15s]'
          }`}
        />
        <span
          className={`w-[1.5px] rounded-full transition-all ${
            isAudioMuted
              ? 'h-1 bg-current opacity-40'
              : 'bg-[var(--color-accent-zari)] animate-[waveBar3_1.4s_ease-in-out_infinite_0.3s]'
          }`}
        />
        <span
          className={`w-[1.5px] rounded-full transition-all ${
            isAudioMuted
              ? 'h-2 bg-current opacity-40'
              : 'bg-[var(--color-accent-zari)] animate-[waveBar4_1.0s_ease-in-out_infinite_0.05s]'
          }`}
        />
      </span>

      {/* Telemetry Label */}
      <span className="mono-spec text-[9px] tracking-[0.16em] uppercase hidden sm:inline">
        {isAudioMuted ? 'SOUND // OFF' : 'SOUND // LIVE'}
      </span>
    </button>
  );
};
