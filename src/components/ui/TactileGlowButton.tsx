'use client';

import React, { useRef, useState, useCallback } from 'react';
import { audioEngine } from '@/lib/audio/webAudioEngine';

export interface TactileGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'zari';
  size?: 'sm' | 'md' | 'lg';
  soundTone?: 'yaman' | 'shuttle' | 'reed' | 'none';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * TactileGlowButton // Noomo-Valentime Micro-Physics Implementation
 * 
 * Features:
 * 1. Elastic non-scaling SVG border rect: scales from (0.96, 0.85) to (1.0, 1.0) on hover.
 * 2. Real-time cursor coordinate tracking (--x, --y) driving internal specular refraction spotlight.
 * 3. Analog woven noise texture burn (mix-blend-mode: color-burn / overlay).
 * 4. Dual-chromatic ambient diffusion gel shadow: Antique Zari Gold + Sindoor Crimson.
 * 5. Procedural Web Audio haptics on hover and press.
 */
export const TactileGlowButton: React.FC<TactileGlowButtonProps> = ({
  variant = 'primary',
  size = 'md',
  soundTone = 'yaman',
  children,
  icon,
  className = '',
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  onClick,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      buttonRef.current.style.setProperty('--x', `${x}%`);
      buttonRef.current.style.setProperty('--y', `${y}%`);

      if (onPointerMove) onPointerMove(e);
    },
    [onPointerMove]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      if (buttonRef.current) {
        buttonRef.current.style.setProperty('--s', '1');
      }

      if (soundTone === 'yaman') {
        audioEngine.triggerYamanZariChime(undefined, 0.28);
      } else if (soundTone === 'shuttle') {
        audioEngine.triggerHandloomShuttle('shuttle', 0.22);
      }

      if (onPointerEnter) onPointerEnter(e);
    },
    [soundTone, onPointerEnter]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      if (buttonRef.current) {
        buttonRef.current.style.setProperty('--s', '0');
      }
      if (onPointerLeave) onPointerLeave(e);
    },
    [onPointerLeave]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundTone !== 'none') {
        audioEngine.triggerHandloomShuttle('reed', 0.42);
      }
      if (onClick) onClick(e);
    },
    [soundTone, onClick]
  );

  // Variant Styling Matrix
  const variantStyles = {
    primary:
      'bg-[#0c0b09] text-[#e8e4dc] border-transparent shadow-[0_4px_14px_rgba(0,0,0,0.6),24px_-18px_140px_rgba(197,168,105,0.22),-20px_20px_120px_rgba(180,40,40,0.18)]',
    secondary:
      'bg-[rgba(255,255,255,0.06)] text-[#e8e4dc] backdrop-blur-[12px] border-transparent hover:bg-[rgba(255,255,255,0.12)]',
    ghost:
      'bg-transparent text-[#e8e4dc]/85 hover:text-[#e8e4dc] border-transparent',
    zari:
      'bg-gradient-to-r from-[#c5a869]/25 via-[#e2c98a]/20 to-[#c5a869]/25 text-[#fbf8f0] border-transparent shadow-[0_4px_20px_rgba(197,168,105,0.3)]',
  }[variant];

  // Size Specifications
  const sizeStyles = {
    sm: 'h-[34px] px-3.5 text-[10px] tracking-[0.22em]',
    md: 'h-[44px] px-6 text-[11.5px] tracking-[0.24em]',
    lg: 'h-[52px] px-8 text-[13px] tracking-[0.28em]',
  }[size];

  return (
    <button
      ref={buttonRef}
      className={`group relative inline-flex items-center justify-center font-mono uppercase select-none cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a869] active:scale-[0.98] ${sizeStyles} ${variantStyles} ${className}`}
      style={
        {
          '--x': '50%',
          '--y': '50%',
          '--s': '0',
        } as React.CSSProperties
      }
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      {...rest}
    >
      {/* 1. Elastic Non-Scaling SVG Border Envelope */}
      <svg
        className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] pointer-events-none overflow-visible z-10 transition-transform duration-450 ease-[cubic-bezier(0.77,0,0.18,1)]"
        style={{
          transform: isHovered ? 'scale(1, 1)' : 'scale(0.96, 0.85)',
        }}
      >
        <rect
          x="3"
          y="3"
          width="calc(100% - 6px)"
          height="calc(100% - 6px)"
          fill="none"
          stroke={
            variant === 'zari'
              ? 'rgba(226, 201, 138, 0.75)'
              : isHovered
              ? 'rgba(197, 168, 105, 0.65)'
              : 'rgba(197, 168, 105, 0.22)'
          }
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          className="transition-colors duration-400"
        />
      </svg>

      {/* 2. Analog Woven Noise Texture Overlay (mix-blend-mode: overlay) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay rounded-[1px] bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.35'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
        }}
      />

      {/* 3. Inset Dynamic Cursor Specular Glow (Refraction Spotlight) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1px]"
        aria-hidden="true"
      >
        <div
          className="absolute w-20 h-10 -top-2 -left-4 rounded-full blur-[18px] pointer-events-none transition-opacity duration-300"
          style={{
            background:
              variant === 'zari'
                ? 'radial-gradient(circle, rgba(255, 235, 175, 0.7) 0%, rgba(197, 168, 105, 0) 70%)'
                : 'radial-gradient(circle, rgba(226, 201, 138, 0.5) 0%, rgba(197, 168, 105, 0) 70%)',
            transform:
              'translate3d(calc(var(--x, 50%) - 50%), calc(var(--y, 50%) - 50%), 0)',
            opacity: 'var(--s, 0)',
          }}
        />
      </div>

      {/* 4. Ambient Dual-Corner Glow Blooms (Noomo Signature ::before / ::after) */}
      <div
        className="absolute -top-1 -left-1 w-6 h-4 rounded-full blur-[14px] bg-[#c5a869] pointer-events-none transition-all duration-400 ease-out"
        style={{
          opacity: isHovered ? 0.45 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(0)',
          mixBlendMode: 'plus-lighter',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-1 -right-1 w-8 h-4 rounded-full blur-[16px] bg-[#b83b3b] pointer-events-none transition-all duration-400 ease-out"
        style={{
          opacity: isHovered ? 0.35 : 0,
          transform: isHovered ? 'scale(1)' : 'scale(0)',
          mixBlendMode: 'plus-lighter',
        }}
        aria-hidden="true"
      />

      {/* 5. Content Label & Micro-Icon */}
      <span className="relative z-20 flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-0.5">
        {icon && <span className="opacity-80 group-hover:opacity-100 transition-opacity">{icon}</span>}
        <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{children}</span>
      </span>
    </button>
  );
};
