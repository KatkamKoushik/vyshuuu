'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SareeConcept, SareeAssetMeta } from '@/lib/collection/collectionData';
import { getAtmosphere } from '@/lib/atmosphere/collectionAtmospheres';
import { useExperienceStore } from '@/stores/experienceStore';

interface CompactArchiveWorldProps {
  saree: SareeConcept;
  index: number;
  totalWorlds: number;
  prevBgColor?: string;
  nextBgColor?: string;
  onExamine: (saree: SareeConcept, assetKey?: string) => void;
}

interface PlateItem {
  key: string;
  asset: SareeAssetMeta;
  number: string;
}

/**
 * World Personality Profile
 * Configures distinct spatial, lighting, and textural properties for each textile room.
 */
interface WorldPersonality {
  spatialStyle: 'bronze-chamber' | 'silver-sanctum' | 'copper-hall' | 'mist-gallery' | 'khat-studio' | 'tussar-lodge' | 'palladium-vault' | 'madder-sanctuary';
  beamAngle: string;
  gridOverlay?: boolean;
  textureWatermark?: string;
  headerAlignment: 'left' | 'asymmetric-split' | 'centered';
  leadPlateAspect: 'aspect-[3/4]' | 'aspect-[4/5]' | 'aspect-[1/1]';
}

function getWorldPersonality(sareeId: string): WorldPersonality {
  switch (sareeId) {
    case 'vysh-kjv-01': // Obsidian Korvai
      return {
        spatialStyle: 'bronze-chamber',
        beamAngle: '120% 75% at 85% 10%',
        headerAlignment: 'asymmetric-split',
        leadPlateAspect: 'aspect-[4/5]',
        textureWatermark: 'KORVAI // 9-INCH STEPPED SPIRES',
      };
    case 'vysh-bnr-01': // Shikar Gah in Shadow
      return {
        spatialStyle: 'silver-sanctum',
        beamAngle: '100% 60% at 15% 15%',
        headerAlignment: 'left',
        leadPlateAspect: 'aspect-[3/4]',
        textureWatermark: 'KINKHWAB // HUNTING SCROLL RESERVE',
      };
    case 'vysh-pth-01': // Tapestry Dusk
      return {
        spatialStyle: 'copper-hall',
        beamAngle: '110% 70% at 50% 20%',
        headerAlignment: 'centered',
        leadPlateAspect: 'aspect-[4/5]',
        textureWatermark: 'PAITHANI // DHOOP-CHHAON TAPESTRY',
      };
    case 'vysh-jmd-01': // Vapor Inlay
      return {
        spatialStyle: 'mist-gallery',
        beamAngle: '140% 100% at 50% 5%',
        headerAlignment: 'asymmetric-split',
        leadPlateAspect: 'aspect-[3/4]',
        textureWatermark: 'JAMDANI // SUSPENDED VAPOR WEFT',
      };
    case 'vysh-kta-01': // Obsidian Khat Grid
      return {
        spatialStyle: 'khat-studio',
        beamAngle: '90% 70% at 75% 25%',
        gridOverlay: true,
        headerAlignment: 'left',
        leadPlateAspect: 'aspect-[1/1]',
        textureWatermark: 'KHAT // STRUCTURAL ORTHOGONAL CORD',
      };
    case 'vysh-tsr-01': // Raw Honeycomb Slub
      return {
        spatialStyle: 'tussar-lodge',
        beamAngle: '115% 85% at 25% 15%',
        headerAlignment: 'asymmetric-split',
        leadPlateAspect: 'aspect-[4/5]',
        textureWatermark: 'GICHA // WILD TUSSAR SLUB FIBER',
      };
    case 'vysh-ctr-01': // Liquid Metal Continuum
      return {
        spatialStyle: 'palladium-vault',
        beamAngle: '105% 65% at 80% 20%',
        headerAlignment: 'left',
        leadPlateAspect: 'aspect-[3/4]',
        textureWatermark: 'CONTINUUM // MICRO-WIRE ORIGAMI',
      };
    case 'vysh-kjv-02': // Madder Petni
    default:
      return {
        spatialStyle: 'madder-sanctuary',
        beamAngle: '130% 90% at 50% 15%',
        headerAlignment: 'centered',
        leadPlateAspect: 'aspect-[4/5]',
        textureWatermark: 'RUBIA MADDER // TIERED TEMPLE INTERLOCK',
      };
  }
}

export const CompactArchiveWorld: React.FC<CompactArchiveWorldProps> = ({
  saree,
  index,
  totalWorlds,
  prevBgColor,
  nextBgColor,
  onExamine,
}) => {
  const isReducedMotion = useExperienceStore((s) => s.isReducedMotion);
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Retrieve curated atmosphere & personality
  const atmosphere = useMemo(() => getAtmosphere(saree.id), [saree.id]);
  const personality = useMemo(() => getWorldPersonality(saree.id), [saree.id]);

  // Extract all available plates
  const plates: PlateItem[] = useMemo(() => {
    const list: PlateItem[] = [];
    const order = ['hero', 'flat', 'fold', 'pleat', 'border', 'pallu', 'macro', 'editorial', 'edge'];
    let count = 1;
    for (const key of order) {
      const asset = saree.assets[key as keyof typeof saree.assets];
      if (asset) {
        list.push({
          key,
          asset,
          number: String(count).padStart(2, '0'),
        });
        count++;
      }
    }
    return list;
  }, [saree]);

  // Viewport detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // IntersectionObserver: Pause movement when outside viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ============================================================================
  // CONTINUOUS CINEMATIC GLIDING ENGINE
  // Smoothly advances the horizontal film strip across the lit chamber frame.
  // Independent progression: enters viewport -> begins drifting -> pauses on exit
  // ============================================================================
  const [pixelOffset, setPixelOffset] = useState(0);
  const [maxScrollWidth, setMaxScrollWidth] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pauseUntilRef = useRef<number>(0);

  // Tactile touch & drag physics (DRAG = TOUCH, REST = BREATHING)
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = pixelOffset;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    setIsPointerDown(true);
    // Pause auto-drift during direct contact
    pauseUntilRef.current = performance.now() + 60000;
  }, [pixelOffset]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 4) {
      hasDraggedRef.current = true;
    }
    const now = performance.now();
    const dt = Math.max(1, now - lastDragTimeRef.current);
    const stepDx = e.clientX - lastDragXRef.current;
    dragVelocityRef.current = stepDx / dt;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = now;

    const target = dragStartOffsetRef.current - dx;
    setPixelOffset(Math.max(0, Math.min(maxScrollWidth, target)));
  }, [maxScrollWidth]);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsPointerDown(false);

    // Overdamped silk settling momentum release
    const releaseVelocity = dragVelocityRef.current;
    if (Math.abs(releaseVelocity) > 0.12) {
      const momentumDist = releaseVelocity * 300;
      setPixelOffset((prev) => Math.max(0, Math.min(maxScrollWidth, prev - momentumDist)));
    }

    // Material settles into stillness before gentle drift resumes
    pauseUntilRef.current = performance.now() + 2400;
  }, [maxScrollWidth]);

  // Measure track scroll bounds
  const updateScrollBounds = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const scrollWidth = trackRef.current.scrollWidth;
    const clientWidth = containerRef.current.clientWidth;
    const max = Math.max(0, scrollWidth - clientWidth + 60);
    setMaxScrollWidth(max);
  }, []);

  useEffect(() => {
    updateScrollBounds();
    window.addEventListener('resize', updateScrollBounds);
    return () => window.removeEventListener('resize', updateScrollBounds);
  }, [updateScrollBounds, plates]);

  useEffect(() => {
    if (isReducedMotion || !isVisible || isHovered || maxScrollWidth <= 0) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const baseDriftSpeed = isMobile ? 14 : 20; // Editorial fashion-film pacing

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000.0;
      lastTimeRef.current = time;

      // Handle pause when user hovers or drags
      if (time < pauseUntilRef.current || isDraggingRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      setPixelOffset((prev) => {
        const next = prev + baseDriftSpeed * delta;
        if (next >= maxScrollWidth) {
          return maxScrollWidth;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    };
  }, [isVisible, isHovered, maxScrollWidth, isReducedMotion, isMobile]);

  const metallicAccent = atmosphere.palette.accent;
  const currentBg = atmosphere.palette.background;
  const topBlendBg = prevBgColor || currentBg;
  const bottomBlendBg = nextBgColor || currentBg;

  // Curated spatial background styles
  const backgroundStyle = useMemo(() => {
    const baseGradient = `linear-gradient(180deg, ${topBlendBg} 0%, ${currentBg} 14%, ${currentBg} 86%, ${bottomBlendBg} 100%)`;
    const radialChiaroscuro = `radial-gradient(${personality.beamAngle}, ${atmosphere.palette.accentSubtle} 0%, transparent 68%)`;

    return {
      background: `${radialChiaroscuro}, ${baseGradient}`,
    };
  }, [topBlendBg, currentBg, bottomBlendBg, personality.beamAngle, atmosphere.palette.accentSubtle]);

  return (
    <article
      ref={containerRef}
      aria-label={`Textile World ${saree.number}: ${saree.name}`}
      className="relative w-full py-24 md:py-36 overflow-hidden select-none transition-colors duration-1000"
      style={{
        ...backgroundStyle,
        color: atmosphere.palette.foreground,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Optional Khat Geometric Grid Line Watermark */}
      {personality.gridOverlay && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(${metallicAccent}0f 1px, transparent 1px), linear-gradient(90deg, ${metallicAccent}0f 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      )}

      {/* Atmospheric Chiaroscuro Raking Beam & Vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay"
        style={{
          background: `linear-gradient(125deg, ${atmosphere.lighting.keyLightColor}12 0%, transparent 40%, ${atmosphere.lighting.shadowColor} 100%)`,
        }}
      />

      {/* Large Ambient Watermark Discovered in Architectural Surface */}
      <div
        className="absolute right-6 sm:right-16 top-12 md:top-16 pointer-events-none select-none opacity-[0.022] md:opacity-[0.032] mono-spec text-4xl sm:text-6xl md:text-8xl tracking-[0.18em] uppercase font-light truncate max-w-full mix-blend-overlay"
        style={{ color: metallicAccent }}
      >
        {personality.textureWatermark || saree.code}
      </div>

      <div className="relative z-10 w-full max-w-[var(--max-content-width)] mx-auto px-6 md:px-14 lg:px-20">
        
        {/* ====================================================================
            CHAMBER HEADER: Asymmetrically Varied by Textile Personality
            ==================================================================== */}
        <header
          className={`mb-12 md:mb-16 ${
            personality.headerAlignment === 'centered'
              ? 'text-center max-w-3xl mx-auto'
              : personality.headerAlignment === 'asymmetric-split'
              ? 'flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6'
              : 'space-y-3 max-w-2xl'
          }`}
        >
          <div className="space-y-2">
            <div
              className={`flex items-center gap-3 mono-spec text-[10px] ${
                personality.headerAlignment === 'centered' ? 'justify-center' : ''
              }`}
            >
              <span
                className="tracking-[0.3em] uppercase font-medium"
                style={{ color: metallicAccent }}
              >
                {saree.workNumber || `WORK ${String(saree.number).padStart(2, '0')}`} {'//'} {saree.code}
              </span>
              <span className="opacity-30">&middot;</span>
              <span className="text-white/40 tracking-[0.18em] uppercase">
                {atmosphere.editorial.mood.replace('-', ' ')}
              </span>
            </div>

            <h3 className="display-lg md:text-5xl lg:text-6xl font-normal tracking-[0.02em] text-white">
              {saree.name}
            </h3>

            <p className="caption-tracked text-xs md:text-sm text-white/60 tracking-[0.18em]">
              {saree.lineage}
            </p>
          </div>

          {/* Curatorial Spec Docket (Museum Nomenclature Registry) */}
          <div
            className={`space-y-1.5 pt-2 ${
              personality.headerAlignment === 'centered'
                ? 'flex flex-wrap items-center justify-center gap-4 text-center'
                : 'md:text-right'
            }`}
          >
            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 mono-spec text-[10px] text-white/70 ${
                personality.headerAlignment === 'centered' ? 'justify-center' : 'md:justify-end'
              }`}
            >
              <span className="text-white/90">{saree.field || saree.weightHand}</span>
              <span className="opacity-30">&middot;</span>
              <span style={{ color: metallicAccent }}>
                {saree.metallicVocabulary || atmosphere.editorial.metallicIdentity || saree.primaryZari}
              </span>
              <span className="opacity-30">&middot;</span>
              <span className="text-white/60">{saree.structuralLogic || saree.textileFamily}</span>
            </div>

            <div
              className={`mono-spec text-[9px] tracking-[0.2em] uppercase flex items-center gap-2 text-white/40 ${
                personality.headerAlignment === 'centered' ? 'justify-center' : 'md:justify-end'
              }`}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: metallicAccent }}
              />
              <span>CONTINUOUS TEXTILE GLIDE &rarr;</span>
            </div>
          </div>
        </header>

        {/* ====================================================================
            THE CONTINUOUS TEXTILE APERTURE
            The photographic plates glide physically through the lit chamber frame.
            Supports direct tactile dragging (DRAG = TOUCH) and overdamped settling (REST = BREATHING).
            ==================================================================== */}
        <div
          className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Subtle Lateral Vignette Gradients framing the aperture */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[rgba(0,0,0,0.5)] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[rgba(0,0,0,0.5)] to-transparent z-20 pointer-events-none" />

          <div
            ref={trackRef}
            className="flex items-start will-change-transform py-3"
            style={{
              transform: `translate3d(-${pixelOffset}px, 0, 0)`,
              transition: isPointerDown
                ? 'none'
                : 'transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)',
            }}
          >
            {plates.map((item, pIdx) => {
              const isLead = pIdx === 0;
              const cardAspect = isLead
                ? personality.leadPlateAspect
                : pIdx % 2 === 0
                ? 'aspect-[3/4]'
                : 'aspect-[4/5]';

              return (
                <div
                  key={item.key}
                  onClick={() => {
                    if (!hasDraggedRef.current) {
                      onExamine(saree, item.key);
                    }
                  }}
                  className={`group relative flex-shrink-0 cursor-pointer transition-all duration-700 ${
                    isMobile
                      ? 'w-[78vw] mr-[4.5vw]'
                      : 'w-[31vw] lg:w-[28.5vw] mr-[2.2vw]'
                  }`}
                >
                  {/* Textile Image Mount with Raking Light Hairline */}
                  <div
                    className={`relative w-full ${cardAspect} overflow-hidden rounded-[1px] border bg-[#0d0c0a] transition-all duration-700 border-white/10 group-hover:border-[var(--hover-accent)] shadow-[0_20px_50px_rgba(0,0,0,0.7)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.9)]`}
                    style={
                      {
                        '--hover-accent': metallicAccent,
                      } as React.CSSProperties
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.asset.src}
                      alt={`${saree.name} — ${item.asset.caption}`}
                      loading="lazy"
                      className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.05] transition-all duration-1000 group-hover:scale-[1.03] group-hover:brightness-[1.0]"
                    />

                    {/* Gradient Overlay for Grounding */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none" />

                    {/* Top Plate Index Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 mono-spec text-[8.5px] px-2 py-0.5 rounded-[1px] bg-black/70 backdrop-blur-md border border-white/10 text-white/90">
                      <span style={{ color: metallicAccent }}>{item.number}</span>
                      <span className="opacity-30">/</span>
                      <span className="uppercase tracking-[0.16em]">
                        {item.asset.movementTag || item.key}
                      </span>
                    </div>

                    {/* Hover Inspection Prompt */}
                    <div
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mono-spec text-[8.5px] px-2.5 py-1 rounded-[1px] bg-black/90 backdrop-blur-md border tracking-[0.18em] uppercase"
                      style={{
                        borderColor: metallicAccent,
                        color: metallicAccent,
                      }}
                    >
                      EXAMINE &nearr;
                    </div>
                  </div>

                  {/* Restrained Caption Placard Below Each Plate */}
                  <div className="mt-3 space-y-1 px-0.5 pointer-events-none">
                    <div className="flex items-baseline justify-between text-[10px] sm:text-[9.5px] mono-spec text-white/90">
                      <span className="truncate pr-2 font-light">
                        {item.asset.caption}
                      </span>
                    </div>
                    <p className="caption-tracked text-[9px] sm:text-[8.5px] text-white/60 tracking-[0.14em] line-clamp-1">
                      {item.asset.metadata}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            CHAMBER TERMINUS: Minimalist Traveling Thread
            ==================================================================== */}
        <div className="mt-10 pt-5 border-t border-white/5 flex items-center justify-between text-[9px] mono-spec text-white/40">
          <div className="flex items-center gap-3">
            <span className="tracking-[0.22em] uppercase">
              STUDY {String(index + 1).padStart(2, '0')} OF {String(totalWorlds).padStart(2, '0')}
            </span>
            <span className="opacity-30">&middot;</span>
            <span className="italic text-white/50">{atmosphere.editorial.tagline}</span>
          </div>

          {/* Traveling Hairline Indicator */}
          <div className="w-32 sm:w-44 h-[1.5px] bg-white/10 overflow-hidden relative rounded-full">
            <div
              className="absolute left-0 top-0 bottom-0 transition-all duration-300 ease-out"
              style={{
                backgroundColor: metallicAccent,
                width: maxScrollWidth > 0
                  ? `${Math.min(100, Math.max(8, (pixelOffset / maxScrollWidth) * 100))}%`
                  : '8%',
              }}
            />
          </div>
        </div>

      </div>
    </article>
  );
};
