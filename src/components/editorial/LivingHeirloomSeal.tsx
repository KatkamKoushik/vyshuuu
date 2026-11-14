'use client';

import React, { useState, useRef, useEffect } from 'react';
import { audioEngine } from '@/lib/audio/webAudioEngine';
import { useExperienceStore } from '@/stores/experienceStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * LivingHeirloomSeal — The Monumental Interactive Gold Custody Seal
 *
 * Implements:
 * - 3D pointer tilt physics with viscous spring inertia
 * - Dynamic specular reflection and raking light glint tracking pointer orientation
 * - Emits sacred 108Hz harmonic resonance through procedural webAudioEngine upon hover or click/tap
 * - Interactive audio awakening upon click/tap (supports mobile & unmuted state transitions)
 * - Concentric engraved circular archival typography with mathematical circumference alignment
 * - Fully accessible with keyboard activation (Enter/Space) and ARIA attributes
 */
export const LivingHeirloomSeal: React.FC = () => {
  const isReducedMotion = usePrefersReducedMotion();
  const isAudioMuted = useExperienceStore((s) => s.isAudioMuted);
  const setAudioMuted = useExperienceStore((s) => s.setAudioMuted);

  const [isHovered, setIsHovered] = useState(false);
  const [isResonating, setIsResonating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const resonanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Physics state
  const tiltRef = useRef({
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    specularX: 50,
    specularY: 50,
  });

  useEffect(() => {
    return () => {
      if (resonanceTimerRef.current) {
        clearTimeout(resonanceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    let rafId: number;

    const animate = () => {
      const t = tiltRef.current;

      // Smooth viscous spring interpolation
      t.currentTiltX += (t.targetTiltX - t.currentTiltX) * 0.14;
      t.currentTiltY += (t.targetTiltY - t.currentTiltY) * 0.14;

      if (sealRef.current) {
        sealRef.current.style.transform = `rotateX(${t.currentTiltX.toFixed(2)}deg) rotateY(${t.currentTiltY.toFixed(2)}deg)`;
      }

      if (specularRef.current) {
        specularRef.current.style.background = `radial-gradient(circle 120px at ${t.specularX.toFixed(1)}% ${t.specularY.toFixed(1)}%, rgba(255, 255, 255, 0.48) 0%, rgba(212, 185, 128, 0.22) 32%, transparent 72%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isReducedMotion]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || isReducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    const clampedX = Math.max(-1, Math.min(1, normalizedX));
    const clampedY = Math.max(-1, Math.min(1, normalizedY));

    // Dynamic 3D tilt angles (max ~18 degrees)
    tiltRef.current.targetTiltX = clampedY * -18;
    tiltRef.current.targetTiltY = clampedX * 18;

    // Specular highlight tracks light reflection
    tiltRef.current.specularX = 50 + clampedX * 42;
    tiltRef.current.specularY = 50 + clampedY * 42;
  };

  const triggerResonance = (intensity = 0.65) => {
    setIsResonating(true);

    try {
      audioEngine.triggerHeirloomResonance(intensity);
    } catch {
      // Audio safety
    }

    if (resonanceTimerRef.current) {
      clearTimeout(resonanceTimerRef.current);
    }

    resonanceTimerRef.current = setTimeout(() => {
      setIsResonating(false);
    }, 2800);
  };

  const onPointerEnter = () => {
    setIsHovered(true);
    // If audio is active, hover triggers sacred Web Audio procedural resonance
    if (!isAudioMuted) {
      triggerResonance(0.65);
    }
  };

  const onPointerLeave = () => {
    setIsHovered(false);
    tiltRef.current.targetTiltX = 0;
    tiltRef.current.targetTiltY = 0;
    tiltRef.current.specularX = 50;
    tiltRef.current.specularY = 50;
  };

  const handleClick = () => {
    // If audio is muted, clicking the seal awakens the sound scenography
    if (isAudioMuted) {
      setAudioMuted(false);
      audioEngine.setMuted(false);
    }
    triggerResonance(0.85);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none py-10 my-4">
      {/* Micro Archival Seal Stamp Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869] animate-pulse" />
        <span className="mono-spec text-[9px] sm:text-[10px] text-[#c5a869] tracking-[0.32em] uppercase block">
          [ THE LIVING HEIRLOOM SEAL &middot; NO. VYSH-2025-06Y ]
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a869] animate-pulse" />
      </div>

      {/* 3D Perspective Canvas Container */}
      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-label="The Living Heirloom Seal — Interact to awaken sacred 108Hz harmonic resonance"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        data-magnetic
        data-magnetic-label="HEIRLOOM SEAL"
        data-seal-interactive="true"
        className="relative w-44 h-44 sm:w-52 sm:h-52 cursor-pointer transition-transform duration-500 ease-out flex items-center justify-center [perspective:1000px] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a869] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050404] rounded-full"
        title="Living Heirloom Seal — Click or hover to commune with the continuum"
      >
        {/* Soft Ambient Gold Halo / Resonance Pulse */}
        <div
          className={`absolute -inset-6 rounded-full transition-all duration-1000 pointer-events-none ${
            isResonating
              ? 'bg-[#c5a869]/25 blur-2xl scale-110 opacity-100'
              : isHovered
              ? 'bg-[#c5a869]/15 blur-xl scale-105 opacity-80'
              : 'bg-[#c5a869]/05 blur-lg scale-95 opacity-40'
          }`}
        />

        {/* Dynamic Multi-Layered Rotating Gold Medallion */}
        <div
          ref={sealRef}
          className="relative w-full h-full rounded-full [transform-style:preserve-3d] transition-shadow duration-500 will-change-transform"
          style={{
            boxShadow: isHovered
              ? '0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(197,168,105,0.35)'
              : '0 20px 45px rgba(0,0,0,0.9), 0 0 15px rgba(197,168,105,0.12)',
          }}
        >
          {/* Base Heavy Obsidian/Gold Metallic Medallion Plinth */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1c1813] via-[#0d0c0a] to-[#080706] border-2 border-[#c5a869]/60 shadow-[inset_0_3px_12px_rgba(0,0,0,0.9)] overflow-hidden" />

          {/* Guilloché Coin-Edge Serrations (Radial Beaded Ring) */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#faf7f0" />
                <stop offset="25%" stopColor="#d4b980" />
                <stop offset="60%" stopColor="#c5a869" />
                <stop offset="85%" stopColor="#8a7342" />
                <stop offset="100%" stopColor="#c5a869" />
              </linearGradient>

              {/* Circular Path for Engraved Typography (Radius: 73px, Circumference: ~458.7px) */}
              <path
                id="textPathOuter"
                d="M 100, 100 m -73, 0 a 73,73 0 1,1 146,0 a 73,73 0 1,1 -146,0"
              />
            </defs>

            {/* 64 Radial Guilloché Bevel Ticks */}
            {Array.from({ length: 64 }).map((_, i) => {
              const angle = (i * 360) / 64;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="3"
                  x2="100"
                  y2={i % 8 === 0 ? '9' : '6'}
                  stroke="url(#goldGradient)"
                  strokeWidth={i % 8 === 0 ? '1.5' : '0.8'}
                  strokeOpacity={i % 8 === 0 ? '0.9' : '0.5'}
                  transform={`rotate(${angle} 100 100)`}
                />
              );
            })}

            {/* Outer Concentric Hairline Rings */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="url(#goldGradient)" strokeWidth="0.8" strokeOpacity="0.7" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="url(#goldGradient)" strokeWidth="1.2" strokeOpacity="0.8" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeOpacity="0.75" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="url(#goldGradient)" strokeWidth="0.6" strokeDasharray="2 3" strokeOpacity="0.6" />

            {/* Circular Archival Engraved Inscription with lengthAdjust for perfect 360° circumscription */}
            <text
              fill="#faf7f0"
              fontSize="7.2"
              fontFamily="var(--font-space-mono), monospace"
              letterSpacing="0.24em"
              className="uppercase tracking-[0.24em]"
              opacity="0.88"
            >
              <textPath
                href="#textPathOuter"
                startOffset="0%"
                textLength="458"
                lengthAdjust="spacing"
              >
                VYSHUUU &middot; THE UNSTITCHED CONTINUUM &middot; SIX YARDS UNBROKEN &middot; ARCHIVAL SEAL &middot;
              </textPath>
            </text>

            {/* Sacred Interlocking Weave Geometry (Diamond Loom Sigil) */}
            <g transform="translate(100, 100) scale(0.92)">
              {/* Diamond Weave Intersecting Lattice */}
              <polygon
                points="0,-42 42,0 0,42 -42,0"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="1.2"
                strokeOpacity="0.85"
              />
              <polygon
                points="0,-34 34,0 0,34 -34,0"
                fill="rgba(197, 168, 105, 0.08)"
                stroke="url(#goldGradient)"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                strokeOpacity="0.65"
              />

              {/* Master Monogram "V" & Continuous Unbroken Silk Loop */}
              {/* Left Wing */}
              <path
                d="M -22 -22 L 0 24 L 22 -22"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner Loop Knot */}
              <path
                d="M -12 -6 Q 0 14 12 -6 Q 0 -18 -12 -6 Z"
                fill="none"
                stroke="#faf7f0"
                strokeWidth="1.2"
                strokeOpacity="0.9"
              />
              {/* Central Glowing Gold Micro-Core */}
              <circle cx="0" cy="0" r="3" fill="#faf7f0" />
              <circle cx="0" cy="0" r="1.5" fill="#0b0a09" />

              {/* Lower Archival Inscription */}
              <text
                x="0"
                y="30"
                textAnchor="middle"
                fill="#c5a869"
                fontSize="6"
                fontFamily="var(--font-space-mono), monospace"
                letterSpacing="0.22em"
              >
                MMXXV &middot; 06Y
              </text>
            </g>
          </svg>

          {/* Dynamic Specular Highlight & Metallic Grazing Reflection */}
          <div
            ref={specularRef}
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(circle 120px at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(212, 185, 128, 0.2) 32%, transparent 72%)',
              opacity: isHovered ? 1 : 0.6,
            }}
          />

          {/* Anisotropic Radial Sheen Overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background:
                'conic-gradient(from 45deg at 50% 50%, rgba(255,255,255,0.4) 0deg, transparent 60deg, rgba(255,255,255,0.3) 120deg, transparent 180deg, rgba(255,255,255,0.4) 240deg, transparent 300deg, rgba(255,255,255,0.3) 360deg)',
            }}
          />
        </div>
      </div>

      {/* Living Heirloom Seal Status Docket */}
      <div className="mt-5 text-center space-y-1 pointer-events-none">
        <div className="flex items-center justify-center gap-2 mono-spec text-[8.5px] sm:text-[9.5px]">
          <span className="text-[#8a7f6e] tracking-[0.24em] uppercase">STATUS:</span>
          <span
            className={`tracking-[0.2em] font-medium transition-colors duration-500 uppercase ${
              isResonating
                ? 'text-[#faf7f0] font-bold'
                : isHovered
                ? 'text-[#c5a869]'
                : isAudioMuted
                ? 'text-[#c5a869]/80'
                : 'text-[#8a7f6e]'
            }`}
          >
            {isResonating
              ? '[ HARMONIC RESONANCE 108Hz · CUSTODY SEALED ]'
              : isHovered
              ? '[ SPECULAR REFLECTION · TILT ACTIVE ]'
              : isAudioMuted
              ? '[ CLICK OR TAP TO AWAKEN SACRED 108Hz HARMONIC RESONANCE ]'
              : '[ HOVER OR CLICK TO COMMUNE WITH THE CONTINUUM ]'}
          </span>
        </div>

        <p className="text-[10px] text-[#8a7f6e]/70 font-light italic max-w-xs mx-auto">
          Six yards unbroken. Preserved in digital amber.
        </p>
      </div>
    </div>
  );
};
